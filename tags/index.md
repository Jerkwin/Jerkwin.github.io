---
title: 标签
layout: page
---

<div>
{% for tag in site.tags %}
<a class="tagbox" href="#{{ tag[0] }}" rel="{{ tag[1].size }}">{{ tag[0] }}<span>{{ tag[1].size }}</span></a>
{% endfor %}
</div>
<hr>
<ul class="listing">
{% for tag in site.tags %}
  <li class="listing-seperator" id="{{ tag[0] }}">{{ tag[0] }}<sup style="color:#07e">{{ tag[1].size }}</sup></li>
{% for post in tag[1] %}
  <li class="listing-item">
  <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  <a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
{% endfor %}
</ul>

