---
 layout: post
 title: AMBER高级教程A17：伞形采样实例--计算丙氨酸二肽Phi/Psi旋转过程的平均力势PMF
 categories:
 - 科
 tags:
 - amber
---

- Ross Walker & Thomas Steinbrecher, [原始文档](http://ambermd.org/tutorials/advanced/tutorial17/index.htm)
- 2018-04-26 16:53:52 翻译: 刘杰

![](http://ambermd.org/tutorials/advanced/tutorial17/images/main_pic.jpg)

在本教程, 我们将学习怎样结合Alan Grossfiled的加权直方图分析方法(WHAM)去产生平均力势. 通常我们可能想要知道自由能随特定反应坐标的分布情况. 这种分布被称为平均力势, 它对识别过渡态, 中间产物和终点的相对稳定性是非常有用的, 一开始人们可能认为能够通过运行一次MD模拟来产生自由能随特定反应坐标的变化, 然后查看样品采样的概率. 然而, 通常感兴趣的能量位垒是k<sub>b</sub>T的数倍, 因此MD模拟将仍然处在它一开始的局部最小值或者跨越不同的最小值, 但极少会采样到过渡态. 采样的缺乏使得我们不能产生一个精确的PMF. 事实上, 甚至对于很小的系统我们也需要超过一毫秒的MD去获得可用的采样. 这显然很难达到, 因此需要使用更好的方法.

其中一种方法是伞形采样. 这项工作可以通过分解反应坐标成为一系列窗口, 然后采用限制迫使反应坐标维持在靠近窗口的中心. 显然对于理想采样, 最好的方法是用自由能形貌自身作为伞形限制. 这将使能量表面足够平坦以至统一采样. 然而这不可行, 因为它需要我们在计算它之前知道能量表面形状. 相反, 我们通常所做的是用一系列简谐势去限制反应坐标到某个值. 这一系列表示采样的反应坐标值的直方图能够被产生, 假设窗口重叠, 这就能够使用加权直方图分析方法去处理结果, 从而去除限制偏置并恢复PMF.

在本教程我们将使用伞形采样去计算丙氨酸三肽顺反异构化过程的PMF.

![](http://ambermd.org/tutorials/advanced/tutorial17/images/trans_to_cis.gif)

图2

教程包括三部分

## 第一节: 构建并驰豫初始结构

我们所要做的第一件事是产生初始结构并驰豫它, 以至于我们可以用它作为运行伞形采样的输入. 通常情况下, 会从pdb文件中获得这样的结构. 然而, 在我们这个例子中系统很简单, 我们使用leap命令去构建它(Amber16的tleap需要添加oldff路径)

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/tleap</span>
<span style="color:#A2F">source</span> leaprc.ff99SB
<span style="color:#A2F">mol</span> = sequence { ACE ALA ALA NME }
<span style="color:#A2F">solvateoct</span> mol TIP3PBOX 10.0
<span style="color:#A2F">saveamberparm</span> mol ala_tri.prmtop ala_tri.inpcrd
</pre></div>

产生文件[`ala_tri.prmtop`](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri.prmtop), [`ala_tri.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri.inpcrd)

因为这是个小体系, 我们在热浴和驰豫时不需要过于柔和. 我们所要做的是:

1. 最小化(1000 steps) [01_min.in](http://ambermd.org/tutorials/advanced/tutorial17/files/01_min.in)
2. 热浴(NVT, 0到300 K, 20 ps) [02_heat.in](http://ambermd.org/tutorials/advanced/tutorial17/files/02_heat.in)
3. 驰豫(NPT, 300 K, 100 ps) [03_equil.in](http://ambermd.org/tutorials/advanced/tutorial17/files/03_equil.in)

<table class="highlighttable"><th colspan="2" style="text-align:left">01_min.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5
6</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>minimize
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">maxcyc</span><span style="color: #666666">=</span>1000, <span style="color: #B8860B">ncyc</span><span style="color: #666666">=</span>500,
  <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0, <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntp</span><span style="color: #666666">=</span>0,
  <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2,
 /
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">02_heat.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>heat NVT 20ps
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>0, <span style="color: #B8860B">irest</span><span style="color: #666666">=</span>0, <span style="color: #B8860B">ntx</span><span style="color: #666666">=</span>1,
  <span style="color: #B8860B">nstlim</span><span style="color: #666666">=</span>10000, <span style="color: #B8860B">dt</span><span style="color: #666666">=</span>0.002,
  <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0,
  <span style="color: #B8860B">ntt</span><span style="color: #666666">=</span>3, <span style="color: #B8860B">gamma_ln</span><span style="color: #666666">=</span>1.0,
  <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntp</span><span style="color: #666666">=</span>0,
  <span style="color: #B8860B">tempi</span><span style="color: #666666">=</span>0.0, <span style="color: #B8860B">temp0</span><span style="color: #666666">=</span>300.0,
  <span style="color: #B8860B">ntpr</span><span style="color: #666666">=</span>100, <span style="color: #B8860B">ntwx</span><span style="color: #666666">=</span>100, <span style="color: #B8860B">ntwr</span><span style="color: #666666">=</span>10000,
  <span style="color: #B8860B">ioutfm</span><span style="color: #666666">=</span>1,
 /
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">03_equil.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>equil NPT 100ps
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>0, <span style="color: #B8860B">irest</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntx</span><span style="color: #666666">=</span>5,
  <span style="color: #B8860B">nstlim</span><span style="color: #666666">=</span>50000, <span style="color: #B8860B">dt</span><span style="color: #666666">=</span>0.002,
  <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0,
  <span style="color: #B8860B">ntt</span><span style="color: #666666">=</span>3, <span style="color: #B8860B">gamma_ln</span><span style="color: #666666">=</span>1.0,
  <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntp</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">tautp</span><span style="color: #666666">=</span>1.0,
  <span style="color: #B8860B">temp0</span><span style="color: #666666">=</span>300.0,
  <span style="color: #B8860B">ntpr</span><span style="color: #666666">=</span>500, <span style="color: #B8860B">ntwx</span><span style="color: #666666">=</span>500, <span style="color: #B8860B">ntwr</span><span style="color: #666666">=</span>10000,
  <span style="color: #B8860B">ioutfm</span><span style="color: #666666">=</span>1,
 /
</pre></div>
</td></tr></table>

现在我们通过pmemd程序运行这些.  在双cpu机器上使用两个处理器运行它们:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> 01_min.in <span style="color:#666">-o</span> 01_min.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> ala_tri.inpcrd <span style="color:#666">-r</span> 01_min.rst
<span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> 02_heat.in <span style="color:#666">-o</span> 02_heat.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> 01_min.rst <span style="color:#666">-r</span> 02_heat.rst <span style="color:#666">-x</span> 02_heat.nc
<span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> 03_equil.in <span style="color:#666">-o</span> 03_equil.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> 02_heat.rst <span style="color:#666">-r</span> 03_equil.rst <span style="color:#666">-x</span> 03_equil.nc
</pre></div>

得到文件[01_min.out](http://ambermd.org/tutorials/advanced/tutorial17/files/01_min.out), [01_min.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/01_min.rst), [02_heat.out](http://ambermd.org/tutorials/advanced/tutorial17/files/02_heat.out), [02_heat.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/02_heat.rst), [02_heat.nc](http://ambermd.org/tutorials/advanced/tutorial17/files/02_heat.nc), [03_equil.out](http://ambermd.org/tutorials/advanced/tutorial17/files/03_equil.out), [03_equil.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/03_equil.rst), [03_equil.nc](http://ambermd.org/tutorials/advanced/tutorial17/files/03_equil.nc)

你应该检查这些结果, 确保系统保持稳定等等. 你也应该注意到丙氨酸三肽任然处于反式结构. 我们现在能进行下一节, 并建立伞形采样模拟.

## 第二节: 运行伞形采样计算

既然我们已经驰豫了初始结构, 接下来计算部分是在单个伞形窗口运行MD. 所需窗口数目的选择与所使用的限制大小有点像魔法难以琢磨. 我们遇到的又一个问题是在我们计算之前能否知道解决方案最理想的选择. 关键点在于记住选择的窗口数的终点必须重叠. 例如, 窗口1必须采到窗口2的一部分, 等等. 这本质上意味着我们不能错误的去选择太多的窗口, 除非你想要花费过多计算时长. 力常数同样地也必须足够大以确保我们实际采集到了合适大小的相空间子集, 我们使窗口更窄去防止它们重叠. 通常我们能够根据沿着路径的位置去调整窗口和限制的大小. 例如, 如果观察两个距离非常近, 处于范德华半径内的离子分离, 我们必须采用很强的限制和大量的窗口. 随着距离的增加, 我们能使用越来越弱的限制和间距更大的窗口.

在这个例子中, 我们将改变C-N键的夹角从0到180度. 下面的图显示了二面角, 我们将随prmtop文件中相关原子号去改变它(编号为VMD索引数index+1, 因为VMD索引数从零开始)

![](http://ambermd.org/tutorials/advanced/tutorial17/images/atom_numbers.jpg)

图4

首先, 我们近似地使用间隔为3°的伞形窗口. 这将有61个计算去运行. 我们将使用200 KCal/mol-rad<sub>2</sub>的力常数, 它大于所期望的势垒高度. 理想情况应该是在10到30 Kcal的范围内, 这样就足以确保我们对整个反应坐标进行采样, 但不能太大, 那样我们结束时的窗口就不能重叠. 在完成初始的计算之后, 我们将检查重叠部分, 然后我们可以返回并通过额外的模拟来弥补不足.

我们在每个窗口所做的模拟量必须能使采样收敛. 因此, 如果我们增加我们运行一个窗口的长度, 生成的采样角直方图不会变形. 理想情况下, 你需要运行初始模拟, 然后计算PMF, 随后丢掉最后20%的数据并再次计算PMF, 看它的变化. 如果它不改变, 那么你的采样就足够了, 如果它变化显著, 那么你可能需要做更多的采样.

首先我们尝试运行每个窗口150 ps, 在这个驰豫过程中丢掉了前50 ps数据. 因此对每个窗口, 从0到180度, 我们需要做:

1. 最小化(2000 steps, no shake)
2. 驰豫MD(NPT 50 ps, 1 fs步长)
3. 数据收集(MPT 100 ps, 1 fs步长)

我们需要克服的一个问题是, 我们只有一个起始结构 (180°). 因为如果我们从180°的结构开始0°模拟, 约束力就会把结构拉开. 更理想的解决方案是先运行180°模拟, 然后以它作为输入再次开始177°的模拟, 然后是174°的模拟等等. 这种方式在计算时强加一系列限制, 使得我们无法使用计算机集群去运行模拟. 因此从180°结构开始(我们前期驰豫后的丙氨酸-三肽的平衡位置. ), 我们将手动运行120°的模拟, 然后从最终120°结构手动运行60°模拟. 这将给我们3个初始结构, 我们可以使用它们作为不同窗口的起始点.

我们将使用在AMBER11手册4.2节描述的AMBER简谐限制, 在《AMBER 11手册》第4.2节中描述. 这里的例子是使用120°最小化后作为输入文件, 驰豫和数据收集:

[mdin_min.120](http://ambermd.org/tutorials/advanced/tutorial17/files/mdin_min.120)
[mdin_equi.120](http://ambermd.org/tutorials/advanced/tutorial17/files/mdin_equi.120)
[mdin_prod.120](http://ambermd.org/tutorials/advanced/tutorial17/files/mdin_prod.120)

<table class="highlighttable"><th colspan="2" style="text-align:left">mdin_min.120</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
13</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">2000</span> step minimization <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">120</span> deg
 &amp;cntrl
  <span style="color: #B8860B">imin</span> <span style="color: #666666">=</span> 1,
  <span style="color: #B8860B">maxcyc</span><span style="color: #666666">=</span>2000, <span style="color: #B8860B">ncyc</span> <span style="color: #666666">=</span> 500,
  <span style="color: #B8860B">ntpr</span> <span style="color: #666666">=</span> 100, <span style="color: #B8860B">ntwr</span> <span style="color: #666666">=</span> 1000,
  <span style="color: #B8860B">ntf</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ntc</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">cut</span> <span style="color: #666666">=</span> 8.0,
  <span style="color: #B8860B">ntb</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ntp</span> <span style="color: #666666">=</span> 0,
  <span style="color: #B8860B">nmropt</span> <span style="color: #666666">=</span> 1,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>END<span style="color: #BB4444">&#39;</span>,
 &amp;end
<span style="color: #B8860B">DISANG</span><span style="color: #666666">=</span>disang.120
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">mdin_equi.120</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
15</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">50</span> ps NPT equilibration <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">120</span> deg
 &amp;cntrl
  <span style="color: #B8860B">imin</span> <span style="color: #666666">=</span> 0, <span style="color: #B8860B">ntx</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">irest</span> <span style="color: #666666">=</span> 0,
  <span style="color: #B8860B">ntpr</span> <span style="color: #666666">=</span> 5000, <span style="color: #B8860B">ntwr</span> <span style="color: #666666">=</span> 50000, <span style="color: #B8860B">ntwx</span> <span style="color: #666666">=</span> 0,
  <span style="color: #B8860B">ntf</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">ntc</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">cut</span> <span style="color: #666666">=</span> 8.0,
  <span style="color: #B8860B">ntb</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">nstlim</span> <span style="color: #666666">=</span> 50000, <span style="color: #B8860B">dt</span> <span style="color: #666666">=</span> 0.001,
  <span style="color: #B8860B">tempi</span><span style="color: #666666">=</span>0.0, <span style="color: #B8860B">temp0</span> <span style="color: #666666">=</span> 300.0, <span style="color: #B8860B">ntt</span> <span style="color: #666666">=</span> 3,
  <span style="color: #B8860B">gamma_ln</span> <span style="color: #666666">=</span> 1.0,
  <span style="color: #B8860B">ntp</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">pres0</span> <span style="color: #666666">=</span> 1.0, <span style="color: #B8860B">taup</span> <span style="color: #666666">=</span> 5.0,
  <span style="color: #B8860B">nmropt</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ioutfm</span><span style="color: #666666">=</span>1,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>END<span style="color: #BB4444">&#39;</span>,
 &amp;end
<span style="color: #B8860B">DISANG</span><span style="color: #666666">=</span>disang.120
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">mdin_prod.120</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
19</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">100</span> ps NPT production <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">120</span> deg
 &amp;cntrl
  <span style="color: #B8860B">imin</span> <span style="color: #666666">=</span> 0, <span style="color: #B8860B">ntx</span> <span style="color: #666666">=</span> 5, <span style="color: #B8860B">irest</span> <span style="color: #666666">=</span> 1,
  <span style="color: #B8860B">ntpr</span> <span style="color: #666666">=</span> 10000, <span style="color: #B8860B">ntwr</span> <span style="color: #666666">=</span> 0, <span style="color: #B8860B">ntwx</span> <span style="color: #666666">=</span> 10000,
  <span style="color: #B8860B">ntf</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">ntc</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">cut</span> <span style="color: #666666">=</span> 8.0,
  <span style="color: #B8860B">ntb</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">nstlim</span> <span style="color: #666666">=</span> 100000, <span style="color: #B8860B">dt</span> <span style="color: #666666">=</span> 0.001,
  <span style="color: #B8860B">temp0</span> <span style="color: #666666">=</span> 300.0, <span style="color: #B8860B">ntt</span> <span style="color: #666666">=</span> 3,
  <span style="color: #B8860B">gamma_ln</span> <span style="color: #666666">=</span> 1,
  <span style="color: #B8860B">ntp</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">pres0</span> <span style="color: #666666">=</span> 1.0, <span style="color: #B8860B">taup</span> <span style="color: #666666">=</span> 5.0,
  <span style="color: #B8860B">nmropt</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ioutfm</span> <span style="color: #666666">=</span> 1,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>DUMPFREQ<span style="color: #BB4444">&#39;</span>, <span style="color: #B8860B">istep1</span><span style="color: #666666">=</span>50,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>END<span style="color: #BB4444">&#39;</span>,
 &amp;end
<span style="color: #B8860B">DISANG</span><span style="color: #666666">=</span>disang.120
<span style="color: #B8860B">DUMPAVE</span><span style="color: #666666">=</span>dihedral_120.dat
</pre></div>
</td></tr></table>

这里有几件需要注意的事情. 我没有用shake做最小化. 因为sander/pmemd使用shake不能很好的工作, 它会能量最小化结构但在最小化之前会停止. 通常情况下这不是问题, 但在这里, 由于使用了限制条件和最优的初始结构, 我要更为谨慎. 在两个MD期间, 虽然我开启了shake, 但我仍然使用1 fs步长. 这可能是不必要的, 但谨慎没错. 我还将压力的驰豫时间 (taup) 设置为5 ps, 比默认的1 ps要长. 这也是为了减少可能出现的不稳定问题. 最后注意, 所有文件设置nmropt=1, 参考名为[disang.120的文件](http://ambermd.org/tutorials/advanced/tutorial17/files/disang.120). 这个文件是我们用来说明简谐限制的:

<table class="highlighttable"><th colspan="2" style="text-align:left">disang.120</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5
6</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Harmonic restraints <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">120</span> deg
 &amp;rst
  <span style="color: #B8860B">iat</span><span style="color: #666666">=</span>9,15,17,19,
  <span style="color: #B8860B">r1</span><span style="color: #666666">=</span>-60.0, <span style="color: #B8860B">r2</span><span style="color: #666666">=</span>120.0, <span style="color: #B8860B">r3</span><span style="color: #666666">=</span>120.0, <span style="color: #B8860B">r4</span><span style="color: #666666">=</span>300.0,
  <span style="color: #B8860B">rk2</span><span style="color: #666666">=</span>200.0, <span style="color: #B8860B">rk3</span><span style="color: #666666">=</span>200.0,
 /
</pre></div>
</td></tr></table>

这里的iat指的是限制的原子序号, 例如9,15,17和19. 然后我们指定r1到r4共4个值来定义力势的形状. r1-r2之间有力常数为rk2的简谐势, r2-r3之间没有, r3-r4之间有力常数为rk3的简谐势. 既然这样, 我们设rk2=rk3和r2=r3, 从而能给我们在120°时施加于具有最小值的简谐势. 简谐势不是必须的, 然而我们在下一节使用WHAM产生PMF, 它假设限制是简谐势, 这正是我们现在所用的.

还需要注意的是, 在成品模拟中我们指定的dump频率为50和一个输出文件dihedral_120.dat. 这意味着力会每50步(50 fs)写入一次到dihedral_120.dat文件中.

我们现在手动运行3个计算去检查是否正确(注意03_equil.rst是最终结构, 是从最开始不限制驰豫后产生的, 即180°)

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mdin_min.120 <span style="color:#666">-o</span> ala_tri_min_120.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> 03_equil.rst <span style="color:#666">-r</span> ala_tri_min_120.rst
<span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mdin_equi.120 <span style="color:#666">-o</span> ala_tri_equil_120.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> ala_tri_min_120.rst <span style="color:#666">-r</span> ala_tri_equil_120.rst
<span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mdin_prod.120 <span style="color:#666">-o</span> ala_tri_prod_120.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> ala_tri_equil_120.rst <span style="color:#666">-r</span> ala_tri_prod_120.rst <span style="color:#666">-x</span> ala_tri_prod_120.nc
</pre></div>

产生文件: [ala_tri_min_120.out](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_min_120.out), [ala_tri_min_120.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_min_120.rst), [ala_tri_equil_120.out](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_equil_120.out), [ala_tri_equil_120.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_equil_120.rst), [ala_tri_prod_120.out](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_prod_120.out), [ala_tri_prod_120.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_prod_120.rst), [ala_tri_prod_120.nc](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_prod_120.nc), [dihedral_120.dat](http://ambermd.org/tutorials/advanced/tutorial17/files/dihedral_120.dat)

你应该检查计算来确保他们是正确的, 关键要检查的是在从180°到120过程中, 限制不会拉断任何东西, 确保限制正常工作. 尤其是应该看一下dihedral_120.dat文件. 我们能画出图形:

![](http://ambermd.org/tutorials/advanced/tutorial17/images/120_angle_plot.jpg)

图7

这看上去还可以, 虽然平均值稍微小于120°但可以了, 因为力势本身有一定偏差, 导致远离平衡位置. 这也提醒我们限制力不够大. 我们也能够绘制直方图以便于检查它的宽度:

![](http://ambermd.org/tutorials/advanced/tutorial17/images/histogram_120.png)

图8

这也告诉我们限制力不够大, 因此最大值在限制中心2.25°左右波动. 然而, 我们似乎有很好的采样, 图告诉我们3°是窗口之间很好的分离间距. 因为直方图最大宽度的一半大约为6°. 我们可能会得到稍微宽一点的间距, 但保守点好. 我们也不需要过度担心最大的偏移量, 因为相邻的直方图足够重叠.

我们现在继续手动运行60°模拟, 因此我们需要为其他的模拟准备三个初始结构.

[mdin_min.60](http://ambermd.org/tutorials/advanced/tutorial17/files/mdin_min.60)
[mdin_equi.60](http://ambermd.org/tutorials/advanced/tutorial17/files/mdin_equi.60)
[mdin_prod.60](http://ambermd.org/tutorials/advanced/tutorial17/files/mdin_prod.60)
[disang.60](http://ambermd.org/tutorials/advanced/tutorial17/files/disang.60)

<table class="highlighttable"><th colspan="2" style="text-align:left">mdin_min.60</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
13</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">2000</span> step minimization <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">60</span> deg
 &amp;cntrl
  <span style="color: #B8860B">imin</span> <span style="color: #666666">=</span> 1,
  <span style="color: #B8860B">maxcyc</span><span style="color: #666666">=</span>2000, <span style="color: #B8860B">ncyc</span> <span style="color: #666666">=</span> 500,
  <span style="color: #B8860B">ntpr</span> <span style="color: #666666">=</span> 100, <span style="color: #B8860B">ntwr</span> <span style="color: #666666">=</span> 1000,
  <span style="color: #B8860B">ntf</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ntc</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">cut</span> <span style="color: #666666">=</span> 8.0,
  <span style="color: #B8860B">ntb</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ntp</span> <span style="color: #666666">=</span> 0,
  <span style="color: #B8860B">nmropt</span> <span style="color: #666666">=</span> 1,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>END<span style="color: #BB4444">&#39;</span>,
 &amp;end
<span style="color: #B8860B">DISANG</span><span style="color: #666666">=</span>disang.60
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">mdin_equi.60</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
15</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">50</span> ps NPT equilibration <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">60</span> deg
 &amp;cntrl
  <span style="color: #B8860B">imin</span> <span style="color: #666666">=</span> 0, <span style="color: #B8860B">ntx</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">irest</span> <span style="color: #666666">=</span> 0,
  <span style="color: #B8860B">ntpr</span> <span style="color: #666666">=</span> 5000, <span style="color: #B8860B">ntwr</span> <span style="color: #666666">=</span> 50000, <span style="color: #B8860B">ntwx</span> <span style="color: #666666">=</span> 0,
  <span style="color: #B8860B">ntf</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">ntc</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">cut</span> <span style="color: #666666">=</span> 8.0,
  <span style="color: #B8860B">ntb</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">nstlim</span> <span style="color: #666666">=</span> 50000, <span style="color: #B8860B">dt</span> <span style="color: #666666">=</span> 0.001,
  <span style="color: #B8860B">tempi</span><span style="color: #666666">=</span>0.0, <span style="color: #B8860B">temp0</span> <span style="color: #666666">=</span> 300, <span style="color: #B8860B">ntt</span> <span style="color: #666666">=</span> 3,
  <span style="color: #B8860B">gamma_ln</span> <span style="color: #666666">=</span> 1.0,
  <span style="color: #B8860B">ntp</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">pres0</span> <span style="color: #666666">=</span> 1.0, <span style="color: #B8860B">taup</span> <span style="color: #666666">=</span> 5.0,
  <span style="color: #B8860B">nmropt</span> <span style="color: #666666">=</span> 1,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>END<span style="color: #BB4444">&#39;</span>,
 &amp;end
<span style="color: #B8860B">DISANG</span><span style="color: #666666">=</span>disang.60
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">mdin_prod.60</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
19</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">100</span> ps NPT production <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">60</span> deg
 &amp;cntrl
  <span style="color: #B8860B">imin</span> <span style="color: #666666">=</span> 0, <span style="color: #B8860B">ntx</span> <span style="color: #666666">=</span> 5, <span style="color: #B8860B">irest</span> <span style="color: #666666">=</span> 1,
  <span style="color: #B8860B">ntpr</span> <span style="color: #666666">=</span> 10000, <span style="color: #B8860B">ntwr</span> <span style="color: #666666">=</span> 0, <span style="color: #B8860B">ntwx</span> <span style="color: #666666">=</span> 10000,
  <span style="color: #B8860B">ntf</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">ntc</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">cut</span> <span style="color: #666666">=</span> 8.0,
  <span style="color: #B8860B">ntb</span> <span style="color: #666666">=</span> 2, <span style="color: #B8860B">nstlim</span> <span style="color: #666666">=</span> 100000, <span style="color: #B8860B">dt</span> <span style="color: #666666">=</span> 0.001,
  <span style="color: #B8860B">temp0</span> <span style="color: #666666">=</span> 300.0, <span style="color: #B8860B">ntt</span> <span style="color: #666666">=</span> 3,
  <span style="color: #B8860B">gamma_ln</span> <span style="color: #666666">=</span> 1,
  <span style="color: #B8860B">ntp</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">pres0</span> <span style="color: #666666">=</span> 1.0, <span style="color: #B8860B">taup</span> <span style="color: #666666">=</span> 5.0,
  <span style="color: #B8860B">nmropt</span> <span style="color: #666666">=</span> 1, <span style="color: #B8860B">ioutfm</span> <span style="color: #666666">=</span> 1,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>DUMPFREQ<span style="color: #BB4444">&#39;</span>, <span style="color: #B8860B">istep1</span><span style="color: #666666">=</span>50,
 &amp;end
 &amp;wt
  <span style="color: #B8860B">type</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>END<span style="color: #BB4444">&#39;</span>,
 &amp;end
<span style="color: #B8860B">DISANG</span><span style="color: #666666">=</span>disang.60
<span style="color: #B8860B">DUMPAVE</span><span style="color: #666666">=</span>dihedral_60.dat
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">disang.60</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5
6</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Harmonic restraints <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #666666">60</span> deg
 &amp;rst
  <span style="color: #B8860B">iat</span><span style="color: #666666">=</span>9,15,17,19,
  <span style="color: #B8860B">r1</span><span style="color: #666666">=</span>-120.0, <span style="color: #B8860B">r2</span><span style="color: #666666">=</span>60.0, <span style="color: #B8860B">r3</span><span style="color: #666666">=</span>60.0, <span style="color: #B8860B">r4</span><span style="color: #666666">=</span>240.0,
  <span style="color: #B8860B">rk2</span><span style="color: #666666">=</span>200.0, <span style="color: #B8860B">rk3</span><span style="color: #666666">=</span>200.0,
 /
</pre></div>
</td></tr></table>

需要注意的是, 这次使用的输入结构是ala_tri_prod_120.rst file, 为运行120°模拟后产生的文件.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mdin_min.60 <span style="color:#666">-o</span> ala_tri_min_60.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> ala_tri_prod_120.rst <span style="color:#666">-r</span> ala_tri_min_60.rst
<span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mdin_equi.60 <span style="color:#666">-o</span> ala_tri_equil_60.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> ala_tri_min_60.rst <span style="color:#666">-r</span> ala_tri_equil_60.rst
<span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 2 $AMBERHOME/bin/pmemd.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mdin_prod.60 <span style="color:#666">-o</span> ala_tri_prod_60.out <span style="color:#666">-p</span> ala_tri.prmtop <span style="color:#666">-c</span> ala_tri_equil_60.rst <span style="color:#666">-r</span> ala_tri_prod_60.rst <span style="color:#666">-x</span> ala_tri_prod_60.nc
</pre></div>

产生文件: [ala_tri_min_60.out](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_min_60.out), [ala_tri_min_60.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_min_60.rst), [ala_tri_equil_60.out](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_equil_60.out), [ala_tri_equil_60.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_equil_60.rst), [ala_tri_prod_60.out](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_prod_60.out), [ala_tri_prod_60.rst](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_prod_60.rst), [ala_tri_prod_60.nc](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_prod_60.nc), [dihedral_60.dat](http://ambermd.org/tutorials/advanced/tutorial17/files/dihedral_60.dat)

你应该再次检查采样是否良好, 检查直方图等等:

![](http://ambermd.org/tutorials/advanced/tutorial17/images/60_angle_plot.jpg)
![](http://ambermd.org/tutorials/advanced/tutorial17/images/histogram_60.gif)

图10

### 脚本运行

既然已经有了做所有计算的起始结构, 我们可以写个脚本去产生所有输入文件, 除了120°和60°, 因为我们已经算过了. 我写的下面这个perl脚本既能产生输入文件, 也可以提交计算任务到San Diego超算中心(SDSC)的Teragrid IA64集群上. 你可能需要根据你自己的系统去修改它. 因为SDSC的每一个节点有两个处理器, 我将使用pmemd.MPI程序和2个处理器去运行每一个任务.

这些脚本基本相似, 不同的只有计算的角度范围. [prepare_runs_0-90.perl](http://ambermd.org/tutorials/advanced/tutorial17/files/prepare_runs_0-90.perl)脚本使用ala_tri_prod_60.rst文件作为起始结构运行0°到90°时所有计算. [prepare_runs_93-147.perl](http://ambermd.org/tutorials/advanced/tutorial17/files/prepare_runs_93-147.perl)脚本使用ala_tri_prod_120.rst作为起始结构运行93°到147°时所有计算. [prepare_runs_150-180.perl](http://ambermd.org/tutorials/advanced/tutorial17/files/prepare_runs_150-180.perl)使用03_equil.rst(180°)作为起始结构运行150°到180°时所有计算. 0到90°的例子如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">perl</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">  1
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
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#!/usr/bin/perl -w</span>
<span style="color: #AA22FF; font-weight: bold">use</span> Cwd;
<span style="color: #B8860B">$wd</span><span style="color: #666666">=</span>cwd;

<span style="color: #AA22FF; font-weight: bold">print</span> <span style="color: #BB4444">&quot;Preparing input files\n&quot;</span>;

<span style="color: #B8860B">$name</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;ala_tri&quot;</span>;
<span style="color: #B8860B">$incr</span><span style="color: #666666">=3</span>;
<span style="color: #B8860B">$force</span><span style="color: #666666">=200.0</span>;

<span style="color: #666666">&amp;</span>prepare_input();

<span style="color: #AA22FF">exit</span>(<span style="color: #666666">0</span>);

<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">prepare_input</span>() {

	<span style="color: #B8860B">$dihed</span><span style="color: #666666">=0</span>;
	<span style="color: #AA22FF; font-weight: bold">while</span> (<span style="color: #B8860B">$dihed</span> <span style="color: #666666">&lt;=</span> <span style="color: #666666">90</span>) {
	  <span style="color: #AA22FF; font-weight: bold">if</span> (<span style="color: #B8860B">$dihed</span> <span style="color: #666666">!=</span> <span style="color: #666666">60</span>) {
	<span style="color: #008800; font-style: italic">#skip 60 degrees since we already ran it</span>
	<span style="color: #AA22FF; font-weight: bold">print</span> <span style="color: #BB4444">&quot;Processing dihedral: $dihed\n&quot;</span>;
	<span style="color: #666666">&amp;</span>write_mdin0();
	<span style="color: #666666">&amp;</span>write_mdin1();
	<span style="color: #666666">&amp;</span>write_mdin2();
	<span style="color: #666666">&amp;</span>write_disang();
	<span style="color: #666666">&amp;</span>write_batchfile();
	<span style="color: #AA22FF">system</span>(<span style="color: #BB4444">&quot;qsub run.pbs.$dihed&quot;</span>);
	  }
	  <span style="color: #B8860B">$dihed</span> <span style="color: #666666">+=</span> <span style="color: #B8860B">$incr</span>;
	}
}

<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">write_mdin0</span> {
	<span style="color: #AA22FF">open</span> MDINFILE,<span style="color: #BB4444">&#39;</span><span style="color: #666666">&gt;</span><span style="color: #BB4444">&#39;</span>, <span style="color: #BB4444">&quot;mdin_min.$dihed&quot;</span>;
	<span style="color: #AA22FF; font-weight: bold">print</span> MDINFILE <span style="color: #BB4444">&lt;&lt;EOF;</span>
<span style="color: #BB4444">2000 step minimization for $dihed deg</span>
<span style="color: #BB4444"> &amp;cntrl</span>
<span style="color: #BB4444">  imin = 1,</span>
<span style="color: #BB4444">  maxcyc=2000, ncyc = 500,</span>
<span style="color: #BB4444">  ntpr = 100, ntwr = 1000,</span>
<span style="color: #BB4444">  ntf = 1, ntc = 1, cut = 8.0,</span>
<span style="color: #BB4444">  ntb = 1, ntp = 0,</span>
<span style="color: #BB4444">  nmropt = 1,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444"> &amp;wt</span>
<span style="color: #BB4444">  type=&#39;END&#39;,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444">DISANG=disang.$dihed</span>
<span style="color: #BB4444">EOF</span>
	<span style="color: #AA22FF">close</span> MDINFILE;
}
<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">write_mdin1</span> {
	<span style="color: #AA22FF">open</span> MDINFILE,<span style="color: #BB4444">&#39;</span><span style="color: #666666">&gt;</span><span style="color: #BB4444">&#39;</span>, <span style="color: #BB4444">&quot;mdin_equi.$dihed&quot;</span>;
	<span style="color: #AA22FF; font-weight: bold">print</span> MDINFILE <span style="color: #BB4444">&lt;&lt;EOF;</span>
<span style="color: #BB4444">50 ps NPT equilibration for $dihed deg</span>
<span style="color: #BB4444"> &amp;cntrl</span>
<span style="color: #BB4444">  imin = 0, ntx = 1, irest = 0,</span>
<span style="color: #BB4444">  ntpr = 5000, ntwr = 50000, ntwx = 0,</span>
<span style="color: #BB4444">  ntf = 2, ntc = 2, cut = 8.0,</span>
<span style="color: #BB4444">  ntb = 2, nstlim = 50000, dt = 0.001,</span>
<span style="color: #BB4444">  tempi=0.0, temp0 = 300, ntt = 3,</span>
<span style="color: #BB4444">  gamma_ln = 1.0,</span>
<span style="color: #BB4444">  ntp = 1, pres0 = 1.0, taup = 5.0,</span>
<span style="color: #BB4444">  nmropt = 1, ioutfm=1,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444"> &amp;wt</span>
<span style="color: #BB4444">  type=&#39;END&#39;,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444">DISANG=disang.$dihed</span>
<span style="color: #BB4444">EOF</span>
	<span style="color: #AA22FF">close</span> MDINFILE;
}
<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">write_mdin2</span> {
	<span style="color: #AA22FF">open</span> MDINFILE,<span style="color: #BB4444">&#39;</span><span style="color: #666666">&gt;</span><span style="color: #BB4444">&#39;</span>, <span style="color: #BB4444">&quot;mdin_prod.$dihed&quot;</span>;
	<span style="color: #AA22FF; font-weight: bold">print</span> MDINFILE <span style="color: #BB4444">&lt;&lt;EOF;</span>
<span style="color: #BB4444">100 ps NPT production for $dihed deg</span>
<span style="color: #BB4444"> &amp;cntrl</span>
<span style="color: #BB4444">  imin = 0, ntx = 5, irest = 1,</span>
<span style="color: #BB4444">  ntpr = 10000, ntwr = 0, ntwx = 10000,</span>
<span style="color: #BB4444">  ntf = 2, ntc = 2, cut = 8.0,</span>
<span style="color: #BB4444">  ntb = 2, nstlim = 100000, dt = 0.001,</span>
<span style="color: #BB4444">  temp0 = 300, ntt = 3,</span>
<span style="color: #BB4444">  gamma_ln = 1.0,</span>
<span style="color: #BB4444">  ntp = 1, pres0 = 1.0, taup = 5.0,</span>
<span style="color: #BB4444">  nmropt = 1, ioutfm=1,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444"> &amp;wt</span>
<span style="color: #BB4444">  type=&#39;DUMPFREQ&#39;, istep1=50,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444"> &amp;wt</span>
<span style="color: #BB4444">  type=&#39;END&#39;,</span>
<span style="color: #BB4444"> &amp;end</span>
<span style="color: #BB4444">DISANG=disang.$dihed</span>
<span style="color: #BB4444">DUMPAVE=dihedral_${dihed}.dat</span>
<span style="color: #BB4444">EOF</span>
	<span style="color: #AA22FF">close</span> MDINFILE;
}
<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">write_disang</span> {
	<span style="color: #B8860B">$left</span>  <span style="color: #666666">=</span> <span style="color: #AA22FF">sprintf</span> <span style="color: #BB4444">&quot;%4.1f&quot;</span>, <span style="color: #B8860B">$dihed</span> <span style="color: #666666">-</span> <span style="color: #666666">180</span>;
	<span style="color: #B8860B">$min</span>   <span style="color: #666666">=</span> <span style="color: #AA22FF">sprintf</span> <span style="color: #BB4444">&quot;%4.1f&quot;</span>, <span style="color: #B8860B">$dihed</span>;
	<span style="color: #B8860B">$right</span> <span style="color: #666666">=</span> <span style="color: #AA22FF">sprintf</span> <span style="color: #BB4444">&quot;%4.1f&quot;</span>, <span style="color: #B8860B">$dihed</span> <span style="color: #666666">+</span> <span style="color: #666666">180</span>;
	<span style="color: #AA22FF">open</span> DISANG,<span style="color: #BB4444">&#39;</span><span style="color: #666666">&gt;</span><span style="color: #BB4444">&#39;</span>, <span style="color: #BB4444">&quot;disang.$dihed&quot;</span>;
	<span style="color: #AA22FF; font-weight: bold">print</span> DISANG <span style="color: #666666">&lt;&lt;</span>;
Harmonic restraints <span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #B8860B">$dihed</span> deg
 <span style="color: #666666">&amp;</span>rst
  iat<span style="color: #666666">=9</span>,<span style="color: #666666">15</span>,<span style="color: #666666">17</span>,<span style="color: #666666">19</span>,
  r1<span style="color: #666666">=</span><span style="color: #B8860B">$left</span>, r2<span style="color: #666666">=</span><span style="color: #B8860B">$min</span>, r3<span style="color: #666666">=</span><span style="color: #B8860B">$min</span>, r4<span style="color: #666666">=</span><span style="color: #B8860B">$right</span>,
  rk2<span style="color: #666666">=</span><span style="color: #B8860B">$</span>{force}, rk3<span style="color: #666666">=</span><span style="color: #B8860B">$</span>{force},
 <span style="color: #666666">&amp;</span>end
EOF
	<span style="color: #AA22FF">close</span> DISANG;
}

<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">write_batchfile</span> {
	<span style="color: #AA22FF">open</span> BATCHFILE, <span style="color: #BB4444">&#39;</span><span style="color: #666666">&gt;</span><span style="color: #BB4444">&#39;</span>, <span style="color: #BB4444">&quot;run.pbs.$dihed&quot;</span>;
	<span style="color: #AA22FF; font-weight: bold">print</span> BATCHFILE <span style="color: #BB4444">&lt;&lt;EOF;</span>
<span style="color: #BB4444">#PBS -l nodes=1:ppn=2</span>
<span style="color: #BB4444">#PBS -l walltime=1:00:00</span>
<span style="color: #BB4444">#PBS -N run_$dihed</span>

<span style="color: #BB4444">cd $wd</span>

<span style="color: #BB4444">mpirun -np 2 -machinefile \$PBS_NODEFILE pmemd.MPI -O \\</span>
<span style="color: #BB4444">-i mdin_min.$dihed -p ${name}.prmtop -c ala_tri_prod_60.rst -r ${name}_min_${dihed}.rst  -o ${name}_min_${dihed}.out</span>
<span style="color: #BB4444">mpirun -np 2 -machinefile \$PBS_NODEFILE pmemd.MPI -O \\</span>
<span style="color: #BB4444">-i mdin_equi.$dihed -p ${name}.prmtop -c ${name}_min_${dihed}.rst  -r ${name}_equil_${dihed}.rst -o ${name}_equil_${dihed}.out</span>
<span style="color: #BB4444">mpirun -np 2 -machinefile \$PBS_NODEFILE pmemd.MPI -O \\</span>
<span style="color: #BB4444">-i mdin_prod.$dihed -p ${name}.prmtop -c ${name}_equil_${dihed}.rst -r ${name}_prod_${dihed}.rst -o ${name}_prod_${dihed}.out -x ${name}_prod_${dihed}.mdcrd</span>
<span style="color: #BB4444">EOF</span>

	<span style="color: #AA22FF; font-weight: bold">print</span> BATCHFILE <span style="color: #BB4444">&quot;\necho \&quot;Execution finished\&quot;\n&quot;</span>;
	<span style="color: #AA22FF">close</span> BATCHFILE;
}
</pre></div>
</td></tr></table>

我在SDSC Teragrid集群上运行所有计算. 整个耗时30分钟. 欢迎您尝试在自己的集群上运行这些程序, 或者您可以下载完整的输出文件(包括60到120°的): [ala_tri_umbrella_run.tar.gz](http://ambermd.org/tutorials/advanced/tutorial17/files/ala_tri_umbrella_run.tar.gz)

在我们运行WHAM生成PMF这一最后阶段之前, 应该快速检查所有的窗口是否正确地重叠. 最简单的方法是在一个图上绘制所有的dihedral_xxx.dat数据点, 查看之间的空隙:

合并数据脚本:

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#!/bin/csh</span>
foreach i <span style="color: #666666">(</span> *.dat <span style="color: #666666">)</span>
  <span style="color: #AA22FF">echo</span> <span style="color: #B8860B">$i</span>
  cat <span style="color: #B8860B">$i</span> &gt;&gt; all_dihedrals.dat
end
</pre></div>

![](http://ambermd.org/tutorials/advanced/tutorial17/images/all_dihedrals.png)

图11

图中并没有明显的间隙, 虽然在81°到87°附近的数据看上去有点粗略. 很可能这个区域处于过渡态附近. 我们手动画出78, 81, 84和90°时的直方图并检查他们的重叠:

![](http://ambermd.org/tutorials/advanced/tutorial17/images/78_to_90_histogram.png)

图12

这表明85°附近采样减少, 但我们任然有极好的重叠, 没什么问题

我们现在进入第三节, 将使用WHAM去产生PMF.

## 第三节: 产生PMF

伞形采样的最后阶段是使用Alan Grossfield的WHAM代码, 从我们采集到的二面角数据中产生PMF. WHAM确切的工作原理超出了本教程的范围, 教程的主要目的是展示怎样在AMBER中做伞形采样, 而不是提供一个关于伞形采样背后的理论知识. 为此, 你应该参考一些关于分子动力学和统计力学的最新课本.

WHAM代码由Alan Grossfield的[网站](http://membrane.urmc.rochester.edu/content/wham)提供, 可以下载它. (这儿也有来自网站的副本可以下载: [wham-dist.tgz](http://ambermd.org/tutorials/advanced/tutorial17/files/wham-dist.tgz))

对于本教程, 假设你已经下载好了WHAM代码并且编译了它, 将编译好的放在了`/uer/local/bin`下. 添加它到你的路径下意味着你应该能通过输入`wham`去调用它. 从这点可以推断它正常工作了.

现在我们需要制作wham meta文件. 它本质上是个输入文件, 告诉了每个二面角文件的文件名, 简谐势的最小值和力常数是多少, 格式如下:

	<filename> <harmonic potential minimum in deg> <force constant in the correct units>

单位的注意: Amber使用k(x-x0)2, 这里k的单位是kcal/mol/rad<sup>2</sup>, 而WHAM程序使用0.5k(x-x0)2, k的单位kcal/mol/deg<sup>2</sup>. 因此我们必须加上原始的力常数(在这里是200.0), 通过2(pi/180)2 = 0.0006092换算. 因此力常数用WHAM中的单位表示为: 0.12184 kcal/mol/deg<sup>2</sup>.

下面的[脚本](http://ambermd.org/tutorials/advanced/tutorial17/files/create_meta.perl)将为我们创建meta.dat文件:

<table class="highlighttable"><th colspan="2" style="text-align:left">create_meta.perl</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
22
23
24
25
26
27
28
29
30
31</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#!/usr/bin/perl -w</span>
<span style="color: #AA22FF; font-weight: bold">use</span> Cwd;
<span style="color: #B8860B">$wd</span><span style="color: #666666">=</span>cwd;

<span style="color: #AA22FF; font-weight: bold">print</span> <span style="color: #BB4444">&quot;Preparing meta file\n&quot;</span>;

<span style="color: #B8860B">$name</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;meta.dat&quot;</span>;
<span style="color: #B8860B">$incr</span><span style="color: #666666">=3</span>;
<span style="color: #B8860B">$force</span><span style="color: #666666">=0.12184</span>;

<span style="color: #666666">&amp;</span>prepare_input();

<span style="color: #AA22FF">exit</span>(<span style="color: #666666">0</span>);

<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">prepare_input</span>() {

	<span style="color: #B8860B">$dihed</span><span style="color: #666666">=0</span>;
	<span style="color: #AA22FF; font-weight: bold">while</span> (<span style="color: #B8860B">$dihed</span> <span style="color: #666666">&lt;=</span> <span style="color: #666666">180</span>) {
	  <span style="color: #AA22FF; font-weight: bold">print</span> <span style="color: #BB4444">&quot;Processing dihedral: $dihed\n&quot;</span>;
	  <span style="color: #666666">&amp;</span>write_meta();
	  <span style="color: #B8860B">$dihed</span> <span style="color: #666666">+=</span> <span style="color: #B8860B">$incr</span>;
	}
}

<span style="color: #AA22FF; font-weight: bold">sub </span><span style="color: #00A000">write_meta</span> {
	<span style="color: #AA22FF">open</span> METAFILE,<span style="color: #BB4444">&#39;</span><span style="color: #666666">&gt;&gt;</span><span style="color: #BB4444">&#39;</span>, <span style="color: #BB4444">&quot;$name&quot;</span>;
	<span style="color: #AA22FF; font-weight: bold">print</span> METAFILE <span style="color: #BB4444">&lt;&lt;EOF;</span>
<span style="color: #BB4444">dihedral_$dihed.dat $dihed.0 $force</span>
<span style="color: #BB4444">EOF</span>
	<span style="color: #AA22FF">close</span> MDINFILE;
}
</pre></div>
</td></tr></table>

图13

生成文件: [meta.dat](http://ambermd.org/tutorials/advanced/tutorial17/files/meta.dat)

接下来我们运行wham:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">wham</span> P <span style="color:#666">-1</span> 181 61 0.01 300 0 meta.dat result.dat
</pre></div>

在这里:

- `P`: 表示我们的反应坐标是周期性的(比如0°=360°)
- `-1 181 61 0.01`: 表示从-1°到181°使用61个组去产生PMF, 重建PMF的容忍值为0.01 kcal.
- `300`: 假设温度300 K
- `0`: 不加数据点
- `meta.dat`: meta文件(WHAM的输入)
- `result.dat`: 输出文件

WHAM按照以下步骤运行:

1. 制作直方图
2. 依据所使用的势调整直方图
3. 转换每一个直方图为自由能曲线段
4. 使用最小二乘法拟合迭代式的排列所有曲线段
5. 写入完整的PMF曲线到输入文件中

这将产生[result.dat文件](http://ambermd.org/tutorials/advanced/tutorial17/files/result.dat).

我们提取输出文件的前两列, 然后绘制它:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cat</span> result.dat | awk '{print$1,$2}' > pmf.dat
</pre></div>

产生文件: [pmf.dat](http://ambermd.org/tutorials/advanced/tutorial17/files/result.dat)

![](http://ambermd.org/tutorials/advanced/tutorial17/images/final_pmf.png)

你已经绘制了它. 这告诉了我们反式比顺式结构更为稳定, 约1.8 kcal/mol, 从反式到顺式的转换需要的能垒大约为12.1 kcal/mol.

如果你够大胆, 你现在可以尝试用QM/MM去重复, 或者甚至使用QM/MM做简单的反应.
