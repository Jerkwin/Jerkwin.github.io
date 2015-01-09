---
 layout: post
 title: gnuplot作图时插入LaTex公式
 categories:
 - 科
 tags:
 - gnuplot
 - mathjax
---

## 2015-01-04 16:20:48

马欢曾在一篇[博文](http://blog.sciencenet.cn/blog-373392-500657.html)讲过作法, 但我想最终存为png格式的图片, 所以实验了几种不同的作法.

gnuplot的终端可以直接输出LaTex文件, 其中文字和画图部分是分离的. 有了tex文件后, 可以采用下面的方法转成png图片.

1. 利用`latex`转成dvi文件, 然后利用`dvipng`转成png
2. 利用`pdflatex`转成pdf文件, 再利用下面方法的一种转成png
	- `conbvert`
	- `gs`
	- `pdftocairo`
	- `pdftoppm`
	- `pdftoppm|pnmtopng`

根据我的测试, 采用第二种方法的最后一个命令, 速度最快.

![Fig. 1](/pic/erf.png)

另外, 利用gnuplot的svg终端, 再利用mathjax也可以实现. 详细的作法可以参考下面的资料.

### 网络资料
- [How to Include MathJax Equations in SVG With Less Than 100 Lines of JavaScript!](http://www.embeddedrelated.com/showarticle/599.php)
- [Mathjax not rendering in an SVG file](https://github.com/mathjax/MathJax/issues/394)
- [Compile a LaTeX document into a PNG image that's as short as possible](http://tex.stackexchange.com/questions/11866/compile-a-latex-document-into-a-png-image-thats-as-short-as-possible)


