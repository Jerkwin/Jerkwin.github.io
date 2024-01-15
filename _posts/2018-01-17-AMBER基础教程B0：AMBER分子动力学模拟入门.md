---
 layout: post
 title: AMBER基础教程B0：AMBER分子动力学模拟入门
 categories:
 - 科
 tags:
 - gmx
 - amber
---

- 原始文档: Benjamin D. Madej & Ross Walker, [An Introduction to Molecular Dynamics Simulations using AMBER](http://ambermd.org/tutorials/basic/tutorial0/index.htm)
- 更新至AMBER 15: Aditi Munshi and Ross Walker
- 2018-01-16 10:37:52 翻译: 刘仲奇; 校订: 李继存

![](http://ambermd.org/tutorials/images/basic_0.png)

本教程是专为那些完全没有运行过分子动力学模拟的新用户, 或只有少量模拟经验的用户准备的. 完成本教程不需要提前了解AMBER或Linux的知识, 但需要提前安装好AmberTools和VMD, 并正确设置`AMBERHOME`环境变量. 如果你是AMBER的新用户, 或对一般的MD毫无了解, 可通过此教程入门.

# AMBER基础教程B0: AMBER分子动力学模拟入门

- 原始文档: Benjamin D. Madej & Ross Walker, [An Introduction to Molecular Dynamics Simulations using AMBER](http://ambermd.org/tutorials/basic/tutorial0/index.htm)
- 更新至AMBER 15: Aditi Munshi and Ross Walker
- 2018-01-16 10:37:52 翻译: 刘仲奇; 校订: 李继存

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_3D.png)

* toc
{:toc}

## 介绍

这个教程旨在介绍如何使用Amber进行分子动力学模拟. 它是围绕AMBER Tools v14设计的, 并假设您以前没有使用过Linux或者Amber. 它专门为想要了解如何运行分子动力学模拟的新用户而设计. 如果您的电脑上已经正确安装了Amber Tools v15, VMD和xmgrace就可以学习本教程.

__AMBER__ 代表辅助的模型构建和能量精化(Assisted Model Building and Energy Refinement), 它不仅指代分子动力学程序, 也指代一组力场, 描述了生物分子相互作用的势能函数和参数.

为了在Amber中运行分子动力学模拟, 每个分子的相互作用都由分子力场描述. 力场为每个分子定义了特定的参数.

__sander__ 是Amber中进行分子动力学的基本程序, __pmemd__ 是一个高性能的MD程序, 包含了sander的一部分功能, 它还可以使用图形处理单元(GPU, graphics processing units)加速运行.

为了使用`sander`或者`pmemd`运行分子动力学模拟, 需要三个必备的文件:

1. `prmtop`: 描述系统中分子的参数和拓扑
2. `inpcrd`: 描述系统初始分子坐标
3. `mdin`: 描述Amber分子动力学程序的设置

## 开始使用Linux

Amber MD是一个完全基于命令行界面(CLI, Command Line Interface)的软件, 运行于Linux计算机上. 要运行Amber, 你需要打开一个终端.

### 1. 在你的Linux计算机上打开一个终端

在大多数Linux机器上, 您的终端类似下图:

![](http://ambermd.org/tutorials/basic/tutorial0/include/Terminal.png)

本教程的大部分工作将主要通过终端完成.

### 列出文件并建立一个目录(文件夹)来储存你的文件

### 2. 使用`ls`命令列出当前目录中的内容

当你第一次登录并启动终端时, 您当前的工作目录(或文件夹)就是您的主目录. 它的名称与您的用户名相同, 并且这是您的文件和目录的存储位置. 在大多数情况下, 它的位置在`/home/username`. 我们可以使用`ls`(list)命令查看目录:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">ls</span>
</pre></div>

此时, 您的主目录中可能会有一些文件和目录, 这些文件和目录是使用您的账户自动创建的.

### 3. 使用`mkdir`命令创建一个名为`Tutorial`的目录.

您将需要一个新的目录来存放本教程中创建的文件和文件夹. 所用的命令为`mkdir`(make directory).

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">mkdir</span> Tutorial
</pre></div>

现在输入`ls`命令, 你可以看到您的目录已经创建.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">ls</span>
</pre></div>

显示

	Tutorial

### 4. 使用`cd`命令切换不同的目录

现在, 您可能想要进入您的`Tutorial`目录, 这样您的工作文件都将被保存在这里. 这可以通过`cd`(change directory)命令完成.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> Tutorial
<span style="color:#A2F">ls</span>
</pre></div>

有一个特殊的目录, 名称为`..`. 这是当前目录的父目录. 所以要想返回到`Tutorial`目录的父目录, 可使用`cd ..`:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> ..
<span style="color:#A2F">ls</span>
</pre></div>

显示

	Tutorial

如果您需要返回到您的主目录, 请使用`cd`命令本身. 波浪号`~`是您的主目录的快捷方式. 以下的命令都可以将目录更改为您的主目录.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span>
<span style="color:#A2F">cd</span> ~
</pre></div>

### 5. 使用`pwd`输出主目录的工作目录路径名称

路径名称描述了您所处的目录相对于整个计算机文件系统的位置. 您的主目录在整个文件系统中的位置看通过`pwd`(print working directory)命令获知:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> ~
<span style="color:#A2F">pwd</span>
</pre></div>

显示

	/home/username

这是您所在的当前工作目录. 在这种情况下, 目录`usename`位于`/`(root)目录中的`home`目录中.

## 准备拓扑文件和坐标文件

在本教程中, 您将在名为`xLEaP`的准备程序中构建以下分子以用于在AMBER中进行模拟.

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_2D.png)

为了建立并溶剂化这个分子, 您需要启动`xLEaP`. `xLEaP`具有另一个命令行界面和简单的分子图形界面, 用于构建系统拓扑并为分子定义参数.

### 6. 使用`xleap`命令启动xLEaP

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">xleap</span>
<span style="color:#A2F">-I:</span> Adding /usr/local/amber_14/amber/dat/leap/prep to search path.
<span style="color:#A2F">-I:</span> Adding /usr/local/amber_14/amber/dat/leap/lib to search path.
<span style="color:#A2F">-I:</span> Adding /usr/local/amber_14/amber/dat/leap/parm to search path.
<span style="color:#A2F">-I:</span> Adding /usr/local/amber_14/amber/dat/leap/cmd to search path.
</pre></div>

您应该看到一个类似这样的窗口:

![](http://ambermd.org/tutorials/basic/tutorial0/include/xLEaP_Terminal.png)

警告: __不要__ 在任何xLEaP窗口上点击`X`. 它将完全退出xLEaP.

注意: 这个时候, 关闭键盘的`Num Lock`以使菜单正常工作是个好主意.

### 加载蛋白质和核酸的力场

MD力场是由哈密顿量(势能函数)及其相关参数定义的, 它描述了系统中分子之间的分子内和分子间相互作用. 在MD中, 会积分哈密顿量以获得分子的力和速度.

Amber的哈密顿量的基本形式是:

![](http://ambermd.org/tutorials/basic/tutorial0/include/Amber_Hamiltonian.png)

为了运行分子动力学模拟, 我们需要加载力场来描述丙氨酸二肽的势能. 对蛋白质和核酸我们将使用AMBER的`FF14SB`力场, `FF14SB`基于`FF12SB`, `FF12SB`是`FF99SB`的更新版本, 而`FF99SB`力场又是基于原始的Amber的Cornell等人(1995)的[`ff94`]力场. `FF14SB`力场最显著的变化包括更新了蛋白质Phi-Psi的扭转项, 并重新拟合了侧链的扭转项. 这些变化一起改进了对这些分子中α螺旋的估计.

### 7. 现在用`source`命令加载`FF14SB`力场

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">source</span> leaprc.ff14SB
</pre></div>

显示

	Loading parameters:
	/usr/local/amber14/dat/leap/parm/frcmod.ff14SB
	Reading force field modification type file (frcmod)
	Reading title:

### 建立丙氨酸二肽

我们可以将丙氨酸氨基酸的N端使用乙酰基封端, C端使用N-甲基酰胺封端, 这样就可以构建出丙氨酸二肽. 当加载了`FF14SB`力场之后, 就可以使用`xLEaP`中的这些"构建组件"来构建成分子. `sequence`(序列)命令可以利用已有组件创建一个新的组件并将它们连接在一起.

### 8. 使用`sequence`命令从`ACE`, `ALA`和`NME`组件创建一个名为`foo`的新组件

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">foo</span> = sequence { ACE ALA NME }
</pre></div>

现在得到了一个单独的丙氨酸二肽分子, 储存在组件`foo`. `xLEaP`提供了一个非常基本的编辑器来检查和更改组件和分子.

### 9. 检查丙氨酸二肽分子的结构, 使用`edit`命令来查看结构.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">edit</span> foo
</pre></div>

编辑窗口将如下所示:

![](http://ambermd.org/tutorials/basic/tutorial0/include/xLEaP_Editor.png)

从这里, 您可以检查分子的拓扑, 结构, 原子名称, 原子类型和部分电荷. 也可以对分子进行基本的编辑.

警告: 不要点击`X`来关闭这个窗口, 这将完全退出`xLEaP`. 要关闭此窗口, 请使用`Unit -> Close`.

### 溶剂化丙氨酸二肽

准备丙氨酸二肽系统的下一步是用显式的水分子溶剂化分子. 在这个模拟中, 我们将添加TIP3P水分子到系统中.

在这种类型的模拟中, 系统具有周期性的边界条件, 这意味着离开系统一侧的分子将被转回到系统的另一侧. 周期性盒子足够大非常重要, 即丙氨酸二肽周围有足够的水, 以使丙氨酸二肽分子不与其自身的周期性映像相互作用.

有许多水模型可用于MD模拟. 但是, 对于本教程, 我们将使用TIP3P水模型进行模拟.

### 10. 使用`solvatebox`命令对系统进行溶剂化.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">source</span> leaprc.water.tip3p
<span style="color:#A2F">solvatebox</span> foo TIP3PBOX 10.0
</pre></div>

`TIP3PBOX`指定要溶剂化的水盒子的类型. `10.0`表示分子在丙氨酸二肽和周期性盒壁之间应该具有至少10 埃的缓冲区.

### 保存Amber`prmtop`和`inpcrd`输入文件

现在我们将保存`prmtop`和`inpcrd`文件到当前工作目录. 现在组件`foo`包括丙氨酸二肽分子, 水分子和模拟所需的周期性盒子信息. 参数将根据`ff99SB`力场指定.

### 11. 要保存`prmtop`和`inpcrd`文件, 请使用`saveamberparm`命令

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">saveamberparm</span> foo prmtop inpcrd
</pre></div>

显示

	Checking Unit.
	Building topology.
	Building atom parameters.
	Building bond parameters.
	Building angle parameters.
	Building proper torsion parameters.
	Building improper torsion parameters.
	 total 4 improper torsions applied
	Building H-Bond parameters.
	Incorporating Non-Bonded adjustments.
	Not Marking per-residue atom chain types.
	Marking per-residue atom chain types.
	  (Residues lacking connect0/connect1 -
	   these don't have chain types marked:
			res     total affected
			WAT     630
	  )
	 (no restraints)

警告: 请仔细阅读此命令的输出, 特别是其中的警告和错误信息, 它们可能导致您的`prmtop`和`inpcrd`文件无法正确构建.

### Amber参数/拓扑和坐标文件

丙氨酸二肽的`prmtop`和`inpcrd`文件可在这里下载: [`prmtop`](http://ambermd.org/tutorials/basic/tutorial0/include/prmtop), [`inpcrd`](http://ambermd.org/tutorials/basic/tutorial0/include/inpcrd)

### 退出xLEaP

### 12. 要退出`xLEaP`, 请使用`quit`.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">quit</span>
</pre></div>

## 准备Amber MD的`sander`输入文件

所需的最后一个文件用于控制MD运行的输入文件, 其中定义了MD运行时的程序设置. 在本教程中, 我们将对系统进行能量最小化, 然后缓慢升温, 最后在所需的温度和压力下进行成品MD.

1. 最小化
2. 在恒定的体积和温度(NVT)下升温20 ps, 从0 K升温到300 K.
3. 在1 atm和300 K的恒定压力和温度(NPT)下运行60 ps的成品MD.

我们每2 ps保存一次轨迹并写入输出文件一次, 使用Langevin恒温器控制温度, 使用随机种子初始化随机数发生器.

要控制所有这些设置, 我们将使用文本编辑器编写一个简单的输入文件. Linux下有许多可用的文本编辑器, 但我们将使用您的Linux计算机上自带的简单文本编辑器.

### 13. 在您的Linux计算机上打开gedit Text Editor.

gedit的界面如下所示:

![](http://ambermd.org/tutorials/basic/tutorial0/include/gedit.png)

### 最小化输入

### 14. 创建包含以下最小化设置的文件`01_Min.in`:

<table class="highlighttable"><th colspan="2" style="text-align:left">01_Min.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Minimize
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=1</span>,
  ntx<span style="color: #666666">=1</span>,
  irest<span style="color: #666666">=0</span>,
  maxcyc<span style="color: #666666">=2000</span>,
  ncyc<span style="color: #666666">=1000</span>,
  ntpr<span style="color: #666666">=100</span>,
  ntwx<span style="color: #666666">=0</span>,
  cut<span style="color: #666666">=8.0</span>,
 <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

这些设置总结如下:

- `imin=1`: 选择运行能量最小化
- `ntx=1`: 从ASCII格式的`inpcrd`坐标文件读取坐标, 但不读取速度
- `irest=0`: 不重新启动模拟(不适用于最小化)
- `maxcyc=2000`: 最小化的最大循环数
- `ncyc=1000`: 最初的0到`ncyc`循环使用最速下降算法, 此后的`ncyc`到`maxcyc`循环切换到共轭梯度算法
- `ntpr=100`: 每`ntpr`次循环写入Amber `mdout`输出文件一次
- `ntwx=0`: 不输出Amber `mdcrd`轨迹文件(不适用于最小化)
- `cut=8.0`: 以埃为单位的非键截断距离(对于PME而言, 表示直接空间加和的截断. 不要使用低于8.0的值. 较高的数字略微提高精度, 但是大大增加计算成本)

### 升温输入

### 15. 创建包含以下升温设置的文件`02_Heat.in`:

<table class="highlighttable"><th colspan="2" style="text-align:left">02_Heat.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
24</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Heat
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=0</span>,
  ntx<span style="color: #666666">=1</span>,
  irest<span style="color: #666666">=0</span>,
  nstlim<span style="color: #666666">=10000</span>,
  dt<span style="color: #666666">=0.002</span>,
  ntf<span style="color: #666666">=2</span>,
  ntc<span style="color: #666666">=2</span>,
  tempi<span style="color: #666666">=0.0</span>,
  temp0<span style="color: #666666">=300.0</span>,
  ntpr<span style="color: #666666">=100</span>,
  ntwx<span style="color: #666666">=100</span>,
  cut<span style="color: #666666">=8.0</span>,
  ntb<span style="color: #666666">=1</span>,
  ntp<span style="color: #666666">=0</span>,
  ntt<span style="color: #666666">=3</span>,
  gamma_ln<span style="color: #666666">=2.0</span>,
  nmropt<span style="color: #666666">=1</span>,
  ig<span style="color: #666666">=-1</span>,
 <span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>wt type<span style="color: #666666">=</span>&#39;TEMP0&#39;, istep1<span style="color: #666666">=0</span>, istep2<span style="color: #666666">=9000</span>, value1<span style="color: #666666">=0.0</span>, value2<span style="color: #666666">=300.0</span> <span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>wt type<span style="color: #666666">=</span>&#39;TEMP0&#39;, istep1<span style="color: #666666">=9001</span>, istep2<span style="color: #666666">=10000</span>, value1<span style="color: #666666">=300.0</span>, value2<span style="color: #666666">=300.0</span> <span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>wt type<span style="color: #666666">=</span>&#39;END&#39; <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

这些设置总结如下:

- `imin=0`: 选择运行分子动力学(MD)[无最小化]
- `nstlim=10000`: 要运行的MD步数(运行时间长度`为nstlim`*`dt`, 单位ps)
- `dt=0.002`: 以皮秒(ps)为单位的时间步长. 每一MD步骤的时间长度
- `ntf=2`: 不计算受SHAKE约束的键所受的力
- `ntc=2`: 启用SHAKE来约束所有包含氢的键
- `tempi=0.0`: 初始恒温器的温度, 单位K(见`NMROPT`部分)
- `temp0=300.0`: 最终恒温器的温度 单位K(见`NMROPT`部分)
- `ntwx=1000`: 每`ntwx`步输出Amber轨迹文件`mdcrd`一次
- `ntb=1`: 等容的周期性边界
- `ntp=0`: 无压力控制
- `ntt=3`: 使用Langevin恒温器控制温度
- `gamma_ln=2.0`: Langevin恒温器的碰撞频率
- `nmropt=1`: 读入NMR限制和权重变化(见`NMROPT`部分)
- `ig=-1`: 随机化伪随机数发生器的种子(总是一个好主意, 除非你正在调试一个模拟问题)

### 通过NMROPT控制的恒温器温度

上面输入文件的最后三行允许恒温器在整个模拟过程中改变其目标温度. 对于前9000步, 温度将从0 K增加到300 K. 对于9001至10000步, 温度将保持在300 K.

## 成品模拟输入

警告: 就本身而言, 这个输入文件不适用于一般的MD模拟. 其中的`NTPR`和`NTWX`设置得非常低, 这样才可以对这个很短的模拟进行分析. 使用这样的设置进行更长时间的MD模拟会产生非常大的输出文件和轨迹文件, 并且比常规MD设置更慢. 对于真正的成品MD, 你需要增加`NTPR`和`NTWX`的值.

这个成品模拟的时间只有60 ps. 理想情况下, 我们需要运行这个模拟更长时间, 但为了节省完成本教程的时间, 我们限制了成品模拟的时间.

### 16. 创建包含以下成品MD设置的文件`03_Prod.in`:

<table class="highlighttable"><th colspan="2" style="text-align:left">03_Prod.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
19</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Production
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=0</span>,
  ntx<span style="color: #666666">=5</span>,
  irest<span style="color: #666666">=1</span>,
  nstlim<span style="color: #666666">=30000</span>,
  dt<span style="color: #666666">=0.002</span>,
  ntf<span style="color: #666666">=2</span>,
  ntc<span style="color: #666666">=2</span>,
  temp0<span style="color: #666666">=300.0</span>,
  ntpr<span style="color: #666666">=100</span>,
  ntwx<span style="color: #666666">=100</span>,
  cut<span style="color: #666666">=8.0</span>,
  ntb<span style="color: #666666">=2</span>,
  ntp<span style="color: #666666">=1</span>,
  ntt<span style="color: #666666">=3</span>,
  gamma_ln<span style="color: #666666">=2.0</span>,
  ig<span style="color: #666666">=-1</span>,
 <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

成品模拟的设置总结如下:

- `ntx=5`: 从无格式的`inpcrd`坐标文件中读取坐标和速度
- `irest=1`: 重新启动以前的MD运行(这意味着预期`inpcrd`文件中存在速度, 并将使用它们来提供初始原子速度)
- `temp0=300.0`: 恒温器温度. 在300 K运行
- `ntb=2`: 在恒定压力下使用周期性边界条件
- `ntp=1`: 使用Berendsen恒压器进行恒压模拟

输入文件

`sander`输入文件在这里下载: [`01_Min.in`](http://ambermd.org/tutorials/basic/tutorial0/include/01_Min.in), [`02_Heat.in`](http://ambermd.org/tutorials/basic/tutorial0/include/02_Heat.in), [`03_Prod.in`](http://ambermd.org/tutorials/basic/tutorial0/include/03_Prod.in)

## 运行Amber MD模拟程序`sander`

现在我们有了所有的材料: 参数和拓扑文件`prmtop`, 坐标文件`inpcrd`和输入文件`01_Min.in`, `02_Heat.in`, `03_Prod.in`, 我们准备运行实际的最小化, 升温和成品MD.

为此, 我们将使用程序`sander`, Amber的通用MD引擎(也有一个高性能的版本, 称为`pmemd`, 它是商业版AMBER的一部分, 是MD引擎的最佳选择, 但只是用于教程的话, `sander`就足够了). `sander`从命令行运行. 在命令行上, 我们可以指定更多的选项, 并选择使用哪个文件用于输入.

### 17. 首先从终端将目录切换到`Tutorial`目录, 其中存放了所有的输入文件. `~`是主目录的快捷方式, 其中有你创建的`Tutorial`目录.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> ~/Tutorial
</pre></div>

### 运行最小化

### 18. 用`sander`运行丙氨酸二肽的最小化

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> 01_Min.in <span style="color:#666">-o</span> 01_Min.out <span style="color:#666">-p</span> prmtop <span style="color:#666">-c</span> inpcrd <span style="color:#666">-r</span> 01_Min.rst <span style="color:#666">-inf</span> 01_Min.mdinfo
</pre></div>

`sander`对MD模拟的每一步都使用一致的语法. 以下是`sander`命令行选项的总结:

- `-O`: 覆盖输出文件, 如果它们已经存在
- `-i 01_Min.in`: 选择输入文件(默认`mdin`)
- `-o 01_Min.out`: 输出文件(默认`mdout`)
- `-p prmtop`: 选择参数和拓扑文件`prmtop`
- `-c inpcrd`: 选择坐标文件`inpcrd`
- `-r 01_Min.rst`: 输出包含坐标和速度的重启文件(默认`restrt`)
- `-inf 01_Min.mdinfo`: 输出包含模拟状态的MD信息文件(默认`mdinfo`)

取决于您计算机的性能, `sander`应该能在适量的时间(~27秒)内完成最小化.

`sander`运行完成后, 应该有一个输出文件`01_Min.out`, 一个重启文件`01_Min.rst`和一个MD信息文件`01_Min.mdinfo`. 您将使用重启文件`01_Min.rst`来升温系统.

### 最小化输出文件

最小化输出文件在这里下载: [`01_Min.out`](http://ambermd.org/tutorials/basic/tutorial0/include/01_Min.out), [`01_Min.rst`](http://ambermd.org/tutorials/basic/tutorial0/include/01_Min.rst)

### 19. 使用gedit打开输出文件`01_Min.out`

在`01_Min.out`文件中, 您可以找到最小化的详细信息. 在整个最小化过程中, 您应该能够看到系统能量`ENERGY`逐步降低.

### 运行升温MD

现在, 使用从开始的最小化得到的重启文件升温系统.

### 20. 使用`sander`升温丙氨酸二肽.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> 02_Heat.in <span style="color:#666">-o</span> 02_Heat.out <span style="color:#666">-p</span> prmtop <span style="color:#666">-c</span> 01_Min.rst <span style="color:#666">-r</span> 02_Heat.rst <span style="color:#666">-x</span> 02_Heat.mdcrd <span style="color:#666">-inf</span> 02_Heat.mdinfo
</pre></div>

以下是`sander`命令行选项的总结:

- `-c 01_Min.rst`: 现在我们从最小化的重启文件获取输入坐标
- `-x 02_Heat.mdcrd`: MD模拟的输出轨迹文件(默认`mdcrd`)

取决于您的计算机性能, `sander`应该能在适量的时间内(约2.5分钟)完成升温模拟.

### 加热输出文件

加热输出文件可在这里下载. 有些文件已经压缩, 需要解压使用.

[`02_Heat.out`](http://ambermd.org/tutorials/basic/tutorial0/include/02_Heat.out), [`02_Heat.rst`](http://ambermd.org/tutorials/basic/tutorial0/include/02_Heat.rst), [`02_Heat.mdcrd`](http://ambermd.org/tutorials/basic/tutorial0/include/02_Heat.mdcrd.gz)

### 21. 打开输出文件`02_Heat.out`查看系统输出.

在`02_Heat.out`文件中, 您能找到升温MD的输出. 您应该能够看到系统的信息, 包括每步的能量和温度. 例如在1000步的时候:

	NSTEP =     1000   TIME(PS) =       2.000  TEMP(K) =    29.48  PRESS =     0.0
	 Etot   =     -6944.9552  EKtot   =       112.3015  EPtot      =     -7057.2567
	 BOND   =         1.0442  ANGLE   =         1.7653  DIHED      =         9.4906
	 1-4 NB =         2.6284  1-4 EEL =        46.3073  VDWAALS    =      1448.7074
	 EELEC  =     -8567.1999  EHBOND  =         0.0000  RESTRAINT  =         0.0000
	 Ewald error estimate:   0.4641E-03
	 ------------------------------------------------------------------------------

	 NMR restraints: Bond =    0.000   Angle =     0.000   Torsion =     0.000
	===============================================================================

一些重要的数值包括:

- `NSTEP`: MD模拟的时间步
- `TIME`: 模拟的总时间(包括重新启动)
- `TEMP`: 系统温度
- `PRESS`: 系统压力
- `Etot`: 系统的总能量
- `EKtot`: 系统的总动能
- `EPtot`: 系统的总势能

请注意, 因为升温中没有使用恒压器(压力控制), 所以压力为`0.0`.

### 运行成品MD

现在完成了最小化和升温. 我们继续开始实际的成品MD.

### 22. 使用`sander`运行丙氨酸二肽的成品MD

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> 03_Prod.in <span style="color:#666">-o</span> 03_Prod.out <span style="color:#666">-p</span> prmtop <span style="color:#666">-c</span> 02_Heat.rst <span style="color:#666">-r</span> 03_Prod.rst <span style="color:#666">-x</span> 03_Prod.mdcrd <span style="color:#666">-inf</span> 03_Prod.info &
</pre></div>

注意: 命令的末尾加上了`&`, 这样`sander`将在后台运行

现在`sander`正在后台运行. 运行成品MD模拟需要一些时间.

但是我们想监控成品MD的状态. 所以我们将监控`sander`输出文件来检查运行状态. Linux程序`tail`可以输出文件的结尾部分.

### 23. 要监控作业的状态, 请使用程序`tail`将输出文件显示到终端

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">tail</span> <span style="color:#666">-f</span> 03_Prod.out
</pre></div>

当`sander`正在运行时, 上面的命令可以显示输出文件, 这对跟踪工作很有帮助. 您还可以监控`mdinfo`文件(`cat 03_Prod.info`), 该文件提供了详细的性能数据以及预计的完成时间.

### 24. 要退出`tail`, 按`<CTRL-C>`退出程序.

### 完成MD模拟

让MD模拟继续运行. 完成模拟需要一段时间(大约10分钟).

### 成品模拟输出

成品MD输出可以这里下载: [`03_Prod.out`](http://ambermd.org/tutorials/basic/tutorial0/include/03_Prod.out), [`03_Prod.rst`](http://ambermd.org/tutorials/basic/tutorial0/include/03_Prod.rst), [`03_Prod.mdcrd`](http://ambermd.org/tutorials/basic/tutorial0/include/03_Prod.mdcrd.gz)

一旦完成, 打开输出文件检查模拟是否正常完成.

### 25. 用gedit打开输出文件`03_Prod.out`, 查看MD模拟的输出.

## 可视化结果

你现在已经运行了一个MD模拟. 为了可视化结果, 我们现在将使用一个名为VMD(Visual Molecular Dynamics)的程序. 这是一个可以渲染3D分子结构的分子图形程序. VMD不仅可以加载蛋白质数据库(PDB)结构文件, 还加载许多程序的MD轨迹. (有关VMD的更深入教程可在教程主页找到).

### 26. 要启动VMD, 请打开一个终端, 将目录更改为`Tutorial`目录, 然后运行`vmd`.

记住`~/Tutorial`是您的`Tutorial`目录的快捷方式.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> ~/Tutorial
<span style="color:#A2F">vmd</span>
</pre></div>

VMD应该如下所示:

![](http://ambermd.org/tutorials/basic/tutorial0/include/VMD.png)

VMD是非常有用的工具, 用于可视化蛋白质, 核酸和其他生物分子的原子结构. 最常用的格式之一是PDB生物分子结构格式. 要加载一个PDB文件, 进入`File -> New Molecule...`, 然后选择PDB文件, 将其加载为一个`New Molecule`. VMD应该能够自动确定文件类型.

但是, 我们想要可视化丙氨酸二肽的轨迹. 现在我们将加载得到的MD轨迹来查看丙氨酸二肽的动态变化.

### 27. 使用`File -> New Molecule...`创建一个新的分子

### 28. 为`New Molecule`加载文件. 然后选择Amber参数和拓扑文件`prmtop`. 将文件类型设置为`AMBER7.Parm`. 点击`Load`.

### 29. 为`0: prmtop`加载文件. 然后选择Amber轨迹文件`03_Prod.mdcrd`. 将文件类型设置为`AMBER Coordinates with Periodic Box`. 点击`Load`.

VMD现在加载了您的要可视化的轨迹文件. VMD主窗口可用于控制播放.

在VMD的显示窗口中您应该能够看到丙氨酸二肽分子以及许多水分子. 您可以用鼠标旋转, 缩放和平移显示窗口中的分子.

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_Water.png)

许多不同的可视化选项可以在`Graphics -> Representations`窗口中进行更改.

可视化时也可以只显示丙氨酸二肽.

### 30. 在`Selected Atoms`中输入`all not water`

您可以将分子的绘图方法更改为更有趣的模型.

### 31. 在`Drawing Method`中选择`Licorice`

丙氨酸二肽看起来像这样:

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_Solo.png)

### 更多VMD信息

VMD具有许多可用于分析和研究MD轨迹的功能. 例如, 可以对齐分子, 测量均方根偏差(RMSD), 保存轨迹中的结构, 测量整个轨迹中物理系统的参数. VMD也可以渲染一条轨迹的动画.

但是, 这些功能超出了本教程的范围. 更多详细信息请参阅AMBER教程主页面上的VMD教程.

## 分析MD结果

Amber包括一套工具用以检查和分析MD轨迹. 在本教程中, 我们将使用几个Amber程序做一些简单的分析并绘制结果. 分析主要是在终端的命令行中完成的.

### 32. 打开一个终端并将目录更改为存放教程文件的目录.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> ~/Tutorial
</pre></div>

### 33. 创建一个`Analysis`目录并切换到该目录.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">mkdir</span> Analysis
<span style="color:#A2F">cd</span> Analysis
</pre></div>

现在我们将使用一个分析脚本`process_mdout.perl`来分析MD输出文件. 此脚本将从MD输出文件中提取能量, 温度, 压力, 密度和体积, 并将其保存到单独的数据文件中.

### 34. 使用`process_mdout.perl`处理MD输出文件

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/process_mdout.perl</span> ../02_Heat.out ../03_Prod.out
</pre></div>

现在很容易将保存在输出文件中的数据绘制出来.

我们将使用一个方便简单的绘图程序`xmgrace`自动绘制整个模拟过程中下面这些MD模拟性质的变化. 使用这个程序对我们自己比较方便, 你可以使用任何自己使用的绘图程序.

1. MD模拟的温度
2. MD模拟的密度
3. MD模拟的总能量, 势能和动能.

但是, 对于MD模拟密度, 模拟的升温部分不包含密度输出. 您将需要编辑`summary.DENSITY`文件删除空白数据点, 这样`xmgrace`才能正常显示.

### 35. 使用gedit编辑`summary.DENSITY`文件以删除空白数据点(到20 ps).

### 36. 使用以下命令绘制模拟过程中性质的变化:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">xmgrace</span> summary.TEMP
<span style="color:#A2F">xmgrace</span> summary.DENSITY
<span style="color:#A2F">xmgrace</span> summary.ETOT summary.EPTOT summary.EKTOT
</pre></div>

### 分析数据文件

分析数据文件可在这里下载: [`summary.TEMP`](http://ambermd.org/tutorials/basic/tutorial0/include/summary.TEMP), [`summary.DENSITY`](http://ambermd.org/tutorials/basic/tutorial0/include/summary.DENSITY), [`summary.ETOT`](http://ambermd.org/tutorials/basic/tutorial0/include/summary.ETOT), [`summary.EPTOT`](http://ambermd.org/tutorials/basic/tutorial0/include/summary.EPTOT), [`summary.EKTOT`](http://ambermd.org/tutorials/basic/tutorial0/include/summary.EKTOT)

### 成品MD系统的性质

警告: 我们应该运行这个模拟更长时间, 这样密度才能达到平衡, 并且模拟收敛. 然而, 为了节省完成本教程的时间, 成品MD模拟的时间设置得非常短, 这样才可以尽快分析结果.

得到的图应该看起来类似于下面这些:

丙氨酸二肽MD温度

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_Temperature.png)

在这里你可以看到加热过程中温度线性增加(0-20 ps). 随后的成品模拟过程中温度波动相对稳定, 约为300 K.

丙氨酸二肽MD密度

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_Density.png)

在20-80 ps时, 密度达到约1g/cm<sup>3</sup>. 当系统密度收敛时, 这对应于周期性盒子尺寸的变化.

丙氨酸二肽MD总能量, 势能和动能

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_Energy.png)

该图显示总的系统能量可以分解为总势能和总动能.

## 使用`cpptraj`分析RMSD

均方根偏差(RMSD)的值衡量了结构内部原子的坐标相对于某些参考分子坐标的相似程度. 对于这个例子, 我们将测量内部原子坐标相对于最小化结构的变化. 具体来说, 我们将分析丙氨酸的原子(残基2).

为了进行这个分析, 我们将使用`cpptraj`, 一个相当全面的处理MD轨迹的分析程序. 该程序可以运行用户编写的简单脚本, 其中指定要加载的轨迹, 要运行的分析以及要保存的处理过的轨迹或结构.

首先, 我们需要编写一个简单的`cpptraj`脚本来进行这个分析.

### 37. 使用gedit创建一个名为`rmsd.cpptraj`的`cpptraj`脚本.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">trajin</span> 02_Heat.mdcrd
<span style="color:#A2F">trajin</span> 03_Prod.mdcrd
<span style="color:#A2F">reference</span> 01_Min.rst
<span style="color:#A2F">autoimage</span>
<span style="color:#A2F">rms</span> reference mass out 02_03.rms time 2.0 :2
</pre></div>

这是`cpptraj`脚本的简要总结:

- `trajin 02_Heat.mdcrd`: 加载轨迹`02_Heat.mdcrd`
- `reference 01_Min.rst`: 定义结构`01_Min.rst`作为参考结构
- `center: 1-3 mass origin`: 将残基1-3的质心置于体系原点
- `image origin center`: 使用分子的质心将原子映像到原点
- `rms reference mass out 02_03.rms time 2.0 :2`: 使用参考结构计算质量加权的RMSD并输出到`02_03.rms`

### `cpptraj`输入脚本文件

cpptraj输入脚本文件在这里下载: [`rmsd.cpptraj`](http://ambermd.org/tutorials/basic/tutorial0/include/rmsd.cpptraj)

### 运行`cpptraj`

要实际运行`cpptraj`, 我们必须从`prmtop`, `mdcrd`和参考`rst`文件所在目录中使用终端运行它.

### 38. 使用终端, 将目录切换到您的`Tutorial`文件夹, 然后运行`cpptraj`.

必须指定`prmtop`文件和`cpptraj`脚本.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> ~/Tutorial
<span style="color:#A2F">$AMBERHOME/bin/cpptraj</span> <span style="color:#666">-p</span> prmtop <span style="color:#666">-i</span> rmsd.cpptraj &> cpptraj.log
</pre></div>

现在我们的RMSD数据存储在文件`02_03.rms`中. 我们可以简单地使用`xmgrace`绘制这个文件.

### 39. 使用`xmgrace`绘制RMSD.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">xmgrace</span> 02_03.rms
</pre></div>

### Cpptraj输出文件

`cpptraj`输出文件在这里下载: [`02_03.rms`](http://ambermd.org/tutorials/basic/tutorial0/include/02_03.rms), [`cpptraj.log`](http://ambermd.org/tutorials/basic/tutorial0/include/cpptraj.log)

丙氨酸二肽相对于最小化初始结构的MD RMSD

![](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_RMSD.png)

在这个例子中, 丙氨酸二肽的Phi/Psi二面角没有显著的构象变化. 这表明肽结构更稳定.

## 结论

恭喜! 您现在已经运行了您的第一个完整的MD模拟, 并成功地分析了结果. 这是设置, 运行和分析您自己的MD模拟的工作流程的一个相当简单的例子. 如果您想学习更多, 可以到AMBER网站上完成其他教程.

## 附录: 文件

本教程的用到的所有文件都可以在这里下载: [`Alanine_Dipeptide_Files.zip`](http://ambermd.org/tutorials/basic/tutorial0/include/Alanine_Dipeptide_Tutorial_Files.zip)
