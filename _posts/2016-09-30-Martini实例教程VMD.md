---
 layout: post
 title: Martini粗粒化力场使用手册：4　实例教程　VMD
 categories:
 - 科
 tags:
 - gmx
 - martini
---

- 发布: 2016-09-30 15:21:46; 翻译: 王河洛; 校对: 李继存

## 使用VMD可视化Martini体系

VMD是一个分子可视化程序, 它采用三维图形技术以及内置脚本来对生物大分子体系进行展示, 动画制作和分析. VMD官方网站 <http://www.ks.uiuc.edu/Research/vmd/>.

在本模块中, 我们会介绍一些与粗粒化体系可视化相关的VMD命令. 此外, 我们还向读者提供一些有助于CG体系可视化的Tcl脚本. 这些脚本及其说明文档可从Martini网页的链接中下载 <http://md.chem.rug.nl/cgmartini/index.php/tools2/visualization>

另外, Bendix是VMD中用于展示粗粒化(Martini)结构的一个非常有用的工具. 以下链接提供了一个十分不错的Bendix教程: <http://sbcb.bioch.ox.ac.uk/Bendix/>.

【王河洛 注】 VMD 1.9.2 以及之后的版本自带了Bendix插件, 可在菜单`Extansions | Visualization`中找到, 无需重新下载安装.

### 一些基础知识

