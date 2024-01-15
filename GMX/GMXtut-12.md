---
 layout: post
 title: GROMACS教程：Xmgrace学习笔记
 categories:
 - 科
 tags:
 - gmx
---

* toc
{:toc}


- 整理: 李卫星; 补充: 李继存

对于用惯Windows]的人, 在Linux下画图有点不方便, gnuplot虽然挺不错, 但是不能直接在图上进行操作, 这是它的不足吧. 为此, 简单介绍一下xmgrace.

## 安装

### Linux系统

Linux下xmgrace可以直接用命令`sudo apt-get install xmgrace`来安装, 也可以下载软件包自己编译. 官网<http://plasma-gate.weizmann.ac.il/Grace/>.

[这里](/Prog/xmgrace.zip)有一个整理好的压缩包, 里面包含了xmgrace-5.1.25的源代码以及一些资料.

grace和xmgrace差不多, 具体区别自己看网上.

### Windows系统

如果你想在Windows下使用xmgrace, 那就需要你自己编译, 编译的时候可以借助于CygWin, 但根据网上的说法, 编译过程难度较大, 一般不建议初学者尝试. 幸运的是, 有人基于QT开发了一个[qtgrace](https://sourceforge.net/projects/qtgrace/), 与Linux下的xmgrace功能几乎一样, 建议你使用这个程序. 如果你不能在官网上下载qtgrace, 可以点击[压缩卷](/Prog/qtgrace.zip)和[压缩卷1](/Prog/qtgrace.z01)下载我整理好的一个版本. 下载后直接解压就可以使用了. 我在Windows XP 32位和Windows 7 64位系统上测试过, 都可以正常使用.

你可以在命令行中像使用xmgrace那样使用qtgrace, 但不是很方便. 一个更好的方法是更改数据文件(主要是`.xvg`文件)的打开方式, 将其改为`\qtgrace安装路径\bin\qtgrace.bat`或`\qtgrace安装路径\bin\qtgrace.exe`. 前者可以同时显示多列数据的图形, 而后者只能显示一列数据的图形. 建议你使用前者. 设置好打开方式后, 直接双击数据文件就可以看到数据图形了.

实际上, `qtgrace.bat`只不过是对qtgrace.exe进行了简单的封装, 指定了运行时使用`-nxy`选项而已. 如果你想使用自己的一些选项, 直接编辑`qtgrace.bat`即可.

<table class="highlighttable"><th colspan="2">qtgrace.bat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%">1
2</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">@<span style="color: #AA22FF; font-weight: bold">echo</span> off
qtgrace.exe -nxy <span style="color: #B8860B">%*</span>
</pre></div>
</td></tr></table>

## 一些资源

几个网址：

1. [Discussions讨论区](http://plasma-gate.weizmann.ac.il/Grace/phpbb/index.php?sid=df4c3ea5b571195761e69142e08939d3)
2. [An Xmgrace Tutorial](http://mintaka.sdsu.edu/reu/grace.tutorial.html#toc1)
3. [Grace Tutorials](http://plasma-gate.weizmann.ac.il/Grace/doc/Tutorial.html), 个人觉得这个是不错的
4. [Grace/Xmgrace (Xmgr)](http://math.nyu.edu/aml/software/xmgrace.html)
5. [Grace User's Guide](http://plasma-gate.weizmann.ac.il/Grace/doc/UsersGuide.html)

下载上面的grace-5.1.25后, Grace Tutorial教程实例文件在`grace-5.1.25/doc`下面（Tutorial.pdf也在）. 还有一些做好的图例在`grace-5.1.25/examples`, 从那里可以看到xmgrace也是可以的. 下面是随便挑的几张, 图片的的字体都是用xmgrace加上去的.

![](/GMX/xmgrace_1.png)

![](/GMX/xmgrace_2.png)

本文档主要是学习Grace Tutorials的总结, 如有不对, 请指正.

## 基本操作

### 1. 简单画图：使用数据文件

可以在工作目录下打开终端, 输入`xmgrace file`.

如果数据文件里面是多列数据, 即X Y1 Y2..., 可以输入`xmgrace -nxy  file`. 加上`-nxy`就可以是多条曲线了.

如果要对坐标轴取对数, 可以添加选项 `-log x|y|xy`, 如：`xmgrace -log x -nxy file`. （好像要放前面, 放后面会出错！）

### 2. 简单绘图：导入文件

也可以在终端只输入`xmgrace`, 不带文件名, 打开空白的xmgrace再自己导入. 点击菜单`Data | Import | ASCII`在`files`下拉框选择文件, 点一下`OK`就可以了.

注意, 好像只有扩展名为`.dat`的才显示, 而`.xvg`格式的不显示, 需要自己改一下扩展名. 还有就是, 如果文件路径有中文的话显示会出现乱码, 但仍然可以选择, 只要你确定哪个是你的文件.

### 3. 创建数据表格

也可以自己用表格创建绘图数据. 在终端输入`xmgrace`, 打开空白的xmgrace. 点击菜单`Main | Edit/Data_sets...`窗口, 在上面的空白框中, 一直右击按住出现菜单移动（右击还不要放开）, 选`creat new`选`in spreadsheet`（这里还有另外三个, 如编写公式输入, 你可以自己摸索或看手册）打开表格, 就可以输入x y点数值了.

### 4. 保存图像

画好了图片就保存, 点击`File | print_setup`, 在`device`选格式, 我常选`png`, 对不起的是好像没有`tiff`格式可选. 输入想要保存的名字, 点`aceept`退出窗口, 按一下快捷键`ctrl+p`就保存了. 其实也可以用`File | print`, 但最好记住快捷键. 看看目录内是否有图片文件.

xmgrace不像origin那样有什么工程文件, 它的设置不会自动保存, 所以你上一次对数据的操作是不会保存的. 这很麻烦. 所以如果我们以后还要对文件进行操作（如坐标轴, 曲线粗细不够的等问题）, 很麻烦, 其他的设置要重新做一遍. 为避免这些麻烦, 就得保存设置. 点击菜单`File | save`或`File | save as`. `File | save`直接把设置加入到你的数据文件开头, 自己操作完可以去看看. `File | save as`就是另存一份, 原数据文件开头添加设置. 如果开头保存有设置的话, 直接右击用xmgrace查看, 就可以看见你原来设置的图片. 你修改后, 重新`File | save`. 这样也有一些好处, 如果多个文件都是一样设置, 做好一个文件, 把设置保存到数据文件开头, 然后把它们复制到其他文件, 就搞定了, 然后再用xmgrace输出图片.

你可以去`grace-5.1.25/exemple`打开各个文件学习一下各种图是如何进行设置的.

### 5. 选择数据列

第一点说过如何使用`-nxy`选项绘制多列数据, 但如果只想用第1和第3列数据画图, 咋办? 可以使用`xmgrace -block file.dat -bxy 1:3`. 其中`-bxy`就是选1和3两列.
也可以在`-nxy`打开多条曲线后, 点击图上的曲线, 出现`set appearance`窗口, 在`select set`下, 选中不要的数据列, 长按右击移动选`hide`就可以了（数据列多的话, 就麻烦一些）;

说到这里, 说一下对文件的数据处理, 看示例：

	xmgrace -nosafe -nxy box.xvg -pexec "s0.y=(s0.y*s1.y)/64" -pexec "kill s1" -pexec "autoscale"

我的文件`box.xvg`中有三列数据, 时间帧、盒子x大小、盒子y大小, 计算膜表面的APL(area prea lipid)是用x*y/64. 用xmgrace怎么计算呢? 像上面那样用`-pexec`选项输入参数命令就可以了. 输出的图像就是x轴是时间, y轴是经过处理的得到的APL. 更具体的请看手册教程.

还是再说一些多列数据的情况. `data | Import/ASCII`选好dat文件后在中间那里看到`load as`了吧, 点一下选`block data`, 后点`ok`跳出来框框, `x from column`自己选`y from column`, 选好就可以. 如果都选1, 会是什么图像, 猜一下, xy都是一样的值, 当然是45度斜率的直线y=x. 那里可以选偏差条, 就是xydy, 自己摸索了.

### 6. 图像设置

数据选择操作说的差不多, 说一下图片的外观设置（也就是具体的坐标轴文字大小、间距、范围, 图片标题, 线条粗、细颜色等）. 我们可以双击相应的地方（和origin类似, 自己体会）也可以菜单里选择`plot | plot appearance`.

说一下一些基本的操作：

- `Legends`: 图例, 就是多条曲线时小框用不同颜色标记出来
- `frame`: 画出的图的框框
- `tick label`: 就是坐标的下面的坐标间隔标度1 2 3  4 5 6
- `tick mark`: 就是坐标轴的突起的刻度, 如 1 头上对应轴有个突起
- `leg.box`: 在标题窗口里面. 可以调整图例的位置, 里面的`location`设置就可以了
- `axis placement`: 用处在 y 轴 坐标在-1.5~1.5 范围时, 坐标轴若在y=-1.5 处 就去`zreo axis`点一下就可以了.

图像的四个角可以拉大拉小的, 如果不合适自己调.

如果有多条曲线, 出现了图例与曲线重叠, 可以试试这样操作：拖动图例的方法, `Ctrl+L`单击, 就可以使箭头变手形, 拖动图例了. 如还不行, 双击再试试看可以了吗. 也可以在`appearance`更改.

记住`set appearance`要在窗口里面的`select set`位置选相应的`s0 s1....`, `main`标签下的`Legend`就是图例, 你可以给每条曲线标记不同名字以便区分.

还有需要说一下的画布左边的按钮, 就说一个吧, `AS`表示恢复（图片设置的外观不变的, 好）. 所以你按钮按错了, 点它就行了.

如果用不同坐标刻度值时, 也就是跳跃很大, 如μs, ms, s, 在`Axes`（双击坐标轴就出来了）的窗口的`tick properties`框里面选`Format`, 里面好几种格式, 选`Compute(K, M, G....)`或`Engnieering`, 这样就可以一个坐标轴多个单位了. 不用显示那么长的数字串.

### 7. 多图并列

有时候要一个画布放多张图, 打开菜单`Edit | Arrange_graphs`对话框, 填写需要几rows几columns, 点应用, 就出来四个小框了（假设2*2格式）. 具体外观, 可以在刚才的框框里继续调节, 点击各个小框点击, 像前面的第2点那样选好文件进来就可以. 具体其他调节参看前面的6步骤操作.

也可以使用命令输入, 加上指令就可以了：

	-pexec "arrange (2, 2, .1, .1, .1, ON, ON, ON)"

前面的两个2代表2*2排列, 加上`-graph`更好, 代表的是后面接的文件放在哪个位置, 从0开始数：

	xmgrace -graph 2 10_rdf.xvg -graph 1 11.dat -graph 0 rdf01.dat -graph 3 rdf.dat -pexec "arrange(2,2,.1,.1,.1,ON,ON,ON )"

### 8. 内嵌图形

说实话, xmgrace做内嵌图像, 我也没懂, 希望会的人能介绍一下. 参考方法：

打开菜单`Edit | overlay_graphs`, 点中在`overlay graph`的`G0`, 然后右击, 选`creat new`, 出现了另一个空数据集. 然后`overlay graph`和`on to`, 反正个数据集就可以, 后点同意, 就两个图的, 当然看起来是一个, 自己点一下四周点移动, 就可以看见两个的, 只是重叠而已. 然后一个一个添加数据了. 刚才说了内嵌图形还记得吗, 这里也可以把其中一个图拉小移动作为一个内嵌图, 再修改一下需要显示的坐标范围. 具体靠自己去实践了.

### 9. 双y轴曲线

有时候我们需要同一图像两条不同y轴的曲线, 如例子：坐标x表示时间, 左边y轴代表压力, 右边y轴代表是温度. 注意调整坐标刻度, 在`Axes`窗口`tick label`和`tick mark`的`draw  on`, 一个选正常`normal side`, 一个选`oppsite side`相反, 就可以了. 对边的刻度就不要显示了.

### 10. 数据拟合

选项在`data | tramsformation`.

__线性拟合__

打开图像后

1. 点击菜单`DATA | TRANSFORMATION | REGRESSION`
2. 选择`SET`
3. 选择`LINEAR FIT`
4. 按下`ACCEPT`n
5. 出来一个窗口显示拟合的直线方程表达式了. 如果需要斜率, 就自己记下方程. Save the information about the slope and intercept that appear in a blue console as slope.dat.

__二次方程__

点击`DATA | TRANSFORMATION | INTERPOLATION/SPLINE`

选择`SET | METHOD | CUBIC SPLINE`, `START`设为1, `STOP`设为10, `LENGTH`设为500或1000, 然后点击`ACCEPT.

__非线性拟合__

输入方程形式, 还要输入参数初始值.

## 附录: 图像文本设置

如果像gnuplot文件那样修改设置的话, 我们直接修改文本就可以了. 可以参考`grace-5.1.25/exemple`下的示例文件去学习, 吃透了就是xmgrace的高手了. 此外, `qtgrace安装路径\bin\Default.agr`文件控制图形的默认显示方式, 你可以根据自己的喜好来修改默认的设置. 下面是其中部分参数的意义.

- `@    title ""                          ` : 标题
- `@    title font 0                      ` : 标题字体格式
- `@    title size 1.500000               ` : 标题字体大小
- `@    xaxis bar linewidth 3.0           ` : 坐标轴粗细
- `@    xaxis label "E (KJ/mol)"          ` : x坐标轴表示的物理量
- `@    xaxis tick major 100              ` : 单位刻度100
- `@    yaxis label ""                    ` : y坐标轴表示的物理量
- `@    yaxis tick major 2                ` : 每隔2画一个标度, 也就是精度为1
- `@    s5 line linewidth 3.0             ` : 第6条曲线的的粗细
- `@    xaxis tick major                  ` : 轴上的标度
- `@    xaxis ticklabel char size 2.000000` : 轴上的标度 显示大小
- `@    s3 hidden false                   ` : 是否隐藏曲线
- `@    s3 legend  "Interface"            ` : 第四条曲线的图例的名称标示, 就是表示哪条曲线
- `@    s3 symbol 5                       ` : 曲线的点的符号, 如圆圈, 星号, 倒三角
- `@    s3 line type 5                    ` : 曲线变成长虚线, 1是直线
- `@    page size 792, 612                ` : 白色画布的大小

颜色代码的意义

- `@map color 0 to (255, 255, 255), "white"`
- `@map color 1 to (0, 0, 0), "black"`
- `@map color 2 to (255, 0, 0), "red"`
- `@map color 3 to (0, 255, 0), "green"`
- `@map color 4 to (0, 0, 255), "blue"`
- `@map color 5 to (255, 255, 0), "yellow"`
- `@map color 6 to (188, 143, 143), "brown"`
- `@map color 7 to (220, 220, 220), "grey"`
- `@map color 8 to (148, 0, 211), "violet"`
- `@map color 9 to (0, 255, 255), "cyan"`
- `@map color 10 to (255, 0, 255), "magenta"`
- `@map color 11 to (255, 165, 0), "orange"`
- `@map color 12 to (114, 33, 188), "indigo"`
- `@map color 13 to (103, 7, 72), "maroon"`
- `@map color 14 to (64, 224, 208), "turquoise"`
- `@map color 15 to (0, 139, 0), "green4"`

上面的这些在`.xvg`文件开头写出来给我们参考. 让我们明白这些数字代表什么颜色. 还有下面的字体格式部分

字体代码的意义：

- `@map font 8 to "Courier", "Courier"`
- `@map font 10 to "Courier-Bold", "Courier-Bold"`
- `@map font 11 to "Courier-BoldOblique", "Courier-BoldOblique"`
- `@map font 9 to "Courier-Oblique", "Courier-Oblique"`
- `@map font 14 to "Courier-Regular", "Courier-Regular"`
- `@map font 15 to "Dingbats-Regular", "Dingbats-Regular"`
- `@map font 4 to "Helvetica", "Helvetica"`
- `@map font 6 to "Helvetica-Bold", "Helvetica-Bold"`
- `@map font 7 to "Helvetica-BoldOblique", "Helvetica-BoldOblique"`
- `@map font 5 to "Helvetica-Oblique", "Helvetica-Oblique"`
- `@map font 20 to "NimbusMonoL-Bold", "NimbusMonoL-Bold"`
- `@map font 21 to "NimbusMonoL-BoldOblique", "NimbusMonoL-BoldOblique"`
- `@map font 22 to "NimbusMonoL-Regular", "NimbusMonoL-Regular"`
- `@map font 23 to "NimbusMonoL-RegularOblique", "NimbusMonoL-RegularOblique"`
- `@map font 24 to "NimbusRomanNo9L-Medium", "NimbusRomanNo9L-Medium"`
- `@map font 25 to "NimbusRomanNo9L-MediumItalic", "NimbusRomanNo9L-MediumItalic"`
- `@map font 26 to "NimbusRomanNo9L-Regular", "NimbusRomanNo9L-Regular"`
- `@map font 27 to "NimbusRomanNo9L-RegularItalic", "NimbusRomanNo9L-RegularItalic"`
- `@map font 28 to "NimbusSansL-Bold", "NimbusSansL-Bold"`
- `@map font 29 to "NimbusSansL-BoldCondensed", "NimbusSansL-BoldCondensed"`
- `@map font 30 to "NimbusSansL-BoldCondensedItalic", "NimbusSansL-BoldCondensedItalic"`
- `@map font 31 to "NimbusSansL-BoldItalic", "NimbusSansL-BoldItalic"`
- `@map font 32 to "NimbusSansL-Regular", "NimbusSansL-Regular"`
- `@map font 33 to "NimbusSansL-RegularCondensed", "NimbusSansL-RegularCondensed"`
- `@map font 34 to "NimbusSansL-RegularCondensedItalic", "NimbusSansL-RegularCondensedItalic"`
- `@map font 35 to "NimbusSansL-RegularItalic", "NimbusSansL-RegularItalic"`
- `@map font 36 to "StandardSymbolsL-Regular", "StandardSymbolsL-Regular"`
- `@map font 12 to "Symbol", "Symbol"`
- `@map font 38 to "Symbol-Regular", "Symbol-Regular"`
- `@map font 2 to "Times-Bold", "Times-Bold"`
- `@map font 3 to "Times-BoldItalic", "Times-BoldItalic"`
- `@map font 1 to "Times-Italic", "Times-Italic"`
- `@map font 0 to "Times-Roman", "Times-Roman"`
- `@map font 43 to "URWBookmanL-DemiBold", "URWBookmanL-DemiBold"`
- `@map font 44 to "URWBookmanL-DemiBoldItalic", "URWBookmanL-DemiBoldItalic"`
- `@map font 45 to "URWBookmanL-Light", "URWBookmanL-Light"`
- `@map font 46 to "URWBookmanL-LightItalic", "URWBookmanL-LightItalic"`
- `@map font 47 to "URWChanceryL-MediumItalic", "URWChanceryL-MediumItalic"`
- `@map font 48 to "URWGothicL-Book", "URWGothicL-Book"`
- `@map font 49 to "URWGothicL-BookOblique", "URWGothicL-BookOblique"`
- `@map font 50 to "URWGothicL-Demi", "URWGothicL-Demi"`
- `@map font 51 to "URWGothicL-DemiOblique", "URWGothicL-DemiOblique"`
- `@map font 52 to "URWPalladioL-Bold", "URWPalladioL-Bold"`
- `@map font 53 to "URWPalladioL-BoldItalic", "URWPalladioL-BoldItalic"`
- `@map font 54 to "URWPalladioL-Italic", "URWPalladioL-Italic"`
- `@map font 55 to "URWPalladioL-Roman", "URWPalladioL-Roman"`
- `@map font 56 to "Utopia-Bold", "Utopia-Bold"`
- `@map font 57 to "Utopia-BoldItalic", "Utopia-BoldItalic"`
- `@map font 58 to "Utopia-Italic", "Utopia-Italic"`
- `@map font 59 to "Utopia-Regular", "Utopia-Regular"`
- `@map font 13 to "ZapfDingbats", "ZapfDingbats"`

最后还是说一句, 有些方法不懂话, 看看`grace-5.1.25/examples`下面的例子, 右击用grace打开, 看看人家的图的设置, 有你想要的效果吗, 仔细琢磨一下人家怎么设置的. 这是最好的学习方法, 比看教程好很多, 当然这是个人认为.

## 评论

- 2016-08-16 10:27:25 `轻语入梦` 不错，学习
