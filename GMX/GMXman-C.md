---
 layout: post
 title: GROMACS中文手册：附录C　平均值与涨落
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}


## C.1 平均值计算公式

<p><strong>注意</strong>: 本节来源于参考文献[169].</p>

<p>当分析MD轨迹时, 需要计算物理量 <span class="math">\(x\)</span> 的平均值 <span class="math">\(< x >\)</span> 和涨落</p>

<p><span class="math">\[\left< (\D x)^2 \right>^{1\over2} = \left< [x-< x >]^2 \right>^{1\over2} \tag{C.1}\]</span></p>

<p><span class="math">\(N_x\)</span> 个值 <span class="math">\(\{x_i\}\)</span> 的方差 <span class="math">\(\s_x\)</span>, 可利用下式进行计算</p>

<p><span class="math">\[\s_x = \sum_{i=1}^{N_x} x_i^2 - {1 \over N_x} \left(\sum_{i=1}^{N_x} x_i \right)^2 \tag{C.2}\]</span></p>

<p>遗憾的是这个公式在数值上不是很精确, 尤其是当 <span class="math">\(\s_x^{1\over2}\)</span> 相比 <span class="math">\(x\)</span> 的值为小时. 下面(等价)的表达式数值上更精确</p>

<p><span class="math">\[\s_x = \sum_{i=1}^{N_x} [x_i - < x >]^2 \tag{C.3}\]</span></p>

<p>其中</p>

<p><span class="math">\[< x > = {1\over N_x} \sum_{i=1}^{N_x} x_i \tag{C.4}\]</span></p>

<p>使用方程C.2和C.4进行计算时, 需要扫描 <span class="math">\(x_i\)</span> 值序列两次, 第一次确定 <span class="math">\(< x >\)</span>, 第二次计算 <span class="math">\(\s_x\)</span>, 而等式C.1只需要按顺序扫描 <span class="math">\(\{x_i\}\)</span> 序列一次. 然而, 可以将方程C.2改写成另一种形式, 其中含有部分和, 这样就可以使用顺序更新算法. 定义部分和</p>

<p><span class="math">\[X_{n,m} = \sum_{i=n}^m x_i \tag{C.5}\]</span></p>

<p>和部分方差</p>

<p><span class="math">\[\s_{n,m} = \sum_{i=n}^m \left[ x_i - {X_{n,m} \over m-n + 1} \right]^2 \tag{C.6}\]</span></p>

<p>可以证明</p>

<p><span class="math">\[X_{n,m+k} =X_{n,m} + X_{m+1, m+k} \tag{C.7}\]</span></p>

<p>和</p>

<p><span class="math">\(\alg
\s_{n,m+k} &= \s_{n,m}+\s_{m+1, m+k} + \left[ {X_{n,m} \over m-n+1} - {X_{n,m+k} \over m+k-n+1} \right]^2 \\
&* {(m-n+1)(m+k-n+1) \over k}
\ealg \tag{C.8}\)</span></p>

<p>对 <span class="math">\(n=1\)</span> 可以发现</p>

<p><span class="math">\[\s_{1,m+k} = \s_{1,m} + \s_{m+1, m+k} +\left[ {X_{1,m} \over m} - {X_{1,m+k} \over m+k} \right]^2 {m(m+k) \over k} \tag{C.9}\]</span></p>

<p>并且对 <span class="math">\(n=1, k=1\)</span> (方程C.8)变为</p>

<p><span class="math">\(\alg
\s_{1,m+1} &= \s_{1,m} + \left[ {X_{1,m} \over m} - {X_{1,m+1} \over m+1} \right]^2 m(m+1) \tag{C.10} \\
&=\s_{1,m} + {[X_{1,m} - m x_{m+1}]^2 \over m(m+1)} \tag{C.11}
\ealg\)</span></p>

<p>其中我们已经使用了关系</p>

<p><span class="math">\[X_{1,m+1} = X_{1,m} + X_{m+1} \tag{C.12}\]</span></p>

<p>利用公式(方程C.11)和(方程C.12), 平均值</p>