VMD的"表现理念": 为展示和分析任意一组原子, 分子, 或蛋白质链等组成的对象, 我们首选需要通过一个"表示(representation)"来选择这个对象, 表示由与对象相关的关键词来定义(这种处理方式与GROMACS中的`make_ndx`相似). 例如, 对全原子体系, VMD可通过`protein`, `chain`, `hydrogen`以及`solvent`等关键词实现处理对象的选择. 一些更一般的关键词可用于展示非常规的体系(如粗粒化体系). 相关用法可参考[VMD手册](http://www.ks.uiuc.edu/Research/vmd/current/ug/).

【王河洛 注】 这个概念个人感觉称之为"原子选择语法"更为合适, 就是指在程序的操作中如何选择自己需要的粒子或粒子团. 在CHARMM, AMBER与GROMACS软件的操作中都有相似的概念, 但语法各有不同.

下面是一些例子:

1. 若体系中有POPC, 如果只选择体系中的脂质POPC则输入: `resname POPC`; 只选择每个脂质中的某一部分: `resname POPC and name "C.*.A" "C.*.*.B" "D.*.A" "D.*.B"`可以选择脂质中尾端原子(如`C1A`与`C1B`原子), `resname POPC and name NC3 PO4 "GL.*"`则选择头基原子.
2. 只选择蛋白质主链上的珠子: `name BB`(对老版本的FG-to-CG脚本使用`BB.*`或`BAS`)
3. 在极化水溶液中去除溶剂分子(水/盐珠子): `not resname W WF ION or WP`.
4. 只显示带正电荷的残基(Martini力场): `resname LYS ARG`. (注: 这个语句并不是选择带正电荷的残基, 而是在Martini力场中LYS与ARG残基带正电荷. 一般情况下应使用`charge>0`)
5. 显示特定的残基周围的水合壳层: `within 7.0 of (index 531 to 538)`.
6. 显示头部与相同的特定残基相互作用的所有脂质分子(DPPC除外): `same resid as ((within 7.0 of (index 531 to 538)) and name NC3 PO4 "GL.*") and not resname DPPC`.

正如上面这些例子所示, 所有这些关键词都可以与`and`, `or`, `not`等逻辑连接词一起使用, 达到选择所需对象的目的. 自己尝试下! 不过VMD运行时需要较多的内存. 节省VMD所用内存的一个小技巧是, 加载仅含有要分析珠子的结构或轨迹. 这可以通过使用GROMACS的`trjconv`程序对轨迹进行提取与预处理来实现. (【王河洛 注】 也可以使用VMD的catdcd程序). 当我们模拟越来越大的体系时, 包含的珠子也越来越多, 使用仅显示所需珠子这个技巧可以提高VMD的显示/处理轨迹的速度(例如, 只加载双层的头基). 记住, 你可以在任何需要的时候将当前的可视化状态保存为`state.vmd`文件. 这个文件由Tcl命令组成, 借助这些命令就可以重新获得当前的显示效果. 不过需要注意的是, 键的列表以及绘图(如圆柱)并不会被保存. 但你可以打开之前保存的`.vmd`文件, 在文件的最后手动添加用于创建它们的命令.

### CG键/约束与弹性网络

当使用VMD打开一个CG结构/轨迹时, VMD会根据默认的距离条件和原子数据库中提供的键长数据(来自相同开发组使用的NAMD力场), 自动判断并生成成键网络. 对于CG珠子, 默认的平均键长为0.35 nm, 在VMD的自动算法中没有定义, 这样VMD最后不可避免地将体系显示为一堆散乱的点, 肉眼难以(或不可能?)正确辨识. 因此, 在Martini的网站上, 我们提供了一个[Tcl脚本cg_bonds](www.cgmartini.nl/images/tools/VMD/cg_bonds.tcl), 它可以读取CG体系`.itp/.tpr`文件中的键和约束信息, 并重写CG成键网络使其显示正常.

![](/martini/vmd_pnt.png)

首先, 确保系统可以正常读取脚本文件:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #AA22FF">source</span> /路径/cg_bonds.tcl
</pre></div>

之后, 这个脚本就可以在VMD的命令行窗口中调用:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">cg_bonds -top system.top -topoltype <span style="color: #BB4444">&quot;elastic&quot;</span>
</pre></div>

![](/martini/vmd_bnd.png)

上面的命令假定你只有一个`.top`文件, GROMACS程序无法使用. 如果你的机器上安装了GROMACS, 有可以使用`.tpr`文件来替代:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">cg_bonds -gmx /路径/gmxdump -tpr dyn.tpr -net <span style="color: #BB4444">&quot;elastic&quot;</span> -cutoff 12.0 -color <span style="color: #BB4444">&quot;orange&quot;</span> -mat <span style="color: #BB4444">&quot;AOChalky&quot;</span> -res <span style="color: #666666">12</span> -rad 0.1
</pre></div>

![](/martini/vmd_zoom.png)

最后的命令会根据所给的选项(截断cutoff, 颜色color, 材质mat, 分辨率res和半径rad)绘制ElNeDyn网络, 其中珠子间成键信息来自`dyn.tpr`文件(这是为什么要需要`gmxdump`的原因). 注意: 你的GROMACS版本要与`dyn.tpr`文件兼容.

### 二级结构的可视化

可以显示CG力场的成键和约束后, 下一步就是观察蛋白质的二级结构. 我们目前正在开发一个用于绘制类VMD cartoon图形的图形化脚本. 这个脚本仍在开发中, 还需要一些改进. 对此, 我们十分期待你的建议.

在此, 我们先行提供`cg_secondary_structure.tcl`脚本供你使用, 其中包含`cg_helix`与`cg_sheet`两个主要命令:

这两个命令的使用格式相同:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">cg_whatever <span style="color: #666666">{</span>list of terminig<span style="color: #666666">}</span> <span style="color: #666666">[</span>-graphical options<span style="color: #666666">]</span>
</pre></div>

我们来看个例子:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">cg_helix <span style="color: #666666">{{5</span> 48<span style="color: #666666">}</span> <span style="color: #666666">{120</span> 146<span style="color: #666666">}}</span> -hlxmethod <span style="color: #BB4444">&quot;cylinder&quot;</span> -hlxcolor <span style="color: #BB4444">&quot;red&quot;</span> -hlxrad 2.5
</pre></div>

这个命令将以0.25 nm半径的红色圆柱展示两个螺旋结构, 它们分别对应于蛋白质中序号为5到48, 120到146的残基. 如果需要了解脚本的所有选项及其默认值, 可以查看其帮助文档或网页. 命令选项中`list of terminig`(端基列表)的定义方式有两种: i) 自己提供列表(如上例所示), ii) 读取或解析由`do_dssp`程序生成的文件. 对第二个方式, 你不需要提供任何端基, 但命令行中的`list of termini`选项依然需要输入一个空列表`{}`以让程序运行.

需要注意的是, 由于粗粒化结构所携带的信息有限, 所得图像的精美程度和精确度有限.
