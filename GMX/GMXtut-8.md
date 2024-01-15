---
 layout: post
 title: GROMACS教程：创建周期性体系的拓扑文件：以石墨烯为例
 categories:
 - 科
 tags:
 - gmx
 chem: true
---

* toc
{:toc}

<ul class="incremental">
<li>2016-02-16 整理: 阮洋; 修订: 李继存</li>
<li>2017-01-24 补充: 陈建发</li>
</ul>

## 概述

<p>有许多材料具有周期性结构, 下面是一些常见的例子.</p>

<figure>
<img src="/GMX/GMXtut-8_环肽纳米管.png" alt="环肽纳米管" />
<figcaption>环肽纳米管</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-8_碳纳米管簇.png" alt="碳纳米管簇" />
<figcaption>碳纳米管簇</figcaption>
</figure>

<figure>
<img src="/GMX/GMXtut-8_石墨烯以及氧化石墨烯.png" alt="石墨烯以及氧化石墨烯" />
<figcaption>石墨烯以及氧化石墨烯</figcaption>
</figure>

<p>还有其它一些类似的材料, 如SiO<sub>2</sub>纳米管, BN纳米管, SiC纳米管以及石墨炔材料等, 都具有周期性结构. 在使用GROMACS对这些材料进行模拟时, 我们需要创建这些材料的拓扑文件, 也就是力场文件. 为此, GROMACS提供了一个根据坐标构建拓扑文件的工具<code>g_x2top</code>(对GROMACS 5.0以上版本, 使用<code>gmx x2top</code>), 非常适用于创建这些结构规律性很强的材料的拓扑文件. 下面我们以石墨烯为例来说明如何使用<code>g_x2top</code>来创建材料的拓扑文件并进行简单的模拟.</p>

## 1. 获取石墨烯的结构文件

<p>石墨烯是二维平面结构, 可认为其碳原子属于sp2杂化, 有关其结构的一些特点请参看<a href="http://jerkwin.github.io/2014/05/09/石墨烯-建模-几何性质及力场模拟/">石墨烯：建模, 几何性质及力场模拟</a>.</p>

<p>创建石墨烯结构的方法有很多. 这里我们使用一个<a href="http://jerkwin.github.io/2014/12/24/石墨烯在线创建工具/">石墨烯在线创建工具</a>来创建. 根据你的需要, 创建合适大小的石墨烯. 此工具给出的坐标是<code>xyz</code>格式的, 为了后面便于处理, 我们需要将其改写为GROMACS的<code>gro</code>格式. 在这里我不建议使用<code>pdb</code>格式, 因为<code>pdb</code>文件格式有不同版本, 而不同版本的<code>g_x2top</code>程序所支持的<code>pdb</code>文件格式稍有不同, 后面处理时可能出现比较奇怪的问题.</p>

<p>在保存为<code>gro</code>文件时, 需要非常注意的一点就是盒子的大小. 石墨烯是二维周期性的无限体系, 所以要考虑其周期性话, 盒子的长宽需要精确地等于实际的长宽, 否则在后面创建具有周期性的拓扑文件时就会出错. 如果使用<code>pdb</code>文件同样也需要注意这一点. 你可以使用VMD等软件对得到的构型进行周期性扩展, 检查盒子大小是否合适. 如果不考虑周期性, 只是将石墨烯视为孤立的分子, 那么盒子的大小只要不小于实际大小即可.</p>

<p>利用前面的在线工具, 我们创建一个10x5的石墨烯, 其长宽为24.248711x21.000000&#197;. 将得到的<code>xyz</code>坐标转成<code>gro</code>格式, 并将盒子的长宽设为前面的值(注意,<code>xyz</code>文件的单位为&#197;, 而<code>gro</code>文件的单位为nm), 对于盒子的高, 根据你要模拟的体系大小设置即可. 我们在这里将其设置为2 nm. 同时, 为了便于查看, 我们使石墨烯处于盒子中间. 你可以点击<a href="/GMX/GMXtut-8_gra.gro">这里</a>下载已经准备好的文件.</p>

<p>下面是放于盒子中的石墨烯</p>

