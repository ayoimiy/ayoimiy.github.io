---
layout: single
title: DamageModel组件
date: 2026-06-14
last_modified_at:
excerpt: 这是文章的简短摘要
categories:
  - 随笔
tags:
  - noita
  - Component
toc: true
author_profile: true
comments: false
share: false
---
### DamageModelComponent
这个组件主要与生物的生命值系统相关，定义了各种与伤害有关的变量类型。当血量归0时候，拥有组件的实体将进入**死亡**过程。

注：所有默认值以玩家为准。
- 所有伤害、血量均需乘以`25`，才能转化为游戏内数值

#### 生命值与暴击抗性

| 字段名                          | 简介                         | 数据类型     | 默认值 |
| ---------------------------- | -------------------------- | -------- | --- |
| `hp`                         | 当前生命值                      | `double` | `1` |
| `max_hp`                     | 最大生命值（加载时设定）               | `double` | `0` |
| `max_hp_cap`                 | max_hp的上限（≤0表示无上限，用于玻璃大炮等） | `double` | `0` |
| `max_hp_old`                 | 用于UI渲染的旧hp值                | `double` | `0` |
| `critical_damage_resistance` | 暴击抗性：0=全额暴击伤害，1=免疫暴击额外伤害   | `float`  | `0` |
| `invincibility_frames`       | >0时不受伤害（无敌帧）               | `int`    | `0` |


#### 摔落伤害(`falling_damage`)

| 字段名                          | 简介           | 数据类型    | 默认值     |
| ---------------------------- | ------------ | ------- | ------- |
| `falling_damages`            | 是否开启摔落伤害     | `bool`  | `false` |
| `falling_damage_height_min`  | 收到伤害的最小高度    | `float` | `70`    |
| `falling_damage_height_max`  | 最大高度(推测为像素)  | `float` | `250`   |
| `falling_damage_damage_min`  | 与最小高度对应的最小伤害 | `float` | `0.1`   |
| `falling_damage_damage_max ` | 最大伤害         | `float` | `1.2`   |
猜测可能是线性插值。

#### 窒息与水/潮湿

| 字段名                              | 简介                                      | 数据类型    | 默认值    |
| ------------------------------------ | ----------------------------------------- | ----------- | --------- |
| `air_needed`                         | 是否需要呼吸，能否因窒息受伤              | `bool`      | `true`    |
| `air_in_lungs`                       | 当前肺中空气量                            | `float`     | `7`       |
| `air_in_lungs_max`                   | 最大氧气量(推测单位为秒)                  | `float`     | `7`       |
| `air_lack_of_damage`                 | 窒息时的伤害(推测为秒伤)                  | `float`     | `0.6`     |
| `wet_status_effect_damage`           | 处于"潮湿"状态时每10帧受到的伤害          | `float`     | `0`       |
| `in_liquid_shooting_electrify_prob`  | 水下射击时电击水体的概率(%)               | `int`       | `0`       |
- 当`max`值小于`air_in_lungs`，`air_in_lungs`会减小，但不会显示氧气条，直到其小于`max`，进而变得正常。

#### 材料伤害

| 字段名                                      | 简介                                  | 数据类型     | 默认值     |
| ---------------------------------------- | ----------------------------------- | -------- | ------- |
| `materials_damage`                       | 是否受到材料伤害                            | `bool`   | `true`  |
| `material_damage_min_cell_count`         | 只有当前帧接触的伤害材料格子数≥此值才生效               | `int`    | `4`     |
| `materials_that_damage`                  | 造成伤害的材料列表，逗号分隔（如 acid, fire, smoke） | `string` | `acid`  |
| `materials_how_much_damage`              | 对应上述每种材料的伤害数值，逗号分隔                  | `string` | `0.1`   |
| `materials_damage_proportional_to_maxhp` | 材料伤害是否按最大生命值比例计算                    | `bool`   | `false` |
| `materials_create_messages`              | 与某些材料碰撞时是否产生消息                      | `bool`   | `false` |
| `materials_that_create_messages`         | 产生 CollisionWithCell 消息的材料列表        | `string` | `meat`  |

#### 火焰

| 字段名                          | 简介                            | 数据类型    | 默认值     |
| -------------------------------- | ------------------------------- | ----------- | ---------- |
| `is_on_fire`                     | 当前是否着火                    | `bool`      | `false`    |
| `fire_probability_of_ignition`   | 被点燃的概率（0=永不点燃）      | `float`     | `0.5`      |
| `fire_how_much_fire_generates`   | 每帧产生的火焰粒子数量          | `int`       | `4`        |
| `fire_damage_ignited_amount`     | 被点燃状态造成的持续伤害        | `float`     | `0.0003`   |
| `fire_damage_amount`             | 火焰直接造成的伤害              | `float`     | `0.2`      |

#### 击退与物理碰撞

