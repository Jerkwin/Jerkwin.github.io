---
layout: default
title: 标签
---

<div>
{%for tag in site.tags%}<a class="tagbox" href="#{{tag[0]}}">{{tag[0]}}<span>{{tag[1].size|minus:1}}</span></a> {%endfor%}
</div>

<hr>
<ul class="listing">
{%for tag in site.tags%}<li class="listing-seperator" id="{{tag[0]}}">{{tag[0]}}<sup style="color:#07e">{{tag[1].size|minus:1}}</sup></li>
{%for post in tag[1]%}{%if post.title !="标签排序"%}<li class="listing-item"><time>{{post.date|date:"%Y-%m-%d"}}</time><a href="{{site.url}}{{post.url}}"> {{post.title}}</a></li>{%endif%}{%endfor%}{%endfor%}
</ul>
