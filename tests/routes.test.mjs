import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

// Run against the production Express server, never the Vite development server.
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:18082';
let server;
before(async () => {
  if (process.env.TEST_BASE_URL) return;
  server = spawn(process.execPath, ['server/index.ts'], {
    env: { ...process.env, PORT: '18082', NODE_ENV: 'production' },
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
const cases = [
  ['/', 200, 'Architect', 'Robin Rehbein'],
  ['/work', 200, 'Work.', 'Work — Robin Rehbein'],
  ['/about', 200, 'Robin', 'About — Robin Rehbein'],
  ['/imprint', 200, 'Impressum', 'Impressum — Robin Rehbein'],
  ['/privacy', 200, 'Datenschutz', 'Datenschutz — Robin Rehbein'],
  ['/missing-migration-check', 404, 'Nothing', '404 — Robin Rehbein'],
];
for (const [path, status, content, title] of cases) {
  test(`production SSR ${path} preserves content, title and status`, async () => {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, status);
    const html = await response.text();
    assert.ok(html.includes(content), `missing SSR content: ${content}`);
    assert.match(html, /<title>[^<]*<\/title>/);
    assert.ok(html.includes(title), `missing title: ${title}`);
    assert.match(html, /id="main-content"/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
  });
}
test('portrait is served as an image at its existing URL', async () => {
  const response = await fetch(`${base}/me_square.webp`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^image\/webp/);
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
});
test('unsupported page POST preserves the portfolio error document', async () => {
  const response = await fetch(`${base}/work`, { method: 'POST' });
  assert.equal(response.status, 405);
  const html = await response.text();
  assert.match(html, /id="main-content"/);
  assert.match(html, /Something went wrong/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /href="\/privacy"/);
  assert.doesNotMatch(html, /Unexpected Application Error|\.tsx:\d+|stack trace/i);
});
test('lab projects and their assets are served', async () => {
  const html = await (await fetch(`${base}/work`)).text();
  for (const title of ['Mephi the Daemon', 'Birdy', 'Mini Networks', 'PocketPi']) {
    assert.ok(html.includes(title), `missing lab project: ${title}`);
  }
  const icon = await fetch(`${base}/lab_mephi.webp`);
  assert.equal(icon.status, 200);
  assert.match(icon.headers.get('content-type'), /^image\/webp/);
});

test('project navigation preserves full case studies and offers direct home links', async () => {
  const home = await (await fetch(`${base}/`)).text();
  const work = await (await fetch(`${base}/work`)).text();
  assert.match(home, /href="\/work#noah"/);
  assert.match(work, /aria-label="Project index"/);
  for (const slug of ['noah', 'artwerk', 'kirchmaier']) assert.ok(work.includes(`id="${slug}"`));
  assert.match(work, /Banks usually only open an account/);
  assert.match(work, /aria-label="Noah images"/);
  assert.match(work, /noah_landing_desktop.webp/);
  assert.match(work, /Open Noah image 1/);
});

test('legal sections expose language and in-page navigation', async () => {
  const privacy = await (await fetch(`${base}/privacy`)).text();
  const imprint = await (await fetch(`${base}/imprint`)).text();
  assert.match(privacy, /lang="de"/);
  assert.match(privacy, /aria-label="Auf dieser Seite"/);
  assert.match(privacy, /href="#website"/);
  assert.match(privacy, /id="pocketpi"/);
  assert.match(imprint, /lang="de"/);
});
