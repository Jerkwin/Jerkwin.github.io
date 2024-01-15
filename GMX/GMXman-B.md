---
 layout: post
 title: GROMACS中文手册：附录B　一些实现细节
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}


<p>在本章中, 我们将介绍一些实现细节. 本章涉及的内容远远称不上完备, 但我们认为有必要澄清一些事情, 否则将很难理解.</p>

## B.1 GROMACS中的单个和维里

<p>维里 <span class="math">\(\X\)</span> 可以写成全张量形式:</p>

<p><span class="math">\[\X = -{1\over2}\Sum_{i < j}^N \bi r_{ij} \otimes \bi F_{ij} \tag{B.1}\]</span></p>

<p>其中 <span class="math">\(\otimes\)</span> 表示两个向量的 <strong>直积</strong>.<a href="#fn:1" id="fnref:1" title="see footnote" class="footnote">[1]</a> 当此在MD程序的内部循环中计算直积时, 需要进行9次乘法运算和9加法运算.<a href="#fn:2" id="fnref:2" title="see footnote" class="footnote">[2]</a></p>

<p>这里将展示如何才能将维里计算从内部循环中抽取出来[166].</p>

### B.1.1 维里

<p>对一个周期性体系, 计算维里时必须考虑周期性:</p>

<p><span class="math">\[\X = -{1\over2}\Sum_{i < j}^N \bi r_{ij}^n \otimes \bi F_{ij} \tag{B.2}\]</span></p>

<p>其中 <span class="math">\(\bi r_{ij}^n\)</span> 表示从原子 <span class="math">\(j\)</span> 到原子 <span class="math">\(i\)</span> <strong>最近映象</strong> 的距离向量. 在这个定义中我们为原子 <span class="math">\(i\)</span> 的位置向量 <span class="math">\(\bi r_i\)</span> 添加一个 <strong>移位向量</strong> <span class="math">\(\d_i\)</span>. 差向量 <span class="math">\(\bi r_{ij}^n\)</span> 因此等于:</p>

<p><span class="math">\[\bi r_{ij}^n = \bi r_i +\d_i - \bi r_j \tag{B.3}\]</span></p>

<p>或简写为:</p>

<p><span class="math">\[\bi r_{ij}^n = \bi r_i^n - \bi r_j \tag{B.4}\]</span></p>

<p>对一个三斜体系, <span class="math">\(i\)</span> 有27个可能的映象; 当使用截面八面体时, 有15个可能的映象.</p>

## B.1.2 非键力的维里

<p>这里给出非键力子程序中单个和维里的推导. 在下面的所有公式中 <span class="math">\(i \ne j\)</span>.</p>

<p><span class="math">\(\alg
\X &= -{1\over2}\Sum_{i < j}^N \bi r_{ij}^n \otimes \bi F_{ij} \tag{B.5} \\
&= -{1\over4} \Sum_{i=1}^N \Sum_{j=1}^N (\bi r_i +\d_i -\bi r_j) \otimes \bi F_{ij} \tag{B.6}  \\
&= -{1\over4} \Sum_{i=1}^N \Sum_{j=1}^N (\bi r_i +\d_i ) \otimes \bi F_{ij} - \bi r_j \otimes \bi F_{ij} \tag{B.7}  \\
&= -{1\over4} \left( \Sum_{i=1}^N \Sum_{j=1}^N (\bi r_i + \d_i) \otimes \bi F_{ij} - \Sum_{i=1}^N \Sum_{j=1}^N \bi r_j \otimes \bi F_{ij} \right) \tag{B.8}  \\
&= -{1\over4} \left( \Sum_{i=1}^N (\bi r_i +\d_i) \otimes \Sum_{j=1}^N \bi F_{ij} - \Sum_{j=1}^N \bi r_j \otimes \Sum_{i=1}^N \bi F_{ij} \right) \tag{B.9}  \\
&= -{1\over4} \left( \Sum_{i=1}^N (\bi r_i +\d_i) \otimes \bi F_i + \Sum_{j=1}^N \bi r_j \otimes \bi F_j \right)  \tag{B.10}  \\
&= -{1\over4} \left( 2\Sum_{i=1} \bi r_i \otimes \bi F_i + \Sum_{i=1} \d_i \otimes \bi F_i \right) \tag{B.11}
\ealg\)</span></p>

