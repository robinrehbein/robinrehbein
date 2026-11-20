import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

// The footer easter egg's data route, run against the production Express server with a stand-in for
// GitHub's GraphQL API, so no test ever needs a real token or the network.

const LEVELS = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const days = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-11-${String(i + 1).padStart(2, '0')}`,
  contributionCount: i % 5 === 0 ? 0 : i,
  contributionLevel: LEVELS[i % 5],
}));
let githubDown = false;
const seen = [];
const github = createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  seen.push({ auth: req.headers.authorization, body: JSON.parse(body) });
  if (githubDown) { res.writeHead(502).end(); return; }
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
    data: { user: { contributionsCollection: { contributionCalendar: {
      totalContributions: 91,
      weeks: [{ contributionDays: days.slice(0, 7) }, { contributionDays: days.slice(7) }],
    } } } },
  }));
});

const servers = [];
async function startSite(port, env) {
  const child = spawn(process.execPath, ['server/index.ts'], {
    env: { ...process.env, GITHUB_TOKEN: '', ...env, PORT: String(port), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  servers.push(child);
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Production server exited: ${output}`);
    if (output.includes('Production server ready')) return `http://127.0.0.1:${port}`;
    await delay(50);
  }
  throw new Error(`Production server did not become ready: ${output}`);
}

let withToken, withoutToken;
before(async () => {
  github.listen(0, '127.0.0.1');
  await once(github, 'listening');
  const mock = `http://127.0.0.1:${github.address().port}/graphql`;
  [withToken, withoutToken] = await Promise.all([
    startSite(18091, { GITHUB_TOKEN: 'test-token', GITHUB_GRAPHQL_URL: mock }),
    startSite(18092, { GITHUB_GRAPHQL_URL: mock }),
  ]);
});
after(async () => {
  for (const child of servers) {
    if (child.exitCode !== null) continue;
    const exited = once(child, 'exit');
    child.kill('SIGTERM');
    await exited;
  }
  github.close();
});

test('contribution calendar is served as levelled days, without the token', async () => {
  const response = await fetch(`${withToken}/contributions.json`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.match(response.headers.get('cache-control'), /max-age=3600/);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  const text = await response.text();
  assert.ok(!text.includes('test-token'));
  const calendar = JSON.parse(text);
  assert.equal(calendar.total, 91);
  assert.equal(calendar.days.length, 14);
  assert.deepEqual(calendar.days[1], { date: '2026-11-02', count: 1, level: 1 });
  assert.deepEqual(calendar.days[4], { date: '2026-11-05', count: 4, level: 4 });
  assert.equal(seen[0].auth, 'Bearer test-token');
  assert.equal(seen[0].body.variables.login, 'robinrehbein');
});

test('a slow or failing GitHub does not take the calendar down: the cached answer stays', async () => {
  githubDown = true;
  const calls = seen.length;
  const response = await fetch(`${withToken}/contributions.json`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).total, 91);
  assert.equal(seen.length, calls, 'served from the six-hour cache, GitHub not asked again');
  githubDown = false;
});

test('without a token the route answers 503 and never calls GitHub', async () => {
  const calls = seen.length;
  const response = await fetch(`${withoutToken}/contributions.json`);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { error: 'unavailable' });
  assert.equal(seen.length, calls);
});

test('the footer still links to GitHub for everyone and the route stays out of the sitemap', async () => {
  const home = await (await fetch(`${withoutToken}/`)).text();
  assert.match(home, /href="https:\/\/github.com\/robinrehbein"/);
  const sitemap = await (await fetch(`${withoutToken}/sitemap.xml`)).text();
  assert.ok(!sitemap.includes('contributions'));
});

test('no browser bundle contains the GitHub token variable or API address', async () => {
  const files = [];
  const walk = async dir => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (/\.(js|css|html)$/.test(entry.name)) files.push(path);
    }
  };
  await walk('build/client');
  assert.ok(files.length > 0);
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    assert.ok(!text.includes('GITHUB_TOKEN') && !text.includes('api.github.com'), `server-only code leaked into ${file}`);
  }
});
