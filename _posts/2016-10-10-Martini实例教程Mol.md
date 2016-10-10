---
 layout: post
 title: Martini实例教程：新分子的参数化
 categories:
 - 科
 tags:
 - gmx
 - martini
---

## 基于已知片段对新分子进行参数化

- 发布: 2016-10-10 11:47:32; 翻译: 付彦凯; 校对: 李继存

在本教程中, 我们将讨论如何为一个含有已知片段, 但尚未被描述过的新分子构建Martini拓扑. 随后我们将对该Martini模型进行自组装模拟以评估其行为, 但不会进行模型的精细化. 如果你觉得有必要对其进行精细化, 请参见本教程第二部分(不过它是基于另一个分子来说明的), 或者参照[脂质](http://md.chem.rug.nl/index.php/tutorials-general-introduction/bilayers)和[聚合物](http://md.chem.rug.nl/index.php/tutorials-general-introduction/martini-tutorials-polymers)教程中类似的精细化步骤.

假设现在你开始对某类呈非对称"流星锤"形状的两亲分子开始感兴趣, 图1所示即为此类分子中的一个实例, 它来自论文[Masuda and Shimizu, Langmuir 20, 5969 (2004)](http://pubs.acs.org/doi/abs/10.1021/la049085y). 这种"流星锤"分子链的两端均为亲水基团, 但两个基团大小明显不一: 一端是相对较大的葡萄糖环, 另一端则是相对较小是羧酸. 根据Masuda和Shimizu在论文里的描述, 这种"流星锤"分子可自组装成管状结构, 管径大小取决于连接臂的长度. 从图1中你可以观察到分子所含的化学基团与标准脂质/蛋白质的基本组成单元相差不大, 因此, 这些化学基团很可能可以使用Martini力场进行描述. 事实上, Martini力场可以处理蛋白和糖类, 也确有文献报道过糖脂分子(与"流星锤"分子的结构类似)的模拟, 相关参数也已经发表, 具体可见[Lopez et al., Journal of Chemical Theory and Computation, 9, 1694 (2013)](http://pubs.acs.org/doi/abs/10.1021/ct3009655).

【付彦凯 注】原文此处没给出论文出处, 但在下文又反复提到了这篇论文, 因此在这里加上了出处.

![](/martini/mol_1.png)

图1 非对称"流星锤"脂分子族, 大亲水端葡萄糖通过烷烃链与小亲水端连接

【付彦凯 注】原文插图分辨率较低, 译文插图系从原始文献重新截图. 下同.

不幸的是, 你所感兴趣的"流星锤"分子与已报道的糖脂的构成方式并不完全一样, 你需要自己动手构建它的Martini拓扑结构! 不过幸运的是, 你可以最大限度地利用Martini力场中已有的组成单元. 接下来, 我们将为你展示构建过程.

首先, 将图1中的分子拆分为若干个合理的基本组成单元, 该过程有时会被称为(从原子描述到粗粒级描述的)映射(mapping). 如果你熟悉Martini力场中已有的脂质和蛋白质模型, 并考虑到各个分子片段的化学本性, 那么会很自然地把含有十二烷连接臂的"流星锤"分子粗粒化为8个珠子(图1, n=12时). 你可以通过画图来辅助实现这个想法, 把需要粗粒化成一个珠子的所有原子圈在一起, 并写下珠子类型, 正如上面那篇糖脂模拟论文中所做的一样. 图2所示为论文中对糖脂分子GCER的一种合理映射方式. GCER同时代表葡糖苷(脂)酰鞘氨醇(glucosylceramide)和半乳糖苷(脂)酰鞘氨醇(galactosylceramide), 关于两者结构的更详细信息可参见[脂库网站](http://lipidlibrary.aocs.org/Lipids/cmh/index.htm). 尽管GCER中含有酰胺基团, 却是通过醚键与糖基连接的, 而在我们的脂分子中, 酰胺基团是直接与糖基相连的. 因此, 对我们的"流星锤"分子, 合理的映射方案可参考GCER, 但键和键角参数将会有所不同.

![](/martini/mol_2.png)

图2 糖脂模拟论文中GCER分子的映射, 以及非对称"流星锤"脂分子族可能的(部分)映射

让我们给将要Martini化的"流星锤"分子起个新名字GDAL(glucose-dodecane-acid-lipid), 当然你可以给它起个更好的名字, 不过从现在开始我们还是叫它GDAL好了...

你需要给GDAL写一个拓扑文件, 可以自己从头开始写, 也可以在其他分子拓扑文件的基础上进行改造, GCER分子的拓扑文件就是一个很好的选择. GCER自身只是连接到脂酰基的头基的名字, 如果去检索Martini力场官网提供的脂分子的拓扑文件, 我们会发现一个名为[DPGS](http://md.chem.rug.nl/index.php/force-field-parameters/351-lipid.html?dir=Glycosphingolipids&lipid=DPGS)的带有两条脂肪链尾巴的糖脂分子. 接下来我们将以DPGS的拓扑文件为模板, 其`.itp`文件部分内容如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">awk</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
16</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">[ moleculetype ]
DPGS               <span style="color: #666666">1</span>
[ atoms ]
 <span style="color: #666666">1</span>          P4    <span style="color: #666666">1</span>    DPGS     C1     <span style="color: #666666">1</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">2</span>          P1    <span style="color: #666666">1</span>    DPGS     C2     <span style="color: #666666">2</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">3</span>          P1    <span style="color: #666666">1</span>    DPGS     C3     <span style="color: #666666">3</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">4</span>          P1    <span style="color: #666666">1</span>    DPGS    AM1     <span style="color: #666666">4</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">5</span>          P5    <span style="color: #666666">1</span>    DPGS    AM2     <span style="color: #666666">5</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">6</span>          C3    <span style="color: #666666">1</span>    DPGS    D1A     <span style="color: #666666">6</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span> ; corrected (C3 instead of C1), oct <span style="color: #666666">2013</span>
 <span style="color: #666666">7</span>          C1    <span style="color: #666666">1</span>    DPGS    C2A     <span style="color: #666666">7</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">8</span>          C1    <span style="color: #666666">1</span>    DPGS    C3A     <span style="color: #666666">8</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
 <span style="color: #666666">9</span>          C1    <span style="color: #666666">1</span>    DPGS    C4A     <span style="color: #666666">9</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
<span style="color: #666666">10</span>          C1    <span style="color: #666666">1</span>    DPGS    C1B    <span style="color: #666666">10</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
<span style="color: #666666">11</span>          C1    <span style="color: #666666">1</span>    DPGS    C2B    <span style="color: #666666">11</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
<span style="color: #666666">12</span>          C1    <span style="color: #666666">1</span>    DPGS    C3B    <span style="color: #666666">12</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
<span style="color: #666666">13</span>          C1    <span style="color: #666666">1</span>    DPGS    C4B    <span style="color: #666666">13</span>         <span style="color: #666666">0</span>        <span style="color: #666666">72.0000</span>
</pre></div>
</td></tr></table>

根据 1) 其他脂类分子的一般映射规则 2) DPGS分子`.itp`文件中的成键规则 3) 图2所展示信息, 不难猜测, DPGS分子`.itp`文件中, 1-3号珠子代表葡萄糖环, 4号珠子代表甘油部分, 5号珠子代表酰胺基团, 其他珠子代表脂肪链尾端. 如果据此编写GDAL分子的`.itp`文件, 5号珠子应该和3号珠子相连, 而不是与DPGS中一样, 和4号珠子相连, 然后脂肪链尾端(10-13号珠子) 应该与5号珠子相连. 由于GDAL是十二烷连接臂(连接臂占用12/4=3个珠子), 原来的13号珠子应该修改为羧酸末端. 按照上述方式对原DPGS分子的`.itp`文件进行修改, 我们会发现, 除了13号珠子外, 其他珠子的设定均不用改动. 根据2007年发表的Martini力场论文, 13号珠子应该从`C1`改为`P3`类型(论文中`P3`代表乙酸). 综上所述, GDAL分子`.itp`文件编写过程如下:

1. 复制一份DPGS分子的`.itp`文件, 将DPGS替换为GDAL;
1. 去除4, 6, 7, 8, 9号珠子, 将13号珠子的类型从`C1`修改为`P3`
1. 把`[ bonds ]`, `[ angles ]`和`[ dihedrals ]`中所有涉及4, 6, 7, 8, 9号珠子的条目都删去
1. 对剩余珠子重新进行编号, 即原5号珠子改为4号, 原10号珠子改为5号, 以此类推, 其他成键参数部分会自动保持不变.

如此修改完成后, 仍有一个地方需要修改, 即涉及4号酰胺基团珠子(原5号珠子)的成键参数, 包括环-酰胺的键长, 环-酰胺-烷烃的键角. 这些参数要设为合理值. 酰胺基团整体非常刚性, 因此以其为顶点的键角应接近180°, 且具有高的力常数; 参与成环的珠子与酰胺基团珠子成键的键长可参考蛋白质中骨架粒子-骨架粒子的键长. 你可以从已发表的Martini力场相关论文中查找这些信息.

有了拓扑文件之后, 你还可以直接下载DPGS的坐标文件, 删去4, 6, 7, 8, 9号珠子, 使用它做真空中的能量最小化, 然后利用得到的坐标随机地部分填充空的模拟盒子. 可以再向盒子中添加水分子, 10%的水分子可修改成抗冻水, 然后就可按照[脂质教程](http://md.chem.rug.nl/index.php/bilayers-2)的步骤进行自组装模拟了.

【付彦凯 注】普通水名称`W`, 粒子类型`P4`; 抗冻水名称`WF`, 粒子类型`BP4`. 两者均已在Martini力场文件中定义.

如果你完成了上述所有步骤, 可点击[这里](http://md.chem.rug.nl/images/stories/tutorial/2015/asymbolalipid.tgz)下载我们做的自组装模拟, 与你的进行比较. 200个分子足够形成双层结构, 但是双层结构弯曲度没有达到预期效果, 其原因可能是, 两种亲水头端并未像Masuda和Shimizu所预测的那样各自分布在两亲性双层结构一侧. 而导致两种亲水头端未能分离开来的原因又可能是: 1) 插入分子个数不够; 2) 周期性边界条件和/或 参数设置; 3) GDAL分子从双层结构中实现180°翻转需要较长时间. 这些问题也正是研究最有趣的地方! 你可以随意改动珠子类型设定从而比较不同相互作用强度下的模拟结果. 也许, 你需要在全原子力场下模拟单个GDAL分子在水中的行为, 确认其柔性正确后再进行映射. 在接下来的教程中, 我们将以甲苯为例来讲述类似的过程, 在[脂质](http://md.chem.rug.nl/index.php/bilayers-2#Adv-refine)和[聚合物](http://md.chem.rug.nl/index.php/martini-tutorials-polymers#Extraction_CG)教程中也有类似步骤. 好好享受吧!

## 基于全原子力场模拟对新分子进行参数化

在本部分教程中, 我将向你展示如何为一个未参数化的新分子构建Martini拓扑结构. 构建过程高度依赖于分子的化学结构以及与其相关的(实验)数据. 我们将使用一个小分子甲苯作为示例分子来讲述该过程. 甲苯的全原子拓扑是已知的, 其水-辛醇分配系数(logP)为2.73(数据来自<http://dx.doi.org/10.1021/ci050282s>). 教程假设你对Martini力场有基本了解(若否, 请先学习Martini官网上的其他教程), 对GROMACS有基本了解(若否, 请学习[GROMACS官网](http://www.gromacs.org/)提供的教程), 同时对文本编辑器有基本了解.

![](/martini/mol_3.png)

### 1) 根据全原子力场模拟生成原子的参考数据

对新分子进行可靠的Martini化是基于其在溶液中的全原子力场模拟数据来开展的. 我们自己做Martini化通常基于Gromos力场, 但你也可以自由选择任何力场. 如果没有拓扑文件, 你可以基于[ATB](http://compbio.biosci.uq.edu.au/atb/)或[GAFF力场](http://dx.doi.org/10.1002/jcc.20035)自己来构建一个(这一步的工作量可能也很大), 或者其他人已经发表了你要研究的分子的全原子模拟结果, 你可以将论文中的数据作为参考材料.

溶剂的选择很重要: 要Martini化的分子在极性或无极性疏水溶剂中的表现可能会有所不同, 构建的粗粒化模型可能无法两者兼顾. 选择与你做粗粒化模拟时的环境匹配的溶剂, 如果极性和非极性环境都很重要, 那么只能妥协, 选择表现最好的一个.

你可以输入下面的命令进行甲苯的模拟:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">grompp -f gromos.mdp -c gromos.gro -p gromos.top -o gromos
mdrun -v -deffnm gromos
</pre></div>

点击下载相应的文件: [gromos.mdp](http://md.chem.rug.nl/images/stories/tutorial/parametrization/gromos.mdp), [gromos.gro](http://md.chem.rug.nl/images/stories/tutorial/parametrization/gromos.gro), [gromos.top](http://md.chem.rug.nl/images/stories/tutorial/parametrization/gromos.top)

你刚才运行的是单个甲苯分子在癸烷中的模拟, 模拟时长1 ns. 需要指出的是, 由于甲苯只是个简单的分子, 1 ns的模拟时长足够了.

### 2) 选择原子到粗粒化珠子的映射

此步是粗粒化的核心步骤, 需要依靠你的经验, 化学知识以及不断试错. 我最喜欢的做法是: 把分子结构画在纸上, 复制10次, 然后像小学生画画那样尝试不同的映射方法. 该过程没有规律可循, 但我可以提供一些建议:

- 你必须使用[原始Martini论文](http://dx.doi.org/10.1021/jp071097f)表3中的珠子类型, 找到与表3所提供的示例片段相匹配的亚分子结构. 先别考虑键/键角/二面角等问题.
- 以4个重原子为一组, 对分子结构进行区域划分. 对于平面或环状结构, 或4个重原子分组原则不适用时, 使用S型珠子. 要知道S型珠子与常规珠子相比只是半径小些, 两者的(水-辛烷)相分配自由能是一样的. 举例来说, SC3珠子和C3珠子在P4溶剂(水)中的表现一模一样.
- 不要使用部分电荷(partial charge). Martini珠子要么带整数电荷, 要么呈电中性(强烈离域化电荷除外, 如金属配体). 如果带电荷, 使用Q类型的珠子.
- 参考现有的Martini拓扑结构. 你可能需要粗粒化原始Martini论文表3中未提及的亚分子结构, 也许已经有人做过相关工作, 比如[蛋白质](http://dx.doi.org/10.1021/ct700324x), [糖类](http://dx.doi.org/10.1021/ct900313w)等.
- 注意分子的对称性, 对同一种亚分子结构使用相同的珠子类型.

### 3) 对全原子力场模拟轨迹的粗粒化

依据你刚才建立的映射规则, 把在步骤1)中开展的全原子模拟转换为粗粒的模拟. 方法有很多种, 你可以使用转换工具或`initram.sh`脚本. 不过我认为最简单的方法是, 创建一个GROMACS索引文件, 每一索引组代表一个珠子, 包含该珠子映射原子的编号. 写完索引文件后运行如下命令:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">seq <span style="color: #666666">0</span> <span style="color: #666666">2</span> | g_traj -f gromos.xtc -s gromos.gro -oxt mapped.xtc -n mapping.ndx -com -ng 3
</pre></div>

点击下载相应的文件: [mapping.ndx](http://md.chem.rug.nl/images/stories/tutorial/parametrization/mapping.ndx)

命令中, `-ng 3`表示索引分组(即珠子个数)有3个, 如果命令前端不加`seq 0 2`, 你需要挨个输入3个索引分组的名称. 你可以打开我写的索引文件`mapping.ndx`, 看看是如何对甲苯分子进行映射的.

### 4) 输出粗粒化轨迹中的键长/键角分布

再去看看你在步骤2)中绘制的映射图, 确定这些珠子之间的成键关系(键, 约束, 键角, 正常和异常二面角). 键长/键角等信息可以从步骤3)中得到的粗粒化轨迹文件(`mapped.xtc`)中提取. 你可以再制作一个名为`bonded.ndx`的索引文件, `[bonds]`下两个珠子一行, `[angles]`下三个珠子一行, `[dihedrals]`下四个珠子一行. 使用`g_bond`来获取键长信息, `g_angle`来获取键角和二面角信息.

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">g_bond -f mapped.xtc -n <span style="color: #666666">[</span>bonded.ndx<span style="color: #666666">](</span>http://md.chem.rug.nl/images/stories/tutorial/parametrization/bonded.ndx<span style="color: #666666">)</span> -noaver -d
g_angle -f mapped.xtc -n bonded.ndx -ov angles.xvg -type angle -all
</pre></div>

点击下载相应的文件: [bonded.ndx](http://md.chem.rug.nl/images/stories/tutorial/parametrization/bonded.ndx)

根据`g_angle`命令生成的`angles.xvg`文件可以绘制键角的分布直方图(`angles.xvg`文件第一列y值是三个键角的平均值, 可舍弃), 你可以使用`g_analyze`命令:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">g_analyze -f angles.xvg -dist angledistr.xvg -bw 1
</pre></div>

某些情况下, 仅仅计算键角分布的平均值和标准差就足够了, 然而键角分布可能存在双峰, 最明智的选择是绘制分布图观察下, 可使用`xmgrace`命令来完成:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">xmgrace -nxy -dist angledistr.xvg
</pre></div>

一些注意事项: 如果你的分子被周期性边界条件分成两半, 你可能会得到诡异的键长分布结果. 此种情况下, 可首先用`trjconv -pbc whole`处理一下全原子力场的模拟轨迹, 然后再进行映射. 另一点需要注意的是, 在执行上文中的`g_bond`命令时, 每条键长的平均值和标准差会存储在`bonds.log`文件里, 而`distance.xvg`存储的是所有键长平均后的分布情况. 若想得到每条键长的分布情况, 要么为每一条键单独运行一次`g_bond`命令, 要么参见后文提供的方法. 一旦你有了`CG.tpr`文件, 即可在`g_bond`命令中使用, 从而可以直接比较二者的键长分布.

### 5) 制作粗粒化分子的`.itp`文件

尽管你可以对已有的`.itp`文件进行复制粘贴(通常是为了保持文件格式正确), 大部分情况下, 编写`.itp`文件的工作还是要手动完成的. 你的`.itp`文件中(可能)将包括以下几项:

- `[moleculetype]`: 一行即可, 包括分子的名字和键合近邻的排除数. Martini力场下, 键合近邻的排除数为1.
- `[atoms]`: 每个珠子一行, 信息包括珠子编号, 珠子类型, 残基编号, 残基名称, 珠子名称, 电荷组编号以及电荷. 对小分子, 残基编号和残基名称和粗粒化之前一样. 珠子名称可自定义. 在Martini力场中, 每个珠子的电荷都有自己的电荷组, 带电量可以为1, 0和-1. 珠子质量已经预定义好了, 在`.itp`文件中不予注明.
- `[bonds]`: 每条键一行, 信息包括珠子1, 珠子2, 键型、键长和力常数. 在Martini力场中, 键型为1. 键长可采用步骤4)中所获得的平均值. 力常数应该根据键长分布的宽度来调整: 窄峰用大的力常数, 宽峰用小的力常数.
- `[constraints]` `[angles]` `[dihedrals]` 正确格式参见GROMACS手册.

### 6) 创建粗粒化模拟

从`mapped.xtc`文件中提取出一帧, 使用与全原子模拟相同的溶剂(粗粒化的)癸烷重新溶剂化. 创建一个`.top`文件(里面应包含Martini力场的`.itp`文件, 新创建的粗粒化分子的`.itp`文件, 并添加正确的分子和溶剂个数). 创建一个Martini力场适用的`.mdp`文件, 可参考官网上的示例. 在正式开始粗粒化模拟之前, 最好先进行能量最小化, 然后用小的时间步长(如5 fs)跑几千步, 让分子弛豫一下. 除此之外, 你还需要[`.itp`]文件(http://md.chem.rug.nl/images/stories/tutorial/parametrization/martini_v2.0.itp), [.itp文件](http://md.chem.rug.nl/images/stories/tutorial/parametrization/martini_v2.0_solvents.itp)以及[.itp文件](http://md.chem.rug.nl/images/stories/tutorial/parametrization/martini_toluene.itp). 最好新建一个文件夹来运行粗粒化模拟.

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">grompp -f em.mdp -c martini.gro -p martini.top -o em
mdrun -v -deffnm em
grompp -f relax.mdp -c em.gro -p martini.top -o relax
mdrun -v -deffnm relax
grompp -f md.mdp -c relax.gro -p martini.top -o md
mdrun -v -deffnm md
</pre></div>

点击下载相应的文件: [em.mdp](http://md.chem.rug.nl/images/stories/tutorial/parametrization/em.mdp), [martini.gro](http://md.chem.rug.nl/images/stories/tutorial/parametrization/martini.gro), [martini.top](http://md.chem.rug.nl/images/stories/tutorial/parametrization/martini.top), [relax.mdp](http://md.chem.rug.nl/images/stories/tutorial/parametrization/relax.mdp), [md.mdp](http://md.chem.rug.nl/images/stories/tutorial/parametrization/md.mdp)

模拟结束后, 重新提取键长和键角. 你仍然可以使用步骤4)中那个索引文件.

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">g_bond -f md.xtc -s md.tpr -n bonded.ndx -noaverdist -d bonds_martini.xvg
g_angle -f md.xtc -n bonded.ndx -ov angles_martini.xvg -type angle -all
</pre></div>

注意和在步骤4)中执行`g_bond`命令时有什么不同. 这里你使用了`-s md.tpr`和`-noaverdist`.

### 7) 优化CG成键参数

步骤6)可能会有两种结果: 模拟顺利进行, 你得到了键长和键角分布; 模拟崩溃. 如果模拟顺利, 你可以对从步骤6)和步骤4)中获得的分布进行比较, 有必要的话, 回到步骤5)调整`.itp`中的参数以得到更好的分布. 如果步骤6)中得到的分布峰比较宽, 意味着你需要增大力常数; 如果平均值整体有所偏移, 意味着你需要做相应的回调; 诸如此类. 如果模拟崩溃, 你同样需要返回步骤5), 此行目的是让分子更稳定. 可行的方法有: 减小力常数: 去除不必要的二面角, 将约束(constraint)改变为键或反之. 导致系统不稳定的常见因素有:

- 如果在4个珠子之间定义了正常二面角(proper dihedral), 且其中3个珠子之间的夹角非常大(接近180°), 这会导致非常严重的波动, 进而导致体系崩溃. 此种情况下, 可取消该二面角, 或使用[特殊类型二面角](http://md.chem.rug.nl/index.php/angpot).
- 如果分子具有环状结构, 粗粒化的珠子可能会连接成三角形. 如果在这些珠子之间设置了约束, LINCS算法可能会失效.
- a, b, c三个珠子用既短又弱的键线性连接, b会被a和c排除在外. 如果a, c强烈吸引对方, 其中之一会与b重合.

反复调整直到你对结果满意后, 进入最后一步.

### 8) 与实验结果比较

两相分配自由能固然是一个好的评估指标(我们目前正在编写一个教程, 主要讲解针对Martini分子如何有效地计算此参数), 但对于纯的液态体系, 密度也可以用来评估. 此外, 任何实验数据都可以用来评估.

