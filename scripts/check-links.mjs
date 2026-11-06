import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');

if (!fs.existsSync(dist)) {
  console.error('找不到 dist/，先运行 npm run build');
  process.exit(1);
}

/** 收集所有构建出的 HTML 页面 */
function collectHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

/** 把站内链接映射到 dist 里的实际文件；外部链接返回 null */
function resolveTarget(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  if (clean.startsWith('//')) return null;
  if (!clean.startsWith('/')) return null;

  let rel = clean.replace(/^\//, '');
  try {
    rel = decodeURIComponent(rel);
  } catch {
    // 保持原样
  }

  if (rel === '' || rel.endsWith('/')) return path.join(dist, rel, 'index.html');
  if (path.extname(rel)) return path.join(dist, rel);
  return path.join(dist, rel, 'index.html');
}

const attrPattern = /(?:href|src)="([^"]*)"/g;
const pages = collectHtml(dist);
const broken = [];
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const match of html.matchAll(attrPattern)) {
    const target = resolveTarget(match[1]);
    if (!target) continue;
    checked += 1;
    if (!fs.existsSync(target)) {
      broken.push({
        page: path.relative(dist, page).replace(/\\/g, '/'),
        href: match[1],
        expected: path.relative(dist, target).replace(/\\/g, '/'),
      });
    }
  }
}

if (broken.length === 0) {
  console.log(`站内链接检查通过：${pages.length} 个页面，${checked} 个链接`);
  process.exit(0);
}

console.error(`发现 ${broken.length} 个断链（检查了 ${pages.length} 个页面）：`);
for (const item of broken) {
  console.error(`  ${item.page}  ->  ${item.href}  (缺少 ${item.expected})`);
}
process.exit(1);
