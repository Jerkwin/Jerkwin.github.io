---
title: 类别
layout: page
---

<div>
{%for cat in site.categories%}<a class="tagbox" href="#{{cat[0]}}">{{cat[0]}}<span>{{cat[1].size|minus:1}}</span></a>{%endfor%}
</div>

<hr>

<ul class="listing">
{%for cat in site.categories%}<li class="listing-seperator" id="{{cat[0]}}">{{cat[0]}}<sup style="color:#07e">{{cat[1].size|minus:1}}</sup></li>{%for post in cat[1]%}{%if post.title !="标签排序"%}<li class="listing-item"><time>{{post.date|date:"%Y-%m-%d"}}</time>　<a href="{{site.url}}{{post.url}}">{{post.title}}</a></li>{%endif%}{%endfor%}{%endfor%}
</ul>