<p><figure style="text-align:left"><script>ChemDoodle.default_backgroundColor = 'black';var Mol1=new ChemDoodle.TransformCanvas3D('Mol-1', 650,400);Mol1.specs.atoms_resolution_3D = 15;Mol1.specs.bonds_resolution_3D = 15;Mol1.specs.shapes_color = '#fff';Mol1.specs.projectionPerspective_3D = false;Mol1.specs.set3DRepresentation('Ball and Stick');Mol1.specs.crystals_unitCellLineWidth = 1.5;Mol1.handle = null;Mol1.timeout = 15;Mol1.startAnimation = ChemDoodle._AnimatorCanvas.prototype.startAnimation;Mol1.stopAnimation = ChemDoodle._AnimatorCanvas.prototype.stopAnimation;Mol1.isRunning = ChemDoodle._AnimatorCanvas.prototype.isRunning;Mol1.dblclick = ChemDoodle.RotatorCanvas.prototype.dblclick;Mol1.nextFrame = function(delta){var matrix = [];ChemDoodle.lib.mat4.identity(matrix);var change = delta*Math.PI/15000;ChemDoodle.lib.mat4.rotate(matrix, change, [ 1, 0, 0 ]);ChemDoodle.lib.mat4.rotate(matrix, change, [ 0, 1, 0 ]);ChemDoodle.lib.mat4.rotate(matrix, change, [ 0, 0, 1 ]);ChemDoodle.lib.mat4.multiply(this.rotationMatrix, matrix)};var Fmol='data__24.248711_21.000000_20\n200\n_symmetry_space_group_name_\' \'\n_cell_length_a 24.2487\n_cell_length_b 21\n_cell_length_c 20\n_cell_angle_alpha 90\n_cell_angle_beta  90\n_cell_angle_gamma 90\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n    1GRA    C     0.025    0.033    0.500\n    1GRA    C     0.075    0.067    0.500\n    1GRA    C     0.075    0.133    0.500\n    1GRA    C     0.025    0.167    0.500\n    1GRA    C     0.025    0.233    0.500\n    1GRA    C     0.075    0.267    0.500\n    1GRA    C     0.075    0.333    0.500\n    1GRA    C     0.025    0.367    0.500\n    1GRA    C     0.025    0.433    0.500\n    1GRA    C     0.075    0.467    0.500\n    1GRA    C     0.075    0.533    0.500\n    1GRA    C     0.025    0.567    0.500\n    1GRA    C     0.025    0.633    0.500\n    1GRA    C     0.075    0.667    0.500\n    1GRA    C     0.075    0.733    0.500\n    1GRA    C     0.025    0.767    0.500\n    1GRA    C     0.025    0.833    0.500\n    1GRA    C     0.075    0.867    0.500\n    1GRA    C     0.075    0.933    0.500\n    1GRA    C     0.025    0.967    0.500\n    1GRA    C     0.125    0.033    0.500\n    1GRA    C     0.175    0.067    0.500\n    1GRA    C     0.175    0.133    0.500\n    1GRA    C     0.125    0.167    0.500\n    1GRA    C     0.125    0.233    0.500\n    1GRA    C     0.175    0.267    0.500\n    1GRA    C     0.175    0.333    0.500\n    1GRA    C     0.125    0.367    0.500\n    1GRA    C     0.125    0.433    0.500\n    1GRA    C     0.175    0.467    0.500\n    1GRA    C     0.175    0.533    0.500\n    1GRA    C     0.125    0.567    0.500\n    1GRA    C     0.125    0.633    0.500\n    1GRA    C     0.175    0.667    0.500\n    1GRA    C     0.175    0.733    0.500\n    1GRA    C     0.125    0.767    0.500\n    1GRA    C     0.125    0.833    0.500\n    1GRA    C     0.175    0.867    0.500\n    1GRA    C     0.175    0.933    0.500\n    1GRA    C     0.125    0.967    0.500\n    1GRA    C     0.225    0.033    0.500\n    1GRA    C     0.275    0.067    0.500\n    1GRA    C     0.275    0.133    0.500\n    1GRA    C     0.225    0.167    0.500\n    1GRA    C     0.225    0.233    0.500\n    1GRA    C     0.275    0.267    0.500\n    1GRA    C     0.275    0.333    0.500\n    1GRA    C     0.225    0.367    0.500\n    1GRA    C     0.225    0.433    0.500\n    1GRA    C     0.275    0.467    0.500\n    1GRA    C     0.275    0.533    0.500\n    1GRA    C     0.225    0.567    0.500\n    1GRA    C     0.225    0.633    0.500\n    1GRA    C     0.275    0.667    0.500\n    1GRA    C     0.275    0.733    0.500\n    1GRA    C     0.225    0.767    0.500\n    1GRA    C     0.225    0.833    0.500\n    1GRA    C     0.275    0.867    0.500\n    1GRA    C     0.275    0.933    0.500\n    1GRA    C     0.225    0.967    0.500\n    1GRA    C     0.325    0.033    0.500\n    1GRA    C     0.375    0.067    0.500\n    1GRA    C     0.375    0.133    0.500\n    1GRA    C     0.325    0.167    0.500\n    1GRA    C     0.325    0.233    0.500\n    1GRA    C     0.375    0.267    0.500\n    1GRA    C     0.375    0.333    0.500\n    1GRA    C     0.325    0.367    0.500\n    1GRA    C     0.325    0.433    0.500\n    1GRA    C     0.375    0.467    0.500\n    1GRA    C     0.375    0.533    0.500\n    1GRA    C     0.325    0.567    0.500\n    1GRA    C     0.325    0.633    0.500\n    1GRA    C     0.375    0.667    0.500\n    1GRA    C     0.375    0.733    0.500\n    1GRA    C     0.325    0.767    0.500\n    1GRA    C     0.325    0.833    0.500\n    1GRA    C     0.375    0.867    0.500\n    1GRA    C     0.375    0.933    0.500\n    1GRA    C     0.325    0.967    0.500\n    1GRA    C     0.425    0.033    0.500\n    1GRA    C     0.475    0.067    0.500\n    1GRA    C     0.475    0.133    0.500\n    1GRA    C     0.425    0.167    0.500\n    1GRA    C     0.425    0.233    0.500\n    1GRA    C     0.475    0.267    0.500\n    1GRA    C     0.475    0.333    0.500\n    1GRA    C     0.425    0.367    0.500\n    1GRA    C     0.425    0.433    0.500\n    1GRA    C     0.475    0.467    0.500\n    1GRA    C     0.475    0.533    0.500\n    1GRA    C     0.425    0.567    0.500\n    1GRA    C     0.425    0.633    0.500\n    1GRA    C     0.475    0.667    0.500\n    1GRA    C     0.475    0.733    0.500\n    1GRA    C     0.425    0.767    0.500\n    1GRA    C     0.425    0.833    0.500\n    1GRA    C     0.475    0.867    0.500\n    1GRA    C     0.475    0.933    0.500\n    1GRA    C     0.425    0.967    0.500\n    1GRA    C     0.525    0.033    0.500\n    1GRA    C     0.575    0.067    0.500\n    1GRA    C     0.575    0.133    0.500\n    1GRA    C     0.525    0.167    0.500\n    1GRA    C     0.525    0.233    0.500\n    1GRA    C     0.575    0.267    0.500\n    1GRA    C     0.575    0.333    0.500\n    1GRA    C     0.525    0.367    0.500\n    1GRA    C     0.525    0.433    0.500\n    1GRA    C     0.575    0.467    0.500\n    1GRA    C     0.575    0.533    0.500\n    1GRA    C     0.525    0.567    0.500\n    1GRA    C     0.525    0.633    0.500\n    1GRA    C     0.575    0.667    0.500\n    1GRA    C     0.575    0.733    0.500\n    1GRA    C     0.525    0.767    0.500\n    1GRA    C     0.525    0.833    0.500\n    1GRA    C     0.575    0.867    0.500\n    1GRA    C     0.575    0.933    0.500\n    1GRA    C     0.525    0.967    0.500\n    1GRA    C     0.625    0.033    0.500\n    1GRA    C     0.675    0.067    0.500\n    1GRA    C     0.675    0.133    0.500\n    1GRA    C     0.625    0.167    0.500\n    1GRA    C     0.625    0.233    0.500\n    1GRA    C     0.675    0.267    0.500\n    1GRA    C     0.675    0.333    0.500\n    1GRA    C     0.625    0.367    0.500\n    1GRA    C     0.625    0.433    0.500\n    1GRA    C     0.675    0.467    0.500\n    1GRA    C     0.675    0.533    0.500\n    1GRA    C     0.625    0.567    0.500\n    1GRA    C     0.625    0.633    0.500\n    1GRA    C     0.675    0.667    0.500\n    1GRA    C     0.675    0.733    0.500\n    1GRA    C     0.625    0.767    0.500\n    1GRA    C     0.625    0.833    0.500\n    1GRA    C     0.675    0.867    0.500\n    1GRA    C     0.675    0.933    0.500\n    1GRA    C     0.625    0.967    0.500\n    1GRA    C     0.725    0.033    0.500\n    1GRA    C     0.775    0.067    0.500\n    1GRA    C     0.775    0.133    0.500\n    1GRA    C     0.725    0.167    0.500\n    1GRA    C     0.725    0.233    0.500\n    1GRA    C     0.775    0.267    0.500\n    1GRA    C     0.775    0.333    0.500\n    1GRA    C     0.725    0.367    0.500\n    1GRA    C     0.725    0.433    0.500\n    1GRA    C     0.775    0.467    0.500\n    1GRA    C     0.775    0.533    0.500\n    1GRA    C     0.725    0.567    0.500\n    1GRA    C     0.725    0.633    0.500\n    1GRA    C     0.775    0.667    0.500\n    1GRA    C     0.775    0.733    0.500\n    1GRA    C     0.725    0.767    0.500\n    1GRA    C     0.725    0.833    0.500\n    1GRA    C     0.775    0.867    0.500\n    1GRA    C     0.775    0.933    0.500\n    1GRA    C     0.725    0.967    0.500\n    1GRA    C     0.825    0.033    0.500\n    1GRA    C     0.875    0.067    0.500\n    1GRA    C     0.875    0.133    0.500\n    1GRA    C     0.825    0.167    0.500\n    1GRA    C     0.825    0.233    0.500\n    1GRA    C     0.875    0.267    0.500\n    1GRA    C     0.875    0.333    0.500\n    1GRA    C     0.825    0.367    0.500\n    1GRA    C     0.825    0.433    0.500\n    1GRA    C     0.875    0.467    0.500\n    1GRA    C     0.875    0.533    0.500\n    1GRA    C     0.825    0.567    0.500\n    1GRA    C     0.825    0.633    0.500\n    1GRA    C     0.875    0.667    0.500\n    1GRA    C     0.875    0.733    0.500\n    1GRA    C     0.825    0.767    0.500\n    1GRA    C     0.825    0.833    0.500\n    1GRA    C     0.875    0.867    0.500\n    1GRA    C     0.875    0.933    0.500\n    1GRA    C     0.825    0.967    0.500\n    1GRA    C     0.925    0.033    0.500\n    1GRA    C     0.975    0.067    0.500\n    1GRA    C     0.975    0.133    0.500\n    1GRA    C     0.925    0.167    0.500\n    1GRA    C     0.925    0.233    0.500\n    1GRA    C     0.975    0.267    0.500\n    1GRA    C     0.975    0.333    0.500\n    1GRA    C     0.925    0.367    0.500\n    1GRA    C     0.925    0.433    0.500\n    1GRA    C     0.975    0.467    0.500\n    1GRA    C     0.975    0.533    0.500\n    1GRA    C     0.925    0.567    0.500\n    1GRA    C     0.925    0.633    0.500\n    1GRA    C     0.975    0.667    0.500\n    1GRA    C     0.975    0.733    0.500\n    1GRA    C     0.925    0.767    0.500\n    1GRA    C     0.925    0.833    0.500\n    1GRA    C     0.975    0.867    0.500\n    1GRA    C     0.975    0.933    0.500\n    1GRA    C     0.925    0.967    0.500';var cell=ChemDoodle.readCIF(Fmol, 1,1,1);Mol1.loadContent([cell.molecule], [cell.unitCell]);Mol1.startAnimation();var $=function(id){return document.getElementById(id)};function setSupercell1(){var cell=ChemDoodle.readCIF(Fmol, $("Mol1x").value, $("Mol1y").value, $("Mol1z").value);Mol1.loadContent([cell.molecule], [cell.unitCell]);Mol1.repaint()}function setModel1(model){Mol1.specs.set3DRepresentation(model);Mol1.setupScene();Mol1.repaint()}function setProj1(yesPers){Mol1.specs.projectionPerspective_3D = yesPers;Mol1.setupScene();Mol1.repaint()}</script><br><table>视图: <input type="radio" name="group2" onclick="setProj1(true)">投影<input type="radio" name="group2" onclick="setProj1(false)" checked="">正交<br>模型: <input type="radio" name="model" onclick="setModel1(&#39;Ball and Stick&#39;)" checked="">球棍<input type="radio" name="model" onclick="setModel1(&#39;van der Waals Spheres&#39;)">范德华球<input type="radio" name="model" onclick="setModel1(&#39;Stick&#39;)">棍状<input type="radio" name="model" onclick="setModel1(&#39;Wireframe&#39;)">线框<input type="radio" name="model" onclick="setModel1(&#39;Line&#39;)">线型<br>超晶胞: X <input type=text style="width:20px;" id="Mol1x" value="1">&nbsp;&nbsp;Y <input type=text style="width:20px;" id="Mol1y" value="1">&nbsp;&nbsp;Z <input type=text style="width:20px;" id="Mol1z" value="1">&nbsp;&nbsp;<input type=button value="创建" onclick="setSupercell1()"><br>左键: 转动&nbsp;&nbsp; 滚轮: 缩放&nbsp;&nbsp; 双击: 开关自动旋转&nbsp;&nbsp; Alt+左键: 移动</table><br><figurecaption>Fig.1</figurecaption></figure></p>

