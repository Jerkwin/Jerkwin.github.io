---
 layout: post
 title: 让Markdown支持ASCII流程图和JavaScript流程图
 categories:
 - 科
 tags:
 - markdown
 - js
---

<script src="/jscss/raphael-min.js"></script>
<script src="/jscss/flowchart-min.js"></script>

## 2014-12-25 12:08:34

计算机领域中一直存在两种不同的理念并彼此竞争, 可视化与可控化, 或称为所见即所得与所愿即所得.
前者是Windows的典型做法, 而后者是Linux的典型理念.
我却觉得, 若以中国人"惟精惟一, 允执厥中"的观念, 二者皆不可偏废, 取其中间, 所见近所得, 所愿亦可得.
也就是, 尽量直观, 同时提供方便的控制手段.
既考虑直接可读性, 也考虑易处理性, 直接可读性优先, 处理后更美观, 不处理也不很影响可读性.

以markdown为代表的书写格式正是走了这种处于Word与LaTex之间的道路. 
对于简单的流程图, ASCIIArt就是所见近所得的, 而pic之类的更易控制.
有了ASCII格式的图后, 可以利用ditta这个Java小工具将其转化为图片, 这样更美观.

虽然网络上也有一些在线的ASCII流程图作图工具, 像我以前推荐过的[ASCIIFlow](http://asciiflow.com/), 
但有时候作起复杂的图来还是很不方便, 这时候就可以使用那些更易控制的工具了.
基于JavaScript的流程图工具有不少, 用得较多的是[flowchart.js](http://adrai.github.io/flowchart.js/), 详细的请参考网络上的资料吧.

下面是几个具体的示例.

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: ASc
+---------+
|         |                        +--------------+
|   NFS   |--+                     |              |
|         |  |                 +-->|   CacheFS    |
+---------+  |   +----------+  |   |  /dev/hda5   |
             |   |          |  |   +--------------+
+---------+  +-->|          |  |
|         |      |          |--+
|   AFS   |----->| FS-Cache |
|         |      |          |--+
+---------+  +-->|          |  |
             |   |          |  |   +--------------+
+---------+  |   +----------+  |   |              |
|         |  |                 +-->|  CacheFiles  |
|  ISOFS  |--+                     |  /var/cache  |
|         |                        +--------------+
+---------+

+--------+   +-------+    +-------+
|        | --+ ditaa +--> |       |
|  Text  |   +-------+    |diagram|
|Document|   |!magic!|    |       |
|     {d}|   |       |    |       |
+---+----+   +-------+    +-------+
    :                         ^
    |       Lots of work      |
    +-------------------------+

Color codes

/----\ /----\
|c33F| |cC02|
|    | |    |
\----/ \----/
/----\ /----\
|c1FF| |c1AB|
|    | |    |
\----/ \----/

/-------------+-------------\
|cRED RED     |cBLU BLU     |
+-------------+-------------+
|cGRE GRE     |cPNK PNK     |
+-------------+-------------+
|cBLK BLK     |cYEL YEL     |
\-------------+-------------/
</code></pre>

![Fig. 1](/pic/flc-1.png)

含中文的测试, 虽然网上提到方法使ditta支持中文, 但字体有点丑, 折腾Java也没有效果.

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: aSC
             开始
               |
               v
             /-------\
             | 中文  |
             | {d}   | ---> Open
             \-------/
               |
               v
              完成 ----------->
</code></pre>

![Fig. 2](/pic/flc-2.png)


<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: ASc
              开始
               |
               v
           /--------\     否
           |  条件  |------------> 继续
           \--------/
               |
               | 是
               V
              结束
</code></pre>

![Fig. 3](/pic/flc-3.png)

js的流程图

<pre><textarea name="flc" id="flc-4" style="width:40%; height:300px">
st=>start: 开始:>http://www.google.com[blank]
e=>end:    结束:>http://www.google.com
op1=>operation: 操作
sub1=>subroutine: 子程序
cond=>condition: Yes 
or No?:>http://www.google.com
io=>inputoutput: 输入输出

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
</textarea></pre>

<figure id="fig-flc-4"><figurecaption>Fig.4</figurecaption></figure>

<pre><textarea name="flc" id="flc-5" style="width:40%; height:300px">
st=>start: 开始|past:>http://www.google.com[blank]
e=>end: 结束|future:>http://www.google.com
op1=>operation: 操作|past
op2=>operation: 操作|current
sub1=>subroutine: 子程序|invalid
cond=>condition: Yes 
or No?|approved:>http://www.google.com
c2=>condition: 好主意|rejected
io=>inputoutput: 输入输出|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
</textarea></pre>

<figure id="fig-flc-5"><figurecaption>Fig.5</figurecaption></figure>

### 网络资料

- [ditta主页](http://ditaa.sourceforge.net/)
- [利用Awk使ditaa支持日本语](http://www.johf.com/log/20130113a.html)
- [ditta的日本语化](http://d.hatena.ne.jp/tamura70/20100317/org)
- [Creating diagrams in ASCII](http://unix.stackexchange.com/questions/126630/creating-diagrams-in-ascii)
- [那些年，我追过的绘图工具](http://chuansongme.com/n/939320)
- [使用jsPlumb制作流程图设计器](http://www.cnblogs.com/lwme/p/use-jsplumb-make-flowChart-designer.html)
- [MetaPost: 强大的图形语言](http://www.math.zju.edu.cn/ligangliu/latexforum/metapost/metapost.htm)
- [使用 EMACS ORG-MODE 画图](http://www.cnblogs.com/chenfanyu/archive/2013/01/27/2878845.html)
- [使用 Graphviz 生成自动化系统图](http://www.ibm.com/developerworks/cn/aix/library/au-aix-graphviz/)
- [DOT + graphviz 轻松画图神器](http://blog.csdn.net/stormdpzh/article/details/14648827)
- [Java5/6中的字体自定义设置与美化（Linux/Windows）]( http://blog.csdn.net/autumnhealth/article/details/1791222)


