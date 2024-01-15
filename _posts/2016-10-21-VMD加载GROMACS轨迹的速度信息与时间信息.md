---
 layout: post
 title: VMD加载GROMACS轨迹的速度信息与时间信息
 categories:
 - 科
 tags:
 - gmx
 - vmd
---

- 2016-10-21 16:56:11

Sobereva曾给过一个tcl脚本, 用于解决VMD不能读入GROMACS轨迹速度信息的问题, 具体参考 [使VMD读入Gromacs产生的trr轨迹中速度信息的方法](http://sobereva.com/117). 最近我需要用到VMD的这个功能, 就稍微看了下tcl的语法, 在原代码的基础上改进了一点, 使其使用更简单. 同时结合Sobereva的另一段代码 [使VMD播放轨迹时同步显示帧号](http://sobereva.com/13), 在播放轨迹的同时显示出模拟时间.

下面模拟的是C20和C60分子的相撞过程, 播放轨迹时对每个原子根据速度大小进行着色.

![](https://jerkwin.github.io/pic/C20-C60.gif)

### 使用方法

1. 运行MD前将`grompp.mdp`文件中trr与xtc的输出频率设为相同
2. 使用`gmx traj -f traj.trr -ov`抽取`traj.trr`轨迹文件中的速度, 默认存为`veloc.xvg`
3. 使用VMD加载初始的`conf.gro`文件和`traj.xtc`轨迹文件(直接使用trr文件可能更简单, 但速度稍慢). 也可直接使用命令`vmd conf.gro traj.xtc`
4. 将`vt.tcl`脚本复制到轨迹文件所在目录下
5. VMD命令行窗口中执行`source vt.tcl`使脚本生效
6. VMD命令行窗口中执行`loadveloc`即可加载`veloc.xvg`文件中的速度. 如果速度文件的名称不是`veloc.xvg`, 则使用`loadveloc 速度文件名`即可
7. 如果播放轨迹时需要显示时间, 可在VMD命令行窗口中执行`showtime`. 执行`showtime off`则关闭时间显示. 默认的时间间隔为0.5 fs, 起始时间为0, 如需更改, 可使用`showtime on 时间间隔 起始时间`
8. 播放轨迹时对每个原子根据速度大小进行着色, 可通过`Graphics | Representations... | Coloring Method | trajectory | Velocity`. 如需根据某一方向速度大小着色, 可使用`User`(x方向), `User2`(y方向), `User3`(z方向)
9. 更改颜色方案, 可使用`Graphics | Colors... | Color Scale | Method`.

### 几点说明

- 这种基于tcl的方法可行, 但需要编写tcl脚本. 如果你不喜欢tcl脚本的话, 至少还有两个变通的替代方案: 1. 可以将gromacs的轨迹文件转换为lammps的轨迹文件, 因为vmd支持读取lammps轨迹文件中的速度. 2. 将速度写到pdb文件中的温度因子或电荷列中, 再根据相应的项进行着色. `gmx traj`的`-cv`选项一定程度上可以完成这点, 但效率太低.

- 对原子根据其速度进行着色并不总是最好的方法, 更好的方法是根据动能或温度进行着色. 一则原子类型不同时, 质量小的原子速度会相对较大, 二则人们对原子速度大小没有多少直观感觉, 添加颜色标尺时不易把握. 如果使用相对动能或温度, 就更加直观, 也更容易把握了. 只要对脚本稍加修改就可以达到这个目的.

- 对于温度或速度这种物理量而言, 使用分散颜色方案是最好的, VMD中接近这种颜色方案的是`BWR`, 但仍有不少差距. 如果想使用自定义的颜色方案, 除了自己写tcl代码以外, 目前我不知道有没有简单的办法. 有关发散颜色方案的信息可参考我的另外两篇博文: [数据展示：请选择好的颜色映射方案](http://jerkwin.github.io/2014/11/20/%E6%95%B0%E6%8D%AE%E5%B1%95%E7%A4%BA-%E8%AF%B7%E9%80%89%E6%8B%A9%E5%A5%BD%E7%9A%84%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84%E6%96%B9%E6%A1%88/), [几种颜色映射方案的解析式](http://jerkwin.github.io/2016/09/02/%E5%87%A0%E7%A7%8D%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84%E6%96%B9%E6%A1%88%E7%9A%84%E8%A7%A3%E6%9E%90%E5%BC%8F/).

- tcl中的`trace`可以使用回调函数(callback)进行变量跟踪, 使用`trace`时回调函数必须带有参数, 否则执行有问题. 此外, 新版本tcl中`trace`的语法有所改变, 上面脚本中的使用方式以后会废弃, 建议大家使用时尽量使用新版本的语法. 具体可参看下面的资料: [VMD手册: Tcl callbacks](http://www.ks.uiuc.edu/Research/vmd/vmd-1.7.1/ug/node140.html), [tcl手册: trace](https://www.tcl.tk/man/tcl8.4/TclCmd/trace.htm).

### `vt.tcl`脚本

<table class="highlighttable"><th colspan="2" style="text-align:left">vt.tcl</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #AA22FF; font-weight: bold">proc</span> showtime <span style="color: #AA22FF; font-weight: bold">{</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">opt</span> on<span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">dtin</span> <span style="color: #666666">0.5</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">t0in</span> <span style="color: #666666">0</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
	<span style="color: #AA22FF; font-weight: bold">global</span> vmd_frame<span style="color: #AA22FF; font-weight: bold">;</span> <span style="color: #AA22FF; font-weight: bold">global</span> dt<span style="color: #AA22FF; font-weight: bold">;</span> <span style="color: #AA22FF; font-weight: bold">global</span> t0
	<span style="color: #AA22FF; font-weight: bold">set</span> dt <span style="color: #B8860B">$dtin</span>
	<span style="color: #AA22FF; font-weight: bold">set</span> t0 <span style="color: #B8860B">$t0in</span>
	<span style="color: #AA22FF; font-weight: bold">if</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">$opt</span><span style="color: #666666">==</span><span style="color: #B8860B">on</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
		<span style="color: #AA22FF; font-weight: bold">trace</span> variable vmd_frame<span style="color: #AA22FF; font-weight: bold">([</span><span style="color: #B8860B">molinfo</span> top<span style="color: #AA22FF; font-weight: bold">])</span> w traceframe
	<span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">elseif</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">$opt</span><span style="color: #666666">==</span><span style="color: #B8860B">off</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
		<span style="color: #B8860B">draw</span> delete all
		<span style="color: #AA22FF; font-weight: bold">trace</span> vdelete vmd_frame<span style="color: #AA22FF; font-weight: bold">([</span><span style="color: #B8860B">molinfo</span> top<span style="color: #AA22FF; font-weight: bold">])</span> w traceframe
	<span style="color: #AA22FF; font-weight: bold">}</span>
<span style="color: #AA22FF; font-weight: bold">}</span>

<span style="color: #AA22FF; font-weight: bold">proc</span> traceframe <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">name</span> elem ops<span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
	<span style="color: #AA22FF; font-weight: bold">global</span> vmd_frame<span style="color: #AA22FF; font-weight: bold">;</span> <span style="color: #AA22FF; font-weight: bold">global</span> dt<span style="color: #AA22FF; font-weight: bold">;</span> <span style="color: #AA22FF; font-weight: bold">global</span> t0
 	<span style="color: #B8860B">draw</span> delete all
	<span style="color: #B8860B">draw</span> color white
	<span style="color: #AA22FF; font-weight: bold">set</span> time <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #AA22FF">format</span> <span style="color: #BB4444">&quot;%6.1f fs&quot;</span> <span style="color: #AA22FF; font-weight: bold">[expr</span> <span style="color: #AA22FF; font-weight: bold">(</span><span style="color: #B8860B">$vmd_frame</span><span style="color: #AA22FF; font-weight: bold">([</span><span style="color: #B8860B">molinfo</span> top<span style="color: #AA22FF; font-weight: bold">])</span> <span style="color: #666666">*</span> <span style="color: #B8860B">$dt</span><span style="color: #AA22FF; font-weight: bold">)</span> <span style="color: #666666">+</span> <span style="color: #B8860B">$t0</span><span style="color: #AA22FF; font-weight: bold">]]</span>
	<span style="color: #B8860B">draw</span> text <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">0</span> <span style="color: #666666">-5</span> <span style="color: #666666">-5</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #BB4444">&quot;$time&quot;</span> size <span style="color: #666666">4</span> thickness <span style="color: #666666">4</span>
<span style="color: #AA22FF; font-weight: bold">}</span>

<span style="color: #AA22FF; font-weight: bold">proc</span> loadveloc <span style="color: #AA22FF; font-weight: bold">{</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">Fxvg</span> veloc.xvg<span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
	<span style="color: #AA22FF; font-weight: bold">set</span> Mol  <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #B8860B">atomselect</span> top all<span style="color: #AA22FF; font-weight: bold">]</span>
	<span style="color: #AA22FF; font-weight: bold">set</span> Natm <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #B8860B">$Mol</span> <span style="color: #B8860B">num</span><span style="color: #AA22FF; font-weight: bold">]</span>
	<span style="color: #AA22FF; font-weight: bold">set</span> Nfrm <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #B8860B">molinfo</span> top get numframes<span style="color: #AA22FF; font-weight: bold">]</span>

	<span style="color: #AA22FF; font-weight: bold">set</span> Fxvg <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #AA22FF">open</span> <span style="color: #B8860B">$Fxvg</span> r<span style="color: #AA22FF; font-weight: bold">]</span>
	<span style="color: #AA22FF">gets</span> <span style="color: #B8860B">$Fxvg</span> txt
	<span style="color: #AA22FF; font-weight: bold">while</span> <span style="color: #AA22FF; font-weight: bold">{[</span><span style="color: #AA22FF">string</span> match <span style="color: #AA22FF; font-weight: bold">{[</span><span style="border: 1px solid #FF0000">\</span><span style="color: #008800; font-style: italic">#@]*} $txt]} {</span>
		<span style="color: #AA22FF">gets</span> <span style="color: #B8860B">$Fxvg</span> txt
	<span style="border: 1px solid #FF0000">}</span>
	<span style="color: #AA22FF; font-weight: bold">set</span> txt <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #AA22FF">split</span> <span style="color: #B8860B">$txt</span> <span style="border: 1px solid #FF0000">\</span>t<span style="color: #AA22FF; font-weight: bold">]</span>

	<span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #AA22FF; font-weight: bold">{set</span> i <span style="color: #666666">1</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">$i</span><span style="color: #666666">&lt;</span><span style="color: #B8860B">$Nfrm</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #AA22FF">incr</span> i<span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
		<span style="color: #B8860B">$Mol</span> <span style="color: #B8860B">frame</span> <span style="color: #B8860B">$i</span>
		<span style="color: #AA22FF; font-weight: bold">set</span> Vx <span style="color: #AA22FF; font-weight: bold">{};</span> <span style="color: #AA22FF; font-weight: bold">set</span> Vy <span style="color: #AA22FF; font-weight: bold">{};</span> <span style="color: #AA22FF; font-weight: bold">set</span> Vz <span style="color: #AA22FF; font-weight: bold">{}</span>
		<span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #AA22FF; font-weight: bold">{set</span> j <span style="color: #666666">0</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #B8860B">$j</span><span style="color: #666666">&lt;</span><span style="color: #B8860B">$Natm</span><span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span><span style="color: #AA22FF">incr</span> j<span style="color: #AA22FF; font-weight: bold">}</span> <span style="color: #AA22FF; font-weight: bold">{</span>
			<span style="color: #AA22FF">lappend</span> Vx <span style="color: #AA22FF; font-weight: bold">[</span> <span style="color: #AA22FF">lindex</span> <span style="color: #B8860B">$txt</span> <span style="color: #AA22FF; font-weight: bold">[expr</span> <span style="color: #666666">3*</span><span style="color: #B8860B">$j</span><span style="color: #666666">+1</span><span style="color: #AA22FF; font-weight: bold">]</span> <span style="color: #AA22FF; font-weight: bold">]</span>
			<span style="color: #AA22FF">lappend</span> Vy <span style="color: #AA22FF; font-weight: bold">[</span> <span style="color: #AA22FF">lindex</span> <span style="color: #B8860B">$txt</span> <span style="color: #AA22FF; font-weight: bold">[expr</span> <span style="color: #666666">3*</span><span style="color: #B8860B">$j</span><span style="color: #666666">+2</span><span style="color: #AA22FF; font-weight: bold">]</span> <span style="color: #AA22FF; font-weight: bold">]</span>
			<span style="color: #AA22FF">lappend</span> Vz <span style="color: #AA22FF; font-weight: bold">[</span> <span style="color: #AA22FF">lindex</span> <span style="color: #B8860B">$txt</span> <span style="color: #AA22FF; font-weight: bold">[expr</span> <span style="color: #666666">3*</span><span style="color: #B8860B">$j</span><span style="color: #666666">+3</span><span style="color: #AA22FF; font-weight: bold">]</span> <span style="color: #AA22FF; font-weight: bold">]</span>
		<span style="color: #AA22FF; font-weight: bold">}</span>

		<span style="color: #B8860B">$Mol</span> <span style="color: #AA22FF; font-weight: bold">set</span> vx <span style="color: #B8860B">$Vx</span>
		<span style="color: #B8860B">$Mol</span> <span style="color: #AA22FF; font-weight: bold">set</span> vy <span style="color: #B8860B">$Vy</span>
		<span style="color: #B8860B">$Mol</span> <span style="color: #AA22FF; font-weight: bold">set</span> vz <span style="color: #B8860B">$Vz</span>
		<span style="color: #B8860B">$Mol</span> <span style="color: #AA22FF; font-weight: bold">set</span> user  <span style="color: #B8860B">$Vx</span>
		<span style="color: #B8860B">$Mol</span> <span style="color: #AA22FF; font-weight: bold">set</span> user2 <span style="color: #B8860B">$Vy</span>
		<span style="color: #B8860B">$Mol</span> <span style="color: #AA22FF; font-weight: bold">set</span> user3 <span style="color: #B8860B">$Vz</span>

		<span style="color: #AA22FF">gets</span> <span style="color: #B8860B">$Fxvg</span> txt
		<span style="color: #AA22FF; font-weight: bold">set</span> txt <span style="color: #AA22FF; font-weight: bold">[</span><span style="color: #AA22FF">split</span> <span style="color: #B8860B">$txt</span> <span style="border: 1px solid #FF0000">\</span>t<span style="color: #AA22FF; font-weight: bold">]</span>
	<span style="color: #AA22FF; font-weight: bold">}</span>

	<span style="color: #AA22FF">close</span> <span style="color: #B8860B">$Fxvg</span>
<span style="border: 1px solid #FF0000">}</span>
</pre></div>
</td></tr></table>
### 评论

- 2016-10-22 10:21:14 `李正` 这两个分子相撞是怎么实现的啊？
- 2016-10-22 13:59:03 `Jerkwin` 把两个分子的速度设为方向相反, 运行NVE模拟即可.

- 2016-11-07 11:43:09 `粥四文` gmx 不是内部命令？
- 2016-11-08 08:21:30 `Jerkwin` 按你安装好的gmx来写, 或许是gmx_mpi之类的

- 2016-11-08 11:06:11 `粥四文` ”将vt.tcl脚本复制到轨迹文件所在目录下“，怎么弄？tcl文件，是下载一个tcl.pro软件编写吗？我是个初学者，不太理解。麻烦您了。
- 2016-11-08 21:46:11 `Jerkwin` 新建一个文本文档, 将下面的脚本复制粘贴进去, 保存为vt.tcl, 就可以了.
