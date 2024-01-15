---
 layout: post
 title: Windows下的AmberTools+RESP+ACPYPE
 categories:
 - 科
 tags:
 - md
 - gmx
---

## 2015-12-06 20:44:26

当需要使用[AmberTools](http://ambermd.org/#AmberTools)处理小分子时, 我们首先要安装AmberTools. 在Linux下安装这个工具或许并不太难, 但要想在Windows下安装并不简单. 此外, 如果我们只是使用AmberTools中的几个工具, 将它们全都装上也没有必要. 所以, 我在这里介绍一下在Windows下如何整合一个简单的AmberTools程序包用于处理小分子.

## 安装Chimera软件

安装[Chimera软件](https://www.cgl.ucsf.edu/chimera/)后, `chimera主目录/bin/amber14`目录(根据版本不同, amber后面的两个数字有区别. Chimera 1.10.2中的是amber14, 来源于AmberTools15)就是Chimera自带的CYGWIN下编译的AmberTools, 但可惜的是没有包含所有的程序, 比如拟合RESP电荷的程序就没有包含在其中, 所有我们需要自己编译resp程序.

## 编译RESP程序

首先下载[`AmberTools15.tar.bz2`](http://ambermd.org/AmberTools15-get.html). 解压后, 在`AmberTools15主目录/amber14/AmberTools/src/etc`中可以找到与resp程序有关的三个源文件`resp.F`, `lapack.F`和`limits.h`. 都是很古老的Fortran源程序, 可以使用安装好的Fortran编译器进行编译. 我使用的是Intel的Fortran编译器2015版, 具体命令是

	IntelFortran主目录/ifort.exe /fpp /DCYGWIN resp.F lapack.F

编译选项`/fpp`用于打开预处理, 因为源代码中包含了预处理命令, 选项`/DCYGWIN`用于定义宏变量, 使用`limits.h`中基于CYGWIN的设置. 这两个选项请根据你所用编译器的版本进行适当调整.

编译过程中警告很多, 但都不致命, 最后正常完成, 得到`resp.exe`. 我们在命令行中试着执行一下`resp.exe`, 如果输出

	usage: resp [-O] -i input -o output -p punch -q qin -t qout   -e espot -w qwts -s esout

那就说明我们编译的resp程序可以正常运行了.

## 编译acpype程序

如果你还需要将AMBER力场文件转换为GROMACS的拓扑文件, 那你需要[`acpype.py`脚本](http://svn.code.sf.net/p/ccpn/code/branches/stable/ccpn/python/acpype/). 它是一个Python脚本, 为使用它你需要先安装Python 2.x环境, 然后使用Python调用`acpype.py`, 这不方便, 但我们可以把`acpype.py`编译成可执行程序`acpype.exe`, 放在`amber14`中, 这样发布后就不需要用户安装Python环境了.

要将Python脚本编译成可执行程序, 我们可以使用[`py2exe`](http://www.py2exe.org/). 首先安装好Python 2.x环境和py2exe, 然后修改`acpype.py`脚本中的错误

![](https://jerkwin.github.io/pic/GMX_acpype.png)

再准备一个`setup.py`脚本

<table class="highlighttable"><th colspan="2" style="text-align:left">python</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
15</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #AA22FF; font-weight: bold">from</span> <span style="color: #0000FF; font-weight: bold">distutils.core</span> <span style="color: #AA22FF; font-weight: bold">import</span> setup
<span style="color: #AA22FF; font-weight: bold">import</span> <span style="color: #0000FF; font-weight: bold">py2exe</span>

options <span style="color: #666666">=</span> { <span style="color: #BB4444">&quot;py2exe&quot;</span>:
	{ <span style="color: #BB4444">&quot;optimize&quot;</span>: <span style="color: #666666">2</span>,
	  <span style="color: #BB4444">&quot;compressed&quot;</span>: <span style="color: #666666">1</span>,
	  <span style="color: #BB4444">&quot;bundle_files&quot;</span>: <span style="color: #666666">1</span> <span style="color: #008800; font-style: italic"># 此选项只能用于32位版本的Windows</span>
	}
}

setup(
	options <span style="color: #666666">=</span> options,
	zipfile<span style="color: #666666">=</span><span style="color: #AA22FF">None</span>,
	console<span style="color: #666666">=</span>[<span style="color: #BB4444">&#39;</span>acpype<span style="color: #666666">.</span>py<span style="color: #BB4444">&#39;</span>]
)
</pre></div>
</td></tr></table>
最后执行

	python setup.py py2exe

就可以得到一个`dist`目录, 其中就是`acpype.exe`及其运行所需的文件.

## 整合发布

将我们编译好的`resp.exe`, `acpype.exe`及其运行所需的文件全都复制到`chimera主目录/bin/amber14/bin`目录下, 再将`chimera主目录/bin/amber14`这个目录一起打包, 就做成了一个在Windows下可以直接使用的AmberTools程序包, 可用于处理小分子. 你如果需要这个工具包, 请点击[这里](/prog/amber14.zip)下载. 我整合的这个工具包可用于Windows XP 32位和Windows 7 64位, 其他平台上为测试. 有关此工具包的具体使用方法请参考后续博文.

## 评论

- 2017-01-17 03:38:10 `jhli` 抢个沙发。。。
- 2017-01-18 12:07:49 `Jerkwin` 这有啥好抢的. 随时都有的.
