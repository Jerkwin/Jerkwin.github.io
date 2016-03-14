---
 layout: post
 title: GROMACS分析教程：使用g_select计算平均滞留时间
 categories:
 - 科
 tags:
 - GMX
 chem: true
---

- 2016-03-11 21:18:39 初稿

### 理论考虑

分子动力学模拟的分析是动力学的精髓部分, 要依据模拟的假设和目的去分析所得到的数据, 看是否支持自己的假设, 进而得到更多的洞察. 没有假设和目的就去盲目地做模拟, 是不可取的. 由于各人所作体系不同, 对于分析没有通用的套路, 你需要多参考文献才好.

虽然GROMACS自带了很多分析工具, 可能仍不能满足你的需要, 这时候就需要你自己写代码对轨迹进行分析了. 对此, 我的建议如下:

1. 如果可能, 请尽量使用GROMACS自带的工具完成分析过程, 必要时可以组合多个分析工具达到目的. 虽然这种做法处理时间可能稍长, 但无须写代码, 适合普通用户使用. 但这种做法需要你对GROMACS自带的工具有比较详尽的了解, 知晓各个工具的功能, 并能根据自己的目的进行恰当地组合.
2. 即便需要自己写代码分析轨迹, 仍然建议先利用GROMACS自带的工具对轨迹进行初步处理, 如利用`gmx trjconv`转换轨迹格式, 处理居中, PBC问题; 利用`gmx select`获取特定原子的索引; 利用`gmx trjconv`或`gmx traj`抽取特定索引原子的信息等. 因为无论做哪种分析, 都要牵涉到这些问题的处理, 而自己写代码实现这些功能虽然不是很可能, 但相当麻烦, 而且执行效率也没有使用GROMACS自带工具高. 这样得到需要的原子坐标后, 我们就可以把注意力集中到自己需要分析方面, 节省了时间和精力.
3. 如果为了提高处理轨迹的效率或其他原因, 你不得不自行处理轨迹, 建议你使用`xtc`格式. 这种压缩格式只包含坐标, 文件小, 当只需要分析坐标时, 使用它可大大提高效率. 但如果你同时需要坐标和速度甚至受力, 那你就只能使用`trr`格式了.
4. 具体如何使用C, Fortran或MatLab来处理`xtc`或`trr`格式的轨迹, 请参考博文.
5. 如果熟悉, VMD的tcl脚本也可用于分析轨迹, 缺点是速度慢, 且对文件大小有限制.

### 具体示例

下面我们模拟TIP3P水中的一个甲烷CH4分子, 以计算CH4第一溶剂化层中水分子的平均滞留时间为例, 来对分析过程进行具体地说明.

下载[示例文件](/Prog/CH4W_sel.zip), 解压后得4个文件, `conf.gro`, `grompp.mdp`, `index.ndx`, `topol.top`. 值得注意的是, `index.ndx`文件使用`gmx make_ndx`添加了每种原子的索引号, 这是为了便于后面的分析.

体系中包含一个CH4分子(OPLS-AA力场)和241个TIP3P水分子

下面我们来运行模拟

	grompp -maxwarn 2
	mdrun

作为示例, 我们只运行了20 ps, 得到了轨迹文件`traj.xtc`.

要计算CH4分子第一溶剂化层中水分子的平均滞留时间, 我们首先需要知道第一溶剂化层的厚度, 为此, 我们可以计算CH4分子和水分子二者质心之间的径向分布函数RDF

	g_rdf -f -n -rdf mol_com
	> 2 3

得到如下图形

<figure><img src="/pic/CH4Wsel-1.png" alt="Fig. 1" /><figcaption>Fig. 1</figcaption></figure>

可以看到, 由于模拟时间较短, 得到的RDF并不是十分光滑(延长模拟时间就可以得到更漂亮的图形), 但我们仍然可以看出第一溶剂化层的厚度大约是0.5 nm. 也就是说, 我们在计算平均滞留时间时, 只考虑其质心处于CH4质心0.5 nm 范围内的水分子.

我们使用`g_select`工具来获取每个水分子的是否处于CH4第一溶剂化层中的信息.

	g_select -f -n -os -oc -oi -om -on selFrm.ndx -selrpos mol_com
	>"1st shell" resname SOL and name OW and within 0.5 of resname CH4

