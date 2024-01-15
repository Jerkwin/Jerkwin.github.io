---
 layout: post
 title: Windows下的bash环境及path环境变量设置
 categories:
 - 科
 tags:
 - bash
---

- 2016-08-23 16:12:08

在Windows系统下, 如果想要使用bash及其附带工具的话, 有很多解决方案, 但我在这里只推荐两种自己觉得比较简单的方案.

1. CygWin
	[CygWin](https://www.cygwin.com/)是Windows下模拟Linux环境的成熟方案, 功能强大, 兼容性好, 但缺点在于文件过多, 安装耗时, 且自带的许多程序版本较老. 如果仅仅是为了使用bash的一些小工具就安装的话, 有点大材小用. 当然, 你也可以将一些常用的程序及其需要的库文件单独提取出来, 做成一个缩微版的bash, 像我以前做的那样. 比较详细的安装说明可以参考[Cygwin Cheat Sheet](https://www.pcwdld.com/cygwin-cheat-sheet).
2. msys2
	Windows下模拟Linux环境的另一经典方案是MinGW系统, 包括MinGW, Msys, GnuWin32等. 这些环境比CygWin小巧, 安装快速, 但更新较慢, 其中的有些程序版本较老. 目前新出现的[msys2](https://msys2.github.io/)系统较其他系统更受欢迎, 所以推荐使用.

上面两种环境, 无论哪种安装好以后, 都可以通过执行相应的程序或脚本来启动bash环境. 但每次使用bash工具前都要先启动bash环境然后切换路径, 不是很方便. 为此, 我们可以将bash工具所在的目录添加到Windows的`path`环境变量, 这样那些bash工具就可以在CMD命令行中直接使用了, 像Windows自带的那些命令一样.

由于很多人不是很理解这种做法, 这里多罗嗦几句. 在Windows的CMD下, 你执行一个程序的时候, 有两种方法, 一种是使用程序的全路径, 一种是将程序的所在的目录添加到`path`环境变量. 比如, 在Windows下, 我有一个程序`prog.exe`, 安装在`C:\soft\bin`目录下, 那么我在CMD中可以使用`C:\soft\bin\prog.exe`来执行它. 但如果每次执行一个命令都要使用全路径, 十分不方便, 特别是有时安装路径很长, 或者你都不记得程序装在什么地方了. 为了解决这个问题, Windows引入了`path`环境变量. 它的作用就是, 在CMD中键入一个命令后, 系统会先在`path`环境变量定义的目录中去寻找相应的程序, 如果找到, 就执行, 找不到的话就报错, 给出`'XXX' 不是内部或外部命令，也不是可运行的程序或批处理文件。`这样的信息. 这样, 任何一个程序, 只要其所在的目录添加到`path`环境变量, 就可以像系统命令那样使用它了. 对前面的例子, 只要我们将`C:\soft\bin`添加到`path`环境变量, 就可以在CMD中直接使用`prog.exe`或`prog`来执行了, 而无须使用全路径, 方便了不少. 实际上, CMD自带的一些命令, 如`notepad`, `calc`之类之所以可以直接执行, 就是因为它们所在的Windows系统目录处于系统的`path`环境变量中.

在Windows XP下, 添加`path`环境变量的方法是, 右键`我的电脑`->`属性`->`高级`->`环境变量`.

![](https://jerkwin.github.io/pic/path_xp.png)

可以看到这里可以定义两类环境变量, 一是用户级别的, 一是系统级别的. 系统变量中已经有个名称为`path`的环境变量了, 而且它的值也已经很长了, 所以我们一般不再将其他的路径添加到系统变量的`path`中, 而是在用户变量中新建一个`path`环境变量, 将其值设为`%path%;盘符:\要添加的目录\`. __注意__ 一定要使用英文标点, 不同目录之间以分号`;`相隔, 且分号后不能有空格. 前面的`%path%`是对系统`path`变量的引用, 不引用它的话, 那些处于系统`path`变量中的程序就无法使用了, 所以我们需要先要引用下系统的`path`变量, 然后再添加我们需要的目录. 添加完成后一路确定退出界面, 到任意位置新打开一个CMD窗口, 然后执行`echo %path%`, 如果输出了我们添加的目录, 那说明添加成功了. 否则的话, 你可能需要关闭`我的电脑`再打开试试, 甚至注销下机器再试试.

对于更新的Windows系统, Windows 7/8/10之类, `我的电脑`名称可能有变化, 但无论怎么变, 反正它指的就是那个可以用来查找文件的资源管理器. 后面的步骤也是类似. 下面是英文版Windows 7的图, 凑合着看吧, 因为我没有中文版的Windows 7系统.

![](https://jerkwin.github.io/pic/path_win7.png)

最后也顺便说下Linux下的类似设置吧. 在Linux下, 只要编辑用户`home`下的`.bashrc`文件, 在里面添加类似下面的内容就可以了.

<table class="highlighttable"><th colspan="2" style="text-align:left">bash</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2
3</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #AA22FF">export</span> <span style="color: #B8860B">PATH</span><span style="color: #666666">=</span>$PATH:<span style="color: #BB6622; font-weight: bold">\</span>
/添加/目录1:<span style="color: #BB6622; font-weight: bold">\</span>
/添加/目录2
</pre></div>
</td></tr></table>
前一个`$PATH`也是引用系统的`PATH`, 作用与Windows下的类似. 编辑完此文件后, `source ~/.bashrc`或退出重新登录下机器这些设置就可以起作用了.

### 评论

- 2016-08-26 22:29:32 `LeoooBian` 在我的使用经验来看，[Babun](http://babun.github.io/) 和 [ConEmu](https://conemu.github.io/) 是目前两个比较好的cygwin替代方案。其实使用虚拟机装一个Linux系统可能是更好的选择。

- 2016-08-27 09:17:30 `Jerkwin` 谢谢提供信息. 不过第一个程序就是打包好的cygwin, 而第二个只是个执行命令的界面.

- 2016-08-30 08:51:13 `LeoooBian` 主要是我感觉cygwin的安装和内部程序安装配置太反直觉了，打好包的程序对用户比较友好。用了几年的cygwin，去年开始用babun（和MobiXterm），今年就彻底放弃在windows下配置了，还是发挥系统的特长比较靠谱。

- 2016-08-30 22:47:28 `Jerkwin` 是这样的. 不过我基本都是在windows下操作, 很少直接使用那些工具, 都是在脚本里调用一下, 那些工具只要可用就够了.
