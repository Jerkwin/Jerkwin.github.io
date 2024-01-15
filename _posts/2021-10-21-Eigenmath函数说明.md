---
 layout: post
 title: Eigenmath函数说明
 categories:
 - 科
 tags:
 - 数理
 math: true
---

* toc
{:toc}

- 2021-10-21 00:10:57

`Eigenmath`是一个计算机代数系统, 可用于进行简单的数学符号计算, 公式推导. 最近也提供了js版本, 可以直接在浏览器中运行. 我关注它有很多年了, 虽然也只是不时用到. 这里整理了`Eigenmath`支持的函数的说明, 供参考.

__参考资料__

- Eigenmath [官方网站](https://georgeweigt.github.io) [函数说明](https://georgeweigt.github.io/help.html) [参考手册](https://georgeweigt.github.io/eigenmath.pdf)
- [TTT Blog 中文翻译](https://hk.ayahuasec.top/blog/index.php/archives/59/)

__注意__

1. 注释符为`#`或`--`
1. 尽量不要使用`d`、`e`、`i`、`pi`作为变量名，因为它们分别代表求导、常数e、虚数i、常数pi。
2. 使用括号定义多元矩阵，使用方括号取矩阵中的某个元素。
2. 下文中`>`后面为输入.

## `abs(x)`: `x`的绝对值或向量`x`的长度

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> X <span style="color: #666666">=</span> (x,y,z)
<span style="color: #666666">&gt;</span> abs(X)
              <span style="color: #666666">1/2</span>
  <span style="color: #666666">2</span>    <span style="color: #666666">2</span>    <span style="color: #666666">2</span>
(x  <span style="color: #666666">+</span> y  <span style="color: #666666">+</span> z )</pre></div>

## `adj(m)`: 矩阵`m`的伴随矩阵，等于`m`的行列式乘以`m`的逆矩阵

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> adj(A) <span style="color: #666666">==</span> det(A) inv(A)
<span style="color: #666666">1</span></pre></div>

## `and(a,b,...)`: 逻辑与

如果所有参数都为真（即非零），返回1，否则返回0。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> and(<span style="color: #666666">1=1</span>,<span style="color: #666666">2=2</span>)
<span style="color: #666666">1</span></pre></div>

## `arccos(x)`: `x`的反余弦$\cos^{-1}(x)$

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> arccos(<span style="color: #666666">1/2</span>)
 <span style="color: #666666">1</span>
<span style="color: #666666">---</span> <span style="#FF0000">π</span>
 <span style="color: #666666">3</span></pre></div>

## `arccosh(x)`: `x`的反双曲余弦$\cosh^{-1}(x)$

## `arcsin(x)`: `x`的反正弦$\sin^{-1}(x)$

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> arcsin(<span style="color: #666666">1/2</span>)
 <span style="color: #666666">1</span>
<span style="color: #666666">---</span> <span style="#FF0000">π</span>
 <span style="color: #666666">6</span></pre></div>

## `arcsinh(x)`: `x`的反双曲正弦$\sinh^{-1}(x)$

## `arctan(y,x)`: `y/x`的反正切$\tan^{-1}(y/x)$

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> arctan(<span style="color: #666666">1</span>,<span style="color: #666666">0</span>)
 <span style="color: #666666">1</span>
<span style="color: #666666">---</span> <span style="#FF0000">π</span>
 <span style="color: #666666">2</span></pre></div>

## `arctanh(x)`: `x`的反双曲正切$\tanh^{-1}(x)$

## `arg(z)`: 复数`z`的幅角

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> arg(<span style="color: #666666">2</span> <span style="color: #666666">-</span> <span style="color: #666666">3</span>i)
arctan(<span style="color: #666666">-3</span>,<span style="color: #666666">2</span>)</pre></div>

## `besselj(x,n)`: 贝塞尔函数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> besselj(x,<span style="color: #666666">1/2</span>)
  <span style="color: #666666">1/2</span>
 <span style="color: #666666">2</span>    sin(x)
<span style="color: #666666">-------------</span>
   <span style="color: #666666">1/2</span>  <span style="color: #666666">1/2</span>
  <span style="#FF0000">π</span>    x</pre></div>

## `binding(s)`: 符号表达式的原本形式

计算一个符号表达式时，其结果可能与符号表达式的原始形式不同，比如结果表达式会展开。使用`binding`函数可以返回符号表达式原本的形式。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> quote((x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)<span style="color: #666666">^2</span>)
<span style="color: #666666">&gt;</span> p
<span style="color: #666666">&gt;</span> binding(p)
     <span style="color: #666666">2</span>
p <span style="color: #666666">=</span> x  <span style="color: #666666">+</span> <span style="color: #666666">2</span> x <span style="color: #666666">+</span> <span style="color: #666666">1</span>
       <span style="color: #666666">2</span>
(x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)</pre></div>

## `binomial(n,k)`: 二项式系数, 或组合数

$(x+y)^n$的展开式中$x^k y^(n-k)$项的系数.

此函数与`choose`相同。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> binomial(<span style="color: #666666">52</span>,<span style="color: #666666">5</span>)
<span style="color: #666666">2598960</span></pre></div>

## `ceiling(x)`: 大于或等于`x`的最小整数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> ceiling(<span style="color: #666666">1/2</span>)
<span style="color: #666666">1</span></pre></div>

## `check(x)`: 测试表达式`x`的值并决定是否停止脚本

如果`x`为真（非零）则继续执行脚本，否则停止脚本。表达式`x`可以包含比较运算，比如`=`、`==`、`<`、`<=`、`>`、`>=`。可以使用`not`函数测试非等价条件。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> <span style="color: #666666">1</span>
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> <span style="color: #666666">1</span>
<span style="color: #666666">&gt;</span> check(A<span style="color: #666666">=</span>B) <span style="color: #666666">--</span> <span style="#FF0000">如果</span>A<span style="#FF0000">不等于</span>B, <span style="#FF0000">则在此处停止脚本</span></pre></div>

## `choose(n,k)`: 组合数

从`n`中不考虑顺序取`k`个项的组合数（即$C_n^k$）。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> choose(<span style="color: #666666">52</span>,<span style="color: #666666">5</span>)
<span style="color: #666666">2598960</span></pre></div>

## `circexp(x)`: 计算`x`表达式，将其中的三角函数和双曲函数转换为指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> circexp(cos(x) <span style="color: #666666">+</span> i sin(x))
exp(i x)</pre></div>

## `clear`: 清除所有的符号定义

## `clock(z)`: 复数`z`的极坐标形式，但使用`-1`作为底数，而不使用`e`

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> clock(<span style="color: #666666">2</span> <span style="color: #666666">-</span> <span style="color: #666666">3</span>i)

           arctan(<span style="color: #666666">-3</span>,<span style="color: #666666">2</span>)
          <span style="color: #666666">--------------</span>
  <span style="color: #666666">1/2</span>           <span style="#FF0000">π</span>
<span style="color: #666666">13</span>    (<span style="color: #666666">-1</span>)</pre></div>

## `coeff(p,x,n)`: 多项式`p`中$x^n$项的系数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> x<span style="color: #666666">^3</span> <span style="color: #666666">+</span> <span style="color: #666666">6</span>x<span style="color: #666666">^2</span> <span style="color: #666666">+</span> <span style="color: #666666">12</span>x <span style="color: #666666">+</span> <span style="color: #666666">8</span>
<span style="color: #666666">&gt;</span> coeff(p,x,<span style="color: #666666">2</span>)
<span style="color: #666666">6</span></pre></div>

## `cofactor(m,i,j)`: 矩阵`m`第`i`行、第`j`列元素的代数余子式, 伴随矩阵的转置。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> cofactor(A,<span style="color: #666666">1</span>,<span style="color: #666666">2</span>) <span style="color: #666666">==</span> adj(A)[<span style="color: #666666">2</span>,<span style="color: #666666">1</span>]
<span style="color: #666666">1</span></pre></div>

## `conj(z)`: 复数`z`的共轭。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> conj(<span style="color: #666666">2</span> <span style="color: #666666">-</span> <span style="color: #666666">3</span>i)
<span style="color: #666666">2</span> <span style="color: #666666">+</span> <span style="color: #666666">3</span> i</pre></div>

## `contract(a,i,j)`: 张量`a`对指标`i`和`j`缩并, 矩阵`m`的迹

如果忽略`i`和`j`，则分别取`1`和`2`。表达式`contract(m)`表示计算矩阵`m`的迹（即$\tr(m)$）。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> contract(A)
a <span style="color: #666666">+</span> d</pre></div>

## `cos(x)`: `x`的余弦

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> cos(pi<span style="color: #666666">/4</span>)
  <span style="color: #666666">1</span>
<span style="color: #666666">------</span>
  <span style="color: #666666">1/2</span>
 <span style="color: #666666">2</span></pre></div>

## `cosh(x)`: `x`的双曲余弦

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> circexp(cosh(x))
 <span style="color: #666666">1</span>             <span style="color: #666666">1</span>
<span style="color: #666666">---</span> exp(<span style="color: #666666">-</span>x) <span style="color: #666666">+</span> <span style="color: #666666">---</span> exp(x)
 <span style="color: #666666">2</span>             <span style="color: #666666">2</span></pre></div>

## `cross(u,v)`: 向量`u`和`v`的叉积

`cross`函数可重定义，默认定义如下：

<div class="highlight"><pre style="line-height:125%"><span></span>cross(u,v) <span style="color: #666666">=</span> (u[<span style="color: #666666">2</span>] v[<span style="color: #666666">3</span>] <span style="color: #666666">-</span> u[<span style="color: #666666">3</span>] v[<span style="color: #666666">2</span>],
              u[<span style="color: #666666">3</span>] v[<span style="color: #666666">1</span>] <span style="color: #666666">-</span> u[<span style="color: #666666">1</span>] v[<span style="color: #666666">3</span>],
              u[<span style="color: #666666">1</span>] v[<span style="color: #666666">2</span>] <span style="color: #666666">-</span> u[<span style="color: #666666">2</span>] v[<span style="color: #666666">1</span>])</pre></div>

## `curl(u)`: 向量`u`的旋度

`curl`函数可重定义，默认定义如下：

<div class="highlight"><pre style="line-height:125%"><span></span>curl(u) <span style="color: #666666">=</span> (d(u[<span style="color: #666666">3</span>],y) <span style="color: #666666">-</span> d(u[<span style="color: #666666">2</span>],z),
           d(u[<span style="color: #666666">1</span>],z) <span style="color: #666666">-</span> d(u[<span style="color: #666666">3</span>],x),
           d(u[<span style="color: #666666">2</span>],x) <span style="color: #666666">-</span> d(u[<span style="color: #666666">1</span>],y))</pre></div>

## `d(f,x)`: `f`对`x`的偏导数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> d(x<span style="color: #666666">^2</span>,x)
<span style="color: #666666">2</span> x</pre></div>

参数`f`可以是任意秩的张量，参数`x`可以是向量。当`x`为向量时，结果为`f`的梯度。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> F <span style="color: #666666">=</span> (f(),g(),h())
<span style="color: #666666">&gt;</span> X <span style="color: #666666">=</span> (x,y,z)
<span style="color: #666666">&gt;</span> d(F,X)
<span style="#FF0000">┌</span>                                <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> d(f(),x)   d(f(),y)   d(f(),z) <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                                <span style="#FF0000">│</span>
<span style="#FF0000">│</span> d(g(),x)   d(g(),y)   d(g(),z) <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                                <span style="#FF0000">│</span>
<span style="#FF0000">│</span> d(h(),x)   d(h(),y)   d(h(),z) <span style="#FF0000">│</span>
<span style="#FF0000">└</span>                                <span style="#FF0000">┘</span></pre></div>

`d`可以用作变量名，它不会与函数`d`冲突。

可以将`d`重定义为其他函数，这种情况下仍然可以使用`derivative`(`d`的同义函数)计算偏导数。

## `defint(f,x,a,b)`: 从`a`到`b`, `f`对`x`的定积分

参数可以扩展以对多个变量进行定积分计算（多重积分），例如`defint(f,x,a,b,y,c,d)`等价于`defint(defint(f,x,a,b),y,c,d)`。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> f <span style="color: #666666">=</span> (<span style="color: #666666">1</span> <span style="color: #666666">+</span> cos(theta)<span style="color: #666666">^2</span>) sin(theta)
<span style="color: #666666">&gt;</span> defint(f, theta, <span style="color: #666666">0</span>, pi, phi, <span style="color: #666666">0</span>, <span style="color: #666666">2</span>pi)
 <span style="color: #666666">16</span>
<span style="color: #666666">----</span> <span style="#FF0000">π</span>
 <span style="color: #666666">3</span></pre></div>

## `deg(p,x)`: 多项式`p`中`x`的最高次数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> (<span style="color: #666666">2</span>x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)<span style="color: #666666">^3</span>
<span style="color: #666666">&gt;</span> deg(p,x)
<span style="color: #666666">3</span></pre></div>

## `denominator(x)`: 表达式`x`的分母

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> denominator(a<span style="color: #666666">/</span>b)
b</pre></div>

## `det(m)`: 矩阵`m`的行列式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> det(A)
a d <span style="color: #666666">-</span> b c</pre></div>

## `dim(a,n)`: 张量`a`第`n`个指标的维数, 或矩阵`a`第`n`列的维数

注意编号从1开始。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>),(<span style="color: #666666">3</span>,<span style="color: #666666">4</span>),(<span style="color: #666666">5</span>,<span style="color: #666666">6</span>))
<span style="color: #666666">&gt;</span> dim(A,<span style="color: #666666">1</span>)
<span style="color: #666666">3</span></pre></div>

