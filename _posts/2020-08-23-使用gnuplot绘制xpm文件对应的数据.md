---
 layout: post
 title: 使用gnuplot绘制xpm文件对应的数据
 categories:
 - 科
 tags:
 - gmx
 - gnuplot
---

- 2020-08-23 21:33:15

GROMACS分析程序给出的xpm文件虽然可以使用`xpm2ps`直接转换为eps图形文件, 但可定制性并不强, 着色效果也一般, 所以最好还是先将其转换为数据文件, 然后借助其他绘图程序来作图. 这种图一般称为填色图(colormap)或热图(heatmap). 大多数绘图程序都支持. 我一般是利用gnuplot来做这种图的, 因为批量处理的时候比较方便, 适合快速出图. 这里就做个示例, 顺便也对比下我整理的几种颜色颜色映射方案.

将xpm转换为对应的xyz数据文件, 可以使用我写的一个[脚本`xpm2all.bsh`](https://jerkwin.github.io/gmxtools/).

假定我们得到了一个xpm文件`densmap.xpm`, 先使用`xpm2all.bsh`将其转换为普通的xyz文件

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">bash</span> xpm2all.bsh densmap.xpm <span style="color:#666">-xyz</span></pre></div>

这样就得到xyz文件`densmap~.xyz`.

gnuplot绘制热图有几种不同的做法, 具体可以参考[官网示例](http://gnuplot.sourceforge.net/demo/pm3dcolors.html). 我通常使用最简单的一种方法

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">plot</span> "densmap~.xyz" u 1:2:3 w image t''</pre></div>

这样就得到了最简单结果图. 可以调整一下各种绘图细节, 让图片更美观一些. 也可以选择自己喜欢的颜色映射方案. 我曾经整理过不少种[常用的颜色映射方案](https://t066v5.coding-pages.com/2019/02/08/gnuplot%E5%88%86%E6%AE%B5%E6%8B%9F%E5%90%88%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84%E8%A1%A8%E8%BE%BE%E5%BC%8F/), 所以就都绘制一遍, 顺便做个比较, 为将来选择做参考.

下图中共给出了20种颜色映射方案, 从最简单的rgb, jet到比较流行的parula, viridis. 一般不再建议使用彩虹方案, 虽然看起来可能更漂亮, 但容易让人对数据产生误解, 得到不正确的第一感觉. 至于到底哪个最好, 见仁见智了, 和科学无关.

![](https://jerkwin.github.io/pic/densmap.png)
