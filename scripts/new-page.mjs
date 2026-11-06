import fs from 'node:fs';
import path from 'node:path';

const [type, slugArg, title, category] = process.argv.slice(2);

const CONTENT_DIR = 'src/content/docs';
const TEMPLATE_DIR = 'src/_templates';

const types = {
  article: {
    template: 'article.md',
    target: (slug) => `${CONTENT_DIR}/${slug}.md`,
    hint: (slug) => `记得在 astro.config.mjs 的 sidebar 里登记：{ label: '${title ?? slug}', slug: '${slug}' }`,
  },
  component: {
    template: 'component.md',
    target: (slug) => `${CONTENT_DIR}/${slug}/index.md`,
    hint: () => '不用改侧边栏：frontmatter 里的 kind/category 会让它自动出现在组件索引。',
  },
  log: {
    template: 'log.md',
    target: (slug) => `${CONTENT_DIR}/log/${slug}.md`,
    hint: (slug) => `记得把 /log/${slug}/ 加到 log/index.md 的“各月”列表里。`,
  },
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!type || !types[type]) {
  fail(`用法：npm run new -- <article|component|log> <slug> "<标题>" [分类]\n例：npm run new -- component research/components/foo "FooComponent" 粒子`);
}

if (!slugArg) fail('缺少 slug，例如 research/components/foo');

const config = types[type];
const slug = slugArg.replace(/\.md$/, '').replace(/^\/+|\/+$/g, '');
const pageTitle = title || slug.split('/').pop();
const targetPath = config.target(slug);

if (fs.existsSync(targetPath)) fail(`文件已存在：${targetPath}`);

const now = new Date();
const pad = (value) => String(value).padStart(2, '0');
const ymd = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
const md = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const templatePath = path.join(TEMPLATE_DIR, config.template);
let content = fs.readFileSync(templatePath, 'utf8');

content = content
  .replace(/\{\{title\}\}/g, pageTitle)
  .replace(/\{\{date:YYYY\.MM\.DD\}\}/g, ymd)
  .replace(/\{\{date:MM-DD\}\}/g, md);

if (type === 'component' && category) {
  content = content.replace('category: 未分类', `category: ${category}`);
}

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, content, 'utf8');

console.log(`已创建：${targetPath}`);
if (type === 'component' && !category) {
  console.log('提示：还没设置分类，把 frontmatter 里的 category 改成实际分类（如 粒子、物理、渲染）。');
}
console.log(config.hint(slug));
