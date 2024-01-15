---
 layout: post
 title: GROMACS QM/MM教程1：QM/MM方法的实现
 categories:
 - 科
 tags:
 - gmx
---

- 原始文档:
	- [QM/MM implementation in Gromacs](http://wwwuser.gwdg.de/~ggroenh/qmmm.html)
	- [GROMACS How-tos: QMMM](http://www.gromacs.org/Documentation/How-tos/QMMM)
	- [GROMACS Installation Instructions 4.5: compiling QMMM](http://www.gromacs.org/Documentation/Installation_Instructions_4.5/compiling_QMMM)

- 2017年01月30日 19:54:21 翻译: 洪巢升; 校对: 李继存

【李继存 注】此文档年代久远, 且与现行GROMACS版本有所脱节, 但其中所述原理仍有参考价值, 故在此整理, 以为备份.

在QM/MM方法中, 一部分体系使用量子力学(QM, quantum mechanical)方法进行处理(非常耗时), 另一部分体系使用基于力场的标准分子力学(MM, molecular mechanics)方法进行处理. GROMACS通过提供与外部QM程序的接口支持这种杂化的量子力学/分子力学方法.

GROMACS目前提供了与GAMESS-UK, Gaussian0X, mopac7以及ORCA四种量化计算软件的QM/MM接口. 这里我们将简单概述GROMACS的QM/MM功能, 几个示例以及相关源代码的修改及编译. GROMACS的QM/MM仍处于开发阶段, 这里的说明可能需要更新. 因此, 本文档只适用于那些愿意尝试和测试的用户.

## GROMACS的QM/MM功能概述

### QM方法

- AM1
- PM3
- RHF
- UHF
- CASSCF
- MP2
- DFT

### QM基组

- 所有基组

### 优化类型(__需要测试__)

- 能量极小值(`integrator=OPT`)
- 过渡态(`integrator=LT`)

### 动力学类型

- 基态模拟
- 激发态模拟
- 系间穿跃: 模拟由激发态向基态的转换

### QM/MM边界类型

- 标准QM/MM模型
- ONIOM模型
- 多层ONIOM模型

## GROMACS的QM/MM示例

- [如何在GROMACS中实现QM/MM计算](http://wwwuser.gwdg.de/~ggroenh/EMBO2004/html/qmmmvacuum.html#qmmmhowto)

- 用QM/MM动力学模拟研究光敏黄蛋白的激发态非绝热系间穿跃性质, 论文见[JACS 126 (2004), 4228-4233](http://wwwuser.gwdg.de/~ggroenh/qmmm/papers/groenhof04.pdf)

	- [pyp.mdp](http://wwwuser.gwdg.de/~ggroenh/qmmm/examples/pyp.mdp)
	- [pyp.ndx](http://wwwuser.gwdg.de/~ggroenh/qmmm/examples/pyp.ndx)
	- [pyp.top](http://wwwuser.gwdg.de/~ggroenh/qmmm/examples/pyp.top)
	- [pyp.gro](http://wwwuser.gwdg.de/~ggroenh/qmmm/examples/pyp.gro)
	- [input.chk.Z](http://wwwuser.gwdg.de/~ggroenh/qmmm/examples/input.chk.Z)(CASSCF波函数分子轨道系数的检查点文件)

- [对Diels-Alderase蛋白中发生的Diels-Alder反应进行过渡态优化](http://wwwuser.gwdg.de/~ggroenh/EMBO2004/html/tutorial.html)(EMBO课程中蛋白质建模的一部分, 中国上海, 2004年9月)

- [DNA中胸腺嘧啶二聚体的修复](http://wwwuser.gwdg.de/~ggroenh/SaoCarlos2008/html/tutorial.html)(前沿模拟研讨会的部分内容, 巴西圣卡洛斯, 2008年9月)

- [使用GROMACS和DFTB3进行QM/MM模拟](http://cbp.cfn.kit.edu/joomla/index.php/downloads/18-gromacs-with-qm-mm-using-dftb3)

## 源代码修改及编译

自3.3版本起, GROMACS默认支持QM/MM功能, 可以访问[我们的GROMACS网页](https://www.gwdg.de/)下载. 下面给出的是非常古老的版本, 我们不再支持. 强烈推荐使用官方新发布的版本.

- [qmx.tar.gz(GROMACS 3.2版本, 支持QM/MM)](http://wwwuser.gwdg.de/~ggroenh/qmmm/gmx/gmx3.2/gmx.tar.gz)
- [qmx.tar.gz(GROMACS 3.3版本CVS, 支持QM/MM)](http://wwwuser.gwdg.de/~ggroenh/qmmm/gmx/gmx3.3/gmx.tar.gz)

为激活GROMACS与量化程序的QM/MM接口, `configure`时需要使用`--with-qmmm-<QM PROGRAM NAME>`选项.

在编译GROMACS的时候你同样需要ORCA, mopac7, gaussian0X和/或GAMESS-UK的源代码. 由于这些源代码各自属于他们的版权持有人, 我们不能在这里发布它们, 因此你必须自己想办法得到它们. 下面是它们各自的网址

- [Gaussian](http://gaussian.com/)
- [GAMESS-UK](http://www.stfc.ac.uk/)
- [MOPAC7](https://sourceforge.net/projects/mopac7/)或者[mopac7.tar.gz](http://wwwuser.gwdg.de/~ggroenh/qmmm/mopac/SGI/mopac7.tar.gz)
- [ORCA](http://www.thch.uni-bonn.de/tc/orca)

另外, 可以通过下面的这些方法将GROMACS的`mdrun`和量化程序连接起来.

### ORCA

下载并按照官网说明安装好ORCA, 然后在安装GROMACS的时候加上`--with-qmmm-orca`选项.

当使用ORCA运行QM/MM工作时, 需要设置以下环境变量

- `BASENAME`: `tpr`文件的名称, 不包括后缀`.tpr`
- `ORCA_PATH`: ORCA可执行文件的路径

此外, 你还需要创建一个这样的文件`<BASENAME>.ORCAINFO`. 比如, 你要计算的是`test2.tpr`, 那这个文件的名称为`test2.ORCAINFO`.

在ORCAINFO文件中必须给出计算方法, 基组以及其他所有适用于ORCA的关键词(这意味着mdp文件中的`QMmethod`和`QMbasis`都会被忽略). 如果需要进行更加深入的了解, 请查询[ORCA官网](http://www.thch.uni-bonn.de/tc/?section=downloads).

### Mopac7

下载下面的文件

- [gmx.mop.f](http://wwwuser.gwdg.de/~ggroenh/qmmm/mopac/gmxmop.f)
- [dcart.f](http://wwwuser.gwdg.de/~ggroenh/qmmm/mopac/dcart.f), 取代默认的`dcart.f`
- [libmopac.a.gz](http://wwwuser.gwdg.de/~ggroenh/qmmm/mopac/libmopac.a.gz)(Linux下预编译的mopac库文件)

编译所有的mopac文件, 但`mopac.f`, `moldat.f`, `deriv.f`除外, 因为这些都被`gmxmop.f`代替了.

	f77 -O2 -c *.f

然后将所有的目标文件(`*.o`)打包成库文件

	ar rcv libmopac.a *.o
	ranlib libmopac.a

如果你使用Linux系统, 也可以简单地下载上面的`libmopac.a`.

注意, 对于SGI内核, 你需要使用这个[gmxmop.f文件](http://wwwuser.gwdg.de/~ggroenh/qmmm/mopac/SGI/gmxmop.f)并替换原先的文件. 我不知道具体原因, 在该构架下FORTRAN common公共块的处理方式似乎与通常方式不同.

然后编译GROMACS, 使用下面的选项

	LIBS=-lmopac
	LDFLAGS=-L<libmopac.a文件的位置>
	./configure --with-qmmm-mopac

或者, 也可以修改`Makefile`里面的`LIBS`行(快但不优雅)

	LIBS= ... -lmopac -lm ...

### GAMESS-UK

下载需要的文件

- [ver_c.f](http://wwwuser.gwdg.de/~ggroenh/qmmm/GAMESS-UK/ver_c.f)
- [gamess.m](http://wwwuser.gwdg.de/~ggroenh/qmmm/GAMESS-UK/gamess.m)
- [gmx.m](http://wwwuser.gwdg.de/~ggroenh/qmmm/GAMESS-UK/gmx.m)
- [parallel.m](http://wwwuser.gwdg.de/~ggroenh/qmmm/GAMESS-UK/parallel.m)(如果需要并行计算)
- [Makefile](http://wwwuser.gwdg.de/~ggroenh/qmmm/GAMESS-UK/Makefile)

将以上文件添加到`GAMESS-UK/m4`子目录, 更新`Makefile`使其与你的系统配置相匹配, 然后编译代码.

接着编译GROMACS, 使用下列选项

	LDFLAGS=-L<libgamess.a文件的位置>
	LIBS='-lgamess -lg2c -lm'
	./configure --with-qmmm-gamess

或者, 也可以修改`Makefile`里面的`LIBS`行(快但不优雅)

	LIBS= ... -lgamess -lg2c -lm ...

### Gaussian03/09

使用GROMACS和高斯进行QM/MM计算有两种方法.

一种方法是使用我们提供的一个脚本[gau](http://wwwuser.gwdg.de/~ggroenh/gau)(你可能要对脚本稍加修改). 这个脚本首先读取并修改GROMACS生成的输入文件, 然后调用高斯程序进行计算, 最后提取相应的能量和梯度信息, 并将其写入一个文件供GROMACS读取. 对那些无法获得高斯源代码, 且不熟悉编程的用户, 推荐使用这种方法. 尽管如此, 理解这个脚本的处理步骤和含义仍然很有必要. 因为根据操作系统的不同, 你可能需要对脚本进行少量调整才能顺利地使用它进行QM/MM计算.

<del>要使用这个脚本, 需要将环境变量`GAUSS_DIR`设置为这个脚本所在的目录, 还需要将环境变量`GAUSS_EXE`设置为这个脚本的名称. 另外, GROMACS还需要设置`DEVEL_DIR`环境变量, 但这个环境变量一般会被忽略.</del>【李继存 注】此段论述不适用于GROMACS的新版本, 具体设置参考后续博文[GROMACS QM/MM教程2: 编译设置及简单运行]().

另一种方法需要对高斯的301, 510, 701和9999链接进行修改. 由于不能在这里发布高斯的相应源代码, 我们在下面给出一些说明以便让那些拥有高斯源代码的用户可以自己进行修改和编译. 注意在包含所需的修改前, 二进制的高斯程序不能使用.

高斯提供了一种便捷的方法来构建和使用修改后的链接. 首先创建一个子目录, 例如命名为`modlinks`, 以便在里面建立所有需要修改链接的目录. 然后从高斯源代码树中提取出那些需要修改的函数, 并将其放入相应的目录, 最后将你的目标文件和高斯的原始目标文件进行连接, 建立一个新的可执行文件. 这样如果输入文件中有类似`%subst lxxx /home/user/modlinks/lxxx`的命令, 高斯就会忽略原本的`lxxx.exe`而使用你修改后的文件.

GROMACS需要使用点电荷上的梯度, 所以需要对`1701.exe`进行修改. 同时为了GROMACS能使用这些梯度, 控制高斯输出的`l9999.exe`也需要进行修改. 此外, 也需要对`l301.exe`稍加修改, 以便忽略点电荷之间的相互作用. 最后, 如果进行激发态动力学模拟, 还需要修改控制MCSCF的`l510`链接.

`modlinks`目录中为这些链接创建目录:

	~/modlinks/l301
	~/modlinks/l510
	~/modlinks/l701
	~/modlinks/l999

必须构建修改后的可执行程序, 所以, 每个`lxxx`子目录下都需要一个makefile文件. 这里有一个[`1301.make`的例子](http://wwwuser.gwdg.de/~ggroenh/l301.make).

使用高斯的`gau-fsplit`命令可以很方便地提取需要修改的子程序:

	gau-fsplit -e dle $GAUSS_DIR/1701.F

可以使用`grep`命令找到含有需要修改函数的FORTRAN源文件.

	grep –I dle $GAUSS_DIR/*.F

这里有一个关于哪些函数需要修改, 如何修改的介绍[roadmap.pdf](http://wwwuser.gwdg.de/~ggroenh/roadmap.pdf). 修改完链接后, 通过`--with-qmmm-gaussian`重新编译GROMACS, 并将`DEVEL_DIR`环境变量设置为`modlinks`子目录, GROMACS就可以和高斯联用进行QM/MM模拟了.
