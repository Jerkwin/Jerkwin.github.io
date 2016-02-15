---
 layout: post
 title: GROMACS教程：自由能计算: 水中的甲烷
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
<img src="/GMX/GMXtut-6_system.png" alt="" />
<figcaption></figcaption></figure>
## 概述

<p>本教程将指导用户计算一个简单的自由能变化, 中性甲烷与一盒子水之间范德华相互作用的去耦合(即移除). 本教程是<a href="http://www.dillgroup.ucsf.edu/group/wiki/index.php?title=Free_Energy:_Tutorial">David Mobley所写相同教程</a>的升级版本, 我发现他的教程非常有用. 由于那个教程使用的GROMACS版本(3.3.1)与当前版本相比有许多代码发生了变化(包括拓扑处理, .mdp设置和数据分析的不同), 我觉得应在这里提供一个更新后的计算流程.</p>

<p>此教程至少需要使用5.0版本的GROMACS. 由于自由能选项的重大更改, 任何低于5.0版本的GROMACS <strong>都不再适用</strong>.</p>

## 第一步: 理论

<p>本教程假定你已经对自由能计算有了适当的了解: 什么是自由能计算, 存在哪些不同类型的自由能计算, 各种计算技术背后的理论. 要在这里提供一个自由能计算的完整说明既不可能也不可行, 因此, 在本教程中我将仅仅关注使用GROMACS计算自由能的具体实践方面, 并在教程中需要的地方标示出相应的理论知识点. 对那些不熟悉自由能计算的新用户, 我在这里提供一个论文列表, 它们很有用. 不要认为只有这些论文. 这些论文不能替代对统计力学的学习, 许多书与论文对相关主题都有论述.</p>

<ol>
<li>C. D. Christ, A. E. Mark, and W. F. van Gunsteren (2010) <em>J. Comput. Chem.</em> <strong>31</strong>: 1569&#8211;1582. <a href="http://dx.doi.org/10.1002/jcc.21450">DOI</a></li>
<li>A. Pohorille, C. Jarzynski, and C. Chipot (2010) <em>J. Phys. Chem. B</em> <strong>114</strong>: 10235&#8211;10253. <a href="http://dx.doi.org/10.1021/jp102971x">DOI</a></li>
<li>A. Villa and A. E. Mark (2002) <em>J. Comput. Chem.</em> <strong>23</strong>: 548&#8211;553. <a href="http://dx.doi.org/10.1002/jcc.10052">DOI</a></li>
</ol>

<p>本教程的目的在于重复一个非常简单体系的自由能计算结果. 对此体系, 存在非常精确的自由能估计. 所选体系(水中的甲烷)是Shirts等人的研究对象之一, 他们系统地研究了力场, 氨基酸侧链类似物的水合能. 你可以在<a href="http://dx.doi.org/10.1063/1.1587119">这里</a>找到完整的论文. 本教程假定你已经读过并理解了该论文的大致知识点.</p>

<p>与Mobley的教程(以及网上的其他一些教程)中使用的热力学积分方法不同, 本教程使用GROMACS的<code>gmx bar</code>模块分析数据, 它是在GROMACS 4.5版本中引入的(以前称为<code>g_bar</code>), 使用Bennett接受率方法(BAR, Bennett Acceptance Ratio)计算自由能差值. 与BAR对应的论文可以在<a href="http://dx.doi.org/10.1016/0021-9991%2876%2990078-4">这里</a>找到. 本教程假定你已经熟悉有关此方法的知识点, 不再详细讨论.</p>

<p>自由能计算有许多实际应用, 常见的一些包括溶剂化能/水合能, 小分子与一些大的受体生物分子(通常是蛋白质)之间的结合自由能. 这两个过程都涉及从体系中添加(引入/耦合)或移除(去耦合/消除)研究的小分子, 并计算相应的自由能变化.</p>

<p>在自由能计算中, 有两类非键相互作用可以转换, 库伦相互作用与范德华相互作用. GROMACS也可以处理键合相互作用, 但为简单起见, 这里不对其进行讨论. 在本教程中, 我们将计算一个非常简单过程的自由能: 关闭水中待研究分子(这里是甲烷)的原子位点之间的Lennard-Jones相互作用. Shirts等人已经非常精确地计算过这个量, 因此, 我们需要重现它.</p>

## 第二步: 考察拓扑

<p>下载待研究体系的<a href="GMXtut-6_methane_water.gro">坐标文件</a>与<a href="GMXtut-6_topol.top">拓扑文件</a>, 这些文件是David Mobley教程的一部分, 也是前面提到的论文中Michael Shirts使用的原始文件(稍加修改以兼容GROMACS的最近版本).</p>

<p>体系包含一个单独的甲烷分子(坐标文件中的名称为<code>ALAB</code>, 作为甘氨酸的β碳原子), 处于596个TIP3P水分子的盒子中. 查看拓扑文件, 会发现如下内容:</p>

<pre><code>; Topology for methane in TIP3P

#include &quot;oplsaa.ff/forcefield.itp&quot;

[ moleculetype ]
; Name     nrexcl
Methane    3

[ atoms ]
;   nr       type  resnr residue  atom   cgnr   charge   mass  typeB    chargeB  massB
     1   opls_138      1   ALAB     CB      1    0.000   12.011
     2   opls_140      1   ALAB    HB1      2    0.000   1.008
     3   opls_140      1   ALAB    HB2      3    0.000   1.008
     4   opls_140      1   ALAB    HB3      4    0.000   1.008
     5   opls_140      1   ALAB    HB4      5    0.000   1.008

[ bonds ]
;  ai    aj funct   c0   c1   c2   c3
    1     2     1
    1     3     1
    1     4     1
    1     5     1

