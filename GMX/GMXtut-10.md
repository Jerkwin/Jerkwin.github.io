---
 layout: post
 title: GROMACS教程：GROMACS模拟空间非均相体系(板块结构)的并行性能：区域分解与PME节点设置
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}

<ul class="incremental">
<li>翻译: 李继存</li>
<li>原始文档: Kathleen Kirchner, <a href="https://compchemmpi.wikispaces.com/file/view/Domaindecomposition_KKirchner_27Apr2012.pdf">On the performance of parallelized Gromacs simulations of spatial inhomogeneous system (Slab geometry): domain decomposition and PME nodes</a></li>
</ul>

## 译者按

<p>要提高GROMACS的运行速度, 理论上讲, 要从下面几个方面考虑:</p>

<ol class="incremental">
<li>硬件设备: 更快更好, 支持特殊优化的CPU, GPU</li>
<li>编译GROMACS时的设置: 高效的库, 开启优化</li>
<li><code>mdp</code>文件中的设置: 步长, 截断, 输出频率</li>
<li><code>mdrun</code>的运行设置: 并行设置, 节点划分</li>
</ol>

<p>前三个方面一般不易改变, 第四个设置很容易调整, 最简单的就是增加所用的节点数. 对板块(slab)体系, 由于体系中的原子分布非常不均匀, 在运行时一般需要合理地分配所用的节点, 手动调整区域分解设置和节点分配策略. 此文就是一个测试结果, 可供参考.</p>

<p>总结一下此文所用的方法, 要确定区域分解和节点划分的最佳设置, 可利用如下步骤:</p>

<ol class="incremental">
<li>根据测试运行结果确定区域分解的最小单元尺寸: <span class="math">\(d\)</span></li>
<li>根据盒子x和y方向的尺寸 <span class="math">\(a\)</span> 和 <span class="math">\(b\)</span> 确定x和y方向的最大可能划分单元数: <span class="math">\(N_x=a/d\)</span>, <span class="math">\(N_y=b/d\)</span>.</li>
<li>对板块构型, 一般不沿z方向划分盒子, 所以体系的最大可能划分单元数为: <span class="math">\(Nx \times Ny \times 1\)</span></li>
<li>使用<code>-dd</code>选项设定区域分解时, 每一方向的划分单元数不可超过前面得到的最大可能划分单元数, 否则出错</li>
<li>使用<code>-npme</code>选项设定PME节点数时, 其值必须小于总节点数的一般. 具体多少可根据测试结果确定, 一般可取1/3或1/4</li>
<li>GROMACS自动设置区域分解时, 对于某些节点数可能出错. 此时可使用<code>-dd</code>手动设定区域分解.</li>
</ol>

## 摘要

<p>我们使用GROMACS 4.5.5进行分子动力学模拟以考察基于咪唑的室温离子液体(RTIL, room temperature ionic liquids)在荷电电极附近的结构取向. 每个模拟盒子中包含45000到50000个原子. 为正确地处理静电相互作用, 我们使用了离子网格Ewald方法(PME), 以及由Yeh和Berkowitz引入的用于板块结构的3DC校正<a href="#fn:1" id="fnref:1" title="see footnote" class="footnote">[1]</a>. 由于粒子数较多, 模拟需要高度的并行, 又因体系中未占据空间较多, 导致了很高的空间非均匀性, 并行时需要一些特殊的考虑. 此文档给出关于区域分解和节点划分的一些考虑因素.</p>

<p>结果: 当手动指定PME节点数和区域分解时, 运行性能可提高5&#8211;10%. 此外, 与GROMACS自动使用的最大节点数相比, 增加模拟使用的总节点数运行性能可以提高50&#8211;100%.</p>

## 1. 问题说明

<p>为进行并行模拟, 需要将整个模拟盒子划分为小的单元, 这样就可以在多个节点上进行并行. 当使用PME方法计算静电相互作用时, 还可以指定一些节点单独用于PME计算, 这些节点被称为PME节点. GROMACS通常会自动进行这些设置, 但当模拟体系具有很高或很低的空间不均匀性时(例如, 模拟真空中的板块), 可能需要自己对这些设置进行调整以达到更好的性能. 另外, 也可能存在一个理论的最佳区域分解设置, 但GROMACS可能无法自动找到此设置. 因此, <code>mdrun</code>提供了许多选项用于手动调整节点设置.</p>

