---
 layout: post
 title: GROMACS氢键分析工具hbond的使用及扩展
 categories:
 - 科
 tags:
 - gmx
 - bash
---

- 2021-06-19 08:19:44

[前一篇文章](https://jerkwin.github.io/2021/06/13/VMD%E6%B0%A2%E9%94%AE%E6%8F%92%E4%BB%B6%E5%8F%8A%E5%85%B6%E5%BA%94%E7%94%A8/)介绍了VMD氢键插件的使用, 这篇文章就再接再厉, 说明下GROMACS氢键分析工具`hbonds`的使用, 顺便发布一个[`gmx_hbdat`脚本](https://jerkwin.github.io/gmxtools/), 使其能够整理氢键数据.

无论准备使用GMX的哪个工具, 首先要做的是查看其文档, 以及GMX手册中的相关说明, 确保能理解工具给出的结果. 对有些工具, 文档和手册中的说明太多简略, 有时候还必须查看相关的源代码. 这是使用GMX工具的必修课, 切记.

GMX的氢键工具`hbond`选项众多, 细究起来还是比较复杂的, 我们这里只介绍最基本的功能, 也就是分析一组原子内, 或两组原子间的氢键. 这需要指定两个索引组. 如果两个索引组完全相同, 那得到的就是这个索引组内部的氢键; 如果两个索引组完全不同（即两组不会同时包含相同的原子）, 那得到的就是两个索引组之间的氢键. 这是目前仅支持的两种情况. 如果两个索引组既不完全相同, 却又部分相同, 那就无法计算, 结果当然也不可靠.

分析结果主要涉及三个文件,

- `hbnum.xvg`: 每个时刻的氢键数目, 只满足距离标准的氢键数目,
- `hbond.ndx`: 列出整个分析轨迹中所有可能氢键涉及的原子编号. 注意编号从1开始, 不同于VMD的从0开始.
- `hbmap.xpm`: 所有可能氢键的时间演化, 给出每一分析帧中每个氢键是否存在.

如果查阅MD文章中的氢键分析部分, 可以发现很多文章给出的结果表格都是AMBER格式的, 其中会给出每个氢键所涉及的残基/原子, 每个氢键的占有率. 我们利用GMX的拓扑文件以及后两个文件, 容易整理得到这样的氢键数据. `hbond.ndx`中给出了原子编号, 根据编号查看gro文件中的信息, 或者拓扑中的数据, 就可以得到相关原子的残基, 原子类型, 名称等数据. 处理下`hbmap.xpm`文件就可以计算出每个氢键的占有率.

## 简单示例

继续以上篇文章的体系做示例吧. 这是一个包合物体系, 我们计算两个分子间的氢键. 先使用`make_ndx`做个索引文件, 其中包含两个分子各自的索引组. 然后运行命令

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">gmx</span> hbond <span style="color:#666">-f</span> traj.xtc <span style="color:#666">-s</span> topol.tpr <span style="color:#666">-n</span> index.ndx <span style="color:#666">-num</span> <span style="color:#666">-hbn</span> <span style="color:#666">-hbm</span></pre></div>

提示时, 选两个分子各自的索引组, 我用的是`MOLA`, `MOLB`.

运行完, 就得到了三个文件输出文件.

<table class="highlighttable"><th colspan="2" style="text-align:left">hbnum.xvg</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%"> 1
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
16
17
18
19
20</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>@    title <span style="color: #BB4444">&quot;Hydrogen Bonds&quot;</span>
@    xaxis  label <span style="color: #BB4444">&quot;Time (ps)&quot;</span>
@    yaxis  label <span style="color: #BB4444">&quot;Number&quot;</span>
@TYPE xy
@ view 0.15, 0.15, 0.75, 0.85
@ legend on
@ legend box on
@ legend loctype view
@ legend 0.78, 0.8
@ legend length 2
@ s0 legend <span style="color: #BB4444">&quot;Hydrogen bonds&quot;</span>       <span style="color: #008800; font-style: italic"># 同时满足距离标准, 角度标准的氢键数</span>
@ s1 legend <span style="color: #BB4444">&quot;Pairs within 0.35 nm&quot;</span> <span style="color: #008800; font-style: italic"># 只满足距离标准的氢键数</span>
         <span style="color: #666666">0</span>           <span style="color: #666666">2</span>           9
      0.02           <span style="color: #666666">2</span>           8
      0.04           <span style="color: #666666">2</span>           6
      0.06           <span style="color: #666666">2</span>           6
      0.08           <span style="color: #666666">2</span>           6
       0.1           <span style="color: #666666">2</span>           6
      0.12           <span style="color: #666666">2</span>           6
      ... ...</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">hbond.ndx</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%"> 1
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
16
17
18
19
20
21
22</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">[</span> MOLA <span style="color: #666666">]</span>                  <span style="color: #008800; font-style: italic"># MOLA的所有原子</span>
    <span style="color: #666666">1</span>     <span style="color: #666666">2</span>     <span style="color: #666666">3</span>     <span style="color: #666666">4</span>     <span style="color: #666666">5</span>     <span style="color: #666666">6</span>     <span style="color: #666666">7</span>     <span style="color: #666666">8</span>     <span style="color: #666666">9</span>    <span style="color: #666666">10</span>    <span style="color: #666666">11</span>    <span style="color: #666666">12</span>    <span style="color: #666666">13</span>    <span style="color: #666666">14</span>    15
    ... ...
<span style="color: #666666">[</span> donors_hydrogens_MOLA <span style="color: #666666">]</span> <span style="color: #008800; font-style: italic"># MOLA的供体原子, 氢原子</span>
    <span style="color: #666666">8</span>    9
   <span style="color: #666666">12</span>   13
   <span style="color: #666666">22</span>   23
   ... ...
<span style="color: #666666">[</span> acceptors_MOLA <span style="color: #666666">]</span>        <span style="color: #008800; font-style: italic"># MOLA的受体原子</span>
    <span style="color: #666666">3</span>     <span style="color: #666666">8</span>    <span style="color: #666666">12</span>    <span style="color: #666666">16</span>    <span style="color: #666666">22</span>    <span style="color: #666666">24</span>    <span style="color: #666666">29</span>    <span style="color: #666666">33</span>    <span style="color: #666666">37</span>    <span style="color: #666666">43</span>    <span style="color: #666666">45</span>    <span style="color: #666666">50</span>    <span style="color: #666666">54</span>    <span style="color: #666666">58</span>    64
    ... ...
<span style="color: #666666">[</span> MOLB <span style="color: #666666">]</span>                  <span style="color: #008800; font-style: italic"># MOLB的所有原子</span>
  <span style="color: #666666">148</span>   <span style="color: #666666">149</span>   <span style="color: #666666">150</span>   <span style="color: #666666">151</span>   <span style="color: #666666">152</span>   <span style="color: #666666">153</span>   <span style="color: #666666">154</span>   <span style="color: #666666">155</span>   <span style="color: #666666">156</span>   <span style="color: #666666">157</span>   <span style="color: #666666">158</span>   <span style="color: #666666">159</span>   <span style="color: #666666">160</span>   <span style="color: #666666">161</span>   162
    ... ...
<span style="color: #666666">[</span> donors_hydrogens_MOLB <span style="color: #666666">]</span> <span style="color: #008800; font-style: italic"># MOLB的供体原子, 氢原子</span>
  <span style="color: #666666">148</span>  201
<span style="color: #666666">[</span> acceptors_MOLB <span style="color: #666666">]</span>        <span style="color: #008800; font-style: italic"># MOLB的受体原子</span>
  <span style="color: #666666">148</span>   149
<span style="color: #666666">[</span> hbonds_MOLA-MOLB <span style="color: #666666">]</span>      <span style="color: #008800; font-style: italic"># 整段分析轨迹中MOLA和MOLB之间所有可能的氢键</span>
     <span style="color: #666666">64</span>     <span style="color: #666666">65</span>    149
    <span style="color: #666666">146</span>    <span style="color: #666666">147</span>    148
    <span style="color: #666666">148</span>    <span style="color: #666666">201</span>     43</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">hbmap.xpm</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%"> 1
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
16
17
18</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>/* XPM */
/* This file can be converted to EPS by the GROMACS program xpm2ps */
/* title:   <span style="color: #BB4444">&quot;Hydrogen Bond Existence Map&quot;</span> */
/* legend:  <span style="color: #BB4444">&quot;Hydrogen Bonds&quot;</span> */
/* x-label: <span style="color: #BB4444">&quot;Time (ps)&quot;</span> */
/* y-label: <span style="color: #BB4444">&quot;Hydrogen Bond Index&quot;</span> */
/* type:    <span style="color: #BB4444">&quot;Discrete&quot;</span> */
static char *gromacs_xpm<span style="color: #666666">[]</span> <span style="color: #666666">=</span> <span style="color: #666666">{</span>
<span style="color: #BB4444">&quot;101 3   2 1&quot;</span>,
<span style="color: #BB4444">&quot;   c #FFFFFF &quot;</span> /* <span style="color: #BB4444">&quot;None&quot;</span>    */, <span style="color: #008800; font-style: italic"># 无氢键, 空白</span>
<span style="color: #BB4444">&quot;o  c #FF0000 &quot;</span> /* <span style="color: #BB4444">&quot;Present&quot;</span> */, <span style="color: #008800; font-style: italic"># 有氢键, 红色o</span>
/* x-axis:  <span style="color: #666666">0</span> 0.02 0.04 0.06 0.08 0.1 0.12 0.14 0.16 0.18 0.2 0.22 0.24 0.26 0.28 0.3 0.32 0.34 0.36 0.38 0.4 0.42 0.44 0.46 0.48 0.5 0.52 0.54 0.56 0.58 0.6 0.62 0.64 0.66 0.68 0.7 0.72 0.74 0.76 0.78 0.8 0.82 0.84 0.86 0.88 0.9 0.92 0.94 0.96 0.98 <span style="color: #666666">1</span> 1.02 1.04 1.06 1.08 1.1 1.12 1.14 1.16 1.18 1.2 1.22 1.24 1.26 1.28 1.3 1.32 1.34 1.36 1.38 1.4 1.42 1.44 1.46 1.48 1.5 1.52 1.54 1.56 1.58 */
/* x-axis:  1.6 1.62 1.64 1.66 1.68 1.7 1.72 1.74 1.76 1.78 1.8 1.82 1.84 1.86 1.88 1.9 1.92 1.94 1.96 1.98 <span style="color: #666666">2</span> */
/* y-axis:  <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">2</span> */
<span style="color: #008800; font-style: italic"># 三条氢键, 与前面`hbond.ndx`中的 [ hbonds_MOLA-MOLB ] 对应</span>
<span style="color: #BB4444">&quot;ooooooooooooooooo        o ooooo oo oooooooo oo ooooooooooooooooooooooooooooooooooooooooooooooooooooo&quot;</span>,
<span style="color: #BB4444">&quot;                 oooooo           ooo  oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo&quot;</span>,
<span style="color: #BB4444">&quot;ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo&quot;</span></pre></div>
</td></tr></table>

使用bash脚本`hbdat.bsh`获取类似AMBER的氢键数据

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">bash</span> hbdat.bsh</pre></div>

得到`hbdat.dat`

<table class="highlighttable"><th colspan="2" style="text-align:left">hbdat.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">1
2
3
4</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#Donor             Hydrogen           Acceptor            Occupancy%</span>
64#<span style="color: #BB4444">&quot;MOLA&quot;</span>_MOL@OH   65#<span style="color: #BB4444">&quot;MOLA&quot;</span>_MOL@HO   149#<span style="color: #BB4444">&quot;MOLB&quot;</span>_MOL@O_3       100.0
146#<span style="color: #BB4444">&quot;MOLA&quot;</span>_MOL@OH  147#<span style="color: #BB4444">&quot;MOLA&quot;</span>_MOL@HO  148#<span style="color: #BB4444">&quot;MOLB&quot;</span>_MOL@OH         70.3
148#<span style="color: #BB4444">&quot;MOLB&quot;</span>_MOL@OH  201#<span style="color: #BB4444">&quot;MOLB&quot;</span>_MOL@HO  43#<span style="color: #BB4444">&quot;MOLA&quot;</span>_MOL@OH          87.1</pre></div>
</td></tr></table>

其中原子的标识为 `总体编号#"分子名称"_残基名称@原子名称`. 此数据可以与前一篇文章中的数据对比, 可以看到氢键所涉及的原子完全一致, 但由于VMD和GMX的氢键判断标准无法精确地相互转换, 所以占有率只是基本一致, 无法完全一致.

## 其他

分析氢键时的另一个常见问题是, 如何分析GMX不支持原子间的氢键, 如涉及卤素原子的氢键. 这可以通过修改拓扑文件, 将卤素原子改为`O`或`N`, 骗过GMX来达到目的. 因为GMX不会检查实际原子是什么元素, 只看其名称. 修改了原子名称GMX就会以为原子真的变了, 即便名不符实. 但注意不要把拓扑搞混了, 这种修改过的拓扑只能用来计算氢键, 不要用它来做其他计算.