## 2. 确定使用的力场

<p>在模拟时, 可以使用刚性的石墨烯模型, 也可以使用柔性的模型. 如果使用刚性的模型, 在模拟过程中石墨烯的结构保持不变, 所有不需要石墨烯自身的力场参数, 只需要石墨烯和体系中其他分子之间的相互作用参数. 如果使用柔性的模型, 在模拟过程中石墨烯的结构会发生变化, 这就需要能够描述石墨烯变形的力场参数. 在这种情况下, 模拟时还可以有两种处理方式. 一种是将石墨烯视为孤立的分子, 不考虑其周期性, 这样在模拟时边界碳原子由于缺少约束, 可能会卷曲. 如果发生了卷曲, 可以通过固定一些边界碳原子来解决. 另一种处理方式是将石墨烯视为具有周期性结构的无限体系, 这样就不存在边界碳原子, 也就不会发生石墨烯卷曲的问题. 请根据你自己的情况选择使用哪种模拟模式.</p>

<p>我们在这里将使用柔性的石墨烯模型, 而且考虑其周期性. 这样除石墨烯与其他分子的相互作用参数外, 我们还需要石墨烯自身的相互作用参数, 也就是能够描述石墨烯变形的力场.</p>

<p>根据自己的需要, 确定使用哪个石墨烯力场. 一般来说, 一个石墨烯的力场至少要考虑相邻两个碳原子之间的键, 相邻三个碳原子之间的键角, 相邻四个碳原子之间的二面角, 并且二面角可能有两种类型, 一类是顺式, 一类是反式. 更复杂的力场可能还要考虑1&#8211;3相邻碳原子之间的相互作用. 这种力场的一个例子可参见<a href="http://scitation.aip.org/content/aip/journal/jcp/134/18/10.1063/1.3589163">这篇论文</a>. 当然, 文献上还有其他的一些石墨烯力场, 请根据自己的情况选用.</p>

