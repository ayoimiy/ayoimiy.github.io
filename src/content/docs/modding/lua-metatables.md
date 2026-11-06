---
title: 元表与面向对象
description: 用 __index / __newindex 和元表实现类、构造函数与继承。
status: wip
updated: 2026.11.06
gameVersion: 当前正式版
tags: [Lua, 元表, 面向对象]
---

> 从旧博客迁移，原发布于 2026-05-20。

Lua 的面向对象可以依靠表和元表方法实现，从而获得面向对象的某些优势。

## 类的建立

元表方法被称为"方法"，也许和它们大部分的值是函数类型有关。这里用到两类元表方法：

- `__index`
- `__newindex`

它们也可以赋值为一张表，例如：

```lua
local A = {}
A.__index = A
```

再让 `A` 作为另一张表的元表：

```lua
local B = setmetatable({}, A)
```

此时访问 `B` 中不存在的键就会去 `A` 里查找，即 `B.key --> A.key`，可以把 `B` 看成 `A` 类的一个对象。

之后就可以给"类 `A`"添加更多东西。

### 构造函数

构造函数有两种实现方式。

第一种，显式地用 `:new()`：

```lua
function A:new()
	local obj = setmetatable({}, A)
	...
	return obj
end
```

第二种，给类本身加 `__call`：

```lua
setmetatable(A, {
	__call = function (self, ...)
		local obj = setmetatable({}, self)
		...
		return obj
	end
})
```

调用方式变成 `local obj = A(...)`。C++、Java、C# 这些语言基本上也是用类名调用构造，所以第二种更眼熟；缺点是要多定义一张元表，因此无继承的简单场景更适合第一种。

## 继承

继承与构造类不同。如果简单地把父类设为子类的元表，会出现一个问题：子类和父类对象共用一套元表方法。

以 `__call` 为例，假如子类要用它做构造函数，父类的对象也能调用 `local a = obj(...)`。再比如 `__newindex`，如果子类保留某些静态属性，键访问错误时错误可能沿着父类的 `__newindex` 往上传递。

所以继承时子类的元表不能直接指向父类，而是新建一张表，通过 `__index` 访问父类的方法：

```lua
local classA = {}

local classB = setmetatable({}, {
	__index = classA,
})
```

这样修改子类的元表方法时不会影响父类实例。

## 抽出一个 class 函数

做完上面的工作会发现：其他语言的构造函数里，"返回对象"是隐式的，构造函数只负责初始化字段。

可以把这段逻辑抽出来单独作为一个函数（顺便简化继承）：

```lua
local function class(Base)
	local classB = setmetatable({}, {
		__index = Base or nil,
		__call = function (...)
			local obj = setmetatable({}, classB)
			obj:init()
			return obj
		end
	})
	classB.__index = classB
	return classB
end
```

这样只需要在 `init()` 里初始化字段，不用再写返回对象。
