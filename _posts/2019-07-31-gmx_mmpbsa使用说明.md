---
 layout: post
 title: gmx_mmpbsa使用说明
 categories:
 - 科
 tags:
 - gmx
---

- 2019-07-31 10:14:58 初稿
- 2019-09-19 10:07:02 修订

## 缘起

很多年后, 当我再次更新这个工具, 就会记起, 很多年前, 我开始研究GROMACS中MMPBSA实现方法的情境. 那时的我就已经发现已有了两种解决方式: `GMXPBSA`脚本与`g_mmpbsa`程序. 我粗略地测试一下, 还算可用, 但未能尽美, 可改进之处也颇多. 因为我不经常使用, 便也就无所谓了, 暴虎冯河, 用过即忘, 倒也合适.

时间流逝, 形势在变, 心境也在变. 当我觉得真正需要测试一下MMPBSA方法时, 又回想起这两种解决方式, 重新捡拾起先前的操作, 才发现颇不顺手. `GMXPBSA`对GROMACS版本有要求, 脚本也颇得意大利人的风骨, 一如Italic的中文, 让我厌烦. 出起错来却又如意大利面, 纠纠结结, 纠缠不清, 让人无可措手, 只想烈马快刀, 一斩了之. `g_mmpbsa`呢, 印度人的作品, 传至东土已有些时日, 受者众多, 却仍有水土不服之虞. 安装麻烦, 二进制包Windows下也无法使用. 外加只能使用特定版本的GROMACS和APBS, 而无法兼容最新版本. 我本想好好参阅代码真经, 希冀修饬一二, 传与他人, 也算得我功德一件. 可总不得五蕴皆空, 六根清净. 既已如此, 又何须执著? 倒不如我也来写一段, 看看传得传不得.

## 简介

`gmx_mmpbsa`用于计算GROMACS轨迹的MMPBSA结合能, 并进行能量分解. 计算时, MM部分由脚本自行完成, PBSA部分借助APBS程序完成. 因此, 在使用`gmx_mmpbsa`前, 必需安装好GROMACS和APBS程序. 如果你已经需要使用这个脚本了, 那说明你已经得到了GROMACS的轨迹, GROMACS自然是已经安装好了的. 而APBS的安装也很简单, 官方网站提供了二进制版本, Linux和Windows下的都有, 拖过来就可以用.

`gmx_mmpbsa`计算MM和PBSA所需的原子参数(电荷, 半径, LJ参数等)来自GROMACS的`.tpr`文件, 因此, 需要调用`gmx dump`程序处理`.tpr`文件, 以便抽取所需的参数. 采用这种方法, 可以避免版本不兼容的问题, 因此也就可以支持任意版本的GROMACS. 对于APBS也是一样, 只要APBS的输入文件格式没有变化, 那`gmx_mmpbsa`生成的APBS输入文件就可以用于任意版本的APBS. 这样我们就可以安装GROMACS和APBS的最新版本而不用担心兼容性问题.

`gmx_mmpbsa`还使用了`gmx trjconv`程序, 用于处理轨迹的周期性叠合问题. 当然, 这一步你可以自己完成, 而无需借助脚本, 特别是在需要对周期性进行特殊处理的情况下.

在Windows下使用时, 还需要一个bash环境, 你可以使用msys2, Git Bash, 或cygwin.

## 使用流程

### 1. 获得输入文件

1. 生成`tpr`文件, 预平衡
1. 运行成品模拟, 得到`xtc`轨迹文件
1. 生成ndx文件, 其中需要定义三个组: 复合物(`com`), 蛋白(`pro`), 配体(`lig`). 名字虽然是`pro`, `lig`, 但其实可以代表任意分子, 比如两个有机小分子, 而不一定就是蛋白和配体.
1. 处理轨迹. 如果存在二聚体, 团簇等情况, 确保组成的原子间没有分离. 其他情况脚本可自动处理.

### 2. 设定`gmx_mmpbsa`计算参数

#### 程序路径

- `apbs='c:/apbs1.5/bin/apbs.exe' # APBS`: APBS可执行文件的完整路径. Linux系统下如: `apbs='/home/users/APBS/bin/apbs'`.

#### 基本参数

- `ff=AMBER`:      力场类型, AMBER, OPLS, CHARMM
- `trj=1EBZ.xtc`:  轨迹文件
- `tpr=1EBZ.tpr`:  tpr文件
- `ndx=index.ndx`: 索引文件
- `com=System`:    复合物索引组
- `pro=Protein`:   蛋白索引组
- `lig=BEC`:       配体索引组

将`trj`, `tpr`, `ndx`等变量指向相应文件, 将`com`, `pro`, `lig`指向索引文件中相应的索引组.

其他参数主要是APBS计算所用的极性参数, 非极性参数, 网格参数, 一般无需更改太多.

### 3. 运行脚本

1. 脚本首先处理轨迹: 1. 完整化; 2. 居中叠合. 之后将构型输出到`pdb`文件.
1. 脚本其次抽取`tpr`中的原子信息, 存放在`qrv`文件中. 主要是复合物中每个原子的电荷, 半径, LJ参数以及残基信息.
1. 脚本根据`pdb`文件中原子的坐标获取APBS网格参数, 并将每帧构型输出到APBS所需的`pqr`文件, 同时生成APBS输入文件`*.apbs`. 然后调用APBS计算每帧构型对应的apbs文件, 并计算极性PB, 非极性SA部分的贡献, 再计算MM贡献, 同时进行残基分解, 输出结果.

由于脚本在计算时是分步进行的, 因此你可以先将所有apbs文件都产生出来然后并行计算它们, 最后再统计结果. 当然这只有在计算构型较多的情况下才值得尝试.

