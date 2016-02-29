---
 layout: post
 title: GROMACS选区(selection)语法及用法
 categories:
 - 科
 tags:
 - GMX
---

* toc
{:toc}

- 2016-01-05 21:05:08 翻译: 陈珂; 修订: 李继存

选区用于选择原子/分子/残基以进行后续分析. 与传统索引(index)文件不同, 选区可以是动态的, 即, 可以对轨迹中的不同帧选择不同的原子. GROMACS手册的第八章《分析》中有一小节对选区进行了简短的介绍, 并给出了一些建议. 当你初次接触选区概念时, 这些建议可帮助你熟悉它. 下面将就选区的技术细节和语法方面给出更加详细的说明.

每个分析工具需要的选区数目各不相同, 对选区的解读也不一样, 但大致意思仍然相同: 每个选区最终都归结为一套位置(a set of position), 位置可以是一些原子的原子位置, 质心, 或几何中心. 分析工具可使用这些位置进行分析, 这样处理时更加灵活. 需要注意的是, 某些分析工具对允许使用的选区种类可能存在限制.

## 在命令行中指定选区

如果没有在命令行中提供选区, 分析工具会提示你交互式地输入选区(对大多数工具而言, 在这种情况下也可以用管道提供选区). 尽管测试时这样做很方便, 但当选区很复杂, 或使用脚本时, 在命令行中提供选区更为容易.

每个工具用于指定选区的命令行参数都不一样(参见每个工具的帮助文档). 你可以传递包含所有选区的一个单一字符串(以分号分隔), 或多个字符串, 每个字符串包含一个选区. 注意你需要将选区用引号引起来, 以防止shell对它们进行转换.

如果你设置了一个选区命令行参数, 但没有提供任何选区, 分析工具会提示你交互式地为该参数输入选区. 当选区命令行参数可选时, 这一作法很有用, 因为在这种情况下工具通常不会给出输入提示.

要使用一个文件提供选区, 可以在为选区参数提供的选区处使用`-sf file.dat`(例如`-select -sf file.dat`). 通常情况下, `-sf`参数从所提供的文件中读取选区, 并将它们赋值给所有已设置但尚未指定选区的选区参数. 有一种特殊情况是, `-sf`单独给出, 而没有前置的选区参数, 这时`-sf`会把选区赋值给所有(尚未设置)的必需选区参数(即, 那些如果没有从命令行得到选区, 就会给出交互式提示的选区参数).

要使用传统索引文件中的组(group), 可以使用参数`-n`提供一个文件. 组的使用方法可参见《语法》小节. 如果没有提供此选项, 就会生成默认组. 默认组的生成逻辑与非选区工具中的相同.

根据分析工具的不同, 可能会有两个额外的命令行参数供使用, 以控制分析工具行为:

- `-seltype` 用于指定对每个选区要计算的默认位置类型.
- `-selrpos` 用于指定按坐标选择原子时使用的默认位置类型.

关于这些选项的更多信息, 参见《位置》小节.

## 选区语法

一套选区由一个或多个选区组成, 彼此以分号分隔. 每个选区定义了一套位置用于分析. 每个选区也可以用一个前置字符串进行命名, 以便在某些环境, 如图例中使用名称. 如果没有提供名称, 则会自动以描述选区的字符串作为名称.

