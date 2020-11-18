---
 layout: post
 title: matlab和mathmatica的在线版
 categories:
 - 科
 tags:
 - 数理
---

- 2020-11-18 13:31:02

matlab和mathmatica我都用过, 前者用的多些, 因为需要处理的大多是数值计算, 只有涉及公式推导的时候才会用到后者. 这两个都是商业软件, 存在版权问题. 前段时间哈工大被禁用matlab还引起过一阵讨论.

matlab和mathmatica都很大, 安装并不方便. 但是它们都提供了在线版, 虽然速度不好, 但是胜在简单, 打开浏览器就可以使用, 运行小的测试或简单的代码很方便. 这些在线版理论上需要注册才能使用, 但是有时我们只想运行下简单的代码或测试, 不想注册, 也不想登录, 只希望将它们当做一个在线计算器. 这里我就分享下如何在不注册的情况下打开这两个软件的在线版. 当然, 这种作法的缺点是远程无法保存你的代码, 每次都需要你重新粘贴代码.

## matlab在线版

打开matlab的帮助页面, `https://www.mathworks.com/help/matlab/index.html`, 点击`Examples`

![](https://jerkwin.github.io/pic/online-matlab-1.png)

随便选一个示例, 就选绘图吧, 可以将这个当做在线的函数绘制器

![](https://jerkwin.github.io/pic/online-matlab-2.png)

然后`Try This Example`, 打开代码编辑页面

![](https://jerkwin.github.io/pic/online-matlab-3.png)

图还没出来呢, 那就`运行`一下

![](https://jerkwin.github.io/pic/online-matlab-4.png)

这下就有图了

![](https://jerkwin.github.io/pic/online-matlab-5.png)

测试下能否修改下3D图的表达式, 原来的图形长得这样

![](https://jerkwin.github.io/pic/online-matlab-6.png)

随便改改, 就长得丑了. 看来是成功的.

![](https://jerkwin.github.io/pic/online-matlab-7.png)

基本上, 每个matlab命令都有示例, 因此可以直接在相关命令示例代码基础上进行测试.

## mathmatica在线版

打开wolfram alpha, `https://www.wolframalpha.com/`. 点`Example`

![](https://jerkwin.github.io/pic/online-mma-1.png)

随便选个, 就选`Algebra`吧

![](https://jerkwin.github.io/pic/online-mma-2.png)

再选第一个解方程, 点击`=`

![](https://jerkwin.github.io/pic/online-mma-3.png)

会打开新的页面, 鼠标移到输入命令的地方, 出现`Plain Text`, 然后`Continue in computable notebook`

![](https://jerkwin.github.io/pic/online-mma-4.png)

这样就打开了一个临时的Notebook. 点击`File | New Notebook`可以新建一个notebook, 在里面输入mathmatica代码了.

![](https://jerkwin.github.io/pic/online-mma-5.png)

其实也不用像上面那样麻烦地操作. 直接在`https://www.wolframalpha.com/`的输入框中输入一些简单的表达式, 如`sin(x)`, 然后回车, `Plain Text | Continue in computable notebook`即可. 给出上面的麻烦操作, 只是为了和matlab的方式保持一致, 此外也方便查看一下函数的用法.

测试下能否正常使用mathmatica. 以我最近需要用到的正多面体坐标为例, 输入`PolyhedronData["Tetrahedron", "VertexCoordinates"]`, 然后`Shift + Enter`, 给出了正四面体的精确坐标. 我们可以用`//N`将精确坐标转换为数值方便使用.

![](https://jerkwin.github.io/pic/online-mma-6.png)

也可以转换下格式, 使用传统的方式表达坐标, 更方便直接复制

![](https://jerkwin.github.io/pic/online-mma-7.png)

![](https://jerkwin.github.io/pic/online-mma-8.png)

mathmatica支持中文, 每个函数都有提示, 用起来比matlab舒服些.

## 题外

在搜索相关资料的时候, 发现清华的几个学生10多年前曾写过一个类似mathmatica的东西, maTHmU, 但终于不成气候.

maTHmU作者之一 谢凌曦 的一点说明见[如果中国重新开发像MATLAB、solidworks这样的软件大概需要多久？](https://www.zhihu.com/question/400835896) 这个问题下面的很多回答值得思考.

maTHmU项目后来就停止了, 变成了[Lab μ](https://www.zhihu.com/question/41568669/answer/91505002). 但还有些人记得, 问[mathμ(计算机代数系统)项目还在继续吗？](https://www.zhihu.com/question/22238249)

maTHmU项目的文档整理了一本书, [计算机代数系统的数学原理](https://book.douban.com/subject/5346530/), 具体内容见[计算机如何做符号运算？](https://www.zhihu.com/question/20774801/answer/1066954831)中的回答.

正像我说的, 我们需要有情怀, 但不能单靠情怀活着, 既要抬头仰望星空, 也要低头看路, 踏实走下去. 或许, 这就是现实理想主义者吧.
