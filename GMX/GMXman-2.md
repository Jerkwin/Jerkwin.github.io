---
 layout: post
 title: GROMACS中文手册：第二章　定义与单位
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}


## 2.1 符号标记

<p>对数学符号, 在整个文档中都将遵循以下约定:</p>

<table><caption></caption>
<tr>
<th style="text-align:center;">含义</th>
<th style="text-align:center;">标注</th>
<th style="text-align:right;">示例</th>
</tr>
<tr>
<td style="text-align:center;">矢量</td>
<td style="text-align:center;">粗斜体</td>
<td style="text-align:center;">\(\bi r_i\)</td>
</tr>
<tr>
<td style="text-align:center;">矢量长度</td>
<td style="text-align:center;">斜体</td>
<td style="text-align:center;">\(r_i\)</td>
</tr>
</table>

<p>我们用 <strong>小写</strong> 下标 <span class="math">\(i,j,k,l\)</span> 标识粒子: <span class="math">\(\bi r_i\)</span> 为粒子 <span class="math">\(i\)</span> 的 <strong>位置矢量</strong>, 并且使用下面的记法:</p>

<p><span class="math">\(\alg
\bi r_{ij} &= \bi r_j- \bi r_i \tag{2.1} \\
r_{ij}     &= \abs {\bi r_{ij}}    \tag{2.2}
\ealg\)</span></p>

<p>粒子 <span class="math">\(i\)</span> 受到的力记为 <span class="math">\(\bi F_i\)</span>, 且</p>

<p><span class="math">\[\bi F_{ij}= 粒子j施加于粒子i的力 \tag{2.3}\]</span></p>

<p>请注意, 自从GROMACS 2.0版本我们已将标记改为 <span class="math">\(\bi r_{ij}=\bi r_j-\bi r_i\)</span>. 因为这是常用的约定. 如果你遇到错误, 请告知我们.</p>

## 2.2 MD单位

<p>GROMACS使用一系列自洽的单位, 以便使相关分子性质的计算值接近单位1. 我们称其为 <strong>MD单位</strong>. 这个系统的基本单位是 nm, ps, K, 电子电荷(e)和原子质量单位(u), 参看表2.1.</p>

<p>与这些单位一致的一套导出单位, 列于表2.2.</p>

<p><strong>静电转换因子</strong> <span class="math">\(f={1 \over 4\p\ve_0}=138.935 485(9)\)</span> kJ mol<sup>-1</sup> nm e<sup>-2</sup>, 它联结了力学量与电学量, 即</p>

<p><span class="math">\[V=f {q^2 \over r}   或   F=f {q^2 \over r^2} \tag{2.4}\]</span></p>

<table><caption> 表2.1 GROMACS使用的基本单位. 括号中的数字表示精确度.</caption>
<tr>
<th style="text-align:center;">物理量</th>
<th style="text-align:center;">符号</th>
<th style="text-align:center;">单位</th>
</tr>
<tr>
<td style="text-align:center;"> 长度 </td>
<td style="text-align:center;">r</td>
<td style="text-align:left;">纳米(nm) ＝ 10<sup>-9</sup> m</td>
</tr>
<tr>
<td style="text-align:center;"> 质量 </td>
<td style="text-align:center;">m</td>
<td style="text-align:left;">原子质量单位(u) ＝ 1.660 540 2(10) × 10<sup>-17</sup> kg<br> <sup>12</sup>C 原子质量的1/12</td>
</tr>
<tr>
<td style="text-align:center;"> 时间 </td>
<td style="text-align:center;">t</td>
<td style="text-align:left;">皮秒(ps) ＝ 10<sup>-12</sup> s</td>
</tr>
<tr>
<td style="text-align:center;"> 电荷 </td>
<td style="text-align:center;">q</td>
<td style="text-align:left;">电子电量(e) ＝ 1.602 177 33(49) × 10<sup>-19</sup> C</td>
</tr>
<tr>
<td style="text-align:center;"> 温度 </td>
<td style="text-align:center;">T</td>
<td style="text-align:left;">K</td>
</tr>
</table>

