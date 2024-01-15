---
 layout: post
 title: GROMACS使用amber19sb力场
 categories:
 - 科
 tags:
 - gmx
 - amber
---

- 2022-09-24 22:21:36

amber力场一直在更新, 目前最新的是amber19sb, 但gmx自带的amber力场却一直没有更新, 至今还是amber99sb. 虽然网上也有gmx格式的amber14sb力场(存在一个小问题, 但容易解决, 见[amber14SB力场报错“No default Improper Dih. types”的解决办法](https://zhuanlan.zhihu.com/p/389786141)), 但gmx格式的amber19sb力场我暂时还没有看到. 如果要在gmx中使用这个力场, 我觉得可以先使用amber工具生成amber拓扑, 再使用acpype之类的工具将其转换为gmx格式的拓扑. 这种解决方法能否真正走通, 我没有测试, 无法作答. 但即便可行, 其中也还有一个很难解决的问题, 就是amber19sb中的蛋白残基使用了cmap二面角, 而且还基于残基名称匹配, 这违背了传统力场的常规作法, 导致很难兼容. 网上对此也有不少讨论, 可供参考.

既然如此, 那就干脆放下那些投机取巧, 兜兜转转的作法吧, 暴虎冯河, 从根本上解决. 本质问题无非有两个:

1. 得到gmx格式的amber19sb力场;
2. 让gmx支持amber19sb力场的cmap.

前一个问题容易解决, 无非是个格式转换问题; 但后一个问题, 在不修改gmx源码的情况下, 恕我愚钝, 能想到的可行方法是修改tpr文件. 这种作法很困难, 也很麻烦, 不易掌握, 通用性也不好. 所以我觉得虽然修改gmx源码也很困难, 但更值得一试, 只要处理好了, 一劳永逸. 代价就是这只能是个特制的gmx版本. 当然, 如果gmx官方版本支持这种作法并更新到新版本中, 那是最理想的.

鉴于此, 我就自告奋勇, 试着创建一个gmx格式的amber19sb力场, 同时修改gmx源码以支持新型的cmap二面角.

于个人而言, 目的如下:

- 熟悉gmx力场目录的组织方式, rtp, hdb, cmap文件的创建方法
- 编写一个比较通用的脚本, 用于转换amber19sb力场到gmx格式, 稍加修改也可用于一般的amber力场, 甚至其他力场
- 阅读熟悉gmx源码, 尝试进行一些小的改动

于他人而言, 主要益处则是提供了一个gmx使用amber19sb力场的简单方法, 而无需学习amber工具的使用(得承认, amber工具我用得也不是很熟).

## 创建gmx格式的amber19sb力场文件

我们这里只转换蛋白的amber19sb力场文件. 为此, 先看看amber的原始力场文件.

如果安装了amber20, 打开`E:\amber20\dat\leap\cmd\leaprc.protein.ff19SB`(Windows下的路径, Linux下的类比可知), 这是amber19sb力场的调用文件, 内容如下:

<table class="highlighttable"><th colspan="2" style="text-align:left">leaprc.protein.ff19SB</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">  1
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
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>logFile leap.log
<span style="color: #008800; font-style: italic">#</span>
<span style="color: #008800; font-style: italic"># ----- leaprc for loading the ff19SB force field</span>
<span style="color: #008800; font-style: italic"># ----- NOTE: this is designed for PDB format 3!  用于 PDB 3 格式?</span>
<span style="color: #008800; font-style: italic">#</span>
<span style="color: #008800; font-style: italic">#	load atom type hybridizations  原子类型</span>
addAtomTypes <span style="color: #666666">{</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;H&quot;</span>   <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HO&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HS&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;H1&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;H2&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;H3&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;H4&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;H5&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HW&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HC&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HA&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HP&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;HZ&quot;</span>  <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;OH&quot;</span>  <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;OS&quot;</span>  <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;O&quot;</span>   <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;O2&quot;</span>  <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;OP&quot;</span>  <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;OW&quot;</span>  <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CT&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CX&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;XC&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;C8&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;2C&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;3C&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CH&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CS&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;C&quot;</span>   <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CO&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;C*&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CA&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CB&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CC&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CN&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CM&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CK&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CQ&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CD&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;C5&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;C4&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CP&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CI&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CJ&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CW&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CV&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CR&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CA&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;CY&quot;</span>  <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;C0&quot;</span>  <span style="color: #BB4444">&quot;Ca&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;MG&quot;</span>  <span style="color: #BB4444">&quot;Mg&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;N&quot;</span>   <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NA&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;N2&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;N*&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NP&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NQ&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NB&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NC&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NT&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;NY&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp2&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;N3&quot;</span>  <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;S&quot;</span>   <span style="color: #BB4444">&quot;S&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;SH&quot;</span>  <span style="color: #BB4444">&quot;S&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;P&quot;</span>   <span style="color: #BB4444">&quot;P&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;LP&quot;</span>  <span style="color: #BB4444">&quot;&quot;</span>  <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;EP&quot;</span>  <span style="color: #BB4444">&quot;&quot;</span>  <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;F&quot;</span>   <span style="color: #BB4444">&quot;F&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;Cl&quot;</span>  <span style="color: #BB4444">&quot;Cl&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;Br&quot;</span>  <span style="color: #BB4444">&quot;Br&quot;</span> <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
	<span style="color: #666666">{</span> <span style="color: #BB4444">&quot;I&quot;</span>   <span style="color: #BB4444">&quot;I&quot;</span>  <span style="color: #BB4444">&quot;sp3&quot;</span> <span style="color: #666666">}</span>
<span style="color: #666666">}</span>
<span style="color: #008800; font-style: italic">#</span>
<span style="color: #008800; font-style: italic">#	Load the main parameter set.  主参数集</span>
<span style="color: #008800; font-style: italic">#</span>
<span style="color: #AA22FF">set</span> default cmap on                         <span style="color: #008800; font-style: italic"># 启用了cmap, 转换时需要特殊处理</span>
<span style="color: #B8860B">parm19</span> <span style="color: #666666">=</span> loadamberparams parm19.dat         <span style="color: #008800; font-style: italic"># 基本参数</span>
<span style="color: #B8860B">frcmod19SB</span> <span style="color: #666666">=</span> loadamberparams frcmod.ff19SB  <span style="color: #008800; font-style: italic"># 修正参数, 覆盖基本参数</span>
<span style="color: #008800; font-style: italic">#</span>
<span style="color: #008800; font-style: italic">#	Load main chain and terminating amino acid libraries</span>
<span style="color: #008800; font-style: italic">#</span>
loadOff amino19.lib                         <span style="color: #008800; font-style: italic"># 主链残基数据库</span>
loadOff aminoct12.lib                       <span style="color: #008800; font-style: italic"># C端残基</span>
loadOff aminont12.lib                       <span style="color: #008800; font-style: italic"># N端残基</span>

<span style="color: #008800; font-style: italic">#</span>
<span style="color: #008800; font-style: italic">#	Define the PDB name map for the amino acids</span>
<span style="color: #008800; font-style: italic">#</span>
addPdbResMap <span style="color: #666666">{</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;HYP&quot;</span> <span style="color: #BB4444">&quot;NHYP&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;HYP&quot;</span> <span style="color: #BB4444">&quot;CHYP&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;ALA&quot;</span> <span style="color: #BB4444">&quot;NALA&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;ALA&quot;</span> <span style="color: #BB4444">&quot;CALA&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;ARG&quot;</span> <span style="color: #BB4444">&quot;NARG&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;ARG&quot;</span> <span style="color: #BB4444">&quot;CARG&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;ASN&quot;</span> <span style="color: #BB4444">&quot;NASN&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;ASN&quot;</span> <span style="color: #BB4444">&quot;CASN&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;ASP&quot;</span> <span style="color: #BB4444">&quot;NASP&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;ASP&quot;</span> <span style="color: #BB4444">&quot;CASP&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;CYS&quot;</span> <span style="color: #BB4444">&quot;NCYS&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;CYS&quot;</span> <span style="color: #BB4444">&quot;CCYS&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;CYX&quot;</span> <span style="color: #BB4444">&quot;NCYX&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;CYX&quot;</span> <span style="color: #BB4444">&quot;CCYX&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;GLN&quot;</span> <span style="color: #BB4444">&quot;NGLN&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;GLN&quot;</span> <span style="color: #BB4444">&quot;CGLN&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;GLU&quot;</span> <span style="color: #BB4444">&quot;NGLU&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;GLU&quot;</span> <span style="color: #BB4444">&quot;CGLU&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;GLY&quot;</span> <span style="color: #BB4444">&quot;NGLY&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;GLY&quot;</span> <span style="color: #BB4444">&quot;CGLY&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;HID&quot;</span> <span style="color: #BB4444">&quot;NHID&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;HID&quot;</span> <span style="color: #BB4444">&quot;CHID&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;HIE&quot;</span> <span style="color: #BB4444">&quot;NHIE&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;HIE&quot;</span> <span style="color: #BB4444">&quot;CHIE&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;HIP&quot;</span> <span style="color: #BB4444">&quot;NHIP&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;HIP&quot;</span> <span style="color: #BB4444">&quot;CHIP&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;ILE&quot;</span> <span style="color: #BB4444">&quot;NILE&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;ILE&quot;</span> <span style="color: #BB4444">&quot;CILE&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;LEU&quot;</span> <span style="color: #BB4444">&quot;NLEU&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;LEU&quot;</span> <span style="color: #BB4444">&quot;CLEU&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;LYS&quot;</span> <span style="color: #BB4444">&quot;NLYS&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;LYS&quot;</span> <span style="color: #BB4444">&quot;CLYS&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;MET&quot;</span> <span style="color: #BB4444">&quot;NMET&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;MET&quot;</span> <span style="color: #BB4444">&quot;CMET&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;PHE&quot;</span> <span style="color: #BB4444">&quot;NPHE&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;PHE&quot;</span> <span style="color: #BB4444">&quot;CPHE&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;PRO&quot;</span> <span style="color: #BB4444">&quot;NPRO&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;PRO&quot;</span> <span style="color: #BB4444">&quot;CPRO&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;SER&quot;</span> <span style="color: #BB4444">&quot;NSER&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;SER&quot;</span> <span style="color: #BB4444">&quot;CSER&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;THR&quot;</span> <span style="color: #BB4444">&quot;NTHR&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;THR&quot;</span> <span style="color: #BB4444">&quot;CTHR&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;TRP&quot;</span> <span style="color: #BB4444">&quot;NTRP&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;TRP&quot;</span> <span style="color: #BB4444">&quot;CTRP&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;TYR&quot;</span> <span style="color: #BB4444">&quot;NTYR&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;TYR&quot;</span> <span style="color: #BB4444">&quot;CTYR&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;VAL&quot;</span> <span style="color: #BB4444">&quot;NVAL&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;VAL&quot;</span> <span style="color: #BB4444">&quot;CVAL&quot;</span> <span style="color: #666666">}</span>
  <span style="color: #666666">{</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;HIS&quot;</span> <span style="color: #BB4444">&quot;NHIS&quot;</span> <span style="color: #666666">}</span> <span style="color: #666666">{</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;HIS&quot;</span> <span style="color: #BB4444">&quot;CHIS&quot;</span> <span style="color: #666666">}</span>
<span style="color: #666666">}</span>

<span style="color: #008800; font-style: italic">#</span>
<span style="color: #008800; font-style: italic"># assume that most often proteins use HIE</span>
<span style="color: #008800; font-style: italic">#</span>
<span style="color: #B8860B">NHIS</span> <span style="color: #666666">=</span> NHIE
<span style="color: #B8860B">HIS</span> <span style="color: #666666">=</span> HIE
<span style="color: #B8860B">CHIS</span> <span style="color: #666666">=</span> CHIE</pre></div>
</td></tr></table>

### 力场参数文件

可以看到, 19sb中用于蛋白的原子类型并不多, 与99sb相比, 新增了几个原子类型, 如`CX`, `XC`, `C8`, `2C`, `3C`, `CO`等.

根据这个文件中的调用说明, 我们很容易找到

- `E:\amber20\dat\leap\parm\parm19.dat`
- `E:\amber20\dat\leap\parm\frcmod.ff19SB`

这两个文件中给出了原子类型, 成键, 非键, cmap参数, 需要将它们转换成相应的gmx的格式, 放到

- `E:\GMX2019.6\share\gromacs\top\amber19sb.ff\atomtypes.atp`
- `E:\GMX2019.6\share\gromacs\top\amber19sb.ff\ffbonded.itp`
- `E:\GMX2019.6\share\gromacs\top\amber19sb.ff\ffnonbonded.itp`
- `E:\GMX2019.6\share\gromacs\top\amber19sb.ff\cmap.itp`

转换时注意单位, 公式系数, 二面角换算, cmap处理. 其中的二面角处理尤其需要仔细参考amber手册中的相关说明. 还有就是, 相同成键项存在多套参数时, 优先使用`frcmod.ff19SB`中的参数.

### 残基数据库

接下来, 处理氨基酸残基. 以主链残基为例吧, 末端残基处理方式相同. 根据调用说明, 查看`E:\amber20\dat\leap\lib\amino19.lib`:

<table class="highlighttable"><th colspan="2" style="text-align:left">amino19.lib</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height:125%">  1
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
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span><span style="color: #008800; font-style: italic">!!index array str 本文件中的所有残基, 28个</span>
 <span style="color: #BB4444">&quot;ALA&quot;</span>
 <span style="color: #BB4444">&quot;ARG&quot;</span>
 <span style="color: #BB4444">&quot;ASH&quot;</span>
 <span style="color: #BB4444">&quot;ASN&quot;</span>
 <span style="color: #BB4444">&quot;ASP&quot;</span>
 <span style="color: #BB4444">&quot;CYM&quot;</span>
 <span style="color: #BB4444">&quot;CYS&quot;</span>
 <span style="color: #BB4444">&quot;CYX&quot;</span>
 <span style="color: #BB4444">&quot;GLH&quot;</span>
 <span style="color: #BB4444">&quot;GLN&quot;</span>
 <span style="color: #BB4444">&quot;GLU&quot;</span>
 <span style="color: #BB4444">&quot;GLY&quot;</span>
 <span style="color: #BB4444">&quot;HID&quot;</span>
 <span style="color: #BB4444">&quot;HIE&quot;</span>
 <span style="color: #BB4444">&quot;HIP&quot;</span>
 <span style="color: #BB4444">&quot;HYP&quot;</span>
 <span style="color: #BB4444">&quot;ILE&quot;</span>
 <span style="color: #BB4444">&quot;LEU&quot;</span>
 <span style="color: #BB4444">&quot;LYN&quot;</span>
 <span style="color: #BB4444">&quot;LYS&quot;</span>
 <span style="color: #BB4444">&quot;MET&quot;</span>
 <span style="color: #BB4444">&quot;PHE&quot;</span>
 <span style="color: #BB4444">&quot;PRO&quot;</span>
 <span style="color: #BB4444">&quot;SER&quot;</span>
 <span style="color: #BB4444">&quot;THR&quot;</span>
 <span style="color: #BB4444">&quot;TRP&quot;</span>
 <span style="color: #BB4444">&quot;TYR&quot;</span>
 <span style="color: #BB4444">&quot;VAL&quot;</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.atoms table  str name  str type  int typex  int resx  int flags  int seq  int elmnt  dbl chg</span>
<span style="color: #008800; font-style: italic">! ALA 残基, 原子名称, 原子类型, 电荷</span>
 <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">1</span> <span style="color: #666666">7</span> <span style="color: #666666">-0.415700</span>
 <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">2</span> <span style="color: #666666">1</span> <span style="color: #666666">0.271900</span>
 <span style="color: #BB4444">&quot;CA&quot;</span> <span style="color: #BB4444">&quot;XC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">3</span> <span style="color: #666666">6</span> <span style="color: #666666">0.033700</span>
 <span style="color: #BB4444">&quot;HA&quot;</span> <span style="color: #BB4444">&quot;H1&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">4</span> <span style="color: #666666">1</span> <span style="color: #666666">0.082300</span>
 <span style="color: #BB4444">&quot;CB&quot;</span> <span style="color: #BB4444">&quot;CT&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">5</span> <span style="color: #666666">6</span> <span style="color: #666666">-0.182500</span>
 <span style="color: #BB4444">&quot;HB1&quot;</span> <span style="color: #BB4444">&quot;HC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">6</span> <span style="color: #666666">1</span> <span style="color: #666666">0.060300</span>
 <span style="color: #BB4444">&quot;HB2&quot;</span> <span style="color: #BB4444">&quot;HC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">7</span> <span style="color: #666666">1</span> <span style="color: #666666">0.060300</span>
 <span style="color: #BB4444">&quot;HB3&quot;</span> <span style="color: #BB4444">&quot;HC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">8</span> <span style="color: #666666">1</span> <span style="color: #666666">0.060300</span>
 <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">9</span> <span style="color: #666666">6</span> <span style="color: #666666">0.597300</span>
 <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">1</span> <span style="color: #666666">131072</span> <span style="color: #666666">10</span> <span style="color: #666666">8</span> <span style="color: #666666">-0.567900</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.atomspertinfo table  str pname  str ptype  int ptypex  int pelmnt  dbl pchg</span>
 <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #BB4444">&quot;N&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #BB4444">&quot;H&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;CA&quot;</span> <span style="color: #BB4444">&quot;XC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;HA&quot;</span> <span style="color: #BB4444">&quot;H1&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;CB&quot;</span> <span style="color: #BB4444">&quot;CT&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;HB1&quot;</span> <span style="color: #BB4444">&quot;HC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;HB2&quot;</span> <span style="color: #BB4444">&quot;HC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;HB3&quot;</span> <span style="color: #BB4444">&quot;HC&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #BB4444">&quot;C&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
 <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #BB4444">&quot;O&quot;</span> <span style="color: #666666">0</span> <span style="color: #666666">-1</span> <span style="color: #666666">0.0</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.boundbox array dbl</span>
 <span style="color: #666666">-1.000000</span>
 <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.childsequence single int</span>
 <span style="color: #666666">2</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.connect array int</span>
 <span style="color: #666666">1</span>
 <span style="color: #666666">9</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.connectivity table  int atom1x  int atom2x  int flags</span>
<span style="color: #008800; font-style: italic">! 成键连接, 用于推断成键项</span>
 <span style="color: #666666">1</span> <span style="color: #666666">2</span> <span style="color: #666666">1</span>
 <span style="color: #666666">1</span> <span style="color: #666666">3</span> <span style="color: #666666">1</span>
 <span style="color: #666666">3</span> <span style="color: #666666">4</span> <span style="color: #666666">1</span>
 <span style="color: #666666">3</span> <span style="color: #666666">5</span> <span style="color: #666666">1</span>
 <span style="color: #666666">3</span> <span style="color: #666666">9</span> <span style="color: #666666">1</span>
 <span style="color: #666666">5</span> <span style="color: #666666">6</span> <span style="color: #666666">1</span>
 <span style="color: #666666">5</span> <span style="color: #666666">7</span> <span style="color: #666666">1</span>
 <span style="color: #666666">5</span> <span style="color: #666666">8</span> <span style="color: #666666">1</span>
 <span style="color: #666666">9</span> <span style="color: #666666">10</span> <span style="color: #666666">1</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.hierarchy table  str abovetype  int abovex  str belowtype  int belowx</span>
 <span style="color: #BB4444">&quot;U&quot;</span> <span style="color: #666666">0</span> <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">1</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">2</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">3</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">4</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">5</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">6</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">7</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">8</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">9</span>
 <span style="color: #BB4444">&quot;R&quot;</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;A&quot;</span> <span style="color: #666666">10</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.name single str</span>
 <span style="color: #BB4444">&quot;ALA&quot;</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.positions table  dbl x  dbl y  dbl z</span>
<span style="color: #008800; font-style: italic">! 每个原子的坐标, gmx不需要, 但可用于补全蛋白, 构建多肽</span>
 <span style="color: #666666">3.325770</span> <span style="color: #666666">1.547909</span> <span style="color: #666666">-1.607204E-06</span>
 <span style="color: #666666">3.909407</span> <span style="color: #666666">0.723611</span> <span style="color: #666666">-2.739882E-06</span>
 <span style="color: #666666">3.970048</span> <span style="color: #666666">2.845795</span> <span style="color: #666666">-1.311163E-07</span>
 <span style="color: #666666">3.671663</span> <span style="color: #666666">3.400129</span> <span style="color: #666666">-0.889820</span>
 <span style="color: #666666">3.576965</span> <span style="color: #666666">3.653838</span> <span style="color: #666666">1.232143</span>
 <span style="color: #666666">3.877484</span> <span style="color: #666666">3.115795</span> <span style="color: #666666">2.131197</span>
 <span style="color: #666666">4.075059</span> <span style="color: #666666">4.623017</span> <span style="color: #666666">1.205786</span>
 <span style="color: #666666">2.496995</span> <span style="color: #666666">3.801075</span> <span style="color: #666666">1.241379</span>
 <span style="color: #666666">5.485541</span> <span style="color: #666666">2.705207</span> <span style="color: #666666">-4.398755E-06</span>
 <span style="color: #666666">6.008824</span> <span style="color: #666666">1.593175</span> <span style="color: #666666">-8.449768E-06</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.residueconnect table  int c1x  int c2x  int c3x  int c4x  int c5x  int c6x</span>
 <span style="color: #666666">1</span> <span style="color: #666666">9</span> <span style="color: #666666">0</span> <span style="color: #666666">0</span> <span style="color: #666666">0</span> <span style="color: #666666">0</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.residues table  str name  int seq  int childseq  int startatomx  str restype  int imagingx</span>
 <span style="color: #BB4444">&quot;ALA&quot;</span> <span style="color: #666666">1</span> <span style="color: #666666">11</span> <span style="color: #666666">1</span> <span style="color: #BB4444">&quot;p&quot;</span> <span style="color: #666666">0</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.residuesPdbSequenceNumber array int</span>
 <span style="color: #666666">0</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.solventcap array dbl</span>
 <span style="color: #666666">-1.000000</span>
 <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span>
<span style="color: #008800; font-style: italic">!entry.ALA.unit.velocities table  dbl x  dbl y  dbl z</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>
 <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span> <span style="color: #666666">0.0</span>

<span style="color: #008800; font-style: italic">! ALA 结束, 开始下一个 ARG, 格式类似</span>
<span style="color: #008800; font-style: italic">!entry.ARG.unit.atoms table  str name  str type  int typex  int resx  int flags  int seq  int elmnt  dbl chg</span>
... ...</pre></div>
</td></tr></table>

19sb中蛋白残基种类总数为28, 除20种天然氨基酸残基及其不同质子化状态外, 还有一个非标准残基`HYP`. 每种残基的所有信息都已列出, 只要将这些信息处理一下, 就可以将其转换成

- `E:\GMX2019.6\share\gromacs\top\amber19sb.ff\aminoacids.rtp`
- `E:\GMX2019.6\share\gromacs\top\amber19sb.ff\aminoacids.hdb`

中的信息.

将结果与gmx自带的99sb, 或网上的14sb对比一下, 可以看到大部分都是一样的, 只有少量不同.

至于力场目录中的其他文件, 因为关系不大, 直接使用旧的就好了.

19sb的推荐使用的水模型是4位点OPC, 所以最好把这个水模型也一起放到力场文件中以方便使用.

## 修改gmx源码以支持amber19sb的CMAP

> I have made this longer than usual because I have not had time to make it shorter.
>
> ---- Blaise Pascal

可行的修改方法无穷无尽, 我遵循最小改动原则, 改动越小越好, 因为改动越多越容易出bug, 也越容易引起兼容性问题. 可惜的是改动越小, 所花时间越多.

> For the sake of brevity, I use the term "rays" and more especially "X rays" in order to distinguish them from others.
>
> ---- Wilhelm Conrad Rontgen

我就以自己熟悉并常用的gmx2019.6版本进行修改, 为避免与原始gmx想混淆, 我就称修改后的版本为`gromacsX`, 简写`gmxx`, 倒也合适, 因为我不知道后面还会有什么改动, 所以就留个未知数. 当然, 这个名称也有碰瓷的嫌疑.

gmx对cmap的支持并不好, 如果够好的话, 我们也就不需要改源码了. 对于其他成键项, 拓扑处理时都是支持`#define`宏定义的, 但cmap什么都不支持, 只有一个函数类型, 默认为`1`, 处理拓扑时这个函数类型也没有用到. 不过这恰好给我们留下了可操作的空间. 我们可以将其改为支持任意数字, 并通过相应的数字对应到到不同的cmap数据就可以达到目的了. 这样修改的话, 对使用cmap的charmm力场文件也要做相应的调整.

这样看下来, 要修改的源代码有两处:

- `F:\gromacs2019.6\src\gromacs\gmxpreprocess\toputil.cpp`: pdb2gmx生成top时忽略自动添加的cmap类型1
- `F:\gromacs2019.6\src\gromacs\gmxpreprocess\toppush.cpp`: 根据cmap类型确定要使用的cmap数据集

## 测试

准备好`amber19sb.ff`力场文件, 编译好`gmxx`, 之后用起来就和以前一样了. 当然, 将`gmxx`生成的tpr文件用于更高版本的gmx也是可行的.

更严格的测试需要针对各种蛋白体系, 分别用`gmxx`和`amber`计算能量和力, 检查在误差范围内是否一致. 这就先缓一缓吧. 因为我有点累了.
