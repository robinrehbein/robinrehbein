import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { request } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

// Crawler-facing files, redirects for old URLs and the dev noindex, against the production Express server.
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:18084';
let server;
before(async () => {
  if (process.env.TEST_BASE_URL) return;
  server = spawn(process.execPath, ['server/index.ts'], {
    env: { ...process.env, PORT: '18084', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  server.stdout.on('data', chunk => { output += chunk; });
  server.stderr.on('data', chunk => { output += chunk; });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Production server exited: ${output}`);
    if (output.includes('Production server ready')) return;
    await delay(50);
  }
  throw new Error(`Production server did not become ready: ${output}`);
});
after(async () => {
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
});

// fetch() can't set Host, so the dev check goes through node:http.
function get(path, host) {
  return new Promise((resolve, reject) => {
    const { hostname, port } = new URL(base);
    request({ hostname, port, path, headers: host ? { host } : {} }, res => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject).end();
  });
}

test('robots.txt allows all crawlers and points to the sitemap', async () => {
  const res = await get('/robots.txt');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /^text\/plain/);
  assert.match(res.body, /User-agent: \*\nAllow: \//);
  assert.match(res.body, /Sitemap: https:\/\/robinrehbein\.de\/sitemap\.xml/);
});

test('dev host is kept out of search', async () => {
  const robots = await get('/robots.txt', 'dev.robinrehbein.de');
  assert.match(robots.body, /Disallow: \//);
  const page = await get('/', 'dev.robinrehbein.de');
  assert.equal(page.headers['x-robots-tag'], 'noindex, nofollow');
  const live = await get('/', 'robinrehbein.de');
  assert.equal(live.headers['x-robots-tag'], undefined);
});

test('sitemap lists exactly the indexable pages', async () => {
  const res = await get('/sitemap.xml');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /^application\/xml/);
  const locs = [...res.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(locs, ['https://robinrehbein.de', 'https://robinrehbein.de/work', 'https://robinrehbein.de/about']);
});

test('llms.txt summarises the site in Markdown', async () => {
  const res = await get('/llms.txt');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /^text\/markdown/);
  assert.match(res.body, /^# Robin Rehbein\n/);
  for (const text of ['## Projects', 'Noah', 'A&O Hotline', '## Side projects', 'hello@robinrehbein.de']) {
    assert.ok(res.body.includes(text), `missing: ${text}`);
  }
});

test('pages carry their own canonical and Open Graph URL', async () => {
  const html = (await get('/work')).body;
  assert.match(html, /<link rel="canonical" href="https:\/\/robinrehbein\.de\/work"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/robinrehbein\.de\/work"/);
  assert.equal((html.match(/property="og:url"/g) ?? []).length, 1);
});

const redirects = [
  ['/work/', '/work'],
  ['/about/?x=1', '/about?x=1'],
  ['//evil.example/', '/evil.example'],
  ['/blog', '/work'],
  ['/blog/some-post', '/work'],
  ['/hub', '/'],
  ['/disclaimer', '/imprint'],
  ['/impressum', '/imprint'],
  ['/datenschutz', '/privacy'],
];
for (const [from, to] of redirects) {
  test(`old URL ${from} redirects permanently to ${to}`, async () => {
    const res = await get(from);
    assert.equal(res.status, 301);
    assert.equal(res.headers.location, to);
  });
}

test('retired shop and admin URLs are gone', async () => {
  for (const path of ['/shop', '/shop/poster', '/checkout/success', '/printauftrag', '/admin/login']) {
    assert.equal((await get(path)).status, 410, path);
  }
  assert.equal((await get('/shopping')).status, 404);
});