在上面的命令中我们为`-on`选项指定了输出文件, 以防止默认的输出文件`index.ndx`与前面我们使用的`index.ndx`文件冲突. 有关`g_select`的使用说明请参考[其说明文档](http://jerkwin.github.io/GMX/GMXprg#gmx-select--)和[GROMACS选区(selection)语法及用法](http://jerkwin.github.io/GMX/GMXsel/).

我们得到如下文件

- `size.xvg`:  每一时刻第一溶剂化层中原子的个数
- `cfrac.xvg`: 每一时刻第一溶剂化层中原子的覆盖比例
- `index.dat`: 每一时刻第一溶剂化层中原子的个数及其编号
- `mask.dat`:  每一时刻分子是否处于第一溶剂化层中的掩码, `0`: 不处于, `1`:处于
- `selFrm.ndx`: 每一时刻第一溶剂化层中原子的索引组

请打开这些文件进行查看, 了解其含义.

我们只要对`mask.dat`进行分析处理就可以计算平均滞留时间了. 这可以使用下面的bash脚本完成

<div style="overflow:auto">
<table class="highlighttable"><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #B8860B">file</span><span style="color: #666666">=</span>mask.dat
<span style="color: #B8860B">ftrs</span><span style="color: #666666">=</span><span style="color: #BB6688; font-weight: bold">${</span><span style="color: #B8860B">file</span>%.*<span style="color: #BB6688; font-weight: bold">}</span>_trs.dat
<span style="color: #B8860B">ffrq</span><span style="color: #666666">=</span><span style="color: #BB6688; font-weight: bold">${</span><span style="color: #B8860B">file</span>%.*<span style="color: #BB6688; font-weight: bold">}</span>_frq.dat

awk <span style="color: #BB4444">&#39; BEGIN {</span>
<span style="color: #BB4444">	getline</span>
<span style="color: #BB4444">	while($1==&quot;#&quot;) getline</span>
<span style="color: #BB4444">	Ncol=NF</span>
<span style="color: #BB4444">	close(FILENAME)</span>

<span style="color: #BB4444">	for(i=2; i&lt;=Ncol; i++) {</span>
<span style="color: #BB4444">		while(getline&lt;FILENAME) if(NF==Ncol) printf &quot;%s&quot;, $i</span>
<span style="color: #BB4444">		print &quot;&quot;</span>
<span style="color: #BB4444">		close(FILENAME)</span>
<span style="color: #BB4444">	}</span>
<span style="color: #BB4444">}&#39;</span> <span style="color: #B8860B">$f</span>ile &gt; <span style="color: #B8860B">$f</span>trs

awk -v <span style="color: #B8860B">file</span><span style="color: #666666">=</span><span style="color: #B8860B">$f</span>ile <span style="color: #BB4444">&#39;</span>
<span style="color: #BB4444">BEGIN{ Navg=0; Tavg=0</span>
<span style="color: #BB4444">	getline &lt;file</span>
<span style="color: #BB4444">	while($1==&quot;#&quot;) getline &lt;file; dt=$1</span>
<span style="color: #BB4444">	getline &lt;file; dt=$1-dt</span>
<span style="color: #BB4444">	close(file)</span>
<span style="color: #BB4444">}</span>

<span style="color: #BB4444">{	gsub(/0+/, &quot; &quot;)</span>
<span style="color: #BB4444">	Ntxt=split($0, txt)</span>
<span style="color: #BB4444">	for(i=1; i&lt;=Ntxt; i++) {</span>
<span style="color: #BB4444">		T=length(txt[i])</span>
<span style="color: #BB4444">		print T</span>
<span style="color: #BB4444">		Navg++; Tavg += T</span>
<span style="color: #BB4444">	}</span>
<span style="color: #BB4444">}</span>
<span style="color: #BB4444">END{ print &quot;# Avaraged Residence Time(ps)=&quot;, Tavg*dt/Navg}</span>
<span style="color: #BB4444">&#39;</span> <span style="color: #B8860B">$f</span>trs &gt;<span style="color: #B8860B">$ff</span>rq
</pre></div>
</td></tr></table>
</div>

得到的平均滞留时间为0.807243 ps. 当然, 实际情况中你需要运行更长的模拟来确认得到的数据是否收敛. 水分子滞留时间的分布图如下

<figure><img src="/pic/CH4Wsel-2.png" alt="Fig. 2" /><figcaption>Fig. 2</figcaption></figure>

对更大的体系, 更长的模拟时间, 上面的简单脚本可能执行时间很长. 这主要是因为在第一步中对`mask.dat`进行行列互换时, 如果文件太大就要花费很长的时间. 一种更高效些的方法是使用中间文件, 方法如下

<div style="overflow:auto">
<table class="highlighttable"><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">awk -v <span style="color: #B8860B">ftrs</span><span style="color: #666666">=</span><span style="color: #B8860B">$f</span>trs <span style="color: #BB4444">&#39; BEGIN{ Nmax=2000; N=0</span>
<span style="color: #BB4444">	system(&quot;rm -rf _row-* &quot; ftrs &quot; &amp;&amp; cat &lt;&gt; &quot; ftrs)</span>
<span style="color: #BB4444">}</span>
<span style="color: #BB4444">$1!=&quot;#&quot; {</span>
<span style="color: #BB4444">	N++</span>
<span style="color: #BB4444">	Frow=&quot;_row-&quot;sprintf(&quot;%04d&quot;,N)</span>
<span style="color: #BB4444">	$1=&quot;&quot;; sub(/^\s*/, &quot;&quot;); gsub(&quot; &quot;, &quot;\n&quot;, $0)</span>
<span style="color: #BB4444">	print $0 &gt;Frow</span>
<span style="color: #BB4444">	close(Frow)</span>
<span style="color: #BB4444">	if(N&gt;Nmax) {</span>
<span style="color: #BB4444">		N=0</span>
<span style="color: #BB4444">		system(&quot;ls _row-* | sort | xargs paste -d \047\047 &quot;ftrs&quot; &gt;_trsRow&quot;)</span>
<span style="color: #BB4444">		system(&quot;rm -rf _row-* &amp;&amp; mv _trsRow &quot;ftrs)</span>
<span style="color: #BB4444">	}</span>
<span style="color: #BB4444">}</span>
<span style="color: #BB4444">END{</span>
<span style="color: #BB4444">	system(&quot;ls _row-* | sort | xargs paste -d \047\047 &quot;ftrs&quot; &gt;_trsRow&quot;)</span>
<span style="color: #BB4444">	system(&quot;rm -rf _row-* &amp;&amp; mv _trsRow &quot;ftrs)</span>
<span style="color: #BB4444">}</span>
<span style="color: #BB4444">&#39;</span> <span style="color: #B8860B">$f</span>ile
</pre></div>
</td></tr></table>
</div>

更高效的方法, 就只能换用其他编译型语言或MatLab等软件了.

我们可以利用`trjconv`程序并借助`selFrm.ndx`文件获取每一时刻所选原子的坐标, 只需要根据对每一帧指定不同的索引组即可. 获取前100帧的示例代码如下

<div style="overflow:auto">
<table class="highlighttable"><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #B8860B">file</span><span style="color: #666666">=</span>selFrm.gro
<span style="color: #AA22FF">echo</span> -n <span style="color: #BB4444">&quot;&quot;</span>&gt; <span style="color: #B8860B">$f</span>ile

<span style="color: #B8860B">dt</span><span style="color: #666666">=</span>0.002
<span style="color: #AA22FF; font-weight: bold">for</span> i in <span style="color: #666666">{</span>0..100<span style="color: #666666">}</span>; <span style="color: #AA22FF; font-weight: bold">do</span> 
	<span style="color: #B8860B">t</span><span style="color: #666666">=</span><span style="color: #AA22FF; font-weight: bold">$(</span><span style="color: #AA22FF">echo</span> <span style="color: #BB4444">&quot;</span><span style="color: #B8860B">$d</span><span style="color: #BB4444">t*</span>$<span style="color: #BB4444">i&quot;</span> | bc<span style="color: #AA22FF; font-weight: bold">)</span>
	<span style="color: #AA22FF">echo</span> $i | trjconv -f -n selFrm.ndx -dump $t -o _tmp.gro 2&gt;/dev/null
	cat _tmp.gro &gt;&gt;<span style="color: #B8860B">$f</span>ile
	rm -rf _tmp.gro
<span style="color: #AA22FF; font-weight: bold">done</span>
</pre></div>
</td></tr></table>
</div>

当然这种每次处理一帧的方法运行起来很慢, 但可惜的是GROMACS的分析工具中并没有提供解决方案, 如果需要更快地抽取出构型, 那就只能自己写代码了. 此外, 这样直接得到的构型由于PBC的原因可能看起来不连续, 为此, 你可能需要先使用`trjconv`对轨迹进行居中, PBC处理, 然后再使用上面的方法获取坐标.

### 网络资料

1. [如何计算平均滞留时间(residence time)](http://www.bbioo.com/experiment/105-178917-1.html)
2. [trajectory output from g_select?](http://gromacs.org_gmx-users.maillist.sys.kth.narkive.com/RVu1pmCv/trajectory-output-from-g-select)
3. [gmx dipoles with dynamic indices (gromacs 5.0.x)](http://comments.gmane.org/gmane.science.biology.gromacs.user/79827)
4. [extract coordinates of selected atoms](http://gromacs.org_gmx-users.maillist.sys.kth.narkive.com/DGgASJD6/extract-coordinates-of-selected-atoms)
5. [Windows Cmd终端Ctrl D不起作用的解决方法](http://blog.csdn.net/newborn2012/article/details/19416641)
6. [Equivalent to ^D (in bash) for cmd.exe?](http://superuser.com/questions/291224/equivalent-to-d-in-bash-for-cmd-exe)