[ angles ]
;  ai    aj    ak funct   c0   c1   c2   c3
    2     1     3     1
    2     1     4     1
    2     1     5     1
    3     1     4     1
    3     1     5     1
    4     1     5     1

; water topology
#include &quot;oplsaa.ff/tip3p.itp&quot;

[ system ]
; Name
Methane in water

[ molecules ]
; Compound        #mols
Methane           1
SOL               596
</code></pre>

<p>你会注意到, 所有的电荷都设置为零. 这种设置有一个实际的原因, 正常情况下, 在关闭范德华相互作用之前, 会先关闭溶质与水之间的电荷相互作用. 如果仅仅保留电荷相互作用而关闭了Lennard-Jones项, 正负电荷相互接近的距离可能无限小, 导致体系非常不稳定, 并可能崩溃. 本教程的步骤基本假定在此之前已经正确地关闭了电荷项, 我们将只关闭溶质与溶剂分子之间的范德华相互作用.</p>

<p>注意, 在以前版本的GROMACS中, <code>typeB</code>, <code>chargeB</code>和<code>massB</code>头部的内容必须对应于分子的B状态. 自GROMACS 4.0起, 简单的(去)耦合不再需要修改拓扑(极好!), 但对于将一个分子转变为另一个分子的情况, 键合与非键合项可能会发生改变, 这时仍然需要旧式的修改(所谓的&#8220;双拓扑方法&#8221;). GROMACS手册的5.7.4节提供了这种转变的一个例子.</p>

## 第三步: 工作流程

<p>体系从状态A转变到状态B过程的自由能变化 <span class="math">\(\D G_\text{AB}\)</span> 是耦合参数 <span class="math">\(\l\)</span> 的函数, 它代表了状态A和B之间转变的程度, 也就是哈密顿量的微扰程度以及体系已经变化的程度. 利用不同 <span class="math">\(\l\)</span> 对应的模拟可以绘制 <span class="math">\(\partial H/\partial \l\)</span> 曲线, 并由此得到 <span class="math">\(\D G_\text{AB}\)</span>. 自由能计算的第一步是确定使用多少个点描述从状态A(<span class="math">\(\l\)</span> = 0)到状态B(<span class="math">\(\l\)</span> = 1)的转变, 其目的在于收集足够多的数据, 完全充分地对相空间进行取样, 并得到合理的 <span class="math">\(\partial H/\partial \l\)</span> 曲线.</p>
<p>
<img src="/GMX/GMXtut-6_lambda0.png" alt="λ = 0" />
<img src="/GMX/GMXtut-6_lambda0.5.png" alt="λ = 0.5" />
<img src="/GMX/GMXtut-6_lambda1.png" alt="λ = 1" />
<figcaption>λ = 0.5 λ = 0       λ = 1</figcaption>
</p>

<p>库伦相互作用的去耦合线性地依赖于 <span class="math">\(\l\)</span>, 从0到1使用等间距的 <span class="math">\(\l\)</span> 通常就足够了, <span class="math">\(\l\)</span> 间距通常取为0.05&#8211;0.1. 注意这只是个粗略的一般准则, 实际上许多分子需要使用更精密的间距, 例如那些通过氢键与周围环境强烈相互作用的分子. 在这种情况下, 需要减小 <span class="math">\(\l\)</span> 的间距, 这样可以使用更多个点, 甚至可能会使用不对称的取点方式.</p>

<p>对范德华相互作用的去耦合, <span class="math">\(\l\)</span> 间距的设置可能更具技巧性. 由于Shirts等人以及其他地方给出的原因, 可能需要使用大量的 <span class="math">\(\l\)</span> 点以正确地描述转变. 在 <span class="math">\(\partial H/\partial \l\)</span> 曲线斜率较大的区域可能需要使用成簇的 <span class="math">\(\l\)</span>. 对本教程的目的而言, 我们将使用等间距0.05的 <span class="math">\(\l\)</span>. 但在多数情况下, 你可能需要使用不同的间距, 特别是在 <span class="math">\(0.6 \le \l \le 0.8\)</span> 范围内使用成簇的值.</p>

<p>对每一 <span class="math">\(\l\)</span> 值, 必须进行完整的流程(能量最小化, 平衡, 收集数据). 我通常发现, 以批处理的方式运行这些工作, 将一步的输出直接传递给下一步, 这种方式最高效. 使用的工作流程如下:</p>

<ol>
<li>最速下降能量最小化</li>
<li>L-BFGS能量最小化</li>
<li>NVT平衡</li>
<li>NPT平衡</li>
<li>NPT系综的数据收集</li>
</ol>

<p>这里使用了两个能量最小化步骤, 以便对初始结构进行更好的能量最小化. 我发现L-BFGS通常会提前收敛, 得到不稳定的体系, 但与最速下降方法(在找到&#8220;真正&#8221;的能量极小点方面, 它有其自身问题)联用时得到的结果令人满意.</p>

<p>本教程不同步骤(仅用于 <span class="math">\(\l\)</span> =0)使用的.mdp文件见以下链接:</p>

<ul>
<li><a href="GMXtut-6_em_steep.mdp">最速下降能量最小化</a></li>
<li><a href="GMXtut-6_em_l-bfgs.mdp">L-BFGS能量最小化</a></li>
<li><a href="GMXtut-6_nvt.mdp">NVT平衡</a></li>
<li><a href="GMXtut-6_npt.mdp">NPT平衡</a></li>
<li><a href="GMXtut-6_md.mdp">成品MD</a></li>
</ul>

<p>我也准备了两个Perl脚本, <a href="GMXtut-6_write_mdp.pl">write_mdp.pl</a>和<a href="GMXtut-6_write_sh.pl">write_sh.pl</a>, 你可以使用它们快速地创建运行模拟需要的所有输入文件.</p>

<p>你也可以下载一个shell脚本<a href="GMXtut-6_job.sh">job.sh</a>, 根据我给出的工作流程运行模拟作业.</p>

<p>如果你执行</p>

<pre><code>perl write_mdp.pl em_steep.mdp
</code></pre>

<p>会得到名称为<code>em_steep_0.mdp</code>, <code>em_steep_1.mdp</code>, &#8230; <code>em_steep_20.mdp</code>的文件, 文件名中包含了<code>init_lambda_state</code>的相应值. 类似的, 你可以同样的方式得到其余的.mdp文件(<code>em_l-bfgs.mdp</code>, <code>nvt.mdp</code>, <code>npt.mdp</code>和<code>md.mdp</code>).</p>

<p><code>write_sh.pl</code>脚本的工作方式与此相同, 它会为每一<code>init_lambda_state</code>值创建<code>job_*.sh</code>文件, 用以执行工作流程中的命令. 你需要更改<code>$FREE_ENERGY</code>和<code>$MDP</code>的值, 否则运行会出错.</p>

<p><strong>.mdp设置的注记</strong></p>

<p>在继续前, 理解.mdp文件中与自由能相关的设置很重要(以<code>em_steep_0.mdp</code>为例). 对工作流程中的所有步骤, 这些设置都是相同的. 我假定你已经熟悉了.mdp文件中的其他设置. 否则, 在继续前请参阅一些<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.2">更基本的教程</a>.</p>

<ul>
<li><p><code>free_energy = yes</code>: 表示进行自由能计算, 将会进行所选分子(下面定义)从状态A到状态B的内插</p></li>
<li><p><code>init_lambda_state = 0</code>: 以前版本的GROMACS中, <code>init_lambda</code>关键词直接指定单个 <span class="math">\(\l\)</span> 值. 对5.0版本, <span class="math">\(\l\)</span> 现在是一个向量, 可以进行键合与非键相互作用的转变. 使用<code>init_lambda_state</code>关键词, 我们可以指定向量的一个索引号(始于0), 在后面的模拟中会使用此索引号对应的 <span class="math">\(\l\)</span>(后面会解释).</p></li>
<li><p><code>delta_lambda = 0</code>: 每一时间步 <span class="math">\(\l\)</span> 的值都可以有一定的递增量(即 <span class="math">\(\d \l/\d t\)</span>), 这种技术称为&#8220;慢增长&#8221;. 这种方法本身可能会导致显著的误差, 因此我们使用的 <span class="math">\(\l\)</span> 值将不随时间变化.</p></li>
<li><p><code>fep_lambdas = (nothing)</code>: 你会注意到这个关键词没有设定. 在以前版本的GROMACS中, 使用<code>init_lambda</code>和<code>foreign_lambda</code>控制 <span class="math">\(\l_i\)</span> 的值和外部的 <span class="math">\(\l\)</span> 值, 外部的 <span class="math">\(\l\)</span> 值用于计算处于 <span class="math">\(\l_i\)</span> 构型的能量差. 现在不再使用这种做法. 你可以在<code>fep_lambdas</code>关键词中显式地指定 <span class="math">\(\l\)</span> 的值, 但我们可以使用<code>calc_lambda_neighbors</code>关键词(见下)自动决定这些外部 <span class="math">\(\l\)</span> 的值.</p></li>
<li><p><code>calc_lambda_neighbors = 1</code>: 临近窗口的数目, 用于计算相对于 <span class="math">\(\l_i\)</span> 的能量差. 例如, 若<code>init_lambda_state</code>设为10, 使用<code>calc_lambda_neighbors = 1</code>运行时会计算相对于 <span class="math">\(\l\)</span> 状态9和11的能量差.</p></li>
<li><p><code>vdw_lambdas = ...</code>: 用于范德华相互作用转变的 <span class="math">\(\l\)</span> 值的数组</p></li>
<li><p><code>coul_lambdas = ...</code>: 用于库伦(静电)相互作用转变的 <span class="math">\(\l\)</span> 值的数组</p></li>
<li><p><code>bonded_lambdas = ...</code>: 用于键合相互作用转变的 <span class="math">\(\l\)</span> 值的数组</p></li>
<li><p><code>restraint_lambdas = ...</code>: 用于限制相互作用转变的 <span class="math">\(\l\)</span> 值的数组</p></li>
<li><p><code>mass_lambdas = ...</code>: 用于原子质量转变的 <span class="math">\(\l\)</span> 值的数组; 当转变分子的化学本质时会使用.</p></li>
<li><p><code>temperature_lambdas = ...</code>: 用于温度转变的 <span class="math">\(\l\)</span> 值的数组; 仅用于模拟退火</p></li>
<li><p><code>sc-alpha = 0.5</code>: &#8220;软核&#8221;Lennard-Jones方程中使用的 <span class="math">\(\a\)</span> 缩放因子的值. 关于此项以及下面三项的详细说明, 参见GROMACS手册4.5.1节的方程4.124&#8211;4.126.</p></li>
<li><p><code>sc-coul = no</code>: 线性地转变库伦相互作用. 这是默认行为, 给出是为了更清楚.</p></li>
<li><p><code>sc-power = 1.0</code>: 软核方程中 <span class="math">\(\l\)</span> 的次数</p></li>
<li><p><code>sc-sigma = 0.3</code>: 对C6或C12参数为0, 或者 <span class="math">\(\s\)</span> &lt; <code>sc-sigma</code>(典型为H原子)的任意原子类型, 赋给 <span class="math">\(\s\)</span> 的值. 这个值用于软核Lennard-Jones方程.</p></li>
<li><p><code>couple-moltype = Methane</code>: <code>[ moleculetype ]</code>中的名称, 其拓扑会在状态A到状态B之间进行内插. 注意, 这里给出的名称必须与<code>[ moleculetype ]</code>中的相匹配, 不能使用残基名称. 在一些情况下, 这些名称可能相同, 但出于演示的目的, 对<code>[ moleculetype ]</code>及其相关残基我使用了不同的名称.</p></li>
<li><p><code>couple-lambda0 = vdw</code>: 状态A中, 内插<code>[ moleculetype ]</code>和体系其余部分之间的非键相互作用的类型. <code>vdw</code>表示甲烷和水之间只存在范德华项, 不存在溶质溶剂之间的库伦相互作用.</p></li>
<li><p><code>couple-lambda1 = none</code>: 状态B中, 内插<code>[ moleculetype ]</code>和体系其余部分之间的非键相互作用的类型. <code>none</code>表示在状态B中范德华和库伦相互作用都不存在. 相对于<code>couple-lambda0</code>, 这表示只关闭了范德华项.</p></li>
<li><p><code>couple-intramol = no</code>: 不对分子内相互作用进行去耦合. 也就是说, <span class="math">\(\l\)</span> 因子只用于溶质溶剂之间的非键相互作用, 而不用于溶质溶质之间的非键相互作用.<br/>
设置<code>couple-intramol = yes</code>对大分子会有帮助, 在更长的距离处它们可能存在分子内的相互作用(例如多肽或其他聚合物). 否则, 分子的末端部分会通过显式的对相互作用, 以一种不自然的强烈方式相互作用(由于溶质溶剂相互作用作为 <span class="math">\(\l\)</span> 的函数会减弱, 而分子内项不会), 导致构型改变, 以致得到的自由能发生不正确地偏离.</p></li>
<li><p><code>nstdhdl = 10</code>: <span class="math">\(\partial H/\partial \l\)</span> 和 <span class="math">\(\D H\)</span> 输出到<code>dhdl.xvg</code>文件的频率. 使用100可能就足够了, 因为得到的值会高度相关, 文件变得非常大. 对你自己的工作, 你可以将此值增加到100.</p></li>
</ul>

<p>这里使用的.mdp文件中的设置与Shirts等人以及Mobley教程中的有许多不同:</p>

<ol>
<li><code>rlist=rcoulomb=rvdw=1.2</code>. 为使用PME, <code>rlist</code>必须与<code>rcoulomb</code>相同. 在GROMACS 3.3.1版本后, <code>gmx grompp</code>会强制检查这点. 在4.6版本中引入的Verlet截断方案允许使用缓冲近邻列表, 但也要求<code>rvdw</code>=<code>rcoulomb</code>. 为保持能量守恒, 在运行中会调整<code>rlist</code>的值, 这样就对切换范德华相互作用提供了需要的缓冲. 在处理溶质溶剂相互作用时, 切换范围(从1.0到1.2 nm)与Shirts等人使用的一致.</li>
<li>温度耦合使用Langevin活塞方法(通过指定<code>sd</code>积分方法), 而不使用Andersen热浴. GROMACS还未实现Andersen热浴.</li>
<li>温度设为300 K, 与Mobley教程提供的.mdp文件中的相同. Shirts等人的原始研究中将参考温度设为热力学标准态298 K. 为重现原始教程的结果, 我将温度设为300 K. 得到的自由能与298 K时的结果差距应当非常小, 后面会对此进行讨论.</li>
<li><code>tau_t = 1.0</code>. Mobley教程中, 逆摩擦系数设置为0.1. 但根据一个GROMACS开发者的推荐, 我将此项增加为1.0以避免水动力学的过阻尼.</li>
</ol>

<p>让我们花点时间详细分析下 <span class="math">\(\l\)</span> 向量, 以<code>init_lambda_state = 0</code>为例, 这意味着我们在<code>*_lambdas</code>关键词中指定了对应于索引为0的向量的转变状态, 像这样:</p>

<pre><code>; init_lambda_state        0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20
vdw_lambdas              = 0.00 0.05 0.10 0.15 0.20 0.25 0.30 0.35 0.40 0.45 0.50 0.55 0.60 0.65 0.70 0.75 0.80 0.85 0.90 0.95 1.00
coul_lambdas             = 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00
bonded_lambdas           = 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00
restraint_lambdas        = 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00
mass_lambdas             = 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00
temperature_lambdas      = 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00 0.00
</code></pre>

<p>设定<code>initial_lambda_state = 1</code>会对应于右边的下一列(范德华 <span class="math">\(\l\)</span> 为0.05), 而<code>initial_lambda_state = 20</code>会指定最后一列(<span class="math">\(\l\)</span> 向量), 此时范德华 <span class="math">\(\l\)</span> 的值为1.0. 对本教程的目的而言, 我们只转变范德华相互作用, 而不对与电荷, 键合参数, 限制等相关的项进行转变. <strong>请注意</strong>, 在上面的例子中, 拓扑中的电荷为0, .mdp的设置不表示存在电荷(无论<code>couple-lambda0</code>和<code>couple-lambda1</code>包含<code>q</code>与否), <code>coul_lambdas</code>的选择是无关的, 但并不总是这样!</p>

## 第四步: 能量最小化

<p>我提供的<code>job.sh</code>脚本可用于运行工作流程中的计算, 它会创建如下层次的目录结构:</p>

<pre><code>Lambda_0/
Lambda_0/EM_1/
Lambda_0/EM_2/
Lambda_0/NVT/
Lambda_0/NPT/
Lambda_0/Production_MD/
</code></pre>

<p>这样, 对每一个<code>init_lambda_state</code>值, 工作流程中的所有步骤都会在单一目录下进行. 我发现以这种方式组织计算作业及其输出很方便.</p>

<p>脚本也会假定.mdp文件按层次进行组织, 位于目录<code>$MDP</code>中, 它是脚本中的一个环境变量:</p>

<pre><code>$MDP/
$MDP/EM/
$MDP/NVT/
$MDP/NPT/
$MDP/Production_MD/
</code></pre>

<p>如前所述, 能量最小化将分两个阶段进行: 第一阶段使用最速下降方法, 第二阶段使用L-BFGS方法. 这种组合能够得到能量充分最小化的结构, 很适合作为平衡的起始点以及接下来的数据收集. <code>job.sh</code>脚本中有关的内容如下:</p>

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
mkdir Lambda_$LAMBDA
cd Lambda_$LAMBDA

#################################
# ENERGY MINIMIZATION 1: STEEP  #
#################################
echo "Starting minimization for lambda = $LAMBDA..."

mkdir EM_1
cd EM_1

# Iterative calls to grompp and mdrun to run the simulations

grompp -f $MDP/EM/em_steep_$LAMBDA.mdp -c $FREE_ENERGY/Methane/methane_water.gro
-p $FREE_ENERGY/Methane/topol.top -o min$LAMBDA.tpr

mdrun -nt 2 -deffnm min$LAMBDA

#################################
# ENERGY MINIMIZATION 2: L-BFGS #
#################################

cd ../
mkdir EM_2
cd EM_2

grompp -f $MDP/EM/em_l-bfgs_$LAMBDA.mdp -c ../EM_1/min$LAMBDA.gro
-p $FREE_ENERGY/Methane/topol.top -o min$LAMBDA.tpr

# Run L-BFGS in serial (cannot be run in parallel)

mdrun -nt 1 -deffnm min$LAMBDA

echo "Minimization complete."
</code></pre>

<p>注意, 脚本假定模拟工作是在双核机器上进行的(对当今的工作站这很常见). 最速下降方法可并行进行, 但L-BFGS方法不能, 因此调用<code>mdrun</code>时分别使用了不同的选项<code>-nt 2</code>和<code>-nt 1</code>.</p>

## 第五步: 平衡

<p>体系将进行两个阶段的平衡, 第一个阶段为等容平衡(NVT), 第二个阶段为等压平衡(NPT).</p>

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
#####################
# NVT EQUILIBRATION #
#####################
echo "Starting constant volume equilibration..."

cd ../
mkdir NVT
cd NVT

grompp -f $MDP/NVT/nvt_$LAMBDA.mdp -c ../EM_2/min$LAMBDA.gro
-p $FREE_ENERGY/Methane/topol.top -o nvt$LAMBDA.tpr

mdrun -nt 2 -deffnm nvt$LAMBDA

echo "Constant volume equilibration complete."

#####################
# NPT EQUILIBRATION #
#####################
echo "Starting constant pressure equilibration..."

cd ../
mkdir NPT
cd NPT

grompp -f $MDP/NPT/npt_$LAMBDA.mdp -c ../NVT/nvt$LAMBDA.gro
-p $FREE_ENERGY/Methane/topol.top -t ../NVT/nvt$LAMBDA.cpt -o npt$LAMBDA.tpr

mdrun -nt 2 -deffnm npt$LAMBDA

echo "Constant pressure equilibration complete."
</code></pre>

## 第六步: 成品MD

<p>现在体系已经平衡好了, 我们可以开始成品模拟了, 在此过程中, 我们将收集 <span class="math">\(\partial H/\partial \l\)</span> 数据.</p>

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
#################
# PRODUCTION MD #
#################
echo "Starting production MD simulation..."

cd ../
mkdir Production_MD
cd Production_MD

grompp -f $MDP/Production_MD/md_$LAMBDA.mdp -c ../NPT/npt$LAMBDA.gro
-p $FREE_ENERGY/Methane/topol.top -t ../NPT/npt$LAMBDA.cpt -o md$LAMBDA.tpr

mdrun -nt 2 -deffnm md$LAMBDA

echo "Production MD complete."
</code></pre>

<p>在一个双核工作站上, 整个工作流程大约需要45分钟左右完成. 由于要进行很多次模拟(21个 <span class="math">\(\l\)</span> 值), 所以最好在集群上运行这些作业, 这样可以使用多个处理器同时运行几个作业. 当所有的成品模拟都完成以后, 我们就可以分析得到的数据了.</p>

## 第七步: 分析

<p>GROMACS 4.5版本中引入的<code>g_bar</code>程序(GROMACS 5.0中的名称为<code>gmx bar</code>)使得计算 <span class="math">\(\D G_\text{AB}\)</span> 变得非常容易. 在工作目录中, 简单地收集<code>mdrun</code>生成的所有<code>md*.xvg</code>文件(每个 <span class="math">\(\l\)</span> 一个), 然后运行<code>gmx bar</code>:</p>

<pre><code>gmx bar -f md*.xvg -o -oi -oh
</code></pre>

<p>程序会在屏幕上打印出许多有用信息, 并生成三个输出文件: <code>bar.xvg</code>, <code>barint.xvg</code>和<code>histogram.xvg</code>. <code>gmx bar</code>的屏幕输出应该类似下面这样:</p>

<pre><code>Detailed results in kT (see help for explanation):

 lam_A  lam_B      DG   +/-     s_A   +/-     s_B   +/-   stdev   +/-
     0      1    0.07  0.00    0.03  0.00    0.03  0.00    0.25  0.00
     1      2    0.06  0.00    0.03  0.00    0.04  0.00    0.26  0.00
     2      3    0.05  0.00    0.03  0.00    0.04  0.00    0.27  0.00
     3      4    0.03  0.00    0.03  0.00    0.04  0.00    0.28  0.00
     4      5    0.02  0.00    0.04  0.00    0.05  0.00    0.29  0.00
     5      6   -0.00  0.01    0.04  0.00    0.05  0.00    0.30  0.01
     6      7   -0.02  0.01    0.05  0.01    0.06  0.01    0.32  0.00
     7      8   -0.06  0.00    0.06  0.00    0.07  0.00    0.35  0.00
     8      9   -0.10  0.01    0.06  0.00    0.08  0.01    0.38  0.00
     9     10   -0.15  0.01    0.08  0.01    0.10  0.01    0.41  0.00
    10     11   -0.23  0.01    0.10  0.01    0.13  0.01    0.47  0.00
    11     12   -0.32  0.01    0.10  0.01    0.14  0.01    0.51  0.01
    12     13   -0.44  0.01    0.17  0.01    0.20  0.01    0.58  0.01
    13     14   -0.57  0.01    0.15  0.01    0.17  0.01    0.57  0.00
    14     15   -0.60  0.02    0.11  0.01    0.11  0.01    0.47  0.00
    15     16   -0.53  0.01    0.06  0.01    0.06  0.01    0.35  0.00
    16     17   -0.41  0.00    0.03  0.00    0.03  0.00    0.25  0.00
    17     18   -0.28  0.00    0.02  0.00    0.02  0.00    0.18  0.00
    18     19   -0.16  0.00    0.01  0.00    0.01  0.00    0.13  0.00
    19     20   -0.05  0.00    0.00  0.00    0.00  0.00    0.10  0.00

Final results in kJ/mol:

point      0 -      1,   DG  0.19 +/-  0.01
point      1 -      2,   DG  0.16 +/-  0.00
point      2 -      3,   DG  0.12 +/-  0.00
point      3 -      4,   DG  0.09 +/-  0.00
point      4 -      5,   DG  0.04 +/-  0.00
point      5 -      6,   DG -0.00 +/-  0.01
point      6 -      7,   DG -0.06 +/-  0.01
point      7 -      8,   DG -0.15 +/-  0.01
point      8 -      9,   DG -0.26 +/-  0.02
point      9 -     10,   DG -0.39 +/-  0.02
point     10 -     11,   DG -0.58 +/-  0.02
point     11 -     12,   DG -0.79 +/-  0.02
point     12 -     13,   DG -1.11 +/-  0.02
point     13 -     14,   DG -1.43 +/-  0.02
point     14 -     15,   DG -1.51 +/-  0.04
point     15 -     16,   DG -1.33 +/-  0.02
point     16 -     17,   DG -1.02 +/-  0.01
point     17 -     18,   DG -0.70 +/-  0.01
point     18 -     19,   DG -0.40 +/-  0.00
point     19 -     20,   DG -0.13 +/-  0.00

total      0 -     20,   DG -9.25 +/-  0.15
</code></pre>

<p>我得到的 <span class="math">\(\D G_\text{AB}\)</span> 为&#8211;9.25±0.15 kJ/mol, 或&#8211;2.21±0.04 kcal/mol. 由于本教程中我构建的过程为甲烷的去耦合, 其逆过程(不带电的甲烷进入水中, 因此为过程中的实际水合能)相应的 <span class="math">\(\D G_\text{AB}\)</span> 为2.21±0.04 kcal/mol(假定可逆), 与Shirts等人得到的值2.24±0.01 kcal/mol符合得很好(论文<a href="http://www.dillgroup.ucsf.edu//group/wiki/images/1/1f/Shirts_solvation_epaps.pdf">支撑材料</a>中的表II). 除了前面提及的其他改变外, 对范德华转变, 我们使用的 <span class="math">\(\l\)</span> 向量的数目大约只有他们的一半.</p>

<p>大约0.02 kJ/mol(大约 0.004 kcal/mol)的差异可单纯地归因于温度差异(本教程及Mobley教程中使用了300 K, 原始工作中使用了298 K), 因此, 温度差异对我们的结果没有太大的实际影响.</p>

<p>单从技术上讲, 到此为止我们就已经得到了所需要的答案, 但<code>gmx bar</code>同时会给出许多有用的输出文件(都是可选项), 它们的内容值得我们做进一步的检查, 因为它们提供了去耦合过程以及抽样成功与否的大量细节.</p>

<p><strong>输出文件1: bar.xvg</strong></p>

<p>让我们开始检查<code>gmx bar</code>给出的其他输入文件, 从<code>bar.xvg</code>开始. 这个输出文件给出了每个 <span class="math">\(\l\)</span> 区间(即相邻哈密顿量之间)的相对自由能差, 并且看起来应该类似下面的图(使用柱状图绘制, 而没有使用默认的线状图, 为便于查看添加了一些网格线)</p>

<figure>
<img src="/GMX/GMXtut-6_bar_plot.jpg" alt="" />
<figcaption></figcaption></figure>

<p>灰色竖线代表去耦合过程中使用的 <span class="math">\(\l\)</span> 值, 因此, 每一黑色柱代表了相邻 <span class="math">\(\l\)</span> 值之间的自由能差. 在<code>bar.xvg</code>文件中, 我们首先可以看到模拟中使用了什么<code>calc_lambda_neighbors</code>. 例如在<code>init_lambda_state = 0</code>的模拟中, <span class="math">\(\l=0.05\)</span> 的自由能(最近的临近窗口, 由<code>calc_lambda_neighbors = 1</code>设定)每<code>nstdhdl</code>(10)步计算一次. 这些&#8220;外部&#8221; <span class="math">\(\l\)</span> 计算可导致不同 <span class="math">\(\l\)</span> 值之间的能量发生重叠, 这样就存在相空间之间的重叠, 从而抽样充分. 感兴趣的读者可参看<code>gmx bar</code>说明中引用的Wu和Kofke的<a href="http://link.aip.org/link/doi/10.1063/1.2011391">论文</a>, 以了解这些概念以及熵值s<sub>A</sub>和是s<sub>B</sub>的解释.</p>

<p>这样由 <span class="math">\(\l=0\)</span> 到 <span class="math">\(\l=1\)</span> 的自由能改变简单地等于每对相邻 <span class="math">\(\l\)</span> 模拟自由能差值的加和, 这些差值在<code>bar.xvg</code>中给出.</p>

<p><span class="math">\(\D G\)</span> 的值只是<code>gmx bar</code>打印至屏幕的输出内容的一半, 屏幕输出的另一半包含 <span class="math">\(\D G\)</span> 相同的值, 但转化为以kJ/mol为单位(300 K时, 1 kT = 2.494 kJ/mol).</p>

<p><strong>输出文件2: barint.xvg</strong></p>

<p><code>barint.xvg</code>文件给出了累积 <span class="math">\(\D G\)</span> 与 <span class="math">\(\l\)</span> 的函数关系. 在<code>barint.xvg</code>文件中, <span class="math">\(\l=1\)</span> 的点相应于从 <span class="math">\(\l\)</span> 向量0到 <span class="math">\(\l\)</span> 向量1的 <span class="math">\(\D G\)</span> 的加和, 如上面的屏幕输出所示:</p>

<pre><code> lam_A  lam_B      DG   +/-     s_A   +/-     s_B   +/-   stdev   +/-
     0      1    0.07  0.00    0.03  0.00    0.03  0.00    0.25  0.00
     1      2    0.06  0.00    0.03  0.00    0.04  0.00    0.26  0.00
</code></pre>

<p>因此, <code>barint.xvg</code>中累积 <span class="math">\(\D G\)</span> 的值当 <span class="math">\(\l=0\)</span> 时为0, 当 <span class="math">\(\l=0.1\)</span> 时为0.0+0.07=0.07, 这就是我们在<code>barint.xvg</code>中发现的值. 下面就是<code>barint.xvg</code>的图(蓝色), 图中同时还绘制了<code>bar.xvg</code>的数据(黑色, 不同 <span class="math">\(\l\)</span> 值之间的 <span class="math">\(\D G\)</span> 值)以展示累积 <span class="math">\(\D G\)</span>. 通过 <span class="math">\(\l=20\)</span> 处 <span class="math">\(\D G\)</span> 的值(&#8211;3.71 kT), 我们可以计算出 <span class="math">\(\D G\)</span> 为&#8211;9.25 kJ/mol.</p>

<figure>
<img src="/GMX/GMXtut-6_barint_plot.jpg" alt="" />
<figcaption></figcaption></figure>

<p><strong>输出文件3: histogram.xvg</strong></p>

<p><code>histogram.xvg</code>文件包含许多信息. 如果将其载入xmgrace, 可能看起来并不是特别有意义, 而且图例会超出屏幕. 为易于理解, 我将两类数据分别绘图, 第一个图中包含在<code>md*.xvg</code>文件中找到的每个 <span class="math">\(\l\)</span> 值对应的 <span class="math">\(\partial H/\partial \l\)</span> 值的分布(单位为kJ/mol), 它类似下面:</p>

<figure>
<img src="/GMX/GMXtut-6_histo_dhdl.jpg" alt="" />
<figcaption></figcaption></figure>

<p><code>histogram.xvg</code>文件的其他部分为相邻(所谓的&#8220;本地&#8221;和&#8220;外部&#8221;) <span class="math">\(\l\)</span> 值之间 <span class="math">\(\D H\)</span> 值(这里的 <span class="math">\(H\)</span> 代表哈密顿量而非焓)的分布. 对本地 <span class="math">\(\l\)</span> 值(即.mdp文件中的<code>init_lambda_state</code>)对应轨迹中的构型, 会计算此构型在任何需要的外部 <span class="math">\(\l\)</span> 值下的 <span class="math">\(\D H\)</span> 的值. 结果(缩放至适当轴)如下:</p>

<figure>
<img src="/GMX/GMXtut-6_histo_deltah.jpg" alt="" />
<figcaption></figcaption></figure>

<p>注意, 由于数据集过多, 因此图例被切断了. 每一分布的图例提供了所绘量的说明. 例如, <span class="math">\(N(\DH(\l=0.05) | \l=0)\)</span> 表示外部 <span class="math">\(\l\)</span> 值为0.05时根据 <span class="math">\(\l=0\)</span> 轨迹中的构型计算的 <span class="math">\(\D H\)</span> 值的分布. 有关此图隐含信息的完整讨论, 请参考<a href="http://dx.doi.org/10.1016/0021-9991%2876%2990078-4">BAR论文</a>中的图5(及其相关讨论).</p>

<p>所有这些意味着什么? 一般而言, MD模拟的直方图用于表示能量, 位置等量的重叠, 类似于<a href="http://jerkwin.github.io/9999/10/31/GROMACS%E4%B8%AD%E6%96%87%E6%95%99%E7%A8%8B/#TOC1.7.4">伞形抽样</a>. 在这里, 为得到 <span class="math">\(\D G\)</span> 的可信估计, 我们需要在每一个窗口(基于 <span class="math">\(\partial H/\partial \l\)</span> 的分布)以及相邻窗口之间(<span class="math">\(\D H\)</span> 分布)进行充分抽样. 这里展示的数据之间的显著重叠以及<code>gmx bar</code>给出的小误差表示, 我们达到了采样充分的目的. 如果你自己计算得到的直方图不重叠, 导致估计误差很大, 那你可能需要更长时间的模拟, 更多的 <span class="math">\(\l\)</span> 点, 或对要转变分子使用更好的参数.</p>

## 高级应用

<p>自由能计算的一个常见应用是确定配体与受体(例如, 蛋白质)之间的结合能 <span class="math">\(\D G\)</span>. 为此, 你需要对处于体相溶液中的复合物中的配体与受体进行(去)耦合, 由于 <span class="math">\(\D G\)</span>(在这种情况下)为配体与受体结合的自由能变化(即, 将配体引入结合位点), 再加上配体的去溶剂化自由能(即, 将其从溶液中移除):</p>

<p><span class="math">\[\D G_\text{bind} = \D G_\text{complexation} + \D G_\text{desolvation} \\
\D G_\text{solvation} + \D G_\text{desolvation} \\
\therefore \D G_\text{bind} = \D G_\text{complexation} - \D G_\text{solvation}\]</span></p>

<p>结合的 <span class="math">\(\D G\)</span> 为这两个态之间的差值, 可以通过下面(有些简化)的热力学循环进行计算, 其中 <span class="math">\(\D G_1\)</span> 和 <span class="math">\(\D G_3\)</span> 分布为上面方程中的 <span class="math">\(\D G_\text{solvation}\)</span> 和 <span class="math">\(\D G_\text{complexation}\)</span>.</p>

<figure>
<img src="/GMX/GMXtut-6_ti_cycle.jpg" alt="" />
<figcaption></figcaption></figure>

<p>这类过程的一个特别详细的热力学循环可在<a href="http://dx.doi.org/10.1063/1.2221683">此论文</a>的图1中找到.</p>

<p>一个完全相互作用的物种(例如配体)到&#8220;哑&#8221;物种(与配体构型相同的一组原子中心, 与周围没有任何非键相互作用)的转变, 需要关闭待研究溶质的与其周围环境之间的范德华相互作用(如此教程所示)与库伦相互作用. 甲烷转变的完整序列如下:</p>

<p><img src="/GMX/GMXtut-6_methane_full.png" alt="完全相互作用" /> <img src="/GMX/GMXtut-6_methane_noq.png" alt="无电荷, 全LJ" /> <img src="/GMX/GMXtut-6_methane_none.png" alt="哑分子" />
<figcaption>完全相互作用 无电荷, 全LJ       哑分子</figcaption>
</p>

<p>在上面的热力学循环中, <span class="math">\(\D G_1\)</span> 和 <span class="math">\(\D G_3\)</span> 实际上代表了配体的引入(由哑分子开始), 即耦合而非去耦合. 上面的热力学循环非常基本, 并未考虑许多其他因素, 如<a href="http://dx.doi.org/10.1063/1.2221683">取向限制</a>, <a href="http://dx.doi.org/10.1021/ct700032n">蛋白质是构象变化</a>等. 这里不讨论这些内容, 对大多数小分子(通常命名为<code>LIG</code>), 下面的设置看起来非常吸引人:</p>

<pre><code>couple-moltype  = LIG
couple-intramol = no
couple-lambda0  = none
couple-lambda1  = vdw-q
</code></pre>

<p>但这种情况下需要特别注意. 在以前版本的GROMACS中, 这种方法可能会非常不稳定, 因为当体系中仍然保持一些电荷时而移除范德华项会导致带相反电荷的原子互相吸引, 它们之间的距离非常近(电子云的效应不完全), 得到不稳定的构型和不可信的能量, 即便体系不会崩溃. 因此, 将(去)耦合过程依次进行更好. 在GROMACS 5.0中, 使用新的向量 <span class="math">\(\l\)</span> 功能可以很容易地达到目的:</p>

<pre><code>couple-moltype          = LIG
couple-intramol         = no
couple-lambda0          = none
couple-lambda1          = vdw-q
init_lambda_state       = 0
calc_lambda_neighbors   = 1
vdw_lambdas             = 0.00 0.05 0.10 ... 1.00 1.00 1.00 ... 1.00
coul_lambdas            = 0.00 0.00 0.00 ... 0.00 0.05 0.10 ... 1.00
</code></pre>

<p>在这种情况下, 开始时库伦相互作用对应的 <span class="math">\(\l\)</span> 值始终是0, 而范德华相互作用转变对应的 <span class="math">\(\l\)</span> 值逐步改变. 然后, 当范德华相互作用完全打开时(<span class="math">\(\l\)</span> = 1.00), 再逐步打开库伦相互作用. 这个过程的关键是追踪状态从 <span class="math">\(\l\)</span> = 0 到 <span class="math">\(\l\)</span> = 1 的途径. 在上面的情况中, <code>couple-lambda0</code>项说明关闭了相互作用, 而<code>couple-lambda1</code>项说明打开了相互作用.</p>

<p>这种类型的转变对计算水合/溶剂化能很有用, 因为这些量常作为力场参数化的目标数据.</p>

## 总结

<p>我们已经计算了一个简单转变过程&#8211;简单溶质分子(不带电的甲烷)与溶剂(水)之间范德华相互作用的去耦合&#8211;的自由能变化, 这个值以前已经进行过高精度的计算. 希望在处理复杂体系时, 本教程可给你提供一些必需的理解.</p>

<p>如果你对改进这个教程有些建议, 如果你发现了错误, 或者你觉得有些地方不够清楚, 请给我发邮件<code>jalemkul@vt.edu</code>, 不要客气. 请注意: 这不是邀请你因为GROMACS的问题而给我发邮件. 我并不是作为一个私人家教或个人客服在为自己打广告. 那是<a href="http://lists.gromacs.org/mailman/listinfo/gmx-users">GROMACS用户邮件列表</a>的事. 我可能会在那里帮助你, 但那只是作为对整个社区的服务, 而不只针对最终用户.</p>

<p>祝你模拟愉快!</p>