## 2. 研究体系

<p>我们使用GROMACS 4.5.5进行分子动力学模拟以考察基于咪唑的室温离子液体(RTIL, room temperature ionic liquids)在荷电电极附近的结构取向. 我们使用石墨烯对真实电极进行建模, 电极的初始结构使用ase.structure<a href="#fn:2" id="fnref:2" title="see footnote" class="footnote">[2]</a>创建, 使用了一个3&#8211;4扶手椅式的纳米带, 石墨烯片的大小为6 nm x 6nm. 5个石墨烯片代表一个电极, 两个电极之间的距离为10 nm, 这样RTIL的可及体积为350 nm<sup>3</sup>. 我们在Z方向增加真空层以对盒子进行扩展, 使Z方向的总长度达到33 nm. 这样的真空层厚度符合Berkowitz规则:</p>

<p><span class="math">\[\D z_\text{vacuum} \ge 3 \max(x,y)\]</span></p>

<p>对板块结构能得到正确的静电模拟(图1). 我们使用Packmol软件创建板块结构, 最终构型中每个模拟盒子包含45000到50000个原子.</p>

<p>为分析区域分解, 我们使用了BMI BF4.</p>

<figure>
<img src="/GMX/GMXtut-10.png" alt="图1: BMI BF4板块结构的模拟盒子在zx平面的快照. 模拟盒子以蓝色长方形表示, 电极(石墨烯)为灰色, 阴阳离子为VMD标准颜色" />
<figcaption>图1: BMI BF4板块结构的模拟盒子在zx平面的快照. 模拟盒子以蓝色长方形表示, 电极(石墨烯)为灰色, 阴阳离子为VMD标准颜色</figcaption>
</figure>

## 3. GROMACS mdrun文档中的有关说明

<p>When <code>mdrun</code> is started with more than 1 rank, parallelization with domain decomposition is used.</p>

<p>当使用超过1个进程启动<code>mdrun</code>时, 会使用区域分解的并行.</p>

<p>With domain decomposition, the spatial decomposition can be set with option <code>-dd</code>. By default <code>mdrun</code> selects a good decomposition. The user only needs to change this when the system is very inhomogeneous. Dynamic load balancing is set with the option <code>-dlb</code>, which can give a significant performance improvement, especially for inhomogeneous systems. The only disadvantage of dynamic load balancing is that runs are no longer binary reproducible, but in most cases this is not important. By default the dynamic load balancing is automatically turned on when the measured performance loss due to load imbalance is 5% or more. At low parallelization these are the only important options for domain decomposition. At high parallelization the options in the next two sections could be important for increasing the performace.</p>

<p>使用区域分解时, 空间分解可以通过<code>-dd</code>选项设置. 默认情况下<code>mdrun</code>会选择一个好的分解. 只有当体系非常不均匀时, 用户才需要更改此设置. 动态负载平衡由<code>-dlb</code>选项设置, 它可以显著地提升性能, 特别是对于非均相体系. 动态负载均衡的唯一缺点是运行不再具有二进制级别的可重现性, 但在大多数情况下, 这并不重要. 由负载失衡导致的性能损失达到5%或以上时, 默认会自动开启动态负载均衡. 对低并行度计算, 这些是区域分解仅有的重要选项. 对高并行度计算, 下面两节中的选项可能是提升性能的重要选项.</p>

<p>When PME is used with domain decomposition, separate ranks can be assigned to do only the PME mesh calculation; this is computationally more efficient starting at about 12 ranks, or even fewer when OpenMP parallelization is used. The number of PME ranks is set with option <code>-npme</code>, but this cannot be more than half of the ranks. By default <code>mdrun</code> makes a guess for the number of PME ranks when the number of ranks is larger than 16. With GPUs, using separate PME ranks is not selected automatically, since the optimal setup depends very much on the details of the hardware. In all cases, you might gain performance by optimizing <code>-npme</code>. Performance statistics on this issue are written at the end of the log file. For good load balancing at high parallelization, the PME grid x and y dimensions should be divisible by the number of PME ranks (the simulation will run correctly also when this is not the case).</p>