在交互式输入中, 语法稍有不同: 换行符也可用以分隔选区. 如果需要, 可使用`\`后接换行符来续行. 注意上述作法仅能用于真正的交互式输入, 而不适用于通过其他渠道, 比如管道, 提供选区的情况.

用户可以使用变量存储选区表达式. 定义变量的语法如下:

	VARNAME = EXPR ;

其中`EXPR`可以是任何合法的选区表达式. 定义后, 在任何`EXPR`合法的地方都可以使用`VARNAME`.

选区包含三种主要的表达式类型: 定义原子的(`ATOM_EXPR`), 定义位置的(`POS_EXPR`), 以及归结为数值的(`NUM_EXPR`). 每个选区应是一个`POS_EXPR`或一个`ATOM_EXPR`(后者会自动转换为位置). 基本规则如下:

- 类似于`NUM_EXPR1 < NUM_EXPR2`形式的表达式会求值为一个`ATOM_EXPR`, 其中选中所有使比较表达式成立的原子.
- 原子表达式可以与逻辑操作组合使用, 比如`not ATOM_EXPR`, `ATOM_EXPR and ATOM_EXPR`, 或`ATOM_EXPR or ATOM_EXPR`. 可以使用括号来改变求值顺序.
- `ATOM_EXPR`表达式能够以各种方式转换为`POS_EXPR`表达式, 详见《位置》小节.
- `POS_EXPR`可转换为`NUM_EXPR`, 其语法类似于`x of POS_EXPR`. 目前仅支持单个位置, 比如表达式`x of cog of ATOM_EXPR`.

某些关键词基于字符串的值, 比如原子名称, 来选中原子. 对这些关键词, 用户可以使用通配符(如`name "C*"`)或正则表达式(如`resname "R[AB]"`). 匹配类型会自动由字符串进行猜测: 如果它包含除字母, 数字, `*`或`?`以外的字符, 就被视为一个正则表达式. 要强制使用字符串的字面内容进行匹配, 可以使用`name = "C*"`来匹配字面的`C*`. 要强制使用其他匹配类型, 可以分别用`?`或`~`取代`=`, 这样就可以强制使用通配符或正则表达式进行匹配.

包含非字母数字符号的字符串应该用双引号引起来, 像示例中那样. 对于其他字符串, 双引号是可选的, 但如果字符串的值与保留关键词冲突, 会导致语法错误. 如果你的字符串包含大写字母, 这就不该发生.

由命令行选项`-n`提供或默认生成的索引组都可以使用`group NR`或`group NAME`进行引用, 其中`NR`为该组以零开始计数的索引号, `NAME`为该组名称的一部分. 如果整个选区都由一个索引组提供, 关键词`group`是可选的. 在交互模式下, 在行首按下回车键可以查看到可用组的列表.

## 在选区中指定位置

用于在选区中指定位置的方法有:

1. 常量位置可用`[XX, YY, ZZ]`定义, 其中`XX`, `YY`和`ZZ`为实数.
2. `com of ATOM_EXPR [pbc]`或`cog of ATOM_EXPR [pbc]`计算`ATOM_EXPR`的质心/几何中心. 如果指定了`pbc`, 会迭代地计算中心以应对`ATOM_EXPR`沿周期性边界条件折叠的情况.
3. `POSTYPE of ATOM_EXPR`为`ATOM_EXPR`中的原子计算指定的位置. `POSTYPE`可以是`atom`, `res_com`, `res_cog`, `mol_com`或`mol_cog`, 还可使用可选的前缀`whole_`, `part_`或`dyn_`. `whole_`计算整个残基/分子的中心, 即使它只有一部分被选中. `part_`前缀计算选中原子的中心, 但对同一残基/分子总是使用相同的原子. 所使用的原子从选区允许的最大组中确定. `dyn_`严格地只计算选中原子的中心. 如果没有指定前缀, 整个选区默认为`part_`, 而其他地方则默认为`whole_`. 后者通常适用于在不同工具中选中相同的分子, 而前者是速度与直觉行为的折衷(求值时`dyn_`位置会慢于`part_`).
4. 对整个选区给出的`ATOM_EXPR`, 将如上面第3条那样进行处理, 并使用命令行参数`-seltype`指定的位置类型.

基于位置选择原子的选区关键词, 比如`dist from`, 默认使用命令行选项`-selrpos`定义的位置. 可以通过在关键词前面添加`POSTYPE`限定符来改变这一行为. 例如, `res_com dist from POS`求值为残基质心的距离. 在这个例子中, 基于计算出来的单个距离值, 一个残基中的所有原子将同时被选中或不被选中.

## 选区中的算术表达式

选区的数值表达式中支持基本的算术求值. 支持的操作有加, 减, 负, 乘, 除和幂(使用`^`). 除以零或其他非法操作的结果未定义.

## 选区关键词(keyword)

以下为当前可用的选区关键词. 带加号标记的关键词会有一小节KEYWORD提供额外的帮助信息, 其中KEYWORD为该关键词的名字.

- 根据整数型性质选择原子的关键词:

	- `atomnr`
	- `mol` (与`molindex`同义)
	- `molecule` (与`molindex`同义)
	- `molindex`
	- `resid` (与`resnr`同义)
	- `residue` (与`resindex`同义)
	- `resindex`
	- `resnr`

	(在表达式中使用, 或类似于`atomnr 1 to 5 7 9`)

- 根据数值性质选择原子的关键词:

	- `beta` (与`betafactor`同义)
	- `betafactor`
	- `charge`
	- `distance from POS [cutoff REAL]`
	- `distance from POS [cutoff REAL]`
	- `mass`
	- `mindistance from POS_EXPR [cutoff REAL]`
	- `mindistance from POS_EXPR [cutoff REAL]`
	- `occupancy`
	- `x`
	- `y`
	- `z`

	(在表达式中使用, 或类似于`occupancy 0.5 to 1`)

- 使用字符串性质选择原子的关键词:

	- `altloc`
	- `atomname`
	- `atomtype`
	- `chain`
	- `insertcode`
	- `name` (与`atomname`同义)
	- `pdbatomname`
	- `pdbname` (与`pdbatomname`同义)
	- `resname`
	- `type` (与`atomtype`同义)

	(用法类似于`name PATTERN [PATTERN] ...`)

- 直接选中原子的额外关键词:

	- `all`
	- `insolidangle center POS span POS_EXPR [cutoff REAL]`
	- `none`
	- `same KEYWORD as ATOM_EXPR`
	- `within REAL of POS_EXPR`

- 直接求值为位置的关键词:

	- `cog of ATOM_EXPR [pbc]`
	- `com of ATOM_EXPR [pbc]`

	(另可参见《位置》小节)

- 额外关键词:

	- `merge POSEXPR`
	- `POSEXPR permute P1 ... PN`
	- `plus POSEXPR`

## 根据原子名称选中原子: `atomname`, `name`, `pdbatomname`, `pdbname`

	name
	pdbname
	atomname
	pdbatomname

这些关键词通过名称选中原子, `name`选中使用GROMACS原子命名约定的原子. 对于除PDB以外的输入文件格式, 原子名称严格按照它们在输入文件中出现的形式匹配. 对于PDB文件, 处理以数字开头的4字符原子名称时, 会先把数字移到末尾再进行匹配(例如, 要匹配PDB文件中的`3HG2`, 应使用`name HG23`). `pdbname`只能用于PDB输入文件, 并基于输入文件中给出的精确名称选中原子, 不会进行上述的转换.

`atomname`和`pdbatomname`是以上两个关键词的同义词.

## 基于距离选中原子: `dist`, `distance`, `mindist`, `mindistance`, `within`

	distance from POS [cutoff REAL]
	mindistance from POS_EXPR [cutoff REAL]
	within REAL of POS_EXPR

`distance`和`mindistance`计算到给定位置的距离, 唯一的区别是`distance`只接受单个位置, 而`mindistance`可接受任意数目的位置, 然后计算到最近位置的距离. `within`直接选中到`POS_EXPR`的距离处于`REAL`之内的原子.

对前两个关键词, 可以指定截断距离以加速求值: 所有大于指定截断值距离的返回值都等于截断值.

## 选中立体角内的原子: `insolidangle`

	insolidangle center POS span POS_EXPR [cutoff REAL]

此关键词选中从`POS`(一个求值为单个位置的位置表达式)看去, 处于`POS_EXPR`中任意位置的`REAL`度(默认为5度)之内的原子, 即, 在以`POS`为中心, 由`POS_EXPR`中的位置张成的立体角之内的原子. <br>

技术上, 立体角是一些小圆锥体的合集. 这些小圆锥体的顶点位于`POS`, 轴线穿过`POS_EXPR`中的一个点. 对`POS_EXPR`中的每一位置都有这样一个圆锥体. 如果某点处于这些圆锥体的任意一个之内, 它就处于这个立体角中. `cutoff`值决定了圆锥的宽度.

【陈珂 注】此段第一句原文为: This keyword selects atoms that are within REAL degrees (default=5) of any position in POS_EXPR as seen from POS (a position expression that evaluates to a single position). 上面的翻译未必准确, 容易使人误解为只有`POS_EXPR`内的原子才会被选中. 从下文的技术性解释来看, `POS_EXPR`中的原子只用于确定每个小圆锥的轴线, 而落在任意一个小圆锥内的原子都会被选中. 所以`POS_EXPR`确定的并不是待选原子的范围, 而是立体角的轴线位置.

## 合并选区: `merge`, `plus`

	POSEXPR merge POSEXPR [stride INT]
	POSEXPR merge POSEXPR [merge POSEXPR ...]
	POSEXPR plus POSEXPR [plus POSEXPR ...]

基本选区关键词只能创建每个原子至多出现一次的选区. `merge`和`plus`选区关键词可用于绕开这一限制. 二者创建的选区可以包含所有给定位置表达式中的位置, 即使其中有重复. 二者的差别在于, `merge`接受两个或以上, 所含位置个数相同的选区, 其输出包含从各选区中依次选出的输入位置, 即, 其输出类似于A1 B1 A2 B2并依此类推. 大小不等的选区也可以使用`merge`, 只要第一个选区的大小是第二个的整数倍. `stride`参数可用于显式地指定这个倍数. `plus`简单地把位置合并在一起, 也能用于大小不等的选区. 这些关键词只在选区级别合法, 不能用于任何子表达式.

## 排列选区: `permute`

	permute P1 ... PN

默认情况下, 所有选区求值的返回形式为递增排序的原子索引. 可通过在表达式后面添加`permute P1 P2 ... PN`来改变这种行为. 所有`Pi`应形成数字1到N的一个排列. 这个关键词对选区中每个包含N个位置的位置块进行排列, 这样位置块中的第i个位置会变为第Pi个. 注意排列的是位置而不是单个原子. 如果选区的大小不是n的整数倍, 会导致致命错误. 只能对整个选区表达式进行排列, 而不能用于任何子表达式, 即, 关键词`permute`应出现在选区的最后.

## 扩展选区: `same`

	same KEYWORD as ATOM_EXPR

关键词`same`可用于选中给定`KEYWORD`匹配`ATOM_EXPR`中任意原子的所有原子. 支持求值为整数或字符串值的关键词.

## 选区求值和优化

逻辑求值从左向右进行并使用短路规则, 即, 一旦知道了某一原子被选中与否, 就根本不会对剩余的表达式进行求值. 这个特性可用于优化选区: 在逻辑表达式中, 你应该首先写出最严格和/或最不耗时的表达式. 动态和静态表达式之间的相对顺序是无关紧要的: 所有静态表达式只在第一帧之前求值一次, 其结果将成为最左边的表达式.

优化的另一个要点是公用子表达式: 它们不会被自动识别, 但可通过使用变量手动优化. 对于复杂的选区, 这会对性能产生非常大的影响, 尤其是当你像这样定义了几个索引组的时候:

	rdist = distance from com of resnr 1 to 5;
	resname RES and rdist < 2;
	resname RES and rdist < 4;
	resname RES and rdist < 6;

如果不设置变量, 这些距离会计算三次, 尽管在各个选区中它们完全一样. 任何赋值给变量的内容都会成为公用子表达式, 在一帧内只求解一次. 目前, 在某些情况下, 使用变量实际上会导致轻微的性能损失, 因为需要进行检查以确定表达式已经对哪些原子进行过求值, 但这应该不是大的问题.

## 选区的限制

- 某些分析程序可能会要求输入的选区具有特殊的结构(例如, `gmx gangle`的某些选项要求索引组由包含三或四个原子的组构成). 对于此类程序, 用户需要提供合适的, 总能返回需要位置的选区表达式.
- 所有选区关键词以递增顺序选中原子, 即, 你可以把它们当作集合操作, 在执行结束后按数值排序返回原子. 例如, 以下选区会以同样的顺序选中同样的原子:

		resname RA RB RC
		resname RB RC RA

		atomnr 10 11 12 13
		atomnr 12 13 10 11
		atomnr 10 to 13
		atomnr 13 to 10

	如果你需要原子/位置具有不同的顺序, 你可以:

	- 使用外部索引组(对于某些静态选区),
	- 使用`permute`关键词来改变最终顺序, 或
	- 使用`merge`或`plus`关键词将多个不同选区组成最终选区.

- 由于技术原因, 当表达式的第一个值为负值的时候, 像这样

		charge -1 to -0.7

	会导致语法报错. 一个变通的解决办法是写成

		charge {-1 to -0.7}

	来代替

- 当`name`选区关键词用于PDB输入文件时, 输出行为可能不符合直觉. 当GROMACS读入一个PDB文件时, 以数字开头的4字符原子名称会进行转换, 例如, `1HG2`会转换成`HG21`, 而后者才是`name`关键词的匹配目标. 你可以使用`pdbname`来匹配输入PDB文件中本来的原子名称.

## 选区示例

以下, 给出不同类型选区使用方法的示例.

- 选中所有水中的氧原子 <br>
	`resname SOL and name OW`

- 残基1到5, 以及残基10的质心 <br>
	`res_com of resnr 1 to 5 10`

- 距一个固定位置超过1 nm的所有原子 <br>
	`not within 1 of [1.2, 3.1, 2.4]`

- 属于残基LIG并距一个蛋白质0.5 nm以内的所有原子(使用自定义名称) <br>
	`"Close to protein" resname LIG and within 0.5 of group "Protein"`

- 至少有一个原子距残基LIG 0.5 nm以内的所有蛋白质残基 <br>
	`group "Protein" and same residue as within 0.5 of resname LIG`

- 质心距残基总质心介于2和4 nm之间的所有RES残基 <br>
	`rdist = res_com distance from com of resname RES` <br>
	`resname RES and rdist >= 2 and rdist <= 4`

- 包含如C1 C2 C2 C3 C3 C4 ... C8 C9的重复原子的选区 <br>
	`name "C[1-8]" merge name "C[2-9]"`

	这可用于`gmx distance`以计算C1-C2, C2-C3等原子之间的距离.

- 具有顺序C2 C1的选区 <br>
	`name C1 C2 permute 2 1`

	这可用于`gmx gangle`以得到C2->C1矢量而不是C1->C2矢量.

- 由两个索引组的质心组成的选区 <br>
	`com of group 1 plus com of group 2`

	这可用于`gmx distance`以计算这两个质心间的距离.

- 沿x的固定矢量(可在`gmx gangle`中用作参考) <br>
	`[0, 0, 0] plus [1, 0, 0]`

- 以下示例解释了各种位置类型之间的差异. 这个选区在每个残基选中一个位置, 其中三个原子C[123]中的任意一个满足`x < 2`. 这个位置为所有三个原子的质心. 这是你只写`res_com of`时的默认行为.

	`part_res_com of name C1 C2 C3 and x < 2`

	下面这个选区完成同样的工作, 但位置是整个残基的质心

	`whole_res_com of name C1 C2 C3 and x < 2`

	最后, 下面这个选区选中同样的残基, 但位置是那些严格满足`x < 2`判据的原子的质心

	`dyn_res_com of name C1 C2 C3 and x < 2`

- 没有`of`关键词时, 默认行为会与以上所述不同, 但除此以外规则是相同的:

	`name C1 C2 C3 and res_com x < 2`

	就像指定了`whole_res_com`一样工作, 并从质心满足`x < 2`的残基中选中那三个原子. 使用

	`name C1 C2 C3 and part_res_com x < 2`

	会基于从C[123]原子计算的质心来选中残基.
