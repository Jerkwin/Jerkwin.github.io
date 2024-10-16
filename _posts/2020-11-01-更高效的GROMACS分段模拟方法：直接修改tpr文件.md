---
 layout: post
 title: 更高效的GROMACS分段模拟方法：直接修改tpr文件
 categories:
 - 科
 tags:
 - gmx
---

- 2020-11-01 22:42:18

在以前的一篇文章中, 我简单说过[基于GROMACS的分段模拟方法](https://jerkwin.github.io/2018/04/09/%E5%AE%9E%E6%97%B6%E6%94%B9%E5%8F%98GROMACS%E6%8B%93%E6%89%91%E7%9A%84%E5%88%86%E6%AE%B5%E6%A8%A1%E6%8B%9F%E6%96%B9%E6%B3%95/). 这种方法非常通用, 几乎能完成任意的功能, 且无须修改源代码, 但是运行效率比较差, 因为每次运行`mdrun`都要重新生成tpr文件. 对大分子来说, 使用`grompp`生成tpr还是很耗时的, 可能会成为运行的瓶颈部分.

最近重新思考了一下这个问题, 想到, 在拓扑和模拟参数不变, 只有坐标或速度改变的情况下, 我们没有必要重新运行`grompp`生成tpr, 可以直接修改tpr中的坐标或速度, 然后使用修改过的tpr运行模拟. 这应该是不修改源代码情况下能做到的最快方法了. 与此类似的另一种方法是直接修改cpt文件, 可以达到同样的目的, 但适用情况有点不同.

tpr和edr文件都是二进制文件, 格式比较复杂, 完全弄明白且自如地修改它们并不容易, 但如果只是修改其中的一部分, 就要简单些.

对tpr的最简单修改应该是修改原子坐标了. 在体系拓扑不变的情况下, 利用外部程序修改体系中部分原子的坐标, 然后使用`mdrun`直接运行修改后的tpr文件, 就可以将`mdrun`当做一个引擎, 达到自己的目的.

这种方法的一个简单应用就是用GROMACS来做MC或对接, 刚性或柔性的都可以. 如果只是简单地计算下单点的能量, 就是刚性的; 如果进行能量最小化, 那就是柔性的. 更复杂的能量, 或许可以使用先进行能量最小化再模拟一段时间的平均能量, 甚至可以使用基于MM-PBSA的自由能. 这些都是可行的, 理论上也没有什么困难, 虽然效率可能不佳.

基于上面的想法, 我就尝试写了一个简单的MC程序, 用来搜索能量最低的构型. 拿一个小肽和石墨烯的体系做测试, 发现确实可以找到能量很低的构型. 这说明拿`mdrun`作为模拟引擎来实现自己的MC程序确实可行, 而且也比较简单, 只要关注MC移动部分就可以了, 能量计算, 构型优化都可以交由`mdrun`处理. 当然, 缺点在于效率可能不够好. 但对于普通体系来说, 效率可能也就够了, 没有必要弄得最高.

![](https://jerkwin.github.io/pic/gra-a7.gif)

## 待完善

1. 直接读取edr文件中的能量, 而不是log文件中的, 这样可能速度更好
2. MC移动中除平移, 旋转外, 增加其他操作, 如二面角改变
3. MC移动中监测移动的步长, 根据接受率调整步长, 使MC步骤更加高效
4. 其他MC中常用的一些做法
5. 试着修改tpr文件中的其他信息, 特别是拓扑相关的信息, 以期能够在运行中增删分子.
