---
 layout: post
 title: GROMACS教程：计算蛋白质不同螺旋之间的夹角
 categories:
 - 科
 tags:
 - gmx
---

* toc
{:toc}

<ul>
<li>整理: 王浩博; 补充: 李继存</li>
</ul>

<p>在蛋白质模拟中有时需要分析不同螺旋之间的夹角, 并利用它来表征蛋白质的不同状态.
本文档讨论如何利用GROMACS计算不同螺旋之间的夹角.</p>

## 定义螺旋轴的轴矢量

<p>不同螺旋之间的夹角, 实际就是不同螺旋轴的轴矢量之间的夹角. 所以首先必须明确定义螺旋轴的轴矢量.
根据螺旋轴轴矢量定义的不同, 计算其夹角采用的方法也不同.</p>

<p>数学上, 定义螺旋轴轴矢量的最严格方法是将蛋白质CA原子的位置拟合为螺旋线, 进而求得螺旋轴的轴矢量. <code>gmx helix</code>程序可以拟合螺旋轴, 可惜的是不能输出螺旋轴的方向. 但参考资料[1]和[2]中给出的两个代码可以完成拟合工作, 不过需要一点前期处理.</p>

<p>虽然拟合螺旋线的方法数学上很严格, 但只适用于螺旋弯曲不大的情况. 如果模拟过程中螺旋的变形严重, 弯曲度很大, 在拟合螺旋线时很可能不收敛或得到不合理的值, 致使计算失败. 然而, 在螺旋弯曲不大的情况下, 我们可以简单地利用质心来定义螺旋的方向. 螺旋轴的底部定义为头端几个残基的质心, 顶部定义为尾端几个残基的质心. 计算质心所用的原子可以采用主链上的重原子, 也可以值采用主链上的CA原子, 但不能使用侧链原子. 需要注意的是, 选用的残基数最好包含整数个螺旋, 否则得到的轴可能与实际偏离较大. 如果采用这种方法定义螺旋的轴矢量, 可利用<code>gmx bundle</code>来计算不同螺旋轴之间的夹角.</p>

<p>再一种定义螺旋轴轴矢量的方法是利用惯性主轴. 对于较长的螺旋轴, 沿轴向的转动惯量最大, 利用这一点, 我们就可以利用转动惯量的主轴来定义螺旋的轴矢量.
这种方法适用于任何情况, 可用于定义任意一组原子的轴向. 可利用<code>gmx procipal</code>计算惯性主轴的方向, 然后再计算两个主轴之间的夹角, 即可得到这种定义方式下两个螺旋之间的夹角.</p>

<p>参考资料[4]中也给出了几种计算螺旋轴向的近似方法, 主要思想是利用近邻CA原子之间矢量的平均, 这种方法简单易行, 也可以考虑.</p>

## 计算不同螺旋之间的夹角

### 1. 获得模拟轨迹

<p>如果使用AMBER轨迹, 需要先利用<code>.parm7</code>文件将<code>.nc</code>轨迹转换为GROMACS支持的轨迹格式, GROMACS支持下面几种格式的轨迹文件: xtc trr cpt trj gro g96 pdb tng.
虽未明说, 运行<code>gmx bundle</code>时实际也可使用AMBER <code>.dcd</code>格式的轨迹.</p>

<p>将<code>.nc</code>轨迹转换为<code>.dcd</code>格式的脚本(<code>.dcd</code>格式不包含时间信息, 但不是很重要, 也可最后手动添加)</p>

<pre><code>cpptraj strip.parm7 &lt;&lt;EOF
    trajin file.nc
    trajout file.dcd dcd
    go
EOF
</code></pre>

<p>另外, 运行<code>gmx bundle</code>时还需要<code>.tpr</code>文件.</p>

### 2. 创建定义轴矢量的索引文件

<p>利用<code>make_ndx</code>(或<code>g_select</code>)创建索引文件, 并在其中指定定义螺旋轴两端的质心组. 运行</p>

