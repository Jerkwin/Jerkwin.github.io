---
 layout: post
 title: gmx_puckering使用示例
 categories:
 - 科
 tags:
 - gmx
 - gnuplot
 chem: true
---

- 2021-11-06 23:16:43

`gmx_puckering`的背景说明见前一篇.

## 模拟流程

<figure><script>var Mol1=new ChemDoodle.TransformCanvas3D('Mol-1',502,376.5);Mol1.specs.shapes_color='#fff';Mol1.specs.backgroundColor='black';Mol1.specs.set3DRepresentation('Ball and Stick');Mol1.specs.projectionPerspective_3D=false;Mol1.specs.compass_display=true;
/*//Mol1.specs.atoms_resolution_3D=15;
//Mol1.specs.bonds_resolution_3D=15;
//Mol1.specs.crystals_unitCellLineWidth=1.5;*/
Mol1.nextFrame=function(delta){var matrix=[];ChemDoodle.lib.mat4.identity(matrix);var change=delta*Math.PI/15000;ChemDoodle.lib.mat4.rotate(matrix,change,[1,0,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,1,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,0,1]);ChemDoodle.lib.mat4.multiply(this.rotationMatrix, matrix)};
Mol1.startAnimation=ChemDoodle._AnimatorCanvas.prototype.startAnimation;Mol1.stopAnimation=ChemDoodle._AnimatorCanvas.prototype.stopAnimation;Mol1.isRunning=ChemDoodle._AnimatorCanvas.prototype.isRunning;Mol1.dblclick=ChemDoodle.RotatorCanvas.prototype.dblclick;Mol1.timeout=5;Mol1.handle=null;
var Fmol='45\n4GB\nH 16.210 10.260 11.500\nO 15.330 10.320 11.120\nC 14.970 11.700 11.150\nH 15.380 12.200 10.280\nO 15.550 12.300 12.360\nC 15.100 13.690 12.620\nH 15.370 14.320 11.770\nC 15.810 14.220 13.870\nH 15.480 13.690 14.760\nH 15.600 15.290 14.000\nO 17.220 14.030 13.700\nH 17.370 13.120 13.440\nC 13.580 13.670 12.770\nH 13.330 12.910 13.510\nC 12.970 13.240 11.420\nH 13.320 13.890 10.620\nO 11.530 13.270 11.460\nH 11.220 12.710 10.730\nC 13.420 11.790 11.170\nH 13.030 11.150 11.960\nO 12.900 11.360 9.900\nH 13.250 10.470 9.740\nO 13.150 14.990 13.260\nC 11.810 15.090 13.870\nH 11.060 15.250 13.090\nC 11.830 16.300 14.830\nH 10.810 16.540 15.150\nC 12.710 15.990 16.040\nH 13.740 15.830 15.710\nC 12.220 14.760 16.810\nH 11.220 14.940 17.220\nC 12.210 13.550 15.880\nH 13.240 13.310 15.600\nC 11.580 12.300 16.510\nH 12.060 12.070 17.460\nH 10.520 12.470 16.710\nO 11.720 11.170 15.630\nH 12.640 10.950 15.520\nO 11.450 13.880 14.640\nO 13.150 14.520 17.880\nH 13.300 15.370 18.310\nO 12.680 17.130 16.940\nH 12.730 17.910 16.380\nO 12.400 17.460 14.160\nH 13.060 17.150 13.520\n';molxyz=ChemDoodle.readXYZ(Fmol)
Mol1.loadMolecule(ChemDoodle.readXYZ(Fmol));
Mol1.startAnimation();Mol1.stopAnimation();function setProj1(yesPers){Mol1.specs.projectionPerspective_3D=yesPers;Mol1.setupScene();Mol1.repaint()}function setModel1(model){Mol1.specs.set3DRepresentation(model);Mol1.setupScene();Mol1.repaint()}function setSpeed1(){Mol1.timeout=500-document.getElementById('spd1').value;Mol1.loadMolecule(ChemDoodle.readXYZ(Fmol));
Mol1.startAnimation()}</script><br><span class='meta'>视图: <input type='radio' name='group2' onclick='setProj1(true)'>投影 <input type='radio' name='group2' onclick='setProj1(false)' checked=''>正交&nbsp;&nbsp;&nbsp;&nbsp;速度: <input type='range' id='spd1' min='1' max='500' onchange='setSpeed1()'/><br>模型: <input type='radio' name='model' onclick='setModel1(&#39;Ball and Stick&#39;)' checked=''>球棍 <input type='radio' name='model' onclick='setModel1(&#39;van der Waals Spheres&#39;)'>范德华球 <input type='radio' name='model' onclick='setModel1(&#39;Stick&#39;)'>棍状 <input type='radio' name='model' onclick='setModel1(&#39;Wireframe&#39;)'>线框 <input type='radio' name='model' onclick='setModel1(&#39;Line&#39;)'>线型&nbsp;&nbsp; <input type='checkbox' onclick='Mol1.specs.atoms_displayLabels_3D=this.checked;Mol1.repaint()'>名称<br>左键: 转动&nbsp;&nbsp; 滚轮: 缩放&nbsp;&nbsp; 双击: 自动旋转开关&nbsp;&nbsp; Alt+左键: 移动</span><br><figurecaption>Fig.1</figurecaption></figure>

