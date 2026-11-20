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
  ['/', 200, 'Architect', 'Robin Rehbein — Software Engineer &amp; Web Architect in Stuttgart'],
  ['/work', 200, 'Work.', 'Work — Robin Rehbein: Projects, Apps &amp; Open Source'],
  ['/about', 200, 'Robin', 'About — Robin Rehbein, Software Engineer in Stuttgart'],
  ['/work/noah', 200, 'Banks usually only open an account', 'Noah — Co-founder'],
  ['/work/trailscape', 200, 'Crash-safe GPS recording', 'Trailscape — Tells you what to ride today'],
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
  assert.match(home, /href="https:\/\/join-noah.de"/);
  assert.match(work, /aria-label="Project index"/);
  for (const slug of ['noah', 'artwerk', 'kirchmaier']) assert.ok(work.includes(`id="${slug}"`));
  assert.match(work, /Banks usually only open an account/);
  assert.match(work, /aria-label="Noah gallery"/);
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

const ldTypes = html => [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].flatMap(m => [].concat(JSON.parse(m[1]))).map(x => x['@type']);

test('every indexable page has a canonical URL, social tags and structured data', async () => {
  const pages = { '/': 'https://robinrehbein.de', '/work': 'https://robinrehbein.de/work', '/about': 'https://robinrehbein.de/about', '/work/noah': 'https://robinrehbein.de/work/noah', '/work/birdy': 'https://robinrehbein.de/work/birdy' };
  for (const [path, canonical] of Object.entries(pages)) {
    const html = await (await fetch(`${base}${path}`)).text();
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `canonical for ${path}`);
    assert.match(html, /property="og:site_name"/);
    assert.match(html, /name="twitter:title"/);
    assert.equal((html.match(/property="og:image"/g) ?? []).length, 1, `one og:image on ${path}`);
    assert.ok(ldTypes(html).includes('Person'), `Person schema on ${path}`);
  }
});

test('project and lab pages carry their own structured data and breadcrumbs', async () => {
  const noah = ldTypes(await (await fetch(`${base}/work/noah`)).text());
  assert.ok(noah.includes('CreativeWork') && noah.includes('BreadcrumbList'));
  const lab = ldTypes(await (await fetch(`${base}/work/trailscape`)).text());
  assert.ok(lab.includes('SoftwareSourceCode') && lab.includes('BreadcrumbList'));
  const work = ldTypes(await (await fetch(`${base}/work`)).text());
  assert.ok(work.includes('CollectionPage'));
});

test('work page links to every project and lab app page', async () => {
  const work = await (await fetch(`${base}/work`)).text();
  for (const slug of ['noah', 'artwerk', 'kirchmaier', 'aundohotline', 'anahitarehbein', 'trailscape', 'drops', 'dottie', 'pocketpi', 'mephi', 'birdy', 'mini-networks']) {
    assert.ok(work.includes(`href="/work/${slug}"`), `missing link to /work/${slug}`);
  }
});

test('unknown project pages answer 404 and are not indexable', async () => {
  const response = await fetch(`${base}/work/does-not-exist`);
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /noindex/);
  assert.ok(html.includes('Nothing'));
});

test('sitemap lists the project pages with images, llms files point at them', async () => {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const slug of ['noah', 'trailscape', 'mini-networks']) assert.ok(sitemap.includes(`<loc>https://robinrehbein.de/work/${slug}</loc>`));
  assert.match(sitemap, /<image:loc>https:\/\/robinrehbein.de\/noah_landing_desktop.webp<\/image:loc>/);
  assert.ok(!sitemap.includes('imprint') && !sitemap.includes('privacy'));
  const llms = await (await fetch(`${base}/llms.txt`)).text();
  assert.ok(llms.includes('https://robinrehbein.de/work/noah') && llms.includes('llms-full.txt'));
  const full = await fetch(`${base}/llms-full.txt`);
  assert.equal(full.status, 200);
  assert.match(full.headers.get('content-type'), /^text\/markdown/);
  const text = await full.text();
  assert.ok(text.includes('Crash-safe GPS recording') && text.includes('Banks usually only open an account'));
});
