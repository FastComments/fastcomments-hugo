#!/usr/bin/env node
// Builds the Hugo showcase for the fastcomments-demos bundle.
// --baseURL prefixes every relURL / .RelPermalink link with
// /commenting-system-for-hugo/ so the site works when served under that path
// (Hugo's equivalent of Jekyll's --baseurl / 11ty's pathPrefix). The exampleSite
// consumes the theme via a symlink (themes/fastcomments-hugo -> repo root), so
// this needs only the hugo binary, no Go toolchain.
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(ROOT, 'exampleSite');
const OUT = resolve(ROOT, 'demo-dist');
const BASEURL = '/commenting-system-for-hugo/';

const sh = (cmd, cwd = ROOT) => {
    console.log('$', cmd, `(${cwd})`);
    execSync(cmd, { stdio: 'inherit', cwd });
};

rmSync(OUT, { recursive: true, force: true });
sh(`hugo --source ${SRC} --baseURL ${BASEURL} --destination ${OUT} --cleanDestinationDir --gc`);
console.log('Built fastcomments-hugo demo at', OUT);