<p>在这里为简化起见, 我们使用OPLS-AA力场中的<code>opls_145</code>原子类型(苯的C原子)作为石墨烯中C原子的原型, 且只考虑碳碳键, 键角和二面角相互作用. 对一些小分子, 当没有现成的力场可用时, 选用已有力场中的类似原子类型进行构建是一个可行的方法. 当然, 这需要你去查看已有的力场文件, 并清楚里面已有的各种原子类型及其相应的参数.</p>

## 3. 准备n2t文件

<p>创建拓扑文件时需要判断原子之间的成键关系. <code>g_x2top</code>判断成键关系时使用了最简单的方法, 距离准则. 如果两个原子之间的距离小于或等于设定的值, 就认为这两个原子之间存在键合相互作用. 根据一个原子周围连接的键数与每个键所连接的原子类型就可以判定这个原子的类型. 判断成键关系的键长和原子周围的键数, 是由<code>n2t</code>文件读入的(n2t代表name to type), 所以在使用<code>g_x2top</code>工具前我们需要准备一个<code>n2t</code>文件. 为此, 我们需要知道此文件的格式.</p>

<p>我们先来看看OPLS-AA力场自带的<code>n2t</code>文件, 它位于<code>GROMACS主目录/share/top/oplsaa.ff/atomname2type.n2t</code>, 文件很小, 全部内容如下:</p>