<p><span class="math">\[< x > = {X_{1, N_x} \over N_x} \tag{C.13}\]</span></p>

<p>涨落</p>

<p><span class="math">\[\left< (\D x)^2 \right>^{1\over2} = \left[{\s_{1,N_x} \over x}\right]^{1\over2} \tag{C.14}\]</span></p>

<p>通过扫描一次数据就可以获得.</p>

## C.2 实现

<p>在GROMACS中, 瞬时能量 <span class="math">\(E(m)\)</span> 连同 <span class="math">\(\s_{1,m}\)</span> 和 <span class="math">\(X_{1,m}\)</span> 一起存储在能量文件中. 虽然步数从0开始计数, 但能量和涨落的步数是从1开始计数的, 这意味着, 实现时使用的就是这里给出的方程. 我们在本节给出有些冗长的推导, 是为了以后核查代码和公式时更简单.</p>

### C.2.1 部分模拟

<p>这种情况并不少见, 模拟的第一部分, 例如100 ps, 被用于平衡. 然而, 日志文件中给出的平均值和涨落是基于整个模拟过程进行计算的. 平衡时间, 现在作为模拟的一部分, 在这种情况下 可能使得平均值和涨落无效, 因为这些数字现在由最初趋于平衡的漂移所主导.</p>

<p>根据方程C.7和C.8, 部分轨迹的平均值和标准偏差可利用下式计算:</p>

<p><span class="math">\[X_{m+1,m+k} = X_{1,m+k} - X_{1,m} \tag{C.15}\]</span></p>

<p><span class="math">\[\s_{m+1,m+k} = \s_{1,m+k} - \s_{1,m} - \left[ {X_{1,m} \over m} - {X_{1,m+k} \over m+k} \right]^2 {m(m+k) \over k} \tag{C.16}\]</span></p>

<p>或者, 更一般地(<span class="math">\(p \ge 1\)</span> 并且 <span class="math">\(q \ge p\)</span>):</p>

<p><span class="math">\[X_{p,q} = X_{1,q} - X_{1,p-1} \tag{C.17}\]</span></p>

<p><span class="math">\[\s_{p,q} = \s_{1,q} - \s_{1,p-1} - \left[ {X_{1,p-1} \over p-1} - {X_{1,q} \over q} \right]^2 {(p-1)q \over q-p+1} \tag{C.18}\]</span></p>

<p><strong>注意</strong>, 上面算法的实现并不是非常简单的, 因为没有存储模拟中每一时间步的能量. 因此, 我们必须使用方程C.11和C.12, 从 <span class="math">\(p\)</span> 时刻的信息来获得 <span class="math">\(X_{1, p-1}\)</span> 和 <span class="math">\(\s_{1,p-1}\)</span>:</p>

<p><span class="math">\[X_{1,p-1} = X_{1,p} - x_p \tag{C.19}\]</span></p>

<p><span class="math">\[\s_{1, p-1} = \s_{1,p} - {[X_{1,p-1} - (p-1) x_p ]^2 \over (p-1)p} \tag{C.20}\]</span></p>

### C.2.2 组合两次模拟

<p>另一个经常发生的问题是, 必须组合两次模拟的涨落. 考虑下面的例子: 我们有两次模拟, 进行了 <span class="math">\(n\)</span> 步的(A)和进行了 <span class="math">\(m\)</span> 步的(B), 其中的第二次模拟是第一次的延续. 然而, 第二次模拟从1开始编号, 而不是从 <span class="math">\(n+1\)</span> 开始. 对部分和这没有问题, 我们必须加上A的 <span class="math">\(x_{1,n}^A\)</span>:</p>

<p><span class="math">\[X^{AB}_{1,n+m} = X_{1,n}^A + X_{1,m}^B \tag{C.21}\]</span></p>

<p>当我们想根据两部分计算部分方差时, 必须修正 <span class="math">\(\D \s\)</span></p>

<p><span class="math">\[\s^{AB}_{1,n+m} = \s_{1,n}^A + \s_{1,m}^B + \D \s \tag{C.22}\]</span></p>

