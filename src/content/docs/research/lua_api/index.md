---
title: Lua_API
description: 对 Noita API的研究
status: wip
updated: 2026.11.01
gameVersion: 当前正式版
tags:
  - 索引
  - mod
---
> 主要是用于研究Noita Api的作用以及一些参数。


## Gui类

布局相关的：

|             名字             |    作用    |
| :------------------------: | :------: |
| `GuiLayoutBeginHorizontal` | 开始一个水平布局 |
|  `GuiLayoutBeginVertical`  | 开始一个竖直布局 |
|       `GuiLayoutEnd`       |  结束当前布局  |
> 在布局的作用域内，一个控件首先会由布局分配`x,y`，然后再加上使用 `API`时传入的`x,y`值，从而实现微调。