<p>当PME与区域分解一起使用时, 可以分配独立的进程只进行PME网格计算; 大约从12个进程开始, 这样计算效率更高, 当使用OpenMP并行时, 需要的线程数可能更少. PME线程数可由选项<code>-npme</code>设定, 但不能超过总线程数的一半. 默认情况下, 当总线程数超过16时, <code>mdrun</code>会猜测一个PME线程数. 使用GPU时, 不会自动选择使用单独的PME线程, 因为最佳设置在很大程度上取决于硬件的详细信息. 在任何情况下, 你都可能通过优化<code>-npme</code>提高性能. 关于此选项的性能统计数据会写到日志文件的结束处. 为了在高并行度下获得良好的负载均衡, PME格点的X和Y尺寸应该能被PME线程数整除(即便不是这样, 模拟也可以正常运行).</p>

<p>This section lists all options that affect the domain decomposition.</p>

<p>本节列出了能够影响区域分解的所有选项.</p>

<p>Option <code>-rdd</code> can be used to set the required maximum distance for inter charge-group bonded interactions. Communication for two-body bonded interactions below the non-bonded cut-off distance always comes for free with the non-bonded communication. Atoms beyond the non-bonded cut-off are only communicated when they have missing bonded interactions; this means that the extra cost is minor and nearly indepedent of the value of <code>-rdd</code>. With dynamic load balancing option <code>-rdd</code> also sets the lower limit for the domain decomposition cell sizes. By default -rdd is determined by <code>mdrun</code> based on the initial coordinates. The chosen value will be a balance between interaction range and communication cost.</p>

<p>选项<code>-rdd</code>可用于设置计算电荷组之间的键合相互作用时所需要的最大距离. 对于非键截断距离以下的二体键合相互作用, 其通讯总是与非键通讯一起进行. 只有当含有丢失的键合相互作用时, 超过非键截断的原子才进行通讯; 这意味着额外的花销是很小的, 而且几乎与<code>-rdd</code>的值无关. 使用动态负载均衡时, <code>-rdd</code>选项同时也是区域分解单元晶胞尺寸的下限. 默认情况下, <code>mdrun</code>会根据初始的坐标确定<code>-rdd</code>, 所选值基于相互作用范围和通讯成本之间的平衡.</p>

<p>When inter charge-group bonded interactions are beyond the bonded cut-off distance, <code>mdrun</code> terminates with an error message. For pair interactions and tabulated bonds that do not generate exclusions, this check can be turned off with the option -noddcheck.</p>

<p>当电荷组间的键合相互作用超过了键合截断距离时, <code>mdrun</code>会终止运行, 并给出一个错误信息. 对不使用排除的配对相互作用和表格键, 可以使用<code>-noddcheck</code>选项关闭此检查.</p>

<p>When constraints are present, option <code>-rcon</code> influences the cell size limit as well. Atoms connected by NC constraints, where NC is the LINCS order plus 1, should not be beyond the smallest cell size. A error message is generated when this happens and the user should change the decomposition or decrease the LINCS order and increase the number of LINCS iterations. By default mdrun estimates the minimum cell size required for P-LINCS in a conservative fashion. For high parallelization it can be useful to set the distance required for P-LINCS with the option <code>-rcon</code>.</p>

<p>当存在约束时, 选项<code>-rcon</code>也会影响晶胞的大小限制. 由NC约束连接的原子, 其中NC为LINCS的阶数加1, 不应超出最小的晶胞尺寸. 如果发生了这种情况, 程序会给出错误信息, 用户应更改分解或减小LINCS阶数并增加LINCS的迭代次数. 默认情况下<code>mdrun</code>会以保守的方式估计P-LINCS所需要的最小晶胞尺寸. 对高并行度的计算, 使用选项<code>-rcon</code>来设置P-LINCS所需要的距离, 可能会有帮助.</p>

<p>The <code>-dds</code> option sets the minimum allowed x, y and/or z scaling of the cells with dynamic load balancing. <code>mdrun</code> will ensure that the cells can scale down by at least this factor. This option is used for the automated spatial decomposition (when not using <code>-dd</code>) as well as for determining the number of grid pulses, which in turn sets the minimum allowed cell size. Under certain circumstances the value of <code>-dds</code> might need to be adjusted to account for high or low spatial inhomogeneity of the system.</p>

