---
 layout: post
 title: 使用AmberTools+ACPYPE+Gaussian创建小分子GAFF力场的拓扑文件
 categories:
 - 科
 tags:
 - GMX
---

<script src="/jscss/ChemDoodleWeb.js"></script>

## 2015-12-08 22:16:10

- 下载本文用到的[文件](/Prog/GAFF.zip)

使用AMBER的GAFF力场处理有机小分子有很大的优势, 可惜的是GROMACS没有自带GAFF力场, 所以需要组合使用各种软件组合来实现. 这里我们使用的是AmberTools和ACPYPE.

要想使用AmberTools和ACPYPE创建小分子的GAFF力场, 需要先安装这两个工具. 但Windows下AmberTools的安装并不容易. 在这里我提供一个已经编译好的AmberTools+ACPYPE, 它来自Chimera中所带的amber14, 并增加了我自己编译好的RESP程序与ACPYPE程序, 因为Chimera中并没有包含这两个程序. 具体的整合过程请参看[Windows下的AmberTools+RESP+ACPYPE](http://jerkwin.github.io/2015/12/06/Windows%E4%B8%8B%E7%9A%84AmberTools+RESP+ACPYPE/).

点击[这里](/Prog/amber14.zip)下载AmberTools+ACPYPE, 下载后解压到某一目录(路径中不要包含中文字符), 然后新建环境变量`AMBERHOME`并将其设置为amber14的路径即可. 

![](/pic/GMX_amberhome.png)

具体操作如下:

右键`我的电脑`->`属性`->`高级`->`环境变量`

在用户变量中新建`AMBERHOME`, 并其值设为amber14的路径, 如`C:/amber14`. __注意, 要使用`/`作为路径分格符__.

如果你想在任意目录下都可以使用这些工具, 可以在用户变量中新建`Path`变量(如果存在就选中编辑它), 将其值设为`%Path%; C:\amber14\bin`(如果已存在`Path`变量, 只要增加`C:\amber14\bin`即可).

如果你要使用Python版本的ACPYPE, 而不是(或不能)使用我编译好的二进制版本, 到[Python官方网站](https://www.python.org/downloads/)下载Python 2.x安装即可.

对电荷的处理, 目前有两种比较合理的方法, AM1-bcc电荷与RESP电荷. AM1-bcc电荷可以使用AmberTools中的antechamber程序直接得到(或使用Chimera软件, 它集成了antechamber). RESP电荷则需借助第三方量子化学程序来得到, 如Gaussian, GAMESS等. 因此, 如果你想使用RESP电荷, 那你还需要安装一种量子化学程序. 由于Gaussian使用方便, 所以使用更广泛些. Windows版本的Gaussian及其自带的GaussView界面安装很容易, 网上资料也很多, 这里不做介绍.

使用AmberTools+ACPYPE+Gaussian创建小分子GAFF力场拓扑文件的整个流程如下:

![](/pic/GMX_proc.png)

创建过程的大致步骤是先利用Gaussian得到RESP电荷, 然后利用AmberTools得到AMBER的参数文件. 由于GROMACS和AMBER参数文件的格式很不一样，所以最后需要使用ACPYPE将AMBER参数文件转换为GROMACS可识别的.gro和.top文件. 具体步骤说明如下:

## 1. 使用`GaussView`创建分子构型并做初步优化

使用熟悉的分子编辑软件创建分子构型. 可用的软件非常多, 一般只要支持输出为.pdb或.mol2格式即可. GaussView, Chimera, Chem3D, VMD等等都可以. 由于我们需要使用Gaussian计算静电势以用于拟合RESP电荷, 所以使用与Gaussian配套的GaussView来构建分子并准备输入文件更方便些. 因此, 如果你对分子编辑软件还没有形成什么偏好的话, 那我推荐你试一试GaussView.

我这里使用的Gaussian 09 C.01版本, 建议你至少使用这个版本, 或使用更新的D.01版, 不要使用更低的版本, 因为下面的有些操作更低的版本不支持. 详细信息见参考资料中的博文.

构建好分子之后, 一般要做下粗略的优化, 使搭建出来的分子构型看起来更合理一些. 这在GaussView中很容易完成, 只要点击`Edit` -> `Clean`就可以了.

__注意, Gaussian以及GaussView的安装路径中不能含有中文, 输入输出文件的保存路径中也不能使用中文__

下面就是我们构建出来的分子结构

<figure><script>var Mol=new ChemDoodle.MovieCanvas3D('Mol-1', 650,400);Mol.specs.set3DRepresentation('Ball and Stick');Mol.specs.projectionPerspective_3D = false;Mol.specs.backgroundColor='black';Mol.specs.crystals_unitCellLineWidth = 1.5;Mol.specs.proteins_ribbonCartoonize = true;
Mol.addFrame([ChemDoodle.readXYZ(' 30\nLig\nC 0.09543850 4.17975179 -3.80964600\nC 0.80175777 5.38903340 -3.80884681\nC 0.51304983 6.37432406 -2.85249130\nC -0.45856117 6.13391634 -1.87580461\nC -1.18031438 4.93159413 -1.88905531\nC -0.90248285 3.95453152 -2.85472308\nH 1.56233451 5.56314689 -4.54229097\nC 1.19956438 7.59276989 -2.90325955\nH -1.94182292 4.75784609 -1.15991385\nH -1.45081509 3.03717093 -2.86078559\nC -0.30345881 8.46335809 -1.24485519\nH -1.73198058 7.12735889 -0.66279753\nCl 0.46333814 2.94533594 -5.00948909\nN -0.74589355 7.12382213 -0.83061474\nO 0.90932293 8.65634024 -1.98723376\nO -0.99787825 9.46470538 -0.92486787\nC 2.46836230 7.66604935 -3.77522994\nC 2.06538526 7.12862117 -1.71684839\nC 2.73839284 6.76831182 -0.79496623\nC 3.60919766 6.31065294 0.39227777\nC 2.95652452 5.50506598 1.52982428\nC 3.98331757 4.83175242 0.58972154\nH 4.30131921 7.08604394 0.65490131\nH 1.93420679 5.20229877 1.46988859\nH 3.23306015 5.67204191 2.55152136\nH 4.96924771 4.59499298 0.93250673\nH 3.67048802 4.12555972 -0.14844314\nF 2.17575489 7.26575804 -5.03005425\nF 3.42083779 6.86041395 -3.25669940\nF 2.92230775 8.93762961 -3.80142482\n')],[]);
Mol.loadMolecule(Mol.frames[0].mols[0]);Mol.startAnimation();</script><br><figurecaption>Fig.1</figurecaption></figure>

## 2. 使用Gaussian进一步优化分子构型并计算静电势

粗略优化之后, 我们要使用Gaussian进行进一步的优化, 同时计算其静电势, 用于后面拟合RESP电荷. 如果你熟悉Gaussian的计算流程, 可以先保存文件, 然后修改输入文件后在命令行中运行. 如果不熟悉的话, 你可以在GaussView的菜单中操作.

点击`Calculate`->`Gaussian Calculation Setup`, 打开输入文件编译界面

![](/pic/GMX_g09.png)

先将计算类型修改为优化,

![](/pic/GMX_opt.png)

设定优化使用的方法, 基组, 以及体系的电荷, 自旋多重度

![](/pic/GMX_bs.png)

标题段可改可不改

![](/pic/GMX_tit.png)

`Link 0`部分可设定计算时所用的内存和核数. Windows下Gaussian最多可使用1 GB内存, 我的电脑是四核的, 这里我设置使用2个核

![](/pic/GMX_mem.png)

`General`部分设置使用二次收敛的SCF方法以确保收敛, 选择忽略对称性, 不将连接信息写到输入文件中. 其实这些设置影响不大, 不改一般也没事.

![](/pic/GMX_scf.png)

最后, `Add. Inp.`部分添加静电势输出文件的名称, 并在``中添加计算静电势的关键词

![](/pic/GMX_add.png)

点击`Submit..`保存为.gjf文件, 并输出直角坐标和附加输入

![](/pic/GMX_gjf.png)

打开产生的输入文件, 内容如下:

![](/pic/GMX_file.png)

有关输入文件中关键词的解释, 见参考资料中的博文.

__注意, Gaussian输入文件中的空行非常重要, 要严格按图上的格式来. 比如, `Lig_ini.gesp`前面只能有一个空行, 而`Lig.gesp`后面至少要有两个空行.__

得到了输入文件后, 我们就可以使用Gaussian来运行它了. 你可以使用Gaussian自带的用户界面来运行, 也可以使用命令行.

由于这个分子较大, 在我的机器上, 运行了3个多小时才正常结束.

运行正常结束后, 会产生`Lig.chk`, `Lig.out`, `Lig_ini.geps`和`Lig.gesp`等文件, 我们只需要其中的`Lig.gesp`文件, 它是优化后构型的静电势文件, 我们就使用它来拟合RESP电荷.

另外, 我们也可以利用`antechamber`命令来产生运行Gaussian需要的输入文件, 像下面这样

	antechamber -i Lig.mol2 -fi mol2 -o Lig.gjf -fo gcrt -pf y -gm "%mem=1GB" -gn "%nproc=2" -nc 1 -gk "#HF/6-31G* SCF=tight Pop=MK iop(6/33=2,6/42=6,6/50=1)"

## 3. 使用antechamebr拟合RESP电荷

使用上一步得到的`Lig.gesp`文件, 运行`antechamebr`拟合RESP电荷

	antechamber -i Lig.gesp -fi gesp -o Lig.mol2 -fo mol2 -pf y -c resp

我们只需要`Lig.mol2`输出文件, 它包含了构型以及RESP电荷, 其他文件`ANTECHAMBER*`, `ATOMTYPE.INF` `BCCTYPE.INF` `NEWPDB.PDB` `PREP.INF`, `esout`, `qout`, `punch`等都可删除.

## 4. 使用parmchk2检查GAFF参数并生成缺失参数文件

使用上一步得到的`Lig.mol2`文件, 运行`parmchk2`命令

	parmchk2 -i Lig.mol2 -f mol2 -o Lig.frcmod

`parmchk2`是原先`parmchk`的增强版, 可以检查输入分子构型中GAFF的缺失参数, 并生成相应的补充参数文件`Lig.frcmod`.

## 5. 使用sleap生成AMBER参数文件及坐标文件

编写一个`leap.in`文本文件, 内容如下:

	source leaprc.ff14SB
	source leaprc.gaff
	loadamberparams Lig.frcmod
	lig=loadmol2 Lig.mol2
	check lig
	saveamberparm lig Lig.prmtop Lig.inpcrd
	quit

然后运行`sleap`命令

	sleap -f leap.in

这样就拿到了分子的AMBER参数文件`Lig.prmtop`, 结构文件`Lig.inpcrd`.

也可直接打开`sleap`依次执行`leap.in`文件中的每一行, 只不过麻烦一些.

## 6. 使用ACPYPE将AMBER文件转换为GROMACS文件

运行`ACPYPE`命令

	acpype -p Lig.prmtop -x Lig.inpcrd -d

这样就得到了GROMACS支持的`Lig_GMX.gro`, `Lig_GMX.top`, `em.mdp`, `md.mdp`等文件. 一般我们只需要前面两个文件.

如果想将.top文件进行处理生成.itp文件，以便在蛋白质的拓扑文件中包含, 可以除去表头, 改动原子类型, 再除去后面的附加信息.

实际上, 上面的3, 4, 5, 6这几个步骤可以使用`ACPYPE`一步完成, 但在Windows下由于路径的原因很容易出问题. 像上面这样分开做的话, 一步一步完成的话, 出错了容易定位具体的出错步骤. 如果你对这个过程很熟悉了, 可以将这些流程写在一个脚本中自动执行, 或是研究一下如何使用acpype一步执行成功.

__参考资料__

- [AMBER:小分子处理](http://platinhom.github.io/2015/11/12/AMBER-Ligand/)
- [GMX中如何实现小分子的GAFF立场](http://bioms.org/forum.php?mod=viewthread&tid=52&highlight=GAFF)
- [自动计算ESP和RESP电荷(AMBER and G09)](http://platinhom.github.io/2015/09/17/AutoCalcRESP/)
- [GROMACS处理蛋白-配体体系](http://emuch.net/bbs/viewthread.php?tid=6783663&fpage=1) [pdf](/Prog/在GROMACS中使用GAFF力场处理配体并建立任务.pdf)
