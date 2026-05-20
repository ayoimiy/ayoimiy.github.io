---
layout: single
title: "内容分类"
permalink: /categories/
toc: false
author_profile: true
---

<div class="taxonomy-grid">
{% assign sorted_cats = site.categories | sort %}
{% for cat in sorted_cats %}
  {% assign cat_name = cat[0] %}
  {% assign cat_posts = cat[1] %}
  <a href="/categories/{{ cat_name | slugify }}/" class="taxonomy-card">
    <span class="taxonomy-card__name">{{ cat_name }}</span>
    <span class="taxonomy-card__count">{{ cat_posts | size }} 篇文章</span>
  </a>
{% endfor %}
</div>