<pre><code>C    opls_157    -0.18   12.011   4    H 0.108   H 0.108   H 0.108   C 0.150
C    opls_158    -0.12   12.011   4    H 0.108   H 0.108   C 0.150   C 0.150
C    opls_157     0.145  12.011   4    H 0.108   O 0.141   H 0.108   C 0.150
C    opls_157     0.145  12.011   4    H 0.108   H 0.108   O 0.108   C 0.150
C    opls_158     0.205  12.011   4    H 0.108   C 0.150   O 0.140   C 0.150
C    opls_158    -0.06   12.011   4    H 0.108   C 0.150   C 0.150   C 0.150
C    opls_145    -0.12   12.011   3    C 0.150   C 0.150   H 0.108
C    opls_145    -0.12   12.011   3    C 0.133   C 0.150   O 0.140
C    opls_235     0.5    12.011   3    C 0.133   N 0.140   O 0.140
C    opls_235     0.5    12.011   3    C 0.133   N 0.132   C 0.150
C    opls_235     0.5    12.011   3    C 0.133   N 0.132   H 0.108
O    opls_236    -0.5    15.9994  1    C 0.123
N    opls_238    -0.5    14.0067  3    H 0.108   C 0.140   C 0.150
N    opls_238    -0.5    14.0067  3    H 0.108   C 0.132   N 0.123
N    opls_238     0      14.0067  2    C 0.140   N 0.123
H    opls_140     0.06    1.008   1    C 0.108
H    opls_155     0.418   1.008   1    O 0.095
H    opls_241     0.30    1.008   1    N 0.095
O    opls_154    -0.683  15.9994  2    C 0.140   H 0.095
P    opls_393     1      30.97376 4    O 0.180   O 0.180   O 0.180   O 0.180
O    opls_395    -1      15.9994  2    P 0.180   H 0.095
O    opls_394    -1      15.9994  1    P 0.180
N    opls_237     0      14.0067  4    C 0.140   C 0.140   C 0.140   C 0.140
</code></pre>

<p>可以看到, 每个原子一行, 第一列为构型中的原子名称, 第二列为力场中原子类型, 第三列为原子的电荷, 第四列为原子的摩尔质量, 第五列为原子周围连接的其他原子数, 后面的列则分别给出所连接的每个原子的名称以及键长. 关于此文件格式的其他说明请参考GROMACS手册.</p>

<p>OPLS-AA自带的<code>n2t</code>文件内容很少, 不能满足我们的需要, 为此, 我们需要对其进行修改, 增加石墨烯碳原子的设置. 对未修饰的石墨烯, 不考虑周期性时, 可能的碳原子类型有三种: 分别对应于与周围一个, 两个和三个原子相连接的碳原子. 前两种是边界碳原子, 最后一种是正常的碳原子. 当考虑周期性时, 就需要考虑一种碳原子类型了. 此外, 我们假定石墨烯中碳原子的电荷为0, 当不考虑边界碳原子时, 这是个很好的近似. 当然, 文献中有些模拟的石墨烯表面是带电的. 如果你也需要这样做, 可以修改相应的电荷列.</p>

