---
 layout: post
 title: 使用GROMACS msd模块的几个注意事项
 categories:
 - 科
 tags:
 - gmx
---

- 2020-10-23 21:51:38

将gmx的`msd`模块用于其他程序所给的轨迹并计算扩散系数, 一般而言是可能的, 但有几个地方需要注意:

- 最好使用连续的轨迹, 也就是代表了原子真实扩散的轨迹

- 如果所用模拟轨迹没有移除质心运动, 那么要使用`-rmcomm`选项移除系统的质心运动, 否则所得msd曲线含有二次项成分

- 从头算或第一原理模拟所得轨迹一般比较短, 对于这种短时间的轨迹, `msd`模块`-trestart`选项默认的时间间隔10 ps过大, 直接使用会导致得到的msd曲线不平滑, 甚至出现阶跃. 在计算量允许的情况下, 建议使用原始轨迹的时间步长作为间隔, 这样可以利用所有的数据, 虽然理论上而言, 时间间隔多小时相关性很大.

许楠给出了[处理cp2k轨迹的一个例子](https://mp.weixin.qq.com/s?__biz=MzI2OTQ4OTExOA==&mid=2247487235&idx=1&sn=d0b81f1472f2eac5f6321c96565b17a7&chksm=eadec9b2dda940a4e12431949d49707a568f66b5dc045f8afdb830fdc02d405ee6ff61465921&mpshare=1&scene=23&srcid=1019zlBrov0a8tdcsMCrmjPQ&sharer_sharetime=1603116067167&sharer_shareid=238241eab6cbe265f857d12dfd748331#rd). 模拟时间步长0.5 fs, 轨迹总长度15.54450 ps, 轨迹连续且没有移除质心运动. 如果直接使用`msd`默认选项

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">gmx</span> msd <span style="color:#666">-f</span> traj.gro <span style="color:#666">-n</span></pre></div>

所得曲线如下

![](https://jerkwin.github.io/pic/msd-1.png)

可以看到, 二次项比较明显, 说明轨迹未移除系统质心运动. 此外, 5 ps左右出现阶跃, 让人生疑. 如果不是出现了这个不连续的阶跃, 反倒让人以为计算一切正常, 从而得到的错误的结果.

我们先移除质心运动

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">gmx</span> msd <span style="color:#666">-f</span> traj.gro <span style="color:#666">-n</span> <span style="color:#666">-rmcomm</span></pre></div>

结果如下

![](https://jerkwin.github.io/pic/msd-2.png)

可以看到, 二次项不再明显了. 但5 ps左右的阶跃仍然存在.

![](https://jerkwin.github.io/pic/msd-3.png)

经过几次测试, 并对比其他msd计算程序的结果, 最终才发现, 原来是`-trestart`选项的默认值过大导致的. 15 ps长度的轨迹, 如果默认间隔时间10 ps, 那么间隔为5 ps处, 只有1个数据可用, 误差太大, 导致曲线不连续. 话虽这样说, 但是还有一个问题没有解释, 就是为什么更长间隔处的数据看起来也比较正常, 没有出现明显阶跃呢? 这个就作为习题吧, 因为我也不知道答案.

我们使用原始轨迹的时间步长作为间隔

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">gmx</span> msd <span style="color:#666">-f</span> traj.gro <span style="color:#666">-n</span> <span style="color:#666">-rmcomm</span> <span style="color:#666">-trestart</span> 0.0005</pre></div>

结果如下

![](https://jerkwin.github.io/pic/msd-4.png)

这下看起来就比较正常了.

至于如何根据msd曲线计算扩散系数, 这里就不说了, 请参考以前的一篇文章[MSD算扩散系数的几种方法](https://jerkwin.github.io/2018/07/19/MSD%E7%AE%97%E6%89%A9%E6%95%A3%E7%B3%BB%E6%95%B0%E7%9A%84%E5%87%A0%E7%A7%8D%E6%96%B9%E6%B3%95/).