<p>使用动态负载均衡时, <code>-dds</code>选项设置晶胞x, y和/或z方向缩放的最小允许比例. <code>mdrun</code>会确保晶胞至少缩放此比例. 这个选项用于自动空间分解(当不使用<code>-dd</code>时)以及确定网格脉冲的数量, 进而设置晶胞的最小允许尺寸. 在某些情况下, 可能需要调整<code>-dds</code>的值以考虑体系高或低的空间不均匀性.</p>

<p>The option <code>-gcom</code> can be used to only do global communication every n steps. This can improve performance for highly parallel simulations where this global communication step becomes the bottleneck. For a global thermostat and/or barostat the temperature and/or pressure will also only be updated every <code>-gcom</code> steps. By default it is set to the minimum of <code>nstcalcenergy</code> and <code>nstlist</code>.</p>

<p>选项<code>-gcom</code>可用于决定每n步只进行一次全局通讯. 当全局通讯步成为瓶颈的时候, 对高并行度的模拟此选项可以提高性能. 对全局控温器和/或控压器, 其温度和/或压力也会每<code>-gcom</code>步数更新一次. 默认情况下此选项的值被设为<code>nstcalcenergy</code>和<code>nstlist</code>中的较小值.</p>

## 4. 运行性能测试

<p>对上面指定的测试体系, 下面给出在32个节点上初始化区域分解的输出. 运行命令如下</p>

<pre><code>mdrun_mpi -maxh $MAXH -deffnm $tpr -dlb auto
</code></pre>

<p><strong>代码1: 32个节点上初始化区域分解的输出</strong></p>

<pre><code>Initializing Domain Decomposition on 32 nodes
Dynamic load balancing: auto
Will sort the charge groups at every domain (re)decomposition

NOTE: Periodic molecules: can not easily determine the required minimum bonded cut-off, using half the non-bonded cut-off

Minimum cell size due to bonded interactions: 0.650 nm
Guess for relative PME load: 0.23
Will use 24 particle-particle and 8 PME only nodes
This is a guess, check the performance at the end of the log file
Using 8 separate PME nodes
Scaling the initial minimum size with 1/0.8 (option -dds) = 1.25
Optimizing the DD grid for 24 cells with a minimum initial size of 0.812 nm
Ewald_geometry=3dc: assuming inhomogeneous particle distribution in z, will not decompose in z.
The maximum allowed number of cells is: X 7 Y 7 Z 1
Domain decomposition grid 6 x 4 x 1, separate PME nodes 8
PME domain decomposition: 8 x 1 x 1
Interleaving PP and PME nodes
This is a particle-particle only node
</code></pre>

<p>由此输出可以看到, 在模拟完成后, 我们应该检查日志文件最后给出的性能数据, 特别应当考虑下面的说明</p>

<p><strong>代码2: 32节点运行时, 自动区域分解后的输出</strong></p>

<pre><code>NOTE: 13.4 % performance was lost because the PME nodes
      had less work to do than the PP nodes.
      You might want to decrease the number of PME nodes
      or decrease the cut-off and the grid spacing.
</code></pre>

<p>除了尝试使用<code>-dd</code>选项自己指定区域分解, 使用<code>-npme</code>选项指定PME节点数以降低性能损失外, 我们还测试了总节点数的对性能影响. 表1总结了一些节点和区域分解设置的性能数据.</p>

<p>降低PME节点数确实可以降低性能损失. 当使用96个节点并使用<code>-dd 9 9 1</code>和<code>-npme 15</code>时可获得最佳性能. 从节点数从32增加到96时, 性能线性增加.</p>

