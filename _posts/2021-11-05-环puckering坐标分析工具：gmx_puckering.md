---
 layout: post
 title: 环puckering坐标分析工具：gmx_puckering
 categories:
 - 科
 tags:
 - gmx
---

- 2021-11-05 21:20:09

学过化学的人大致都记得, 环己烷是六元环, 它有两种主要的构象, 船式和椅式. 这两种构象之间是可以相互转化的. 我还记得, 上课时老师还拿模型给我们演示过, 怎么通过扭转碳原子将一种构象转换为另一种. 后来我自己好像也试过, 转换是可以转换过去, 但这个过程中各个原子具体怎么动的, 我却缺乏直观的想象. 那时也曾想过, 或许应该能用一些参数来表征这种转换过程吧. 至于到底要用什么样的参数, 如何表征, 因为和自己的工作关系不大, 也就没有上心去查查证思考了.

现在我知道了, 这个问题早在我出生之前就已经解决了, 尽管我上大学时还对其一无所知. 对五元环或六元环的构象进行分析时, 常用的一类坐标是puckering坐标(或可译为折皱/褶皱/摺皱/扭折坐标, 就是不平整, 皱皱巴巴, 咕咕嘟嘟之类的意思). 这类坐标最初由Cremer和Pople提出(D. Cremer, J. A. Pople; J. Am. Chem. Soc. 97(6):1354-1358, 1975; 10.1021/ja00839a011), 所以在文献中常被称为CP坐标. 具体的含义和算法可阅读原文以及一些引用文献(如Lucian Chan, Geoffrey R. Hutchison, Garrett M. Morris; J. Chem. Inf. Model. 61(2):743-755, 2021; 10.1021/acs.jcim.0c01144).

现在, 我们很容易对各种含环的体系进行分子动力学模拟, 其中的糖类分子近年来很受关注. 而糖类分子中常见的是五元环的呋喃糖, 六元环的吡喃糖. 葡萄糖大概是吡喃糖中最为人熟知的吧. 要对模拟轨迹中糖环的构象进行分析, 我们可以计算CP坐标, 然后根据CP坐标, 将环的构象归结到IUPAC定义的38种正则构象之一.

既然想计算CP坐标, 那就要先调研一下, 看有没有现成的工具, 实在没有的话, 再自己想办法. 搜索一圈, 发现

- [GROMACS旧版工具`g_puckering`](): 最高支持到GROMACS4.x, 很久没有更新了.
- AMBER的`cpptraj`支持计算CP坐标, 但需要熟悉AMBER的使用及其输入格式.
- [Cremer的`ring`程序](https://sites.smu.edu/dedman/catco/ring-puckering.html): 总结了很好的说明, 除了计算CP坐标, 还有更多复杂的功能.
- [CP坐标在线计算器](http://enzyme13.bt.a.u-tokyo.ac.jp/CP/): 计算单个构型很方便, 但处理轨迹有点困难, 可用于程序间的相互验证.
- [python工具](https://pubs.acs.org/doi/10.1021/ci600492e): 来自一篇论文的附录. 这篇论文给出了另外一种表征环构象的方法, 也值得试试.
- [VMD的PaperChain显示模式](https://www.ks.uiuc.edu/Research/vmd/mailing_list/vmd-l/22496.html): 基于CP坐标实现的, 所以相应的源代码中计算了CP坐标, 只不过不修改源代码, 没有办法直接获取其值.

这类坐标的另一个用途是反过来, 根据相应的坐标生成指定构象的分子结构, 或者用于描述环的转变过程, 并计算其自由能形貌图(或曰景观图). 这方面的论文较多, 随意列出几篇吧:

- "On the calculation of puckering free energy surfaces", M. Sega, E. Autieri, F. Pederiva; J. Chem. Phys. 130(22):225102, 2009; 10.1063/1.3147642
- "Ring Puckering Landscapes of Glycosaminoglycan-Related Monosaccharides from Molecular Dynamics Simulations", Irfan Alibay, Richard A. Bryce; J. Chem. Inf. Model. 59(11):4729-4741, 2019; 10.1021/acs.jcim.9b00529
- "Pickett angles and Cremer–Pople coordinates as collective variables for the enhanced sampling of six-membered ring conformations", M. Sega, E. Autieri, F. Pederiva; Mol. Phys. 109(1):141-148, 2011; 10.1080/00268976.2010.522208

看了一圈之后, 选择很多, 但各有利弊, 可行是可行的, 完美是不可能完美的. 完美的工具只能出自自己之手, 所以只得撸起袖子, 将`g_puckering`这个年久失修的工具拾捡起来, 擦拭擦拭, 看看能不能修复一下, 物尽其用. 一则可以达到最终目的, 二则可以熟悉如何基于GROMACS已有框架编写分析工具. 断断续续, 磕磕绊绊磕磕, 也算完成了. 因为这个工具是基于GROMACS2019.6的, 所以就唤它作`gmx_puckering`.

## 待改进

- 参考VMD相关的代码, 支持任意大小的环
