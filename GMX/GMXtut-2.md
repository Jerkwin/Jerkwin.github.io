---
 layout: post
 title: GROMACS教程：DPPC膜中的KALP<sub>15</sub>
 categories:
 - 科
 tags:
 - GMX
---

* toc
{:toc}


<ul>
<li>翻译: 李继存</li>
</ul>

<figure>
<img src="/GMX/GMXtut-2_kalp15_dppc.jpg" alt="" />
<figcaption></figcaption></figure>

## 概述

<p>本教程将指导用户创建一个简单的膜蛋白体系并进行模拟, 具体体系为处于模型膜DPPC中KALP<sub>15</sub>. 本教程假定用户已经成功地完成了<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2">溶菌酶教程</a>, 其他一些教程, 或者非常熟悉GROMACS的模拟方法以及拓扑组织. 本教程中较详细的内容主要关注与膜蛋白相关的部分, 不会像在溶菌酶教程中那样提供每一步骤的详尽解释.</p>

<p>本教程假定你使用GROMACS 5.0或更新的版本.</p>

<p><strong>请注意</strong>, 本教程的目的只是示例性地构建一个膜蛋白体系, 同时理解GROMACS力场的组织以及修改方法. 当你需要将一组参数与以一种自洽方式得到的其他参数组合在一起时, 这种方法很适用. 有些力场包含了你所需要的一切. 例如, 对CHARMM36这样的力场, 试图完全遵循教程中的方法是不明智的, 因为它不需要修改. 在那种情况下, 使用<a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/membrane_protein/www.charmm-gui.org">CHARMM-GUI</a>构建体系可能更好.</p>

## 第一步: 准备拓扑

<p>我们要研究的蛋白质为KALP模型多肽, 以KALP<sub>15</sub>表示, 其序列为Ac-GKK(LA)<sub>4</sub>LKKA-NH<sub>2</sub>. 这里给出的流程基于Kandasamy和Larson在研究憎水误匹配时构建的体系. 原始参考文献可在<a href="http://dx.doi.org/10.1529/biophysj.105.073395">这里</a>下载.</p>

