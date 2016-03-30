---
 layout: post
 title: GROMACS教程：伞形采样
 categories:
 - 科
 tags:
 - GMX
 mathjax: true
---

* toc
{:toc}

- 翻译: 付自豪; 校对: 刘恒江; 统稿: 李继存

![](/GMX/GMXtut-3_pull_start.png)

## 概述

本教程将指导用户设置和运行牵引模拟, 并进而计算两个物种之间的结合能. 本教程假定用户已经成功地完成了[溶菌酶教程](http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2)以及其他的一些教程. 否则的话, 用户需要对GROMACS模拟方法和拓扑组织的基础知识非常熟悉. 在本教程中, 我们特别关注正确创建体系的方法以及牵引代码的设置.

结合能($\D G_\text{bind}$)可由一系列伞形采样模拟得到的平均力势(PMF, potential of mean force)导出. 在这个过程中会创建一系列初始构型, 每个构型与一个位置相对应, 其中待研究分子(通常称为"配体")处于简谐势限制下, 与参考分子质量中心(COM)之间的距离借助伞形偏离势而逐渐增加. 这种限制可以使配体对构型空间中指定的区域进行采样, 采样沿它和参考分子或者结合部分之间的反应坐标进行. 为了能正确地重建PMF曲线, 采样窗口必须使配体位置有适当的重叠.

整个过程(本教程使用)的步骤如下:

- 沿单个自由度(反应坐标)产生一系列构型
- 从步骤1的轨迹中筛选出对应于所需COM间隔的构型
- 对每一构型运行伞形采样模拟, 并将其限制于对应选定COM距离的窗口中
- 使用加权直方图分析方法(WHAM, Weighted Histogram Analysis Method)得到PMF并计算 $\D G_\text{bind}$

本教程建议读者使用GROMACS 5.1或以上版本. 原教程(工作流程根据它得到)基于4.0.5版本, 但原则上可以用于4.0.x和4.5.x系列的任何版本. GROMACS 3.3.3版本后, 完全重写了牵引代码并进行了彻底的检查(以非常有益的方式), 这样这里所包含的信息(除相关技术的基础理论外)不再适用于GROMACS 5.1以下的版本.

## 第一步: 准备拓扑文件

创建一个用于伞形采样模拟的分子拓扑所用的方法与其他模拟一样. 首先获得待研究分子结构的坐标文件, 然后使用`gmx pdb2gmx`生成拓扑. 一些体系需要特别考虑(例如蛋白质-配体复合物, 膜蛋白等等). 对于蛋白-配体体系, 请查阅[这个教程](http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.6), 对于膜蛋白, 我推荐参考[这个教程](http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.3). 伞形采样的原则可以很容易地拓展到这些体系, 虽然在本教程中我们仅考虑蛋白质分子.

