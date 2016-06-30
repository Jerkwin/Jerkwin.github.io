---
layout: default
title: 标签
---
<!--
{% capture tagString %}{% for tag in site.tags %}{{ tag[0] }}{{','}}{% endfor %}{% endcapture %}
{% assign tags = tagString | downcase | split:',' | sort %}
<div>
{% for tag in site.tags %}
{% assign number = site.tags[tag].size %}
<a class="tagbox" href="#{{ tag }}" rel="{{ number }}">{{ tag }}<span>{{ number }}</span></a>
{% endfor %}
</div>
-->

<div>
{% for tag in site.tags %}
<a class="tagbox" href="#{{ tag[0] }}" rel="{{ tags[1].size }}">{{ tag[0] }}<span>{{ tags[1].size }}</span></a>
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
