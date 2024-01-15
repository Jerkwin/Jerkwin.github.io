---
 layout: post
 title: gnuplot绘制RMSD的统计直方图
 categories:
 - 科
 tags:
 - gnuplot
---

- 2018-06-25 21:01:24

在进行蛋白的分子动力学模拟时, 经常需要查看RMSD, 看蛋白是否已经稳定. 计算RMSD的方法很简单, 直接`gmx rms`即可得到`rmsd.xvg`, 然后就可以进行作图. 在展示RMSD演化图时, 经常还会同时给出其统计直方图, 这样可以更直观地看出RMSD是否已经稳定. 下面记录使用gnuplot作统计直方图的几种方法备用.

## 统计分布

<table class="highlighttable"><th colspan="2" style="text-align:left">gnuplot</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">1
2
3
4
5</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span style="color: #B8860B">w</span><span style="color: #666666">=.001</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">table</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">output</span> <span style="color: #BB4444">&#39;</span>freq<span style="color: #666666">.</span>dat<span style="color: #BB4444">&#39;</span>
<span style="color: #AA22FF; font-weight: bold">plot</span> <span style="color: #BB4444">&#39;</span>C<span style="color: #666666">:</span><span style="#FF0000">\</span>Users<span style="#FF0000">\</span>Jicun<span style="#FF0000">\</span>Desktop<span style="#FF0000">\</span>_JOB<span style="#FF0000">\</span><span style="color: #666666">1</span>y57<span style="#FF0000">\</span>rmsd<span style="color: #666666">.</span>xvg<span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">u</span> (<span style="color: #AA22FF">bin</span>(<span style="#FF0000">$</span><span style="color: #666666">2,</span><span style="color: #AA22FF">w</span>))<span style="color: #666666">:</span>(<span style="color: #666666">1</span>) <span style="color: #AA22FF">s</span> f <span style="color: #AA22FF">w</span> p
<span style="color: #AA22FF; font-weight: bold">unset</span> <span style="color: #AA22FF">table</span>
</pre></div>
</td></tr></table>

## 带误差的直方图

<table class="highlighttable"><th colspan="2" style="text-align:left">gnuplot</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">1
2
3
4
5
6
7
8</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">boxwidth</span> <span style="color: #666666">1</span> relative
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">style</span> data histograms
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">style</span> histogram errorbars gap <span style="color: #666666">0</span> lw <span style="color: #666666">2</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">style</span> fill solid <span style="color: #666666">1</span> border <span style="color: #666666">0</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">bar</span> <span style="color: #666666">2</span>

<span style="#FF0000">stat</span> <span style="#FF0000">&#39;fre</span><span style="color: #AA22FF; font-weight: bold">q</span><span style="#FF0000">.dat&#39;</span> <span style="#FF0000">u</span> <span style="#FF0000">2</span> <span style="#FF0000">nooutput</span>
<span style="color: #AA22FF; font-weight: bold">plot</span> [<span style="color: #666666">0:</span>] <span style="color: #BB4444">&#39;</span>freq<span style="color: #666666">.</span>dat<span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">using</span> (<span style="#FF0000">$</span><span style="color: #666666">2*100/</span>STATS_sum)<span style="color: #666666">:</span>(<span style="color: #666666">1</span>)<span style="color: #666666">:</span><span style="color: #00A000">xticlabels</span>(<span style="#FF0000">$</span><span style="color: #666666">1*1E3</span>) lw <span style="color: #666666">2</span> <span style="color: #AA22FF">t</span><span style="color: #BB4444">&quot;&quot;</span>
</pre></div>
</td></tr></table>

