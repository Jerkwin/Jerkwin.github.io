---
---
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>{{site.author}}</title><link href="{{site.url}}/feed/"><lastBuildDate>{{site.time|date_to_xmlschema}}</lastBuildDate><webMaster> Jerkwin</webMaster><hr>
{%for post in site.posts limit:10%}{%capture y%}{{post.date|date:"%-Y"}}{%endcapture%}{%assign y=y|plus:0%}{%if y<3000%}<item><title>{{post.title|xml_escape}}</title><link href="{{site.url}}{{post.url}}"/><pubDate>{{post.date|date_to_xmlschema}}</pubDate><author> {{site.author}} </author><guid>{{site.url}}{{post.id}}</guid><content:encoded> <![CDATA[{{post.content}}]]></content:encoded></item>{%endif%}{%endfor%}
</channel>
</rss>