<table><caption> 表2.2 导出单位</caption>
<tr>
<th style="text-align:center;"> 物理量</th>
<th style="text-align:center;">符号</th>
<th style="text-align:center;">单位</th>
</tr>
<tr>
<td style="text-align:center;">  能量      </td>
<td style="text-align:center;">\(E, V\)</td>
<td style="text-align:center;">kJ mol<sup>-1</sup></td>
</tr>
<tr>
<td style="text-align:center;">  力        </td>
<td style="text-align:center;">\(\bi F\)</td>
<td style="text-align:center;">kJ mol<sup>-1</sup> nm<sup>-1</sup></td>
</tr>
<tr>
<td style="text-align:center;">  压力      </td>
<td style="text-align:center;">\(p\)</td>
<td style="text-align:center;">kJ mol<sup>-1</sup> nm<sup>-3</sup>＝ 10<sup>30</sup>/N<sub>AV</sub> Pa <br> 1.660 54 × 10<sup>6</sup> Pa ＝ 16.6054 bar</td>
</tr>
<tr>
<td style="text-align:center;">  速度      </td>
<td style="text-align:center;">\(v\)</td>
<td style="text-align:center;">nm ps<sup>-1</sup> ＝ 1000 m s<sup>-1</sup></td>
</tr>
<tr>
<td style="text-align:center;">  偶极矩    </td>
<td style="text-align:center;">\(\m\)</td>
<td style="text-align:center;">e nm</td>
</tr>
<tr>
<td style="text-align:center;">  电势      </td>
<td style="text-align:center;">\(\F\)</td>
<td style="text-align:center;">kJ mol<sup>-1</sup> e<sup>-1</sup> ＝ 0.010 364 272(3) Volt</td>
</tr>
<tr>
<td style="text-align:center;">  电场强度  </td>
<td style="text-align:center;">\(\bi E\)</td>
<td style="text-align:center;">kJ mol<sup>-1</sup> nm<sup>-1</sup> e<sup>-1</sup> ＝ 1.036 427 2(3) × 10<sup>7</sup> V/m</td>
</tr>
</table>

<p>电势 <span class="math">\(\F\)</span> 和电场强度 <span class="math">\(\bi E\)</span> 是计算能量和力的中间量. 它们不会出现在GROMACS中. 如果在计算中使用它们, 可对方程及其相应的单位进行选择. 在计算 <span class="math">\(\F\)</span> 和 <span class="math">\(\bi E\)</span> 时, 我们强烈建议遵循惯例, 使用包含转换因子 <span class="math">\(f\)</span> 的下列方程:</p>

<p><span class="math">\(\alg
\F(\bi r) &= f \sum_j {q_j \over \abs{\bi r-\bi r_j} }                     \tag{2.5} \\
\bi E(\bi r) &= f \sum_j q_j {\bi r -\bi r_j \over \abs{\bi r-\bi r_j}^3 } \tag {2.6}
\ealg\)</span></p>

<p>在这种定义下, <span class="math">\(q\F\)</span> 为能量, <span class="math">\(q \bi E\)</span> 为力. 它们的单位由表2.2给出: 单位电势大约10 meV. 这样, 距离一个电子电荷子1 nm的电势能等于 <span class="math">\(f \approx 140 单位 \approx 1.4 \text V\)</span> (精确值为1.439965 V).</p>

<p><strong>注意</strong>: 这些单位彼此之间是自洽的；改变其中的任何一个都可能使得单位系统不再自洽, 因此 <strong>强烈建议不要</strong> 修改. 特别是, 若使用 <span class="math">\(\AA\)</span> 代替 nm, 单位时间将变为0.1 ps；若使用能量单位kcal mol<sup>-1</sup>代替kJ mol<sup>-1</sup>, 单位时间将变为0.488882 ps, 且单位温度变为4.184 K. 但在这两种情况下, 计算的所有电势能都是错误的, 因为它们仍然是以kJ mol<sup>-1</sup>为单位计算的, 并假定nm为长度单位. 尽管对电荷重新进行细心的标度可能会得到自洽的单位, 但很显然, 所有这些容易引起混淆的做法都应该被严厉禁止.</p>

<p>常用的物理常数以MD单位表示, 其取值可能不同(见表2.3). 所有的物理量都是以mol为单位计算的, 而不是以单个分子为单位计算. 玻尔兹曼常数 <span class="math">\(k\)</span> 和理想气体常数 <span class="math">\(R\)</span> 没有区别, 它们的值都是0.008 314 51 kJ mol<sup>-1</sup> K<sup>-1</sup>.</p>