<p>在我们的石墨烯结构中, 碳碳键长为0.142 nm. 我们希望被修改的参数，同时尽量不影响的其他模拟。比较安全的做法是将<code>GROMACS主目录/share/top/oplsaa.ff/</code>目录拷贝到工作目录，所有的修改都在拷贝的<code>atomname2type.n2t</code>文件中进行。运行GROMACS时，程序会自动加载当前目录下的force field文件. 还有一种选择，就是在<code>GROMACS主目录/share/top/oplsaa.ff/</code>目录中拷贝一个<code>atomname2type.n2t</code>文件副本，将其命名为<code>graphene.n2t</code>，所有的修改都在<code>graphene.n2t</code>中进行.

<pre><code>C    opls_145   0.00      12.011  1    C 0.142
C    opls_145   0.00      12.011  2    C 0.142   C 0.142
C    opls_145   0.00      12.011  3    C 0.142   C 0.142   C 0.142
</code></pre>

<p>这三行分别定义了三种不同的碳原子类型, 并且指定碳原子之间的键长. 其中第三行说明如果体系中的任何一个碳原子, 与周围3个碳原子的距离都在0.142 nm左右, 就把它当作<code>opls_145</code>原子类型, 其电荷为0, 摩尔质量为12.011. 第一行和第二行的意义类似, 即说明与一个碳原子和与两个碳原子成键的碳原子被当成什么类型, 电荷多少, 摩尔质量多少.</p>

<p>需要说明的是, 上面的原子类型名称也可以使用自己定义的名称, 而不是使用力场中已有的原子类型, 这种情况下, <code>g_x2top</code>仍然能够生成拓扑文件, 只是要对拓扑文件进行更多的修改. 理论上只要明白拓扑文件的含义, 再借助<code>g_x2top</code>就可以创建需要的拓扑文件了.</p>

## 4. 生成拓扑文件

<p>运行下面的命令</p>

<pre><code>g_x2top -f gra.gro -o gra.top -ff oplsaa -pbc -name graphene -kb 400000 -kt 600 -kp 150
</code></pre>

<p>上面命令中<code>-ff</code>选项指明了使用的力场. <code>-pbc</code>选项指明计算成键时考虑周期性边界条件. 如果你将石墨烯视为孤立分子, 请使用<code>-nopbc</code>选项. <code>-name</code>选项指定了拓扑文件中分子的名称. 默认情况下, <code>g_x2top</code>会自动为键合相互作用加上力场参数, 但这种自动加入的力场参数并不是根据力场中相应原子类型间的键合参数加入的. 所以, 我们使用了选项<code>-kb</code>, <code>-kp</code>, <code>-kt</code>, 它们分别指定键, 键角和二面角的力常数, 它们的默认值为400000, 400, 5. 如果不想让程序自动加入力常数, 可以使用<code>-noparam</code>选项. 关于<code>g_x2top</code>的选项, 请参考其<a href="http://jerkwin.github.io/GMX/GMXprg#gmxx2top:根据坐标生成原始拓扑文件翻译:阮洋">文档</a>.(【陈建发 注】GROMACS 5.0.X版本存在bug, 运行会导致<code>segmentation fault</code>, 其他版本运行正常. 建议不要使用5.0系列版本.)</p>

<p>运行命令后, 屏幕上会输出类似下面的内容:</p>

<pre><code>Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/oplsaa.ff\atomname2type.n2t
Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/oplsaa.ff\graphene.n2t
There are 26 name to type translations in file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/oplsaa.ff
Generating bonds from distances...
atom 200
There are 1 different atom types in your sample
Generating angles and dihedrals from bonds...
Before cleaning: 1200 pairs
Before cleaning: 1200 dihedrals
There are  300 Ryckaert-Bellemans dihedrals,    0 impropers,  600 angles
           900 pairs,      300 bonds and   200 atoms
Total charge is 0, total mass is 2402.2

WARNING: topologies generated by g_x2top can not be trusted at face value.
         Please verify atomtypes and charges by comparison to other
         topologies.
</code></pre>

<p>可以看到, <code>g_x2top</code>在确定原子类型时, 使用了OPLS-AA自带的<code>atomname2type.n2t</code>文件, 也使用了我们创建的<code>graphene.n2t</code>文件. 对含200个碳原子的石墨烯, 程序计算得到键数300, 键角数600, 二面角数1200. 这些值与理论值相等(当碳原子是为N时, 若考虑周期性, 则键数为1.5N, 键角数3N, 二面角数6N), 这说明, <code>g_x2top</code>正确地确定了原子的类型和成键情况.</p>

<p>到这一步, 我们已经得到了一个比较原始的石墨烯的拓扑文件<code>gra.top</code>(<a href="/GMX/GMXtut-8_gra.top">下载</a>), 里面列出了所有的键合相互作用.</p>