<p>如果我们定义 <span class="math">\(x_i^{AB}\)</span> 为组合并重新编号后的数据点, 有:</p>

<p><span class="math">\[\s_{1,n+m}^{AB} = \sum\limits_{i=1}^{n+m}\left[ x_i^{AB} - {X_{1,n+m}^{AB} \over n+m} \right]^2 \tag{C.23}\]</span></p>

<p>因此</p>

<p><span class="math">\[\sum\limits_{i=1}^{n+m} \left[ x_i^{AB}-{X_{1,n+m}^{AB} \over n+m}\right]^2=\sum\limits_{i=1}^n \left[ x_i^A -{X_{1,n}^A \over n} \right]^2 + \sum\limits_{i=1}^m \left[ x_i^B - {X_{1,m}^B \over m}\right]^2+ \D \s \tag{C.24}\]</span></p>

<p>或</p>

<p><span class="math">\(\alg
\sum\limits_{i=1}^{n+m} \left[ (x_i^{AB})^2-2 x_i^{AB} {X_{1,n+m}^{AB} \over n+m} + \left( {X_{1,n+m}^{AB} \over n+m}\right)^2 \right] &- \\
\sum\limits_{i=1}^n \left[ (x_i^A)^2-2 x_i^A {X_{1,n}^A \over n} + \left( X_{1,n}^A \right)^2 \right] &- \\
\sum\limits_{i=1}^m \left[ (x_i^B)^2-2 x_i^B {X_{1,n}^B \over n} + \left( X_{1,n}^B \right)^2 \right] &= \D \s \tag{C.25}
\ealg\)</span></p>

<p>所有的 <span class="math">\(x_i^2\)</span> 项都分离出来了, 每一项与加和指标 <span class="math">\(i\)</span> 无关, 可以简化为:</p>

<p><span class="math">\(\alg
{\left(X_{1,n+m}^{AB}\right)^2 \over n+m} - {\left(X_{1,n}^A\right)^2 \over n} - {\left(X_{1,m}^B\right)^2 \over n+m} &- \\
 2 {X_{1,n+m}^{AB} \over n+m} \sum\limits_{i=1}^{n+m} x_i^{AB} + 2 {X_{1,n}^A \over n} \Sum_{i=1}^n x_i^A + 2 {X_{1,m}^B \over m} \Sum_{i=1}^m x_i^B &= \D \s \tag{C.26}
\ealg\)</span></p>

<p>重新组织第二行的三个部分并使用方程C.21, 得到:</p>

<p><span class="math">\[\D \s= {\left( m X_{1,n}^A - n X_{1,m}^B \right)^2 \over nm(n+m)} \tag{C.27}\]</span></p>

<p>如果我们通过令 <span class="math">\(m=1\)</span> 来检查上面的公式, 将回归到方程C.11.</p>

### C.2.3 能量项加和

<p><code>g_energy</code>程序还可以将能量项加和在一起, 例如, 势能+动能=总能. 对部分平均是很容易的, 如果我们 <span class="math">\(S\)</span> 个能量组分 <span class="math">\(s\)</span>:</p>

<p><span class="math">\[X_{m,n}^S =  \Sum_{i=m}^n \Sum_{s=1}^S x_i^s = \Sum_{s=1}^S \Sum_{i=m}^n x_i^s = \Sum_{s=1}^S X_{m,n}^s \tag{C.28}\]</span></p>

<p>对于涨落更复杂些, 例如考虑一下势能和动能的涨落互相抵消的情况. 不过我们可以使用相同的方法, 如前面一样:</p>

<p><span class="math">\[\s_{m,n}^S = \Sum_{s=1}^S \s_{m,n}^s + \D \s \tag{C.29}\]</span></p>

<p>我们代入方程C.6:</p>

<p><span class="math">\[\Sum_{i=m}^n \left[ \left( \S_{s=1}^S x_i^s\right) - {X_{m,n}^S \over m-n+1} \right]^2 = \Sum_{s=1}^S \Sum_{i=m}^n \left[ (x_i^s)- {X_{m,n}^s \over m-n+1}\right]^2 + \D \s \tag{C.30}\]</span></p>

