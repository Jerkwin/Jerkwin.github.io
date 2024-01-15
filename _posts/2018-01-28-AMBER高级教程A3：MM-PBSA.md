---
 layout: post
 title: AMBER高级教程A3：MM-PBSA
 categories:
 - 科
 tags:
 - amber
 math: true
---

- 原始文档: [AMBER ADVANCED TUTORIAL 3: MM-PBSA](http://ambermd.org/tutorials/advanced/tutorial3/index.htm)
- Perl Version By Ross Walker & Thomas Steinbrecher
- Python Version By Dwight McGee, Bill Miller III, & Jason Swails
- 2018-01-28 06:39:37 翻译: 袁媛; 修订: 李继存

![](http://ambermd.org/tutorials/images/tutA_3.gif)

本教程使用`mm_pbsa`脚本计算RAS-RAF蛋白复合物的结合能, 并对计算中的每一步进行解释说明. 同时教程还包括了对如何使用`mmpbsa_py`脚本进行这种计算的说明.

# AMBER高级教程A3: MM-PBSA

- 原始文档: [AMBER ADVANCED TUTORIAL 3: MM-PBSA](http://ambermd.org/tutorials/advanced/tutorial3/index.htm)
- Perl Version By Ross Walker & Thomas Steinbrecher
- Python Version By Dwight McGee, Bill Miller III, & Jason Swails
- 2018-01-28 06:39:37 翻译: 袁媛; 修订: 李继存

* toc
{:toc}

![](http://ambermd.org/tutorials/advanced/tutorial3/images/ras-raf.jpg)

MM-PBSA方法可用于计算蛋白-配体复合物间的结合自由能, 其中配体可以是蛋白, 也可以是小分子, 多肽等等. 在本教程中, 我们将使用MM-PBSA方法计算两个蛋白结合的结合能.

MM-PBSA方法及其互补的MM-GBSA方法的总体目标是比较同一分子两种不同的溶剂化构象的自由能, 或者计算两个状态之间的自由能差, 这两个状态最通常的情况是代表两个溶剂化分子的结合和未结合状态.

$$[A]_{aq} +[B]_{aq} \iff [A^* B^*]_{aq^*}$$

理想情况下, 我们想直接计算如下图所示的结合自由能:

![](http://ambermd.org/tutorials/advanced/tutorial3/images/figure1.gif)

然而, 在这些溶剂化状态的模拟中, 大部分能量贡献将来自溶剂-溶剂相互作用, 并且总能量的波动将比结合能大一个数量级, 因此结合能的计算需要非常长的时间才能收敛. 因而更有效的方法是按照下面的热力学循环将计算划分开来:

![](http://ambermd.org/tutorials/advanced/tutorial3/images/figure2.gif)

显然, 从上图可以看出结合自由能 $\D G_\text{bind,solv}$ 可以通过下式计算:

$$\D G_\text{bind,solv}^0=\D G_\text{bind,vacuum}^0+\D G_\text{solv,complex}^0-(\D G_\text{solv,ligand}^0+\D G_\text{solv,receptor}^0)$$

在MM-PBSA方法中, 对上述结合自由能的不同贡献以不同方式进行计算:

- 对三种状态的溶剂化自由能是通过求解线性化的泊松-波尔兹曼(Poisson-Boltzman)方程或广义波恩(Generalized Born)方程(给出了静电相互作用对溶剂化自由能的贡献), 并添加表示疏水贡献的经验项来计算的.

$$\D G_\text{solv}^0=\D G_{electrostatic,\e=80}^0-\D G_{electrostatic,\e=1}^0+\D G_{hydrophobic}^0$$

- $\D G_\text{vacuum}$ 是通过计算受体和配体之间的平均相互作用能, 并且在必要或需要时考虑受体与配体结合时熵的变化来得到的:

$$\D G_\text{vacuum}^0=\D E_{molecula\ mechanics}^0-T \D S_{norma\ mode\ analysis}^0$$

- 熵变对于 $\D G_\text{vacuum}$ 的贡献可以通过对三个物种(即两个蛋白和蛋白-蛋白复合物)进行简正模式分析获得. 但实际上如果只是需要比较具有相似熵的状态, 比如两个配体结合到同一个蛋白, 那么熵对于 $\D G_\text{vacuum}$ 的贡献可以忽略. 这样做的原因在于简正模式分析计算非常费时, 而且一般存在较大的误差, 会在结果中引入显著的不确定性.

- 受体与配体间的平均相互作用能通常是通过对不相关的快照(snapshots)系综进行计算得到的, 这些快照来自一段平衡的分子动力学模拟.

在本教程中, 我们将演示使用Amber和AmberTools自带的MM/PB(GB)SA脚本自动执行所有必要步骤, 对蛋白-蛋白复合物(RAS和RAF)和蛋白-配体复合物(雌激素受体和雷洛昔芬)的结合自由能进行计算, 计算时MM-GBSA和MM-PBSA采用串行和并行两种模式. 此外, 我们还将演示使用脚本进行丙氨酸扫描和简正模式熵计算. 原则上, 上述结合自由能的计算需要对复合物以及两种单独蛋白质进行三次独立的MD模拟. 不过, 通常我们近似地认为, 在结合时不会发生显著的构象变化, 从而可以从单一轨迹获得所有三个物种的快照, 这称为"单轨迹方法". 本教程就采用这种方法.

## 1. 构建初始结构, 运行模拟获得平衡体系

在模拟中我们将要建模的体系是人类H-Ras蛋白与C-Raf1的Ras结合结构域之间的复合物(Ras-Raf), 它是信号转导级联的中心. 这里是一个部分平衡的, 预先准备好的RAS-RAF复合物的pdb文件[`ras-raf.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras-raf.pdb).

结构中包含了ras和raf蛋白, 另外还有一个生理上必需的GTP核苷酸, 如下图所示:

![](http://ambermd.org/tutorials/advanced/tutorial3/images/ras-raf2.jpg)

出于本教程的目的, 为简单起见, 我们在计算中不处理GTP分子, 因为这需要为该化合物设置新的参数, 内容超出了本教程的范围. 因此, 我们从pdb文件中删除它, 这样就简单地将它从计算中删除了. 虽然并非严格正确, 但这种近似是合理的, 因为从上图可以看出, GTP并不直接参与结合面.

另外, 这个蛋白质中还含有一个镁离子, 它主要与GTP分子结合, 因此我们也将其删除. 因此, 你应该从pdb文件中删除残基243和244.

下一步是将`res-raf.pdb`文件分成两个独立的结构, 这样就有了`ras-raf.pdb`, `ras.pdb`和`raf.pdb`. 我们将使用这三个结构创建三个气相`prmtop`和`inpcrd`文件组用于MM-PBSA计算, 以及溶剂化复合物的一个文件组用于运行MD模拟:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">tleap</span> <span style="color:#666">-s</span> <span style="color:#666">-f</span> oldff/leaprc.ff14SB
</pre></div>

注意: 对AMBER 14, `tleap`调用中请使用`-f $AMBERHOME/dat/leap/cmd/oldff/leaprc.ff99`来加载`ff99`力场

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">com</span> = loadpdb ras-raf.pdb
<span style="color:#A2F">ras</span> = loadpdb ras.pdb
<span style="color:#A2F">raf</span> = loadpdb raf.pdb
</pre></div>

确保为要使用的计算方法选择了正确的半径. 详细信息见手册中LEaP节的`PBRadii`部分. 如果需要设定特殊的原子半径, 可以参考推荐[`recommended_settings.pdf`](http://ambermd.org/tutorials/advanced/tutorial3/files/recommended_settings.pdf).

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">set</span> default PBRadii mbondi2

<span style="color:#A2F">saveamberparm</span> com ras-raf.prmtop ras-raf.inpcrd
<span style="color:#A2F">saveamberparm</span> ras ras.prmtop ras.inpcrd
<span style="color:#A2F">saveamberparm</span> raf raf.prmtop raf.inpcrd
</pre></div>

退出`tleap`前, 还要创建溶剂化的复合物用于MD模拟:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">charge</span> com
<span style="color:#A2F">></span> Total unperturbed charge: <span style="color:#666">-0.000000</span>
<span style="color:#A2F">></span> Total perturbed charge: <span style="color:#666">-0.000000</span>    (因此无需添加抗衡离子)

<span style="color:#A2F">solvatebox</span> com TIP3PBOX 12.0
<span style="color:#A2F">saveamberparm</span> com ras-raf_solvated.prmtop ras-raf_solvated.inpcrd
<span style="color:#A2F">quit</span>
</pre></div>

上述命令的输入可以使用脚本进行简化:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">tleap</span> <span style="color:#666">-s</span> <span style="color:#666">-f</span> tleap.in > tleap.out
</pre></div>

其中`tleap.in`文件内容为:

<table class="highlighttable"><th colspan="2" style="text-align:left">tleap.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
14</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>source leaprc.protein.ff14SB
source leaprc.water.spce
source leaprc.gaff
com = loadpdb ras-raf.pdb
ras = loadpdb ras.pdb
raf = loadpdb raf.pdb
<span style="color: #AA22FF; font-weight: bold">set</span> <span style="color: #B8860B">default PBRadii mbondi2</span>
saveamberparm com ras-raf.prmtop ras-raf.inpcrd
saveamberparm ras ras.prmtop ras.inpcrd
saveamberparm raf raf.prmtop raf.inpcrd
charge com
solvatebox com TIP3PBOX 12.0
saveamberparm com ras-raf_solvated.prmtop ras-raf_solvated.inpcrd
quit
</pre></div>
</td></tr></table>

下载相关文件:

- [`ras-raf.prmtop`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras-raf.prmtop), [`ras-raf.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras-raf.inpcrd)
- [`ras.prmtop`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras.prmtop), [`ras.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras.inpcrd)
- [`raf.prmtop`](http://ambermd.org/tutorials/advanced/tutorial3/files/raf.prmtop), [`raf.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial3/files/raf.inpcrd)
- [`ras-raf_solvated.prmtop`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras-raf_solvated.prmtop), [`ras-raf_solvated.inpcrd`](http://ambermd.org/tutorials/advanced/tutorial3/files/ras-raf_solvated.inpcrd)

### 1.1 平衡溶剂化复合体

我们将对溶剂化复合物按以下步骤进行平衡: 短的能量最小化, 50 ps的升温, 对复合物进行弱限制条件下50 ps的密度平衡, 300 K下500 ps的等压平衡. 所有的模拟在运行时都对氢原子使用SHAKE约束, 并使用2 fs的时间步长和Langevin动力学控制温度. 输入文件如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">min.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5
6
7
8
9</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>minimise ras<span style="color: #666666">-</span>raf
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=1</span>,maxcyc<span style="color: #666666">=1000</span>,ncyc<span style="color: #666666">=500</span>,
  cut<span style="color: #666666">=8.0</span>,ntb<span style="color: #666666">=1</span>,
  ntc<span style="color: #666666">=2</span>,ntf<span style="color: #666666">=2</span>,
  ntpr<span style="color: #666666">=100</span>,
  ntr<span style="color: #666666">=1</span>, restraintmask<span style="color: #666666">=</span>&#39;<span style="color: #666666">:1-242</span>&#39;,
  restraint_wt<span style="color: #666666">=2.0</span>
 <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">heat.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
16</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>heat ras<span style="color: #666666">-</span>raf
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=0</span>,irest<span style="color: #666666">=0</span>,ntx<span style="color: #666666">=1</span>,
  nstlim<span style="color: #666666">=25000</span>,dt<span style="color: #666666">=0.002</span>,
  ntc<span style="color: #666666">=2</span>,ntf<span style="color: #666666">=2</span>,
  cut<span style="color: #666666">=8.0</span>, ntb<span style="color: #666666">=1</span>,
  ntpr<span style="color: #666666">=500</span>, ntwx<span style="color: #666666">=500</span>,
  ntt<span style="color: #666666">=3</span>, gamma_ln<span style="color: #666666">=2.0</span>,
  tempi<span style="color: #666666">=0.0</span>, temp0<span style="color: #666666">=300.0</span>, ig<span style="color: #666666">=-1</span>,
  ntr<span style="color: #666666">=1</span>, restraintmask<span style="color: #666666">=</span>&#39;<span style="color: #666666">:1-242</span>&#39;,
  restraint_wt<span style="color: #666666">=2.0</span>,
  nmropt<span style="color: #666666">=1</span>
 <span style="color: #666666">/</span>
 <span style="color: #666666">&amp;</span>wt TYPE<span style="color: #666666">=</span>&#39;TEMP0&#39;, istep1<span style="color: #666666">=0</span>, istep2<span style="color: #666666">=25000</span>,
  value1<span style="color: #666666">=0.1</span>, value2<span style="color: #666666">=300.0</span>, <span style="color: #666666">/</span>
 <span style="color: #666666">&amp;</span>wt TYPE<span style="color: #666666">=</span>&#39;END&#39; <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">density.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
12</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>heat ras<span style="color: #666666">-</span>raf
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=0</span>,irest<span style="color: #666666">=1</span>,ntx<span style="color: #666666">=5</span>,
  nstlim<span style="color: #666666">=25000</span>,dt<span style="color: #666666">=0.002</span>,
  ntc<span style="color: #666666">=2</span>,ntf<span style="color: #666666">=2</span>,
  cut<span style="color: #666666">=8.0</span>, ntb<span style="color: #666666">=2</span>, ntp<span style="color: #666666">=1</span>, taup<span style="color: #666666">=1.0</span>,
  ntpr<span style="color: #666666">=500</span>, ntwx<span style="color: #666666">=500</span>,
  ntt<span style="color: #666666">=3</span>, gamma_ln<span style="color: #666666">=2.0</span>,
  temp0<span style="color: #666666">=300.0</span>, ig<span style="color: #666666">=-1</span>,
  ntr<span style="color: #666666">=1</span>, restraintmask<span style="color: #666666">=</span>&#39;<span style="color: #666666">:1-242</span>&#39;,
  restraint_wt<span style="color: #666666">=2.0</span>,
 <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">equil.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>heat ras<span style="color: #666666">-</span>raf
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=0</span>,irest<span style="color: #666666">=1</span>,ntx<span style="color: #666666">=5</span>,
  nstlim<span style="color: #666666">=250000</span>,dt<span style="color: #666666">=0.002</span>,
  ntc<span style="color: #666666">=2</span>,ntf<span style="color: #666666">=2</span>,
  cut<span style="color: #666666">=8.0</span>, ntb<span style="color: #666666">=2</span>, ntp<span style="color: #666666">=1</span>, taup<span style="color: #666666">=2.0</span>,
  ntpr<span style="color: #666666">=1000</span>, ntwx<span style="color: #666666">=1000</span>,
  ntt<span style="color: #666666">=3</span>, gamma_ln<span style="color: #666666">=2.0</span>,
  temp0<span style="color: #666666">=300.0</span>, ig<span style="color: #666666">=-1</span>,
 <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

小心: 在本教程的示例中, 我们不会更改用于随机数生成器的随机种子的值, 随机种子是由命名列表变量`ig`控制的. 这主要是为了能够重复教程设置所得的结果. 但是, 在运行成品模拟时, 特别是使用`ntt=2`或`3`(Anderson或Langevin恒温器)时, __每次__ 重新启动MD时必须修改随机数种子的默认值. 如果您正在使用AMBER 10(的bugfix.26或更高版本)或AMBER 11或更高版本, 可以通过在`cntrl`命名列表中设置`ig=-1`自动执行此操作. 或者, 可以在每次重新开始计算时为`ig`指定一个你选择的正的随机数. 关于不这样做的误区的更多细节可参考文献: [Cerutti DS, Duke, B., et al., "A Vulnerability in Popular Molecular Dynamics Packages Concerning Langevin and Andersen Dynamics", JCTC, 2008, 4, 1669-1680](http://dx.doi.org/10.1021/ct8002173)

你可以使用下面的命令运行所有的4个模拟:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> min.in <span style="color:#666">-o</span> min.out <span style="color:#666">-p</span> ras-raf_solvated.prmtop <span style="color:#666">-c</span> ras-raf_solvated.inpcrd <span style="color:#666">-r</span> min.rst <span style="color:#666">-ref</span> ras-raf_solvated.inpcrd
<span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> heat.in <span style="color:#666">-o</span> heat.out <span style="color:#666">-p</span> ras-raf_solvated.prmtop <span style="color:#666">-c</span> min.rst <span style="color:#666">-r</span> heat.rst <span style="color:#666">-x</span> heat.mdcrd <span style="color:#666">-ref</span> min.rst
<span style="color:#A2F">gzip</span> <span style="color:#666">-9</span> heat.mdcrd
<span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> density.in <span style="color:#666">-o</span> density.out <span style="color:#666">-p</span> ras-raf_solvated.prmtop <span style="color:#666">-c</span> heat.rst <span style="color:#666">-r</span> density.rst <span style="color:#666">-x</span> density.mdcrd <span style="color:#666">-ref</span> heat.rst
<span style="color:#A2F">gzip</span> <span style="color:#666">-9</span> density.mdcrd
<span style="color:#A2F">$AMBERHOME/bin/sander</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> equil.in <span style="color:#666">-o</span> equil.out <span style="color:#666">-p</span> ras-raf_solvated.prmtop <span style="color:#666">-c</span> density.rst <span style="color:#666">-r</span> equil.rst <span style="color:#666">-x</span> equil.mdcrd
<span style="color:#A2F">gzip</span> <span style="color:#666">-9</span> equil.mdcrd
</pre></div>

在1.7GHz, 16核的IBM P690机器上, 完成上面的模拟大于需要5小时.

可以在这里下载输出文件: [`equil.tar.gz`](http://ambermd.org/tutorials/advanced/tutorial3/files/equil.tar.gz)

在我们进行MM-PBSA的成品模拟之前, 我们需要验证体系是否已经平衡. 为此, 我们从温度, 密度, 总能量和RMSD四个方面进行分析. 我们可以使用perl脚本([`process_mdout.pl`](http://ambermd.org/tutorials/advanced/tutorial3/files/process_mdout.perl))从输出文件中提取有用的信息. 命令如下：

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">process_mdout.pl</span> heat.out density.out equil.out
</pre></div>

此外, 我们还要检查相对于最小化结构的蛋白质骨架算RMSD, 以确定在平衡期间构象是否已经稳定. 这可以使用[`measure_equil_rmsd.ptraj`脚本](http://ambermd.org/tutorials/advanced/tutorial3/files/measure_equil_rmsd.ptraj)借助`ptraj`或`cpptraj`完成:

<table class="highlighttable"><th colspan="2" style="text-align:left">measure_equil_rmsd.ptraj</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>trajin equil.mdcrd.gz <span style="color: #666666">1</span> <span style="color: #666666">250</span> 1
reference ras-raf_solvated.inpcrd
rms reference out equil.rmsd @CA,C,N
</pre></div>
</td></tr></table>

由于第一次对复合物体系的升温模拟是在等容条件下进行的, 并没有记录体系的密度数据. 因此需要编辑`summary.DENSITY`文件删除前50行(之所以这么做是因为`xmgrace`太愚蠢无法处理这种情况).

对复合物体系的温度, 密度, 总能量和RMSD进行绘图:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">xmgrace</span> summary.DENSITY
<span style="color:#A2F">xmgrace</span> summary.TEMP
<span style="color:#A2F">xmgrace</span> summary.ETOT
<span style="color:#A2F">xmgrace</span> equil.rmsd
</pre></div>

结果如下:

- 密度

![](http://ambermd.org/tutorials/advanced/tutorial3/images/density.jpg)

- 温度

![](http://ambermd.org/tutorials/advanced/tutorial3/images/temperature.jpg)

- 总能量

![](http://ambermd.org/tutorials/advanced/tutorial3/images/total_energy.jpg)

- RMSD

![](http://ambermd.org/tutorials/advanced/tutorial3/images/equil_rmsd.jpg)

在平衡期结束时, 密度, 温度和总能量曲线都明显地收敛. 看起来开始稳定的RMSD似乎没有完全收敛, 但鉴于本教程的目的也是可以接受的. 在实际计算中, 根据体系的大小, 我们需要运行更长的平衡时间. 接下来我们将运行成品模拟.

## 2. 运行成品模拟获得轨迹快照集

运行成品模拟时应该使用与平衡的最后阶段相同的条件, 以防止由于模拟条件变化而引起的势能突变.

我们将运行总共2 ns的成品模拟, 每10 ps记录一次坐标. 10 ps的时间间隔足够大能保证结构彼此是不相关的. 取决于你研究的体系, 使用更小时间间隔的快照也可能获得好的结果. 只要你获得的所有结构彼此不相关, 快照数目越多, 结果的统计误差应该越低. 对于RAS-RAF复合物这样的体系, 2 ns的模拟时间可能太短, 不足以获得足够多的不相关快照以对平衡系综进行充分采样. 20 ns左右的模拟时长可能更合适. 但是, 2 ns对于本教程来说已经足够了.

输入文件[`prod.in`](http://ambermd.org/tutorials/advanced/tutorial3/files/prod.in)如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">prod.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>prod ras<span style="color: #666666">-</span>raf
 <span style="color: #666666">&amp;</span>cntrl
  imin<span style="color: #666666">=0</span>,irest<span style="color: #666666">=1</span>,ntx<span style="color: #666666">=5</span>,
  nstlim<span style="color: #666666">=250000</span>,dt<span style="color: #666666">=0.002</span>,
  ntc<span style="color: #666666">=2</span>,ntf<span style="color: #666666">=2</span>,
  cut<span style="color: #666666">=8.0</span>, ntb<span style="color: #666666">=2</span>, ntp<span style="color: #666666">=1</span>, taup<span style="color: #666666">=2.0</span>,
  ntpr<span style="color: #666666">=5000</span>, ntwx<span style="color: #666666">=5000</span>,
  ntt<span style="color: #666666">=3</span>, gamma_ln<span style="color: #666666">=2.0</span>,
  temp0<span style="color: #666666">=300.0</span>, ig<span style="color: #666666">=-1</span>,
 <span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

应该运行4次以获得2 ns的模拟时间. 由于这是一个简单的周期性边界的PME模拟, 如果需要可以使用`PMEMD`来进行模拟. `PMEMD`通常性能更好, 并且可以并行扩展. 下面是我在San Diego超算中心的Teragrid集群上使用96个核来运行上面的作业所用的PBS脚本[`run.x`](http://ambermd.org/tutorials/advanced/tutorial3/files/run.x):

<table class="highlighttable"><th colspan="2" style="text-align:left">run.x</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
16</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#SDSC Teragrid PBS Script</span>
<span style="color: #008800; font-style: italic">#PBS -j oe</span>
<span style="color: #008800; font-style: italic">#PBS -l nodes=48:ppn=2</span>
<span style="color: #008800; font-style: italic">#PBS -l walltime=12:00:00</span>
<span style="color: #008800; font-style: italic">#PBS -q dque</span>
<span style="color: #008800; font-style: italic">#PBS -V</span>
<span style="color: #008800; font-style: italic">#PBS -M name@email.com</span>
<span style="color: #008800; font-style: italic">#PBS -A account_no</span>
<span style="color: #008800; font-style: italic">#PBS -N run_pmemd_96</span>

<span style="color: #AA22FF">cd</span> /gpfs/projects/prod/
mpirun -v -machinefile <span style="color: #B8860B">$PBS_NODEFILE</span> -np <span style="color: #666666">96</span> /usr/local/apps/amber9/exe/pmemd -O -i prod.in -o prod1.out -p ras-raf_solvated.prmtop -c equil.rst -r prod1.rst -x prod1.mdcrd
mpirun -v -machinefile <span style="color: #B8860B">$PBS_NODEFILE</span> -np <span style="color: #666666">96</span> /usr/local/apps/amber9/exe/pmemd -O -i prod.in -o prod2.out -p ras-raf_solvated.prmtop -c prod1.rst -r prod2.rst -x prod2.mdcrd
mpirun -v -machinefile <span style="color: #B8860B">$PBS_NODEFILE</span> -np <span style="color: #666666">96</span> /usr/local/apps/amber9/exe/pmemd -O -i prod.in -o prod3.out -p ras-raf_solvated.prmtop -c prod2.rst -r prod3.rst -x prod3.mdcrd
mpirun -v -machinefile <span style="color: #B8860B">$PBS_NODEFILE</span> -np <span style="color: #666666">96</span> /usr/local/apps/amber9/exe/pmemd -O -i prod.in -o prod4.out -p ras-raf_solvated.prmtop -c prod3.rst -r prod4.rst -x prod4.mdcrd
gzip -9 prod*.mdcrd
</pre></div>
</td></tr></table>

下载输出文件: [`prod.tar.gz`(84.8 MB)](http://ambermd.org/tutorials/advanced/tutorial3/files/prod.tar.gz)

为了获得好的结果, 体系在成品模拟阶段仍然在探索平衡相空间至关重要. 我们将通过绘制密度, 温度, 总能量和蛋白骨架RMSD图来检查是否如此, 所用方法与平衡阶段最后的检查步骤一样.

下载数据文件: [密度](http://ambermd.org/tutorials/advanced/tutorial3/files/prod_summary.DENSITY), [温度](http://ambermd.org/tutorials/advanced/tutorial3/files/prod_summary.TEMP), [总能量](http://ambermd.org/tutorials/advanced/tutorial3/files/prod_summary.ETOT), [RMSD](http://ambermd.org/tutorials/advanced/tutorial3/files/measure_prod_rmsd.ptraj)

绘图结果如下:

- 密度

![](http://ambermd.org/tutorials/advanced/tutorial3/images/prod_density.jpg)

- 温度

![](http://ambermd.org/tutorials/advanced/tutorial3/images/prod_temperature.jpg)

- 总能量

![](http://ambermd.org/tutorials/advanced/tutorial3/images/prod_etot.jpg)

- 骨架RMSD

![](http://ambermd.org/tutorials/advanced/tutorial3/images/prod_rmsd.jpg)

从成品模拟RMSD的波动趋势上看, 体系还没有达到平衡状态, 但其他性质基本上是恒定的(注意纵轴标尺的大小). 理想情况下, 我们应该延长成品模拟的时长(约20 ns). 然而, 鉴于本教程的目的, 我们就使用2 ns的轨迹进行下面的步骤.

在下一节中我们将计算结合自由能, 可采用的方式有两种: 第一种使用(需要先安装)Python脚本`MMPBSA.py`, 第二种使用Perl脚本`mm_pbsa.pl`.

## 3. 计算结合自由能并分析结果

## 使用Perl脚本`mm_pbsa.pl`计算结合自由能

我们需要从成品模拟轨迹中抽取快照(不含溶剂水)用于MM-PBSA计算. `mm_pbsa.pl`脚本(位于`$AMBERHOME/bin`目录)可以自动完成这个提取过程. 请注意, 如果没有安装`gzcat`, 则需要在运行`mm_pbsa`之前将轨迹文件解压缩. 我们必须提供如下的输入文件[`extract_coords.mmpbsa`](http://ambermd.org/tutorials/advanced/tutorial3/files/extract_coords.mmpbsa)(下载的文件中包含对每项的解释说明):

<table class="highlighttable"><th colspan="2" style="text-align:left">extract_coords.mmpbsa</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
36</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>@GENERAL

PREFIX                  snapshot
PATH                    <span style="color: #666666">./</span>
COMPLEX                 <span style="color: #666666">1</span>
RECEPTOR                <span style="color: #666666">1</span>
LIGAND                  <span style="color: #666666">1</span>
COMPT                   <span style="color: #666666">./</span>ras<span style="color: #666666">-</span>raf<span style="color: #666666">.</span>prmtop
RECPT                   <span style="color: #666666">./</span>ras<span style="color: #666666">.</span>prmtop
LIGPT                   <span style="color: #666666">./</span>raf<span style="color: #666666">.</span>prmtop
GC                      <span style="color: #666666">1</span>
AS                      <span style="color: #666666">0</span>
DC                      <span style="color: #666666">0</span>
MM                      <span style="color: #666666">0</span>
GB                      <span style="color: #666666">0</span>
PB                      <span style="color: #666666">0</span>
MS                      <span style="color: #666666">0</span>
NM                      <span style="color: #666666">0</span>
@MAKECRD
BOX                     YES
NTOTAL                  <span style="color: #666666">42193</span>
NSTART                  <span style="color: #666666">1</span>
NSTOP                   <span style="color: #666666">200</span>
NFREQ                   <span style="color: #666666">1</span>
NUMBER_LIG_GROUPS       <span style="color: #666666">1</span>
LSTART                  <span style="color: #666666">2622</span>
LSTOP                   <span style="color: #666666">3862</span>
NUMBER_REC_GROUPS       <span style="color: #666666">1</span>
RSTART                  <span style="color: #666666">1</span>
RSTOP                   <span style="color: #666666">2621</span>
@TRAJECTORY
TRAJECTORY              <span style="color: #666666">./</span>prod1<span style="color: #666666">.</span>mdcrd
TRAJECTORY              <span style="color: #666666">./</span>prod2<span style="color: #666666">.</span>mdcrd
TRAJECTORY              <span style="color: #666666">./</span>prod3<span style="color: #666666">.</span>mdcrd
TRAJECTORY              <span style="color: #666666">./</span>prod4<span style="color: #666666">.</span>mdcrd
@PROGRAMS
</pre></div>
</td></tr></table>

该文件中指定了哪些原子属于受体, 配体和复合物, 并指定了对应于未溶剂化结构的`prmtop`文件, 轨迹中的快照总数, 提取步长和轨迹文件的名称. 我们还指定了每个输出文件都以`snapshot`作为前缀. 在本教程中, 我们定义`RAS`为受体, `RAF`为配体. 这单纯只是一个命名约定而已. 运行命令如下:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/mm_pbsa.pl</span> extract_coords.mmpbsa > extract_coords.log
</pre></div>

此命令需要几分钟才能完成. 输出文件如下: [`extract_coords.tar.gz`(14 MB)](http://ambermd.org/tutorials/advanced/tutorial3/files/extract_coords.tar.gz)

如果发现任何错误, 可以检查日志文件, 同时确保盒子尺寸看起来合理. 如果发现盒子尺寸不合理, 可能是由于选择的原子数目有误或轨迹文件发生损坏.

基于已经提取出的快照, 我们可以计算复合物, 受体和配体的相互作用能和溶剂化自由能, 并对结果进行平均以获得结合自由能的估计值. 请注意, 在本教程中, 我们不会计算熵对结合能的贡献, 所以严格地说, 我们的结果并不是真正的自由能, 但可以用于比较相似的体系. 例如. 可以分析沿结合界面的氨基酸点突变的效果. 关于此的通常做法称为丙氨酸扫描.

作为演示, 我们将用`MM_PBSA`方法和`MM_GBSA`方法计算结合能, 这是通过`mm_pbsa.pl`的如下输入文件[`binding_energy.mmpbsa`](http://ambermd.org/tutorials/advanced/tutorial3/files/binding_energy.mmpbsa)实现的(下载的文件中有注释):

<table class="highlighttable"><th colspan="2" style="text-align:left">binding_energy.mmpbsa</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
52</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>VERBOSE               <span style="color: #666666">0</span>
PARALLEL              <span style="color: #666666">0</span>
PREFIX                snapshot
PATH                  <span style="color: #666666">./</span>
START                 <span style="color: #666666">1</span>
STOP                  <span style="color: #666666">200</span>
OFFSET                <span style="color: #666666">1</span>
COMPLEX               <span style="color: #666666">1</span>
RECEPTOR              <span style="color: #666666">1</span>
LIGAND                <span style="color: #666666">1</span>
COMPT                 <span style="color: #666666">./</span>ras<span style="color: #666666">-</span>raf<span style="color: #666666">.</span>prmtop
RECPT                 <span style="color: #666666">./</span>ras<span style="color: #666666">.</span>prmtop
LIGPT                 <span style="color: #666666">./</span>raf<span style="color: #666666">.</span>prmtop
GC                    <span style="color: #666666">0</span>
AS                    <span style="color: #666666">0</span>
DC                    <span style="color: #666666">0</span>
MM                    <span style="color: #666666">1</span>
GB                    <span style="color: #666666">1</span>
PB                    <span style="color: #666666">1</span>
MS                    <span style="color: #666666">1</span>
NM                    <span style="color: #666666">0</span>
@PB
PROC                  <span style="color: #666666">2</span>
REFE                  <span style="color: #666666">0</span>
INDI                  <span style="color: #666666">1.0</span>
EXDI                  <span style="color: #666666">80.0</span>
SCALE                 <span style="color: #666666">2</span>
LINIT                 <span style="color: #666666">1000</span>
ISTRNG                <span style="color: #666666">0.0</span>
RADIOPT               <span style="color: #666666">0</span>
ARCRES                <span style="color: #666666">0.0625</span>
INP                   <span style="color: #666666">1</span>
SURFTEN               <span style="color: #666666">0.005</span>
SURFOFF               <span style="color: #666666">0.00</span>
IVCAP                 <span style="color: #666666">0</span>
CUTCAP                <span style="color: #666666">-1.0</span>
XCAP                  <span style="color: #666666">0.0</span>
YCAP                  <span style="color: #666666">0.0</span>
ZCAP                  <span style="color: #666666">0.0</span>
@MM
DIELC                 <span style="color: #666666">1.0</span>
@GB
IGB                   <span style="color: #666666">2</span>
GBSA                  <span style="color: #666666">1</span>
SALTCON               <span style="color: #666666">0.00</span>
EXTDIEL               <span style="color: #666666">80.0</span>
INTDIEL               <span style="color: #666666">1.0</span>
SURFTEN               <span style="color: #666666">0.005</span>
SURFOFF               <span style="color: #666666">0.00</span>
@MS
PROBE                 <span style="color: #666666">0.0</span>
@PROGRAMS
</pre></div>
</td></tr></table>

该输入文件的各个部分指定了需要运行的计算, 计算时需要的文件以及计算结合自由能的不同贡献时所需要的所有特殊参数. 如果你打开下载的文件, 可以看到其中对不同项的解释说明.
 不同参数的数值是根据经验数据确定的, 有待于当前研究的验证. 对于非极性溶剂化自由能的计算, [`Recommendation_setting.pdf`文件](http://ambermd.org/tutorials/advanced/tutorial3/files/recommended_settings.pdf)给出当前的推荐设置. 计算结合自由能的示例输入文件以及常用的参数设置可以在`$AMBERHOME/AmberTools/src/mm_pbsa/Examples/TEMPLATE_INPUT_SCRIPTS`目录中找到. 更多信息请参考相关文献. 请注意, 早期版本的AMBER需要额外的Poisson-Boltzmann求解器, 如DelPhi, 但自AMBER 8起可以使用自带的PBSA程序. 这个程序计算速度有了明显提高, 并且更容易整合到AMBER中. 你可以使用如下命令运行:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/mm_pbsa.pl</span> binding_energy.mmpbsa > binding_energy.log
</pre></div>

可以使用如下命令监控计算进度:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">tail</span> <span style="color:#666">-f</span> binding_energy.log
</pre></div>

该计算大约需要2个小时才能完成(P4 3.2 GHz). 对600帧快照中的每一帧进行PBSA计算耗费了大部分时间. GBSA计算部分几秒钟内就能完成. 为了加快计算, 可以在`PARALLEL`下指定可用的处理器的数目, 这样mm_pbsa分析就可以并行, 能同时处理多个快照.

计算结束后, 会得到下列输出文件: [`binding_energy.log`](http://ambermd.org/tutorials/advanced/tutorial3/files/binding_energy.log), [`snapshot_statistics.out`](http://ambermd.org/tutorials/advanced/tutorial3/files/snapshot_statistics.out), [`snapshot_com.all.out`](http://ambermd.org/tutorials/advanced/tutorial3/files/snapshot_com.all.out), [`snapshot_rec.all.out`](http://ambermd.org/tutorials/advanced/tutorial3/files/snapshot_rec.all.out), [`snapshot_lig.all.out`](http://ambermd.org/tutorials/advanced/tutorial3/files/snapshot_lig.all.out)

`binding_energy.log`文件只显示了计算是否成功完成. `all.out`文件给出了每个物种每一快照的单独的能量贡献, 而`statistics.out`文件包含了平均结合自由能的最终结果:

<table class="highlighttable"><th colspan="2" style="text-align:left">snapshot_statistics.out</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
37</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>#                  COMPLEX                RECEPTOR                  LIGAND
#          <span style="color: #666666">-----------------------</span> <span style="color: #666666">-----------------------</span> <span style="color: #666666">-----------------------</span>
#                  MEAN        STD         MEAN        STD         MEAN        STD
#          <span style="color: #666666">=======================</span> <span style="color: #666666">=======================</span> <span style="color: #666666">=======================</span>
ELE            <span style="color: #666666">-8656.78</span>      <span style="color: #666666">70.18</span>     <span style="color: #666666">-5602.09</span>      <span style="color: #666666">63.10</span>     <span style="color: #666666">-2102.25</span>      <span style="color: #666666">52.57</span>
VDW             <span style="color: #666666">-984.99</span>      <span style="color: #666666">24.34</span>      <span style="color: #666666">-661.18</span>      <span style="color: #666666">20.33</span>      <span style="color: #666666">-256.02</span>      <span style="color: #666666">12.93</span>
INT             <span style="color: #666666">5085.33</span>      <span style="color: #666666">50.22</span>      <span style="color: #666666">3449.57</span>      <span style="color: #666666">38.65</span>      <span style="color: #666666">1635.76</span>      <span style="color: #666666">29.42</span>
GAS            <span style="color: #666666">-4556.44</span>      <span style="color: #666666">75.96</span>     <span style="color: #666666">-2813.70</span>      <span style="color: #666666">65.21</span>      <span style="color: #666666">-722.52</span>      <span style="color: #666666">53.50</span>
PBSUR             <span style="color: #666666">65.09</span>       <span style="color: #666666">1.05</span>        <span style="color: #666666">45.25</span>       <span style="color: #666666">0.64</span>        <span style="color: #666666">27.24</span>       <span style="color: #666666">0.46</span>
PBCAL          <span style="color: #666666">-3223.64</span>      <span style="color: #666666">58.68</span>     <span style="color: #666666">-2490.86</span>      <span style="color: #666666">48.73</span>     <span style="color: #666666">-1671.27</span>      <span style="color: #666666">47.46</span>
PBSOL          <span style="color: #666666">-3158.55</span>      <span style="color: #666666">58.26</span>     <span style="color: #666666">-2445.62</span>      <span style="color: #666666">48.45</span>     <span style="color: #666666">-1644.03</span>      <span style="color: #666666">47.31</span>
PBELE         <span style="color: #666666">-11880.42</span>      <span style="color: #666666">34.25</span>     <span style="color: #666666">-8092.96</span>      <span style="color: #666666">29.34</span>     <span style="color: #666666">-3773.52</span>      <span style="color: #666666">17.30</span>
PBTOT          <span style="color: #666666">-7714.99</span>      <span style="color: #666666">48.25</span>     <span style="color: #666666">-5259.32</span>      <span style="color: #666666">36.97</span>     <span style="color: #666666">-2366.55</span>      <span style="color: #666666">26.61</span>
GBSUR             <span style="color: #666666">65.09</span>       <span style="color: #666666">1.05</span>        <span style="color: #666666">45.25</span>       <span style="color: #666666">0.64</span>        <span style="color: #666666">27.24</span>       <span style="color: #666666">0.46</span>
GB             <span style="color: #666666">-3407.82</span>      <span style="color: #666666">58.49</span>     <span style="color: #666666">-2631.83</span>      <span style="color: #666666">50.08</span>     <span style="color: #666666">-1731.06</span>      <span style="color: #666666">47.68</span>
GBSOL          <span style="color: #666666">-3342.74</span>      <span style="color: #666666">58.15</span>     <span style="color: #666666">-2586.58</span>      <span style="color: #666666">49.83</span>     <span style="color: #666666">-1703.82</span>      <span style="color: #666666">47.55</span>
GBELE         <span style="color: #666666">-12064.60</span>      <span style="color: #666666">26.94</span>     <span style="color: #666666">-8233.92</span>      <span style="color: #666666">23.57</span>     <span style="color: #666666">-3833.31</span>      <span style="color: #666666">13.40</span>
GBTOT          <span style="color: #666666">-7899.17</span>      <span style="color: #666666">47.07</span>     <span style="color: #666666">-5400.28</span>      <span style="color: #666666">35.65</span>     <span style="color: #666666">-2426.34</span>      <span style="color: #666666">26.80</span>

#                    DELTA
#          <span style="color: #666666">-----------------------</span>
#                  MEAN        STD
#          <span style="color: #666666">=======================</span>
ELE             <span style="color: #666666">-952.43</span>      <span style="color: #666666">44.10</span>
VDW              <span style="color: #666666">-67.79</span>       <span style="color: #666666">5.18</span>
INT               <span style="color: #666666">-0.00</span>       <span style="color: #666666">0.00</span>
GAS            <span style="color: #666666">-1020.22</span>      <span style="color: #666666">44.58</span>
PBSUR             <span style="color: #666666">-7.40</span>       <span style="color: #666666">0.41</span>
PBCAL            <span style="color: #666666">938.50</span>      <span style="color: #666666">42.51</span>
PBSOL            <span style="color: #666666">931.09</span>      <span style="color: #666666">42.31</span>
PBELE            <span style="color: #666666">-13.94</span>       <span style="color: #666666">9.43</span>
PBTOT            <span style="color: #666666">-89.13</span>       <span style="color: #666666">7.94</span>
GBSUR             <span style="color: #666666">-7.40</span>       <span style="color: #666666">0.41</span>
GB               <span style="color: #666666">955.07</span>      <span style="color: #666666">41.30</span>
GBSOL            <span style="color: #666666">947.66</span>      <span style="color: #666666">41.10</span>
GBELE              <span style="color: #666666">2.63</span>       <span style="color: #666666">7.41</span>
GBTOT            <span style="color: #666666">-72.56</span>       <span style="color: #666666">6.40</span>
</pre></div>
</td></tr></table>

该文件中不同项的含义如下:

- `ELE`: 由分子力场(MM)计算的静电能
- `VDW`: 来自MM的范德华贡献
- `INT`: MM力场中由键, 角和二面角项引起的内能(在单轨迹方法中该项总是等于零)
- `GAS`: 总的气相能量(`ELE`, `VDW`和`INT`的总和)
- `PBSUR/GBSUR`: 由经验模型计算的溶剂化自由能中的非极性贡献
- `PBCAL/GB`: 分别由PB或GB计算的溶剂化自由能中的静电贡献
- `PBSOL/GBSOL`: 溶剂化的非极性和极性贡献之和
- `PBELE/GBELE`: 静电溶剂化自由能和MM静电能的总和
- `PBTOT/GBTOT`: 根据上述项得出的最终结合自由能的估计(kcal/mol)

值得注意的是, 通常情况下, 结合自由能的主要贡献来自`ELE`, `PBCAL/GBCAL`和`VDW`部分, 前两项大致相互抵消, 这可以通过查看`PBELE/GBELE`的值是否远小于`ELE`或`PBCAL/GBCAL`对它的贡献进行检查.

通常我们会期望能发现非常有利的静电能和不利的溶剂化自由能, 这意味着结合粒子去溶剂化并对齐到结合界面的能量.

总结合自由能-89.13 kcal/mol为负值, 这表明在纯水中, 该蛋白-蛋白复合体的结合是有利的. 但是, 要记住, 该结果并不等于真正的结合自由能, 因为我们没有考虑(不利的)熵对结合自由能的贡献. 注意到, GB方法给出的结合能稍低, 但仍然表明这是一个有利的结合状态.

若要扩展本教程, 可以研究更改溶剂的盐含量, 修改特定残基或选择不同的起始结构对于结合自由能的影响. 另外, 也可以考虑利用`nmode`来计算熵变, 但要注意, 对于这种规模的复合物来说, 计算熵将会耗费大量的内存和时间.

## 利用Python脚本MMPBSA.py计算结合自由能

![](http://ambermd.org/tutorials/advanced/tutorial3/images/ras-raf.jpg) ![](http://ambermd.org/tutorials/advanced/tutorial3/images/est_rec.jpg)

在本教程中, 我们将演示使用AmberTools中发布的MM-PBSA方法计算结合自由能, 运行丙氨酸扫描, 进行简正模式分析以计算熵变. 教程分为如下几部分:

### 3.1 计算蛋白-蛋白复合物(Ras-Raf)的结合自由能

本小节中, 我们将模拟人类H-Ras蛋白与结合于Ras结合结构域的C-Raf1形成的复合物(Ras-Raf), 该复合物是信号转导级联的中心. 部分平衡的经过预处理的RAS-RAF复合体的pdb结构如下图所示. 该结构中含有ras和raf蛋白, 另外还有一个生理必需的GTP核酸.

![](http://ambermd.org/tutorials/advanced/tutorial3/images/ras-raf2.jpg)

关于如何构建初始结构和运行动力学模拟以获得平衡体系, 请参考前面几节.

使用`MMPBSA.py`计算结合自由能的重要文件是拓扑文件和mdcrd文件([`ras-raf_top_mdcrd.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras-raf_top_mdcrd.tgz)).

我们现在将计算复合物, 受体和配体的相互作用能和溶剂化自由能, 并对结果进行平均以获得结合自由能的估计值. 请注意, 在教程的这一部分我们不计算熵对结合能的贡献, 因此严格来说, 所得的结果并不是真正的自由能, 但可以用来对相似的体系进行比较. 有关使用简正模式分析(Nmode)计算体系的熵贡献, 可参考3.5节. 也可以取消下面输入文件中`&general`命名列表中最后一行的注释, 以便使用AMBER的`ptraj`模块进行准简谐熵计算.

我们将分别使用MM-GBSA方法和MM-PBSA方法进行结合自由能的计算并进行比较. 以下为`MMPBSA.py`的输入文件[`mmpbsa.in`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/mmpbsa_1b.in):

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #AA22FF">Input</span> file for running PB <span style="color: #AA22FF; font-weight: bold">and</span> GB
<span style="color: #666666">&amp;</span>general
   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
#   entropy<span style="color: #666666">=1</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>gb
  igb<span style="color: #666666">=2</span>, saltcon<span style="color: #666666">=0.100</span>
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>pb
  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

`MMPBSA.py`的输入文件与AMBER的`sander`模块所用的`mdin`输入文件类似. 每个命名列表都是以`&`符号开始, 后面跟着命名列表的名称. 另外, 反斜线(`/`)或`&end`可用于结束命名列表. 有关所有变量的完整列表, 请参阅AMBER手册或在终端输入`$AMBERHOME/bin/MMPBSA.py --input-file-help`. `mmpbsa.in`被分成三个命名列表: `general`, `pb`和`gb`. `general`命名列表旨在指定并非仅适用于计算的特定部分, 而是针对所有部分的变量. 在本教程中, 我们将`RAS`定义为受体, `RAF`定义为配体. `endframe`变量设置轨迹`mdcrd`中要停止的帧. `&gb`和`&pb`命名列表中给出了用于MM-GBSA和MM-PBSA计算的参数值. `verbose`变量用于指定输出文件的详细程度.

使用如下命令运行文件:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/MMPBSA.py</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> mmpbsa.in <span style="color:#666">-o</span> FINAL_RESULTS_MMPBSA.dat <span style="color:#666">-sp</span> ras-raf_solvated.prmtop <span style="color:#666">-cp</span> ras-raf.prmtop <span style="color:#666">-rp</span> ras.prmtop <span style="color:#666">-lp</span> raf.prmtop <span style="color:#666">-y</span> *.mdcrd
</pre></div>

这将交互式地运行脚本, 并将计算进度输出至标准输出终端, 将任何错误或警告输出至标注错误终端. 最后, 计算完成后会在终端上输出总耗时以及计算过程中每一步骤的耗时.

另外, 命令行参数可以用shell识别的通配符(即bash的`*`和`?`). 例如, 命令行中的`-y *.mdcrd`会告知程序读入工作目录中所有以`.mdcrd`结尾的文件, 并将其作为待分析的轨迹.

下载脚本生成的输出文件: [`pb_gb_output1.tgz.](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/pb_gb_output1.tgz)

脚本使用`ptraj`生成了三个非溶剂化的mdcrd文件(复合物, 受体, 配体), 它们是在GB和PB计算过程中分析过的坐标. `*.mdout`文件包含所有指定帧的能量.
还会生成一个平均结构的PDB文件, 其中的结构(通过RMS)对齐到所有快照. 如果需要, 可以使用`ptraj`对这个结构进行准简谐熵计算. `MMPBSA.py`生成的所有文件的名称均以前缀`_MMPBSA_`开始, 除了最终的输出文件[`FINAL_RESULTS_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_RESULTS_MMPBSA_pbgb1.dat)之外:

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_RESULTS_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">  1
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
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Thu Feb <span style="color: #666666">11</span> <span style="color: #666666">12:18:37</span> EST <span style="color: #666666">2010</span>

<span style="color: #666666">|</span>Input file<span style="color: #666666">:</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Input file for running PB <span style="color: #AA22FF; font-weight: bold">and</span> GB
<span style="color: #666666">|&amp;</span>general
<span style="color: #666666">|</span>   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">|</span>#   entropy<span style="color: #666666">=1</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>gb
<span style="color: #666666">|</span>  igb<span style="color: #666666">=2</span>, saltcon<span style="color: #666666">=0.100</span>
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>pb
<span style="color: #666666">|</span>  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Solvated complex topology file<span style="color: #666666">:</span>  ras<span style="color: #666666">-</span>raf_solvated<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Complex topology file<span style="color: #666666">:</span>           ras<span style="color: #666666">-</span>raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Receptor topology file<span style="color: #666666">:</span>          ras<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Ligand topology file<span style="color: #666666">:</span>            raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Initial mdcrd(s)<span style="color: #666666">:</span>                prod<span style="color: #666666">.</span>mdcrd
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Best guess for receptor mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:1-166&quot;</span>
<span style="color: #666666">|</span>Best guess for  ligand  mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:167-242&quot;</span>

<span style="color: #666666">|</span>Calculations performed using <span style="color: #666666">50</span> frames<span style="color: #666666">.</span>
<span style="color: #666666">|</span>Poisson Boltzmann calculations performed using internal PBSA solver <span style="color: #AA22FF; font-weight: bold">in</span> sander<span style="color: #666666">.</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>All units are reported <span style="color: #AA22FF; font-weight: bold">in</span> kcal<span style="color: #666666">/</span>mole<span style="color: #666666">.</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

GENERALIZED BORN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">17.1704</span>              <span style="color: #666666">2.4283</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.9366</span>             <span style="color: #666666">10.7391</span>
EGB                      <span style="color: #666666">-3249.6511</span>               <span style="color: #666666">65.2075</span>              <span style="color: #666666">9.2217</span>
ESURF                       <span style="color: #666666">91.3565</span>                <span style="color: #666666">1.3938</span>              <span style="color: #666666">0.1971</span>

G gas                   <span style="color: #666666">-19064.5240</span>               <span style="color: #666666">77.8536</span>             <span style="color: #666666">11.0102</span>
G solv                   <span style="color: #666666">-3158.2946</span>               <span style="color: #666666">65.2224</span>              <span style="color: #666666">9.2238</span>

TOTAL                   <span style="color: #666666">-22222.8186</span>               <span style="color: #666666">51.0216</span>              <span style="color: #666666">7.2155</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.2342</span>              <span style="color: #666666">2.0130</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">71.7127</span>             <span style="color: #666666">10.1417</span>
EGB                      <span style="color: #666666">-2532.0669</span>               <span style="color: #666666">57.7003</span>              <span style="color: #666666">8.1600</span>
ESURF                       <span style="color: #666666">64.2843</span>                <span style="color: #666666">1.1143</span>              <span style="color: #666666">0.1576</span>

<span style="#FF0000">　</span>
G gas                   <span style="color: #666666">-12825.2661</span>               <span style="color: #666666">73.1118</span>             <span style="color: #666666">10.3396</span>
G solv                   <span style="color: #666666">-2467.7826</span>               <span style="color: #666666">57.7110</span>              <span style="color: #666666">8.1616</span>

TOTAL                   <span style="color: #666666">-15293.0487</span>               <span style="color: #666666">35.3527</span>              <span style="color: #666666">4.9996</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EGB                      <span style="color: #666666">-1688.9631</span>               <span style="color: #666666">26.5353</span>              <span style="color: #666666">3.7527</span>
ESURF                       <span style="color: #666666">37.0493</span>                <span style="color: #666666">0.6185</span>              <span style="color: #666666">0.0875</span>

<span style="#FF0000">　</span>
G gas                    <span style="color: #666666">-5213.7811</span>               <span style="color: #666666">37.3522</span>              <span style="color: #666666">5.2824</span>
G solv                   <span style="color: #666666">-1651.9138</span>               <span style="color: #666666">26.5425</span>              <span style="color: #666666">3.7537</span>

TOTAL                    <span style="color: #666666">-6865.6949</span>               <span style="color: #666666">25.8878</span>              <span style="color: #666666">3.6611</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2751</span>              <span style="color: #666666">0.6046</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.9190</span>              <span style="color: #666666">4.9383</span>
EGB                        <span style="color: #666666">971.3789</span>               <span style="color: #666666">33.0497</span>              <span style="color: #666666">4.6739</span>
ESURF                       <span style="color: #666666">-9.9770</span>                <span style="color: #666666">0.3759</span>              <span style="color: #666666">0.0532</span>

<span style="#FF0000">　</span>
DELTA G gas              <span style="color: #666666">-1025.4769</span>               <span style="color: #666666">35.1797</span>              <span style="color: #666666">4.9752</span>
DELTA G solv               <span style="color: #666666">961.4018</span>               <span style="color: #666666">33.0518</span>              <span style="color: #666666">4.6742</span>

<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-64.0750</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">6.3729</span>                 <span style="color: #666666">0.9013</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

POISSON BOLTZMANN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">17.1704</span>              <span style="color: #666666">2.4283</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.9366</span>             <span style="color: #666666">10.7391</span>
EPB                      <span style="color: #666666">-3207.7160</span>               <span style="color: #666666">66.4023</span>              <span style="color: #666666">9.3907</span>
ECAVITY                     <span style="color: #666666">67.8762</span>                <span style="color: #666666">0.7818</span>              <span style="color: #666666">0.1106</span>

G gas                   <span style="color: #666666">-19064.5240</span>             <span style="color: #666666">6061.1875</span>            <span style="color: #666666">857.1813</span>
G solv                   <span style="color: #666666">-3139.8399</span>               <span style="color: #666666">66.4069</span>              <span style="color: #666666">9.3914</span>

TOTAL                    <span style="color: #666666">-7686.8660</span>               <span style="color: #666666">52.5400</span>              <span style="color: #666666">7.4303</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.2342</span>              <span style="color: #666666">2.0130</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">71.7127</span>             <span style="color: #666666">10.1417</span>
EPB                      <span style="color: #666666">-2483.7242</span>               <span style="color: #666666">56.4551</span>              <span style="color: #666666">7.9840</span>
ECAVITY                     <span style="color: #666666">47.1495</span>                <span style="color: #666666">0.4737</span>              <span style="color: #666666">0.0670</span>

G gas                   <span style="color: #666666">-12825.2661</span>             <span style="color: #666666">5345.3320</span>            <span style="color: #666666">755.9441</span>
G solv                   <span style="color: #666666">-2436.5747</span>               <span style="color: #666666">56.4571</span>              <span style="color: #666666">7.9842</span>

TOTAL                    <span style="color: #666666">-5250.2060</span>               <span style="color: #666666">38.5188</span>              <span style="color: #666666">5.4474</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EPB                      <span style="color: #666666">-1670.4169</span>               <span style="color: #666666">27.6694</span>              <span style="color: #666666">3.9131</span>
ECAVITY                     <span style="color: #666666">28.0328</span>                <span style="color: #666666">0.4133</span>              <span style="color: #666666">0.0584</span>

G gas                    <span style="color: #666666">-5213.7811</span>             <span style="color: #666666">1395.1865</span>            <span style="color: #666666">197.3092</span>
G solv                   <span style="color: #666666">-1642.3841</span>               <span style="color: #666666">27.6725</span>              <span style="color: #666666">3.9135</span>

TOTAL                    <span style="color: #666666">-2350.3020</span>               <span style="color: #666666">25.1197</span>              <span style="color: #666666">3.5525</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2751</span>              <span style="color: #666666">0.6046</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.9190</span>              <span style="color: #666666">4.9383</span>
EPB                        <span style="color: #666666">946.4251</span>               <span style="color: #666666">34.5128</span>              <span style="color: #666666">4.8808</span>
ECAVITY                     <span style="color: #666666">-7.3062</span>                <span style="color: #666666">0.3004</span>              <span style="color: #666666">0.0425</span>

DELTA G gas              <span style="color: #666666">-1025.4769</span>             <span style="color: #666666">1237.6138</span>            <span style="color: #666666">175.0250</span>
DELTA G solv               <span style="color: #666666">939.1189</span>               <span style="color: #666666">34.5141</span>              <span style="color: #666666">4.8810</span>

<span style="#FF0000">　</span>
<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-86.3579</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">8.3264</span>                 <span style="color: #666666">1.1775</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

<span style="color: #A0A000">WARNINGS:</span>
igb<span style="color: #666666">=2</span> should be used with mbondi2 pbradii set<span style="color: #666666">.</span> Yours are modified Bondi radii (mbondi)
</pre></div>
</td></tr></table>

统计文件的开始部分包括日期/时间, 基于给定值和文件的任何警告, `mmpbsa.in`输入文件内容, 脚本所用的文件的名称, 分析的帧数以及使用了哪个PB求解器(如果使用的话). 统计文件的其余内容包括所有的平均能量, 标准偏差和平均值的标准误差, 先列出GB对应的值, 再列出PB对应的值. 每个部分之后, 会给出结合自由能ΔG及误差. 文件中不同项的含义如下:

- `VDWAALS`: 来自分子力场(MM)的范德华贡献
- `EEL`: 由MM力场计算的静电能
- `EPB/EGB`: 分别由PB或GB计算的静电对溶剂化自由能的贡献
- `ECAVITY`: 通过经验模型计算的非极性对溶剂化自由能的贡献
- `DELTA G binding`: 根据上面各项计算出的最终结合自由能的估计值(kcal/mol)

值得注意的是, 结果中并未报告总的气相能量, 因为使用单一轨迹计算方法时, 受体和配体的成键势能项的值会精确地与复合体中的对应值互相抵消. 如果这两项能量在允许的误差范围内不能抵消, 将会给出错误信息.

通常我们会期望能发现非常有利的静电能和不利的溶剂化自由能, 这意味着结合粒子去溶剂化并对齐到结合界面的能量.

总结合自由能-86.36 kcal/mol为负值, 这表明在纯水中, 该蛋白-蛋白复合体的结合是有利的. 但是, 要记住, 该结果并不等于真正的结合自由能, 因为我们没有考虑(不利的)熵对结合自由能的贡献. 注意到, GB方法给出的结合能稍低, 但仍然表明这是一个有利的结合状态.

### 3.2 使用三个处理器并行计算Ras-Raf的结合自由能

在本节中, 我们将并行地计算结合自由能. `MMPBSA.py.MPI`通过为每个线程(进程)分配相同数目的帧进行并行化计算. 因此, 当处理的帧数是所启动的线程数的倍数时, 它的运行效率最高. 但是, 这并不是必须的. 如果帧数不是线程数的倍数, 则"剩余"帧将在启动线程数的一个子集中均匀分配. 例如, 在3个线程上计算50帧将导致2个线程计算17帧, 最后一个线程只计算16帧. 因此, 第三个线程将不得不等待前两个线程完成计算后才能继续进行下面的计算. 出于这个原因, 使用5个线程将是更明智的选择(每个线程处理10帧). 但是, 线程数不能超过要处理的帧数, 否则`MMPBSA.py.MPI`将会终止, 给出错误信息. `MMPBSA.py.MPI`的输入文件与`MMPBSA.py`的输入文件完全相同:

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #AA22FF">Input</span> file for running PB <span style="color: #AA22FF; font-weight: bold">and</span> GB
<span style="color: #666666">&amp;</span>general
   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
#  entropy<span style="color: #666666">=1</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>gb
  igb<span style="color: #666666">=2</span>, saltcon<span style="color: #666666">=0.100</span>
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>pb
  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

运行命令如下:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">mpirun</span> <span style="color:#666">-np</span> 4 $AMBERHOME/bin/MMPBSA.py.MPI <span style="color:#666">-O</span> <span style="color:#666">-i</span> mmpbsa.in <span style="color:#666">-o</span> FINAL_RESULTS_MMPBSA.dat <span style="color:#666">-sp</span> ras-raf_solvated.prmtop <span style="color:#666">-cp</span> ras-raf.prmtop <span style="color:#666">-rp</span> ras.prmtop <span style="color:#666">-lp</span> raf.prmtop <span style="color:#666">-y</span> *.mdcrd > progress.log 2>&1
</pre></div>

或者使用下面的命令将作业脚本提交到排队系统, 如PBS系统:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">qsub</span> parallel.job
</pre></div>

作业脚本[`parallel.job`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/parallel.job)内容如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">parallel.job</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
13</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#!/bin/sh</span>
<span style="color: #008800; font-style: italic">#PBS -N rasraf_parallel</span>
<span style="color: #008800; font-style: italic">#PBS -o parallel.out</span>
<span style="color: #008800; font-style: italic">#PBS -e parallel.err</span>
<span style="color: #008800; font-style: italic">#PBS -m abe</span>
<span style="color: #008800; font-style: italic">#PBS -M email@address.com</span>
<span style="color: #008800; font-style: italic">#PBS -q brute</span>
<span style="color: #008800; font-style: italic">#PBS -l nodes=1:node:ppn=4</span>
<span style="color: #008800; font-style: italic">#PBS -l pmem=900mb</span>

<span style="color: #AA22FF">cd</span> <span style="color: #B8860B">$PBS_O_WORKDIR</span>

mpirun -np <span style="color: #666666">4</span> MMPBSA.py.MPI -O -i mmpbsa.in -o FINAL_RESULTS_MMPBSA.dat -sp ras-raf_solvated.prmtop -cp ras-raf.prmtop -rp ras.prmtop -lp raf.prmtop -y bigprod.mdcrd &gt; progress.log 2&gt;&amp;1
</pre></div>
</td></tr></table>

计算进度会输出到文件[`progress.log`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/progress.log). 计算过程中的所有错误也会输出到这个文件中(这是`2>&1`的目的). 最后, 计算完成后会显示每个步骤所用的时间.

<table class="highlighttable"><th colspan="2" style="text-align:left">progress.log</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
25</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>MMPBSA<span style="color: #666666">.</span>py<span style="color: #666666">.</span>MPI being run on <span style="color: #666666">4</span> processors
ptraj found<span style="color: #666666">!</span> Using <span style="color: #666666">/</span>scr<span style="color: #666666">/</span>arwen_3<span style="color: #666666">/</span>swails<span style="color: #666666">/</span>i686<span style="color: #666666">/</span>amber11<span style="color: #666666">/</span>exe<span style="color: #666666">/</span>ptraj
sander found<span style="color: #666666">!</span> Using <span style="color: #666666">/</span>scr<span style="color: #666666">/</span>arwen_3<span style="color: #666666">/</span>swails<span style="color: #666666">/</span>i686<span style="color: #666666">/</span>amber11<span style="color: #666666">/</span>exe<span style="color: #666666">/</span>sander

Preparing trajectories with ptraj<span style="color: #666666">...</span>
<span style="color: #666666">50</span> frames were <span style="color: #00A000">read</span> <span style="color: #AA22FF; font-weight: bold">in</span> <span style="color: #AA22FF; font-weight: bold">and</span> processed by ptraj for use <span style="color: #AA22FF; font-weight: bold">in</span> calculation<span style="color: #666666">.</span>

Starting calculations

Starting gb calculation<span style="color: #666666">...</span>

Starting pb calculation<span style="color: #666666">...</span>

<span style="#FF0000">　</span>
Calculations complete<span style="color: #666666">.</span> Writing output file(s)<span style="color: #666666">...</span>
<span style="color: #A0A000">Timing:</span>
Processing Trajectories With Ptraj<span style="color: #666666">:</span>       <span style="color: #666666">0.126</span> min<span style="color: #666666">.</span>
Total GB Calculation Time (sander)<span style="color: #666666">:</span>       <span style="color: #666666">4.782</span> min<span style="color: #666666">.</span>
Total PB Calculation Time (sander)<span style="color: #666666">:</span>      <span style="color: #666666">28.407</span> min<span style="color: #666666">.</span>
Output File Writing Time<span style="color: #666666">:</span>                 <span style="color: #666666">0.053</span> min<span style="color: #666666">.</span>

Total Time Taken<span style="color: #666666">:</span>                        <span style="color: #666666">33.379</span> min<span style="color: #666666">.</span>

<span style="#FF0000">　</span>
MMPBSA Finished<span style="color: #666666">.</span> Thank you for using<span style="color: #666666">.</span> Please send any bugs<span style="color: #666666">/</span>suggestions<span style="color: #666666">/</span>comments to mmpbsa<span style="color: #666666">.</span>amber@gmail<span style="color: #666666">.</span>com
</pre></div>
</td></tr></table>

`keep_files`设置为默认值1, 输出文件为[`Parallel_output.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/parallel_output.tgz)

最终结果为[`FINAL_RESULTS_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_RESULTS_MMPBSA_parallel.dat):

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_RESULTS_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">  1
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
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Sun Feb <span style="color: #666666">14</span> <span style="color: #666666">19:10:43</span> EST <span style="color: #666666">2010</span>

<span style="color: #666666">|</span>Input file<span style="color: #666666">:</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Input file for running PB <span style="color: #AA22FF; font-weight: bold">and</span> GB <span style="color: #AA22FF; font-weight: bold">in</span> serial
<span style="color: #666666">|&amp;</span>general
<span style="color: #666666">|</span>   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">|</span>   mpi_cmd<span style="color: #666666">=</span>&#39;mpirun <span style="color: #666666">-</span>np <span style="color: #666666">3</span>&#39;, nproc<span style="color: #666666">=3</span>
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>gb
<span style="color: #666666">|</span>  igb<span style="color: #666666">=2</span>, saltcon<span style="color: #666666">=0.100</span>
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>pb
<span style="color: #666666">|</span>  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Solvated complex topology file<span style="color: #666666">:</span>  ras<span style="color: #666666">-</span>raf_solvated<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Complex topology file<span style="color: #666666">:</span>           ras<span style="color: #666666">-</span>raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Receptor topology file<span style="color: #666666">:</span>          ras<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Ligand topology file<span style="color: #666666">:</span>            raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Initial mdcrd(s)<span style="color: #666666">:</span>                bigprod<span style="color: #666666">.</span>mdcrd
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Best guess for receptor mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:1-166&quot;</span>
<span style="color: #666666">|</span>Best guess for  ligand  mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:167-242&quot;</span>

<span style="color: #666666">|</span>Calculations performed using <span style="color: #666666">50</span> frames<span style="color: #666666">.</span>
<span style="color: #666666">|</span>Poisson Boltzmann calculations performed using internal PBSA solver <span style="color: #AA22FF; font-weight: bold">in</span> sander<span style="color: #666666">.</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>All units are reported <span style="color: #AA22FF; font-weight: bold">in</span> kcal<span style="color: #666666">/</span>mole<span style="color: #666666">.</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

GENERALIZED BORN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">17.1704</span>              <span style="color: #666666">2.4283</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.9366</span>             <span style="color: #666666">10.7391</span>
EGB                      <span style="color: #666666">-3249.6511</span>               <span style="color: #666666">65.2075</span>              <span style="color: #666666">9.2217</span>
ESURF                       <span style="color: #666666">91.3565</span>                <span style="color: #666666">1.3938</span>              <span style="color: #666666">0.1971</span>

G gas                   <span style="color: #666666">-19064.5240</span>               <span style="color: #666666">77.8536</span>             <span style="color: #666666">11.0102</span>
G solv                   <span style="color: #666666">-3158.2946</span>               <span style="color: #666666">65.2224</span>              <span style="color: #666666">9.2238</span>

TOTAL                   <span style="color: #666666">-22222.8186</span>               <span style="color: #666666">51.0216</span>              <span style="color: #666666">7.2155</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.2342</span>              <span style="color: #666666">2.0130</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">71.7127</span>             <span style="color: #666666">10.1417</span>
EGB                      <span style="color: #666666">-2532.0669</span>               <span style="color: #666666">57.7003</span>              <span style="color: #666666">8.1600</span>
ESURF                       <span style="color: #666666">64.2843</span>                <span style="color: #666666">1.1143</span>              <span style="color: #666666">0.1576</span>

<span style="#FF0000">　</span>
G gas                   <span style="color: #666666">-12825.2661</span>               <span style="color: #666666">73.1118</span>             <span style="color: #666666">10.3396</span>
G solv                   <span style="color: #666666">-2467.7826</span>               <span style="color: #666666">57.7110</span>              <span style="color: #666666">8.1616</span>

TOTAL                   <span style="color: #666666">-15293.0487</span>               <span style="color: #666666">35.3527</span>              <span style="color: #666666">4.9996</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EGB                      <span style="color: #666666">-1688.9631</span>               <span style="color: #666666">26.5353</span>              <span style="color: #666666">3.7527</span>
ESURF                       <span style="color: #666666">37.0493</span>                <span style="color: #666666">0.6185</span>              <span style="color: #666666">0.0875</span>

<span style="#FF0000">　</span>
G gas                    <span style="color: #666666">-5213.7811</span>               <span style="color: #666666">37.3522</span>              <span style="color: #666666">5.2824</span>
G solv                   <span style="color: #666666">-1651.9138</span>               <span style="color: #666666">26.5425</span>              <span style="color: #666666">3.7537</span>

TOTAL                    <span style="color: #666666">-6865.6949</span>               <span style="color: #666666">25.8878</span>              <span style="color: #666666">3.6611</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2751</span>              <span style="color: #666666">0.6046</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.9190</span>              <span style="color: #666666">4.9383</span>
EGB                        <span style="color: #666666">971.3789</span>               <span style="color: #666666">33.0497</span>              <span style="color: #666666">4.6739</span>
ESURF                       <span style="color: #666666">-9.9770</span>                <span style="color: #666666">0.3759</span>              <span style="color: #666666">0.0532</span>

<span style="#FF0000">　</span>
DELTA G gas              <span style="color: #666666">-1025.4769</span>               <span style="color: #666666">35.1797</span>              <span style="color: #666666">4.9752</span>
DELTA G solv               <span style="color: #666666">961.4018</span>               <span style="color: #666666">33.0518</span>              <span style="color: #666666">4.6742</span>

<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-64.0750</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">6.3729</span>                 <span style="color: #666666">0.9013</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

POISSON BOLTZMANN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">17.1704</span>              <span style="color: #666666">2.4283</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.9366</span>             <span style="color: #666666">10.7391</span>
EPB                      <span style="color: #666666">-3207.7160</span>               <span style="color: #666666">66.4023</span>              <span style="color: #666666">9.3907</span>
ECAVITY                     <span style="color: #666666">67.8762</span>                <span style="color: #666666">0.7818</span>              <span style="color: #666666">0.1106</span>

G gas                   <span style="color: #666666">-19064.5240</span>             <span style="color: #666666">6061.1875</span>            <span style="color: #666666">857.1813</span>
G solv                   <span style="color: #666666">-3139.8399</span>               <span style="color: #666666">66.4069</span>              <span style="color: #666666">9.3914</span>

TOTAL                    <span style="color: #666666">-7686.8660</span>               <span style="color: #666666">52.5400</span>              <span style="color: #666666">7.4303</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.2342</span>              <span style="color: #666666">2.0130</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">71.7127</span>             <span style="color: #666666">10.1417</span>
EPB                      <span style="color: #666666">-2483.7242</span>               <span style="color: #666666">56.4551</span>              <span style="color: #666666">7.9840</span>
ECAVITY                     <span style="color: #666666">47.1495</span>                <span style="color: #666666">0.4737</span>              <span style="color: #666666">0.0670</span>

G gas                   <span style="color: #666666">-12825.2661</span>             <span style="color: #666666">5345.3320</span>            <span style="color: #666666">755.9441</span>
G solv                   <span style="color: #666666">-2436.5747</span>               <span style="color: #666666">56.4571</span>              <span style="color: #666666">7.9842</span>

TOTAL                    <span style="color: #666666">-5250.2060</span>               <span style="color: #666666">38.5188</span>              <span style="color: #666666">5.4474</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EPB                      <span style="color: #666666">-1670.4169</span>               <span style="color: #666666">27.6694</span>              <span style="color: #666666">3.9131</span>
ECAVITY                     <span style="color: #666666">28.0328</span>                <span style="color: #666666">0.4133</span>              <span style="color: #666666">0.0584</span>

G gas                    <span style="color: #666666">-5213.7811</span>             <span style="color: #666666">1395.1865</span>            <span style="color: #666666">197.3092</span>
G solv                   <span style="color: #666666">-1642.3841</span>               <span style="color: #666666">27.6725</span>              <span style="color: #666666">3.9135</span>

TOTAL                    <span style="color: #666666">-2350.3020</span>               <span style="color: #666666">25.1197</span>              <span style="color: #666666">3.5525</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2751</span>              <span style="color: #666666">0.6046</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.9190</span>              <span style="color: #666666">4.9383</span>
EPB                        <span style="color: #666666">946.4251</span>               <span style="color: #666666">34.5128</span>              <span style="color: #666666">4.8808</span>
ECAVITY                     <span style="color: #666666">-7.3062</span>                <span style="color: #666666">0.3004</span>              <span style="color: #666666">0.0425</span>

DELTA G gas              <span style="color: #666666">-1025.4769</span>             <span style="color: #666666">1237.6138</span>            <span style="color: #666666">175.0250</span>
DELTA G solv               <span style="color: #666666">939.1189</span>               <span style="color: #666666">34.5141</span>              <span style="color: #666666">4.8810</span>

<span style="#FF0000">　</span>
<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-86.3579</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">8.3264</span>                 <span style="color: #666666">1.1775</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

<span style="color: #A0A000">WARNINGS:</span>
igb<span style="color: #666666">=2</span> should be used with mbondi2 pbradii set<span style="color: #666666">.</span> Yours are modified Bondi radii (mbondi)
</pre></div>
</td></tr></table>

### 3.3: 计算蛋白-配体复合物(雌激素受体和雷洛昔芬)的结合自由能

#### 1. 建立起始结构, 通过模拟获得平衡体系

本小节中, 我们将模拟雌激素受体蛋白和雷洛昔芬配体形成的蛋白-配体复合物. 其预处理过的pdb文件如下[`Estrogen_Receptor-Raloxifene.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/Estrogen_Receptor-Ral.pdb).

该结构包含雌激素受体蛋白以及配体雷洛昔芬, 雷洛昔芬已经锚定在了受体蛋白上, 如下图所示：

![](http://ambermd.org/tutorials/advanced/tutorial3/images/est_rec.jpg)

这个体系的构建方式与第1节中的Ras-Raf体系类似. 关于如何构建起始结构和运行动力学模拟以获得平衡体系, 请参考第1节和第2节. 另外, 必须利用`antechamber`获得雷洛昔芬的正确参数. 详细说明请参考[AMBER基础教程B4](http://jerkwin.github.io/2018/01/03/Amber%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8BB4-%E4%BD%BF%E7%94%A8antechamber%E5%92%8CGAFF%E6%A8%A1%E6%8B%9F%E8%8D%AF%E7%89%A9%E5%88%86%E5%AD%90/).

MD模拟中, 使用`MMPBSA.py`计算结合自由能所需的重要文件是MD模拟所用的拓扑文件和`mdcrd`文件, 下载[`Est_Rec_top_mdcrd.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/Est_Rec_top_mdcrd.tgz).

#### 2. 计算雌激素受体和雷洛昔芬的结合自由能

此节说明文件与前几节几乎相同, 故此省略, 只给出命令和结果.

`MMPBSA.py`计算的输入文件[mmpbsa.in](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/mmpbsa_2b.in):

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #AA22FF">Input</span> file for running PB <span style="color: #AA22FF; font-weight: bold">and</span> GB
<span style="color: #666666">&amp;</span>general
   endframe<span style="color: #666666">=50</span>, keep_files<span style="color: #666666">=2</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>gb
  igb<span style="color: #666666">=2</span>, saltcon<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>pb
  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

运行命令:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/MMPBSA.py</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> mmpbsa.in <span style="color:#666">-o</span> FINAL_RESULTS_MMPBSA.dat <span style="color:#666">-sp</span> 1err.solvated.prmtop <span style="color:#666">-cp</span> complex.prmtop <span style="color:#666">-rp</span> receptor.prmtop <span style="color:#666">-lp</span> ligand.prmtop <span style="color:#666">-y</span> *.mdcrd
</pre></div>

使用`keep_files=2`, 得到的输出文件为[`pb_gb_output2.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/pb_gb_output2.tgz)

最终结果

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_RESULTS_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">  1
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
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Thu Feb <span style="color: #666666">11</span> <span style="color: #666666">12:44:26</span> EST <span style="color: #666666">2010</span>

<span style="color: #666666">|</span>Input file<span style="color: #666666">:</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Input file for running PB <span style="color: #AA22FF; font-weight: bold">and</span> GB
<span style="color: #666666">|&amp;</span>general
<span style="color: #666666">|</span>   endframe<span style="color: #666666">=50</span>, keep_files<span style="color: #666666">=2</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>gb
<span style="color: #666666">|</span>  igb<span style="color: #666666">=2</span>, saltcon<span style="color: #666666">=0.100</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>pb
<span style="color: #666666">|</span>  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Solvated complex topology file<span style="color: #666666">:</span>  <span style="color: #666666">1</span>err<span style="color: #666666">.</span>solvated<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Complex topology file<span style="color: #666666">:</span>           complex<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Receptor topology file<span style="color: #666666">:</span>          receptor<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Ligand topology file<span style="color: #666666">:</span>            ligand<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Initial mdcrd(s)<span style="color: #666666">:</span>                <span style="color: #666666">1</span>err_prod<span style="color: #666666">.</span>mdcrd
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Best guess for receptor mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:1-240&quot;</span>
<span style="color: #666666">|</span>Best guess for  ligand  mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:241&quot;</span>
<span style="color: #666666">|</span>Ligand residue name <span style="color: #AA22FF; font-weight: bold">is</span> <span style="color: #BB4444">&quot;RAL&quot;</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Calculations performed using <span style="color: #666666">50</span> frames<span style="color: #666666">.</span>
<span style="color: #666666">|</span>Poisson Boltzmann calculations performed using internal PBSA solver <span style="color: #AA22FF; font-weight: bold">in</span> sander<span style="color: #666666">.</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>All units are reported <span style="color: #AA22FF; font-weight: bold">in</span> kcal<span style="color: #666666">/</span>mole<span style="color: #666666">.</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

GENERALIZED BORN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-2013.3801</span>               <span style="color: #666666">20.3021</span>              <span style="color: #666666">2.8712</span>
EEL                     <span style="color: #666666">-16938.6450</span>               <span style="color: #666666">85.7631</span>             <span style="color: #666666">12.1287</span>
EGB                      <span style="color: #666666">-3507.0086</span>               <span style="color: #666666">67.7839</span>              <span style="color: #666666">9.5861</span>
ESURF                       <span style="color: #666666">97.5448</span>                <span style="color: #666666">1.3301</span>              <span style="color: #666666">0.1881</span>

G gas                   <span style="color: #666666">-18952.0251</span>               <span style="color: #666666">88.1333</span>             <span style="color: #666666">12.4639</span>
G solv                   <span style="color: #666666">-3409.4639</span>               <span style="color: #666666">67.7969</span>              <span style="color: #666666">9.5879</span>

TOTAL                   <span style="color: #666666">-22361.4889</span>               <span style="color: #666666">47.1982</span>              <span style="color: #666666">6.6748</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1955.2272</span>               <span style="color: #666666">19.2311</span>              <span style="color: #666666">2.7197</span>
EEL                     <span style="color: #666666">-16895.0354</span>               <span style="color: #666666">85.5797</span>             <span style="color: #666666">12.1028</span>
EGB                      <span style="color: #666666">-3528.7276</span>               <span style="color: #666666">68.3585</span>              <span style="color: #666666">9.6673</span>
ESURF                      <span style="color: #666666">101.2613</span>                <span style="color: #666666">1.3071</span>              <span style="color: #666666">0.1849</span>

G gas                   <span style="color: #666666">-18850.2626</span>               <span style="color: #666666">87.7138</span>             <span style="color: #666666">12.4046</span>
G solv                   <span style="color: #666666">-3427.4663</span>               <span style="color: #666666">68.3710</span>              <span style="color: #666666">9.6691</span>

TOTAL                   <span style="color: #666666">-22277.7288</span>               <span style="color: #666666">48.1057</span>              <span style="color: #666666">6.8032</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                     <span style="color: #666666">-1.8595</span>                <span style="color: #666666">2.0516</span>              <span style="color: #666666">0.2901</span>
EEL                         <span style="color: #666666">-5.5796</span>                <span style="color: #666666">2.0333</span>              <span style="color: #666666">0.2876</span>
EGB                        <span style="color: #666666">-28.4863</span>                <span style="color: #666666">0.6040</span>              <span style="color: #666666">0.0854</span>
ESURF                        <span style="color: #666666">4.4326</span>                <span style="color: #666666">0.0462</span>              <span style="color: #666666">0.0065</span>

<span style="#FF0000">　</span>
G gas                       <span style="color: #666666">-7.4391</span>                <span style="color: #666666">2.8885</span>              <span style="color: #666666">0.4085</span>
G solv                     <span style="color: #666666">-24.0538</span>                <span style="color: #666666">0.6058</span>              <span style="color: #666666">0.0857</span>

TOTAL                      <span style="color: #666666">-31.4929</span>                <span style="color: #666666">5.0748</span>              <span style="color: #666666">0.7177</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-56.2934</span>                <span style="color: #666666">2.9265</span>              <span style="color: #666666">0.4139</span>
EEL                        <span style="color: #666666">-38.0300</span>                <span style="color: #666666">3.2114</span>              <span style="color: #666666">0.4542</span>
EGB                         <span style="color: #666666">50.2053</span>                <span style="color: #666666">2.5869</span>              <span style="color: #666666">0.3658</span>
ESURF                       <span style="color: #666666">-8.1491</span>                <span style="color: #666666">0.2589</span>              <span style="color: #666666">0.0366</span>

<span style="#FF0000">　</span>
DELTA G gas                <span style="color: #666666">-94.3234</span>                <span style="color: #666666">4.3449</span>              <span style="color: #666666">0.6145</span>
DELTA G solv                <span style="color: #666666">42.0562</span>                <span style="color: #666666">2.5999</span>              <span style="color: #666666">0.3677</span>

<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-52.2672</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">2.4568</span>                 <span style="color: #666666">0.3475</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

POISSON BOLTZMANN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-2013.3801</span>               <span style="color: #666666">20.3021</span>              <span style="color: #666666">2.8712</span>
EEL                     <span style="color: #666666">-16938.6450</span>               <span style="color: #666666">85.7631</span>             <span style="color: #666666">12.1287</span>
EPB                      <span style="color: #666666">-3329.1708</span>               <span style="color: #666666">67.0354</span>              <span style="color: #666666">9.4802</span>
ECAVITY                     <span style="color: #666666">68.2656</span>                <span style="color: #666666">0.5195</span>              <span style="color: #666666">0.0735</span>

G gas                   <span style="color: #666666">-18952.0251</span>             <span style="color: #666666">7767.4837</span>           <span style="color: #666666">1098.4881</span>
G solv                   <span style="color: #666666">-3260.9052</span>               <span style="color: #666666">67.0374</span>              <span style="color: #666666">9.4805</span>

TOTAL                    <span style="color: #666666">-5265.0831</span>               <span style="color: #666666">49.0426</span>              <span style="color: #666666">6.9357</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1955.2272</span>               <span style="color: #666666">19.2311</span>              <span style="color: #666666">2.7197</span>
EEL                     <span style="color: #666666">-16895.0354</span>               <span style="color: #666666">85.5797</span>             <span style="color: #666666">12.1028</span>
EPB                      <span style="color: #666666">-3355.4746</span>               <span style="color: #666666">67.3299</span>              <span style="color: #666666">9.5219</span>
ECAVITY                     <span style="color: #666666">70.1184</span>                <span style="color: #666666">0.5285</span>              <span style="color: #666666">0.0747</span>

G gas                   <span style="color: #666666">-18850.2626</span>             <span style="color: #666666">7693.7163</span>           <span style="color: #666666">1088.0558</span>
G solv                   <span style="color: #666666">-3285.3562</span>               <span style="color: #666666">67.3320</span>              <span style="color: #666666">9.5222</span>

TOTAL                    <span style="color: #666666">-5279.4509</span>               <span style="color: #666666">50.4067</span>              <span style="color: #666666">7.1286</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                     <span style="color: #666666">-1.8595</span>                <span style="color: #666666">2.0516</span>              <span style="color: #666666">0.2901</span>
EEL                         <span style="color: #666666">-5.5796</span>                <span style="color: #666666">2.0333</span>              <span style="color: #666666">0.2876</span>
EPB                        <span style="color: #666666">-31.3364</span>                <span style="color: #666666">0.6953</span>              <span style="color: #666666">0.0983</span>
ECAVITY                      <span style="color: #666666">3.1896</span>                <span style="color: #666666">0.0288</span>              <span style="color: #666666">0.0041</span>

G gas                       <span style="color: #666666">-7.4391</span>                <span style="color: #666666">8.3434</span>              <span style="color: #666666">1.1799</span>
G solv                     <span style="color: #666666">-28.1468</span>                <span style="color: #666666">0.6959</span>              <span style="color: #666666">0.0984</span>

TOTAL                       <span style="color: #666666">56.0934</span>                <span style="color: #666666">5.0476</span>              <span style="color: #666666">0.7138</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-56.2934</span>                <span style="color: #666666">2.9265</span>              <span style="color: #666666">0.4139</span>
EEL                        <span style="color: #666666">-38.0300</span>                <span style="color: #666666">3.2114</span>              <span style="color: #666666">0.4542</span>
EPB                         <span style="color: #666666">57.6402</span>                <span style="color: #666666">3.0642</span>              <span style="color: #666666">0.4333</span>
ECAVITY                     <span style="color: #666666">-5.0423</span>                <span style="color: #666666">0.1683</span>              <span style="color: #666666">0.0238</span>

DELTA G gas                <span style="color: #666666">-94.3234</span>               <span style="color: #666666">18.8778</span>              <span style="color: #666666">2.6697</span>
DELTA G solv                <span style="color: #666666">52.5978</span>                <span style="color: #666666">3.0688</span>              <span style="color: #666666">0.4340</span>

<span style="#FF0000">　</span>
<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-41.7256</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">2.9618</span>                 <span style="color: #666666">0.4189</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
</pre></div>
</td></tr></table>

### 3.4 计算Ras-Raf的结合自由能, 并利用丙氨酸扫描(Alanine Scanning)比较分析Ras-Raf复合物中某个残基突变为丙氨酸后的结果

#### 1. 设置pdb文件, 为后续的`tleap`做准备

部分平衡后预处理过的RAS-RAF复合物的结构文件[`ras-raf.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras-raf.pdb)

接下来我们必须准备突变体结构的pdb文件供`tleap`使用. 为了保证`prmtop`文件的一致性, 我们强烈建议在运行任何模拟之前准备该突变体的pdb及其拓扑文件, 并与第1节中创建的初始拓扑文件一起. 本教程中, 我们选择将残基21(异亮氨酸, `I21`)突变为丙氨酸, 因为`I21`位于受体和配体结合的界面处, 应该对结合能有明显的影响. 请注意, 本教程涉及的代码目前只适用于丙氨酸突变.

由于`I21`仅处于受体中, 所以我们不需要准备突变配体的pdb文件. 因此, 我们只需要修改[`ras-raf.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras-raf.pdb)和[`ras.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras.pdb). 为此, 你需要了解一些所涉及到的氨基酸结构的知识. 异亮氨酸的侧链是-CH(CH<sub>3</sub>)CH<sub>2</sub>CH<sub>3</sub>, 而丙氨酸的侧链是-CH<sub>3</sub>. 由于异亮氨酸侧链的原子数比丙氨酸侧链的多, 因此我们必须从pdb文件中去除原子及其相应的信息(名称, 编号, 坐标等). 这种突变涉及除β-C(CB)之外的所有侧链原子. 在`I21`中, 这意味着我们必须删除Ras-Raf和Ras的pdb文件中与原子294到305相对应的行. 我们不需要添加β-H(HB)原子, 因为基于为体系选择的特定库文件, `tleap`会将这些原子添加到合适的位置. 最后, 将残基21所有剩余的原子对应的残基名称从`ILE`更改为`ALA`. 此过程将生成两个突变的pdb文件: [`ras-raf_mutant.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras-raf_mutant.pdb)和[`ras_mutant.pdb`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras_mutant.pdb). RAS-RAF及其`I21A`突变结构如下图所示:

![](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/rasraf_I21.jpg)
![](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/rasraf_mutant.jpg)

其他残基的突变也可以使用类似的方法, 其中位于CB之后羰基碳(C)之前的原子组可以从pdb文件中去除. 值得注意的是, 单次计算中只能进行一次突变.

#### 2. 构建起始拓扑和坐标文件, 模拟获得平衡体系

基于已经生成的突变pdb文件, 可用`tleap`为这些结构构建相应的拓扑和坐标文件. 首先, 我们将生成对应非突变复合体的文件:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/exe/tleap</span> <span style="color:#666">-s</span> <span style="color:#666">-f</span> $AMBERHOME/dat/leap/cmd/leaprc.ff99SB

<span style="color:#A2F">com</span> = loadpdb ras-raf.pdb
<span style="color:#A2F">ras</span> = loadpdb ras.pdb
<span style="color:#A2F">raf</span> = loadpdb raf.pdb
<span style="color:#A2F">saveamberparm</span> com ras-raf.prmtop ras-raf.inpcrd
<span style="color:#A2F">saveamberparm</span> ras ras.prmtop ras.inpcrd
<span style="color:#A2F">saveamberparm</span> raf raf.prmtop raf.inpcrd
</pre></div>

构建用于MD模拟的溶剂化复合物:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">charge</span> com
<span style="color:#A2F">></span> Total unperturbed charge: <span style="color:#666">-0.000000</span>
<span style="color:#A2F">></span> Total perturbed charge: <span style="color:#666">-0.000000</span>    (Hence there is no need to add counter ions)
<span style="color:#A2F">solvatebox</span> com TIP3PBOX 12.0
<span style="color:#A2F">saveamberparm</span> com ras-raf_solvated.prmtop ras-raf_solvated.inpcrd
</pre></div>

在退出`tleap`之前, 构建与突变pdb文件相应的拓扑和坐标文件:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">com_mut</span> = loadpdb ras-raf_mutant.pdb
<span style="color:#A2F">ras_mut</span> = loadpdb ras_mutant.pdb
<span style="color:#A2F">saveamberparm</span> com_mut rasraf_mutant.prmtop rasraf_mutant.inpcrd
<span style="color:#A2F">saveamberparm</span> ras_mut ras_mutant.prmtop ras_mutant.inpcrd
<span style="color:#A2F">quit</span>
</pre></div>

上述步骤共生成了12个文件(6个`.prmtop`文件和6个`.inpcrd`文件). 非突变体`.prmtop`和`.inpcrd`文件用于运行MD模拟以获得平衡体系, 具体方法可参考第1节和第2节.

利用`MMPBSA.py`计算结合自由能的重要文件是(非突变体和突变体的)拓扑文件, 以及使用非突变体的拓扑文件和坐标文件运行得到的`mdcrd`文件[`ras-raf_alascan.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras-raf_alascan.tgz)

#### 3. 对Ras-Raf的结合自由能进行丙氨酸扫描计算

我们现在将计算复合物, 受体和配体的相互作用能和溶剂化自由能, 并对结果进行平均以获得结合自由能的估计值. 然后, 为了与"野生型"进行比较, 我们会对突变后的结构进行相同的计算, 计算前需要先将`mdcrd`中的坐标突变. 请注意, 在教程的这一部分我们不计算熵对结合能的贡献, 因此严格来说, 所得的结果并不是真正的自由能, 但可以用来对相似的体系进行比较. 有关使用简正模式分析(Nmode)计算体系的熵贡献, 可参考3.5节. 也可以取消下面输入文件中`&general`命名列表中最后一行的注释, 以便使用AMBER的`ptraj`模块进行准简谐熵计算.

计算方法与前面的相同, `MMPBSA.py`的输入文件[`mmpbsa.in`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/mmpbsa_3.in)如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
13</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>sample input file for running alanine scanning
 <span style="color: #666666">&amp;</span>general
   startframe<span style="color: #666666">=1</span>, endframe<span style="color: #666666">=50</span>, interval<span style="color: #666666">=1</span>,
   verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>gb
  saltcon<span style="color: #666666">=0.1</span>
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>pb
  istrng<span style="color: #666666">=0.100</span>
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>alanine_scanning
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

文件中的`&alanine_scanning`命名列表表示初始化脚本中的丙氨酸扫描, 其中唯一可使用的变量是`mutant_only`, 其详细说明见手册.

运行命令如下:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/MMPBSA.py</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> mmpbsa.in <span style="color:#666">-sp</span> ras-raf_solvated.prmtop <span style="color:#666">-cp</span> rasraf.prmtop <span style="color:#666">-rp</span> ras.prmtop <span style="color:#666">-lp</span> raf.prmtop <span style="color:#666">-y</span> *.mdcrd <span style="color:#666">-mc</span> rasraf_mutant.prmtop <span style="color:#666">-mr</span> ras_mutant.prmtop
</pre></div>

输出文件[`ALASCAN_output.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ALASCAN_output.tgz)

最终结果[`FINAL_RESULTS_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_RESULTS_MMPBSA_alascan.dat)

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_RESULTS_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">  1
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
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Thu Feb <span style="color: #666666">11</span> <span style="color: #666666">13:11:48</span> EST <span style="color: #666666">2010</span>

<span style="color: #666666">|</span>Input file<span style="color: #666666">:</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>sample input file for running alanine scanning
<span style="color: #666666">|</span> <span style="color: #666666">&amp;</span>general
<span style="color: #666666">|</span>   startframe<span style="color: #666666">=1</span>, endframe<span style="color: #666666">=50</span>, interval<span style="color: #666666">=1</span>,
<span style="color: #666666">|</span>   verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>gb
<span style="color: #666666">|</span>  saltcon<span style="color: #666666">=0.1</span>
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>pb
<span style="color: #666666">|</span>  istrng<span style="color: #666666">=0.100</span>
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>alanine_scanning
<span style="color: #666666">|/</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Solvated complex topology file<span style="color: #666666">:</span>  ras<span style="color: #666666">-</span>raf_solvated<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Complex topology file<span style="color: #666666">:</span>           rasraf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Receptor topology file<span style="color: #666666">:</span>          ras<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Ligand topology file<span style="color: #666666">:</span>            raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Initial mdcrd(s)<span style="color: #666666">:</span>                bigprod<span style="color: #666666">.</span>mdcrd
<span style="color: #666666">|</span>Mutant complex topology file<span style="color: #666666">:</span>    rasraf_mutant<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Mutant receptor topology file<span style="color: #666666">:</span>   ras_mutant<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Mutant ligand topology file<span style="color: #666666">:</span>     raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Best guess for receptor mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:1-166&quot;</span>
<span style="color: #666666">|</span>Best guess for  ligand  mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:167-242&quot;</span>

<span style="color: #666666">|</span>Calculations performed using <span style="color: #666666">50</span> frames<span style="color: #666666">.</span>
<span style="color: #666666">|</span>Poisson Boltzmann calculations performed using internal PBSA solver <span style="color: #AA22FF; font-weight: bold">in</span> sander<span style="color: #666666">.</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>All units are reported <span style="color: #AA22FF; font-weight: bold">in</span> kcal<span style="color: #666666">/</span>mole<span style="color: #666666">.</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

GENERALIZED BORN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">17.1704</span>              <span style="color: #666666">2.4283</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.9366</span>             <span style="color: #666666">10.7391</span>
EGB                      <span style="color: #666666">-3142.2247</span>               <span style="color: #666666">63.1977</span>              <span style="color: #666666">8.9375</span>
ESURF                       <span style="color: #666666">91.3565</span>                <span style="color: #666666">1.3938</span>              <span style="color: #666666">0.1971</span>

G gas                   <span style="color: #666666">-19064.5240</span>               <span style="color: #666666">77.8536</span>             <span style="color: #666666">11.0102</span>
G solv                   <span style="color: #666666">-3050.8682</span>               <span style="color: #666666">63.2131</span>              <span style="color: #666666">8.9397</span>

TOTAL                   <span style="color: #666666">-22115.3922</span>               <span style="color: #666666">51.5332</span>              <span style="color: #666666">7.2879</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.2342</span>              <span style="color: #666666">2.0130</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">71.7127</span>             <span style="color: #666666">10.1417</span>
EGB                      <span style="color: #666666">-2444.8629</span>               <span style="color: #666666">54.9156</span>              <span style="color: #666666">7.7662</span>
ESURF                       <span style="color: #666666">64.2843</span>                <span style="color: #666666">1.1143</span>              <span style="color: #666666">0.1576</span>

<span style="#FF0000">　</span>
G gas                   <span style="color: #666666">-12825.2661</span>               <span style="color: #666666">73.1118</span>             <span style="color: #666666">10.3396</span>
G solv                   <span style="color: #666666">-2380.5786</span>               <span style="color: #666666">54.9269</span>              <span style="color: #666666">7.7678</span>

TOTAL                   <span style="color: #666666">-15205.8447</span>               <span style="color: #666666">36.8422</span>              <span style="color: #666666">5.2103</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EGB                      <span style="color: #666666">-1661.8286</span>               <span style="color: #666666">26.5442</span>              <span style="color: #666666">3.7539</span>
ESURF                       <span style="color: #666666">37.0493</span>                <span style="color: #666666">0.6185</span>              <span style="color: #666666">0.0875</span>

<span style="#FF0000">　</span>
G gas                    <span style="color: #666666">-5213.7811</span>               <span style="color: #666666">37.3522</span>              <span style="color: #666666">5.2824</span>
G solv                   <span style="color: #666666">-1624.7794</span>               <span style="color: #666666">26.5514</span>              <span style="color: #666666">3.7549</span>

TOTAL                    <span style="color: #666666">-6838.5604</span>               <span style="color: #666666">25.6515</span>              <span style="color: #666666">3.6277</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2751</span>              <span style="color: #666666">0.6046</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.9190</span>              <span style="color: #666666">4.9383</span>
EGB                        <span style="color: #666666">964.4668</span>               <span style="color: #666666">32.9201</span>              <span style="color: #666666">4.6556</span>
ESURF                       <span style="color: #666666">-9.9770</span>                <span style="color: #666666">0.3759</span>              <span style="color: #666666">0.0532</span>

<span style="#FF0000">　</span>
DELTA G gas              <span style="color: #666666">-1025.4769</span>               <span style="color: #666666">35.1797</span>              <span style="color: #666666">4.9752</span>
DELTA G solv               <span style="color: #666666">954.4898</span>               <span style="color: #666666">32.9223</span>              <span style="color: #666666">4.6559</span>

<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-70.9871</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">6.6875</span>                 <span style="color: #666666">0.9457</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
I21A MUTANT<span style="color: #666666">:</span>
GENERALIZED BORN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1855.4226</span>               <span style="color: #666666">17.0765</span>              <span style="color: #666666">2.4150</span>
EEL                     <span style="color: #666666">-17210.2882</span>               <span style="color: #666666">75.8866</span>             <span style="color: #666666">10.7320</span>
EGB                      <span style="color: #666666">-3145.1010</span>               <span style="color: #666666">63.2477</span>              <span style="color: #666666">8.9446</span>
ESURF                       <span style="color: #666666">91.8639</span>                <span style="color: #666666">1.3913</span>              <span style="color: #666666">0.1968</span>

G gas                   <span style="color: #666666">-19065.7108</span>               <span style="color: #666666">77.7842</span>             <span style="color: #666666">11.0003</span>
G solv                   <span style="color: #666666">-3053.2370</span>               <span style="color: #666666">63.2630</span>              <span style="color: #666666">8.9467</span>

TOTAL                   <span style="color: #666666">-22118.9478</span>               <span style="color: #666666">50.9582</span>              <span style="color: #666666">7.2066</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1261.9126</span>               <span style="color: #666666">14.1817</span>              <span style="color: #666666">2.0056</span>
EEL                     <span style="color: #666666">-11566.4419</span>               <span style="color: #666666">71.5475</span>             <span style="color: #666666">10.1183</span>
EGB                      <span style="color: #666666">-2447.4831</span>               <span style="color: #666666">55.0008</span>              <span style="color: #666666">7.7783</span>
ESURF                       <span style="color: #666666">64.5090</span>                <span style="color: #666666">1.1105</span>              <span style="color: #666666">0.1570</span>

<span style="#FF0000">　</span>
G gas                   <span style="color: #666666">-12828.3545</span>               <span style="color: #666666">72.9394</span>             <span style="color: #666666">10.3152</span>
G solv                   <span style="color: #666666">-2382.9741</span>               <span style="color: #666666">55.0120</span>              <span style="color: #666666">7.7799</span>

TOTAL                   <span style="color: #666666">-15211.3287</span>               <span style="color: #666666">36.2055</span>              <span style="color: #666666">5.1202</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EGB                      <span style="color: #666666">-1661.8286</span>               <span style="color: #666666">26.5442</span>              <span style="color: #666666">3.7539</span>
ESURF                       <span style="color: #666666">37.0493</span>                <span style="color: #666666">0.6185</span>              <span style="color: #666666">0.0875</span>

<span style="#FF0000">　</span>
G gas                    <span style="color: #666666">-5213.7811</span>               <span style="color: #666666">37.3522</span>              <span style="color: #666666">5.2824</span>
G solv                   <span style="color: #666666">-1624.7794</span>               <span style="color: #666666">26.5514</span>              <span style="color: #666666">3.7549</span>

TOTAL                    <span style="color: #666666">-6838.5604</span>               <span style="color: #666666">25.6515</span>              <span style="color: #666666">3.6277</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-64.2010</span>                <span style="color: #666666">4.0841</span>              <span style="color: #666666">0.5776</span>
EEL                       <span style="color: #666666">-959.3742</span>               <span style="color: #666666">34.9114</span>              <span style="color: #666666">4.9372</span>
EGB                        <span style="color: #666666">964.2108</span>               <span style="color: #666666">32.9092</span>              <span style="color: #666666">4.6541</span>
ESURF                       <span style="color: #666666">-9.6943</span>                <span style="color: #666666">0.3800</span>              <span style="color: #666666">0.0537</span>

<span style="#FF0000">　</span>
DELTA G gas              <span style="color: #666666">-1023.5752</span>               <span style="color: #666666">35.1495</span>              <span style="color: #666666">4.9709</span>
DELTA G solv               <span style="color: #666666">954.5164</span>               <span style="color: #666666">32.9114</span>              <span style="color: #666666">4.6544</span>

<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-69.0588</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">6.5302</span>                 <span style="color: #666666">0.9235</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

RESULT OF ALANINE SCANNING<span style="color: #666666">:</span> (I21A MUTANT<span style="color: #666666">:</span>) DELTA DELTA G binding <span style="color: #666666">=</span>    <span style="color: #666666">1.9283</span>  <span style="color: #666666">+/-</span>    <span style="color: #666666">9.3470</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

POISSON BOLTZMANN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">17.1704</span>              <span style="color: #666666">2.4283</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.9366</span>             <span style="color: #666666">10.7391</span>
EPB                      <span style="color: #666666">-3227.2145</span>               <span style="color: #666666">64.4523</span>              <span style="color: #666666">9.1149</span>
ECAVITY                     <span style="color: #666666">68.4754</span>                <span style="color: #666666">0.7567</span>              <span style="color: #666666">0.1070</span>

G gas                   <span style="color: #666666">-19064.5240</span>             <span style="color: #666666">6061.1875</span>            <span style="color: #666666">857.1813</span>
G solv                   <span style="color: #666666">-3158.7391</span>               <span style="color: #666666">64.4568</span>              <span style="color: #666666">9.1156</span>

TOTAL                    <span style="color: #666666">-7522.2032</span>               <span style="color: #666666">51.2973</span>              <span style="color: #666666">7.2545</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.2342</span>              <span style="color: #666666">2.0130</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">71.7127</span>             <span style="color: #666666">10.1417</span>
EPB                      <span style="color: #666666">-2485.3559</span>               <span style="color: #666666">54.5638</span>              <span style="color: #666666">7.7165</span>
ECAVITY                     <span style="color: #666666">47.5088</span>                <span style="color: #666666">0.4610</span>              <span style="color: #666666">0.0652</span>

G gas                   <span style="color: #666666">-12825.2661</span>             <span style="color: #666666">5345.3320</span>            <span style="color: #666666">755.9441</span>
G solv                   <span style="color: #666666">-2437.8471</span>               <span style="color: #666666">54.5658</span>              <span style="color: #666666">7.7168</span>

TOTAL                    <span style="color: #666666">-5118.8075</span>               <span style="color: #666666">38.9610</span>              <span style="color: #666666">5.5099</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EPB                      <span style="color: #666666">-1684.5802</span>               <span style="color: #666666">28.2572</span>              <span style="color: #666666">3.9962</span>
ECAVITY                     <span style="color: #666666">28.1687</span>                <span style="color: #666666">0.3939</span>              <span style="color: #666666">0.0557</span>

G gas                    <span style="color: #666666">-5213.7811</span>             <span style="color: #666666">1395.1865</span>            <span style="color: #666666">197.3092</span>
G solv                   <span style="color: #666666">-1656.4114</span>               <span style="color: #666666">28.2599</span>              <span style="color: #666666">3.9966</span>

TOTAL                    <span style="color: #666666">-2313.4381</span>               <span style="color: #666666">24.9082</span>              <span style="color: #666666">3.5225</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2751</span>              <span style="color: #666666">0.6046</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.9190</span>              <span style="color: #666666">4.9383</span>
EPB                        <span style="color: #666666">942.7215</span>               <span style="color: #666666">33.8861</span>              <span style="color: #666666">4.7922</span>
ECAVITY                     <span style="color: #666666">-7.2022</span>                <span style="color: #666666">0.3069</span>              <span style="color: #666666">0.0434</span>

DELTA G gas              <span style="color: #666666">-1025.4769</span>             <span style="color: #666666">1237.6138</span>            <span style="color: #666666">175.0250</span>
DELTA G solv               <span style="color: #666666">935.5194</span>               <span style="color: #666666">33.8875</span>              <span style="color: #666666">4.7924</span>

<span style="#FF0000">　</span>
<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-89.9575</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">8.2480</span>                 <span style="color: #666666">1.1664</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
I21A MUTANT<span style="color: #666666">:</span>
POISSON BOLTZMANN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1855.4226</span>               <span style="color: #666666">17.0765</span>              <span style="color: #666666">2.4150</span>
EEL                     <span style="color: #666666">-17210.2882</span>               <span style="color: #666666">75.8866</span>             <span style="color: #666666">10.7320</span>
EPB                      <span style="color: #666666">-3229.1405</span>               <span style="color: #666666">64.8100</span>              <span style="color: #666666">9.1655</span>
ECAVITY                     <span style="color: #666666">68.5521</span>                <span style="color: #666666">0.7596</span>              <span style="color: #666666">0.1074</span>

G gas                   <span style="color: #666666">-19065.7108</span>             <span style="color: #666666">6050.3755</span>            <span style="color: #666666">855.6523</span>
G solv                   <span style="color: #666666">-3160.5884</span>               <span style="color: #666666">64.8144</span>              <span style="color: #666666">9.1661</span>

TOTAL                    <span style="color: #666666">-7520.1586</span>               <span style="color: #666666">50.6710</span>              <span style="color: #666666">7.1660</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1261.9126</span>               <span style="color: #666666">14.1817</span>              <span style="color: #666666">2.0056</span>
EEL                     <span style="color: #666666">-11566.4419</span>               <span style="color: #666666">71.5475</span>             <span style="color: #666666">10.1183</span>
EPB                      <span style="color: #666666">-2487.5603</span>               <span style="color: #666666">54.6289</span>              <span style="color: #666666">7.7257</span>
ECAVITY                     <span style="color: #666666">47.6466</span>                <span style="color: #666666">0.4632</span>              <span style="color: #666666">0.0655</span>

G gas                   <span style="color: #666666">-12828.3545</span>             <span style="color: #666666">5320.1609</span>            <span style="color: #666666">752.3844</span>
G solv                   <span style="color: #666666">-2439.9137</span>               <span style="color: #666666">54.6309</span>              <span style="color: #666666">7.7260</span>

TOTAL                    <span style="color: #666666">-5118.8820</span>               <span style="color: #666666">38.4370</span>              <span style="color: #666666">5.4358</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.4198</span>              <span style="color: #666666">1.3322</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">36.1449</span>              <span style="color: #666666">5.1117</span>
EPB                      <span style="color: #666666">-1684.5802</span>               <span style="color: #666666">28.2572</span>              <span style="color: #666666">3.9962</span>
ECAVITY                     <span style="color: #666666">28.1687</span>                <span style="color: #666666">0.3939</span>              <span style="color: #666666">0.0557</span>

G gas                    <span style="color: #666666">-5213.7811</span>             <span style="color: #666666">1395.1865</span>            <span style="color: #666666">197.3092</span>
G solv                   <span style="color: #666666">-1656.4114</span>               <span style="color: #666666">28.2599</span>              <span style="color: #666666">3.9966</span>

TOTAL                    <span style="color: #666666">-2313.4381</span>               <span style="color: #666666">24.9082</span>              <span style="color: #666666">3.5225</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-64.2010</span>                <span style="color: #666666">4.0841</span>              <span style="color: #666666">0.5776</span>
EEL                       <span style="color: #666666">-959.3742</span>               <span style="color: #666666">34.9114</span>              <span style="color: #666666">4.9372</span>
EPB                        <span style="color: #666666">942.9999</span>               <span style="color: #666666">34.0350</span>              <span style="color: #666666">4.8133</span>
ECAVITY                     <span style="color: #666666">-7.2632</span>                <span style="color: #666666">0.3107</span>              <span style="color: #666666">0.0439</span>

DELTA G gas              <span style="color: #666666">-1023.5752</span>             <span style="color: #666666">1235.4872</span>            <span style="color: #666666">174.7243</span>
DELTA G solv               <span style="color: #666666">935.7367</span>               <span style="color: #666666">34.0364</span>              <span style="color: #666666">4.8135</span>

<span style="#FF0000">　</span>
<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-87.8385</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">8.0665</span>                 <span style="color: #666666">1.1408</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

RESULT OF ALANINE SCANNING<span style="color: #666666">:</span> (I21A MUTANT<span style="color: #666666">:</span>) DELTA DELTA G binding <span style="color: #666666">=</span>    <span style="color: #666666">2.1190</span>  <span style="color: #666666">+/-</span>   <span style="color: #666666">11.5368</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
</pre></div>
</td></tr></table>

该结果文件与前面的同类文件的不同在于, 在每种方法之后会报告结合的ΔΔG, 表明突变对于复合物的结合自由能ΔG的相对影响. 特定的突变也在文件末尾输出. 在本例中, 我们将残基21从异亮氨酸突变为丙氨酸(即`I21A`).

### 3.5 分解单个残基或每对残基对Ras-Raf结合自由能的贡献(适用于amber11)

`MMPBSA.py`计算结合自由能所需的拓扑文件和`mdcrd`: [`ras-raf_top_mdcrd.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/ras-raf_top_mdcrd.tgz)

我们将对3.1节获得的Ras-Raf体系进行结合自由能分解. AMBER支持两种类型的分解方法: 分解到每对残基和分解到单个残基. 单个残基分解方法通过计算单个残基与体系中其他所有残基的相互作用总和来计算单个残基的能量贡献. 成对分解计算体系中残基对之间的相互作用能. 下面将分别展示这两种类型的能量分解. 需要注意的是, __只有__ `MMPBSA.py`正确识别出输入的残基后, 输出的每个残基的DELTA贡献才是有效的.

#### a. 单个残基的自由能分解

要进行分解, 必须在`MMPBSA.py`的输入文件中指定`&decomp`命名列表. 此外, 必须指定`idecomp`变量(没有默认值). 未能为此变量赋值将导致程序终止, 并给出错误信息. `idecomp`看指定4个允许的值, 其中两个用于单个残基的分解, 另外两个用于残基对分解. 值`1`和`2`决定了单个残基分解的方式: 值`1`将把1-4非键相互作用能(`1-4 EEL`和`1-4 VDW`)加到内部势能项上; 值`2`将把`1-4 EEL`相互作用能加到静电势项上, 将`1-4 VDW`相互作用能加到范德华势能项上.

下面的`MMPBSA.py`输入文件[`mmpbsa_per_res_decomp.in`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/mmpbsa_per_res_decomp.in)使用PB和GB隐式溶剂模型进行单个残基分解:(注意：PB的非极性溶剂化能目前不可分解)

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa_per_res_decomp.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
14</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Per<span style="color: #666666">-</span>residue GB <span style="color: #AA22FF; font-weight: bold">and</span> PB decomposition
<span style="color: #666666">&amp;</span>general
   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>gb
  igb<span style="color: #666666">=5</span>, saltcon<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>pb
  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>decomp
  idecomp<span style="color: #666666">=1</span>, print_res<span style="color: #666666">=</span><span style="color: #BB4444">&quot;5; 30-40; 170-200&quot;</span>
  dec_verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

文件中`dec_verbose`变量用于指定能量分解输出文件的详细程度.

运行命令如下:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/MMPBSA.py</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> mmpbsa.in <span style="color:#666">-o</span> FINAL_RESULTS_MMPBSA.dat <span style="color:#666">-do</span> FINAL_DECOMP_MMPBSA.dat <span style="color:#666">-sp</span> ras-raf_solvated.prmtop <span style="color:#666">-cp</span> ras-raf.prmtop <span style="color:#666">-rp</span> ras.prmtop <span style="color:#666">-lp</span> raf.prmtop <span style="color:#666">-y</span> *.mdcrd
</pre></div>

注意, 上述命令可以用`MMPBSA.py.MPI`并行计算, 详情可参考3.3节.

输出文件[`per_res_output.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/per_res_output.tgz)

最终结果文件[`FINAL_RESULTS_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_RESULTS_MMPBSA_decomp.dat), [`FINAL_DECOMP_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_DECOMP_MMPBSA_perres.dat)

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_RESULTS_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">  1
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
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Thu May <span style="color: #666666">20</span> <span style="color: #666666">14:55:43</span> EDT <span style="color: #666666">2010</span>

<span style="color: #666666">|</span>Input file<span style="color: #666666">:</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Per<span style="color: #666666">-</span>residue GB <span style="color: #AA22FF; font-weight: bold">and</span> PB decomposition
<span style="color: #666666">|&amp;</span>general
<span style="color: #666666">|</span>   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>gb
<span style="color: #666666">|</span>  igb<span style="color: #666666">=5</span>, saltcon<span style="color: #666666">=0.100</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>pb
<span style="color: #666666">|</span>  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>decomp
<span style="color: #666666">|</span>  idecomp<span style="color: #666666">=1</span>, print_res<span style="color: #666666">=</span><span style="color: #BB4444">&quot;5; 30-40; 170-200&quot;</span>
<span style="color: #666666">|</span>  dec_verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Complex topology file<span style="color: #666666">:</span>           ras<span style="color: #666666">-</span>raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Receptor topology file<span style="color: #666666">:</span>          ras<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Ligand topology file<span style="color: #666666">:</span>            raf<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Initial mdcrd(s)<span style="color: #666666">:</span>                prod<span style="color: #666666">.</span>mdcrd
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Best guess for receptor mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:1-166&quot;</span>
<span style="color: #666666">|</span>Best guess for  ligand  mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:167-242&quot;</span>

<span style="color: #666666">|</span>Calculations performed using <span style="color: #666666">50</span> frames<span style="color: #666666">.</span>
<span style="color: #666666">|</span>Poisson Boltzmann calculations performed using internal PBSA solver <span style="color: #AA22FF; font-weight: bold">in</span> sander<span style="color: #666666">.</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>All units are reported <span style="color: #AA22FF; font-weight: bold">in</span> kcal<span style="color: #666666">/</span>mole<span style="color: #666666">.</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

GENERALIZED BORN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">16.9979</span>              <span style="color: #666666">2.4039</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.1734</span>             <span style="color: #666666">10.6311</span>
EGB                      <span style="color: #666666">-2918.9628</span>               <span style="color: #666666">65.1000</span>              <span style="color: #666666">9.2065</span>
ESURF                       <span style="color: #666666">92.2138</span>                <span style="color: #666666">0.9782</span>              <span style="color: #666666">0.1383</span>

G gas                   <span style="color: #666666">-19064.5240</span>               <span style="color: #666666">77.0712</span>             <span style="color: #666666">10.8995</span>
G solv                   <span style="color: #666666">-2826.7490</span>               <span style="color: #666666">65.1073</span>              <span style="color: #666666">9.2076</span>

TOTAL                   <span style="color: #666666">-21891.2730</span>               <span style="color: #666666">52.3724</span>              <span style="color: #666666">7.4066</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.0912</span>              <span style="color: #666666">1.9928</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">70.9920</span>             <span style="color: #666666">10.0398</span>
EGB                      <span style="color: #666666">-2314.8693</span>               <span style="color: #666666">56.2410</span>              <span style="color: #666666">7.9537</span>
ESURF                       <span style="color: #666666">64.4513</span>                <span style="color: #666666">0.6128</span>              <span style="color: #666666">0.0867</span>

G gas                   <span style="color: #666666">-12825.2661</span>               <span style="color: #666666">72.3770</span>             <span style="color: #666666">10.2356</span>
G solv                   <span style="color: #666666">-2250.4181</span>               <span style="color: #666666">56.2443</span>              <span style="color: #666666">7.9542</span>

TOTAL                   <span style="color: #666666">-15075.6842</span>               <span style="color: #666666">36.8322</span>              <span style="color: #666666">5.2089</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.3251</span>              <span style="color: #666666">1.3188</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">35.7816</span>              <span style="color: #666666">5.0603</span>
EGB                      <span style="color: #666666">-1587.3051</span>               <span style="color: #666666">26.8494</span>              <span style="color: #666666">3.7971</span>
ESURF                       <span style="color: #666666">38.5992</span>                <span style="color: #666666">0.5158</span>              <span style="color: #666666">0.0730</span>

G gas                    <span style="color: #666666">-5213.7811</span>               <span style="color: #666666">36.9768</span>              <span style="color: #666666">5.2293</span>
G solv                   <span style="color: #666666">-1548.7058</span>               <span style="color: #666666">26.8544</span>              <span style="color: #666666">3.7978</span>

TOTAL                    <span style="color: #666666">-6762.4869</span>               <span style="color: #666666">26.1943</span>              <span style="color: #666666">3.7044</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2321</span>              <span style="color: #666666">0.5985</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.5681</span>              <span style="color: #666666">4.8887</span>
EGB                        <span style="color: #666666">983.2116</span>               <span style="color: #666666">33.0175</span>              <span style="color: #666666">4.6694</span>
ESURF                      <span style="color: #666666">-10.8367</span>                <span style="color: #666666">0.3832</span>              <span style="color: #666666">0.0542</span>

DELTA G gas              <span style="color: #666666">-1025.4769</span>               <span style="color: #666666">34.8262</span>              <span style="color: #666666">4.9252</span>
DELTA G solv               <span style="color: #666666">972.3749</span>               <span style="color: #666666">33.0197</span>              <span style="color: #666666">4.6697</span>

 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-53.1020</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">6.8437</span>                 <span style="color: #666666">0.9678</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

POISSON BOLTZMANN<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1863.7944</span>               <span style="color: #666666">16.9979</span>              <span style="color: #666666">2.4039</span>
EEL                     <span style="color: #666666">-17200.7297</span>               <span style="color: #666666">75.1734</span>             <span style="color: #666666">10.6311</span>
EPB                      <span style="color: #666666">-3216.4587</span>               <span style="color: #666666">65.8638</span>              <span style="color: #666666">9.3146</span>
ECAVITY                     <span style="color: #666666">67.8762</span>                <span style="color: #666666">0.7739</span>              <span style="color: #666666">0.1094</span>

G gas                   <span style="color: #666666">-19064.5240</span>               <span style="color: #666666">77.0712</span>             <span style="color: #666666">10.8995</span>
G solv                   <span style="color: #666666">-3148.5825</span>               <span style="color: #666666">65.8684</span>              <span style="color: #666666">9.3152</span>

TOTAL                   <span style="color: #666666">-22213.1066</span>               <span style="color: #666666">51.7402</span>              <span style="color: #666666">7.3172</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                  <span style="color: #666666">-1268.1888</span>               <span style="color: #666666">14.0912</span>              <span style="color: #666666">1.9928</span>
EEL                     <span style="color: #666666">-11557.0773</span>               <span style="color: #666666">70.9920</span>             <span style="color: #666666">10.0398</span>
EPB                      <span style="color: #666666">-2489.5955</span>               <span style="color: #666666">55.9343</span>              <span style="color: #666666">7.9103</span>
ECAVITY                     <span style="color: #666666">47.1495</span>                <span style="color: #666666">0.4689</span>              <span style="color: #666666">0.0663</span>

G gas                   <span style="color: #666666">-12825.2661</span>               <span style="color: #666666">72.3770</span>             <span style="color: #666666">10.2356</span>
G solv                   <span style="color: #666666">-2442.4460</span>               <span style="color: #666666">55.9363</span>              <span style="color: #666666">7.9106</span>

TOTAL                   <span style="color: #666666">-15267.7121</span>               <span style="color: #666666">38.0243</span>              <span style="color: #666666">5.3774</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                   <span style="color: #666666">-529.3090</span>                <span style="color: #666666">9.3251</span>              <span style="color: #666666">1.3188</span>
EEL                      <span style="color: #666666">-4684.4720</span>               <span style="color: #666666">35.7816</span>              <span style="color: #666666">5.0603</span>
EPB                      <span style="color: #666666">-1673.2574</span>               <span style="color: #666666">27.4055</span>              <span style="color: #666666">3.8757</span>
ECAVITY                     <span style="color: #666666">28.0328</span>                <span style="color: #666666">0.4091</span>              <span style="color: #666666">0.0579</span>

G gas                    <span style="color: #666666">-5213.7811</span>               <span style="color: #666666">36.9768</span>              <span style="color: #666666">5.2293</span>
G solv                   <span style="color: #666666">-1645.2246</span>               <span style="color: #666666">27.4085</span>              <span style="color: #666666">3.8761</span>

TOTAL                    <span style="color: #666666">-6859.0057</span>               <span style="color: #666666">24.7882</span>              <span style="color: #666666">3.5056</span>

<span style="#FF0000">　</span>
Differences (Complex <span style="color: #666666">-</span> Receptor <span style="color: #666666">-</span> Ligand)<span style="color: #666666">:</span>
Energy Component            Average              Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>   Std<span style="color: #666666">.</span> Err<span style="color: #666666">.</span> of Mean
<span style="color: #666666">-------------------------------------------------------------------------------</span>
VDWAALS                    <span style="color: #666666">-66.2966</span>                <span style="color: #666666">4.2321</span>              <span style="color: #666666">0.5985</span>
EEL                       <span style="color: #666666">-959.1803</span>               <span style="color: #666666">34.5681</span>              <span style="color: #666666">4.8887</span>
EPB                        <span style="color: #666666">946.3942</span>               <span style="color: #666666">34.1674</span>              <span style="color: #666666">4.8320</span>
ECAVITY                     <span style="color: #666666">-7.3062</span>                <span style="color: #666666">0.2973</span>              <span style="color: #666666">0.0420</span>

DELTA G gas              <span style="color: #666666">-1025.4769</span>               <span style="color: #666666">34.8262</span>              <span style="color: #666666">4.9252</span>
DELTA G solv               <span style="color: #666666">939.0881</span>               <span style="color: #666666">34.1687</span>              <span style="color: #666666">4.8322</span>

<span style="#FF0000">　</span>
<span style="#FF0000">　</span>
 DELTA G binding <span style="color: #666666">=</span>        <span style="color: #666666">-86.3888</span>     <span style="color: #666666">+/-</span>      <span style="color: #666666">8.1817</span>                 <span style="color: #666666">1.1571</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>

<span style="color: #A0A000">WARNINGS:</span>
igb<span style="color: #666666">=5</span> should be used with either mbondi2 <span style="color: #AA22FF; font-weight: bold">or</span> bondi pbradii set<span style="color: #666666">.</span> Yours are modified Bondi radii (mbondi)
</pre></div>
</td></tr></table>

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_DECOMP_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
47</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Thu May <span style="color: #666666">20</span> <span style="color: #666666">14:55:43</span> EDT <span style="color: #666666">2010</span>
idecomp <span style="color: #666666">=</span> <span style="color: #666666">1:</span> Decomposition per<span style="color: #666666">-</span>residue adding <span style="color: #666666">1-4</span> interactions added to Internal<span style="color: #666666">.</span>
Energy Decomposition Analysis (All units kcal<span style="color: #666666">/</span>mol)<span style="color: #666666">:</span> Generalized Born solvent

<span style="#FF0000">　</span>
<span style="color: #A0A000">DELTAS:</span>
Total Energy Decomposition<span style="color: #666666">:</span>
Residue <span style="color: #666666">|</span>  Location <span style="color: #666666">|</span>       Internal      <span style="color: #666666">|</span>    van der Waals    <span style="color: #666666">|</span>    Electrostatic    <span style="color: #666666">|</span>   Polar Solvation   <span style="color: #666666">|</span>   Non<span style="color: #666666">-</span>Polar Solv<span style="color: #666666">.</span>   <span style="color: #666666">|</span>       TOTAL
<span style="color: #666666">-------------------------------------------------------------------------------------------------------------------------------------------------------</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> R LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.870</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.156</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.465</span> <span style="color: #666666">|</span>   <span style="color: #666666">69.267</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.154</span> <span style="color: #666666">|</span>  <span style="color: #666666">-67.061</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.601</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.009</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.156</span> <span style="color: #666666">|</span>    <span style="color: #666666">2.040</span> <span style="color: #666666">+/-</span> <span style="color: #666666">14.208</span>
ASP  <span style="color: #666666">30</span> <span style="color: #666666">|</span> R ASP  <span style="color: #666666">30</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.623</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.065</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.961</span> <span style="color: #666666">|</span>  <span style="color: #666666">-52.559</span> <span style="color: #666666">+/-</span> <span style="color: #666666">11.072</span> <span style="color: #666666">|</span>   <span style="color: #666666">52.622</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.530</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.084</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.003</span> <span style="color: #666666">+/-</span> <span style="color: #666666">15.684</span>
GLU  <span style="color: #666666">31</span> <span style="color: #666666">|</span> R GLU  <span style="color: #666666">31</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.174</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.247</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.099</span> <span style="color: #666666">|</span>  <span style="color: #666666">-79.946</span> <span style="color: #666666">+/-</span> <span style="color: #666666">10.550</span> <span style="color: #666666">|</span>   <span style="color: #666666">80.630</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.693</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.227</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.125</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.210</span> <span style="color: #666666">+/-</span> <span style="color: #666666">15.272</span>
TYR  <span style="color: #666666">32</span> <span style="color: #666666">|</span> R TYR  <span style="color: #666666">32</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.615</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.290</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.515</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.639</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.431</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.076</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.229</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.012</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.175</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.261</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.327</span>
ASP  <span style="color: #666666">33</span> <span style="color: #666666">|</span> R ASP  <span style="color: #666666">33</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.464</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.556</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.073</span> <span style="color: #666666">|</span> <span style="color: #666666">-103.116</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.820</span> <span style="color: #666666">|</span>  <span style="color: #666666">103.788</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.821</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.459</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.094</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.343</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.426</span>
PRO  <span style="color: #666666">34</span> <span style="color: #666666">|</span> R PRO  <span style="color: #666666">34</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.388</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.829</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.869</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.383</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.647</span> <span style="color: #666666">|</span>    <span style="color: #666666">3.854</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.944</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.308</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.130</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.666</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.800</span>
THR  <span style="color: #666666">35</span> <span style="color: #666666">|</span> R THR  <span style="color: #666666">35</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.702</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.829</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.049</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.376</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.365</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.947</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.028</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.204</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.070</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.709</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.536</span>
ILE  <span style="color: #666666">36</span> <span style="color: #666666">|</span> R ILE  <span style="color: #666666">36</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.650</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.987</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.918</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.092</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.149</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.991</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.697</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.377</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.072</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.282</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.515</span>
GLU  <span style="color: #666666">37</span> <span style="color: #666666">|</span> R GLU  <span style="color: #666666">37</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.221</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.627</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.388</span> <span style="color: #666666">|</span> <span style="color: #666666">-126.728</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.441</span> <span style="color: #666666">|</span>  <span style="color: #666666">120.528</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.686</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.745</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.048</span> <span style="color: #666666">|</span>   <span style="color: #666666">-8.573</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.624</span>
ASP  <span style="color: #666666">38</span> <span style="color: #666666">|</span> R ASP  <span style="color: #666666">38</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.750</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.583</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.560</span> <span style="color: #666666">|</span> <span style="color: #666666">-104.899</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.925</span> <span style="color: #666666">|</span>   <span style="color: #666666">99.370</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.710</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.254</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.037</span> <span style="color: #666666">|</span>   <span style="color: #666666">-7.367</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.852</span>
SER  <span style="color: #666666">39</span> <span style="color: #666666">|</span> R SER  <span style="color: #666666">39</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.447</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.184</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.086</span> <span style="color: #666666">|</span>  <span style="color: #666666">-13.696</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.959</span> <span style="color: #666666">|</span>    <span style="color: #666666">8.918</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.800</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.504</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.035</span> <span style="color: #666666">|</span>   <span style="color: #666666">-7.466</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.655</span>
TYR  <span style="color: #666666">40</span> <span style="color: #666666">|</span> R TYR  <span style="color: #666666">40</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.687</span> <span style="color: #666666">|</span>   <span style="color: #666666">-4.403</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.682</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.076</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.884</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.652</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.092</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.366</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.042</span> <span style="color: #666666">|</span>   <span style="color: #666666">-6.193</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.858</span>
ARG <span style="color: #666666">170</span> <span style="color: #666666">|</span> L ARG   <span style="color: #666666">4</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.987</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.094</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.646</span> <span style="color: #666666">|</span>  <span style="color: #666666">-86.951</span> <span style="color: #666666">+/-</span> <span style="color: #666666">10.352</span> <span style="color: #666666">|</span>   <span style="color: #666666">82.074</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.005</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.147</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.073</span> <span style="color: #666666">|</span>   <span style="color: #666666">-5.118</span> <span style="color: #666666">+/-</span> <span style="color: #666666">13.069</span>
VAL <span style="color: #666666">171</span> <span style="color: #666666">|</span> L VAL   <span style="color: #666666">5</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.812</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.183</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.390</span> <span style="color: #666666">|</span>    <span style="color: #666666">2.128</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.460</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.010</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.555</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.008</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.065</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.778</span>
PHE <span style="color: #666666">172</span> <span style="color: #666666">|</span> L PHE   <span style="color: #666666">6</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.289</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.217</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.944</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.037</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.743</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.132</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.939</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.064</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.048</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.818</span>
LEU <span style="color: #666666">173</span> <span style="color: #666666">|</span> L LEU   <span style="color: #666666">7</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.907</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.398</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.241</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.940</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.050</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.683</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.446</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.022</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.345</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.084</span>
PRO <span style="color: #666666">174</span> <span style="color: #666666">|</span> L PRO   <span style="color: #666666">8</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.433</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.188</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.422</span> <span style="color: #666666">|</span>    <span style="color: #666666">2.303</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.219</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.589</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.289</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.051</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.474</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.083</span>
ASN <span style="color: #666666">175</span> <span style="color: #666666">|</span> L ASN   <span style="color: #666666">9</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.796</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.671</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.017</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.833</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.740</span> <span style="color: #666666">|</span>    <span style="color: #666666">4.535</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.409</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.354</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.119</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.678</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.233</span>
LYS <span style="color: #666666">176</span> <span style="color: #666666">|</span> L LYS  <span style="color: #666666">10</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.403</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.848</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.810</span> <span style="color: #666666">|</span>  <span style="color: #666666">-33.879</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.269</span> <span style="color: #666666">|</span>   <span style="color: #666666">36.798</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.704</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.315</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.107</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.756</span> <span style="color: #666666">+/-</span> <span style="color: #666666">10.856</span>
GLN <span style="color: #666666">177</span> <span style="color: #666666">|</span> L GLN  <span style="color: #666666">11</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.261</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.791</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.560</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.910</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.338</span> <span style="color: #666666">|</span>    <span style="color: #666666">4.530</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.016</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.359</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.050</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.530</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.983</span>
ARG <span style="color: #666666">178</span> <span style="color: #666666">|</span> L ARG  <span style="color: #666666">12</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.180</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.462</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.321</span> <span style="color: #666666">|</span>  <span style="color: #666666">-77.671</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.496</span> <span style="color: #666666">|</span>   <span style="color: #666666">73.669</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.608</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.386</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.076</span> <span style="color: #666666">|</span>   <span style="color: #666666">-6.850</span> <span style="color: #666666">+/-</span> <span style="color: #666666">10.167</span>
THR <span style="color: #666666">179</span> <span style="color: #666666">|</span> L THR  <span style="color: #666666">13</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.716</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.277</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.200</span> <span style="color: #666666">|</span>  <span style="color: #666666">-10.976</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.020</span> <span style="color: #666666">|</span>    <span style="color: #666666">9.344</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.977</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.158</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.031</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.068</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.810</span>
VAL <span style="color: #666666">180</span> <span style="color: #666666">|</span> L VAL  <span style="color: #666666">14</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.196</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.837</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.389</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.014</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.541</span> <span style="color: #666666">|</span>    <span style="color: #666666">2.972</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.804</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.501</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.041</span> <span style="color: #666666">|</span>   <span style="color: #666666">-4.379</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.161</span>
VAL <span style="color: #666666">181</span> <span style="color: #666666">|</span> L VAL  <span style="color: #666666">15</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.333</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.791</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.119</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.565</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.809</span> <span style="color: #666666">|</span>    <span style="color: #666666">3.472</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.656</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.155</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.055</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.039</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.324</span>
ASN <span style="color: #666666">182</span> <span style="color: #666666">|</span> L ASN  <span style="color: #666666">16</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.282</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.978</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.859</span> <span style="color: #666666">|</span>   <span style="color: #666666">-3.199</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.507</span> <span style="color: #666666">|</span>    <span style="color: #666666">3.645</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.886</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.369</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.085</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.900</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.598</span>
VAL <span style="color: #666666">183</span> <span style="color: #666666">|</span> L VAL  <span style="color: #666666">17</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.088</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.187</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.149</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.057</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.557</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.672</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.388</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.073</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.199</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.671</span>
ARG <span style="color: #666666">184</span> <span style="color: #666666">|</span> L ARG  <span style="color: #666666">18</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.797</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.183</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.450</span> <span style="color: #666666">|</span>  <span style="color: #666666">-90.812</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.977</span> <span style="color: #666666">|</span>   <span style="color: #666666">87.306</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.336</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.335</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.109</span> <span style="color: #666666">|</span>   <span style="color: #666666">-4.023</span> <span style="color: #666666">+/-</span> <span style="color: #666666">11.353</span>
ASN <span style="color: #666666">185</span> <span style="color: #666666">|</span> L ASN  <span style="color: #666666">19</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.744</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.018</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.966</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.268</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.498</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.303</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.029</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.099</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.017</span> <span style="color: #666666">+/-</span> <span style="color: #666666">10.315</span>
GLY <span style="color: #666666">186</span> <span style="color: #666666">|</span> L GLY  <span style="color: #666666">20</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.371</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.008</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.701</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.334</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.324</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.379</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.810</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.057</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.037</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.846</span>
MET <span style="color: #666666">187</span> <span style="color: #666666">|</span> L MET  <span style="color: #666666">21</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.770</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.156</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.254</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.692</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.999</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.697</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.588</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.031</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.089</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.181</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.204</span>
SER <span style="color: #666666">188</span> <span style="color: #666666">|</span> L SER  <span style="color: #666666">22</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.828</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.013</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.008</span> <span style="color: #666666">|</span>    <span style="color: #666666">2.808</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.910</span> <span style="color: #666666">|</span>   <span style="color: #666666">-2.793</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.893</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.061</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.002</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.917</span>
LEU <span style="color: #666666">189</span> <span style="color: #666666">|</span> L LEU  <span style="color: #666666">23</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.943</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.021</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.312</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.683</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.195</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.464</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.671</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.013</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.197</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.606</span>
HIP <span style="color: #666666">190</span> <span style="color: #666666">|</span> L HIP  <span style="color: #666666">24</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.252</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.024</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.131</span> <span style="color: #666666">|</span>  <span style="color: #666666">-43.617</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.567</span> <span style="color: #666666">|</span>   <span style="color: #666666">43.652</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.925</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.083</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.011</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">9.172</span>
ASP <span style="color: #666666">191</span> <span style="color: #666666">|</span> L ASP  <span style="color: #666666">25</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.724</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.058</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.723</span> <span style="color: #666666">|</span>   <span style="color: #666666">62.413</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">8.165</span> <span style="color: #666666">|</span>  <span style="color: #666666">-61.719</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">8.199</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.107</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.636</span> <span style="color: #666666">+/-</span> <span style="color: #666666">12.178</span>
CYS <span style="color: #666666">192</span> <span style="color: #666666">|</span> L CYS  <span style="color: #666666">26</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.318</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.098</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.398</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.937</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.894</span> <span style="color: #666666">|</span>   <span style="color: #666666">-1.552</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.485</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.042</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.287</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">6.900</span>
LEU <span style="color: #666666">193</span> <span style="color: #666666">|</span> L LEU  <span style="color: #666666">27</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.324</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.108</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.390</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.884</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.119</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.740</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.648</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.006</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.036</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">5.054</span>

<span style="color: #666666">...</span> <span style="#FF0000">以下</span><span style="color: #666666">250</span><span style="#FF0000">行省略</span>
</pre></div>
</td></tr></table>

`FINAL_DECOMP_MMPBSA.dat`输出文件包含有关每个残基与体系其余部分相互作用的信息, 这些信息分为: 内能(`idecomp=1`时, 势能项包括键, 角, 二面角和1-4相互作用), 范德华能(`idecomp=2`时, 包括`VDW`和`1-4 VDW`), 静电能(`idecomp=2`时, 包括`EEL`和`1-4 EEL`), 极性溶剂化能和非极性溶剂化能. 这个文件被分成如下几个部分:

复合物, 受体, 配体和`DELTA`(定义为复合物减去受体减去配体)中每个残基的分解能量会分别输出到各自的部分中. 此外, 每个残基的能量贡献会进一步分解为对骨架, 侧链及总能量贡献. `Backbone`是骨架原子与体系中所有其他原子之间的相互作用能, `Sidechain`是侧链原子与体系中所有其他原子之间的相互作用能. `Total`是残基中每个原子与系统中所有其他原子之间的相互作用能(因此是该残基的`Backbone`和`Sidechain`值的总和). 每个残基项会分解成上述的组成部分, 由相互作用的平均值+/-该项的标准偏差组成. `DELTA`部分额外包含一个名为`Location`的列, 列出复合物中特定残基的位置(`R`代表受体, `L`代表配体). 变量`dec_verbose`控制分解输出文件的详细程度(详细信息请参阅手册).

#### b. 残基对能量分解

注意: 根据我们的经验, 用PB隐式溶剂模型进行残基对能量分解分析需要非常长的时间才能完成. 下面的分析, 同时使用了GB和PB对50帧进行分析, 在9个处理器(9个独立的32位单核2.8 GHz Xeon处理器)上花费了61小时. 而GB分析只花了3分钟. 所以如果你选择进行PB残基对能量分解, 可能需要很长的模拟时间.

在本节中, 我们将修改输入文件以执行残基对能量分解. 与上面的单个残基能量分解的输入文件大部分相同, 残基对能量分解输入文件[`mmpbsa_pairwise_decomp.in`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/mmpbsa_pairwise_decomp.in)如下所示:

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa_pairwise_decomp.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
14</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>Pairwise GB <span style="color: #AA22FF; font-weight: bold">and</span> PB decomposition
<span style="color: #666666">&amp;</span>general
   endframe<span style="color: #666666">=50</span>, verbose<span style="color: #666666">=1</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>gb
  igb<span style="color: #666666">=5</span>, saltcon<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>pb
  istrng<span style="color: #666666">=0.100</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>decomp
  idecomp<span style="color: #666666">=1</span>, print_res<span style="color: #666666">=</span><span style="color: #BB4444">&quot;5; 30-40; 170-200&quot;</span>
  dec_verbose<span style="color: #666666">=0</span>,
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

用于启动`MMPBSA.py`的命令与单个残基能量分解的命令相同. 但是, 定义用于残基对能量分解的`&decomp`命名列表中的`print_res`时需格外小心. 残基对能量分解需要计算的项数为n<sup>2</sup>, 其中n为`print_res`指定的残基数. 默认情况下, `print_res`对应于复合物中的每个残基, 对Ras-Raf会创建大约65 MB(超过450,000行)的分解输出文件. 而且, 由`sander`创建的`mdout`文件也将非常大(可能有几个GB, 具体取决于分析的帧数和残基对数), 并且解析所需的内存/时间需求变得相当巨大(即, 解析输出可能需要几分钟时间). 计算的残基对是`print_res`中指定的残基与`print_res`中指定的每个其他残基之间的残基对. 有关`print_res`变量的语法说明, 请参阅手册.

[`FINAL_DECOMP_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_DECOMP_MMPBSA_pair.dat)的部分输出结果如下图所示:

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_DECOMP_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
44</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Sun May <span style="color: #666666">23</span> <span style="color: #666666">05:36:28</span> EDT <span style="color: #666666">2010</span>
idecomp <span style="color: #666666">=</span> <span style="color: #666666">3:</span> Pairwise decomposition adding <span style="color: #666666">1-4</span> interactions added to Internal<span style="color: #666666">.</span>
Pairwise Energy Decomposition Analysis (All units kcal<span style="color: #666666">/</span>mol)<span style="color: #666666">:</span> Generalized Born solvent

<span style="#FF0000">　</span>
<span style="color: #A0A000">DELTAS:</span>
Total Energy Decomposition<span style="color: #666666">:</span>
Resid <span style="color: #666666">1</span> <span style="color: #666666">|</span> Resid <span style="color: #666666">2</span> <span style="color: #666666">|</span>       Internal      <span style="color: #666666">|</span>    van der Waals    <span style="color: #666666">|</span>    Electrostatic    <span style="color: #666666">|</span>   Polar Solvation   <span style="color: #666666">|</span>   Non<span style="color: #666666">-</span>Polar Solv<span style="color: #666666">.</span>   <span style="color: #666666">|</span>       TOTAL
<span style="color: #666666">-----------------------------------------------------------------------------------------------------------------------------------------------------</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.075</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.408</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.601</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.229</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.051</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.601</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">8.064</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ASP  <span style="color: #666666">30</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.341</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.339</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.480</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> GLU  <span style="color: #666666">31</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.350</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.348</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.494</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> TYR  <span style="color: #666666">32</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.001</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.071</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.070</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.099</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ASP  <span style="color: #666666">33</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.434</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.431</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.612</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> PRO  <span style="color: #666666">34</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.064</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.064</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.090</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> THR  <span style="color: #666666">35</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.189</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.008</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.183</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.008</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.262</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ILE  <span style="color: #666666">36</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.001</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.120</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.021</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.130</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.021</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.177</span>

<span style="color: #666666">...</span> <span style="#FF0000">以下</span><span style="color: #666666">1800</span><span style="#FF0000">行省略</span>

ARG <span style="color: #666666">200</span> <span style="color: #666666">|</span> LEU <span style="color: #666666">197</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.423</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.779</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.226</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.442</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.022</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.226</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.991</span>
ARG <span style="color: #666666">200</span> <span style="color: #666666">|</span> LYS <span style="color: #666666">198</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.284</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.793</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.237</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.572</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.011</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.237</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.018</span>
ARG <span style="color: #666666">200</span> <span style="color: #666666">|</span> VAL <span style="color: #666666">199</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.291</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.832</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.460</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.587</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.019</span> <span style="color: #666666">|</span>    <span style="color: #666666">1.460</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.059</span>
ARG <span style="color: #666666">200</span> <span style="color: #666666">|</span> ARG <span style="color: #666666">200</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.562</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.888</span> <span style="color: #666666">|</span>   <span style="color: #666666">14.394</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.388</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.035</span> <span style="color: #666666">|</span>   <span style="color: #666666">14.394</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">4.598</span>
idecomp <span style="color: #666666">=</span> <span style="color: #666666">3:</span> Pairwise decomposition adding <span style="color: #666666">1-4</span> interactions added to Internal<span style="color: #666666">.</span>
Pairwise Energy Decomposition Analysis (All units kcal<span style="color: #666666">/</span>mol)<span style="color: #666666">:</span> Poisson Boltzmann solvent

<span style="#FF0000">　</span>
<span style="color: #A0A000">DELTAS:</span>
Total Energy Decomposition<span style="color: #666666">:</span>
Resid <span style="color: #666666">1</span> <span style="color: #666666">|</span> Resid <span style="color: #666666">2</span> <span style="color: #666666">|</span>       Internal      <span style="color: #666666">|</span>    van der Waals    <span style="color: #666666">|</span>    Electrostatic    <span style="color: #666666">|</span>   Polar Solvation   <span style="color: #666666">|</span>   Non<span style="color: #666666">-</span>Polar Solv<span style="color: #666666">.</span>   <span style="color: #666666">|</span>       TOTAL
<span style="color: #666666">-----------------------------------------------------------------------------------------------------------------------------------------------------</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.075</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">3.408</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.670</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.128</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.670</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">7.974</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ASP  <span style="color: #666666">30</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.341</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.007</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.334</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.007</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.477</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> GLU  <span style="color: #666666">31</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.350</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.009</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.344</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.009</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.491</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> TYR  <span style="color: #666666">32</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.001</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.071</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.002</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.069</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.002</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.098</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ASP  <span style="color: #666666">33</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.434</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.007</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.423</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.007</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.606</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> PRO  <span style="color: #666666">34</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.064</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.063</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.090</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> THR  <span style="color: #666666">35</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.189</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.024</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.175</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.024</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.257</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ILE  <span style="color: #666666">36</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.001</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.120</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.009</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.102</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.009</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.158</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> GLU  <span style="color: #666666">37</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.008</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.649</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.223</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.624</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.223</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.315</span>
LYS   <span style="color: #666666">5</span> <span style="color: #666666">|</span> ASP  <span style="color: #666666">38</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.009</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.802</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.191</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">1.383</span> <span style="color: #666666">|</span>    <span style="color: #666666">0.000</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">0.000</span> <span style="color: #666666">|</span>   <span style="color: #666666">-0.191</span> <span style="color: #666666">+/-</span>  <span style="color: #666666">2.272</span>

<span style="color: #666666">...</span> <span style="#FF0000">以下</span><span style="color: #666666">1800</span><span style="#FF0000">行省略</span>
</pre></div>
</td></tr></table>

值得注意的是, `FINAL_RESULTS_MMPBSA.dat`输出的结果与单个残基能量分解的结果完全相同, 因为能量分解的方式不会影响总值. 因此, 这里忽略了文件以避免重重.

### 3.6 利用简正模式分析(Nmode)计算雌激素受体和雷洛昔芬复合物的熵

#### 0. 简正模式计算的参数设置

请注意, 截至2010年5月, 简正计算是通过nab编译的nab程序`mmpbsa_py_nabnmode`完成的, 正常的安装过程可参考[这里](http://ambermd.org/tutorials/advanced/tutorial3/py_script/compile.htm). 该程序必须存在于`PATH`或`$AMBERHOME/exe`中才能运行计算. `mmpbsa_py_nabnmode`和`nmode`之间的主要区别在于nab程序可以计算广义波恩(GB)溶剂中的简正模式, 因此另外又增加了两个输入变量(参见手册中的`nmode_igb`和`nmode_istrng`). 这个实现还应该改进了早期版本脚本中出现的最小化收敛问题.

#### 1. 构建起始拓扑和坐标文件, 模拟获得平衡体系

方法见3.3节.

#### 2. 简正模式分析计算结合熵(normal mode)

我们将计算复合物, 受体和配体的简正模式, 并对结果进行平均以估计结合熵.  请注意, 复合物体系的熵贡献可以通过取消`&general`命名列表中最后一行的注释进, 利用AmberTools中的`ptraj`模块进行准简谐熵计算.

 我们将利用`MMPBSA.py`的输入文件[`mmpbsa.in`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/mmpbsa_nm.in)进行简正模式计算:

<table class="highlighttable"><th colspan="2" style="text-align:left">mmpbsa.in</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3
4
5
6
7
8</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #AA22FF">Input</span> file for running entropy calculations using NMode
<span style="color: #666666">&amp;</span>general
   endframe<span style="color: #666666">=50</span>, keep_files<span style="color: #666666">=2</span>,
<span style="color: #666666">/</span>
<span style="color: #666666">&amp;</span>nmode
   nmstartframe<span style="color: #666666">=1</span>, nmendframe<span style="color: #666666">=50</span>,
   nminterval<span style="color: #666666">=5</span>, nmode_igb<span style="color: #666666">=1</span>, nmode_istrng<span style="color: #666666">=0.1</span>,
<span style="color: #666666">/</span>
</pre></div>
</td></tr></table>

文件中的`endframe`变量设置当用`ptraj`构建无溶剂体系的`mdcrd`文件时, 读入轨迹时在哪一帧停止. `keep_files`变量允许用户指定计算结束后删除哪些文件. `&nmode`命名列表用于定义用于简正模式计算的变量. 对要分析的无溶剂体系, `nmstartframe`变量定义简正模式分析开始时对应的帧. `nmendframe`和`nminterval`分别定义了简正模式分析的结束帧和帧间隔. 值得注意的是, `nmstartframe`/`endframe`/`interval`这些变量对应的"轨迹"是由`&general`命名列表中定义的`startframe`, `endframe`和`interval`变量提取出来的快照. 因此, 只有这些帧的一部分才能用于简正模式计算(最多是`_MMPBSA_complex.mdcrd`中的每帧).

运行命令如下:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">$AMBERHOME/bin/MMPBSA.py</span> <span style="color:#666">-O</span> <span style="color:#666">-i</span> mmpbsa.in <span style="color:#666">-o</span> FINAL_RESULTS_MMPBSA.dat <span style="color:#666">-sp</span> 1err.solvated.prmtop <span style="color:#666">-cp</span> complex.prmtop <span style="color:#666">-rp</span> receptor.prmtop <span style="color:#666">-lp</span> ligand.prmtop <span style="color:#666">-y</span> *.mdcrd > progress.log
</pre></div>

或者使用下面的命令将作业脚本提交到排队系统, 如PBS系统:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">qsub</span> nmode.job
</pre></div>

作业脚本[`nmode.job`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/nmode.job)看上去和bash类似, 内容如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">nmode.job</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
13</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">#!/bin/sh</span>
<span style="color: #008800; font-style: italic">#PBS -N nmode</span>
<span style="color: #008800; font-style: italic">#PBS -o nmode.out</span>
<span style="color: #008800; font-style: italic">#PBS -e nmode.err</span>
<span style="color: #008800; font-style: italic">#PBS -m abe</span>
<span style="color: #008800; font-style: italic">#PBS -M email@domain.edu</span>
<span style="color: #008800; font-style: italic">#PBS -q brute</span>
<span style="color: #008800; font-style: italic">#PBS -l nodes=1:surg:ppn=3</span>
<span style="color: #008800; font-style: italic">#PBS -l pmem=1450mb</span>

<span style="color: #AA22FF">cd</span> <span style="color: #B8860B">$PBS_O_WORKDIR</span>

mpirun -np <span style="color: #666666">3</span> MMPBSA.py.MPI -O -i mmpbsa_nm.in -o FINAL_RESULTS_MMPBSA.dat -sp 1err.solvated.prmtop -cp complex.prmtop -rp receptor.prmtop -lp ligand.prmtop -y 1err_prod.mdcrd &gt; progress.log
</pre></div>
</td></tr></table>

计算进度会输出到文件[`progress_nm.log`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/progress_nm.log). 计算过程中的所有错误也会输出到这个文件. 最后, 计算完成后会显示每个步骤所用的时间. 如果串行计算10帧大约需要40个小时. `MMPBSA.py.MPI`可以用来并行(运行细节请参考3.3节). 计算时会根据线程数量平均分配帧数. 体系的大小对计算时间和所需内存(RAM)有显著影响. 段错误(`segfaults`)通常是由于系统中RAM不足造成的.

<table class="highlighttable"><th colspan="2" style="text-align:left">progress_nm.log</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
20</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>ptraj found<span style="color: #666666">!</span> Using <span style="color: #666666">/</span>share<span style="color: #666666">/</span>local<span style="color: #666666">/</span>lib<span style="color: #666666">/</span>amber10<span style="color: #666666">/</span>i686<span style="color: #666666">/</span>bin<span style="color: #666666">/</span>ptraj
sander found<span style="color: #666666">!</span> Using <span style="color: #666666">/</span>share<span style="color: #666666">/</span>local<span style="color: #666666">/</span>lib<span style="color: #666666">/</span>amber10<span style="color: #666666">/</span>i686<span style="color: #666666">/</span>bin<span style="color: #666666">/</span>sander (serial only<span style="color: #666666">!</span>)
nmode found<span style="color: #666666">!</span> Using <span style="color: #666666">/</span>share<span style="color: #666666">/</span>local<span style="color: #666666">/</span>lib<span style="color: #666666">/</span>amber10<span style="color: #666666">/</span>i686<span style="color: #666666">/</span>bin<span style="color: #666666">/</span>nmode

Preparing trajectories with ptraj<span style="color: #666666">...</span>
<span style="color: #666666">50</span> frames were <span style="color: #00A000">read</span> <span style="color: #AA22FF; font-weight: bold">in</span> <span style="color: #AA22FF; font-weight: bold">and</span> processed by ptraj for use <span style="color: #AA22FF; font-weight: bold">in</span> calculation<span style="color: #666666">.</span>

Starting sander calls

<span style="#FF0000">　</span>
Starting nmode calculations<span style="color: #666666">...</span>
<span style="color: #A0A000">Timing:</span>
Processing Trajectories With Ptraj<span style="color: #666666">:</span>       <span style="color: #666666">0.240</span> min<span style="color: #666666">.</span>
Total Harmonic nmode Calculation Time<span style="color: #666666">:</span> <span style="color: #666666">2363.906</span> min<span style="color: #666666">.</span>
Output File Writing Time<span style="color: #666666">:</span>                 <span style="color: #666666">0.018</span> min<span style="color: #666666">.</span>

Total Time Taken<span style="color: #666666">:</span>                      <span style="color: #666666">2364.165</span> min<span style="color: #666666">.</span>

<span style="#FF0000">　</span>
MMPBSA Finished<span style="color: #666666">.</span> Thank you for using<span style="color: #666666">.</span> Please send any bugs<span style="color: #666666">/</span>suggestions<span style="color: #666666">/</span>comments to mmpbsa<span style="color: #666666">.</span>amber@gmail<span style="color: #666666">.</span>com
</pre></div>
</td></tr></table>

输出文件[`Nmode_output.tgz`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/Nmode_output.tgz)

上述命令利用`ptraj`生成了三个非溶剂化`mdcrd`文件(复合物, 受体和配体), 其中包含计算熵变时分析过的坐标. 简正模式计算时利用每个快照的PDB文件, 因此从复合物, 受体和配体的无溶剂`mdcrd`文件生成了10个PDB文件. 如果`entropy=1`, 还会生成一个平均结构的PDB文件, 其中的结构(通过RMS)对齐到所有快照. 如果需要, 可以使用`ptraj`对这个结构进行准简谐熵计算.

最终结果文件[`FINAL_RESULTS_MMPBSA.dat`](http://ambermd.org/tutorials/advanced/tutorial3/py_script/files/FINAL_RESULTS_MMPBSA_nmode.dat):

<table class="highlighttable"><th colspan="2" style="text-align:left">FINAL_RESULTS_MMPBSA.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
63</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">|</span> Run on Thu Feb <span style="color: #666666">11</span> <span style="color: #666666">12:44:26</span> EST <span style="color: #666666">2010</span>

<span style="color: #666666">|</span>Input file<span style="color: #666666">:</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Input file for running entropy calculations using NMode
<span style="color: #666666">|&amp;</span>general
<span style="color: #666666">|</span>   endframe<span style="color: #666666">=50</span>, keep_files<span style="color: #666666">=2</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|&amp;</span>nmode
<span style="color: #666666">|</span>   nmstartframe<span style="color: #666666">=1</span>, nmendframe<span style="color: #666666">=50</span>,
<span style="color: #666666">|</span>   nminterval<span style="color: #666666">=5</span>,
<span style="color: #666666">|/</span>
<span style="color: #666666">|--------------------------------------------------------------</span>
<span style="color: #666666">|</span>Solvated complex topology file<span style="color: #666666">:</span>  <span style="color: #666666">1</span>err<span style="color: #666666">.</span>solvated<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Complex topology file<span style="color: #666666">:</span>           complex<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Receptor topology file<span style="color: #666666">:</span>          receptor<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Ligand topology file<span style="color: #666666">:</span>            ligand<span style="color: #666666">.</span>prmtop
<span style="color: #666666">|</span>Initial mdcrd(s)<span style="color: #666666">:</span>                <span style="color: #666666">1</span>err_prod<span style="color: #666666">.</span>mdcrd
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Best guess for receptor mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:1-240&quot;</span>
<span style="color: #666666">|</span>Best guess for  ligand  mask<span style="color: #666666">:</span>   <span style="color: #BB4444">&quot;:241&quot;</span>
<span style="color: #666666">|</span>Ligand residue name <span style="color: #AA22FF; font-weight: bold">is</span> <span style="color: #BB4444">&quot;RAL&quot;</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>Calculations performed using <span style="color: #666666">50</span> frames<span style="color: #666666">.</span>
<span style="color: #666666">|</span>Poisson Boltzmann calculations performed using internal PBSA solver <span style="color: #AA22FF; font-weight: bold">in</span> sander<span style="color: #666666">.</span>
<span style="color: #666666">|</span>
<span style="color: #666666">|</span>All units are reported <span style="color: #AA22FF; font-weight: bold">in</span> kcal<span style="color: #666666">/</span>mole<span style="color: #666666">.</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
ENTROPY RESULTS (HARMONIC APPROXIMATION) CALCULATED WITH NMODE<span style="color: #666666">:</span>

<span style="color: #A0A000">Complex:</span>
Entropy Term          Average        Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>
<span style="color: #666666">-----------------------------------------------------------</span>
<span style="color: #A0A000">Translational:</span>        <span style="color: #666666">16.9389</span>           <span style="color: #666666">0.0000</span>
<span style="color: #A0A000">Rotational:</span>           <span style="color: #666666">17.3953</span>           <span style="color: #666666">0.0038</span>
<span style="color: #A0A000">Vibrational:</span>        <span style="color: #666666">2784.7967</span>           <span style="color: #666666">2.3982</span>
<span style="color: #A0A000">Total:</span>              <span style="color: #666666">2819.1307</span>           <span style="color: #666666">2.3964</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Receptor:</span>
Entropy Term          Average        Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>
<span style="color: #666666">-----------------------------------------------------------</span>
<span style="color: #A0A000">Translational:</span>        <span style="color: #666666">16.9233</span>           <span style="color: #666666">0.0000</span>
<span style="color: #A0A000">Rotational:</span>           <span style="color: #666666">17.3911</span>           <span style="color: #666666">0.0045</span>
<span style="color: #A0A000">Vibrational:</span>        <span style="color: #666666">2755.5693</span>           <span style="color: #666666">3.0352</span>
<span style="color: #A0A000">Total:</span>              <span style="color: #666666">2789.8840</span>           <span style="color: #666666">3.0342</span>

<span style="#FF0000">　</span>
<span style="color: #A0A000">Ligand:</span>
Entropy Term          Average        Std<span style="color: #666666">.</span> Dev<span style="color: #666666">.</span>
<span style="color: #666666">-----------------------------------------------------------</span>
<span style="color: #A0A000">Translational:</span>        <span style="color: #666666">13.2972</span>           <span style="color: #666666">0.0000</span>
<span style="color: #A0A000">Rotational:</span>           <span style="color: #666666">11.4991</span>           <span style="color: #666666">0.0496</span>
<span style="color: #A0A000">Vibrational:</span>          <span style="color: #666666">33.7549</span>           <span style="color: #666666">0.0442</span>
<span style="color: #A0A000">Total:</span>                <span style="color: #666666">58.5511</span>           <span style="color: #666666">0.0058</span>

<span style="#FF0000">　</span>
DELTA S total<span style="color: #666666">=</span>       <span style="color: #666666">-30.0192</span> <span style="color: #666666">+/-</span>       <span style="color: #666666">3.4064</span>

<span style="color: #A0A000">NOTE:</span> All entropy results have units kcal<span style="color: #666666">/</span>mol<span style="color: #666666">.</span> (Temperature has already been multiplied <span style="color: #AA22FF; font-weight: bold">in</span> as <span style="color: #666666">300.</span> K)
<span style="color: #666666">-------------------------------------------------------------------------------</span>
<span style="color: #666666">-------------------------------------------------------------------------------</span>
</pre></div>
</td></tr></table>

该输出文件的开始部分包含有关计算的各种细节. 输出文件的其余部分包括平动, 转动, 振动和总熵贡献的平均值, 标准偏差和均值的标准误差. 在这些部分之后, ΔS以均值以及标准差和标准误差的形式给出.

通常我们会期望生物复合物的ΔS值为负. 这意味着蛋白质和配体结合形成复合物时可用微观状态数减少. 可用微观状态数的减少主要来自配体被限制在结合位点附近, 并且当配体与蛋白结合之后, 配体的运动受到了限制.

我们得到的ΔS值等于-30.02 kcal/mol, 这意味着在纯水中该蛋白-配体复合体的生成是一个熵不利的过程. 但是, 该结果不等于真实的结合自由能, 因为我们没有估计结合自由能中的(有利的) 焓贡献.