<p>在上面这些公式中, 我们引入了</p>

<p><span class="math">\[\bi F_i = \Sum_{j=1}^N \bi F_{ij} \tag{B.12}\]</span></p>

<p><span class="math">\[\bi F_j = \Sum_{i=1}^N \bi F_{ji} \tag{B.13}\]</span></p>

<p>为 <span class="math">\(j\)</span> 对 <span class="math">\(i\)</span> 总的作用力. 因为我们使用了牛顿第三定律:</p>

<p><span class="math">\[\bi F_{ij} = -\bi F_{ji} \tag{B.14}\]</span></p>

<p>在实现时我们必须将含移位 <span class="math">\(\d_i\)</span> 的项加倍.</p>

### B.1.3 分子内移位(mol-shift)

<p>对键合力和SHAKE, 可以创建一个 <strong>mol-shift</strong> 列表, 其中存储了周期性. 我们简单地使用一个数组<code>mshift</code>, 其中存储了每个原子在<code>shiftvec</code>数组中的索引.</p>

<p>生成此列表的算法可以从图论得到, 将分子中的每个粒子视为图中的节点, 将键视为图的边.</p>

<ol class="incremental">
<li>用双向图代表键和原子</li>
<li>令所有原子为白色</li>
<li>使白色原子中的一个原子(原子 <span class="math">\(i\)</span>)变为黑色, 并把它放在盒子中心</li>
<li>对 <span class="math">\(i\)</span> 的每个邻居, 如果它目前为白色, 则将其变为灰色</li>
<li>选择灰色原子中的一个(原子 <span class="math">\(j\)</span>), 相对于它的所有黑色邻居, 给它正确的周期性, 并将其变黑</li>
<li>对 <span class="math">\(j\)</span> 的每个邻居, 如果它目前为白色, 则将其变为灰色</li>
<li>如果仍然存在任何一个灰色原子, 转到5</li>
<li>如果仍然存在任何一个白色原子, 转到3</li>
</ol>

<p>使用这种算法, 我们可以</p>

<ul class="incremental">
<li>优化键合力计算以及SHAKE</li>
<li>使用单个和方法从键合力计算维里</li>
<li>获得键的双向图表示.</li>
</ul>

### B.1.4 共价键的维里

<p>由于共价键力对维里有贡献, 我们有:</p>

<p><span class="math">\(\alg
b  &=  \| \bi r_{ij}^n \|  \tag{B.15} \\
V_b &= {1\over2} k_b (b-b_0)^2 \tag{B.16} \\
\bi F_i &= - \nabla V_b \tag{B.17} \\
  &= k_b (b-b_0) {\bi r_{ij}^n \over b} \tag{B.18} \\
\bi F_j &= - \bi F_i \tag{B.19}
\ealg\)</span></p>

<p>来源于键的维里为:</p>

<p><span class="math">\(\alg
\X_b &= - {1\over2} (\bi r_i^n \otimes \bi F_i + \bi r_j \otimes \bi F_j ) \tag{B.20} \\
     &= - {1\over2} (\bi r_{ij}^n \otimes \bi F_i) \tag{B.21}
\ealg\)</span></p>

### B.1.5 SHAKE的维里

<p>SHAKE对维里有着重要贡献. 为满足约束, 力 <span class="math">\(\bi G\)</span> 作用到&#8220;摇动&#8221;的粒子上. 如果此力不是来自算法(如在标准SHAKE中), 它可以在后面计算(当使用 <strong>蛙跳算法</strong> 时):</p>

<p><span class="math">\(\alg
\D \bi r_i &= \bi r_i (t+\D t) - [\bi r_i(t)+ \bi v_i(t-{\D t \over 2}) \D t+{\bi F_i \over m_i} \D t^2] \tag{B.22} \\
\bi G_i &= {m_i \D \bi r_i \over \D t^2} \tag{B.23}
\ealg\)</span></p>