<table><caption> 表 2.3 部分物理常数</caption>
<tr>
<th style="text-align:center;"> 符号   </th>
<th style="text-align:center;">名称</th>
<th colspan="2" style="text-align:left;"> 数值 </th>
</tr>
<tr>
<td style="text-align:center;"> \(N_{AV}\) </td>
<td style="text-align:center;">Avogadro常数</td>
<td colspan="2" style="text-align:left;"> 6.022 136 7(36) × 10<sup>23</sup> mol<sup>-1</sup></td>
</tr>
<tr>
<td style="text-align:center;"> \(R\)      </td>
<td style="text-align:center;">理想气体常数</td>
<td rowspan="2" colspan="2" style="text-align:left;"> 8.314 510(70) × 10<sup>-3</sup> kJ mol<sup>-1</sup> K<sup>-1</sup></td>
</tr>
<tr>
<td style="text-align:center;"> \(k_B\)    </td>
<td style="text-align:center;">Boltzmann常数</td>
</tr>
<tr>
<td style="text-align:center;"> \(h\)      </td>
<td style="text-align:center;">Planck常数</td>
<td colspan="2" style="text-align:left;"> 0.399 031 32(24) kJ mol<sup>-1</sup> ps</td>
</tr>
<tr>
<td style="text-align:center;"> \(\hbar\)  </td>
<td style="text-align:center;">Dirac常数</td>
<td colspan="2" style="text-align:left;"> 0.063 507 807(38) kJ mol<sup>-1</sup> ps</td>
</tr>
<tr>
<td style="text-align:center;"> \(c\)      </td>
<td style="text-align:center;">光速</td>
<td colspan="2" style="text-align:left;"> 299 792.458 nm ps<sup>-1</sup></td>
</tr>
</table>

<table><caption> 表 2.4 LJ势的约化物理量</caption>
<tr>
<th style="text-align:center;"> 物理量 </th>
<th style="text-align:center;">符号</th>
<th style="text-align:left;"> 与国际单位的关系</th>
</tr>
<tr>
<td style="text-align:center;">长度</td>
<td style="text-align:center;"> \(\text r^*\) </td>
<td colspan="2" style="text-align:center;">\(\text r \s^{-1}\)</td>
</tr>
<tr>
<td style="text-align:center;">质量</td>
<td style="text-align:center;"> \(\text m^*\) </td>
<td colspan="2" style="text-align:center;">\(\text m \text M^{-1}\)</td>
</tr>
<tr>
<td style="text-align:center;">时间</td>
<td style="text-align:center;"> \(\text t^*\) </td>
<td colspan="2" style="text-align:center;">\(\text t \s^{-1} \sqrt{\e/M}\)</td>
</tr>
<tr>
<td style="text-align:center;">温度</td>
<td style="text-align:center;"> \(\text T^*\) </td>
<td colspan="2" style="text-align:center;">\(\text k_B T \e^{-1}\)</td>
</tr>
<tr>
<td style="text-align:center;">能量</td>
<td style="text-align:center;"> \(\text E^*\) </td>
<td colspan="2" style="text-align:center;">\(\text E \e^{-1}\)</td>
</tr>
<tr>
<td style="text-align:center;">力</td>
<td style="text-align:center;"> \(\text F^*\) </td>
<td colspan="2" style="text-align:center;">\(\text F \s \e^{-1}\)</td>
</tr>
<tr>
<td style="text-align:center;">压强</td>
<td style="text-align:center;"> \(\text P^*\) </td>
<td colspan="2" style="text-align:center;">\(\text P \s^3 \e^{-1}\)</td>
</tr>
<tr>
<td style="text-align:center;">速度</td>
<td style="text-align:center;"> \(\text v^*\) </td>
<td colspan="2" style="text-align:center;">\(\text v \sqrt{M/\e}\)</td>
</tr>
<tr>
<td style="text-align:center;">密度</td>
<td style="text-align:center;"> \(\r^*\)      </td>
<td colspan="2" style="text-align:center;">\(\text N \s^3 V^{-1}\)</td>
</tr>
</table>

## 2.3 约化单位

<p>当模拟Lennard-Jones(LJ)系统时, 使用约化单位(即设某类原子的 <span class="math">\(\e_{ii}=\s_{ii}=m_i=k_B=1\)</span>)可能会方便, 也是可行的. 当以约化单位输入时, GROMACS将会以约化单位输出. 但 <strong>温度</strong> 是唯一的例外, 它是以0.008 314 51倍的约化单位表示的. 这是由于在代码中使用玻尔兹曼常数计算温度引起的. 因此, 不是温度 <span class="math">\(T\)</span>, 而是 <span class="math">\(k_BT\)</span> 表示约化温度. GROMACS的温度 <span class="math">\(T=1\)</span> 意味着约化温度为0.008&#8230;单位; 如果约化温度是1, GROMACS的温度应该是120.2717.</p>

<p>表2.4 给出对应于LJ势</p>

<p><span class="math">\[V_{LJ}=4 \e \left[ \left({\s \over r}\right)^{12}-\left({\s \over r}\right)^6 \right] \tag{2.7}\]</span></p>

<p>的约化物理量.</p>