## `div(u)`: 向量`u`的散度

`div`函数可重定义，默认定义如下：

<div class="highlight"><pre style="line-height:125%"><span></span>div(u) <span style="color: #666666">=</span> d(u[<span style="color: #666666">1</span>],x) <span style="color: #666666">+</span> d(u[<span style="color: #666666">2</span>],y) <span style="color: #666666">+</span> d(u[<span style="color: #666666">3</span>],z)</pre></div>

## `do(a,b,...)`: 从左到右依次计算每个参数表达式，返回最后一个参数的计算结果

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #AA22FF; font-weight: bold">do</span>(A<span style="color: #666666">=1</span>,B<span style="color: #666666">=2</span>,A<span style="color: #666666">+</span>B)
<span style="color: #666666">3</span></pre></div>

注意，计算过程的中间变量在函数计算结束后仍然会保留。

## `dot(a,b,...)`: 向量、矩阵、张量的点积，矩阵乘法

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800"># 计算方程组AX=B的解</span>
<span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>),(<span style="color: #666666">3</span>,<span style="color: #666666">4</span>))
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> (<span style="color: #666666">5</span>,<span style="color: #666666">6</span>)
<span style="color: #666666">&gt;</span> X <span style="color: #666666">=</span> dot(inv(A),B)
<span style="color: #666666">&gt;</span> X
    <span style="#FF0000">┌</span>     <span style="#FF0000">┐</span>
    <span style="#FF0000">│</span> <span style="color: #666666">-4</span>  <span style="#FF0000">│</span>
    <span style="#FF0000">│</span>     <span style="#FF0000">│</span>