1. 使用`AmberTools`构建一个最简单的含两个糖环的多糖分子, 并输出Amber格式的拓扑和坐标
2. 使用`acpype`将Amber格式的坐标和拓扑转换为GROMACS格式
3. 使用`gmx editconf -d 1`将盒子修改为合适大小
4. 为简单起见, 不填充溶剂, 只做真空中的NVT模拟, 这样环的构象变化快些, 多些
5. 使用`gmx_puckering`分析环构象

## `gmx_puckering`分析环构象

`gmx_puckering`可分析单个环, 也可以同时分析多个环. 需要注意的是原子索引编号的排列顺序. 对五元环, 原子排列顺序必须是`O2 C5 C4 C3 C2`, 对六元环则是`O5 C1 C2 C3 C4 C5`. 如果名称不匹配, 程序会给出警告. 不同排列顺序是否影响结果, 待考.

下面是`gmx_puckering`的说明文档:

<div class="highlight"><pre style="line-height:125%"><span></span>                        :-<span style="color: #666666">)</span>  gmx_puckering  <span style="color: #666666">(</span>-:

                       written <span style="color: #666666">2007</span> by Oliver Stueker
                       revised <span style="color: #666666">2021</span> by Jicun  Li
                       GNU General Public License

DESCRIPTION

gmx_puckering is an analysis-tool <span style="color: #AA22FF; font-weight: bold">for</span> calculating the Cremer-Pople ring puckering
parameters of Pyranoses and Hexanoses within a given GROMACS trajectory file.

The index file needs to contain atom-sextuples or atom-quintuples in the order:
  * O2 C5 C4 C3 C2    <span style="color: #AA22FF; font-weight: bold">for</span> Pyranoses, or
  * O5 C1 C2 C3 C4 C5 <span style="color: #AA22FF; font-weight: bold">for</span> Hexanoses or
as defined by Cremer and Pople in
  Cremer, D.; Pople, J. A., General definition of ring puckering coordinates,
  J. Am. Chem. Soc. 1975, 97, <span style="color: #666666">(</span>6<span style="color: #666666">)</span>, 1354-1358.

If the number of atoms in the group is not divisible by the ringsize give
by -i the program will give an Error and exit. The program will also chec
<span style="color: #AA22FF; font-weight: bold">if</span> the atomnames match to the scheme given above and give a warning <span style="color: #AA22FF; font-weight: bold">if</span> th
names don<span style="color: #BB4444">&#39;</span>t match, which can be suppressed by using the -noname option.

Following plots are available:
 -o    cp_Q-theta-phi.xvg    Q/Theta/Phi vs. Time
 -otp    cp_theta-phi.xvg    Theta vs. Phi
 -od   cp_dtheta-dphi.xvg    Distribution of Theta/Phi
 -or          cp_ring.xvg    IUPAC Canonical Ring Conformation

Acknowledgments:
 * GROMACS - http://www.gromacs.org
 * g_puckering of Oliver Stueker - http://www.gromacs.org/Downloads/User_contributions/Other_software
 * mdxvu of Mark J. Forster - http://sourceforge.net/projects/mdxvu/

Option          Filename  Type         Description
------------------------------------------------------------
 -s            topol.tpr  Input        Structure+mass<span style="color: #666666">(</span>db<span style="color: #666666">)</span>: tpr tpb tpa gro g96 pdb
                                        xml
 -f             traj.xtc  Input        Generic trajectory: xtc trr trj gro g96 pdb
 -n            index.ndx  Input        Index file
 -o   cp_Q-theta-phi.xvg  Output       xvgr/xmgr file
 -otp   cp_theta-phi.xvg  Output, Opt. xvgr/xmgr file
 -od  cp_dtheta-dphi.xvg  Output, Opt. xvgr/xmgr file
 -or         cp_ring.xvg  Output, Opt. xvgr/xmgr file

      Option   Type  Value  Description
------------------------------------------------------
       -nice    int      <span style="color: #666666">0</span>  Set the nicelevel
          -b   <span style="color: #AA22FF">time</span>      <span style="color: #666666">0</span>  First frame <span style="color: #666666">(</span>ps<span style="color: #666666">)</span> to <span style="color: #AA22FF">read</span> from trajectory
          -e   <span style="color: #AA22FF">time</span>      <span style="color: #666666">0</span>  Last frame <span style="color: #666666">(</span>ps<span style="color: #666666">)</span> to <span style="color: #AA22FF">read</span> from trajectory
         -dt   <span style="color: #AA22FF">time</span>      <span style="color: #666666">0</span>  Only use frame when t MOD <span style="color: #B8860B">dt</span> <span style="color: #666666">=</span> first <span style="color: #AA22FF">time</span> <span style="color: #666666">(</span>ps<span style="color: #666666">)</span>
      -<span style="color: #666666">[</span>no<span style="color: #666666">]</span>w   bool     no  View output xvg, xpm, eps and pdb files
          -i    int      <span style="color: #666666">6</span>  Size of Ring
      -<span style="color: #666666">[</span>no<span style="color: #666666">]</span>v   bool     no  Be loud and noisy
   -<span style="color: #666666">[</span>no<span style="color: #666666">]</span>dist   bool    yes  Warn <span style="color: #AA22FF; font-weight: bold">if</span> distance between neighboring Ringatoms is
                            larger that 0.3 nm.
   -<span style="color: #666666">[</span>no<span style="color: #666666">]</span>name   bool    yes  Warn <span style="color: #AA22FF; font-weight: bold">if</span> Atomnames don<span style="color: #BB4444">&#39;</span>t match with Definition by
                            Cremer &amp; Pople.</pre></div>

输出文件最多有4个,

- `cp_Q-theta-phi.xvg`: CP坐标(Q, θ, φ)随时间变化图
- `  cp_theta-phi.xvg`: (θ, φ)图, 或称极性图, 类似蛋白二级结果的拉氏图
- `cp_dtheta-dphi.xvg`: θ和φ的分布图
- `       cp_ring.xvg`: 环构象随时间变化的图

前3个文件的绘制无甚可言, 第4个环构象文件的绘制值得深入思考一下.

## 环构象数据的绘制

对于环构象随时间演化数据, 绘制其构象编号的演化可以, 但不直观. 绘制构象的名称, 类似蛋白二级结构图, 好些, 但仍不易识别各个构象之间的关系. 更好的方法是将其绘制在球面上, 因为三个CP坐标相当于球坐标. 但这样得到的图形是三维的, 在平面中展示不方便, 也会出现遮挡. 退而求其次, 可以考虑将球面展开, 绘制成平面图, 类似绘制世界地图的做法. 由于球面是不可展曲面, 展开成平面时必定存在变形, 所以需要考虑使用哪种投影. 常用的投影方法有很多种, 维基上有个[列表](https://en.wikipedia.org/wiki/List_of_map_projections), ArcGIS Pro的文档中也有[一些说明](https://pro.arcgis.com/zh-cn/pro-app/latest/help/mapping/properties/list-of-supported-map-projections.htm).

最简单的方法, 直接以(θ,φ)作为平面坐标绘制, 相当于球半径无穷大时的情形. 这样失真最大, 无法感受各点之间的空间关系.

![](https://jerkwin.github.io/pic/cp-tq.png)

更高级点的投影方法, 各有侧重, 有的保持距离角度不变, 如Mercator投影, 方便用作航海图; 有的保持面积不变, 如Hammer-Aitoff投影, 正弦投影, 用作特定领域; 有的采取折衷方案, 尽量最小化各种偏差, 如Winkel三重投影, 可绘制通用地图. 这几种投影方法都有显式方程, 很方便使用.

![](https://jerkwin.github.io/pic/cp-ring.png)

对比一下可看到, Hammer-Aitoff投影和正弦投影看起来效果更好些.
