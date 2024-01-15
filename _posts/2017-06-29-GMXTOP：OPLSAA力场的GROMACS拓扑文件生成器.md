---
 layout: post
 title: GMXTOP：OPLSAA力场的GROMACS拓扑文件生成器
 categories:
 - 科
 tags:
 - gmx
---

- 2017-06-29 21:46:49
- 2017-11-29 21:42:29 修订扩充
- 2017-12-09 09:03:00 集成MKTOP, 增加生成输入文件功能

使用GROMACS进行分子动力学模拟时, 获得体系的拓扑文件是关键, 也是难点. 虽然有些辅助工具可以直接获得一些分子的拓扑文件, 但你仍然需要对得到的拓扑文件进行仔细检查, 否则的话, MD过程中出现问题很难排查.

[tppmktop](https://jerkwin.github.io/2015/12/13/TPPMKTOP-OPLS-AA%E5%85%A8%E5%8E%9F%E5%AD%90%E5%8A%9B%E5%9C%BA%E7%9A%84GROMACS%E6%8B%93%E6%89%91%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90%E5%99%A8/)是获得有机分子OPLSAA力场拓扑文件的好工具, 但也存在一定的不足. 一是不支持周期性分子, 二是提供的网络服务同时只能运行一个任务. 为此, 我觉得还是有必要自己做一个简单OPLSAA力场拓扑生成器GMXTOP, 一则可用于理解力场拓扑的生成方法, 二则可用于检查其他方法得到的拓扑是否合适.

GMXTOP是个在线工具, 运行在浏览器中, 不依赖于任何其他环境. 它并不支持自动生成拓扑文件, 而是需要你先指定每个原子的原子类型, 然后它会根据原子类型和力场文件中的参数信息生成GROMACS的拓扑文件. 虽然GMXTOP不是完全自动的, 使用起来有点不方便, 但使用它你可以明确地控制如何指定原子类型, 遇到其他工具无法自动匹配的原子时, 你就可以根据情况选用相近的原子类型, 保证最终能得到合适的拓扑文件.

## 使用说明

打开GMXTOP网页 <https://Jerkwin.github.io/prog/gmxtop.html>. 建议使用Chrome, 因为我没有测试其他浏览器. 界面尚未美化, 看起来有点简陋.

### 分子构型格式

暂时支持读入`.pdb`和`.mol`格式的分子构型文件, 而且文件中必须包含原子间的连接信息, 因为程序要使用这些连接信息来确定原子间的成键信息.

这两种格式的分子构型文件都可以使用GaussView获得, 程序只测试过GaussView的输出格式, 尚未测试其他分子编辑软件. 鉴于各种软件给出的`.pdb`格式不尽相同, 建议优先使用`.mol`格式.

### 指定原子类型

有三种方式指定原子类型:

1. 右上方分子结构窗口中点击原子后, 原子会高亮, 同时弹出所有可能匹配的原子类型及其相应的示意图. 图片中对应的原子类型以红色表示. 双击图片即可完成指定. 也可选点击图片前面的按钮, `OK`确认后完成指定.
2. 如果需要同时指定多个原子的原子类型, 可在左上方文本框内选中多个原子, 然后点击`Assign Atom Type`, 然后指定. 当然, 这种方法也可以用于单个原子.
3. 使用[MKTOP](http://www.aribeiro.net.br/mktop/)的判定方法自动指认原子类型. 点击`Try  AUTO  Assign`即可. 由于运行时间稍长, 请耐心. 有关说明见[GMXTOP：集成MKTOP的原子类型判定代码](https://jerkwin.github.io/2017/12/09/GMXTOP-%E9%9B%86%E6%88%90MKTOP%E7%9A%84%E5%8E%9F%E5%AD%90%E7%B1%BB%E5%9E%8B%E5%88%A4%E5%AE%9A%E4%BB%A3%E7%A0%81/)

注意, 自动指认原子类型时可能存在无法判定的情况, 必要时附加手动指定. 如果判断原子类型存在困难, 你可以试着先用tppmktop来处理一下, 参考它给出的原子类型. 在大多数情况下, tmmktop给出的原子类型都是正确的.

### 生成拓扑文件

指定好每个原子的原子类型后, `OPLSAA Atom Types`文本框内会列出每个原子的原子类型, 这些原子类型也可以直接进行修改. 确认正确后, 点击`Create Topology File`即可生成GROMACS拓扑文件. 点击`Save  .top  File`即可下载生成的拓扑文件.

如果你要使用拓扑文件中的电荷, 一个判断拓扑文件好坏的简单标准就是看整个分子的净电荷`qtot`与实际是否相符. 如果基本相符, 那说明原子类型的指认还是比较正确的. 否则的话, 那就需要你仔细检查每个原子的原子类型了.

对一些特殊的原子类型, 它们之间的成键相互作用项可能缺失, 得到的拓扑文中会标识`!!! NOT DEFINED !!!`. 在使用拓扑文件前, 你需要将这些缺失项补充完整. 补充的方法一个是拟合, 一个是采用相近原子类型的成键参数.

### 测试拓扑文件

如果对生成的拓扑文件满意, 可以依次点击`Save  .gro  File`和`Save  .mdp  File`保存运行GROMACS所需的结构文件和参数文件, 然后`gmx grompp; gmx mdrun`就可以快速地运行模拟来测试得到的拓扑是否合适了.

### 其他辅助功能

- 鼠标滚轮: 缩放
- `Ctrl`+鼠标左键: 平移
- `Labels`: 可显示每个原子的编号, 用于区分
- `Hide H`: 隐藏氢原子
- `Reset View`: 重新将分子居中显示
- `Rot X/Y/Z`: 自动旋转开关

## 简单示例

### MeNO2

<table class="highlighttable"><th colspan="2" style="text-align:left">MeNO2.pdb</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
16</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>REMARK   <span style="color: #666666">1</span> File created by GaussView <span style="color: #666666">5.0</span>.<span style="color: #666666">9</span>
HETATM    <span style="color: #666666">1</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-2.245</span>   <span style="color: #666666">0.945</span>  <span style="color: #666666">-0.011</span>                       C
HETATM    <span style="color: #666666">2</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-1.888</span>  <span style="color: #666666">-0.063</span>  <span style="color: #666666">-0.011</span>                       H
HETATM    <span style="color: #666666">3</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-1.888</span>   <span style="color: #666666">1.450</span>  <span style="color: #666666">-0.885</span>                       H
HETATM    <span style="color: #666666">4</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-3.315</span>   <span style="color: #666666">0.946</span>  <span style="color: #666666">-0.012</span>                       H
HETATM    <span style="color: #666666">5</span>  N           <span style="color: #666666">0</span>      <span style="color: #666666">-1.755</span>   <span style="color: #666666">1.638</span>   <span style="color: #666666">1.189</span>                       N
HETATM    <span style="color: #666666">6</span>  O           <span style="color: #666666">0</span>      <span style="color: #666666">-1.548</span>   <span style="color: #666666">2.858</span>   <span style="color: #666666">1.158</span>                       O
HETATM    <span style="color: #666666">7</span>  O           <span style="color: #666666">0</span>      <span style="color: #666666">-1.549</span>   <span style="color: #666666">1.002</span>   <span style="color: #666666">2.230</span>                       O
<span style="color: #AA22FF">END</span>
CONECT    <span style="color: #666666">1</span>    <span style="color: #666666">2</span>    <span style="color: #666666">3</span>    <span style="color: #666666">4</span>    <span style="color: #666666">5</span>
CONECT    <span style="color: #666666">2</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">3</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">4</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">5</span>    <span style="color: #666666">6</span>    <span style="color: #666666">7</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">6</span>    <span style="color: #666666">5</span>
CONECT    <span style="color: #666666">7</span>    <span style="color: #666666">5</span>
</pre></div>
</td></tr></table>

自动指定原子类型即可, 程序判断无误.

### PhCNHNH2

<table class="highlighttable"><th colspan="2" style="text-align:left">PhCNHNH2.pdb</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
36</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>REMARK   <span style="color: #666666">1</span> File created by GaussView <span style="color: #666666">5.0</span>.<span style="color: #666666">9</span>
HETATM    <span style="color: #666666">1</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-1.372</span>   <span style="color: #666666">1.261</span>   <span style="color: #666666">1.088</span>                       C
HETATM    <span style="color: #666666">2</span>  N           <span style="color: #666666">0</span>      <span style="color: #666666">-0.527</span>   <span style="color: #666666">2.236</span>   <span style="color: #666666">0.993</span>                       N
HETATM    <span style="color: #666666">3</span>  H           <span style="color: #666666">0</span>       <span style="color: #666666">0.072</span>   <span style="color: #666666">2.456</span>   <span style="color: #666666">1.763</span>                       H
HETATM    <span style="color: #666666">4</span>  N           <span style="color: #666666">0</span>      <span style="color: #666666">-1.452</span>   <span style="color: #666666">0.477</span>   <span style="color: #666666">2.329</span>                       N
HETATM    <span style="color: #666666">5</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-1.206</span>   <span style="color: #666666">1.057</span>   <span style="color: #666666">3.106</span>                       H
HETATM    <span style="color: #666666">6</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-2.386</span>   <span style="color: #666666">0.138</span>   <span style="color: #666666">2.449</span>                       H
HETATM    <span style="color: #666666">7</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-2.293</span>   <span style="color: #666666">0.922</span>  <span style="color: #666666">-0.098</span>                       C
HETATM    <span style="color: #666666">8</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-3.208</span>  <span style="color: #666666">-0.134</span>   <span style="color: #666666">0.005</span>                       C
HETATM    <span style="color: #666666">9</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-2.216</span>   <span style="color: #666666">1.669</span>  <span style="color: #666666">-1.281</span>                       C
HETATM   <span style="color: #666666">10</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-4.046</span>  <span style="color: #666666">-0.443</span>  <span style="color: #666666">-1.075</span>                       C
HETATM   <span style="color: #666666">11</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-3.267</span>  <span style="color: #666666">-0.705</span>   <span style="color: #666666">0.908</span>                       H
HETATM   <span style="color: #666666">12</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-3.054</span>   <span style="color: #666666">1.360</span>  <span style="color: #666666">-2.361</span>                       C
HETATM   <span style="color: #666666">13</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-1.517</span>   <span style="color: #666666">2.475</span>  <span style="color: #666666">-1.360</span>                       H
HETATM   <span style="color: #666666">14</span>  C           <span style="color: #666666">0</span>      <span style="color: #666666">-3.969</span>   <span style="color: #666666">0.304</span>  <span style="color: #666666">-2.258</span>                       C
HETATM   <span style="color: #666666">15</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-4.745</span>  <span style="color: #666666">-1.250</span>  <span style="color: #666666">-0.996</span>                       H
HETATM   <span style="color: #666666">16</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-2.995</span>   <span style="color: #666666">1.931</span>  <span style="color: #666666">-3.264</span>                       H
HETATM   <span style="color: #666666">17</span>  H           <span style="color: #666666">0</span>      <span style="color: #666666">-4.610</span>   <span style="color: #666666">0.068</span>  <span style="color: #666666">-3.082</span>                       H
<span style="color: #AA22FF">END</span>
CONECT    <span style="color: #666666">1</span>    <span style="color: #666666">2</span>    <span style="color: #666666">4</span>    <span style="color: #666666">7</span>
CONECT    <span style="color: #666666">2</span>    <span style="color: #666666">3</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">3</span>    <span style="color: #666666">2</span>
CONECT    <span style="color: #666666">4</span>    <span style="color: #666666">5</span>    <span style="color: #666666">6</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">5</span>    <span style="color: #666666">4</span>
CONECT    <span style="color: #666666">6</span>    <span style="color: #666666">4</span>
CONECT    <span style="color: #666666">7</span>    <span style="color: #666666">8</span>    <span style="color: #666666">9</span>    <span style="color: #666666">1</span>
CONECT    <span style="color: #666666">8</span>    <span style="color: #666666">7</span>   <span style="color: #666666">10</span>   <span style="color: #666666">11</span>
CONECT    <span style="color: #666666">9</span>    <span style="color: #666666">7</span>   <span style="color: #666666">12</span>   <span style="color: #666666">13</span>
CONECT   <span style="color: #666666">10</span>    <span style="color: #666666">8</span>   <span style="color: #666666">14</span>   <span style="color: #666666">15</span>
CONECT   <span style="color: #666666">11</span>    <span style="color: #666666">8</span>
CONECT   <span style="color: #666666">12</span>   <span style="color: #666666">14</span>    <span style="color: #666666">9</span>   <span style="color: #666666">16</span>
CONECT   <span style="color: #666666">13</span>    <span style="color: #666666">9</span>
CONECT   <span style="color: #666666">14</span>   <span style="color: #666666">10</span>   <span style="color: #666666">12</span>   <span style="color: #666666">17</span>
CONECT   <span style="color: #666666">15</span>   <span style="color: #666666">10</span>
CONECT   <span style="color: #666666">16</span>   <span style="color: #666666">12</span>
CONECT   <span style="color: #666666">17</span>   <span style="color: #666666">14</span>
</pre></div>
</td></tr></table>

自动指定的原子类型有误, 需要手动重新指定. 原子类型位于`opls_736`附近.

### 石墨烯

<table class="highlighttable"><th colspan="2" style="text-align:left">gra.pdb</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
67</pre></div></td><td class="code"><div class="highlight"><pre style="line-height:125%"><span></span>TITLE      tip
REMARK   <span style="color: #666666">1</span> File created by GaussView <span style="color: #666666">5.0</span>.<span style="color: #666666">9</span>
HETATM    <span style="color: #666666">1</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">0.500</span>   <span style="color: #666666">0.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">2</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">1.710</span>   <span style="color: #666666">1.200</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">3</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">1.710</span>   <span style="color: #666666">2.600</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">4</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">0.500</span>   <span style="color: #666666">3.300</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">5</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">2.920</span>   <span style="color: #666666">0.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">6</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">4.130</span>   <span style="color: #666666">1.200</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">7</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">4.130</span>   <span style="color: #666666">2.600</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">8</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">2.920</span>   <span style="color: #666666">3.300</span>   <span style="color: #666666">0.500</span>                       C
HETATM    <span style="color: #666666">9</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">0.500</span>   <span style="color: #666666">4.700</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">10</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">1.710</span>   <span style="color: #666666">5.400</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">11</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">1.710</span>   <span style="color: #666666">6.800</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">12</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">0.500</span>   <span style="color: #666666">7.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">13</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">2.920</span>   <span style="color: #666666">4.700</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">14</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">4.130</span>   <span style="color: #666666">5.400</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">15</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">4.130</span>   <span style="color: #666666">6.800</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">16</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">2.920</span>   <span style="color: #666666">7.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">17</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">5.350</span>   <span style="color: #666666">0.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">18</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">6.560</span>   <span style="color: #666666">1.200</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">19</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">6.560</span>   <span style="color: #666666">2.600</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">20</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">5.350</span>   <span style="color: #666666">3.300</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">21</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">7.770</span>   <span style="color: #666666">0.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">22</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">8.980</span>   <span style="color: #666666">1.200</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">23</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">8.980</span>   <span style="color: #666666">2.600</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">24</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">7.770</span>   <span style="color: #666666">3.300</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">25</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">5.350</span>   <span style="color: #666666">4.700</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">26</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">6.560</span>   <span style="color: #666666">5.400</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">27</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">6.560</span>   <span style="color: #666666">6.800</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">28</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">5.350</span>   <span style="color: #666666">7.500</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">29</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">7.770</span>   <span style="color: #666666">4.700</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">30</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">8.980</span>   <span style="color: #666666">5.400</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">31</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">8.980</span>   <span style="color: #666666">6.800</span>   <span style="color: #666666">0.500</span>                       C
HETATM   <span style="color: #666666">32</span>  C           <span style="color: #666666">0</span>       <span style="color: #666666">7.770</span>   <span style="color: #666666">7.500</span>   <span style="color: #666666">0.500</span>                       C
<span style="color: #AA22FF">END</span>
CONECT    <span style="color: #666666">1</span>    <span style="color: #666666">2</span>   <span style="color: #666666">22</span>   <span style="color: #666666">12</span>
CONECT    <span style="color: #666666">2</span>    <span style="color: #666666">1</span>    <span style="color: #666666">3</span>    <span style="color: #666666">5</span>
CONECT    <span style="color: #666666">3</span>    <span style="color: #666666">2</span>    <span style="color: #666666">4</span>    <span style="color: #666666">8</span>
CONECT    <span style="color: #666666">4</span>    <span style="color: #666666">3</span>    <span style="color: #666666">9</span>   <span style="color: #666666">23</span>
CONECT    <span style="color: #666666">5</span>    <span style="color: #666666">2</span>    <span style="color: #666666">6</span>   <span style="color: #666666">16</span>
CONECT    <span style="color: #666666">6</span>    <span style="color: #666666">5</span>    <span style="color: #666666">7</span>   <span style="color: #666666">17</span>
CONECT    <span style="color: #666666">7</span>    <span style="color: #666666">6</span>    <span style="color: #666666">8</span>   <span style="color: #666666">20</span>
CONECT    <span style="color: #666666">8</span>    <span style="color: #666666">3</span>    <span style="color: #666666">7</span>   <span style="color: #666666">13</span>
CONECT    <span style="color: #666666">9</span>    <span style="color: #666666">4</span>   <span style="color: #666666">10</span>   <span style="color: #666666">30</span>
CONECT   <span style="color: #666666">10</span>    <span style="color: #666666">9</span>   <span style="color: #666666">11</span>   <span style="color: #666666">13</span>
CONECT   <span style="color: #666666">11</span>   <span style="color: #666666">10</span>   <span style="color: #666666">12</span>   <span style="color: #666666">16</span>
CONECT   <span style="color: #666666">12</span>    <span style="color: #666666">1</span>   <span style="color: #666666">11</span>   <span style="color: #666666">31</span>
CONECT   <span style="color: #666666">13</span>    <span style="color: #666666">8</span>   <span style="color: #666666">10</span>   <span style="color: #666666">14</span>
CONECT   <span style="color: #666666">14</span>   <span style="color: #666666">13</span>   <span style="color: #666666">15</span>   <span style="color: #666666">25</span>
CONECT   <span style="color: #666666">15</span>   <span style="color: #666666">14</span>   <span style="color: #666666">16</span>   <span style="color: #666666">28</span>
CONECT   <span style="color: #666666">16</span>    <span style="color: #666666">5</span>   <span style="color: #666666">11</span>   <span style="color: #666666">15</span>
CONECT   <span style="color: #666666">17</span>    <span style="color: #666666">6</span>   <span style="color: #666666">18</span>   <span style="color: #666666">28</span>
CONECT   <span style="color: #666666">18</span>   <span style="color: #666666">17</span>   <span style="color: #666666">19</span>   <span style="color: #666666">21</span>
CONECT   <span style="color: #666666">19</span>   <span style="color: #666666">18</span>   <span style="color: #666666">20</span>   <span style="color: #666666">24</span>
CONECT   <span style="color: #666666">20</span>    <span style="color: #666666">7</span>   <span style="color: #666666">19</span>   <span style="color: #666666">25</span>
CONECT   <span style="color: #666666">21</span>   <span style="color: #666666">18</span>   <span style="color: #666666">22</span>   <span style="color: #666666">32</span>
CONECT   <span style="color: #666666">22</span>    <span style="color: #666666">1</span>   <span style="color: #666666">21</span>   <span style="color: #666666">23</span>
CONECT   <span style="color: #666666">23</span>    <span style="color: #666666">4</span>   <span style="color: #666666">22</span>   <span style="color: #666666">24</span>
CONECT   <span style="color: #666666">24</span>   <span style="color: #666666">19</span>   <span style="color: #666666">23</span>   <span style="color: #666666">29</span>
CONECT   <span style="color: #666666">25</span>   <span style="color: #666666">14</span>   <span style="color: #666666">20</span>   <span style="color: #666666">26</span>
CONECT   <span style="color: #666666">26</span>   <span style="color: #666666">25</span>   <span style="color: #666666">27</span>   <span style="color: #666666">29</span>
CONECT   <span style="color: #666666">27</span>   <span style="color: #666666">26</span>   <span style="color: #666666">28</span>   <span style="color: #666666">32</span>
CONECT   <span style="color: #666666">28</span>   <span style="color: #666666">15</span>   <span style="color: #666666">17</span>   <span style="color: #666666">27</span>
CONECT   <span style="color: #666666">29</span>   <span style="color: #666666">24</span>   <span style="color: #666666">26</span>   <span style="color: #666666">30</span>
CONECT   <span style="color: #666666">30</span>    <span style="color: #666666">9</span>   <span style="color: #666666">29</span>   <span style="color: #666666">31</span>
CONECT   <span style="color: #666666">31</span>   <span style="color: #666666">12</span>   <span style="color: #666666">30</span>   <span style="color: #666666">32</span>
CONECT   <span style="color: #666666">32</span>   <span style="color: #666666">21</span>   <span style="color: #666666">27</span>   <span style="color: #666666">31</span>
</pre></div>
</td></tr></table>

周期性的体系, 无法使用自动的方法指定原子类型(否则程序会陷入死循环), 手动指定所有原子类型为`opls_147`即可.

## 待完成

1. 反常二面角原子顺序可能与其他程序所给的不一致, 待考.
1. OPLS原子类型示例图已完成, 但可能存在错误之处, 待查.
2. 扩展到支持其他力场的原子类型, 如amber, charmm等.
5. 对分子结构进行分析, 显示原子类型时按匹配度高低排序, 尽可能自动化, 减少选择时的纠结.
3. 美化界面
4. 分子结构显示可换用Three.js, CH5M3D效果和效率不佳.

## 致谢

没有下面这些人的热心付出, GMXTOP工具是很难完成的. 如果你使用这个工具, 请感谢他们的努力与付出.

- 张楠@北京   :  58-96
- 蒲中机@大连 : 101-130
- 黄建湘@杭州 : 141-173
- 叶盛@合肥   : 178-192, 197-212
- 梅龙灿@武汉 : 217, 222-241
- 刘恒江@上海 : 247-282
- 郝阳@上海   : 285-318
- 马郑@天津   : 320-348
- 康文渊@成都 : 349-380
- 刘清南@西安 : 398-424
- 杜春保@西安 : 425-459
- 李正@西安   : 460-473, 490-496
- 吴思晋@大连 : 497-537
- 刘凤海@成都 : 569-598
- 刘胜堂@苏州 : 603-645
- 张国成@成都 : 645-681
- 席昆@武汉   : 542-565, 677-713, 913-940
- 吴念@武汉   : 714-748
- 李乐乐@成都 : 749-758, 771-779, 785
- 王新宇@天津 : 941-MW