## 文件说明

<table id='tab-0'><caption>脚本及文件说明&emsp;&emsp;<input type='button' id='tab-0_tog' value='折叠表格' onclick="togtab('tab-0', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">文件</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>gmx_mmpbsa.bsh</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">总脚本</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid.pdb</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">转换为pdb的轨迹</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid.qrv</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">原子的电荷, 半径, VDW参数, 以及原子信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:center;">APBS相关文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns.apbs</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">APBS输入文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns.out</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">APBS输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns_com.pqr</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">复合物pqr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns_lig.pqr</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">配体pqr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns_pro.pqr</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白pqr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns~COU+VDW.pdb</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">复合物pdb文件, Occupancy列为COU能, beta列为VDW能</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns~PB+SA.pdb</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">复合物pdb文件, Occupancy列为PB能, beta列为SA能</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns~res_MM+PBSA.pdb</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">复合物pdb文件, Occupancy列为MM能, beta列为PBSA能</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~XX.Yns~res_MMPBSA.pdb</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">复合物pdb文件, beta列为MMPBSA能</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:center;">输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~MMPBSA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">总能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~res_MMPBSA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">总能量分解到残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~resMM.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">MM能量分解到残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~resMM_COU.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">COU能量分解到残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~resMM_VDW.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">VDW能量分解到残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~resPBSA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">PBSA能量分解到残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~resPBSA_PB.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">PB能量分解到残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>_pid~resPBSA_SA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">SA能量分解到残基</td>
</tr>
</table>

## 用户反馈

### 与`GMXPBSA`相比

- `GMXPBSA`只能给出总的结果, 而`gmx_mmpbsa`可给出MM, PB, SA总的结果和残基分解结果;
- `GMXPBSA`使用时若体系中存在自定义拓扑或残基, 则需要提供相应的拓扑或力场文件;
- `GMXPBSA`原有脚本生成并使用的`Mm.mdp`文件较老, 需要手动修改`print_files.dat`脚本;
- `GMXPBSA`出错时需要进入子目录查看错误原因, 重新运行时又要删除子目录, 否则不能运行, 因而调试较为繁琐;
- `GMXPBSA`需先后运行三个脚本, 而`gmx_mmpbsa`只需要运行一次;
- `GMXPBSA`可实现甘氨酸扫描(CAS), `gmx_mmpbsa`尚未实现.

### 与`g_mmpbsa`相比

- `g_mmpbsa`需要安装, 而`gmx_mmpbsa`无需安装, 简单修改后可直接使用;
- `g_mmpbsa`需手动分别运行计算MM, PB, SA的能量, 而`gmx_mmpbsa`只需要运行一次.
- `g_mmpbsa`计算速度较慢, 而`gmx_mmpbsa`脚本计算速度较快, 因可以使用最新版本的APBS程序, 支持并行.
- `g_mmpbsa`可实现任意残基突变, `gmx_mmpbsa`尚未实现.
- `g_mmpbsa`支持其他非极性模型, 如SAV, WCA, `gmx_mmpbsa`尚未实现.

## 有待改进

- 结果的误差统计
- GB方法
- 其他非极性模型
- 调用其他PB程序, 如AMBER的PBSA
- 熵的贡献
- 形变能的贡献
- 甘氨酸扫描, 任意残基突变
- APBS mg-para方法处理超大蛋白

## 测试: `g_mmpbsa`的1EBZ示例

### MM能量

计算方法: 直接对势累加, 考虑溶质(蛋白)的介电常数`pdie`, 不使用周期性, 不使用截断, 不对构型进行优化.

注意: `GMXPBSA`未考虑`pdie`, 且使用周期性, 使用截断, 对构型进行了优化, 但所得结果差距不大.

<table id='tab-1'><caption>MM能量计算结果对比&emsp;&emsp;<input type='button' id='tab-1_tog' value='折叠表格' onclick="togtab('tab-1', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">g_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">gmx_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">GMXPBSA</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">File</td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>energy_MM.xvg</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~MMPBSA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>stru.rep</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">COU</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-147.150</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-147.202</td>
  <td rowspan="1" colspan="1" style="text-align:left;">-146.2175(-292.435/2)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VDW</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-321.145</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-321.087</td>
  <td rowspan="1" colspan="1" style="text-align:left;">-324.861</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MM(VDW+COU)</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-468.295</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-468.289</td>
  <td rowspan="1" colspan="1" style="text-align:left;">-471.0785</td>
</tr>
</table>

### MM能量分解

计算方法: 直接累加

