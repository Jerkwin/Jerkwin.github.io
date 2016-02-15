---
 layout: post
 title: GROMACS文件类型(名称排序)
 categories:
 - 科
 tags:
 - GMX
---

* toc
{:toc}

## <code>dat</code>

<ul class="incremental">
<li>通用, 用作输入文件更好 <a href="http://manual.gromacs.org/online/dat.html">原始文档</a></li>
</ul>

## <code>edi</code>

<ul class="incremental">
<li>关键动力学约束输入, 用于<code>gmx mdrun</code> <a href="http://manual.gromacs.org/online/edi.html">原始文档</a></li>
</ul>

## <code>edo</code>

<ul class="incremental">
<li>关键动力学约束输出, 用于<code>gmx mdrun</code> <a href="http://manual.gromacs.org/online/edo.html">原始文档</a></li>
</ul>

## <code>edr</code>

<ul class="incremental">
<li>能量, 温度, 压力, 盒子尺寸, 密度和维里(二进制, 可移植) <a href="http://manual.gromacs.org/online/edr.html">原始文档</a></li>
</ul>

<p>系统能量文件, 记录模拟输入文件中定义的能量组的各种相互作用能量等.</p>

## <code>ene</code>

<ul class="incremental">
<li>能量, 温度, 压力, 盒子尺寸, 密度和维里(二进制) <a href="http://manual.gromacs.org/online/ene.html">原始文档</a></li>
</ul>

## <code>eps</code>

<ul class="incremental">
<li>封装Postscript <a href="http://manual.gromacs.org/online/eps.html">原始文档</a></li>
</ul>

<p>封装ps文件格式, 并不是GROMACS自身文件格式, 可以当图片打开. LINUX系统下一般已经有默认打开程序, WINDOWS下要安装其他打开程序. GROMACS的DSSP和罗麽占陀罗图等通过xpm2ps处理后都是这个文件格式.</p>

## <code>g96</code>

<ul class="incremental">
<li>GROMOS&#8211;96格式, 只含坐标x(文本, 固定高精度) <a href="http://manual.gromacs.org/online/g96.html">原始文档</a></li>
</ul>

<p>分子坐标文件. GROMOS96程序的分子坐标文件, 模拟程序以15.9的C语言格式写入, 精度较高, 但是会比较大. 包含有文件头, 时间步, 原子坐标, 原子速度, 以及盒子信息等.</p>

## <code>gro</code>

<ul class="incremental">
<li>GROMACS格式, 坐标x和速度v(文本, 任意精度)<a href="http://manual.gromacs.org/online/gro.html">原始文档</a></li>
</ul>

<p>分子坐标文件. GROMACS最主要的分子坐标文件, 只记录原子坐标和速. 该文件类型的各个文本列字数固定, C语言的写入格式为:</p>

<p><code>&quot;%5d%5s%5s%5d%8.3f%8.3f%8.3f%8.4f%8.4f%8.4f&quot;</code></p>

<p>具体固定文本列有:</p>

<ul class="incremental">
<li>残基序号, 5位</li>
<li>残基名称, 5位</li>
<li>原子名称, 5位</li>
<li>原子序号, 5位</li>
<li>原子坐标, 三列, X, Y, Z坐标各8位, 含3个小数位</li>
<li>原子速度, 同坐标, 速度单位为nm/ps(km/s)</li>
</ul>

## <code>itp</code>

<ul class="incremental">
<li>包含拓扑(文本) <a href="http://manual.gromacs.org/online/itp.html">原始文档</a></li>
</ul>

<p>分子拓扑文件, 被主拓扑文件包含的分子拓扑文件, 一般包含某个特定的分子类型. 与主拓扑文件的区别在于它不引用其他力场文件, 同时包含<code>[ system ]</code>, <code>[ molecule ]</code>等拓扑段.</p>

## <code>log</code>

<ul class="incremental">
<li>日志文件 <a href="http://manual.gromacs.org/online/log.html">原始文档</a></li>
</ul>

## <code>m2p</code>

<ul class="incremental">
<li>用作<code>gmx xpm2ps</code>的输入文件 <a href="http://manual.gromacs.org/online/m2p.html">原始文档</a></li>
</ul>

<p><code>xpm2ps</code>程序的配置文件, 定义输出eps文件中颜色, 字体种类及大小等.</p>

## <code>map</code>

<ul class="incremental">
<li>颜色映射输入, 用于<code>gmx do_dssp</code> <a href="http://manual.gromacs.org/online/map.html">原始文档</a></li>
</ul>

## <code>mdp</code>

<ul class="incremental">
<li>运行参数文件, 用作<code>gmx grompp</code>与<code>gmx convert-tpr</code>的输入文件 <a href="http://manual.gromacs.org/online/mdp.html">原始文档</a></li>
</ul>

