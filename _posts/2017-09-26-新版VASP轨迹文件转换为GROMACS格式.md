---
 layout: post
 title: 新版VASP轨迹文件转换为GROMACS格式
 categories:
 - 科
 tags:
 - gmx
 - vasp
---

- 2017-09-26 15:47:47

vasp轨迹文件的格式经常变动, 这样导致和vmd的插件不兼容, 查看的时候只能显示一帧. 我最近使用的vasp 5.4.4输出的轨迹文件XDATCAR就存在这个问题. 为了解决这个问题, 我写了一个简单的脚本, 将XDATCAR转换为gromacs格式以便使用vmd查看. 简单来说, gromacs的gro格式是一种类似于xyz的格式, 但其中的坐标以nm为单位, 同时最后一行添加盒子矢量的信息.

<table class="highlighttable"><th colspan="2" style="text-align:left">x2gro.bsh</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
32</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span></span><span style="color: #B8860B">File</span><span style="color: #666666">=</span>XDATCAR
awk <span style="color: #BB4444">&#39;</span> BEGIN <span style="color: #666666">{</span> <span style="color: #B8860B">Rad2Deg</span><span style="color: #666666">=</span>180/4*atan2<span style="color: #666666">(</span>1,1<span style="color: #666666">)</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span>	<span style="color: #B8860B">Tips</span><span style="color: #666666">=</span><span style="color: #B8860B">$0</span>
		getline; <span style="color: #B8860B">a</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>/10; <span style="color: #B8860B">b</span><span style="color: #666666">=</span>a; <span style="color: #B8860B">c</span><span style="color: #666666">=</span>a;
		<span style="color: #AA22FF; font-weight: bold">if</span><span style="color: #666666">(</span>NF&gt;<span style="color: #666666">=</span>2<span style="color: #666666">)</span> <span style="color: #B8860B">b</span><span style="color: #666666">=</span><span style="color: #B8860B">$2</span>/10; <span style="color: #AA22FF; font-weight: bold">if</span><span style="color: #666666">(</span>NF&gt;<span style="color: #666666">=</span>3<span style="color: #666666">)</span> <span style="color: #B8860B">c</span><span style="color: #666666">=</span><span style="color: #B8860B">$3</span>/10
		getline; <span style="color: #B8860B">ax</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>*a; <span style="color: #B8860B">ay</span><span style="color: #666666">=</span><span style="color: #B8860B">$2</span>*b; <span style="color: #B8860B">az</span><span style="color: #666666">=</span><span style="color: #B8860B">$3</span>*c
		getline; <span style="color: #B8860B">bx</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>*a; <span style="color: #B8860B">by</span><span style="color: #666666">=</span><span style="color: #B8860B">$2</span>*b; <span style="color: #B8860B">bz</span><span style="color: #666666">=</span><span style="color: #B8860B">$3</span>*c
		getline; <span style="color: #B8860B">cx</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>*a; <span style="color: #B8860B">cy</span><span style="color: #666666">=</span><span style="color: #B8860B">$2</span>*b; <span style="color: #B8860B">cz</span><span style="color: #666666">=</span><span style="color: #B8860B">$3</span>*c
		<span style="color: #B8860B">Natm</span><span style="color: #666666">=</span>0
		getline; <span style="color: #B8860B">Nelm</span><span style="color: #666666">=</span>NF; <span style="color: #AA22FF; font-weight: bold">for</span><span style="color: #666666">(</span><span style="color: #B8860B">i</span><span style="color: #666666">=</span>1; i&lt;<span style="color: #666666">=</span>Nelm; i++<span style="color: #666666">)</span> Sym<span style="color: #666666">[</span>i<span style="color: #666666">]=</span><span style="color: #B8860B">$i</span>
		getline; <span style="color: #AA22FF; font-weight: bold">for</span><span style="color: #666666">(</span><span style="color: #B8860B">i</span><span style="color: #666666">=</span>1; i&lt;<span style="color: #666666">=</span>Nelm; i++<span style="color: #666666">)</span> <span style="color: #666666">{</span> Numb<span style="color: #666666">[</span>i<span style="color: #666666">]=</span><span style="color: #B8860B">$i</span>; <span style="color: #B8860B">Natm</span><span style="color: #666666">=</span>Natm+<span style="color: #B8860B">$i</span> <span style="color: #666666">}</span>
		getline; <span style="color: #B8860B">step</span><span style="color: #666666">=</span><span style="color: #B8860B">$NF</span>
		<span style="color: #B8860B">YesCar</span><span style="color: #666666">=</span>0; <span style="color: #AA22FF; font-weight: bold">if</span><span style="color: #666666">(</span><span style="color: #B8860B">$0</span>~/^<span style="color: #666666">[</span>::space::<span style="color: #666666">]</span>*<span style="color: #666666">[</span>C|c<span style="color: #666666">]</span>/<span style="color: #666666">)</span> <span style="color: #B8860B">YesCar</span><span style="color: #666666">=</span>1

		print Tips <span style="color: #BB4444">&quot; step= &quot;</span>step
		print Natm
		<span style="color: #B8860B">n</span><span style="color: #666666">=</span>0
		<span style="color: #AA22FF; font-weight: bold">for</span><span style="color: #666666">(</span><span style="color: #B8860B">i</span><span style="color: #666666">=</span>1; i&lt;<span style="color: #666666">=</span>Nelm; i++<span style="color: #666666">)</span> <span style="color: #666666">{</span>
			<span style="color: #AA22FF; font-weight: bold">for</span><span style="color: #666666">(</span><span style="color: #B8860B">j</span><span style="color: #666666">=</span>1; j&lt;<span style="color: #666666">=</span>Numb<span style="color: #666666">[</span>i<span style="color: #666666">]</span>; j++<span style="color: #666666">)</span> <span style="color: #666666">{</span>
				getline; n++
				<span style="color: #B8860B">x</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>/10; <span style="color: #B8860B">y</span><span style="color: #666666">=</span><span style="color: #B8860B">$2</span>/10; <span style="color: #B8860B">z</span><span style="color: #666666">=</span><span style="color: #B8860B">$3</span>/10
				<span style="color: #AA22FF; font-weight: bold">if</span><span style="color: #666666">(</span>!YesCar<span style="color: #666666">)</span> <span style="color: #666666">{</span>
					<span style="color: #B8860B">x</span><span style="color: #666666">=</span>ax*<span style="color: #B8860B">$1</span>+ay*<span style="color: #B8860B">$2</span>+az*<span style="color: #B8860B">$3</span>
					<span style="color: #B8860B">y</span><span style="color: #666666">=</span>bx*<span style="color: #B8860B">$1</span>+by*<span style="color: #B8860B">$2</span>+bz*<span style="color: #B8860B">$3</span>
					<span style="color: #B8860B">z</span><span style="color: #666666">=</span>cx*<span style="color: #B8860B">$1</span>+cy*<span style="color: #B8860B">$2</span>+cz*<span style="color: #B8860B">$3</span>
				<span style="color: #666666">}</span>
				printf<span style="color: #666666">(</span><span style="color: #BB4444">&quot;%8s%7s%5d%8.3f%8.3f%8.3f\n&quot;</span>, i<span style="color: #BB4444">&quot;ELM&quot;</span>, Sym<span style="color: #666666">[</span>i<span style="color: #666666">]</span>, n, x, y, z<span style="color: #666666">)</span>
			<span style="color: #666666">}</span>
		<span style="color: #666666">}</span>
		print ax, by, cz, ay, az, bx, bz, cx, cy
	<span style="color: #666666">}</span>
<span style="color: #BB4444">&#39;</span> <span style="color: #B8860B">$File</span>  &gt; <span style="color: #B8860B">$File</span>.gro
</pre></div>
</td></tr></table>
