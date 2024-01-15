---
 layout: post
 title: AMBER高级教程A2：耦合势的QM/MM(量子力学/分子动力学)模拟
 categories:
 - 科
 tags:
 - amber
---

- Ross Walker, 更新至AMBER15 [原始文档](http://ambermd.org/tutorials/advanced/tutorial2/index.htm)
- 2018-04-03 20:48:38 翻译: 席昆(武汉大学)

自AMBER9发布以来, AMBER实现了通过完整的长程静电(PME)处理或者隐含水的广义波恩(GB)模型来进行快速且准确的耦合场下半经验的QM/MM模拟. 本教程是依据AMBER15中的第10部分的理论, 将系统部分用量子力学计算模拟处理, 剩余的部分则用经典的AMBER力场模拟处理.

本教程旨在展示如何在AMBER中实现周期性边界的QM/MM模拟, 目前AMBER中QM/MM模拟功能是在标准sander计算软件中实现的.

本教程包含以下四部分:

- 第一步: 创建NMA(N-methylacetamide N-甲基乙酰胺)模拟系统
- 第二步: 经典的MD模拟
- 第三步: QM/MM的MD模拟
- 第四步: 两种模拟结果的比较

## 1. 创建NMA(N-methylacetamide N-甲基乙酰胺)模拟系统

本教程中, 我们将用不同的力场相互作用方式进行两个模拟并对结果进行比较. 第一个模拟是对周期性盒子中NMA分子混合TIP3P水分子的经典MD模拟；第二个模拟则是与第一个模拟一样的条件, 除过使用半经验的PM3哈密顿量来计算NMA分子的能量与作用力.

首先, 需要构建NMA混合了TIP3P水分子的系统的拓扑及坐标文件. NMA分子是由乙酰胺和N-甲基化残基结合产生的, 考虑到其结构简单, 我们可以无须获得完整的pdb分子结构文件, 而是通过构造包含其主要的重原子的赝结构后, 再由xleap自动添加缺失的原子.

在此赝结构中, 我们只分别给出两部分残基上的第一个原子, xleap将会添加剩余的缺失原子. 具体操作中, 我们由半合理的猜测设定了两个残基第一个原子的坐标, 以使得xleap添加缺失原子时相对简单一些.

<table class="highlighttable"><th colspan="2" style="text-align:left">NMA_skeleton.pdb</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>ATOM	1	C	ACE	1	0.000	0.000	0.000
ATOM	2	N	NME	2	3.000	1.000	-1.000
TER
</pre></div>
</td></tr></table>

接下来我们将读入xleap来为上述结构文件添加缺失的原子.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/xleap</span> <span style="color:#666">-s</span> <span style="color:#666">-f</span> $AMBERHOME/dat/leap/cmd/leaprc.protein.ff14SB
<span style="color:#A2F">NMA</span> = loadpdb NMA_skeleton.pdb
</pre></div>

![](http://ambermd.org/tutorials/advanced/tutorial2/files/xleap_NMA_1.png)

xleap所添加的缺失原子无法确保是处于最优位置, 因此我们还需要通过xleap内所带的最小化程序来稍微优化一下结构:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">edit</span> NMA
</pre></div>

将整个结构中存在键关联的原子用细带连接从而更清楚的显示结构信息, 然后选择`Edit→Relax`选项.

![](http://ambermd.org/tutorials/advanced/tutorial2/files/xleap_NMA_2.jpg)

如上图, 我们得到了合理的结构, 接下来则要添加溶剂盒子. 首先关闭Unit的编辑窗口(Unit→Close), 然后需要选择溶剂参数, 本教程中我们选择TIP3P水模型:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">source</span> leaprc.water.tip3p
</pre></div>

现在我们将添加距NMA分子中心15埃的模拟盒子, 这需要用到solvatebox命令, 相关使用指令可由以下命令得到:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">help</span> solvatebox
</pre></div>

可以发现solvatebox命令的使用需要指定三个特定选项以及其他一个可选选项:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">solvatebox</span> solute solvent buffer [“iso”] [closeness]
</pre></div>

其中溶质(solute)就是我们产生的NMA, 溶剂(solvent)则选择TIP3PBOX, TIP3PBOX表示已经经过预平衡的TIP3P水盒子, 你也可以通过edit TIP3PBOX来专门检查TIP3P水盒子的正确性. 我们选择15埃的缓冲区是指NMA的任意原子距盒子边缘的最小距离, 这个盒子体系大小将足够满足我们的模拟需求. 具体指令为:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">solvatebox</span> NMA TIP3PBOX 15
</pre></div>

xleap会显示添加了1522个水分子, 如果输入edit NMA, 我们就可以查看产生的溶剂盒子.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">edit</span> NMA
</pre></div>

![](http://ambermd.org/tutorials/advanced/tutorial2/files/xleap_NMA_3.jpg)

接下来我们需要保存产生的拓扑和坐标文件, 由于NMA分子是电中性的, 我们的体系不需要再进行中和.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">saveamberparm</span> NMA NMA.prmtop NMA.inpcrd
</pre></div>

对应的文件为: [`NMA.prmtop`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop) [`NMA.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.inpcrd)

## 2. 经典的MD模拟

现在我们创建了拓扑和坐标文件, 可以进行经典的MD模拟. 首先需要对系统进行能量最小化处理以去除溶剂中分子的不合理交叠, 同时使人工修饰产生的NMA结构被优化. 为此, 先要运行500步的能量最小化, 输入文件内容与其他的教程类似. 因为AMBER支持在经典的MD模拟或QM/MM的MD模拟中由周期性边界下的PME(Particle mesh Ewald)来处理静电, 因此我们可以通过设置NTB=1来调用；AMBER也支持量子力学计算模拟系统中的原子振动(shake), 由于本教程的QM/MM模拟暂不涉及任何含氢的反应, 因此两种模拟将都使用步长2fs的shake模式(NTC=2,NTF=2). 由于当前系统中将使用周期性的PME计算静电, 因此设置截断半径为8埃是安全的. 以下是具体的输入文件[`min_classical.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_classical.in):

<table class="highlighttable"><th colspan="2" style="text-align:left">min_classical.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Initial minimisation of our structure
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">maxcyc</span><span style="color: #666666">=</span>500, <span style="color: #B8860B">ncyc</span><span style="color: #666666">=</span>200,
  <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0, <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2
 /
</pre></div>
</td></tr></table>

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> min_classical.in <span style="color:#666">-o</span> min_classical.out <span style="color:#666">-p</span> NMA.prmtop <span style="color:#666">-c</span> NMA.inpcrd <span style="color:#666">-r</span> min_classical.rst
</pre></div>

- 输入文件: [`min_classical.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_classical.in), [`NMA.prmtop`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop), [`NMA.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.inpcrd)
- 输出文件: [`min_classical.out`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_classical.out), [`min_classical.rst`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_classical.rst)

完成能量最小化之后, 需要在恒温300K下进行1000fs的分子动力学模拟. 一般系统中需要缓慢升温到300K, 但考虑到NMA在溶液中是个小分子且相对稳定, 因此可以直接从300K的温度进行模拟. 在模拟过程中, 我们需要每一步都在输出文件以及mdcrd(运动轨迹记录文件)写入模拟结果, 这样我们在模拟中通过降低MD计算速度就可以观测到系统的详细运动信息, 同时这些输出信息也会占用可接受的磁盘空间. 以下是MD模拟的输入文件[`md_classical.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_classical.in):

<table class="highlighttable"><th colspan="2" style="text-align:left">md_classical.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5
6
7
8
9</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>300K constant temp MD
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>0, <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>1,
  <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0, <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2,
  <span style="color: #B8860B">tempi</span><span style="color: #666666">=</span>300.0, <span style="color: #B8860B">temp0</span><span style="color: #666666">=</span>300.0,
  <span style="color: #B8860B">ntt</span><span style="color: #666666">=</span>3, <span style="color: #B8860B">gamma_ln</span><span style="color: #666666">=</span>1.0,
  <span style="color: #B8860B">nstlim</span><span style="color: #666666">=</span>1000, <span style="color: #B8860B">dt</span><span style="color: #666666">=</span>0.002,
  <span style="color: #B8860B">ntpr</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntwx</span><span style="color: #666666">=</span>1,
 /
</pre></div>
</td></tr></table>

接下来, 可以进行MD计算.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> md_classical.in <span style="color:#666">-o</span> md_classical.out <span style="color:#666">-p</span> NMA.prmtop <span style="color:#666">-c</span> min_classical.rst <span style="color:#666">-r</span> md_classical.rst <span style="color:#666">-x</span> md_classical.mdcrd
</pre></div>

这个过程用时不超过1分钟.

- 输入文件: [`md_classical.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_classical.in), [`NMA.prmtop`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop), [`min_classical.rst`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_classical.rst)
- 输出文件: [`md_classical.out`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_classical.out), [`md_classical.rst`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_classical.rst), [`md_classical.mdcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_classical.mdcrd.gz)

接下来我们将在VMD中观察运动轨迹, 用cpptraj分析得到模拟轨迹中NMA的平均结构.

第一步: VMD. 启动VMD后导入NMA的拓扑文件(应用AMBER7 Parm格式识别), 再导入md_classical.mdcrd(注意运动坐标轨迹文件中包含盒子信息, 可以选择“AMBER Coordinate with Periodic”来显示)轨迹文件导入到NMA分子. 这里链接的轨迹文件数据被压缩过, 以减少需要占用的磁盘空间, 使用前请务必先解压缩.

系统中水分子运动是有用的, 但是我们更关注NMA分子的运动, 所以我们先移除水分子的显示.

	Graphics->Representations

在原子类型选择:

	all not water

单击apply并将drawing method改为CPK. 然后你就可以看到NMA分子运动的小动画.

![](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA_md_classical.jpg)

需要注意的是氨基C-N-H基团在模拟中保持在一个平面中, 这是很强的人工修饰, 因为N原子还有一个孤电子对会诱导H原子偏离平面. 这是目前版本经典力场中的一个缺陷.

接下来我们再进行类似的QM/MM模拟.

## 3. QM/MM的MD模拟

接下来我们要在耦合的QM/MM场下重复相似的模拟过程. 首先, 对NMA分子使用半经验的PM3哈密顿量来计算对应的结构变化, 水分子则依旧使用经典力场处理. 在此处理下, QM与MM边界处没有键, 也就不必要考虑sander如何需要放置氢原子连接的原子. 然而, 一旦有键在QM与MM之间的边界, sander会自动添加连接的原子, 具体信息可以查看手册.

对于QM/MM的MD模拟, 输入的控制文件非常相似, 但对于需要量子力学计算的原子会有一些明显的区别. 以下是能量最小化的控制文件[`min_qmmm.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_qmmm.in):

<table class="highlighttable"><th colspan="2" style="text-align:left">min_qmmm.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
13</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Initial min of our structure QMMM
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">maxcyc</span><span style="color: #666666">=</span>500, <span style="color: #B8860B">ncyc</span><span style="color: #666666">=</span>200,
  <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0, <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2,
  <span style="color: #B8860B">ifqnt</span><span style="color: #666666">=</span>1
 /
 &amp;qmmm
  <span style="color: #B8860B">qmmask</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>:1-2<span style="color: #BB4444">&#39;</span>,
  <span style="color: #B8860B">qmcharge</span><span style="color: #666666">=</span>0,
  <span style="color: #B8860B">qm_theory</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>PM3<span style="color: #BB4444">&#39;</span>,
  <span style="color: #B8860B">qmshake</span><span style="color: #666666">=</span>1,
  <span style="color: #B8860B">qm_ewald</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">qm_pme</span><span style="color: #666666">=</span>1
 /
</pre></div>
</td></tr></table>

其中额外的控制变量是:

- `ifqnt = 1`, 这表示将调用sander中的QM/MM计算, 具体的细节将查看&qmmm列表.

`&qmmm`列表中大部分的选项采用的都是默认选项, 但还是将它们都显示在输入文件以便于以后进行修改:

- `qmmask = ':1-2'`, 这表示用标准的AMBER命名方式进行量子力学计算, 这里的1和2是组成NMA分子的1号残基ACE和2号残基NME, 另外你也可以通过原子编号(iqmatoms)选择相应的计算对象, 如: iqmatoms=1,2,3,4,5,6,7,8,9,10,11,12；
- `qmcharge = 0`, 这是用QM所计算部分的取整的净电荷；
- `qm_theory = PM3`, 这表示用PM3哈密顿量计算 (默认值 default = PM3)；
- `qmshake = 1`,  使QM区域的氢原子振动 (如果ntc=2, 默认值 default = 1)；
- `qm_ewald = 1`,  使用Ewald求和原理处理长程静电作用 (默认值default = 1 如果ntb>0)；
- `qm_pme = 1`, 使用格点Ewald求和(PME)方法作为Ewald具体算法 (如果qm_ewald=1 且use_pme=1, 默认值 default = 1)；

在AMBER下, 我们只需:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> min_qmmm.in <span style="color:#666">-o</span> min_qmmm.out <span style="color:#666">-p</span> NMA.prmtop <span style="color:#666">-c</span> NMA.inpcrd <span style="color:#666">-r</span> min_qmmm.rst
</pre></div>

- 输入文件: [`min_qmmm.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_qmmm.in), [`NMA.prmtop`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop), [`NMA.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.inpcrd)
- 输出文件: [`min_qmmm.out`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_qmmm.out), [`min_qmmm.rst`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_qmmm.rst)

然后类似于之前1000fs的经典MD模拟, 我们另外添加了QM部分的计算选项[`md_qmmm.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_qmmm.in):

<table class="highlighttable"><th colspan="2" style="text-align:left">md_qmmm.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
16</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>300K constant temp QMMMMD
 &amp;cntrl
  <span style="color: #B8860B">imin</span><span style="color: #666666">=</span>0, <span style="color: #B8860B">ntb</span><span style="color: #666666">=</span>1
  <span style="color: #B8860B">cut</span><span style="color: #666666">=</span>8.0, <span style="color: #B8860B">ntc</span><span style="color: #666666">=</span>2, <span style="color: #B8860B">ntf</span><span style="color: #666666">=</span>2,
  <span style="color: #B8860B">tempi</span><span style="color: #666666">=</span>300.0, <span style="color: #B8860B">temp0</span><span style="color: #666666">=</span>300.0,
  <span style="color: #B8860B">ntt</span><span style="color: #666666">=</span>3, <span style="color: #B8860B">gamma_ln</span><span style="color: #666666">=</span>1.0,
  <span style="color: #B8860B">nstlim</span><span style="color: #666666">=</span>1000, <span style="color: #B8860B">dt</span><span style="color: #666666">=</span>0.002,
  <span style="color: #B8860B">ntpr</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">ntwx</span><span style="color: #666666">=</span>1,ifqnt<span style="color: #666666">=</span>1
 /
 &amp;qmmm
  <span style="color: #B8860B">qmmask</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>:1-2<span style="color: #BB4444">&#39;</span>,
  <span style="color: #B8860B">qmcharge</span><span style="color: #666666">=</span>0,
  <span style="color: #B8860B">qm_theory</span><span style="color: #666666">=</span><span style="color: #BB4444">&#39;</span>PM3<span style="color: #BB4444">&#39;</span>,
  <span style="color: #B8860B">qmshake</span><span style="color: #666666">=</span>1,
  <span style="color: #B8860B">qm_ewald</span><span style="color: #666666">=</span>1, <span style="color: #B8860B">qm_pme</span><span style="color: #666666">=</span>1
 /
</pre></div>
</td></tr></table>

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> md_qmmm.in <span style="color:#666">-o</span> md_qmmm.out <span style="color:#666">-p</span> NMA.prmtop <span style="color:#666">-c</span> min_qmmm.rst <span style="color:#666">-r</span> md_qmmm.rst <span style="color:#666">-x</span> md_qmmm.mdcrd
</pre></div>

你可以在另一个终端中用“tail -f md_qmmm.out”观察输出结果, 这里首先要注意QM/MM模拟的每一步计算时间都比经典的MD模拟长一些, 这主要是每一步要完成完整的SCF(self-consistent)计算, 其实时间差别不会特别大. 在AMBER9中, 对于接近50个原子的QM计算, 其计算速度加快了超过10倍, 以保证最优的计算效率. 这个过程需要1分钟左右完成.

- 输入文件: [`md_qmmm.in`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_qmmm.in), [`NMA.prmtop`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop), [`min_qmmm.rst`](http://ambermd.org/tutorials/advanced/tutorial2/files/min_qmmm.rst)
- 输出文件: [`md_qmmm.out`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_qmmm.out), [`md_qmmm.rst`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_qmmm.rst), [`md_qmmm.mdcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_qmmm.mdcrd.gz)

然后在VMD中打开md_qmmm.mdcrd文件来观察系统模拟是否正常, 当然先要对轨迹文件解压缩.

最后一步就是进行比较.

## 4. 两种模拟结果的比较

接下来我们将定量的比较两个模拟的结果, 首先, 先浏览下输出文件:

	                                          Classical
	 NSTEP =        0   TIME(PS) =       0.000  TEMP(K) =   455.28  PRESS =     0.0
	 Etot   =     -9086.7258  EKtot   =      4144.0991  EPtot      =    -13230.8249
	 BOND   =         0.0650  ANGLE   =         0.1616  DIHED      =         2.5068
	 1-4 NB =         1.1157  1-4 EEL =       -19.4429  VDWAALS    =       930.8446
	 EELEC  =    -14146.0758  EHBOND  =         0.0000  RESTRAINT  =         0.0000
	 Ewald error estimate:   0.1330E-03
	 ------------------------------------------------------------------------------
	 NSTEP =        1   TIME(PS) =       0.002  TEMP(K) =   346.22  PRESS =     0.0
	 Etot   =    -10079.4435  EKtot   =      3151.3814  EPtot      =    -13230.8249
	 BOND   =         0.0650  ANGLE   =         0.1616  DIHED      =         2.5068
	 1-4 NB =         1.1157  1-4 EEL =       -19.4429  VDWAALS    =       930.8446
	 EELEC  =    -14146.0758  EHBOND  =         0.0000  RESTRAINT  =         0.0000
	 Ewald error estimate:   0.1330E-03
	 ------------------------------------------------------------------------------
	                                          QMMM
	 NSTEP =        0   TIME(PS) =       0.000  TEMP(K) =   455.28  PRESS =     0.0
	 Etot   =     -9070.8407  EKtot   =      4144.0991  EPtot      =    -13214.9397
	 BOND   =         0.0000  ANGLE   =         0.0000  DIHED      =         0.0000
	 1-4 NB =         0.0000  1-4 EEL =         0.0000  VDWAALS    =       901.0150
	 EELEC  =    -14062.6280  EHBOND  =         0.0000  RESTRAINT  =         0.0000
	 PM3ESCF=       -53.3267
	 Ewald error estimate:   0.5644E-01
	 ------------------------------------------------------------------------------
	 NSTEP =        1   TIME(PS) =       0.002  TEMP(K) =   346.23  PRESS =     0.0
	 Etot   =    -10063.4652  EKtot   =      3151.4746  EPtot      =    -13214.9397
	 BOND   =         0.0000  ANGLE   =         0.0000  DIHED      =         0.0000
	 1-4 NB =         0.0000  1-4 EEL =         0.0000  VDWAALS    =       901.0150
	 EELEC  =    -14062.6280  EHBOND  =         0.0000  RESTRAINT  =         0.0000
	 PM3ESCF=       -53.3267
	 Ewald error estimate:   0.5644E-01
	 ------------------------------------------------------------------------------

在QM/MM模拟的输出结果中多了一项能量输出(PM3ESCF), 这是在MM部分(水)的电场中QM部分(NMA)量化计算得到的能量, 你也会发现QM部分的结果缺失了键角, 二面角, 1-4非成键和1-4 EEL能量, 这是与我们设计的一致, 即NMA相关的键, 键角, 二面角, 范德华作用和静电作用都包含在QM计算中, MM部分只有确定三角结构的水分子, 也就只有键长的变化而没有键角变化(因为TIP3P水分子模型没有键角作用). 而水分子只有3原子, 也就没有1-4非成键或者1-4EEL相互作用.

进一步比较两个模拟的输出文件, 就会发现其温度变化都保持合理的稳定且相似, 其中一些较小的差别主要是由于这是两个不同的模拟轨迹.

接下来再来比较两个模拟中NMA分子具体的运动动力学, 类似将QM/MM模拟得到的mdcrd文件导入vmd:

先是[`NMA topology (拓扑)文件`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop) (AMBER7 Parm模板识别), 然后在此分子上读入相应的轨迹文件[`md_qmmm.mdcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_qmmm.mdcrd.gz). 注意, 我们计算中使用周期性边界条件, 则这里需要选择“Amber Coordinates with Periodic Box”选项.

同样的, 移除水分子的显示, 来观察NMA分子的运动.

	Graphics->Representations

在原子模式(Atoms type)中选择:

	all not water

点击apply, 同时改变drawing method为CPK.

现在可以观察NMA分子振动的动画了, 它与经典的MD模拟结果有什么差别呢？当然你可以同时在VMD中读入这两个模拟的轨迹并做成一个动画.

先返回到QM/MM轨迹的初始时刻并导入一个新的分子构象, 再次选择[`NMA.prmtop`](http://ambermd.org/tutorials/advanced/tutorial2/files/NMA.prmtop)后向这个分子导入一个轨迹文件[`md_classical.mdcrd`](http://ambermd.org/tutorials/advanced/tutorial2/files/md_classical.mdcrd.gz). 当关闭分子轨迹导入对话框, 你就发现两个分子同时显示. 接下来就可以自由选择需要轨迹显示的内容. 通过降低轨迹显示速率来比较两种模拟之间的差别. (如果需要比较起来更加方便, 你可以给不同的分子模拟轨迹以不同的颜色(Graphics->Representations)来进行区别.

你应该注意到在QM/MM模拟计算中, 氨基(NH group)的动力学不同于经典的MD模拟. 这里氮原子会经常形成塔状结构, 氨基的氢原子也经常脱离O-C-N平面. 在QM/MM计算得到的结果是更加准确的, 而在经典的力场下很难得到精准的模拟氨基(NH)骨架动力学行为.

![](http://ambermd.org/tutorials/advanced/tutorial2/files/nh_pos_classical.jpg) ![](http://ambermd.org/tutorials/advanced/tutorial2/files/nh_pos_qmmm.jpg)
经典的MD模拟(MM)               量子力学模拟 (QM)

剩余的其他分析就留给读者自己尝试, 你可以观察两种模拟的平均结构的差别, 也可以画出O-C-N-H中原子偏离平面的角度随时间的变化. 你也可以尝试团簇分析和氢键分析. 关于经典的MD模拟与QM/MM模拟之间的氢键频率差别的高级分析可以在[教程B3](http://ambermd.org/tutorials/basic/tutorial3/index.htm)中找到.

你也可以尝试用微动弹性带(Nudged Elastic Band)结合QM/MM的计算方式. 关于经典的MD模拟在[教程A5](file:///Users/jrmunchy/amber_web/tutorials/advanced/tutorial5_amber11/index.htm)中有详细指导. 通过优化QM/MM计算细节, 使得可以模拟除构象变化外的反应路径的计算.