![](https://jerkwin.github.io/pic/gmx/gmx_mmpbsa_mm.png)

<table id='tab-2'><caption>MM能量分解计算结果对比&emsp;&emsp;<input type='button' id='tab-2_tog' value='折叠表格' onclick="togtab('tab-2', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">g_mmpbsa</th>
  <th rowspan="1" colspan="3" style="text-align:center;">gmx_mmpbsa</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">File</td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>contrib_MM.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~resMM.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~resMM_COU.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~resMM_VDW.dat</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-1</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.204</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.204</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.207</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.061</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.061</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.066</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.059</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.059</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-4</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.043</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.044</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.091</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.090</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-6</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.022</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.022</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-7</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.169</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.169</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.113</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.056</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-8</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-7.111</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-7.117</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.240</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.877</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-9</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.139</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.139</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.039</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.179</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.216</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.216</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.038</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.178</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-11</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.033</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.032</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-12</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.035</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.035</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.025</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-13</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.023</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-14</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.118</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.118</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.113</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-15</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-16</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-17</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-18</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-19</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-20</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.500</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.499</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.482</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-21</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.382</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.381</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.417</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.036</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-22</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.136</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.052</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.083</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-23</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.308</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.309</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.325</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-24</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.536</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.536</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.245</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.291</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASH-25</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.742</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.716</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.892</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5.176</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-26</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.510</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.510</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.478</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.988</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-27</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-7.689</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-7.685</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.059</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-7.626</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-28</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.496</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.501</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.591</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.910</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-29</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-11.702</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-11.700</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.418</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.282</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-30</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.660</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.658</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3.858</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.200</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-31</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.352</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.352</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.345</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-32</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.243</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.244</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.053</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.297</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-33</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.076</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.076</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.110</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-34</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.577</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.576</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.618</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.042</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-35</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.567</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.566</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.581</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.014</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-36</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">SER-37</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-38</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-39</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-40</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-41</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.062</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.061</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.059</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-42</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-43</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.027</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-44</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.045</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.045</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-45</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.335</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.337</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.504</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.167</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-46</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.318</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.318</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.161</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.157</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-47</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.494</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.493</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.717</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.210</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-48</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.407</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.414</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-7.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.410</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-49</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.918</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.921</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.801</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.120</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-50</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-16.725</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-16.725</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.390</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-15.335</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-51</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.328</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.327</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.202</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.530</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-52</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.047</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.048</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.415</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.463</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-53</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.314</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.313</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.249</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.563</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-54</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.638</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.638</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.076</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.562</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-55</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.215</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.213</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.158</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.055</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-56</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.171</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.171</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.045</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.127</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-57</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.372</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.371</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.347</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.024</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-58</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.067</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.067</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.038</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TYR-59</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.013</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-60</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.203</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.202</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.209</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-61</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.024</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-62</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-63</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-64</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.030</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.030</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.013</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-65</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.060</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-66</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.022</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.022</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-67</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-68</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">HIS-69</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-70</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.054</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.054</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-71</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-72</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-73</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.024</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.024</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-74</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.042</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.033</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-75</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.083</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.082</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.048</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.035</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-76</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.276</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.276</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.265</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-77</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.057</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.057</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.037</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-78</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.031</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-79</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.126</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.086</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-80</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.507</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.507</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.496</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-81</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.052</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.282</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.769</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-82</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.520</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.520</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.056</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.576</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-83</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.244</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.244</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.097</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.341</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-84</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.383</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.376</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.220</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.156</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-85</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.503</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.503</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.207</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.296</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-86</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.489</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.489</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.223</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.266</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-87</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.074</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.070</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.606</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.536</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-88</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.087</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.086</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.025</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.111</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-89</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-90</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.048</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.048</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.056</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-91</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-92</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.035</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.035</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.026</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-93</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.009</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-94</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-95</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-96</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.058</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.058</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.069</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-97</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.038</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.038</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.087</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.049</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-98</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.093</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.093</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.084</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-99</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.609</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.609</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.596</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.013</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-101</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.637</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.637</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.641</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-103</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-104</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.095</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-105</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.064</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-106</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.038</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.032</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.085</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.050</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-108</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.903</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.895</td>
  <td rowspan="1" colspan="1" style="text-align:center;">4.998</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.102</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-109</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.350</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.350</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.193</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.156</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-110</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.072</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.072</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.090</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.161</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-111</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.077</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.031</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-112</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.026</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.026</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.035</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-113</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.027</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-114</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.392</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.391</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.396</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-115</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-116</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-117</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-118</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.050</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.014</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.014</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.019</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-120</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.558</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.558</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.579</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.022</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-121</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.704</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.704</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.638</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.065</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-122</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.200</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.098</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-123</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.696</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.696</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.157</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.853</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-124</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.594</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.594</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.302</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.292</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-25.997</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-25.986</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-24.723</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.263</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-126</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.361</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.361</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.367</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.728</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-127</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-12.305</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-12.314</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.690</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.624</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-128</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-13.661</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-13.660</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.604</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.056</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-129</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.844</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.849</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2.647</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-9.495</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-130</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.428</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.433</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.495</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.928</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-131</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.750</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.750</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.150</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.901</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-132</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.478</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.477</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.331</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.147</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-133</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.162</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.156</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-134</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.015</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.015</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.903</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.111</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.130</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.130</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.153</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.022</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-136</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">SER-137</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.025</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-138</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-139</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-140</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-141</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.200</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.200</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.198</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-142</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-143</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.574</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.574</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.559</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-144</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.056</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.056</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-145</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.415</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.415</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.068</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.347</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-146</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.406</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.407</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.249</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.157</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-147</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.248</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.249</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.374</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-148</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.601</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.602</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.655</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.947</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-149</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.792</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-10.785</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.451</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.334</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-150</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-20.312</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-20.303</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.702</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-14.601</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-151</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.550</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.551</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.968</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.583</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-152</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.274</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.274</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.580</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.306</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-153</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.435</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.436</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.082</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.354</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-154</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.386</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.386</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.488</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-155</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.053</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.053</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.987</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.066</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-156</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.268</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.268</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.274</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-157</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.385</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.385</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.337</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.048</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-158</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TYR-159</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.030</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.023</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.282</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.282</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.292</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-161</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-162</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.013</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.013</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.009</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-163</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-164</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.019</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.019</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-165</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.459</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.459</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.454</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-166</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.030</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.030</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.047</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-167</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-168</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.023</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.023</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.025</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">HIS-169</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-170</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.240</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.239</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.243</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-171</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-172</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-173</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.014</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.014</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-174</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.060</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.058</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-175</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.063</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.058</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-176</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.081</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.080</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.139</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.942</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-177</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.070</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.075</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-178</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.343</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.343</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.268</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.075</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-179</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.234</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.234</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.466</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.232</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-180</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.084</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.104</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-181</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.907</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.907</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.285</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-3.191</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-182</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.923</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-4.922</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.213</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5.135</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-183</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.565</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.565</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.152</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.413</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-184</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.518</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.519</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.443</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6.961</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-185</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.517</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.517</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.183</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.334</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-186</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.707</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.708</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.281</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.427</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-187</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.021</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.384</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.636</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-188</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.358</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.358</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.161</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.198</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-189</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.063</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-190</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.077</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.077</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.036</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.113</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-191</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.044</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.044</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.024</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-192</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-193</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.024</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-194</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-195</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.047</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.047</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.026</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.021</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-196</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.040</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.012</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-197</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.058</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.048</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-198</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.027</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.027</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-199</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.295</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.295</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.287</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">BEC-200</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-234.069</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-234.145</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-73.601</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-160.544</td>
</tr>
</table>

### PB(极性)能量, Polar solvation enrgy

计算方法: 水相能量减去真空中的能量, PB=Esol-Evac

<table id='tab-3'><caption>g_mmpbsa PB能量计算示例&emsp;&emsp;<input type='button' id='tab-3_tog' value='折叠表格' onclick="togtab('tab-3', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">com</th>
  <th rowspan="1" colspan="1" style="text-align:center;">pro</th>
  <th rowspan="1" colspan="1" style="text-align:center;">lig</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Esol</td>
  <td rowspan="1" colspan="1" style="text-align:center;">164517.154959</td>
  <td rowspan="1" colspan="1" style="text-align:center;">161287.089351</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1841.194271</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Evac</td>
  <td rowspan="1" colspan="1" style="text-align:center;">170135.930761</td>
  <td rowspan="1" colspan="1" style="text-align:center;">167060.999097</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1997.546166</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PB</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5618.775802</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5773.909746</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-156.351895</td>
</tr>
</table>

<table id='tab-4'><caption>PB能量计算结果对比&emsp;&emsp;<input type='button' id='tab-4_tog' value='折叠表格' onclick="togtab('tab-4', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">g_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">gmx_mmpbsa<br>(相同电荷/网格)</th>
  <th rowspan="1" colspan="1" style="text-align:center;">gmx_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">GMXPBSA</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">File</td>
  <td rowspan="1" colspan="1" style="text-align:right;"><code>polar.xvg</code></td>
  <td rowspan="1" colspan="2" style="text-align:center;"><code>_pid~MMPBSA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>stru0.out</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">com</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5618.776</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5658.630</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5786.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-8830.573</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">pro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5773.910</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5816.675</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5955.618</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-9038.944</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">lig</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-156.352</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-152.874</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-153.638</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-166.433</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:right;">dPB(com-pro-lig)</td>
  <td rowspan="1" colspan="1" style="text-align:center;">311.486</td>
  <td rowspan="1" colspan="1" style="text-align:center;">310.919</td>
  <td rowspan="1" colspan="1" style="text-align:center;">323.222</td>
  <td rowspan="1" colspan="1" style="text-align:center;">374.805</td>
</tr>
</table>

与`g_mmpbsa`比较, PB能量有差距, 原因在于

- 所用网格不同, `g_mmpbsa`对每个分子构型使用基于其自身的网格, 而`gmx_mmpbsa`使用基于所有构型的网格, 所有APBS计算使用相同的网格.
- 有些原子的半径不同, `g_mmpbsa`根据蛋白原子名称推断半径的方式有些怪异, 与论文所给数据不一致. 对配体, 由于原子名称可以任意取, 所以没有办法直接根据名称推断半径. 下面是`g_mmpbsa`所给蛋白中原子的半径, 可以看到有很多不一致之处.

		CA      1.7
		CB      1.7
		CD      1.7
		CD1     1.7
		CD1     1.77
		CD2     1.7
		CD2     1.77
		CE      1.7
		CE1     1.77
		CE2     1.77
		CE3     1.77
		CG      1.7
		CG      1.77
		CG1     1.7
		CG2     1.7
		CH2     1.77
		CZ      1.7
		CZ      1.77
		CZ2     1.77
		CZ3     1.77
		H       1.2
		H1      1.2
		H2      1.2
		HA      1.2
		HA1     1.2
		HA2     1.2
		HB      1.2
		HB1     1.2
		HB2     1.2
		HB3     1.2
		HD1     1.
		HD1     1.2
		HD11    1.2
		HD12    1.2
		HD13    1.2
		HD2     1.
		HD2     1.2
		HD21    1.2
		HD22    1.2
		HD23    1.2
		HD3     1.2
		HE      1.2
		HE1     1.
		HE1     1.2
		HE2     1.
		HE2     1.2
		HE21    1.2
		HE22    1.2
		HE3     1.
		HE3     1.2
		HG      1.2
		HG1     1.2
		HG11    1.2
		HG12    1.2
		HG13    1.2
		HG2     1.2
		HG21    1.2
		HG22    1.2
		HG23    1.2
		HH      1.2
		HH11    1.2
		HH12    1.2
		HH2     1.
		HH21    1.2
		HH22    1.2
		HZ      1.
		HZ1     1.2
		HZ2     1.
		HZ2     1.2
		HZ3     1.
		HZ3     1.2

- 换用与`g_mmpbsa`相同的网格与半径后, 所得PB作用能差距很小.
- `GMXPBSA`所用网格更大, 且使用了来自LJ参数的半径, 并对构型进行了优化, 所得结果也更大.

### PB能量分解

计算方法: 残基处于复合物中时的能量减去处于其所属分子(蛋白/配体)中的能量, G(res@com)-G(res@pro)

<table id='tab-5'><caption>g_mmpbsa PB能量分解示例&emsp;&emsp;<input type='button' id='tab-5_tog' value='折叠表格' onclick="togtab('tab-5', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">PRO-1@com</th>
  <th rowspan="1" colspan="1" style="text-align:center;">PRO-1@pro</th>
  <th rowspan="1" colspan="1" style="text-align:center;">lig@com</th>
  <th rowspan="1" colspan="1" style="text-align:center;">lig@lig</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">sol</td>
  <td rowspan="1" colspan="1" style="text-align:center;">453.312984</td>
  <td rowspan="1" colspan="1" style="text-align:center;">453.322869</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3197.166762</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1841.194271</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">vac</td>
  <td rowspan="1" colspan="1" style="text-align:center;">490.849104</td>
  <td rowspan="1" colspan="1" style="text-align:center;">490.694707</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3213.732072</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1997.546166</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PB</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-37.53612</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-37.371838</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-16.56531</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-156.351895</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:right;">dPB(@com-@pro)</td>
  <td rowspan="1" colspan="2" style="text-align:center;">-0.164282</td>
  <td rowspan="1" colspan="2" style="text-align:center;">139.786585</td>
</tr>
</table>

<table id='tab-6'><caption>PB能量分解计算结果对比&emsp;&emsp;<input type='button' id='tab-6_tog' value='折叠表格' onclick="togtab('tab-6', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">g_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">gmx_mmpbsa</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">File</td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>contrib_pol.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~resPBSA_PB.dat</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-1</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.164</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.151</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.120</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.120</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.090</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.094</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-4</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.111</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.109</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.073</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.070</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-6</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.024</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.024</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-7</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.209</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.212</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-8</td>
  <td rowspan="1" colspan="1" style="text-align:center;">13.074</td>
  <td rowspan="1" colspan="1" style="text-align:center;">13.140</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-9</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.059</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.050</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.060</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-11</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.031</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.033</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-12</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-13</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.021</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-14</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.047</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.058</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-15</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-16</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.009</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-17</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-18</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.009</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.009</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-19</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-20</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.283</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.311</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-21</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.184</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.210</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-22</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-23</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.115</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.128</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-24</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.491</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.500</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASH-25</td>
  <td rowspan="1" colspan="1" style="text-align:center;">6.903</td>
  <td rowspan="1" colspan="1" style="text-align:center;">6.918</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-26</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.757</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.812</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-27</td>
  <td rowspan="1" colspan="1" style="text-align:center;">6.913</td>
  <td rowspan="1" colspan="1" style="text-align:center;">8.089</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-28</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2.982</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3.538</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-29</td>
  <td rowspan="1" colspan="1" style="text-align:center;">9.555</td>
  <td rowspan="1" colspan="1" style="text-align:center;">9.422</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-30</td>
  <td rowspan="1" colspan="1" style="text-align:center;">4.460</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5.257</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-31</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-32</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.197</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.176</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-33</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.062</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.060</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-34</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.377</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.415</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-35</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.339</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.355</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-36</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">SER-37</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.007</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-38</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-39</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.021</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.023</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-40</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.013</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.014</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-41</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.013</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-42</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.018</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.019</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-43</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.165</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.180</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-44</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.032</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.034</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-45</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.841</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.938</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-46</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.236</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.236</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-47</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.328</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.367</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-48</td>
  <td rowspan="1" colspan="1" style="text-align:center;">13.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">14.797</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-49</td>
  <td rowspan="1" colspan="1" style="text-align:center;">7.420</td>
  <td rowspan="1" colspan="1" style="text-align:center;">7.726</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-50</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.984</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.969</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-51</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.212</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.215</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-52</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.763</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.778</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-53</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.124</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.133</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-54</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.141</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.152</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-55</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.335</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.353</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-56</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.049</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.052</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-57</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.383</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.406</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-58</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.057</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TYR-59</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.032</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.036</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-60</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.297</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.328</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-61</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.013</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.017</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-62</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-63</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.021</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-64</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-65</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.030</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-66</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.030</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-67</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-68</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.007</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">HIS-69</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.026</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-70</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.027</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.036</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-71</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-72</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-73</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.011</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.014</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-74</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.035</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.033</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-75</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.027</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-76</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.094</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.088</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-77</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.022</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.024</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-78</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.053</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.049</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-79</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.164</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.162</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-80</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.010</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-81</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.412</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.451</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-82</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.187</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.214</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-83</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.132</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.157</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-84</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.198</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.180</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-85</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.413</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.410</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-86</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.097</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.089</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-87</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.641</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-2.455</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-88</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.299</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.305</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-89</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.127</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.124</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-90</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.136</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.131</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-91</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-92</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.049</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.044</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-93</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.033</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.030</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-94</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.020</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.016</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-95</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.046</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.040</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-96</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.091</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.092</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-97</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.259</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.259</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-98</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.301</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.303</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-99</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.566</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.550</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-101</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.397</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.386</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.075</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.076</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-103</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.061</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.064</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-104</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.098</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.096</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-105</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.026</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.038</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-106</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.136</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.132</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-108</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2.167</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2.654</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-109</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.336</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.333</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-110</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.128</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.126</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-111</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.117</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.116</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-112</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.050</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-113</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.121</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.119</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-114</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.172</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.167</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-115</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.055</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.054</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-116</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.006</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-117</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.021</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.021</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-118</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.056</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.055</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-120</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.300</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.281</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-121</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.584</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.556</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-122</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.406</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.411</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-123</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.498</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.551</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-124</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.220</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.210</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">51.872</td>
  <td rowspan="1" colspan="1" style="text-align:center;">55.384</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-126</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.122</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-127</td>
  <td rowspan="1" colspan="1" style="text-align:center;">11.324</td>
  <td rowspan="1" colspan="1" style="text-align:center;">12.291</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-128</td>
  <td rowspan="1" colspan="1" style="text-align:center;">4.202</td>
  <td rowspan="1" colspan="1" style="text-align:center;">4.744</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-129</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2.239</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.697</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-130</td>
  <td rowspan="1" colspan="1" style="text-align:center;">13.444</td>
  <td rowspan="1" colspan="1" style="text-align:center;">15.504</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-131</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.439</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.429</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-132</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.663</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.677</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-133</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.118</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-134</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.372</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.341</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.172</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.186</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-136</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.091</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.091</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">SER-137</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.016</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.013</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-138</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.028</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-139</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.008</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.007</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-140</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-141</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.021</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.022</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-142</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-143</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.156</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.169</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-144</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.064</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.065</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-145</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.483</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.422</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-146</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.366</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.357</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-147</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.804</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.763</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-148</td>
  <td rowspan="1" colspan="1" style="text-align:center;">9.259</td>
  <td rowspan="1" colspan="1" style="text-align:center;">9.576</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-149</td>
  <td rowspan="1" colspan="1" style="text-align:center;">6.130</td>
  <td rowspan="1" colspan="1" style="text-align:center;">7.090</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-150</td>
  <td rowspan="1" colspan="1" style="text-align:center;">4.967</td>
  <td rowspan="1" colspan="1" style="text-align:center;">4.954</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-151</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.110</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.124</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-152</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.613</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.606</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-153</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.121</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.111</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-154</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.136</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-155</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.578</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.587</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-156</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.097</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.093</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-157</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.315</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.333</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-158</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.218</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.233</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TYR-159</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.076</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.073</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.124</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.111</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-161</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.052</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.051</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-162</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.047</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.047</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-163</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.023</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.022</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-164</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.063</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.061</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-165</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.324</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.316</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-166</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.075</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.071</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-167</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.030</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.030</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-168</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.041</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">HIS-169</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.004</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-170</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.148</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.144</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-171</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.003</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-172</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.033</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.032</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-173</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.033</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-174</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.280</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.283</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-175</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.314</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.317</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-176</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.161</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.155</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-177</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.067</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.074</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-178</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.274</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.275</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-179</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.595</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.604</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-180</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.535</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.635</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-181</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.029</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.015</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-182</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.655</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.636</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-183</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.158</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.144</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-184</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.982</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.997</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-185</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.336</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.354</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-186</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.727</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.728</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-187</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.185</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.107</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-188</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.616</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.630</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-189</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.417</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.426</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-190</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.402</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.407</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-191</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.018</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.017</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-192</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.171</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.175</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-193</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.154</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.151</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-194</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.065</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.064</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-195</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.133</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.128</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-196</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.005</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-197</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.161</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-198</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.088</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.087</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-199</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.229</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.211</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">BEC-200</td>
  <td rowspan="1" colspan="1" style="text-align:center;">139.787</td>
  <td rowspan="1" colspan="1" style="text-align:center;">138.191</td>
</tr>
</table>

### SA(非极性)能量, APolar solvation energy

计算方法: 每个原子的溶剂可及表面积乘以表面张力, 加上常量

<table id='tab-7'><caption>g_mmpbsa SA能量计算结果对比&emsp;&emsp;<input type='button' id='tab-7_tog' value='折叠表格' onclick="togtab('tab-7', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">g_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">gmx_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">GMXPBSA</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">File</td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>sasa.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~resPBSA_SA.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>Hstru0.out</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">com</td>
  <td rowspan="1" colspan="1" style="text-align:center;">232.144</td>
  <td rowspan="1" colspan="1" style="text-align:center;">229.960</td>
  <td rowspan="1" colspan="1" style="text-align:center;">223.818</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">pro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">243.428</td>
  <td rowspan="1" colspan="1" style="text-align:center;">240.034</td>
  <td rowspan="1" colspan="1" style="text-align:center;">233.557</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">lig</td>
  <td rowspan="1" colspan="1" style="text-align:center;">21.155</td>
  <td rowspan="1" colspan="1" style="text-align:center;">24.586</td>
  <td rowspan="1" colspan="1" style="text-align:center;">21.243</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:right;">dSA(com-pro-lig)</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-32.439</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-34.660</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-30.982</td>
</tr>
</table>

### SA能量分解

计算方法: 直接累加

<table id='tab-8'><caption>SA能量分解计算结果对比&emsp;&emsp;<input type='button' id='tab-8_tog' value='折叠表格' onclick="togtab('tab-8', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">Term</th>
  <th rowspan="1" colspan="1" style="text-align:center;">g_mmpbsa</th>
  <th rowspan="1" colspan="1" style="text-align:center;">gmx_mmpbsa</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">File</td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>sasa_contrib.dat</code></td>
  <td rowspan="1" colspan="1" style="text-align:center;"><code>_pid~resPBSA_SA.dat</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-1</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-4</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-6</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-7</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-8</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.847</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.703</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-9</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-11</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-12</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-13</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-14</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-15</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-16</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-17</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-18</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-19</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-20</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-21</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-22</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-23</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.206</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.138</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-24</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASH-25</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.332</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.280</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-26</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-27</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.440</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.474</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-28</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.482</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.403</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-29</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.332</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.471</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-30</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.272</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.251</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-31</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-32</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.060</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.098</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-33</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-34</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-35</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-36</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">SER-37</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-38</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-39</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-40</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-41</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-42</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-43</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-44</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-45</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-46</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-47</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.301</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.225</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-48</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.940</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.830</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-49</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.421</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.366</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-50</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.722</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.764</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-51</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-52</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-53</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-54</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-55</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-56</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-57</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-58</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TYR-59</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-60</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-61</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-62</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-63</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-64</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-65</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-66</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-67</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-68</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">HIS-69</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-70</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-71</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-72</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-73</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-74</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-75</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-76</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-77</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-78</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-79</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-80</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-81</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.120</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.129</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-82</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.361</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.374</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-83</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-84</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.361</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.205</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-85</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-86</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-87</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-88</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-89</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-90</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-91</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-92</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-93</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-94</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-95</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-96</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-97</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-98</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-99</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-101</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-102</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-103</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-104</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-105</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-106</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-107</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-108</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.666</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.536</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-109</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-110</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-111</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-112</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-113</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-114</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-115</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-116</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-117</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-118</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-119</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-120</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-121</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-122</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-123</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.146</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.085</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-124</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.228</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.234</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-126</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-127</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.607</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.623</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-128</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.507</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.302</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-129</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.703</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.562</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-130</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.272</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.232</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-131</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-132</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.120</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.138</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-133</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-134</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-136</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">SER-137</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-138</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-139</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-140</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-141</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TRP-142</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-143</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-144</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-145</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.002</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">MET-146</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-147</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.421</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.501</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-148</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.744</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.553</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-149</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.326</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.260</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-150</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-1.023</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.894</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-151</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-152</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-153</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-154</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-155</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-156</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-157</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-158</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">TYR-159</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASP-160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-161</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-162</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-163</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-164</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLU-165</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-166</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-167</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-168</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">HIS-169</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LYS-170</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ALA-171</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-172</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-173</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-174</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-175</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-176</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.019</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-177</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-178</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-179</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-180</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PRO-181</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.326</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.304</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">VAL-182</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.326</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.317</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-183</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-184</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.301</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.247</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-185</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-186</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ARG-187</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-188</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-189</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-190</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-191</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLN-192</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ILE-193</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">GLY-194</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">CYS-195</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">THR-196</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">LEU-197</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">ASN-198</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.000</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">PHE-199</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.000</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-0.001</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">BEC-200</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-19.522</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-23.048</td>
</tr>
</table>

## 能量分解图示

![](https://jerkwin.github.io/pic/gmx/gmx_mmpbsa_show.png)

## 收敛性测试

对于分解后的各个能量, 只有PB能量对选项的设置比较敏感, 使用默认参数得到的值未必是收敛的. 因此最好进行收敛性测试, 确定每个选项的最佳设置.

计算PB能量时, 有三个选项影响很大, `cfac`, `fadd`, `df`. 下面列出了这三个选项取不同值时, 所得的PB能量.

<table id='tab-9'><caption>不同设置对1EBZ第一帧PB能量的影响&emsp;&emsp;<input type='button' id='tab-9_tog' value='折叠表格' onclick="togtab('tab-9', this.value)"></caption><tr>
  <th rowspan="1" colspan="1" style="text-align:center;">df</th>
  <th rowspan="1" colspan="1" style="text-align:center;">fadd</th>
  <th rowspan="1" colspan="1" style="text-align:center;">cfac</th>
  <th rowspan="1" colspan="1" style="text-align:center;">dPB</th>
  <th rowspan="1" colspan="1" style="text-align:center;">PBcom</th>
  <th rowspan="1" colspan="1" style="text-align:center;">PBpro</th>
  <th rowspan="1" colspan="1" style="text-align:center;">PBlig</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.890</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5433.068</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5583.091</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.867</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">289.313</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5471.557</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5622.779</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.091</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.25</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">292.329</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5505.595</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5658.472</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-139.451</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">330.673</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5858.081</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6030.070</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-158.685</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.6</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">337.288</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6047.515</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6223.224</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-161.579</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.7</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">358.489</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6207.564</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6393.435</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-172.618</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.8</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">328.954</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6198.508</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6366.897</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-160.565</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.9</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">328.954</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6198.508</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6366.897</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-160.565</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">1</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">328.954</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6198.508</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6366.897</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-160.565</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.890</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5433.074</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5583.097</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.867</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.807</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5433.602</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5583.554</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.856</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.808</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5433.556</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5583.508</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.856</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.808</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5433.548</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5583.500</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.856</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">289.638</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.439</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5625.939</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.138</td>
</tr>
<tr>
  <td rowspan="1" colspan="8" style="text-align:center;">基于每帧的网格设置</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">289.526</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5471.557</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5622.779</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.304</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">333.012</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5858.081</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-6030.070</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-161.023</td>
</tr>
<tr>
  <td rowspan="1" colspan="8" style="text-align:center;">df 影响</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.12</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.626</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5429.042</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5578.939</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.728</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.13</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">286.953</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5434.188</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5584.351</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-136.789</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.14</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">287.2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5440.064</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5590.183</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-137.081</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.15</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">287.629</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5444.356</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5594.904</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-137.081</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.426</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5626.27</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.316</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.25</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">293.828</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5500.399</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5653.894</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-140.332</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">295.971</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5549.837</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5704.235</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-141.573</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.35</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">300.274</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5613.973</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5772.673</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-141.573</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">326.286</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5758.149</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5923.278</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-161.158</td>
</tr>
<tr>
  <td rowspan="1" colspan="9" style="text-align:center;">fadd 影响</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.426</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5626.27</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.316</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">10</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.076</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5470.877</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5622.549</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.403</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">15</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">289.859</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5467.796</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5619.252</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.403</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">20</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.447</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5473.721</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5625.765</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.403</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">25</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">289.960</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5472.684</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5624.241</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.403</td>
</tr>
<tr>
  <td rowspan="1" colspan="9" style="text-align:center;">cfac 影响</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.160</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.426</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5626.27</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.316</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.150</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.377</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5626.221</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.306</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">2.5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.149</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.358</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5626.202</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.304</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">5</td>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">290.148</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5474.384</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-5626.229</td>
  <td rowspan="1" colspan="1" style="text-align:center;">-138.304</td>
</tr>
</table>

可见, 网格大小和格点间距对最终结果的影响很大. 对此, 引用一下我咨询专家时的答复.

#### 邮件1

有一条分子动力学模拟得到的轨迹, 是蛋白和配体的, 含有很多帧. 如果计算蛋白和配体之间的PB作用能, 我需要分别计算蛋白+配体, 蛋白, 配体三个体系的PB能量, 然后做差值获得PB相互作用能. 在计算每个体系的时候都要设置网格大小, 而且使用APBS的话, 还需要设置两套网格, 粗糙网格和细密网格.

我的第一个问题是, 只算一帧构型的PB相互作用能的话, 对这三个体系是不是 __必须__ 使用相同的网格大小和格点间距, 还是可以对每个体系使用独立的, 只与其自身坐标有关的网格大小和格点间距? 不考虑计算效率的话, 哪种方法更正确?

如果前一个问题的答案是, 对每帧的三个体系必须使用相同网格大小和格点间距, 那我下面的问题是, 如果我要算很多帧构型的PB相互作用能, 那所有这些帧是不是也要使用相同的网格大小和格点间距, 也就是说我们需要对整条轨迹使用相同的网格大小和格点间距? 是否这样得到的结果更自洽?

> 我没有很细致的检验过APBS的细节，不过我觉得/感觉，如果 网格取得充分大（粗网格能cover两倍的分子大小以上，对于溶剂化能的计算细网格能cover整个分子那我认为应该是够了 ---- 而有的只关心反应活性部位的电场计算，那细网格只要包含比活性部位大一点就行了），格点间距取得足够小（比如0.2 A 应该够了），并且如果你每次算的是 分子的 solvation energy （这样它内部已经解了两次 方程），那么我觉的每次计算（三个体系）应该不需要使用同样的网格，就是说可以各自独立的采用粗网格和细网格，因为这时我们“认为”单个体系APBS计算是准确的。 你可以计算试试看。  这样的话，那么对一帧的计算还是整条轨迹多帧的计算应该都没关系，可独立计算。不过，感觉上对多帧的同一个体系比如复合物，最好采用一样的网格精度，以减少网格精度上到带来互相间的计算差别。
>
> 当然，对于一帧中的三个体系的计算，我觉得，如果你每次计算都采用同一套网格来计算，并且网格大小满足 我上面讲的覆盖关系，那么这样当然会略为减少网格选取的不同（坐标系平移，转动，网格尺寸大小）带来数值误差，我估计这个偏差较小（如果像上面说的计算正确的话），但这样就是计算量大（因为你计算单体和复合体时用的是一样大的网格系统）。
>
> 这些建议你要设计实验来验证一下

#### 邮件2

选择了一个含200个氨基酸残基的蛋白, 含90个原子的配体的体系进行了一些测试, 结果如下:

(见上表)

大致可以看到, 影响最大的是格点间距, 其他粗细网格的增加值影响小, 如您所言, 只要能覆盖即可. 此外, 使用整体一致的网格还是单独的网格对这个体系影响也很小,.

对太大的蛋白, 我们没法使用很小的网格, 所以我检验了一下, 在网格大小固定, 格点间距不太大的情况下, PB相互作用能大致与格点间距的三次方成正比. 我想问下, 这个关系是否正确, 还是理论上有其他更正确的关系式? 如果有的话, 这种关系式对格点间距适用范围的最大值如何确定? 如果这些问题都能解决的话, 我们就可以做外推得到格点间距为零时的PB相互作用能, 这样就可以避免格点间距设置的影响了.

> 你前面的观察应该合理的。
>
> 后半部分你说 “PB相互作用能大致与格点间距的三次方成正比”，这个应该不对，因为如果这样，格点为零，则PB能为0，当然不是。可能的话也是“PB相互作用能的误差大致与格点间距的三次方成正比”，但这个我的印象里也没有看到有人这么说（当然我关于APBS的文章读的很少）。一般来说是这样，一个软件的计算误差由它的算法决定，对于普通线性有限元来说，它的“解的误差”（L2 norm）与网格尺寸（大致可认为类似于格点间距）成平方关系（二阶），有限差分方法或有限体方法的误差也与具体算法格式（方法）有关，一般的方法对一般光滑问题的解的误差也能达到二阶精度，达到三阶需要更精细一点的方法，但有些问题的有限差分方法的解随着格点间距的减小并不能总是保证一致的精度阶，有时候随着格点间距减小误差甚至会变得更大。 你用的APBS的方法应该是用其中的有限差分方法，其实可能应该说有限体方法更恰当。APBS的计算里面还有奇异电荷分配的问题，还有粗细网格同时用的问题，所以具体的误差阶我没有研究过，不知道它是几阶，大致的三阶也是有可能的。不过就算是这样，你要用这个关系也挺麻烦，因为每次计算你想得到精确值就要多计算若干次得到准确的三阶估计才能用。

## 一些资料

- [MMPBSA](https://www.chufang.cf/2019/07/16/gmx_pbsa/)
- [计算MMPBSA的新脚本——gmxmmpbsa使用说明](https://www.chufang.cf/2019/07/20/gmx_pbsa_Jerkwim/)