<p>展开得到:</p>

<p><span class="math">\(\alg
&\Sum_{i=m}^n \left[ \Sum_{s=1}^S (x_i^s)^2 + \left( {X_{m,n}^S \over m-n+1} \right)^2 - 2 \left( {X_{m,n}^S \over m-n+1} \Sum_{s=1}^S x_i^s + \Sum_{s=1}^S \Sum_{s'=s+1}^S x_i^s x_i^{s'} \right) \right] \\
- &\Sum_{s=1}^S \Sum_{i=m}^n \left[ (x_i^S)^2 - 2 {X_{m,n}^s \over m-n+1} x_i^s + \left( X_{m,n}^s \over m-n+1 \right)^2 \right] = \D \s \tag{C.31}
\ealg\)</span></p>

<p>含 <span class="math">\((x_i^s)^2\)</span> 的项互相抵消了, 这样我们就可以化简为:</p>

<p><span class="math">\(\alg
&{\left(X_{m,n}^S\right)^2 \over m-n+1} - 2 {X_{m,n}^S \over m-n+1} \Sum_{i=m}^n \Sum_{s=1}^S x_i^s - 2 \Sum_{i=m}^n \Sum_{s=1}^S \Sum_{s'=s+1}^S x_i^s x_i^{s'} - \\
&\Sum_{s=1}^S \Sum_{i=m}^n \left[ -2 {X_{m,n}^s \over m-n+1} x_i^s + \left( {X_{m,n}^s \over m-n+1} \right)^2 \right]= \D \s \tag{C.32}
\ealg\)</span></p>

<p>或</p>

<p><span class="math">\[-{\left( X_{m,n}^S \right)^2 \over m-n+1} -2 \Sum_{i=m}^n \Sum_{s=1}^S \Sum_{s'=s+1}^S x_i^s x_i^{s'} + \Sum_{s=1}^S {\left( X_{m,n}^s \right)^2 \over m-n+1} = \D \s \tag{C.33}\]</span></p>

<p>如果使用方程C.28展开第一项, 我们得到:</p>

<p><span class="math">\[-{\left( \S_{s=1}^S X_{m,n}^s \right)^2 \over m-n+1} -2 \Sum_{i=m}^n \Sum_{s=1}^S \Sum_{s'=s+1}^S x_i^s x_i^{s'} + \Sum_{s=1}^S {\left( X_{m,n}^s \right)^2 \over m-n+1} = \D \s \tag{C.34}\]</span></p>

<p>可以重写为:</p>

<p><span class="math">\[-2\left[ \Sum_{s=1}^S \Sum_{s'=s+1}^S X_{m,n}^s X_{m,n}^{s'} + \Sum_{i=m}^n \Sum_{s=1}^S \Sum_{s'=s+1}^S x_i^s x_i^{s'} \right] = \D \s \tag{C.35}\]</span></p>

<p>或</p>

<p><span class="math">\[-2\left[ \Sum_{s=1}^S  X_{m,n}^s   \Sum_{s'=s+1}^S X_{m,n}^{s'} + \Sum_{s=1}^S  \Sum_{i=m}^n x_i^s \Sum_{s'=s+1}^S x_i^{s'} \right] = \D \s \tag{C.36}\]</span></p>

<p>这给出</p>

<p><span class="math">\[-2\Sum_{s=1}^S\left[ X_{m,n}^s \Sum_{s'=s+1}^S \Sum_{i=m}^n x_i^{s'}  +  \Sum_{i=m}^n x_i^s \Sum_{s'=s+1}^S x_i^{s'} \right] = \D \s \tag{C.37}\]</span></p>

<p>由于我们需要根据所有的数据点 <span class="math">\(i\)</span> 进行计算, 一般来说这是不可能的. 我们可以对 <span class="math">\(\s_{m,n}^S\)</span> 进行估计, 仅使用可用的数据点, 并使用方程C.30的左半部分. 尽管可以使用模拟中的所有时间步对平均值进行计算, 涨落的精度却由能量保存的频率所限制. 由于使用程序如xmgr很容易做到, GROMACS并没有内置此功能.</p>
