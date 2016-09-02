---
 layout: post
 title: GROMACS教程之水中的溶菌酶
 categories:
 - 科
 tags:
 - GMX
---

* toc
{:toc}

<ul class="incremental">
<li>本教程的翻译参考了yongma2008和Youngchsh网友的译文, 特此说明.</li>
<li>2016-09-02 11:36:18 感谢 陈孙妮 修订翻译舛误之处.</li>
</ul>

### 概述

<p>你需要先了解一下用GROMACS做分子动力学模拟的一般过程:</p>

<figure>
<img src="/GMX/GMXtut-1_flow.png" alt="GROMACS分子模拟流程" />
<figcaption>GROMACS分子模拟流程</figcaption>
</figure>

<hr />

<figure>
<img src="/GMX/GMXtut-1_1AKI.jpg" alt="溶菌酶1AKI" />
<figcaption>溶菌酶1AKI</figcaption>
</figure>

<p>本示例教程将引导GROMACS新用户进行一次模拟, 模拟的体系是水盒子中的蛋白质(溶菌酶, lysozyme)及离子. 我们会解释每一步中用到的输入文件以及得到的输出文件. 这些输入文件中所用的设置都很典型, 因此, 你在进行模拟时一般也可以采用这些设置.</p>

<p>本教程假定你正在使用5.x版本的GROMACS.</p>

### 第一步: 准备拓扑

<p><strong>GROMACS基础</strong></p>

<p>随着5.0版本GROMACS的发布, 所有的工具程序现在都成为了<code>gmx</code>程序中的一个模块.
而在以前版本的GROMACS中, 这些工具都是可以单独使用的, 并且有自己的命令.
在5.0版本中, 仍然可以通过符号链接使用这些命令, 但将来的版本会废弃这种作法.
因此, 你最好还是习惯这种新的使用方式. 要得到GROMACS某一模块的帮助信息, 你可以使用下面命令中的任何一个</p>

<p><code>gmx help (module)</code></p>

<p>或</p>

<p><code>gmx (module) -h</code></p>

<p>使用时只要将其中的<code>(module)</code>替换为要查询的命令的实际名称即可.
相关信息会输出到终端, 其中包括可用的算法, 选项, 需要的文件格式, 已知的缺陷和限制, 等等.
对GROMACS的新用户来说, 查看常用命令的帮助信息是了解每个命令功能的有效方式.</p>

<p><strong>溶菌酶教程</strong></p>

<p>首先, 我们必须下载所用蛋白质的结构文件. 在本教程中, 我们将使用鸡蛋白溶菌酶(PDB代码为1AKI).
打开<a href="http://www.rcsb.org/pdb/home/home.do">RCSB</a>网站, 输入鸡蛋白溶菌酶的PDB编号, 然后点击<code>Go</code>,</p>

<figure>
<img src="/GMX/GMXtut-1_PDB1.png" alt="" />
</figure>

<p>你会看到下面的网页</p>

<figure>
<img src="/GMX/GMXtut-1_PDB2.png" alt="" />
</figure>

<p>网页上包含了很多与鸡蛋白溶菌酶有关的信息, 可以帮助你更好地了解这个蛋白质.
我们需要的是这个蛋白质的晶体结构文件, 因此点击右边的Download Files, 然后下载PDB格式的晶体结构文件.</p>

<figure>
<img src="/GMX/GMXtut-1_PDB3.png" alt="" />
</figure>

<p>得到结构文件之后, 你可以使用VMD, Chimera, PyMOL等可视化程序来查看一下这个蛋白质的结构.
如果还不熟悉这些程序的使用, 你可以参考网上的教程以及示例视频.
在查看轨迹方面, VMD功能非常强大, 而使用PyMOL你可以轻松地得到高质量的蛋白质结构图片.
本教程首页的蛋白质结构图片就是利用PyMOL得到的. 如果你不是很喜欢VMD和PyMOL程序的操作模式,
你或许可以试试Jmol. 此外, 还有非常多的分子结构可视化程序.
如果你只是用于查看结构, 选择你喜欢的那个即可. 上面提到的这几个程序都支持脚本, 利用脚本,
你可以更好地操控分子, 并能进行一些处理.</p>

<p>下面是VMD中各种显示模式下的蛋白质三维结构图</p>

<figure>
<img src="/GMX/GMXtut-1_VMD-Point.jpg" alt="Points点模式" />
<figcaption>Points点模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-Line.jpg" alt="Line线模式" />
<figcaption>Line线模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-Bond.jpg" alt="Bonds键模式" />
<figcaption>Bonds键模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-CPK.jpg" alt="CPK模式" />
<figcaption>CPK模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-VDW.jpg" alt="VDW模式" />
<figcaption>VDW模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-Tube.jpg" alt="Tube管线模式" />
<figcaption>Tube管线模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-Ribbon.jpg" alt="Ribbons飘带模式" />
<figcaption>Ribbons飘带模式</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_VMD-NewCartoon.jpg" alt="NewCartoons新卡通模式" />
<figcaption>NewCartoons新卡通模式</figcaption>
</figure>

<p>查看过这个蛋白质分子之后, 你要去掉晶体结构中的结晶水. 请使用普通的文本编辑器, 如vi/vim,
emacs(Linux/Mac)或者记事本程序(Windows). 不要使用文字处理软件(例如Windows下的Word)!
它们非常笨重, 不适合快速地查看编辑纯文本文件. 如果你不喜欢vi/vim或emacs的操作模式,
可以试试gVIM或是其他软件. 对Windows的用户, 系综自带的记事本程序不是很好用, 你可以选择一些和它类似,
但功能更强大的程序, 如Notepad2, Notepad++, EmEditor, EditPlus, UltrEdit, 等等. 选择非常广泛,
请选择一个你喜欢的, 并尽可能地将熟悉它的各种功能, 这样在处理各种文件时才能得心应手.</p>

