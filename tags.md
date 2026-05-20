---
layout: single
title: "文章标签"
permalink: /tags/
toc: false
author_profile: true
---

<div class="taxonomy-grid">
{% assign sorted_tags = site.tags | sort %}
{% for tag in sorted_tags %}
  {% assign tag_name = tag[0] %}
  {% assign tag_posts = tag[1] %}
  <a href="/tags/{{ tag_name | slugify }}/" class="taxonomy-card">
    <span class="taxonomy-card__name">{{ tag_name }}</span>
    <span class="taxonomy-card__count">{{ tag_posts | size }} 篇文章</span>
  </a>
{% endfor %}
</div>