<table><caption>表1:　HECToR机器上区域分解和测试体系的运行性能(1048个BMI BF4离子对, 板块结构, 10个石墨烯片模拟的电极, 大约45000个原子). (*)在区域分解中因负载失衡导致的性能损失, 例如一些节点空闲</caption>
<tr>
<th rowspan="2" style="text-align:center;">总节点数</th>
<th rowspan="2" style="text-align:center;">-dd<BR>X Y Z</th>
<th rowspan="2" style="text-align:center;">-npme</th>
<th colspan="2" style="text-align:center;">性能</th>
<th rowspan="2" style="text-align:right;">性能损失(*)</th>
</tr>
<tr>
<th style="text-align:center;">ns/day</th>
<th style="text-align:center;">hour/n</th>
</tr>
<tr>
<td style="text-align:center;">32</td>
<td style="text-align:center;">auto<BR>6 4 1</td>
<td style="text-align:center;">auto<BR>8</td>
<td style="text-align:center;">5.061</td>
<td style="text-align:center;">4.742</td>
<td style="text-align:center;">13.4%</td>
</tr>
<tr>
<td rowspan="4" style="text-align:center;">64</td>
<td style="text-align:center;">auto<BR>(48)</td>
<td style="text-align:center;">auto<BR>16</td>
<td colspan="3" style="text-align:center;">错误</td>
</tr>
<tr>
<td style="text-align:center;">8 6 1</td>
<td style="text-align:center;">16</td>
<td style="text-align:center;">9.325</td>
<td style="text-align:center;">2.574</td>
<td style="text-align:center;">11.6%</td>
</tr>
<tr>
<td style="text-align:center;">7 7 1</td>
<td style="text-align:center;">15</td>
<td style="text-align:center;">9.836</td>
<td style="text-align:center;">2.440</td>
<td style="text-align:center;">10.2%</td>
</tr>
<tr>
<td style="text-align:center;">9 6 1</td>
<td style="text-align:center;">10</td>
<td style="text-align:center;">9.945</td>
<td style="text-align:center;">2.413</td>
<td style="text-align:center;">5.3%</td>
</tr>
<tr>
<td rowspan="2" style="text-align:center;">96</td>
<td style="text-align:center;">9 9 1</td>
<td style="text-align:center;">15</td>
<td style="text-align:center;">14.470</td>
<td style="text-align:center;">1.659</td>
<td style="text-align:center;">5.2%</td>
</tr>
<tr>
<td style="text-align:center;">12 7 1</td>
<td style="text-align:center;">12</td>
<td colspan="3" style="text-align:center;">错误</td>
</tr>
</table>

## 5. 错误信息

<p>当GROMACS初始化区域分解时, 可能会出现下面的错误信息:</p>

<p><strong>代码3: 错误信息 No domain decomposition for xx nodes that is compatible with the given box</strong></p>

<pre><code>Initializing Domain Decomposition on 64 nodes
Dynamic load balancing: auto
Will sort the charge groups at every domain (re)decomposition

NOTE: Periodic molecules: can not easily determine the required minimum bonded cut-off, using half the non-bonded cut-off

Minimum cell size due to bonded interactions: 0.650 nm
Guess for relative PME load: 0.23
Will use 48 particle-particle and 16 PME only nodes
This is a guess, check the performance at the end of the log file
Using 16 separate PME nodes
Scaling the initial minimum size with 1/0.8 (option -dds) = 1.25
Optimizing the DD grid for 48 cells with a minimum initial size of 0.812 nm
Ewald_geometry=3dc: assuming inhomogeneous particle distribution in z, will not decompose in z.
The maximum allowed number of cells is: X 7 Y 7 Z 1

-------------------------------------------------------
Program mdrun_mpi, VERSION 4.5.5
Source code file: domdec.c, line: 6436

Fatal error:
There is no domain decomposition for 48 nodes that is compatible with the given box and a minimum cell size of 0.8125 nm
Change the number of nodes or mdrun option -rdd or -dds
Look in the log file for details on the domain decomposition
For more information and tips for troubleshooting, please check the GROMACS
website at http://www.gromacs.org/Documentation/Errors
</code></pre>

<p>对64个节点, GROMACS不能进行合适的区域分解. 我怀疑问题出在用于最小单元尺寸的额外缩放因子1.25. 这是一个限制, 用于防止GROMACS工具出错. 我们需要试着自己调整区域分解设置, 指定PME节点数.</p>

<p>对于出现下面错误信息的情况, 单元尺寸确实违背了设置, 这一信息对任何并行都是一个严重的限制.</p>

<p><strong>代码4: 错误信息 Initial cell size smaller than cell size limit</strong></p>