## 5. 检查并修改拓扑文件

<p>在使用之前, 我们先检查一下前面得到的拓扑文件, 看看其中的信息是否完整, 需不需要修改.</p>

<p>打开得到的拓扑文件, 如果你熟悉GROMACS拓扑文件的格式, 就会发现, 里面列出了所有的键, 键角, 和二面角, 并根据我们的设定给出了势函数的参数. 你可以在这个拓扑文件的基础之上进行修改, 以满足自己的需要. 例如, 我们使用了最简单的简谐势来描述键, 键角和二面角, 因此只需要给出力常数即可. 如果你要使用更复杂的势能函数, 只有力常数是不够的, 这就需要你对相应的相互作用项进行修改.</p>

<p>在文件中, <code>[ bonds ]</code>部分内容类似下面这样:</p>

<pre><code>1     2     1 1.400000e-001 4.000000e+005 1.400000e-001 4.000000e+005
1    20     1 1.400000e-001 4.000000e+005 1.400000e-001 4.000000e+005
1   182     1 1.410000e-001 4.000000e+005 1.410000e-001 4.000000e+005
2     3     1 1.400000e-001 4.000000e+005 1.400000e-001 4.000000e+005
2    21     1 1.400000e-001 4.000000e+005 1.400000e-001 4.000000e+005
3     4     1 1.400000e-001 4.000000e+005 1.400000e-001 4.000000e+005
... ...
</code></pre>

<p>前两列为原子编号, 第三列为势函数类型, 第四列为碳碳的平衡键长, 第五列为力常数, 与我们设定的值一致, 最后两列对我们使用的势函数是多余的, 可以忽略或直接删除. <code>[ angles ]</code>和<code>[ dihedrals ]</code>部分的内容与此类似.</p>

<p>上面使用的力常数在某些情况下并不重要. 如果你只是用它们来维持石墨烯的近似刚性结构, 只要将它们设置为较大的值就可以了, 但值太大时可能会导致振动频率过高, 致使模拟不稳定, 或需要使用很小的时间步长. 如果你想使石墨烯更刚性(柔性), 只要增大(减小)力常数即可. 值得注意的是, 如果对你的模拟而言, 石墨烯的力学性质非常重要, 那你最好不要随意设置这些力常数, 而是需要使用能给出好的力学性质的石墨烯力场. 如果没有合适的, 可以试试前面提到个力场, 它能给出与实验值比较符合的力学性质和导热系数.</p>

<p>如果你不需要考虑石墨烯中碳原子之间的范德华相互作用, 可以将<code>[ moleculetype ]</code>部分的<code>nrexcl</code>改为1. 默认使用的3会考虑相邻3条键以上的两个碳原子之间的范德华相互作用.</p>

<p>如果你想要将碳原子设置为力场中没有的原子类型, 并需要加入特殊的力场参数, 则需要定义新的原子类型以及相互作用参数. 首先在<code>[ atomtypes ]</code>部分定义新的原子类型, 然后在 <code>[ nonbond_params ]</code>里面添加范德华相互作用参数. 如果前面运行<code>g_x2top</code>时使用了<code>-noparam</code>, 还需要设定键合参数. 可使用下面几种方法:</p>

<ol class="incremental">
<li>直接在拓扑文件中每一个键合项的后面加入相应力场参数, 类似于<code>g_x2top</code>自动在添加力场参数的方式. 使用支持列编辑的文本编辑工具, 比较容易完成.</li>
<li>不在拓扑文件中添加, 而是在<code>ffbonded.itp</code>文件中的<code>[ bondtypes ]</code>, <code>[ angletypes ]</code>和<code>[ dihedraltypes ]</code>中加入相应的项. 这种方法会对力场文件进行修改, 不建议.</li>
<li>将上面的内容单独写进一个<code>.itp</code>文件, 之后<code>#include</code>进拓扑文件中. 这种方法比较省事也易于修改.</li>
<li><code>g_x2top</code>可以生成一个<code>.rtp</code>文件, 如果将<code>.rtp</code>文件加入到力场中的<code>.rtp</code>数据库中, 就可以利用<code>pdb2gmx</code>命令生成拓扑文件. 这需要原子类型存在于<code>.atp</code>文件中, 否则使用<code>pdb2gmx</code>命令会出错. 这种方法需要熟悉GROMACS的力场处理方式, 只适合有经验的用户.</li>
</ol>

## 6. 运行模拟

<p>得到了拓扑文件后, 我们再创建一个<code>vac.mdp</code>文件(<a href="/GMX/GMXtut-8_vac.mdp">下载</a>), 并搭配前面的<code>gro</code>文件就可以进行真空中的模拟了. 运行下面的命令进行模拟:</p>

<pre><code>grompp -f vac.mdp -c gra.gro -p gra.top -o vac.tpr
mdrun -v -deffnm vac
</code></pre>

