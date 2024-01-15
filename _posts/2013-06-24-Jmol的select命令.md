---
 layout: post
 title: Jmol的select命令
 categories: 
 - 科
 tags:
 - jmol
---

## 2013-06-24 08:54:31
 
Jmol是我经常使用的一款分子结构查看软件, 其原因主要有下面几点：

1. 默认显示的图形看着比较舒服, 中我的意
2. 旋转, 缩放, 测量, 播放等基本功能使用符合习惯, 比较方便
3. 脚本等高级功能也很强大, 虽然我用到的不是很多

最近需要使用Jmol的选择命令select, 所以就参考Jmol手册粗略翻译了一下相关文档, 以供参考. 

### Select

- 通过原子表达式来选择原子
- 若无表达式, 默认选择所有原子, 相当于select all
- 可选参数ADD、REMOVE和GROUP优先于原子表达式

### 语法

- select {default: ALL} 
	- 选择所有原子(可能不包含H原子)
- select [atom-expression]
	- 选择符合表达式的原子
	- 若文件中包含多个构型（Model）, 可用"/n"指定所选原子的构型号n. 如：select */3, 选择第3个构型的所有原子
- select [atom-expression] (property expression)
	- Jmol数学模块的所有功能都可用于原子选择
	- 若第一个参数是原子表达式, 如{\*}或{10-30}, 可包含第二个参数. 第二个参数的值必须为TRUE/FALSE, 并适用于单个原子的表达式. 括号也可省略. 如：select {*.ca} (atomY < atomX), 选择所有Y坐标小于X坐标的alpha碳原子. 
	- 注意：此情形下, "x"、"y"和"z"为变量名而"atomX"、"atomY"和"atomZ"代表原子坐标. 
	变量_x指定给被测试的单个原子, 并用于在select()函数中代表被测试的原子. 如：select {\*.ca} (phi < select(y; {*.ca}; y.resno = _x.resno + 1).phi)), 选择氨基酸残基中的alpha碳原子, 且此残基的phi角小于肽链中下一个残基phi角. 

### 范例

- select elemno<7;spacefill 200
- select carbon;color white # 选择C, 指定为白色
- select protein;ribbons on #选择蛋白质, 显示为ribbon
- select *:D;color blue
- select [HIS]:D;spacefill 300
- select [HIS]92:D.N;spacefill 600
- select [HIS]92:D.C?;color orange
- select [HIS]92.N;color [255,196,196]
- select within(group, within(10.0, :a));color green;
- select :a;color red
- select within(chain, [HIS]92);color white;
- select within(chain, within(3.0,[HIS]92:D));color purple;
- select within(chain,within(5.0,[HIS]92));color white
- select 95^a:L # 选择链L, 残基95, 插入码a

### [atom expressions]原子表达式

- Atom selectors 原子选择器
- Functions 函数
- RasMol残基代码
- Wildcards 通配符
- Atom names 原子名（用于非pdb文件）
- 逻辑词NOT、AND、OR、XOR可用于表达式

- 一般项
	+ all所有
	+ none无
	+ bonded成键
	+ visible可见
	+ selected已选择
	+ clickable可点击
- file.model 特定文件中的特定构型
	+ select 3.2最近载入的第3个文件中第2个构型的所有原子
	+ select 3.0最近载入的第3个文件中所有构型的所有原子
- subset当前定义的子集
	+ 注意, 若定义了一个子集, select/display all与select/display subset, restrict none与restrict not subset功能相同, select not subset将是空选择
- unitcell单位晶胞
	+ 当前晶胞中的原子（可能需要平移）, 包含晶面和晶轴上的原子
- chemical elements化学元素
	+ 元素名称（包括氘deuterium和氚tritium）
	+ 下划线元素符号_Xx, 可包含同位素如 _Cu、_Fe、_2H、_31P
- solvent-related溶剂相关
	+ solvent溶剂
	+ PDB "HOH", water, 水, 任何H-O-H相连的集合
- Atom selectors原子选择器
	+ 利用小括号和中括号可选择单个或某一范围内原子
	+ [0]表示最后一个原子
	+ 负数表示反向序数
	+ 如：
	+ select (carbon)[3]将选择第3个碳原子
	+ select (carbon)[3][5]将选择第3至第5个碳原子
	+ select (*)[0]选择最后一个原子
	+ select (carbon and 2.3)[-1][0]选择构型2.3的最后两个碳原子
	+ 原子选择器也可用于其他命令, 需要括号, 如measure {(\_O)[1]} {(_O)[2]}
