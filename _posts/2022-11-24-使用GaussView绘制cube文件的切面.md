---
 layout: post
 title: 使用GaussView绘制cube文件的切面
 categories:
 - 科
 tags:
 - 量化
 viz: true
 flc: true
 chem: true
 math: true
---

- 2022-11-24 23:41:39

我以前做计算化学的时候, 也有些自写的工具, 脚本, 程序之类, 但都没有怎么整理, 因为觉得可能不会再用到, 就不劳费那些心了. 殊知世事难料, 现在竟又做起计算化学相关的东西了, 那就索性将以前的东西捡拾捡拾, 规治规治, 为己为人, 都是好的.

分析计算化学结果时, 常要查看电子密度, 静电势之类的图形, 这些数据大都保存为cube文件. 虽然这是高斯自家定义的一种体数据文件格式, 却也得到了很多其他程序的支持. 和高斯配套的GaussView自然更不例外. 但GaussView查看cube文件时, 暂时还不支持绘制切面填色图, 所以需要想办法解决.

所谓切面填色图, 就是拿刀将一盒子数据切为两段, 将切面上的每个点根据其数值大小绘上相应的颜色, 这样容易直观地看到数据在切面上的分布情况, 和我们生活中见到的CT照片是一回事. 因此, 这种图也可称为切片, slice.

支持绘制切面图的程序很多, 我熟悉的有VMD, JMol, PyMOL, VESTA. 论最终效果, 我觉得可能PyMOL最好, 但需要较多的调试. VESTA则是对材料体系支持较好, 且可以使用任意类型的格点, 而不是仅仅限于正交格点. VMD的切面绘制则比较粗糙, 但胜在简单. JMol绘制时需要使用命令, 熟悉后可以绘制非常复杂的效果.

但很多人还是习惯用GaussView, 毕竟算高斯的用这个的比较多, 也比较熟悉. 所以我们这里就只讨论怎么用GaussView来做这种图.

GaussView虽然不支持直接绘制切面, 但支持绘制表面填色图, 也就是根据其他cube的数据为已有表面填色. 我们需要绘制的图其实就是这种图, 只不过要填色的表面是个平面而已. 所以我们要做的就是自己生成一个cube文件, 其等值面是我们需要的切面. 这容易做, 只要将cube文件中的数据设为到所需平面的距离即可, 这样其零等值面就对应于我们需要的平面. 所以我们要做的就是写个脚本, 根据所需要的平面生成相应的cube文件, 这就是我写的`xCube.bsh`脚本的主要功能.

## 代码

