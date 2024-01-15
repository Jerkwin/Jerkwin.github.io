---
 layout: post
 title: GROMACS中文手册：第五章　拓扑文件
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}


## 5.1 简介

<p>GROMACS运行时需要知道哪些原子及其组合对势能函数有贡献(参见第四章). 此外, 它还需要知道对于不同函数必需的参数. 所有这些都利用 <strong>拓扑文件</strong> <code>*.top</code>进行描述, 它列出了每个原子的 <strong>固定属性</strong>. 原子类型比元素种类多得多, 但力场只对存在于生物系统中的原子类型, 外加一些金属, 离子和硅进行了参数化. 键合相互作用和一些特殊的相互作用由拓扑文件中的固定配对所决定, 必须排除某些非键相互作用(第一和第二近邻), 因为它们已经在键合相互作用中处理过了. 另外, 原子还具有 <strong>动态属性</strong>, 如位置, 速度和力. 严格地说, 这些不属于分子拓扑, 而是存储在坐标文件<code>*.gro</code>(位置和速度)或轨迹文件<code>*.trr</code>(位置, 速度, 力).</p>

<p>本章将描述拓扑文件, <code>*.top</code>文件和数据库文件的设置: 各个参数代表什么, 如果需要如何/到哪里修改它们. 首先, 会解释了所有的文件格式. 然后, 在5.8.1小节说明在每个力场的文件组织形式.</p>

<p><strong>注意</strong>: 如果你创建了自己的拓扑文件, 我们诚挚地希望你能够将其上传到位于<a href="http://www.gromacs.org/">www.gromacs.org</a>的拓扑文件存档. 想一想, 如果在开始计算之前, 那里就已经存有你需要的拓扑文件了, 你肯定会感谢那些贡献的人. 如果你创建了新的力场或者对标准力场进行了修改, 我们同样希望你能够将其上传到力场存档.</p>

## 5.2 粒子类型

<p>在GROMACS中, 共有三种类型的粒子, 参见表 5.1. GROMACS只使用了常规原子和虚拟相互作用位点, 壳层只对极化模型, 如壳层水模型, 才是需要的[43].</p>

<table><caption> 表 5.1: GROMACS的粒子类型</caption>
<tr>
<th style="text-align:center;"> 粒子              </th>
<th style="text-align:center;">符号</th>
</tr>
<tr>
<td style="text-align:center;"> 原子              </td>
<td style="text-align:center;">A</td>
</tr>
<tr>
<td style="text-align:center;"> 壳层              </td>
<td style="text-align:center;">S</td>
</tr>
<tr>
<td style="text-align:center;"> 虚拟相互作用位点  </td>
<td style="text-align:center;">V(或D)</td>
</tr>
</table>

### 5.2.1 原子类型

<p>每个力场都定义了一组原子类型, 它们具有特征名称或编号, 质量(以a.m.u为单位). 这些原子类型的列表可以在<code>atomtypes.atp</code>(.atp = <strong>a</strong>tom <strong>t</strong>ype <strong>p</strong>arameter, 原子类型参数)文件中找到. 因此, 你可以从这个文件开始修改和/或增加原子类型. 下面的示例原子类型来自于<code>gromos43a1.ff</code>力场</p>

<pre><code>  O 15.99940 ;   carbonyl oxygen (C=O)
 OM 15.99940 ;   carboxyl oxygen (CO-)
 OA 15.99940 ;   hydroxyl, sugar or ester oxygen
 OW 15.99940 ;   water oxygen
  N 14.00670 ;   peptide nitrogen (N or NH)
 NT 14.00670 ;   terminal nitrogen (NH2)
 NL 14.00670 ;   terminal nitrogen (NH3)
 NR 14.00670 ;   aromatic nitrogen
 NZ 14.00670 ;   Arg NH (NH2)
 NE 14.00670 ;   Arg NE (NH)
  C 12.01100 ;   bare carbon
CH1 13.01900 ;   aliphatic or sugar CH-group
CH2 14.02700 ;   aliphatic or sugar CH2-group
CH3 15.03500 ;   aliphatic CH3-group
</code></pre>

<p><strong>注意</strong>: GROMACS以名称来使用原子类型, 而不是编号(参考GROMOS的例子)</p>

### 5.2.2 虚拟位点

<p>一些力场会使用虚拟相互作用位点(由其他粒子的位置构建的相互作用位点), 并为这些位点设置一些相互作用(例如, 对苯环可产生正确的四极矩), 这些将在4.7中详细介绍.</p>

