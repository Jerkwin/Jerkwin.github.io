---
title: 类别
layout: page
---

<span>
{% for cat in site.categories %}
<a href="#{{ cat[0] }}" rel="{{ cat[1].size }}">{{ cat[0] }}<sup style="color:#07e">{{ cat[1].size }}</sup></a>&nbsp;&nbsp;&nbsp;
{% endfor %}
</span>

<hr>

<ul class="listing">
{% for cat in site.categories %}
  <li class="listing-seperator" id="{{ cat[0] }}">{{ cat[0] }}<sup style="color:#07e">{{ cat[1].size }}</sup></li>
{% for post in cat[1] %}
  <li class="listing-item">
  <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  <a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
{% endfor %}
</ul>
