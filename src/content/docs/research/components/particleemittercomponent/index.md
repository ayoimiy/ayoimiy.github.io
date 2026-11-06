---
title: ParticleEmitterComponent
description: 负责控制粒子发射、粒子外观与发射行为。
status: wip
updated: 2026.10.21
gameVersion: 当前正式版
kind: component
category: 粒子
tags:
  - 组件
  - 粒子
---
> 该组件与效果粒子相关，类似光石之类的效果可以由这个组件来进行操控


## 发射频率
|               字段               |     含义      | 取值  |
| :----------------------------: | :---------: | --- |
|          `count_min`           |  每次发射的最小数量  |     |
|          `count_max`           |  每次发射的最大数量  |     |
| `emission_interval_min_frames` | 两次发射之间的最小帧数 |     |
| `emission_interval_max_frames` | 两次发射之间的最大帧数 |     |
|         `lifetime_min`         |  单个粒子的最小寿命  |     |
|         `lifetime_max`         |  单个粒子的最大寿命  |     |


## 速度与位置

|         字段         |    含义    |
| :----------------: | :------: |
|    `x_vel_min`     | 水平初速度最小值 |
|    `x_vel_max`     | 水平初速度最大值 |
|    `y_vel_min`     | 竖直初速度最小值 |
|    `y_vel_max`     | 竖直初速度最大值 |
|    `gravity.x`     | 粒子x方向加速度 |
|    `gravity.y`     | 粒子y方向加速度 |
| `x_pos_offset_min` |          |
| `x_pos_offset_max` |          |
| `y_pos_offset_min` |          |
| `y_pos_offset_max` |          |
## 动画

|                   字段                   | 含义  |
| :------------------------------------: | :-: |
|         `image_animation_file`         |     |
| `image_animation_raytrace_from_center` |     |
|        `image_animation_speed`         |     |
|         `image_animation_loop`         |     |





## 杂项
|            字段            |            含义             |
| :----------------------: | :-----------------------: |
| `area_circle_radius.min` |             ?             |
| `area_circle_radius.max` |             ?             |
|   `collide_with_grid`    |       装饰粒子能否与地形碰撞？        |
| `fade_based_on_lifetime` |      是否按粒子寿命进行调整透明度？      |
|     `render_on_grid`     |         是否对齐像素网格？         |
|   `render_ultrabright`   | 在粒子的周围增加一圈光效，亮度会遮过粒子本身的亮度 |
| `cosmetic_force_create`  |             ？             |
|      `is_emitting`       |        控制组件是否发射粒子         |

## 一些测试

- 在设定偏移量为0的时候，该组件可以发射一组射线，方向可以由速度控制，而轨迹
 - 点状的粒子适合做清晰的特效，而带有光效的粒子适合做朦胧的光效
 - 
