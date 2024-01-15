---
 layout: post
 title: AMBER教程C3：CPPTRAJ中的主成分分析
 categories:
 - 科
 tags:
 - amber
---

- Thomas E. Cheatham III, Daniel R. Roe & Rodrigo Galindo-Murillo, AMBER 2015伦敦学术沙龙 分析入门: 主成分分析简介 [原始文档](http://www.amber.utah.edu/AMBER-workshop/London-2015/pca/)
- 2018-04-04 21:25:04 翻译: 席昆(武汉大学)

本教程将使用[`CPPTRAJ`](http://pubs.acs.org/doi/abs/10.1021/ct400341p)中的主成分分析(PCA, principal component analysis )来研究序列为`d(GCACGAACGAACGAACGC)`的36-mer双链DNA. 为检查是否在不同硬件下DNA模拟计算都能得到相似的构象空间, 本教程将在GPU模拟计算一条轨迹, 剩余轨迹在CPU上模拟得到. 教程中所处理轨迹为示例用, 完整的数据可在此网址(<http://amber.utah.edu/DNA-dynamics>)下载.

本工作的相关文献如下:

- R Galindo-Murillo, DR Roe, and TE Cheatham, III. "Convergence and reproducibility in molecular dynamics simulations of the DNA duplex d(GCACGAACGAACGAACGC)." Biochimica Biophys. Acta 1850, 1041-1058 (2015). doi: 10.1016/j.bbagen.2014.09.007. [BBAGEN link](http://www.sciencedirect.com/science/article/pii/S0304416514003092)
- R Galindo-Murillo, DR Roe, and TE Cheatham, III. "On the absence of intrahelical DNA dynamics on the μs to ms timescale." Nature Commun. 5:5152 (2014) doi: 10.1038/ncomms6152. [Nature Commun. link](http://www.nature.com/ncomms/2014/141029/ncomms6152/full/ncomms6152.html)

## 关于PCA的简介

PCA是在完整的正交矢量集上将一系列得到的坐标变化信息进行分解投影, 而这些正交矢量集称为主成分(principle components, PCs). 从某方面讲, 主成分(PCs)可以认为是分离提取结果某种变化的一种方式. 如果输入的是笛卡尔坐标系下的数据, 那么主成分(PC)就是用来提取坐标空间中的变化. 主成分分析得到的第一个主成分, 即所得结果中出现最多的变化, 第二个主成分即所得结果中第二多的变化, 依次得到其他的主成分. 本教程中PCA分析的输入是随时间变化的三维空间坐标的协方差矩阵, 因此得到的主成分代表的就是系统中确定的运动模式, 其主导运动模式即为第一个主成分模式.

需要谨记的很重要的一点, 虽然主成分在探究系统动力学很有效, 但本教程中系统真实的运动模式几乎往往是几种主成分的叠加. 因此, 如果某一个主成分的运动模式会使得看到相变的结果, 但这并不代表实际系统中也有这种相变发生.

## 第一步: 计算坐标的协方差矩阵

根据上述介绍, PCA的输入将会是坐标协方差矩阵. 而矩阵中每一项是系统中原子X,Y,Z方向坐标分量的协方差, 因此最终将得到[3*所选原子数]×[3*所选原子数]大小的矩阵. 这表示要想得到正确的矩阵结果, 我们所输入的计算协方差矩阵的构象数目与矩阵的行数或列数相同(即3*所选原子数).

接下来将使用脚本: [`pca-cpu-gpu.cpptraj`](http://www.amber.utah.edu/AMBER-workshop/London-2015/pca/pca-cpu-gpu.cpptraj)进行计算. 由于不同轨迹的原子数目可能不同, 因此需要单独读入拓扑文件(prmtop), 再通过[name]命令来特别给轨迹的拓扑文件设定标记名或者文件名: [`cpu/cpu.prmtop`](http://www.amber.utah.edu/AMBER-workshop/London-2015/pca/cpu/cpu.prmtop), [`gpu/gpu.prmtop`](http://www.amber.utah.edu/AMBER-workshop/London-2015/pca/gpu/gpu.prmtop)

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">parm</span> cpu/cpu.prmtop [cpu]
<span style="color:#A2F">parm</span> gpu/gpu.prmtop [gpu]
</pre></div>

拓扑文件`cpu/cpu.prmtop`可以用[cpu]来指代. 读入拓扑文件后, 接下来要读入与拓扑文件相对应的轨迹文件. 下面的例子中, 每个轨迹有10001个构象, 总的就会有20002个构象, 其中前10001个构象是在cpu计算模拟得到的, 从10002到20002则是在gpu计算模拟得到.

[`cpu/cpu.nc`](http://www.amber.utah.edu/AMBER-workshop/London-2015/pca/cpu/cpu.nc), [`gpu/gpu.nc`](http://www.amber.utah.edu/AMBER-workshop/London-2015/pca/gpu/gpu.nc)

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">trajin</span> cpu/cpu.nc parm [cpu]
<span style="color:#A2F">trajin</span> gpu/gpu.nc parm [gpu]
</pre></div>

如果现在只计算上述完全未经处理的轨迹文件的坐标协方差矩阵, 那么我们得到的结果不单会有系统自身内部运动的信息, 还会有系统整体的转动与平动信息. 但从目前来说, 我们只关注内部运动的信息, 因此就需要通过与参考结构先进行RMS最优拟合以移除系统的转动与平动, 此例中的参考结构将选为轨迹的平均结构. 而为产生平均坐标信息, 首先要将除氢原子外的DNA其他原子通过RMS拟合到共同的结构上, 即轨迹的第一个结构.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">rms</span> first :1-36&!@H=
</pre></div>

接下来通过对所有构象进行处理, 产生并保存一个名为`cpu-gpu-average`的平均结构, 并在后续作为分析用的参考结构. 注意, 如果我们需要, 可以将平均结构的输出坐标格式保存为任何CPPTRAJ支持的文件类型.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">average</span> crdset cpu-gpu-average
</pre></div>

CPPTRAJ内有数据集的说明, 可以支持多种数据格式的数据集保存. 下面我们创建一个坐标数据集来保存所有构象. 这样我们就不需要再从磁盘读入轨迹, 而能直接分析处理数据. 这里我们指定读取的构象坐标集名为: `cpu-gpu-trajectories`.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">createcrd</span> cpu-gpu-trajectories
</pre></div>

上述所有的命令将产生作为参考结构的轨迹平均结构. 但要执行这些命令, 我们需要在不退出程序下, 再输入run命令来运行.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">run</span>
</pre></div>

现在, 我们有了平均结构`cpu-gpu-average`以及保存的输入轨迹的坐标信息. 接下来就要将保存的轨迹坐标信息与参考结构进行RMS拟合, 以移除分子的转动与平动变化. 这些需要crdaction指令完成.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">crdaction</span> cpu-gpu-trajectories rms ref cpu-gpu-average :1-36&!@H=
</pre></div>

接下来我们用matrix指令得到坐标协方差矩阵, 并命名为`cpu-gpu-covar`.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">crdaction</span> cpu-gpu-trajectories matrix covar \
  <span style="color:#A2F">name</span> cpu-gpu-covar :1-36&!@H=
</pre></div>

注意第一行末尾的右斜线 \ 表示本行的部分信息接在下面一行, 这可以很方便的使复杂的输入指令更加容易理解.

## 第二步: 计算出主成分和坐标映射

现在有了协方差矩阵, 我们可以在对角化之后得到主成分信息(PCs), 即为特征矢量(即PCs)和特征值(每个PC的权重). 开始计算并完成后, 我们将得到起主导的前三位特征矢量:

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">runanalysis</span> diagmatrix cpu-gpu-covar out cpu-gpu-evecs.dat \
    <span style="color:#A2F">vecs</span> 3 name myEvecs \
    <span style="color:#A2F">nmwiz</span> nmwizvecs 3 nmwizfile dna.nmd nmwizmask :1-36&!@H=
</pre></div>

这里的runanalysis指令直接调用CPPTRAJ的diagmatrix程序, 从而避免在Analysis中再调用diagmatrix. 而nmviz与后面的关键词可以产生由VMD中的nmwiz插件查看的主成分分析结果.

只要上述指令完成, 输出文件`cpu-gpu-evecs.dat`和数据集`myEvecs`中将包含特征矢量(PCs)和特征值(这些数据集合并后用`eigenmode data`指代). 将所得结果写入到可以重复读取的文件是非常有用的, 这样可以方便进一步的分析. 接下来就是将轨迹坐标变化映射到PCs, 得到每一个构象变化在每一种主成分上相符的不同程度. 我们可以将原始的两个轨迹(cpu和gpu)进行单独处理, 这样可以得到不同轨迹的运动与主成分之间相符的程度. __注意非常关键的一点, 此处进行映射的构象与产生坐标协方差矩阵所用的构象是相同的.__ 本例中, 前面曾保存在数据集中的构象就可以直接用来分析. 同时很有必要注意的一点, 计算协方差矩阵所选定的原子也应用来进行轨迹映射分析.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">crdaction</span> cpu-gpu-trajectories projection CPU modes myEvecs \
  <span style="color:#A2F">beg</span> 1 end 3 :1-36&!@H= crdframes 1,10001
<span style="color:#A2F">crdaction</span> cpu-gpu-trajectories projection GPU modes myEvecs \
  <span style="color:#A2F">beg</span> 1 end 3 :1-36&!@H= crdframes 10002,last
</pre></div>

本例中, 从cpu和gpu的轨迹中映射处理后得到的结果分别取名为`CPU`和`GPU`. 只要这些映射结果得到后, 我们就可对每根轨迹映射结果的前三个的直方图进行归一化处理, 最后再输入run指令运行这些处理指令.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">hist</span> CPU:1 bins 100 out cpu-gpu-hist.agr norm name CPU-1
<span style="color:#A2F">hist</span> CPU:2 bins 100 out cpu-gpu-hist.agr norm name CPU-2

<span style="color:#A2F">hist</span> CPU:3 bins 100 out cpu-gpu-hist.agr norm name CPU-3
<span style="color:#A2F">hist</span> GPU:1 bins 100 out cpu-gpu-hist.agr norm name GPU-1
<span style="color:#A2F">hist</span> GPU:2 bins 100 out cpu-gpu-hist.agr norm name GPU-2
<span style="color:#A2F">hist</span> GPU:3 bins 100 out cpu-gpu-hist.agr norm name GPU-3

<span style="color:#A2F">run</span>
</pre></div>
数据集最后的标示(例如: `:1`)指的是对应的主成分, 因此`CPU: 1`就是指CPU映射结果得到的第一主导的主成分, 其他类似.

## 第三步: 主成分运动模式可视化

现在完成了分析, 我们可以运行clear all指令以删除所有缓存于内存的数据, 以确保在无任何其他干扰的状态完成下一步的分析.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">clear</span> all
</pre></div>

下一步就是特征运动模式对应的涨落变化可视化. 为实现此目的, 我们用readdata指令读入之前产生的特征矢量的文件.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">readdata</span> cpu-gpu-evecs.dat name Evecs
</pre></div>

读入拓扑文件并进行修改, 使得它与计算坐标协方差矩阵(和后来的特征矢量)的拓扑结构相符合.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">parm</span> cpu/cpu.prmtop
<span style="color:#A2F">parmstrip</span> !(:1-36&!@H=)
<span style="color:#A2F">parmwrite</span> out cpu-gpu-modes.prmtop
</pre></div>

创建在第一个主导的PC下的NetCDF格式的赝运动轨迹文件, 其最小和最大值可以通过PC映射结果的直方图来选择.

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">runanalysis</span> modes name Evecs trajout cpu-gpu-mode1.nc \
  <span style="color:#A2F">pcmin</span> <span style="color:#666">-100</span> pcmax 100 tmode 1 trajoutmask :1-36&!@H= trajoutfmt netcdf
</pre></div>

现在你可以在Chimera/VMD中打开文件, 观察第一个主导PC的运动模式的视频, `cpu-gpu-modes.prmtop`和`cpu-gpu-modes.nc`.