X <span style="color: #666666">=</span> <span style="#FF0000">│</span>  <span style="color: #666666">9</span>  <span style="#FF0000">│</span>
    <span style="#FF0000">│</span> <span style="color: #666666">---</span> <span style="#FF0000">│</span>
    <span style="#FF0000">│</span>  <span style="color: #666666">2</span>  <span style="#FF0000">│</span>
    <span style="#FF0000">└</span>     <span style="#FF0000">┘</span></pre></div>

## `draw(f,x)`: 绘制`f(x)`的函数图像

可以通过设置`xrange`和`yrange`指定绘制范围

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> xrange <span style="color: #666666">=</span> (<span style="color: #666666">0</span>,<span style="color: #666666">1</span>)
<span style="color: #666666">&gt;</span> yrange <span style="color: #666666">=</span> (<span style="color: #666666">0</span>,<span style="color: #666666">1</span>)
<span style="color: #666666">&gt;</span> draw(x<span style="color: #666666">^2</span>,x)</pre></div>

注意，该功能需要在GUI中使用。

## `e`: 初始化为自然常数`e`

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> e<span style="color: #666666">^</span>x
exp(x)</pre></div>

注意: 可以清除或重定义`e`, 用作其他.

## `eigen(m)`: 数值计算特征值和特征向量, $m=Q'DQ$

注意，矩阵`m`必须为数值, 且对称。计算结果会保存在`Q`和`D`变量中，其中`Q`的行保存了特征向量，`D`对角线上的元素为特征值。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>),(<span style="color: #666666">2</span>,<span style="color: #666666">1</span>))
<span style="color: #666666">&gt;</span> eigen(A)
<span style="color: #666666">&gt;</span> dot(transpose(Q),D,Q)
<span style="#FF0000">┌</span>       <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> <span style="color: #666666">1</span>   <span style="color: #666666">2</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>       <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">2</span>   <span style="color: #666666">1</span> <span style="#FF0000">│</span>
<span style="#FF0000">└</span>       <span style="#FF0000">┘</span></pre></div>

## `erf(x)`: `x`的误差函数

## `erfc(x)`: `x`的余误差函数

## `eval(f,x,a)`: `x`等于`a`时表达式`f`的值

参数列表可以扩充以支持多个变量。比如，`eval(f,x,a,y,b)`等价于`eval(eval(f,x,a),y,b)`。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> eval(x <span style="color: #666666">+</span> y,x,a,y,b)
a <span style="color: #666666">+</span> b</pre></div>

## `exp(x)`: `x`的`e`次幂$e^x$

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> exp(i pi)
<span style="color: #666666">-1</span></pre></div>

## `expand(r,x)`: 多项式`r`按`x`次数的部分分数展开

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> (x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)<span style="color: #666666">^2</span>
<span style="color: #666666">&gt;</span> q <span style="color: #666666">=</span> (x <span style="color: #666666">+</span> <span style="color: #666666">2</span>)<span style="color: #666666">^2</span>
<span style="color: #666666">&gt;</span> expand(p<span style="color: #666666">/</span>q,x)
    <span style="color: #666666">2</span>            <span style="color: #666666">1</span>
<span style="color: #666666">--------</span> <span style="color: #666666">+</span> <span style="color: #666666">--------------</span> <span style="color: #666666">+</span> <span style="color: #666666">1</span>
  x <span style="color: #666666">+</span> <span style="color: #666666">2</span>      <span style="color: #666666">2</span>
            x  <span style="color: #666666">+</span> <span style="color: #666666">4</span> x <span style="color: #666666">+</span> <span style="color: #666666">4</span></pre></div>

## `expcos(z)`: `z`的余弦函数的指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> expcos(z)
 <span style="color: #666666">1</span>              <span style="color: #666666">1</span>
<span style="color: #666666">---</span> exp(i z) <span style="color: #666666">+</span> <span style="color: #666666">---</span> exp(<span style="color: #666666">-</span>i z)
 <span style="color: #666666">2</span>              <span style="color: #666666">2</span></pre></div>

## `expcosh(z)`: `z`的双曲余弦函数的指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> expcosh(z)

 <span style="color: #666666">1</span>             <span style="color: #666666">1</span>
<span style="color: #666666">---</span> exp(<span style="color: #666666">-</span>z) <span style="color: #666666">+</span> <span style="color: #666666">---</span> exp(z)
 <span style="color: #666666">2</span>             <span style="color: #666666">2</span></pre></div>

## `expsin(z)`: `z`的正弦函数的指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> expsin(z)

  <span style="color: #666666">1</span>                <span style="color: #666666">1</span>
<span style="color: #666666">----</span> i exp(i z) <span style="color: #666666">+</span> <span style="color: #666666">---</span> i exp(<span style="color: #666666">-</span>i z)
  <span style="color: #666666">2</span>                <span style="color: #666666">2</span></pre></div>

## `expsinh(z)`: `z`的双曲正弦函数的指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> expsinh(z)
  <span style="color: #666666">1</span>             <span style="color: #666666">1</span>
<span style="color: #666666">----</span> exp(<span style="color: #666666">-</span>z) <span style="color: #666666">+</span> <span style="color: #666666">---</span> exp(z)
  <span style="color: #666666">2</span>             <span style="color: #666666">2</span></pre></div>

## `exptan(z)`: `z`的正切函数的指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> exptan(z)
       i             i exp(<span style="color: #666666">2</span> i z)
<span style="color: #666666">----------------</span> <span style="color: #666666">-</span> <span style="color: #666666">----------------</span>
 exp(<span style="color: #666666">2</span> i z) <span style="color: #666666">+</span> <span style="color: #666666">1</span>     exp(<span style="color: #666666">2</span> i z) <span style="color: #666666">+</span> <span style="color: #666666">1</span></pre></div>

## `exptanh(z)`: `z`的双曲正切函数的指数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> exptanh(z)
       <span style="color: #666666">1</span>             exp(<span style="color: #666666">2</span> z)
<span style="color: #666666">---------------</span> <span style="color: #666666">+</span> <span style="color: #666666">--------------</span>
  exp(<span style="color: #666666">2</span> z) <span style="color: #666666">+</span> <span style="color: #666666">1</span>     exp(<span style="color: #666666">2</span> z) <span style="color: #666666">+</span> <span style="color: #666666">1</span></pre></div>

## `factor(n)`: 数`n`的因数（质数分解）

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> factor(<span style="color: #666666">12/35</span>)
  <span style="color: #666666">2</span>
 <span style="color: #666666">2</span>  <span style="color: #666666">3</span>
<span style="color: #666666">------</span>
 <span style="color: #666666">5</span> <span style="color: #666666">7</span></pre></div>