<p>GROMACS模拟的配置文件, 所含定义较多, 各关键字的含义可以查阅GROMACS手册, 以明白各关键字的含义.</p>

## <code>mtx</code>

<ul class="incremental">
<li>二进制矩阵数据 <a href="http://manual.gromacs.org/online/mtx.html">原始文档</a></li>
</ul>

## <code>ndx</code>

<ul class="incremental">
<li>索引文件 <a href="http://manual.gromacs.org/online/ndx.html">原始文档</a></li>
</ul>

<p>原子索引文件, 含原子的序号, 当使用<code>make_ndx</code>程序生成索引文件时, 可以定义不同的原子组, 每组名下即是该组所含各个原子的序号.</p>

## <code>out</code>

<ul class="incremental">
<li>通用, 更宜用作输出 <a href="http://manual.gromacs.org/online/out.html">原始文档</a></li>
</ul>

## <code>pdb</code>

<ul class="incremental">
<li>蛋白质数据库格式, 只含坐标x(文本, 降低精度) <a href="http://manual.gromacs.org/online/pdb.html">原始文档</a></li>
</ul>

## <code>rtp</code>

<ul class="incremental">
<li>残基拓扑(文本) <a href="http://manual.gromacs.org/online/rtp.html">原始文档</a></li>
</ul>

<p>残基力场参数文件, 包含常见残基的力场信息, 包括残基所含原子, 成键种类等. 使用<code>pdb2gmx</code>处理PDB文件时, 程序按照PDB文件信息, 在<code>rtp</code>文件中寻找对应的残基力场信息.</p>

## <code>tex</code>

<ul class="incremental">
<li>LaTeX输入 <a href="http://manual.gromacs.org/online/tex.html">原始文档</a></li>
</ul>

## <code>tng</code>

<ul class="incremental">
<li>任意类型数据(压缩, 可移植, 任意精度) <a href="http://manual.gromacs.org/online/tng.html">原始文档</a></li>
</ul>

## <code>top</code>

<ul class="incremental">
<li>体系拓扑(文本) <a href="http://manual.gromacs.org/online/top.html">原始文档</a></li>
</ul>

<p>模拟体系的拓扑文件, 一般还会引用其他力场文件(<code>#include</code>). <code>top</code>文件一般由<code>pdb2gmx</code>产生.</p>

## <code>tpa</code>

<ul class="incremental">
<li>体系拓扑, 参数, 坐标与速度(文本) <a href="http://manual.gromacs.org/online/tpa.html">原始文档</a></li>
</ul>

## <code>tpb</code>

<ul class="incremental">
<li>体系拓扑, 参数, 坐标与速度(二进制) <a href="http://manual.gromacs.org/online/tpb.html">原始文档</a></li>
</ul>

## <code>tpr</code>

<ul class="incremental">
<li>体系拓扑, 参数, 坐标与速度(二进制, 可移植) <a href="http://manual.gromacs.org/online/tpr.html">原始文档</a></li>
</ul>

<p>模拟打包文件, 打包模拟需要的各种信息, 包括模拟体系, 模拟控制等.</p>

## <code>trj</code>

<ul class="incremental">
<li>坐标x, 速度v和力f(二进制, 全精度) <a href="http://manual.gromacs.org/online/trj.html">原始文档</a></li>
</ul>

<p>全精度轨迹文件, 包含模拟体系各个时间下的原子坐标, 速度和受力等. 所含帧数频率由<code>mdp</code>文件控制, 文件较大.</p>

## <code>trr</code>

<ul class="incremental">
<li>坐标x, 速度v和力f(二进制, 全精度, 可移植) <a href="http://manual.gromacs.org/online/trr.html">原始文档</a></li>
</ul>

## <code>xpm</code>

<ul class="incremental">
<li>文本矩阵数据, 使用<code>gmx xpm2ps</code>来转换为<code>eps</code> <a href="http://manual.gromacs.org/online/xpm.html">原始文档</a></li>
</ul>

<p>数据矩阵文件, 矩阵中每个值为矩阵点所表示的物理量大小(也可以是逻辑值). 该文件其实就是二维图, 可以使用<code>xpm2ps</code>转换为图片.</p>

## <code>xtc</code>

<ul class="incremental">
<li>只含坐标x(压缩, 可移植, 任意精度) <a href="http://manual.gromacs.org/online/xtc.html">原始文档</a></li>
</ul>

<p>模拟轨迹低精度文件, 文件较<code>trr</code>和<code>trj</code>小, 为常用的分析文件. 包含模拟体系中原子坐标, 模拟时间和模拟盒子信息等.</p>

## <code>xvg</code>

<ul class="incremental">
<li>xvgr输入 <a href="http://manual.gromacs.org/online/xvg.html">原始文档</a></li>
</ul>

<p>二维图表文件. 二维画图工具<code>xmgrace</code>的默认文件, 可以使用<code>xmgrace</code>打开.</p>