- Functions函数
	+ CONNECTED()连接
		+ 原子间连接信息, 一般格式：
		connected([optional min # bonds], [optional max # bonds], [optional bond type], [optional atom expression])
	+ SUBSTRUCTURE()亚结构
		+ 给定亚结构内的原子, 使用引用的smiles表达式"SMILES"
	+ WITHIN(setName,atomExpression) 指定集合
		+ 集合名可为 BOUNDBOX, CHAIN, ELEMENT, GROUP, MODEL, MOLECULE, POLYMER, SITE, 或STRUCTURE, 也可以是引号包围的单字母蛋白质或核酸序列（如 "GGCCCTT" "MAACYXV"）
		+ SITE 指晶体位点
		+ BOUNDBOX 指包含原子集合的最小盒子
	+ WITHIN(distance, withinAllModels, atomExpression)距离
		+ withinAllModels  TRUE/FALSE 标识, 默认FALSE, TRUE允许在所有构型中选择原子
	+ WITHIN(distance, {x y z})
		+ 距离某一分数坐标或直角坐标
		+ 若距离为负, 则指晶胞坐标归一化后的距离
	+ WITHIN(distance, $surfaceObject)
		+ 距离某一表面一定距离内
	+ WITHIN(x.x, VDW, {atomset})
		+ 与{atomset}中原子的van der Waals表面有重叠的原子
		+ 距离参数可选, 其意义取决于大小. 若大于10, 表示百分数, 如110%, 100%, 90%, 否则表示原子van der Waals半径的增加值. 如
		+ select GROUPS within(1.4, VDW, {*:A}) 选择所有组, 其溶剂可及表面与链A有重叠
		+ select GROUPS within(100, VDW, {ligand})选择与任意配体"clashing"的所有组
	+ WITHIN(nResidues,GROUP,{atoms})
		+ groups that are within a given number of residues of a specified group of atoms(Jmol 12.0)
	+ WITHIN(0,planeType, planeDesignation)
		+ 某一平面0.01 Angstroms范围内的原子
		+ 若planeType为HKL, planeDesignation 为 {h k l}形式,  h, k, and l为 Miller 指数
		+ 若planeType 为PLANE, planeDesignation 为 @{plane(a,b,c)}形式,  a, b, and c 为原子表达式或坐标
	+ WITHIN(distance,planeType, planeDesignation)
		+ 距离某一平面指定范围内的原子
		+ 正值与负值分处平面两边, 须自行测试需要的是哪一边
		+ 平面内的原子(0.01 Angstroms)都包括
	+ WITHIN(ATOMNAME,"aa,bb,ccc")原子名称
	+ WITHIN(ATOMTYPE, "atomType,atomType,...")原子类型
		+ MOL2和AMBER的topology文件类型, 含有原子类型
		+ 其他文件类型, 原子类型与原子名称相同
		+ 如, select within(ATOMTYPE,"HW,OW")选择水中的原子
	+ WITHIN(BASEPAIR("XY...")
		+ 形成氢键的DNA或RNA碱基对, 可用于任意碱基对
		+ display within(BASEPAIR,"GCAU")仅选择G-C和A-U碱基对
	+ WITHIN(BOUNDBOX)当前定义的boundbox中的原子
	+ WITHIN(BRANCH,{first atom}, {second atom})
		+ 选择第二个原子且以第二个原子开始不包含第一个原子的分子branch
	+ WITHIN(HELIX)
		+ 可用select helix进行选择并不在任何一个螺旋末端的组
	+ WITHIN(SEQUENCE,"sequence")
		+ 单字母的蛋白质或核酸序列, 如"GGCCCTT"、"MAACYXV"
		+ 必须匹配, SEQENCE可省略
	+ WITHIN(SHEET)
		+ 可用select sheet进行选择并不在任何一个螺旋末端的组
	+ WITHIN(SMARTS,"smartsString")
		+ SMARTS结构式, 仅氢原子写为[H]
		+ 对亚结构搜索推荐使用
	+ WITHIN(SMILES,"smilesString")
		+ SMILE结构式. 用于数学函数返回所有匹配原子, 包括氢原子及用于饱和价键的氢原子
- Wildcards通配符（问号和星花）
	+ \*用在[residueType]seqRange中表示任意, 如select *.CA
	+ 匹配符可用于其他地方指定, 但最好不要混合使用
	+ select [ALA].*与select [ALA]功能相同
	+ PDB和MOL2文件中若包含残基名称, \*可用在x*形式中, 但只能用于残基名, 不能用于原子名称
	+ 因此, select AS* 将选择aspartate和asparagine
	+ 当用于原子时, 如未修正的（unremediated）PDB文件1bkx
	+ select A.O?\*中\*并非匹配符, 将选择原子A.O1\*和A.O4\*.(在修正后的PDB文件中, 这些*将被单引号代替AO1', AO4')
	+ 对其他文件类型, *能够用在原子名称（或部分名称）的末尾, 不能用在insertionCode 或 altLoc中
	
	+ 问号表示一些字符select *.C??, 其数目很关键
	+ ".?"只表示单字母名称的原子, 如"O"和"C"
	+ ".??"则表示单或双字母名称的原子
	+ 限定码:?, ^?和%?表示某些链, 某些插入码, 某些替代位置
	+ 单独的:, ^和%则表示无链、无插入码、无题的位置的原子
	+ 可使用\?来匹配原子名称中的?. 如, 两个原子名称分别为"O1"和"O1?", select O1?将选择这两种原子, 但select O1\?则只选择第二种原子. 
	+ 不能使用\*来表示原子名称中的*
- 对其他文件类型使用的原子名称
	+ 原子名称也可用于非PDB文件类型
	+ CIF文件中,原子名称取自于atom_site_label字段. 如果一个原子标识为"C34", 则可用select \*.C34或select C34或select C\*来选中它. 在这里通配符*没问题,因为非PDB文件不包含可能与原子名称冲突的残基名称. 
	+ 在Jaguar, NWChem,  Tripos MOL2, Wavefunction Odyssey, SHELX和Wavefunction Spartan文件中使用"H3", "O2"之类的原子标识, 它们可直接用于选择原子, 并可用格式符%a在显示. 
	+ 对XYZ之类的文件中, 原子标识不含数字, Jmol会自动根据元素符号和原子在文件中的序号建立原子名称. 
- [atom properties] 原子性质
	+ 超过80种原子性质, 它们即可用于选择, 提取, 也可被重新设定
	+ 旧式的Rasmol语法 [group].atomName^insertion:chain%altloc 仍被支持, 但也可用更自然更方便的语法取代它们. 如 select group="ARG" and atomname="CA" and chain="A"等价于select [ARG].CA:A
	+ 通常, xxxx=y格式对于非Rasmol仅有的参数更好一些
	+ 设定原子性质：{atom expression}.xxxx = y
	+ 创建一个所有匹配原子性质的数组：{atom expression}.xx?或{atom expression}.?, "xx"为性质名字的开始部分, 如print {atomno=3}.a? or print @3.?)
	+ 标签label %[xxx]中使用%%来代表%自身

<table><caption>原子常用性质简表</caption>
<tr>
<th style="text-align:left;">原子性质</th>
<th style="text-align:center;">Select xxx&#61;y</th>
<th style="text-align:center;">Label %[xxx]</th>
<th style="text-align:center;">label %x</th>
<th style="text-align:center;">Print {*}.xxx</th>
<th style="text-align:center;">{*}.xxx&#61;y</th>
<th style="text-align:center;">说明</th>
</tr>
<tr>
<td style="text-align:center;">atomIndex 原子索引号</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">D</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">始于0, 每个载入原子唯一</td>
</tr>
<tr>
<td style="text-align:center;">atomno 原子序号</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">i</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">可用"@", 如select @33</td>
</tr>
<tr>
<td style="text-align:center;">atomName</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">a</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">原子名称</td>
</tr>
<tr>
<td style="text-align:center;">atomType原子类型</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">B</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">mol2,AMBER文件原子名称(其他文件)</td>
</tr>
<tr>
<td style="text-align:center;">atomX/Y/Z</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">x/y/z</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">直角坐标xyz</td>
</tr>
<tr>
<td style="text-align:center;">bondcount</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;"></td>
<td style="text-align:center;">共价键数目</td>
</tr>
<tr>
<td style="text-align:center;">Element元素符号, 其值取决于上下文</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">e</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">structure&#61;x中, x可为"H", "He"之类或原子序数,其他情形, 为元素符号, 同位素使用如"13C"</td>
</tr>
<tr>
<td style="text-align:center;">elemno</td>
<td style="text-align:center;">Yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">l(el)</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">yes</td>
<td style="text-align:center;">原子序数</td>
</tr>
</table>


Select这个命令确实很复杂, 这是因为要Jmol想尽量满足使用者的需要. 但即便功能如此繁多, 也不能可能满足所有人的需要, 每个使用者都有着自己的需要, 因此功能是很难统一化的. 目前的大多数选项都是针对PDB文件的, 以便用于生物分子的查看. 但是于我而言, 平时很少使用PDB文件, 最多的是xyz文件和cif文件. 为了方便, 特列出最常用的几个命令：

 - `Select` 选择所有原子
 - `Select none` 清除选择
 - `Select @n` 以序号选择原子
 - `Select _Atom` 以类型选择原子, 用下划线元素符号
 - `Select _Xx` xyz文件中未知类型的原子
 - `Select atomname="Atom"` cif中可用以选择某类分子, 可使用统配符* ?
 - `Select elemno=0` 用以选择不能识别元素符号的原子
 - `Select (*)[m][n]` 序号范围内原子
 - `Select within(distance,{x y z})` 距某点特定距离的原子
 - `Select within(distance, {Atom})` 距某类原子特定距离的原子


**注意**

- Jmol可读多帧cif文件, 最大17MB, 为保险起见, 最好小于16MB