见[xCube](https://jerkwin.github.io/gmxtools/)

<div class="highlight"><pre style="line-height:125%"><span></span>&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;     xCube    <span style="color: #666666">&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>&lt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;    Jicun Li    <span style="color: #666666">&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>&lt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;     2022-11-23 16:13:07     <span style="color: #666666">&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
usage: bash xcube.bsh &lt;FchkFile|CubeFile&gt; <span style="color: #666666">[</span>-HOMO|-LUMO|-Den|-Pot|-Lap|-LOL|-Opp|-Plane &lt;definition&gt;<span style="color: #666666">]</span><span style="color: #BB4444">&quot;</span></pre></div>

## 示例

以水分子为例, 高斯09的输入文件类似如下:

<div class="highlight"><pre style="line-height:125%"><span></span>%Nproc<span style="color: #666666">=</span> 1
%MEM<span style="color: #666666">=</span>24MW
%Chk<span style="color: #666666">=</span>H2O.chk

<span style="color: #008800; font-style: italic"># B3LYP/6-311G** SP FChk</span>

H2O

<span style="color: #666666">0</span>   1
 O    -0.61956522   -1.17391303    0.00000000
 H     0.34043478   -1.17391303    0.00000000
 H    -0.94001981   -0.26897719    0.00000000


--Link1--
%Chk<span style="color: #666666">=</span>H2O.chk

<span style="color: #008800; font-style: italic"># B3LYP/6-311G** Geom=Check Guess=(Read, Only)</span>
<span style="color: #B8860B">Cube</span><span style="color: #666666">=(</span>Fine,Full,Density<span style="color: #666666">)</span>

Density

<span style="color: #666666">0</span>   1

H2O_Dns.cub

--Link1--
%Nproc<span style="color: #666666">=</span> 1
%MEM<span style="color: #666666">=</span>24MW
%Chk<span style="color: #666666">=</span>H2O.chk

<span style="color: #008800; font-style: italic"># B3LYP/6-311G** Geom=Check Guess=(Read, Only)</span>
<span style="color: #B8860B">Cube</span><span style="color: #666666">=(</span>Fine,Potential<span style="color: #666666">)</span>

Potential

<span style="color: #666666">0</span>   1

H2O_Pot.cub

--Link1--
%Nproc<span style="color: #666666">=</span> 1
%MEM<span style="color: #666666">=</span>24MW
%Chk<span style="color: #666666">=</span>H2O.chk

<span style="color: #008800; font-style: italic"># B3LYP/6-311G** Geom=Check Guess=(Read, Only)</span>
<span style="color: #B8860B">Cube</span><span style="color: #666666">=(</span>Fine,Full, NormGradient<span style="color: #666666">)</span>

NormGradient

<span style="color: #666666">0</span>   1

H2O_Nrm.cub

--Link1--
%Nproc<span style="color: #666666">=</span> 1
%MEM<span style="color: #666666">=</span>24MW
%Chk<span style="color: #666666">=</span>H2O.chk

<span style="color: #008800; font-style: italic"># B3LYP/6-311G** Geom=Check Guess=(Read, Only)</span>
<span style="color: #B8860B">Cube</span><span style="color: #666666">=(</span>Fine,Full, Laplacian<span style="color: #666666">)</span>

Laplacian

<span style="color: #666666">0</span>   1

H2O_Lap.cub

--Link1--
%Nproc<span style="color: #666666">=</span> 1
%MEM<span style="color: #666666">=</span>24MW
%Chk<span style="color: #666666">=</span>H2O.chk

<span style="color: #008800; font-style: italic"># B3LYP/6-311G** Geom=Check Guess=(Read, Only)</span>
<span style="color: #B8860B">Cube</span><span style="color: #666666">=(</span>Fine,Full,Gradient<span style="color: #666666">)</span>

Gradient

<span style="color: #666666">0</span>   1

H2O_Grd.cub</pre></div>

作为示例, 我们在这里使用`--Link1--`功能一下子计算了电子密度, 其梯度, 梯度大小, 拉普拉斯, 以及静电势, 实际中可能并不需要都计算, 根据自己的需要来写即可. 再者, `cube`关键词在新版本的高斯中已经废弃, 可以用`cubegen`工具代替.

计算完成后, 就得到了相应的cube文件.

- `H2O_Dns.cub`: 电子密度
- `H2O_Pot.cub`: 静电势
- `H2O_Nrm.cub`: 密度梯度大小
- `H2O_Lap.cub`: 密度拉普拉斯
- `H2O_Grd.cub`: 密度及其梯度

我们先绘制一下分子表面上的静电势,

![](https://jerkwin.github.io/pic/water-pot.png)

其次, 我们想查看一下水分子三个原子所在平面上的电子密度分布或静电势分布. 这样的话, 我们就需要切面对应的cube文件. 使用`xcube`脚本生成平面的cube文件

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">bash</span> xcube.bsh H2O_Dns.cub <span style="color:#666">-plane</span> @1 @2 @3</pre></div>

![](https://jerkwin.github.io/pic/water-dns.png)

可惜的是GaussView的颜色标尺无法改变, 且默认从红到蓝, 与常规的表示相反. 如果想要将其倒过来, 可以使用``xcube``的`-opp`选项, 它可以将cube文件中的数据取相反数, 这样再绘制时候颜色标尺就从蓝到红了.

![](https://jerkwin.github.io/pic/water-dns-opp.png)

同样的方法可用于绘制静电势的图.

水分子二聚体的电子密度图如下

![](https://jerkwin.github.io/pic/dimer-dns-opp.png)

最后是一个配合物的LOL截面图, 用于成键分析的, 可以很清楚地看到原子间的成键情况.

![](https://jerkwin.github.io/pic/lol.png)

