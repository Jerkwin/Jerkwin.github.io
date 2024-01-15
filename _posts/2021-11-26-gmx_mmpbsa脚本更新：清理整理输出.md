---
 layout: post
 title: gmx_mmpbsa脚本更新：清理整理输出
 categories:
 - 科
 tags:
 - gmx
---

- 2021-11-26 09:35:17

前段时间有人指出, 我的`gmx_mmpbsa`脚本的能量分解输出中的残基名称与原始文件中的不一样. 我查看了一下, 确实如此, 因为脚本中对所有残基进行了重新编号. 如果原始文件中的残基编号不是从1开始的顺序编号, 那自然与脚本所给的不一致. 这也不能算是个错误, 只是输出时的不同考虑. 不过考虑到一般是以原始文件的编号为准, 修正一下可能更方便使用.

借着修正这个问题的机会, 我顺便把所有的输出文件也重新清理或整理了一下, 以期更方便查看和使用. 这不是很重要, 却很繁琐. 因为这个脚本已经很长了, 重构起来都有点吃力, 接近快要失去控制的感觉, 生怕修改后的计算结果与以前的不一致. 不过, 好在完成了, 初步测试也没有发现结果错误.

以前的脚本说明文章暂时没有机会修正, 这里简要列出一些更新说明吧:

- gmx的屏幕输出保存到`_pid.err`: 用于查看gmx是否运行成功, 错误信息
- 每帧的能量分解的pdb输出, 每项都单独列出
	- `pid~0ns~res_MMPBSA.pdb`
	- `pid~0ns~resMM.pdb`
	- `pid~0ns~resMM_COU.pdb`
	- `pid~0ns~resMM_VDW.pdb`
	- `pid~0ns~resPBSA.pdb`
	- `pid~0ns~resPBSA_PB.pdb`
	- `pid~0ns~resPBSA_SA.pdb`
- 所有帧结果汇总
	- `_pid~MMPBSA.dat`: 主输出文件
	- `_pid~res.dat`: 各个残基每项贡献平均值, 下面为分别列出的数据及相应pdb文件
	- `_pid~res_MMPBSA.dat`
	- `_pid~res_MMPBSA.pdb`
	- `_pid~resMM.dat`
	- `_pid~resMM.pdb`
	- `_pid~resMM_COU.dat`
	- `_pid~resMM_COU.pdb`
	- `_pid~resMM_VDW.dat`
	- `_pid~resMM_VDW.pdb`
	- `_pid~resPBSA.dat`
	- `_pid~resPBSA.pdb`
	- `_pid~resPBSA_PB.dat`
	- `_pid~resPBSA_PB.pdb`
	- `_pid~resPBSA_SA.dat`
	- `_pid~resPBSA_SA.pdb`
- 主输出文件中计算了Ki值, 给出了一个关于自由能和亲和度的简单表格, 虽然可能没什么用.

<div class="highlight"><pre style="line-height:125%"><span></span>+<span style="color: #666666">==============================================================</span>+
             <span style="color: #B8860B">dG</span> <span style="color: #666666">=</span> RTln<span style="color: #666666">(</span>Ki<span style="color: #666666">)</span> <span style="color: #666666">=</span> -RTln<span style="color: #666666">(</span>KA<span style="color: #666666">)</span>
             <span style="color: #B8860B">Ki</span> <span style="color: #666666">=</span> 1/KA <span style="color: #666666">=</span> exp<span style="color: #666666">(</span>dG/RT<span style="color: #666666">)</span> <span style="color: #666666">=</span> <span style="color: #B8860B">IC50</span> <span style="color: #666666">=</span> EC50
+<span style="color: #666666">==============================================================</span>+
| M<span style="color: #666666">(</span>mol/L<span style="color: #666666">)</span> |  m/u/pM | dG<span style="color: #666666">(</span>kcal/mol<span style="color: #666666">)</span> | dG<span style="color: #666666">(</span>kJ/mol<span style="color: #666666">)</span> | Affinity    |
|<span style="color: #666666">==============================================================</span>|
| 0.1      | <span style="color: #666666">100</span>  mM |    -1.364    |   -5.708   |             |
| 0.01     |  <span style="color: #666666">10</span>  mM |    -2.728    |  -11.416   |             |
| 0.001    |   <span style="color: #666666">1</span>  mM |    -4.093    |  -17.124   |             |
| 0.0001   | <span style="color: #666666">100</span>  uM |    -5.457    |  -22.832   | Weak        |
|--------------------------------------------------------------|
| 0.00001  |  <span style="color: #666666">10</span>  uM |    -6.821    |  -28.540   |             |
| 1.0E-06  |   <span style="color: #666666">1</span>  uM |    -8.185    |  -34.248   | Medium      |
|--------------------------------------------------------------|
| 1.0E-07  | <span style="color: #666666">100</span>  nM |    -9.550    |  -39.956   |             |
| 1.0E-08  |  <span style="color: #666666">10</span>  nM |   -10.914    |  -45.664   |             |
| 1.0E-09  |   <span style="color: #666666">1</span>  nM |   -12.278    |  -51.372   | Strong      |
|--------------------------------------------------------------|
| 1.0E-10  | <span style="color: #666666">100</span>  pM |   -13.642    |  -57.080   |             |
| 1.0E-11  |  <span style="color: #666666">10</span>  pM |   -15.007    |  -62.788   |             |
| 1.0E-12  |   <span style="color: #666666">1</span>  pM |   -16.371    |  -68.496   | Very strong |
+<span style="color: #666666">==============================================================</span>+</pre></div>