<p>在一般情况下, 上式对我们没有帮助. 只有当不需要使用周期性时(如刚性水), 才可以使用上面的公式, 否则我们必须在SHAKE的内部循环中增加维里的计算.</p>

<p>当 <strong>适用</strong> 时, 可以使用单个和方式计算维里:</p>

<p><span class="math">\[\X = -{1\over2} \Sum_i^{N_c} \bi r_i \otimes \bi F_i \tag{B.24}\]</span></p>

<p>其中 <span class="math">\(N_c\)</span> 为约束原子的数目.</p>

## B.2 优化

<p>在这里, 我们将描述GROMACS使用的一些算法优化, 不包括并行化. 对其中的一个, 1.0/sqrt(x)函数的实现, 我们将在B.3节分开处理. 其他最重要优化的论述如下.</p>

### B.2.1 水的内部循环

<p>GROMACS使用特殊的内部循环来计算水分子与其它原子的非键相互作用, 使用另一组循环计算水分子之间的相互作用. 这两组循环针对两种类型的水模型进行了高度优化. 对于类似于SPC[81]的三位点模型, 即:</p>

<ol class="incremental">
<li>分子中有三个原子.</li>
<li>整个分子属于单个电荷组.</li>
<li>第一个原子具有Lennard-Jones(4.1.1节)和库仑(4.1.3节)相互作用.</li>
<li>第二和第三个原子只具有库仑相互作用, 且电荷相等.</li>
</ol>

<p>这些循环也适用于SPC/E[167]和TIP3P[125]水模型. 对类似于TIP4P[125]的四位点水模型:</p>

<ol class="incremental">
<li>分子中有四个原子.</li>
<li>整个分子属于单个电荷组.</li>
<li>第一个原子只具有Lennard-Jones(4.1.1节)相互作用.</li>
<li>第二和第三个原子具有库仑相互作用, 且电荷相等.</li>
<li>第四个原子只具有库仑相互作用.</li>
</ol>

<p>这些实现方式的好处是, 在单个循环中有更多的浮点运算, 这意味着一些编译器可以更好地调度代码. 然而, 事实证明, 甚至一些最先进的编译器也存在调度问题, 这意味着需要进行手动调整以获得最佳性能. 这可能包括消去相同的子表达, 或移动代码到各处.</p>

### B.2.2 Fortran代码

<p>不幸的是, 在一些平台上Fortran编译器仍好于C编译器. 对于一些机器(例如SGI Power Challenge)差异可高达3, 对矢量计算机差异可能更大. 因此, 针对英特尔和AMD的x86处理器, 有些占用大量计算时间的子程序被改写为Fortran甚至汇编代码. 在大多数情况下, 当适用时, Fortran或汇编循环会通过<code>configure</code>脚本自动选择, 但你也可以通过设置<code>configure</code>脚本的选项对此进行调整.</p>

## B.3 1.0/sqrt函数的计算

### B.3.1 简介

<p>GROMACS项目开始于开发一个 <span class="math">\(1/\sqrt{x}\)</span> 的处理器, 用以计算:</p>

<p><span class="math">\[Y(x)= {1\over \sqrt x}  \tag{B.25}\]</span></p>

<p>随着项目的继续, 英特尔<em>i</em>860处理器被用于实现GROMACS, 现在几乎已经变成了一个完整的软件项目. <span class="math">\(1/\sqrt x\)</span> 处理器的实现采用了一步的Newton-Raphson迭代方案, 为此, 需要查表以提供初始近似值. <span class="math">\(1/\sqrt x\)</span> 函数使用了两个几乎独立的表格, 分别用于IEEE浮点表示的指数种子和分数种子.</p>

### B.3.2 通用

<p>根据[168] <span class="math">\(1/\sqrt x\)</span> 函数可以使用Newton-Raphson迭代方案进行计算. 反函数为:</p>