| 字段名                    | 简介                      | 数据类型    | 默认值    |
| -------------------------- | ------------------------- | ----------- | --------- |
| `minimum_knockback_force`  | 触发击退所需的最小力      | `float`     | `0`       |
| `physics_objects_damage`   | 是否受到物理物体碰撞伤害  | `bool`      | `false`   |

#### 血液与粒子效果

| 字段名                                | 简介                    | 数据类型     | 默认值            |
| ---------------------------------- | --------------------- | -------- | -------------- |
| `blood_material`                   | 受伤时飞溅的血液材质            | `string` | `blood_fading` |
| `blood_spray_material`             | 死亡时喷溅的血液材质            | `string` | (空)            |
| `blood_spray_create_some_cosmetic` | 是否强制部分血雾为装饰性（减少污染）    | `bool`   | `false`        |
| `blood_multiplier`                 | 出血量倍率                 | `float`  | `1`            |
| `ragdoll_blood_amount_absolute`    | >-1时指定布娃娃粒子发射器共享的绝对血量 | `int`    | `-1`           |
| `blood_sprite_directional`         | 受伤时生成的定向血迹精灵（如喷血方向）   | `string` | (空)            |
| `blood_sprite_large`               | 受爆炸/重击时生成的大型血迹精灵      | `string` | (空)            |
| `healing_particle_effect_entity`   | 被治疗时加载的子实体（粒子效果）      | `string` | (空)            |

#### 布娃娃与死亡

| 字段名                               | 简介                                     | 数据类型     | 默认值                               |
| --------------------------------- | -------------------------------------- | -------- | --------------------------------- |
| `create_ragdoll`                  | 死亡时是否生成布娃娃                             | `bool`   | `true`                            |
| `ragdoll_filenames_file`          | 布娃娃配置文件名                               | `string` | `data/temp/ragdoll/filenames.txt` |
| `ragdoll_material`                | 布娃娃的物理材质                               | `string` | `meat`                            |
| `ragdoll_offset_x`                | 布娃娃生成位置相对于实体的X偏移                       | `float`  | `0`                               |
| `ragdoll_offset_y`                | 布娃娃生成位置相对于实体的Y偏移                       | `float`  | `0`                               |
| `ragdollify_child_entity_sprites` | 是否将子实体精灵也生成布娃娃                         | `bool`   | `false`                           |
| `ragdollify_root_angular_damping` | 首个布娃娃刚体的角阻尼（需ragdoll_filenames_file为空） | `float`  | `0`                               |
| `ragdollify_disintegrate_nonroot` | 是否将非根实体的精灵粉碎而非转为物理体                    | `bool`   | `false`                           |
| `wait_for_kill_flag_on_death`     | 是否等到 kill=1 才执行死亡逻辑                    | `bool`   | `false`                           |
| `kill_now`                        | 是否等到 kill_now=1 才执行死亡逻辑                | `bool`   | `false`                           |
| `drop_items_on_death`             | 死亡时是否掉落物品/技能                           | `bool`   | `true`                            |

#### UI 与伤害效果

| 字段名                      | 简介              | 数据类型               | 默认值     |
| ------------------------ | --------------- | ------------------ | ------- |
| `ui_report_damage`       | 是否显示伤害数字        | `bool`             | `true`  |
| `ui_force_report_damage` | 即使玩家关闭伤害数字设置也显示 | `bool`             | `false` |
| `ragdoll_fx_forced`      | 强制使用的布娃娃特效类型    | `RAGDOLL_FX::Enum` | —       |


#### 承伤倍率
需要通过`ComponentObjectGet/SetValue`来读取的类型，字段为`damage_multipliers`，包含以下伤害类型：

|      字段名      |             简介              |  数据类型   |
| :-----------: | :-------------------------: | :-----: |
|    `melee`    |           近战伤害倍率            | `float` |
| `projectile`  |           投射物伤害倍率           | `float` |
|  `explosion`  |           爆炸伤害倍率            | `float` |
| `electricity` | 电击伤害倍率（电击眩晕：rand[0-1] < 此值） | `float` |
|    `fire`     |           火焰伤害倍率            | `float` |
|    `drill`    |           穿凿伤害倍率            | `float` |
|    `slice`    |           切割伤害倍率            | `float` |
|     `ice`     | 冰冻伤害倍率（冰冻眩晕：rand[0-1] < 此值） | `float` |
|   `healing`   |     治疗倍率（负伤害，应以负数形式传入）      | `float` |
| `physics_hit` |         物理物体撞击伤害倍率          | `float` |
| `radioactive` |           绿毒伤害倍率            | `float` |
|   `poison`    |           紫毒伤害倍率            | `float` |
| `overeating`  |          过量进食伤害倍率           | `float` |
|    `curse`    |           诅咒伤害倍率            | `float` |
|    `holy`     |           神圣伤害倍率            | `float` |