如果`n`是一个浮点数，则选取它的一个近似值进行计算。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> factor(<span style="color: #00BB00; font-weight: bold">float</span>(pi))
 <span style="color: #666666">5</span> <span style="color: #666666">71</span>
<span style="color: #666666">------</span>
 <span style="color: #666666">113</span></pre></div>

## `factor(p,x)`: 多项式`p`关于`x`的因式分解

对于多变量的多项式，函数的参数列表可以扩展。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> <span style="color: #666666">2</span>x <span style="color: #666666">+</span> x y <span style="color: #666666">+</span> y <span style="color: #666666">+</span> <span style="color: #666666">2</span>
<span style="color: #666666">&gt;</span> factor(p,x,y)
(x <span style="color: #666666">+</span> <span style="color: #666666">1</span>) (y <span style="color: #666666">+</span> <span style="color: #666666">2</span>)</pre></div>

注意，`factor`函数返回的是未展开的表达式，如果将结果赋值给一个符号变量，则对这个符号变量的计算会将结果展开。如果希望保持不展开的结果，可通过`binding`函数进行处理。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> <span style="color: #666666">2</span>x <span style="color: #666666">+</span> x y <span style="color: #666666">+</span> y <span style="color: #666666">+</span> <span style="color: #666666">2</span>
<span style="color: #666666">&gt;</span> q <span style="color: #666666">=</span> factor(p,x,y)
<span style="color: #666666">&gt;</span> q
q <span style="color: #666666">=</span> <span style="color: #666666">2</span> x <span style="color: #666666">+</span> x y <span style="color: #666666">+</span> y <span style="color: #666666">+</span> <span style="color: #666666">2</span>
<span style="color: #666666">&gt;</span> binding(q)
(x <span style="color: #666666">+</span> <span style="color: #666666">1</span>) (y <span style="color: #666666">+</span> <span style="color: #666666">2</span>)</pre></div>

## `factorial(n)`: `n`的阶乘`n!`

也可以使用`n!`。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #666666">20!</span>
<span style="color: #666666">2432902008176640000</span></pre></div>

## `filter(f,a,b,...)`: `f`中不包含`a`、`b`等的表达式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> x<span style="color: #666666">^2</span> <span style="color: #666666">+</span> <span style="color: #666666">3</span>x <span style="color: #666666">+</span> <span style="color: #666666">2</span>
<span style="color: #666666">&gt;</span> filter(p,x<span style="color: #666666">^2</span>)
<span style="color: #666666">3</span> x <span style="color: #666666">+</span> <span style="color: #666666">2</span></pre></div>

## `float(x)`: 表达式`x`的有理数和整数转换为浮点数之后的值

注意，`pi`和`e`也会转换。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #00BB00; font-weight: bold">float</span>(<span style="color: #666666">212^17</span>)
          <span style="color: #666666">39</span>
<span style="color: #666666">3.52947</span> <span style="color: #666666">10</span></pre></div>

## `floor(x)`: 小于或等于`x`的最大整数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> floor(<span style="color: #666666">1/2</span>)
<span style="color: #666666">0</span></pre></div>

## `for(i,j,k,a,b,...)`: `i`取值从j到k时，计算`a`、`b`及后续表达式的值

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #AA22FF; font-weight: bold">for</span>(k,<span style="color: #666666">1</span>,<span style="color: #666666">3</span>,A<span style="color: #666666">=</span>k,print(A))
A <span style="color: #666666">=</span> <span style="color: #666666">1</span>
A <span style="color: #666666">=</span> <span style="color: #666666">2</span>
A <span style="color: #666666">=</span> <span style="color: #666666">3</span></pre></div>

注意，`for`循环中`i`的值在`for`循环结束后会恢复原值，除非`for`循环被`check`之类的函数打断。如果使用`i`作为计数变量，`for`循环内的虚数单位会被覆盖（涉及复数计算时，尽量不使用`i`作为变量）。

## `gcd(a,b,...)`: 各表达式的最大公约数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> gcd(x,x y)
x</pre></div>

## `hermite(x,n)`: `x`的`n`阶Hermite多项式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> hermite(x,<span style="color: #666666">3</span>)
   <span style="color: #666666">3</span>
<span style="color: #666666">8</span> x  <span style="color: #666666">-</span> <span style="color: #666666">12</span> x</pre></div>

## (新版本中不可用) `hilbert(n)`: `n`阶Hilbert矩阵

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> hilbert(<span style="color: #666666">3</span>)
       <span style="color: #666666">1</span>     <span style="color: #666666">1</span>
 <span style="color: #666666">1</span>    <span style="color: #666666">---</span>   <span style="color: #666666">---</span>
       <span style="color: #666666">2</span>     <span style="color: #666666">3</span>
 <span style="color: #666666">1</span>     <span style="color: #666666">1</span>     <span style="color: #666666">1</span>
<span style="color: #666666">---</span>   <span style="color: #666666">---</span>   <span style="color: #666666">---</span>
 <span style="color: #666666">2</span>     <span style="color: #666666">3</span>     <span style="color: #666666">4</span>
 <span style="color: #666666">1</span>     <span style="color: #666666">1</span>     <span style="color: #666666">1</span>
<span style="color: #666666">---</span>   <span style="color: #666666">---</span>   <span style="color: #666666">---</span>
 <span style="color: #666666">3</span>     <span style="color: #666666">4</span>     <span style="color: #666666">5</span></pre></div>

## `hadamard(a,b,...)`: Hadamard积(对应元素的乘积)

参数的维数必须相同. Hadamard积也可以通过简单地对参数相乘进行计算.

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((A11,A12),(A21,A22))
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> ((B11,B12),(B21,B22))
<span style="color: #666666">&gt;</span> A B
<span style="#FF0000">┌</span>                   <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> A   B     A   B   <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  <span style="color: #666666">11</span>  <span style="color: #666666">11</span>    <span style="color: #666666">12</span>  <span style="color: #666666">12</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                   <span style="#FF0000">│</span>
<span style="#FF0000">│</span> A   B     A   B   <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  <span style="color: #666666">21</span>  <span style="color: #666666">21</span>    <span style="color: #666666">22</span>  <span style="color: #666666">22</span> <span style="#FF0000">│</span>
<span style="#FF0000">└</span>                   <span style="#FF0000">┘</span></pre></div>

## `i`: 初始化为虚数单位$(-1)^{1/2}$

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> exp(i pi)
<span style="color: #666666">-1</span></pre></div>

注意: 可以清除或重定义`i`做其他用途.

## `imag(z)`: `z`的虚部

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> imag(<span style="color: #666666">2</span> <span style="color: #666666">-</span> <span style="color: #666666">3</span>i)
<span style="color: #666666">-3</span></pre></div>

## `inner(a,b,...)`: 向量、张量、矩阵的内积（矩阵乘法）

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> (x,y)
<span style="color: #666666">&gt;</span> inner(A,B)
<span style="#FF0000">┌</span>           <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> a x <span style="color: #666666">+</span> b y <span style="#FF0000">│</span>
<span style="#FF0000">│</span>           <span style="#FF0000">│</span>
<span style="#FF0000">│</span> c x <span style="color: #666666">+</span> d y <span style="#FF0000">│</span>
<span style="#FF0000">└</span>           <span style="#FF0000">┘</span></pre></div>

注意，`inner`与`dot`是同一函数。