<pre><code>mdrun_mpi -maxh $MAXH -deffnm $tpr -dlb auto -dd 12 7 1 -npme 12

#++++++++++++++++++++++++++++++++++++++++++

Initializing Domain Decomposition on 96 nodes
Dynamic load balancing: auto
Will sort the charge groups at every domain (re)decomposition

NOTE: Periodic molecules: can not easily determine the required minimum bonded cut-off, using half the non-bonded cut-off

Minimum cell size due to bonded interactions: 0.650 nm
ERROR: The initial cell size (0.491903) is smaller than the cell size limit (0.650000)

-------------------------------------------------------
Program mdrun_mpi, VERSION 4.5.5
Source code file: domdec.c, line: 6413

Fatal error:
The initial cell size (0.491903) is smaller than the cell size limit (0.650000), change options -dd, -rdd or -rcon, see the log file for details
For more information and tips for troubleshooting, please check the GROMACS
website at http://www.gromacs.org/Documentation/Errors
</code></pre>

## 6. 如何获得最佳区域分解设置

<p>对于我们的情况, 存在下面这些限制条件:</p>

<ul class="incremental">
<li>盒子在x和y方向的尺寸: 5.99 nm</li>
<li>根据键合相互作用得到的最小单元尺寸: 0.65 nm</li>
<li>使用的节点数: 由于所用HECToR机器的设置策略, 必须是32的倍数</li>
</ul>

<p>让我们来做些计算:</p>

<ul class="incremental">
<li>x方向的最大区域数: <span class="math">\(N_x=5.99/0.65 \approx 9\)</span></li>
<li>y方向的最大区域数: <span class="math">\(N_y=5.99/0.65 \approx 9\)</span></li>
<li>z方向的最大区域数: <span class="math">\(N_z=1\)</span>, 因为体系为板块结构</li>
<li>最大PP节点数: <span class="math">\(N_{PP}=N_x \times N_y \times N_z=9 \times 9 \times 1=81\)</span></li>
<li>总节点数中可用PME节点数的最大比例: <span class="math">\(N_{PME} \lt {8 \over 32} N_{node}=0.25 N_{node}\)</span><br/>
(考虑初始的区域分解为8个PME节点, <span class="math">\(6 \times 4 \times 1=24\)</span> 个PP节点, 性能损失为13.4)</li>
</ul>

<p>现在我们需要对PP和PME节点数找到一个好的选择, 以满足</p>

<p><span class="math">\[N_{PP}+N_{PME}=N_{node}\]</span></p>

<p>并且</p>

<p><span class="math">\[N_{nodes}=32 u \;\; u \in \mathbb{N}\]</span></p>

<p><span class="math">\[N_{PP}+0.25 N_{node} \gt N_{node}\]</span></p>

<p><span class="math">\[81+0.25 \cdot 32 \cdot u \gt 32 \cdot u\]</span></p>

<p><span class="math">\[u \lt {81 \over 0.75 \cdot 32} \approx 3.375\]</span></p>

<p>这样我们得到 <span class="math">\(u=3\)</span>, 总的节点数为96, 划分为81个PP节点, 15个PME节点, 这可能是得到最高运行性能的分配策略. 相应的运行命令为:</p>

<pre><code>mdrun_mpi -maxh $MAXH -deffnm $tpr -dlb auto -dd 9 9 1 -npme 15
</code></pre>

<div class="footnotes">
<hr />
<ol class="incremental">

<li id="fn:1">
<p>I.C. Yeh and M.L. Berkowitz. Ewald summation for systems with slab geometry. <em>J. Chemi. Phys.</em>, 111:3155&#8211;3162, 1999 <a href="#fnref:1" title="return to article" class="reversefootnote">&#160;&#8617;</a></p>
</li>

<li id="fn:2">
<p>ASE(Atomic Simulation Environment)工具的一种, ASE是CAMd开发的模拟工具. <a href="https://wiki.fysik.dtu.dk/ase/epydoc/ase.structure-module.html">https://wiki.fysik.dtu.dk/ase/epydoc/ase.structure-module.html</a> <a href="#fnref:2" title="return to article" class="reversefootnote">&#160;&#8617;</a></p>
</li>

</ol>
</div>
