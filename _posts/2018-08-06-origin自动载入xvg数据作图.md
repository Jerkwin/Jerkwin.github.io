---
 layout: post
 title: origin自动载入xvg数据作图
 categories:
 - 科
 tags:
 - gmx
 - origin
---

- 2018-08-06 20:39:48

origin是使用很广泛的绘图软件, 用起来也很方便. [2017版本的origin](https://jerkwin.github.io/2017/02/23/OriginPro2017%E4%B8%AD%E6%96%87%E7%89%88/)支持命令行调用, 这样我们就可以利用Windows的命令行自动执行origin载入数据并绘图, 达到双击数据文件即可出图的目的.

origin自动绘图的实现参考了[利用windows批处理实现自动绘图](http://muchong.com/t-12212385-1). 里面给出的代码我修改了一下, 这样就可以直接处理GROMACS的xvg文件了:

<table class="highlighttable"><th colspan="2" style="text-align:left">origin.bat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">1
2
3</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>@<span style="color: #AA22FF; font-weight: bold">echo</span> off
<span style="color: #AA22FF; font-weight: bold">start</span> /max <span style="color: #B8860B">%~dp0</span><span style="color: #BB4444">&quot;&quot;</span>Origin94_64.exe -r { impasc <span style="color: #B8860B">%1</span> Options.FileStruct.Delimiter:=3; plotgroup iy:=(A,B) type:=linesymb template:=JCP.otp }
<span style="color: #AA22FF; font-weight: bold">exit</span></pre></div>
</td></tr></table>

将`origin.bat`放到`Origin94_64.exe`所在的目录下, 然后修改xvg文件的默认打开方式, 这样就可以直接载入数据并绘图了.

上面命令中的`JCP.otp`是我自定义的绘图模板. 但实际使用中, 我发现以这种方式调用模板文件进行绘图时页面的大小设置无法精确控制, 一种解决方法是将做好的图存为主题, 然后对绘图应用主题.
