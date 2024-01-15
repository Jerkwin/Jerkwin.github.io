---
 layout: post
 title: GROMACS的耗散粒子动力学DPD模拟
 categories:
 - 科
 tags:
 - gmx
---

- 2018-02-25 22:57:43

当前最新版本的GROMACS(2018)不支持DPD模拟, 如果非要寻求基于GROMACS的解决方案, 大致有两种:

1. 使用`dpdmacs`. 它其实是一个独立的程序, 但使用的输入文件格式与GROMACS一致, 输出轨迹格式也一致, 有GROMACS基础的话非常容易上手使用. 但支持的相互作用的函数形式只有简谐势, 如果有其他函数形式, 需要自己改代码.
	该程序未见在论文中使用. 目前网上能找到的版本有两个: [2005年的原始版本](http://www.apmaths.uwo.ca/~mkarttu/dpdmacs.shtml), [2011年的改进版本](https://gitorious.org/dpdmacs/dpdmacs?p=dpdmacs:dpdmacs.git;a=tree;h=refs/heads/master;hb=refs/heads/master). 前一版本使用传统的`configur`, `make`方式编译安装, 后一版本改为`cmake`方式编译安装, 并增加了重启计算功能, 删除了一些测试代码.
2. GROMACS 4.0.7版本的DPD补丁, 此补丁未被GROMACS整合, 但仍能在网上找到.

虽然也能找到一些类似DPD的文章, 但目前GROMACS对实现DPD并不热衷. 我觉得主要原因在于目前大多以粗粒化方式代替DPD, 效果可能更好. 但考虑到GROMACS的应用领域, 最好还是能实现一个DPD热浴, 以方便使用.

### 网络资料

- [DPD in Groamcs](https://www.mail-archive.com/gromacs.org_gmx-users@maillist.sys.kth.se/msg29299.html)
- [DPD Thermostat](https://redmine.gromacs.org/issues/1885)
- [DPD thermostat](http://gmx-developers.gromacs.narkive.com/x0TpADmP/dpd-thermostat)
- [stochastic dynamics, langevin](https://www.mail-archive.com/search?l=gmx-users@gromacs.org&q=subject:%22RE%5C%3A+%5C%5Bgmx%5C-users%5C%5D+stochastic+dynamics+%2C+langevin%22&o=newest&f=1)
- [DPDmacs学习笔记之一-安装](http://chemiandy.lofter.com/post/1d254b22_69a171e)