## `integral(f,x)`: `f`关于`x`的不定积分

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> integral(x<span style="color: #666666">^2</span>,x)
 <span style="color: #666666">1</span>   <span style="color: #666666">3</span>
<span style="color: #666666">---</span> x
 <span style="color: #666666">3</span></pre></div>

## `inv(m)`: 矩阵`m`的逆矩阵

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>),(<span style="color: #666666">3</span>,<span style="color: #666666">4</span>))
<span style="color: #666666">&gt;</span> inv(A)
<span style="#FF0000">┌</span>            <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> <span style="color: #666666">-2</span>     <span style="color: #666666">1</span>   <span style="#FF0000">│</span>
<span style="#FF0000">│</span>            <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  <span style="color: #666666">3</span>      <span style="color: #666666">1</span>  <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">---</span>   <span style="color: #666666">----</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  <span style="color: #666666">2</span>      <span style="color: #666666">2</span>  <span style="#FF0000">│</span>
<span style="#FF0000">└</span>            <span style="#FF0000">┘</span></pre></div>

## `isprime(n)`: 若`n`为质数返回1，否则返回0

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> isprime(<span style="color: #666666">2^31</span> <span style="color: #666666">-</span> <span style="color: #666666">1</span>)
<span style="color: #666666">1</span></pre></div>

## `j`: 设置`j=sqrt(-1)`, 以便使用`j`而不是`i`作为虚数单位

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> j <span style="color: #666666">=</span> sqrt(<span style="color: #666666">-1</span>)
<span style="color: #666666">&gt;</span> <span style="color: #666666">1/</span>sqrt(<span style="color: #666666">-1</span>)
<span style="color: #666666">-</span>j</pre></div>

## `kronecker(a,b,...)`: 向量, 矩阵的Kronecker积(直积)

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>),(<span style="color: #666666">3</span>,<span style="color: #666666">4</span>))
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> kronecker(A,B)
<span style="#FF0000">┌</span>                       <span style="#FF0000">┐</span>
<span style="#FF0000">│</span>  a     b    <span style="color: #666666">2</span> a   <span style="color: #666666">2</span> b <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                       <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  c     d    <span style="color: #666666">2</span> c   <span style="color: #666666">2</span> d <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                       <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">3</span> a   <span style="color: #666666">3</span> b   <span style="color: #666666">4</span> a   <span style="color: #666666">4</span> b <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                       <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">3</span> c   <span style="color: #666666">3</span> d   <span style="color: #666666">4</span> c   <span style="color: #666666">4</span> d <span style="#FF0000">│</span>
<span style="#FF0000">└</span>                       <span style="#FF0000">┘</span></pre></div>

## `laguerre(x,n,a)`: `x`的`n`阶关联Laguerre多项式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> laguerre(x,<span style="color: #666666">3</span>,<span style="color: #666666">0</span>)
  <span style="color: #666666">1</span>   <span style="color: #666666">3</span>    <span style="color: #666666">3</span>   <span style="color: #666666">2</span>
<span style="color: #666666">----</span> x  <span style="color: #666666">+</span> <span style="color: #666666">---</span> x  <span style="color: #666666">-</span> <span style="color: #666666">3</span> x <span style="color: #666666">+</span> <span style="color: #666666">1</span>
  <span style="color: #666666">6</span>        <span style="color: #666666">2</span></pre></div>

## `last`: 上一步的计算结果

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #666666">212^17</span>
<span style="color: #666666">3529471145760275132301897342055866171392</span>
<span style="color: #666666">&gt;</span> last<span style="color: #666666">^</span>(<span style="color: #666666">1/17</span>)
<span style="color: #666666">212</span></pre></div>

注意，对某些函数，如果未指定参数，则会将`last`作为参数。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #666666">212^17</span>
<span style="color: #666666">3529471145760275132301897342055866171392</span>
<span style="color: #666666">&gt;</span> <span style="color: #00BB00; font-weight: bold">float</span>
          <span style="color: #666666">39</span>
<span style="color: #666666">3.52947</span> <span style="color: #666666">10</span></pre></div>

## `lcm(a,b,...)`: 各表达式的最小公倍数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> lcm(x,x y)
x y</pre></div>

## `leading(p,x)`: 多项式`p`中`x`最高次项的系数

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> leading(<span style="color: #666666">3</span>x<span style="color: #666666">^2+</span>y<span style="color: #666666">^4+1</span>,x)
<span style="color: #666666">3</span></pre></div>

## `legendre(x,n,m)`: `x`的`n`阶关联Legendre多项式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> legendre(x,<span style="color: #666666">3</span>,<span style="color: #666666">0</span>)
 <span style="color: #666666">5</span>   <span style="color: #666666">3</span>    <span style="color: #666666">3</span>
<span style="color: #666666">---</span> x  <span style="color: #666666">-</span> <span style="color: #666666">---</span> x
 <span style="color: #666666">2</span>        <span style="color: #666666">2</span></pre></div>

## (新版本中不可用) `lisp(x)`: 计算表达式`x`并返回结果的前缀符号形式

在调试脚本时很有用。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> lisp(x<span style="color: #666666">^2</span> <span style="color: #666666">+</span> <span style="color: #666666">1</span>)
(<span style="color: #666666">+</span> (<span style="color: #666666">^</span> x <span style="color: #666666">2</span>) <span style="color: #666666">1</span>)</pre></div>

## `log(x)`: 以`e`为底`x`的对数(自然对数)

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> log(x<span style="color: #666666">^</span>y)
y log(x)</pre></div>

如果要计算以其他值，如`a`，为底的对数，可使用换底公式：$log_a(x) = log(x)/log(a)$.

## `mag(z)`: 复数`z`的模

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> mag(x <span style="color: #666666">+</span> i y)
<span style="#FF0000">┌</span>       <span style="#FF0000">┐</span><span style="color: #666666">1/2</span>
<span style="#FF0000">│</span> <span style="color: #666666">2</span>    <span style="color: #666666">2</span><span style="#FF0000">│</span>
<span style="#FF0000">│</span>x  <span style="color: #666666">+</span> y <span style="#FF0000">│</span>
<span style="#FF0000">│</span>       <span style="#FF0000">│</span>
<span style="#FF0000">└</span>       <span style="#FF0000">┘</span></pre></div>

注意，`mag`函数会将未定义的符号函数视为实数，而`abs`函数不会。

## `minor(m,i,j)`: 矩阵`m`的`i`行`j`列对应的余子式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>,<span style="color: #666666">3</span>),(<span style="color: #666666">4</span>,<span style="color: #666666">5</span>,<span style="color: #666666">6</span>),(<span style="color: #666666">7</span>,<span style="color: #666666">8</span>,<span style="color: #666666">9</span>))
<span style="color: #666666">&gt;</span> minor(A,<span style="color: #666666">1</span>,<span style="color: #666666">1</span>) <span style="color: #666666">==</span> det(minormatrix(A,<span style="color: #666666">1</span>,<span style="color: #666666">1</span>))
<span style="color: #666666">1</span></pre></div>