<p>多肽是使用<a href="http://ambermd.org/#AmberTools">AmberTools</a>的xLeap模块创建的, 创建时使用了α螺旋的理想骨架结构(φ=&#8211;60°, ψ=&#8211;40°). 使用<code>gmx editconf -princ</code>命令使.pdb文件中的蛋白质沿z轴取向, 然后再将蛋白绕y轴旋转. 注意, 在GROMACS&#8211;3.3.x中, <code>-princ</code>选项默认情况下使结构的长轴(对我们的情况, 为螺旋轴)沿z轴取向. 但此选项在GROMACS&#8211;4.0.4中变为长轴沿x轴进行取向. 如果你想跳过多肽的构建过程, 可在<a href="/GMX/GMXtut-2_KALP-15_princ.pdb">这里</a>下载已经正确取向的结构.</p>

<p>使用下面的命令运行<code>gmx pdb2gmx</code>:</p>

<pre><code>gmx pdb2gmx -f KALP-15_princ.pdb -o KALP-15_processed.gro -ignh -ter -water spc
</code></pre>

<p>提示时, 选择<code>GROMOS96 53A6</code>参数集, 对末端选择<code>None</code>, 由于已经在N端和C端分别添加了乙酰基和酰胺基进行封端, 我们不再需要<code>gmx pdb2gmx</code>构建常规的氨基和羧基. 相反, 我们需要<code>gmx pdb2gmx</code>为我们的封端基团添加连接性. <code>-ignh</code>选项指示<code>gmx pdb2gmx</code>忽略输出中的H原子. 默认情况下, xLeap会给出全原子结构(由于AMBER力场使用显式的氢). 在AMBER的命名约定中, 这些H原子的命名可能与GROMOS96力场中的不同. 如果让<code>gmx pdb2gmx</code>忽略输入的所有H原子, 它只会添加需要的那些.</p>

<p>现在我们需要对拓扑进行一些修改.</p>

## 第二步: 修改拓扑

<p>我们要模拟的双分子脂膜为DPPC(dipalmitoyl phosphatidylcholine), 因此我们也需要它的参数. 但如果<code>gmx pdb2gmx</code>只是设计用于处理蛋白质, 核酸以及有限数量的一些辅酶因子, 我们如何才能得到DPPC分子的参数并添加到我们的体系中呢?</p>

<p>没有通用的力场可用于模拟所有蛋白质, 核酸, 脂分子, 碳水化合物和任意的小分子. 由于我们模拟的体系同时包含蛋白质和脂分子, 我们如何解决力场问题? 在GROMACS的膜蛋白模拟中, 应用最广泛的脂分子参数通常称为Berger脂分子(Berger lipids), 是由Berger, Edholm和Jähnig(<a href="http://dx.doi.org/10.1016/S0006-3495%2897%2978845-3">参考文献</a>)发展的. 这些参数可以与蛋白质的GROMOS力场联合使用</p>

<p>在一定程度上, 所谓的Berger脂分子是GROMOS原子类型和OPLS部分电荷的杂合. 由于GROMOS键参数描述长的烷烃链效果很差, 因此使用Ryckaert-Bellemans二面角势进行描述, 并对Lennard-Jones 1&#8211;4相互作用使用缩放因子0.125. 这些脂分子的参数由D. Peter Tieleman发布在他的<a href="http://wcm.ucalgary.ca/tieleman/downloads">网站</a>上. 打开这个网站, 下载以下文件:</p>

<ul>
<li><code>dppc128.pdb</code> - 含128个DPPC脂分子的双脂膜</li>
<li><code>dppc.itp</code> - DPPC的分子类型定义</li>
<li><code>lipid.itp</code> - Berger脂分子参数</li>
</ul>

<p>那<code>lipid.itp</code>到底是什么, 我们如何使用它呢? 想想这个类比: 蛋白质的<code>gromos53a6.ff/forcefield.itp</code>相当于脂分子的<code>lipid.itp</code>. 基本上, <code>lipid.itp</code>包含了许多类脂分子的所有原子类型, 非键参数和键合参数, 与蛋白质<code>forcefield.itp</code>, <code>ffnonbonded.itp</code>和<code>ffbonded.itp</code>文件的功能类似. 也就是说, 我们不可以在自己的拓扑中简单地使用<code>#include &quot;lipid.itp&quot;</code>, 因为它与<code>forcefield.itp</code>处于同等的水平(优先级).</p>

<p>要使用<code>lipid.itp</code>中的参数, 我们必须修改已经预打包好的<code>gromos53a6.ff/forcefield.itp</code>文件. 在你的工作目录中创建一个新的目录<code>gromos53a6_lipid.ff</code>, 并从<code>gromos53a6.ff</code>目录中复制以下文件到这个目录:</p>

<pre><code>aminoacids.rtp
aminoacids.hdb
aminoacids.c.tdb
aminoacids.n.tdb
aminoacids.r2b
aminoacids.vsd
ff_dum.itp
ffnonbonded.itp
ffbonded.itp
forcefield.itp
ions.itp
spc.itp
watermodels.dat
</code></pre>

<p>接下来, 创建一个<code>forcefield.doc</code>文件, 其中包含力场参数的说明. 我使用了下面这样的说明:</p>

<pre><code>GROMOS96 53A6 force field, extended to include Berger lipid parameters
</code></pre>

<p>接下来, 将<code>lipid.itp</code>中的<code>[ atomtypes ]</code>, <code>[ nonbond_params ]</code>和<code>[ pairtypes ]</code>部分复制粘贴到<code>ffnonbonded.itp</code>中相应的行. 你可以发现<code>lipid.itp</code>中的<code>[ atomtypes ]</code>节缺少原子编号(<code>at.num</code>列), 因此添加上编号. 修改后的行应该是:</p>

<pre><code> LO    8    15.9994      0.000     A  2.36400e-03 1.59000e-06 ;carbonyl O, OPLS
LOM    8    15.9994      0.000     A  2.36400e-03 1.59000e-06 ;carboxyl O, OPLS
LNL    7    14.0067      0.000     A  3.35300e-03 3.95100e-06 ;Nitrogen, OPLS
 LC    6    12.0110      0.000     A  4.88800e-03 1.35900e-05 ;Carbonyl C, OPLS
LH1    6    13.0190      0.000     A  4.03100e-03 1.21400e-05 ;CH1, OPLS
LH2    6    14.0270      0.000     A  7.00200e-03 2.48300e-05 ;CH2, OPLS
 LP   15    30.9738      0.000     A  9.16000e-03 2.50700e-05 ;phosphor, OPLS
LOS    8    15.9994      0.000     A  2.56300e-03 1.86800e-06 ;ester oxygen, OPLS
LP2    6    14.0270      0.000     A  5.87400e-03 2.26500e-05 ;RB CH2, Bergers LJ
LP3    6    15.0350      0.000     A  8.77700e-03 3.38500e-05 ;RB CH3, Bergers LJ
LC3    6    15.0350      0.000     A  9.35700e-03 3.60900e-05 ;CH3, OPLS
LC2    6    14.0270      0.000     A  5.94700e-03 1.79000e-05 ;CH2, OPLS
</code></pre>

<p>在<code>[ nonbond_params ]</code>节中, 你可以看到一行<code>;; parameters for lipid-GROMOS interactions.</code>, <strong>删除这一行以及所有后续行</strong>, 因为这些非键组合特定地用于已经废弃的ffgmx力场. 移除这些行后, 会根据GROMOS96 53A6力场的标准组合规则生成蛋白质和脂分子之间的相互作用参数. 文件中也有涉及<code>HW</code>原子类型的非键相互作用, 由于它们都是零, 你也可以删除这些行, 否则请将<code>HW</code>重命名为<code>H</code>, 以便与GROMOS96 53A6的命名约定兼容. <strong>如果你不进行重命名或移除这些行, 后面执行<code>gmx grompp</code>时会导致致命错误</strong>.</p>

<p>追加<code>[ dihedraltypes ]</code>的内容到<code>ffbonded.itp</code>中相应的节. 这些行看起来差异很大, 但无关紧要. 它们是Ryckaert-Bellemans二面角, 与默认GROMOS96 53A6力场中使用的标准周期性二面角形式不同. 最后, 将<code>topol.top</code>文件中的<code>#include</code>语句由</p>

<pre><code>#include &quot;gromos53a6.ff/forcefield.itp&quot;
</code></pre>

<p>修改为</p>

<pre><code>#include &quot;gromos53a6_lipid.ff/forcefield.itp&quot;
</code></pre>

<p>最后, 我们需要包含DPPC分子的特定参数. 做法非常简单. 在你的<code>topol.top</code>文件中添加一行<code>#include &quot;dppc.itp&quot;</code>即可, 放在蛋白质位置限制部分的后面, 位置限制部分是蛋白质<code>[ moleculetype ]</code>定义的结束. 这些做法与在拓扑文件中添加任何其他小分子或溶剂类似. 在本节及整个教程中, 绿色文本表示你要添加的行, 其他文本(黑色)表示修改前拓扑中已有的内容.</p>

<pre><code>; Include Position restraint file
#ifdef POSRES
#include &quot;posre.itp&quot;
#endif

; Include DPPC chain topology
#include &quot;dppc.itp&quot;

; Include water topology
#include &quot;gromos53a6_lipid.ff/spc.itp&quot;
</code></pre>

<p>也可以使用OPLS-AA力场描述蛋白质, 但你必须修改<code>lipid.itp</code>使它与OPLS约定兼容. 关于做法, 请参考下面的链接:</p>

<ul>
<li><a href="http://lists.gromacs.org/pipermail/gromacs.org_gmx-users/2006-May/021416.html">lipid.itp LJ&#8211;1,4 values involving water</a></li>
<li><a href="http://lists.gromacs.org/pipermail/gromacs.org_gmx-users/2006-August/023587.html">OPLS and Berger lipids a la Tieleman 2006</a></li>
<li><a href="http://lists.gromacs.org/pipermail/gromacs.org_gmx-users/2006-September/023761.html">A method to scale Coulombic 1&#8211;4 interactions seperately</a></li>
</ul>

<p>关于力场理论以及组合规则的更多信息, 请查看此<a href="GMXtut-2_lipidCombinationRules.pdf">文档</a>. 感谢Chris Neale提供这一链接.</p>

<p>无论选择哪种设置, 你都必须说明你的模型是合理的. 本教程给出的特定参数组合, 在我这里是可行的, 根据其他一些用户的报告也是可行的. 毕竟, 是你要让听众(即审稿人)相信, 你知道自己在做什么, 你的模型是有效的.</p>

<p>如果你正确地遵循了上面的所有步骤, 你就会得到一个全功能的力场, 可与<code>gmx pdb2gmx</code>一起用于处理其他膜蛋白. 这样做不必手动修改<code>topol.top</code>. 将新的<code>gromos53a6_lipid.ff</code>目录放于<code>$GMXLIB</code>下就可以在整个系统中使用这个力场了.</p>

## 第三步: 定义单位晶胞并添加溶剂

<p>比起水中的蛋白质来, 为膜蛋白定义单位晶胞更复杂一些. 构建单位晶胞时有几个关键步骤:</p>

<ol>
<li>在相同的坐标系中对蛋白和膜进行取向</li>
<li>在蛋白周围堆积脂分子</li>
<li>使用水进行溶剂化</li>
</ol>

### 1. 蛋白质和膜的取向

<p>我们已经使用<code>gmx editconf</code>对KALP多肽进行了排列. 双脂层处于xy平面内, 其法向沿z轴. 使用<code>gmx editconf</code>将<code>dppc128.pdb</code>转换为.gro格式, 并移除初始的周期性. 后面一步使用<code>gmx trjconv</code>很容易完成, 其步骤为:</p>

<p>(1) 使用<code>gmx grompp</code>对仅含有DPPC的体系生成.tpr文件. 你可以使用任何有效的.mdp文件, 相应于纯DPPC的拓扑文件. 这里是一个<a href="/GMX/GMXtut-2_minim.mdp">示例.mdp文件</a>, 以及一个<a href="/GMX/GMXtut-2_topol_dppc.top">拓扑文件</a>. 注意拓扑文件非常简单, 仅包含了<code>dppc.itp</code>和<code>spc.itp</code>, 用以读入DPPC和水的参数. 就这么简单! 运行<code>gmx grompp</code>:</p>

<pre><code>gmx grompp -f minim.mdp -c dppc128.gro -p topol_dppc.top -o em.tpr
</code></pre>

<p>你可能会得到一个致命错误, 像<a href="http://lists.gromacs.org/pipermail/gromacs.org_gmx-users/2011-January/057979.html">这样</a>, 但在这种情况下对上面的命令可以安全地使用<code>-maxwarn 1</code>选项来忽略错误. 可以这样做的原因见<a href="http://lists.gromacs.org/pipermail/gromacs.org_gmx-users/2011-January/057980.html">这里</a>. <strong>请注意</strong> 这一步是使用<code>topol_dppc.top</code>的唯一一步, 此文件不能用于任何其他目的, 你不应该将它用于本教程中的 <strong>任何</strong> 剩余步骤.</p>

<p>不需要对双脂层运行完整的能量最小化过程, 尽管愿意的话, 你也可以这么做. .tpr文件中包含键合与周期性的信息, 因此在某种意义上可以用于重建破碎的分子.</p>

<p>(2) 使用<code>gmx trjconv</code>移除周期性</p>

<pre><code>gmx trjconv -s em.tpr -f dppc128.gro -o dppc128_whole.gro -pbc mol -ur compact
</code></pre>

<p>现在查看下这个.gro文件的最后一行, 它对应于DPPC单位晶胞的x/y/z盒向量. 我们需要在相同的坐标系内调整KALP多肽的取向, 并将多肽的质心置于盒子的中心:</p>

<pre><code>gmx editconf -f KALP-15_processed.gro -o KALP_newbox.gro -c -box 6.41840 6.44350 6.59650
</code></pre>

<p>体系的中心现在位于(3.20920, 3.22175, 3.29825), 每个盒向量的一半处. 这是GROMACS的约定. 注意, 你要模拟的其他体系相对于膜可能并不对称, 因此上面的命令必须修改成类似下面的样子:</p>

<pre><code>gmx editconf -f protein.gro -o protein_newbox.gro -box (membrane box vectors) -center x y z
</code></pre>

<p>在上面的命令中, <code>x y z</code>代表蛋白质合理放置的质心. 放置必须基于膜位置的实验知识, 或者基于对特定蛋白化学组分的直觉.</p>

### 2. 在蛋白四周堆积脂分子

<p>目前我发现, 围绕嵌入蛋白质堆积脂分子的最简单方法是InflateGRO方法(<a href="http://dx.doi.org/10.1016/j.ymeth.2006.08.006">参考文献</a>), 你可以在<a href="/GMX/GMXtut-2_inflategro.txt">这里</a>下载脚本. <strong>请注意</strong>, 我发布的代码是我自己保存的InflateGRO原始版本的副本, 而 <strong>不是</strong> 来自作者的InflateGRO2. 下载上面链接中的文件, 将其重命名为<code>inflategro.pl</code>再继续. 首先, 整合蛋白质和双脂层的结构文件:</p>

<pre><code>cat KALP_newbox.gro dppc128_whole.gro &gt; system.gro
</code></pre>

<p>移除不需要的行(来自KALP结构的盒向量, 来自DPPC结构的标题信息), 并相应地更新坐标文件的第二行(总原子数).</p>

<p>InflateGRO脚本的作者建议对蛋白质的重原子使用非常强的位置限制力, 以保证在EM过程中蛋白质的位置不发生改变. 在拓扑中添加新的<code>#ifdef</code>语句, 调用特殊的位置限制, 这样你的拓扑现在就包含类似下面的部分:</p>

<pre><code>; Include Position restraint file
#ifdef POSRES
#include &quot;posre.itp&quot;
#endif

; Strong position restraints for InflateGRO
#ifdef STRONG_POSRES
#include &quot;strong_posre.itp&quot;
#endif

; Include DPPC chain topology
#include &quot;dppc.itp&quot;

; Include water topology
#include &quot;gromos53a6_lipid.ff/spc.itp&quot;
</code></pre>

<p>现在就可以使用<code>gmx genrestr</code>生成新的位置限制文件:</p>

<pre><code>gmx genrestr -f KALP_newbox.gro -o strong_posre.itp -fc 100000 100000 100000
</code></pre>

<p>在用于能量最小化的.mdp文件中, 添加一行<code>define = -DSTRONG_POSRES</code>以保证使用这些新的位置限制. 然后, 简单地按照InflateGRO的指示(包含在脚本自身中)做, 过程很简单. 对脂分子的位置使用因子4进行缩放:</p>

<pre><code>perl inflategro.pl system.gro 4 DPPC 14 system_inflated.gro 5 area.dat
</code></pre>

<p>由于InflateGRO脚本对命令行变量顺序的要求非常严格, 这里需要给出一个简略的说明:</p>

<ol>
<li><code>system.gro</code> - 将要施加缩放的输入坐标文件的名称</li>
<li><code>4</code> - 施加的缩放因子, 值&gt;1表示扩增, 值&lt;1表示收缩/压缩</li>
<li><code>DPPC</code> - 施加缩放的脂分子的残基名称</li>
<li><code>14</code> - 搜索脂分子的截断半径(单位为Å), 处于此半径内的脂分子会被删除</li>
<li><code>system_inflated.gro</code> - 输出文件的名称</li>
<li><code>5</code> - 计算每个脂分子面积时所用的格点间距(单位为Å)</li>
<li><code>area.dat</code> - 输出文件, 包含每个脂分子的面积信息, 对确定结构是否合适很有帮助</li>
</ol>

<p>记下删除了多少脂分子, 并相应地更新拓扑文件中<code>[ molecules ]</code>部分的内容. 运行能量最小化. 然后, 使用因子0.95收缩脂分子(假定你使用了默认的名称, 能量最小化的结果文件为<code>confout.gro</code>):</p>

<pre><code>perl inflategro.pl confout.gro 0.95 DPPC 0 system_shrink1.gro 5 area_shrink1.dat
</code></pre>

<p>按照上面的步骤进行另一个EM. 在收缩步骤中, 确保将截断值更改为0, 否则你需要继续删除脂分子! 使用0.95进行26次收缩迭代后, 我得到的脂分子面积约71 Å<sup>2</sup>, 比实验值约62 Å<sup>2</sup>略高. 由于脚本倾向于高估脂分子的面积, 这个值已经足够好, 可以继续进行平衡了.</p>

### 3. 使用水进行溶剂化

<p>使用<code>gmx solvate</code>对蛋白质进行溶剂化是个简单的工作. 对膜蛋白体系进行溶剂化并不是那么简单, 因为<code>gmx solvate</code>倾向于使用随机水分子填充脂分子酰基链中的间隙. 我发现溶剂化膜体系的最快捷办法是: 在本地创建一个<code>vdwradii.dat</code>文件的副本, 并将C的值从0.15改为0.375. 这样<code>gmx solvate</code>会将碳原子的范德华半径指定为一个很大的虚假值, 从而在脂分子中添加的水更少. 溶剂化后, 检查你的结构, 确保双脂层的憎水核内没有水分子. 如果仍然有一些零星的水分子, 你可以手动删除它们, 继续调整碳原子的范德华半径, 或是使用GROMACS网站上的<a href="http://www.gromacs.org/Documentation/How-tos/Membrane_Simulations">一个脚本</a>.</p>

<p>需要小心的是, 使用大的碳原子半径可能会在蛋白质周围产生虚假的空隙, 它们突出于膜(因为它们也含有碳原子)以及脂分子的头基(如果它们含有碳原子, 即PC, PE等). 在平衡过程中这些空隙需要更细致的处理. 在继续前请删掉<code>vdwradii.dat</code>文件的本地副本.</p>

## 第四步: 添加离子

<p>现在我们已经对溶剂进行了溶剂化, 是时候添加用于中和的抗衡离子了. 在这一步, 继续构建体系的过程几乎与<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2">溶菌酶教程</a>中的完全相同, 使用的.mdp文件可以在<a href="/GMX/GMXtut-2_ions.mdp">这里</a>下载</p>

<pre><code>gmx grompp -f ions.mdp -c system_solv.gro -p topol.top -o ions.tpr
</code></pre>

<p>由于KALP<sub>15</sub>多肽包含4个赖氨酸(Lysine)残基, 在生理pH条件下带+4 e的净电荷. 使用<code>gmx genion</code>添加4个CL-离子来中和电荷:</p>

<pre><code>gmx genion -s ions.tpr -o system_solv_ions.gro -p topol.top -pname NA -nname CL -nn 4
</code></pre>

<p>添加离子后的体系如下图:</p>

<figure>
<img src="/GMX/GMXtut-2_kalp15_dppc.jpg" alt="" />
<figcaption></figcaption></figure>

## 第五步: 能量最小化

<p>这一步与任何其他模拟类似. 利用<a href="/GMX/GMXtut-2_minim.mdp">这个</a>输入参数文件, 使用<code>gmx grompp</code>整合二进制输入:</p>

<pre><code>gmx grompp -f minim.mdp -c system_solv_ions.gro -p topol.top -o em.tpr
</code></pre>

<p>运行<code>gmx mdrun</code>:</p>

<pre><code>gmx mdrun -v -deffnm em
</code></pre>

<p>与任何其他模拟一样, 继续前请确认E<sub>pot</sub>和F<sub>max</sub>的值合理. 膜蛋白体系模拟有一定的技巧性. 因为有许多潜在的问题. 如果你的体系不收敛, 请考虑下面的几个因素:</p>

<ol>
<li><p>头基内部的氢键, 如PE或PG头基中的. 有时模拟崩溃是因为头基自身会在溶剂的空隙中发生折叠. 针对这个问题, 有一些解决方法(你也可能遇到其他的一些解决方法):</p>

<ul>
<li>在平衡中使用位置限制或冻结组, 直到脂分子头基周围的溶剂优化好</li>
<li>减小H原子的电荷(如果需要, 全设为0). <strong>继续前请恢复电荷</strong></li>
<li>将H原子和磷酸盐的O原子添加到拓扑的<code>[ exclusions ]</code>中. <strong>继续前请移除些排除项</strong></li>
</ul></li>
<li><p>在堆积过程中酰基链可能发生重叠. 小心运行InflateGRO, 不要试图过多地堆积脂分子.</p></li>
<li><p>蛋白和脂分子可能发生重叠. 在初始的InflateGRO步骤中你选择的截断值是否合适?</p></li>
<li><p>水和头基以及离子和头基的重叠. 有时<code>gmx genbox</code>和<code>gmx genion</code>不够智能, 特别是随机放置离子时. CL-靠近磷酸盐可能会使离子(或脂分子)猛冲穿过模拟盒子!</p></li>
</ol>

<p>现在我们的体系已经处于一个能量极小点了, 可以开始真正的动力学了.</p>

## 第六步: NVT平衡

<p>平衡过程与溶剂化蛋白质的情况非常相似. 通常会先进行一个短时间的NVT平衡, 然后再进行稍长时间的NPT平衡. 采取这种过程是因为我们现在处理的是一个非均相体系, 水和DPPC都作为溶剂, 这样就要求稍长时间的平衡过程. 在脂分子头基以及蛋白质暴露的部分周围, 水分子必须进行重取向, 脂分子自身在蛋白质周围也必须调整取向. 这些过程需要一定的时间, 脂分子的平衡可能需要几ns的模拟时间.</p>

<p>对膜蛋白模拟, 我们需要创建特殊的索引组, 包含溶剂+离子, 蛋白质+脂分子(下面会解释). 为此, 使用<code>gmx make_ndx</code>:</p>

<pre><code>gmx make_ndx -f em.gro -o index.ndx
</code></pre>

<p>提示选择时, 输入<code>16|14</code>来合并<code>SOL</code>和<code>CL</code>组, 新组的名称默认为<code>SOL_CL</code>.</p>

<p>提示时输入<code>1|13</code>来合并<code>Protein</code>和<code>DPPC</code>组. 这个组将用于移除质心运动(马上就会进行说明).</p>

<p>再次启动NVT(使用<a href="/GMX/GMXtut-2_nvt.mdp">这个</a>.mdp文件), 像EM步一样调用<code>gmx grompp</code>和<code>gmx mdrun</code></p>

<pre><code>gmx grompp -f nvt.mdp -c em.gro -p topol.top -n index.ndx -o nvt.tpr

gmx mdrun -deffnm nvt
</code></pre>

<p>我们使用的大多数参数都与<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2">溶菌酶教程</a>中的相同, 除了下面几个:</p>

<ul>
<li><code>rcoulomb, rvdw = 1.2</code>: 对静电和范德华相互作用, 我们使用1.2 nm的短程截断, 这是为了提供计算效率. 截断导致的误差将通过使用PME(对长程静电)和色散校正(对范德华项)来校正. 在任何情况下, 用户都需要说明所有设置的有效性.</li>
<li><code>ref_t, gen_temp = 323</code>: 我们使用的温度不惜高于脂分子的相转变温度. 对DPPC, 通常使用323 K.</li>
<li><code>tc-grps = Protein DPPC SOL_CL</code>: 为提高精确度, 每个组单独耦合. 对水溶液中的蛋白, 我们指定<code>Protein Non-Protein</code>, 其中的<code>Non-Protein</code>包含溶剂和离子. 对膜蛋白, <code>Non-Protein</code>也包含脂分子, 因此我们必须明确地将脂分子和水溶剂分开, 各自进行单独的耦合. <strong>不要</strong> 将离子与溶剂分开进行单独的耦合, 仅含离子的组没有足够的自由度, 不能列为单独的温度耦合组.</li>
<li>附属于质心(COM)移除的新节. 由于界面体系(即膜水体系)会倾向于侧向运动, 双脂层质心的运动和溶剂质心的运动必须分开重置, 否则不同的相会沿相反方向漂移, 这样体系总的质心不会改变, 但仍存在虚假运动. 注意, 我们的<code>comm-grps</code>包含<code>Protein_DPPC</code>, 由于蛋白嵌在膜中, 是膜的重要组成部分. 单独移除它的质心运动可能导致虚假的碰撞. 处于这个原因, 对水中的蛋白, 我们不会为单独的组移除质心运动, 在这些体系中扩散发生在三个维度. 在双脂层中, 运动大部分局限于二维.</li>
</ul>

<p>在继续前, 再次使用<code>gmx engergy</code>确认体系的温度稳定在323 K. 温度的选择应基于脂分子的物理性质, 其中最重要的是相转变温度. 下面是从文献中搜集的一些有用数据, 包括脂分子的面积, 相转变温度, 和/或各种脂分子参数的得出方法. 请阅读参考文献并理解其含义. 这个列表并不完整, 参考列给出了文献中的例子, 其中的各种脂分子被用于模拟或实验工作. 用户应调查这些工作中的引用, 或引用这些工作的后续论文. 这个列表也 <strong>不</strong> 应该看作是完备的, 因为已经成功模拟了许多其他的脂分子. 这里给出的只是很常见的一些.</p>

<table><caption></caption>
<tr>
<th style="text-align:center;">脂分子名称</th>
<th style="text-align:center;">脂分子面积(Å<sup>2</sup>)</th>
<th style="text-align:center;">相转变温度(K)</th>
<th style="text-align:center;">参考</th>
</tr>
<tr>
<td style="text-align:center;">DPPC</td>
<td style="text-align:center;">62.9-64</td>
<td style="text-align:center;">315</td>
<td style="text-align:left;">J. Nagle (1993) Biophys. J. 64: 1476</td>
</tr>
<tr>
<td style="text-align:center;">DMPC</td>
<td style="text-align:center;">60.6</td>
<td style="text-align:center;">297</td>
<td style="text-align:left;">Wohlert and Edholm (2006) J. Chem. Phys. 125: 204703</td>
</tr>
<tr>
<td style="text-align:center;">POPG</td>
<td style="text-align:center;">53</td>
<td style="text-align:center;">269</td>
<td style="text-align:left;">Dickey and Faller (2008) Biophys. J. 95: 2636</td>
</tr>
<tr>
<td style="text-align:center;">POPA</td>
<td style="text-align:center;">51-52</td>
<td style="text-align:center;">301</td>
<td style="text-align:left;">Dickey and Faller (2008) Biophys. J. 95: 2636</td>
</tr>
<tr>
<td style="text-align:center;">POPC</td>
<td style="text-align:center;">65.8</td>
<td style="text-align:center;">271</td>
<td style="text-align:left;">Tieleman, et al. (1998) Biochem. 37: 17554</td>
</tr>
<tr>
<td style="text-align:center;">POPE</td>
<td style="text-align:center;">56</td>
<td style="text-align:center;">298</td>
<td style="text-align:left;">Tieleman, et al. (1998) Biochem. 37: 17554</td>
</tr>
<tr>
<td style="text-align:center;">DMTAP</td>
<td style="text-align:center;">71</td>
<td style="text-align:center;">310</td>
<td style="text-align:left;">Gurtovenko, et al. (2004) Biophys. J. 86: 3461</td>
</tr>
<tr>
<td style="text-align:center;">POPS</td>
<td style="text-align:center;">55</td>
<td style="text-align:center;">300</td>
<td style="text-align:left;">Mukhopadhyay, et al. (2004) Biophys. J. 86: 1601</td>
</tr>
</table>

<p>你的体系出现问题了? 平衡中体系崩溃了? 请参看<a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/membrane_protein/advanced_troubleshooting.html">Advanced Troubleshooting</a>页面.</p>

## 第七步: NPT平衡

<p>现在温度已经稳定了, 我们必须对压力进行平衡. 膜蛋白体系的NPT平衡阶段通常长于简单的蛋白质水溶液, 这还是由于体系的非均匀性. 这里, 我们将构建一个1 ns的NPT平衡, 你可以在<a href="/GMX/GMXtut-2_npt.mdp">这里</a>下载使用的.mdp文件.</p>

<p>这个.mdp文件中有几项更改值得指出:</p>

<ul>
<li><code>tcoupl = Nose-Hoover</code>: 在膜体系的模拟中广泛使用Nosé-Hoover热浴, 因为它能产生正确的运动系综, 并且涨落产生的动力学更自然. Nosé-Hoover热浴对NVT平衡并不合适, 因为它允许非常大的涨落. 通常会以<code>Berendsen</code>或<code>V-rescale</code>热浴开始, 然后在NPT或成品MD的开始再换成Nosé-Hoover热浴.</li>
<li><code>pcoupltype = semiisotropic</code>: 均匀压力缩放(<code>isotropic</code>)对膜体系并不适合. 双脂层在xy平面应该可以变形, 而与z轴无关. 你也可以对膜体系使用<code>anisotropic</code>压力耦合, 但需要小心的是, 在模拟进行了很多步后盒向量可能会变得歪斜.</li>
<li>现在使用两个值指定压缩率和<code>ref_p</code>, 分别对应于xy方向和z方向的值.</li>
</ul>

<p>现在, 像通常那样使用<code>gmx grompp</code>和<code>gmx mdrun</code>. 由于将进行1 ns的模拟, 最好在集群上并行运行. 注意, GROMACS 4.5引入了线程并行, 这意味着, 在一个多核工作站上, 不需要额外的MPI库. 对网络连接的集群, 仍然需要MPI进行节点间的通讯.</p>

<pre><code>gmx grompp -f npt.mdp -c nvt.gro -t nvt.cpt -p topol.top -n index.ndx -o npt.tpr
</code></pre>

<p>在一个多核工作站上, 你可以使用下面的命令, 其中<code>X</code>对应于所用机器的物理核数:</p>

<pre><code>gmx mdrun -nt X -deffnm npt
</code></pre>

<p>再次使用<code>gmx energy</code>分析压力的变化. 确认盒向量已经稳定, 确保膜具有稳定的侧向面积, 也是明智的.</p>

## 第八步: 成品MD

<p>完成了两个阶段的平衡后, 体系已经在需要的温度和压力下平衡好了, 我们现在可以放开位置限制并运行成品MD收集数据了. 这个过程和我们以前见到的非常类似. 我们将运行1 ns的MD模拟, 相应的.mdp文件你可以在<a href="/GMX/GMXtut-2_md.mdp">这里</a>下载.</p>

<pre><code>gmx grompp -f md.mdp -c npt.gro -t npt.cpt -p topol.top -n index.ndx -o md_0_1.tpr
</code></pre>

<p>在上面命令输出的接近结束处, 你可能会看到类似下面的行:</p>

<pre><code>Estimate for the relative computational load of the PME mesh part: 0.26
</code></pre>

<p>我们已经定义好的参数对PP:PME比例平衡得足够好, 这样我们可以使用3:1的PP:PME节点比.</p>

<p>再次, 并行运行<code>gmx mdrun</code>:</p>

<p>gmx mdrun -nt X -deffnm md_0_1</p>

<p>模拟运行1 ns后要继续运行, 可以使用GROMACS的检查点文件功能, 详情请参考<a href="http://www.gromacs.org/Documentation/How-tos/Extending_Simulations">GROMACS的网页</a>.</p>

## 第九步: 分析

<p>对膜蛋白体系, 有几种类型的分析非常有用, 这里给出一个简略的说明. 下面是一些可能感兴趣的参数:</p>

<ol>
<li>酰基的氘代序参量</li>
<li>膜的密度</li>
<li>每个脂分子头基的面积</li>
<li>双脂层的厚度(垂直方向)</li>
<li>脂分子的侧向扩散</li>
</ol>

<p>也可以考虑其他的一些分析, 如多肽的二级结构, RMSD, P-N向量的取向, 螺旋的倾斜等等. 这些分析中的大部分都需要使用特定的索引组, 它们可以利用<code>gmx make_ndx</code>来创建.</p>

### 1. 氘代序参量

<p>对氘代序参量分析, 你需要一个索引组, 其中 <strong>仅</strong> 包含沿脂分子酰基链的碳原子, 必须对每条链进行单独分析!</p>

<p>执行下面的命令:</p>

<pre><code>make_ndx -f md_0_1.tpr -o sn1.ndx
</code></pre>

<p>提示时输入类似下面的内容(<code>&gt;</code>为提示符):</p>

<pre><code>...
 &gt; a C34
 &gt; a C36
 &gt; a C37
 &gt; a C38
...
 &gt; a C50
 &gt; del 0-21
 &gt; q
</code></pre>

<p>利用上面的命令, 通过使用酰基链中碳原子的特定原子名称, 匹配一条脂分子链中的所有原子, 我们对DPPC的<code>sn-1</code>链创建了一个索引组. 然后我们删除了所有不需要的组(<code>del 0-21</code>). 应对<code>sn-2</code>链重复这一过程(<code>sn2.ndx</code>包含碳原子C15, C17-C31).</p>

<p>为得到双脂层沿z轴法向的氘代序参量, 可使用GROMACS的<code>gmx order</code>模块:</p>

<pre><code>gmx order -s md_0_1.tpr -f md_0_1.xtc -n sn1.ndx -d z -od deuter_sn1.xvg
</code></pre>

<p>氘代序参量可用于确认你的膜体系在模拟中是否转变为凝胶状态.</p>

### 2. 膜的密度

<p>通常, 分析膜密度时会将其分解为几个不同的组: 脂分子头基, 酰基链(有时还会进一步分解为甘油, 亚甲基和顶端的甲基), 蛋白质和溶剂. 后面两个组是标准组, 不需要特殊的处理. 脂分子头基和DPPC酰基链的索引组可使用下面的方法创建:</p>

<pre><code>gmx make_ndx -f md_0_1.tpr -o density_groups.ndx
...
 &gt; 12 &amp; a C1 | a C2 | a C3 | a N4 | ... | a O11
 &gt; name 22 Headgroups
 &gt; 12 &amp; a C12 | a C13 | a O14 | ... | a C50
 &gt; name 23 Tails
 &gt; q
</code></pre>

<p>现在使用<code>gmx density</code>模块单独分析每个组(注意, 索引文件中已经包含了<code>Protein</code>和<code>SOL</code>组):</p>

<pre><code>gmx density -s md_0_1.tpr -f md_0_1.xtc -n density_groups.ndx -o headgroups.xvg -d Z
</code></pre>

<p>对要分析的其他组重复上面的过程.</p>

### 3.和4. 脂分子头基的面积以及脂层的厚度

<p>在有膜蛋白的情况下, GROMACS没有提供计算脂分子头基面积的工具. 对纯的膜体系, 每个脂分子的头基面积为<code>(Box-X * Box-Y)/(# of lipids)</code>, 也就是盒子XY截面的面积除以脂分子的数目. 使用<code>gmx energy</code>可以很容易地从.edr文件中抽取盒向量. 当膜中存在嵌入的蛋白质时, 如KALP<sub>15</sub>, 蛋白质会占据多少空间? 我们开发了一个程序<a href="http://www.bevanlab.biochem.vt.edu/GridMAT-MD/index.html">GridMAT-MD</a>来解决这个问题, 它可以计算每个脂分子头基的面积, 以及作为穿过2D双脂层平面投影的双脂层厚度(<a href="http://dx.doi.org/10.1002/jcc.21172">参考文献</a>).</p>

### 5. 脂分子的侧向扩散

<p>GROMACS提供了<code>gmx msd</code>模块, 可用以计算扩散系数. 这个模块的一个扩展功能是用于计算侧向扩散. 要执行<code>gmx msd</code>, 你需要为每个脂分子选择一个参考原子, 通常选DPPC头基的P8. 为这些原子创建一个索引组:</p>

<pre><code>gmx make_ndx -f md_0_1.tpr -o p8.ndx
...
 &gt; a P8
 &gt; q
</code></pre>

<p>然后, 执行</p>

<pre><code>gmx msd -s md_0_1.tpr -f md_0_1.xtc -n p8.ndx -lateral z
</code></pre>

## 总结

<p>希望你已经成功地创建了一个简单的膜蛋白体系并进行了模拟. 需要注意的是, 1 ns的模拟对任何体系来说都太短了, 对膜蛋白更是如此. 脂分子的平衡时间可达50&#8211;100 ns. 本教程中使用的模拟时间步数只是用于演示, 所得的数据可能没有物理意义, 因为模拟时间太短了. 这里提供的.mdp文件仅仅用作示例, 不能简单地用于所有体系. 请根据文献以及GROMACS手册对这些文件进行调整, 以便提高计算的效率与精确度.</p>

<p><strong>请注意</strong>, 最近的研究显示, GROMOS96 53A6力场会降低α螺旋的稳定性. 也就是说, 如果你对本教程中的体系模拟足够长的时间, 多肽将会去折叠. 更近的53A7参数集已经修正了这一乱真行为. 我写这篇教程是在53A6的缺陷被发现前, 已经有很长时间了, 但我仍然认为这一教程可以作为一个很有用的例子. Berger脂参数与GROMOS96参数集的联合使用仍然是一个有效的方法, 只要你了解蛋白质力场的可能问题.</p>

<p>如果你对改进这个教程有些建议, 如果你发现了错误, 或者你觉得有些地方不够清楚, 请给我发邮件<code>jalemkul@vt.edu</code>, 不要客气. 请注意: 这不是邀请你因为GROMACS的问题而给我发邮件. 我并不是作为一个私人家教或个人客服在为自己打广告. 那是<a href="http://lists.gromacs.org/mailman/listinfo/gmx-users">GROMACS用户邮件列表</a>的事. 我可能会在那里帮助你, 但那只是作为对整个社区的服务, 而不只针对最终用户.</p>

<p>祝你模拟愉快!</p>
