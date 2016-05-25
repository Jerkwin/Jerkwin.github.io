---
 layout: post
 title: GROMACS教程：GROMACS入门
 categories:
 - 科
 tags:
 - GMX
---

* toc
{:toc}


<ul class="incremental">
<li><a href="http://manual.gromacs.org/online/getting_started.html">原始文档 Getting Started</a></li>
</ul>

## 介绍

<p>在本章中, 我们假定读者熟悉分子动力学, 熟悉Unix的基本使用, 包括使用文本编辑器, 如<code>jot</code>, <code>emacs</code>的<code>vi</code>. 我们还假定系统上已正确安装了GROMACS软件. 当你看到这样一行</p>

<p><code>ls -l</code></p>

<p>你应该在你的计算机上输入行中的内容.</p>

### 设置环境

<p>为了检查你是否能使用GROMACS软件, 请输入以下命令:</p>

<p><code>mdrun -version</code></p>

<p>该命令应打印出已安装的Gromacs的版本信息. 如果返回的是</p>

<pre><code>mdrun: command not found.
</code></pre>

<p>那么你必须确认GROMACS安装的位置. 默认情况下, GROMACS的应用程序位于&#8216;/usr/local/gromacs/bin&#8217;.
但是, 你可以咨询机器的系统管理员了解更多信息.
如果假定GROMACS的安装目录为<code>XXX</code>, 你会在<code>XXX/bin</code>目录中找到可执行文件(程序).
为了能够使用这些程序, 你必须编辑所用shell的登录文件.
如果你使用C shell, 此文件被称为<code>.cshrc</code>或<code>.tcshrc</code>, 位于你的home目录. 在此文件中添加下面的内容:</p>

<pre><code>`source XXX/bin/GMXRC`
</code></pre>

<p>并在提示符下执行此命令, 或退出并再次登录系统以便自动使设置生效. 现在应该已经设置了环境变量GMXDATA, 我们以后会用到它. 让我们检查是否已经设置成功, 执行:</p>

<p><code>echo $GMXDATA</code></p>

<p>如果输出了你设置的目录名, 就成功了. 否则的话, 重复上面的步骤.</p>

## GROMACS文件

<p>下面是你将在教程中遇到的最重要的GROMACS文件类型的简要说明.</p>

<ul class="incremental">
<li><p>分子拓扑文件(<code>.top</code>)</p>

<p>分子拓扑文件由<code>gmx pdb2gmx</code>程序生成. <code>gmx pdb2gmx</code>程序可将任何多肽或蛋白质的pdb结构文件转换为分子拓扑文件. 拓扑文件完整地描述了多肽或蛋白质中的所有相互作用.</p></li>
<li><p>分子结构文件(<code>.gro</code>, <code>.pdb</code>)</p>

<p>当使用<code>gmx pdb2gmx</code>程序产生分子拓扑时, 它也会将结构文件(<code>.pdb</code>文件)转换为GROMOS结构文件(<code>.gro</code>文件).
pdb文件与gromos文件的主要区别在于格式, 此外<code>.gro</code>文件还可以包含速度. 但是, 如果不需要速度, 你可以在所有程序中使用pdb文件. 为在盒子中产生多肽周围的溶剂分子, 可使用<code>gmx solvate</code>程序.
首先应使用<code>gmx editconf</code>程序定义分子周围适当大小的盒子. <code>gmx solvate</code>将溶质分子(多肽)放入任意溶剂中(在这种情况下, 溶剂是水). <code>gmx solvate</code>会输出一个gromos结构文件, 其中的多肽溶解在水中. <code>gmx solvate</code>程序也会改变分子拓扑文件(由<code>gmx pdb2gmx</code>产生)以添加溶剂到拓扑中.</p></li>
<li><p>分子动力学参数文件(<code>.mdp</code>)</p>

<p>分子动力学参数(<code>.mdp</code>, Molecular Dynamics Parameter)文件包含了与分子动力学模拟本身有关的所有信息, 如时间步长, 积分步数, 温度, 压力等. 得到这种文件的最简单方法是修改示例的<code>.mdp</code>文件. 你可以在这里找到一个<a href="http://manual.gromacs.org/online/mdp.html">示例mdp文件</a>.</p></li>
<li><p>索引文件(<code>.ndx</code>)</p>

<p>有时你可能需要一个索引文件来指定对原子组的作用(如温度耦合, 加速度, 冻结). 通常情况下, 使用默认的索引组就够了, 因此在这个演示中, 我们不考虑使用索引文件.</p></li>
<li><p>运行输入文件(<code>.tpr</code>)</p>

<p>下一步是将分子结构(<code>.gro</code>文件), 拓扑(<code>.top</code>文件), MD参数(<code>.mdp</code>文件)和(可选的)索引文件(<code>ndx</code>)组合起来以生成运行输入文件(扩展名为<code>.tpr</code>, 也可以为<code>.tpb</code>, 如果你没有XDR的话). 此文件包含了GROMACS启动模拟所需的全部信息. <code>gmx grompp</code>程序会处理所有输入文件并生成运行输入<code>.tpr</code>文件.</p></li>
<li><p>轨迹文件(<code>.trr</code>)</p></li>
</ul>

<p>一旦准备好了运行输入文件, 我们就可以开始进行模拟了. 启动模拟的程序被称为<code>gmx mdrun</code>, 它需要的唯一输入文件是运行输入文件(<code>.tpr</code>文件). <code>gmx mdrun</code>的输出文件是轨迹文件(<code>.trr</code>文件, 或<code>.trj</code>, 如果你没有XDR的话)和日志文件(<code>.log</code>文件).</p>

<p>更多信息请参考下面的使用流程(以快速了解)和GROMACS常见问题.</p>

## 参考

<ol class="incremental">
<li>Berendsen, H.J.C., Postma, J.P.M., van Gunsteren, W.F., Hermans, J. (1981)<br/>
Intermolecular Forces, chapter Interaction models for water in relation to protein hydration, pp 331&#8211;342. Dordrecht: D. Reidel Publishing Company Dordrecht</li>
<li>Kabsch, W., Sander, C. (1983).<br/>
Dictionary of protein secondary structure: Pattern recognition of hydrogen-bonded and geometrical features. Biopolymers 22, 2577&#8211;2637.</li>
<li>Mierke, D.F., Kessler, H. (1991).<br/>
Molecular dynamics with dimethyl sulfoxide as a solvent. Conformation of a cyclic hexapeptide. J. Am. Chem. Soc. 113, 9446.</li>
<li>Stryer, L. (1988).<br/>
Biochemistry vol. 1, p. 211. New York: Freeman, 3 edition.</li>
</ol>