<p>如果你要填充溶剂分子或其他分子, 请参考其他的教程. 下面是一个添加水分子进行水溶液中模拟的简单示例.</p>

<ul class="incremental">
<li><p>先填充水分子: <code>genbox -cp gra.gro -cs spc216.gro -o gra_wat.gro</code>, (<a href="/GMX/GMXtut-8_gra_wat.gro">下载gra_wat.gro</a>)</p></li>
<li><p>再将拓扑文件<code>gra.top</code>另存为<code>gra_wat.top</code>并进行修改: 在文件的开始处包含使用的水分子模型<code>#include &quot;oplsaa.ff/spce.itp&quot;</code>, 在文件的结束处添加填充水分子的名称和数目<code>SOL               252</code>, (<a href="/GMX/GMXtut-8_gra_wat.gro">下载gra_wat.gro</a>)</p></li>
<li><p>然后创建文件<code>nvt.mdp</code> (<a href="/GMX/GMXtut-8_nvt.mdp">下载</a>)</p></li>
<li><p>最后执行下面的命令:</p>

<pre><code>grompp -f nvt.mdp -c gra_wat.gro -p gra.top -o nvt.tpr
mdrun -v -deffnm nvt
</code></pre></li>
</ul>

## 总结

<p>本文只对创建石墨烯的拓扑文件进行了介绍, 按照这个思路, 只要有了确定的力场参数以及电荷信息, 同样可以创建BN, SiC, CNT, SiN, PNT等材料的拓扑文件. 对于有机小分子有时也可以使用这种方法.</p>

## 参考资料

<ol class="incremental">
<li><a href="http://bbs.keinsci.com/forum.php?mod=viewthread&amp;tid=454&amp;extra=page%3D1">使用GROMACS模拟碳纳米管的一个简单例子</a></li>
<li><a href="http://sobereva.com/39/">Amber与Gromacs读入碳纳米管的方法</a></li>
<li><a href="http://www.gromacs.org/Documentation/How-tos/Carbon_Nanotube">GROMACS Carbon Nanotube</a></li>
<li><a href="http://chembytes.wikidot.com/grocnt">Modeling Carbon Nanotubes with GROMACS</a></li>
<li><a href="https://www.mail-archive.com/gromacs.org_gmx-users%40maillist.sys.kth.se/msg11108.html">help on Graphene Nano Sheets</a></li>
<li><a href="http://machine-phase.blogspot.com/2009/04/single-wall-carbon-nanotubes-in-403.html">Single Wall Carbon Nanotubes in 4.0.3 GROMACS</a></li>
</ol>

## 评论

- 2016-10-13 15:04:53 `李晨亮` 您好，按照您例子的过程，我计算了一下，但是为什么我编写的.n2t文件，在生成top文件时不识别，只是识别程序自带的atomname2type.n2t文件？谢谢
- 2016-10-14 08:57:20 `Jerkwin` 你自己的文件放在 GROMACS主目录/share/top/oplsaa.ff/目录 下了么?
- 2016-10-14 12:44:42 `李晨亮` 放在GROMACS主目录/share/top/oplsaa.ff/下了！
- 2016-10-14 12:46:10 `李晨亮` 我用的是gromacs5.0.5版本，这跟版本有关系吗？
- 2016-10-14 22:47:04 `Jerkwin` 我测试了, gmx4.6和5.1.2版本都没有问题. 没有使用过你的版本, 不清楚. 实在不行, 你可以将自己的内容添加到默认的n2t文件中.
- 2016-10-17 11:37:18 `李晨亮` 我也试着将内容添加到默认的n2t文件中，但是读取力场时，也只是读取23行，而不读取我自己加进去的那三行！
- 2016-10-17 23:05:22 `Jerkwin` 你加入下面的群吧, 我帮你看看
- 2016-10-19 09:03:38 `雨加雪` 问题解决了，是我的n2t文件格式有点问题！谢谢
	已经申请加群，等待批准！

- 2016-12-23 22:01:41 `白杨` 老师，我在模拟石墨烯的时候遇到了您上面写出来的代码3错误信息。把石墨烯position restraint，C原子之间有键相连。提示说\two-body bonded interactions: 26.179 nm\，这个距离太大了，没法区域分解……为什么会出现这个问题？老师能否指点下我，好着急……
- 2016-12-25 10:42:13 `Jerkwin` 我怀疑是你的top有问题, 或者你没有使用periodic‐molecules选项
- 2016-12-27 11:16:58 `白杨` 老师，top我弄的很简单，[ moleculetypes ] [ bonds ]……确实没使用periodic-molecules选项，石墨烯边到box边界有一段距离，我试试老师说的periodic-molecules，谢谢老师
- 2016-12-28 15:21:27 `Jerkwin` 如果有键相互作用的话, 盒子大小必须精确地与周期性匹配, 且使用periodic-molecules选项, 否则的话, 肯定是错误的
