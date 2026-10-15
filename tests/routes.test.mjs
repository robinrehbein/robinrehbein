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