## `minormatrix(m,i,j)`: 矩阵`m`去除`i`行`j`列后的结果

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>,<span style="color: #666666">3</span>),(<span style="color: #666666">4</span>,<span style="color: #666666">5</span>,<span style="color: #666666">6</span>),(<span style="color: #666666">7</span>,<span style="color: #666666">8</span>,<span style="color: #666666">9</span>))
<span style="color: #666666">&gt;</span> minormatrix(A,<span style="color: #666666">1</span>,<span style="color: #666666">1</span>)
<span style="#FF0000">┌</span>       <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> <span style="color: #666666">5</span>   <span style="color: #666666">6</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>       <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">8</span>   <span style="color: #666666">9</span> <span style="#FF0000">│</span>
<span style="#FF0000">└</span>       <span style="#FF0000">┘</span></pre></div>

## `mod(a,b)`: `a`除以`b`的模

即`a`除以`b`计算整数商时的余数。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> mod(<span style="color: #666666">10</span>,<span style="color: #666666">7</span>)
<span style="color: #666666">3</span>
<span style="color: #666666">&gt;</span> mod(<span style="color: #666666">5</span>,<span style="color: #666666">3/8</span>)
 <span style="color: #666666">1</span>
<span style="color: #666666">---</span>
 <span style="color: #666666">8</span></pre></div>

## `noexpand(x)`: 计算表达式`x`的值, 但不展开求和进行

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> noexpand((x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)<span style="color: #666666">^2</span> <span style="color: #666666">/</span> (x <span style="color: #666666">+</span> <span style="color: #666666">1</span>))
x <span style="color: #666666">+</span> <span style="color: #666666">1</span></pre></div>

## `not(x)`: 逻辑非

若`x`为真（非零）返回0，否则返回1

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> not(<span style="color: #666666">1=1</span>)
<span style="color: #666666">0</span></pre></div>

## `nroots(p,x)`: 多项式`p(x)`的所有根

包括实数和复数根。该函数只进行数值计算。`p(x)`的系数可以是复数。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> nroots((x<span style="color: #666666">-1</span>)<span style="color: #666666">*</span>(x<span style="color: #666666">+2</span>),x)
<span style="#FF0000">┌</span>    <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> <span style="color: #666666">-2</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>    <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">1</span>  <span style="#FF0000">│</span>
<span style="#FF0000">└</span>    <span style="#FF0000">┘</span></pre></div>

## `number(x)`: 判断数字

如果`x`为有理数或者浮点数返回1，否则返回0。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> number(<span style="color: #666666">1/2</span>)
<span style="color: #666666">1</span></pre></div>

## `numerator(x)`: 表达式`x`的分子

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> numerator(a<span style="color: #666666">/</span>b)
a
<span style="color: #666666">&gt;</span> numerator(a<span style="color: #666666">/</span>b<span style="color: #666666">+</span>b<span style="color: #666666">/</span>a)
 <span style="color: #666666">2</span>    <span style="color: #666666">2</span>
a  <span style="color: #666666">+</span> b</pre></div>

## `or(a,b,...)`: 逻辑或

如果参数列表中至少有一个表达式为真（非0），则返回1，否则返回0。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> or(<span style="color: #666666">1=1</span>,<span style="color: #666666">2=2</span>)
<span style="color: #666666">1</span></pre></div>

## `outer(a,b,...)`: 向量、矩阵或张量的外积（张量积）

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> (a,b,c)
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> (x,y,z)
<span style="color: #666666">&gt;</span> outer(A,B)
<span style="#FF0000">┌</span>                 <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> a x   a y   a z <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                 <span style="#FF0000">│</span>
<span style="#FF0000">│</span> b x   b y   b z <span style="#FF0000">│</span>
<span style="#FF0000">│</span>                 <span style="#FF0000">│</span>
<span style="#FF0000">│</span> c x   c y   c z <span style="#FF0000">│</span>
<span style="#FF0000">└</span>                 <span style="#FF0000">┘</span></pre></div>

## `pi`: 符号π

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> exp(i pi)
<span style="color: #666666">-1</span></pre></div>

## `polar(z)`: 复数`z`的极坐标形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> polar(x <span style="color: #666666">-</span> i y)
<span style="#FF0000">┌</span>       <span style="#FF0000">┐</span><span style="color: #666666">1/2</span>
<span style="#FF0000">│</span> <span style="color: #666666">2</span>    <span style="color: #666666">2</span><span style="#FF0000">│</span>
<span style="#FF0000">│</span>x  <span style="color: #666666">+</span> y <span style="#FF0000">│</span>    exp(i arctan(<span style="color: #666666">-</span>y,x))
<span style="#FF0000">│</span>       <span style="#FF0000">│</span>
<span style="#FF0000">└</span>       <span style="#FF0000">┘</span></pre></div>

## `power`: 使用`^`求幂

指数为负值时需要加括号.

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> x<span style="color: #666666">^</span>(<span style="color: #666666">-1/2</span>)
  <span style="color: #666666">1</span>
<span style="color: #666666">------</span>
  <span style="color: #666666">1/2</span>
 x</pre></div>

## `prime(n)`: 第n个质数

注意，`n`应介于1和10000之间。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> prime(<span style="color: #666666">100</span>)
<span style="color: #666666">541</span></pre></div>

## `print(a,b,...)`: 计算表达式并输出结果

通常与`for`函数配合使用, 用于在循环内部输出结果。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> <span style="color: #AA22FF; font-weight: bold">for</span>(j,<span style="color: #666666">1</span>,<span style="color: #666666">3</span>,print(j))
j <span style="color: #666666">=</span> <span style="color: #666666">1</span>
j <span style="color: #666666">=</span> <span style="color: #666666">2</span>
j <span style="color: #666666">=</span> <span style="color: #666666">3</span></pre></div>

## `product(i,j,k,f)`: 连乘积

令`i`取值从`j`到`k`，分别计算`f`，并将它们的值累乘作为结果.

下面的例子等价于计算$(x+1)(x+2)(x+3)$的展开式。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> product(j,<span style="color: #666666">1</span>,<span style="color: #666666">3</span>,x <span style="color: #666666">+</span> j)
 <span style="color: #666666">3</span>      <span style="color: #666666">2</span>
x  <span style="color: #666666">+</span> <span style="color: #666666">6</span> x  <span style="color: #666666">+</span> <span style="color: #666666">11</span> x <span style="color: #666666">+</span> <span style="color: #666666">6</span></pre></div>

注意，`i`在函数计算结束后会恢复。如果使用`i`作为变量，则`product`函数内表达式中的复数单位`i`会被覆盖。

## `product(y)`: `y`分量的连乘积.

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> product((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>,<span style="color: #666666">3</span>,<span style="color: #666666">4</span>))
<span style="color: #666666">24</span></pre></div>

## `quote(x)`: 表达式`x`，而不先计算其值

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> quote((x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)<span style="color: #666666">^2</span>)
       <span style="color: #666666">2</span>
(x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)

<span style="color: #666666">&gt;</span> x<span style="color: #666666">=2</span>
<span style="color: #666666">&gt;</span> quote((x<span style="color: #666666">+1</span>)<span style="color: #666666">^2</span>)
       <span style="color: #666666">2</span>
(x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)
<span style="color: #666666">&gt;</span> t<span style="color: #666666">=</span>last
<span style="color: #666666">&gt;</span> t
t <span style="color: #666666">=</span> <span style="color: #666666">9</span></pre></div>

