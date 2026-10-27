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
| 部署目标 | GitHub Pages（尚未接入） |

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

## 目录结构

```text
.
├─ astro.config.mjs          # Starlight 配置、侧边栏、组件覆盖
├─ src/
│  ├─ assets/                # 站点插画与标志
│  ├─ components/            # 首页卡片、文章标题、主题提供器
│  ├─ content/
│  │  ├─ docs/               # 知识库正文
│  │  └─ i18n/               # 搜索 UI 等中文文案
│  ├─ data/                  # 首页最近条目等结构化数据
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
- 文章页自定义标题区，展示状态、版本与标签；
- 文章标题、表格、引用、代码块与提示框的统一样式；
- Markdown 表格默认铺满正文宽度，超宽表格在表格容器内横向滚动；
- 中文 Pagefind 搜索与搜索 UI 文案；
- 移动端导航与页面内目录；
- 减少动画偏好（`prefers-reduced-motion`）处理。

## 尚未完成

- [ ] 接入 GitHub 仓库与 GitHub Pages；
- [ ] 设置正式 `site` URL、项目页 base path 与自定义域名（如需要）；
- [ ] 确定内容许可证、转载规则与素材使用边界；
- [ ] 补齐真实文章、版本号与实验数据；
- [ ] 决定评论、统计和贡献流程；
- [ ] 压缩并整理预览截图（`preview/` 仅用于本地验收）。

## 发布前注意

当前 Markdown 中的站内链接使用根路径（例如 `/modding/getting-started/`）。如果最终部署在 GitHub 项目页的子路径下，需要统一设置 `base` 并检查这些链接，或改用自定义域名部署在根路径。

Noita 的名称与游戏内容归 Nolla Games 所有。本站是非官方粉丝项目；公开部署前应确认所引用 Wiki、代码、图片与 Mod 素材的许可。