<p><span class="math">\[X(y)= {1\over y^2} \tag{B.26}\]</span></p>

<p>因此不直接计算</p>

<p><span class="math">\[Y(a)=q \tag{B.27}\]</span></p>

<p>而是使用Newton-Raphson方法求解方程</p>

<p><span class="math">\[X(q) - a = 0 \tag{B.28}\]</span></p>

<figure>
<img src="/GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX//GMX/B.1.png" alt="图 B.1: IEEE单精度浮点数格式" />
<figcaption>图 B.1: IEEE单精度浮点数格式</figcaption>
</figure>

<p>通过计算:</p>

<p><span class="math">\[y_{n+1}= y_n-{f(y_n) \over f'(y_n)} \tag{B.29}\]</span></p>

<p>进行迭代. 在这种近似下, 绝对误差 <span class="math">\(\ve\)</span> 被定义为:</p>

<p><span class="math">\[\ve \equiv y_n-q \tag{B.30}\]</span></p>

<p>利用Taylor级数展开来估计误差, 根据[168]的方程(3.2)得到:</p>

<p><span class="math">\[\ve_{n+1} = - {\ve_n^2 \over 2}{f''(y_n) \over f'(y_n)} \tag{B.31}\]</span></p>

<p>这是绝对误差的估计.</p>

### B.3.3 用于于浮点数

<p>IEEE 32位单精度格式的浮点数具有几乎恒定的相对误差 <span class="math">\(\D x/x = 2^{-24}\)</span>. 从前面所述的Taylor级数展开公式(方程B.31)可以看到, 每步迭代的误差是绝对的, 且一般与 <span class="math">\(y\)</span> 有关. 如果将误差表示为相对误差, 有下面的式子</p>

<p><span class="math">\[\ve_{r_{n+1} } \equiv {\ve_{n+1}\over y} \tag{B.32}\]</span></p>

<p>并且</p>

<p><span class="math">\[\ve_{r_{n+1} } = - ({\ve_n \over y})^2 y {f'' \over 2f'} \tag{B.33}\]</span></p>

<p>对函数 <span class="math">\(f(y)= y^{-2}\)</span>, <span class="math">\(yf''/2f'\)</span> 项为常数(等于&#8211;3/2), 因此相对误差 <span class="math">\(\ve_{r_n}\)</span> 与 <span class="math">\(y\)</span> 无关.</p>

<p><span class="math">\[\ve_{r_{n+1} } = {3\over2} (\ve_{r_n})^2 \tag{B.34}\]</span></p>

<p>由此得到的结论是, 函数 <span class="math">\(1/\sqrt x\)</span> 可以计算到指定的精度.</p>

### B.3.4 备查表格的要求

<p>为了使用前面提到的迭代方案计算函数 <span class="math">\(1/\sqrt x\)</span> , 很明显, 解的第一次估计必须足够精确, 这样才能获得精确的结果. 计算的要求是</p>

<ul class="incremental">
<li>IEEE格式的最大可能精度</li>
<li>只使用一次迭代以达到最高速度</li>
</ul>

<p>第一个要求指出, <span class="math">\(1/\sqrt x\)</span> 的结果可能具有的相对误差 <span class="math">\(\ve_r\)</span> 等于IEEE 32位单精度浮点数的 <span class="math">\(\ve_r\)</span>. 由此可以得出初始近似的 <span class="math">\(1/\sqrt x\)</span>, 对后续步骤重写相对误差的定义(方程B.34):</p>

<p><span class="math">\[{\ve_n \over y} = \sqrt{ \ve_{r_{n+1} }{2f' \over yf''} } \tag{B.35}\]</span></p>

<p>因此对于查表所需的精度为:</p>

<p><span class="math">\[{\D Y\over Y} = \sqrt{\ {2\over3} 2^{-24}\ } \tag{B.36}\]</span></p>

<p>这定义了备查表的宽度必须≥13比特.</p>

<p>这样, 备查表的相对误差 <span class="math">\(\ve_{r_n}\)</span> 是已知的, 由此可以计算参数的最大相对误差. 绝对误差 <span class="math">\(\D x\)</span> 定义为:</p>

<p><span class="math">\[\D x \equiv {\D Y \over Y'} \tag{B.37}\]</span></p>

<p>因此:</p>

<p><span class="math">\[{\D x \over Y} = {\D Y \over Y} (Y')^{-1} \tag{B.38}\]</span></p>

<p>因此:</p>

<p>$$ \D x = \text{constant} {Y \over Y&#8217;} \tag{B.39}$$</p>

<p>对 <span class="math">\(1/\sqrt x\)</span> 函数, 满足 <span class="math">\(Y/Y'~x\)</span>, 所以 <span class="math">\(\D x/x=\text{constant}\)</span>. 前面提到过, 这是所用浮点表示的性质. 备查表参数需要的精度符合:</p>

<p><span class="math">\[{\D x \over x} = -2 {\D Y \over Y} \tag{B.40}\]</span></p>

<p>因此, 使用浮点精度(方程B.36):</p>

<p><span class="math">\[{\D x \over x} = -2 \sqrt{ {2\over3}2^{-24} } \tag{B.41}\]</span></p>

<p>这定义了备查表的宽度必须≥12比特.</p>

### B.3.5 指数和分数的独立计算

<p>所使用的IEEE 32位单精度浮点格式规定, 一个数字由一个指数和一个分数表示. 上一节对每个可能的浮点数规定了备查表的长度和宽度. 精度仅由浮点数的分数部分的大小决定. 由此得到的结论是, 备查表的大小为其长度, 前面已规定, 再乘上指数的大小(2<sup>12</sup>2<sup>8</sup>, 1Mb). <span class="math">\(1/\sqrt x\)</span> 函数具有指数部分与分数部分无关的性质. 如果使用浮点表示, 这很明显. 定义:</p>

<p><span class="math">\[x \equiv (-1)^S (2^{E-127})(1.F) \tag{B.42}\]</span></p>

<p>参看图 B.1, 其中 <span class="math">\(0 \le S \le 1, 0 \le E \le 255, 1 \le 1.F \lt 2\)</span>, <span class="math">\(S, E, F\)</span> 为整数(规范化条件). 符号位(<span class="math">\(S\)</span>)可以省略, 因为 <span class="math">\(1/\sqrt x\)</span> 只对 <span class="math">\(x>0\)</span> 有定义. <span class="math">\(1/\sqrt x\)</span> 函数作用于 <span class="math">\(x\)</span> 得到:</p>

<p><span class="math">\[y(x)= {1 \over \sqrt x} \tag{B.43}\]</span></p>

<p>或:</p>

<p><span class="math">\[y(x)= {1 \over \sqrt{(2^{E-127})(1.F)} } \tag{B.44}\]</span></p>

<p>这可以改写为:</p>

<p><span class="math">\[y(x)=(2^{E-127})^{-1/2} (1.F)^{-1/2} \tag{B.45}\]</span></p>

<p>定义:</p>

<p><span class="math">\[(2^{E'-127}) \equiv (2^{E-127})^{-1/2} \tag{B.46}\]</span></p>

<p><span class="math">\[1.F' \equiv (1.F)^{-1/2} \tag{B.47}\]</span></p>

<p>这样 <span class="math">\({1\over\sqrt 2} \lt 1.F' \le 1\)</span> 成立, 因此对规范的实数表示非常重要的条件 <span class="math">\(1\le 1.F' \lt 2\)</span>, 不再成立. 通过引入一个额外的项, 可以对此进行校正. 将 <span class="math">\(1/\sqrt x\)</span> 函数应用于浮点数(方程B.45)改写为:</p>

<p><span class="math">\[y(x)=(2^{ {127-E\over2}-1})(2(1.F)^{-1/2}) \tag{B.48}\]</span></p>

<p>和:</p>

<p><span class="math">\[(2^{E'-127}) \equiv (2^{ {127-E\over2} -1} ) \tag{B.49}\]</span></p>

<p><span class="math">\[1.F' \equiv 2(1.F)^{-1/2} \tag{B.50}\]</span></p>

<p>这样 <span class="math">\(\sqrt 2 \lt 1.F \le 2\)</span> 成立. 这和方程B.42中定义的规范化浮点数的精确有效范围不同. 数值2导致问题. 通过将此值映射到&lt;2的最近表示, 可以解决这个问题. 这种近似引入的小误差在允许范围内.</p>

<p>指数的整数表示是下一个问题. 计算 <span class="math">\((2^{ {127-E\over2} -1})\)</span> 会引入分数的结果, 如果 <span class="math">\((127 - E)\)</span> 为奇数. 通过将计算分为奇数部分和偶数部分, 很容易处理这个问题. 对 <span class="math">\((127 - E)\)</span> 为偶数的情况, 方程(方程B.49)中的 <span class="math">\(E'\)</span> 作为 <span class="math">\(E\)</span> 的函数, 可以使用整数运算精确地计算出来</p>

<p><span class="math">\[E' = {127 -E \over 2} + 126 \tag{B.51}\]</span></p>

<p>对 <span class="math">\((127 - E)\)</span> 为奇数的情况, 方程(方程B.45)可以改写为:</p>

<p><span class="math">\[y(x)=(2^{ {127-E-1\over2} }) ({1.F \over 2})^{-1/2} \tag{B.52}\]</span></p>

<p>因此:</p>

<p><span class="math">\[E' = {126 - E \over 2} + 127 \tag{B.53}\]</span></p>

<p>这也可以使用整数运算进行精确计算. <strong>注意</strong>, 对前面提到的范围分数部分是自动校正的, 因此不需要对指数部分进行额外的校正.</p>

<p>由此得到的结论是:</p>

<ul class="incremental">
<li>分数和指数的备查表是独立的. 存在两个分数备查表(奇指数和偶指数), 因此必须使用指数的奇/偶信息(1sb比特)选择适当的表格.</li>
<li>指数备查表是一个256 x 8比特的表, 对 <strong>奇数</strong> 和 <strong>偶数</strong> 进行了初始化.</li>
</ul>

### B.3.6 实现

<p>可以使用一个小的C程序来产生备查表, 它使用了符合IEEE 32位单精度格式的浮点数和操作. 需要注意的是, 因为需要 <strong>奇/偶</strong> 信息, 分数表是前面指定的两倍大(13比特 i.s.o 12比特).</p>

<p>必须实现方程B.29的函数. 应用到 <span class="math">\(1/\sqrt x\)</span> 函数, 方程B.28给出:</p>

<p><span class="math">\[f = a -{1\over y^2} \tag{B.54}\]</span></p>

<p>因此:</p>

<p><span class="math">\[f' = {2\over y^3} \tag{B.55}\]</span></p>

<p>因此:</p>

<p><span class="math">\[y_{n+1} = y_n -{a-{1\over y_n^2} \over {2\over y_n^3} } \tag{B.56}\]</span></p>

<p>或:</p>

<p><span class="math">\[y_{n+1} = {y_n \over 2} (3 -a y_n^2) \tag{B.57}\]</span></p>

<p>其中 <span class="math">\(y_0\)</span> 可以在备查表中找到, <span class="math">\(y_1\)</span> 给出了具有最大精度的结果. 显然, 对双精度结果只需要一步额外的迭代(以双精度进行).</p>

<div class="footnotes">
<hr />
<ol class="incremental">

<li id="fn:1">
<p><span class="math">\((\bi u \otimes \bi v)^{\a\b} = \bi u_\a \bi v_\b\)</span> <a href="#fnref:1" title="return to article" class="reversefootnote">&#160;&#8617;</a></p>
</li>

<li id="fn:2">
<p>Lennard-Jones和库仑力时计算大约需要50次浮点运算. <a href="#fnref:2" title="return to article" class="reversefootnote">&#160;&#8617;</a></p>
</li>

</ol>
</div>