## `quotient(p,q,x)`: `p(x)`对`q(x)`的商

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> p <span style="color: #666666">=</span> x<span style="color: #666666">^2</span> <span style="color: #666666">+</span> <span style="color: #666666">1</span>
<span style="color: #666666">&gt;</span> q <span style="color: #666666">=</span> x <span style="color: #666666">+</span> <span style="color: #666666">3</span>
<span style="color: #666666">&gt;</span> quotient(p,q,x)
x <span style="color: #666666">-</span> <span style="color: #666666">3</span></pre></div>

## `rank(a)`: 矩阵或张量`a`的秩

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> rank(A)
<span style="color: #666666">2</span></pre></div>

## `rationalize(x)`: 通分

计算表达式`x`，并使其只有一个分母（即结果只含有一个分式）

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> rationalize(<span style="color: #666666">1/</span>a <span style="color: #666666">+</span> <span style="color: #666666">1/</span>b <span style="color: #666666">+</span> <span style="color: #666666">1/2</span>)
 <span style="color: #666666">2</span> a <span style="color: #666666">+</span> a b <span style="color: #666666">+</span> <span style="color: #666666">2</span> b
<span style="color: #666666">-----------------</span>
      <span style="color: #666666">2</span> a b</pre></div>

注意，`rationalize`函数返回未展开的表达式。如果将结果赋值给一个符号变量，对其求值会展开表达式。可以使用`binding`函数保持未展开的表达式。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> f <span style="color: #666666">=</span> rationalize(<span style="color: #666666">1/</span>a <span style="color: #666666">+</span> <span style="color: #666666">1/</span>b <span style="color: #666666">+</span> <span style="color: #666666">1/2</span>)
<span style="color: #666666">&gt;</span> binding(f)
 <span style="color: #666666">2</span> a <span style="color: #666666">+</span> a b <span style="color: #666666">+</span> <span style="color: #666666">2</span> b
<span style="color: #666666">-----------------</span>
      <span style="color: #666666">2</span> a b</pre></div>

## `real(z)`: 复数`z`的实部

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> real(<span style="color: #666666">2</span> <span style="color: #666666">-</span> <span style="color: #666666">3</span>i)
<span style="color: #666666">2</span></pre></div>

## `rect(z)`: 复数`z`的三角函数形式

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> rect(exp(i x))
cos(x) <span style="color: #666666">+</span> i sin(x)</pre></div>

## `roots(p,x)`: 多项式`p(x)`的根

该多项式应当能够因式分解。返回的向量中包含了每个根。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> roots(x<span style="color: #666666">^2</span> <span style="color: #666666">+</span> <span style="color: #666666">3</span>x <span style="color: #666666">+</span> <span style="color: #666666">2</span>,x)
<span style="#FF0000">┌</span>    <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> <span style="color: #666666">-2</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>    <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">-1</span> <span style="#FF0000">│</span>
<span style="#FF0000">└</span>    <span style="#FF0000">┘</span></pre></div>

## `rotate(u,s,k,...)`: 旋转向量`u`

向量`u`必须具有2n个元素, 其中n为整数, 取值范围为1到15. 参数`s,k,...`为旋转代码的一个序列, 其中`s`为大写字母, `k`为4位的数, 从0到n-1. 旋转从左到右进行求值. 可以使用的旋转为:

- `C, k`: 控制前缀 prefix
- `H, k`: Hadamard
- `P, k, φ`: 修改相位(φ = 1/4 π 用于 T 旋转)
- `Q, k`: 量子傅里叶变换Quantum Fourier transform
- `V, k`: 逆 量子傅里叶变换QuantumInverse quantum Fourier transform
- `W, k, j`: 交换位 Swap qubits
- `X, k`: 泡利 X
- `Y, k`: 泡利 Y
- `Z, k`: 泡利 Z

控制前缀`C, k`修改下一个旋转代码, 以便使其成为一个使用k作为控制位的控制旋转. 使用两个会更多前缀来指定多个控制位. 例如, `C, k, C, j, X, m`为Toffoli旋转. 傅里叶旋转`Q, k`和`V, k`用于从0到k的量子位.(`Q`和`V`忽略所有控制前缀). 另见手册的第三节.

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> psi <span style="color: #666666">=</span> (<span style="color: #666666">1</span>,<span style="color: #666666">0</span>,<span style="color: #666666">0</span>,<span style="color: #666666">0</span>)
<span style="color: #666666">&gt;</span> rotate(psi,H,<span style="color: #666666">0</span>)
<span style="#FF0000">┌</span>        <span style="#FF0000">┐</span>
<span style="#FF0000">│</span>   <span style="color: #666666">1</span>    <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">------</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>   <span style="color: #666666">1/2</span>  <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  <span style="color: #666666">2</span>     <span style="#FF0000">│</span>
<span style="#FF0000">│</span>        <span style="#FF0000">│</span>
<span style="#FF0000">│</span>   <span style="color: #666666">1</span>    <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">------</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>   <span style="color: #666666">1/2</span>  <span style="#FF0000">│</span>
<span style="#FF0000">│</span>  <span style="color: #666666">2</span>     <span style="#FF0000">│</span>
<span style="#FF0000">│</span>        <span style="#FF0000">│</span>
<span style="#FF0000">│</span>   <span style="color: #666666">0</span>    <span style="#FF0000">│</span>
<span style="#FF0000">│</span>        <span style="#FF0000">│</span>
<span style="#FF0000">│</span>   <span style="color: #666666">0</span>    <span style="#FF0000">│</span>
<span style="#FF0000">└</span>        <span style="#FF0000">┘</span></pre></div>

## `run(file)`: 执行脚本`file`

`file`应为脚本的绝对路径或相对当前可执行文件位置的路径。在批量加载一些自定义函数时很有用，或可以实现脚本的嵌套调用。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> run(<span style="color: #BB4444">&quot;Downloads/EVA.txt&quot;</span>)</pre></div>

## `simplify(x)`: 化简表达式`x`

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> simplify(sin(x)<span style="color: #666666">^2</span> <span style="color: #666666">+</span> cos(x)<span style="color: #666666">^2</span>)
<span style="color: #666666">1</span></pre></div>

## `sin(x)`: `x`的正弦函数值

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> sin(pi<span style="color: #666666">/4</span>)
  <span style="color: #666666">1</span>
<span style="color: #666666">------</span>
  <span style="color: #666666">1/2</span>
 <span style="color: #666666">2</span></pre></div>

## `sinh(x)`: `x`的双曲正弦函数值

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> circexp(sinh(x))
  <span style="color: #666666">1</span>             <span style="color: #666666">1</span>
<span style="color: #666666">----</span> exp(<span style="color: #666666">-</span>x) <span style="color: #666666">+</span> <span style="color: #666666">---</span> exp(x)
  <span style="color: #666666">2</span>             <span style="color: #666666">2</span></pre></div>

## `sqrt(x)`: `x`的平方根

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> sqrt(<span style="color: #666666">10!</span>)
     <span style="color: #666666">1/2</span>
<span style="color: #666666">720</span> <span style="color: #666666">7</span></pre></div>

## `status`: 当前的内存使用情况

## `stop`: 终止运行当前脚本

## (新版本中不可用) `string(x)`: 计算`x`表达式并返回字符串

在测试脚本时很有用。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> string((x <span style="color: #666666">+</span> <span style="color: #666666">1</span>)<span style="color: #666666">^2</span>) <span style="color: #666666">==</span> <span style="color: #BB4444">&quot;x^2 + 2 x + 1&quot;</span>
<span style="color: #666666">1</span></pre></div>