![](https://jerkwin.github.io/pic/rmsd_gpl_1.png)

还有另一种简单点的作法, 使用下面的`boxxyerrorbars`方法.

## 数据及其分布

可采用两种方式

<table class="highlighttable"><th colspan="2" style="text-align:left">gnuplot</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">1
2
3
4
5
6
7
8
9</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span style="color: #B8860B">w</span><span style="color: #666666">=.001</span>

<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">x2tics</span> <span style="color: #666666">1</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">xtics</span> nomirror
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">xl</span><span style="color: #BB4444">&quot;time(ps)&quot;</span>; <span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">yl</span><span style="color: #BB4444">&quot;RMSD(nm)&quot;</span>; <span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">x2label</span> <span style="color: #BB4444">&#39;</span>Freq<span style="color: #666666">%</span><span style="color: #BB4444">&#39;</span>

<span style="#FF0000">stat</span> <span style="#FF0000">&#39;fre</span><span style="color: #AA22FF; font-weight: bold">q</span><span style="#FF0000">.dat&#39;</span> <span style="#FF0000">u</span> <span style="#FF0000">2</span> <span style="#FF0000">nooutput</span>
<span style="color: #AA22FF; font-weight: bold">plot</span> [][<span style="color: #666666">0:</span>] <span style="color: #BB4444">&#39;</span>freq<span style="color: #666666">.</span>dat<span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">u</span> (<span style="#FF0000">$</span><span style="color: #666666">2*100/</span>STATS_sum)<span style="color: #666666">:1:</span>(<span style="color: #666666">0</span>)<span style="color: #666666">:</span>(<span style="#FF0000">$</span><span style="color: #666666">2*100/</span>STATS_sum)<span style="color: #666666">:</span>(<span style="#FF0000">$</span><span style="color: #666666">1-.5*</span><span style="color: #AA22FF">w</span>)<span style="color: #666666">:</span>(<span style="#FF0000">$</span><span style="color: #666666">1+.5*</span><span style="color: #AA22FF">w</span>) <span style="color: #AA22FF">w</span> boxxyerrorbars <span style="color: #AA22FF">axes</span> x2y1 lc <span style="color: #666666">2</span> <span style="color: #AA22FF">t</span><span style="color: #BB4444">&#39;&#39;</span><span style="color: #666666">,</span> \
<span style="color: #BB4444">&#39;</span>C<span style="color: #666666">:</span><span style="#FF0000">\</span>Users<span style="#FF0000">\</span>Jicun<span style="#FF0000">\</span>Desktop<span style="#FF0000">\</span>_JOB<span style="#FF0000">\</span><span style="color: #666666">1</span>y57<span style="#FF0000">\</span>rmsd<span style="color: #666666">.</span>xvg<span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">using</span> <span style="color: #666666">1:2</span> <span style="color: #AA22FF">w</span> l lw <span style="color: #666666">4</span> lc <span style="color: #666666">1</span> <span style="color: #AA22FF">t</span><span style="color: #BB4444">&#39;&#39;</span>
</pre></div>
</td></tr></table>

![](https://jerkwin.github.io/pic/rmsd_gpl_2.png)

<table class="highlighttable"><th colspan="2" style="text-align:left">gnuplot</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span style="color: #B8860B">w</span><span style="color: #666666">=.001</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">multi</span> lay <span style="color: #666666">1,1</span>

<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">rmargin</span> at screen <span style="color: #666666">0.8</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">xl</span><span style="color: #BB4444">&quot;time(ps)&quot;</span>; <span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">yl</span><span style="color: #BB4444">&quot;RMSD(nm)&quot;</span>
<span style="color: #AA22FF; font-weight: bold">plot</span> [<span style="color: #666666">0:</span>][<span style="color: #666666">0:</span>] <span style="color: #BB4444">&#39;</span>C<span style="color: #666666">:</span><span style="#FF0000">\</span>Users<span style="#FF0000">\</span>Jicun<span style="#FF0000">\</span>Desktop<span style="#FF0000">\</span>_JOB<span style="#FF0000">\</span><span style="color: #666666">1</span>y57<span style="#FF0000">\</span>rmsd<span style="color: #666666">.</span>xvg<span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">using</span> <span style="color: #666666">1:2</span> <span style="color: #AA22FF">w</span> l lw <span style="color: #666666">4</span>

<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">lmargin</span> at screen <span style="color: #666666">0.8</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">rmargin</span> at screen <span style="color: #666666">.99</span>
<span style="color: #AA22FF; font-weight: bold">unset</span> <span style="color: #AA22FF">xtics</span>; <span style="color: #AA22FF; font-weight: bold">unset</span> <span style="color: #AA22FF">ytics</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">mxtics</span> <span style="color: #666666">1</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">xtics</span> format <span style="color: #BB4444">&quot; &quot;</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">ytics</span> format <span style="color: #BB4444">&quot; &quot;</span>
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">xl</span><span style="color: #BB4444">&quot; &quot;</span>; <span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #AA22FF">yl</span><span style="color: #BB4444">&quot; &quot;</span>
<span style="#FF0000">stat</span> <span style="#FF0000">&#39;fre</span><span style="color: #AA22FF; font-weight: bold">q</span><span style="#FF0000">.dat&#39;</span> <span style="#FF0000">u</span> <span style="#FF0000">2</span> <span style="#FF0000">nooutput</span>
<span style="color: #AA22FF; font-weight: bold">plot</span> [][<span style="color: #666666">0:</span>] <span style="color: #BB4444">&#39;</span>freq<span style="color: #666666">.</span>dat<span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">u</span> (<span style="#FF0000">$</span><span style="color: #666666">2*100/</span>STATS_sum)<span style="color: #666666">:1:</span>(<span style="color: #666666">0</span>)<span style="color: #666666">:</span>(<span style="#FF0000">$</span><span style="color: #666666">2*100/</span>STATS_sum)<span style="color: #666666">:</span>(<span style="#FF0000">$</span><span style="color: #666666">1-.5*</span><span style="color: #AA22FF">w</span>)<span style="color: #666666">:</span>(<span style="#FF0000">$</span><span style="color: #666666">1+.5*</span><span style="color: #AA22FF">w</span>) <span style="color: #AA22FF">w</span> boxxyerrorbars <span style="color: #AA22FF">t</span><span style="color: #BB4444">&#39;&#39;</span>
</pre></div>
</td></tr></table>

![](https://jerkwin.github.io/pic/rmsd_gpl_3.png)

## 网络资料

- [Adding error bars on a bar graph in gnuplot](https://stackoverflow.com/questions/11347444/adding-error-bars-on-a-bar-graph-in-gnuplot)
- [Gnuplot interchanging Axes](https://stackoverflow.com/questions/18894756/gnuplot-interchanging-axes/18898979#18898979)
- [Horizontal histogram in gnuplot](https://stackoverflow.com/questions/11266452/horizontal-histogram-in-gnuplot)
- [Horizontal Bar Graphs With Labels in Gnuplot](https://www.jefftk.com/p/horizontal-bar-graphs-with-labels-in-gnuplot)
