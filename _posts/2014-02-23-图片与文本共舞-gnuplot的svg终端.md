---
 layout: post
 title: 图片与文本共舞：gnuplot的svg终端
 categories: 
 - 科
 tags:
 - gnuplot
---

## 2014-02-23 21:29:17

在整理工作的时候, 我们经常需要在文档中插入所得数据的图像. 通常的作法是先用绘图软件(如Excel, Origin, gnuplot等)将数据做成图片(一般为eps或png格式), 再将图片插入文档中. 这种作法使得数据, 图片, 文档三者互相分离, 当数据改变时, 图片必须重新绘制后再插入文档中, 不适合快速整理数据的需要, 此外作图时的处理方法也不易保存.

目前, 我一般用Markdown整理文档, 使用gnuplot绘图, 这两者都很方便, 但图片的插入仍嫌麻烦. 查阅了一下gnuplot的文档, 发现gnuplot支持canvas和svg终端, 利用这两种终端, 可以方便地将作图输出为网页支持的形式. 其中的svg为矢量格式, 可以任意放大而不会出现马赛克现象, 更好一些. 利用svg终端, 我们就可以实现为gnuplot代码添加相应的svg图形功能. 在Markdown中直接插入gnuplot代码, gnuplot处理后自动插入所得的svg文本. 这样就省却了先作图, 再插图的过程, 文档中既保存了 gnuplot的绘图脚本, 也保存了相应的图片, 修改十分方便.

下面的代码就可以直接输出为svg图形到html文件供查看.

* 数据文件作图

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
set xl "t(ps)"; set yl"E(kJ/mol)"
plot "G:/topol~ETP.xvg" u ($1*1E-3):2 w l t"Total Energy"
</code></pre>

* 直接数据作图

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
plot "-" u 1:2 w lp lw 4 ps 2, "-" u 1:3 w lp lw 4 ps 2
1 2  6
3 5  7
5 4  5
e
1 2  6
3 5  7
5 4  5
</code></pre>
