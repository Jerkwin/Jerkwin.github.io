---
 layout: post
 title: GROMACS各类程序(名称排序)
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}

## gmx anadock: 根据Autodock运行计算团簇结构(翻译: 白艳艳)

	gmx anadock [-f [<.pdb>]] [-od [<.xvg>]] [-of [<.xvg>]] [-g [<.log>]]
				[-nice ] [-xvg ] [-[no]free] [-[no]rms]
				[-cutoff ]

`gmx anadock`基于距离或RMSD对分子对接(docking)软件Autodock的计算结果进行分析, 并将结构划分成团簇. 程序会分析对接能和自由能, 并打印每个团簇的能量统计情况.

另一个可采用的方法是先使用`gmx cluster`将结构划分为团簇, 然后按照最低能量或最低平均能量对这些团簇进行排序.

<table id='tab-0'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="2" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f  [<.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eiwit.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据库文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [<.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">edocked.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件, 能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [<.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">efree.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件, 自由能</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g  [<.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">anadock.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
</table>

<table id='tab-1'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="2" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]free</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用autodock估算的自由能对结构进行分类</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rms</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据RMS或距离进行团簇化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cutoff &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">属于相同团簇的最大RMSD或距离值. 偏离大于此值时认为属于不同团簇</td>
</tr>
</table>

## gmx anaeig: 分析简正模式(翻译: 李继存)

	gmx anaeig [-v [<.trr/.cpt/...>]] [-v2 [<.trr/.cpt/...>]]
			   [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-eig [<.xvg>]] [-eig2 [<.xvg>]] [-comp [<.xvg>]] [-rmsf [<.xvg>]]
			   [-proj [<.xvg>]] [-2d [<.xvg>]] [-3d [<.gro/.g96/...>]]
			   [-filt [<.xtc/.trr/...>]] [-extr [<.xtc/.trr/...>]]
			   [-over [<.xvg>]] [-inpr [<.xpm>]] [-nice ] [-b ]
			   [-e ] [-dt ] [-tu ] [-[no]w] [-xvg ]
			   [-first ] [-last ] [-skip ] [-max ]
			   [-nframes ] [-[no]split] [-[no]entropy] [-temp ]
			   [-nevskip ]

`gmx anaeig`用于分析特征向量. 特征向量可以来自协方差矩阵(`gmx covar`)或简正模式分析(`gmx nmeig`).

当将一条轨迹投影到特征向量上时, 如果特征向量文件中存在结构, 会将所有结构叠合到特征向量文件中的结构, 否则, 会叠合到结构文件中的结构. 如果没有提供运行输入文件, 程序不会考虑周期性. 程序会对从`-first`到`-last`的几个特征向量进行大部分分析, 但当`-first`设置为-1时, 程序会提示你选择要分析的特征向量.

几个选项的说明:

- `-comp`: 对从`-first`到`-last`的特征向量, 给出其每个原子的向量分量
- `-rmsf`: 对从`-first`到`-last`的特征向量, 给出其每个原子的RMS涨落(需要`-eig`)
- `-proj`: 计算一条轨迹在从`-first`到`-last`的特征向量上的投影. 轨迹在其协方差矩阵特征向量上的投影称为主成分(pc, principal components). 检查主成分的余弦含量通常会有帮助, 因为随机扩散的主成分为周期数为主成分数一半的余弦. 可使用`gmx analyze`计算主成分的余弦含量.
- `-2d`: 计算一条轨迹在从`-first`到`-last`的特征向量上的2d投影
- `-3d`: 计算一条轨迹在从`-first`到`-last`的特征向量上的3d投影
- `-filt`: 对轨迹进行滤波, 只显示沿从`-first`到`-last`特征向量的运动
- `-extr`: 计算沿一条轨迹在平均结构上的两个极值投影, 并在它们之间插值`-nframe`帧, 或使用`-max`设定你自己的极值数. 会输出特征向量`-first`, 除非明确指定了`-first`和`-last`的值, 在那种情况下, 所有特征向量会写入单独的文件. 当输出`.pdb`文件时, 若含有两个或三个结构, 会添加链标识(你可以使用`rasmol -nmrpdb`来查看这样的`.pdb`文件).

协方差分析的重叠计算:

__注意__: 分析时应使用相同的叠合结构

- `-over`: 计算文件`-v2`中的特征向量与文件`-v`中从`-first`到`-last`的特征向量之间的子空间重叠.
- `-inpr`: 计算文件`-v`和`-v2`中的特征向量间的内积矩阵. 会使用两个文件中的所有特征向量, 除非明确指定了`-first`和`-last`.

当给出了`-v`, `-eig`, `-v2`和`-eig2`时, 会给出表征协方差矩阵之间重叠的一个数值, 其计算公式为:

差异 difference = sqrt(tr((sqrt(M1) - sqrt(M2))^2))

归一化重叠 normalized overlap = 1 - difference/sqrt(tr(M1) + tr(M2))

形状重叠 shape overlap = 1 - sqrt(tr((sqrt(M1/tr(M1)) - sqrt(M2/tr(M2)))^2))

其中M1和M2为两个协方差矩阵, tr为矩阵的迹. 给出的数值正比于涨落平方根的重叠. 归一化的重叠是最有用的数字, 对全等矩阵其值为1, 当抽样子空间正交时, 其值为零.

当给定`-entropy`选项时, 会依据准简谐近似以及Schlitter公式给出熵估计.

<table id='tab-2'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="2" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v2 [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec2.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eig [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenval.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eig2 [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenval2.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-comp [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigcomp.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmsf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigrmsf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-proj [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">proj.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-2d [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2dproj.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-3d [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3dproj.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-filt [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">filtered.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-extr [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">extreme.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-over [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">overlap.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-inpr [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">inprod.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
</table>

<table id='tab-3'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序运行结束查看输出文件: .xvg, .xpm, .eps和.pdb</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-first &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的第一个特征向量(-1则手动选择)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-last &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的最后一个特征向量(-1则手动选择)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每nr帧分析一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">特征向量在平均结构上投影的最大值, 为0时给出极值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nframes &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">极值输出的帧数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]split</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当时间为零时拆分特征向量投影</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]entropy</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算对应于准简谐公式或Schlitter方法的熵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298.15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算熵时的温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nevskip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">6</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当计算准简谐近似对应的熵时忽略的特征向量的数目.<br>当在协方差分析前进行转动/平动叠合时, 会得到3或6个非常接近于零的特征值, <br/>在计算熵时不应该考虑这些特征值.</td>
</tr>
</table>

## gmx analyze: 分析数据集(翻译: 李昊)

	gmx analyze [-f [<.xvg>]] [-ac [<.xvg>]] [-msd [<.xvg>]] [-cc [<.xvg>]]
				[-dist [<.xvg>]] [-av [<.xvg>]] [-ee [<.xvg>]] [-bal [<.xvg>]]
				[-g [<.log>]] [-nice ] [-[no]w] [-xvg ] [-[no]time]
				[-b ] [-e ] [-n ] [-[no]d] [-bw ]
				[-errbar ] [-[no]integrate] [-aver_start ]
				[-[no]xydy] [-[no]regression] [-[no]luzar] [-temp ]
				[-fitstart ] [-fitend ] [-smooth ]
				[-filter ] [-[no]power] [-[no]subav] [-[no]oneacf]
				[-acflen ] [-[no]normalize] [-P ] [-fitfn ]
				[-beginfit ] [-endfit ]

`gmx analyze`可以读取一个ASCII文本文件并对其中的数据集进行分析. 输入文件中每行的第一个数据可以为时间(见`-time`选项), 后面跟着任意数目的y值. 程序也可以读入多个数据集, 各个数据集之间以`&`分割(`-n`选项). 在这种情况下, 对每一行, 程序只会读入一个y值. 程序会忽略所有以`#`和`@`开始的行. 所有的分析方法都可用于数据集的导数(`-d`选项).

除`-av`和`-power`外, 所有选项都假定数据点之间的时间间隔是相等的.

`gmx analyze`总会给出各数据集的平均值和标准偏差, 以及来自具有相同标准偏差的高斯分布的三阶和四阶累积量的相对偏差.

选项`-ac`计算自相关函数. 请确保数据点之间的时间间隔远远小于自相关的时间尺度.

选项`-cc`给出数据集 $i$ 与周期为 $i/2$ 的余弦函数的相似性, 公式为:

$${2 \left(\int_0^T y(t) \cos(i\p t) dt \right)^2 / \int_0^T y^2(t) dt}$$

这可用于由协方差分析得到的主成分, 因为随机扩散的主成分是单纯的余弦.

选项`-msd`计算均方位移.

选项`-dist`计算分布图.

选项`-av`计算数据集的平均值. 可以使用`-errbar`选项得到平均值的误差. 误差可代表标准偏差, 误差(假定点是独立的), 或通过弃去顶部和底部5%的点而包含90%的点的区间.

选项`-ee`使用块平均估计误差. 数据集被分成几块, 并计算每块的平均值. 总平均值的误差由 $m$ 个块平均值 $B_i$ 的方差进行计算:

$$error^2 = \Sum (B_i - \lt B \gt)^2 / (m(m-1))$$

程序会给出误差随块数的变化关系. 假定自相关是两个指数函数的加和, 程序还会给出解析的块平均值曲线. 块平均值的解析曲线为:

$$f(t) = \s \sqrt{2/T ( \a (\t_1 ((\exp(-t/\t_1) - 1) \t_1/t + 1)) +(1-\a) (\t_2 ((\exp(-t/\t_2) - 1) \t_2/t + 1)))}$$

其中 $T$ 为总时间, $\a$, $\t_1$ 和 $\t_2$ 通过将 $error^2$ 拟合为 $f^2(t)$ 得到. 当实际的块平均值与解析曲线十分接近时, 误差为 $\s \sqrt{2/T (a \t_1 + (1-a) \t_2)}$. 完整的推导见B. Hess, _J. Chem. Phys._ 116:209-217, 2002.

选项`-bal`通过多指数拟合发现并减去来自于氢键自相关函数的超快"弹道"分量, 具体请参考O. Markovitch, _J. Chem. Phys._ 129:084505, 2008. 最快项对应于具有最大负系数的指数项. 或者使用`-d`选项时, 最快项对应于0时刻具有最负的时间导数的项. `-nbalexp`设定用于拟合的指数函数的数目.

选项`-gem`根据可逆成对重组模型拟合氢键自相关函数的双分子速率常数ka和kb(以及可选的kD). 强烈建议先去除弹道分量. 模型的细节见O. Markovitch, _J. Chem. Phys._ 129:084505, 2008.

选项`-filter`打印每个数据集和所有数据集相对于滤波器平均值的RMS高频涨落. 滤波器正比于 $\cos(\p t/len)$, 其中 $t$ 从 $-len/2$ 到 $len/2$. $len$ 由`-filter`选项提供. 此滤波器可以将周期为 $len/2$ 和 $len$ 的振动分别降低为原来的79%和33%.

选项`-g`使用选项`-fitfn`给出的函数对数据进行拟合.

选项`-power`使用 $b t^a$ 对数据进行拟合, 这是通过在双对数尺度下进行 $at+b$ 拟合来完成的. 拟合时, 第一个零之后或值为负的所有点都被忽略.

选项`-luzar`对`gmx hbond`的输出进行Luzar-Chandler动力学分析. 输入文件可直接来自`gmx hbond -ac`, 并应得到相同的结果.

<table id='tab-4'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">graph.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ac [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">autocorr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-msd [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">msd.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">coscont.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">distr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-av [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">average.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ee [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">errest.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bal [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ballisitc.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">fitlog.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
</table>

<table id='tab-5'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]time</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">预计输入含有时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">读取数据集的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">读取数据集的终止时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">读取指定数目, 彼此间以<code>&</code>分开的数据集</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]d</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用导数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分布的分格宽度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-errbar &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-av</code>的误差: none, stddev, error, 90</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]integrate</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用梯形规则对数据函数进行数值积分</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-aver_start &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">由此开始对积分进行平均</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]xydy</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">积分时将第二个数据集作为y值的误差</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]regression</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对数据进行线性回归分析.<br>如果设定了<code>-xydy</code>选项, 第二个数据集将被视为Y值的误差.<br/>否则, 如果存在多个数据集, 将会进行多元线性回归,<br/> 计算能使χ^2^ &#61; (y - A_0 x_0 - A_1 x_1 - ...  - A_N x_N)^2^取最小值的常数A, <br/>其中Y为输入文件中的第一个数据集而x_i为其他数据集. 请阅读<code>-time</code>选项的信息.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]luzar</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行Luzar-Chandler分析, 并与<code>gmx hbond</code>的结果进行关联.<br/>当同时也给出<code>-xydy</code>选项时, 第二列和第四列将被视为c(t)和n(t)的误差.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298.15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">进行Luzar氢键动力学分析时的温度(K)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitstart &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">为获得HB断裂和形成的前向和后向速度常数, 对相关函数进行拟合的起始时间(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitend &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">60</td>
  <td rowspan="1" colspan="1" style="text-align:left;">为获得HB断裂和形成的前向和后向速度常数, 对相关函数进行拟合的终止时间(ps). <br/>只能与<code>-gem</code>一起使用.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-smooth &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果此值>&#61;0, 通过拟合为指数函数 y&#61;A exp(-x/τ) 对ACF的尾部进行平滑</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-filter &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用此长度的余弦滤波器滤波后打印高频涨落</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]power</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将数据拟合为 $b t^a$</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]subav</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算自相关前减去平均值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]oneacf</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对所有数据集计算一个ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erfit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直到最后</td>
</tr>
</table>

## gmx angle: 计算键角和二面角的分布及相关(翻译: 陈辰)

	gmx angle [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-od [<.xvg>]] [-ov [<.xvg>]]
			  [-of [<.xvg>]] [-ot [<.xvg>]] [-oh [<.xvg>]] [-oc [<.xvg>]]
			  [-or [<.trr>]] [-nice ] [-b ] [-e ] [-dt ]
			  [-[no]w] [-xvg ] [-type ] [-[no]all] [-binwidth ]
			  [-[no]periodic] [-[no]chandler] [-[no]avercorr] [-acflen ]
			  [-[no]normalize] [-P ] [-fitfn ] [-beginfit ]
			  [-endfit ]

`gmx angle`用于计算一些键角或二面角的角度分布.

利用`-ov`选项, 可以得到一组键角的平均值随时间的变化关系图. 使用`-all`选项时, 第一幅图为平均键角, 其他则为单个键角.
例如, 如果我们选择几个不同的原子组合来计算其角度

	75    76   1145
	75    76   1147
	222  223   1145

则默认输出文件`angaver.xvg`中共包含4列数据, 首列为3个角度平均值, 之后每列为每个角度值.

利用`-of`选项, `gmx angle`也会计算反式二面角的比例(仅适用于二面角)与时间的函数关系, 但这可能只适用于少量的二面角.

利用`-oc`选项, 可计算二面角的相关函数.

需要注意, 对键角, 在索引文件中必须包含原子三元组, 对二面角则必须包含原子四元组. 否则, 程序会崩溃.

利用`-or`选项, 可生成包含所选二面角sin和cos函数值的轨迹文件. 当利用`gmx covar`进行主成分分析时, 此轨迹文件可作为输入.

利用`-ot`选项, 可以记录多重度为3的二面角旋转异构体之间的转变. 假定输入轨迹各帧之间的时间间隔相等, 可利用`-oh`选项得到转变间隔时间的直方图.

<table id='tab-6'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angle.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angdist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ov [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angaver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dihfrac.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dihtrans.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">trhisto.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dihcorr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.trr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">兼容xdr格式的轨迹</td>
</tr>
</table>

<table id='tab-7'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的 .xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-type &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angle</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的键角类型: angle, dihedral, improper, ryckaert-bellemans</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]all</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">按索引文件中的出现顺序, 在平均值文件中单独输出每个键角的平均值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-binwidth &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算分布的分格值(单位: 度)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]periodic</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出二面角除以360度的余数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]chandler</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用Chandler相关函数(N[trans] &#61; 1, N[gauche] &#61; 0)而不是余弦相关函数. <br/>转变的定义为phi < -60或phi > 60.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]avercorr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对单个键角或二面角的相关函数进行平均</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直到最终</td>
</tr>
</table>

### 已知问题

- 对转变进行计数只适用于多重度为3的二面角

## gmx bar: 利用Bennett接受比率方法计算自由能差的估计值(翻译: 陈珂)

	gmx bar [-f [<.xvg> [...]]] [-g [<.edr> [...]]] [-o [<.xvg>]] [-oi [<.xvg>]]
			[-oh [<.xvg>]] [-nice ] [-[no]w] [-xvg ] [-b ]
			[-e ] [-temp ] [-prec ] [-nbmin ]
			[-nbmax ] [-nbin ] [-[no]extp]

`gmx bar`通过Bennett接受率方法(BAR, Bennett's acceptance ratio)估计自由能差值, 也可以自动将由BAR得到的一系列分立自由能进行组合得到自由能估计值.

每个分立的BAR自由能差值依赖于两个不同状态的模拟, 且称为态A和态B, 它们由参数λ控制(见`.mdp`参数`init_lambda`). 给定态A, BAR方法可以计算态B相对于态A的哈密顿差的加权平均的比率, 反之亦然. 相对于另一状态的能量差在模拟中必须显式地计算, 可以通过`.mdp`选项`foreign_lambda`实现.

输入选项`-f`需要读入多个`dhdl.xvg`文件, 支持两种输入文件类型:

* 包含多于一个y值的文件, 其中应包含dH/dλ和Δλ的列. λ的值根据列标题推定: 模拟使用的λ根据dH/dλ列的标题推定, 外部λ值根据Delta H列的标题推定.
* 仅有一个y值的文件. 对这些文件应使用`-extp`选项, 并假定y值为dH/dλ, 而哈密顿量与λ呈线性关系. 模拟的λ值根据子标题(如果存在)推定, 否则会根据子目录下文件名中的数字推定.

模拟的λ值根据`dhdl.xvg`文件中包含字符串`dH`的列标题解析得出, 外部λ值根据包含大写字母`D`和`H`的列标题解析得出, 温度根据包含`T=`的标题解析得出.

输入选项`-g`需要读入多个`.edr`文件, 它们可以包含能量差列表(见`.mdp`选项`separate_dhdl_file`), 或者一系列直方图(见`.mdp`选项`dh_hist_size`和`dh_hist_spacing`). 程序会自动从`ener.edr`文件中推断出温度和λ值.

除了`.mdp`的`foreign_lambda`选项外, 也可以根据dH/dλ值外推得到能量差. 这可通过`-extp`选项实现, 它假定系统的哈密顿量与λ呈线性关系, 虽然通常并非如此.

自由能估计由使用二分法的BAR方法确定, 输出精度由`-prec`设定. 误差估计考虑了时间相关, 这是通过将数据分块, 并假定这些分块之间互相独立, 计算它们之间的自由能差来实现的. 最终的误差估计由5个分块的平均方差决定. 用于误差估计的分块数可以通过选项`-nbmin`和`-nbmax`来指定.

`gmx bar`会尝试合计具有相同'本地'和'外部'λ值的样本, 但总会假定样本互相独立. __注意__, 当合计具有不同采样间隔的能量差或能量导数时, 这个假定几乎肯定是不正确的. 连续的能量通常是相关的, 不同的时间间隔意味着样本间的相关度不同.

结果分为两部分: 后一部分包含了以kJ/mol为单位的最终结果, 以及每一部分和总体的误差估计. 前一部分包含了详细的自由能差估计和相空间重叠量度, 以kT为单位(以及它们的误差估计). 打印出的值为:

* lam_A: A点的λ值.
* lam_B: B点的λ值.
* DG: 自由能估计.
* s_A: B在A中的相对熵估计.
* s_B: A在B中的相对熵估计.
* stdev: 每个样本标准偏差的估计期望

两个状态在彼此系综内的相对熵可以理解为相空间重叠的量度: lambda_B的工作样本在lambda_A系综内的相对熵s_A(对s_B反之亦然), 是两个状态Boltzmann分布之间'距离'的量度, 当分布相同时, 其值为0. 详见Wu & Kofke, _J. Chem. Phys._ 123 084109 (2005).

每个样本标准偏差的估计期望, 见Bennett BAR方法的原始论文 Bennett, _J. Comp. Phys._ 22, p 245 (1976). 其中的Eq. 10给出了采样质量的估计(并非直接的实际统计误差, 因为它假定了样本相互独立).

要得到相空间重叠估计的可视化结果, 可使用`-oh`选项及`-nbin`选项输出一系列直方图.

<table id='tab-8'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xvg> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dhdl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.edr> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bar.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oi [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">barint.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">histogram.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-9'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设定优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">BAR的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">BAR的终止时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">温度(K)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-prec &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">小数点后的小数位数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nbmin &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于误差估计的最小分块数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nbmax &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于误差估计的最大分块数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nbin &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出直方图的分格数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]extp</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">是否对dH/dλ进行线性外推作为能量使用</td>
</tr>
</table>

## gmx bundle: 分析轴束, 例如螺旋(翻译: 王燕)

	gmx bundle [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-ol [<.xvg>]] [-od [<.xvg>]] [-oz [<.xvg>]] [-ot [<.xvg>]]
			   [-otr [<.xvg>]] [-otl [<.xvg>]] [-ok [<.xvg>]] [-okr [<.xvg>]]
			   [-okl [<.xvg>]] [-oa [<.pdb>]] [-nice ] [-b ]
			   [-e ] [-dt ] [-tu ] [-xvg ] [-na ]
			   [-[no]z]

`gmx bundle`用于分析轴束, 例如螺旋轴. 程序读入两个索引组, 把它们分成`-na`个部分. 不同部分的质心确定轴的顶部和底部. 以下几个量会写入输出文件中: 轴的长度, 轴中点相对于所有轴的平均中点的距离和Z方向的偏移量, 轴相对于平均轴的总倾斜, 径向倾斜, 侧向倾斜.

使用选项`-ok`, `-okr`和`-okl`可输出轴的总扭结, 径向扭结和侧向扭结. 这种情况下还需要定义扭结原子的索引组, 它也会被分为`-na`个部分. 扭结角定义为扭结顶部和扭结底部矢量间的夹角.

使用选项`-oa`时, 每帧中每个轴的顶点, 中点(或扭结, 若指定了`-ok`), 最低点会写入一个`.pdb`文件, 残基编号对应于轴的编号. 当使用Rasmol查看这个文件时, 指定命令行选项`-nmrpdb`, 并输入`set axis true`来显示参考轴.

<table id='tab-10'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ol [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_len.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_dist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oz [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_z.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_tilt.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-otr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_tiltr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-otl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_tiltl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ok [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_kink.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-okr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_kinkr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-okl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bun_kinkl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oa [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">axes.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PDB文件</td>
</tr>
</table>

<table id='tab-11'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-na &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轴的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]z</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用z坐标轴取代平均轴作为参考轴</td>
</tr>
</table>

## gmx check: 检查并比较文件(翻译: 冯佳伟)

	gmx check [-f [<.xtc/.trr/...>]] [-f2 [<.xtc/.trr/...>]]
			  [-s1 [<.tpr/.tpb/...>]] [-s2 [<.tpr/.tpb/...>]]
			  [-c [<.tpr/.tpb/...>]] [-e [<.edr>]] [-e2 [<.edr>]] [-n [<.ndx>]]
			  [-m [<.tex>]] [-nice ] [-vdwfac ] [-bonlo ]
			  [-bonhi ] [-[no]rmsd] [-tol ] [-abstol ]
			  [-[no]ab] [-lastener ]

`gmx check`读取一个轨迹文件(`.trj`, `.trr`或`.xtc`), 一个能量文件(`.ene`或`.edr`), 或一个索引文件(`.ndx`), 并输出与其相关的有用信息.

如果指定了`-c`选项, 程序就会检查文件中是否包含了坐标, 速度和盒子大小. 如果存在坐标, 程序进而会检查原子是不是有近距离的接触(距离小于`-vdwfac`, 而且没有键相连, 即距离不在`-bonlo`和`-bonhi`之间. 注意这几个选项指定的都是与两个原子范德华半径之和的比例). 程序还会检查处于盒子外面的原子(这是经常发生的事情, 并不是什么问题). 如果文件中含有速度, 程序就会根据温度估算出温度.

如果指定了一个索引文件, 程序会对索引文件中的所有索引进行处理, 并给出一个总结.

如果同时给定了轨迹文件和`.tpr`文件(使用`-s1`选项), 程序就会检查`.tpr`文件中定义的键长在轨迹中是否正确. 如果不正确, 那么轨迹文件和`.tpr`文件可能不匹配, 原因可能出于原子重组或虚拟位点的问题. 所以, 通过这些选项, 你可以快速检查这些问题.

当同时指定`-s1`和`-s2`时, 程序还可以对比两个输入文件(`.tpr`, `.tpb`或`.tpa`). 类似的, 程序也可以对比两个轨迹文件(使用`-f2`选项), 或对比两个能量文件(使用`-e2`选项).

对于自由能计算, 来自同一运行输入文件A和B两种状态的拓扑, 可以通过`-s1`和`-ab`选项进行比较.

指定了`-m`选项后, 程序会输出一个LaTeX文件, 其中包含了可用于论文方法部分的粗略提纲.

<table id='tab-12'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f2 [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s1 [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">top1.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s2 [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">top2.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量文件(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e2 [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener2.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-m [&lt;.tex>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">doc.tex</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">LaTeX文件</td>
</tr>
</table>

<table id='tab-13'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-vdwfac &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.8</td>
  <td rowspan="1" colspan="1" style="text-align:left;">原子之间的最小距离, 使用与两个原子范德华半径之和的比例来指定. 超过此值时会给出警告.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bonlo &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.4</td>
  <td rowspan="1" colspan="1" style="text-align:left;">成键原子之间的最小距离, 使用与两个原子范德华半径之和的比例来指定</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bonhi &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.7</td>
  <td rowspan="1" colspan="1" style="text-align:left;">成键原子之间的最大距离, 使用与两个原子范德华半径之和的比例来指定</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmsd</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出坐标, 速度和力的均方根偏差</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tol &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相对容许误差 $2*(a-b)/(\vert a\vert+\vert b\vert)$. 用于判断两个实数是否一致</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-abstol &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绝对容许误差. 当两个数绝对值之和接近为0时有用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ab</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">比较同一个文件中的A和B状态的拓扑</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-lastener &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">指定检查的最后一个能量项(若未给出则测试所有项), 不检查在此之后的所有能量项.<br>比如可以只检查Pressure以及之前的能量项.</td>
</tr>
</table>

## gmx chi: 计算chi和其他二面角的所有信息(翻译: 黄炎)

	gmx chi [-s [<.gro/.g96/...>]] [-f [<.xtc/.trr/...>]] [-o [<.xvg>]]
			[-p [<.pdb>]] [-ss [<.dat>]] [-jc [<.xvg>]] [-corr [<.xvg>]]
			[-g [<.log>]] [-ot [<.xvg>]] [-oh [<.xvg>]] [-rt [<.xvg>]]
			[-cp [<.xvg>]] [-nice ] [-b ] [-e ] [-dt ]
			[-[no]w] [-xvg ] [-r0 ] [-[no]phi] [-[no]psi] [-[no]omega]
			[-[no]rama] [-[no]viol] [-[no]periodic] [-[no]all] [-[no]rad]
			[-[no]shift] [-binwidth ] [-core_rotamer ]
			[-maxchi ] [-[no]normhisto] [-[no]ramomega] [-bfact ]
			[-[no]chi_prod] [-[no]HChi] [-bmax ] [-acflen ]
			[-[no]normalize] [-P ] [-fitfn ] [-beginfit ]
			[-endfit ]

`gmx chi`用于计算所有氨基酸骨架和侧链的φ, ψ, ω以及χ二面角. 它也可以计算二面角与时间的函数关系, 以及二面角的直方图分布. 分布(`histo-(dihedral) (RESIDUE).xvg`)会对每一类型的所有残基进行累计.

如果使用`-corr`选项, 程序会计算二面角的自相关函数 C(t) = <cos(χ(τ)) cos(χ(τ+t))>. 之所以使用余弦而不是角度自身, 是为了解决周期性的问题(Van der Spoel & Berendsen (1997), _Biophys. J._ 72, 2032-2041). 程序会将每个残基的每个二面角输出到单独的文件(`corr(dihedral) (RESIDUE) (nresnr).xvg`)中, 同时还会输出一个包含所有残基信息的文件(`-corr`选项).

使用`-all`选项, 程序会将每个残基的角度与时间的函数关系输出到独立的文件`(dihedral) (RESIDUE) (nresnr).xvg`中. 所用的单位可以是弧度或度.

程序还会输出一个日志文件(`-g`选项), 其中包含:

- (a) 每种类型残基的数目信息.
- (b) 由Karplus方程得到的NMR <sup>3</sup>J 偶合常数.
- (c) 一个表格, 其中包含每个残基的旋转异构体每纳秒内的转变次数, 以及每个二面角的序参数S^2.
- (d) 一个表格, 其中包含每个残基旋转异构体的占据率.

所有的旋转异构体的多重度都视为3, 除平面基团的ω和χ二面角(如芳香化合物, Asp和Asn的χ_2; Glu和Gln的χ_3; 以及Arg的χ_4)外, 它们的多重度为2. "rotamer 0"表示二面角不处于每个旋转异构体的核心区域. 核心区域的宽度可使用`-core_rotamer`设置.

S^2序参数也会输出到一个`.xvg`文件(由`-o`选项指定), 作为可选项, 可将S^2的值作为B因子输出到一个`.pdb`文件中(由`-p`选项指定). 每个时间步旋转异构体转变的总数(`-ot`选项), 每个旋转异构体的转变数(`-rt`选项)和<sup>3</sup>J 偶合(`-jc`选项)也可以写入到`.xvg`文件中. 注意, 在分析旋转异构体转变时, 假定所提供的轨迹帧之间的时间间隔是相等的.

如果设置了`-chi_prod`选项(并且`-maxchi > 0`), 会计算累积旋转异构体, 如1+9(χ_1-1)3(χ_2-1)+(χ_3-1)(如果残基具有三个3重二面角, 并且`-maxchi >= 3`). 如前所述, 任何二面角如果不处于核心区域内, 旋转异构体取为0. 这些累积旋转异构体的占据率(由旋转异构体0开始)会写入由`-cp`选项指定的文件中, 如果使用`-all`选项, 旋转异构体作为时间的函数会写入`chiproduct (RESIDUE) (nresnr).xvg`文件中, 其占据率会写入`histo-chiproduct (RESIDUE) (nresnr).xvg`文件.

选项`-r`可生成作为φ和ψ角函数的平均ω角的等值线图, 也就是使用颜色编码的平均ω角的Ramachandran图.

<table id='tab-14'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">order.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">order.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PDB文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ss [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ssdump.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-jc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Jcoupling.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-corr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dihcorr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">chi.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dihtrans.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">trhisto.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rt [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">restrans.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cp [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">chiprodhisto.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-15'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹读取最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r0 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">起始残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]phi</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出φ二面角</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]psi</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出ψ二面角</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]omega</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出ω二面角(肽键)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rama</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生成φ/ψ和χ_1/χ_2的Ramachandran图</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]viol</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出一个文件, 对违背Ramachandran规则的角使用0或1</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]periodic</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出二面角与360度的模</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]all</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对每个二面角使用独立的输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rad</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在角度与时间关系的文件中, 使用弧度而不是角度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]shift</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据φ/ψ角度计算化学位移</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-binwidth &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">直方图的分格宽度(单位: 度)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-core_rotamer &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只输出中心<code>-core_rotamer</code>*(360/multiplicity)属于每个旋转异构体的值(其余的赋给rotamer 0)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxchi &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算前几个χ二面角: 0, 1, 2, 3, 4, 5, 6</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normhisto</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">直方图归一化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ramomega</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算omega角度的平均值与φ/ψ的函数关系, 并输出到<code>.xpm</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bfact &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对没有计算二面角序参数的原子, <code>.pdb</code>文件中的B因子值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]chi_prod</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算每个残基的单个累积旋转异构体</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]HChi</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">包含到支链氢原子的二面角</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对统计时所考虑的二面角, 组成二面角的任何原子的最大B因子.<br/> 当进行射线结构分析X时作为基础数据. <code>-bmax <&#61; 0</code>意味着没有限制.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直到最终</td>
</tr>
</table>

### 已知问题

- 产生 __非常非常多__ 的输出文件(数目最多约为蛋白质残基数目的4倍, 如果计算自相关函数会再增加两倍). 通常会有几百个输出文件.
- 使用非标准方式计算φ和ψ二面角, 使用H-N-CA-C计算φ, 而不是使用C(-)-N-CA-C, 使用N-CA-C-O计算ψ, 而不是使用N-CA-C-N(+). 这将导致计算结果与其他工具, 如`gmx rama`的计算结果不符(通常很小).
- `-r0`选项不能正常工作.
- 二重旋转异构体会写入`chi.log`, 如三重一样, 只不过第三个(g(+))的概率总为0.

## gmx cluster: 对结构进行团簇分析(翻译: 姚闯)

	gmx cluster [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-dm [<.xpm>]] [-om [<.xpm>]] [-o [<.xpm>]] [-g [<.log>]]
				[-dist [<.xvg>]] [-ev [<.xvg>]] [-conv [<.xvg>]] [-sz [<.xvg>]]
				[-tr [<.xpm>]] [-ntr [<.xvg>]] [-clid [<.xvg>]]
				[-cl [<.xtc/.trr/...>]] [-nice ] [-b ] [-e ]
				[-dt ] [-tu ] [-[no]w] [-xvg ] [-[no]dista]
				[-nlevels ] [-cutoff ] [-[no]fit] [-max ]
				[-skip ] [-[no]av] [-wcl ] [-nst ]
				[-rmsmin ] [-method ] [-minstruct ]
				[-[no]binary] [-M ] [-P ] [-seed ] [-niter ]
				[-nrandom ] [-kT ] [-[no]pbc]

`gmx cluster`可以使用几种不同的方法团簇化结构. 结构之间的距离可由轨迹来确定, 或使用`-dm`选项从`.xpm`矩阵文件读取. 结构间的距离可以由叠合后的RMS偏差或原子对距离的RMS偏差来定义.

确定团簇的方法有以下几种:

- single linkage(单连接): 当一个结构到团簇中任何一个原子的距离小于`cutoff`时, 就将此结构加入到团簇中.
- Jarvis Patrick: 当一个结构和团簇中的一个结构互为近邻结构, 并且至少有`P`个相同的邻近结构时, 将这个结构加入到团簇中. 一个结构的近邻结构是指距离它最近的`M`个结构或在`cutoff`以内的全部结构.
- Monte Carlo(蒙特卡洛): 利用蒙特卡洛方法重新排列RMSD矩阵, 以使帧的排列具有尽可能小的递增顺序. 这样做可以使从一个结构到另一个结构的动画尽量平滑, 并且结构之间的具有最大的可能(例如)RMSD, 但中间步骤应尽可能小. 这种方法可用于显示模拟的平均力势能系综或牵引模拟. 显然, 用户要仔细地准备轨迹文件(例如不能存在叠加的帧). 最终的结果可以通过`.xpm`矩阵文件进行直观的检查, 此文件从下到上都应该平滑地变化.
- diagonalization(对角化): 对角化RMSD矩阵.
- gromos: 利用Daura等介绍的算法(Angew. Chem. Int. Ed. __1999__, 38, pp 236-240). 使用截断来数算近邻结构的个数, 把具有最多近邻的结构及其所有近邻作为一个团簇, 并从团簇池中将这个团簇移除. 然后对团簇池中剩下的结构重复以上算法.

当团簇化算法(single linkage, Jarvis Patrick and gromos) 将每个结构都精确地分配到了一个团簇, 并且提供了轨迹文件时, 在每一个团簇中, 相对于其他结构或平均结构或所有结构拥有最小平均距离的结构将被写入到轨迹文件中. 当输出所有结构时, 对每个团簇会使用单独编号的文件.

程序总会给出两个输出文件:

- `-o`: 输出矩阵左上半区域的RMSD值, 团簇图像的右下半区域. 当`-minstruct = 1`时, 若两个结构属于同一团簇, 相应的图像点为黑色; 当`-minstruct > 1`时, 对每一个团簇使用不同的颜色.
- `-g`: 输出所用选项的信息和所有团簇及其成员的详细列表.

此外, 程序也可以给出多个可选的输出文件:

- `-dist`: 输出RMSD的分布
- `-ev`: 输出RMSD矩阵对角化的特征向量
- `-sz`: 输出团簇的大小
- `-tr`: 输出两个团簇之间的转变次数矩阵
- `-ntr`: 输出从/到每个团簇的总转变次数
- `-clid`: 输出团簇数随时间变化的函数
- `-cl`: 输出每个团簇的平均(利用`-av`选项)或中心结构, 或对所选的一组团簇, 将团簇成员输出到带编号的文件(利用`-wcl`选项, 取决于`-nst`和`-rmsmin`选项). 一个团簇的中心是指团簇中与所有其他结构具有最小平均RMSD的结构.

<table id='tab-16'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dm [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-om [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd-raw.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd-clust.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">cluster.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd-dist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ev [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd-eig.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-conv [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mc-conv.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sz [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clust-size.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tr [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clust-trans.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clust-trans.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-clid [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clust-id.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cl [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clusters.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
</table>

<table id='tab-17'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间值的单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的 .xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg图形格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]dista</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">利用RMSD距离而不是RMS偏差</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">40</td>
  <td rowspan="1" colspan="1" style="text-align:left;">离散化RMSD矩阵时使用的水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cutoff &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">定义两个近邻结构所用的RMSD截断距离(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fit</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算RMSD之前使用最小二乘叠合结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">RMSD矩阵的最高水平</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每nr帧分析一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]av</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出每一团簇的平均等中间结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-wcl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将此数目团簇的结构输出到编号文件中</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nst &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个团簇中的结构数超过此数时才会输出团簇中的所有结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmsmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出结构与其余团簇的最小rms差异</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-method &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">linkage</td>
  <td rowspan="1" colspan="1" style="text-align:left;">团簇的确定方法: linkage, jarvis-patrick, monte-carlo, diagonalization, gromos</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-minstruct &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>.xpm</code>文件中着色团簇具有的最小结构数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]binary</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将RMSD矩阵视为由0和1组成的矩阵, 截断由<code>-cutoff</code>给出</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-M &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Jarvis-Patrick算法中使用的最近近邻数, 取0时使用截断</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">形成团簇需要的全同最近近邻数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1993</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蒙特卡洛团簇化算法的随机数种子: <&#61; 0 代表生成</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-niter &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蒙特卡洛的迭代次数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nrandom &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蒙特卡洛的第一次迭代可以完全随机, 以对帧进行混洗</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-kT &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蒙特卡洛优化中使用的Boltzmann权重因子(取0时会关闭上升步骤)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PBC检查</td>
</tr>
</table>

## gmx clustsize: 计算原子团簇的尺寸分布(翻译: 康文斌)

	gmx clustsize [-f [<.xtc/.trr/...>]] [-s [<.tpr>]] [-n [<.ndx>]]
				  [-o [<.xpm>]] [-ow [<.xpm>]] [-nc [<.xvg>]] [-mc [<.xvg>]]
				  [-ac [<.xvg>]] [-hc [<.xvg>]] [-temp [<.xvg>]] [-mcn [<.ndx>]]
				  [-nice ] [-b ] [-e ] [-dt ] [-tu ]
				  [-[no]w] [-xvg ] [-cut ] [-[no]mol] [-[no]pbc]
				  [-nskip ] [-nlevels ] [-ndf ] [-rgblo ]
				  [-rgbhi ]

`gmx clustsize`用于计算气相中的分子/原子团簇的尺寸分布. 结果以`.xpm`格式的文件给出. 总的团簇数目会写入一个`.xvg`文件中.

当指定`-mol`选项时, 计算团簇时将以分子为基本单元, 而不是以原子为基本单元, 这样允许对大分子进行团簇化. 在这种情况下, 索引文件中仍然应当包括原子编号, 否则计算会终止并给出SEGV信号.

当轨迹中包含速度时, 程序假定所有粒子都可自由移动, 并将最大团簇的温度输出在一个独立的`.xvg`文件中. 如果使用了约束, 则需要校正温度. 例如, 使用SHAKE或SETTLE算法模拟水时, 得到的温度是正常温度的1/1.5. 你可以使用`-ndf`选项来补偿这一点. 请记得计算时去除质心的运动.

使用`-mc`选项将输出一个索引文件, 其中包含最大团簇的原子编号.

<table id='tab-18'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">兼容的xdr运行输入文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">csize.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ow [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">csizew.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nclust.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">maxclust.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ac [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">avclust.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">histo-clust.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">temp.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mcn [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">maxclust.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-19'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cut &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.35</td>
  <td rowspan="1" colspan="1" style="text-align:left;">一个团簇中的最大距离(单位nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mol</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对分子而不是原子进行团簇分析(需要<code>.tpr</code>文件)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nskip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出时跳过的帧数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">20</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>.xpm</code>输出文件中灰度的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ndf &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算温度时整个体系的自由度数. 如果未设置, 会使用3倍的原子数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rgblo &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1 1 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">团簇大小最低值的GRB颜色值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rgbhi &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">团簇大小最高值的GRB颜色值</td>
</tr>
</table>

## gmx confrms: 叠合两个结构并计算RMSD(翻译: 李耀)

	gmx confrms [-f1 [<.tpr/.tpb/...>]] [-f2 [<.gro/.g96/...>]]
				[-o [<.gro/.g96/...>]] [-n1 [<.ndx>]] [-n2 [<.ndx>]]
				[-no [<.ndx>]] [-nice ] [-[no]w] [-[no]one] [-[no]mw]
				[-[no]pbc] [-[no]fit] [-[no]name] [-[no]label] [-[no]bfac]

`gmx confrms`首先将第二个结构最小二乘叠合到第一个结构, 然后再计算两个结构的均方根偏差(RMSD, root mean square deviation). 两个结构的原子数 __不必__ 相同, 只要用于叠合的两个索引组一样即可. 使用`-name`选项时, 只对所选组中名称匹配的原子进行叠合和RMSD计算. 当比较蛋白质的突变体时这个功能很有用.

叠合的结构会写入一个文件中. 在这个`.pdb`文件中, 两个结构会当作独立的模型(使用`rasmol –nmrpdb`). 使用`-bfac`选项时, 根据原子的MSD值计算的B因子也会写入这个`.pdb`文件中.

<table id='tab-20'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f1 [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf1.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:center;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f2 [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf2.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">fit.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n1 [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">fit1.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n2 [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">fit2.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-no [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">match.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-21'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]one</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只输出叠合后的结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mw</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">叠合与计算RMSD时使用质量加权</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">尝试将分子恢复完整</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fit</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将目标结构与参考结构进行最小二乘叠合</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]name</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只考虑名称匹配的原子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]label</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">增加链标识, 第一个结构为A, 第二个结构为B</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]bfac</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据原子的MSD值输出B因子</td>
</tr>
</table>

## gmx convert-tpr: 生成修改的运行输出文件(翻译: 王卓亚)

	gmx convert-tpr [-s [<.tpr/.tpb/...>]] [-f [<.trr/.cpt/...>]] [-e [<.edr>]]
					[-n [<.ndx>]] [-o [<.tpr/.tpb/...>]] [-nice ]
					[-extend ] [-until ] [-nsteps ] [-time ]
					[-[no]zeroq] [-[no]vel] [-[no]cont] [-init_fep_state ]

`gmx convert-tpr`可以四种方式来编辑运行输入文件:

1. 修改运行输入文件中的模拟步数, 可使用选项`-extend`, `-until`或`-nsteps`(`nsteps=-1`表示步数不受限制).
2. (已废弃) 因磁盘已满等原因而导致模拟崩溃时, 产生一个运行输入文件以继续模拟, 或创建一个继续的运行输入文件. 此选项已废弃, 因为`mdrun`现在可以读写检查点文件. __注意__, 运行需要带有坐标和速率的帧. 当使用压力和/或Nose-Hoover温度耦合时, 还需要提供能量文件以得到原始运行的精确继续.
3. 对原始tpx文件一部分创建一个`.tpx`文件. 当你想从`.tpx`文件中移除溶剂, 或想产生一个例如只包含C~α~的`.tpx`文件时, 此功能很有用. 需要注意的是, 你可能需要使用`-nsteps -1`(或类似的选项). __警告: 此`.tpx`文件功能不全.__
4. 将指定组的电荷设置为零. 当使用LIE(Linear Interaction Energy, 线性相互作用能)方法估算自由能时, 此功能很有用.

<table id='tab-22'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入,可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入,可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tpxout.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
</table>

<table id='tab-23'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-extend &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通过此值来延长运行时间 (单位: ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-until &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">延长运行时间直到此时间结束 (单位: ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nsteps &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">修改模拟运行步数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-time &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">由此时间(单位: ps)帧继续运行, 而不是从最后一帧继续运行</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]zeroq</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将一个组(来自索引)的电荷设置为零</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]vel</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">需要来自轨迹的速度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cont</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">为了精确的延续, 在第一步之前不应施加约束</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-init_fep_state &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">由此状态开始初始化fep状态</td>
</tr>
</table>

## gmx covar: 计算并对角化协方差矩阵(翻译: 王浩博)

	gmx covar [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			  [-o [<.xvg>]] [-v [<.trr/.cpt/...>]] [-av [<.gro/.g96/...>]]
			  [-l [<.log>]] [-ascii [<.dat>]] [-xpm [<.xpm>]] [-xpma [<.xpm>]]
			  [-nice ] [-b ] [-e ] [-dt ] [-tu ]
			  [-xvg ] [-[no]fit] [-[no]ref] [-[no]mwa] [-last ]
			  [-[no]pbc]

`gmx covar`用于计算并对角化(质量加权的)协方差矩阵. 所有结构都叠合到结构文件中的结构. 当结构文件不是运行输入文件时, 将不考虑周期性. 如果叠合组与分析组相同, 分析时不使用质量加权, 叠合也不使用质量加权.

本征向量会写入一个轨迹文件(`-v`). 如果叠合与协方差分析的原子相同, 会首先输出用于叠合的参考结构, 其t=-1. 平均(或参考, 若使用了`-ref`)结构的t=0, 本征向量会写入不同的帧, 以其本征向量序号为时间戳.

本征向量可使用`gmx anaeig`分析.

选项`-ascii`会将整个协方差矩阵写入一个ASCII文件. 元素的顺序为: x1x1, x1y1, x1z1, x1x2, ...

选项`-xpm`会将整个协方差矩阵写入一个`.xpm`文件.

选项`-xpma`会将原子的协方差矩阵写入一个`. xpm`文件, 即, 写入每个原子对xx, yy和zz协方差的总和.

注意, 对角化一个矩阵所需的内存和时间至少会以原子数平方的速度增加, 因此很容易耗尽内存. 在这种情况下, 程序很可能会出现段错误并推出. 你应该仔细考虑数目更少的一组原子是否能满足你的需求, 这样计算成本更低.

<table id='tab-24'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenval.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-av [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">average.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-l [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">covar.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ascii [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">covar.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xpm [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">covar.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xpma [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">covara.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
</table>

<table id='tab-25'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fit</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">叠合到参考结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ref</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用与结构文件中的构型的偏离, 而不是使用平均构型</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mwa</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">质量加权的协方差分析</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-last &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出的最后一个本征向量的编号(-1会输出所有本征向量)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对周期性边界条件进行校正</td>
</tr>
</table>

## gmx current: 计算介电常数和电流自相关函数(翻译: 刘恒江)

	gmx current [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]] [-f [<.xtc/.trr/...>]]
				[-o [<.xvg>]] [-caf [<.xvg>]] [-dsp [<.xvg>]] [-md [<.xvg>]]
				[-mj [<.xvg>]] [-mc [<.xvg>]] [-nice ] [-b ]
				[-e ] [-dt ] [-[no]w] [-xvg ] [-sh ]
				[-[no]nojump] [-eps ] [-bfit ] [-efit ]
				[-bvit ] [-evit ] [-tr ] [-temp ]

`gmx current`可用于计算电流自相关函数, 体系转动偶极矩和平动偶极矩的相关, 以及相关的静态介电常数. 为得到合理的结果, 索引组应当是中性的. 更进一步, 如果给出了速度, 程序也可以根据电流自相关函数计算静态电导率. 此外, 也可以利用Einstein-Helfand拟合得到静态电导率.

`-caf`选项用于指定电流自相关函数的输出文件, `-mc`选项用于指定偶极矩转动和平动部分相关的输出文件. 但这些选项只适用于包含速度的轨迹. 选项`-sh`和`-tr`对自相关函数进行平均和积分. 由于平均是通过移动轨迹的起始点进行的, 可以利用`-sh`选项修改移动以便选择不相关的起始点. 当接近终止点时, 统计的不精确度增加, 对自相关函数进行积分只有在某一点之前才能得到合理的值, 数据的可靠性取决于帧数. 选项`-tr`控制用于计算静态介电常数的积分区域的大小.

选项`-temp`可以设置计算静态介电常数所需要的温度.

当模拟中使用了反应场或偶极修正Ewald加和(`-eps=0`对应于圆罐边界条件)时, 选项`-eps`可以控制周围介质的介电常数.

`-[no]nojump`选项取消坐标折叠允许自由扩散. 这需要一个连续的平动偶极矩以便进行Einstein-Helfand拟合. 拟合结果可用于确定带电分子体系的介电常数. 然而, 也可以根据折叠坐标的总偶极矩涨落计算介电常数. 但使用此选项时需要小心, 因为只有在非常小的时间跨度内才能满足分子密度近似恒定且平均值收敛的条件. 为保险起见, 计算介电常数时, 应借助Einstein-Helfand方法计算介电常数的平动部分.

<table id='tab-26'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">current.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-caf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">caf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dsp [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dsp.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-md [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">md.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mj [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mj.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mc.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-27'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的<code>.xvg</code>, <code>.xpm</code>, <code>.eps</code>以及<code>.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sh &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">为计算相关函数平均值及均方差位移而移动的帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]nojump</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除横跨盒子的原子跳跃</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eps &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">周围介质的介电常数. 该值为0时相当于无穷大(圆罐边界条件).</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平动偶极矩MSD拟合为直线的起始值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-efit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">400</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平动偶极矩MSD拟合为直线的终止值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bvit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">电流自相关函数拟合为a*t^b的起始值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-evit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">电流自相关函数拟合为a*t^b的终止值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tr &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.25</td>
  <td rowspan="1" colspan="1" style="text-align:left;">积分时所用轨迹所占的比例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算介电常数时所用的温度</td>
</tr>
</table>

## gmx density: 计算体系的密度(翻译: 阮洋)

	gmx density [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-s [<.tpr/.tpb/...>]]
				[-ei [<.dat>]] [-o [<.xvg>]] [-nice ] [-b ]
				[-e ] [-dt ] [-[no]w] [-xvg ] [-d ]
				[-sl ] [-dens ] [-ng ] [-[no]center] [-[no]symm]
				[-[no]relative]

`gmx density`用于计算盒子中的局部密度, 需要使用索引文件.

对于NPT模拟的总密度, 可以直接使用`gmx energy`来得到.

选项`-center`相对任意组中心以绝对盒子坐标进行直方图分格. 如果你想计算沿盒子Z轴的密度剖面, 盒子Z方向的大小为bZ, 如果基于整个体系进行居中, 输出的坐标范围从-bZ/2到bZ/2. 注意, 在GROMACS 5.0中, 这种行为有所改变. 早期的版本中只是在(0, bZ)范围内进行简单的静态分格, 并将输出进行移动. 新版本会计算每一帧的中心并在(-bZ/2,bZ/2)范围内进行分格.

选项`-symn`使输出结果关于中心对称. 这一选项也会自动打开`-center`选项. 选项`-relative`基于盒子的相对坐标而不是绝对坐标进行分格, 然后对输出结果按输出轴方向盒子的平均尺寸进行标定.
这一选项可以与`-center`结合使用.

密度的单位为kg/m^3^, 同时也可以计算数密度或电子密度. 计算电子密度时, 需要使用选项`-ei`提供一个文件, 其中包含了每一原子类型的电子数. 文件内容如下所示:

	2
	atomname = nrelectrons
	atomname = nrelectrons

第一行指明了该文件的行数. 体系中每个唯一的原子名称对应于一行. 每个原子的电子数会根据其原子部分电荷进行修改.

__对双层体系需要注意的几点__

最常见的使用情境之一是计算跨脂质双层的各种原子组的密度, 通常是以Z轴作为法线方向. 对小体系的短时间模拟, 当固定盒子尺寸时, 比较好处理, 但对更一般的情况, 脂质双层可能比较复杂. 第一个问题就是蛋白质和脂质的体积压缩率都很小, 而脂质有非常高的面积压缩率.
这意味即便对完全弛豫好的体系, 在模拟过程中盒子形状(厚度或是面积/脂质)的涨落仍然很大.

因为GROMACS将盒子置于原点和正轴之上, 这也就意味着居于盒子中间的脂质双层由于涨落将会上下移动, 并进而模糊密度剖面. 解决这个问题的最简单方法(如果你要使用压力耦合)就是使用`-center`选项以计算相对于盒子中心的密度剖面. 注意, 你仍然可以用双层部分居中, 即使你有一个复杂的非对称的脂质双层和膜蛋白体系. 这样输出的数据点在(中心)原点参考位置的某一侧会较多.

因为脂质本身会被压缩和膨胀, 居中计算会导致输出的密度剖面模糊. 即使如此, 在多数情况下你希望得到这样的结果(因为它对应于宏观实验). 但如果你要关注分子细节, 可以使用`-relative`选项来尝试消除体积涨落带来的影响.

最后, 对不受表面张力影响的大的双层, 在体系中形成"波浪"的地方会表现出起伏涨落. 这是生物体系的基本性质, 如果要和实验做对比, 你可能要包括这种波动模糊效应.

<table id='tab-28'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ei [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">electrons.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">density.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-29'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的<code>.xvg</code>, <code>.xpm</code>, <code>.eps</code>以及<code>.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">指定膜的法线方向: X, Y或Z</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">50</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将盒子划分为指定数目的片</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dens &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mass</td>
  <td rowspan="1" colspan="1" style="text-align:left;">密度类型: mass, number, charge, electron</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要计算密度的组的数目<br>一次性可以计算多个组的密度, 可在输出文件中查看</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]center</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相对于(变化的)盒子中心进行分格, 适用于双层体系.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]symm</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使密度分布沿轴向对称. 适用于双层体系</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]relative</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对变化的盒子使用相对坐标, 并根据平均尺寸对使出进行标定</td>
</tr>
</table>

### 已知问题

- 当计算电子密度时, 使用了原子名称而不是原子类型. 这种做法很不好.

### 补充说明

`gmx density`是获取体系或各个组分在盒子内分布密度的一个程序. 一般来说可使用如命令:

	gmx density -f *.trr -n *.ndx -s *.tpr -d z -o density.xvg

其中

- `-f *.trr`指定要分析的轨迹文件
- `-n *.ndx`指定索引文件, 使用它可以在分析时指定不同的组来分析
- `-s *.tpr`指定拓扑文件
- `-d z`指定沿着z轴方向进行分析

如果要指定分析索引组1的密度, 可以使用命令管道:

	echo 1 | gmx density -f npt.trr -n system.ndx -s npt.tpr -d z -o density_DRG.xvg

此程序不支持根据残基名称来获取密度, 可通过`gmx make_ndx`来获取索引组代号再通过命令管道传给`gmx density`实现.

## gmx densmap: 计算二维的平面或轴径向密度映射图(翻译: 姚闯)

	gmx densmap [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-od [<.dat>]] [-o [<.xpm>]] [-nice ] [-b ]
				[-e ] [-dt ] [-[no]w] [-bin ] [-aver ]
				[-xmin ] [-xmax ] [-n1 ] [-n2 ]
				[-amax ] [-rmax ] [-[no]mirror] [-[no]sums]
				[-unit ] [-dmin ] [-dmax ]

`gmx densmap`用于计算2D数密度的映射图. 它可以计算平面和轴径向的密度映射图. 输出的`.xpm`文件可以利用XV等程序进行可视化, 也可以利用`xpm2ps`转换为psotscript. 利用`-od`选项可将数据输出为文本形式的`.dat`文件, 而不是`-o`输出的通常`.xpm`文件.

程序默认计算选定的一组原子在xy平面内的2D数密度映射图. 可以使用`-aver`选项改变平均方向. 当设定了`-xmin`和/或`-xmax`时, 计算时只会考虑平均方向上处于限制范围之内的原子. 使用`-bin`设置格点间距. 当`-n1`或`-n2`取非零值时, 格点尺寸由该选项决定. 计算时考虑了盒子尺寸的涨落.

当设定了`-amax`和`-rmax`选项时, 会计算轴径向数密度映射图. 应提供三个组, 前两个组的质心用与定义轴线, 第三个组为要分析组. 轴向范围从-amax至+amax, 中心为两质心的中点, 并且正方向为第一组的质心到第二组的质心. 径向范围从0到rmax. 当指定了`-mirror`选项时, 径向范围从-rmax至+rmax.

可使用`-unit`选项对输出进行归一化. 默认给出实际的数密度. 使用`-unit nm-2`选项忽略对平均值或角方向的归一化处理. 使用`-unit count`选项可得到每个格点单元的计数值. 如果不想在输出中使用从零到最大密度的标尺, 你可以使用`-dmax`选项设定最大密度值.

<table id='tab-30'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">densmap.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">densmap.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容数据文件</td>
</tr>
</table>

<table id='tab-31'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的<code>.xvg</code>, <code>.xpm</code>, <code>.eps</code>以及<code>.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.02</td>
  <td rowspan="1" colspan="1" style="text-align:left;">格点尺寸 (nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-aver &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平均的方向: z, y, x</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平均的最小坐标</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平均的最大坐标</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n1 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">第一方向的格点单元数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n2 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">第二方向的格点单元数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-amax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">距离中心的最大轴向距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最大径向距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mirror</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在轴下添加镜像</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sums</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将密度累加值(1D映射图)输出到屏幕</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-unit &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nm-3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出单位: nm-3, nm-2, count</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出中的最小密度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出中的最大密度(0表示由计算值确定)</td>
</tr>
</table>

### 补充说明

- Sobereva, [使用g_densmap得到分子附近二维密度分布图](http://sobereva.com/12)

## gmx densorder: 计算表面涨落(翻译: 李卫星)

	gmx densorder [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-n [<.ndx>]]
				  [-o [<.dat>]] [-or [<.out> [...]]] [-og [<.xpm> [...]]]
				  [-Spect [<.out> [...]]] [-nice ] [-b ] [-e ]
				  [-dt ] [-[no]w] [-[no]1d] [-bw ] [-bwn ]
				  [-order ] [-axis ] [-method ] [-d1 ]
				  [-d2 ] [-tblock ] [-nlevel ]

`gmx densorder`利用MD轨迹计算沿着某一方向的双相密度分布, 通过将界面密度拟合为函数的剖面, 可得到二维表面随时间的涨落. 利用`-tavg`选项可输出界面的时间平均的空间表示.

<table id='tab-32'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Density4D.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.out> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hello.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-og [&lt;.xpm> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">interface.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Spect [&lt;.out> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">intfspect.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件</td>
</tr>
</table>

<table id='tab-33'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]1d</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">伪1D界面结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平行于界面的密度分布的分格宽度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bwn &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.05</td>
  <td rowspan="1" colspan="1" style="text-align:left;">垂直于界面的密度分布的分格宽度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-order &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">高斯滤波器的阶数, 0意味着不使用滤波</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-axis &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轴的方向: X, Y或Z</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-method &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bisect</td>
  <td rowspan="1" colspan="1" style="text-align:left;">定位界面的方法: bisect, functional</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d1 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相1的体相密度(z值小时)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d2 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相2的体相密度 (z值大时)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tblock &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">一次时间块平均所用的帧数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevel &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">2D-XPixMaps中高度的水平数</td>
</tr>
</table>

## gmx dielectric: 计算频率相关的介电常数(翻译: 白艳艳)

	gmx dielectric [-f [<.xvg>]] [-d [<.xvg>]] [-o [<.xvg>]] [-c [<.xvg>]]
				   [-nice ] [-b ] [-e ] [-dt ] [-[no]w]
				   [-xvg ] [-[no]fft] [-[no]x1] [-eint ] [-bfit ]
				   [-efit ] [-tail ] [-A ] [-tau1 ]
				   [-tau2 ] [-eps0 ] [-epsRF ] [-fix ]
				   [-ffn ] [-nsmooth ]

`gmx dielectric`可以利用模拟得到的总偶极矩的自相关函数(ACF)计算频率依赖的介电常数. ACF可由`gmx dipoles`计算得到. 可使用的函数形式如下:

- 单参数: y = exp(-a_1 x)
- 双参数: y = a_2 exp(-a_1 x)
- 三参数: y = a_2 exp(-a_1 x) + (1 - a_2) exp(-a_3 x)

拟合的初始值可以在命令行中指定, 也可以使用`-fix`和参数编号将需要固定的参数的值固定为初始值.

程序会生成三个输出文件. 第一个文件中包含了ACF, 对ACF使用1, 2, 3个参数的指数拟合, 以及组合的数据/拟合的数值导数. 第二个文件中包含了频率依赖介电常数的实部和虚部. 最后一个文件给出了所谓的Cole-Cole图, 图中虚部是实部的函数. 对于一个纯指数弛豫(也称德拜弛豫), Cole-Cole图应该是个半圆.

<table id='tab-34'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dipcorr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">deriv.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">epsw.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">cole.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-35'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fft</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用快速傅里叶变换计算相关函数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]x1</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用第一列作为X轴数据, 而不是使用第一个数据集</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eint &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">终止数据积分并开始使用拟合的时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-efit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">500</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合的终止时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tail &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">500</td>
  <td rowspan="1" colspan="1" style="text-align:left;">函数的长度, 包括数据与拟合的尾部</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-A &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合参数A的初始值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tau1 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合参数τ1的初始值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tau2 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合参数τ2的初始值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eps0 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">80</td>
  <td rowspan="1" colspan="1" style="text-align:left;">液体的ε0</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-epsRF &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">78.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">模拟中使用的反应场的ε. 值为0表示无穷大.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fix &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将参数固定为初始值, A (2), tau1 (1)或tau2 (4)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ffn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nsmooth &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于平滑的点的个数</td>
</tr>
</table>

## gmx dipoles: 计算总偶极及其涨落(翻译: 曹锟)

	gmx dipoles [-en [<.edr>]] [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]]
				[-n [<.ndx>]] [-o [<.xvg>]] [-eps [<.xvg>]] [-a [<.xvg>]]
				[-d [<.xvg>]] [-c [<.xvg>]] [-g [<.xvg>]] [-adip [<.xvg>]]
				[-dip3d [<.xvg>]] [-cos [<.xvg>]] [-cmap [<.xpm>]]
				[-slab [<.xvg>]] [-nice ] [-b ] [-e ]
				[-dt ] [-[no]w] [-xvg ] [-mu ] [-mumax ]
				[-epsilonRF ] [-skip ] [-temp ] [-corr ]
				[-[no]pairs] [-[no]quad] [-ncos ] [-axis ]
				[-sl ] [-gkratom ] [-gkratom2 ] [-rcmax ]
				[-[no]phi] [-nlevels ] [-ndegrees ] [-acflen ]
				[-[no]normalize] [-P ] [-fitfn ] [-beginfit ]
				[-endfit ]

`gmx dipoles`用于计算模拟体系的总偶极及其涨落. 利用这些数据, 你可以计算其他一些性质, 如低介电介质的介电常数. 对于具有净电荷的分子, 会在分子质心处减去分子的净电荷.

`Mtot.xvg`文件中包含了每帧的总偶极矩, 总偶极矩的分量以及大小. `aver.xvg`文件中包含了模拟过程中的<|μ|\^2>和|<μ>|\^2. `dipdist.xvg`文件包含了模拟过程中偶极矩的分布. `-mumax`的值是来统计分布图的最高值.

而且, 如果使用了`-corr`选项, 程序会计算偶极的自相关函数, 输出文件的名字可通过`-c`选项来指定. 相关函数可以对所有分子进行平均, 独立地绘制每个分子(`molsep`)的分布, 或计算模拟盒子的总偶极矩(`total`).

选项`-g`可以给出依赖距离的Kirkwood G因子, 以及偶极夹角余弦平均值与距离的函数关系. 图中包括了gOO和hOO, 请参考Nymand & Linse, _J. Chem. Phys._ 112 (2000) pp 6386-6395. 在同一图中, 还包括了每一尺度的能量, 它是偶极矩内积与距离三次方的商.

示例: `gmx dipoles -corr mol -P 1 -o dip_sqr -mu 2.273 -mumax 5.0`

上面的命令将计算分子偶极矩的自相关函数, 计算时使用了偶极矩向量与其t时刻后的值之间的夹角的一阶Legendre多项式. 此计算将会使用1001帧. 更进一步, 可以计算`-epsilonRF`无穷大(默认), 温度300 K(默认), 分子平均偶极矩2.273(SPC)条件下的介电常数. 对分布函数, 其最大值被设定为5.0.

<table id='tab-36'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-en [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Mtot.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eps [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">epsilon.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">aver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dipdist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dipcorr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">gkr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-adip [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">adip.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dip3d [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dip3d.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cos [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">cosaver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cmap [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">cmap.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-slab [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">slab.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-37'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mu &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">单个分子的偶极矩(单位Debye)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mumax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">以Debye为单位的最大偶极矩(用于直方图)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-epsilonRF &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">模拟中使用的反应场的ε值, 用于计算介电常数. 注意: 0.0代表无穷大(默认)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出结果中跳过的步数(但计算中使用了所有步)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">模拟的平均温度(用于计算介电常数)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-corr &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要计算的相关函数: none, mol, molsep, total</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pairs</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算所有分子对的 $\vert \cos(\q)\vert$. 计算可能比较耗时.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]quad</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">考虑四极距</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ncos &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">该值只能为1或2, 决定了是计算同一组分子之间的&lt;cos(θ)>, 还是计算不同组之间的&lt;cos(θ)>.<br/> 使用此选项会打开<code>-g</code>选项.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-axis &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算盒子的法线沿X, Y或Z方向</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将盒子划分成若干片.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-gkratom &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算依赖距离的Kirkwood因子时, 使用分子的第n个原子(从1开始)来计算分子间的距离, <br/>而不是使用电荷中心(此值取0时).</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-gkratom2 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与上一选项相同, 但用于<code>-ncos 2</code>, 即两组分子间的偶极相互作用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rcmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">偶极取向分布中使用的最大距离(用于<code>- ncos 2</code>). 如果为0, 将使用基于盒子长度的规则.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]phi</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将'扭转角度'输出至由<code>-cmap</code>选项指定的<code>.xpm</code>文件中,<br/> 扭转角度定义为两个分子的偶极向量绕分子间距离向量的旋转角度. <br/>默认给出的是偶极矩夹角的余弦值.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">20</td>
  <td rowspan="1" colspan="1" style="text-align:left;">颜色映射图输出中颜色的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ndegrees &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">90</td>
  <td rowspan="1" colspan="1" style="text-align:left;">颜色映射图输出中Y轴的划分数(180度)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认值为帧数的一半</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的开始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1代表直到结束</td>
</tr>
</table>

## gmx disre: 分析距离限制(翻译: 严立京)

	gmx disre [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-ds [<.xvg>]]
			  [-da [<.xvg>]] [-dn [<.xvg>]] [-dm [<.xvg>]] [-dr [<.xvg>]]
			  [-l [<.log>]] [-n [<.ndx>]] [-q [<.pdb>]] [-c [<.ndx>]]
			  [-x [<.xpm>]] [-nice ] [-b ] [-e ] [-dt ]
			  [-[no]w] [-xvg ] [-ntop ] [-maxdr ]
			  [-nlevels ] [-[no]third]

`gmx disre`计算距离限制的方差. 如果需要, 可以使用`gmx protonate`程序将所有的质子添加到蛋白质分子中.

`gmx disre`总是计算瞬时方差而不是时间平均的方差, 因为分析是根据轨迹文件进行的, 使用时间平均没有意义. 尽管如此, 每个限制的时间平均值还是都会输出在日志文件中.

为输出所选的特定限制, 可以使用索引文件.

当给定`-q`选项时, 会输出`.pdb`文件, 并使用平均方差对其着色.

当给定`-c`选项时, 程序将读取一个索引文件, 其中包含了轨迹中与你要分析的团簇(以另一种方式定义)相应的帧. 对这些团簇, 程序将使用三次平均算法来计算平均方差, 并将其输出在日志文件中.

<table id='tab-38'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ds [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">drsum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-da [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">draver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dn [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">drnum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dm [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">drmax.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">restr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-l [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">disres.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">viol.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-q [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">viol.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据库文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clust.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-x [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">matrix.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
</table>

<table id='tab-39'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntop &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每步存储在日志文件中的较大方差的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxdr &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出矩阵中最大的距离方差. 如果此值小于等于0, 将根据数据确定最大值.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">20</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出矩阵的水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]third</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对输出矩阵使用立方反比平均或线性平均</td>
</tr>
</table>

## gmx distance: 计算两个位置之间的距离(翻译: 姚闯)

	gmx distance [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				 [-oav [<.xvg>]] [-oall [<.xvg>]] [-oxyz [<.xvg>]] [-oh [<.xvg>]]
				 [-oallstat [<.xvg>]] [-b ] [-e ] [-dt ]
				 [-tu ] [-xvg ] [-[no]rmpbc] [-[no]pbc] [-sf ]
				 [-selrpos ] [-select ] [-len ]
				 [-tol ] [-binw ]

`gmx distance`计算一对位置间的距离随时间变化的函数. 每个选择指定要计算的一组独立距离. 每个选择应包括位置对, 要计算的, 如位置1-2, 3-4等之间的距离.

`-oav`记录下每个选择的平均距离随时间变化的函数. `-oall`记录下所有独立的间距随时间变化的函数; `-oxyz`也是记录所有独立的间距, 但会记录距离的x, y, z分量而不是距离向量的大小. `-oh`记录每个选择的距离的直方图, 直方图的位置由`-len`和`–tol`来进行设置, 分格的宽度由`-binw`设置. `-oallstat`记录下所有帧的每个单独距离的平均值和标准偏差.

<table id='tab-40'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;. xtc/. trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj. xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入轨迹或单个构型: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;. tpr/. tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol. tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入结构: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;. ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index. ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">额外的索引组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oav [&lt;. xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">distave. xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平均距离随时间变化的函数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oall [&lt;. xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dist. xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">间距随时间变化的函数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oxyz [&lt;. xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">distxyz. xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">间距(在x y z 方向上的分量)随时间变化的函数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh [&lt;. xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">disthist. xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">距离的直方图</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oallstat [&lt;. xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">diststat. xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">独立距离的统计</td>
</tr>
</table>

<table id='tab-41'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间的单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绘制的格式: none, xmgrace, xmgr</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmpbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每一帧使用所有分子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用周期性边界条件计算距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-sf &lt;file></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">从文件中提供选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-selrpos &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atom</td>
  <td rowspan="1" colspan="1" style="text-align:left;">选择参考的位置: atom, res_com, res_cog, mol_com, mol_cog, <br/>whole_res_com, whole_res_cog, whole_mol_com, whole_mol_cog, <br/>part_res_com, part_res_cog, part_mol_com, part_mol_cog, <br/>dyn_res_com, dyn_res_cog, dyn_mol_com, dyn_mol_cog</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-select &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离对的位置</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-len &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">直方图的平均距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tol &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">直方图分布的宽度关于<code>-len</code>的函数.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-binw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:left;">直方图单元格的宽度</td>
</tr>
</table>

### 补充说明

<del>可以使用`gmx distance`提取两个原子间的距离随时间的变化, 需要一个索引文件, 其写法是, 在里面加入两个组, 内容分别是这两个原子序号, 再运行`gmx distance -f file.xtc -s file.tpr -n index.ndx`会提示选择组, 分别选择那两个组即可. 计算结果输出在`dist.xvg`文件中, 其中第二列是距离, 后面三列是距离的x/y/z分量.</del>

上述为旧版本说明, 新版本使用方法见[GROMACS计算距离的方法及注意点
](https://jerkwin.github.io/2018/01/14/GROMACS%E8%AE%A1%E7%AE%97%E8%B7%9D%E7%A6%BB%E7%9A%84%E6%96%B9%E6%B3%95%E5%8F%8A%E6%B3%A8%E6%84%8F%E7%82%B9/)

## gmx do_dssp: 指定二级结构并计算溶剂可及表面积(翻译: 杨旭云)

	gmx do_dssp [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-ssdump [<.dat>]] [-map [<.map>]] [-o [<.xpm>]] [-sc [<.xvg>]]
				[-a [<.xpm>]] [-ta [<.xvg>]] [-aa [<.xvg>]] [-nice ]
				[-b ] [-e ] [-dt ] [-tu ] [-[no]w]
				[-xvg ] [-sss ] [-ver ]

`gmx do_dssp`读取轨迹文件, 并调用第三方程序dssp计算每一时间帧蛋白质的二级结构信息. 如果你还没有安装dssp程序, 可以在这里获得: <http://swift.cmbi.ru.nl/gv/dssp>. `gmx do_dssp`假定dssp可执行程序的路径为`/usr/local/bin/dssp`. 如果不是, 那么需要设置环境变量`DSSP`, 并将其指向dssp可执行程序的路径, 例如`setenv DSSP /opt/dssp/bin/dssp`. 如果使用bash, 可使用`export DSSP='/opt/dssp/bin/dssp'`, 也可以直接将该变量加到bash的配置文件中.

自2.0.0版本起, dssp的语法不同于之前的版本. 如果你正在使用旧版本的dssp程序, 可用选项`-ver`指示`do_dssp`使用旧的语法. 默认情况下, `do_dssp`使用2.0.0版本引入的语法. 即使更新的版本(编写此文档时尚未发布)也被假定与2.0.0版本使用同样的语法.

程序会将每一残基每一时间帧的二级结构写入一个`.xpm`矩阵文件. 该文件实际上是一个文本文件, 可以用文本编辑器打开. 文件中用不同字符表示蛋白质每一残基属于何种二级结构, 并随时间变化, 同时定义了每个字符的颜色. 这一文件可使用`xv`之类的程序可视化, 也可使用`xpm2ps`转换为PostScript格式, 扩展名为`.eps`, 这样就可以直接打开或用到Latex文件中. 在`.xpm`和PostScript文件中, 每个链以浅灰线分割开.

程序可以统计每个二级结构类型的残基数目和总的二级结构类型数(`-sss`), 并将统计结果随时间的变化写入文件中(`-sc`). 输出文件中包含了所有不同二级结构的氨基酸残基数目, 可以用xmgrace的`-nxy`选项打开.

程序可以计算每个残基的溶剂可及表面积(SAS, Solvent Accesible Surface), 包括绝对值(&#197;^2^)和相对于残基最大可及表面积的比例. 残基的最大可及表面积定义为该残基在甘氨酸链中的可及表面积. __注意__, `gmx sas`程序也可用于计算SAS且更简单高效.

最后, 这个程序可以将二级结构信息转存在一个特殊的文件`ssdump.dat`中(此文件为文本文件, 里面用字符代表残基的二级结构类型, 如H表示螺旋, B表示折叠等), 以供`gmx chi`程序使用. 将这两个程序结合起来, 就可以分析残基二面角性质与二级结构类型的关系.

<table id='tab-42'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ssdump [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ssdump.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>- map [&lt;.map>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ss.map</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 库</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵数据到颜色的映射文件. <br>程序输出<code>.xpm</code>文件的原色库文件, 如无则默认输出</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ss.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件.<br>各个残基属于某二级结构的信息并随时间变化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">scount.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件<br>统计某二级结构的残基数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">area.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件<br>各残基的溶剂可及表面积</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ta [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">totarea.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件<br>总溶剂可及表面积, 包括疏水和亲水表面积</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-aa [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">averarea.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件<br>平均溶剂可及表面积</td>
</tr>
</table>

<table id='tab-43'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序运行结束查看输出文件: .xvg, .xpm, .eps和.pdb</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sss &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">HEBT</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于数算结构的二级结构</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sss ver &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">DSSP主版本号. 自2.0版本开始语法发生变化.</td>
</tr>
</table>

## gmx dos: 分析态密度及相关性质(翻译: 韩广超)

	gmx dos [-f [<.trr/.cpt/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			[-vacf [<.xvg>]] [-mvacf [<.xvg>]] [-dos [<.xvg>]] [-g [<.log>]]
			[-nice ] [-b ] [-e ] [-dt ] [-[no]w]
			[-xvg ] [-[no]v] [-[no]recip] [-[no]abs] [-[no]normdos]
			[-T ] [-acflen ] [-[no]normalize] [-P ]
			[-fitfn ] [-beginfit ] [-endfit ]

`gmx dos`根据模拟计算态密度. 为使计算结果有意义, 必须使用足够高的频率来保存轨迹中的速度, 这样才能包含所有的振动. 对于柔性体系, 保存轨迹的时间间隔大约是几飞秒. 程序会将基于DoS的性质在打印在标准输出.

<table id='tab-44'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-vacf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">vacf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mvacf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mvacf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dos [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dos.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dos.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
</table>

<table id='tab-45'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">显示更多信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]recip</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绘制DoS图时, X轴使用cm^-1而不是1/ps</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]abs</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用VACF傅里叶变换的绝对值作为态密度. 默认仅仅使用实部.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normdos</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对DoS进行归一化以便其累加和等于3N. 这并不时一个必要的选项.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-T &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298.15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">模拟温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF勒让德多项式的级数(0表示无): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直至最后</td>
</tr>
</table>

### 已知问题

- 此程序运行时需要大量内存: 总使用量等于原子数乘以3乘以帧数再乘以4(或8, 当使用双精度时)

## gmx dump: 生成人类可读的二进制文件(翻译: 黄丽红)

	gmx dump [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-e [<.edr>]]
			 [-cp [<.cpt>]] [-p [<.top>]] [-mtx [<.mtx>]] [-om [<.mdp>]]
			 [-nice ] [-[no]nr] [-[no]sys]

`gmx dump`读取一个运行输入文件(`.tpa`/`.tpr`/`.tpb`), 轨迹文件(`.trj`/`.trr`/`.xtc`), 能量文件(`.ene`/`.edr`), 或检查点文件(`.cpt`), 而后将其以可读格式打印到标准输出. 在检查运行输入文件是否有误时, 此程序至关重要.

此程序也能预处理拓扑文件以此帮助发现问题. 注意, 目前定制包含文件搜索目录的唯一方法是设置`GMXLIB`.

<table id='tab-46'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cp [&lt;.cpt>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">state.cpt</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mtx [&lt;.mtx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hessian.mtx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">海森矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-om [&lt;.mdp>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">grompp.mdp</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">含有MD参数的grompp输入文件</td>
</tr>
</table>

<table id='tab-47'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]nr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在输出中显示索引编号(忽略这些更容易比较, 但创建的拓扑无用)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sys</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">列出整个体系的原子与键合相互作用, 而不是列出每个分子类型的.</td>
</tr>
</table>

### 已知问题：

- 来自`-sys -s`的位置限制输出会中断.

## gmx dyecoupl: 从轨迹中抽取染料动力学(翻译: 李继存)

	gmx dyecoupl [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-ot [<.xvg>]]
				 [-oe [<.xvg>]] [-o [<.dat>]] [-rhist [<.xvg>]] [-khist [<.xvg>]]
				 [-nice ] [-b ] [-e ] [-tu ] [-[no]w]
				 [-xvg ] [-[no]pbcdist] [-[no]norm] [-bins ]
				 [-R0 ]

`gmx dyecoupl`用于从轨迹文件中抽取染料动力学. 目前, 可抽取染料分子间的R和kappa^2, 用于假定偶极耦合遵从Foerster方程的(F)RET模拟. 进一步, 程序也可计算R(t)和kappa^2(t), R和kappa^2^的直方图与平均, 以及指定Foerster半径R_0(`-R0`选项)的瞬时FRET效率E(t). 输入染料分子必须是完整的(参看`gmx trjconv`的`res`和`mol pbc`选项). 染料的转移偶极矩至少要使用一个原子对进行定义, 但也可使用索引文件提供的多个原子对. 距离R基于给定原子对的COM进行计算. `-pbcdist`选项指定计算到最近周期映象的距离, 而不是盒子内的距离, 但这仅适用于具有3维周期性边界的情况. `-norm`选项用于(面积)归一化直方图.

<table id='tab-48'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rkappa.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oe [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">insteff.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rkappa.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rhist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rhist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-khist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">khist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-49'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序运行结束查看输出文件: .xvg, .xpm, .eps和.pdb</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbcdist</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">基于PBC的距离R</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]norm</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化直方图</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bins &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">50</td>
  <td rowspan="1" colspan="1" style="text-align:left;">直方图的分格数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-R0 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">包含kappa^2^&#61;2/3的Foerster半径, 单位nm</td>
</tr>
</table>

## gmx dyndom: 结构旋转的内插和外推(翻译: 李耀)

	gmx dyndom [-f [<.pdb>]] [-o [<.xtc/.trr/...>]] [-n [<.ndx>]] [-nice ]
			   [-firstangle ] [-lastangle ] [-nframe ]
			   [-maxangle ] [-trans ] [-head ]
			   [-tail ]

`gmx dyndom`读取DynDom程序(<http://www.cmp.uea.ac.uk/dyndom/>)输出的`.pdb`文件. 它会读取坐标, 旋转轴的坐标以及包含分区的索引文件. 而且, 它把矢量文件的第一个和最后一个原子当作命令行参数(头和尾), 最终得到平移矢量(DynDom的info文件给出)和旋转角度(也当作命令行参数). 如果给出了DynDom确定的角度, 你应该能够恢复用于生成DynDom输出文件的二级结构. 由于数值精度的限制, 需要通过计算所有原子的RMSD(`gmx confrms`)而不是文件对比(使用`diff`)来进行确认.

此程序的目的是对DynDom揭示的旋转进行内插和外推. 所以, 可能会产生含有过长或过短键的不现实结构, 或者原子会重叠在一起. 因此, 可能需要查看结构和并进行能量优化以验证结构.

<table id='tab-50'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dyndom.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据库文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotated.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">domains.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-51'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-firstangle &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绕旋转矢量的旋转角度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-lastangle &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绕旋转矢量的旋转角度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nframe &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">11</td>
  <td rowspan="1" colspan="1" style="text-align:left;">途径上的步数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxangle &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">DymDom确定的绕旋转矢量的旋转角度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-trans &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">沿旋转矢量的平移量(单位: 埃) (参看DynDom info)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-head &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矢量的第一个原子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tail &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矢量的最后一个原子</td>
</tr>
</table>

## gmx editconf: 编辑模拟盒子以及转换和操控结构文件(翻译: 严立京)

	gmx editconf [-f [<.gro/.g96/...>]] [-n [<.ndx>]] [-o [<.gro/.g96/...>]]
				 [-mead [<.pqr>]] [-bf [<.dat>]] [-nice ] [-[no]w]
				 [-[no]ndef] [-bt ] [-box ] [-angles ]
				 [-d ] [-[no]c] [-center ] [-aligncenter ]
				 [-align ] [-translate ] [-rotate ]
				 [-[no]princ] [-scale ] [-density ] [-[no]pbc]
				 [-resnr ] [-[no]grasp] [-rvdw ] [-[no]sig56]
				 [-[no]vdwread] [-[no]atom] [-[no]legend] [-label ]
				 [-[no]conect]

`gmx editconf`的主要功能是对体系结构进行编辑, 也可以将通用结构格式保存或转换为`.gro`, `.g96`或`.pdb`等其他格式.

在分子动力学模拟中, 通常会给体系添加一个周期性的模拟盒子. `gmx editconf`有许多控制盒子的选项.

利用选项`-box`, `-d`和`-angles`可以对盒子进行修改. 除非明确使用了`-noc`选项, `-box`和`-d`都可以使体系在盒子内居中.

选项`-bt`设定盒子类型: `triclinic`为三斜盒子, `cubic`为所有边长都相等的长方体盒子(即立方体盒子), `dodecahedron`代表菱形十二面体盒子(等边十二面体), `octahedron`为截角八面体盒子(即将两个底面重合的四面体切去方向相反的两头, 同时保证所有的边长相等). 后面两种盒子是三斜盒子的特殊情况. 截角八面体三个盒向量的长度是两个相对六边形之间的最短距离. 相对于具有周期性映象距离的立方盒子, 具有相同周期距离的菱形十二面体盒子的体积是立方盒子的71%, 而截角八面体盒子的体积是立方盒子的77%.

对一般的三斜盒子, `-box`的参数是三个实数, 为长方体的边长. 对于立方盒子, 菱形十二面体盒子或者截面八面体盒子, 选项`-box`只需要提供一个数值, 即盒子边长.

`-d`选项指定体系中的原子到盒子编边界的最小距离. 使用`-d`选项时, 对三斜盒子会使用体系在x, y和z方向的大小, 对立方盒子, 菱形十二面体盒子或截角八面体盒子, 盒子的大小被设定为体系直径(原子间的最大距离)加上两倍的指定距离.

选项`-angles`只能与选项`-box`和三斜盒子一起使用才有意义, 而且不能和选项`-d`一起使用.

当使用`-n`或`-ndef`时, 可以指定一个索引文件, 并选择其中的一个组来计算大小和几何中心, 否则会使用整个体系的大小和几何中心.

`-rotate`选项可以对坐标和速度进行旋转. 如`-rotate 0 30 0`表示将体系绕Y轴沿顺时针方向旋转30度.

`-princ`选项将体系(或体系某一部分)的主轴与坐标轴平齐, 并且最长的轴沿x轴方向. 这可以减小盒子的体积, 特别当分子为长条形时. 但是注意分子在纳秒的时间尺度内可能发生明显的旋转, 所以使用时要小心.

缩放会在任何其他操作之前进行. 可以对盒子和坐标进行缩放以得到一定的密度(选项`-density`). 注意如果输入是`.gro`文件的话, 密度可能不够精确. `-scale`选项的一个特性是, 当某一维度的缩放因子为-1时, 可以得到体系相对于一个平面的镜面映象. 当三个维度的缩放因子都是-1时, 可以获得体系相对于坐标原点的对称映象.

组的选择是在其他所有操作都完成之后进行的. 在程序输出时, 可以只输出体系中的某一个组, 或者某一个部分, 还可以建立划分更细致的索引文件, 以便进行更加细致的选择.

可以粗略地去除体系的周期性. 当去除周期性时, 输入文件最底部的盒向量必须保证正确, 这非常重要, 因为`gmx editconf`去除周期性的算法十分简单, 只是将原子坐标直接减去盒子边长.

当输出`.pdb`文件时, 可以使用`-bf`选项添加B因子. B因子可以从文件中读取, 格式如下: 第一行声明文件中所含B因子数值的个数, 从第二行开始, 每行声明一个索引号, 后面跟着B因子. 默认情况下, B因子将附加到每个残基上, 每个残基一个数值, 除非索引大于残基数目或者设定了`-atom`选项. 显然, 可以添加任何类型的数值数据而不仅仅是B因子. `-legend`选项将生成一列CA原子, 其B因子的范围为所用数据的最小值到最大值, 可以有效地作为查看的图例, 便于可视化软件显示.

使用`-mead`选项时可以生成一个特殊的`.pdb`文件(`.pqr`), 它可用于MEAD静电程序(泊松玻尔兹曼方程求解器). 使用这个选项的前提条件是输入文件必须为运行输入文件(如tpr), 因为这样的文件中才包含了力场参数. 输出文件中的B因子段为原子的范德华半径而占有率段为原子的电荷.

`-grasp`选项的作用与上一选项类似, 只不过互换了电荷与半径的位置, 电荷位于B因子段, 而半径位于占有率段.

选项`-align`可以将特定组的主轴与给定的向量平齐, `-aligncenter`选项指定可选的旋转中心.

最后, 使用选项`-label`, `gmx editconf`可以为`.pdb`文件添加一个链标识符. 如果一个文件中不同残基属于不同肽链, 那么这个选项可以为残基指定肽链归属, 这样不但有利于可视化, 在使用一些程序如Rasmol进行分析时也很有帮助, 在建立模拟体系时也十分方便.

对一些软件包(如GROMOS), 会使用对立方盒子进行角截断的方法生成截角八面体, 为转换这种截角八面体文件, 可使用以下命令:

`gmx editconf -f in -rotate 0 45 35.264 -bt o -box veclen -o out`

其中`veclen`是立方盒子大小乘以sqrt(3)/2.

<table id='tab-52'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp. 放进盒子里面的分子坐标文件.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mead [&lt;.pqr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mead.pqr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于MEAD的坐标文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bf [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bfact.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
</table>

<table id='tab-53'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序结束自动打开输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ndef</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从默认索引组选择输出</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bt &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">triclinic</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于<code>-box</code>和<code>-d</code>的盒子类型: triclinic, cubic, dodecahedron, octahedron</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-box &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒向量长度 (a,b,c). 即自定义的盒子大小</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-angles &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">90 90 90</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒向量之间的角度 (bc,ac,ab)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">溶质分子与盒子之间的距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]c</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使分子在盒子内居中(<code>-box</code>和<code>-d</code>选项暗含此选项)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-center &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">几何中心的坐标</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-aligncenter &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平齐的旋转中心</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-align &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与目标向量平齐</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-translate &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平移</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rotate &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绕X, Y和Z轴的旋转角度, 单位为度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]princ</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使分子取向沿其主轴</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-scale &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1 1 1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">缩放因子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-density &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通过缩放使输出盒子的密度(g/L)为指定值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除周期性(使分子保持完整)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-resnr &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从resnr开始重新对残基进行编号</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]grasp</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在B因子段存储原子电荷, 在占有率段存储原子半径.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rvdw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.12</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果在数据库中找不到范德华半径或者拓扑文件中不存在参数, 将使用默认的范德华半径(单位nm). <br/>可用于处理缺少力场参数的原子.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sig56</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用rmin/2(范德华势能的最小点对应距离的一半)而不是σ/2(范德华半径的一半)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]vdwread</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从<code>vdwradii.dat</code>文件中读取范德华半径, 而不是根据力场计算半径.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]atom</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">强制为每个原子附加B因子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]legend</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">创建B因子图例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-label &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">A</td>
  <td rowspan="1" colspan="1" style="text-align:left;">为所有残基添加链标识符, 以便指定其肽链归属</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]conect</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当写入的时候将CONECT记录添加到<code>.pdb</code>文件中. 只有当拓扑文件存在时才可以.</td>
</tr>
</table>

### 已知问题

- 对复杂的分子, 去除周期性的子程序可能会崩溃, 在这种情况下你可以使用`gmx trjconv`.

### 补充说明

在使用`pdb2gmx`创建了模拟分子体系之后, 可以使用`editconf`为你的分子创建一个模拟盒子, 也可以认为是使用`editconf`将分子放进一个盒子中. 这样, 你就可以往盒子里面添加水分子, 离子或者其他溶剂等等了.

`-princ`这个选项可以用来对齐分子, 比如使分子沿X轴对齐. 例如, 你想将分子中的两个残基沿Y轴对齐, 那么就在索引文件中将这俩个残基标记一下, 然后使用`-princ`, 根据提示就能对齐分子了.

## gmx eneconv: 转换能量文件(翻译: 李继存)

	gmx eneconv [-f [<.edr> [...]]] [-o [<.edr>]] [-nice ] [-b ]
				[-e ] [-dt ] [-offset ] [-[no]settime]
				[-[no]sort] [-[no]rmdh] [-scalefac ] [-[no]error]

当使用`-f`选项指定多个文件时:

按顺序将几个能量文件合并在一起. 当发现同一时刻存在两帧时, 会使用后一文件中的帧. 通过使用`-settime`, 你可以指定每一文件的起始时间. 输入文件由命令行得到, 你可能要使用像`gmx eneconv -f *.edr -o fixed.edr`这样的技巧.

当使用`-f`选项指定一个文件时:

读入一个能量文件, 并根据`-dt`, `-offset`, `-t0`和`-settime`选项输出到另一个文件, 需要时还会转换为不同的格式(有文件扩展名确定).

程序会首先应用`-settime`选项, 然后是`-dt`/`-offset`选项, `-b`和`-e`选项, 用以选择输出哪些帧.

<table id='tab-54'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.edr> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">fixed.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
</table>

<table id='tab-55'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-offset &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code>选项的时间偏移, 即从哪一时间帧开始输出到新的能量文件中</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]settime</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地设定每一输入文件在新输出文件中的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sort</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自动排序输入能量文件(而不是帧)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmdh</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除自由能块数据</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-scalefac &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将能量分量乘以此因子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]error</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当输入文件中出现错误时自动终止程序</td>
</tr>
</table>

### 已知问题

- 当组合轨迹时, 在新的输出文件中, 没有正确地更新sigma和E^2(用于统计), 只有实际能量项是正确的. 这样你需要使用其他方式来计算统计值, 如`gmx analyze`.

### 补充说明

GROMACS模拟有一个非常重要的能量输出文件, 即`.edr`文件. `gmx eneconv`就是对能量输出文件进行处理的程序.

一个模拟可以分多次进行, 于是得到很多`.edr`文件. 使用`gmx eneconv`的`-f`选项, 然后把这些能量文件罗列出来, 就可以对这些能量文件进行合并, 并输出一个完整的能量文件.
如果几个能量文件中有重复的时间帧, 那么后一个读入的能量文件将覆盖前一个. 也可以使用`-settime`选项对每一个输入文件的起始时间进行设置, 以免互相覆盖.
如下是一个示例:

	eneconv -o fixed.edr -f *.edr

即对当前目录下所有`.edr`文件进行合并, 然后输出为`fixed.edr`文件.

当使用`-f`选项读入单独一个能量文件时, 可以配合其他参数对能量文件进行编辑.

## gmx enemat: 从能量文件中提取能量矩阵(翻译: 赵丙春)

	gmx enemat [-f [<.edr>]] [-groups [<.dat>]] [-eref [<.dat>]]
			   [-emat [<.xpm>]] [-etot [<.xvg>]] [-nice ] [-b ]
			   [-e ] [-dt ] [-[no]w] [-xvg ] [-[no]sum]
			   [-skip ] [-[no]mean] [-nlevels ] [-max ]
			   [-min ] [-[no]coulsr] [-[no]coullr] [-[no]coul14]
			   [-[no]ljsr] [-[no]ljlr] [-[no]lj14] [-[no]bhamsr] [-[no]bhamlr]
			   [-[no]free] [-temp ]

`gmx enemat`从能量文件(`-f`)中提取能量矩阵. 使用`-group`选项时必须提供一个文件名称, 文件中每行包含一组使用的原子. 通过寻找名称对应于原子组对名称的能量组, 会从能量文件中提取这些组的相互作用能的矩阵. 例如, 如果`-group`文件中包含:

	2
	Protein
	SOL

程序会预期能量文件中包含具有`Coul-SR:Protein-SOL`和`LJ:Protein-SOL`名称的能量组(尽管同时分析很多组时, `gmx enemat`非常有用). 不同能量类型的矩阵会分开输出, 由`-[no]coul`, `-[no]coulr`, `-[no]coul14`, `-[no]lj`, `-[no]lj14`, `-[no]bham`和`-[no]free`选项控制. 最后, 可以计算每组的总相互作用能(`-etot`).

近似的自由能可以如下计算: $E_{free} = E_0 + kT \log(<\exp((E-E_0)/kT)>)$, 其中 $<>$ 代表时间平均. 可以提供包含参考自由能的文件, 用以计算相对于一些参考状态的自由能差值. 参考文件中的组名称(如残基名称)应当与`-group`文件中的组名称一致, 但在`-group`中追加的数字(如残基编号)在比较时将会被忽略.

<table id='tab-56'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-groups [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">groups.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eref [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eref.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-emat [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">emat.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-etot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">energy.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-57'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sum</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">累加所选的能量项而不是显示它们全部</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">数据点之间跳过的帧数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mean</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与<code>-groups</code>一起使用时抽取平均能量矩阵而不是每一时间步的矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">20</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵颜色的水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1e+20</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量的最大值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-min &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1e+20</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量的最小值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]coulsr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取短程Coulomb能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]coullr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取长程Coulomb能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]coul14</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取Coulomb 1-4能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ljsr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取短程Lennard-Jones能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ljlr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取长程Lennard-Jones能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]lj14</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取Lennard-Jones 1-4能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]bhamsr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取短程Buckingham能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]bhamlr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">抽取长程Buckingham能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]free</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算自由能</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算自由能的参考温度</td>
</tr>
</table>

## gmx energy: 将能量写入xvg文件并显示平均值(翻译: 姚闯)

	gmx energy [-f [<.edr>]] [-f2 [<.edr>]] [-s [<.tpr/.tpb/...>]] [-o [<.xvg>]]
			   [-viol [<.xvg>]] [-pairs [<.xvg>]] [-ora [<.xvg>]] [-ort [<.xvg>]]
			   [-oda [<.xvg>]] [-odr [<.xvg>]] [-odt [<.xvg>]] [-oten [<.xvg>]]
			   [-corr [<.xvg>]] [-vis [<.xvg>]] [-ravg [<.xvg>]] [-odh [<.xvg>]]
			   [-nice ] [-b ] [-e ] [-[no]w] [-xvg ]
			   [-[no]fee] [-fetemp ] [-zero ] [-[no]sum] [-[no]dp]
			   [-nbmin ] [-nbmax ] [-[no]mutot] [-skip ]
			   [-[no]aver] [-nmol ] [-[no]fluct_props] [-[no]driftcorr]
			   [-[no]fluc] [-[no]orinst] [-[no]ovec] [-acflen ]
			   [-[no]normalize] [-P ] [-fitfn ] [-beginfit ]
			   [-endfit ]

`gmx energy`用于从能量文件中提取能量组分或距离限制数据. 程序会提示用户以交互方式选择所需的能量项.

程序会使用全精度计算模拟中能量的平均值, RMSD和漂移(参见手册). 漂移是通过使用最小二乘法将数据拟合为直线得到的. 报告的总漂移是拟合直线第一个点和最后一个点的差值. 平均值的误差估计是基于5个块的块平均得到的, 计算时使用了全精度的平均值. 利用`-nbmin`和`-nbmax`选项, 可以使用多个块长度进行误差估计. __注意__, 在大多数情况下, 能量文件包含了对所有MD步骤的平均, 或进行平均的点比能量文件中的帧数多很多. 这使得`gmx energy`的统计输出比`.xvg`文件中的数据更准确. 当能量文件中不存在精确的平均值时, 上述统计数据只是简单地对每帧能量数据的平均.

涨落项给出了围绕最小二乘拟合线的RMSD.

如果选择了正确的能量项, 并且使用了该命令行选项`-fluct_props`, 程序可以计算一些涨落相关的性质. 会计算以下性质:

<table id='tab-58'><caption></caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">性质</th>
  <th rowspan="1" colspan="1" style="text-align:center;">需要的能量项</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Enthalpy, Temp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Etot, Temp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Enthalpy, Vol, Temp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Vol, Temp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Vol, Temp</td>
</tr>
</table>

你也需要通过`-nmol`来设定分子的数目. C_p/C_v的计算 __不__ 包含任何量子效应校正. 如果需要考虑量子效应可以使用`gmx dos`程序.

当设置`-viol`选项时, 会绘制时间平均的背离数据, 并重新计算背离的实时时间平均值和瞬时累计值. 此外, 可以利用`-pairs`选项来绘制选定原子对之间的实时时间平均距离和瞬时距离.

选项`-ora`, `-ort`, `-oda`, `-odr`和`-odt`用于分析取向限制数据. 前两个选项绘制取向, 后三个选项绘制来自实验值的取向偏差. 以上选项中以`a`结尾的选项绘制时间平均随限制的变化. 以`t`结尾选项会提示用户限制标签号并绘制数据随时间的变化. 选项`-odr`绘制RMS偏差随限制的变化. 当使用时间或系综平均的取向限制运行时, 选项`-orinst`可以用来分析瞬时, 非系综平均的取向和偏差, 而不是时间和系综平均的值.

选项`-oten`用于绘制每个取向限制实验中分子序张量的特征值. 与选项`-ovec`同用时还可以绘制特征向量.

选项`-odh`用于从`ener.edr`文件中提取并绘制自由能数据(哈密顿差值和/或哈密顿导数dhdl).

使用`-fee`选项会计算体系与理想气体状态时的自由能差值:

$$\D A = A(N,V,T) - A_{idealgas}(N,V,T) = kT \ln(<\exp(U_{pot}/kT)>)$$

$$\D G = G(N,p,T) - G_{idealgas}(N,p,T) = kT \ln(<\exp(U_{pot}/kT)>)$$

其中, $k$ 为玻尔兹曼常数, $T$ 由`-fetemp`设定, 平均对整个系综(或轨迹中的时间)进行. 请注意, 只有当平均是对整个(玻尔兹曼)系综进行并使用势能时, 这种作法在理论上才是正确的. 这允许对熵进行估计:

$$\D S(N,V,T) = S(N,V,T) - S_{idealgas}(N,V,T) = (< U_{pot} > - \D A)/T$$

$$\D S(N,p,T) = S(N,p,T) - S_{idealgas}(N,p,T) = (< U_{pot} > + pV - \D G)/T$$

当指定了第二个能量文件(`-f2`)时, 将计算自由能量差值 $dF = -kT \ln(<\exp(-(E_B-E_A)/kT)>_A)$, 其中 $E_A$ 和 $E_B$ 分布为第一个和第二个能量文件中的能量值, 平均对系综A进行. 自由能差的实时平均值会输出到由`-ravg`指定的文件中. __注意__, 能量必须由同一轨迹计算而来.

<table id='tab-59'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f2 [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">energy.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-viol [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">violaver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pairs [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pairs.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ora [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">orienta.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ort [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">orientt.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oda [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">orideva.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-odr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">oridevr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-odt [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">oridevt.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oten [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">oriten.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-corr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">enecorr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-vis [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">visco.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ravg [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">runavgdf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-odh [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dhdl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-60'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出 .xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fee</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">进行自由能估计</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fetemp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自由能计算的参考温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-zero &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">减去零点能</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sum</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">累加选中的能量项而不是全部展示出来</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]dp</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">以高精度格式输出能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nbmin &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">误差估计的最小块数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nbmax &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">误差估计的最大块数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mutot</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据分量计算总的偶极矩</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">数据点之间跳过的帧数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]aver</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">同时打印能量帧中精确的平均值和RMSD(只计算一项时)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nmol &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">采样的分子数: 能量将除以此值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fluct_props</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">基于能量涨落计算性质, 如热容</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]driftcorr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只用于计算涨落性质. 计算涨落性质前减去观测量的漂移</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fluc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算能量涨落的自相关函数而不是能量自身</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]orinst</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分析瞬时取向数据</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ovec</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与<code>-oten</code>同用时也给出特征向量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0意味着没有): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的开始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的结束时间, -1表示最终</td>
</tr>
</table>

### 补充说明

`gmx energy`可提取`.edr`文件中的能量数据并将结果输出为`.xvg`文件, 一般来说, 命令为:

	gmx energy -f edr_file -o result.xvg

如果加上`-b`, `-e`选项, 可以从具体时间段提取结果而不是全部时间.

如果要编写bash脚本, 可以使用命令管道, 比如提取温度:

	echo "temperature" | gmx energy -f npt.edr -o temperature.xvg

`gmx energy`的分析项目有以下这些方面

	Select the terms you want from the following list by
	selecting either (part of) the name or the number or a combination.
	End your selection with an empty line or a zero.
	-------------------------------------------------------------------
	  1  Angle            2  Proper-Dih.      3  Ryckaert-Bell.   4  LJ-14
	  5  Coulomb-14       6  LJ-(SR)          7  LJ-(LR)          8  Coulomb-(SR)
	  9  Coul.-recip.    10  Potential       11  Kinetic-En.     12  Total-Energy
	 13  Temperature     14  Pressure        15  Constr.-rmsd    16  Box-X
	 17  Box-Y           18  Box-Z           19  Volume          20  Density
	 21  pV              22  Enthalpy        23  Vir-XX          24  Vir-XY
	 25  Vir-XZ          26  Vir-YX          27  Vir-YY          28  Vir-YZ
	 29  Vir-ZX          30  Vir-ZY          31  Vir-ZZ          32  Pres-XX
	 33  Pres-XY         34  Pres-XZ         35  Pres-YX         36  Pres-YY
	 37  Pres-YZ         38  Pres-ZX         39  Pres-ZY         40  Pres-ZZ
	 41  #Surf*SurfTen   42  Mu-X            43  Mu-Y            44  Mu-Z
	 45  T-DRG           46  T-OIL           47  T-SOL           48  Lamb-DRG
	 49  Lamb-OIL        50  Lamb-SOL

常用的一些如下:

- `Potential` 体系势能
- `Total-Energy` 体系总能量, 包括势能与动能, 动能项目为Kinetic-En
- `Temperature` 温度
- `Pressure` 体系平均压强
- `Density` 体系平均密度
- `Pres-XX` X方向压强
- `Pres-YY` Y方向压强
- `Pres-ZZ` Z方向压强
- `#Surf*SurfTen` 表面或界面张力

`gmx energy`用于得到体系的各个能量, 一般跑完MD之后, 使用`gmx energy`处理`ener.edr`只能得到体系的各个能量项. 但如果想求体系中两个不同部分在模拟过程中的相互作用能, 那就要使用一些小窍门. 以下是实现的一种方法:

1. 根据原来的`.tpr`文件建立一个新`.tpr`, 在新的`.tpr`中, 使用索引文件明确定义感兴趣的组.
2. 使用`gmx mdrun`的`-rerun`选项指定原来的轨迹文件再跑一次模拟, 这个过程很快. 如果还想更快, 可以使用`gmx trjconv`把水分子去掉. 这一个重复的模拟也产生轨迹文件, 重要的是, 还会产生一个新的`ener.edr`文件, 这个文件中包含了`.tpr`文件中定义的各个组能量及相互作用能(库伦相互作用能, 范德华相互作用能等).
3. 使用`gmx energy`把各个能量项提出来

## gmx filter: 轨迹频率滤波, 用于制作平滑的动画(翻译: 李继存)

	gmx filter [-f [<.xtc/.trr/...>]]` [-s [<.tpr/.tpb/...>]]` [-n [<.ndx>]]
			   [-ol [<.xtc/.trr/...>]]` [-oh [<.xtc/.trr/...>]]` [-nice ]
			   [-b ]` [-e ]` [-dt ]` [-[no]w]` [-nf ]
			   [-[no]all]` [-[no]nojump]` [-[no]fit]

`gmx filter`用于对轨迹进行频率滤波. 滤波器的形状为从-A到+A的cos(π t/A) + 1, 其中A为选项`-nf`与输入文件中时间步的乘积. 对低通滤波, 滤波器可将周期为A的涨落降低85%, 周期为2*A的降低50%, 周期为3*A的降低17%. 程序可输出低通和高通滤波后的轨迹.

选项`-ol`输出低通滤波后的轨迹, 每`-nf`输入帧输出一次. 滤波器长度与输出间隔的比值保证了可很好地抑制高频运动的混淆, 这非常有利于制作平滑的电影. 此外, 对与坐标有线性关系的性质, 其平均值会保持不变, 因为所有输入帧在输出中的权重都是相同的. 当需要所有帧时, 可使用`-all`选项.

选项`-oh`输出高通滤波后的轨迹. 高通滤波后的坐标会加到结构文件中的坐标上. 当使用高通滤波时, 请使用`-fit`选项或保证所用轨迹已经叠合到结构文件中的坐标.

<table id='tab-61'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ol [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">lowpass.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">highpass.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
</table>

<table id='tab-62'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nf &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置低通滤波的滤波器长度以及输出间距</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]all</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出所有低通滤波后的帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]nojump</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除穿越盒子的原子跳跃</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fit</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将所有帧叠合到参考结构</td>
</tr>
</table>

## gmx freevolume: 计算自由体积(翻译: 姜山)

	gmx freevolume [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				   [-o [<.xvg>]] [-b ] [-e ] [-dt ] [-tu ]
				   [-xvg ] [-[no]rmpbc] [-sf ] [-selrpos ]
				   [-select ] [-radius ] [-seed ]
				   [-ninsert ]

`gmx freevolume`用于计算一个盒子中的自由体积及其与时间的函数关系, 输出自由体积所占总体积的比例. 程序会尝试将一个指定半径的探针插入模拟盒子中, 如果探针与任何原子之间的距离小于两个原子的范德华半径之和, 就认为这个位置已被占据, 即非自由. 通过利用半径为0的探针, 可以计算出真实的自由体积. 通过利用较大半径的探针, 如0.14 nm, 大致对应于水分子的半径, 可计算对应于指定大小假想粒子的自由体积. 然而, 值得注意的是, 由于将原子视为硬球, 这些数字是非常近似的, 通常只有相对变化才有意义, 例如进行不同温度下的一系列模拟.

通过选择指定的组来用于描述非自由体积. 单位体积的插入数目对结果的收敛影响很大. 使用大约1000/nm^3^的值可得到总的标准偏差, 这是由轨迹的涨落决定而不是由随机数的涨落决定的.

所得结果非常依赖于范德华半径; 我们推荐使用Bondi(1964)给出的数值.

一些作者喜欢使用部分自由体积(FFV, Fractional Free Volume), 它的值为1-1.3*(1-Free Volume). 此值会显示在终端上.

<table id='tab-63'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入轨迹或单个构型: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入结构: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">额外的索引组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">freevolume.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算的自由体积</td>
</tr>
</table>

<table id='tab-64'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绘图格式: none, xmgrace, xmgr</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmpbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使每帧中的分子保持完整</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-sf &lt;file></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用文件提供选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-selrpos &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atom</td>
  <td rowspan="1" colspan="1" style="text-align:left;">选择参考位置: atom, res_com, res_cog, mol_com, mol_cog, <br/>whole_res_com, whole_res_cog, whole_mol_com, whole_mol_cog, <br/>part_res_com, part_res_cog, part_mol_com, part_mol_cog, <br/>dyn_res_com, dyn_res_cog, dyn_mol_com, dyn_mol_cog</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-select &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用选区</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-radius &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">插入探针的半径(单位nm, 使用0可得到真正的自由体积)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机数产生器的种子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ninsert &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对轨迹中的每一帧, 每立方nm探针尝试插入的次数</td>
</tr>
</table>

## gmx gangle: 计算角度(翻译: 杨宇)

	gmx gangle [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-oav [<.xvg>]] [-oall [<.xvg>]] [-oh [<.xvg>]] [-b ]
			   [-e ] [-dt ] [-tu ] [-xvg ] [-[no]rmpbc]
			   [-[no]pbc] [-sf ] [-selrpos ] [-g1 ]
			   [-g2 ] [-binw ] [-group1 ]
			   [-group2 ]

`gmx gangle`计算矢量之间不同类型的角度, 它支持由两个位置定义的矢量, 也支持由三个位置定义的平面的法线. 矢量还可以是z轴或球面的局部法线. 此外, 选项`angle`和`dihedral`可方便地用于计算由三/四个位置定义的键角和二面角.

角度类型通过`-g1`和`-g2`指定. 如果`-g1`为`angle`或`dihedral`, 就不应再指定`-g2`. 在这种情况下, `-group1`应指定一个或多个选择, 并且每个选择应包括位置的三联对或四联对, 它们定义了要计算的角度.

如果`-g1`为`vector`或`plane`, `-group1`指定的选择应包含位置对(`vector`)或位置三元对(`plane`). 对矢量, 位置设置了矢量的端点, 对平面, 三个位置用于计算平面的法向. 在这两种情况下, `-g2`指定要使用的其它矢量(见下文).

使用`-g2 vector`或`-g2 plane`时, `-group2`应指定另一组矢量. `-group1`和`-group2`应指定相同的选择数目. 对其中的一个选项也可以只有一个选择, 在这种情况下, 对其他组中的每个选择会使用相同的选择. 同样, 对`-group1`中的每个选择, 相应的`-group2`中的选择应指定相同数目的矢量或单独一个矢量. 在后一种情况下, 会计算这个单一矢量与其它选择中的每个矢量之间的角度.

使用`-g2 sphnorm`时, `-group2`中的每个选择应指定单一的位置, 它是球的中心. 第二个矢量从中心到由`-group1`指定的位置的中点.

使用`-g2 z`时, 不需要指定`-group2`, 会计算第一个矢量与Z轴正半轴之间的角度.

使用`-g2 t0`时, 不需要指定`-group2`, 会利用第一帧的矢量计算角度.

有三个输出选项: `-oav`会将每一帧的时间与平均角度写入一个xvg文件. `-oall`会输出单独的角度. `-oh`输出角度的直方图. 分格的宽度由`-binw`设置. 对`-oav`和`-oh`, 会计算`-group1`中每个选择的单独平均/直方图.

<table id='tab-65'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入轨迹或单一构型: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入结构: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">额外的索引组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oav [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angaver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">作为时间函数的平均角度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oall [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angles.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">作为时间函数的所有角度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">anghist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">角度的直方图</td>
</tr>
</table>

<table id='tab-66'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间值的单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绘图格式: none, xmgrace, xmgr</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmpbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对每一帧, 使分子保持完整</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时使用周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-sf &lt;file></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用文件提供选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-selrpos &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atom</td>
  <td rowspan="1" colspan="1" style="text-align:left;">选择参考位置: atom, res_com, res_cog, mol_com, mol_cog, <br/>whole_res_com, whole_res_cog, whole_mol_com, whole_mol_cog, <br/>part_res_com, part_res_cog, part_mol_com, part_mol_cog, <br/>dyn_res_com, dyn_res_cog, dyn_mol_com, dyn_mol_cog</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g1 &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angle</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分析类型/第一矢量组: angle, dihedral, vector, plane</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g2 &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">第二向量组的类型: none, vector, plane, t0, z, sphnorm</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-binw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oh</code>的分格宽度, 以度为单位</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-group1 &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">第一个分析/矢量选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-group2 &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">第二个分析/矢量选择</td>
</tr>
</table>

## gmx genconf: 增加"随机"取向的构象(翻译: 李卫星)

	gmx genconf [-f [<.gro/.g96/...>]] [-o [<.gro/.g96/...>]]
				[-trj [<.xtc/.trr/...>]] [-nice ] [-nbox ]
				[-dist ] [-seed ] [-[no]rot] [-[no]shuffle]
				[-[no]sort] [-block ] [-nmolat ] [-maxrot ]
				[-[no]renumber]

`gmx genconf`程序对给定的坐标文件进行简单的堆叠, 就像小孩子玩积木一样. 该程序会根据用户定义的比例(`-nbox`)创建一个网格, 格点间的额外空间由`-dist`指定.

指定`-rot`选项时, 程序不会检查格点上分子之间的重叠. 建议输入文件中的盒子边长至少等于原子坐标与范德华半径之和.

如果给出了可选的轨迹文件, 不会产生构象, 但会从文件中读取构象, 经过适当平移后创建格点.

<table id='tab-67'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-trj [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
</table>

<table id='tab-68'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nbox &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1 1 1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒子数目<br>将分子像堆积木一样堆积起来, 一般按从小到大的顺序定义x y z方向上的分子数, <br/>否则会出现分子间距离较近的情况. 最后分子的个数为x*y*z</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒子间的距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机数发生器的种子, 如果为0, 根据当前时间产生.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rot</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机旋转构象</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]shuffle</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机混洗分子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sort</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据X方向坐标对分子排序</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-block &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据此CPU数将盒子划分为块</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nmolat &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个分子的原子数, 假定从0开始. 如果设置错误, 体系可能完全不对.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxrot &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">180 180 180</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最大的随机转动</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]renumber</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">重新编号残基</td>
</tr>
</table>

### 已知问题

- 程序应允许随机放置格点

## gmx genion: 在能量有利位置加入单原子离子(翻译: 李继存)

	gmx genion [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]] [-o [<.gro/.g96/...>]]
			   [-p [<.top>]] [-nice ] [-np ] [-pname ]
			   [-pq ] [-nn ] [-nname ] [-nq ]
			   [-rmin ] [-seed ] [-conc ] [-[no]neutral]

`gmx genion`用单原子离子随机地取代溶剂分子. 溶剂分子组应该连续, 且所有分子的原子数应该相同. 用户应该将离子添加到拓扑文件中, 或使用`-p`选项自动修改拓扑文件.

在所有力场中, 离子的分子类型, 残基名称和原子名称都是大写的元素名称且不含符号. 分子名称应使用`-pname`或`-nname`给出, 并且拓扑文件的`[ molecules ]`段也要相应地更新, 可以手动更新或使用`-p`选项. 不要使用原子名称!

具有多个电荷态的离子会添加多重度, 不含符号, 只用于非常见态.

对更大的离子, 例如硫酸根, 我们建议使用`gmx insert-molecules`

<table id='tab-69'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp<br>得到这个文件之后, 可以再用它产生tpr文件.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.top</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输入/输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件 <br>在往体系中添加金属离子时, <br/><code>genion</code>会往拓扑文件最后的分子类型中写入添加的离子数, <br/>并修改拓扑文件中体系的原子数.</td>
</tr>
</table>

<table id='tab-70'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-np &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">阳离子的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pname &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">NA</td>
  <td rowspan="1" colspan="1" style="text-align:left;">阳离子的名称</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pq &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">阳离子的电荷</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nn &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">阴离子的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nname &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">CL</td>
  <td rowspan="1" colspan="1" style="text-align:left;">阴离子的名称</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nq &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">阴离子的电荷</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.6</td>
  <td rowspan="1" colspan="1" style="text-align:left;">离子间的最小距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1993</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机数发生器的种子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-conc &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">指定盐的浓度(mol/L). 程序会添加足够多的离子以达到指定的浓度, <br/>浓度根据输入<code>.tpr</code>文件中的盒子体积计算. 覆盖<code>-np</code>和<code>-nn</code>选项.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]neutral</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">此选项会添加足够多的离子以使体系的净电荷为零. 会优先添加这些离子, <br/>然后在添加那些由<code>-np</code>/<code>-nn</code>或<code>-conc</code>指定的离子.</td>
</tr>
</table>

### 已知问题

- 如果你指定了盐的浓度, 不会考虑已有的离子. 为此, 你需要指定要添加的盐的量.

### 补充说明

在给蛋白质添加了水环境之后, 一般要在水环境中添加离子, 使模拟体系更接近真实体系. 如果体系中的蛋白质本身已经带了静电荷, 那么就更要给体系加几个带相反电荷的离子, 使体系处于电中性.

几个常用选项的说明:

- `-np/-nn/-conc`: 带正/负电离子的数目. <br>
	假如想要得到0.1 mol/L的离子浓度到底要加多少离子, 可以自己算一下, 也可以直接使用`-conc`指定离子浓度. 在使用`-conc`时, 建议配合使用`-neutral`, 以便使体系最后处于电中性.
- `-pn/-nn`: 指定正负离子的名称, 比如`NA+`或者`CL-`. <br>
	可以参看GROMACS安装路径`share/gromacs/top/`下面的力场文件中离子使用的名称, 也可以使用新的离子, 但要在力场中定义, 或者把新离子的itp文件使用`include`添加到体系拓扑文件中.
- `-seed`: 随机数种子. <br>
	如果发现添加的离子离蛋白太近(比如说小于0.1 nm), 那么可以指定新的种子.

### 使用范例

	gmx genion -s topol.tpr -o system_ion.pdb -p system.top -np 100 -pname Na -nn 100 -nname Cl

添加100个Na+离子和100个Cl离子, 输出文件为`system_ion.pdb`文件.

## gmx genrestr: 生成索引组的位置限制或距离限制(翻译: 廖华东)

	gmx genrestr [-f [<.gro/.g96/...>]] [-n [<.ndx>]] [-o [<.itp>]]
				 [-of [<.ndx>]] [-nice ] [-fc ] [-freeze ]
				 [-[no]disre] [-disre_dist ] [-disre_frac ]
				 [-disre_up2 ] [-cutoff ] [-[no]constr]

基于`-f`指定的文件内容, `gmx genrestr`为拓扑生成一个`#include`头文件, 其中包含一个原子编号列表以及x, y和z三个方向的力常数. 也可以在命令行中指定单一的各向同性力常数, 而不是给出三个分量.

__警告__: 位置限制是分子内的相互作用, 因此在拓扑文件中它们必须被包含在正确的`[ moleculetype ]`段中. 而`[ position_restraints ]`段中的原子索引必须在相应分子类型的原子索引范围之内. 因为在每个分子类型中原子编号都是从1开始的, 而在`gmx genrestr`命令的输入文件中却是从1开始连续编号, 所以`gmx genrestr`命令只会对第一个分子生成有用的文件. 你可能需要编辑生成的索引文件以删除第一个分子后面的原子, 或构建一个合适的索引组作为`gmx genrestr`的输入.

`-of`选项可生成一个用于冻结原子的索引文件. 在这种情况下, 输入文件必须是`.pdb`文件.

使用`-disre`选项会生成距离限制而非位置限制的半个矩阵. 该矩阵通常用于蛋白质中的C~α~原子, 这样可以维持一个蛋白质的总体构象而不必将其绑定到特定位置(使用位置限制时).

<table id='tab-71'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.itp>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">posre.itp</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑的包含文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">freeze.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-72'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fc &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000 1000 1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">力常数(kJ/mol nm^2^)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-freeze &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果给出<code>-of</code>选项或此选项, 对所有B因子小于选项指定值的原子, <br/>其编号都将被写入一个索引文件.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]disre</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生成所有索引中原子的距离限制矩阵.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-disre_dist &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生成距离限制时围绕真实距离的范围.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-disre_frac &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用作间隔而不是固定距离的距离分数. <br/>如果在此指定的距离分数小于前一选项(<code>-disre_dist</code>)指定的距离, <br/>将使用<code>-disre_dist</code>选项指定的值.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-disre_up2 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">距离限制的上限距离, 在此距离处力将变为常量(参见手册).</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cutoff &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">仅对处于截断半径(nm)内的原子生成距离限制.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]constr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生成约束矩阵而非距离限制. 会生成类型2的约束, 并包含排除.</td>
</tr>
</table>

## gmx grompp: 生成运行输入文件(翻译: 杨旭云)

	gmx grompp [-f [<.mdp>]] [-po [<.mdp>]] [-c [<.gro/.g96/...>]]
			   [-r [<.gro/.g96/...>]] [-rb [<.gro/.g96/...>]] [-n [<.ndx>]]
			   [-p [<.top>]] [-pp [<.top>]] [-o [<.tpr/.tpb/...>]]
			   [-t [<.trr/.cpt/...>]] [-e [<.edr>]] [-imd [<.gro>]]
			   [-ref [<.trr/.cpt/...>]] [-nice ] [-[no]v] [-time ]
			   [-[no]rmvsbds] [-maxwarn ] [-[no]zero] [-[no]renum]

`gmx grompp`(gromacs预处理器)读取分子的拓扑文件, 检查其合理性, 并将拓扑从分子描述拓展到原子描述. 拓扑文件包含了分子类型和分子数目的信息, 预处理器会复制每个需要的分子. 对分子类型的数目没有限制. 键和键角可以转换为约束, 对氢原子和重原子独立进行. 然后读入坐标文件, 如果需要可以由Maxwell分布生成速度. `gmx grompp`还会读取用于`gmx mdrun`的参数(例如, MD的步数, 时间步长和截断)以及其他一些参数, 如NEMD参数. 程序会对这些参数进行校正以使得净加速度为零. 程序最终会生成一个二进制文件, 它可以单独地作为MD程序的输入文件.

`gmx grompp`使用来自拓扑文件的原子名称. 当坐标文件中(选项`-c`)的原子名称与拓扑文件中的不一致时, 会产生警告. 注意, 原子名称与模拟无关, 因为生成相互作用参数只使用了原子类型.

`gmx grompp`使用内置的预处理器来解决包含, 宏等问题. 预处理器支持下面的关键词:

	#ifdef VARIABLE
	#ifndef VARIABLE
	#else
	#endif
	#define VARIABLE
	#undef VARIABLE
	#include "filename"
	#include <filename>

在`.mdp`文件中, 拓扑文件中的这些语句的功能可以通过以下两个选项来模块化：

	define = -DVARIABLE1 -DVARIABLE2
	include = -I/home/john/doe

要了解更多的信息, 可以学习C语言程序的教材. 指定`-pp`选项可以输出预处理的拓扑文件, 这样你就可以验证其内容了.

当使用位置限制时, 可以使用`-r`选项提供一个包含限制坐标的文件, 否则将会使用相对于来自`-c`选项的构象进行限制. 对自由能计算, B拓扑的坐标可使用`-rb`提供, 否则它们将等同于A拓扑的坐标.

起始坐标可以由`-t`提供的轨迹文件中读取. 程序会读取最后一帧的坐标和速度, 除非使用了`-time`选项. 只有当这些信息缺失时才会使用由`-c`提供的文件中的坐标. 注意, 当`.mdp`文件中设置了`gen_vel = yes`时, 不会使用文件中的速度信息. 可以使用选项`-e`提供能量文件, 以读取Nose-Hoover和/或Parrinello-Rahman耦合变量.

`gmx grompp`可用于重启模拟(保持连续), 只需要使用`-t`选项提供一个检查点文件即可. 然而, 如果只是简单地改变运行步数以延长模拟, 使用`gmx convert-tpr`比使用`gmx grompp`更方便. 你只需要使用`-cpi`选项将旧的检查点文件直接提供给`gmx mdrun`即可. 如果想要改变系综或是输出频率等, 建议使用`-t`为`gmx grompp`提供检查点文件, 并使用`-f`提供新的`.mdp`文件.

默认情况下, 所有由构建虚拟位点引入的具有恒定能量的键合相互作用都会被移除. 如果此恒定能量不为零, 将会导致总能量移动. 所有键合相互作用都可以通过关闭`-rmvsbds`来维持. 另外, 所有因虚拟位点构建引入的距离约束都具有恒定能量, 它们都会被移除. 如果仍然存在涉及虚拟位点的任何约束, 将导致致命错误.

为验证运行输入文件, 请注意屏幕上显示的所有警告, 并对必要的警告加以纠正. 此外也需要查看`mdout.mdp`文件的内容, 其中包括注释行以及`gmx grompp`读入的输入信息. 如果有疑问, 你可以使用`-debug`选项启动`gmx grompp`, 这将会生成一个`grompp.log`文件(以及真正的调试信息), 里面包含了更多的信息. 你可以使用`gmx dump`程序查看运行输入文件的内容. `gmx check`可用于比较两个运行输入文件的内容.

`-maxwarn`选项可用于覆盖`gmx grompp`给出的警告, 否则会停止输出. 在某些情况下, 警告无关紧要, 但大多数情况下并非如此. 建议用户在使用这个选项绕过这些警告之前认真阅读并理解输出信息.

<table id='tab-73'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.mdp>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">grompp.mdp</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">包含MD参数的grompp输入文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-po [&lt;.mdp>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mdout.mdp</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">包含MD参数的grompp输入文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rb [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pp [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">processed.top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-t [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-imd [&lt;.gro>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">imdgroup.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Gromos-87格式的坐标文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ref [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotref.trr</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输入/输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
</table>

<table id='tab-74'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出更多信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-time &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">采用此刻的帧或此刻之后的第一帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmvsbds</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除涉及虚拟位点的具有恒定能量的键合相互作用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxwarn &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">处理输入过程中所允许的最大警告数目. 如果非正常使用可能导致体系不稳定.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]zero</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对没有默认值的键合相互作用, 将其参数设置为零, 而不是产生错误.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]renum</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">重新对原子类型进行编号以使原子类型的数目最小</td>
</tr>
</table>

## gmx gyrate: 计算蛋白质的回旋半径(翻译: 黄丽红)

	gmx gyrate [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-o [<.xvg>]] [-acf [<.xvg>]] [-nice ] [-b ]
			   [-e ] [-dt ] [-[no]w] [-xvg ] [-nmol ]
			   [-[no]q] [-[no]p] [-[no]moi] [-nz ] [-acflen ]
			   [-[no]normalize] [-P ] [-fitfn ] [-beginfit ]
			   [-endfit ]

`gmx gyrate`用于计算分子的回旋半径, 分子关于X, Y和Z轴的回旋半径, 并给出它们随时间的变化关系. 计算时会明确地使用原子的质量权重.

将分析组划分为大小相同的几部分后, 可使用`-nmol`选项可以计算多个分子的回旋半径.

使用`-nz`选项可计算沿Z轴方向X-Y切面内的2D回旋半径.

<table id='tab-75'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">gyrate.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">moi-acf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-76'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹读取最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nmol &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的分子数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]q</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用原子电荷的绝对值而不是质量作为权重因子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]p</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算关于主轴的回转半径</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]moi</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算转动惯量(由主轴定义).</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nz &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算2D回转半径时沿Z轴的切片数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直到最终</td>
</tr>
</table>

### 补充说明

蛋白质的回旋半径反映了蛋白质分子的体积和形状. 同一体系的回旋半径越大, 说明体系越膨松.

## gmx h2order: 计算水分子的取向(翻译: 嘉晔, 严立京)

	gmx h2order [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-nm [<.ndx>]]
				[-s [<.tpr/.tpb/...>]] [-o [<.xvg>]] [-nice ] [-b ]
				[-e ] [-dt ] [-[no]w] [-xvg ] [-d ]
				[-sl ]

`gmx h2order`用于计算水分子相对于盒子法向的取向, 确定水分子偶极矩与盒子轴线间夹角的余弦平均值. 计算时盒子被划分为许多切片, 程序会输出每一切片的平均取向. 根据氧原子的位置, 每一时间帧中的每个水分子都被归属到某一切片中. 如果使用了`-nm`选项, 程序将计算水分子偶极与从质心到氧原子的轴线之间的夹角, 而不是偶极与盒子轴线间的夹角.

<table id='tab-77'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nm [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输出文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">order.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-78'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的<code>.xvg</code>, <code>.xpm</code>, <code>.eps</code>以及<code>.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">膜的法线方向: X, Y或Z</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算序参数与盒子长度的函数关系, 将盒子划分为指定数目的切片</td>
</tr>
</table>

### 已知问题

- 程序将整个水分子归属到某一切片时, 是根据索引文件组中的三个原子中的第一个原子. 假定顺序为O, H, H. 名称并不重要, 但顺序很关键. 如果不满足这个要求, 将水分子归属到切片时差异很大.

## gmx hbond: 计算分析氢键(翻译: 杨旭云)

	gmx hbond [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			  [-num [<.xvg>]] [-g [<.log>]] [-ac [<.xvg>]] [-dist [<.xvg>]]
			  [-ang [<.xvg>]] [-hx [<.xvg>]] [-hbn [<.ndx>]] [-hbm [<.xpm>]]
			  [-don [<.xvg>]] [-dan [<.xvg>]] [-life [<.xvg>]]
			  [-nhbdist [<.xvg>]] [-nice ] [-b ] [-e ]
			  [-dt ] [-tu ] [-xvg ] [-a ] [-r ]
			  [-[no]da] [-r2 ] [-abin ] [-rbin ] [-[no]nitacc]
			  [-[no]contact] [-shell ] [-fitstart ] [-fitend ]
			  [-temp ] [-smooth ] [-dump ] [-max_hb ]
			  [-[no]merge] [-acflen ] [-[no]normalize] [-P ]
			  [-fitfn ] [-beginfit ] [-endfit ]

`gmx hbond`用于计算和分析氢键. 氢键是由氢原子-施体-受体所成角度(0为扩展)的截断值与施体-受体之间距离(当使用`-noda`时为氢原子-受体距离)的截断值共同决定的. OH和NH被认作氢键施体, O总是作为氢键受体, N默认为受体, 但可以利用`-nitacc`更改为施体. 哑的氢原子被假定为与前面的第一个非氢原子相连.

你需要指定用于分析的两个组, 它们必须完全相同或者彼此之间无任何重叠. 程序会分析两组间形成的所有氢键.

如果设置了`-shell`, 就需要指定一个额外的索引组, 其中应该只包含一个原子. 在这种情况下, 计算时只会考虑距离这个原子某一壳层距离范围内的原子之间所形成的氢键.

使用选项`-ac`, 会给出氢键的速率常数, 计算时采用Luzar和Chandler(Nature 394, 1996; J. Chem. Phys. 113:23, 2000)的模型或Markovitz和Agmon (J. Chem. Phys 129, 2008)的模型. 如果使用`-contact`选项分析接触动力学, n(t)可以定义为t时刻不处于接触距离r范围内的所有对(对应于`-r2`选项使用默认值0), 或者处于距离r2范围内的所有对(对应于使用`-r2`选项设置第二个截断值). 更多细节和定义请参考上面提到的文献.

	[ selected ]
	20 21 24
	25 26 29
	1 3 6

注意, 三联对需要处于同一行中. 每个原子三联对指定了要分析的氢键, 也要注意计算前不会对原子类型进行核对.

__输出__

- `-num`: 随时间变化的氢键数目
- `-ac`: 对所有氢键存在函数(0或1)的自相关函数进行平均
- `-dist`: 所有氢键的距离分布
- `-ang`: 所有氢键的角度分布
- `-hx`: 随时间变化的n-n+i氢键数目, 其中n和n+i代表残基的数目, i的范围从0到6. 这包括了蛋白螺旋中的n-n+3, n-n+4和n-n+5氢键.
- `-hbn`: 所有选择的组, 选择组中的施体, 氢原子和受体, 所有组中形成氢键的所有原子, 所有参与插入的溶剂原子.
- `-hbm`: 所有帧中所有氢键存在矩阵, 也包含了溶剂插入氢键的信息. 顺序与`-hbn`索引文件中的完全相同.
- `-dan`: 输出分析的每时间帧中氢键施体和受体的数目. 当使用`-shell`时, 这尤其有用.
- `-nhbdist`: 计算每个氢原子的氢键数, 以便将结果与Raman光谱相比较.

注意: 选项`-ac`, `-life`, `-hbn`和`-hbm`需要的内存量正比于所选组中施体的总数目乘上受体的总数目.

<table id='tab-79'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-num [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbnum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbond.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Log文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ac [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbac.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbdist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ang [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbang.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hx [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbhelix.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hbn [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbond.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hbm [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hbmap.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-don [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">donor.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dan [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">danum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-life [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hblife.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nhbdist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nhbdist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-80'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">30</td>
  <td rowspan="1" colspan="1" style="text-align:left;">角度截断值(度, 氢原子-施体-受体)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.35</td>
  <td rowspan="1" colspan="1" style="text-align:left;">半径截断值(nm, X-受体, 见下一选项)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]da</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用施体-受体距离(若为真)或者氢原子-受体距离(若为假)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r2 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">第二半径截断值. 主要与<code>-contact</code>和<code>-ac</code>一起使用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-abin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">角度分布的分格宽度(度)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rbin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.005</td>
  <td rowspan="1" colspan="1" style="text-align:left;">距离分布的分格宽度(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]nitacc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将N原子视为受体</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]contact</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">不查找氢键, 仅查找截断距离内的接触数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-shell &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当>0时, 仅计算在一个粒子周围# nm范围内的氢键</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitstart &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合相关函数的起始时间(ps), 以便获得氢键断裂和形成的正向与反向速率常数. <br/>与<code>-gemfit</code>同用时, 我们建议使用<code>-fitstart 0</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitend &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">60</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合相关函数的终止时间(ps), 以便获得氢键断裂和形成的正向与反向速率常数. (仅与<code>-gemfit</code>同用)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298.15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算氢键断裂和形成对应的吉布斯自由能的温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-smooth &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果>&#61;0, 会对ACF的尾部进行平滑, 平滑时使用指数函数拟合: y &#61; A exp(-x/τ)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dump &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将第一个N氢键的ACF转存到单个的.xvg文件中, 用于调试</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max_hb &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化氢键自相关函数时所用的氢键数目的理论最大值. 在程序估算错误的情况下, 此选项有用.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]merge</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相同施体和受体之间的氢键, 但不同氢原子作为单一氢键进行处理. 主要对ACF重要.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对ACF进行归一化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于ACF的Legendre多项式的阶数(0代表不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相关函数指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相关函数指数拟合的终止时间, -1代表直到最后</td>
</tr>
</table>

### 已知问题

- 用于所选氢键的选项`-sel`有问题, 因此暂时无法使用.

### 补充说明

使用`-hbn`选项时默认输出`hbond.ndx`文件, 其中列出了两个所选组中的氢键受体, 施体, 施体氢和两个组间氢键的Acceptor-Donor-Hydrogen的原子序号.
其中`donors_hydrogens`部分数据格式类似如下:

	1    2    1    3    1    4
	18   19
	56   57

示例所用为CRM1-NES binding domain, 首个残基为GLU, 上面的第一行1所指为N(donor), 之后2, 3, 4为N上所带的H(hydogens). 18, 19也是一样.

## gmx helix: 计算α螺旋结构的基本性质(翻译: 李卫星)

	gmx helix [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]] [-f [<.xtc/.trr/...>]]
			  [-cz [<.gro/.g96/...>]] [-nice ] [-b ] [-e ]
			  [-dt ] [-[no]w] [-r0 ] [-[no]q] [-[no]F] [-[no]db]
			  [-[no]ev] [-ahxstart ] [-ahxend ]

`gmx helix`计算各种类型螺旋的性质. 程序首先会检查多肽段, 找到最长的螺旋部分, 这由氢键和φ/ψ角度确定的. 再将其拟合成一个绕z轴的理想螺旋, 以原点居中. 然后计算以下性质:

1. 螺旋半径(`radius.xvg`输出文件). 这仅仅是二维平面内所有C~α~原子的RMS偏差, 计算方法为sqrt((sum\_i (x\^2(i)+y\^2(i)))/N), 其中N为骨干原子数. 理想螺旋的半径为0.23 nm.
2. 扭转(`twist.xvg`输出文件). 计算每个残基的平均螺旋角. 对α螺旋此值为100度, 对3-10螺旋值会更小, 5-螺旋的值更大.
3. 每个残基的上升量(`rise.xvg`输出文件). 每个残基的螺旋上升量以C~α~原子z坐标的差值表示. 对于理想螺旋此值为0.15 nm
4. 总螺旋长度(`len-ahx.xvg`输出文件). 以nm为单位的总螺旋长度. 其值简单由平均上升量(见上文)乘上螺旋残基数(见下文)计算.
5. 螺旋偶极. 只计算骨干原子的(`dip-ahx.xvg`输出文件).
6. 与理想螺旋的RMS偏差, 仅根据C~α~原子计算(`rms-ahx.xvg`输出文件).
7. 平均C~α~-C~α~二面角(`phi-ahx.xvg`输出文件)
8. 平均φ和ψ角度(`phipsi.xvg`输出文件).
9. 根据Hirst和Brooks方法计算的222 nm处的椭圆度

<table id='tab-81'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cz [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">zconf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
</table>

<table id='tab-82'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r0 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">序列中的第一个残基编号</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]q</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每一步都检查哪一部分序列是螺旋</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]F</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">是否拟合到理想螺旋</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]db</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出调试信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ev</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出新的轨迹文件用于ED</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ahxstart &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">螺旋的第一个残基</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ahxend &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">螺旋的最后一个残基</td>
</tr>
</table>

## gmx helixorient: 计算螺旋内的局部螺距/弯曲/旋转/取向(翻译: 陈辰)

	gmx helixorient [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-n [<.ndx>]]
					[-oaxis [<.dat>]] [-ocenter [<.dat>]] [-orise [<.xvg>]]
					[-oradius [<.xvg>]] [-otwist [<.xvg>]] [-obending [<.xvg>]]
					[-otilt [<.xvg>]] [-orot [<.xvg>]] [-nice ] [-b ]
					[-e ] [-dt ] [-xvg ] [-[no]sidechain]
					[-[no]incremental]

`gmx helixorient`用于计算α螺旋内部平均轴的坐标和方向, C~α~与(可选)侧链原子相对于轴的的方向/向量.

对输入, 你需要指定索引组, 其中的C~α~原子对应于连续残基的α螺旋. 侧链方向需要另一个原子数目相同的索引组, 包括每个残基中代表残基的重原子.

__注意__, 此程序不会对结构进行叠合.

我们需要四个C~α~的坐标来定义α螺旋轴的局部方向.

倾斜/旋转根据欧拉旋转计算, 其中定义的螺旋轴作为x轴方向, 残基/C~α~向量作为y轴方向, z轴方向由它们的叉积确定. 我们使用Y-Z-X次序的欧拉旋转, 这意味着我们 (1) 首先倾斜螺旋轴, (2) 然后使其与残基向量正交, (3) 最终对齐进行旋转. 为便于调试或满足其他用途, 我们在`theta[1-3].xvg`文件中输出了实际的欧拉旋转角.

<table id='tab-83'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oaxis [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">helixaxis.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ocenter [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">center.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-orise [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rise.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oradius [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">radius.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-otwist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">twist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-obending [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bending.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-otilt [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tilt.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-orot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotation.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-84'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sidechain</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算侧链相对于螺旋轴的方向</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]incremental</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算旋转/倾斜的增量而不是总量</td>
</tr>
</table>

## gmx help - 打印帮助信息

## gmx hydorder: 计算给定原子周围的四面体参数(翻译: 王浩博)

	gmx hydorder [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-s [<.tpr/.tpb/...>]]
				 [-o [<.xpm> [...]]] [-or [<.out> [...]]] [-Spect [<.out> [...]]]
				 [-nice ] [-b ] [-e ] [-dt ] [-[no]w]
				 [-d ] [-bw ] [-sgang1 ] [-sgang2 ]
				 [-tblock ] [-nlevel ]

`gmx hydorder`计算一个给定原子周围的四面体序参数, 可同时计算角和距离的序参数. 更多细节请参考 P.-L. Chau and A.J. Hardwick, _Mol. Phys._, 93, (1998), 511-518.

`gmx hydorder`计算盒子内3维网格中的序参数. 当盒子中存在两相时, 用户可以通过指定参数`-sgang1`和`-sgang2`来定义不同时刻分开两相的二维界面(明智地选择这些参数很重要).

<table id='tab-85'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xpm> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">intf.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.out> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">raw.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Spect [&lt;.out> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">intfspect.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件</td>
</tr>
</table>

<table id='tab-86'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">膜的法线方向: z, x, y</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒子网格的分格宽度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sgang1 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相1(体相)中的四面体角参数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sgang2 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相2(体相)中的四面体角参数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tblock &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">进行一次时间块平均所用的帧数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevel &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">2D-XPixMaps中高度的水平数</td>
</tr>
</table>

## gmx insert-molecules: 将分子插入已有空位(翻译: 刘恒江)

	gmx insert-molecules [-f [<.gro/.g96/...>]] [-ci [<.gro/.g96/...>]]
						 [-ip [<.dat>]] [-o [<.gro/.g96/...>]] [-nice ]
						 [-box ] [-nmol ] [-try ] [-seed ]
						 [-radius ] [-scale ] [-dr ] [-rot ]
						 [-[no]allpair]

`gmx insert-molecules`命令可以插入`-nmol`个体系的副本到盒子中, 体系由`-ci`输入文件定义. 插入的分子可以填充由`-f`指定的溶质分子构型中的空位, 或者填充由`-box`指定的空盒子. 同时指定`-f`和`-box`选项等同于`-f`, 但插入前会在溶质周围放置一个新盒子. 该命令运行过程中, 坐标文件中的速度不予考虑.

默认情况下, 插入的位置是随机的(初始随机数种子由`-seed`设置). 程序将会迭代直至将`-nmol`个分子插入盒子中. 对某一位置, 若已存在的任意原子和插入分子任意原子之间的距离小于两个原子范德华半径之和, 则不会插入分子. 程序会读取数据文件(`vdwradii.dat`)中的范德华半径, 并根据`-scale`选项的设置进行缩放. 若不能在数据文件中找到所需的半径值, 相应的原子将通过`-radius`来设定(未缩放)距离.

停止前共进行`-nmol`*`-try`次尝试插入. 若存在一些小的空隙需要填充, 可以增加`-try`的值. `-rot`选项用于指定在尝试插入前是否对插入分子进行随机旋转.

作为替代, 也可以仅将分子插入到`positions.dat`(`-ip`)文件中指定的特定位置. 此文件应包含三列信息(x,y,z), 它们给出了相对于输入分子位置(`-ci`)的偏离位移. 因此, 如果该文件应包含绝对位置, 使用`gmx insert-molecules`命令前必须把分子的中心置于(0, 0, 0)(例如, 使用`gmx editconf -center`). 该文件中以`#`开始的内容为注释, 会被忽略. `-dr`选项定义了插入尝试中允许的最大位移. `-try`和`-rot`以默认模式运行(见上文).

<table id='tab-87'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">protein.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ci [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">spc216.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ip [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">positions.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
</table>

<table id='tab-88'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-box &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒子尺寸(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nmol &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要插入的分子的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-try &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">尝试插入<code>-nmol</code>乘以<code>-try</code>次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1997</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机数发生器的种子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-radius &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.105</td>
  <td rowspan="1" colspan="1" style="text-align:left;">默认的范德华距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-scale &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.57</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于数据文件<code>share/gromacs/top/vdwradii.dat</code>中范德华半径的缩放因子. <br/>对水中的蛋白质, 使用默认值0.57可以得到接近1000 g/l的密度值.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dr &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相对<code>-ip</code>文件中的位置, 在x/y/z方向允许的最大偏离位移</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rot &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xyz</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机旋转插入分子, 可用选项: xyz, z或none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]allpair</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与<code>-ci</code>选项同用时避免近邻搜索过程中的内存泄露. 对大的体系可能会比较慢.</td>
</tr>
</table>

### 已知问题

- 对初始构型所有分子必须保持完整.
- 使用`-ci`选项时, 重复的近邻搜索会占用大量内存, `-allpair`选项可以通过检查所有原子之间的距离来避免这个问题(但对大的体系计算较慢).

### 补充说明

- `-ci`: 为分子特定部位添加水环境, 只在研究的分子部位添加水环境, 这样可以减少原子数, 节省计算时间
- `-seed`: 随机数种子, 添加水分子时, 各个水分子的位置是随机的, 可以改变这个随机数种子使水分子重新分布

## gmx lie: 根据线性组合估计自由能(翻译: 王燕)

	gmx lie [-f [<.edr>]] [-o [<.xvg>]] [-nice ] [-b ] [-e ]
			[-dt ] [-[no]w] [-xvg ] [-Elj ] [-Eqq ]
			[-Clj ] [-Cqq ] [-ligand ]

`gmx lie`基于对非键能的能量分析估算自由能. 程序需要包含Coul-(A-B), LJ-SR(A-B)等能量项的能量文件.

为正确使用`g_lie`, 需要进行两次模拟: 一次是目标分子与受体结合的模拟, 一次是目标分子在水中的模拟. 两者都需要利用`energygrps`以使Coul-SR(A-B), LJ-SR(A-B)等能量项写入`.edr`文件. 水中分子的模拟数据可提供-Elj和-Eqq的合适值.

<table id='tab-89'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">lie.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-90'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Elj &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">配体和溶剂之间的Lennard-Jones相互作用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Eqq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">配体和溶剂之间的库伦相互作用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Clj &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.181</td>
  <td rowspan="1" colspan="1" style="text-align:left;">LIE方程中能量Lennard-Jones分量的系数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Cqq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">LIE方程中能量库伦分量的系数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ligand &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件中配体的名称</td>
</tr>
</table>

## gmx make_edi: 生成主成分动力学抽样的输入文件(翻译: 严立京)

	gmx make_edi [-f [<.trr/.cpt/...>]] [-eig [<.xvg>]] [-s [<.tpr/.tpb/...>]]
				 [-n [<.ndx>]] [-tar [<.gro/.g96/...>]] [-ori [<.gro/.g96/...>]]
				 [-o [<.edi>]] [-nice ] [-xvg ] [-mon ]
				 [-linfix ] [-linacc ] [-radfix ]
				 [-radacc ] [-radcon ] [-flood ]
				 [-outfrq ] [-slope ] [-linstep ]
				 [-accdir ] [-radstep ] [-maxedsteps ]
				 [-eqsteps ] [-deltaF0 ] [-deltaF ]
				 [-tau ] [-Eflnull ] [-T ] [-alpha ]
				 [-[no]restrain] [-[no]hessian] [-[no]harmonic]
				 [-constF ]

`gmx make_edi`用于产生一个主成分动力学(ED, essential dynamics)抽样的输入文件供`gmx mdrun`使用, 产生方法基于来自协方差矩阵(`gmx covar`)或简正模式分析(`gmx nmeig`)的特征向量. 在模拟过程中, ED抽样可用于沿集约坐标(特征向量)操控(生物)大分子的位置. 特别地, 通过促使体系沿这些集约坐标探测新的区域, ED抽样可用于提高MD模拟的抽样效率. 有大量的算法可以驱使体系沿特征向量运动(`-linfix`, `-linacc`, `-radfix`, `-radacc`, `-radcon`), 维持沿确定(系列)坐标的位置固定(`-linfix`), 或者仅仅监测位置在这些坐标上的投影(`-mon`)

参考文献:

- A. Amadei, A.B.M. Linssen, B.L. de Groot, D.M.F. van Aalten and H.J.C. Berendsen; An efficient method for sampling the essential subspace of proteins., _J. Biomol. Struct. Dyn._ 13:615-626 (1996)
- B.L. de Groot, A. Amadei, D.M.F. van Aalten and H.J.C. Berendsen; Towards an exhaustive sampling of the configurational spaces of the two forms of the peptide hormone guanylin, _J. Biomol. Struct. Dyn._ 13 : 741-751 (1996)
- B.L. de Groot, A.Amadei, R.M. Scheek, N.A.J. van Nuland and H.J.C. Berendsen; An extended sampling of the configurational space of HPr from E. coli, _Proteins: Struct. Funct. Gen._ 26: 314-322 (1996)

运行时程序会提示选择一个或者多个索引组, 它们对应于特征向量, 参考结构, 目标位置等.

`-mon`: 监测坐标在选定特征向量上的投影

`-linfix`: 沿选定特征向量进行固定步数的线性扩张

`-linacc`: 沿选定特征向量进行可接受线性扩张. (接受期望方向上的步进, 拒绝其他的)

`-radfix`: 沿选定特征向量进行固定步数的径向扩张.

`-radacc`: 沿选定特征向量进行可接受径向扩张. (接受期望方向上的步进, 拒绝其他的). __注意__: 默认将使用起始MD结构作为第一次径向扩张循环的起点. 如果指定了`-ori`选项, 可以读入一个结构文件定义外部起点.

`-radcon`: 沿选定特征向量进行可接受径向收缩, 收缩指向的目标结构由`-tar`选项指定.

__注意__: 每个特征向量只能选择一次.

`-outfrq`: 将投影等写入`.xvg`文件的频率(以步数为单位)

`-slope`: 可接受径向扩张的最小斜率. 如果半径的瞬时增长率(以nm/step为单位)小于规定数值, 将开始一个新的扩张循环.

`-maxedsteps`: 在开始一个新循环前, 径向扩张中每个循环的最大步数.

并行实现的注意点: 由于ED抽样的"全局性"(集约坐标等), 至少在"蛋白质"方面, 从实现的角度看ED抽样并不太适合并行. 因为并行ED需要一些额外的通讯, 除非运行性能低于不受约束的MD模拟, 尤其是当进程数目很大和/或当ED组包含大量原子时.

同时请注意如果你的ED组包含不止一个蛋白质, 那么`.tpr`文件必须包含ED组的正确PBC表示. 查看一下参考结构的初始RMSD值, 这个数值在模拟一开始就会输出; 如果此数值远远高于期望值, 某个ED分子可能沿盒向量方向平移了几个单位.

`gmx mdrun`程序中所有与ED相关的输出作为时间的函数都写在一个`.xvg`文件中, 输出的间隔步数由`-outfrq`指定.

__注意__, 如果一开始合并了多个`.edi`文件, 在一个模拟中你可以(在不同分子上)施加多个ED约束和洪泛势能. 约束的施加顺序按照它们出现在`.edi`文件中的顺序. 根据`.edi`输入文件中的指定, 对每个ED数据集, 输出文件中可能包含以下内容:

* 分子叠合到参考结构的RMSD值
* 位置在选定特征向量上的投影

__洪泛__

使用`-flood`选项, 你可以指定使用哪个特征向量计算洪泛势能, 它将导致额外的力, 将结构排除出由协方差矩阵描述的某些区域. 如果你使用了`-restrain`选项, 势能将反转, 可以将结构保持在特定区域内.

模拟起始点通常是存储在`eigvec.trr`文件中的平均结构. 使用`-ori`选项, 可以把起始点更改为构象空间中的任意一个位置. 使用`-tau`, `-deltaF0`和`-Eflnull`选项, 你可以控制洪泛的行为. Efl为洪泛强度, 根据自适应洪泛的规则进行更新. Tau为自适应洪泛的时间常数, 大的τ值意味着自适应慢(即增长慢). DeltaF0为经过tau皮秒模拟之后想达到的洪泛强度. 如果想使Efl为常数, 可将`-tau`设置成零.

`-alpha`为控制洪泛势能宽度的经验参数. 当其值为2时, 对于蛋白质洪泛的大多数标准例子都能给出很好的结果. α基本用于考虑抽样的不完整性. 如果进行更多的抽样, 系综宽度将会增大, 这可以通过α>1来模拟. 对限制, α&#lt;1得到的限制势的宽度更小.

洪泛模拟的重新开始: 如果你想重新开始一个已经崩溃的洪泛模拟, 请在输出文件中找到deltaF和Efl的值, 然后手动地将它们分别放入`.edi`文件中DELTA_F0和EFL_NULL中.

<table id='tab-91'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eig [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenval.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tar [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">target.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ori [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">origin.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.edi>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sam.edi</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ED抽样输入</td>
</tr>
</table>

<table id='tab-92'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-mon &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">x投影方向的特征向量索引(如<code>1,2-5,9</code>, 或<code>1-100:10</code>表示1 11 21 31 ... 91)</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-linfix &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">固定增量线性抽样的特征向量索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-linacc &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">可接受线性抽样的特征向量索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-radfix &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">固定增量径向扩张的特征向量索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-radacc &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">可接受径向扩张的特征向量索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-radcon &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">可接受径向收缩的特征向量索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-flood &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">洪泛的特征向量索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-outfrq &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出<code>.xvg</code>文件的频率(单位: 步数)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-slope &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">可接受径向扩张的最小斜率</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-linstep &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">固定增量线性抽样的步长(nm/step) (要放在引号内! 如<code>"1.0 2.3 5.1 -3.1"</code>)</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-accdir &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">可接受线性抽样的方向--只考虑正负号 (要放在引号内! 如<code>"-1 +1 -1.1"</code>)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-radstep &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">固定增量径向扩张的步长(nm/step)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxedsteps &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个循环的最大步数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eqsteps &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">无微扰运行的步数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-deltaF0 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">150</td>
  <td rowspan="1" colspan="1" style="text-align:left;">洪泛模拟中目标失稳能量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-deltaF &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">起始的deltaF使用指定值. 默认为0, 非零值只用于重启模拟</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tau &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相应于deltaF0洪泛强度自适应的耦合常数, 0等于无限大, 也就是洪泛强度为常数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Eflnull &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">洪泛强度的起始值. 洪泛强度会根据自适应洪泛方案进行更新. 使用恒定的洪泛强度时请指定<code>-tau 0</code>.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-T &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">T是温度, 做洪泛模拟需要这个数据</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-alpha &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用alpha^2^缩放高斯洪泛势能的宽度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]restrain</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用反转的洪泛势能, 效果类似准简谐限制势</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]hessian</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">特性向量和特征值来自Hessian矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]harmonic</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将特征值视为弹簧常数</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-constF &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">恒力洪泛: 利用<code>-flood</code>手动设置选定特征向量的力(要放在引号内! 如<code>"1.0 2.3 5.1 -3.1"</code>). <br/>当直接指定力的大小时不需要其他洪泛参数.</td>
</tr>
</table>

## gmx make_ndx: 制作索引文件(翻译: 刘恒江)

	gmx make_ndx [-f [<.gro/.g96/...>]] [-n [<.ndx> [...]]] [-o [<.ndx>]]
				 [-nice ] [-natoms ] [-[no]twin]

几乎每个GROMACS程序都需要使用索引组. 所有程序都可以生成默认的索引组. __只有__ 需要 __特殊__ 索引组的时候, 你才不得不使用`gmx make_ndx`. 一般情况下, 整个体系会有一个默认组, 蛋白质会有九个默认组, 每个其他的残基会有一个默认组.

当没有提供索引文件时, `gmx make_ndx`也会生成这些默认组. 借助命令中的索引编辑器, 你可以选择原子, 残基或链的名称和数目. 如果提供了运行输入文件, 你也可以选择原子类型. 可以使用NOT, AND或OR等逻辑判断词, 你可以将索引组分成链, 残基会原子. 你也可以随意删除或重命名索引组.

在索引编辑器和索引文件中, 原子编号都是从1开始的.

选项`-twin`可以复写所有索引组, 并对其施加`-natoms`的偏移. 在设置计算电生理双层膜时, 这个选项很有用.

<table id='tab-93'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-94'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-natoms &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置原子数(默认从坐标或索引文件中读取)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]twin</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">复写所有索引组并进行<code>-natoms</code>的偏移</td>
</tr>
</table>

### 补充说明

GROMACS的索引文件, 即index文件, 扩展名为`.ndx`, 可使用`make_ndx`程序生成.

索引文件是GROMACS的重要文件, 使用它可以在模拟过程中为所欲为. 举一个简单的例子, 如果想详细了解HIV整合酶切割DNA的反应机理, 使用量子力学方法模拟反应位点的反应过程, 而对其他部位使用一般的分子力学方法进行模拟. 于是我们就面临一个对模拟体系进行分开定义的问题. 在GROMACS中, 我们可以使用索引文件来达到目的. 基本思路是这样的, 在索引文件中, 定义一个独立的组, 这个组包括反应位点附近的所有原子. 在模拟的`.mdp`文件中, 对这个组定义使用量子力学模拟. 对蛋白进行量子力学模拟时, 一般使用洋葱模型. 所谓洋葱模型, 就是对反应位点使用高水平的方法, 对距离反应位点一定半径范围内的, 使用低水平的方法, 然后其他部分使用分子力学方法. 在这种情况下, 就可以在索引文件中定义高水平方法组, 把需要使用高水平方法的原子放到这个组中; 再定义低水平方法组, 指定使用低水平方法的原子.

再举一个例子, 比如说在进行SMD(Steered Molecular Dynamics)时, 要对蛋白膜上的一个原子或者残基施加作用力, 那么可以建立一个索引文件, 在该文件中定义一个组, 把要施力的残基或者原子放到该组中. 然后在相应的文件中就可以使用该组了.

`make_ndx`程序可用来选择原子组(要分析的某些特定原子或残基的ID标签)并创建索引文件. GROMACS已经定义了一些默认的组, 对普通分析可能够用了, 但如果你想进行更深入的分析, 如为了在模拟中固定某些特定的组, 或获得某些组的特殊能量信息, 则需要使用`make_ndx`程序来指定这些组.

运行`make_ndx`后, 可使用`r`选择残基, `a`选择原子, `name`对多组进行改名, 还可以使用`|`表示或运算, `&`表示与运算. 下面是几个简单的例子:

- `r 56`: 选择56号残基
- `r 1 36 37`: 选择不连续的残基
- `r 3-45`: 选择3至45号残基, 使用连接符指定残基标号范围
- `r 3-15 | r 23-67`: 选择3至15, 23至67号残基
- `r 3-15 & 4`: 选择3至15号残基的主干链原子, 在索引文件中, 4号组为默认的主干链.
- `r 1-36 & a C N CA`: 使用包含`&`的命令指定只包含骨架原子的残基范围

新建索引组的默认名称(如`r_1_36_37`)很繁琐, 可以使用`name`命令进行修改. 如`name 15 Terminal`可将组`15`的名称改为`Terminal`.
修改后我们可以使用`v`命令查看名称是否修改成功, 使用`q`命令保存修改并退出.

需要注意的一点就是, 对`make_ndx`的选择, 处理是由左向右依次执行的, `&`和`|`没有优先级别之分.
如`r 1-3 | r 5-9 & CA`会先选择1-3, 5-9号残基, 再从中选择CA原子.

下面是使用示例:

	There are:     0      OTHER residues
	There are:   960    PROTEIN residues
	There are:     0        DNA residues
	Analysing Protein...

	  0 System              : 14571 atoms
	  1 Protein             : 14571 atoms
	  2 Protein-H           :  7479 atoms
	  3 C-alpha             :   960 atoms
	  4 Backbone            :  2880 atoms
	  5 MainChain           :  3844 atoms
	  6 MainChain+Cb        :  4730 atoms
	  7 MainChain+H         :  4744 atoms
	  8 SideChain           :  9827 atoms
	  9 SideChain-H         :  3635 atoms

	nr : group      !   'name' nr name  'splitch' nr   Enter: list groups
	'a': atom       &   'del' nr        'splitres' nr  'l': list residues
	't': atom type  |   'keep' nr       'splitat' nr   'h': help
	'r': residue        'res' nr        'chain' char
	"name": group       'case': case sensitive          'q': save and quit

命令 `r 1 - 355`

	Found 5467 atoms with res.nr. in range 1-355

	 10 r_1-355             :  5467 atoms
	  0 System              : 14571 atoms
	  1 Protein             : 14571 atoms
	  2 Protein-H           :  7479 atoms
	  3 C-alpha             :   960 atoms
	  4 Backbone            :  2880 atoms
	  5 MainChain           :  3844 atoms
	  6 MainChain+Cb        :  4730 atoms
	  7 MainChain+H         :  4744 atoms
	  8 SideChain           :  9827 atoms
	  9 SideChain-H         :  3635 atoms
	 10 r_1-355             :  5467 atoms

命令 <br>
`name 10 SUB_H` <br>
`10 & 2`

	Copied index group 10 'SUB_H'
	Copied index group 2 'Protein-H'
	Merged two groups with AND: 5467 7479 -> 2783

	 11 SUB_H_&_Protein-H   :  2783 atoms

命令 `name 11 SUB_H_HEAVY`

	  0 System              : 14571 atoms
	  1 Protein             : 14571 atoms
	  2 Protein-H           :  7479 atoms
	  3 C-alpha             :   960 atoms
	  4 Backbone            :  2880 atoms
	  5 MainChain           :  3844 atoms
	  6 MainChain+Cb        :  4730 atoms
	  7 MainChain+H         :  4744 atoms
	  8 SideChain           :  9827 atoms
	  9 SideChain-H         :  3635 atoms
	 10 SUB_H               :  5467 atoms
	 11 SUB_H_HEAVY         :  2783 atoms
	 12 SUB_H_BB            :  1065 atoms

命令 `splitch 1`

	Found 4 chains
	1:  5467 atoms (1 to 5467)
	2:  5467 atoms (5468 to 10934)
	3:  1816 atoms (10935 to 12750)
	4:  1821 atoms (12751 to 14571)

命令 `del 5-13`

	  0 System              : 14571 atoms
	  1 Protein             : 14571 atoms
	  2 Protein-H           :  7479 atoms
	  3 C-alpha             :   960 atoms
	  4 Backbone            :  2880 atoms
	  5 SUB_H_BB            :  1065 atoms
	  6 SUB_J_BB            :  1065 atoms
	  7 SUB_M_BB            :   375 atoms
	  8 SUB_L_BB            :   375 atoms

命令 `r 886 905`

	9 r_886_905           :    40 atoms

命令 `splitat 9`

	  0 System              : 14571 atoms
	  1 Protein             : 14571 atoms
	  2 Protein-H           :  7479 atoms
	  3 C-alpha             :   960 atoms
	  4 Backbone            :  2880 atoms
	  5 SUB_H_BB            :  1065 atoms
	  6 SUB_J_BB            :  1065 atoms
	  7 SUB_M_BB            :   375 atoms
	  8 SUB_L_BB            :   375 atoms
	  9 r_886_905           :    40 atoms
	 10 r_886_905_N_13464   :     1 atoms
	 11 r_886_905_H_13465   :     1 atoms
	 ...
	 32 r_886_905_CM_13486  :     1 atoms
	 33 r_886_905_HM1_13487 :     1 atoms
	 34 r_886_905_HM2_13488 :     1 atoms
	 35 r_886_905_HM3_13489 :     1 atoms
	 ...
	 45 r_886_905_CG_13770  :     1 atoms
	 46 r_886_905_OD1_13771 :     1 atoms
	 47 r_886_905_OD2_13772 :     1 atoms
	 48 r_886_905_C_13773   :     1 atoms
	 49 r_886_905_O_13774   :     1 atoms

命令 <br>
`del 9-31` <br>
`del 13 -21` <br>
`del 16-17`

	  0 System              : 14571 atoms
	  1 Protein             : 14571 atoms
	  2 Protein-H           :  7479 atoms
	  3 C-alpha             :   960 atoms
	  4 Backbone            :  2880 atoms
	  5 SUB_H_BB            :  1065 atoms
	  6 SUB_J_BB            :  1065 atoms
	  7 SUB_M_BB            :   375 atoms
	  8 SUB_L_BB            :   375 atoms
	  9 r_886_905_CM_13486  :     1 atoms
	 10 r_886_905_HM1_13487 :     1 atoms
	 11 r_886_905_HM2_13488 :     1 atoms
	 12 r_886_905_HM3_13489 :     1 atoms
	 13 r_886_905_CG_13770  :     1 atoms
	 14 r_886_905_OD1_13771 :     1 atoms
	 15 r_886_905_OD2_13772 :     1 atoms

## gmx mdmat: 计算残基接触映射图(翻译: 陈辰)

	gmx mdmat [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			  [-mean [<.xpm>]] [-frames [<.xpm>]] [-no [<.xvg>]] [-nice ]
			  [-b ] [-e ] [-dt ] [-xvg ] [-t ]
			  [-nlevels ]

`gmx mdmat`创建残基对之间的最小距离构成的矩阵. 使用`-frames`选项时, 可以将这些矩阵按顺序存储下来, 用以查看蛋白质三级结构随着时间的变化. 如果不明智地使用选项, 程序可能会生成非常大的输出文件. 默认只输出对整个轨迹进行平均后的距离矩阵. 同时, 也可以输出整个轨迹中残基间不同原子之间的接触数. 输出文件可以利用`gmx xpm2ps`进行处理以生成PostScript(tm)图.

<table id='tab-95'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mean [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dm.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-frames [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dmf.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-no [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">num.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-96'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-t &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">切断距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">40</td>
  <td rowspan="1" colspan="1" style="text-align:left;">距离的离散水平数</td>
</tr>
</table>

## gmx mdrun: 执行模拟, 简正分析或能量最小化(翻译: 王浩博)

	gmx mdrun [-s [<.tpr/.tpb/...>]] [-o [<.trr/.cpt/...>]] [-x [<.xtc/.tng>]]
			  [-cpi [<.cpt>]] [-cpo [<.cpt>]] [-c [<.gro/.g96/...>]]
			  [-e [<.edr>]] [-g [<.log>]] [-dhdl [<.xvg>]] [-field [<.xvg>]]
			  [-table [<.xvg>]] [-tabletf [<.xvg>]] [-tablep [<.xvg>]]
			  [-tableb [<.xvg>]] [-rerun [<.xtc/.trr/...>]] [-tpi [<.xvg>]]
			  [-tpid [<.xvg>]] [-ei [<.edi>]] [-eo [<.xvg>]] [-devout [<.xvg>]]
			  [-runav [<.xvg>]] [-px [<.xvg>]] [-pf [<.xvg>]] [-ro [<.xvg>]]
			  [-ra [<.log>]] [-rs [<.log>]] [-rt [<.log>]] [-mtx [<.mtx>]]
			  [-dn [<.ndx>]] [-multidir [
		   [...]]] [-membed [<.dat>]]
				   [-mp [<.top>]] [-mn [<.ndx>]] [-if [<.xvg>]] [-swap [<.xvg>]]
				   [-nice ] [-deffnm ] [-xvg ] [-dd ]
				   [-ddorder ] [-npme ] [-nt ] [-ntmpi ]
				   [-ntomp ] [-ntomp_pme ] [-pin ] [-pinoffset ]
				   [-pinstride ] [-gpu_id ] [-[no]ddcheck] [-rdd ]
				   [-rcon ] [-dlb ] [-dds ] [-gcom ]
				   [-nb ] [-nstlist ] [-[no]tunepme] [-[no]testverlet]
				   [-[no]v] [-[no]compact] [-[no]seppot] [-pforce ]
				   [-[no]reprod] [-cpt ] [-[no]cpnum] [-[no]append]
				   [-nsteps ] [-maxh ] [-multi ] [-replex ]
				   [-nex ] [-reseed ]

`gmx mdrun`是GROMACS的主要计算化学引擎. 很显然, 它执行分子动力学模拟, 但它也可以执行随机动力学, 能量最小化, 测试粒子插入或(重新)计算能量. 它还可以进行简正模式分析. 在这种情况下`mdrun`可以根据单一的构象计算Hessian矩阵. 对于通常的简正模式类计算, 请确保所提供的结构已经正确地进行过能量最小化. 可以使用`gmx nmeig`对得到的矩阵进行对角化.

`mdrun`程序读取运行输入文件(`-s`), 如果需要, 它会将拓扑分发给不同的进程号. `mdrun`至少会产生四个输出文件. 单个日志文件(`-g`), 除非使用了`-seppot`选项, 在这种情况下, 每个进程号都会输出一个日志文件. 轨迹文件(`-o`), 包含了坐标, 速度和可选的力. 结构文件(`-c`)包含了最后一步的坐标和速度. 能量文件(`-e`)含有能量, 温度, 压力等, 这些量大都也会在日志文件中输出. 作为可选项, 坐标也可以被写入到压缩轨迹文件中(`-x`).

只有当进行自由能计算时, 才可以使用选项`-dhdl`.

并行运行模拟时, 可以使用两种不同的并行方案: MPI并行和/或OpenMP线程并行. 对使用常规MPI库编译的`mdrun`, MPI并行使用多个处理器; 对使用GROMACS内置的线程MPI库编译的`mdrun`, MPI并行则使用多个线程. 使用OpenMP编译的`mdrun`支持OpenMP线程. 只有Verlet截断方案全面支持OpenMP, 对于(旧的)组方案, 只有PME进程可以使用OpenMP并行. 对上述所有情况, `mdrun`默认会尝试使用所有可用的硬件资源. 使用常规MPI库时, 只有`-ntomp`(与Verlet截断方案一起使用)和`-ntomp_pme`选项可用于控制PME进程中的线程数目. 使用线程MPI时, 还可使用选项`-nt`设置总线程数, 使用`-ntmpi`设置线程MPI的线程数. 也可以使用标准环境变量`OMP_NUM_THREADS`设置`mdrun`使用的OpenMP线程数. 环境变量`GMX_PME_NUM_THREADS`可用于指定PME进程使用的线程数.

需要注意的是, 在许多情况下MPI+OpenMP混合并行要比单独使用其中的一种慢. 然而, 对高并行化使用这种混合并行通常是有益的, 因为它减少了区域的数目和/或MPI进程的数目. (更少或更多的区域可以改进标度行为, 对独立的PME进程, 使用更少的MPI进程可以降低通信成本.) 在单CPU(`-die`)上, 单纯的OpenMP并行通常比单纯的MPI并行更快. 由于目前我们还没有检测硬件拓扑的合适方法, 使用线程MPI编译的`mdrun`只能自动使用单纯的OpenMP并行, 如果你使用的线程数达到4个, 使用英特尔的Nehalem/Westmere处理器时最多可使用12个线程, 使用英特尔的Sandy Bridge或更新的CPU最多可使用16个线程. 否则, 会使用单纯的MPI并行(除非使用GPU, 见下文).

要使用旧的`.tpr`文件快速地测试新的Verlet截断方案, 无论使用CPU还是CPU+GPU, 你都可以使用`-testverlet`选项. 此选项不能用于成品模拟, 因为它会稍微修改势能, 并且还会移除电荷组导致分析困难, 但`.tpr`文件中仍包含电荷组. 对成品模拟, 强烈建议在`.mdp`文件中指定`cutoff-scheme = verlet`.

使用GPU(仅支持Verlet截断方案)时, GPU数应与粒子-粒子进程数匹配, 即不包括单纯的PME进程. 使用线程MPI时, 除非在命令行中设定, MPI线程数将被自动设置为检测到的GPU数. 要使用可用GPU中的一部分, 或手动提供PP进程的GPU映射, 你可以使用`-gpu_id`选项. `-gpu_id`的参数为一串数字(无分隔符), 代表要使用的GPU的设备号. 例如, `02`指定对每个计算节点上的第一和第二个PP进程分别使用GPU 0和2. 要选择计算集群不同节点上的GPU, 可使用环境变量`GMX_GPU_ID`. `GMX_GPU_ID`的格式和`-gpu_id`相同, 区别在于环境变量在不同的计算节点上可以有不同的值. 每个节点上的多个MPI进程可以共享GPU, 这可以通过多次指定GPU的id来实现, 例如, `0011`表示在这个节点上四个进程共享两个GPU. 这种方法对单个或多个模拟都起作用, 并适用于任何形式的MPI.

使用Verlet截断方案和Verlet缓冲容差设置时, 可以使用`-nstlist`选项自由地选择配对列表的更新间隔`nstlist`. `mdrun`随后会调整配对列表的截断以保持精度, 而不是调整`nstlist`. 否则, 默认情况下`mdrun`会尝试增加`.mdp`文件中`nstlist`的设定值以提高性能. 对只使用CPU的模拟, `nstlist`可能增加至20, 对使用GPU的模拟, 可能增加至40. 对中度到高度的并行或快速的GPU, 使用(用户提供)更大的`nstlist`可以得到更好的性能.

当PME计算使用单独的PME进程或GPU时, 两类主要的计算任务, 非键力计算和PME计算, 在不同的计算资源上进行. 如果负载不均衡, 某些资源会有一部分空闲时间. 使用Verlet截断方案时, 负载会自动均衡, 如果PME负载过高的话(但过低时则不会). 这是通过对库仑截断和PME格点间距进行相同的缩放完成的. 在前几百步中程序会尝试各种不同的设置, 然后选择最快的设置用于模拟的其余部分. 这并不影响结果的精确度, 但确实会影响将库仑能分解为粒子和网格的贡献. 可以使用`-notunepme`选项关闭自动调整.

`mdrun`将线程关联(设定附着)到特定的核, 当`mdrun`使用了计算节点上的所有(逻辑)核时, 即便没有使用多线程, 通常也会显著地提高性能. 如果排队系统或OpenMP库已经关联了线程, 我们将不再关联, 即使布局可能是次优的. 如果你想使`mdrun`覆盖一个已经设定的线程关联, 或使用更少的核关联线程, 可以使用`-pin on`. 随着SMT(同步多线程), 如英特尔超线程的出现, 每个物理核心上可以有多个逻辑核心. 选项`-pinstride`可以在逻辑核心上设置步幅以关联连续的线程. 如果没有SMT, 1通常是最好的选择. 使用英特尔超线程, 并使用一半或更少的逻辑核心时, 2是最好的选择, 否则就使用1. 默认值0恰恰如此: 它最大限度地减少每个逻辑核心的线程以优化性能. 如果你想在同一物理节点上运行多个`mdrun`工作, 当使用所有逻辑核心时你应该将`-pinstride`设置为1. 当在相同的物理节点上运行多个`mdrun`(或其它)模拟时, 一些模拟需要从非零核心开始关联, 以避免核心过载; 使用`-pinoffset`你可以设置逻辑核心关联的偏移值.

当使用超过1个进程启动`mdrun`时, 会使用区域分解的并行.

使用区域分解时, 空间分解可以通过`-dd`选项设置. 默认情况下`mdrun`会选择一个好的分解. 只有当体系非常不均匀时, 用户才需要更改此设置. 动态负载平衡由`-dlb`选项设置, 它可以显著地提升性能, 特别是对于非均相体系. 动态负载均衡的唯一缺点是运行不再具有二进制级别的可重现性, 但在大多数情况下, 这并不重要. 由负载失衡导致的性能损失达到5%或以上时, 默认会自动开启动态负载均衡. 对低并行度计算, 这些是区域分解仅有的重要选项. 对高并行度计算, 下面两节中的选项可能是提升性能的重要选项.

当PME与区域分解一起使用时, 可以分配独立的进程只进行PME网格计算; 大约从12个进程开始, 这样计算效率更高, 当使用OpenMP并行时, 需要的线程数可能更少. PME线程数可由选项`-npme`设定, 但不能超过总线程数的一半. 默认情况下, 当总线程数超过16时, `mdrun`会猜测一个PME线程数. 使用GPU时, 不会自动选择使用单独的PME线程, 因为最佳设置在很大程度上取决于硬件的详细信息. 在任何情况下, 你都可能通过优化`-npme`提高性能. 关于此选项的性能统计数据会写到日志文件的结束处. 为了在高并行度下获得良好的负载均衡, PME格点的X和Y尺寸应该能被PME线程数整除(即便不是这样, 模拟也可以正常运行).

本节列出了能够影响区域分解的所有选项.

选项`-rdd`可用于设置计算电荷组之间的键合相互作用时所需要的最大距离. 对于非键截断距离以下的二体键合相互作用, 其通讯总是与非键通讯一起进行. 只有当含有丢失的键合相互作用时, 超过非键截断的原子才进行通讯; 这意味着额外的花销是很小的, 而且几乎与`-rdd`的值无关. 使用动态负载均衡时, `-rdd`选项同时也是区域分解单元晶胞尺寸的下限. 默认情况下, `mdrun`会根据初始的坐标确定`-rdd`, 所选值基于相互作用范围和通讯成本之间的平衡.

当电荷组间的键合相互作用超过了键合截断距离时, `mdrun`会终止运行, 并给出一个错误信息. 对不使用排除的配对相互作用和表格键, 可以使用`-noddcheck`选项关闭此检查.

当存在约束时, 选项`-rcon`也会影响晶胞的大小限制. 由NC约束连接的原子, 其中NC为LINCS的阶数加1, 不应超出最小的晶胞尺寸. 如果发生了这种情况, 程序会给出错误信息, 用户应更改分解或减小LINCS阶数并增加LINCS的迭代次数. 默认情况下`mdrun`会以保守的方式估计P-LINCS所需要的最小晶胞尺寸. 对高并行度的计算, 使用选项`-rcon`来设置P-LINCS所需要的距离, 可能会有帮助.

使用动态负载均衡时, `-dds`选项设置晶胞x, y和/或z方向缩放的最小允许比例. `mdrun`会确保晶胞至少缩放此比例. 这个选项用于自动空间分解(当不使用`-dd`时)以及确定网格脉冲的数量, 进而设置晶胞的最小允许尺寸. 在某些情况下, 可能需要调整`-dds`的值以考虑体系高或低的空间不均匀性.

选项`-gcom`可用于决定每n步只进行一次全局通讯. 当全局通讯步成为瓶颈的时候, 对高并行度的模拟此选项可以提高性能. 对全局控温器和/或控压器, 其温度和/或压力也会每`-gcom`步数更新一次. 默认情况下此选项的值被设为`nstcalcenergy`和`nstlist`中的较小值.

使用`-rerun`选项, 可以(重新)计算一个输入轨迹的的力和能量. 会针对每一帧进行近邻搜索, 除非`nstlist`被设置为零(见`.mdp`文件).

ED(主成分动力学)采样和/或额外的洪泛势可使用`-ei`选项启用, 后面指定一个`.edi`文件. `.edi`文件可以使用`make_edi`工具创建, 或通过WHAT IF程序essdyn菜单中的选项来创建. `mdrun`会产生一个`.xvg`输出文件, 里面包含了位置, 速度, 力在选定的特征向量上的投影.

当在`.mdp`文件中指定了用户自定义的势函数时, 可使用`-table`选项将式化的势函数表格传递给`mdrun`. 该表格文件从当前目录或`GMXLIB`目录中读取. `GMXLIB`目录中有许多预格式化的表格, 如使用普通库仑势的6-8, 6-9, 6-10, 6-11, 6-12 Lennard-Jones势. 当存在对相互作用时, 可使用`-tablep`选项读入对相互作用函数的单独表格.

当拓扑中存在表格键函数时, 可使用`-tableb`选项读入相互作用函数. 对每个不同的表格相互作用类型, 表格文件的名称以不同方式修饰: 文件扩展名之前会追加下划线, 后面跟着一个代表键的`b`, 代表键角的`a`或代表二面角的`d`, 最后是相互作用类型的表格编号.

当`.mdp`文件中指定了牵引时, 选项`-px`和`-pf`可用于输出牵引COM的坐标和力.

使用`-multi`或`-multidir`选项, 可以并行方式模拟多个体系, 输入文件/目录的数目等于体系的数目. `-multidir`选项获取一个目录列表(每个体系一个), 并在其中的每一个目录中运行, 运行时使用的输入/输出文件名, 如由`-s`选项指定的, 是相对于这些目录的. 使用`-multi`选项, 体系编号会追加到运行输入文件与每个输出文件的名称中, 例如`topol.tpr`会变为`topol0.tpr`, `topol1.tpr`等. 每个体系的进程数为总进程数除以体系的数目. 这个选项的一个应用是NMR精修: 当存在距离或取向限制时, 可以对所有体系进行系统平均.

使用`-replex`选项, 每经过给定的步数, 会尝试进行一次副本交换. 副本的数目由`-multi`或`-multidir`选项设置, 如上所述. 所有运行输入文件都应使用不同的耦合温度, 文件的顺序并不重要. 随机数种子由`-reseed`设置. 每次交换后会进行速度缩放和近邻搜索.

最后, 当给出合适的选项时, 可以测试一些试验性的算法. 目前正在考察的是: 极化.

选项`-membed`的功能与原先的`g_membed`相同, 即将蛋白质嵌入到膜中. 数据文件应包含传递给`g_membed`的选项. `-mn`和`-mp`也会应用到.

如果你怀疑模拟是由于原子受力过大而崩溃的, 选项`-pforce`可能对你有用. 使用此选项, 当原子的受力超过一定值时, 其坐标和力会被打印到`stderr`.

包含体系完整状态的检查点会被定期(选项`-cpt`)地写入文件`-cpo`, 除非选项`-cpt`设置为-1. 先前的检查点会备份到`state_prev.cpt`以确保最近的体系状态始终可用, 即使在写入检查点时模拟被终止. 使用`-cpnum`选项会保存所有的检查点文件并追加步数. 通过从由选项`-cpi`指定的文件中读入全部状态, 模拟可以继续进行. 该选项的智能之处在于, 如果没有找到检查点文件, GROMACS就假定这是一个常规运行, 并从`.tpr`文件的第一步开始. 默认情况下, 输出将被追加到现有的输出文件中. 检查点文件中包含了所有输出文件的校验码, 这样你永远不会丢失数据, 即使一些输出文件被修改, 破坏或删除. `-cpi`有三种情景:

* 不存在名称匹配的文件: 写入新的输出文件
* 所有文件都存在, 且名称和校验码与存储在检查点文件中的匹配: 追加文件
* 其他情况下, 不会修改任何文件, 并产生一个致命错误

使用`-noappend`选项, 会打开新的输出文件, 并将模拟部分编号添加到所有输出文件的名称中. 需要注意的是, 在所有情况下检查点文件本身都不会被重命名, 并会被覆盖, 除非它的名称与`-cpo`选项不匹配.

使用检查点时, 输出会追加到先前的输出文件中, 除非使用了`-noappend`选项或不存在任何先前的输出文件(除检查点文件外). 要追加的文件的完整性是通过验证检查点文件中存储的校验码实现的. 这保证了追加文件时不会造成混淆或损坏. 当只有部分先前的输出文件存在时, 会导致致命错误, 并且不会修改旧的输出文件, 也不会打开新的输出文件. 追加得到的结果与单独运行得到的结果相同, 文件内容是二进制相同的, 除非你使用了不同的进程数或动态负载均衡或FFT库使用了计时优化.

使用选项`-maxh`时, 当运行时间超过`-maxh`*0.99小时后, 模拟会终止, 并在第一个近邻搜索步输出检查点文件.

当`mdrun`接收到TERM信号后, 它会将`nsteps`设置为比当前步数多一的值. 当`mdrun`接收到INT信号后(例如, 按下CTRL+C), 会在下一近邻搜索步后停止(下一步的`nstlist = 0`). 在这两种情况下, 所有的常规输出都将被写入到文件中. 当使用MPI运行`mdrun`时, 只要将信号发送到`mdrun`的一个进程就足够了, 此信号不应该被发送到`mpirun`或`mdrun`进程, 因为它们是其他进程的父进程.

交互式分子动力学(IMD)可以通过至少使用三个IMD开关中的一个来激活: `-imdterm`开关允许从分子查看器(如VMD)终止模拟; 使用`-imdwait`, 当没有IMD客户端连接时, `mdrun`会暂停; 可以使用`-imdpull`打开IMD的远程操控. `mdrun`监听的端口可以使用`-imdport`来更改. 如果使用IMD操控, 由`-if`指向的文件中包含了原子索引和力.

当使用MPI启动`mdrun`时, 默认情况下, 不可改变它的优先级.

<table id='tab-97'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-x [&lt;.xtc/.tng>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj_comp.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">压缩轨迹(tng格式或可移植xdr格式)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cpi [&lt;.cpt>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">state.cpt</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cpo [&lt;.cpt>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">state.cpt</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">confout.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">md.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dhdl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dhdl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-field [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">field.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-table [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">table.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tabletf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tabletf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tablep [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tablep.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tableb [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">table.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rerun [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rerun.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tpi [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tpi.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tpid [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tpidist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ei [&lt;.edi>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sam.edi</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ED采用输入</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eo [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">edsam.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-devout [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">deviatie.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-runav [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">runaver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-px [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pullx.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pullf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ro [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotation.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ra [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotangles.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rs [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotslabs.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rt [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rottorque.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mtx [&lt;.mtx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nm.mtx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Hessian矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dn [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dipole.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-multidir [&lt;dir> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rundir</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行路径</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-membed [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">membed.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mp [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">membed.top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mn [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">membed.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-if [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">imdforces.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-swap [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">swapions.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-98'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-deffnm &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">对所有文件选项设置默认的文件名</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dd &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">区域分解格点, 0为优化设置</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ddorder &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">interleave</td>
  <td rowspan="1" colspan="1" style="text-align:left;">DD进行顺序: interleave, pp_pme, cartesian</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-npme &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于PME的独立进程数, -1表示使用猜测值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nt &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启动的总线程数(0表示使用猜测值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntmpi &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启动的线程MPI的线程数(0表示使用猜测值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntomp &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个MPI进程启动的OpenMP线程数(0表示使用猜测值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntomp_pme &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个MPI进程启动的OpenMP线程数(0表示使用猜测值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pin &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">auto</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置线程关联: auto, on, off</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pinoffset &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">关联到核心的逻辑核心的起始编号, 用于避免将不同<code>mdrun</code>实例的线程关联到相同的核心</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pinstride &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">逻辑核心上线程之间的关联距离, 使用0可以最大限度地减少每个物理核心上的线程数</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-gpu_id &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用的GPU设备的ID列表, 指定每个节点上PP进程到GPU的映射</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ddcheck</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用DD时, 检查所有的键合相互作用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rdd &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用DD时键合相互作用的最大距离(单位: nm), 0表示由初始坐标决定</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rcon &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">P-LINCS的最大距离(单位: nm), 0为估计值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dlb &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">auto</td>
  <td rowspan="1" colspan="1" style="text-align:left;">动态负载均衡(使用DD): auto, no, yes</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dds &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.8</td>
  <td rowspan="1" colspan="1" style="text-align:left;">一个处于(0,1)之间的比例, 初始DD晶胞的尺寸会根据此数值的倒数进行放大, <br/>以便能进行动态负载均衡, 且同时保持最小的晶胞尺寸</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-gcom &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全局通讯频率</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nb &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">auto</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算非键相互作用的设备: auto, cpu, gpu, gpu_cpu</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nstlist &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当使用Verlet缓冲容差时, 设置<code>nstlist</code>(0为猜测值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]tunepme</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">优化PP/PME进程间或GPU/CPU间的PME负载</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]testverlet</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">测试Verlet非键方案</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在屏幕上输出更多信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]compact</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出紧凑的日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]seppot</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将每一相互作用类型及进程的V和dVdl项独立地输出到日志文件中</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pforce &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出所有超过此值的力(单位: kJ/mol nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]reprod</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">尝试避免那些会影响二进制可重复性的优化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cpt &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">保存检查点文件的间隔(单位: 分钟)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cpnum</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">编号并保留检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]append</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当从检查点文件开始继续运行时, 将输出追加到先前的文件中, <br/>而不是将模拟部分编号添加到所有文件名中</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nsteps &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置运行步数, 覆盖<code>.mdp</code>文件中的设置</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxh &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间达到设定值的99%后结束运行(单位: 小时)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-multi &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">以并行方式执行多个模拟</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-replex &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用此周期(步数)尝试进行周期性的副本交换</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nex &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个交换间隔执行的随机交换数(一个建议是N^3^). 设置为零或不设置则使用相邻副本交换.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-reseed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">副本交换的种子, -1表示产生种子</td>
</tr>
</table>

## gmx mindist: 计算两组间的最小距离(翻译: 王燕)

	gmx mindist [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-od [<.xvg>]] [-on [<.xvg>]] [-o [<.out>]]
				[-ox [<.xtc/.trr/...>]] [-or [<.xvg>]] [-nice ] [-b ]
				[-e ] [-dt ] [-tu ] [-[no]w] [-xvg ]
				[-[no]matrix] [-[no]max] [-d ] [-[no]group] [-[no]pi]
				[-[no]split] [-ng ] [-[no]pbc] [-[no]respertime]
				[-[no]printresname]

`gmx mindist`用于计算一个组与其他组之间的距离. 程序会将(两组之间任意原子对的)最小距离和给定距离内的接触数输出到两个独立的文件. 使用`-group`选项时, 如果另一组中的一个原子与第一组的多个原子相接触, 接触数只计为1次而不是多次. 使用`-or`选项时, 程序会确定到第一组中每个残基的最小距离, 并给出它与残基编号的函数关系图.

使用`-pi`选项时, 会给出一个组与其周期映象的最小距离. 这可以用于检验蛋白质在模拟中是否可以感受到它的周期映象. 每个方向只考虑一次平移, 共26次平移. 程序也会给出组间的最大距离以及三个盒矢量的长度.

`gmx distance`也可用于计算距离.

<table id='tab-99'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mindist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-on [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">numcont.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.out>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atm-pair.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ox [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mindist.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mindistres.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-100'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]matrix</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算组与组之间距离的半个矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]max</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算最大距离, 而不是最小距离.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.6</td>
  <td rowspan="1" colspan="1" style="text-align:left;">接触距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]group</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算接触数时, 与第一组中多个原子的接触数计为1.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pi</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算与映象间的最小距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]split</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间为零时分割图形</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算到中心组的距离时, 其他组的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时考虑周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]respertime</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当输出与每个残基的距离时, 输出每个时间点的距离.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]printresname</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出残基名称</td>
</tr>
</table>

## gmx mk_angndx: 生成用于gmx angle的索引文件(翻译: 白艳艳)

	gmx mk_angndx [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]] [-nice ]
				  [-type ] [-[no]hyd] [-hq ]

`gmx mk_angndx`命令用于创建索引文件, 以计算角度分布等. 它需要使用一个运行输入文件(`.tpx`)来获得键角, 二面角等的信息.

<table id='tab-101'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angle.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-102'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-type &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">angle</td>
  <td rowspan="1" colspan="1" style="text-align:left;">角度类型: angle, dihedral, improper, ryckaert-bellemans</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]hyd</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">包括质量&lt;1.5的原子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">忽略质量&lt;1.5, 电荷大小小于此值的原子所涉及的角度</td>
</tr>
</table>

## gmx morph: 构象间的线性内插(翻译: 杨宇)

	gmx morph [-f1 [<.gro/.g96/...>]] [-f2 [<.gro/.g96/...>]]
			  [-o [<.xtc/.trr/...>]] [-or [<.xvg>]] [-n [<.ndx>]] [-nice ]
			  [-[no]w] [-xvg ] [-ninterm ] [-first ]
			  [-last ] [-[no]fit]

`gmx morph`对构象进行线性内插以产生中间体构象. 当然这些构象完全是不现实的, 但你可以试着进行证明. 程序的输出形式是通用的轨迹. 中间体的数目由`-ninterm`选项进行控制. `-first`和`-last`选项用于控制插值方式: 0对应于输入结构1, 1对应于输入结构2. 如果指定的`-first` < 0或`-last` > 1, 会根据输入结构x_1到x_2的途径进行外推. 一般来说, 对总共N个中间体, 中间体i的坐标x(i)为:

`x(i) = x_1 + (first+(i/(N-1))*(last-first))*(x_2-x_1)`

最后, 如果指定了`-or`选项, 可以计算相对于两个输入结构的RMSD. 在这种情况下, 可能需要读取索引文件, 用于选择计算RMS的组.

<table id='tab-103'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f1 [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf1.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f2 [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf2.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">晶诶够文件:: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">interm.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rms-interm.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-104'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ninterm &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">11</td>
  <td rowspan="1" colspan="1" style="text-align:left;">中间体数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-first &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对应于第一个产生的结构(0为输入x_1, 见上文)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-last &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对应于最后一个产生的结构(1为输入x_2, 见上文)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fit</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">内插前将第二个结构与第一个结构进行最小二乘叠合</td>
</tr>
</table>

## gmx msd: 计算均方位移(翻译: 赵丙春)

	gmx msd [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			[-o [<.xvg>]] [-mol [<.xvg>]] [-pdb [<.pdb>]] [-nice ]
			[-b ] [-e ] [-tu ] [-[no]w] [-xvg ]
			[-type ] [-lateral ] [-[no]ten] [-ngroup ] [-[no]mw]
			[-[no]rmcomm] [-tpdb ] [-trestart ] [-beginfit ]
			[-endfit ]

`gmx msd`根据一系列初始位置来计算原子的均方位移(MSD, mean square displacement). 这提供了一个利用爱因斯坦关系式计算扩散常数的简易方法. 计算MSD时, 参考点之间的时间可利用`-trestart`选项设置. 将从`-beginfit`到`-endfit`之间的MSD(t)使用最小二乘法拟合为直线(D*t+c), 就可以得到扩散常数(注意, t为到参考点的时间, 而不是模拟时间). 程序会给出扩散常数误差的估计值, 计算时将拟合区间分为两部分, 分别拟合得到扩散系数, 这两个扩散系数的插值就是误差的估计值.

有三个相互排斥的选项来确定不同类型的均方位移: `-type`, `-lateral`和`-ten`. 选项`-ten`对每组输出完整的MSD张量, 输出的顺序是: trace xx yy zz yx zx zy.

如果设置了`-mol`选项, `gmx msd`计算单个分子的MSD(会保持跨过周期性边界的分子完整): 对每一单个分子, 会计算其质心的扩散常数. 所选的索引组会被划分为分子.

默认计算MSD的方法是使用质量加权平均, 可使用`-nomw`取消.

使用`-rmcomm`选项, 可以移除指定组的质心运行. 对于GROMACS输出的轨迹, 通常不需要此选项, 因为`gmx mdrun`通常已经移除了质心运动. 当你使用此选项时, 请确保轨迹文件中保存了整个体系.

扩散系数由MSD的线性回归确定, 不同于D正常的输出, 时间是根据参考点的数目进行加权的, 即, 短的时间权重较高. 此外, 当`-beginfit=-1`时, 拟合从10%处开始, 当`-endfit=-1`时, 拟合结束于90%处. 使用此选项也可以得到精确的误差估计, 它基于单个分子之间的统计. 注意, 只有当MSD在`-beginfit`到`-endfit`之间完全呈线性时, 所得的扩散常数和误差估计才准确.

使用`-pdb`选项可输出一个`.pdb`文件, 其中包含`-tpdb`时刻体系的坐标, B因子的值为分子扩散系数的平方根. 此选项暗含`-mol`选项.

<table id='tab-105'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">msd.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mol [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">diff_mol.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pdb [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">diff_mol.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PDB文件</td>
</tr>
</table>

<table id='tab-106'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-type &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算某一方向的扩散系数: no, x, y, z</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-lateral &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算横向扩散时, 平面的法向: no, x, y, z</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ten</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算完整的张量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ngroup &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算MSD的组数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mw</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算质量加权的MSD</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmcomm</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除质心运动</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tpdb &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于<code>-pdb</code>选项的帧(单位: ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-trestart &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹中重起始点之间的间隔(单位: ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合MSD的起始时间(单位: ps), -1为10%</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合MSD的终止时间(单位: ps), -1为90%</td>
</tr>
</table>

## gmx nmeig: 对角化简正模式分析的Hessian矩阵(翻译: 杨旭云)

	gmx nmeig [-f [<.mtx>]] [-s [<.tpr/.tpb/...>]] [-of [<.xvg>]] [-ol [<.xvg>]]
			  [-os [<.xvg>]] [-qc [<.xvg>]] [-v [<.trr/.cpt/...>]] [-nice ]
			  [-xvg ] [-[no]m] [-first ] [-last ]
			  [-maxspec ] [-T ] [-[no]constr] [-width ]

`gmx nmeig`用于计算(Hessian)矩阵的特征向量/特征值, 矩阵可由`gmx mdrun`计算. 特征向量会被写入一个轨迹文件(`-v`), 其中的第一个结构对应t=0时的结构. 特征向量作为帧写入文件, 其序号作为时间戳. 特征向量可利用`gmx anaeig`进行分析. 使用`gmx nmens`可以根据特征向量生成结构的系综. 当使用质量加权时, 输出之前产生的特征向量会缩放为普通的直角坐标. 在这种情况下, 对标准的直角坐标形式, 它们将不再精确地正交, 但在质量加权时应该正交.

通过`-qcorr`选项提供一个额外的参数文件, 此程序也可用于计算热容和焓的量子校正. 详细情况可以参考GROMACS手册的第一章. 结果包括在给定温度下减去简谐自由度. 总的校正值会显示在终端上. 得到校正结果的推荐方式如下:

	gmx nmeig -s topol.tpr -f nm.mtx -first 7 -last 10000 -T 300 -qc [-constr]

如果在模拟中 __对所有共价键__ 使用了键约束, 应该使用`-constr`选项. 否则, 需要自己分析`quant_corr.xvg`文件.

为了更加灵活, 计算量子校正时, 程序也可以考虑虚拟位点. 当选择`-constr`和`-qc`选项时, 会自动设置`-begin`和`-end`选项. 再次, 如果你认为自己知道怎样做更好, 请检查输出文件`eigenfreq.xvg`.

<table id='tab-107'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.mtx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hessian.mtx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Hessian矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenfreq.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ol [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenval.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-os [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">spectrum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入,可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-qc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">quant_corr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入,可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
</table>

<table id='tab-108'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]m</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对角化之前, 将Hessian矩阵的元素除上所有涉及原子sqrt(mass)的乘积.<br/> '简正'分析应使用此方法.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-first &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">写入的第一个特征向量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-last &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">50</td>
  <td rowspan="1" colspan="1" style="text-align:left;">写入的最后一个特征向量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxspec &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">4000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">谱图中考虑的最高频率(1/cm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-T &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298.15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当使用简正模式计算校正经典模拟结果时, 计算量子热容和焓的温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]constr</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果模拟中使用了约束而简正分析中不使用(这是推荐办法), <br/>计算量子校正时你需要设置此选项</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-width &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当生成谱图时, 高斯峰的宽度(σ)(1/cm)</td>
</tr>
</table>

## gmx nmens: 根据简正模式生成结构系综(翻译: 杨宇)

	gmx nmens [-v [<.trr/.cpt/...>]] [-e [<.xvg>]] [-s [<.tpr/.tpb/...>]]
			  [-n [<.ndx>]] [-o [<.xtc/.trr/...>]] [-nice ] [-xvg ]
			  [-temp ] [-seed ] [-num ] [-first ]
			  [-last ]

`gmx nmens`用于生成一个平均结构周围的系综, 系综处于一组简正模式(特征向量)定义的子空间中. 特征向量被假定是质量加权的. 沿每个特征向量的位置随机地取自方差为kT/特征值的高斯分布.

默认情况下, 特征向量将从7开始, 因为前六个简正模式对应于平动和转动自由度.

<table id='tab-109'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenval.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ensemble.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
</table>

<table id='tab-110'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">温度, 单位K</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">随机数种子, -1表示根据时间和pid产生随机数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-num &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要产生的结构数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-first &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">7</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要使用的第一个特征向量(-1表示所选)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-last &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要使用的最后一个特征向量(-1表示直到最后)</td>
</tr>
</table>

## gmx nmtraj: 根据本征向量生成虚拟振荡轨迹(翻译: 王卓亚)

	gmx nmtraj [-s [<.tpr/.tpb/...>]] [-v [<.trr/.cpt/...>]]
			   [-o [<.xtc/.trr/...>]] [-nice ] [-eignr ]
			   [-phases ] [-temp ] [-amplitude ]
			   [-nframes ]

`gmx nmtraj`根据特征向量产生虚拟的轨迹, 对应于围绕平均结构的简谐直角坐标振荡. 通常应使用质量加权的特征向量, 但你也可以使用非加权的特征向量来生成正交运动. 输出帧为一个覆盖整个周期的轨迹文件, 并且第一帧为平均结构. 如果你将轨迹输出(或转换)为PDB格式, 你可以直接在PyMol软件中观看, 还可以渲染生成逼真的动画. 假定能量均分到所有模式上, 运动振幅可以由特征值和预设温度计算. 为了在PyMol中清晰地显示运动, 你可以通过设定不现实的非常高的温度值来放大振幅. 然而, 要注意对大的振幅, 线性直角坐标位移与质量加权二者都可以导致严重的结构变形, 这只是直角简正模式模型的局限性. 默认选择的特征向量为7, 因为前六个简正模式对应于平动和转动自由度.

<table id='tab-111'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eigenvec.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nmtraj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
</table>

<table id='tab-112'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eignr &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">7</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用的特征向量对应的字符(第一个为1)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-phases &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相位对应的字符(默认为0.0)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">300</td>
  <td rowspan="1" colspan="1" style="text-align:left;">温度 (K)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-amplitude &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.25</td>
  <td rowspan="1" colspan="1" style="text-align:left;">本征值<&#61;0的模式对应的幅度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nframes &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">30</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生成帧的数目</td>
</tr>
</table>

## gmx order: 计算碳末端每个原子的序参量(翻译: 张爱)

	gmx order [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-nr [<.ndx>]]
			  [-s [<.tpr/.tpb/...>]] [-o [<.xvg>]] [-od [<.xvg>]] [-ob [<.pdb>]]
			  [-os [<.xvg>]] [-Sg [<.xvg>]] [-Sk [<.xvg>]] [-Sgsl [<.xvg>]]
			  [-Sksl [<.xvg>]] [-nice ] [-b ] [-e ] [-dt ]
			  [-[no]w] [-xvg ] [-d ] [-sl ] [-[no]szonly]
			  [-[no]unsat] [-[no]permolecule] [-[no]radial] [-[no]calcdist]

`gmx orde`用于计算C末端每个原子的序参量. 对原子i, 会使用连接i-1和i+1的向量与轴线. 索引文件中应只包含用于计算的组, 沿相应酰基链的等价碳原子应处于单独的组中. 索引文件不应包含通用组(如System, Protein), 以避免产生混乱(但这与四面体序参量无关, 它只适用于水).

`gmx orde`可以给出序张量的所有对角线元素, 还可以计算氘代的序参量Scd(默认). 如果使用了`-szonly`选项, 程序只会给出序张量的一个分量(由`-d`选项指定), 并计算每个切片的序参量. 如果不使用`-szonly`选项, 程序会给出序参量的所有对角线元素以及氘代的序参量.

可以确定一个原子周围的四面体序参量, 并计算键角和距离的序参量. 更多细节请参见 P.-L. Chau and A.J. Hardwick, _Mol. Phys._, 93, (1998), 511-518.

<table id='tab-113'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nr [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">order.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr 文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">deuter.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ob [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eiwit.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据库文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-os [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sliced.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Sg [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sg-ang.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Sk [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sk-dist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Sgsl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sg-ang-slice.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-Sksl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sk-dist-slice.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-114'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps and .pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">膜的法线方向: z, x, y</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算序参量与盒子长度的函数关系, 将盒子划分为指定数目的切片</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]szonly</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只给出序张量的Sz元素.(轴方向可用<code>-d</code>定义)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]unsat</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算不饱和碳的序参量. 注意不能将它和常规序参量混合在一起.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]permolecule</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算每个分子的Scd序参量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]radial</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算径向膜法线</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]calcdist</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算到参考位置的距离</td>
</tr>
</table>

## gmx pdb2gmx: 将PDB坐标文件转换为拓扑文件和力场兼容的坐标文件(翻译: 冯佳伟)

	gmx pdb2gmx [-f [<.gro/.g96/...>]] [-o [<.gro/.g96/...>]] [-p [<.top>]]
				[-i [<.itp>]] [-n [<.ndx>]] [-q [<.gro/.g96/...>]] [-nice ]
				[-chainsep ] [-merge ] [-ff ] [-water ]
				[-[no]inter] [-[no]ss] [-[no]ter] [-[no]lys] [-[no]arg]
				[-[no]asp] [-[no]glu] [-[no]gln] [-[no]his] [-angle ]
				[-dist ] [-[no]una] [-[no]ignh] [-[no]missing] [-[no]v]
				[-posrefc ] [-vsite ] [-[no]heavyh] [-[no]deuterate]
				[-[no]chargegrp] [-[no]cmap] [-[no]renum] [-[no]rtpres]

`gmx pdb2gmx`读取一个`.pdb`(或`.gro`)文件和一些数据库文件, 为分子添加氢原子, 生成GROMACS(GROMOS)格式或可选的`.pdb`格式的坐标文件, 并生成一个GROMACS格式的拓扑文件. 对这些文件进行后续处理即可生成运行模拟需要的运行输入文件.

`gmx pdb2gmx`搜索力场时, 会在当前工作目录和GROMACS库目录下的`<forcefield>.ff`子目录中搜寻`forcefiled.itp`文件, 库目录根据可执行文件的路径确定或由环境变量`GMXLIB`指定. 默认情况下, 当程序找到所有可用的`forcefield.itp`文件后, 会提示你选择其中的一个力场. 但你也可以在命令行中使用`-ff`选项指定列表中某一力场的简短名称. 在这种情况下, `gmx pdb2gmx`程序只会搜寻对应的`<forcefield>.ff`目录.

当选择了一种力场后, 程序仅会读取对应力场目录下的所有文件. 如果要修改或添加一个残基类型, 你可以把整个力场目录复制到你的当前工作目录. 如果想增加一个新的蛋白质残基类型, 你需要修改库目录下的`residuetype.dat`文件, 或将整个库目录复制到本地的一个目录中, 修改复制后的`residuetype.dat`文件, 并将环境变量`GMXLIB`设为新的目录. 想了解GROMASC文件类型的更多信息, 请参考手册的第五章.

注意, `.pdb`文件只是一种文件类型, 不一定非得包含蛋白质结构. 只要GROMACS的数据库支持, 任何类型的分子都可以使用`gmx pdb2gmx`进行转换. 如果数据库不支持, 你可以自己添加.

这个程序本身也不是万能的, 它需要读取一系列的数据库文件, 这样才能在残基之间加上特殊的化学键(如Cys-Cys, Heme-His等等). 如果你觉得有必要, 这些都可以手动完成. 当指定了一些选项后, 程序可以提示用户选择蛋白质中的LYS, ASP, GLU, CYS或HIS残基的质子化状态. 对于Lys来说, 可以选择中性(即NZ上有两个质子), 也可以选择质子化的(3个质子, 默认). 对于Asp和Glu可以选择非质子化的(默认)或质子化的. 对于His, 质子可以位于ND1或NE2或前两者之上. 默认情况下, 这些选择会自动完成. 对于His, 是根据最优的氢键构象来进行选择的. 氢键是根据简单的几何准则来定义的, 由分子构型确定. 对要判断的三个原子, 即氢供体, 氢原子, 氢受体, 若氢-供体-受体三者之间的角度小于最大角度值, 并且供体-受体原子之间的距离小于最大距离值, 则认为三个原子之间存在氢键. 最大氢键角度和最大氢键距离分别由`-angle`和`-dist`选项指定.

如果使用了`-ter`选项, 蛋白质N端和C端的质子化状态可以交互式地选择. 默认情况下蛋白质的两端是离子化的(即NH3+和COO-). 对于只有一种残基的蛋白质链, 有些力场可以把它设定为两性分子形式, 但对于多肽链, __不__ 应该使用这些选项. AMBER力场对于蛋白质两端的残基有着自己的独特形式, 与`-ter`选项不兼容. 如果要使用AMBER力场, 你需要在N或C端残基对应的名称前分别加上`N`或`C`, 并保证坐标文件的格式相同. 作为替代方法, 你也可以使用专门的末端残基的名称(如ACE, NME).

处理PDB文件时, 把不同的链分开并不是一件简单的事, 因为用户自己生成的PDB文件中链的组织方式不同, 使用的标记也不同, 有时你确实需要在PDB里面合并由TER标记隔开的两个部分, 比如你需要使用二硫键或距离限制将两条蛋白链连接起来, 或者你的蛋白质上吸附有HEMD基团. 在这种情况下, 多条链需要包含在同一个`[ moleculetype ]`定义中. 为了处理这个问题, `gmx pdb2gmx`可以使用两个独立的选项. 首先, `-chainsep`选项允许你选择何时开始一个新的化学链, 何时为链添加末端. 这可以根据PDB文件中存在的TER记录, 或链序号的改变, 或前两个条件中的一个或两个进行. 你也可以完全交互式地进行选择. 另外一个选项是`-merge`, 它控制添加(或不添加)所有化学末端后, 如何将多条链合并成一条链. 也可以关闭这个选项(不合并), 也可以让所有不含水分子的链都合并到一个分子中, 或交互式的选择.

`gmx pdb2gmx`还会检查`.pdb`文件中的原子占有率, 如果一个原子的占有率不是1, 说明它在结构中的位置还没有很好的确定, 这时`pdb2gmx`会给出警告信息. 若一个`.pdb`文件不是来自X射线晶体衍射确定的结构, 可能所有的占有率都是0. 不管如何, 当使用`pdb2gmx`时, 你必须先验证输入PDB文件的正确性(读PDB文件作者的原始文章!).

处理时, 文件中的原子会使用GROMACS约定进行记录. 如果指定了`-n`选项, 程序会生成一个索引文件, 里面包含了以相同方式记录的一个原子组. 这样你就可以用将GROMOS轨迹和坐标文件转换为GROMOS. 需要注意的是, 有一个限制, 因为记录是在去除输入文件中的氢原子之后, 添加新的氢原子之前生成的, 所以你不应该再使用`-ignh`选项.

`.gro`和`.g96`文件类型不支持识别链的序号, 所以如果你要转换一个含有多条链的`.pdb`文件, 最好使用`-o`选项将结果输出为`.pdb`格式的文件.

`-vsite`选项可以去除氢原子运动和快速的不当二面角运动. 通过将氢原子转换为虚拟位点并固定键角, 即固定它们相对于临近原子的位置, 可以去除键角运动以及面外运动. 此外, 标准氨基酸中芳香环上的所有原子(即PHE, TRP, TYR和HIS)都可以转换为虚拟位点, 从而去除这些环中的快速不当二面角运动. __注意__, 在这种情况下, 所有其他氢原子也会被转换为虚拟位点. 所有被转换为虚拟位点的原子的质量会增加到重原子上.

另外, 你也可以指定`-heavyh`选项, 这样氢原子的质量会增加为原来的4倍, 从而可以减慢二面角的运动. 这种方法也可以用于水分子的氢原子, 以减慢水分子的转动. 应当从键合(重)原子的质量中减去氢原子增加的质量, 以维持体系的总质量不变.

<table id='tab-115'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eiwit.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-i [&lt;.itp>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">posre.itp</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑的包含的文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clean.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-q [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">clean.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
</table>

<table id='tab-116'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-chainsep &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">id_or_ter</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置通过何种方式判断一个新链开始,<br/>可用选项: id_or_ter, id_and_ter, ter, id, interactive</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-merge &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置是否将多条链合并为单个<code>[ moleculetype ]</code>, <br/>可用选项: no, all, interactive</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ff &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">select</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置使用何种力场, 默认交互式地选择. 使用<code>-h</code>查看更多信息.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-water &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">select</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置使用的水分子模型, <br/>可用选项: select, none, spc, spce, tip3p, tip4p, tip5p. <br/>使用这个参数会提前在拓扑文件中添加水分子信息.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]inter</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果开启了这个选项, 接下来的八个选项就会交互式地让用户选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ss</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择二硫键</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ter</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择蛋白末端, 默认带电</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]lys</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择lys赖氨酸类型, 默认带电</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]arg</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择arg精氨酸类型, 默认带电</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]asp</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择asp天冬氨酸类型, 默认带电</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]glu</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择glu谷氨酸类型, 默认带电</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]gln</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择gln谷氨酰胺类型, 默认中性</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]his</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地选择his组胺酸类型, 默认通过检查氢键判断</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-angle &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">135</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置氢键中氢-氢供体-氢受体之间的最小角度, 单位度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置氢键中氢供体-氢受体之间的最大距离, 单位nm</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]una</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将苯丙氨酸, 色氨酸, 酪氨酸中的芳香环设为联合CH原子.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ignh</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">忽略坐标文件中的氢原子. 因为氢原子的命名规则不统一, 有些力场无法识别.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]missing</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当发现坐标文件中的原子有缺失时继续运行, 设置这个选项很危险.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在屏幕上输出更多的信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-posrefc &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">位置限制的力常数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-vsite &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置将哪些原子转变为虚拟位点, 可用选项: none, hydrogens, aromatics</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]heavyh</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将氢原子质量增大一些</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]deuterate</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将氢原子质量更改为2 amu</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]chargegrp</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用<code>.rtp</code>文件中的电荷组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cmap</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用cmap中的扭转(如果在<code>.rtp</code>文件开启)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]renum</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对输出中的残基重新编号以保证编号连续</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rtpres</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用<code>.rtp</code>中的条目名称作为残基名称</td>
</tr>
</table>

## gmx pme_error: 根据给定的输入文件估计使用PME的误差(翻译: 张爱)

	gmx pme_error [-s [<.tpr/.tpb/...>`]] [-o [<.out>`]] [-so [<.tpr/.tpb/...>`]]
				  [-nice ] [-beta ] [-[no]tune] [-self ]
				  [-seed ] [-[no]v]

如果使用sPME算法, `gmx pme_error`可用于估计静电力的误差. `-tune`选项可确定划分参数, 以使得误差在实空间和倒易空间两部分之间均匀分布. 源于粒子自相互作用的那部分误差不易计算. 但是一个较好的近似方法是仅仅使用一部分粒子来计算此项, 这可使用`-self`选项完成.

<table id='tab-117'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.out>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">error.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件类型</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-so [&lt;.tpr/.tpb/...></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tuned.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
</table>

<table id='tab-118'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beta &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果是正值, 用此值覆盖<code>.tpr</code>文件中的<code>ewald_beta</code>值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]tune</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">调整划分参数, 以使得误差在实空间和倒易空间之间均匀分布</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-self &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果处于0到1之间, 只根据这部分带电粒子来确定粒子间的自相互作用误差</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当<code>-self</code>的值处于0.0到1.0之间时, 用于蒙特卡洛算法的随机数种子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">屏幕上输出更多信息</td>
</tr>
</table>

## gmx polystat: 计算聚合物的静态性质(翻译: 杜星)

	gmx polystat [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-n [<.ndx>]]
				 [-o [<.xvg>]] [-v [<.xvg>]] [-p [<.xvg>]] [-i [<.xvg>]]
				 [-nice ] [-b ] [-e ] [-dt ] [-tu ]
				 [-[no]w] [-xvg ] [-[no]mw] [-[no]pc]

`gmx polystat`用于计算聚合物的静态性质与时间的函数关系, 并输出其平均值.

默认情况下, 它会计算聚合物端到端的平均距离与回旋半径. 运行时, 程序需要一个索引组并将其拆分为分子, 然后使用索引组中每个分子的第一个原子和最后一个原子来确定端到端的距离. 程序会输出总的回旋半径, 以及平均回旋张量的三个主分量. `-v`选项用于输出本征向量. `-pc`选项用于输出每个回旋张量的平均本征值. `-i`选项用于输出内部距离的均方值.

`-p`选项用于计算持续长度. 所选索引组中应包含在聚合物主链上连续键合的原子. 持续长度根据索引间距为偶数的键之间的角度的余弦值确定, 不使用奇数间距的键, 因为直聚合物的骨架通常全是反式, 因此只能每两个键对齐一次. 持续长度定义为平均余弦值达到1/e时键的数目, 根据log(<cos>)的线性内插确定.

<table id='tab-119'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">polystat.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-v [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">polyvec.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">persist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-i [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">intdist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-120'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mw</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算质量加权的回旋半径</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出平均本征值</td>
</tr>
</table>

## gmx potential: 计算盒子内的静电势(翻译: 陈珂)

	gmx potential [-f [<.xtc/.trr/...>]] [-n [<.ndx>]] [-s [<.tpr/.tpb/...>]]
				  [-o [<.xvg>]] [-oc [<.xvg>]] [-of [<.xvg>]] [-nice ]
				  [-b ] [-e ] [-dt ] [-[no]w] [-xvg ]
				  [-d ] [-sl ] [-cb ] [-ce ] [-tz ]
				  [-[no]spherical] [-ng ] [-[no]correct]

`gmx potential`用于计算盒子内的静电势. 计算方法是, 首先对每个切片内的电荷进行加和, 再对这个电荷分布积分二次.
计算时不考虑周期性边界条件. 电势参考点取为盒子左边的值. 程序也可以计算球坐标中以r为自变量的静电势, 这是通过计算球形切片的电荷分布并积分二次完成的. `epsilon_r`的值取为1, 但在许多情况下取2更加合适.

<table id='tab-121'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">potential.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">charge.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">field.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-122'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">Z</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将膜的法向取为X, Y或Z轴方向</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">10</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算电势与盒子长度的函数关系, 选项值即划分盒子的切片数.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cb &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">积分时忽略盒子的前指定值个切片</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ce &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">积分时忽略盒子的后指定值个切片</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tz &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">沿盒子方向将所有坐标平移指定的距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]spherical</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算球坐标的各项值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">需要考虑的组的个数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]correct</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">假定组的净电荷为零以提高精确度</td>
</tr>
</table>

### 已知问题

- 积分时忽略一些切片并非必要.

## gmx principal: 计算一组原子的惯性主轴(翻译: 李继存)

	gmx principal [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				  [-a1 [<.xvg>]] [-a2 [<.xvg>]] [-a3 [<.xvg>]] [-om [<.xvg>]]
				  [-nice ] [-b ] [-e ] [-dt ] [-tu ]
				  [-[no]w] [-xvg ] [-[no]foo]

`gmx principal`用于计算一组原子的三个惯性主轴. 注意, 老版本的GROMACS以一种奇怪的转置方式输出数据. 对GROMACS-5.0, 输出文件`paxis1.dat`中包含了每一帧第一(主)轴的x/y/z分量, 同样, `paxis2.dat`中包含中间轴的x/y/z分量, `paxis3.dat`中包含最小轴的x/y/z分量.

<table id='tab-123'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引file</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a1 [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">paxis1.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a2 [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">paxis2.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a3 [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">paxis3.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-om [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">moi.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-124'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]foo</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于避免空数组的哑选项</td>
</tr>
</table>

## gmx protonate: 结构质子化(翻译: 杜星)

	gmx protonate [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-n [<.ndx>]]
				  [-o [<.xtc/.trr/...>]] [-nice ] [-b ] [-e ]
				  [-dt ]

`gmx protonate`读取构象并根据`oplsaa.ff/aminoacids.hdb`文件中的定义添加所有丢失氢原子. 如果仅仅指定`-s`选项, 那么构象将会被质子化, 如果也指定了`-f`选项, 那么程序会从文件中读取构象, 可以是单个构象或者轨迹.

如果提供了一个`.pdb`文件, 那么残基名称可能与GROMACS的命名规则不一致. 在这种情况下, 这些残基很可能不会被正确地质子化.

如果指定了索引文件, 请注意原子数目应当与 __质子化__ 状态相对应.

<table id='tab-125'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">protonated.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr trj gro g96 pdb tng</td>
</tr>
</table>

<table id='tab-126'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
</table>

### 已知问题

- 目前, `-s`选项仅接受`.pdb`文件.

## gmx rama:计算Ramachandran拉式构象图(翻译: 杜星)

	gmx rama [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-o [<.xvg>]]
			 [-nice ] [-b ] [-e ] [-dt ] [-[no]w]
			 [-xvg ]

`gmx rama`可以从你的拓扑文件中选择出φ/ψ(α-碳与酰胺平面交角)二面角的组合, 并且计算它们随时间变化的函数. 使用简单的Unix工具如grep你就可以选出特定残基的数据.

<table id='tab-127'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rama.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-128'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序运行结束查看输出文件: .xvg, .xpm, .eps和.pdb</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
</table>

### 补充说明

拉氏图(Ramachandran图)是通过统计蛋白质结构残基的φ/ψ二面角绘制的, 集中分布在几个角度范围内的区域. 物质都具有自发朝能量最低方向变化的特点, 自然界的蛋白也是, 所以拉氏标准分布图中, 统计分布密集的区域, 对应于蛋白能量低, 稳定的构象, 在这些区域中, 残基侧链彼此间斥力小. 模拟得到的结果如果绝大多数落在这些范围中, 也可以说明具有这样的特征. 但分布另一方面也和残基类型有关, 侧链越小所受的斥力制约越小, 在拉氏图中分布范围越广.

一些可视化软件可以直接给出拉氏图. 在VMD中, 使用`VMD Main`->`Extensions`->`Analysis`->`Ramachandran Plot`即可得到类似下面的拉氏图.

![](/GMX/gmx_rama.png)

## gmx rdf: 计算径向分布函数(翻译: 严立京)

	gmx rdf [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			[-o [<.xvg>]] [-cn [<.xvg>]] [-hq [<.xvg>]] [-nice ] [-b ]
			[-e ] [-dt ] [-[no]w] [-xvg ] [-bin ]
			[-[no]com] [-surf ] [-rdf ] [-[no]pbc] [-[no]norm]
			[-[no]xy] [-cut ] [-ng ] [-fade ]

流体的结构可以通过中子散射或者X射线散射进行研究. 描述流体结构的最常用方法是径向分布函数. 但是, 通过散射实验获得径向分布函数并不容易.

`gmx rdf`可利用几种不同的方法来计算径向分布函数. 通常的方法是计算一个(组)粒子周围的径向分布函数, 其他方法包括计算一组粒子质心周围的径向分布函数(`-com`), 或到最近一组粒子的径向分布函数(`-surf`). 所有这些方法都可以利用`-xy`选项计算围绕与z轴平行的轴的RDF. 使用选项`-surf`时, 不能使用归一化.

选项`-rdf`用来设置要计算RDF的类型. 默认为原子或粒子, 但也可以选择分子或残基的质心或几何中心. 无论哪种情况, 都只会考虑索引组中的原子. 对于分子和/或质心选项, 需要输入文件. 除COM(质心)或COG(几何中心)外, 其他的加权方法目前只能通过提供具有不同质量的输入文件来实现. 参数`-com`与`-surf`也可以与`-rdf`选项一同使用.

如果已经提供了一个输入文件(`-s`), 并且`-rdf`设置为`atom`, 那么在计算RDF的时候, 会考虑到输入文件中定义的排除. 选项`-cut`是另外一种可以避免RDF图中出现分子内峰的方法, 但最好还是将输入文件中的排除数设置得高一些. 比如, 对于苯的拓扑, 将nrexcl设置为5就可以全部消除分子内距离对RDF的贡献. 注意, 在计算时会使用已选组中的所有原子, 还包括那些没有Lennard-Jones相互作用的原子.

选项`-cn`生成RDF累积数, 也就是在r距离范围内的平均粒子数.

<table id='tab-129'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rdf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cn [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rdf_cn.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hq [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">hq.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-130'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps and .pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bin</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.002</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分格宽度(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]com</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相对于第一个组质心的RDF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-surf</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相对于第一组表面的RDF: no, mol, res</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rdf</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atom</td>
  <td rowspan="1" colspan="1" style="text-align:left;">RDF类型: atom, mol_com, mol_cog, res_com, res_cog</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时考虑周期性边界条件(PBC). <br/>如果不使用PBC, 距离的最大值为盒子最长边的三倍.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]norm</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对体积和密度进行归一化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]xy</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用距离的x和y分量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cut</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算时所考虑的最短距离(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算中心组的RDF时, 其周围的次要组的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fade</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从此距离开始, 将使用g'(r) &#61; 1 + [g(r)-1] exp(-(r/fade-1)^2) 对RDF进行变换, <br/>以使RDF曲线光滑地趋向于1, 如果fade设置为0.0, 将不做任何处理.</td>
</tr>
</table>

## gmx rms: 计算与参考结构之间的RMSD及其矩阵(翻译: 王育伟)

	gmx rms [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]]
			[-f2 [<.xtc/.trr/...>]] [-n [<.ndx>]] [-o [<.xvg>]] [-mir [<.xvg>]]
			[-a [<.xvg>]] [-dist [<.xvg>]] [-m [<.xpm>]] [-bin [<.dat>]]
			[-bm [<.xpm>]] [-nice ] [-b ] [-e ] [-dt ]
			[-tu ] [-[no]w] [-xvg ] [-what ] [-[no]pbc]
			[-fit ] [-prev ] [-[no]split] [-skip ] [-skip2 ]
			[-max ] [-min ] [-bmax ] [-bmin ] [-[no]mw]
			[-nlevels ] [-ng ]

`gmx rms`通过计算均方根偏差(RMSD, root mean square deviation), 尺寸无关的ρ相似性参数(`rho`)或标度ρ参数(`rhosc`)来比较两个结构. 请参考Maiorov & Crippen, _Proteins_ __22__, 273 (1995). 可利用`-what`选项来选择计算那个参数.

程序会将轨迹(`-f`)中的每个结构与参考结构进行比较. 参考结构取自结构文件(`-s`).

使用`-mir`选项, 还会与参考结构的镜像进行比较. 这可以作为一个很有用的参考'显著'值. 详见Maiorov & Crippen, _Proteins_ __22__, 273 (1995).

选项`-prev`会对当前帧的结构与前面指定帧中的结构进行比较.

选项`-m`将生成一个`.xpm`格式的矩阵, 其值为轨迹中所有结构彼此之间的比较值. 这个矩阵文件可以使用如`xv`之类的程序进查看, 也可以使用`gmx xpm2ps`将其转换为postscript格式.

选项`-fit`控制结构彼此之间的最小二乘叠合: 完全叠合(旋转和平移), 仅平移, 或不叠合.

选项`-mw`控制是否使用质量加权. 如果你选择了这个选项(默认), 并提供一个有效的`.tpr`文件, 程序会读取`.tpr`文件中的质量, 否则将会从`GMXLIB`目录下的`atommass.dat`文件中获取质量. 对于蛋白质这还可以, 但对于别的分子来说就未必了. 对未知的原子, 会分配默认的质量12.011 amu(碳原子). 你可以通过打开`-debug`选项并检查`log`文件来判断是否这样.

使用`-f2`选项, 程序会从第二个轨迹文件中读取'其他结构', 并生成两个轨迹之间的比较矩阵.

选项`-bin`会对比较矩阵进行二进制转储.

选项`-bm`会产生平均键角偏差的矩阵, 类似`-m`选项. 比较时只会考虑比较组中原子之间的键.

<table id='tab-131'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f2 [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mir [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsdmir.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-a [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">avgrp.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd-dist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-m [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bin [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bm [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bond.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
</table>

<table id='tab-132'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序结束后查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-what &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsd</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构差异类型: rmsd, rho, rhosc</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PBC检查</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fit &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rot+trans</td>
  <td rowspan="1" colspan="1" style="text-align:left;">叠合到参考结构: rot+trans, translation, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-prev &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">和前面的帧进行比较</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]split</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在时间为0的地方分割图</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每nr帧写入矩阵一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip2 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每nr帧写入矩阵一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">比较矩阵的最大水平</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-min &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">比较矩阵的最小水平</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">键角矩阵的最大水平</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">键角矩阵的最小水平</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mw</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">重叠部分使用质量权重</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">80</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵的水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算RMS的组数</td>
</tr>
</table>

## gmx rmsdist: 计算-2, -3或-6次平均的原子对距离(翻译: 冯佳伟)

	gmx rmsdist [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-equiv [<.dat>]] [-o [<.xvg>]] [-rms [<.xpm>]] [-scl [<.xpm>]]
				[-mean [<.xpm>]] [-nmr3 [<.xpm>]] [-nmr6 [<.xpm>]]
				[-noe [<.dat>]] [-nice ] [-b ] [-e ]
				[-dt ] [-[no]w] [-xvg ] [-nlevels ]
				[-max ] [-[no]sumh] [-[no]pbc]

`gmx rmsdist`用于计算原子距离的根均方偏差(RMSD, root mean square deviation). 该程序的优势在于计算时不需要叠合, 而`gmx rms`计算标准RMSD时则需要叠合. 参考结构取自结构文件, t时刻的RMSD定义为参考结构与t时刻结构原子对之间距离差值的RMS.

`gmx rmsdist`也可用于生成RMS距离的矩阵, 使用平均距离标度的RMS距离矩阵, 平均距离矩阵, NMR平均距离矩阵(1/r^3和1/r^6平均). 最终, 程序可以生成一个原子对的列表, 其中包含所有1/r^3和1/r^6平均距离小于最大距离(`-max`指定, 默认为0.6)的原子对. 默认情况下, 平均是对等价氢原子(以*[123]命名的所有氢原子三联对)进行的. 此外, 还可以提供其他等价原子的列表(`-equiv`), 列表中每行包含一组等价原子, 使用残基序号, 残基名称, 原子名字指定, 如:

	HB* 3 SER HB1 3 SER HB2

残基名称和原子名称必须与结构文件中的精确匹配, 包括大小写. 程序没有规定如何指定非连续的原子.

<table id='tab-133'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-equiv [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">equiv.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">distrmsd.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rms [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsdist.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-scl [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsscale.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mean [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsmean.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nmr3 [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nmr3.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nmr6 [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nmr6.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-noe [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">noe.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
</table>

<table id='tab-134'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序运行结束查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">40</td>
  <td rowspan="1" colspan="1" style="text-align:left;">离散化RMS的水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵中的最大水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sumh</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对等价氢原子进行平均</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时使用周期性边界条件</td>
</tr>
</table>

## gmx rmsf: 计算原子涨落(翻译: 杨旭云)

	gmx rmsf [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-q [<.pdb>]] [-oq [<.pdb>]] [-ox [<.pdb>]] [-o [<.xvg>]]
			 [-od [<.xvg>]] [-oc [<.xvg>]] [-dir [<.log>]] [-nice ]
			 [-b ] [-e ] [-dt ] [-[no]w] [-xvg ]
			 [-[no]res] [-[no]aniso] [-[no]fit]

`gmx rmsf`计算轨迹(使用`-f`提供)中原子位置的根均方涨落(RMSF, root mean square fluctuation, 即标准偏差), 计算前可以先将构型与参考帧(使用`-s`提供)的构型进行叠合(并非必须).

使用选项`-oq`时会将RMSF值转换为B因子值, 并将其与坐标一起写入`.pdb`文件中, 其中坐标来自结构文件, 或是由`-q`指定的`.pdb`文件. 选项`-ox`会将B因子与平均坐标写入文件中.

使用选项`-od`时会计算相对于参考结构的根均方偏差.

使用选项`-aniso`时, `gmx rmsf`将会计算各项异性温度因子, 还会输出平均坐标和含有ANISOU记录的`.pdb`文件(对应于`-oq`或`-ox`选项). 注意, U值与取向有关, 因此在与实验数据对比之前请确认已经与实验坐标进行了叠合.

当传递给程序一个`.pdb`文件, 并且设置了`-aniso`选项时, 如果`.pdb`文件中含有任何各向异性温度因子, 将会创建Uij的相关图.

使用选项`-dir`时会对平均MSF(3x3)矩阵进行对角化. 这可用于显示原子在哪个方向上涨落最大, 哪个方向上涨落最小.

<table id='tab-135'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹文件: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-q [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">eiwit.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据信息文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oq [&lt;.pdb>] (bfac.pdb)</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bfac.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据信息文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ox [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xaver.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蛋白质数据信息文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr 文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-od [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsdev.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">correl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dir [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rmsf.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Log文件</td>
</tr>
</table>

<table id='tab-136'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出文件 .xvg, .xpm, .eps和.pdb</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]res</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算每个残基的均值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]aniso</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算各向异性温度因子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fit</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算RMSF之前进行最小二乘叠合. 如果不使用这个选项, 你必须确保参考结构与轨迹匹配.</td>
</tr>
</table>

## gmx rotacf: 计算分子的转动相关函数(翻译: 韩广超)

	gmx rotacf [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-o [<.xvg>]] [-nice ] [-b ] [-e ] [-dt ]
			   [-[no]w] [-xvg ] [-[no]d] [-[no]aver] [-acflen ]
			   [-[no]normalize] [-P ] [-fitfn ] [-beginfit ]
			   [-endfit ]

`gmx rotacf`用于计算分子的旋转相关函数. 必须在索引文件中给出原子三联对(i,j,k), 它们定义了ij和jk两个向量. 旋转ACF根据向量n = ij x jk, 即两个向量叉积的自相关函数计算得到. 由于三个原子可张成一个平面, 因此三个原子的顺序并不重要. 作为可选, 通过使用`-d`选项, 并在索引文件中指定原子对(i,j), 你可以计算线性分子的旋转相关函数.

示例:

`gmx rotacf -P 1 -nparm 2 -fft -n index -o rotacf-x-P1 -fa expfit-x-P1 -beginfit 2.5 -endfit 20.0`

上面的命令将利用索引文件中定义的向量间的夹角的一阶勒让德多项式计算旋转相关函数, 并根据2.5 ps到20.0 ps的数据, 将相关函数拟合为双参数指数形式.

<table id='tab-137'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotacf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-138'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]d</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算相关函数时使用索引双联对(向量)而不是三联对(平面)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]aver</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对所有分子进行平均</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对ACF进行归一化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于ACF的Legendre多项式的阶数(0代表不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erffit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相关函数指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相关函数指数拟合的终止时间, -1代表直到最后</td>
</tr>
</table>

## gmx rotmat: 计算叠合到参考结构的旋转矩阵(翻译: 李继存)

	gmx rotmat [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-o [<.xvg>]] [-nice ] [-b ] [-e ] [-dt ]
			   [-[no]w] [-xvg ] [-ref ] [-skip ] [-[no]fitxy]
			   [-[no]mw]

`gmx rotmat`用于输出将一个构象最小二乘叠合到参考构象所需要的旋转矩阵, 参考构象由`-s`选项提供. 叠合前会移除平动自由度. 输出为三个向量, 给出了 参考构象x, y和z方向的新的方向, 例如, (zx,zy,zz)为轨迹帧中参考z轴的取向.

此工具对于某些情况可能有用, 例如, 确定界面处分子的取向, 可能在轨迹中, 由`gmx trjconv -fit rotxy+transxy`移除在x-y平面内的旋转.

`-ref`选项可用于确定叠合的参考结构, 而不是使用来自`-s`的结构. 程序会使用到所有其他结构的RMSD总和最小的结构作为参考结构. 由于此过程的计算代价与帧数的平方根成正比, 使用`-skip`选项可能有帮助. 程序可以进行完全叠合或只进行x-y平面内的叠合.

使用选项`-fitxy`时, 在确定旋转矩阵前会先在x-y平面进行叠合.

<table id='tab-139'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotmat.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-140'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的<code>.xvg</code>, <code>.xpm</code>, <code>.eps</code>以及<code>.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ref &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">确定最优参考结构的方式: none, xyz, xy</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对<code>-ref</code>每n帧使用一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fitxy</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">确定旋转前先叠合x/y旋转</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mw</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用质量加权叠合</td>
</tr>
</table>

## gmx saltbr: 计算盐桥(翻译: 罗健)

	gmx saltbr [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-nice ]
			   [-b ] [-e ] [-dt ] [-t ] [-[no]sep]

`gmx saltbr`用于计算带电组所有组合之间的距离随时间的变化, 这些组可以不同的方式进行组合. 可给出一个最小距离(也即截断距离), 计算时不会考虑距离从未小于此值的组.

程序会输出一些具有固定名称的文件: `min-min.xvg`, `plus-min.xvg`和`plus-plus.xvg`. 如果使用了`-sep`选项, 还会输出单个离子对的文件. 在这种情况下, 文件名格式为`sb-(Resname)(Resnr)-(Atomnr)`. 这种文件的个数 __非常多__.

<table id='tab-141'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/…>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/…>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
</table>

<table id='tab-142'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-t &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">不考虑从未小于此距离的组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]step</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对每个相互作用使用独立的文件(可能会有<strong>很多</strong>).</td>
</tr>
</table>

## gmx sans: 计算小角中子散射谱(翻译: 李耀)

	gmx sans [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-n [<.ndx>]]
			 [-d [<.dat>]] [-pr [<.xvg>]] [-sq [<.xvg>]] [-prframe [<.xvg>]]
			 [-sqframe [<.xvg>]] [-nice ] [-b ] [-e ]
			 [-dt ] [-tu ] [-xvg ] [-mode ]
			 [-mcover ] [-[no]pbc] [-startq ] [-endq ]
			 [-qstep ] [-seed ]

`gmx sans`利用Debye公式计算SANS光谱(Small Angle Neutron Scattering, 小角度中子衍射). 目前, 使用时需要提供拓扑文件(因为需要指定每个原子的元素).

参数:

- `-pr`: 计算轨迹平均的归一化g(r)函数
- `-prframe`: 计算每帧的归一化g(r)函数
- `-sq`: 计算轨迹平均的SANS强度曲线
- `-sqframe`: 计算每帧的SANS强度曲线
- `-startq`: 初始q值, 单位1/nm
- `-endq`: 终止q值, 单位1/nm
- `-qstep`: q值的间距

注意: 当使用Debye直接方法时, 计算代价以1/2 * N * (N - 1)增长, 其中N为要研究的原子数目.

警告: 如果指定了`sq`或`pr`选项, 这个工具会产生大量的文件! 可达总帧数的两倍大!

<table id='tab-143'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nsfactor.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pr.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sq [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sq.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-prframe [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">prframe.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sqframe [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sqframe.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-144'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mode &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">direct</td>
  <td rowspan="1" colspan="1" style="text-align:left;">SANS谱的计算模式: direct, mc</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mcover &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">蒙特卡洛覆盖, 应为-1(默认)或者(0, 1]</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时考虑周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-startq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">初始q值(1/nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">终止q值(1/nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-qstep &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.01</td>
  <td rowspan="1" colspan="1" style="text-align:left;">q值递增值(1/nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Monte-Carlo的随机种子</td>
</tr>
</table>

## gmx sasa: 计算溶剂可及表面积(翻译: 白艳艳)

	gmx sasa [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-o [<.xvg>]] [-odg [<.xvg>]] [-or [<.xvg>]] [-oa [<.xvg>]]
			 [-tv [<.xvg>]] [-q [<.pdb>]] [-b ] [-e ] [-dt ]
			 [-tu ] [-xvg ] [-[no]rmpbc] [-[no]pbc] [-sf ]
			 [-selrpos ] [-probe ] [-ndots ] [-[no]prot]
			 [-dgs ] [-surface ] [-output ]

`gmx sasa`用于计算溶剂可及表面积, 所用的算法可参考Eisenhaber F, Lijnzaad P, Argos P, Sander C, Scharf M, _J. Comput. Chem._ 16, 273-284 (1995). 使用`-q`选项时, 还会将产生Connolly表面输出到.pdb文件中, 其中节点以原子表示, 连接最近节点的边作为CONECT记录. `-odg`选项用于估计溶剂化自由能, 估计时根据每单位暴露表面积每原子的溶剂化能进行计算.

此程序需要使用`-surface`选项来指定进行表面积计算的组. 体系内所有的非溶剂原子都包括在内, 并始终计算该组的表面积. 作为可选, `-output`可用于指定额外的选择, 它应该是整个计算组的一部分. 这些组的溶剂可及表面积会从整个表面积中抽取出来.

可使用`-or`和`-oa`选项来计算整个轨迹中每个残基和每个原子表面积的的平均值与标准偏差.

使用`-tv`选项可以计算分子的总体积和密度. 请注意在这种情况下正常的探针半径是否适合, 或者你是否要使用其他值, 如0. 请记住体积和密度的计算结果是非常粗糙的. 例如, 在冰Ih中, 可以很容易地将水分子放于孔道中, 这样得到的体积或过小, 而表面积和密度都过大.

<table id='tab-145'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入轨迹或单个构型: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入结构: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">额外的索引组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">area.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">总表面积随时间的变化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-odg [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dgsolv.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">溶剂化自由能估计值随时间的变化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">resarea.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个残基的平均表面积</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oa [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atomarea.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个原子的平均表面积</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tv [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">volume.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">总体积和密度随时间的变化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-q [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">connolly.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Connolly表面的PDB文件</td>
</tr>
</table>

<table id='tab-146'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绘图格式: none, xmgrace, xmgr</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmpbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">保持每帧中的分子完整</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时使用周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-sf &lt;file></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用文件提供的选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-selrpos &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atom</td>
  <td rowspan="1" colspan="1" style="text-align:left;">选择参考位置: atom, res_com, res_cog, mol_com, mol_cog,<br/> whole_res_com, whole_res_cog, whole_mol_com, whole_mol_cog,  <br/>part_res_com,part_res_cog, part_mol_com, part_mol_cog, <br/>dyn_res_com, dyn_res_cog, dyn_mol_com, dyn_mol_cog</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-probe &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.14</td>
  <td rowspan="1" colspan="1" style="text-align:left;">溶剂探针的半径(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ndots &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">24</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个球面的点数, 点数越多越精确</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]prot</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">同时将蛋白质也输出到<code>Connolly.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dgs &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">单位面积溶剂化自由能的默认值(kJ/mol/nm^2^)</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-surface &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">表面计算选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-output &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出选择</td>
</tr>
</table>

### 补充说明

溶剂可及表面积是描述蛋白质疏水性的重要参数, 氨基酸残基的疏水性是影响蛋白质折叠的重要物理作用.

输出文件`area.xvg`中有四列, 分别代表: 总表面积, 极性表面积, 非极性表面积, 溶剂化自由能. 最后一项是根据原子所属类型来定义的.

## gmx saxs: 计算小角X射线散射谱(翻译: 李继存)

	gmx saxs [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-d [<.dat>]] [-sq [<.xvg>]] [-nice ] [-b ] [-e ]
			 [-dt ] [-xvg ] [-ng ] [-startq ]
			 [-endq ] [-energy ]

`gmx saxs`用于计算给定索引组的SAXS结构因子. 计算基于Cromer方法, 需要拓扑文件和轨迹文件.

<table id='tab-147'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-d [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sfactor.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sq [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sq.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-148'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹读取第一帧的时间(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹读取最后一帧的时间(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">绘制的格式: none, xmgrace, xmgr</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算SAXS时组的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-startq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">起始q值(1/nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endq &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">60</td>
  <td rowspan="1" colspan="1" style="text-align:left;">终止q值(1/nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-energy &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">12</td>
  <td rowspan="1" colspan="1" style="text-align:left;">入射X射线的能量(keV)</td>
</tr>
</table>

## gmx select: 打印选区的通用信息(翻译: 陈珂)

	gmx select [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-os [<.xvg>]] [-oc [<.xvg>]] [-oi [<.dat>]] [-on [<.ndx>]]
			   [-om [<.xvg>]] [-of [<.xvg>]] [-ofpdb [<.pdb>]] [-olt [<.xvg>]]
			   [-b ] [-e ] [-dt ] [-tu ] [-xvg ]
			   [-[no]rmpbc] [-[no]pbc] [-sf ] [-selrpos ]
			   [-select ] [-[no]norm] [-[no]cfnorm] [-resnr ]
			   [-pdbatoms ] [-[no]cumlt]

`gmx select`输出与动态选区相关的基本数据. 它可以用于一些简单分析, 它的输出也可以与其他程序和/或外部分析程序的输出组合起来, 用以计算更复杂的数据. 输出选项可以任意组合, 但需要注意`-om`仅对第一个选区进行操作. 还需要注意, 如果没有提供输出选项, 则不会有任何输出.

使用`-os`时, 会逐帧计算每个选区中的位置(position)数目. 使用`-norm`时, 输出值会介于0和1之间, 代表相对于最大位置数的比例(例如, 对于选区`resname RA and x < 5`, 最大位置数就是RA残基内的原子数). 使用`-cfnorm`时, (`-os`的)输出值则会除以选区覆盖(全局位置数的)比例. `-norm`和`-cfnorm`可以互相独立地指定.

使用`-oc`时, 以时间函数的形式输出每个选区的覆盖比例.

使用`-oi`时, 以时间函数的形式输出选中的原子/残基/分子. 输出中, 第一列是帧时间, 第二列是位置数, 后续列是原子/残基/分子编号. 如果指定的选区数大于1, 则第二组的位置数紧邻第一组的最后一个数字输出, 并以此类推.

使用`-on`时, 会将选中的原子输出为索引文件, 此文件与`make_ndx`和分析工具兼容. 每个选区会输出为一个选区组, 对于动态选区, 每帧都会输出一个组.

要得到残基编号, 可以使用`-resnr`控制`-oi`的输出: `number`(默认)会按照残基在输入文件中的编号输出, 而`index`则会按残基在输入文件中出现的顺序, 从1开始, 赋予残基唯一的编号并输出. 前者更加直观, 但如果输入中含有多个同一编号的残基, 得到的输出就没那么有用了.

使用`-om`时, 以时间函数的形式, 针对第一选区输出一套掩码(mask). 输出中的每一行对应一帧, 为每一个可能被选中的原子/残基/分子赋予0或1的值. 1表示该原子/残基/分子在当前帧中被选中, 0表示未选中.

使用`-of`时, 输出每个位置的占据比例(即该位置被选中的帧所占的比例).

使用`-ofpdb`时, 输出一个PDB文件, 其中占有率列的值是选区中每个原子的占据分数. PDB文件中的坐标则是输入拓扑中的值. `-pdbatoms`可以用来控制哪些原子会出现在输出的PDB文件中: 使用`all`时, 所有原子都会出现; 使用`maxsel`时, 所有可能被选区选中的原子都会出现; 使用`selected`时,  只有在至少一帧中被选中的原子才会出现.

使用`-olt`时, 生成一个直方图, 显示了被选中位置数与某位置持续被选中时间的函数关系. `-cumlt`可以用来控制是否在直方图中包含较长间隔的子间隔.

`-om`, `-of`和`-olt`只有在处理动态选区时才有意义.

<table id='tab-149'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入轨迹或单个构型: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入结构拓扑: tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">额外的索引组</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-os [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">size.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个选区中的位置数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">cfrac.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个选区的覆盖比例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oi [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每个选区所选中的索引</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-on [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">由选区生成的索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-om [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">mask.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">被选中位置的掩码</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">occupancy.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">被选中位置的占据比例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ofpdb [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">occupancy.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">含有被选中位置占据比例的PDB文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-olt [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">lifetime.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生命周期的直方图</td>
</tr>
</table>

<table id='tab-150'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间值的单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: none, xmgrace, xmgr</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]rmpbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">保持每帧中的分子完整</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在距离计算中使用周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-sf &lt;file></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">由文件提供选区</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-selrpos &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">atom</td>
  <td rowspan="1" colspan="1" style="text-align:left;">选区的参考位置: atom,  res_com,  res_cog,  mol_com,  mol_cog, <br/> whole_res_com, whole_res_cog,  whole_mol_com,  whole_mol_cog, <br/>part_res_com,  part_res_cog,  part_mol_com,  part_mol_cog, <br/>dyn_res_com,  dyn_res_cog,  dyn_mol_com,  dyn_mol_cog</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-select &lt;selection></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的选区</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]norm</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启用<code>-os</code>选项时, 用总位置数进行归一化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cfnorm</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启用<code>-os</code>选项时, 用覆盖比例进行归一化</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-resnr &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">number</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启用<code>-oi</code>或<code>-on</code>时, 残基编号的输出类型: number, index</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pdbatoms &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">all</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启用<code>-ofpdb</code>选项时, 要输出的原子: all, maxsel, selected</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cumlt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">启用<code>-olt</code>选项时, 累积计入较长间隔的子间隔</td>
</tr>
</table>

## gmx sham: 根据直方图计算自由能或其他直方图(翻译: 李卫星)

	gmx sham [-f [<.xvg>]] [-ge [<.xvg>]] [-ene [<.xvg>]] [-dist [<.xvg>]]
			 [-histo [<.xvg>]] [-bin [<.ndx>]] [-lp [<.xpm>]] [-ls [<.xpm>]]
			 [-lsh [<.xpm>]] [-lss [<.xpm>]] [-ls3 [<.pdb>]] [-g [<.log>]]
			 [-nice ] [-[no]w] [-xvg ] [-[no]time] [-b ]
			 [-e ] [-ttol ] [-n ] [-[no]d] [-[no]sham]
			 [-tsham ] [-pmin ] [-dim ] [-ngrid ]
			 [-xmin ] [-xmax ] [-pmax ] [-gmax ]
			 [-emin ] [-emax ] [-nlevels ]

`gmx sham`用于计算多维的自由能, 焓和熵. `gmx sham`会读取一个或多个`.xvg`文件并分析数据集. `gmx sham`的基本功能是利用玻尔兹曼反转多维直方图方法(`-lp`选项)计算Gibbs自由能形貌图(`-ls`选项), 但也可用于计算焓(`-lsh`选项)和熵(`-lss`选项)的形貌图. 程序可以给出用户提供的任意量的直方图. 输入文件中的一行可能以时间开头(参看选项`-time`), 后面跟着任意多个y值. 当使用&隔开时(`-n`选项), 可以读入多个数据集, 在这种情况下每行只会读取一个y值. 所有以#和@开头的行都会被忽略.

当系综并非玻尔兹曼系综, 但又需要使用自由能进行偏置时, 可使用`-ge`选项提供一个自由能文件. 对由`-f`选项指定的输入文件中, 每个(多维)数据点需要一个自由能值.

可利用`-ene`选项提供一个能量文件. 在使用Kumar等人提出的单直方图分析方法时, 这些能量可用作权重函数. 如果提供了温度(处于文件中的第二列), 会应用实验的加权方案. 此外, 这些值还会用于计算焓和熵.

可使用选项`-dim`给出距离的维度. 当距离为2维或3维时, 由两个粒子所采样的圆周或表面会随着距离的增加而增加. 依据想要展示的量, 可以选择是否修正直方图和自由能的体积效应. 对2维或3维, 概率可分别利用r或r^2^进行归一化. 可使用-1值来指示两个向量间以度为单位的夹角: 应用角度的正弦进行归一化. __注意__, 对两个向量间的夹角, 内积或余弦是很自然的量, 因为它可以产生相同体积的分格.

<table id='tab-151'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">graph.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ge [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">gibbs.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ene [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">esham.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-histo [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">edist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bin [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bindex.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-lp [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">prob.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ls [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">gibbs.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-lsh [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">enthalpy.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-lss [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">entropy.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ls3 [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">gibbs3.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PDB文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">shamlog.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
</table>

<table id='tab-152'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]time</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入文件中包含时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从数据集中读取的第一帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从数据集中读取的最后一帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ttol &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间的容差, 适宜的单位(通常为ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">读取的数据集的数目, 不同数据集间以只含&的行分隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]d</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用导数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sham</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">不使用能量加权, 即使提供了能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tsham &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298.15</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于单直方图分析的温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最小概率. 小于此值的任何值都设置为零</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dim &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1 1 1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离的维数, 用于体积修正(最多3个值, 维数大于3时将得到和最后的一样的值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ngrid &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">32 32 32</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量形貌的分格数(最多3个值, 维数大于3时将得到和最后的一样的值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xmin &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量形貌图轴的最小值(维数大于3时, 见上)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xmax &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1 1 1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量形貌图轴的最大值(维数大于3时, 见上)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出概率的最大值, 默认为计算值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-gmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出自由能的最大值, 默认为计算值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-emin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出焓的最小值, 默认为计算值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-emax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出焓的最大值, 默认为计算值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">25</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量形貌的水平数</td>
</tr>
</table>

## gmx sigeps: 将C6/12或C6/Cn组合转换为sigma/epsilon组合, 或反过来 (翻译: 韩广超)

	gmx sigeps [-o [<.xvg>]] [-nice ] [-[no]w] [-xvg ] [-c6 ]
			   [-cn ] [-pow ] [-sig ] [-eps ] [-A ]
			   [-B ] [-C ] [-qi ] [-qj ] [-sigfac ]

`gmx sigeps`是一个简单的工具, 可以将C6/C12或C6/Cn组合转换成σ和ε, 或者反过来. 它也可以在文件中绘制出势能. 此外, 它还能把一个Buckingham势近似地转成一个Lennard-Jones势.

<table id='tab-153'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">potje.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-154'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看.xvg, .xpm, .eps和.pdb输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c6 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:left;">C6</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cn &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1e-06</td>
  <td rowspan="1" colspan="1" style="text-align:left;">排斥常数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pow &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">12</td>
  <td rowspan="1" colspan="1" style="text-align:left;">排斥项的次数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sig &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">σ</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eps &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ε</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-A &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Buckingham势的A</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-B &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">32</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Buckingham势的B</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-C &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.001</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Buckingham势的C</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-qi &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">粒子i的电荷qi</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-qj &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">粒子j的电荷qj</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sigfac &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.7</td>
  <td rowspan="1" colspan="1" style="text-align:left;">开始绘制时, σ前的因子</td>
</tr>
</table>

## gmx solvate: 体系溶剂化(翻译: 刘恒江)

	gmx solvate [-cp [<.gro/.g96/..>]] [-cs [<.gro/.g96/…>]]
				[-o [<.gro/.g96/…>]] [-p [<.top>]] [-nice ]
				[-box ] [-radius ] [-scale ] [-shell ]
				[-maxsol ] [-[no]vel]

`gmx solvate`能够完成以下两项任务:

1. 创建一个充满溶剂的盒子. 可以通过指定`-cs`和`-box`选项来完成. 对具有盒子信息但不含原子的结构文件则可以通过指定`-cs`和`-cp`来实现.
2. 将溶质分子, 如蛋白质进行溶剂化, 使其处于溶剂分子的包围之中. `-cp`和`-cs`分别用于指定溶质和溶剂. 不设定`-box`时, 会使用溶质坐标文件(`-cp`)中的盒子信息. 如果你希望将溶质置于盒子的中心, 可以使用`gmx editconf`命令, 它有非常多的选项用于改变盒子的规格和使分子居中. 对某一位置, 若溶质分子中任意原子与溶剂分子中任意原子之间的距离小于这两个原子的范德华半径之和, 则会将溶剂分子从盒子中移除. 程序会读取数据文件(`vdwradii.dat`)中的范德华半径, 并根据`-scale`选项的设置进行缩放. 若不能在数据文件中找到所需的半径值, 相应的原子将通过`-radius`来设定(未缩放)距离.

默认使用的溶剂是简单点电荷水模型(SPC, Simple Point Charge Water), 坐标文件为`$GMXLIB/spc216.gro`. 这些坐标同样可以用于其他的三点水模型, 因为通过短时间的平衡就可以去除这些模型之间的差异. 程序也支持其余的溶剂分子和混合溶剂. 对溶剂类型的唯一限制是一个溶剂分子只包含一种残基. 程序会使用坐标文件中的残基信息, 因此这些信息应保持一定程度的一致性. 实际使用中, 这就意味着坐标文件中两个连续的溶剂分子应该具有不同的残基编号. 溶质盒子是根据坐标文件中的坐标进行堆积构建而成, 这意味着这些坐标应该在周期性边界条件下进行平衡, 以确保分子在堆积界面上具有良好的排列. `-maxsol`选项可以设置加入的最大溶剂分子数, 程序只添加前`-maxsol`个溶剂分子而忽略其余的. 这样在盒子中形成了一部分真空, 这在后面可能会引起一些问题. 请明智地选择最大分子数和盒子体积.

该程序还可以旋转溶质分子, 使其最长的分子轴与盒子边缘对齐. 这样可以减少所需要的溶剂分子. 值得注意的是这只适用于短时间的模拟, 如500 ps内溶液中的α-螺旋多肽可以旋转90度. 因此, 通常来说选用接近立方体的盒子会好一些.

`-shell`的设定值大于零时, 将会在溶质周围放置指定厚度(nm)的水层. 提示: 最好先将蛋白质分子置于盒子中央(使用`gmx editconf`).

最后, `gmx solvate`命令还可以去除拓扑文件中说明已添加的溶剂分子数的行, 并在坐标文件中添加包含溶剂分子总数的新行.

<table id='tab-155'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cp [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">protein.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件:  gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cs [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">spc216.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 库</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件:  gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.top</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输入/输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拓扑文件</td>
</tr>
</table>

<table id='tab-156'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-box &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">盒子尺寸(单位nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-radius &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.105</td>
  <td rowspan="1" colspan="1" style="text-align:left;">默认的范德华距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-scale &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.57</td>
  <td rowspan="1" colspan="1" style="text-align:left;">用于数据文件<code>share/gromacs/top/vdwradii.dat</code>中范德华半径的缩放因子.<br/> 对水中的蛋白质, 使用默认值0.57可以得到接近1000 g/l的密度值.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-shell &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">溶质周围水层的可选厚度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-maxsol &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">加入的最大溶剂分子数. 若为零(默认)则忽略此选项.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]vel</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">保持溶质和溶剂分子输入文件中的速度</td>
</tr>
</table>

### 已知问题

- 对初始构型所有分子必须保持完整.

### 补充说明

`gmx solvate`可以为模拟分子添加溶剂环境

- `-cp`: 带盒子参数的分子坐标文件, 一般是`editconf`的输出文件
- `-cs`: 添加的水分子模型, 如spc216, spce, tip3p, tip4p等
- `-o`:  输出坐标文件, 就是添加水分子之后的分子坐标文件, 默认为`.gro`文件, 但也可以为其他格式, 如pdb
- `-p`: 体系拓扑文件, `gmx solvate`会往里面写入添加水分子的个数. 这个不要忘记, 不然在进行下一步计算时, 会出现坐标文件和拓扑文件中原子数不一致的错误

添加水分子后需要用VMD等软件查看结果, 因为有时产生的构型不尽合理. 若发现某一水分子出现在蛋白结构中, 而此位置本来不希望有水分子存在, 那么可以找出这个水分子的残基标号, 进行删除, 同时减少拓扑文件中水分子的数目.

### 使用范例

- `-box a b c` 空盒子
- `-cs slv.gro -box a b c` 以slv.gro中分子填充盒子, -maxsol N可用
- `-cp slu.gro -box a b c` 指定box, 否则用slu.gro的box
- `-cp slu.gro -cs slv.gro` 以slv填充slu的box
- `-cp slu.gro -cs slv.gro -shell a b` 表面填充
- `-cp slu.gro -cs slv.gro -maxsol N -box a b c`

## gmx sorient: 分析溶质周围的溶剂取向(翻译: 李继存)

	gmx sorient [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-o [<.xvg>]] [-no [<.xvg>]] [-ro [<.xvg>]] [-co [<.xvg>]]
				[-rc [<.xvg>]] [-nice ] [-b ] [-e ] [-dt ]
				[-[no]w] [-xvg ] [-[no]com] [-[no]v23] [-rmin ]
				[-rmax ] [-cbin ] [-rbin ] [-[no]pbc]

`gmx sorient`用于分析溶质分子周围的溶剂分子的取向. 它可以计算从一个或多个参考位置到每个溶剂分子第一个原子的向量(向量 $\vec A$)与另外两个向量之间的角度:

- $\q_1$: 向量 $\vec A$ 与从溶剂分子第一个原子到第二和第三个原子中点的向量之间的夹角
- $\q_2$: 向量 $\vec A$ 与由三个原子定义的溶剂分子平面的法线之间的夹角, 或者, 当使用`-v23`选项时, 向量 $\vec A$ 与从原子2到原子3的向量之间的夹角.

参考位置可以是一组原子或是一组原子的质心. 溶剂原子组中的每个溶剂分子只能包含3个原子. 对每一帧, `-o`和`-no`选项只会考虑处于`-rmin`和`-rmax`之间的溶剂分子.

- `-o`:  $r_\text{min}\le r \le r_\text{max}$ 范围内 $\cos\q_1$ 的分布
- `-no`: $r_\text{min} \le r \le r_\text{max}$ 范围内 $\cos\q_2$ 的分布
- `-ro`: $\langle \cos \q_1 \rangle$ 和 $\langle 3\cos^2\q_2-1 \rangle$ 与距离 $r$ 的函数关系
- `-co`: 对距离 $r$ 范围内所有溶剂分子的 $\cos\q_1$ 和 $3\cos^2\q_2-1$ 进行加和, 得到它们与 $r$ 的函数关系
- `-rc`: 溶剂分子的分布与 $r$ 的函数关系

<table id='tab-157'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sori.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-no [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">snor.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ro [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sord.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-co [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">scum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">scount.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-158'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]com</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用质心作为参考位置</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v23</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用原子2和3之间的向量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最小距离(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最大距离(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cbin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.02</td>
  <td rowspan="1" colspan="1" style="text-align:left;">余弦的分格宽度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rbin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.02</td>
  <td rowspan="1" colspan="1" style="text-align:left;">距离 $r$ 的分格宽度(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算质心时检查PBC. 只有当你的参考组包含多个分子时, 才需要使用此选项.</td>
</tr>
</table>

### 补充说明

此程序特别适用于计算溶质分子周围水分子的角度分布.

![](/GMX/gmx_sorient.png)

设溶质为单原子离子或分子质心Ref, 溶剂为水分子原子1为O, 原子2和3为H, 则 $\q_1$ 对应Ref至O的向量 $\vec A=\vec R_\text{Ref}-\vec R_\text{O}$ 与O至两个H连线中点的向量 ${\vec R_\text{OH2}+\vec R_\text{OH3} \over 2}$ 之间的夹角, 后一向量的方向与水分子偶极矩的方向相同. 因此, $\q_1$ 可视为溶质分子周围水分子偶极矩的取向. $\q_2$ 对应 $\vec A$ 与水分子平面法线的夹角. 当使用`-v23`选项时, 则为 $\vec A$ 与两个H连线 $\vec R_\text{H3}-\vec R_\text{H2}$ 之间的夹角.

## gmx spatial: 计算空间分布函数(翻译: 刘建川)

	gmx spatial [-s [<.tpr/.tpb/...>]] [-f [<.xtc/.trr/...>]] [-n [<.ndx>]]
				[-nice ] [-b ] [-e ] [-dt ] [-[no]w]
				[-[no]pbc] [-[no]div] [-ign ] [-bin ] [-nab ]

`gmx spatial`用于计算空间分布函数(SDF, spatial distribution function), 其输出文件为Gaussian98 cube格式, 可用VMD读取. 对含有32,000个原子, 运行了50 ns的轨迹, 计算SDF大约需要30分钟. 其中的大部分时间都消耗在了运行`trjconv`上, 它需要运行两次, 以便恰当地对体系进行居中, 同时也需要很多空间(会复制三份轨迹文件). 如果选择了正确的叠合, 得到的结果非常漂亮, 而且也包含了很多有用信息.  程序可处理运动范围很广的组中的3-4原子(如溶液中的自由氨基酸), 也可以选择稳定折叠结构的蛋白质骨架, 计算溶剂分子的的SDF, 得到时间平均的溶剂壳层. 这个程序还可用于计算任意直角坐标的SDF, 只需要忽略前面的`gmx trjconv`步骤即可.

使用:

为得到有意义的SDF, 整个轨迹中溶质分子必须在盒子内居中, 并去除其平动和转动. 也就是说, 统计周围分子的SDF时必须基于相对固定的参考坐标系. 为此, 可能需要使用`gmx trjconv`对轨迹进行多次处理. 此外, 可能还需要定义特殊的分析组, 并使用`-n`选项传递给`gmx trjconv`.

1. 使用`gmx make_ndx`创建两个组, 一个包含中心分子, 一个包含要统计SDF的原子
2. 使中心分子在盒子内居中, 同时所有其他分子处于盒子内

	`gmx trjconv -s topol.tpr -f traj -n index.ndx -o traj~cnt.xtc -pbc mol -ur compact -center`

	`Select group for centering`时选择中心分子组, `Select group for output`时选择System组

3. 按中心分子对轨迹进行叠合, 移除中心分子的转动和平动:

	`gmx trjconv -s topol.tpr -f traj~cnt.xtc -n index.ndx -o traj~cnt~fit.xtc -fit rot+trans`

	`Select group for least squares fit`时选择中心分子组, `Select group for output`是选择System组

4. 统计分布:

	`gmx spatial -f traj~cnt~fit.xtc -n index.ndx`

	`Select group to generate SDF:`时选择要统计SDF的组, `Select group to output coords (e.g. solute):`时选择中心分子组

5. 使用VMD或其他可视化软件载入得到的`grid.cube`文件, 以等值面模式查看结果

__注意__, 对一些体系, 如胶束体系, 在第1步和第2步之间可能还需要运行`gmx trjconv -pbc cluster`.

警告:

SDF生成的cube文件包含了具有非零占据的所有格点. 然而, `gmx trjconv`使用的`-fit rot+trans`选项意味着你的体系会在空间中旋转和平移(选中的组不会). 因此, 返回值只在所选中心组/坐标周围的一定区域内有意义, 在整个轨迹中, 这些区域与平移/旋转后的体系之间存在重叠. 请你确保能满足这一条件.

漏洞:

当分配的内存不够时, 可能会出现段错误. 通常会检测这一错误, 并在出错前终止程序, 同时给出一条警告消息, 建议使用`-nab`选项(指定附加分格数). 然而, 程序并不能检测到所有此类事件. 如果你遇到段错误, 请试着增加`-nab`的值, 并再次运行程序.

激进选项:

为减少计算所需的空间和时间, 你可以只输出运行`gmx trjconv`所需的坐标. 然而, 请确保`-nab`的设定值足够高, 因为程序会基于初始坐标和`-nab`选项的值分配cube分格所需要的内存.

<table id='tab-159'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-160'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的 .xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时考虑周期性边界条件(PBC).</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]div</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">基于原子/最小cube尺寸计算施加分格占据率因子. <br/>TRUE用于可视化, FALSE(<code>-nodiv</code>)可得到每帧的精确计数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ign &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">不显示的外部cube的数目(正值可能降低边界斑点; -1保证外部表面可见)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.05</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分格宽度(单位: nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nab &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">4</td>
  <td rowspan="1" colspan="1" style="text-align:left;">附加的分格数目, 用于保证分配的内存足够大</td>
</tr>
</table>

### 补充说明

- 如果得到的SDF等值面不够光滑, 请增加轨迹的帧数, 并检查`-bin`的取值时并不是合适
- 此程序计算SDF的方式不够高效. 如果体系含有多个中心分子类型, 则每帧可使用每个中心分子进行居中, 得到更多的统计结果.
- 一些说明请参考 [空间分布函数SDF的计算及三维图示]( http://jerkwin.github.io/2014/05/13/空间分布函数SDF的计算及三维图示/).
- 一个处理工具请参考[Gromacs的g_spatial产生的格点文件分析工具gmxgrid v1.2](http://sobereva.com/38).

## gmx spol: 分析溶质周围溶剂的偶极取向及极化(翻译: 李继存)

	gmx spol [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-o [<.xvg>]] [-nice ] [-b ] [-e ] [-dt ]
			 [-[no]w] [-xvg ] [-[no]com] [-refat ] [-rmin ]
			 [-rmax ] [-dip ] [-bw ]

`gmx spol`程序用于分析溶质分子周围的偶极, 特别适用于极化水模型. 计算时需要一组参考原子或参考质心(`-com`选项), 还有一组溶剂原子, 程序会先将溶剂原子组划分为分子, 然后确定每一溶剂分子到参考组原子或其质心的最近距离, 并给出这些距离的累积分布. 对处于`-rmin`和`-rmax`之间的每一距离, 确定距离向量与溶剂分子偶极的內积. 对带有净电荷的溶剂分子(离子), 会均匀地将净电荷从每一所选离子的所有原子中会减去. 输出这些偶极分量的平均值. 对极化的处理类似, 并从瞬时偶极中减去平均偶极. 平均偶极的大小由`-dip`选项指定, 方向由从所选溶剂组的第一个原子到第二和第三个原子连线中点的向量确定.

<table id='tab-161'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">scdist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-162'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]com</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用质心作为参考位置</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-refat &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">溶剂分子的参考原子</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最小距离(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.32</td>
  <td rowspan="1" colspan="1" style="text-align:left;">最大距离(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dip &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">平均偶极(D)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bw &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.01</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分格宽度(nm)</td>
</tr>
</table>

## gmx tcaf: 计算液体的粘度(翻译: 肖慧芳)

	gmx tcaf [-f [<.trr/.cpt/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-ot [<.xvg>]] [-oa [<.xvg>]] [-o [<.xvg>]] [-of [<.xvg>]]
			 [-oc [<.xvg>]] [-ov [<.xvg>]] [-nice ] [-b ] [-e ]
			 [-dt ] [-[no]w] [-xvg ] [-[no]mol] [-[no]k34]
			 [-wt ] [-acflen ] [-[no]normalize] [-P ]
			 [-fitfn ] [-beginfit ] [-endfit ]

`gmx tcaf`用于计算横向电流自相关(TCAF, tranverse current autocorrelation), 并可以其来估算剪切粘度η. 详细信息请参考: Palmer, _Phys. Rev. E_ 49 (1994) pp 359-366.

计算横向电流时会使用k矢量(1,0,0)和(2,0,0), 它们同时也处于y方向和z方向, 也会使用(1,1,0)和(1,-1,0), 它们同时也处于在2个其他平面(这些矢量不是独立的), 还会使用(1,1,1)以及三个其他的盒子体对角线(也是相关的). 对于每一个k矢量, 会使用正弦和余弦以及两个垂直方向上的速度. 这样共有16*2*2=64个横向电流. 对每个k矢量会计算并拟合一个自相关, 这就得到了16个TCAF. 每个TCAF会拟合为f(t) = exp(-v)(cosh(Wv) + 1/W sinh(Wv)), v = -t/(2τ), W = sqrt(1 - 4τη/ρk^2), 这样得到16个τ值和η值. 拟合的权重以指数形式exp(-t/w)衰减, 时间常数为w(由`-wt`指定), 计算TACF与拟合的时间为5*w. η的值应拟合为1 - aη(k)k^2, 这样就可以根据k=0时的值估计剪切粘度.

当选用立方体盒子时, 可以使用选项`-oc`, 这样TCAF会对所有长度相同的k矢量进行平均. 这样得到的TCAF更精确. 立方TCAF与拟合都会写入由`-oc`指定的文件, 立方η估计值也会写入有`-ov`指定的文件.

使用选项`-mol`时, 会根据分子而不是原子来确定横向电流. 在这种情况下, 索引组应包含分子编号而不是原子编号.

为获得无限波长时的粘度, `-ov`文件中与k依赖的粘度应根据η(k) = η_0 (1 - a k^2)进行拟合.

__注意__: 请确保坐标与速度的输出频率足够高. 自相关函数初始的非指数部分对于获得好的拟合结果非常重要.

<table id='tab-163'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入文件</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹文件: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输入文件, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输入文件, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">transcur.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输出文件, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgrfile</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oa [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tcaf_all.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出文件</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tcaf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出文件</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tcaf_fit.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出文件</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oc [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tcaf_cub.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输出文件, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ov [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">visc_k.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出文件</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-164'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mol</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算分子的TCAF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]k34</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">也使用k&#61;(3,0,0)和k&#61;(4,0,0)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-wt &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">TCAF拟合权重的指数衰减时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erfit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直到最后</td>
</tr>
</table>

## gmx traj: 输出轨迹文件中的坐标x, 速度v, 力f, 盒子, 温度和转动能(翻译: 康文斌)

	gmx traj [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-ox [<.xvg>]] [-oxt [<.xtc/.trr/...>]] [-ov [<.xvg>]]
			 [-of [<.xvg>]] [-ob [<.xvg>]] [-ot [<.xvg>]] [-ekt [<.xvg>]]
			 [-ekr [<.xvg>]] [-vd [<.xvg>]] [-cv [<.pdb>]] [-cf [<.pdb>]]
			 [-av [<.xvg>]] [-af [<.xvg>]] [-nice ] [-b ] [-e ]
			 [-dt ] [-tu ] [-[no]w] [-xvg ] [-[no]com]
			 [-[no]pbc] [-[no]mol] [-[no]nojump] [-[no]x] [-[no]y] [-[no]z]
			 [-ng ] [-[no]len] [-[no]fp] [-bin ] [-ctime ]
			 [-scale ]

`gmx traj`用于输出坐标, 速度, 力和/或盒子. 使用`-com`选项可计算各个组质心的坐标, 速度和力. 当指定`-mol`选项时, 索引文件中的数目被视为分子个数, 并对每一分子使用与`-com`选项相同的过程.

选项`-ot`输出每个组的温度, 如果轨迹文件中含有速度信息. 计算时没有对约束自由度进行修正! 此选项暗含`-com`选项.

选项`-ekt`和选项`-ekr`用来画每一个组的平东和转动动能, 同时在轨迹文件中提供当前的速度信息.

选项`-cv`和`-cf`可将平均速度和平均力作为温度因子输出到一个`.pdb`文件中, 其中的坐标为平均坐标或`-ctime`时刻的坐标. 程序会对温度因子进行标度, 使其最大值为10. 标度因子可以通过选项`-scale`来改变. 为得到某一帧的速度或力, 可以将选项`-b`和`-e`都指定为那一帧的时间值. 当对帧进行平均时, 你可能需要使用`-nojump`选项以得到正确的平均坐标. 如果你选择了这些选项中一个, 还会将每个原子的平均力和平均速度写入一个`.xvg`文件(由`-av`和`-af`选项指定).

选项`-vd`可用于计算速度分布, 即, 输出向量的模. 另外, 同时会给出动能的分布.

<table id='tab-165'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ox [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">coord.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oxt [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">coord.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ov [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">veloc.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-of [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">force.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ob [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">box.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">temp.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ekt [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ektrans.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ekr [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ekrot.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-vd [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">veldist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cv [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">veloc.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Protein data bank文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cf [&lt;.pdb>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">force.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PDB文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-av [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">all_veloc.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-af [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">all_force.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-166'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps and .pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]com</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出每组质心的数据</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对质心, 使分子保持完整</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mol</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引包含了分子数, iso原子数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]nojump</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">移除原子对盒子边界的跨越</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]x</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出x分量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]y</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出y分量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]z</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出z分量</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ng &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">考虑的组的数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]len</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出向量的长度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]fp</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度输出</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">速度直方图的分格宽度(单位: nm/ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ctime &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对<code>-cv</code>和<code>-cf</code>使用此时刻帧的x, 而不是平均的x</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-scale &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>.pdb</code>输出的标度因子, 0表示自动选择标度</td>
</tr>
</table>

## gmx trjcat: 连接轨迹文件(翻译: 李继存)

	gmx trjcat [-f [<.xtc/.trr/...> [...]]] [-o [<.xtc/.trr/...> [...]]]
			   [-n [<.ndx>]] [-demux [<.xvg>]] [-nice ] [-tu ]
			   [-xvg ] [-b ] [-e ] [-dt ] [-[no]vel]
			   [-[no]settime] [-[no]sort] [-[no]keeplast] [-[no]overwrite]
			   [-[no]cat]

`gmx trjcat`可按顺序将几个输入轨迹文件合并在一起. 当发现同一时刻存在两帧时, 会使用后一文件中的帧. 通过使用`-settime`, 你可以指定每一轨迹文件的起始时间. 输入文件由命令行得到, 你可能要使用像`gmx trjcat -f *.trr -o fixed.trr`这样的技巧. 使用`-cat`选项, 你可以简单地将几个文件粘帖在一起而不会移除具有系统时间戳的帧.

当输出文件为输入文件之一时, 需要特别注意一点. 在这种情况下, 那个特定的输入文件会被追加, 这样就不需要存储双倍的数据. 显然, 要追加的文件必须具有最小的起始时间, 因为只能在文件末尾追加.

当给定`-demux`选项时, 会读入N个轨迹, 并将它们按`.xvg`文件中指定的顺序写入另一个文件中. `.xvg`文件的内容类似于:

	0 0 1 2 3 4 5
	2 1 0 2 3 5 4

其中, 第一个数字为时间, 接下来的数字为轨迹编号, 对应于第一行数字的帧会写入输出轨迹中. 如果轨迹中帧的数目与`.xvg`文件中的不匹配, 程序会自行决定如何处理. 请小心.

<table id='tab-167'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...> [...]]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">trajout.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-demux [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">remd.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-168'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]vel</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果可能读入并输出速度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]settime</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">交互式地设定每一输入文件在新输出文件中的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sort</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自动排序输入轨迹文件(而不是帧)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]keeplast</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将重复帧输出值轨迹末尾</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]overwrite</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">追加时覆盖重复帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cat</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">不丢弃重复帧</td>
</tr>
</table>

## gmx trjconv: 转换和操控轨迹文件(翻译: 黄灏)

	gmx trjconv [-f [<.xtc/.trr/...>]] [-o [<.xtc/.trr/...>]]
				[-s [<.tpr/.tpb/...>]] [-n [<.ndx>]] [-fr [<.ndx>]]
				[-sub [<.ndx>]] [-drop [<.xvg>]] [-nice ] [-b ]
				[-e ] [-tu ] [-[no]w] [-xvg ] [-skip ]
				[-dt ] [-[no]round] [-dump ] [-t0 ]
				[-timestep ] [-pbc ] [-ur ] [-[no]center]
				[-boxcenter ] [-box ] [-trans ]
				[-shift ] [-fit ] [-ndec ] [-[no]vel]
				[-[no]force] [-trunc ] [-exec ] [-split ]
				[-[no]sep] [-nzero ] [-dropunder ] [-dropover ]
				[-[no]conect]

`gmx trjconv`可以以多种方式来转换轨迹文件:

* 从一种格式转换为另一种格式
* 选择一组原子集合
* 改变周期性的表示方式
* 将多聚体分子保持一起
* 将原子在盒子内居中
* 将原子叠合到参考结构
* 减少帧数
* 改变每帧的时间戳(`-t0`和`-timestep`)
* 根据索引文件中的信息把轨迹分割为小的子轨迹, 这样对子轨迹的后续分析就变为对团簇的分析. 需要使用选项`-sub`. 处理时假定索引文件中的条目为帧数, 并将把索引文件中的每个组输出为单独的轨迹.
* 选取某个量处于一定范围内的帧, 这个量由`.xvg`文件给出

`gmx trjconv`更适用于将多个轨迹文件拼合起来.

`gmx trjconv`支持以下格式的输入和输出文件: `.xtc`, `.trr`, `.trj`, `.gro`, `.g96`和`.pdb`. 文件格式由文件的扩展名决定. 对`.xtc`, `.gro`和`.pdb`输入格式, `.xtc`和`.gro`输出文件的精度取决于输入文件; 对其他输入格式, 输出文件的精度由`-ndec`选项决定. 如果设定了`-ndec`选项, 输出格式的精度总是取决于`-ndec`. 所有其他格式的精度都是固定的. `.trr`和`.trj`输出格式的精度可以是单精度或双精度, 取决于`gmx trjconv`程序的精度. 注意, 只有`.trr`, `.trj`, `.gro`和`.g96`格式的文件支持速度.

`-sep`选项可将每一帧写入到单独的`.gro`, `.g96`或`.pdb`文件. 默认情况下, 所有帧都被写入到一个文件中. 拼合了所有帧的`.pdb`文件可以使用`rasmol –nmrpdb`来查看.

为了节省磁盘空间, 可以选择部分轨迹并将其写入到一个新的轨迹文件中. 例如, 去除蛋白质水溶液轨迹中的水分子. __始终__ 要保存原始的轨迹文件! 我们推荐使用可移植的`.xtc`格式进行分析以节省磁盘空间并得到可移植的文件.

有两个选项可用于将轨迹叠合到参考结构或进行主成分动力学分析. 第一个选项仅仅将结构简单地叠合到结构文件中的参考结构. 第二个选项是逐步叠合: 第一时间步的结构叠合到结构文件中的参考结构, 后续时间步的结构则叠合到前一步的叠合结构. 与常规的叠合方法不同, 利用这种方式可以产生连续的轨迹, 例如当蛋白质的构象转变很大时.

选项`-pbc`用于设置周期性边界条件的处理方式:

* `mol`: 将分子的质心置于盒子中, 需要使用`-s`提供一个运行输入文件
* `res`: 将残基的质心置于盒子中
* `atom`: 将所有原子置于盒子中
* `nojump`: 检查原子是否跳过了盒子边缘, 如果是则将它们放回来. 这样所有分子都可以保持完整(如果在初始构型中它们是完整的). __注意__, 这样可以确保轨迹连续, 但分子可能扩散出盒子. 如果提供了结构文件, 此过程的起始构型将来自结构文件, 否则将使用第一帧的构型.
* `cluster`: 将选定索引中的所有原子团簇化, 这样它们到团簇质心的距离最近, 团簇质心会迭代更新. __注意__, 只有确实存在一个团簇时, 这种方法才能给出有意义的结果. 幸运的是你以后可以使用轨迹查看器来检查是否存在一个团簇. 同时也要注意, 如果分子破碎了, 这个选项也不会起作用. <br>
	单独的选项`-clustrcenter`可用于指定团簇的近似质心. 这适用于一些情况, 例如存在两个大囊泡, 你需要保持他们的相对位置.
* `whole`: 将破碎的分子恢复完整

对`-pbc`的`mol`, `res`和`atom`选项, `-ur`选项设置单元晶胞的表示方式. 对于三斜盒子这三个选项会给出不同的结果, 而对于长方盒子, 给出的结构相同. `rect`是普通的长方体形状, `tric`是三斜晶胞, `compact`将所有原子置于离盒子中心距离最近的位置. 这有利于, 例如对截断八面体和菱形十二面体的可视化. 对`tric`和`compact`选项的中心是`tric`(见下文), 除非选项`-boxcenter`设置了不同的值.

选项`-center`将体系在盒子内居中, 用户可以选择用于确定几何中心的组. 对`-pbc`和`-center`选项, `-boxcenter`设置盒子的中心位置. 中心的选项为: `tric`: 盒向量总和的一半, `rect`: 盒子对角线的一半, `zero`: 0. 如果居中后你想使所有分子都处于盒子中, 可以使用`-center`和`-pbc mol`选项.

选项`-box`设置新盒子的大小. 此选项只用于主维度, 因此通常只用于长方盒子. 如果你只想修改某些维度, 例如读取轨迹时, 你可以使用-1使某一维度保持不变. 当仅调用一次`gmx trjconv`时, 使用`-pbc`, `-fit`, `-ur`和`-center`选项的组合并不总能精确地达到你的目的. 这种情况下可考虑使用多次调用, 可参考GROMACS网站的一些建议.

使用`-dt`选项可以减少输出中的帧数. 此选项依赖于输入轨迹中时间的精确度, 因此, 如果它们不够精确, 可以使用`-timestep`选项来修改时间(可以同时进行). 为了制作平滑的电影, `gmx filter`程序可以使用低通频率滤波器来减少帧的数目, 从而减少了高频运动的走样.

使用`-trunc`选项, `gmx trjconv`可以就地截断`.trj`文件, 即不需要复制文件. 当在磁盘I/O过程中运行崩溃时(即磁盘已满), 或者当拼合两个邻近的轨迹但不能重帧时, 此选项很有用.

选项`-dump`用于从你的轨迹文件中抽取处于或邻近指定时间的帧.

选项`-drop`读取`.xvg`文件中的时间和数值. 当设置了选项`-dropunder`和/或`-dropover`, 不会输出低于或高于相应选项设定值的帧.

<table id='tab-169'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">trajout.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fr [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">frames.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sub [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">cluster.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-drop [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">drop.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-170'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tu</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">时间值的单位: fs, ps, ns, us, ms, s</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序结束后查看输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每nr帧输出一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]round</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将测量四舍五入至最接近的皮秒</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dump &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">重复最接近指定时间(ps)的帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-t0 &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">起始时间(ps) (默认: 不改变)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-timestep &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">更改输入帧之间的时间步长(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pbc &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">PBC处理方式(完整说明见帮助文件): none, mol, res, atom, nojump, cluster, whole</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ur &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rect</td>
  <td rowspan="1" colspan="1" style="text-align:left;">单元晶胞的表示方式: rect, tric, compact</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]center</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将盒子内的原子居中</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-boxcenter &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tric</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pbc</code>和<code>-center</code>的中心: tric, rect, zero</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-box &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">新立方盒子的尺寸(默认读取自输入文件)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-trans &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">所有坐标将被平移 trans. 适用于与<code>-pbc mol -ur compact</code>组合使用.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-shift &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">所有坐标将被偏移 framenr*shift</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fit &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将分子叠合到结构文件中的参考结构.<br/>可用选项: none, rot+trans, rotxy+transxy, translation, transxy, progressive</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ndec &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出<code>.xtc</code>和<code>.gro</code>时, 小数位的精度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]vel</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果可能, 读取并输出速度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]force</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果可能, 读取并输出力</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-trunc &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在此时间(ps)后截断输入轨迹文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-exec &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">对每个输出帧执行命令, 帧号作为命令的参数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-split &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当t除以split的余数等于第一帧时间(ps)时开始输出新文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sep</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将每一帧输出为独立的<code>.gro</code>, <code>.g96</code>或<code>.pdb</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nzero &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果设置<code>-sep</code>, 文件编号的数字位数, 如果需要, 数字签名会添加0</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dropunder &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">舍弃低于此值的所有帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dropover &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">舍弃高于此值的所有帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]conect</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当输出<code>.pdb</code>文件时增加连接记录. 对于非标准分子, 例如粗粒化分子的可视化会有用.</td>
</tr>
</table>

### 补充说明

`gmx trjconv`可能是最常用的后处理工具, 用来处理坐标, 处理周期性或者手动调整轨迹. 利用它抽取特定的轨迹比较简单, 但使用它处理轨迹的周期性时, 一些选项不容易理解. 下面对其中的一些进行说明.

`-pbc mol|res|atom`指定以何种方式考虑PBC, 是使分子的质心, 残基的质心, 还是每个原子处于盒子中. 如果使用`-pbc atom`所有原子都处于盒子之中, 这样边界上的分子看起来破碎了. 如果对破碎后的分子再使用一次`-pbc whole`, 将分子恢复完整, 其效果与`-pbc mol`类似.

`-pbc nojump`可以保证分子的运动是连续的, 就像体系处于真空中一样, 分子连续地向各个方向扩散. 在计算MSD这样的量的时候, 需要这样考虑. 但`gmx msd`在计算时已经考虑了这点, 所以我们就无须先利用此选项对轨迹进行处理了. 此选项对单个构型没有意义.

使用`-pbc mol|res|atom`选项时, 会使相应的中心处于盒子中, 而盒子的显示方法则使用`-ur`来控制. 如果使用长方体盒子, `-ur`的三种选项给出的结果相同, 所以无需考虑此项. 如果使用了三斜盒子, `-ur`的三种选项给出的结果不同: `-ur tric`粒子处于三斜盒子中, `-ur rect`粒子处于长方盒子中, `-ur compact`粒子处于距盒子中心最近的位置, 近似球形.

利用`-center`选项可使某组原子在盒子内居中, 运行时, 会提示你选择要居中的组. 此选项可以和`-pbc mol|res|atom`一起使用, 达到使某组原子居中, 同时其他原子都处于盒子内的目的.

在使用`-ur tric|compact`, `-pbc mol|res|atom|`, `-center`选项时, 都需要定义盒子的中心. 默认使用的盒子中心处于盒向量的一半处. 但可以使用`-boxcenter`改变: `tric`盒向量总和的一半, `rect`盒子对角线的一半, `zero`0.

上面的这几个选项可组合使用, 但不能保证一定能满足需要, 有时可能需要使用`gmx trjconv`多次.

注意, `-pbc`和`-fit rot`两个选项不能一起使用. 否则程序运行错误, 给出如下信息:

	PBC condition treatment does not work together with rotational fit.
	Please do the PBC condition treatment first and then run trjconv in a second step for the rotational fit.
	First doing the rotational fit and then doing the PBC treatment gives incorrect results!

这意味着凡同时涉及周期性和叠合的处理都需要分两次进行, 而且必须先进行周期性处理, 再进行叠合, 否则结果错误.

`-pbc`几种处理的效果可参看 [gmx trjconv选项测试](/GMX/GMXpbc)

## gmx trjorder: 根据到参考组原子的距离对分子排序(翻译: 李培春)

	gmx trjorder [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				 [-o [<.xtc/.trr/...>]] [-nshell [<.xvg>]] [-nice ]
				 [-b ] [-e ] [-dt ] [-xvg ] [-na ]
				 [-da ] [-[no]com] [-r ] [-[no]z]

`gmx trjorder`可根据到参考组原子的最小距离或z坐标(`-z`选项)对分子排序. 使用距离进行排序时, 需要指定参考原子组以及分子组. 对轨迹中的每一帧, 所选分子会根据分子中编号为`-da`的原子与参考组中所有原子之间距离的最小值进行重排序. 通过将`-da`设定为0, 可使用分子的质心而不是参考原子. 轨迹中的所有原子都会写入输出轨迹.

对某些分析, `gmx trjorder`可能会有用, 例如分析离蛋白最近的n个水分子. 在这种情况下, 参考组为蛋白质, 分子组为所有水分子的原子. 当得到了前n个水分子的索引组后, 排序后的轨迹可使用任何GROMACS工具分析最近的n个水分子.

如果输出文件为`.pdb`文件, 到参考目标的距离会存放于B因子字段, 以便用于使用一些可视化程序加色, 如Rasmol

使用`-nshell`选项, 会输出参考组周围一定半径`-r`壳层内的分子数.

<table id='tab-171'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ordered.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nshell [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nshell.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-172'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-na &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">分子中的原子个数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-da &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算距离时所用原子的编号, 0表示使用质心</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]com</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用到参考组质心的距离</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当计算围绕蛋白等的壳层内的分子数时, 距离的截断值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]z</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">根据z坐标排序分子</td>
</tr>
</table>

## gmx tune_pme: 计算`mdrun`的运行时间与PME进程数的关系以优化设置(翻译: 嘉晔)

	gmx tune_pme [-p [<.out>]] [-err [<.log>]] [-so [<.tpr/.tpb/...>]]
				 [-s [<.tpr/.tpb/...>]] [-o [<.trr/.cpt/...>]] [-x [<.xtc/.tng>]]
				 [-cpi [<.cpt>]] [-cpo [<.cpt>]] [-c [<.gro/.g96/...>]]
				 [-e [<.edr>]] [-g [<.log>]] [-dhdl [<.xvg>]] [-field [<.xvg>]]
				 [-table [<.xvg>]] [-tabletf [<.xvg>]] [-tablep [<.xvg>]]
				 [-tableb [<.xvg>]] [-rerun [<.xtc/.trr/...>]] [-tpi [<.xvg>]]
				 [-tpid [<.xvg>]] [-ei [<.edi>]] [-eo [<.xvg>]]
				 [-devout [<.xvg>]] [-runav [<.xvg>]] [-px [<.xvg>]]
				 [-pf [<.xvg>]] [-ro [<.xvg>]] [-ra [<.log>]] [-rs [<.log>]]
				 [-rt [<.log>]] [-mtx [<.mtx>]] [-dn [<.ndx>]] [-swap [<.xvg>]]
				 [-bo [<.trr/.cpt/...>]] [-bx [<.xtc>]] [-bcpo [<.cpt>]]
				 [-bc [<.gro/.g96/...>]] [-be [<.edr>]] [-bg [<.log>]]
				 [-beo [<.xvg>]] [-bdhdl [<.xvg>]] [-bfield [<.xvg>]]
				 [-btpi [<.xvg>]] [-btpid [<.xvg>]] [-bdevout [<.xvg>]]
				 [-brunav [<.xvg>]] [-bpx [<.xvg>]] [-bpf [<.xvg>]]
				 [-bro [<.xvg>]] [-bra [<.log>]] [-brs [<.log>]] [-brt [<.log>]]
				 [-bmtx [<.mtx>]] [-bdn [<.ndx>]] [-bswap [<.xvg>]] [-nice ]
				 [-xvg ] [-np ] [-npstring ] [-ntmpi ]
				 [-r ] [-max ] [-min ] [-npme ]
				 [-fix ] [-rmax ] [-rmin ] [-[no]scalevdw]
				 [-ntpr ] [-steps ] [-resetstep ] [-nsteps ]
				 [-[no]launch] [-[no]bench] [-[no]check] [-[no]append]
				 [-[no]cpnum]

对于给定数目`-np`或`-ntmpi`的总进程数, `gmx tune_pme`可以系统地测试不同PME进程数对`gmx mdrun`运行时间的影响, 并确定哪种设置最快. 通过将负载从Ewald加和的倒易空间部分转移到实空间部分, 它也可以测试是否能提升性能. 测试时, 你只需要将`.tpr`文件和`gmx mdrun`的运行选项一起传给`gmx tune_pme`即可.

测试使用的可执行文件可以通过环境变量`MPIRUN`和`MDRUN`进行设置. 如果这些设置不存在, 默认将使用`mpirun`和`mdrun`. 注意, 对某些MPI框架, 你需要提供机器号或者主机名. 也可以通过`MPIRUN`变量传递这些设置, 例如,

	export MPIRUN="/usr/local/mpirun -machinefile hosts"

在实际的基准测试运行之前, 如果激活了`-check`选项(默认激活), `gmx tune_pme`会进行一个快速的检测, 以确定对提供的并行设置`mdrun`是否如预期的那样运行. 请使用你要传递给`gmx mdrun`的正常选项去调用`gmx tune_pme`, 并且增加执行测试的进程数选项`-np`, 或线程数选项`-ntmpi`. 你也可以增加`-r`选项对每个测试重复多次以便得到更好的统计结果.

`gmx tune_pme`能够测试各种实空间/倒空间的工作负载. 使用`-ntpr`选项, 你可以控制额外输出的`.tpr`文件的数目, 每个文件分别对应了增大的截断距离和更小的傅里叶格点. 通常, 首次测试(0号)的设置来自输入的`.tpr`文件; 最后一次测试(`ntpr`号)使用了由`-rmax`指定的库伦截断, 同时使用了略小的PME格点. 在最后的测试中, 傅里叶间距会变为原来的`rmax`/`rcoulomb`倍. 其余`.tpr`文件使用了处于这两个极值之间的等间距的库伦布半径(以及傅里叶间距). __注意__, 如果你只想搜寻最佳的PME进程数, 可以将`-ntpr`设为1. 在这种情况下, 输入文件`.tpr`将保持不变.

对于基准测试, 默认的1000个时间步对大多数MD体系应该足够了. 动态负载平衡大约需要100个时间步长来适应本地的负载失衡, 因此默认情况下, 100步之后时间步计数器会被重置. 对于大的体系(>1M个原子)以及高精度测量, 你应该将`-resetstep`设置为更大的值. 由`md.log`输出文件中的`DD`负载失衡项, 你可以知道多少步之后负载已经充分均衡了. 例如, 你可以调用

	gmx tune_pme -np 64 -s protein.tpr -launch

调用`gmx mdrun`命令若干次之后, 详细的性能信息会保存在输出文件`perf.out`中. __注意__, 在基准测试运行期间, 会产生一些临时文件(选项`-b*`), 每个测试完成之后它们会被自动删除.

如果你想使用最佳参数自动启动模拟, 可以使用命令行选项`-launch`.

<table id='tab-173'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-p [&lt;.out>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">perf.out</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用输出文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-err [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bencherr.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-so [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tuned.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-x [&lt;.xtc/.tng>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj_comp.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">压缩轨迹(tng格式或可移植的xdr格式)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cpi [&lt;.cpt>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">state.cpt</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cpo [&lt;.cpt>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">state.cpt</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-c [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">confout.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ener.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-g [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">md.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dhdl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dhdl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-field [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">field.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-table [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">table.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tabletf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tabletf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tablep [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tablep.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tableb [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">table.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rerun [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rerun.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tpi [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tpi.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tpid [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tpidist.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ei [&lt;.edi>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">sam.edi</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ED采样输入</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-eo [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">edsam.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-devout [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">deviatie.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-runav [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">runaver.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-px [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pullx.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-pf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pullf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ro [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotation.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ra [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotangles.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rs [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rotslabs.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rt [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">rottorque.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mtx [&lt;.mtx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nm.mtx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Hessian矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dn [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">dipole.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-swap [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">swapions.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bo [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bx [&lt;.xtc>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">压缩轨迹(可移植xdr格式): xtc</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bcpo [&lt;.cpt>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.cpt</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">检查点文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bc [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-be [&lt;.edr>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.edr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">能量文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bg [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beo [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchedo.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bdhdl [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchdhdl.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bfield [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchfld.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-btpi [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchtpi.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-btpid [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchtpid.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bdevout [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchdev.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-brunav [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchrnav.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bpx [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchpx.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bpf [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchpf.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bro [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchrot.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bra [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchrota.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-brs [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchrots.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-brt [&lt;.log>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchrott.log</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">日志文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bmtx [&lt;.mtx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchn.mtx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">Hessian矩阵</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bdn [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bench.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bswap [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">benchswp.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-174'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-np &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行测试的进程数(对单独的PME进行, 必须大于2)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-npstring &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-np</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用此字符串指定<code>$MPIRUN</code>的进程数: -np, -n, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntmpi &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行测试的MPI线程数(关闭MPI和mpirun)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每次测试的重复次数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要测试的PME进程数的最大比例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-min &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.25</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要测试的PME进程数的最小比例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-npme &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">auto</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在<code>-min</code>和<code>-max</code>之间, 对<code>-npme</code>的所有可能值或其合理子集执行基准测试.<br/> <code>auto</code>会忽略<code>-min</code>和<code>-max</code>, 根据<code>.tpr</code>文件中<code>npme</code>推测一个值, 并由此选择一个合理的值. 可用选项:  auto, all, subset</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fix &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">若此参数的值大于等于-1, 不改变PME进程的数目, 而是使用此固定值, 并只改变<code>rcoulomb</code>和PME格点间距.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">若此参数的值大于0, 对<code>-ntpr</code>>1使用的最大<code>rcoulomb</code>(增大<code>rcoulomb</code>会导致傅立叶格点减小)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">若此参数的值大于0, 对<code>-ntpr</code>>1使用的最小<code>rcoulomb</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]scalevdw</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">与<code>rcoulomb</code>一起, 缩放<code>rvdw</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ntpr &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">基准测试的<code>.tpr</code>文件的数目. 创建这么多文件, 每个文件使用的库仑缩放因子不同, 并取决于<code>-rmin</code>和<code>-rmax</code>参数. <br/>若此值<1, 会自动选择<code>.tpr</code>文件的数目进行测试.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-steps &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在基准测试运行中, 对这么多步进行计时.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-resetstep &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">100</td>
  <td rowspan="1" colspan="1" style="text-align:left;">开始计时前, 让dlb平衡这么多步(在这么多步之后重置循环计数器)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nsteps &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">如果该参数值非负, 在实际模拟中执行这么多步(覆盖<code>.tpr</code>文件中的<code>nsteps</code>, 添加<code>.cpt</code>中的步数)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]launch</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">优化后启动实际模拟</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]bench</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行基准测试还是仅仅创建输入的<code>.tpr</code>文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]check</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">基准测试运行前, 检查<code>mdrun</code>是否可以并行</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]append</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">当从检查点继续运行时, 输出将追加到之前的输出文件中, 而不是将模拟的部分编号添加到所有文件名称中(仅与<code>-launch</code>同用)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cpnum</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">保留检查点文件并对其进行编号(仅与<code>-launch</code>同用)</td>
</tr>
</table>

### 补充说明(吕康杰)

这个命令使用时实际有两个分支, 按进程运行, 按线程运行:

`-np 8` 实际会变成 `mpirun -np 8` 放到最前面, `-nmpi 8` 直接就是 `-nmpi 8`, 然后才调节`npme`的数目变化. 

虽然原理上明白了, 但我尝试了依然只有gmx 2016的`nmpi`运行成功, `np`的任务, 单独用`mpirun`都可以运行,`tune_pme`里面还是用不了.

## gmx vanhove: 计算Van Hove位移及相关函数(翻译: 刘恒江)

	gmx vanhove [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
				[-om [<.xpm>]] [-or [<.xvg>]] [-ot [<.xvg>]] [-nice ]
				[-b ] [-e ] [-dt ] [-[no]w] [-xvg ]
				[-sqrt ] [-fm ] [-rmax ] [-rbin ]
				[-mmax ] [-nlevels ] [-nr ] [-fr ]
				[-rt ] [-ft ]

`gmx vanhove`用于计算Van Hove相关函数G(r,t), 它表示在0时刻处于r_0的粒子在t时刻位于r_0+r处的概率. `gmx vanhove`是以向量r的长度而不是r来确定G, 因此给出了粒子在时间t内移动距离r的概率. 计算时会移除对周期性边界的跨越, 并会对因各项同性或各项异性压力耦合导致缩放进行校正.

使用选项`-om`可输出整个矩阵与t和r的函数关系, 或与sqrt(t)和r的函数关系(选项`-sqrt`)

使用选项`-or`可输出一个或多个t值的Van Hove函数. 选项`-nr`用以设置时间数, 选项`-fr`设置时间之间的间隔. 分格宽度可用选项`-rbin`设置. 分格数目自动确定.

使用选项`-ot`可输出函数到某一距离(选项`-rt`指定)的积分与时间的函数关系.

对所有读入的帧, 所选粒子的坐标放于在内存中, 因此程序可能会占用大量内存. 使用选项`-om`和`-ot`时程序可能会变得很慢, 这是因为计算标度为帧数与`-fm`或`-ft`的乘积. 需要注意的是, 使用`-dt`选项可以减少内存使用量和计算时间.

<table id='tab-175'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-om [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">vanhove.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">vanhove_r.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">vanhove_t.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-176'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps and .pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-sqrt &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵轴使用sqrt(t), 分格间距数以sqrt(ps)为单位</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fm &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵中的帧数, 0表示输出所有帧</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">2</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵中最大r(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rbin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0.01</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵和<code>-or</code>的分格宽度(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-mmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵的最大密度, 0表示使用计算值(1/nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nlevels &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">81</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵的水平数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nr &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or</code>输出的曲线数目</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fr &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-or</code>输出的帧间距</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rt &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot</code>输出的积分上限(nm)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ft &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ot</code>输出的帧数, 0表示使用所有帧</td>
</tr>
</table>

## gmx velacc: 计算速度自相关函数(翻译: 刘建川)

	gmx velacc [-f [<.trr/.cpt/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			   [-o [<.xvg>]] [-os [<.xvg>]] [-nice ] [-b ] [-e ]
			   [-dt ] [-[no]w] [-xvg ] [-[no]m] [-[no]recip]
			   [-[no]mol] [-acflen ] [-[no]normalize] [-P ]
			   [-fitfn ] [-beginfit ] [-endfit ]

`gmx velacc`用于计算速度自相关函数. 当使用`-m`选项时, 可以计算动量自相关函数.

使用`-mol`选项, 可计算分子的速度自相关函数. 在这种情况下, 索引组应由分子编号组成, 而不是原子编号.

请确保你的轨迹包含具有速度信息的帧(即, 原始的`.mdp`文件中应设置了`nstvout`), 数据采集点之间的时间间隔远远短于自相关的时间尺度.

<table id='tab-177'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.trr/.cpt/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.trr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">全精度轨迹: trr cpt trj tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构+质量(db): tpr tpb tpa gro g96 pdb brk ent</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">vac.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-os [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">spectrum.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
</table>

<table id='tab-178'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">查看输出.xvg, .xpm, .eps and .pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]m</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算动量自相关函数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]recip</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在谱图中, x轴使用cm^-1为单位, 而不是1/ps</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]mol</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算分子的速度自相关函数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acflen &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF的长度, 默认为帧数的一半</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]normalize</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">归一化ACF</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-P &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">ACF Legendre多项式的阶数(0表示不使用): 0, 1, 2, 3</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-fitfn &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">none</td>
  <td rowspan="1" colspan="1" style="text-align:left;">拟合函数: none, exp, aexp, exp_exp, vac, exp5, exp7, exp9, erfit</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-beginfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的起始时间</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-endfit &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对相关函数进行指数拟合的终止时间, -1表示直到最后</td>
</tr>
</table>

## gmx view: 在X-Windows终端显示轨迹(翻译: 杨旭云)

	gmx view [-f [<.xtc/.trr/...>]] [-s [<.tpr/.tpb/...>]] [-n [<.ndx>]]
			 [-nice ] [-b ] [-e ] [-dt ]

`gmx view`是GROMACS的轨迹查看器. 该程序可以读取一个轨迹文件, 运行输入文件和索引文件, 并在标准的X Windows屏幕上绘制分子的三维结构图. 此程序不需要高级的图形工作站, 它甚至可以在单色屏幕下工作.

此程序已经实现了以下功能: 3D视图, 旋转, 平移和缩放分子, 标记原子, 轨迹动画, 以PostScript格式复制, 在MIT-X(real X)下用户可自定义原子过滤器, 打开窗口和主题, 用户友好的菜单, 去除周期性的选项, 显示计算盒子的选项.

可以使用一些更常见的X命令行选项: `-bg`, `-fg`更改颜色; `-font fontname`更改字体.

<table id='tab-179'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xtc/.trr/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">traj.xtc</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">轨迹: xtc trr cpt trj gro g96 pdb tng</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-s [&lt;.tpr/.tpb/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">topol.tpr</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-n [&lt;.ndx>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">index.ndx</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">索引文件</td>
</tr>
</table>

<table id='tab-180'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的第一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">从轨迹文件中读取的最后一帧(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;time></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">只使用t除以dt的余数等于第一帧时间(ps)的帧, 即两帧之间的时间间隔</td>
</tr>
</table>

### 已知问题

- Balls选项暂时不可用
- 有时候会吐核, 原因不明

## gmx wham: 伞形抽样后进行加权直方分析(翻译: 陈珂)

	gmx wham [-ix [<.dat>]] [-if [<.dat>]] [-it [<.dat>]] [-ip [<.dat>]]
			 [-is [<.dat>]] [-o [<.xvg>]] [-hist [<.xvg>]] [-oiact [<.xvg>]]
			 [-iiact [<.dat>]] [-bsres [<.xvg>]] [-bsprof [<.xvg>]]
			 [-tab [<.dat>]] [-nice ] [-xvg ] [-min ]
			 [-max ] [-[no]auto] [-bins ] [-temp ] [-tol ]
			 [-[no]v] [-b ] [-e ] [-dt ] [-[no]histonly]
			 [-[no]boundsonly] [-[no]log] [-unit ] [-zprof0 ]
			 [-[no]cycl] [-[no]sym] [-[no]ac] [-acsig ]
			 [-ac-trestart ] [-nBootstrap ] [-bs-method ]
			 [-bs-tau ] [-bs-seed ] [-histbs-block ] [-[no]vbs]

`gmx wham`一个用于实现加权直方图分析方法(WHAM, Weighted Histogram Analysis Method)的分析程序, 用于分析伞形抽样模拟的输出文件以计算平均力势(PMF, potential of mean force).

目前此程序支持三种输入模式:

* 使用选项`-it`, 用户需要提供一个文件, 其中包含伞形抽样模拟的运行输入文件(`.tpr`文件)的文件名, __还要__ 使用选项`-ix`提供另一个文件, 其中包含pullx `mdrun`输出文件的文件名. `.tpr`文件和pullx文件的顺序必须对应, 即第一个`.tpr`文件生成了第一个pullx文件, 并以此类推.

* 除用户使用选项`-if`提供牵引力输出文件名称(`pullf.xvg`)以外, 与前述输入模式相同. 伞形势中的位置由牵引力计算得到. 无法用于表格形式的伞形势.

* 使用选项`-ip`, 用户需提供(gzip压缩的)`.pdo`文件的文件名, 即GROMACS 3.3的伞形输出文件. 如果你使用某些特殊的反应坐标, 你也可以生成自己的`.pdo`文件并使用`-ip`选项将其提供给`gmx wham`. `.pdo`文件的文件头必须类似于以下形式:

		# UMBRELLA 3.0
		# Component selection: 0 0 1
		# nSkip 1
		# Ref. Group 'TestAtom'
		# Nr. of pull groups 2
		# Group 1 'GR1' Umb. Pos. 5.0 Umb. Cons. 1000.0
		# Group 2 'GR2' Umb. Pos. 2.0 Umb. Cons. 500.0
		#####

牵引组(pull group)的个数, 伞形势位置(umbrella position), 力常数(force constant)和名称(当然)都可以不同. 文件头以下, 需要为每个牵引组提供一个时间列和一个数据列(即相对于伞形势中心的位移). 目前每个`.pdo`文件最多可以包含四个牵引组.

默认情况下, 在WHAM中会使用所有pullx/pullf文件中找到的所有牵引组. 如果只使用其中的某些牵引组, 用户可以提供一个牵引组选择文件(使用选项`-is`). 选择文件必须为`tpr-files.dat`中的每个`.tpr`文件提供一行说明, 内容必须为相应于`.tpr`文件中每个牵引组的一位数字(0或1). 在这里1表示该牵引组会在WHAM中使用, 0表示忽略. 例如, 如果你有3个`.tpr`文件, 每个包含4个牵引组, 但只使用牵引组1和2, 则`groupsel.dat`文件内容如下:

	1 1 0 0
	1 1 0 0
	1 1 0 0

默认情况下, 输出文件有:

`-o`: PMF输出文件

`-hist`: 直方图输出文件

请注意, 始终要检查直方图是否充分重叠.

程序假定伞形势为简谐势, 力常数从`.tpr`或`.pdo`文件中读取. 如果使用了非简谐的伞形力, 可以用`-tab`提供一个表格式的势能函数.

__WHAM选项__

`-bins`: 分析中使用的分格数

`-temp`: 模拟温度

`-tol`: 剖面(概率)的变化小于所给容差时停止迭代

`-auto`: 自动决定边界

`-min`, `-max`: 剖面的边界

可以使用选项`-b`, `-e`和`-dt`筛选用于计算剖面的数据点. 调整`-b`以保证每个伞形窗口都达到充分平衡.

使用选项`-log`时(默认), 会以能量单位输出剖面, 否则(使用`-nolog`选项)会输出概率. 可以使用选项`-unit`指定单位. 以能量单位输出时, 第一分格中的能量定义为零. 如果你希望其他位置自由能为零, 可以设置`-zprof0`(在使用自展法时很有用, 见下文).

对于环形或周期性的反应坐标(二面角, 无渗透梯度的通道PMF), 选项`-cycl`很有用. `gmx wham`会利用体系的周期性, 生成一个周期性的PMF. 反应坐标的第一个和最后一个分格会被假定为相邻.

使用选项`-sym`时, 在输出前会使剖面关于z=0对称, 在某些情况下, 如用于膜体系时很有用.

__自相关__

使用`-ac`选项时, `gmx wham`会估计每个伞形窗口的积分自相关时间(IACT, integrated autocorrelation time)τ, 并使用1/[1+2*τ/dt]作为各个窗口的权重. IACT会写入由选项`-oiact`指定的文件中. 在冗长(verbose)输出模式下, 所有自相关函数(ACF, autocorrelation functions)都会写入`hist_autocorr.xvg`文件. 由于在采样不足的情况下可能会严重低估IACT, 利用`-acsig`选项, 用户可使用高斯函数沿反应坐标对IACT进行平滑(高斯函数的σ由`-acsig`提供, 见`iact.xvg`中的输出). 注意, 程序使用简单的积分方法估计IACT, 且只考虑大于0.05的ACF. 如果你想使用更复杂(但可能不那么稳健)的方法, 比如拟合到双指数函数, 来计算IACT, 你可以使用`gmx analyze`来计算IACT, 并通过`iact-in.dat`文件(选项`-iiact`)将其提供给`gmx wham`. 在这个文件中每个输入文件(`.pdo`或pullx/f文件)对应一行, 各输入文件的每个牵引组对应一列.

__误差分析__

可以使用自展分析(bootstrap analysis)来估计统计误差. 请小心使用, 否则实质上可能会低估统计误差. 自展技术的更多背景知识和例子可以在Hub, de Groot and Van der Spoel, JCTC (2010) 6: 3713-3720中找到.

`-nBootstrap`定义自展的个数(比如使用100). 本程序支持四种自展方法, 通过`-bs-method`进行选择.

(1) `b-hist` 默认方法: 将完整的直方图视为独立的数据点, 给直方图赋予随机权重来实现自展("贝叶斯自展"). 注意, 沿反应坐标轴上的每个点都必须被多个独立直方图所覆盖(比如10个直方图), 否则会低估统计误差.

(2) `hist`: 将完整的直方图视为独立的数据点. 对每个自展, 从给定的N个直方图中随机选取N个直方图(允许重复, 即, 放回抽样). 为避免沿反应坐标轴上无数据的空隙, 可以定义直方图块(`-histbs-block`). 在那种情况下, 会将给定的直方图划分为块, 只有各块内部的直方图才会混合. 注意, 每块内的直方图必须能代表所有可能出现的直方图, 否则会低估统计误差.

(3) `traj`: 用给定的直方图产生新的随机轨迹, 这样产生的数据点遵从给定直方图的分布, 并具有适当的自相关. 每个窗口的自相关时间(ACT)必须是已知的, 所以要使用`-ac`选项或者利用`-iiact`手动提供ACT. 如果所有窗口的ACT都相同(并且已知), 你也可以用`-bs-tau`提供ACT. 注意, 在采样不足的情况下, 即如果各个直方图在各自的位置不能代表整个相空间, 此方法可能严重低估误差.

(4) `traj-gauss`: 与`traj`方法相同, 但轨迹不是根据伞形直方图自展得到, 而是从均值和宽度与伞形直方图相同的高斯函数得到. 此方法给出的误差估计类似于`traj`方法.

自展法的输出:

`-bsres`: 平均剖面和标准偏差

`-bsprof`: 所有自展剖面

使用`-vbs`选项(冗长自展)会输出每个自展使用的直方图, 并且, 使用`traj`自展方法时, 还会输出直方图的累积分布函数.

<table id='tab-181'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ix [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pullx-files.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-if [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pullf-files.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-it [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">tpr-files.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ip [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">pdo-files.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-is [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">groupsel.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">profile.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr 文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-hist [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">histo.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-oiact [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">iact.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-iiact [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">iact-in.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bsres [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bsResult.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bsprof [&lt;.xvg>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">bsProfs.xvg</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvgr/xmgr文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tab [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">umb-pot.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
</table>

<table id='tab-182'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xvg &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">xmgrace</td>
  <td rowspan="1" colspan="1" style="text-align:left;">xvg绘图格式: xmgrace, xmgr, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-min &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">剖面的最小坐标</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-max &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">剖面的最大坐标</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]auto</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自动确定min和max</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bins &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">200</td>
  <td rowspan="1" colspan="1" style="text-align:left;">剖面使用的分格数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-temp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">298</td>
  <td rowspan="1" colspan="1" style="text-align:left;">温度</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-tol &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1e-06</td>
  <td rowspan="1" colspan="1" style="text-align:left;">容差</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">冗长模式</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-b &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">50</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的起始时间(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-e &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1e+20</td>
  <td rowspan="1" colspan="1" style="text-align:left;">要分析的终止时间(ps)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-dt &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每隔dt ps分析一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]histonly</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出直方图即退出</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]boundsonly</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">确定min和max后即退出(使用<code>-auto</code>选项)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]log</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算剖面的对数值后再打印</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-unit &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">kJ</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对数输出时的能量单位: kJ, kCal, kT</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-zprof0 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将此位置的剖面值定义为0.0(使用<code>-log</code>选项)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]cycl</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">产生环形/周期性的剖面. 假定min和max是同一点.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]sym</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使剖面关于z&#61;0对称</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]ac</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算积分自相关时间并在wham中使用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-acsig &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">沿反应坐标轴, 使用以选项值为σ的高斯函数对自相关时间进行平滑</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ac-trestart &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">计算自相关函数时, 不同数据点之间的间隔ps数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nBootstrap &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自展的个数, 用以估计统计不确定性(如, 200)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bs-method &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">b-hist</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自展方法: b-hist, hist, traj, traj-gauss</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bs-tau &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">假定适用于所有直方图的自相关时间(ACT). 如果ACT未知, 使用选项<code>-ac</code></td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bs-seed &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">-1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">自展的种子(-1表示使用时间值)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-histbs-block &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">8</td>
  <td rowspan="1" colspan="1" style="text-align:left;">混合直方图时, 仅混合在<code>-histbs-block</code>指定块内的直方图.</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]vbs</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">冗长自展. 输出每个自展的CDF和直方图文件.</td>
</tr>
</table>

## gmx wheel: 绘制螺旋轮图(翻译: 李继存)

	gmx wheel [-f [<.dat>]] [-o [<.eps>]] [-nice ] [-r0 ]
			  [-rot0 ] [-T ] [-[no]nn]

`gmx wheel`用于绘制指定序列的螺旋轮示意图. 输入序列来自于`.dat`文件, 其中的第一行为残基的总数目, 接下来的每一行包含一个残基名称.

<table id='tab-183'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.dat>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">nnnice.dat</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">通用数据文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.eps>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">plot.eps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出</td>
  <td rowspan="1" colspan="1" style="text-align:left;">封装PostScript (tm)文件</td>
</tr>
</table>

<table id='tab-184'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">19</td>
  <td rowspan="1" colspan="1" style="text-align:left;">指定优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r0 &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">序列中的第一个残基编号</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rot0 &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">旋转的初始角度(90度即可)</td>
</tr>
<tr>
  <td rowspan="1" colspan="2" style="text-align:left;"><code>-T &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:left;">旋轮中心的文字(必须小于10个字符, 否则会覆盖旋轮)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]nn</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">是否显示编号</td>
</tr>
</table>

## gmx x2top: 根据坐标生成原始拓扑文件(翻译: 阮洋)

	gmx x2top [-f [<.gro/.g96/...>]] [-o [<.top>]] [-r [<.rtp>]] [-nice ]
			  [-ff ] [-[no]v] [-nexcl ] [-[no]H14] [-[no]alldih]
			  [-[no]remdih] [-[no]pairs] [-name ] [-[no]pbc] [-[no]pdbq]
			  [-[no]param] [-[no]round] [-kb ] [-kt ] [-kp ]

`gmx x2top`可以根据坐标文件生成原始的拓扑文件. 当根据原子名称和键的数目定义杂化状态时, 程序会假定所有的氢原子都出现在构型中. 这个程序也可以生成`.rtp`文件中的条目, 你可以将它们添加到力场目录下的`.rtp`数据库中.

当设置了`-param`选项的时候, 所有相互作用的平衡距离, 键角和力常数都会写入拓扑中的相应位置. 平衡距离和键角由输入坐标得到, 力常数根据命令行选项设定. 目前支持的力场主要有以下几类:

- G53a5: GROMOS96 53a5力场(官方发布)
- oplsaa: OPLS-AA/L 全原子力场(2001氨基酸二面角版本)

使用`gmx x2top`时需要一个对应的`.n2t`文件, 它位于力场库目录下, 名称为`atomname2type.n2t`. 该文件的格式在手册的第五章有详细介绍. 默认情况下, 力场的选择是交互式的, 但可以使用`-ff`选项在命令行中指定上面力场的简短名称. 在这种情况下, `gmx x2top`会到指定的力场目录下查找对应的文件.

<table id='tab-185'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.gro/.g96/...>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">conf.gro</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">结构文件: gro g96 pdb brk ent esp tpr tpb tpa</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.top>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出拓扑文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-r [&lt;.rtp>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.rtp</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">pdb2gmx使用的残基类型文件</td>
</tr>
</table>

<table id='tab-186'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-ff  &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">oplsaa</td>
  <td rowspan="1" colspan="1" style="text-align:left;">模拟使用的力场, 默认OPLS-AA力场. 键入<code>select</code>以交互式的进行选择</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]v</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在<code>top</code>文件中输出详细的生成信息</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nexcl &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">3</td>
  <td rowspan="1" colspan="1" style="text-align:left;">相互作用排除数</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]H14</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对氢原子使用第3个近邻相互作用</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]alldih</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">生成所有恰当二面角</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]remdih</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">去除同一键上的不当二面角</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pairs</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在拓扑文件中输出1-4相互作用(原子对)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-name &lt;string></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ICE</td>
  <td rowspan="1" colspan="1" style="text-align:left;">指定分子名称, 默认使用ICE</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pbc</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用周期性边界条件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]pdbq</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">使用<code>.pdb</code>文件提供的B因子作为原子电荷(前提是输入文件格式为<code>.pdb</code>)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]param</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将参数输出到拓扑文件中</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]round</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将测量值进行四舍五入</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-kb &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">400000</td>
  <td rowspan="1" colspan="1" style="text-align:left;">键的力常数, 单位kJ/mol/nm^2^</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-kt &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">400</td>
  <td rowspan="1" colspan="1" style="text-align:left;">键角的力常数, 单位kJ/mol/rad^2^</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-kp &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">5</td>
  <td rowspan="1" colspan="1" style="text-align:left;">二面角的力常数, 单位kJ/mol/rad^2^</td>
</tr>
</table>

### 已知问题

- 原子类型的选择方法很原始, 没有使用化学信息.
- 周期性边界条件会卷曲键
- 不会生成不当二面角
- 原子到原子类型的转换表不完整(数据目录下的`atomname2type.n2t`文件). 请扩展此文件并将其提供给GROMACS团队.

### 补充说明

理论上只要能在对应的力场中找到构型中的各个原子类型, 那么`gmx x2top`可以支持所有GROMACS的力场. 当然输出的原始拓扑文件需要进行很多修改, 因此在使用此工具需要对拓扑文件足够熟悉.

## gmx xpm2ps: 将XPM(XPixelMap)矩阵转换为postscript或XPM(翻译: 黄丽红)

	gmx xpm2ps [-f [<.xpm>]] [-f2 [<.xpm>]] [-di [<.m2p>]] [-do [<.m2p>]]
			   [-o [<.eps>]] [-xpm [<.xpm>]] [-nice ] [-[no]w] [-[no]frame]
			   [-title ] [-[no]yonce] [-legend ] [-diag ]
			   [-size ] [-bx ] [-by ] [-rainbow ]
			   [-gradient ] [-skip ] [-[no]zeroline]
			   [-legoffset ] [-combine ] [-cmin ] [-cmax ]

`gmx xpm2ps`能够将XPM(XPixelMap)矩阵文件转换为漂亮的颜色映射图. 只要提供了正确的矩阵格式, 还可以显示标签和坐标轴. 矩阵数据可以通过一些程序得到, 如`gmx do_dssp`, `gmx rms`或`gmx mdmat`.

可以选择性的使用`-di`选项提供`.m2p`文件, 里面包含了设定的参数, 并提供了合理的默认值. Y轴的默认设置与X轴相同. 字体名称的默认等级为: 标题字体 -> 图例字体; 标题字体 -> (x字体 -> y字体 -> y刻度字体) -> x刻度字体, 例如, 设置标题字体相当于设置了所有字体, 设置x轴字体相对于设置了y轴字体, y刻度字体和x刻度字体.

未提供`.m2p`文件时, 可以通过命令行选项设定多数设置. 其中最重要的选项是`-size`, 它以postscript的单位设定了整个矩阵的大小. 此选项也可以使用`-bx`和`-by`选项(以及`.m2p`文件中的相应参数)覆盖, 它们设定了单个矩阵元素的大小.

使用`-f2`选项可以提供第二个矩阵文件. 程序会同时读取两个矩阵文件, 并绘制出第一个矩阵(`-f`)的左上半部分与第二个矩阵(`-f2`)的右下半部分. 对角部分的值来自由`-diag`选项选择的矩阵文件. 将选项`-diag`设置为`none`可以不显示对角线上的值. 在这种情况下, 会生成一个新的颜色映射图, 其中红和蓝的渐变色分别代表负值和正值. 如果两个矩阵的颜色代码和图例标签完全相同, 那么只会显示一个图例说明, 否则会显示两个分开的图例说明. 使用`-combine`选项可以选择另外的操作, 以将矩阵进行组合. 输出值的范围会自动设置为组合矩阵的实际范围, 但可以使用`-cmin`和`-cmax`选项来覆盖所用的范围.

`-title`可设置为`none`以忽略标题, 或设置为`ylabel`以便在Y轴标签位置显示标题(平行于Y轴).

使用`-rainbow`选项可以将暗色的灰度矩阵变成更吸引人的彩色图片.

使用`-xpm`选项可以将溶合或彩虹映射的矩阵输出到XPixelMap文件.

<table id='tab-187'><caption>输入/输出文件选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">root.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入</td>
  <td rowspan="1" colspan="1" style="text-align:left;">XPixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-f2 [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">root2.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输入, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-di [&lt;.m2p>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">ps.m2p</td>
  <td rowspan="1" colspan="1" style="text-align:center;">输入, 可选, 库</td>
  <td rowspan="1" colspan="1" style="text-align:left;">`mat2ps`的输入文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-do [&lt;.m2p>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">out.m2p</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">`mat2ps`的输入文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-o [&lt;.eps>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">plot.eps</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">封装的PostScript(tm)文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-xpm [&lt;.xpm>]</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">root.xpm</td>
  <td rowspan="1" colspan="1" style="text-align:left;">输出, 可选</td>
  <td rowspan="1" colspan="1" style="text-align:left;">XPixMap兼容的矩阵文件</td>
</tr>
</table>

<table id='tab-188'><caption>控制选项</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">选项</th>
  <th rowspan="1" colspan="1" style="text-align:center;">默认值</th>
  <th rowspan="1" colspan="1" style="text-align:center;">说明</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-nice &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">设置优先级</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]w</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">程序结束自动打开输出的.xvg, .xpm, .eps和.pdb文件</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]frame</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">yes</td>
  <td rowspan="1" colspan="1" style="text-align:left;">显示帧, 刻度, 标签, 标题, 图例</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-title &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">top</td>
  <td rowspan="1" colspan="1" style="text-align:left;">显示标题的位置: top, once, ylabel, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]yonce</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">y轴标签只显示一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-legend &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">both</td>
  <td rowspan="1" colspan="1" style="text-align:left;">显示图例说明: both, first, second, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-diag &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">first</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对角元素: first, second, none</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-size &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">400</td>
  <td rowspan="1" colspan="1" style="text-align:left;">矩阵的水平尺寸, ps单位</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-bx &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">元素的x大小, 覆盖<code>-size</code>选项(当未设置<code>-by</code>时还会覆盖y大小)</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-by &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">元素的y大小</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-rainbow &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">彩虹颜色, 将白色转成为: no, blue, red</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-gradient &lt;vector></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0 0 0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">将颜色映射重新标度为平滑的渐变, 从白色{1,1,1}到{r,g,b}</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-skip &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">1</td>
  <td rowspan="1" colspan="1" style="text-align:left;">每nr行和nr列输出一次</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-[no]zeroline</code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">no</td>
  <td rowspan="1" colspan="1" style="text-align:left;">在<code>.xpm</code>矩阵中坐标轴标签为零的位置插入一条线</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-legoffset &lt;int></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">对图例, 忽略<code>.xpm</code>文件中的前N个颜色</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-combine &lt;enum></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">halves</td>
  <td rowspan="1" colspan="1" style="text-align:left;">组合两个矩阵: halves, add, sub, mult, div</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cmin &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">组合输出的最小值</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:left;"><code>-cmax &lt;real></code></td>
  <td rowspan="1" colspan="1" style="text-align:right;">0</td>
  <td rowspan="1" colspan="1" style="text-align:left;">组合输出的最大值</td>
</tr>
</table>

### 补充说明

The m2p file format contains input options for the xpm2ps program. All of these options are very easy to comprehend when you look at the PosScript(tm) output from xpm2ps.

	; Command line options of xpm2ps override the parameters in this file
	black&white              = no           ; Obsolete
	titlefont                = Times-Roman  ; A PostScript Font
	titlefontsize            = 20           ; Font size (pt)
	legend                   = yes          ; Show the legend
	legendfont               = Times-Roman  ; A PostScript Font
	legendlabel              =              ; Used when there is none in the .xpm
	legend2label             =              ; Used when merging two xpm's
	legendfontsize           = 14           ; Font size (pt)
	xbox                     = 2.0          ; x-size of a matrix element
	ybox                     = 2.0          ; y-size of a matrix element
	matrixspacing            = 20.0         ; Space between 2 matrices
	xoffset                  = 0.0          ; Between matrix and bounding box
	yoffset                  = 0.0          ; Between matrix and bounding box
	x-major                  = 20           ; Major ticks on x axis every .. frames
	x-minor                  = 5            ; Id. Minor ticks
	x-firstmajor             = 0            ; First frame for major tick
	x-majorat0               = no           ; Major tick at first frame
	x-majorticklen           = 8.0          ; x-majorticklength
	x-minorticklen           = 4.0          ; x-minorticklength
	x-label                  =              ; Used when there is none in the .xpm
	x-fontsize               = 16           ; Font size (pt)
	x-font                   = Times-Roman  ; A PostScript Font
	x-tickfontsize           = 10           ; Font size (pt)
	x-tickfont               = Helvetica    ; A PostScript Font
	y-major                  = 20
	y-minor                  = 5
	y-firstmajor             = 0
	y-majorat0               = no
	y-majorticklen           = 8.0
	y-minorticklen           = 4.0
	y-label                  =
	y-fontsize               = 16
	y-font                   = Times-Roman
	y-tickfontsize           = 10
	y-tickfont               = Helvetica
