---
 layout: post
 title: Javascript版本的Markdown
 categories: 
 - 科
 tags:
 - markdown
---

## 2014-04-01 12:48:40

最近几天折腾了下js版本的markdown实现, 本来的想要实现的功能是不依赖于外部程序, 直接使用浏览器来解析渲染markdown文件. 
目前来说, 这是最简单可行的跨平台方案. js版本的markdown解析程序很多, 到[GitHub](https://github.com/)上搜索一下markdown, 
js的实现数目远远超过其他的. 这些实现有好有差, 我没有时间一一查看, 主要试用了下面的几个:

* chjj的[marked](https://github.com/chjj/marked/): 星级很高, 速度也很好

* Jakwings的[Strictdown](https://github.com/jakwings/strictdown/): 扩展更多, 语言更严格些, 尚不成熟

* dnordstrom的[parseMarkdown](https://github.com/dnordstrom/parseMarkdown.js): 最简单的实现, 可作为扩展的起点

这些实现, 大部分是基于Node.js的, 在浏览器中使用的话, 需要添加相应的脚本, 也可以通过修改js源码实现.
下面是修改marked.js使其支持浏览器直接使用的方法.

在其最后添加如下代码

<pre class="line-numbers" data-start="0"><code class="language-javascript"># Language: javascript
document.addEventListener('DOMContentLoaded', function() {
var input = document.getElementById('main');
input.innerHTML=marked(input.innerHTML);
input.innerHTML=marked(input.innerHTML);
}, false);
</code></pre>

在html文件中, 将markdown代码插入 `\<div id="main"> \</div>` 之中.

其他的也可类似修改实现.

虽然最终我基本实现了想要的功能, 可实际使用中发现, 对少量文本这些代码问题都不大, 一旦文本很大, 基于js的解析代码速度明显就不行了.

**参考资料**

1. [调用Javascript获取div内容](http://www.bitscn.com/school/HTMLCSS/201009/190580.html/)
2. [Strictdown标记语言语法（草稿）](http://blog.likelikeslike.com/posts/2014-02-16/syntax-strictdown-draft.html)
3. [使用javascript读写本地文件的方法](http://blog.csdn.net/huaweidong2011/article/details/17271067)
4. [JavaScript本地文件读写](http://hyan.iteye.com/blog/1954388)
5. [使用 HTML5 File API 实现客户端 log](http://www.ibm.com/developerworks/cn/web/1210_jiangjj_html5log/)
6. [通过 File API 使用 JavaScript 读取文件](http://www.html5rocks.com/zh/tutorials/file/dndfiles/)
7. [How to execute shell command in Java script](http://stackoverflow.com/questions/1880198/how-to-execute-shell-command-in-java-script)
8. [JavaScript and the SHELL Command](http://www.itjungle.com/mpo/mpo052302-story01.html)
9. [js的输入输出的相关操作说明举例](http://duguyiren3476.iteye.com/blog/1858713)
0. [javascript 文档加载后根据标题动态生成目录](http://www.cnblogs.com/qiudeqing/p/3229583.html)
1. [js控制div层的显示跟随滚动条滚动而滚动](http://blog.csdn.net/chenghui0317/article/details/9004716)
2. [层跟随滚动条下拉, 向下移动效果](http://bbs.blueidea.com/thread-3050350-1-1.html)
3. [JavaScript仿淘宝智能浮动——侧栏跟随](http://www.fengwensheng.com/article/1200.html)
