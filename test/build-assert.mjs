#!/usr/bin/env node
// Build the exampleSite with Hugo and assert that each widget page emits the
// correct FastComments loader (script src + window global + container id /
// selector + config). Exits non-zero on any failure.
//
// Usage:  node test/build-assert.mjs
// Env:    HUGO_BIN (path to the hugo binary, default: hugo on PATH)

import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const exampleSite = join(repoRoot, 'exampleSite');
const hugoBin = process.env.HUGO_BIN || 'hugo';
const outDir = mkdtempSync(join(tmpdir(), 'fc-hugo-out-'));

// Expectations per built page. `mustInclude` = substrings that must appear in
// the page HTML; `idRe` = container id pattern (omitted for selector widgets).
const cdn = 'cdn.fastcomments.com/js';
// idRe asserts the *literal, unescaped* opening tag (with `<`), so a dynamic-tag
// escaping regression (&lt;div) fails rather than silently matching the id attr.
const cases = [
  { path: 'comments', mustInclude: [`${cdn}/embed-v2.min.js`, 'window.FastCommentsUI(', '"tenantId":"demo"'], idRe: /<div id="fc-[0-9a-f]{8}">/ },
  { path: 'comment-count', mustInclude: [`${cdn}/widget-comment-count.min.js`, 'window.FastCommentsCommentCount(', '"tenantId":"demo"'], idRe: /<span id="fc-count-[0-9a-f]{8}">/ },
  { path: 'live-chat', mustInclude: [`${cdn}/embed-live-chat.min.js`, 'window.FastCommentsLiveChat(', '"tenantId":"demo"'], idRe: /<div id="fc-live-chat-[0-9a-f]{8}">/ },
  { path: 'recent-comments', mustInclude: [`${cdn}/widget-recent-comments-v2.min.js`, 'window.FastCommentsRecentCommentsV2(', '"tenantId":"demo"'], idRe: /<div id="fc-recent-comments-[0-9a-f]{8}">/ },
  { path: 'recent-discussions', mustInclude: [`${cdn}/widget-recent-discussions-v2.min.js`, 'window.FastCommentsRecentDiscussionsV2(', '"tenantId":"demo"'], idRe: /<div id="fc-recent-discussions-[0-9a-f]{8}">/ },
  { path: 'top-pages', mustInclude: [`${cdn}/widget-top-pages-v2.min.js`, 'window.FastCommentsTopPagesV2(', '"tenantId":"demo"'], idRe: /<div id="fc-top-pages-[0-9a-f]{8}">/ },
  { path: 'reviews-summary', mustInclude: [`${cdn}/embed-reviews-summary.min.js`, 'window.FastCommentsReviewsSummaryWidget(', '"tenantId":"demo"'], idRe: /<div id="fc-rs-[0-9a-f]{8}">/ },
  { path: 'user-activity-feed', mustInclude: [`${cdn}/embed-user-activity.min.js`, 'window.FastCommentsUserActivity(', '"userId":"demo:demo-user"'], idRe: /<div id="fc-activity-[0-9a-f]{8}">/ },
  { path: 'collab-chat', mustInclude: [`${cdn}/embed-collab-chat.min.js`, 'window.FastCommentsCollabChat(', 'var target="#post-body"'] },
  { path: 'image-chat', mustInclude: [`${cdn}/embed-image-chat.min.js`, 'window.FastCommentsImageChat(', 'var target="#hero"'] },
  { path: 'eu', mustInclude: ['cdn-eu.fastcomments.com/js/embed-v2.min.js', 'window.FastCommentsUI('] },
  // Home/list page demonstrates the bulk count widget: one init + per-item markers.
  { path: '', label: 'home (bulk-count)', mustInclude: [`${cdn}/widget-comment-count-bulk.min.js`, 'window.FastCommentsCommentCountBulk(', 'class="fast-comments-count" data-fast-comments-url-id='] },
];

function build() {
  execFileSync(hugoBin, ['--source', exampleSite, '--destination', outDir, '--cleanDestinationDir'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: process.env,
  });
}

function run() {
  console.log(`[build-assert] hugo=${hugoBin}`);
  build();
  let failures = 0;
  for (const c of cases) {
    const name = c.label || c.path;
    const file = join(outDir, c.path, 'index.html');
    let html;
    try {
      html = readFileSync(file, 'utf8');
    } catch {
      console.error(`FAIL ${name}: page not generated (${file})`);
      failures++;
      continue;
    }
    const missing = c.mustInclude.filter((s) => !html.includes(s));
    const idOk = !c.idRe || c.idRe.test(html);
    if (missing.length === 0 && idOk) {
      console.log(`PASS ${name}`);
    } else {
      failures++;
      if (missing.length) console.error(`FAIL ${name}: missing ${JSON.stringify(missing)}`);
      if (!idOk) console.error(`FAIL ${name}: container id pattern ${c.idRe} not found`);
    }
  }
  rmSync(outDir, { recursive: true, force: true });
  console.log(`\n[build-assert] ${cases.length - failures}/${cases.length} pages passed`);
  if (failures) process.exit(1);
}

run();