## `subst(a,b,c)`: 将`c`中的`b`替换为a

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> subst(x,y,y<span style="color: #666666">^2</span>)
 <span style="color: #666666">2</span>
x</pre></div>

## `sum(i,j,k,f)`: 连加和

令`i`取值从`j`到`k`, 分别计算`f`，并返回各个结果的连加和。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> sum(j,<span style="color: #666666">1</span>,<span style="color: #666666">5</span>,x<span style="color: #666666">^</span>j)
 <span style="color: #666666">5</span>    <span style="color: #666666">4</span>    <span style="color: #666666">3</span>    <span style="color: #666666">2</span>
x  <span style="color: #666666">+</span> x  <span style="color: #666666">+</span> x  <span style="color: #666666">+</span> x  <span style="color: #666666">+</span> x</pre></div>

注意，`sum`函数计算结束后，`i`的值会还原。如果使用`i`作为变量，则`sum`函数内的复数单位`i`会被覆盖。

## `sum(y)`: `y`各分量的连加和

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> sum((<span style="color: #666666">1</span>,<span style="color: #666666">2</span>,<span style="color: #666666">3</span>,<span style="color: #666666">4</span>))
<span style="color: #666666">10</span></pre></div>

## `tan(x)`: `x`的正切值

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> simplify(tan(x) <span style="color: #666666">-</span> sin(x)<span style="color: #666666">/</span>cos(x))
<span style="color: #666666">0</span></pre></div>

## `tanh(x)`: `x`的双曲正切值

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> circexp(tanh(x))
       <span style="color: #666666">1</span>             exp(<span style="color: #666666">2</span> x)
<span style="color: #666666">---------------</span> <span style="color: #666666">+</span> <span style="color: #666666">--------------</span>
  exp(<span style="color: #666666">2</span> x) <span style="color: #666666">+</span> <span style="color: #666666">1</span>     exp(<span style="color: #666666">2</span> x) <span style="color: #666666">+</span> <span style="color: #666666">1</span></pre></div>

## `taylor(f,x,n,a)`: `x`趋于`a`时, `f(x)`的`n`阶Taylor展开

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> taylor(sin(x),x,<span style="color: #666666">5</span>,<span style="color: #666666">0</span>)
  <span style="color: #666666">1</span>    <span style="color: #666666">5</span>    <span style="color: #666666">1</span>   <span style="color: #666666">3</span>
<span style="color: #666666">-----</span> x  <span style="color: #666666">-</span> <span style="color: #666666">---</span> x  <span style="color: #666666">+</span> x
 <span style="color: #666666">120</span>        <span style="color: #666666">6</span></pre></div>

## `test(a,b,c,d,...)`: 连续测试

如果表达式`a`为真（非零），则返回`b`，否则如果表达式`c`为真，则返回d，依次类推。

如果参数的个数为奇数，则当所有被测试表达式均为假时，返回最后一个表达式。表达式可以包含`=`、`==`、`<`、`<=`、`>`、`>=`。可以使用`not`函数测试非等价性。(在`=`为赋值算符的情况下, 可以使用等价算符`==`)

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> <span style="color: #666666">1</span>
<span style="color: #666666">&gt;</span> B <span style="color: #666666">=</span> <span style="color: #666666">1</span>
<span style="color: #666666">&gt;</span> test(A<span style="color: #666666">=</span>B,<span style="color: #BB4444">&quot;yes&quot;</span>,<span style="color: #BB4444">&quot;no&quot;</span>)
yes</pre></div>

## `trace`: 追踪计算过程

设置`trace=1`时，脚本会输出计算过程。有助于调试。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> trace <span style="color: #666666">=</span> <span style="color: #666666">1</span></pre></div>

注意，使用`contract`函数计算矩阵的迹。

## `transpose(a,i,j)`: 转置

张量`a`对指标`i`、`j`的转置。

如果未指定`i`和`j`，则默认为1和2，因此可以只使用一个参数对矩阵进行转置。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> ((a,b),(c,d))
<span style="color: #666666">&gt;</span> transpose(A)
<span style="#FF0000">┌</span>       <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> a   c <span style="#FF0000">│</span>
<span style="#FF0000">│</span>       <span style="#FF0000">│</span>
<span style="#FF0000">│</span> b   d <span style="#FF0000">│</span>
<span style="#FF0000">└</span>       <span style="#FF0000">┘</span></pre></div>

注意，参数可以扩展以实现多个转置操作。参数从左到右依次计算。例如，`transpose(A,1,2,2,3)`等价于`transpose(transpose(A,1,2),2,3)`。

## `tty`: 文本终端

设置`tty=1`时，结果将以普通文本形式输出。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> tty <span style="color: #666666">=</span> <span style="color: #666666">1</span>
<span style="color: #666666">&gt;</span> (x <span style="color: #666666">+</span> <span style="color: #666666">1/2</span>)<span style="color: #666666">^2</span>
x<span style="color: #666666">^2</span> <span style="color: #666666">+</span> x <span style="color: #666666">+</span> <span style="color: #666666">1/4</span></pre></div>

## `unit(n)`: `n`阶单位矩阵

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> unit(<span style="color: #666666">3</span>)
<span style="#FF0000">┌</span>           <span style="#FF0000">┐</span>
<span style="#FF0000">│</span> <span style="color: #666666">1</span>   <span style="color: #666666">0</span>   <span style="color: #666666">0</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>           <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">0</span>   <span style="color: #666666">1</span>   <span style="color: #666666">0</span> <span style="#FF0000">│</span>
<span style="#FF0000">│</span>           <span style="#FF0000">│</span>
<span style="#FF0000">│</span> <span style="color: #666666">0</span>   <span style="color: #666666">0</span>   <span style="color: #666666">1</span> <span style="#FF0000">│</span>
<span style="#FF0000">└</span>           <span style="#FF0000">┘</span></pre></div>

## `zero(i,j,...)`: 零张量

给定维数`i`, `j`等的空张量。在创建张量并给每个元素赋值时会很有用。

<div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #666666">&gt;</span> A <span style="color: #666666">=</span> zero(<span style="color: #666666">3</span>,<span style="color: #666666">3</span>)
<span style="color: #666666">&gt;</span> <span style="color: #AA22FF; font-weight: bold">for</span>(k,<span style="color: #666666">1</span>,<span style="color: #666666">3</span>,A[k,k]<span style="color: #666666">=</span>k)
<span style="color: #666666">&gt;</span> A
    <span style="#FF0000">┌</span>           <span style="#FF0000">┐</span>
    <span style="#FF0000">│</span> <span style="color: #666666">1</span>   <span style="color: #666666">0</span>   <span style="color: #666666">0</span> <span style="#FF0000">│</span>
    <span style="#FF0000">│</span>           <span style="#FF0000">│</span>
A <span style="color: #666666">=</span> <span style="#FF0000">│</span> <span style="color: #666666">0</span>   <span style="color: #666666">2</span>   <span style="color: #666666">0</span> <span style="#FF0000">│</span>
    <span style="#FF0000">│</span>           <span style="#FF0000">│</span>
    <span style="#FF0000">│</span> <span style="color: #666666">0</span>   <span style="color: #666666">0</span>   <span style="color: #666666">3</span> <span style="#FF0000">│</span>
    <span style="#FF0000">└</span>           <span style="#FF0000">┘</span></pre></div>