<p>为了在你的体系中生成虚位点, 你需要在拓扑文件中包含<code>[ virtual_sites? ]</code>段(为向后兼容也可以使用老版本中的名称<code>[ dummmies? ]</code>), 其中<code>?</code>代表构成虚拟位点的粒子数目, 对类型2为<code>2</code>, 对类型3, 3fd, 3fad和3out为<code>3</code>, 对类型4fdn为<code>4</code>. 类型4fdn取代了旧的4fd类型(&#8217;type&#8217;值为1), 因为它有时会不稳定. 尽管程序内部仍然支持4fd类型, 不过最好不要在新的输入文件中使用. 不同类型将在4.7节解释.</p>

<p>类型2的参数看起来应该像这样:</p>

<pre><code>[ virtual_sites2 ]
; Site  from    funct    a
5       1 2     1        0.7439756
</code></pre>

<p>类型3的像这样:</p>

<pre><code>[ virtual_sites3 ]
; Site  from    funct    a          b
5       1 2 3   1        0.7439756  0.128012
</code></pre>

<p>类型3fd的像这样:</p>

<pre><code>[ virtual_sites3 ]
; Site  from    funct   a        d
5       1 2 3   2       0.5      -0.105
</code></pre>

<p>类型3afd的像这样:</p>

<pre><code>[ virtual_sites3 ]
; Site  from     funct    theta    d
5       1 2 3    3        120      0.5
</code></pre>

<p>类型3out的像这样:</p>

<pre><code>; Site  from    funct    a        b        c
5       1 2 3   4        -0.4     -0.4     6.9281
</code></pre>

<p>类型4fdn的像这样:</p>

<pre><code>[ virtual_sites4 ]
; Site  from        funct    a        b        c
5       1 2 3 4     2        1.0      0.9      0.105
</code></pre>

<p>这就构成了虚拟位点, 编号5(第一列<code>Site</code>)基于其他原子的位置, 这些原子的索引号为1和2, 或者1, 2和3, 或者1, 2, 3和4(接下来的第2, 3或4列<code>from</code>), 构建时所遵循的规则由函数类型编号(下一列<code>func</code>)以及具体的参数(最后1, 2或3列<code>a  b..</code>)决定`. 显然, 原子数目(包括虚拟位点数)取决于分子. 研究一下GROMCAS自带的TIP4P或TIP5P水模型的拓扑文件对理解这些可能很有帮助.</p>

<p><strong>注意</strong>, 如果在虚拟位点和/或普通原子之间定义了任何固定的键合相互作用, <code>grompp</code>命令将会移除它们(除非使用<code>-normvsbds</code>选项). 键合相互作用的移除是在生成排除之后, 因为生成排除是以&#8220;化学&#8221;的键相互作用为基础.</p>

<p>可以使用更普遍的方法构建虚拟位点, 利用的指令是<code>[ virtual_sustesn ]</code>. 所需要的参数列在表5.5中. 下面是将一组给定原子的几何中心定义为虚拟位点的例子:</p>

<pre><code>[ virtual_sitesn ]
; Site  funct    from
5       1        1 2 3 4
</code></pre>

<table><caption> 表 5.2: GROMACS中的静态原子类型性质</caption>
<tr>
<th style="text-align:center;"> 性质    </th>
<th style="text-align:center;">符号</th>
<th style="text-align:center;"> 单位</th>
</tr>
<tr>
<td style="text-align:center;"> 类型    </td>
<td style="text-align:center;">-</td>
<td style="text-align:center;"> -</td>
</tr>
<tr>
<td style="text-align:center;"> 质量    </td>
<td style="text-align:center;">m</td>
<td style="text-align:center;"> a.m.u</td>
</tr>
<tr>
<td style="text-align:center;"> 电荷    </td>
<td style="text-align:center;">q</td>
<td style="text-align:center;"> e</td>
</tr>
<tr>
<td style="text-align:center;"> epsilon </td>
<td style="text-align:center;">\(\e\)</td>
<td style="text-align:center;"> kJ/mol</td>
</tr>
<tr>
<td style="text-align:center;"> sigma   </td>
<td style="text-align:center;">\(\s\)</td>
<td style="text-align:center;"> nm</td>
</tr>
</table>

## 5.3 参数文件

### 5.3.1 原子

<p>原子类型 <strong>静态性质</strong> (参见表 5.2)的指定基于几个地方的数据. 质量来源于<code>atomtypes.apt</code>文件(参见5.2.1节), 电荷来源于<code>*.rtp</code>(.rtp = <strong>r</strong>esidue <strong>t</strong>opology <strong>p</strong>arameter, 残基拓扑参数, 参见5.6.1节)文件. 这就意味着只对构建氨基酸, 核酸的基本单元定义了电荷, 对其他的分子, 用户需要自己定义电荷. 当使用<code>pdb2gmx</code>程序生成一个拓扑文件(<code>*.top</code>)时, 来自这些文件的信息将被整合在一起.</p>

### 5.3.2 非键参数

<p>非键参数包括van der Waals参数V(<code>c6</code>或 <span class="math">\(\s\)</span>, 由组合规则决定)和W(<code>c12</code>或 <span class="math">\(\e\)</span>), 它们列在<code>ffnonbonded.itp</code>文件中, 其中的<code>ptype</code>是粒子类型(参见表 5.1). <code>[ *type ]</code>指令中的条目和键合参数会被应用它们在拓扑文件中的相应部分. 除了将在5.3.4节中提到的那些, 缺少参数将导致警告.</p>

<pre><code>[ atomtypes ]
;name    at.num        mass    charge    ptype          V(c6)         W(c12)
    O         8    15.99940     0.000        A    0.22617E-02    0.74158E-06
   OM         8    15.99940     0.000        A    0.22617E-02    0.74158E-06
  .....

[ nonbond_params ]
; i    j    func          V(c6)         W(c12)
  O    O       1    0.22617E-02    0.74158E-06
  O   OA       1    0.22617E-02    0.13807E-05
 .....
</code></pre>

<p><strong>注意</strong>: GROMACS所包含的大部分力场也带有<code>at.num.</code>列, 但相同的信息位于OPLS_AA <code>bond_type</code>列. 参数V与W的含义取决于拓扑文件<code>[ defaults ]</code>段中选择的组合规则(参见5.7.1节).</p>

<p>对组合规则1:</p>

<p><span class="math">\[\begin{split}
V_{ii} &= C_i^{(6)}  &= 4 \e_i \s_i^6    & \text{[ kJ mol}^{-1} \text{nm}^6 \ \text ] \\
W_{ii} &= C_i^{(12)} &= 4 \e_i \s_i^{12} & \text{[ kJ mol}^{-1} \text{nm}^{12} \ \text ]
\end{split}
\tag{5.1}\]</span></p>

<p>对组合规则2和3:</p>

<p><span class="math">\[\begin{split}
V_{ii} &= \s_i    &\text{[ nm ]} \\
W_{ii} &= \e_i    &\text{[ kJ mol}^{-1} \ \text ]
\end{split}
\tag{5.2}\]</span></p>

<p>对不同原子类型间的一些或所有组合都可以在<code>[ nonbond_params ]</code>段给出, 参数V与W的定义同上. 对于其他没有给出的任何原子组合, 将根据组合原则, 利用相应原子类型的参数进行计算.</p>

<p>对组合规则1和3:</p>

<p><span class="math">\[\alg
C_{ij}^{(6)}  &= \sqrt{C_i^{(6)} C_j^{{6}}} \\
C_{ij}^{(12)} &= \sqrt{C_i^{(12)} C_j^{{12}}}
\ealg
\tag{5.3}\]</span></p>

<p>对组合规则2:</p>

<p><span class="math">\[\alg
\s_{ij} &= {1 \over 2}(\s_i+\s_j) \\
\e_{ij} &= \sqrt{\e_i \e_j}
\ealg
\tag{5.4}\]</span></p>

<p>当需要提供 <span class="math">\(\s\)</span> 和 <span class="math">\(\e\)</span> 时(规则2和3), 看起来不可能使用非零的 <span class="math">\(C^{12}\)</span> 与零值的 <span class="math">\(C^6\)</span> 参数进行组合. 然而, 提供负值的 <span class="math">\(\s\)</span> 恰好会这样做, <span class="math">\(C^6\)</span> 被设为零, <span class="math">\(C^{12}\)</span> 正常计算. 这只是代表了读入 <span class="math">\(\s\)</span> 值的一种特殊情况, 没有其他的.</p>

<p>对Buckingham势只有一种组合规则:</p>

<p><span class="math">\[\alg
A_{ij} &= \sqrt{A_{ii} A_{jj}} \\
B_{ij} &= 2/({1 \over B_{ii}}+{1\over B_{jj}}) \\
C_{ij} &= \sqrt{C_{ii} C_{jj}}
\ealg
\tag{5.5}\]</span></p>

### 5.5.3 键参数

<p>键参数(如, 键长, 键角, 异常/正常二面角)都列在<code>ffbonded.itp</code>文件中. 这个数据库中的条目分别给出了相互作用的原子类型, 相互作用的类型, 与相互作用有关的参数. 在处理拓扑文件时, <code>grompp</code>程序会读取这些参数, 然后应用到相关的键参数中. 例如将<code>bondtypes</code>应用到<code>[ bonds ]</code>指令中的条目, 等等. 从相关的<code>[ *type ]</code>指令中缺失的任何键参数都会导致致命错误. 相互作用的类型列于表 5.5. 下面是从这些文件中摘录的例子:</p>

<pre><code>[ bondtypes ]
; i   j    func         b0         kb
  C   O       1    0.12300    502080.
  C  OM       1    0.12500    418400.
 ......

[ angletypes ]
; i    j    k    func        th0        cth
 HO   OA    C       1    109.500    397.480
 HO   OA  CH1       1    109.500    397.480
 ......

[ dihedraltypes ]
;  i     l    func       q0         cq
NR5*   NR5       2    0.000    167.360
NR5*  NR5*       2    0.000    167.360
......

[ dihedraltypes ]
; j    k    func       phi0        cp    mult
  C   OA       1    180.000    16.736       2
  C    N       1    180.000    33.472       2
 ......

[ dihedraltypes ]
;
; Ryckaert-Bellemans Dihedrals
;
; aj   ak  funct
 CP2  CP2      3    9.2789  12.156  -13.120  -3.0597  26.240  -31.495
</code></pre>

<p>在<code>ffbonded.itp</code>文件中, 你可以添加键参数. 如果你想为新的原子类型增加参数, 请确保你已经在<code>atometypes.atp</code>中定义了它们.</p>

### 5.3.4 分子内的对相互作用

<p>分子中原子对之间额外的Lennard-Jones和静电相互作用可以添加到分子定义部分的<code>[ pairs ]</code>段中. 这些相互作用的参数可以独立于非键相互作用参数进行设置. 在GROMOS力场中, <code>[ pairs ]</code>仅仅用于修改1&#8211;4相互作用(相隔3条键的两个原子之间的相互作用). 在这些力场中, 1&#8211;4相互作用并不包括在非键相互作用中(参见5.4节).</p>

<pre><code>[ pairtypes ]
; i    j  func            cs6           cs12 ; THESE ARE 1-4 INTERACTIONS
  O    O     1    0.22617E-02    0.74158E-06
  O   OM     1    0.22617E-02    0.74158E-06
 .....
</code></pre>

<p><code>ffnonbonded.itp</code>文件中原子类型的对相互作用参数位于<code>[ pairtypes ]</code>段. GROMOS力场显式地列出了所有这些相互作用的参数, 但对于OPLS这样的力场这一段可能是空的, 因为这些力场通过统一地缩放参数来计算1&#8211;4相互作用. 对于那些不在<code>[ pairtypes ]</code>段出现的对参数, 只能当<code>forcefield.itp</code>文件中<code>[ defaults ]</code>指令的<code>gen-pair</code>设置为&#8220;yes&#8221;时才能生成(参见5.7.1节). 当<code>gen-pairs</code>设置为&#8220;no&#8221;时, <code>grompp</code>程序会对每个未设定参数的对类型产生警告.</p>

<p>普通对相互作用和1&#8211;4相互作用的函数类型为1. 函数类型2和<code>[ pairs_nb ]</code>特别用于自由能模拟. 当计算水合自由能时, 需要将溶质与溶剂去耦合. 这可通过添加一个B-状态拓扑(参见3.12节)实现, 其中所有溶质的非键参数, 即电荷和LJ参数, 都被设置为0. 然而, A状态和B状态之间自由能的差值并不是总的水合自由能. 我们必须通过重新引入真空中溶质分子内部的库伦和LJ相互作用来增加自由能. 当溶质内的库伦和LJ相互作用未修改时, 第二步可以与第一步结合起来. 为此, 引入了对函数类型2, 它与函数类型1完全相同, 除了B状态参数与A状态参数始终相同.</p>

<p>在<code>[ pairtypes ]</code>段搜索参数, 函数类型1和2之间并没有什么差别. 对相互作用段<code>[ pair_nb ]</code>用于取代非键相互作用. 它使用未缩放的电荷与非键LJ参数, 并只使用A状态的参数. <strong>注意</strong> 要为<code>[ pairs_nb ]</code>中列出的所有原子对添加排除, 否则这些原子对也将在正常的邻区列表中结束.</p>

<p>作为替代, 通过使用<code>couple-moltype</code>, <code>couple-lambda0</code>, <code>couple-lambda1</code>, 和<code>couple-intramol</code>关键字, 我们可以不修改拓扑文件而获得同样的行为. 具体请参考3.12节和6.1节.</p>

<p>所有这三种对类型全都使用普通的库伦作用, 即便当使用反应场, PME, Ewald或移位库伦相互作用来计算非键相互作用时. 类型1和2的能量会写入能量和日志文件, 其中每个能量组对都有单独的&#8220;LJ&#8211;14&#8221;和&#8220;Coulomb&#8211;14&#8221;项. <code>[ paisr_nb ]</code>的能量会添加到&#8220;LJ-(SR)&#8221;和&#8220;Coulomb-(SR)&#8221;项中.</p>

### 5.3.5 隐式溶剂化模型

<p>GROMACS自4.5版本起开始支持隐式溶剂. 拓扑文件中引入了一个节段用于列出相关参数:</p>

<pre><code>[ implicit_genborn_params ]
; Atomtype    sar      st    pi      gbr       hct
  NH1         0.155    1     1.028   0.17063   0.79 ; N
  N           0.155    1     1       0.155     0.79 ; Proline backbone N
  H           0.1      1     1       0.115     0.85 ; H
  CT1         0.180    1     1.276   0.190     0.72 ; C
</code></pre>

<p>在上面的例子中, 先列出了原子类型, 后面有5个数字和注释(分号后面).</p>

<p>目前并未使用1-3列的值. 它们与更精细的表面积算法, 特别是Qiu等提出的一个算法有关[70]. 第4列为原子的范德华半径, 用于计算Born半径. 电介质偏移值在<code>*.mdp</code>文件中指定, 对不同的计算Born半径的方法, 程序会将输入的范德华半径减去此偏移值, 见Onufriev等的说明[72]. 第5列是HCT和OBC模型的缩放因子, 数值来源于Tinker程序实现的HCT成对缩放方法[71]. 这种方法经过修改, 缩放因子调整后使得解析的表面积和使用HCT算法计算的GB表面积之间的偏差最小. 根据Hawkins[71]等的建议, 缩放不适用于成对的, 而只能基于每个原子, 因此对它们进行了进一步的修正.</p>

## 5.4 排除

<p><code>grompp</code>程序会对相邻直到一定数目键的原子生成非键相互作用的排除, 如在拓扑文件的<code>[ moleculetype ]</code>段中定义的那样(参见5.7.1节). 当彼此之间以&#8220;化学&#8221;键(<code>[ bonds ]</code>类型1到5, 7或8)或约束(<code>[ constraints ]</code>类型1)连接时, 粒子被认为是键合在一起的. 类型5<code>[ bonds ]</code>可用于创建两个原子之间无相互作用的连接. 有一种不通过化学键连接原子的简谐相互作用(<code>[ bonds ]</code>类型6), 也有一种不通过化学键连接原子而固定距离的第二类约束类型(<code>[ constraints ]</code>类型2). 所有这些相互作用的完整列表见表 5.5.</p>

<p>分子内额外的排除可以手动在<code>[ exclusions ]</code>段中添加. 每行必须以一个原子编号开始, 后面跟着一个或多个原子编号. 第一个原子和其他原子之间的所有非键相互作用都会被排除.</p>

<p>当需要排除原子组内部或彼此之间的非键相互作用时, 使用能量监测组排除会更方便和高效(参见3.3节).</p>

## 5.5 约束算法

<p>约束的定义在<code>[ constraints ]</code>段中, 其格式为两个原子编号, 后面跟着函数类型和约束距离. 函数类型可以为1或2, 它们之间的唯一区别在于, 类型1用于产生排除而类型2不产生排除(参见5.4节). 距离是通过在<code>*.mdp</code>文件中选择的LINCS或SHAKE算法进行约束的. 在自由能计算中, 通过增加第二个约束距离, 这两种类型的约束都可以进行微扰(参见5.7.5节). <code>grompp</code>程序可自动将一些类型的键或键角(参见表 5.5)转变为约束, 在<code>*.mdp</code>文件中有很多相关的选项.</p>

<p>我们也实现了SETTLE算法[45], 它对SHAKE进行解析求解, 只用于水. 可以在拓扑文件中选择SETTLE. 例如, 请参看SPC水分子的定义:</p>

<pre><code>[ moleculetype ]
; molname    nrexcl
  SOL        1

[ atoms ]
; nr    at type    res nr    ren nm    at nm    cg nr    charge
  1     OW         1         SOL       OW1      1        -0.82
  2     HW         1         SOL       HW2      1         0.41
  3     HW         1         SOL       HW3      1         0.41

[ settles ]
; OW    funct    doh    dhh
  1     1        0.1    0.16333

[ exclusions ]
1    2    3
2    1    3
3    1    2
</code></pre>

<p><code>[ settles ]</code>指令定义了水分子的第一个原子, SETTLE函数类型始终为1, 必须给出O-H和H-H之间的距离. <strong>注意</strong>, SETTLE算法也可用于TIP3P和TIP4P水分子模型[125]. TIP3P具有另一个构型, TIP4P具有一个虚拟位点, 但由于是生成的, 不需要抖动(或扰动).</p>

## 输入文件

<p>GROMACS的<code>pdb2gmx</code>程序可以根据输入的坐标文件产生拓扑文件, 它支持几种不同格式的坐标文件, 但<code>*.pdb</code>是最常用的(也因此程序名称为<code>pdb2gmx</code>). <code>pdb2gmx</code>程序运行时会在GROMACS <code>share/top</code>目录的子目录和你的工作目录中搜索力场, 并根据扩展名为<code>.ff</code>的目录中的<code>forcefield.itp</code>文件识别力场. 目录中可能存在<code>forcefield.doc</code>文件, 如果存在, <code>pbd2gmx</code>会将此文件的第一行作为力场的简单描述显示给用户, 以帮助用户选择力场. 否则, 用户可以使用<code>pdb2gmx</code>的命令行参数<code>-ff xxx</code>来选择力场, 所选的力场将位于<code>xxx.ff</code>目录. 搜索力场时, <code>pdb2gmx</code>会首先搜索工作目录, 然后再搜索GROMACS的<code>share/top</code>目录, 并使用找到的第一个匹配<code>xxx.ff</code>的目录.</p>

<p><code>pdb2gmx</code>会读入两个通用文件: 位于力场目录的原子类型文件(扩展名为<code>.atp</code>, 参见5.2.1节), 位于工作目录或GROMACS <code>share/top</code>目录的<code>residuetypes.dat</code>文件. <code>residuetypes.dat</code>文件决定了哪些残基名称将被视为蛋白质, DNA, RNA, 水和离子.</p>

<p>对不同类型的分子, <code>pdb2gmx</code>可以读入一个或多个数据库及拓扑信息. 属于同一个数据库的一组文件应具有相同的基准名称(basename), 基准名称最好能够对分子类型有所说明(如, 氨基酸, rna, dna). 可能的文件如下:</p>

<ul class="incremental">
<li><code>&lt;basename&gt;.rtp</code></li>
<li><code>&lt;basename&gt;.r2b</code> (可选)</li>
<li><code>&lt;basename&gt;.arn</code> (可选)</li>
<li><code>&lt;basename&gt;.hdb</code> (可选)</li>
<li><code>&lt;basename&gt;.n.tdb</code> (可选)</li>
<li><code>&lt;basename&gt;.c.tdb</code> (可选)</li>
</ul>

<p>只有包含了构建单元拓扑信息的<code>.rtp</code>文件是必需的, 来自于其他文件的信息只用于具有相同基准名的<code>.rtp</code>文件中的构建单元. 通过在工作目录中放置具有相同基准名的额外文件, 用户也可以为力场添加新的构建单元. 默认只能定义一个额外的构建单元, 但使用<code>-rtpo</code>选项调用<code>pdb2gmx</code>程序时, 可以使用本地文件中的构建单元来代替力场中默认的构建单元.</p>

### 5.6.1 残基数据库

<p>残基数据库文件的扩展名为<code>.rtp</code>. 这个文件原本包含蛋白质的构建单元(氨基酸), 是GROMACS对GROMOS <code>rt37c4.dat</code>文件的解释说明, 因此残基数据库文件包含常用构建单元的信息(键, 电荷, 电荷组, 异常二面角). 最好 <strong>不</strong> 要更改这个文件, 因为它是<code>pdb2gmx</code>的标准输入. 但如果确实需要修改, 请修改工作目录中的<code>*.top</code>文件(参见5.7.1节), 或<code>.rtp</code>文件, 像5.6节解释的那样. 通过直接包含<code>*.itp</code>拓扑文件定义一个新的小分子的拓扑可能更容易一些, 具体作法将在5.7.2节讨论. 当添加新的蛋白质残基到数据库中时, 别忘了将残基名称添加到<code>residuetypes.dat</code>文件中, 这样<code>grompp</code>, <code>make_ndx</code>和分析程序才能将残基识别为蛋白质残基(参见8.1.1节).</p>

<p><code>.rtp</code>文件只会被<code>pdb2gmx</code>程序使用. 如前面提到的, <code>pdb2gmx</code>程序仅仅从<code>.rtp</code>数据库中读入键, 原子电荷, 电荷组和异常二面角这些额外信息, 其余的信息是从坐标输入文件读入的. 一些蛋白质的坐标文件中包含非标准氨基酸. 你必须为这些&#8220;陌生&#8221;残基创建构建单元, 否则你将无法得到`*.top&#8217;文件. 对坐标文件中的一些分子, 如配体, 多原子离子, 晶格化溶剂分子等, 也是一样. 残基数据库可以根据以下方法创建:</p>

<pre><code>[ bondedtypes ] ; mandatory 必需
; bonds    angles    dihedrals    impropers
     1         1            1            2 ; mandatory 必需

[ GLY ] ; mandatory 必需

[ atoms ] ; mandatory 必需
; name    type    charge    chargegroup
     N       N    -0.280       0
     H       H     0.280       0
    CA     CH2     0.000       1
     C       C     0.380       2
     O       O    -0.380       2

[ bonds ] ; optional 可选
;atom1    atom2    b0    kb
     N        H
     N       CA
    CA        C
     C        O
    -C        N

[ exclusions ] ; optional 可选
;atom1    atom2

[ angles ] ; optional 可选
;atom1    atom2    atom3    th0    cth

[ dihedrals ] ; optional 可选
;atom1    atom2    atom3    atom4    phi0    cp    mult

[ impropers ] ; optional 可选
;atom1    atom2    atom3    atom4    q0    cq
     N       -C       CA        H
    -C      -CA        N       -O

[ ZN ]

[ atoms ]
   ZN    ZN    2.000    0
</code></pre>

<p>文件是自由格式, 唯一的限制是每行最多一个条目. 文件中的第一个域为<code>[ bondedtypes ]</code>, 后面跟着四个数字, 分别代表键, 键角, 二面角和异常二面角的相互作用类型. 文件中的残基条目包含原子和(可选的)键, 键角, 二面角, 异常二面角. 电荷组代码代表电荷组的编号, 相同电荷组的原子应该始终按顺序排列. 当使用<code>pdb2gmx</code>程序及氢数据库添加缺失的氢原子时(参见5.6.4), <code>.rtp</code>条目中定义的原子名称应该精确地对应于氢数据库中使用的名称约定. 键相互作用中的原子名称前可添加减号或加号, 分别代表原子处于残基之前或残基之后. 添加到键, 键角, 二面角和异常二面角的显式参数会覆盖<code>.itp</code>文件中的标准参数, 但只能用于特殊情况. 除参数外, 也可为每个键相互作用添加字符串. GROMOS&#8211;96的<code>.rtp</code>文件就是这样. 这些字符串会被复制到拓扑文件, 通过使用<code>grompp</code> C预处理器的<code>#define</code>语句, 可用力场参数替换这些字符串.</p>

<p><code>pdb2gmx</code>程序会自动生成所有的键角, 这意味着对大多数力场<code>[ angles ]</code>域仅用于覆盖<code>.itp</code>参数. 对GROMOS&#8211;96力场必须指定所有键角的相互作用编号.</p>

<p><code>pdb2gmx</code>程序会自动为每个旋转键生成一个正常二面角, 倾向位于重原子上. 当使用<code>[ dihedrals ]</code>域时, 不会为对应于指定二面角的键生成其他二面角. 可以为一条旋转键指定多个二面角函数. 对CHARMM27力场, 使用<code>pdb2gmx</code>程序默认的<code>-cmap</code>选项可为二面角增加校正图. 详细信息请参考4.10.4节.</p>

<p><code>pdb2gmx</code>会设置排除数为3, 这意味着最多以3条键连接的原子之间的相互作用都被排除了. 程序会为相隔三条键的所有原子对生成对相互作用(氢原子除外). 当需要排除更多的相互作用, 或不需要生成一些对相互作用时, 可添加<code>[ exclusions ]</code>域, 后面跟着位于不同行上的原子名称对, 这些原子之间的所有非键和对相互作用都将被排除.</p>

### 5.6.2 残基构建单元数据库

<p>每个力场对残基都有自己的命名约定. 大部分残基都具有一致的命名, 但有一些残基, 特别是那些具有不同质子化状态的残基, 可能具有许多不同的名称. <code>.r2b</code>文件可用于将标准的残基名称转换为力场构建单元名称.</p>

<table><caption> 表 5.3 GROMACS内部的残基名称约定</caption>
<tr>
<th style="text-align:center;"> 简写 </th>
<th style="text-align:center;">英文名称</th>
<th style="text-align:center;"> 含义</th>
</tr>
<tr>
<td style="text-align:center;"> ARG  </td>
<td style="text-align:center;">protonated arginine</td>
<td style="text-align:center;"> 质子化精氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> ARGN </td>
<td style="text-align:center;">neutral arginine</td>
<td style="text-align:center;"> 中性精氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> ASP  </td>
<td style="text-align:center;">negatively charged aspartic acid</td>
<td style="text-align:center;"> 带负电的天冬氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> ASPH </td>
<td style="text-align:center;">neutral aspartic acid</td>
<td style="text-align:center;"> 中性天冬氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> CYS  </td>
<td style="text-align:center;">neutral cysteine</td>
<td style="text-align:center;"> 中性半胱氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> CYS2 </td>
<td style="text-align:center;">cysteine with sulfur bound to another cysteine or a heme</td>
<td style="text-align:center;"> 通过硫与另一个半胱氨酸或血红素结合的半胱氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> GLU  </td>
<td style="text-align:center;">negatively charged glutamic acid</td>
<td style="text-align:center;"> 带负电的谷氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> GLUH </td>
<td style="text-align:center;">neutral glutamic acid</td>
<td style="text-align:center;"> 中性谷氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> HISD </td>
<td style="text-align:center;">neutral histidine with \(\text N_\d\) protonated</td>
<td style="text-align:center;"> \(\text N_\d\) 质子化的中性组氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> HISE </td>
<td style="text-align:center;">neutral histidine with \(\text N_\e\) protonated</td>
<td style="text-align:center;"> \(\text N_\e\) 质子化的中性组氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> HISH </td>
<td style="text-align:center;">positive histidine with both  \(\text N_\d\) and \(\text N_\e\) protonated</td>
<td style="text-align:center;"> \(\text N_\d\) 和 \(\text N_\e\) 质子化的带正电的组氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> HIS1 </td>
<td style="text-align:center;">histidine bound to a heme</td>
<td style="text-align:center;"> 结合到血红素的组氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> LYSN </td>
<td style="text-align:center;">neutral lysine</td>
<td style="text-align:center;"> 中性赖氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> LYS  </td>
<td style="text-align:center;">protonated lysine</td>
<td style="text-align:center;"> 质子化赖氨酸</td>
</tr>
<tr>
<td style="text-align:center;"> HEME </td>
<td style="text-align:center;">heme</td>
<td style="text-align:center;">血红素</td>
</tr>
</table>

<p>如果力场目录中不存在<code>.r2b</code>文件, 或残基未被列出, 会假定构建单元的名称与残基名称相同. <code>.r2b</code>文件可包含2或5列. 2列格式为, 第一列为残基名称, 第二列为构建单元名称. 5列格式具有3个附加列, 分别为出现在N端, C端和同时出现在两个末端的残基(单个残基分子)的构建单元. 这对一些力场有用, 例如AMBER力场. 如果不存在一个或多个末端, 应在相应的列中输入短划线.</p>

<p>对残基, 存在GROMACS的命名约定, 此约定仅通过<code>.r2b</code>文件和<code>specbond.dat</code>文件显现出来(除<code>pdb2gmx</code>代码外). 只有当你添加残基类型到<code>.rtp</code>文件时, 这个约定是才变得重要. 此约定列在表5.3中. 对于特殊的键, 如与血红素基团相连的键, GROMACS命名约定通过<code>specbond.dat</code>引入(参见5.6.7节), 如果需要, 此约定随后可以利用<code>.r2b</code>文件进行翻译.</p>

### 5.6.3 原子重命名数据库

<p>力场中使用的原子名称经常不遵​​循IUPAC或PDB约定. <code>.arn</code>数据库用于将坐标文件中的原子名称转换为力场中的名称. 未列出的原子会保持原有名称. <code>.arn</code>文件有三列, 分别为构建单元名称, 旧的原子名称和新的原子名称. 残基名称支持问号通配符, 用以匹配单个字符.</p>

<p><code>share/top</code>目录下还存在一个通用的原子重命名文件<code>xlateat.dat</code>, 可以将坐标文件中常见的非标​​准原子名称转换为IUPAC/PDB约定名称. 因此, 当编写力场文件时, 你可以使用标准的原子名称, 除了将其翻译为力场名称外, 不需要进一步的翻译.</p>

### 5.6.4 氢数据库

<p>氢数据库储存在<code>.hdb</code>文件中, 它包含了关于<code>pdb2gmx</code>程序如何将氢原子连接到已有原子的信息. 在GROMACS 3.3版本以前的数据库中, 根据连接的原子对氢原子进行命名: 把连接原子名称的首字母用&#8217;H&#8217;代替. 从3.3版本开始, 必须明确列出氢原子, 因为以前的做法仅适用于蛋白质, 因而不能推广用于其它分子. 如果有一个以上的氢原子连接到相同的原子, 氢原子名称的末尾将添加一个数字. 例如, 添加两个氢原子到<code>ND2</code>(天冬酰胺), 氢原子将被命名为<code>HD21</code>和<code>HD22</code>. 这很重要, 因为<code>.rtp</code>文件(参见5.6.1节)中的命名必须相同. 氢数据库的格式如下:</p>

<pre><code>; res    # additions
         # H add type    H    i    j    k
ALA      1
         1       1       H    N    -C   CA
ARG      4
         1       2       H    N    CA   C
         1       1       HE   NE   CD   CZ
         2       3       HH1  NH1  CZ   NE
         2       3       HH2  NH2  CZ   NE
</code></pre>

<p>第一行为残基名称(ALA或ARG)以及氢原子的类型数, 这些氢原子可根据氢数据库添加到残基中. 后面的行每行对应于一个氢原子的添加:</p>

<ul class="incremental">
<li><p>添加的氢原子数</p></li>
<li><p>添加氢原子的方法, 可能的方法如下:</p>

<p>1 <strong>单个平面氢原子, 如环或肽键</strong><br/>
产生一个氢原子(n), 置于原子(i,j,k)形成的平面内, 位于角(j-i-k)的平分线上, 距离原子i 0.1 nm, 并使角(n-i-j)和(n-i-k)大于90度.</p>

<p>2 <strong>单个氢原子, 例如羟基</strong><br/>
产生一个氢原子(n), 距离原子i 0.1 nm, 并使角(n-i-j)为109.5度, 二面角(n-i-j-k)为反式.</p>

<p>3 <strong>两个平面氢原子, 如乙烯 -C=CH<sub>2</sub>或酰胺 -C(=O)NH<sub>2</sub></strong><br/>
产生两个氢原子(n1,n2), 距离原子i 0.1 nm, 并使角(n1-i-j)与(n2-i-j)为120度, 二面角(n1-i-j-k)为顺式, (n2-i-j-k)为反式, 这样命名符合IUPAC标准[126].</p>

<p>4 <strong>两个或三个四面体氢原子, 例如-CH<sub>3</sub></strong><br/>
产生三个(n1,n2,n3)或两个(n1,n2)氢原子, 距离原子i 0.1 nm, 并使角(n1-i-j), (n2-i-j), (n3-i-j)都为109.47度, 二面角(n1-i-j-k)为反式, (n2-i-j-k)为反式+120度, (n3-i-j-k)=反式+240度.</p>

<p>5 <strong>单个四面体氢原子, 例如C<sub>3</sub>CH</strong><br/>
产生一个氢原子(n&#8216;), 距离原子i 0.1 nm, 处于四面体构型, 角(n&#8217;-i-j), (n&#8216;-i-k)和(n&#8217;-i-l)都为109.47度.</p>

<p>6 <strong>两个四面体氢原子, 如C-CH<sub>2</sub>-C</strong><br/>
产生两个氢原子(n1,n2), 距离原子i 0.1 nm, 处于四面体构型, 位于平分角j-i-k的平面上, 并且角(n1-i-n2), (n1-i-j)和(n1-ik)都为109.47度.</p>

<p>7 <strong>两个水中的氢原子</strong><br/>
根据SPC[81]水模型的几何构型在原子i周围产生两个氢原子. 对称轴交替位于三个坐标轴两个方向之间.</p>

<p>10 <strong>三个水中的&#8220;氢原子&#8221;</strong><br/>
根据SPC[81]水模型的几何构型在原子i周围产生两个氢原子. 对称轴交替位于三个坐标轴两个方向之间.
此外, 在氧原子位置产生一个额外的粒子, 并将其名称的第一个字母以&#8217;M&#8217;替代. 此方法用于四位点的水模型, 如TIP4P[125].</p>

<p>11 <strong>四个水中的&#8220;氢原子&#8221;</strong><br/>
同上, 但会在氧原子位置产生两个额外的粒子, 名字分别为&#8217;LP1&#8217;和&#8217;LP2&#8217;. 此方法用于五位点的水模型, 如TIP5P[127].</p></li>
<li><p>新的氢原子的名称(或其前缀, 如<code>HD2</code>, 对前面天冬酰胺的例子).</p></li>
<li><p>三或四个控制原子(i,j,k,l), 其中的第一个始终为与氢原子相连的原子, 另外两个或三个取决于所选的代码. 对于水, 只有一个控制原子.</p></li>
</ul>

<p>对一些非常特殊的情况, 可以利用上面的方法近似地解决, 并进行适当的能量最小化, 这样得到的构型用于MD模拟的初始构型已经足够好了. 例如对仲胺氢, 亚硝酰基氢(C=NH)甚至乙炔氢都可利用上面方法2羟基氢进行近似的添加.</p>

### 5.6.5 末端数据库

<p>末端数据库储存在<code>aminoacids.n.tdb</code>和<code>aminoacids.c.tdb</code>文件中, 分别对应于N端和C端. 文件包含了关于<code>pdb2gmx</code>程序如何将原子连接到已有原子, 应该删除或更改哪些原子, 应该添加哪些键相互作用的信息. 文件的格式如下(来源于<code>gromos43a1.ff/aminoacids.c.tdb</code>):</p>

<pre><code>[ None ]

[ COO- ]
[ replace ]
C      C    C    12.011      0.27
O      O1   OM   15.9994    -0.635
OXT    O2   OM   15.9994    -0.635
[ add ]
2   8   O   C   CA   N
OM     15.9994  -0.635
[ bonds ]
C  O1  gb_5
C  O2  gb_5
[ angles ]
O1  C  O2  ga_37
CA  C  O1  ga_21
CA  C  O2  ga_21
[ dihedrals ]
N   CA   C   O2   gd_20
[ impropers ]
C   CA   O2   O1   gi_1
</code></pre>

<p>该文件以块为组织, 每块的标题指定了块的名称. 这些块对应于可添加到分子的不同类型的末端. 在本例中<code>[ COO- ]</code>为第一块, 对应于将末端碳原子更改为去质子化的羧基. <code>[ None ]</code>为第二末端类型, 对应于维持分子原样的末端. 块名称不能取以下的任何一种: <code>replace</code>, <code>add</code>, <code>delete</code>, <code>bonds</code>, <code>angles</code>, <code>dihedrals</code>, <code>impropers</code>. 否则会干扰块的参数, 并可能令读者十分迷惑.</p>

<p>每个块可使用以下选项:</p>

<ul class="incremental">
<li><p><code>[ replace ]</code></p>

<p>将一个已有原子替换为具有不同原子类型, 原子名称, 电荷和/或质量的原子. 此项可用于替换输入坐标文件和<code>.rtp</code>数据库中的原子, 但也可用于仅仅重命名输入坐标中的原子, 以使它匹配力场中的名称. 对后一种情况, 也应该存在相应的<code>[ add ]</code>段, 用于指示如何添加相同的原子, 这样才能知道序列中的位置和成键. 这种原子可出现在输入坐标中并保持, 或不出现在输入坐标中而是通过<code>pdb2gmx</code>程序构建. 对于每一个要替换的原子, 应该输入具有以下域的一行:</p>

<ul class="incremental">
<li>要替换原子的名称</li>
<li>新的原子名称(可选)</li>
<li>新的原子类型</li>
<li>新的质量</li>
<li>新的电荷</li>
</ul></li>
<li><p><code>[ add ]</code></p>

<p>添加新的原子. 对于每一个(组)要添加的原子需要两行输入. 第一行包含与氢数据库相同的域(新原子的名称, 原子数目, 添加类型, 控制原子, 参见5.6.4节), 但增加了两个只用于C端的添加类型</p>

<p>8 <strong>双羧基氧原子, -COO<sup>-</sup></strong><br/>
根据规则3产生两个氧原子(n1,n2), 距离原子i 0.136 nm, 角(n1-i-j)和(n2-i-j)为117度</p>

<p>9 <strong>羧基氧原子和氢原子, -COOH</strong><br/>
根据规则3产生两个氧原子(n1,n2), n1和n2分别距离原子i 0.123 nm和0.125 nm, 角(n1-i-j)为121度, (n2-i-j)为115度. 根据规则2在n2周围产生一个氢原子(n&#8216;), 其中n&#8217;-n2-i和n&#8217;-n2-i-j应分别对应于n-i-j和n-i-j-k.</p>

<p>此行之后, 下面的一行指定了添加原子的细节, 与替换原子的方式相同, 即:</p>

<ul class="incremental">
<li>原子类型</li>
<li>质量</li>
<li>电荷</li>
<li>电荷组(可选)</li>
</ul>

<p>如氢数据库(参见5.6.1节)一样, 当一个以上的原子连接到一个已有原子时, 原子名称的末尾会追加一个数字. <strong>注意</strong>, 像在氢数据库中一样, 原子名称现在与控制原子处于同一行, 而在GROMACS 3.3版本之前它位于第二行的开始. 当电荷组域空白时, 添加的原子和它连接的原子将具有相同的电荷组编号.</p></li>
<li><p><code>[ delete ]</code></p>

<p>删除已有的原子. 每个原子名称一行.</p></li>
<li><p><code>[ bonds ]</code>, <code>[ angles ]</code>, <code>[ dihedrals ]</code>和<code>[ impropers ]</code></p>

<p>添加额外的键参数. 格式与<code>*.rtp</code>文件中使用的相同, 参见5.6.1节.</p></li>
</ul>

### 5.6.6 虚拟位点数据库

<p>由于不能依赖输入文件中氢的位置, 我们需要一个特殊的输入文件以确定要添加的虚拟氢位点的几何构型和参数. 为创建更复杂的虚拟位点(例如当保持整个芳香侧链刚性时), 我们还需要关于平衡键长和侧链中所有原子角度的信息. 对每个力场, 这些信息在<code>.vsd</code>文件中指定. 与末端类似, 对<code>.rtp</code>文件中每个残基类型都有一个这样的文件.</p>

<p>虚拟位点数据库真的不是一个非常简单的信息列表. 它开始的两段指定了用于CH<sub>3</sub>, NH<sub>3</sub>和NH<sub>2</sub>基团的质量中心(通常称为MCH<sub>3</sub>/MNH<sub>3</sub>). 根据氢原子和重原子之间的平衡键长和键角, 我们需要在这些质量中心之间施加略有不同的约束距离. <strong>注意</strong>, 我们 <strong>不</strong> 需要指定实际的参数(会自动生成), 而只需要指定使用的质量中心类型. 为此, 有三个段名称<code>[ CH3 ]</code>, <code>[ NH3 ]</code>和<code>[ NH2 ]</code>. 对每个段我们需要三列. 第一列为连接到2/3氢原子的原子类型, 第二列为连接的下一个重原子的类型, 第三列为使用的质量中心类型. 作为一种特殊情况, 在<code>[ NH2 ]</code>段的第二列也可以指定为<code>planar</code>, 代表将使用不同的构造方法, 而不使用质量中心. 对于NH<sub>2</sub>基团是否应为平面, 目前的一些力场观点不一, 但我们力图保持力场默认的平衡参数.</p>

<p>虚拟位点数据库的第二部分明确地包含芳香族侧链的原子对/三联组的平衡键长和键角. 目前, 虚拟位点生成代码的特定例程会读入这些项, 因此如果你想扩展它, 如扩展到核酸, 你需要编写新的代码. 这些段根据氨基酸的短名称进行命名(<code>[ PHE ]</code>, <code>[ TYR ]</code>, <code>[ TRP ]</code>, <code>[ HID ]</code>, <code>[ HIE ]</code>, <code>[ HIP ]</code>), 简单地包含2或3列原子名称, 接着是指定键长(以nm为单位)或键角(以度为单位)的数字. <strong>注意</strong>, 对整个分子的平衡几何构型有所近似, 如果分子未处于自然状态, 其单个键长/键角的值可能与平衡值不同.</p>

### 5.6.7 特殊键

<p><code>pdb2gmx</code>程序生成残基间化学键时使用的主要机制为, 从头到尾连接不同残基中的骨架原子进而形成大分子. 在某些情况下(如二硫键, 血红素基团, 支化聚合物), 有必要创建非骨架残基间的化学键. <code>specbond.dat</code>文件即用于此功能. 残基必须属于相同的<code>[ moleculetype ]</code>. 当操纵不同链之间的特殊残基间的化学键时, <code>pdb2gmx</code>程序的<code>-merge</code>和<code>-chainsep</code>功能很有用.</p>

<p><code>specbond.dat</code>文件的第一行表示文件中的条目数. 如果你添加了一个新的条目, 请确保增加此数字. 文件的其余行提供创建键的具体说明. 行的格式如下:</p>

<p><code>resA atomA nbondsA resB atomB nbondsB length newresA newresB</code></p>

<p>分别代表:</p>

<ol class="incremental">
<li><code>resA</code> 参与成键的残基A的名称.</li>
<li><code>atomA</code> 残基A中形成键的原子的名称.</li>
<li><code>nbondsA</code> <code>atomA</code>可以形成的键的总数.</li>
<li><code>resB</code> 参与成键的残基B的名称.</li>
<li><code>atomB</code> 残基B中形成键的原子的名称.</li>
<li><code>nbondsB</code> <code>atomB</code>可以形成的键的总数.</li>
<li><code>length</code> 键的参考长度. 在提供给<code>pdb2gmx</code>程序的坐标文件中, 若<code>atomA</code>和<code>atomB</code>之间的距离不在<code>length</code>±10%范围内, 它们之间不会形成键.</li>
<li><code>newresA</code> 残基A的新名称, 如果必要. 有些力场对与二硫键或血红素相连的半胱氨酸使用了CYS2之类的名称.</li>
<li><code>newresb</code> 残基B的新名称, 同上.</li>
</ol>

## 5.7 文件格式

### 5.7.1 拓扑文件

<p>拓扑文件是根据GROMACS对分子拓扑的具体说明建立的. 可利用<code>pdb2gmx</code>程序生成<code>*.top</code>文件. 拓扑文件中所有可能的输入项都列于表 5.4和表 5.5中. 表中还列有: 所有参数的单位, 哪些相互作用可被微扰以用于自由能计算, <code>grompp</code>可使用哪些键合相互作用生成排除, <code>grompp</code>可将哪些键合相互作用转化为约束.</p>

<table><caption> 表5.4: 拓扑(<code>*.top</code>)文件</caption>
<tr>
<td colspan="6" style="text-align:center;"> <h6>参数</h6> </td>
</tr>
<tr>
<th style="text-align:center;"> 相互作用类型 </th>
<th style="text-align:center;">指令</th>
<th style="text-align:center;"> 原子数 </th>
<th style="text-align:center;">函数类型</th>
<th style="text-align:center;">参数</th>
<th style="text-align:center;">自由能</th>
</tr>
<tr>
<td style="text-align:center;"> 必需         </td>
<td style="text-align:center;"><code>defaults</code></td>
<td colspan="2" style="text-align:center;"> </td>
<td style="text-align:center;">非键函数类型; 组合规则<sup>cr</sup>; 生成对(no/yes); fudge LJ(); fudge QQ()</td>
<td style="text-align:center;"></td>
</tr>
<tr>
<td style="text-align:center;"> 必需         </td>
<td style="text-align:center;"><code>atomtypes</code></td>
<td colspan="2" style="text-align:center;"> </td>
<td style="text-align:left;">原子类型; 质量m(u); 电荷q(e); 粒子类型; V<sup>cr</sup>; W<sup>cr</sup></td>
<td style="text-align:center;"></td>
</tr>
<tr>
<td style="text-align:center;">              </td>
<td style="text-align:center;"><code>bondtypes</code></td>
<td colspan="4" style="text-align:center;"> (参考表 5.5 <code>bonds</code>指令)       </td>
</tr>
<tr>
<td style="text-align:center;">              </td>
<td style="text-align:center;"><code>pairtypes</code></td>
<td colspan="4" style="text-align:center;"> (参考表 5.5 <code>pairs</code>指令)       </td>
</tr>
<tr>
<td style="text-align:center;">              </td>
<td style="text-align:center;"><code>angletypes</code></td>
<td colspan="4" style="text-align:center;"> (参考表 5.5 <code>angles</code>指令)      </td>
</tr>
<tr>
<td style="text-align:center;">              </td>
<td style="text-align:center;"><code>dihedraltypes</code><sup>*</sup></td>
<td colspan="4" style="text-align:center;"> (参考表 5.5 <code>dihedrals</code>指令)   </td>
</tr>
<tr>
<td style="text-align:center;">              </td>
<td style="text-align:center;"><code>constrainttypes</code></td>
<td colspan="4" style="text-align:center;"> (参考表 5.5 <code>constraints</code>指令) </td>
</tr>
<tr>
<td style="text-align:center;"> LJ           </td>
<td style="text-align:center;"><code>nonbond_params</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">V<sup>cr</sup>; W<sup>cr</sup></td>
<td style="text-align:center;"></td>
</tr>
<tr>
<td style="text-align:center;"> Buckingham   </td>
<td style="text-align:center;"><code>nonbond_params</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">a(kJ mol<sup>-1</sup>); b(nm<sup>-1</sup>); c6(kJ mol<sup>-1</sup> nm<sup>6</sup>)</td>
<td style="text-align:center;"></td>
</tr>
<tr>
<td colspan="6" style="text-align:center;"> <h6>分子定义</h6>  </td>
</tr>
<tr>
<th style="text-align:center;"> 相互作用类型 </th>
<th style="text-align:center;">指令</th>
<th style="text-align:center;"> 原子数 </th>
<th style="text-align:center;">函数类型</th>
<th style="text-align:center;">参数</th>
<th style="text-align:center;">自由能</th>
</tr>
<tr>
<td style="text-align:center;"> 必需         </td>
<td style="text-align:center;"><code>moleculetype</code></td>
<td style="text-align:center;">   </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">分子名称; n<sub>ex</sub><sup>nrexcl</sup></td>
<td style="text-align:center;"></td>
</tr>
<tr>
<td style="text-align:center;"> 必需         </td>
<td style="text-align:center;"><code>atoms</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">原子类型; 残基编号; 残基名称; 原子名称; 电荷组编号; 电荷q(e); 质量m(u)</td>
<td style="text-align:center;">类型, q, m</td>
</tr>
<tr>
<td colspan="6" style="text-align:center;"> 分子内相互作用和几何构型定义见表 5.5 </td>
</tr>
<tr>
<td colspan="6" style="text-align:center;"> <h6>系统</h6>  </td>
</tr>
<tr>
<th style="text-align:center;"> 相互作用类型 </th>
<th style="text-align:center;">指令</th>
<th style="text-align:center;"> 原子数 </th>
<th style="text-align:center;">函数类型</th>
<th style="text-align:center;">参数</th>
<th style="text-align:center;">自由能</th>
</tr>
<tr>
<td style="text-align:center;"> 必需         </td>
<td style="text-align:center;"><code>system</code></td>
<td style="text-align:center;">   </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">系统名称</td>
<td style="text-align:center;"></td>
</tr>
<tr>
<td style="text-align:center;"> 必需         </td>
<td style="text-align:center;"><code>molecules</code></td>
<td style="text-align:center;">   </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">分子名称; 分子数</td>
<td style="text-align:center;"></td>
</tr>
</table>

<ul class="incremental">
<li>原子数: 对每个指令需要的原子类型的数目</li>
<li>函数类型: 要选择的函数类型</li>
<li>自由能: 表示自由能计算时这种相互作用的哪些参数可以进行插值</li>
<li>^cr^: 组合规则确定LJ参数的类型, 参见5.3.2节</li>
<li>^*^: 对<code>dihedraltypes</code>可指定4个原子或两个内原子(对异常二面角则设定两个外原子)</li>
<li>^nrexcl^: 对非键相互作用, 排除相邻的n<sub>ex</sub>个键</li>
<li>对于自由能计算, 在正常参数之后, 类型, 电荷q和质量m或无参数添加到同一行上的拓扑&#8217;B&#8217;(λ=1).</li>
</ul>

<table><caption> 表 5.5: <code>[ moleculetype ]</code>指令详解</caption>
<tr>
<th style="text-align:center;"> 相互作用名称 </th>
<th style="text-align:center;">拓扑文件指令</th>
<th style="text-align:center;"> 原子数<sup>*</sup> </th>
<th style="text-align:center;">函数类型<sup>†</sup></th>
<th style="text-align:center;">参数顺序及其单位</th>
<th style="text-align:center;">用于自由能计算?<sup>‡</sup></th>
<th style="text-align:center;">交叉参考(节)</th>
</tr>
<tr>
<td style="text-align:center;"> 键      </td>
<td style="text-align:center;"><code>bonds</code><sup>§,¶</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(b_0\)(nm); \(k_b\) (kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.1</td>
</tr>
<tr>
<td style="text-align:center;"> G96键   </td>
<td style="text-align:center;"><code>bonds</code><sup>§,¶</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(b_0\)(nm); \(k_b\)(kJ mol<sup>-1</sup> nm<sup>-4</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.1</td>
</tr>
<tr>
<td style="text-align:center;"> Morse键 </td>
<td style="text-align:center;"><code>bonds</code><sup>§,¶</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">3</td>
<td style="text-align:center;">\(b_0\)(nm); \(D\)(kJ mol<sup>-1</sup>); \(\b\)(nm<sup>-1</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.2</td>
</tr>
<tr>
<td style="text-align:center;"> 立方键  </td>
<td style="text-align:center;"><code>bonds</code><sup>§,¶</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">4</td>
<td style="text-align:center;">\(b_0\)(nm); \(C_{i&#61;2,3}\)(kJ mol<sup>-1</sup> nm<sup>-i</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.3</td>
</tr>
<tr>
<td style="text-align:center;"> 连接    </td>
<td style="text-align:center;"><code>bonds</code><sup>§</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">5</td>
<td colspan="2" style="text-align:center;"></td>
<td style="text-align:center;">5.4</td>
</tr>
<tr>
<td style="text-align:center;"> 简谐势  </td>
<td style="text-align:center;"><code>bonds</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">6</td>
<td style="text-align:center;">\(b_0\)(nm); \(k_b\) (kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.1, 5.4</td>
</tr>
<tr>
<td style="text-align:center;"> FENE键  </td>
<td style="text-align:center;"><code>bonds</code><sup>§</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">7</td>
<td style="text-align:center;">\(b_m\)(nm); \(k_b\) (kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.4</td>
</tr>
<tr>
<td style="text-align:center;"> 表格键  </td>
<td style="text-align:center;"><code>bonds</code><sup>§</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">8</td>
<td style="text-align:center;">表号(≥0); \(k\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">\(k\)</td>
<td style="text-align:center;">4.2.14</td>
</tr>
<tr>
<td style="text-align:center;"> 表格键\(^\lVert\) </td>
<td style="text-align:center;"><code>bonds</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">9</td>
<td style="text-align:center;">表号(≥0); \(k\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">\(k\)</td>
<td style="text-align:center;">4.2.14, 5.4</td>
</tr>
<tr>
<td style="text-align:center;"> 约束势  </td>
<td style="text-align:center;"><code>bonds</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">10</td>
<td style="text-align:center;">下限,上限1,上限2(nm); \(k_{dr}\)(kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.3.5</td>
</tr>
<tr>
<td style="text-align:center;"> 额外LJ或库仑 </td>
<td style="text-align:center;"><code>pairs</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">V<sup>**</sup>; W<sup>**</sup></td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">5.3.4</td>
</tr>
<tr>
<td style="text-align:center;"> 额外LJ或库仑 </td>
<td style="text-align:center;"><code>pairs</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">fudge QQ(); q<sub>i</sub>, q<sub>j</sub>(e); V<sup>**</sup>; W<sup>**</sup></td>
<td style="text-align:center;"></td>
<td style="text-align:center;">5.3.4</td>
</tr>
<tr>
<td style="text-align:center;"> 额外LJ或库仑 </td>
<td style="text-align:center;"><code>pairs_nb</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">q<sub>i</sub>, q<sub>j</sub>(e); V<sup>**</sup>; W<sup>**</sup></td>
<td style="text-align:center;"></td>
<td style="text-align:center;">5.3.4</td>
</tr>
<tr>
<td style="text-align:center;"> 键角             </td>
<td style="text-align:center;"><code>angles</code><sup>¶</sup></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(\q_0\)(deg); \(k_\q\)(kJ mol<sup>-1</sup> rad<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.5</td>
</tr>
<tr>
<td style="text-align:center;"> G96键角          </td>
<td style="text-align:center;"><code>angles</code><sup>¶</sup></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(\q_0\)(deg); \(k_\q\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.6</td>
</tr>
<tr>
<td style="text-align:center;"> 键-键交叉项      </td>
<td style="text-align:center;"><code>angles</code></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">3</td>
<td style="text-align:center;">\(r_{1e},r_{2e}\)(nm); \(k_{rr'}\)(kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.9</td>
</tr>
<tr>
<td style="text-align:center;"> 键-角交叉项      </td>
<td style="text-align:center;"><code>angles</code></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">4</td>
<td style="text-align:center;">\(r_{1e},r_{2e},r_{3e}\)(nm); \(k_{r\q}\)(kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.10</td>
</tr>
<tr>
<td style="text-align:center;"> Urey-Bradley键角 </td>
<td style="text-align:center;"><code>angles</code><sup>¶</sup></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">5</td>
<td style="text-align:center;">\(\q_0\)(deg); \(k_\q\)(kJ mol<sup>-1</sup> rad<sup>-2</sup>); \(r_{13}\)(nm); </br>\(k_{UB}\)(kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.8</td>
</tr>
<tr>
<td style="text-align:center;"> 四次键角         </td>
<td style="text-align:center;"><code>angles</code><sup>¶</sup></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">6</td>
<td style="text-align:center;">\(\q_0\)(deg); \(C_{i&#61;0,1,2,3,4}\)(kJ mol<sup>-1</sup> rad<sup>-i</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.11</td>
</tr>
<tr>
<td style="text-align:center;"> 表格角           </td>
<td style="text-align:center;"><code>angles</code></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">8</td>
<td style="text-align:center;">表号(≥0); \(k\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">\(k\)</td>
<td style="text-align:center;">4.2.14</td>
</tr>
<tr>
<td style="text-align:center;"> 限制弯曲势       </td>
<td style="text-align:center;"><code>angles</code></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">10</td>
<td style="text-align:center;">\(\q_0\)(deg); \(k_\q\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.7</td>
</tr>
<tr>
<td style="text-align:center;"> 正常二面角               </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(\f_s\)(deg); \(k_\f\)(kJ mol<sup>-1</sup>); 多重数</td>
<td style="text-align:center;">\(\f,k\)</td>
<td style="text-align:center;">4.2.13</td>
</tr>
<tr>
<td style="text-align:center;"> 异常二面角               </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(\x_0\)(deg); \(k_\x\)(kJ mol<sup>-1</sup> rad<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.12</td>
</tr>
<tr>
<td style="text-align:center;"> Ryckaert-Bellemans二面角 </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">3</td>
<td style="text-align:center;">\(C_0, C_1, C_2, C_3, C_4, C_5\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.13</td>
</tr>
<tr>
<td style="text-align:center;"> 周期异常二面角           </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">4</td>
<td style="text-align:center;">\(\f_s\)(deg); \(k_\f\)(kJ mol<sup>-1</sup>); 多重数</td>
<td style="text-align:center;">\(\f,k\)</td>
<td style="text-align:center;">4.2.12</td>
</tr>
<tr>
<td style="text-align:center;"> 傅立叶二面角             </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">5</td>
<td style="text-align:center;">\(C_0, C_1, C_2, C_3, C_4\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.2.13</td>
</tr>
<tr>
<td style="text-align:center;"> 表格二面角               </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">8</td>
<td style="text-align:center;">表号(≥0); \(k\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;">\(k\)</td>
<td style="text-align:center;">4.2.14</td>
</tr>
<tr>
<td style="text-align:center;"> 正常二面角(多重)         </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">9</td>
<td style="text-align:center;">\(\f_s\)(deg); \(k_\f\)(kJ mol<sup>-1</sup>); 多重数</td>
<td style="text-align:center;">\(\f,k\)</td>
<td style="text-align:center;">4.2.13</td>
</tr>
<tr>
<td style="text-align:center;"> 限制二面角               </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">11</td>
<td style="text-align:center;">\(\f_0\)(deg); \(k_\f\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.13</td>
</tr>
<tr>
<td style="text-align:center;"> 结合弯区扭转势           </td>
<td style="text-align:center;"><code>dihedrals</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">10</td>
<td style="text-align:center;">\(a_0, a_1, a_2, a_3, a_4\)(kJ mol<sup>-1</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.2.13</td>
</tr>
<tr>
<td style="text-align:center;"> 排除               </td>
<td style="text-align:center;"><code>exclusions</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">一个或多个原子索引号</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">5.4</td>
</tr>
<tr>
<td style="text-align:center;"> 约束               </td>
<td style="text-align:center;"><code>constraints</code><sup>§</sup></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(b_0\)(nm)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.5, 5.5</td>
</tr>
<tr>
<td style="text-align:center;"> 约束\(^\lVert\)      </td>
<td style="text-align:center;"><code>constraints</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(b_0\)(nm)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.5, 5.5, 5.4</td>
</tr>
<tr>
<td style="text-align:center;"> SETTLE             </td>
<td style="text-align:center;"><code>settles</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(d_{\text{oh}}, d_{\text{HH}}\)(nm)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">3.6.1, 5.5</td>
</tr>
<tr>
<td style="text-align:center;"> 二体虚拟站点       </td>
<td style="text-align:center;"><code>virtual_sites2</code></td>
<td style="text-align:center;"> 3 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(a\)()</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> 三体虚拟站点       </td>
<td style="text-align:center;"><code>virtual_sites3</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(a,b\)()</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> 三体虚拟站点(fd)   </td>
<td style="text-align:center;"><code>virtual_sites3</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(a\)(); \(d\)(nm)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> 三体虚拟站点(fad)  </td>
<td style="text-align:center;"><code>virtual_sites3</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">3</td>
<td style="text-align:center;">\(\q\)(deg); \(d\)(nm)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> 三体虚拟站点(out)  </td>
<td style="text-align:center;"><code>virtual_sites3</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">4</td>
<td style="text-align:center;">\(a,b\)(); \(c\)(nm<sup>-1</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> 四体虚拟站点(fdn)  </td>
<td style="text-align:center;"><code>virtual_sites4</code></td>
<td style="text-align:center;"> 5 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(a,b\)(); \(c\)(nm)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> N体虚拟站点(COG)   </td>
<td style="text-align:center;"><code>virtual_sitesn</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">一个或多个构建原子索引号</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> N体虚拟站点(COM)   </td>
<td style="text-align:center;"><code>virtual_sitesn</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">一个或多个构建原子索引号</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> N体虚拟站点(COW)   </td>
<td style="text-align:center;"><code>virtual_sitesn</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;">3</td>
<td style="text-align:center;">一对或多对构建原子的索引号与权重</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.7</td>
</tr>
<tr>
<td style="text-align:center;"> 位置约束           </td>
<td style="text-align:center;"><code>position_restraints</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(k_x,k_y,k_z\)(kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.3.1</td>
</tr>
<tr>
<td style="text-align:center;"> 平底位置约束       </td>
<td style="text-align:center;"><code>position_restraints</code></td>
<td style="text-align:center;"> 1 </td>
<td style="text-align:center;">2</td>
<td style="text-align:center;">\(g,r\)(nm), \(k\)(kJ mol<sup>-1</sup> nm<sup>-2</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.3.2</td>
</tr>
<tr>
<td style="text-align:center;"> 距离约束           </td>
<td style="text-align:center;"><code>distance_restraints</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">类型; 标签; 下限, 上限1, 上限2(nm); 权重()</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.3.5</td>
</tr>
<tr>
<td style="text-align:center;"> 二面角约束         </td>
<td style="text-align:center;"><code>dihedral_restraints</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(\f_0\)(deg); \(\D\f\)(deg);</td>
<td style="text-align:center;">所有</td>
<td style="text-align:center;">4.3.4</td>
</tr>
<tr>
<td style="text-align:center;"> 方向约束           </td>
<td style="text-align:center;"><code>orientation_restraints</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">exp.; 标签; \(\a\); \(c\)(U nm<sup>\(\a\)</sup>); obs.(U); 权重(U<sup>-1</sup>)</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">4.3.6</td>
</tr>
<tr>
<td style="text-align:center;"> 角度约束          </td>
<td style="text-align:center;"><code>angle_restraints</code></td>
<td style="text-align:center;"> 4 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(\q_0\)(deg); \(k_c\)(kJ mol<sup>-1</sup>); 多重数</td>
<td style="text-align:center;">\(\q,k\)</td>
<td style="text-align:center;">4.3.3</td>
</tr>
<tr>
<td style="text-align:center;"> 角度约束(z)       </td>
<td style="text-align:center;"><code>angle_restraints_z</code></td>
<td style="text-align:center;"> 2 </td>
<td style="text-align:center;">1</td>
<td style="text-align:center;">\(\q_0\)(deg); \(k_c\)(kJ mol<sup>-1</sup>); 多重数</td>
<td style="text-align:center;">\(\q,k\)</td>
<td style="text-align:center;">4.3.3</td>
</tr>
</table>

<ul class="incremental">
<li>*: 指令所需的原子数目</li>
<li>†: 用于选择的函数类型编号</li>
<li>‡: 表示自由能计算时这种相互作用的哪些参数可以进行插值</li>
<li>§: <code>grompp</code>会利用这种相互作用类型产生排除</li>
<li>¶: <code>grompp</code>会将这种相互作用类型转换为约束</li>
<li>**: 组合规则确定LJ参数的类型, 参见5.3.2节</li>
<li><span class="math">\(\lVert\)</span>: 无连接, 因此不会为这种相互作用产生排除</li>
</ul>

<p>文件布局说明:</p>

<ul class="incremental">
<li><p>分号(<code>;</code>)和换行符之间为注释</p></li>
<li><p>忽略<code>\</code>后的换行符, 即<code>\</code>为续行符</p></li>
<li><p><code>[</code> 和 <code>]</code> 之间为指令</p></li>
<li><p>拓扑等级(必须遵循)包含三个层次:</p>

<ul class="incremental">
<li>参数级别, 定义了一些力场的设定(见表 5.4)</li>
<li>分子级别, 应包含一个或多个分子的定义(见表 5.5)</li>
<li>体系级别, 只包含体系的特定信息(<code>[ system ]</code>及<code>[ molecules ]</code>)</li>
</ul></li>
<li><p>每一项应用空格或制表符分格, 而不是逗号</p></li>
<li><p>分子中的原子应从1开始连续编号</p></li>
<li><p>相同电荷组中的原子必须连续列出</p></li>
<li><p>文件只解析一次, 这意味着不会处理向前引用: 每一项在使用前必须进行定义</p></li>
<li><p>可以从键生成排除, 或手动覆盖</p></li>
<li><p>可以从原子类型生成键合力的类型, 或对每条键覆盖</p></li>
<li><p>在同一个原子上可以使用多个相同类型的键合相互作用</p></li>
<li><p>强烈推荐使用描述性的注释行和空行</p></li>
<li><p>自GROMACS 3.1.3版本开始, 参数级别的所有指令可使用多次, 并且没有顺序限制, 除了在其它参数定义中, 原子类型在使用前需要进行定义</p></li>
<li><p>对相同的原子类型组合, 如果某个相互作用的参数被定义了多次, 会使用最后定义的参数; 自GROMACS 3.1.3版本开始, 参数若存在不同值的重定义, <code>grompp</code>会生成警告</p></li>
<li><p>在<code>[ moleculetype ]</code>之前使用<code>[ atoms ]</code>, <code>[ bonds ]</code>, <code>[ pairs ]</code>, <code>[ angles ]</code>等指令毫无意义, 会导致警告</p></li>
<li><p>在<code>[ system ]</code>之前使用<code>[ molecules ]</code>指令毫无意义, 会导致警告</p></li>
<li><p>在<code>[ system ]</code>之后唯一可以使用的指令是<code>[ molecules ]</code></p></li>
<li><p>在<code>[ ]</code>中使用未知的字符串会导致直到下一个指令的所有数据被忽略, 并产生警告</p></li>
</ul>

<p>下面是拓扑文件的一个例子, <code>urea.top</code>:</p>

<pre><code>;
;       Example topology file
;
; The force-field files to be included
#include &quot;amber99.ff/forcefield.itp&quot;

[ moleculetype ]
; name nrexcl
Urea        3

[ atoms ]
   1  C  1  URE    C    1     0.880229    12.01000    ; amber C type
   2  O  1  URE    O    2    -0.613359    16.00000    ; amber O type
   3  N  1  URE   N1    3    -0.923545    14.01000    ; amber N type
   4  H  1  URE  H11    4     0.395055     1.00800    ; amber H type
   5  H  1  URE  H12    5     0.395055     1.00800    ; amber H type
   6  N  1  URE   N2    6    -0.923545    14.01000    ; amber N type
   7  H  1  URE  H21    7     0.395055     1.00800    ; amber H type
   8  H  1  URE  H22    8     0.395055     1.00800    ; amber H type

[ bonds ]
    1 2
    1 3
    1 6
    3 4
    3 5
    6 7
    6 8

[ dihedrals ]
;   ai    aj    ak    al    funct definition
     2     1     3     4      9
     2     1     3     5      9
     2     1     6     7      9
     2     1     6     8      9
     3     1     6     7      9
     3     1     6     8      9
     6     1     3     4      9
     6     1     3     5      9

[ dihedrals ]
     3     6     1     2      4
     1     4     3     5      4
     1     7     6     8      4

[ position_restraints ]
; you wouldn't normally use this for a molecule like Urea,
; but we include it here for didactic purposes
; ai    funct    fc
   1      1     1000  1000  1000    ; Restrain to a point
   2      1     1000     0  1000    ; Restrain to a line (Y-axis)
   3      1     1000     0     0    ; Restrain to a plane (Y-Z-plane)

[ dihedral_restraints ]
; ai  aj  ak  al  type  label  phi  dphi  kfac  power
   3   6   1   2     1      1  180     0     1     2
   1   4   3   5     1      1  180     0     1     2

; Include TIP3P water topology
#include &quot;amber99/tip3p.itp&quot;

[ system ]
Urea in Water

[ molecules ]
;molecule name    nr.
Urea              1
SOL               1000
</code></pre>

<p>下面是此文件的解释说明.</p>

<p><code>#include &quot;amber99.ff/forcefield.itp&quot;</code>: 包含你正使用的力场的信息, 包括键和非键参数. 本例使用了AMBER99力场, 但你进行模拟时可使用不同的力场. <code>grompp</code>会自动找到这个文件并复制粘贴它的内容. 你可以在<code>share/top/amber99.ff/forcefield.itp</code>文件中看到它的内容</p>

<pre><code>#define _FF_AMBER
#define _FF_AMBER99

[ defaults ]
; nbfunc    comb-rule    gen-pairs    fudgeLJ    fudgeQQ
1           2            yes          0.5        0.8333

#include &quot;ffnonbonded.itp&quot;
#include &quot;ffbonded.itp&quot;
#include &quot;gbsa.itp&quot;
</code></pre>

<p>两个<code>#define</code>语句设置了条件, 这样拓扑文件后面的部分可以知道使用了AMBER 99力场.</p>

<p><code>[ defaults ]</code>:</p>

<ul class="incremental">
<li><code>nbfunc</code>为非键函数类型, 取1(Lennard-Jones)或2(Buckingham)</li>
<li><code>comb-rule</code>为组合规则的编号(参见5.3.2节).</li>
<li><code>gen-pairs</code>用于对的生成. 默认为&#8217;no&#8217;, 即得到对类型列表的1&#8211;4的参数. 当列表中不存在参数时, 会导致致命错误并停止运行. 设置为&#8217;yes&#8217;会根据使用<code>fudgeLJ</code>的正常Lennard-Jones参数, 生成不存在于配对列表中的1&#8211;4参数</li>
<li><code>fudgeLJ</code>为Lennard-Jones 1&#8211;4相互作用的修正因子, 默认为1</li>
<li><code>fudgeQQ</code>为静电1&#8211;4相互作用的修正因子, 默认为1</li>
<li>N为6-N势中排斥项的次数(只用于非键Lennard-Jones), 自GROMACS 4.5版本开始, <code>mdrun</code>会读取和使用N, 当N不等于12时, 使用表格相互作用函数(在旧版本中, 你必须使用用户自定义的表格相互作用).</li>
</ul>

<p><strong>注意</strong>, <code>gen-pairs</code>, <code>fudgeLJ</code>, <code>fudgeQQ</code>和N是可选的. 仅当<code>gen-pairs</code>被设置为&#8217;yes&#8217;时才会使用<code>fudgeLJ</code>, 而总会使用<code>fudgeQQ</code>. 然而, 如果你想指定N, 你也需要给出其他参数的值.</p>

<p>后面的其他一些<code>#include</code>语句用于添加描述力场其余部分所需的大量数据. 我们将跳过这些并回到<code>urea.top</code>文件. 在那里, 我们会看到</p>

<p><code>[ moleculetype ]</code>: 定义此<code>*.top</code>文件中分子的名称, nrexcl=3代表排除不远于三条键的原子之间的非键相互作用.</p>

<p><code>[ atoms ]</code>: 定义分子, 其中<code>nr</code>和<code>type</code>是固定的, 其余的由用户自定义. 因此<code>atom</code>可以随意命名, <code>cgnr</code>可大可小(如果可能, 一个电荷组的总电荷应为零), 这里的电荷也可以更改.</p>

<p><code>[ bonds ]</code>: 不注释.</p>

<p><code>[ pairs ]</code>: LJ和库仑的1&#8211;4相互作用</p>

<p><code>[ angles ]</code>: 不注释.</p>

<p><code>[ dihedrals ]</code>: 在此情况下, 有9个正常二面角(funct=1), 3个异常二面角(funct=4), 没有Ryckaert-Bellemans型的二面角. 如果你想在拓扑文件中包含Ryckaert-Bellemans型的二面角, 请遵照下列的示例(例如, 对癸烷):</p>

<p>[ dihedrals ]
; ai aj ak al funct c0 c1 c2
 1 2 3 4 3
 2 3 4 5 3</p>

<p>在烷烃势能的原始实现中[128], 没有使用1&#8211;4相互作用, 这意味着为了使用这个特定的力场, 你需要从拓扑文件的<code>[ pairs ]</code>段中移除1&#8211;4相互作用. 对大多数的现代力场, 如OPLS/AA或Amber, 其规则是不同的, Ryckaert-Bellemans势是作为余弦序列与1&#8211;4相互作用一起使用的.</p>

<p><code>[ position_restraints ]</code>: 利用简谐势将选中的粒子约束在参考位置(参见4.3.1节). <code>grompp</code>会从由单独的坐标文件中读取参考位置.</p>

<p><code>[ dihedral_restraints ]</code>: 将选定的二面角约束在参考值. 二面角约束的实现方法参见本手册4.3.4节的论述. <code>[ dihedral_restraints ]</code>指令中设定的参数如下:</p>

<ul class="incremental">
<li><p><code>type</code> 只有一个可能的值, 1</p></li>
<li><p><code>label</code> 未使用, 并被从代码删除.</p></li>
<li><p><code>phi</code> 为本手册方程4.84和4.85中的 <span class="math">\(\f_0\)</span> 值.</p></li>
<li><p><code>dphi</code> 为本手册方程4.85中的 <span class="math">\(\D \f\)</span> 值.</p></li>
<li><p><code>kfac</code> 类似于距离约束中的<code>fac</code>, 是力常数的修正因子. 通过它, 可以利用不同的力常数维持不同的约束.</p></li>
<li><p><code>power</code> 未使用, 并被从代码删除.</p></li>
</ul>

<p><code>#include &quot;tip3p.itp&quot;</code>: 包括一个已经构建好的拓扑文件(参见5.7.2节).</p>

<p><code>[ system ]</code>: 体系的标题, 用户自定义</p>

<p><code>[ molecules ]</code>: 定义体系中分子(亚分子)的总数, 这些分子已经在此<code>*.top</code>中进行了定义. 在这个示例文件中, 它代表1个尿素分子溶于1000个水分子中. 分子类型SOL是在<code>tip3p.itp</code>文件中定义的. 这里的每个名称必须对应于拓扑文件前面的<code>[ moleculetype ]</code>中给出的名称. 分子类型块的顺序, 这些分子的数目必须与坐标文件匹配, 坐标文件和拓扑文件会一起提供给<code>grompp</code>. 分子块不需要连续, 但某些工具(如<code>genion</code>)可能只对一个特定分子类型的第一或最后一块起作用. 另外, 这些块与组的定义无关(参见3.3节和8.1节).</p>

### 5.7.2 Molecule.itp文件

<p>如果你构建了一个拓扑文件并且经常使用(像水分子, 已经构建好的<code>tip3p.itp</code>), 将它做成<code>molecule.itp</code>文件更好一些. 此文件中只列出了一个特定分子的信息, 你可以在多个体系中重用<code>[ moleculetype ]</code>, 而无需重新调用<code>pdb2gmx</code>或手动复制粘贴. 例子<code>urea.itp</code>如下:</p>

<pre><code>[ moleculetype ]
; molname nrexcl
URE 3

[ atoms ]
   1  C  1  URE    C    1  0.880229  12.01000  ; amber C type
...
   8  H  1  URE  H22    8  0.395055   1.00800  ; amber H type

[ bonds ]
    1 2
...
    6 8

[ dihedrals ]
;   ai  aj  ak  al  funct  definition
     2   1   3   4    9
...
     6   1   3   5    9

[ dihedrals ]
     3   6   1   2    4
     1   4   3   5    4
     1   7   6   8    4
</code></pre>

<p>使用<code>*.itp</code>文件会使<code>*.top</code>文件明显变短:</p>

<pre><code>;       Example topology file
;
; The force field files to be included
#include &quot;amber99.ff/forcefield.itp&quot;

#include &quot;urea.itp&quot;

; Include TIP3P water topology
#include &quot;amber99/tip3p.itp&quot;

[ system ]
Urea in Water

[ molecules ]
;molecule name    nr.
Urea              1
SOL               1000
</code></pre>

### 5.7.3 ifdef语句

<p>GROMACS有一个非常强大的功能, 你可以在<code>*.top</code>文件中使用<code>#ifdef</code>语句. 通过使用这条语句以及相关的<code>#define</code>语句, 像在前面的<code>amber99.ff/forcefield.itp</code>文件中那样, 在同一个<code>*.top</code>文件中可以为分子使用不同的参数. 下面给出TFE的一个例子, 其中的一个选项对原子使用了不同的电荷: De Loof等人给出的电荷[129]或Van Buuren和Berendsen给出的电荷[130]. 实际上, 你可以使用C预处理器<code>cpp</code>的许多功能, 因为<code>grompp</code>包含了类似的预处理函数以扫描文件. 使用<code>#ifdef</code>选项的方式如下:</p>

<ul class="incremental">
<li><p>在<code>*.mdp</code>文件(包含<code>grompp</code>输入参数)中使用选项<code>define = -DDeLoof</code>, 或在<code>*.top</code>中早些使用<code>#define DeLoof</code>, 并且</p></li>
<li><p>将<code>#ifdef</code>语句放在<code>*.top</code>中, 如所示:</p>

<pre><code>...

[ atoms ]
; nr type resnr residu atom cgnr charge mass
#ifdef DeLoof
; Use Charges from DeLoof
   1        C        1        TFE    C    1     0.74
   2        F        1        TFE    F    1    -0.25
   3        F        1        TFE    F    1    -0.25
   4        F        1        TFE    F    1    -0.25
   5      CH2        1        TFE  CH2    1     0.25
   6       OA        1        TFE   OA    1    -0.65
   7       HO        1        TFE   HO    1     0.41
#else
; Use Charges from VanBuuren
   1        C        1        TFE    C    1      0.59
   2        F        1        TFE    F    1     -0.2
   3        F        1        TFE    F    1     -0.2
   4        F        1        TFE    F    1     -0.2
   5      CH2        1        TFE  CH2    1      0.26
   6       OA        1        TFE   OA    1     -0.55
   7       HO        1        TFE   HO    1      0.3
#endif

[ bonds ]
;  ai    aj  funct           c0           c1
    6     7      1 1.000000e-01 3.138000e+05
    1     2      1 1.360000e-01 4.184000e+05
    1     3      1 1.360000e-01 4.184000e+05
    1     4      1 1.360000e-01 4.184000e+05
    1     5      1 1.530000e-01 3.347000e+05
    5     6      1 1.430000e-01 3.347000e+05
...
</code></pre></li>
</ul>

<p><code>pdb2gmx</code>使用这个机制来实现可选的位置约束(4.3.1节), 具体是通过使用<code>#include</code>包含<code>.itp</code>文件, 而此文件的只有设置了特定的<code>#define</code>(并且拼写正确!)时才有意义.</p>

### 5.7.4 用于自由能计算的拓扑文件

<p>两个体系A和B之间的自由能差值, 其计算方法见3.12节的论述. 描述体系A和B的拓扑具有相同数目的分子, 分子的原子数也相同. 通过在<code>[ atoms ]</code>指令下添加B参数, 可以对质量和非键相互作用进行微扰. 键合相互作用的微扰可以通过添加B参数到键合类型或键合相互作用来完成. 能够进行微扰的参数列于表 5.4和表 5.5. 相互作用的 <span class="math">\(\l\)</span> 依赖性见4.5节的论述. 使用的键参数(位于定义键相互作用的行, 或通过对键合类型列表的原子类型进行查找得到)在表 5.6中进行了解释. 大多数情况下, 处理方式都很直观. 当键合相互作用中A和B的原子类型不完全相同, 且B状态的参数不存在时, 无论是位于行还是键合类型, <code>grompp</code>都会使用A状态的参数, 并发出警告. 对自由能计算, 拓扑B(<span class="math">\(\l= 1\)</span>)的所有参数或者添加在同一行, 或者不添加, 添加时位于正常参数之后, 顺序与正常参数相同. 自GROMACS 4.6版本起, 如果 <span class="math">\(\l\)</span> 被视为矢量, 那么<code>bonded-lambdas</code>分量控制所有未明确标记为约束的键合项. 约束项通过<code>restraint-lambdas</code>分量控制.</p>

<table><caption> 表 5.6: 用于自由能拓扑的键合参数, 位于定义键合相互作用的行, 或基于原子类型在键类型中查找. A和B表示分别用于状态A和B的参数, +和-表示拓扑中(不)存在的参数, x表示存在没有影响.</caption>
<tr>
<th style="text-align:center;"> B状态与A状态的原子类型完全相同? </th>
<th style="text-align:center;">行参数</br>A　B</th>
<th style="text-align:center;"> A原子类型的键合类型参数</br>A　B </th>
<th style="text-align:center;">B原子类型的键合类型参数</br> A　B</th>
<th style="text-align:center;">信息</th>
</tr>
<tr>
<td style="text-align:center;"> yes </td>
<td style="text-align:center;">+AB　-</br>+A　+B</br>-　-</br>-　-</br>-　-</td>
<td style="text-align:center;"> x　x</br>x　x</br>-　-</br>+AB　-</br>+A　+B </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">错误</td>
</tr>
<tr>
<td style="text-align:center;"> no  </td>
<td style="text-align:center;">+AB　-</br>+A　+B</br>-　-</br>-　-</br>-　-</br>-　-</br>-　-</td>
<td style="text-align:center;"> x　x</br>x　x</br>-　-</br>+AB　-</br>+A　+B</br>+A　x</br>+A　x </td>
<td style="text-align:center;">x　x</br>x　x</br>x　x</br>-　-</br>-　-</br>+B　-</br>+　+B</td>
<td style="text-align:center;">警告</br>　</br>错误</br>警告</br>警告</br>　</br>　</td>
</tr>
</table>

<p>下面是一个拓扑文件的例子, 将200个丙醇分子转变为200个戊烷分子, 使用了GROMOS&#8211;96力场.</p>

<pre><code>; Include force field parameters
#include &quot;gromos43a1.ff/forcefield.itp&quot;
[ moleculetype ]
; Name     nrexcl
PropPent   3

[ atoms ]
; nr    type  resnr  residue  atom  cgnr  charge    mass    typeB   chargeB   massB
  1       H     1      PROP     PH     1   0.398    1.008    CH3       0.0   15.035
  2      OA     1      PROP     PO     1  -0.548  15.9994    CH2       0.0   14.027
  3     CH2     1      PROP    PC1     1   0.150   14.027    CH2       0.0   14.027
  4     CH2     1      PROP    PC2     2   0.000   14.027
  5     CH3     1      PROP    PC3     2   0.000   15.035

[ bonds ]
; ai    aj    funct    par_A    par_B
   1     2        2    gb_1     gb_26
   2     3        2    gb_17    gb_26
   3     4        2    gb_26    gb_26
   4     5        2    gb_26

[ pairs ]
; ai    aj     funct
   1     4         1
   2     5         1

[ angles ]
; ai    aj    ak    funct    par_A    par_B
   1     2     3        2    ga_11    ga_14
   2     3     4        2    ga_14    ga_14
   3     4     5        2    ga_14    ga_14

[ dihedrals ]
; ai    aj    ak    al    funct    par_A    par_B
   1     2     3     4        1    gd_12    gd_17
   2     3     4     5        1    gd_17    gd_17

[ system ]
; Name
Propanol to Pentane

[ molecules ]
; Compound    #mols
PropPent      200
</code></pre>

<p>未微扰的<code>PC2</code>和<code>PC3</code>原子不需要指定B状态参数, 因为所用B参数将从A参数复制得来. 原子间不微扰的键合相互作用不需要指定B参数, 如示例拓扑中的最后一条键. 使用OPLS/AA力场的拓扑根本不需要键合参数, 因为A和B参数都由原子类型决定. 涉及一个或两个微扰原子的非键相互作用将使用自由能微扰函数形式, 两个非微扰原子间的非键相互作用使用正常的函数形式. 这意味着, 例如, 当只对粒子的电荷进行微扰时, 若lambda不等于0或1, 其Lennard-Jones相互作用也会受到影响.</p>

<p><strong>注意</strong>, 此拓扑文件使用了GROMOS&#8211;96力场, 其中的键合相互作用不是由原子类型决定的. 键合相互作用的字符串由C预处理器转换而来. 力场参数文件包含这样的行:</p>

<pre><code>#define  gb_26    0.1530    7.1500e+06

#define  gd_17    0.000     5.86         3
</code></pre>

### 5.7.5 约束力

<p>一个分子中两个原子之间的约束力, 可以使用自由能微扰代码进行计算, 计算时在两个原子之间添加约束, 约束对拓扑A和B具有不同长度. 当B的长度比A大1 nm时, lambda保持为零, 哈密顿量对lambda的导数就是约束力. 对分子之间的约束, 可以使用拉扯代码, 参见6.4节. 下面是一个具体的例子, 通过组合两个甲烷成一个&#8220;分子&#8221;, 计算水中的两个甲烷分子距离0.7 nm时的约束力. <strong>注意</strong>, GROMACS中&#8220;分子&#8221;的定义不一定对应于分子的化学定义. 在GROMACS中, 一个&#8220;分子&#8221;可被定义为希望同时考虑的任意一组原子. 添加的约束函数类型为2, 意味着它不被用于生成排除(参见5.4节). 注意约束自由能项被包含在导数项中, 并且具体被包含在<code>bonded-lambdas</code>部分中. 然而, 改变约束的自由能 <strong>没有</strong> 被包含在用于BAR和MBAR的势能差值中, 因为这需要对每个约束分量重新计算能量. 我们计划在以后的版本中实现此功能.</p>

<pre><code>; Include force-field parameters
#include &quot;gromos43a1.ff/forcefield.itp&quot;

[ moleculetype ]
; Name           nrexcl
Methanes              1

[ atoms ]
; nr    type    resnr    residu    atom cgnr charge    mass
   1     CH4      1       CH4       C1    1      0    16.043
   2     CH4      1       CH4       C2    2      0    16.043
[ constraints ]
; ai      aj  funct    length_A    length_B
   1       2      2         0.7         1.7

#include &quot;gromos43a1.ff/spc.itp&quot;
[ system ]
; Name
Methanes in Water

[ molecules ]
; Compound    #mols
Methanes          1
SOL            2002
</code></pre>

### 5.7.6 坐标文件

<p>扩展名为<code>.gro</code>的文件包含了GROMOS&#8211;87格式的分子结构. 这种文件的一个示例片段如下:</p>

<pre><code>MD of 2 waters, reformat step, PA aug-91
    6
    1WATER  OW1    1   0.126   1.624   1.679   0.1227  -0.0580   0.0434
    1WATER  HW2    2   0.190   1.661   1.747   0.8085   0.3191  -0.7791
    1WATER  HW3    3   0.177   1.568   1.613  -0.9045  -2.6469   1.3180
    2WATER  OW1    4   1.275   0.053   0.622   0.2519   0.3140  -0.1734
    2WATER  HW2    5   1.337   0.002   0.680  -1.0641  -1.1349   0.0257
    2WATER  HW3    6   1.326   0.120   0.568   1.9427  -0.8216  -0.0244
   1.82060 1.82060 1.82060
</code></pre>

<p>格式是固定, 即, 所有列的位置都固定. 如果你想在自己的程序中读取这样的文件, 而不使用GROMACS库, 你可以使用以下格式:</p>

<p><strong>C格式</strong>: <code>&quot;%5i%5s%5s%5i%8.3f%8.3f%8.3f%8.4f%8.4f%8.4f&quot;</code></p>

<p>或更准确一点, 包含标题等内容, 应该像这样:</p>

<pre><code>&quot;%s\n&quot;, Title
&quot;%5d\n&quot;, natoms
for (i=0; (i&lt;natoms); i++) {
  &quot;%5d%-5s%5s%5d%8.3f%8.3f%8.3f%8.4f%8.4f%8.4f\n&quot;,
  residuenr, residuename, atomname, atomnr, x, y, z, vx, vy, vz
}
&quot;%10.5f%10.5f%10.5f%10.5f%10.5f%10.5f%10.5f%10.5f%10.5f\n&quot;,
  box[X][X], box[Y][Y], box[Z][Z],
  box[X][Y], box[X][Z], box[Y][X], box[Y][Z], box[Z][X], box[Z][Y]
</code></pre>

<p><strong>Fortran格式</strong>: <code>(i5, 2a5, i5, 3f8.3, 3f8.4)</code></p>

<p>因此<code>confin.gro</code>是GROMACS坐标文件, 几乎与GROMOS&#8211;87文件(对GROMOS用户: 当使用<code>ntx=7</code>时)相同. 唯一的区别是, GROMACS对盒子使用了张量, 而不是向量.</p>

## 5.8 力场的组织

### 5.8.1 力场文件

<p>默认提供了许多力场, 并根据<code>&lt;name&gt;.ff</code>目录的存在进行检测, 位于<code>$GMXLIB/share/gromacs/top</code>的子目录和/或工作目录中. <code>pdb2gmx</code>会打印出力场文件的位置信息, 因此你可以很容易地知道调用了哪个版本的力场, 以防你在一个或另一个位置进行了修改. GROMACS包含了以下力场:</p>

<ul class="incremental">
<li>AMBER03蛋白质, 核酸 AMBER94(Duan et al., <em>J. Comp. Chem.</em> 24, 1999&#8211;2012, <strong>2003</strong>)</li>
<li>AMBER94力场(Cornell et al., <em>JACS</em> 117, 5179&#8211;5197, <strong>1995</strong>)</li>
<li>AMBER96蛋白质, 核酸AMBER94(Kollman et al., <em>Acc. Chem. Res.</em> 29, 461&#8211;469, <strong>1996</strong>)</li>
<li>AMBER99蛋白质, 核酸AMBER94((Wang et al., <em>J. Comp. Chem. 21</em>, 1049&#8211;1074, <strong>2000</strong>)</li>
<li>AMBER99SB蛋白质, 核酸AMBER94(Hornak et al., <em>Proteins</em> 65, 712&#8211;725, <strong>2006</strong>)</li>
<li>AMBER99SB-ILDN蛋白质, 核酸AMBER94(Lindorff-Larsen et al., <em>Proteins 78</em>, 1950&#8211;58, <strong>2010</strong>)</li>
<li>AMBERGS力场(Garcia &amp; Sanbonmatsu, <em>PNAS</em> 99, 2782&#8211;2787, <strong>2002</strong>)</li>
<li>CHARMM27全原子力场(CHARM22与CMAP的蛋白质力场)</li>
<li>GROMOS96 43a1力场</li>
<li>GROMOS96 43a2力场(改进了烷烃二面角)</li>
<li>GROMOS96 45a3力场((Schuler <em>JCC</em> <strong>2001</strong> 22 1205)</li>
<li>GROMOS96 53a5力场( <em>JCC</em> <strong>2004</strong> vol 25 pag 1656)</li>
<li>GROMOS96 53a6力场( <em>JCC</em> <strong>2004</strong> vol 25 pag 1656)</li>
<li>GROMOS96 54a7力场( <em>Eur. Biophys. J.</em> (<strong>2011</strong>), 40, 843&#8211;856, DOI: 10.1007/s00249&#8211;011&#8211;0700&#8211;9)</li>
<li>OPLS-AA/L全原子力场(2001氨基酸二面角)</li>
</ul>

<p>力场被包含在拓扑文件的开始, 使用<code>#include</code>语句, 后面跟着<code>&lt;name&gt;.ff/forcefield.itp</code>. 此语句包含力场文件, 反过来, 被包含的力场文件也可包含其它力场文件. 所有的力场以同样方式进行组织. 力场的一个例子<code>amber99.ff/forcefield.itp</code>见5.7.1节.</p>

<p>对每个力场, 有一些文件只被<code>pdb2gmx</code>使用. 它们是: 残基数据库(<code>.rtp</code>, 参见5.6.1节), 氢数据库(<code>.hdb</code>, 参见5.6.4节), 两个末端数据库(<code>.n.tdb</code>和<code>.c.tdb</code>, 参见5.6.5节), 只包含质量的原子类型数据库(<code>.atp</code>, 参见5.2.1节). 其他可选的文件参见5.6节的论述.</p>

### 5.8.2 改变力场参数

<p>如果你想更改分子中少量的键相互作用的参数, 最容易的方法是, 直接在<code>*.top</code>文件<code>[ moleculetype ]</code>段(参见5.7.1节的格式和单位说明)的键相互作用的定义之后输入参数. 如果想更改一种相互作用所有实例中的参数, 你可以在力场文件更改, 或者在包含力场之后添加一个新的<code>[ ???types ]</code>段. 如果一种相互作用参数被定义了多次, 会使用最后的定义. 对GROMACS 3.1.3版本, 当使用不同的值重定义参数时, 会导致警告. 建议不要更改原子类型的Lennard-Jones参数, 因为在GROMOS力场中一些原子类型组合的Lennard-Jones参数并不是根据标准组合规则生成的. 这些组合(以及其他可能遵循组合规则的)在<code>[ nonbond_params ]</code>段进行定义, 更改原子类型的Lennard-Jones参数对这些组合没有影响.</p>

### 5.8.3 添加原子类型

<p>对GROMACS 3.1.3版本, 在包含正常力场之后, 可以使用额外的<code>[ atomtypes ]</code>段添加原子类型. 在新的原子类型定义之后, 可以定义另外的非键参数和对参数. 对3.1.3版本以前的GROMACS, 新的原子类型需要添加到力场文件的<code>[ atomtypes ]</code>段, 因为在最后的<code>[ atomtypes ]</code>段之上的所有非键参数都会使用标准的组合规则覆盖.</p>
