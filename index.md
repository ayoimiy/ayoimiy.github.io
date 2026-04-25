---
layout: default
title: 首页
---
# 欢迎来到我的算法博客
这里记录我学习的实现的各种算法？

## 最新文章

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span style="font-size:0.8em; color:#666;"> – {{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>