<p>去除结构中的结晶水时, 直接删掉PDB文件中与结晶水相关的行(残基为&#8220;HOH&#8221;的行)即可. 注意, 并不是任何时候都需要进行这个过程(比如对与活性位点结合的水分子就不能去除).
对本教程而言, 我们不需要结晶水, 所以可以将它们都去掉.</p>

<p>始终要注意检查.pdb文件中MISSING注释下面列出的项, 这些项代表了在晶体结构文件中缺失的那些原子或残基.
在模拟中, 末端区域的缺失可能并不会引起问题, 但缺失原子的不完整内部序列或任何氨基酸残基 <strong>都将</strong> 导致<code>pdb2gmx</code>程序运行失败. 必须使用其他软件对这些缺失的原子/残基进行建模并补充完整. 还要注意<code>pdb2gmx</code>不是万能的, 它无法为任意分子生成拓扑文件, 而只能用于力场中已经定义的残基(在*.rtp文件中, 一般包括蛋白质, 核酸和 <strong>非常有限</strong> 的辅酶因子, 如NAD(H)和ATP).</p>

<p>现在结构中已经没有结晶水了, 我们也确认了没有缺少任何需要的原子. PDB文件中应该只包含蛋白质原子, 这样就可以将其用作<code>pdb2gmx</code>的输入. <code>pdb2gmx</code>是我们用到的第一个GROMACS模块, 它的作用的是产生三个文件:</p>

<ol class="incremental">
<li>分子拓扑文件</li>
<li>位置限制文件</li>
<li>后处理结构文件</li>
</ol>

<p>拓扑文件(默认为<code>topol.top</code>)包含了定义模拟中所用分子的所有必需信息, 包括非键参数(原子类型和电荷)和键合参数(键长, 键角和二面角). 当得到拓扑文件后, 我们会更详细地对它进行说明.</p>

<p>使用如下命令执行<code>pdb2gmx</code>程序:</p>

<p><code>gmx pdb2gmx -f 1AKI.pdb -o 1AKI_processed.gro -water spce</code></p>

<p><code>pdb2gmx</code>将处理结构, 输出一些相关信息后, 提示你选择一个力场:</p>

<pre><code>Select the Force Field:
From '/usr/local/gromacs/share/gromacs/top':
 1: AMBER03 protein, nucleic AMBER94 (Duan et al., J. Comp. Chem. 24, 1999-2012, 2003)
 2: AMBER94 force field (Cornell et al., JACS 117, 5179-5197, 1995)
 3: AMBER96 protein, nucleic AMBER94 (Kollman et al., Acc. Chem. Res. 29, 461-469, 1996)
 4: AMBER99 protein, nucleic AMBER94 (Wang et al., J. Comp. Chem. 21, 1049-1074, 2000)
 5: AMBER99SB protein, nucleic AMBER94 (Hornak et al., Proteins 65, 712-725, 2006)
 6: AMBER99SB-ILDN protein, nucleic AMBER94 (Lindorff-Larsen et al., Proteins 78, 1950-58, 2010)
 7: AMBERGS force field (Garcia &amp; Sanbonmatsu, PNAS 99, 2782-2787, 2002)
 8: CHARMM27 all-atom force field (CHARM22 plus CMAP for proteins)
 9: GROMOS96 43a1 force field
10: GROMOS96 43a2 force field (improved alkane dihedrals)
11: GROMOS96 45a3 force field (Schuler JCC 2001 22 1205)
12: GROMOS96 53a5 force field (JCC 2004 vol 25 pag 1656)
13: GROMOS96 53a6 force field (JCC 2004 vol 25 pag 1656)
14: GROMOS96 54a7 force field (Eur. Biophys. J. (2011), 40,, 843-856, DOI: 10.1007/s00249-011-0700-9)
15: OPLS-AA/L all-atom force field (2001 aminoacid dihedrals)
</code></pre>

<p>力场包含了将要写入到拓扑文件中的信息. 这个选择非常重要! 你必须仔细了解每个力场, 并决定哪个力场最适用于你的体系. 在本教程中, 我们选用全原子OPLS力场, 因此在命令提示行中输入<code>15</code>, 然后回车.</p>

<p><code>pdb2gmx</code>程序还接受很多其他选项, 下面列出常用的几个:</p>

<ul class="incremental">
<li><code>-ignh</code>: 忽略PDB文件中的氢原子, 对NMR结构非常有用. 否则, 如果存在氢原子, 它们的名称和顺序必须与GROMACS力场中的完全一样. 对氢原子存在各种不同的约定, 所以处理起来有时让人很头疼! 如果你需要保留初始氢原子的坐标但需要重命名, 可以试试Linux的sed命令.</li>
<li><code>-ter</code>: 交互式地为N末端和C末端分配电荷态</li>
<li><code>-inter</code>: 交互式地为Glu(谷氨酸), Asp(天冬氨酸), Lys(赖氨酸), Arg(精氨酸)和His指定电荷态, 选择涉及二硫键的Cys(胱氨酸)</li>
</ul>

<p>现在你已经得到了三个新的文件, <code>1AKI_processed.gro</code>, <code>topol.top</code>和<code>posre.itp</code>. <code>1AKI_processed.gro</code>是GROMACS格式的结构文件, 包含了力场中定义的所有原子(即, 已经将氢原子加到蛋白质中的氨基酸上了). <code>topol.top</code>文件是体系的拓扑文件(稍后会解释). <code>posre.itp</code>文件包含了用于限制重原子位置的信息(后面解释).</p>

<p>最后的注意事项: 许多用户认为.gro文件是必需的. <strong>事实并非如此.</strong> GROMACS可处理很多不同的文件类型, .gro不过是一些程序输出坐标文件时所用的默认格式. 这种格式非常紧凑, 但精度有限. 如果你更愿意使用其他格式, 如PDB格式, 为你的输出文件指定合适的文件名称, 并使用.pdb作为扩展名即可. 使用<code>pdb2gmx</code>程序的目的在于生成与力场兼容的拓扑文件, 输出的结构不过是此目的的副产品, 只是为了方便用户. 输出结构的格式可以任意选择(参看GROMACS手册上对不同格式的说明).</p>

### 第二步: 检查拓扑文件

<p>让我们来看一下输出的拓扑文件(<code>topol.top</code>)中有些什么. 使用普通文本编辑器来检查其内容. 在几行注释(前面有分号;标注)之后, 你可以看到下面的语句:</p>

<pre><code>#include &quot;oplsaa.ff/forcefield.itp&quot;
</code></pre>

<p>此行调用了OPLS-AA力场的参数, 它位于文件的开头, 这意味着下面的所有参数都来自OPLS-AA力场. 下一重要行是<code>[ moleculetype ]</code>, 后面是</p>

<pre><code>; Name       nrexcl
Protein_A    3
</code></pre>

<p>&#8220;Protein_A&#8221;定义了分子名称, 这是因为这个蛋白质在PDB文件中被标定为A链. 对键合近邻的排除数为3. 关于排除的更多信息可从GROMACS手册上找到. 对此信息的讨论超出了本教程的范围.</p>

<p>下一节定义了蛋白质中的<code>[ atoms ]</code>, 信息按列给出:</p>

<pre><code>[ atoms ]
;   nr       type  resnr residue  atom   cgnr     charge       mass  typeB    chargeB      massB
; residue   1 LYS rtp LYSH q +2.0
     1   opls_287      1   LYS       N      1       -0.3    14.0067   ; qtot -0.3
     2   opls_290      1   LYS      H1      1       0.33      1.008   ; qtot 0.03
     3   opls_290      1   LYS      H2      1       0.33      1.008   ; qtot 0.36
     4   opls_290      1   LYS      H3      1       0.33      1.008   ; qtot 0.69
     5  opls_293B      1   LYS      CA      1       0.25     12.011   ; qtot 0.94
     6   opls_140      1   LYS      HA      1       0.06      1.008   ; qtot 1
</code></pre>

<p>这些信息的解释如下:</p>

<ul class="incremental">
<li>nr: 原子序号</li>
<li>type: 原子类型</li>
<li>resnr: 氨基酸残基序号</li>
<li>residue: 氨基酸残基名<br/>
注意这里的残基在原来的PDB文件中为&#8220;LYS&#8221;, 使用.rtp中的&#8220;LYSH&#8221;项意味着这是质子化的残基(中性pH时的占主导).</li>
<li>atom: 原子名称</li>
<li>cgnr: 电荷组序号<br/>
电荷组定义了整数电荷单元, 可加速计算.</li>
<li>charge: 无需解释<br/>
&#8220;qtot&#8221;为对分子总电荷的持续累加</li>
<li>mass: 也无需解释</li>
<li>typeB, chargeB, massB: 用于自由能微扰(这里不讨论)</li>
</ul>

<p>下面几节包括<code>[ bonds ]</code>, <code>[ pairs ]</code>, <code>[ angles ]</code>和<code>[ dihedrals ]</code>.
其中一些无需解释(键, 键角, 二面角). 这些节中的参数和函数类型可参看GROMACS手册的第5章.
特殊的1&#8211;4相互作用包含于&#8220;pairs&#8221;(GROMACS手册5.3.4节).</p>

<p>从位置限制开始, 文件的其余部分涉及一些有用的/必须的拓扑的定义.
<code>pdb2gmx</code>命令生成的&#8220;posre.itp&#8221;文件定义了平衡时用于维持原子位置的力常数(后面会详细解释).</p>

<pre><code>; Include Position restraint file
#ifdef POSRES
#include &quot;posre.itp&quot;
#endif
</code></pre>

<p>至此&#8220;Protein_A&#8221;分子类型的定义结束. 拓扑文件的其余部分用于定义其他分子并提供体系级别的说明.
下一分子类型(默认)是溶剂, 在本例中为SPC/E模型的水分子.
水的其他典型模型包括SPC, TIP3P和TIP4P. 通过在<code>pdb2gmx</code>命令中使用&#8220;-water spce&#8221;选项我们选择了SPC/E水模型.
<a href="http://www1.lsbu.ac.uk/water/water_models.html">Water Models</a>对许多不同的水模型的进行了很好的总结.
但是要注意GROMACS并没有包含所有的水模型.</p>

<pre><code>; Include water topology
#include &quot;oplsaa.ff/spce.itp&quot;

#ifdef POSRES_WATER
; Position restraint for each water oxygen
[ position_restraints ]
;  i funct       fcx        fcy        fcz
   1    1       1000       1000       1000
#endif
</code></pre>

<p>正如你看到的, 通过使用值为1000 kJ mol<sup>-1</sup> nm<sup>-2</sup>的力常数(k<sub>pr</sub>), 也可以对水分子进行位置限制.</p>

<p>接下来包含了离子的参数:</p>

<pre><code>; Include generic topology for ions
#include &quot;oplsaa.ff/ions.itp&quot;
</code></pre>

<p>最后是体系级别的定义. <code>[ system ]</code>指令给出了体系的名称, 在模拟中此名称将被写入到输出文件中.
<code>[ molecules ]</code>指令列出了体系中的所有分子.</p>

<pre><code>[ system ]
; Name
LYSOZYME

[ molecules ]
; Compound        #mols
Protein_A           1
</code></pre>

<p><code>[ molecule ]</code>指令的几个关键注意点:</p>

<ol class="incremental">
<li>列出分子的顺序必须与坐标(本例中为.gro)文件中的分子顺序 <strong>完全一致</strong>.</li>
<li>对每一物种, 列出的名称必须与<code>[ moleculetype ]</code>中的名称一致, 而不是残基名称或其他名称</li>
</ol>

<p>任何时候, 如果不能满足这些明确的要求, 运行<code>grompp</code>程序(后面介绍)时都会产生致命错误,
如mismatched names, molecules not being found或其他各种错误.</p>

<p>现在我们已经检查了拓扑文件的内容, 可以继续构建体系了.</p>

### 第三步: 定义单位盒子并填充溶剂

<p>现在你已经熟悉了GROMACS的拓扑文件, 可以继续创建体系了.
在本例中, 我们将要模拟一个简单的水溶液体系.
我们也可以模拟处于其他不同溶剂中的蛋白质或其他分子, 只要涉及到的物种有合适的力场参数.</p>

<p>定义一个模拟用的盒子并添加溶剂要分两步完成:</p>

<ol class="incremental">
<li>使用<code>editconf</code>模块定义盒子的尺寸</li>
<li>使用<code>solvate</code>模块(以前的版本中称为<code>genbox</code>)向盒子中填充水</li>
</ol>

<p>现在你需要决定使用哪种晶胞. 对于本教程的目的而言, 我们将使用一个简单的立方盒子作为晶胞.
当你对周期性的边界条件与盒子类型有了更多了解后, 我强烈推荐你使用菱形十二面体晶胞,
因为在周期性距离相同的情况下, 它的体积大约只有立方体晶胞的71%, 因此可以减少需要加入的溶剂水分子的数目.</p>

<p>让我们使用<code>editconf</code>来定义盒子:</p>

<p><code>gmx editconf -f 1AKI_processed.gro -o 1AKI_newbox.gro -c -d 1.0 -bt cubic</code></p>

<p>上面的命令将蛋白质置于盒子的中心(<code>-c</code>), 并且它到盒子边缘的距离至少为1.0 nm(<code>-d 1.0</code>).
盒子类型是立方体(<code>-bt cubic</code>). 到盒子边缘的距离是一个重要参数.
因为我们要使用周期性边界条件, 必须满足最小映象约定, 也就是说,
一个蛋白质永远不能&#8220;看到&#8221;它自身的周期性映象(不能与其自身有相互作用), 否则计算的力就会含有虚假的部分.
指定溶质与盒子之间的距离为1.0 nm意味着, 蛋白质分子的任意两个周期性映象之间的距离至少是2.0 nm.
对于模拟中常用的任何截断方案, 这个距离都足够了.</p>

<p>现在我们已经定义好了模拟盒子, 可以用溶剂(水)填充它了. 使用<code>solvate</code>模块添加溶剂:</p>

<p><code>gmx solvate -cp 1AKI_newbox.gro -cs spc216.gro -o 1AKI_solv.gro -p topol.top</code></p>

<p>使用的蛋白质构型文件(<code>-cp</code>)来自前面<code>editconf</code>步骤中的输出文件,
而溶剂的构型文件(<code>-cs</code>)来自标准安装的GROMACS. 我们使用的<code>spc216.gro</code>是通用的已平衡的三位点溶剂模型.
你也可以使用<code>spc216.gro</code>作为SPC, SPC/E或TIP3P水模型的溶剂构型, 因为它们都是三位点的水模型.
输出文件的名称为<code>1AKI_solv.gro</code>, 并且我们为<code>solvate</code>模块指定了拓扑文件的名称(<code>topol.top</code>),
这样它就能修改拓扑文件. 注意<code>topol.top</code>中<code>[ molecules ]</code>的变化:</p>

<pre><code>[ molecules ]
; Compound     #mols
Protein_A        1
SOL          10832
</code></pre>

<p><code>solvate</code>记录了增加的水分子数目, 并将其写入拓扑文件中以显示它所做的更改.
注意, 如果你使用其他的(非水)溶剂, <code>solvate</code>不会在拓扑文件中写入这些信息!
它自动记录更新水分子的功能是直接写在源代码中的.</p>

### 第四步: 添加离子

<p>现在我们已经有了一个带电荷的溶液体系. <code>pdb2gmx</code>程序的输出文件显示,
我们所用的蛋白质带有+8e的净电荷(根据它的氨基酸残基计算得到).
如果你忽略了<code>pdb2gmx</code>输出的这个信息, 查看一下<code>topol.top</code>文件中<code>[ atoms ]</code>指令的的最后一行,
它应该含有&#8220;qtot 8.&#8221;这一信息. 由于生命体系中不存在净电荷, 所以我们必须往我们体系中添加离子, 以保证总电荷为零.</p>

<p>GROMACS中添加离子的工具是<code>genion</code>. <code>genion</code>的功能是读取拓扑信息, 然后将体系中的一些水分子替换为指定的离子.
<code>genion</code>需要的输入文件称为运行输入文件, 扩展名为<code>.tpr</code>. 这个文件可使用GROMACS的<code>grompp</code>(GROMacs Pre-Processor)模块产生,
而且后面我们运行模拟时也会用它. <code>grompp</code>的功能是处理坐标文件和拓扑(它描述了分子)以产生原子级别的输入文件(<code>.tpr</code>). <code>.tpr</code>文件包含了体系中所有原子的所有参数.</p>

<p>为了用<code>grompp产生</code>.tpr<code>文件, 我们还需要一个扩展名为</code>.mdp<code>(molecular dynamics parameter)的输入文件.
</code>grompp<code>会将坐标和拓扑信息与</code>.mdp<code>文件中设定的参数组合起来生成</code>.tpr`文件.</p>

<p><code>.mdp</code>文件通常用于运行能量最小化(EM)或分子动力学模拟(MD), 但在这里我们只是简单地用它来生成系统的原子描述.
一个<code>.mdp</code>文件的<a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/lysozyme/Files/ions.mdp">示例</a>(后面我们将使用它)如下:</p>

<pre><code>; ions.mdp - used as input into grompp to generate ions.tpr
; Parameters describing what to do, when to stop and what to save
integrator  = steep     ; Algorithm (steep = steepest descent minimization)
emtol       = 1000.0    ; Stop minimization when the maximum force &lt; 1000.0 kJ/mol/nm
emstep      = 0.01      ; Energy step size
nsteps      = 50000     ; Maximum number of (minimization) steps to perform

; Parameters describing how to find the neighbors of each atom and how to calculate the interactions
nstlist         = 1         ; Frequency to update the neighbor list and long range forces
cutoff-scheme   = Verlet
ns_type         = grid      ; Method to determine neighbor list (simple, grid)
coulombtype     = PME       ; Treatment of long range electrostatic interactions
rcoulomb        = 1.0       ; Short-range electrostatic cut-off
rvdw            = 1.0       ; Short-range Van der Waals cut-off
pbc             = xyz       ; Periodic Boundary Conditions (yes/no)
</code></pre>

<p>实际上, 在这个步骤中所用的<code>.mdp</code>文件中可使用任何合理的参数. 我通常会使用能量最小化的参数设置, 因为它非常简单而且不涉及任何复杂的参数组合. <strong>请注意</strong> 本教程中所用的文件可能 <strong>只</strong> 适用于OPLS-AA力场.
其他力场的参数设置, 特别是非键参数设置可能很不一样.</p>

<p>使用下面的命令来产生<code>.tpr</code>文件</p>

<p><code>gmx grompp -f ions.mdp -c 1AKI_solv.gro -p topol.top -o ions.tpr</code></p>

<p>现在我们得到了一个二进制的<code>.tpr</code>文件, 它提供了我们体系的原子级别的描述. 将此文件用于<code>genion</code>:</p>

<p><code>gmx genion -s ions.tpr -o 1AKI_solv_ions.gro -p topol.top -pname NA -nname CL -nn 8</code></p>

<p>出现提示后, 选择13 &#8220;SOL&#8221;. 这意味这我们将用离子替换一些溶剂分子. 你肯定不想用离子去替换蛋白质的某一部分.</p>

<p>在<code>genion</code>命令中, 我们以结构/状态文件(<code>-s</code>)作为输入, 以<code>.gro</code>文件作为输出(<code>-o</code>), 以拓扑文件(<code>-p</code>)来反映去除的水分子和增加的离子, 并且定义了阳离子和阴离子的名称(分别使用<code>-pname</code>和<code>-nname</code>), 告诉<code>genion</code>只需要添加必要的离子来中和蛋白质所带的净电荷, 添加的阴离子数目为8(<code>-nn 8</code>).
对于<code>genion</code>, 除了简单地中和体系所带的净电荷以外, 你也可以同时指定<code>-neutral</code>和<code>-conc</code>选项来添加指定浓度的离子. 关于如何使用这些选项, 请参考<code>genion</code>的说明.</p>

<p>在以前版本的Gromacs中, 使用<code>-pname</code>和<code>-nname</code>指定的离子名称由力场决定, 但从4.5版本开始就完全标准化了. 指定的离子名称始终是大写的元素符号, 与<code>[ moleculetype ]</code>中的名称一致, 并会写入拓扑文件.
残基名称或原子名称可能会带有电荷符号(+/-), 也可能不带, 取决于力场. <strong>不要在<code>genion</code>命令中使用原子名称或残基名称, 否则在下面的步骤中会导致错误</strong>.</p>

<p><code>[ molecules ]</code>指令现在看起来应该这样:</p>

<pre><code>[ molecules ]
; Compound      #mols
Protein_A         1
SOL           10824
CL                8
</code></pre>

<p>使用分子结构可视化软件查看一下现在的体系</p>

<figure>
<img src="/GMX/GMXtut-1_solv_ions.jpg" alt="填充水分子并添加离子后构型" />
<figcaption>填充水分子并添加离子后构型</figcaption>
</figure>

### 第五步: 能量最小化

<p>现在, 我们已经添加了溶剂分子和离子, 得到了一个电中性的体系.
在开始动力学模拟之前, 我们必须保证体系的结构正常, 原子之间的距离不会过近, 几何构型合理.
对结构进行弛豫可以达到这些要求, 这个过程称为能量最小化(EM, energy minimization).</p>

<p>能量最小化过程与添加离子过程差不多. 我们要再次使用<code>grompp</code>将结构, 拓扑和模拟参数写入一个二进制的输入文件中(<code>.tpr</code>), 但这次我们不需要将<code>.tpr</code>文件传递给<code>genion</code>, 而是使用GROMACS MD引擎的<code>mdrun</code>模块来进行能量最小化.</p>

<p><a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/lysozyme/Files/minim.mdp">输入参数文件</a><code>minim.mdp</code>如下:</p>

<pre><code>; minim.mdp - used as input into grompp to generate em.tpr
integrator  = steep     ; Algorithm (steep = steepest descent minimization)
emtol       = 1000.0    ; Stop minimization when the maximum force &lt; 1000.0 kJ/mol/nm
emstep      = 0.01      ; Energy step size
nsteps      = 50000     ; Maximum number of (minimization) steps to perform

; Parameters describing how to find the neighbors of each atom and how to calculate the interactions
nstlist         = 1         ; Frequency to update the neighbor list and long range forces
cutoff-scheme   = Verlet
ns_type         = grid      ; Method to determine neighbor list (simple, grid)
coulombtype     = PME       ; Treatment of long range electrostatic interactions
rcoulomb        = 1.0       ; Short-range electrostatic cut-off
rvdw            = 1.0       ; Short-range Van der Waals cut-off
pbc             = xyz       ; Periodic Boundary Conditions (yes/no)
</code></pre>

<p>使用<code>grompp</code>处理这个参数文件, 以便得到二进制的输入文件:</p>

<p><code>gmx grompp -f minim.mdp -c 1AKI_solv_ions.gro -p topol.top -o em.tpr</code></p>

<p>确保在运行<code>genbox</code>和<code>genion</code>时你已经更新了<code>topol.top</code>文件, 否则你会得到一堆错误信息(&#8220;number of coordinates in coordinate file does not match topology&#8221;, 坐标文件中的坐标与拓扑不匹配, 等等).</p>

<p>现在我们可以调用<code>mdrun</code>来进行能量最小化了:</p>

<p><code>gmx mdrun -v -deffnm em</code></p>

<p>之所以使用<code>-v</code>选项是因为我们没什么耐心, 急于看到运行结果: 它使<code>mdrun</code>输出更多信息, 这样就会在屏幕上输出每步运行的情况. <code>-deffnm</code>选项定义了输入文件和输出文件的名称.
因此, 如果你没有对<code>grompp</code>输出的<code>em.tpr</code>进行命名, 你必须使用<code>mdrun</code>的<code>-s</code>选项明确指定它的名称.
就我们而言, 我们将得到以下文件:</p>

<ul class="incremental">
<li><code>em.log</code>: ASCII文本的日志文件, 记录了能量最小化过程</li>
<li><code>em.edr</code>: 二进制能量文件</li>
<li><code>em.trr</code>: 全精度的二进制轨迹文件</li>
<li><code>em.gro</code>: 能量最小化后的结构</li>
</ul>

<p>有两个重要的指标来决定能量最小化是否成功. 第一个是势能(在能量最小化过程的最后输出, 即使你未使用<code>-v</code>选项).
E<sub>pot</sub>应当是负值, 根据体系大小和水分子的多少, 大约在10<sup>5</sup>&#8211;10<sup>6</sup>的数量级(对水中的单个蛋白质而言).
第二个重要的指标是力的最大值F<sub>max</sub>. 我们在<code>minim.mdp</code>中设置的目标是<code>emtol=1000.0</code>,
这表示F<sub>max</sub>的目标值不能大于1000 kJ mol<sup>-1</sup> nm<sup>-1</sup>. 能量最小化完成后, 你有可能得到一个合理的E<sub>pot</sub>, 但F<sub>max</sub>&gt;emtol. 如果是这样, 用于模拟时你的体系可能不够稳定. 思考一下为什么会这样, 可能需要更改一下能量最小化的参数设置(integrator, emstep等), 再试试重新进行能量最小化过程.</p>

<p>让我们做一些分析. <code>em.edr</code>文件中包含了GROMACS在能量最小化过程中记录的所有能量项. 你可以使用GROMACS的<code>energy</code>模块来分析任何一个<code>.edr</code>文件:</p>

<p><code>gmx energy -f em.edr -o potential.xvg</code></p>

<p>提示时, 输入<code>10 0</code>来选择势能Potential(10), 并用零(0)来结束输入.
屏幕上会显示E<sub>pot</sub>的平均值, 得到的能量值会写入<code>potential.xvg</code>文件.
要利用这些数据绘图, 你可以试试<a href="http://plasma-gate.weizmann.ac.il/Grace/">Xmgrace</a>绘图工具. 得到的结果应该和下面的差不多, 从中可以看到E<sub>pot</sub>收敛得很好, 而且稳定.</p>

<figure>
<img src="/GMX/GMXtut-1_Epot_EM_SD.jpg" alt="能量最小化过程中势能的变化" />
<figcaption>能量最小化过程中势能的变化</figcaption>
</figure>

<p>现在我们的体系已经处于能量最小点了, 可以用它进行真正的动力学模拟了.</p>

### 第六步: NVT平衡

<p>EM可保证我们的初始结构在几何构型和溶剂分子取向等方面都合理. 为了开始真正的动力学模拟, 我们必须对蛋白质周围的溶剂和离子进行平衡.
如果我们在这时就尝试进行非限制的动力学模拟, 体系可能会崩溃. 原因在于我们基本上只是优化了溶剂分子自身, 而没有考虑溶质. 我们需要将体系置于设定的模拟温度下, 以确定溶质(蛋白质)的合理取向. 达到正确的温度(基于动能)之后, 我们要对体系施加压力直到它达到合适的密度.</p>

<p>还记得好久以前我们用<code>pdb2gmx</code>生成的<code>posre.itp</code>文件么? 现在它要派上用场了.
<code>posre.itp</code>文件的目的在于对蛋白质中的重原子(非氢原子)施加位置限制(position restraining)力.
这些原子不会移动, 除非增加非常大的能量. 位置限制的用途在于, 我们可以平衡蛋白质周围的溶剂分子, 而不引起蛋白质结构的变化.</p>

<p>平衡往往分两个阶段进行. 第一个阶段在NVT系综(粒子数, 体积和温度都是恒定的)下进行. 这个系综也被称为等温等容系综或正则系综. 这个过程的需要的时间与体系的构成有关, 但在NVT系综中, 体系的温度应达到预期值并基本保持不变. 如果温度仍然没有稳定, 那就需要更多的时间.
通常情况下, 50 ps到100 ps就足够了, 因此在本例中我们进行100 ps的NVT平衡. 根据机器的不同, 运行可能需要一段时间(在双核的MacBook上刚刚超过一小时). 需要的<code>.mdp</code><a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/lysozyme/Files/nvt.mdp">文件</a>如下:</p>

<pre><code>title       = OPLS Lysozyme NVT equilibration
define      = -DPOSRES  ; position restrain the protein
; Run parameters
integrator  = md        ; leap-frog integrator
nsteps      = 50000     ; 2 * 50000 = 100 ps
dt          = 0.002     ; 2 fs
; Output control
nstxout     = 500       ; save coordinates every 1.0 ps
nstvout     = 500       ; save velocities every 1.0 ps
nstenergy   = 500       ; save energies every 1.0 ps
nstlog      = 500       ; update log file every 1.0 ps
; Bond parameters
continuation            = no        ; first dynamics run
constraint_algorithm    = lincs     ; holonomic constraints
constraints             = all-bonds ; all bonds (even heavy atom-H bonds) constrained
lincs_iter              = 1         ; accuracy of LINCS
lincs_order             = 4         ; also related to accuracy
; Neighborsearching
cutoff-scheme   = Verlet
ns_type         = grid      ; search neighboring grid cells
nstlist         = 10        ; 20 fs, largely irrelevant with Verlet
rcoulomb        = 1.0       ; short-range electrostatic cutoff (in nm)
rvdw            = 1.0       ; short-range van der Waals cutoff (in nm)
; Electrostatics
coulombtype     = PME   ; Particle Mesh Ewald for long-range electrostatics
pme_order       = 4     ; cubic interpolation
fourierspacing  = 0.16  ; grid spacing for FFT
; Temperature coupling is on
tcoupl      = V-rescale             ; modified Berendsen thermostat
tc-grps     = Protein Non-Protein   ; two coupling groups - more accurate
tau_t       = 0.1     0.1           ; time constant, in ps
ref_t       = 300     300           ; reference temperature, one for each group, in K
; Pressure coupling is off
pcoupl      = no        ; no pressure coupling in NVT
; Periodic boundary conditions
pbc     = xyz           ; 3-D PBC
; Dispersion correction
DispCorr    = EnerPres  ; account for cut-off vdW scheme
; Velocity generation
gen_vel     = yes       ; assign velocities from Maxwell distribution
gen_temp    = 300       ; temperature for Maxwell distribution
gen_seed    = -1        ; generate a random seed
</code></pre>

<p>我们将使用<code>grompp</code>和<code>mdrun</code>, 像在能量最小化过程中做的一样</p>

<pre><code>gmx grompp -f nvt.mdp -c em.gro -p topol.top -o nvt.tpr

gmx mdrun -deffnm nvt
</code></pre>

<p>除注释外, 所用参数的完整解释可以在GROMACS手册中找到. 注意<code>.mdp</code>文件中下面的这几个参数:</p>

<ul class="incremental">
<li><code>gen_vel = yes</code>: 产生初始速度. 使用不同的随机数种子(<code>gen_seed</code>)会得到不同的初始速度, 因此从一个相同的初始结构开始可进行多个(不同的)模拟.</li>
<li><code>tcoupl = V-rescale</code>: 速度重缩放控温器改进了Berendsen弱耦合方法, 后者不能给出正确动能系综.</li>
<li><code>pcoupl = no</code>: 不使用压力耦合</li>
</ul>

<p>让我们来分析温度变化情况, 再次使用<code>energy</code>模块:</p>

<p><code>gmx energy -f nvt.edr</code></p>

<p>提示时输入<code>15 0</code>来选择体系温度并退出. 得到的结果应该和下面的差不多:</p>

<figure>
<img src="/GMX/GMXtut-1_Temp_NVT.jpg" alt="NVT平衡过程中温度的变化" />
<figcaption>NVT平衡过程中温度的变化</figcaption>
</figure>

<p>从上图可以清楚地看出, 体系的温度很快就达到了目标温度(300 K), 并在平衡过程中后面的时间内保持稳定.
对于这个体系, 更短的平衡时间(50 ps)也足够了.</p>

### 第七步: NPT平衡

<p>前一步的NVT平衡稳定了体系的温度. 在采集数据之前, 我们还需要稳定体系的压力(因此还包括密度).
压力平衡是在NPT系综下进行的, 其中粒子数, 压力和温度都保持不变. 这个系综也被称为等温等压系综, 最接近实验条件.</p>

<p>100 ps NPT平衡的<code>.mdp</code><a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/lysozyme/Files/npt.mdp">文件</a>如下:</p>

<pre><code>title       = OPLS Lysozyme NPT equilibration
define      = -DPOSRES  ; position restrain the protein
; Run parameters
integrator  = md        ; leap-frog integrator
nsteps      = 50000     ; 2 * 50000 = 100 ps
dt          = 0.002     ; 2 fs
; Output control
nstxout     = 500       ; save coordinates every 1.0 ps
nstvout     = 500       ; save velocities every 1.0 ps
nstenergy   = 500       ; save energies every 1.0 ps
nstlog      = 500       ; update log file every 1.0 ps
; Bond parameters
continuation            = yes       ; Restarting after NVT
constraint_algorithm    = lincs     ; holonomic constraints
constraints             = all-bonds ; all bonds (even heavy atom-H bonds) constrained
lincs_iter              = 1         ; accuracy of LINCS
lincs_order             = 4         ; also related to accuracy
; Neighborsearching
cutoff-scheme   = Verlet
ns_type         = grid      ; search neighboring grid cells
nstlist         = 10        ; 20 fs, largely irrelevant with Verlet scheme
rcoulomb        = 1.0       ; short-range electrostatic cutoff (in nm)
rvdw            = 1.0       ; short-range van der Waals cutoff (in nm)
; Electrostatics
coulombtype     = PME       ; Particle Mesh Ewald for long-range electrostatics
pme_order       = 4         ; cubic interpolation
fourierspacing  = 0.16      ; grid spacing for FFT
; Temperature coupling is on
tcoupl      = V-rescale             ; modified Berendsen thermostat
tc-grps     = Protein Non-Protein   ; two coupling groups - more accurate
tau_t       = 0.1     0.1           ; time constant, in ps
ref_t       = 300     300           ; reference temperature, one for each group, in K
; Pressure coupling is on
pcoupl              = Parrinello-Rahman     ; Pressure coupling on in NPT
pcoupltype          = isotropic             ; uniform scaling of box vectors
tau_p               = 2.0                   ; time constant, in ps
ref_p               = 1.0                   ; reference pressure, in bar
compressibility     = 4.5e-5                ; isothermal compressibility of water, bar^-1
refcoord_scaling    = com
; Periodic boundary conditions
pbc     = xyz       ; 3-D PBC
; Dispersion correction
DispCorr    = EnerPres  ; account for cut-off vdW scheme
; Velocity generation
gen_vel     = no        ; Velocity generation is off
</code></pre>

<p>该文件与NVT平衡时所用的参数文件没有太大不同. 注意添加的压力耦合部分, 其中使用了Parrinello-Rahman控压器.</p>

<p>其他几项改动如下:</p>

<ul class="incremental">
<li><code>continuation = yes</code>: 我们将从NVT平衡阶段开始继续进行模拟</li>
<li><code>gen_vel =no</code>: 从轨迹中读取速度(参看下面的解释)</li>
</ul>

<p>我们使用<code>grompp</code>和<code>mdrun</code>, 像在NVT平衡所做的那样. 注意, 我们现在要使用<code>-t</code>选项以包括NVT平衡过程中的产生的检查点文件. 这个文件包含了继续模拟所需要的所有状态变量.
为使用NVT过程中得到的速度我们必须包含这个文件. 坐标文件(<code>-c</code>)是NVT模拟的最终输出文件.</p>

<p><code>gmx grompp -f npt.mdp -c nvt.gro -t nvt.cpt -p topol.top -o npt.tpr</code></p>

<p><code>gmx mdrun -deffnm npt</code></p>

<p>让我们来分析压力变化情况, 再次使用<code>energy</code>模块:</p>

<p><code>gmx energy -f npt.edr -o pressure.xvg</code></p>

<p>提示时输入<code>16 0</code>来选择体系压力并退出. 结果应与下图类似:</p>

<figure>
<img src="/GMX/GMXtut-1_Pressure_NPT.jpg" alt="NVT平衡过程中压力的变化" />
<figcaption>NVT平衡过程中压力的变化</figcaption>
</figure>

<p>在100 ps的平衡过程中压力值涨落很大, 这并不意外. 图中的红线为数据的移动平均值. 在整个平衡过程中, 压力的平均值为1.05 bar.</p>

<p>让我们再来看看密度, 使用<code>energy</code>模块并在提示时输入<code>22 0</code></p>

<p><code>gmx energy -f npt.edr -o density.xvg</code></p>

<figure>
<img src="/GMX/GMXtut-1_Density_NPT.jpg" alt="NVT平衡过程中密度的变化" />
<figcaption>NVT平衡过程中密度的变化</figcaption>
</figure>

<p>跟压力一样, 红线是密度的移动平均值. 100 ps过程中密度的平均值为998.3 kg m<sup>-3</sup>, 比较接近实验值1000 kg m<sup>-3</sup>与SPC/E水模型的值1008 kg m<sup>-3</sup>. SPC/E水模型的参数给出的密度值接近水的实验值. 在整个过程中密度值都很稳定, 意味着体系的压力和密度下都平衡得很好.</p>

<p><strong>请注意</strong>, 经常有人问我为什么他得到的密度值与我的结果不同. 与压力有关的性质收敛很慢, 因此你运行NPT平衡的时间必须比这里指定的稍长一些.</p>

【李继存 注】经常有人问上面两个图中的红线怎么得到. 如果你要使用累积平均值来画, 那可能需要一小段代码来完成. 但如果你只是像图中一样, 使用移动平均值来简单地平滑一下, 就很简单了.

在Xmgrace中, 依次点击菜单 `Data` -> `Transformations` -> `Running averages...`, 在弹出的对话框中设定`Length of average`, `Accept`即可. `Length of average`的具体数值要根据具体数据的特点来设, 越大, 得到的平均线越平滑. 自己试几次就知道了. 

在Origin中, 依次点击菜单 `分析` -> `平滑` -> `相邻平均` 或 `FFT滤波器`, 设定平滑的点数即可. 具体数值的设置原则, 和Xmgrace中的一样.


### 第八步: 成品MD

<p>随着两个平衡阶段的完成, 体系已经在需要的温度和压强下平衡好了.
我们现在可以放开位置限制并进行成品MD以收集数据了. 这个过程跟前面的类似.
运行<code>grompp</code>时, 我们还要用到检查点文件(在这种情况下,其中包含了压力耦合信息).
我们要进行一个1 ns的MD模拟, 所用的<a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/lysozyme/Files/md.mdp">参数文件</a>如下:</p>

<pre><code>title       = OPLS Lysozyme MD simulation
; Run parameters
integrator  = md        ; leap-frog integrator
nsteps      = 500000    ; 2 * 500000 = 1000 ps (1 ns)
dt          = 0.002     ; 2 fs
; Output control
nstxout             = 5000      ; save coordinates every 10.0 ps
nstvout             = 5000      ; save velocities every 10.0 ps
nstenergy           = 5000      ; save energies every 10.0 ps
nstlog              = 5000      ; update log file every 10.0 ps
nstxout-compressed  = 5000      ; save compressed coordinates every 10.0 ps
                                ; nstxout-compressed replaces nstxtcout
compressed-x-grps   = System    ; replaces xtc-grps
; Bond parameters
continuation            = yes       ; Restarting after NPT
constraint_algorithm    = lincs     ; holonomic constraints
constraints             = all-bonds ; all bonds (even heavy atom-H bonds) constrained
lincs_iter              = 1         ; accuracy of LINCS
lincs_order             = 4         ; also related to accuracy
; Neighborsearching
cutoff-scheme   = Verlet
ns_type         = grid      ; search neighboring grid cells
nstlist         = 10        ; 20 fs, largely irrelevant with Verlet scheme
rcoulomb        = 1.0       ; short-range electrostatic cutoff (in nm)
rvdw            = 1.0       ; short-range van der Waals cutoff (in nm)
; Electrostatics
coulombtype     = PME       ; Particle Mesh Ewald for long-range electrostatics
pme_order       = 4         ; cubic interpolation
fourierspacing  = 0.16      ; grid spacing for FFT
; Temperature coupling is on
tcoupl      = V-rescale             ; modified Berendsen thermostat
tc-grps     = Protein Non-Protein   ; two coupling groups - more accurate
tau_t       = 0.1     0.1           ; time constant, in ps
ref_t       = 300     300           ; reference temperature, one for each group, in K
; Pressure coupling is on
pcoupl              = Parrinello-Rahman     ; Pressure coupling on in NPT
pcoupltype          = isotropic             ; uniform scaling of box vectors
tau_p               = 2.0                   ; time constant, in ps
ref_p               = 1.0                   ; reference pressure, in bar
compressibility     = 4.5e-5                ; isothermal compressibility of water, bar^-1
; Periodic boundary conditions
pbc     = xyz       ; 3-D PBC
; Dispersion correction
DispCorr    = EnerPres  ; account for cut-off vdW scheme
; Velocity generation
gen_vel     = no        ; Velocity generation is off
</code></pre>

<p>依次运行下面的命令:</p>

<p><code>gmx grompp -f md.mdp -c npt.gro -t npt.cpt -p topol.top -o md_0_1.tpr</code></p>

<p><code>gmx mdrun -deffnm md_0_1</code></p>

<pre><code>Estimate for the relative computational load of the PME mesh part: 0.25
</code></pre>

<p>PME负载估计可指示应该使用多少处理器进行PME计算, 多少处理器进行PP计算. 详细情况请参考GROMACS 4的<a href="http://dx.doi.org/10.1021/ct700301q">相关论文</a>和GROMACS手册. 对立方盒子, 最佳设置的PME负载为0.25(3:1 PP:PME, 我们很幸运!), 对十二面体盒子, 最佳PME负载为0.33(2:1 PP:PME). 当执行<code>mdrun</code>的时候, 程序会自动分配用于PP和PME计算的处理器数目. 因此, 确保计算时使用了合适的节点数(<code>-np X</code>选项中的值), 这样性能最好. 对本教程中的这个体系, 在24个CPU上(18 PP, 6 PME)我得到的计算速度大约是14 ns/day.</p>

<p><strong>在GPU上运行GROMACS</strong></p>

<p>自4.0版本开始, GROMACS运行MD模拟时可以使用GPU加速器. 非键相互作用使用GPU进行计算, 而键合与PME相互作用则使用标准的CPU硬件进行计算. 当安装GROMACS(参考<a href="http://www.gromacs.org/">www.gromacs.org</a>上的安装指导)的时候, 会自动检测存在的GPU硬件设备. 使用GPU加速的最低要求为CUDA库和SDK, 以及具有2.0计算能力的GPU卡. <a href="https://developer.nvidia.com/cuda-gpus">这里</a>列出了一些更常见的卡及其配置. 要使用GPU, 上面<code>.mdp</code>文件唯一要做的修改是添加下面一行以确保使用Verlet截断方案(GPU不支持旧的组方案):</p>

<pre><code>cutoff-scheme = Verlet
</code></pre>

<p>假定你有一个可用的GPU, 要利用它可使用下面的<code>mdrun</code>命令:</p>

<p><code>gmx mdrun -deffnm md_0_1 -nb gpu</code></p>

<p>如果可用的GPU卡超过一个, 或者想利用GROMACS支持的杂合并行方案对计算进行划分, 请参考GROMACS手册以及网络上的资料. 这些技术细节超出了本教程的范围.</p>

### 第九步: 分析

<p>现在已经完成了对蛋白质的模拟, 我们应该来分析一下我们的体系. 哪些类型的数据才是重要的呢? 这是在模拟前就要思考的一个重要问题, 所以你应该对自己的体系需要采集哪些数据类型有自己的想法. 在本教程中, 我们只介绍一些基本工具.</p>

<p>第一个模块是<code>trjconv</code>, 这是一个后处理工具, 用于处理坐标, 修正周期性或手动调整轨迹(时间单位, 帧频率等). 在本教程中, 我们要使用<code>trjconv</code>来处理体系中的任何周期性. 蛋白质在单元晶胞中扩散, 可能看起来会在盒子两边之间进行&#8220;跳跃&#8221;. 我们使用下面的命令来处理这种情况:</p>

<p><code>gmx trjconv -s md_0_1.tpr -f md_0_1.xtc -o md_0_1_noPBC.xtc -pbc mol -ur compact</code></p>

<p>选择<code>0(&quot;System&quot;)</code>用于输出. 我们要基于这个&#8220;修正&#8221;后的轨迹进行分析. 先来看看结构稳定性.
GROMACS内置的<code>rms</code>模块可用于计算RMSD, 使用下面的命令来运行这个工具:</p>

<p><code>gmx rms -s md_0_1.tpr -f md_0_1_noPBC.xtc -o rmsd.xvg -tu ns</code></p>

<p>计算最小二乘拟合RMSD和组RMSD时, 都选择<code>4(&quot;Backbone&quot;)</code>. <code>-tu</code>选项设定输出结果的时间单位为ns, 即便轨迹文件以ps为单位输出. 这是为了使输出文件更加清晰(尤其当模拟时间很长时, 100 ns比起1e+05 ps更美观). 输出显示了MD模拟前后溶菌酶结构的RMSD:</p>

<figure>
<img src="/GMX/GMXtut-1_rmsd_0_1.jpg" alt="MD构型相对与初始构型的RMSD" />
<figcaption>MD构型相对与初始构型的RMSD</figcaption>
</figure>

<p>如果我们要计算相对于晶体结构的RMSD值, 可以使用下面的命令:</p>

<p><code>gmx rms -s em.tpr -f md_0_1_noPBC.xtc -o rmsd_xtal.xvg -tu ns</code></p>

<p>结果如下图所示:</p>

<figure>
<img src="/GMX/GMXtut-1_rmsd_0_1_xtal.jpg" alt="MD构型相对与晶体结构的RMSD" />
<figcaption>MD构型相对与晶体结构的RMSD</figcaption>
</figure>

<p>上面两个图都显示出RMSD大约是0.1 nm(1Å), 这表示蛋白质的结构非常稳定. 两图之间的微小差异意味着, 当t=0 ns时的蛋白质的结构与晶体结构稍有不同. 这是预期结果, 因为它已经进行了能量最小化, 而且如我们前面讨论的, 位置限制并不是100%完美的.</p>

<p>我们也可以将初始构型与模拟后的构型进行比较, 这样可以更直观地看出二者的区别.</p>

<figure>
<img src="/GMX/GMXtut-1_Geo_ini.jpg" alt="初始构型" />
<figcaption>初始构型</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_Geo_md.jpg" alt="模拟后构型" />
<figcaption>模拟后构型</figcaption>
</figure>

<p>去掉水分子可以看得更清楚一些</p>

<figure>
<img src="/GMX/GMXtut-1_pro_ini.jpg" alt="溶菌酶初始构型" />
<figcaption>溶菌酶初始构型</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-1_pro_md.jpg" alt="溶菌酶模拟后构型" />
<figcaption>溶菌酶模拟后构型</figcaption>
</figure>

<p>如果将两者进行最小二乘叠合更容易看出区别</p>

<figure>
<img src="/GMX/GMXtut-1_iniMD.jpg" alt="溶菌酶初始构型与模拟后构型的叠合" />
<figcaption>溶菌酶初始构型与模拟后构型的叠合</figcaption>
</figure>

<p>蛋白质的回旋半径R<sub>g</sub>可衡量其密实度. 如果蛋白质的折叠很稳定, 其R<sub>g</sub>将保持一个相对稳定的值. 如果蛋白质去折叠, 它的R<sub>g</sub>将随时间变化. 我们来分析一下模拟的溶菌酶的回旋半径:</p>

<p><code>gmx gyrate -s md_0_1.tpr -f md_0_1_noPBC.xtc -o gyrate.xvg</code></p>

<figure>
<img src="/GMX/GMXtut-1_Rg_0_1.jpg" alt="回旋半径随时间的变化" />
<figcaption>回旋半径随时间的变化</figcaption>
</figure>

<p>可以看到, R<sub>g</sub>值基本不变, 这预示着在温度为300 K时, 1 ns的时间内蛋白质很稳定, 处于紧密(折叠)的形式. 这一结果并非意外, 但说明了GROMACS具有先进的分析功能.</p>

### 总结

<p>现在你已经用GROMACS完成了一个分子动力学模拟过程, 并分析了一些结果,
本教程并不全面. 你还可以用GROMACS完成更多类型的模拟(自由能计算, 非平衡MD, 简正模式分析, 等等).
你应该阅读一些文献以及GROMACS手册, 试着调整这里提供的<code>.mdp</code>文件中的参数来以便使模拟更有效, 更精确.</p>

<p>如果你对改进这个教程有些建议, 如果你发现了错误, 或者你觉得有些地方不够清楚, 请给我发邮件<code>jalemkul@vt.edu</code>, 不要客气. 请注意: 这不是邀请你因为GROMACS的问题而给我发邮件. 我并不是作为一个私人家教或个人客服在为自己打广告. 那是<a href="http://lists.gromacs.org/mailman/listinfo/gmx-users">GROMACS用户列表</a>的事. 我可能会在那里帮助你, 但那只是作为对整个社区的服务, 而不只针对最终用户.</p>

<p>模拟快乐!</p>
