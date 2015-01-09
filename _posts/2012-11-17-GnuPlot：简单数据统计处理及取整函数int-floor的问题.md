---
 layout: post
 title: GnuPlot：简单数据统计处理及取整函数int/floor的问题
 categories: 
 - 科
 tags:
 - gnuplot
---

## 2012-11-17 09:27:14 初稿

## 2013-08-02 14:08:45 修订

最近需要利用GnuPlot对数据进行简单的统计处理, 就查阅了一些相关资料, 在此简单总结一下我所用到的方法. 

本质上说, GnuPlot只是个画图软件, 画图功能是其强项, 而计算、统计本不属于它的功能, 但是利用GnuPlot的函数及脚本功能, 我们还是可以变通地利用它进行一些计算及统计处理, 这些都属于tricks, 若感兴趣, 请参看此处的[总结](http://www.phyast.pitt.edu/~zov1/gnuplot/html/intro.html), 取其所需. 

上面所引网页对数据的统计处理是利用GnuPlot的内置变量, 略显罗嗦, 不太合我的胃口. 我喜欢利用自定义函数来处理, 方式如下：

* 数据的最值：定义两个变量min和max, 再定义一个函数minmax

	<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
	min=1E38; max=-1E38;
	minmax(x)=(x<min)?min=x:(x>max)?max=x:0
	plot "file" u 1:(minmax($1)); print min, max
	</code></pre>

* 数据的均值, 标准差：定义变量avg和函数mean

	<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
	mean(x)=avg
	fit mean(x) "file" u 1:1 via avg
	</code></pre>
	根据fit的输出直接就可以得到平均值avg和标准差.

当然, 如果你只是做一次两次, 像我这么做并没有什么优势, 但是如果你要经常使用, 那最好还是把这些函数添加到GnuPlot的脚本中, 这样就可以直接使用了, 就像那些内置函数一样. 

如何利用GnuPlot做统计直方图（Histogram）, 这是经常有人问的问题. 对此, [官方有答案](http://www.gnuplot.info/demo/smooth.html), [stackoverflow有答案](http://stackoverflow.com/questions/2471884/histogram-using-gnuplot), [马欢也简单说过](http://blog.sciencenet.cn/blog-373392-529904.html). 实现方法很简单, 定义一个binning函数, `bin(x,w)=w*int(x/w)`或`bin(x,w)=w*floor(x/w)`（若希望画图时数据处于区间中心, 可使用`bin(x,w)=w*(int(x/w)+0.5)`或`bin(x,w)=w*(floor(x/w)+0.5)`）, w为bin间隔大小. 此函数可以把数据映射到相应的区间, 再利用GnuPlot的smooth功能进行频数统计, 画出来即可. 具体来说就是

* 概率密度：`plot "DataFile" u (bin($1,w)):(1./Ndat/w) s f`
* 累积分布：`plot "DataFile" u 1:(1./Ndat) s cum`

Ndat为数据个数, w为bin的宽度, 1./Ndat/w用于归一化. 

有时, 我们已经有了某个分布的概率密度数据, 但为了作图平滑, 我们希望改变bin的宽度, 这种情况下Ndat是不变的, 改变的只是w, 可使用

* 改变bin宽度：`plot "DataFile" u (bin($1,w)):($2*w0/w) s f`

w0为原先的bin宽度, w为新的宽度. 

本来是很简单的事情, 但我使用时却发现了问题, 统计出来的频数有时候不正常. 究其原因, 在于int和floor这两个内置的取整函数在某些情况下给出的结果和精确结果差1. 如int(0.0003/0.0001)=floor(0.0003/0.0001)=2. 在数据量很大的情况下, 这点差距影响并不大, 但在数据量比较小的情况下, 很可能对结果产生较大影响. 我进而测试了awk和perl的int函数, 给出了同样的结果. 这使我认识到这个问题有其内在原因. 查一下, 果然, 请看[这里](http://stackoverflow.com/questions/10908825/perl-int-function-and-padding-zeros). 原来是因为计算机存储数据时对某些数据并不能精确存储, 如计算0.0003/0.0001, 得到的结果并不是精确的3, 很可能是2.99999999999999955591, 这样用int或floor取整后就变成2了. 

既然知道了原因, 那解决也很简单, 有人提到[定义一个递归bin函数来解决](http://stackoverflow.com/questions/2471884/histogram-using-gnuplot), 我觉得过于麻烦, 计算也慢, 我们直接改造int函数就可以了. 重新定义一个rint函数, `rint(x)=(x-int(x)>0.9999)?int(x)+1:int(x)`, 利用这个函数进行取整就没问题了. 


**修订补充**

对新版本的GnuPlot, 可以直接使用stat命令得到数据的统计信息.

上面定义的rint函数使用时对负数有问题, 更好的解决方法是利用nint函数, GnuPlot没有内置这个函数, 可利用floor和ceil函数的组合来定义

`nint(x)=(x>0.)?floor(x+0.5):ceil(x-0.5)`

`bin(x,s)=s*nint(x/s)`

使用这个bin函数就不会有问题了.