<pre><code>make_ndx -f conf.gro
</code></pre>

<p>假定待处理的两根螺旋的残基编号分别为43&#8211;52和62&#8211;73, 如果想利用CA来定义质心组, 则提示时可输入</p>

<pre><code>r 43-47 | r 62-66 &amp; a CA
r 48-52 | r 69-73 &amp; a CA
q
</code></pre>

<p>上面两组选择分别定义了两个螺旋的底部和顶部, 每个使用了5个残基. 注意, 每组的原子数必须相同, 且为偶数, 否则运行后面的命令会出错.</p>

### 3. 计算倾斜角

<p>使用<code>gmx bundle</code>计算两个螺旋轴相对于平均轴的倾斜角</p>

<pre><code>g_bundle -f traj.trr -s topol.tpr -n index.ndx -na 2 -oa
</code></pre>

<p>使用<code>-na 2</code>是因为只有两个轴, 使用<code>-oa</code>可输出轴坐标的PDB文件供查看或检验计算结果.</p>

<p>提示选择组时, 指定上一步定义的两个组即可.</p>

### 4. 分析输出文件

<p>倾斜角的计算结果默认存在<code>bun_tilt.xvg</code>中, 但保存的是每个螺旋轴与平均螺旋轴的夹角, 而不是要求的两个螺旋轴之间的夹角. </p>

<p>只有当两个螺旋轴处于同一平面内时, 两个螺旋轴之间的夹角才等于第一个螺旋轴与平均轴之间夹角再加上第二个螺旋轴与平均轴之间的夹角, 也就是文件第二栏和第三栏之和. 这时可以简单地利用awk脚本计算夹角, 示例如下:</p>

<pre><code>awk '/^[^#@]/ { print $1, $2+$3 }' bun_tilt.xvg &gt; angle.dat
</code></pre>

<p>当要研究的两个螺旋轴处于不同平面内时, 上面使用的方法得到的结果不正确. 这种情况下可以利用<code>axes.pdb</code>中保存的两个坐标轴方向来计算, 示例awk脚本如下:</p>

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
awk ' BEGIN{rad2deg=45/atan2(1,1)}
	/t=/ {t=$NF}
	/ATOM +1/{x1  = $6; y1  = $7; z1  = $8}
	/ATOM +3/{x1 -= $6; y1 -= $7; z1 -= $8}
	/ATOM +4/{x2  = $6; y2  = $7; z2  = $8}
	/ATOM +6/{x2 -= $6; y2 -= $7; z2 -= $8}
	/TER/ {print t, Acos((x1*x2+y1*y2+z1*z2)/sqrt((x1^2+y1^2+z1^2)*(x2^2+y2^2+z2^2)))*rad2deg}

	function Acos(x) { return atan2(sqrt(1-x*x),x) }
' axes.pdb
</code></pre>

<p>如果你使用<code>.dcd</code>轨迹文件而没有时间信息的话, 在这时可以添加上时间信息. 然后就可以作图了.</p>

<p>另外, <code>axes.pdb</code>文件中保存了每一步的坐标轴方向, 你可以利用VMD打开查看.</p>

## 参考资料

<ol class="incremental">
<li><a href="http://www.researchgate.net/post/How_can_I_use_the_g_bundle_to_calculate_a_two-helix_crossing_angle">How can I use the g_bundle to calculate a two-helix crossing angle?</a></li>
<li><a href="https://mdanalysis.googlecode.com/svn/trunk/doc/html/documentation_pages/analysis/helanal.html">HELANAL - analysis of protein helices</a></li>
<li><a href="http://comments.gmane.org/gmane.science.biology.gromacs.user/66416">g_helixorient help</a></li>
<li><a href="http://www.pymolwiki.org/index.php/AngleBetweenHelices">PyMOL AngleBetweenHelices</a></li>
</ol>
