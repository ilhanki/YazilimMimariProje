import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlPath = resolve(process.cwd(), 'dist/index.html');
const html = readFileSync(htmlPath, 'utf8');
const updated = html
  .replaceAll('src="/assets/', 'src="./assets/')
  .replaceAll('href="/assets/', 'href="./assets/');

if (html !== updated) {
  writeFileSync(htmlPath, updated, 'utf8');
}