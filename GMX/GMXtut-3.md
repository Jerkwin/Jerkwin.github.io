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


<ul>
<li>翻译: 付自豪; 校对: 刘恒江; 统稿: 李继存</li>
</ul>

<figure>
<img src="/GMX/GMXtut-3_pull_start.png" alt="" />
<figcaption></figcaption></figure>


## 概述

<p>本教程将指导用户设置和运行牵引模拟, 并进而计算两个物种之间的结合能. 本教程假定用户已经成功地完成了<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2">溶菌酶教程</a>以及其他的一些教程. 否则的话, 用户需要对GROMACS模拟方法和拓扑组织的基础知识非常熟悉. 在本教程中, 我们特别关注正确创建体系的方法以及牵引代码的设置.</p>

<p>结合能(<span class="math">\(\D G_\text{bind}\)</span>)可由一系列伞形采样模拟得到的平均力势(PMF, potential of mean force)导出. 在这个过程中会创建一系列初始构型, 每个构型与一个位置相对应, 其中待研究分子(通常称为&#8220;配体&#8221;)处于简谐势限制下, 与参考分子质量中心(COM)之间的距离借助伞形偏离势而逐渐增加. 这种限制可以使配体对构型空间中指定的区域进行采样, 采样沿它和参考分子或者结合部分之间的反应坐标进行. 为了能正确地重建PMF曲线, 采样窗口必须使配体位置有适当的重叠.</p>

<p>整个过程(本教程使用)的步骤如下:</p>

<ol>
<li>沿单个自由度(反应坐标)产生一系列构型</li>
<li>从步骤1的轨迹中筛选出对应于所需COM间隔的构型</li>
<li>对每一构型运行伞形采样模拟, 并将其限制于对应选定COM距离的窗口中</li>
<li>使用加权直方图分析方法(WHAM, Weighted Histogram Analysis Method)得到PMF并计算 <span class="math">\(\D G_\text{bind}\)</span></li>
</ol>

<p>本教程建议读者使用GROMACS 5.1或以上版本. 原教程(工作流程根据它得到)基于4.0.5版本, 但原则上可以用于4.0.x和4.5.x系列的任何版本. GROMACS 3.3.3版本后, 完全重写了牵引代码并进行了彻底的检查(以非常有益的方式), 这样这里所包含的信息(除相关技术的基础理论外)不再适用于GROMACS 5.1以下的版本.</p>

## 第一步: 准备拓扑文件

<p>创建一个用于伞形采样模拟的分子拓扑所用的方法与其他模拟一样. 首先获得待研究分子结构的坐标文件, 然后使用<code>gmx pdb2gmx</code>生成拓扑. 一些体系需要特别考虑(例如蛋白质-配体复合物, 膜蛋白等等). 对于蛋白-配体体系, 请查阅这个<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.6">教程</a>, 对于膜蛋白, 我推荐参考这个<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.3">教程</a>. 伞形采样的原则可以很容易地拓展到这些体系, 虽然在本教程中我们仅考虑蛋白质分子.</p>

<p>在本教程中我们所考虑的体系为单个多肽从Aβ<sub>42</sub>原丝纤维生长端的分离, 它基于我们最近发表的一篇<a href="http://pubs.acs.org/doi/abs/10.1021/jp9110794">论文</a>, 用于模拟所用的野生型Aβ<sub>42</sub>原丝纤维的结构文件可以在<a href="GMXtut-3_input.pdb">这里</a>下载, 其中每条链的N末端已进行了乙酰化. 原始的PDB登记代码为<a href="http://www.rcsb.org/pdb/explore/explore.do?structureId=2BEG">2BEG</a>.</p>

<p>使用<code>gmx pdb2gmx</code>处理结构:</p>

<pre><code>gmx pdb2gmx -f input.pdb -ignh -ter -o complex.gro
</code></pre>

<p>选择<code>GROMOS96 53A6</code>参数集, 对N末端选择<code>None</code>, C末端选择<code>COO-</code>. 在<code>topol_Protein_chain_B.itp</code>文件的末尾加上下面几行:</p>

<pre><code>#ifdef POSRES_B
#include &quot;posre_Protein_chain_B.itp&quot;
#endif
</code></pre>

<p>在之后的牵引模拟中, 我们会用链B作为固定参考, 因此需要特别限制此链的位置, 而不限定其他.</p>

## 第二步: 定义单元晶胞

<p>用于伞形采样的单元晶胞的定义方式不同于其他模拟. 主要考虑的一点是, 在牵引方向上必须要有足够的空间以保证牵引的连续, 同时又不能与体系的周期性映象相作用. 也就是, 在牵引进行的过程中, 最小映象约定必须一直满足, 同时, 牵引的距离必须始终小于牵引方向盒子矢量长度的一半. 你可能会问, 为什么?</p>

<p>GROMACS计算距离时, 会同时考虑周期性. 这意味着, 如果你有一个10 nm的盒子, 当牵引距离超过5.0 nm时, 周期性距离变成了牵引的参考距离, 这个距离其实小于5.0 nm! 这个事实会严重影响结果, 因为你 <strong>认为</strong> 的牵引距离并不是 <strong>实际</strong> 计算的距离.</p>

<p>为了避免上述复杂情况, 我们将在一个12.0 nm的盒子中进行总距离为5.0 nm的牵引. 在6.560 x 4.362 x 12 nm<sup>3</sup>的盒子中, 原丝纤维的质心位于(3.280, 2.181, 2.4775). 使用<code>gmx editconf</code>将原丝纤维置于这个位置:</p>

<pre><code>gmx editconf -f complex.gro -o newbox.gro -center 3.280 2.181 2.4775 -box 6.560 4.362 12
</code></pre>

<p>你可以使用一些可视化软件, 如VMD来查看原丝纤维在盒子中的位置. 在VMD中载入结构, 然后打开Tk控制台, 键入以下内容(注意: <code>&gt;</code>为Tk的提示符, 并非实际输入):</p>

<pre><code>&gt; pbc box
</code></pre>

<p>在VMD的窗口中, 你会看到类似下面的图:</p>

<figure>
<img src="/GMX/GMXtut-3_box.jpg" alt="" />
<figcaption></figcaption></figure>

## 第三步: 添加溶剂和离子

<p>这一步骤与其他模拟类似, 如果不确定的话, 你可以参考<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2">溶菌酶教程</a>以获得更多细节. 首先, 我们使用<code>gmx solvate</code>添加水:</p>

<pre><code>gmx solvate -cp newbox.gro -cs spc216.gro -o solv.gro -p topol.top
</code></pre>

<p>然后, 我们使用<code>gmx genion</code>, 并利用这个<a href="GMXtut-3_ions.mdp">.mdp文件</a>添加离子. 我们将会在100 mM(mmol/L)的NaCl溶液中运行模拟, 并添加相应的离子以中和抗衡离子:</p>

<pre><code>gmx grompp -f ions.mdp -c solv.gro -p topol.top -o ions.tpr
gmx genion -s ions.tpr -o solv_ions.gro -p topol.top -pname NA -nname CL -neutral -conc 0.1
</code></pre>

## 第四步: 能量最小化与平衡

<p>能量最小化和平衡步骤与其他任何水中的蛋白质体系一样. 这里, 我们将采用最陡下降法进行最小化, 然后再进行NPT平衡. 你可以在<a href="GMXtut-3_minim.mdp">这里</a>下载用于最小化的.mdp文件, 用于NPT平衡的.mdp文件可以在<a href="GMXtut-3_npt.mdp">这里</a>下载.</p>

<p>启动<code>grompp</code>和<code>mdrun</code>, 像通常一样:</p>

<pre><code>gmx grompp -f minim.mdp -c solv_ions.gro -p topol.top -o em.tpr
gmx mdrun -v -deffnm em
gmx grompp -f npt.mdp -c em.gro -p topol.top -o npt.tpr
gmx mdrun -deffnm npt
</code></pre>

<p>由于这些过程很耗时, 最好并行运行:</p>

<pre><code>gmx mdrun -nt X -deffnm npt
</code></pre>

<p>在上面的命令中, <code>X</code>代表并行运行时使用的线程数.</p>

## 第五步: 生成构型

<p>为了运行伞形采样, 我们必须沿反应坐标 <span class="math">\(\z\)</span> 生成一系列构型. 其中的一些构型将作为伞形采样窗口的初始构型, 并进行独立的模拟. 下图解释了这些原则. 图的上部显示了我们将要运行的牵引模拟, 目的在于产生一系列沿反应坐标的构型, 模拟完成后会抽取这些构型(图片上部和中部之间的虚线箭头). 图的中部对应着每一采样窗口内的独立模拟, 其中使用伞形偏离势将自由多肽的质心限制在窗口中. 图的底部展示了构型直方图的理想结果, 相邻窗口存在重叠, 这样以后就可以从这些模拟得到连续的能量函数.</p>

<figure>
<img src="/GMX/GMXtut-3_umbrella_schematic.jpg" alt="" />
<figcaption></figcaption></figure>

<p>对本教程的例子, 反应坐标为Z轴. 为产生这些构型, 我们必须牵引多肽A, 使其远离原丝纤维. 我们将运行500 ps的牵引MD, 每1 ps保存一张快照. 这一设置是基于试错法(trial-and-error)得到的, 可得到合理的构型分布. 对于其他体系, 保存构型的频率可能需要更高或者更低, 只要足够就好. 关键是沿反应坐标获得足够的构型, 以使伞形采样窗口的间距正常, 窗口间距以多肽A和B的质心距离表示, 其中B为参考组.</p>

<p>牵引过程的.mdp文件可在<a href="GMXtut-3_md_pull.mdp">这里</a>下载. 其中所用牵引选项的简明解释如下:</p>

<pre><code>; Pull code
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
pull_start           = yes        ; 定义大于0的初始质心距离 define initial COM distance &gt; 0
</code></pre>

<p>最近更新的牵引代码允许对不同几何形状, 刚度等同时施加任意数目的反应坐标(通过设置<code>pull_ncoords = N</code>, <code>pull_coord1_*</code>, <code>pull_coord2_*</code>, &#8230; <code>pull_coordN_*</code>). 在本教程中, 只有一个反应坐标, 设置很简单.</p>

<ul>
<li><code>pull = yes</code>: 激活牵引代码, 必须设置为<code>yes</code>以使下面的设置生效</li>
<li><code>pull_ngroups = 2</code>: 有两个组受伞形偏离势作用</li>
<li><code>pull_ncoords = 1</code>: 只有一个反应坐标</li>
<li><code>pull_group1_name = Chain_A</code>: 索引文件中第一个组的名称</li>
<li><code>pull_group2_name = Chain_B</code>: 索引文件中第二个组的名称</li>
<li><code>pull_coord1_type = umbrella</code>: 对第一个反应坐标(此处只有一个反应坐标)使用简谐势进行牵引. <strong>注意</strong>: 这个过程 <strong>不是</strong> 伞形采样. 我使用简谐势是为了定性地观测本研究中的分解途径. 简谐势允许力随着多肽A和B之间的相互作用而变化. 也就是, 这种力将会累加直到某些临界相互作用失效. 请阅读我们的<a href="http://pubs.acs.org/doi/abs/10.1021/jp9110794">论文</a>获得更多细节. 为了产生伞形采样的初始构型, 你实际上可以使用任何牵引设置(<code>pull_coord1_type</code>和<code>pull_coord1_geometry</code>)的组合, 但是当进行真正的伞形采样(下一步骤)时, 你 <strong>必须</strong> 使用<code>pull_coord1_type = umbrella</code>. 尤其重要的是, 你不能施加极快的牵引速率或者极强的力常数, 这会使体系组分严重变形. 请参考<a href="http://pubs.acs.org/doi/abs/10.1021/jp9110794">论文</a>(特别是论文的支撑材料)来看看我们是如何选择合适的牵引速率的.</li>
<li><code>pull_coord1_geometry = distance</code>: 参看.mdp文件中的注释; 你也可以使用<code>direction</code>或<code>direction_periodic</code>, 但必须更改其他牵引参数. 本教程使用的例子相对简单, 若要了解<code>pull_coord1_geometry</code>的更多不同设置, 请参阅<a href="http://jerkwin.github.io/9999/12/31/GROMACS中文手册/">GROMACS手册</a>.</li>
<li><code>pull_coord1_groups = 1 2</code>: 由组1和组2(其名称分别为<code>Chain_B</code>和<code>Chain_A</code>)定义反应坐标</li>
<li><code>pull_coord1_dim = N N Y</code>: 仅沿Z轴方向牵引, 所以X, Y方向设置为<code>N</code>(no), Z方向设置为<code>Y</code>(yes)</li>
<li><code>pull_coord1_rate = 0.01</code>: 附着于牵引组的&#8220;哑粒子&#8221;的移动速率. 这一类型的牵引也被称为匀速牵引, 因为牵引速度固定</li>
<li><code>pull_coord1_k = 1000</code>: 牵引的力常数</li>
<li><code>pull_start = yes</code>: 初始的COM距离为第一帧的参考距离. 这样设置是有用的, 因为如果我们要牵引5.0 nm, 将初始COM距离转换为0(即<code>pull_start = no</code>)使得解释很困难.</li>
</ul>

<p>还记得以前添加到<code>topol_B.itp</code>文件中的<code>#ifdef POSRES_B</code>语句么? 我们现在要使用它了. 通过限制原丝纤维的多肽B, 我们可以更容易地牵引多肽A. 由于链A与链B之间大量的非共价键相互作用, 如果我们不限制链B, 我们最终会沿着模拟盒子牵引整个复合物, 这不能很好地达到目的.</p>

<p>我们需要定义一些索引组用于牵引模拟, 使用<code>gmx make_ndx</code>:</p>

<pre><code>gmx make_ndx -f npt.gro
(&gt;为make_ndx的提示符)
&gt; r 1-27
&gt; name 19 Chain_A
&gt; r 28-54
&gt; name 20 Chain_B
&gt; q
</code></pre>

<p>现在, 运行连续的牵引模拟:</p>

<pre><code>gmx grompp -f md_pull.mdp -c npt.gro -p topol.top -n index.ndx -t npt.cpt -o pull.tpr
gmx mdrun -s pull.tpr
</code></pre>

<p>再次强调, 此过程耗时较长, 如果可以的话请使用并行. 一旦模拟完成, 我们需要抽取定义伞形采样窗口的有用构型. 我发现最简单的方法如下:</p>

<ol>
<li>定义窗口间距(0.1&#8211;0.2 nm)</li>
<li>从刚才得到的牵引轨迹中抽取出所有构型</li>
<li>确定每一构型中参考组和牵引组之间的质心距离</li>
<li>使用选出的构型作为伞形采样的输入</li>
</ol>

<p>使用<code>gmx trjconv</code>从轨迹文件(<code>traj.xtc</code>)中抽取构型(当提示选择的时候, 选<code>group 0</code>以保存整个体系):</p>

<pre><code>gmx trjconv -s pull.tpr -f traj.xtc -o conf.gro -sep
</code></pre>

<p>这会生成一系列坐标文件(<code>conf0.gro</code>, <code>conf1.gro</code>, 等等), 对应于连续牵引模拟中保存的每一构型. 为了对生成的所有构型(501个!)反复地调用<code>gmx distance</code>命令(计算质心距离), 我写了一个简单的Perl脚本来完成这个工作. 它会自动生成包含距离信息的<code>summary_distances.dat</code>文件. 你可以从<a href="GMXtut-3_distances.pl">这里</a>下载这个脚本.</p>

<pre><code>perl distances.pl
</code></pre>

<p>查看<code>summary_distances.dat</code>的内容, 可以看到链A和链B质心间的距离随时间的变化. 根据需要的间距, 记下伞形采样用到的构型. 也就是, 如果你需要0.2 nm的间距, 你可以在<code>summary_distances.dat</code>中寻找下面的行:</p>

<pre><code>50   0.600
...
100  0.800
</code></pre>

<p>然后你可以使用<code>conf50.gro</code>和<code>conf100.gro</code>作为两个相邻伞形采样窗口的初始构型. 在进行下一步之前记下你需要使用的所有构型. 对于本教程, 采用0.2 nm间距的构型足够了, 尽管在原始工作中需要使用不同的间距(更小).</p>

## 第六步: 伞形采样模拟

<p>在这个例子中, 我们将沿Z轴以大约0.2 nm的间距进行采样, 质心距离从0.5 nm变化到5.0 nm. 下面的示例命令可能正确也可能不正确(因为构型编号可能会有差别), 但可以作为一个例子告诉大家如何对独立的坐标文件运行<code>gmx grompp</code>, 以产生全部23个输入文件(也请注意, 当间距为0.2 nm时, 大约4.5 nm的距离需要23个窗口. 在我们的<a href="http://pubs.acs.org/doi/abs/10.1021/jp9110794">原始工作</a>中, 使用了31个非对称窗口).</p>

<p>确定了采样窗口的初始构型之后, 我们现在可以准备伞形采样模拟了. 我们需要产生许多输入文件以运行每个需要的模拟. 例如, 我们已经沿反应坐标确定了23个构型, 这意味着我们要生成23个不同的输入文件并进行23次独立的模拟. 在每个窗口中, 利用这个<a href="GMXtut-3_npt_umbrella.mdp">.mdp文件</a>运行一个简单的NPT平衡模拟作为开始.</p>

<p>首先使用<code>gmx grompp</code>:</p>

<pre><code>gmx grompp -f npt_umbrella.mdp -c conf0.gro -p topol.top -n index.ndx -o npt0.tpr
...
gmx grompp -f npt_umbrella.mdp -c conf450.gro -p topol.top -n index.ndx -o npt22.tpr
</code></pre>

<p>然后使用<code>gmx mdrun</code>:</p>

<pre><code>gmx mdrun -deffnm npt0
…
gmx mdrun -deffnm npt22
</code></pre>

<p>为启动伞形抽样, 还需要对每一个已平衡的构型调用<code>grompp</code>处理此<a href="GMXtut-3_md_umbrella.mdp">.mdp文件</a>. 许多牵引参数与SMD过程中的相同, 除了<code>pull_rate1</code>以外, 它被设置为0. 我们不需要沿反应坐标移动构型, 而是将它限制在构型空间中定义好的窗口内. 设置<code>pull_start = yes</code>意味着初始的质心距离为参考距离, 我们不必对每个构型单独定义一个参考(<code>pull_init1</code>).</p>

<pre><code>gmx grompp -f md_umbrella.mdp -c conf0.gro -p topol.top -n index.ndx -o umbrella0.tpr
...
gmx grompp -f md_umbrella.mdp -c conf450.gro -p topol.top -n index.ndx -o umbrella22.tpr
</code></pre>

<p>现在, 需要使用<code>gmx mdrun</code>运行每个输入文件以进行实际的数据收集模拟. 一旦所有的模拟都完成了, 我们就可以进行数据分析了. 正确执行模拟的一个注意点: 未指定<code>-pf</code>和<code>-px</code>文件名时, 不要使用<code>mdrun</code>的<code>-deffnm</code>选项. 在这种情况下, 使用<code>-deffnm</code>将导致<code>pullf.xvg</code>与<code>pullx.xvg</code>输出到相同的文件(无论<code>-deffnm</code>指定了什么). 使用<code>-pf</code>和<code>-px</code>会覆盖<code>-deffnm</code>选项的设置, 即</p>

<pre><code>gmx mdrun -deffnm umbrella0 -pf pull-umbrella0.xvg -px pullx-umbrella0.xvg
</code></pre>

<p>Mike Harms提供了一个Python脚本, 可自动完成这一过程, 抽取坐标文件, 并设置<code>grompp</code>和<code>mdrun</code>命令. 你可以在<a href="GMXtut-3_setup-umbrella-script.zip">这里</a>下载他的脚本以及一些必要信息. 如果关于此脚本或其使用有什么反馈, 可以<a href="http://www.hotmail.com/secure/start?action=compose&amp;to=harmsm@gmail.com&amp;subject=Umbrella%20sampling%20tutorial%20script">联系Mike</a>. 谢谢Mike的贡献!</p>

## 第七步: 数据分析

<p>对伞形采样模拟而言, 最常见的分析是获取PMF, 并得到结合/解离过程的 <span class="math">\(\D G\)</span>. 简单来说, <span class="math">\(\D G\)</span> 值是PMF曲线最高值和最低值之间的差值, 只要PMF值在大的质心距离处收敛到稳定值. 获得PMF曲线的常见方法是加权直方分析方法(WHAM, Weighted Histogram Analysis Method), 包含在GROMACS的<code>gmx wham</code>工具中. <code>gmx wham</code>的输入文件包括两个, 一个文件中列出了每一窗口模拟的.tpr文件的名称, 另一个文件中列出了每一窗口模拟中得到的<code>pullf.xvg</code>或<code>pullx.xvg</code>文件的名称. 例如, 一个简单的<code>tpr-files.dat</code>文件中可能包含:</p>

<pre><code>umbrella0.tpr
umbrella1.tpr
...
umbrella22.tpr
</code></pre>

<p>文件<code>pullf-files.dat</code>或<code>pullx-files.dat</code>的内容与此类似, 只不过其中列出了<code>pullf.xvg</code>或<code>pullx.xvg</code>文件的名称. 注意文件的名称必须唯一, 相互之间不能重复(如<code>pullf0.xvg</code>, <code>pullf1.xvg</code>, 等等), 否则<code>gmx wham</code>运行会失败. 运行<code>gmx wham</code>:</p>

<pre><code>gmx wham -it tpr-files.dat -if pullf-files.dat -o -hist -unit kCal
</code></pre>

<p><code>gmx wham</code>工具会依次打开每一个<code>umbrella.tpr</code>和<code>pullf.xvg</code>文件, 并对它们进行WHAM分析. <code>-unit kCal</code>选项表明输出单位为kcal/mol, 但你也可以设置为kJ/mol或k<sub>B</sub>T. 注意: 你可能不得不舍去用于平衡的前几百ps轨迹(使用<code>gmx wham -b</code>), 因为我们是从非平衡模拟产生的起始构型. 一旦PMF曲线收敛, 你就会知道体系需要多长时间才能达到平衡. 最后, 你会得到一个<code>profile.xvg</code>文件, 其图形看起来像这样:</p>

<figure>
<img src="/GMX/GMXtut-3_PMF_WT_31windows.jpg" alt="" />
<figcaption></figcaption></figure>

<p>请注意, 你得到的结果可能有所不同, 因为本教程中建议的间距与我之前的原始研究中实际用于生成上图数据所用的间距不同, 并且, 更重要的是, 我论文中的数据是对原丝纤维结构进行100 ns非限制MD平衡后得到的, 其结构实际上与本教程中的有很大不同. 曲线的整体形状应该是类似的, 如果你遵循论文中的流程, <span class="math">\(\D G\)</span> 的值(PMF曲线平台区与曲线能量最小点之间的差)应接近&#8211;50.5 kcal/mol(如上图所示). 如果你遵循本教程中的流程, 得到的值大约为&#8211;37 kcal/mol.</p>

<p><code>gmx wham</code>命令的另一个输出文件为<code>histo.xvg</code>, 其中包含了伞形采样窗口中各个构型的直方图, 这些直方图决定了每个窗口与临近窗口之间是否有足够的重叠. 对于本教程所用的模拟, 得到的图可能类似下面这样:</p>

<figure>
<img src="/GMX/GMXtut-3_histo.jpg" alt="" />
<figcaption></figcaption></figure>

<p>上面的直方图显示了质心距离大约从1.2到5 nm的采样窗口之间的合理重叠, 1 nm处(绿线和蓝线)表明可能需要更多的采样窗口以便根据WHAM算法得到更好的结果. 事实上, 这两个窗口之间的重叠非常小.</p>

## 总结

<p>希望你已经成功地完成了一次伞形采样模拟: 沿反应坐标产生一系列构型, 运行偏离模拟, 并获得PMF. 本教程中提供的.mdp文件只是作为一个示例, 并不能简单地用于所有体系. 请根据文献以及GROMACS手册对这些文件进行调整, 以便提高计算的效率与精确度.</p>

<p>如果你对改进这个教程有些建议, 如果你发现了错误, 或者你觉得有些地方不够清楚, 请给我发邮件<code>jalemkul@vt.edu</code>, 不要客气. 请注意: 这不是邀请你因为GROMACS的问题而给我发邮件. 我并不是作为一个私人家教或个人客服在为自己打广告. 那是<a href="http://lists.gromacs.org/mailman/listinfo/gmx-users">GROMACS用户邮件列表</a>的事. 我可能会在那里帮助你, 但那只是作为对整个社区的服务, 而不只针对最终用户.</p>

<p>祝你模拟愉快!</p>