在本教程中我们所考虑的体系为单个多肽从Aβ<sub>42</sub>原丝纤维生长端的分离, 它基于我们最近发表的一篇[论文](http://pubs.acs.org/doi/abs/10.1021/jp9110794), 用于模拟所用的野生型Aβ<sub>42</sub>原丝纤维的结构文件可以在[这里](/GMX/GMXtut-3_input.pdb)下载, 其中每条链的N末端已进行了乙酰化. 原始的PDB登记代码为[2BEG](http://www.rcsb.org/pdb/explore/explore.do?structureId=2BEG).

使用`gmx pdb2gmx`处理结构:

	gmx pdb2gmx -f input.pdb -ignh -ter -o complex.gro

选择`GROMOS96 53A6`参数集, 对N末端选择`None`, C末端选择`COO-`. 在`topol_Protein_chain_B.itp`文件的末尾加上下面几行:

	#ifdef POSRES_B
	#include &quot;posre_Protein_chain_B.itp&quot;
	#endif

在之后的牵引模拟中, 我们会用链B作为固定参考, 因此需要特别限制此链的位置, 而不限定其他.

## 第二步: 定义单元晶胞

用于伞形采样的单元晶胞的定义方式不同于其他模拟. 主要考虑的一点是, 在牵引方向上必须要有足够的空间以保证牵引的连续, 同时又不能与体系的周期性映象相作用. 也就是, 在牵引进行的过程中, 最小映象约定必须一直满足, 同时, 牵引的距离必须始终小于牵引方向盒子矢量长度的一半. 你可能会问, 为什么?

GROMACS计算距离时, 会同时考虑周期性. 这意味着, 如果你有一个10 nm的盒子, 当牵引距离超过5.0 nm时, 周期性距离变成了牵引的参考距离, 这个距离其实小于5.0 nm! 这个事实会严重影响结果, 因为你 **认为** 的牵引距离并不是 **实际** 计算的距离.

为了避免上述复杂情况, 我们将在一个12.0 nm的盒子中进行总距离为5.0 nm的牵引. 在6.560 x 4.362 x 12 nm<sup>3</sup>的盒子中, 原丝纤维的质心位于(3.280, 2.181, 2.4775). 使用`gmx editconf`将原丝纤维置于这个位置:

	gmx editconf -f complex.gro -o newbox.gro -center 3.280 2.181 2.4775 -box 6.560 4.362 12

你可以使用一些可视化软件, 如VMD来查看原丝纤维在盒子中的位置. 在VMD中载入结构, 然后打开Tk控制台, 键入以下内容(注意: `>`为Tk的提示符, 并非实际输入):

	> pbc box

在VMD的窗口中, 你会看到类似下面的图:

![](/GMX/GMXtut-3_box.jpg)

## 第三步: 添加溶剂和离子

这一步骤与其他模拟类似, 如果不确定的话, 你可以参考[溶菌酶教程](http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2)以获得更多细节. 首先, 我们使用`gmx solvate`添加水:

	gmx solvate -cp newbox.gro -cs spc216.gro -o solv.gro -p topol.top

然后, 我们使用`gmx genion`, 并利用这个[.mdp文件](/GMX/GMXtut-3_ions.mdp)添加离子. 我们将会在100 mM(mmol/L)的NaCl溶液中运行模拟, 并添加相应的离子以中和抗衡离子:

	gmx grompp -f ions.mdp -c solv.gro -p topol.top -o ions.tpr
	gmx genion -s ions.tpr -o solv_ions.gro -p topol.top -pname NA -nname CL -neutral -conc 0.1

## 第四步: 能量最小化与平衡

能量最小化和平衡步骤与其他任何水中的蛋白质体系一样. 这里, 我们将采用最陡下降法进行最小化, 然后再进行NPT平衡. 你可以在[这里](/GMX/GMXtut-3_minim.mdp)下载用于最小化的.mdp文件, 用于NPT平衡的.mdp文件可以在[这里](/GMX/GMXtut-3_npt.mdp)下载.

启动`grompp`和`mdrun`, 像通常一样:

	gmx grompp -f minim.mdp -c solv_ions.gro -p topol.top -o em.tpr
	gmx mdrun -v -deffnm em
	gmx grompp -f npt.mdp -c em.gro -p topol.top -o npt.tpr
	gmx mdrun -deffnm npt

由于这些过程很耗时, 最好并行运行:

	gmx mdrun -nt X -deffnm npt

在上面的命令中, `X`代表并行运行时使用的线程数.

## 第五步: 生成构型

为了运行伞形采样, 我们必须沿反应坐标 $\z$ 生成一系列构型. 其中的一些构型将作为伞形采样窗口的初始构型, 并进行独立的模拟. 下图解释了这些原则. 图的上部显示了我们将要运行的牵引模拟, 目的在于产生一系列沿反应坐标的构型, 模拟完成后会抽取这些构型(图片上部和中部之间的虚线箭头). 图的中部对应着每一采样窗口内的独立模拟, 其中使用伞形偏离势将自由多肽的质心限制在窗口中. 图的底部展示了构型直方图的理想结果, 相邻窗口存在重叠, 这样以后就可以从这些模拟得到连续的能量函数.

![](/GMX/GMXtut-3_umbrella_schematic.jpg)

对本教程的例子, 反应坐标为Z轴. 为产生这些构型, 我们必须牵引多肽A, 使其远离原丝纤维. 我们将运行500 ps的牵引MD, 每1 ps保存一张快照. 这一设置是基于试错法(trial-and-error)得到的, 可得到合理的构型分布. 对于其他体系, 保存构型的频率可能需要更高或者更低, 只要足够就好. 关键是沿反应坐标获得足够的构型, 以使伞形采样窗口的间距正常, 窗口间距以多肽A和B的质心距离表示, 其中B为参考组.

牵引过程的.mdp文件可在[这里](/GMX/GMXtut-3_md_pull.mdp)下载. 其中所用牵引选项的简明解释如下:

	; Pull code
	pull                 = yes
	pull_ngroups         = 2
	pull_ncoords         = 1
	pull_group1_name     = Chain_B
	pull_group2_name     = Chain_A
	pull_coord1_type     = umbrella   ; 简谐偏离力 harmonic biasing force
	pull_coord1_geometry = distance   ; 简单的距离增加 simple distance increase
	pull_coord1_groups   = 1 2
	pull_coord1_dim      = N N Y
	pull_coord1_rate     = 0.01       ; 0.01 nm per ps = 10 nm per ns
	pull_coord1_k        = 1000       ; kJ mol^-1^ nm^-2^
	pull_start           = yes        ; 定义大于0的初始质心距离 define initial COM distance > 0

最近更新的牵引代码允许对不同几何形状, 刚度等同时施加任意数目的反应坐标(通过设置`pull_ncoords = N`, `pull_coord1_*`, `pull_coord2_*`, ... `pull_coordN_*`). 在本教程中, 只有一个反应坐标, 设置很简单.

- `pull = yes`: 激活牵引代码, 必须设置为`yes`以使下面的设置生效
- `pull_ngroups = 2`: 有两个组受伞形偏离势作用
- `pull_ncoords = 1`: 只有一个反应坐标
- `pull_group1_name = Chain_A`: 索引文件中第一个组的名称
- `pull_group2_name = Chain_B`: 索引文件中第二个组的名称
- `pull_coord1_type = umbrella`: 对第一个反应坐标(此处只有一个反应坐标)使用简谐势进行牵引. **注意**: 这个过程 **不是** 伞形采样. 我使用简谐势是为了定性地观测本研究中的分解途径. 简谐势允许力随着多肽A和B之间的相互作用而变化. 也就是, 这种力将会累加直到某些临界相互作用失效. 请阅读我们的[论文](http://pubs.acs.org/doi/abs/10.1021/jp9110794)获得更多细节. 为了产生伞形采样的初始构型, 你实际上可以使用任何牵引设置(`pull_coord1_type`和`pull_coord1_geometry`)的组合, 但是当进行真正的伞形采样(下一步骤)时, 你 **必须** 使用`pull_coord1_type = umbrella`. 尤其重要的是, 你不能施加极快的牵引速率或者极强的力常数, 这会使体系组分严重变形. 请参考[论文](http://pubs.acs.org/doi/abs/10.1021/jp9110794)(特别是论文的支撑材料)来看看我们是如何选择合适的牵引速率的.
- `pull_coord1_geometry = distance`: 参看.mdp文件中的注释; 你也可以使用`direction`或`direction_periodic`, 但必须更改其他牵引参数. 本教程使用的例子相对简单, 若要了解`pull_coord1_geometry`的更多不同设置, 请参阅[GROMACS手册](http://jerkwin.github.io/9999/12/31/GROMACS中文手册).
- `pull_coord1_groups = 1 2`: 由组1和组2(其名称分别为`Chain_B`和`Chain_A`)定义反应坐标
- `pull_coord1_dim = N N Y`: 仅沿Z轴方向牵引, 所以X, Y方向设置为`N`(no), Z方向设置为`Y`(yes)
- `pull_coord1_rate = 0.01`: 附着于牵引组的"哑粒子"的移动速率. 这一类型的牵引也被称为匀速牵引, 因为牵引速度固定
- `pull_coord1_k = 1000`: 牵引的力常数
- `pull_start = yes`: 初始的COM距离为第一帧的参考距离. 这样设置是有用的, 因为如果我们要牵引5.0 nm, 将初始COM距离转换为0(即`pull_start = no`)使得解释很困难.

还记得以前添加到`topol_B.itp`文件中的`#ifdef POSRES_B`语句么? 我们现在要使用它了. 通过限制原丝纤维的多肽B, 我们可以更容易地牵引多肽A. 由于链A与链B之间大量的非共价键相互作用, 如果我们不限制链B, 我们最终会沿着模拟盒子牵引整个复合物, 这不能很好地达到目的.

我们需要定义一些索引组用于牵引模拟, 使用`gmx make_ndx`:

	gmx make_ndx -f npt.gro
	(>为make_ndx的提示符)
	> r 1-27
	> name 19 Chain_A
	> r 28-54
	> name 20 Chain_B
	> q

现在, 运行连续的牵引模拟:

	gmx grompp -f md_pull.mdp -c npt.gro -p topol.top -n index.ndx -t npt.cpt -o pull.tpr
	gmx mdrun -s pull.tpr

再次强调, 此过程耗时较长, 如果可以的话请使用并行. 一旦模拟完成, 我们需要抽取定义伞形采样窗口的有用构型. 我发现最简单的方法如下:

- 定义窗口间距(0.1-0.2 nm)
- 从刚才得到的牵引轨迹中抽取出所有构型
- 确定每一构型中参考组和牵引组之间的质心距离
- 使用选出的构型作为伞形采样的输入

使用`gmx trjconv`从轨迹文件(`traj.xtc`)中抽取构型(当提示选择的时候, 选`group 0`以保存整个体系):

	gmx trjconv -s pull.tpr -f traj.xtc -o conf.gro -sep

这会生成一系列坐标文件(`conf0.gro`, `conf1.gro`, 等等), 对应于连续牵引模拟中保存的每一构型. 为了对生成的所有构型(501个!)反复地调用`gmx distance`命令(计算质心距离), 我写了一个简单的Perl脚本来完成这个工作. 它会自动生成包含距离信息的`summary_distances.dat`文件. 你可以从[这里](/GMX/GMXtut-3_distances.pl)下载这个脚本.

	perl distances.pl

查看`summary_distances.dat`的内容, 可以看到链A和链B质心间的距离随时间的变化. 根据需要的间距, 记下伞形采样用到的构型. 也就是, 如果你需要0.2 nm的间距, 你可以在`summary_distances.dat`中寻找下面的行:

	50   0.600
	...
	100  0.800

然后你可以使用`conf50.gro`和`conf100.gro`作为两个相邻伞形采样窗口的初始构型. 在进行下一步之前记下你需要使用的所有构型. 对于本教程, 采用0.2 nm间距的构型足够了, 尽管在原始工作中需要使用不同的间距(更小).

## 第六步: 伞形采样模拟

在这个例子中, 我们将沿Z轴以大约0.2 nm的间距进行采样, 质心距离从0.5 nm变化到5.0 nm. 下面的示例命令可能正确也可能不正确(因为构型编号可能会有差别), 但可以作为一个例子告诉大家如何对独立的坐标文件运行`gmx grompp`, 以产生全部23个输入文件(也请注意, 当间距为0.2 nm时, 大约4.5 nm的距离需要23个窗口. 在我们的[原始工作](http://pubs.acs.org/doi/abs/10.1021/jp9110794)中, 使用了31个非对称窗口).

确定了采样窗口的初始构型之后, 我们现在可以准备伞形采样模拟了. 我们需要产生许多输入文件以运行每个需要的模拟. 例如, 我们已经沿反应坐标确定了23个构型, 这意味着我们要生成23个不同的输入文件并进行23次独立的模拟. 在每个窗口中, 利用这个[.mdp文件](/GMX/GMXtut-3_npt_umbrella.mdp)运行一个简单的NPT平衡模拟作为开始.

首先使用`gmx grompp`:

	gmx grompp -f npt_umbrella.mdp -c conf0.gro -p topol.top -n index.ndx -o npt0.tpr
	...
	gmx grompp -f npt_umbrella.mdp -c conf450.gro -p topol.top -n index.ndx -o npt22.tpr

然后使用`gmx mdrun`:

	gmx mdrun -deffnm npt0
	...
	gmx mdrun -deffnm npt22

为启动伞形抽样, 还需要对每一个已平衡的构型调用`grompp`处理此[.mdp文件](/GMX/GMXtut-3_md_umbrella.mdp). 许多牵引参数与SMD过程中的相同, 除了`pull_rate1`以外, 它被设置为0. 我们不需要沿反应坐标移动构型, 而是将它限制在构型空间中定义好的窗口内. 设置`pull_start = yes`意味着初始的质心距离为参考距离, 我们不必对每个构型单独定义一个参考(`pull_init1`).

	gmx grompp -f md_umbrella.mdp -c conf0.gro -p topol.top -n index.ndx -o umbrella0.tpr
	...
	gmx grompp -f md_umbrella.mdp -c conf450.gro -p topol.top -n index.ndx -o umbrella22.tpr

现在, 需要使用`gmx mdrun`运行每个输入文件以进行实际的数据收集模拟. 一旦所有的模拟都完成了, 我们就可以进行数据分析了. 正确执行模拟的一个注意点: 未指定`-pf`和`-px`文件名时, 不要使用`mdrun`的`-deffnm`选项. 在这种情况下, 使用`-deffnm`将导致`pullf.xvg`与`pullx.xvg`输出到相同的文件(无论`-deffnm`指定了什么). 使用`-pf`和`-px`会覆盖`-deffnm`选项的设置, 即

	gmx mdrun -deffnm umbrella0 -pf pull-umbrella0.xvg -px pullx-umbrella0.xvg

Mike Harms提供了一个Python脚本, 可自动完成这一过程, 抽取坐标文件, 并设置`grompp`和`mdrun`命令. 你可以在[这里](/GMX/GMXtut-3_setup-umbrella-script.zip)下载他的脚本以及一些必要信息. 如果关于此脚本或其使用有什么反馈, 可以[联系Mike](http://www.hotmail.com/secure/start?action=compose&amp;to=harmsm@gmail.com&amp;subject=Umbrella%20sampling%20tutorial%20script). 谢谢Mike的贡献!

## 第七步: 数据分析

对伞形采样模拟而言, 最常见的分析是获取PMF, 并得到结合/解离过程的 $\D G$. 简单来说, $\D G$ 值是PMF曲线最高值和最低值之间的差值, 只要PMF值在大的质心距离处收敛到稳定值. 获得PMF曲线的常见方法是加权直方分析方法(WHAM, Weighted Histogram Analysis Method), 包含在GROMACS的`gmx wham`工具中. `gmx wham`的输入文件包括两个, 一个文件中列出了每一窗口模拟的.tpr文件的名称, 另一个文件中列出了每一窗口模拟中得到的`pullf.xvg`或`pullx.xvg`文件的名称. 例如, 一个简单的`tpr-files.dat`文件中可能包含:

	umbrella0.tpr
	umbrella1.tpr
	...
	umbrella22.tpr

文件`pullf-files.dat`或`pullx-files.dat`的内容与此类似, 只不过其中列出了`pullf.xvg`或`pullx.xvg`文件的名称. 注意文件的名称必须唯一, 相互之间不能重复(如`pullf0.xvg`, `pullf1.xvg`, 等等), 否则`gmx wham`运行会失败. 运行`gmx wham`:

gmx wham -it tpr-files.dat -if pullf-files.dat -o -hist -unit kCal

`gmx wham`工具会依次打开每一个`umbrella.tpr`和`pullf.xvg`文件, 并对它们进行WHAM分析. `-unit kCal`选项表明输出单位为kcal/mol, 但你也可以设置为kJ/mol或k<sub>B</sub>T. 注意: 你可能不得不舍去用于平衡的前几百ps轨迹(使用`gmx wham -b`), 因为我们是从非平衡模拟产生的起始构型. 一旦PMF曲线收敛, 你就会知道体系需要多长时间才能达到平衡. 最后, 你会得到一个`profile.xvg`文件, 其图形看起来像这样:

![](/GMX/GMXtut-3_PMF_WT_31windows.jpg)

请注意, 你得到的结果可能有所不同, 因为本教程中建议的间距与我之前的原始研究中实际用于生成上图数据所用的间距不同, 并且, 更重要的是, 我论文中的数据是对原丝纤维结构进行100 ns非限制MD平衡后得到的, 其结构实际上与本教程中的有很大不同. 曲线的整体形状应该是类似的, 如果你遵循论文中的流程, $\D G$ 的值(PMF曲线平台区与曲线能量最小点之间的差)应接近&#8211;50.5 kcal/mol(如上图所示). 如果你遵循本教程中的流程, 得到的值大约为-37 kcal/mol.

`gmx wham`命令的另一个输出文件为`histo.xvg`, 其中包含了伞形采样窗口中各个构型的直方图, 这些直方图决定了每个窗口与临近窗口之间是否有足够的重叠. 对于本教程所用的模拟, 得到的图可能类似下面这样:

![](/GMX/GMXtut-3_histo.jpg)

上面的直方图显示了质心距离大约从1.2到5 nm的采样窗口之间的合理重叠, 1 nm处(绿线和蓝线)表明可能需要更多的采样窗口以便根据WHAM算法得到更好的结果. 事实上, 这两个窗口之间的重叠非常小.

## 总结

希望你已经成功地完成了一次伞形采样模拟: 沿反应坐标产生一系列构型, 运行偏离模拟, 并获得PMF. 本教程中提供的.mdp文件只是作为一个示例, 并不能简单地用于所有体系. 请根据文献以及GROMACS手册对这些文件进行调整, 以便提高计算的效率与精确度.

如果你对改进这个教程有些建议, 如果你发现了错误, 或者你觉得有些地方不够清楚, 请给我发邮件`jalemkul@vt.edu`, 不要客气. 请注意: 这不是邀请你因为GROMACS的问题而给我发邮件. 我并不是作为一个私人家教或个人客服在为自己打广告. 那是[GROMACS用户邮件列表](http://lists.gromacs.org/mailman/listinfo/gmx-users)的事. 我可能会在那里帮助你, 但那只是作为对整个社区的服务, 而不只针对最终用户.

祝你模拟愉快!
