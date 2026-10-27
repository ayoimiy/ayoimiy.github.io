---
title: Entity
description: 实体库
status: wip
updated: 2026.11.01
gameVersion: 当前正式版
tags:
  - 索引
  - mod
---
> 目前实体库主要是由两个部分构成，一个是`Base`类，一个是`Component`类。
> 前者作为所有实体共有的类，然后通过继承来划分不同种类，后者则是直接通过属性进行访问，以获得更好的体验。


## 结构


| 类名       | 作用  | 父类  |
| -------- | --- | --- |
| `Player` | 我   | 我   |
| `Animal` |     |     |
| `Wand`   |     |     |
| `Perk`   |     |     |

