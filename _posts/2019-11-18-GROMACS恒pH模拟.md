---
 layout: post
 title: GROMACS恒pH模拟
 categories:
 - 科
 tags:
 - gmx
---

- 2019-11-18 22:40:15

首先, 检查一下你的假定. 理想情况是使用恒pH算法来进行MD模拟. 然而, 传统的显式溶剂MD算法无法做到这一点, 因为它们使用的是恒H+算法. 此外, 如果使用MM力场, 那么溶质的位点不可能发生质子化/去质子化: 游离的H+会四处运动, 而可滴定位点的质子化状态始终保持不变. 要解决这个问题必须使用非MM的哈密顿量, 这样才能支持明确的质子转移. 在任何情况下, 无论使用什么样的哈密顿量, H+的量都不会改变.

如果要进行显式溶剂的恒pH模拟, 最简单的方法是仍然使用常规MD, 但选择特定的H+数量, 并保证选择的值对体系而言足够"典型". 此外, 需要使用的水分子的数目一般比常规MD模拟中的高几个数量级. 基本上, 对大多数pH值(甚至是pH=4时)都可以忽略游离的H+浓度, 因为其浓度比其他抗衡离子(例如Na+, Cl-)的浓度低几个数量级. 此外, 如上所述, 单纯的MM哈密顿量无法在可滴定位点之间移动质子(这一点与EVB不同), 因此你实际上需要为分子中的每个可滴定位点选择质子化状态.

通过对初始结构进行标准的pKa计算, 可以很好地估计出分子的初始质子化状态. 这是一种常规做法, 主要利用连续介质静电方法计算质子化自由能(例如, 可以使用[MEAD](http://www.teokem.lu.se/~ulf/Methods/mead.html), [UHBD](http://adrik.bchs.uh.edu/uhbd.html), [DelPhi](http://wiki.c2b2.columbia.edu/honiglab_public/index.php/Software:DelPhi), [APBS](http://apbs.sourceforge.net/)等程序), 并使用蒙特卡罗方法对质子化状态进行采样(例如, 可以使用[REDTI](http://www.msg.ucsf.edu/local/programs/mead/mead.html), [PETIT](http://www.itqb.unl.pt/Research/Associated_Lab/Molecular_Simulation/Resources/?link=1)). 不幸的是, 由于溶质的构象会随MD模拟的进行而变化, 并且在许多情况下存在强的质子化-构象耦合, 质子化状态可能会变得不够. 对此已经提出了几种解决方案, 但其中的大多数或多或少都是启发式的尝试. 真正令人满意的解决方案是采用恒pH的MD方法, 对此最近几年已经提出了一些方法. GROMACS用户邮件列表中对此进行过讨论(请注意, Phil Hunenberger的方法存在严重的理论问题). 不幸的是, 恒pH方法是最近才出现的, 并且仍处于开发和/或测试阶段. 希望它们在不久的将来会成为标准方法. 也许有一天你可以在GROMACS的.mdp文件中指定`pH = 7.0`, 然后在MD运行过程中就可以看到质子化状态的变化! 在此之前, 最好的解决方案可能是上面提到的: 使用标准pKa计算获得初始质子化状态的良好估计, 最后再通过MD快照进行检查.

Charlie Brooks和其他人开发了恒pH模拟的模型, 你可以使用它模拟质子从一个侧链转移到另一个侧链的过程. 到目前为止, 这种方法只能用于隐式溶剂(在CHARMM中也是如此).

还有其他几种恒pH的MD方法, 其中一些使用显式溶剂. Antonio Baptista组开发了一种基于随机质子化状态变化的恒pH MD方法(J. Chem. Phys. (2002) 117:4184). 尽管该方法使用了Poisson-Boltzmann方法来周期性地改变质子化状态, 但MM/MD模拟使用显式溶剂进行.

他们实际上使用GROMACS实现了这种随机恒pH MD方法(J. Phys. Chem. B(2006)110: 2927), 基本上就是一种断断续续的分段模拟方法, 使用bash和awk脚本将GROMACS与[MEAD](http://www.teokem.lu.se/~ulf/Methods/mead.html)(Don Bashford开发的PB求解器)和[MCRP](http://apo.ansto.gov.au/dspace/handle/10238/259)(使用蒙特卡罗方法对质子化状态进行采样的自研程序)组合起来. 不幸的是, 整个操作过程在某些地方过于混乱且难以定型, 使得它不适合整合到GROMACS中, 至少现在是这样.

Hunenberger提出了另一种仅基于MM/MD的显式溶剂方法(J. Chem. Phys. (2001)114: 9706), 但其理论基础似乎是错误的(J. Chem. Phys. (2002) 116:7766). 据我所知, 迄今为止提出的所有其他恒pH MD方法实际上都使用了隐式溶剂. McCammon(J. Comput. Chem. (2004) 25:2038)和Antosiewicz(Phys. Rev. E(2002)66: 051911)使用了隐式溶剂的随机方法, Baptista组还提出了一种分数电荷方法(Proteins (1997) 27: 523), 并使用隐式溶剂来加快计算速度. 所有这些方法都依赖于某种简化的静电方法(Poisson-Boltzmann模型, 广义Born模型等)来执行质子化状态计算. Brooks(Proteins (2004) 56:738)也提出了一种使用隐式溶剂的方法, 采用了一种不同但理论含糊的方法来考虑质子化效应.

有关可解离水模型的讨论, 可以参考这篇[论文](http://dx.doi.org/10.1021/jp072530o).

注: 以上内容来自GROMACS用户邮件列表中的一些电子邮件, 但大部分出自Antonio Baptista.
