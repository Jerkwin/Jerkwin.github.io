---
 layout: post
 title: Windows下AmberTools17的编译
 categories:
 - 科
 tags:
 - amber
---

- 2017-12-28 13:21:00

根据amber手册及安装脚本的说明, 在windows下可以使用两种方法来编译amber, 一种基于cygwin, 一种基于msys2. 我测试了这两种方法:

- 最新版msys2-mingw64, 配置通过, 安装时gcc库函数出错, 无法解决, 放弃
- 最新版cycgwin-x64, 从配置开始就一堆错误, 试着解决了多数, 但最终仍失败, 放弃

无奈之下, 死马当活马医, 抱着试试的心态使用老版本的cygwin-x32来编译, 不成想却通过了. 无奈何, 没脾气.

## 编译前提

安装好`gcc`, `gfortran`, `tar`, `tcsh`, `make`

## 编译安装

与手册说明类似

### 0. 下载安装文件

到[官网](http://ambermd.org/#AmberTools)下载安装文件`AmberTools17.tar.bz2`, 需要留电子邮件.

安装文件300多MB, 有点大, 主要是其中的测试文件很多.

### 1. 解压安装文件

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">tar</span> jxvf AmberTools17.tar.bz2
</pre></div>

得目录`amber16`.

谜之版本号. 今年是2017年, AmberTools是今年的, 但amber是去年的. 关键amber是要花钱的, 免费的都升级了, 收费的却还没来得及升级. 以后说起计算流程来, 还得讲清楚: 嗯, 我是用amber16跑的, 建模用的AmberTools17. 别嫌罗嗦.

### 2. 进入安装目录

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">cd</span> amber16
</pre></div>

可以看到, 此路径下包含目录

	./AmberTools
	./dat
	./doc
	./test
	./updateutils

包含文件

	./configure
	./Makefile
	./README
	./update_amber

### 3. 设置`AMBERHOME`环境变量

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">export</span> AMBERHOME=`pwd`
</pre></div>

我们已经在`amber16`目录中了, 所以直接使用当前路径即可.

### 4. 配置编译环境

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">./configure</span> <span style="color:#666">-cygwin</span> <span style="color:#666">-noX11</span> gnu
</pre></div>

配置选项很多, 我们只用最简单的.

配置时会自动更新, 如果你不想更新, 或更新出错, 可以使用`--no-updates`选项关闭更新.

默认会安装自带的python脚本, 如果你不想安装, 可以使用`--skip-python`关闭

配置开始后会检查编译环境是否正常. 最耗时最易出错的地方是NetCDF和fftw部分. NetCDF库既有Fortran接口, 又有C接口. 也可以关闭它. 但根据我的测试, 如果关闭了NetCDF, 后面编译`cpptrj`以及`3drism`会无法成功, 且可能还会导致其他问题, 所以还是尽量打开吧.

### 5. `source`安装脚本

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">source</span> amber.sh
</pre></div>

如果你使用其他shell, `source`相应的脚本.

### 6. 安装

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">make</span> install
</pre></div>

耗时最长, 出错最多的地方. 下面是我遇到的错误和解决的方法:

- `/usr/lib/gcc/i686-pc-cygwin/4.5.3/../../../../i686-pc-cygwin/bin/ld: cannot find -lquadmath`

	未找到`libquadmath.a`库, 原因不明. 手动将其复制到`./lib`即可.

- `misc_utils.c:22:22: 致命错误：execinfo.h：No such file or directory`

	这里调用了Linux特有的系统函数, cygwin下没有. 将`misc_utils.c`的22行注释, 函数`print_backtrace`只保留一句`fprintf(stderr, "Error: signal %d\n",signal);`即可.

## 使用设置

安装完成后, 所有的可执行程序都在`./bin`下. 这些程序分为两类, 一类是真正的可执行程序(二进制的), 另一类是包装可执行程序的脚本(文本的), 虽然它们的扩展名也是`.exe`, 对应的真正二进制程序在`./bin/to_be_dispatched`. 所以, 如果不是在shell中使用的话, 第二类是没法直接调用的. 简单的解决办法就是全部直接使用二进制程序, 并设置相应的环境变量. 当然, 也可以将那些脚本改为Windows的批处理脚本, 或使用shell调用(前提是先装好bash).

编译好的程序在执行时还需要几个库文件`cygwin1.dll`, `USER32.dll`, `cyggfortran-3.dll`. 因此, 在发布这些程序时要将这三个文件复制到`./bin`下一起发布, 否则在没有这些库文件的电脑上可能无法运行.

这些程序在使用时, 大部分都需要`AMBERHOME`环境变量. 所以要将其设置好. 稍有特别的是

- `reduce.exe`使用时需要设置环境变量`REDUCE_HET_DICT="$AMBERHOME/dat/reduce_wwPDB_het_dict.txt"`
- `nab.exe`使用时需要将`${AMBERHOME}/lib`加入到`LD_LIBRARY_PATH`

## 程序下载

太大了, 免费空间放不下. 需要的到群里去下载.
