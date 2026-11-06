# Noita 知识库

一个使用 **Astro + Starlight** 构建的 Noita 知识库 Demo。内容方向是 **Mod 制作** 与 **个人机制研究**，最终目标是部署到 GitHub Pages。

当前版本重点验证：

- 首页与文章页的 Noita 风格视觉；
- 侧边栏、文章目录、代码块、表格、提示框；
- 中文全文搜索；
- 文章状态、游戏版本与标签字段；
- 移动端布局；
- Markdown / MDX 内容工作流。

## 技术栈

| 部分 | 方案 |
| --- | --- |
| 框架 | Astro 7 |
| 文档主题 | Starlight |
| 内容 | Markdown / MDX |
| 搜索 | Pagefind（构建时生成） |
| 样式 | 原生 CSS + Starlight CSS 变量 |
| 包管理 | npm |
| 部署目标 | GitHub Pages（`https://ayoimiy.github.io`） |

## 本地运行

需要 Node `>=22.22.0`。

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:4321/`。

构建与检查：

```bash
npm run check
npm run build
npm run preview
```

## 部署到 GitHub Pages

站点已上线：**https://ayoimiy.github.io/**，对应用户主页仓库 `ayoimiy.github.io`。部署在根路径，站内的 `/research/...` 这类链接不需要改。

之后每次 `git push` 到 `main`，[部署工作流](.github/workflows/deploy.yml) 会自动构建并发布（约 1 分钟）。

需要保持的设置：

- 仓库 **Settings → Pages → Source** 必须是 **GitHub Actions**
- 旧 Jekyll 博客的内容保存在远端 `legacy-jekyll` 分支，未删除

> 如果以后改用普通项目仓库（`ayoimiy.github.io/noita-archive/` 这种子路径），需要设置 `base` 并处理站内根路径链接；现在这种用户主页仓库不需要。

## 目录结构

```text
.
├─ astro.config.mjs          # Starlight 配置、侧边栏、组件覆盖
├─ src/
│  ├─ assets/                # 站点插画与标志
│  ├─ components/            # 首页卡片、文章标题、主题提供器
│  ├─ content/
│  │  ├─ docs/               # 知识库正文（含 log/ 日志）
│  │  └─ i18n/               # 搜索 UI 等中文文案
│  ├─ pages/                 # 站点级页面（如 /archive/ 全部条目）
│  ├─ plugins/               # Markdown / HTML AST 转换插件
│  ├─ styles/custom.css      # Noita 主题与排版
│  └─ content.config.ts      # 内容集合与 frontmatter schema
├─ public/                   # favicon 等静态资源
└─ package.json
```

## 写一篇文章

完整的增页流程（建文件 → 登记侧边栏 → 索引页 → 本地验证 → 常见错误）见 **[写作指南.md](写作指南.md)**。下面是速查版。

在 `src/content/docs/` 下新增 `.md` 或 `.mdx` 文件。常用 frontmatter：

```yaml
---
title: 文章标题
description: 一句话摘要，会显示在文章头部
status: wip
updated: 2026.10.21
gameVersion: 当前正式版
tags: [Mod, Lua]
---
```

`status` 可选值：

- `stable`：已归档
- `wip`：整理中
- `draft`：草稿

新增页面后，需要在 `astro.config.mjs` 的 `sidebar` 中添加对应条目，或改为目录自动生成。

## 已实现的设计点

- 暗色默认主题，保留浅色“羊皮纸”主题切换；
- 首页自定义 hero、卡片、最近条目与归档格言；
- 首页“最近归档”和卡片条目数从内容集合自动统计，按 `updated` 排序；
- `/archive/` 全部条目页：按分区列出所有页面，含未进侧边栏的内容；
- `/log/` 日志频道：每月一个文件，按天记录；
- 自定义 404 页面；
- 文章页自定义标题区，展示状态、版本与标签；
- 文章标题、表格、引用、代码块与提示框的统一样式；
- Markdown 表格默认铺满正文宽度，超宽表格在表格容器内横向滚动；
- 中文 Pagefind 搜索与搜索 UI 文案；
- 移动端导航与页面内目录；
- 减少动画偏好（`prefers-reduced-motion`）处理。

## 尚未完成

- [x] 设置正式 `site` URL（`https://ayoimiy.github.io`）并接入 GitHub Actions 工作流；
- [x] 在 GitHub 创建 `ayoimiy.github.io` 仓库、首次发布并接管根地址；
- [x] 迁入旧博客的 4 篇文章；
- [ ] 确定内容许可证、转载规则与素材使用边界；
- [ ] 补齐真实文章、版本号与实验数据；
- [ ] 决定评论、统计和贡献流程；
- [ ] 自定义域名（可选）；
- [ ] 压缩并整理预览截图（`preview/` 仅用于本地验收）。

## 发布前注意

站点部署在用户主页根路径（`https://ayoimiy.github.io/`），所以 Markdown 里的根路径链接（例如 `/modding/getting-started/`）可以直接用。**如果以后改成项目仓库部署（子路径），这些链接会失效**，需要设置 `base` 并统一处理，或者改用自定义域名。

Noita 的名称与游戏内容归 Nolla Games 所有。本站是非官方粉丝项目；公开部署前应确认所引用 Wiki、代码、图片与 Mod 素材的许可。
