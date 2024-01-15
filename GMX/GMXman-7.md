---
 layout: post
 title: GROMACS中文手册：第七章　运行参数和程序
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}


## 7.1 在线和HTML手册

<p>本章所有的信息都可以在GROMACS数据目录下的HTML文件中找到. 文件的路径取决于文件的安装位置, 默认位置是<code>/usr/local/gromacs/share/gromacs/html/online.html</code>. 如果你使用Linux安装包进行安装, 通常可以在<code>/usr/share/gromacs/html/online.html</code>找到. 你也可以使用GROMACS网站的在线手册, 其网址为<a href="http://manual.gromacs.org/current">http://manual.gromacs.org/current</a>.</p>

<p>此外, 我们为所有程序都安装了标准的UNIX手册页. 如果你用<code>source</code>命令执行了主机上GROMACS二进制目录下的<code>GMXRC</code>脚本, 这些手册页应该已经出现在<code>MANPATH</code>环境变量中了, 而且你应该能够通过键入如<code>man gmx-grompp</code>之类的命令进行查看. 你也可以通过在命令行中使用<code>-h</code>标识(如<code>gmx grompp -h</code>)看到同样的信息, 你还可以使用<code>gmx help grompp</code>之类的命令. 所有程序的列表可从<code>gmx help</code>获得.</p>

## 7.2 文件类型

<p>表7.1列出了GROMACS使用的文件类型及其简短说明, 你可以在HTML参考手册或其在线版本中找到每类文件更加详细的说明.
如果系统的XDR库中存在配置脚本, GROMACS 1.6或更高版本可在任何架构上读取XDR格式的GROMACS文件, 这些文件应该永远存放于UNIX系统下, 因为它们必须要有NFS的支持.</p>

<table><caption>表7.1: GROMACS的文件类型</caption>
<tr>
<th style="text-align:center;"> 默认名称.扩展名 </th>
<th style="text-align:center;">类型</th>
<th style="text-align:center;"> 默认选项 </th>
<th style="text-align:center;">说明</th>
</tr>
<tr>
<td style="text-align:center;"> atomtp.atp      </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">pdb2gm使用的原子类型文件</td>
</tr>
<tr>
<td style="text-align:center;"> eiwit.brk       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -f </td>
<td style="text-align:center;">Brookhaven资料库文件</td>
</tr>
<tr>
<td style="text-align:center;"> state.cpt       </td>
<td style="text-align:center;">xdr</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">检查点文件</td>
</tr>
<tr>
<td style="text-align:center;"> nnnice.dat      </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">通用数据文件</td>
</tr>
<tr>
<td style="text-align:center;"> user.dlg        </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">ngmx对话框数据</td>
</tr>
<tr>
<td style="text-align:center;"> sam.edi         </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">ED抽样输入</td>
</tr>
<tr>
<td style="text-align:center;"> sam.edo         </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">ED抽样输出</td>
</tr>
<tr>
<td style="text-align:center;"> ener.edr        </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">通用能量: edr ene</td>
</tr>
<tr>
<td style="text-align:center;"> ener.edr        </td>
<td style="text-align:center;">xdr</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">便携xdr格式的能量文件</td>
</tr>
<tr>
<td style="text-align:center;"> ener.ene        </td>
<td style="text-align:center;">Bin</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">能量文件</td>
</tr>
<tr>
<td style="text-align:center;"> eiwit.ent       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -f </td>
<td style="text-align:center;">蛋白质数据库条目</td>
</tr>
<tr>
<td style="text-align:center;"> plot.eps        </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">EPS(tm)文件</td>
</tr>
<tr>
<td style="text-align:center;"> conf.esp        </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -c </td>
<td style="text-align:center;">ESPResSo格式的坐标文件</td>
</tr>
<tr>
<td style="text-align:center;"> conf.g96        </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -c </td>
<td style="text-align:center;">Gromos-96格式的坐标文件</td>
</tr>
<tr>
<td style="text-align:center;"> conf.gro        </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -c </td>
<td style="text-align:center;">Gromos-87格式的坐标文件</td>
</tr>
<tr>
<td style="text-align:center;"> conf.gro        </td>
<td style="text-align:center;"></td>
<td style="text-align:center;"> -c </td>
<td style="text-align:center;">结构: gro g96 pdb esp tpr tpb tpa</td>
</tr>
<tr>
<td style="text-align:center;"> out.gro         </td>
<td style="text-align:center;"></td>
<td style="text-align:center;"> -o </td>
<td style="text-align:center;">结构: gro g96 pdb esp`</td>
</tr>
<tr>
<td style="text-align:center;"> polar.hdb       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">氢数据库</td>
</tr>
<tr>
<td style="text-align:center;"> topinc.itp      </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">拓扑结构头文件</td>
</tr>
<tr>
<td style="text-align:center;"> run.log         </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -l </td>
<td style="text-align:center;">日志文件</td>
</tr>
<tr>
<td style="text-align:center;"> ps.m2p          </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">mat2ps输入文件</td>
</tr>
<tr>
<td style="text-align:center;"> ss.map          </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">矩阵数据到颜色的映射文件</td>
</tr>
<tr>
<td style="text-align:center;"> ss.mat          </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">矩阵数据文件</td>
</tr>
<tr>
<td style="text-align:center;"> grompp.mdp      </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -f </td>
<td style="text-align:center;">含MD参数的grompp输入文件</td>
</tr>
<tr>
<td style="text-align:center;"> hessian.mtx     </td>
<td style="text-align:center;">Bin</td>
<td style="text-align:center;"> -m </td>
<td style="text-align:center;">Hessian矩阵</td>
</tr>
<tr>
<td style="text-align:center;"> index.ndx       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -n </td>
<td style="text-align:center;">索引文件</td>
</tr>
<tr>
<td style="text-align:center;"> hello.out       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -o </td>
<td style="text-align:center;">通用输出文件</td>
</tr>
<tr>
<td style="text-align:center;"> eiwit.pdb       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -f </td>
<td style="text-align:center;">蛋白质数据库文件</td>
</tr>
<tr>
<td style="text-align:center;"> residue.rtp     </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">pdb2gmx使用的残基类型文件</td>
</tr>
<tr>
<td style="text-align:center;"> doc.tex         </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -o </td>
<td style="text-align:center;">LaTex文件</td>
</tr>
<tr>
<td style="text-align:center;"> topol.top       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -p </td>
<td style="text-align:center;">拓扑结构文件</td>
</tr>
<tr>
<td style="text-align:center;"> topol.tpb       </td>
<td style="text-align:center;">Bin</td>
<td style="text-align:center;"> -s </td>
<td style="text-align:center;">二进制运行的输入文件</td>
</tr>
<tr>
<td style="text-align:center;"> topol.tpr       </td>
<td style="text-align:center;"></td>
<td style="text-align:center;"> -s </td>
<td style="text-align:center;">通用运行输入文件: tpr tpb tpa</td>
</tr>
<tr>
<td style="text-align:center;"> topol.tpr       </td>
<td style="text-align:center;"></td>
<td style="text-align:center;"> -s </td>
<td style="text-align:center;">结构+质量(db): tpr tpb tpa gro g96 pdb</td>
</tr>
<tr>
<td style="text-align:center;"> topol.tpr       </td>
<td style="text-align:center;">xdr</td>
<td style="text-align:center;"> -s </td>
<td style="text-align:center;">便携式xdr运行输入文件</td>
</tr>
<tr>
<td style="text-align:center;"> traj.trj        </td>
<td style="text-align:center;">Bin</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">轨迹文件(特定机器架构下的)</td>
</tr>
<tr>
<td style="text-align:center;"> traj.trr        </td>
<td style="text-align:center;"></td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">全精度轨迹: trr trj cpt</td>
</tr>
<tr>
<td style="text-align:center;"> traj.trr        </td>
<td style="text-align:center;">xdr</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">便携xdr格式的轨迹</td>
</tr>
<tr>
<td style="text-align:center;"> root.xpm        </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">X PixMap兼容的矩阵文件</td>
</tr>
<tr>
<td style="text-align:center;"> traj.xtc        </td>
<td style="text-align:center;"></td>
<td style="text-align:center;"> -f </td>
<td style="text-align:center;">轨迹, 输入: xtc trr trj cpt gro g96 pdb</td>
</tr>
<tr>
<td style="text-align:center;"> traj.xtc        </td>
<td style="text-align:center;"></td>
<td style="text-align:center;"> -f </td>
<td style="text-align:center;">轨迹, 输出: xtc trr trj gro g96 pdb</td>
</tr>
<tr>
<td style="text-align:center;"> traj.xtc        </td>
<td style="text-align:center;">xdr</td>
<td style="text-align:center;">    </td>
<td style="text-align:center;">压缩的轨迹(便携xdr格式)</td>
</tr>
<tr>
<td style="text-align:center;"> graph.xvg       </td>
<td style="text-align:center;">Asc</td>
<td style="text-align:center;"> -o </td>
<td style="text-align:center;">xvgr/xmgr文件</td>
</tr>
</table>

## 7.3 运行参数

### 7.3.1 通用参数

<p>参数的默认值在括号中给出. 列表中的第一个选项始终是默认选项. 单位在方括号中给出, 破折号和下划线没有区别. 有一份示例的<code>.mdp</code>文件, 可用于开始一个正常的模拟. 你也可以编辑它以满足特定需求.</p>

### 7.3.2 预处理

<p><code>include</code>:<br/>
在你的拓扑信息中包含特定的目录.<br/>
格式: <code>-I/home/john/mylib -I../otherlib</code></p>

<p><code>define</code>:<br/>
传递给预处理器的预定义, 默认不存在预定义. 你可以在自己定制的拓扑文件中使用任何定义来控制选项. 有以下默认可用的选项:</p>

<ul class="incremental">
<li><p><code>-DFLEXIBLE</code><br/>
告诉<code>grompp</code>在拓扑信息中使用柔性的水模型而不是刚性的水模型, 对简正模式分析有用.</p></li>
<li><p><code>-DPOSRES</code><br/>
告诉<code>grompp</code>在拓扑信息中包括<code>posre.itp</code>, 用于位置限制.</p></li>
</ul>

### 7.3.3 运行控制

<p><code>integerator</code>: (尽管名字的意思是积分方法, 但此参数包括了实际上不属于积分的算法. <code>steep</code>及其下的所有条目都属于此类)</p>

<ul class="incremental">
<li><p><code>md</code><br/>
蛙跳式算法积分牛顿运动方程.</p></li>
<li><p><code>md-vv</code><br/>
速度Verlet算法积分牛顿运动方程. 对从同样轨迹的对应点开始的恒NVE模拟, 此选项将产生与<code>md</code>选项解析等同的轨迹, 但不是二进制完全等同. 由于动能是从整个积分步的速度计算所得, 因此会稍微过高. 这种积分方法的优点是更精确, 使用了基于Trotter展开的可逆的Nose-Hoover和Parrinello-Rahman耦合积分, 以及(略过小)整步的速度输出. 这些优点的代价是额外的计算量, 特别是当使用约束和并行的额外通讯时. 注意, 对几乎所有的模拟<code>md</code>积分方法都足够精确.</p></li>
<li><p><code>md-vv-avek</code><br/>
等同于<code>md-vv</code>的速度Verlet算法, 除了动能是由<code>md</code>积分方法的两半步动能的平均值决定以外, 因而此方法更精确. 当与Nose-Hoover和/或Parrinello-Rahman耦合联用时, 此选项会略微增加计算成本.</p></li>
<li><p><code>sd</code><br/>
准确, 高效的蛙跳式随机动力学积分方法. 使用约束时, 在每积分步, 坐标需要被约束两次. 取决于力的计算成本, 这可能会占用模拟的大部分时间. 一组或多组原子(<code>tc-grps</code>)的温度可通过<code>ref-t</code>[K]设定, 每组的逆摩擦常数通过<code>tau-t</code>[ps]设定. 参数<code>tcoupl</code>被忽略. 随机数发生器使用<code>ld-seed</code>初始化. 当作为恒温器使用时, 2 ps是<code>tau-t</code>的一个适当值, 因为这时的摩擦比水的内摩擦低, 同时摩擦也高到足以除去多余的热量. <strong>注意</strong>: 温度偏差的衰减要比使用相同<code>tau-t</code>的Berendsen恒温器快一倍.</p></li>
<li><p><code>sd2</code><br/>
曾经是默认的SD积分方法, 但现在已过时. 每个坐标每一步需要四个高斯随机数. 使用约束时, 温度会稍微过高.</p></li>
<li><p><code>bd</code><br/>
Brown或位置Langevin动力学的欧拉积分方法, 粒子速度为所受力与摩擦系数(<code>bd-fric</code>[amu ps<sup>-1</sup>])的比值, 再加上随机热噪声(<code>ref-t</code>). 当<code>bd-fric=0</code>时, 每个粒子的摩擦系数由mass/<code>tau-t</code>计算, 与<code>sd</code>积分方法类似. 随机发生器利用<code>ld-seed</code>初始化.</p></li>
<li><p><code>steep</code><br/>
能量最小化的最陡下降算法. 最大步长为<code>emstep</code>[nm], 容差为<code>emtol</code>[kJ mol<sup>-1</sup> nm<sup>-1</sup>].</p></li>
<li><p><code>cg</code><br/>
能量最小化的共轭梯度算法, 容差为<code>emtol</code>[kJ mol<sup>-1</sup> nm<sup>-1</sup>]. 当由<code>nstcgsteep</code>决定的最速下降步骤完成后, 使用CG会更高效. 简正模式分析前进行的最小化需要非常高的精度, 为此, 编译GROMACS时应使用双精度.</p></li>
<li><p><code>l-bfgs</code><br/>
能量最小化的准牛顿算法, 基于低内存需求的Broyden-Fletcher-Goldfarb-Shanno方法, 在实用中, 似乎比共轭梯度法收敛更快, 但是由于必须的校正步骤, 此方法(暂且)不能并行.</p></li>
<li><p><code>nm</code><br/>
对<code>tpr</code>文件中的结构进行简正模式分析. 应该使用双精度编译的GROMACS.</p></li>
<li><p><code>tpi</code><br/>
测试粒子插入. 拓扑结构中的最后一个分子是测试粒子. 需要<code>mdrun</code>的<code>-rerun</code>选项并提供一条轨迹. 这条轨迹不能包含待插入的分子. 每帧中会进行<code>nsteps</code>次插入操作, 插入时分子的位置和取向都是随机的. 当<code>nstlist</code>大于1时, 围绕相同随机位置半径为<code>rtpi</code>的球体进行<code>nstlist</code>次插入, 并使用相同的邻区列表(和相同的长程能量, 若<code>rvdw&gt;rlist</code>或<code>rcoulomb&gt;rlist</code>, 只适用于单原子分子). 因为构造邻区列表很昂贵, 你可以使用同一个列表几乎免费地进行若干次额外的插入. 随机种子由<code>ld-seed</code>设定. 玻尔兹曼加权的温度由<code>ref-t</code>设定, 它应与原始轨迹的模拟温度匹配. tpi正确地考虑了色散校正. 所有相关的量都会写入到由<code>mdrun</code>的<code>-tpi</code>选项指定的文件中. 插入能量的分布会写入到由<code>mdrun</code>的<code>-tpid</code>选项指定的文件中. 不产生轨迹或能量文件. 并行tpi与单节点tpi的结果完全相同. 对于带电分子, 使用密格点的PME最准确, 也很有效, 因为对每一帧系统的势能只需要计算一次.</p></li>
<li><p><code>tpic</code><br/>
测试粒子插入到一个预定义的空腔位置. 步骤与tpi相同, 除了需要从轨迹中读入一个额外的坐标, 作为插入位置. 要被插入分子的中心应位于0,0,0. GROMACS不会为你完成这点, 因为针对不同的情况, 采用不同的方式定心可能更好. 同时, <code>rtpi</code>设置围绕此处球体的半径. 对每一帧只进行一次邻区搜索, 不会使用<code>nstlist</code>. 并行tpic与单节点tpic的结果完全相同.</p></li>
</ul>

<p><code>tinit</code>: (0) [ps]<br/>
运行的起始时间(只对<code>md</code>, <code>sd</code>和<code>bd</code>积分方法有意义)</p>

<p><code>dt</code>: (0.001) [ps]<br/>
积分时间步长(只对<code>md</code>, <code>sd</code>和<code>bd</code>积分器有意义)</p>

<p><code>nsteps</code>: (0)<br/>
积分或最小化的最大步数, &#8211;1意味着不限制步数</p>

<p><code>init-step</code>(0)<br/>
起始步. 第i步的运行时间的计算公式为: t = <code>tinit</code> + <code>dt</code> * (<code>init-step</code> + i). 自由能计算中lambda的计算公式为: lambda=<code>init-lambda</code> + <code>delta-lambda</code> * (<code>init-step</code>+i). 非平衡态MD的参数也依赖于步数. 因此, 为了准确的重新启动或重做部分模拟, 可能需要将<code>init-step</code>设置为重启帧的步数. <code>gmx convert-tpr</code>可自动执行此操作.</p>

<p><code>comm-mode</code></p>

<ul class="incremental">
<li><p><code>Linear</code><br/>
去除质心的平动</p></li>
<li><p><code>Angular</code><br/>
去除去质心的平动以及围绕质心的转动</p></li>
<li><p><code>None</code><br/>
不限制质心的运动</p></li>
</ul>

<p><code>nstcomm</code>: (100) [步]<br/>
去除质心运行的频率</p>

<p><code>comm-grps</code>:<br/>
需要去除质心运动的组, 默认是整个体系</p>

### 7.3.4 Langevin动力学

<p><code>bd-fric</code>: (0) [amu ps<sup>-1</sup>]<br/>
Brown动力学摩擦系数. 当<code>bd-fric=0</code>时, 每个粒子的摩擦系数为其质量与<code>tau-t</code>的比值.</p>

<p><code>ld-seed</code>: (&#8211;1) [整数]<br/>
用于初始化随机和Brown动力学的热噪声随机数发生器. 当<code>ld-seed</code>设置为&#8211;1时, 将使用伪随机种子. 当在多个处理器上运行BD或SD时, 每个处理器使用的种子等于<code>ld-seed</code>加上处理器的编号.</p>

### 7.3.5 能量最小化

<p><code>emtol</code>: (10.0) [kJ mol<sup>-1</sup> nm<sup>-1</sup>]<br/>
当最大的力比这个值小时就认为最小化收敛</p>

<p><code>emstep</code>: (0.01) [nm]<br/>
初始步长大小</p>

<p><code>nstcgsteep</code>: (1000) [步]<br/>
用共轭梯度进行能量最小化时执行一步最速下降的频率</p>

<p><code>nbfgscorr</code>: (10)<br/>
L-BFGS最小化的校正步数. 数值越高(至少理论上)越准确, 但速度更慢.</p>

### 7.3.6 壳层分子动力学

<p>当体系中存在壳层或柔性约束时, 会在每个时间步对壳层的的位置和柔性约束的长度进行优化, 直到在壳层和约束上的力的RMS值小于<code>emtol</code>, 或达到迭代的最大次数(<code>niter</code>)</p>

<p><code>emtol</code>: (10.0) [kJ mol<sup>-1</sup> nm<sup>-1</sup>]<br/>
当最大的力比这个值小时就认为最小化收敛. 对壳层MD这个值最大是1.0, 但由于此变量也用于能量最小化, 所以其默认值为10.0.</p>

<p><code>niter</code>: (20)<br/>
优化壳层位置和柔性约束的最大迭代次数.</p>

<p><code>fcstep</code>: (0) [ps<sup>2</sup>]<br/>
优化柔性约束的步长. 应设置为mu/(d<sup>2</sup>V/dq<sup>2</sup>), 其中mu为柔性约束中两粒子的约化质量, d<sup>2</sup>V/dq<sup>2</sup>是势能在约束方向上的二阶导数. 这个数字对不同的柔性约束不要相差太大, 因为迭代次数进而运行时间对<code>fcstep</code>非常敏感. 多尝试几个值!</p>

### 7.3.7 测试粒子插入

<p><code>rtpi</code>: (0.05) [nm]<br/>
测试粒子插入半径, 请参考积分方法<code>tpi</code>和<code>tpic</code></p>

### 7.3.8 输出控制

<p><code>nstxout</code>: (0) [步]<br/>
将坐标写入输出轨迹文件的间隔步数, 最后一步的坐标始终会写入</p>

<p><code>nstvout</code>: (0) [步]<br/>
将速度写入输出轨迹文件的间隔步数, 最后一步的速度始终会写入</p>

<p><code>nstfout</code>: (0) [步]<br/>
将力写入输出轨迹文件的间隔步数</p>

<p><code>nstlog</code>: (1000) [步]<br/>
将能量写入log文件的间隔步数, 最后一步的能量始终会写入</p>

<p><code>nstcalcenergy</code>: (100)<br/>
两次能量计算之间的间隔步数, 0表示从不计算. 此选项仅与动力学有关. 使用双程截断时<code>nstcalcenergy</code>应等于<code>nstlist</code>或其倍数. 此选项会影响并行模拟的性能, 因为计算能量需要所有进程之间的全局通讯, 在高度并行的情况下, 这可能会成为计算瓶颈.</p>

<p><code>nstenergy</code>: (1000) [步]<br/>
将能量写入能量文件的间隔步数, 最后一步的能量始终会写入, 应是<code>nstcalcenergy</code>的倍数. 注意, 对所有MD步数与<code>nstcalcenergy</code>的模, 精确的能量总和及其涨落都存储在能量文件中, 所以当<code>nstenergy&gt;1</code>时, <code>g_energy</code>仍可以给出精确的能量平均值及其涨落</p>

<p><code>nstxout-compressed</code>: (0) [步]<br/>
利用有损压缩输出位置坐标的间隔步数</p>

<p><code>compressed-x-precision</code>: (1000) [实数]<br/>
压缩轨迹文件的精度</p>

<p><code>compressed-x-grps</code>:<br/>
写入到压缩轨迹文件的组, 默认写入整个体系(如果<code>nstxout-compressed</code>&gt;0)</p>

<p><code>energygrps</code>:<br/>
写入能量文件的组</p>

### 7.3.9 邻区搜索

<p><code>cutoff-scheme</code>:</p>

<ul class="incremental">
<li><p><code>Verlet</code><br/>
利用缓冲生成粒子的配对列表. 缓冲区的大小会根据<code>verlet-buffer-tolerance</code>自动进行设置, 除非将其设置为&#8211;1, 在这种情况下会使用<code>rlist</code>. 此选项在<code>rvdw=rcoulomb</code>处存在一个明显, 准确的截断. 目前仅支持截断, 反应场, PME静电和普通LJ. <code>Verlet</code>方案不支持<code>mdrun</code>的一些功能, 但<code>grompp</code>会对此进行检查. 只有<code>Verlet</code>支持原生GPU加速. 使用GPU加速的PME或单独的PME队列时, <code>mdrun</code>会通过缩放<code>rcoulomb</code>和格点间距自动调整CPU/GPU负载平衡. 可以使用<code>-notunepme</code>关闭此功能. 当体系中不含水分子, 或<code>group</code>使用配对列表缓冲维持能量守恒时, <code>Verlet</code>会比<code>group</code>快.</p></li>
<li><p><code>group</code><br/>
为原子组生成配对列表. 这些组对应于拓扑信息中的电荷组. 这是4.6版本之前唯一的截断处理方案. 配对列表没有显式的缓冲. 这使得计算水的力时效率很高, 但只有显式地加入缓冲时, 能量才守恒.</p></li>
</ul>

<p><code>nstlist</code>: (10) [步]</p>

<ul class="incremental">
<li><p><code>&gt;0</code><br/>
更新邻区列表(以及远程力, 当使用双程截断时)的频率. 当该值为0时, 邻区列表只生成一次. 对能量最小化, 当<code>nstlist&gt;0</code>时, 每次计算能量都将更新邻区列表. 设置了<code>cutoff-scheme=Verlet</code>和<code>verlet-buffer-tolerance</code>, <code>nstlist</code>实际是最小值且<code>mdrun</code>可能会增大它的值, 除非将其设置为1. 对GPU上的并行模拟和(或)非键合力计算, 取20或40往往能得到最佳性能.<br/>
使用<code>cutoff-scheme=Group</code>和非准确的截断, <code>nstlist</code>会影响模拟的精确性, 不能随意选择.</p></li>
<li><p><code>0</code><br/>
邻区列表仅构建一次, 且不再更新. 这主要用于真空中模拟, 这种情况下所有粒子彼此间都能看到对方.</p></li>
<li><p><code>-1</code><br/>
自动更新频率, 仅支持<code>cutoff-scheme=group</code>. 此选项只能用于切换, 移位或用户定制的势能函数, 其截断可以小于<code>rlist</code>. 缓冲的大小为<code>rlist</code>减去最长的截断值. 以根据前一步的邻区搜索确定的电荷组几何中心开始, 只有当一个或多个粒子移动的距离超过缓冲大小的一半时, 邻区列表才会更新. 更新时会考虑因压力耦合或<code>deform</code>选项引起的坐标缩放. 此选项可确保没有截断虚假, 但对于较大的体系, 计算成本可能会很高, 因为邻区列表的更新频率仅由一或两个粒子决定, 它们移动的距离稍微超出缓冲长度的一半(这并不一定意味着邻区列表是无效的), 而99.99%的粒子都不需要更新.</p></li>
</ul>

<p><code>nstcalclr</code>: (&#8211;1) [步]<br/>
使用组截断方案时, 控制远程力的计算周期.</p>

<ul class="incremental">
<li><p><code>1</code><br/>
在每一步都计算长程力. 当静电和范德华相互作用使用单独的带缓冲的邻区列表时, 此选项有用, 特别地, 它支持范德华的截断距离大于静电的(例如与PME联用时有用). 然而, 对这两种相互作用使用相同的长程截断值, 并在每一步更新它们是没有意义的&#8211;此时将一切都放在短程列表中会稍快一些.</p></li>
<li><p><code>&gt; 1</code><br/>
每<code>nstcalclr</code>步计算一次长程力, 并使用多时间步积分方法将它们组合起来. 现在可以使用超过<code>nstlist</code>的频率进行计算, 因为会保存列表. 这可能是一个好主意, 例如, 对于变化比静电慢的范德华相互作用.</p></li>
<li><p><code>-1</code><br/>
当进行邻区搜索时计算长程力. 虽然这是默认值, 你可能要考虑更频繁地更新长程力.<br/>
注意, PP-PME负载均衡可能会自动导致双程力(twin-range force)的计算, 这是为了维持所选择的范德华相互作用半径, 即便负载均衡正在改变静电截断. 如果<code>.mdp</code>文件已经指定了双程相互作用(比如每2&#8211;3步使用比PME静电更长的截断计算Lennard-Jones相互作用), 负载均衡对Lennard-Jones也会有小的影响, 因为短程截断(在其内部每步都计算力)改变了.</p></li>
</ul>

<p><code>ns-type</code>:</p>

<ul class="incremental">
<li><p><code>grid</code><br/>
在盒子中生成格点, 且在每<code>nstlist</code>步构建新的邻区列表时才检查在相邻格点区域内的原子. 对大的体系, 格点搜索比简单搜索快得多.</p></li>
<li><p><code>simple</code><br/>
每<code>nstlist</code>步构建新的邻区列表时, 检查盒子中的每个原子(仅与<code>cutoff-scheme=group</code>联用).</p></li>
</ul>

<p><code>pbc</code>:</p>

<ul class="incremental">
<li><p><code>xyz</code><br/>
在所有方向上使用周期性边界条件.</p></li>
<li><p><code>no</code><br/>
不使用周期性边界条件, 忽略盒子. 不使用截断的模拟, 可将所有的截断设为0, 并且<code>nstlist=0</code>. 对单个MPI队列, 不使用截断时, 使用<code>nstlist=0</code>, <code>ns-type=simple</code>可获得最佳性能.</p></li>
<li><p><code>xy</code><br/>
只在x和y方向上使用周期性边界条件. 仅适用于<code>ns-type=grid</code>, 可与<code>walls</code>联用. 没有墙或只有一个墙时, 体系在z方向上大小是无限的, 因此不能使用压力耦合或Ewald加和方法. 当使用两面墙时没有这些缺点.</p></li>
</ul>

<p><code>periodic-molecules</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
分子是有限的, 可以使用快速的分子PBC</p></li>
<li><p><code>yes</code><br/>
用于含有通过周期性边界条件与自身耦合的分子的体系, 需要较慢的PBC算法, 分子在输出中不保持完整</p></li>
</ul>

<p><code>verlet-buffer-tolerance</code>: (0.005) [kJ/mol/ps]<br/>
只对<code>cutoff-scheme=Verlet</code>有用. 此选项设置由Verlet缓冲引起的每个粒子配对相互作用的最大允许误差, 间接设置了<code>rlist</code>. 若<code>nstlist</code>和Verlet缓冲大小都固定(出于性能原因), 不在配对列表中的粒子对在<code>nstlist</code>&#8211;1步内能够不时地进入截断距离内. 这将导致非常小的能量跳跃. 对等温系综, 对于给定的截断和<code>rlist</code>可估算出这些非常小的能量跳跃. 估算时假定均相的粒子分布, 因此对多相体系可能会略微低估误差. 对于较长的配对列表寿命(<code>nstlist</code>&#8211;1)*dt, 缓冲会被高估, 因为忽略了粒子之间的相互作用.<br/>
由于误差抵消, 总能量的实际漂移幅度通常小一到两个数量级. 注意, 与基于简单粒子配对的列表相比, GROMACS的配对列表设置导致漂移降低为原来的1/10, 生成的缓冲大小考虑了这一点影响. 不使用动力学(能量最小化等)时, 缓冲为截断的5%. 对NVE模拟, 会使用初始温度, 除非初始温度为零, 此时使用10%的缓冲. 对NVE模拟通常需要降低容差以便在纳秒的时间尺度达到适当能量守恒. 要覆盖自动缓冲设置, 可使用<code>verlet-buffer-tolerance=-1</code>, 并手动设置<code>rlist</code>.</p>

<p><code>rlist</code>: (1) [nm]<br/>
短程邻区列表的截断距离. 使用<code>cutoff-scheme=Verlet</code>时, 默认由<code>verlet-buffer-tolerance</code>选项设置, 并忽略<code>rlist</code>值.</p>

<p><code>rlistlong</code>: (&#8211;1) [nm]<br/>
长程邻区列表的截断距离. 此参数仅适用于切换势的双程截断设置. 在这种情况下, 需要一个缓冲区域以考虑电荷组的大小. 在所有其他情况下, 该参数自动设置为最长的截断距离.</p>

### 7.3.10 静电

<p><code>coulombtype</code>:</p>

<ul class="incremental">
<li><p><code>Cut-off</code><br/>
双程截断, 其中邻区截断距离为<code>rlist</code>, 库仑截断距离为<code>rcoulomb</code>, 且<code>rcoulomb≥rlist</code>.</p></li>
<li><p><code>Ewald</code><br/>
经典Ewald加和方法. 实空间的截断距离<code>rcoulomb</code>应等于<code>rlist</code>. 例如, 使用<code>rlist=0.9, rcoulomb=0.9</code>. 倒易空间使用的波矢的最大振幅由<code>fourierspacing</code>控制. 直接/倒易空间的相对精度由<code>ewald-rtol</code>控制.<br/>
注: Ewald算法的复杂度为O(N<sup>3/2</sup>), 因此对于大的体系非常慢. 包含这个方法主要是为了作为参考&#8211;在大多数情况下PME方法的性能都好得多.</p></li>
<li><p><code>PME</code><br/>
快速平滑粒子网格Ewald(SPME)静电方法. 直接空间类似于Ewald加和方法, 而倒易空间部分使用FFT进行计算. 格点尺寸由<code>fourierspacing</code>控制, 内插的阶数由<code>pme-order</code>控制. 使用0.1 nm格点间距的三次内插方法时, 静电力的计算精度为2&#8211;3*10<sup>-4</sup>. 由于VDW截断导致的误差大于此, 你可以尝试使用0.15 nm的格点间距. 当并行运行时, 内插的并行性能优于FFT, 因此可以试着减小格点尺寸, 同时增加内插.</p></li>
<li><p><code>P3M-AD</code><br/>
粒子粒子粒子网格算法, 具有长程静电相互作用的解析梯度. 除影响函数对格点进行了优化外, 方法和代码与SPME完全相同, 优化使在计算精度略有提高.</p></li>
<li><p><code>Reaction-Field electrostatics</code><br/>
库仑截断距离为<code>rcoulomb</code>的反应场, 其中<code>rcoulomb≥rlist</code>. 超过截断距离的介电常数为<code>epsilon-rf</code>. 当<code>epsilon-rf=0</code>时, 介电常数无穷大.</p></li>
<li><p><code>Generalized-Reaction-Field</code><br/>
库仑截断距离为<code>rcoulomb</code>的广义反应场, 其中<code>rcoulomb≥rlist</code>. 超过截断距离的介电常数为<code>epsilon-rf</code>. 离子强度由带电的(即非零电荷)电荷组计算. GRF势的温度通过<code>ref-t</code> [K]设定.</p></li>
<li><p><code>Reaction-Field-zero</code><br/>
在GROMACS中, 使用<code>cutoff-scheme=group</code>时, 正常的反应场静电方法会导致能量守恒性很差. <code>Reaction-Field-zero</code>通过将超出截断距离的势能设为零解决了这个问题. 这种方法只适用于介电常数无穷大(<code>epsilon-rf=0</code>)的情况, 因为只有这样力在截断距离处才能消失. <code>rlist</code>应比<code>rcoulomb</code>大0.1至0.3 nm, 以考虑电荷组的大小已及更新邻区对时扩散的影响. 这一点以及使用查表代替解析函数使得<code>Reaction-Field-zero</code>的计算比正常反应场更耗时.</p></li>
<li><p><code>Reaction-Field-nec</code><br/>
与<code>Reaction-Field</code>相同, 但是GROMACS 3.3以前版本中的实现. 没有使用反应场校正排除原子对和自身对的影响. 使用反应场计算1&#8211;4相互作用. 因排除不具有1&#8211;4相互作用的粒子对而缺少的校正达到总静电能的百分之几, 并导致力和压力有微小的差别.</p></li>
<li><p><code>Shift</code><br/>
类似于<code>vdwtype</code>的<code>Shift</code>. 你可能想使用<code>Reaction-Field-zero</code>代替, 它具有类似的势能形状, 但具有物理意义, 并且含有排除校正项, 计算的能量更好.</p></li>
<li><p><code>Encad-Shift</code><br/>
库仑势在整个范围内降低, 使用Encad模拟包中的定义</p></li>
<li><p><code>Switch</code><br/>
类似于<code>vdwtype</code>的<code>Switch</code>. 切换库仑势可导致严重的假象, 建议: 使用<code>Reaction-Field-zero</code>代替.</p></li>
<li><p><code>User</code><br/>
<code>mdrun</code>需要使用文件<code>table.xvg</code>, 里面包含用户定义的势能函数, 包括排斥, 色散和库仑相互作用. 当存在对相互作用时, <code>mdrun</code>也需要描述对相互作用的文件<code>tablep.xvg</code>. 当非键和对相互作用需要使用相同的相互作用时, 用户可以为两个表格文件指定相同的文件名. 这些文件应包含7列: <code>x</code>值, <code>f(x)</code>, <code>-f'(x)</code>, <code>g(x)</code>, <code>-g'(x)</code>, <code>h(x)</code>, <code>-h'(x)</code>, 其中<code>f(x)</code>为库仑函数, <code>g(x)</code>为色散函数, <code>h(x)</code>为排斥函数. 当<code>vdwtype</code>不为<code>User</code>时, 会忽略<code>g</code>, <code>-g'</code>, <code>h</code>和<code>-h'</code>. 对非键相互作用, <code>x</code>的取值应该从0到最大截断距离+<code>table-extension</code>, 彼此的间距应均匀. 对于对相互作用会使用文件中的表格长度. 当使用混合精度时, 非用户自定义表格的最佳间距为<code>0.002</code> [nm], 使用双精度时, 最佳值为<code>0.0005</code> [nm]. 在<code>x=0</code>处的函数值并不重要. 更多信息请参考印刷手册.</p></li>
<li><p><code>PME-Switch</code><br/>
PME和对直接空间部分切换函数的组合(参见上文). <code>rcoulomb</code>可以小于<code>rlist</code>.<br/>
主要用于等能量模拟(注意, <code>PME</code>与<code>cutoff-scheme=Verlet</code>联用会更有效).</p></li>
<li><p><code>PME-User</code><br/>
PME和用户表格的组合(参见上文). <code>rcoulomb</code>可以小于<code>rlist</code>. <code>mdrun</code>会从用户表格中减去PME网格的贡献. 因为这个扣除, 用户表格应包含大约10个十进制的位置.</p></li>
<li><p><code>PME-User-Switch</code><br/>
PME-User和切换函数的组合(参见上文). 对最终粒子之间的相互作用使用切换函数, 即, 同时对用户提供的函数和PME网格校正部分使用切换函数.</p></li>
</ul>

<p><code>coulomb-modifier</code></p>

<ul class="incremental">
<li><p><code>Potential-shift-Verlet</code><br/>
选择<code>Potential-shift</code>与Verlet截断方案, 因为它(几乎)不增加计算量; 选择<code>None</code>与组截断方案.</p></li>
<li><p><code>Potential-shift</code><br/>
对库仑势进行固定的移位以使其在截断处为零. 这使得势能可由力的积分得到. 注意这并不影响力或采样.</p></li>
<li><p><code>None</code><br/>
使用未经修改的库仑势. 与组方案连用时, 这意味着没有使用准确的截断, 会计算邻区列表中的所有粒子对之间的能量和力.</p></li>
</ul>

<p><code>rcoulomb-switch</code>: (0) [nm]<br/>
从何处开始切换库仑势, 只适用于应用力或势能的切换时.</p>

<p><code>rcoulomb</code>: (1) [nm]<br/>
库伦截断距离</p>

<p><code>epsilon-r</code>: (1)<br/>
相对介电常数. 为0时意味着无穷大.</p>

<p><code>epsilon-rf</code>: (0)<br/>
反应场的相对介电常数, 仅与反应场静电方法一起使用. 为0时意味着无穷大.</p>

### 7.3.11 VdW

<p><code>vdwtype</code>:</p>

<ul class="incremental">
<li><p><code>Cut-off</code><br/>
双程截断, 邻区列表的截断距离为<code>rlist</code>, VdW截断距离为<code>rvdw</code>, 其中 <code>rvdw≥rlist</code>.</p></li>
<li><p><code>PME</code><br/>
使用快速平滑粒子网格Ewald(SPME)方法计算VdW相互作用. 与静电计算类似, 格点大小由<code>fourierspacing</code>控制. 内插的阶数由<code>pme-order</code>控制. 直接/倒易空间的相对精度由<code>ewald-rtol-lj</code>控制, 倒易程序部分使用的特定组合规则由<code>lj-pme-comb-rule</code>设置.</p></li>
<li><p><code>Shift</code><br/>
此功能已废弃, 并被<code>vdw-modifier = Force-switch</code>取代. LJ(不包括Buckingham)势在整个范围内降低, 相应的力在<code>rvdw-switch</code>和<code>rvdw</code>之间平滑地衰减到零. 邻区搜索的截断距离<code>rlist</code>应该比<code>rvdw</code>大0.1至0.3 nm以考虑电荷组大小及邻区列表更新时扩散的影响.</p></li>
<li><p><code>Switch</code><br/>
此功能已废弃, 并被<code>vdw-modifier = Potential-switch</code>取代. LJ(不包括Buckingham)势在<code>rvdw-switch</code>之内是正常的, 之后被逐渐降低, 并在<code>rvdw</code>处达到零. 势能和力函数都是连续平滑的. 但需要注意, 所有的切换函数都会导致力的突起(增加, 因为我们切换了势能). 邻区搜索的截断距离<code>rlist</code>应该比<code>rvdw</code>大0.1至0.3 nm以考虑电荷组大小及邻区列表更新时扩散的影响.</p></li>
<li><p><code>Encad-Shift</code><br/>
LJ(不包括Buckingham)势在整个范围内降低, 使用Encad模拟包中的定义.</p></li>
<li><p><code>User</code><br/>
参看<code>coulombtype</code>的<code>user</code>选项. <code>x=0</code>处的函数值并不重要. 如果你想使用LJ校正, 请确保<code>rvdw</code>对应于用户定义函数的截断距离. 若<code>coulombtype</code>没有设置为<code>User</code>, 会忽略<code>f</code>和<code>-f'</code>.</p></li>
</ul>

<p><code>vdw-modifier</code>:</p>

<ul class="incremental">
<li><p><code>Potential-shift-Verlet</code><br/>
选择<code>Potential-shift</code>与Verlet截断方案, 因为它(几乎)不增加计算量; 选择<code>None</code>与组截断方案.</p></li>
<li><p><code>Potential-shift</code><br/>
对VdW势进行固定的移位以使其在截断处为零. 这使得势能可由力的积分得到. 注意这并不影响力或采样.</p></li>
<li><p><code>None</code><br/>
使用未经修改的VdW势. 与组方案连用时, 这意味着没有使用准确的截断, 会计算邻区列表中的所有粒子对之间的能量和力.</p></li>
<li><p><code>Force-switch</code><br/>
在<code>rvdw-switch</code>和<code>rvdw</code>之间平滑地将力切换至零. 这使得势能在整个范围内移位并在截断处切换至零, 注意, 这种计算方法比普通截断方法更耗时, 并且不要求能量守恒, 因为<code>Potential-shift</code>的能量守恒性也差不多.</p></li>
<li><p><code>Potential-switch</code><br/>
在<code>rvdw-switch</code>和<code>rvdw</code>之间平滑地将势能切换至零. 注意, 这会导致力的数值在切换区域产生很大的假象, 并且计算也更耗时. 只有当你使用的力场要求使用时, 才能使用此选项.</p></li>
</ul>

<p><code>rvdw-switch</code>: (0) [nm]<br/>
从何处开始切换LJ力或势能, 只适用于应用力或势能的切换时.</p>

<p><code>rvdw</code>: (1) [nm]<br/>
LJ或Buckingham的截断距离.</p>

<p><code>DispCorr</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不使用任何修正</p></li>
<li><p><code>EnerPres</code><br/>
对能量和压力进行长程色散校正</p></li>
<li><p><code>Ener</code><br/>
只对能量进行长程色散校正</p></li>
</ul>

### 7.3.12 表格

<p><code>table-extension</code>:: (1) [nm]<br/>
非键势能函数查询表超出最大截断距离后的延伸长度. 该值应足够大以考虑电荷组大小及更新邻区列表时扩散的影响. 不使用用户定义势能时, 对1&#8211;4相互作用的查询表会使用相同的表格长度, 此长度与非键相互作用的表格无关. <code>table-extension</code>的值决不可能影响<code>rlist</code>, <code>rcoulomb</code>或<code>rvdw</code>的值.</p>

<p><code>energygrp-table</code>:<br/>
当对静电和/或VdW使用用户表格时, 可以在这里列出能量组之间的配对, 这些配对可以使用单独的用户表格. 两个能量组的名称将被追加到表格的文件名中, 追加时按照它们在<code>energygrps</code>中定义的顺序, 彼此之间以下划线隔开. 例如, 如果<code>energygrps = Na Cl Sol</code>, <code>energygrp-table = Na Na Na Cl</code>, 除常规的<code>table.xvg</code>外, <code>mdrun</code>还会读取<code>table_Na_Na.xvg</code>和<code>table_Na_Cl.xvg</code>, <code>table.xvg</code>将被用于所有其它能量组配对.</p>

### 7.3.13 Ewald

<p><code>fourierspacing</code>: (0.12) [nm]<br/>
对普通的Ewald方法, 盒子尺寸和间距的比值决定了在每个(含符号)方向上使用的波矢数目的下限. 对PME和P3M, 该比率决定了沿每个轴使用的Fourier空间格点数目的下限. 在所有情况下, 每个方向上的数目都可通过非零的<code>fourier_n[xyz]</code>重新进行设置. 为优化粒子-粒子相互作用计算和PME网格计算之间的相对负载, 知道下面的事实可能对你会有帮助, 当对库仑截断和PME格点间距使用相同的因子进行缩放时, 静电计算的精确度几乎保持不变.</p>

<p><code>fourier-nx</code> (0) ; <code>fourier-ny</code> (0) ; <code>fourier-nz</code>: (0)<br/>
使用Ewald方法时, 倒易空间波矢的最高振幅. 使用PME或P3M时, 格点的大小. 这些值会覆盖每个方向的<code>fourierspacing</code>设置. 最佳的数值为2, 3, 5和7的幂, 避免使用大的素数.</p>

<p><code>pme-order</code> (4)<br/>
PME内插的阶数. 4对应于立方内插. 当并行运行时, 你可以尝试6/8/10, 并同时减少格点尺寸.</p>

<p><code>ewald-rtol</code> (1e&#8211;5)<br/>
Ewald移位的实空间势能在<code>rcoulomb</code>处的相对强度由<code>ewald-rtol</code>给出. 降低此值会得到更精确的实空间加和, 但计算倒易空间加和时需要更多的波矢.</p>

<p><code>ewald-rtol-lj</code> (1e&#8211;3)<br/>
当使用PME计算VdW相互作用时, <code>ewald-rtol-lj</code>用于控制<code>rvdw</code>处色散能的相对强度, 与<code>ewald-rtol</code>控制静电能的方式类似.</p>

<p><code>lj-pme-comb-rule</code> (Geometric)<br/>
LJ-PME倒易部分VdW参数的组合规则. 几何规则比Lorentz-Berthelot规则快得多, 因此通常建议优先选择几何规则, 即便力场的其余部分使用了Lorentz-Berthelot规则.</p>

<ul class="incremental">
<li><p><code>Geometric</code><br/>
应用几何组合规则</p></li>
<li><p><code>Lorentz-Berthelot</code><br/>
应用Lorentz-Berthelot组合规则</p></li>
</ul>

<p><code>ewald-geometry</code>: (3d)</p>

<ul class="incremental">
<li><p><code>3d</code><br/>
在所有三个维度进行Ewald加和.</p></li>
<li><p><code>3dC</code><br/>
倒易部分的加和仍然以3D进行, 但对<code>z</code>方向的力和势能进行校正以产生伪二维的加和. 如果体系在<code>x-y</code>平面具有板状几何结构, 你可以尝试增加盒子在z方向的长度(盒子的长度取为板高的3倍通常是可以的), 并使用这个选项.</p></li>
</ul>

<p><code>epsilon-surface</code>: (0)<br/>
此选项控制3D Ewald加和的偶极校正. 默认值零意味着不进行校正. 将此值设置为围绕无穷大体系的假想表面的相对介电常数值, 即可进行校正. 小心, 如果你的体系含有自由移动的电荷, 你就不应该使用此选项. 这个值不影响长程校正的板状3DC方法.</p>

### 7.3.14 温度耦合

<p><code>tcoupl:</code></p>

<ul class="incremental">
<li><p><code>no</code><br/>
不使用温度耦合.</p></li>
<li><p><code>berendsen</code><br/>
通过Berendsen恒温器与温度为<code>ref-t</code> [K]的热浴耦合, 时间常数<code>tau-t</code> [ps]. 多个组可以独立耦合, 这些组可在<code>tc-grps</code>中指定, 彼此之间以空格分开.</p></li>
<li><p><code>nose-hoover</code><br/>
使用扩展系综的Nose-Hoover温度耦合. 参考温度与耦合组的选择方法同上, 但在这种情况下<code>tau-t</code> [ps]控制的是平衡时温度涨落的周期, 它与弛豫时间稍有不同. 对NVT模拟, 能量的守恒量会写入能量和日志文件.</p></li>
<li><p><code>andersen</code><br/>
通过在每个时间步对一部分粒子随机化进行温度耦合. 参考温度和耦合组的选择同上. <code>tau-t</code>是每个分子两次随机化之间的平均时间间隔. 此方法对粒子的动力学有一定的抑制作用, 但很少或不出现遍历问题. 目前只能用于速度Verlet, 不能用于约束.</p></li>
<li><p><code>andersen-massive</code><br/>
通过在不频繁的时间步对所有粒子随机化进行温度耦合. 参考温度和耦合组的选择方法同上. <code>tau-t</code>是所有分子两次随机化之间的时间间隔. 此方法对粒子的动力学有一定的抑制作用, 但很少或不出现遍历问题. 目前只能用于速度Verlet,</p></li>
<li><p><code>v-rescale</code><br/>
通过速度缩放与随机项联用的方法进行温度耦合(JCP 126, 014101). 此恒温器类似于Berendsen耦合, 使用相同的<code>tau-t</code>进行缩放, 但随机项确保了能够产生正确的正则系综. 随机数种子通过<code>ld-seed</code>设置. 即便对<code>tau-t=0</code>该恒温器也工作正常. 对于NVT模拟, 能量的守恒量会写入能量和日志文件.</p></li>
</ul>

<p><code>nsttcouple: (-1)</code><br/>
与温度耦合的频率. 默认值&#8211;1表示<code>nsttcouple</code>与<code>nstlist</code>相等, 除非<code>nstlist≤0</code>, 此时会使用10. 对速度Verlet积分方法, <code>nsttcouple</code>被设置为1.</p>

<p><code>nh-chain-length</code> (10)<br/>
速度Verlet积分方法中Nose-Hoover恒温链的数目, 蛙跳式<code>md</code>积分方法只支持1. Nose-Hoover链变量的数据不会输出到.edr, 但可使用环境变量<code>GMX_NOSEHOOVER_CHAINS</code>设置输出.</p>

<p><code>tc-grps</code>:<br/>
独立地耦合到温度浴的组</p>

<p><code>tau-t</code>: [ps]<br/>
耦合的时间常数(<code>tc-grps</code>中的每组一个值), &#8211;1意味着没有温度耦合</p>

<p><code>ref-t</code>: [K]<br/>
耦合的参考温度(<code>tc-grps</code>中的每组一个值)</p>

### 7.3.15 压力耦合

<p><code>pcoupl</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不使用压力耦合. 这意味着盒子的大小固定.</p></li>
<li><p><code>berendsen</code><br/>
指数弛豫的压力耦合, 时间常数为<code>tau-p</code> [ps]. 在每个时间步对盒子进行缩放. 有人认为, 这并不能得到正确的热力学系综, 但在模拟的开始阶段这是缩放盒子的最有效方式.</p></li>
<li><p><code>Parrinello-Rahman</code><br/>
扩展系综的压力耦合, 盒矢量服从运动方程. 原子的运动方程也耦合到此方程. 没有瞬时的缩放. 与Nose-Hoover温度耦合类似, 时间常数<code>tau-p</code> [ps]是平衡时压力的涨落周期. 当你想要在数据收集过程中施加压力缩放时, 这可能是更好的方法, 但需要当心, 如果从不同的压力开始模拟, 你可能会得到非常大的振荡. 对那些精确涨落非常重要的NPT系综的模拟, 或者如果压力耦合时间非常短, 这种方法可能不合适, 因为前面时间步的压力会被GROMACS用于计算当前时间步的压力.</p></li>
<li><p><code>MTTK</code><br/>
Martyna-Tuckerman-Tobias-Klein实现, 只用于<code>md-vv</code>或<code>md-vv-avek</code>, 非常类似于Parrinello-Rahman. 与Nose-Hoover温度耦合类似, 时间常数<code>tau-p</code> [ps]是平衡时压力的涨落周期. 当你想要在数据收集过程中施加压力缩放时, 这可能是更好的方法, 但需要当心, 如果从不同的压力开始模拟, 你可能会得到非常大的振荡. 目前仅支持各向同性缩放.</p></li>
</ul>

<p><code>pcoupltype</code>:</p>

<ul class="incremental">
<li><p><code>isotropic</code><br/>
各向同性压力耦合, 时间常数为<code>tau-p</code> [ps]. 压缩系数和参考压力分布分别通过<code>compressibility</code> [bar<sup>-1</sup>]和<code>ref-p</code> [bar] 进行设置, 都只需要一个值.</p></li>
<li><p><code>semiisotropic</code><br/>
压力耦合在<code>x</code>和<code>y</code>方向各向同性, 但<code>z</code>方向上的不同. 对膜模拟有用. 需要两个值, 分别对应于<code>x/y</code>方向和<code>z</code>方向.</p></li>
<li><p><code>anisotropic</code><br/>
同上, 需要6个值, 分别是<code>xx</code>, <code>yy</code>, <code>zz</code>, <code>xy/yx</code>, <code>xz/zx</code>和<code>yz/zy</code>分量. 当非对角线压缩系数为零时, 长方体盒子在模拟中仍将保持为长方体. 要注意的是, 各向异性缩放可能会导致模拟盒子的剧烈变形.</p></li>
<li><p><code>surface-tension</code><br/>
表面张力耦合, 表面平行于xy平面. <code>z</code>方向采用正常的压力耦合, 表面张力耦合到盒子的<code>x/y</code>维度. <code>ref-p</code>的第一个值是参考表面张力与表面数目的乘积, 单位为[bar nm], 第二个值是参考的z-压力, 单位为[bar]. 两个<code>compressibility</code>的值(单位[bar<sup>-1</sup>])分别为<code>x/y</code>和<code>z</code>的方向的压缩系数. z方向压缩系数的值应该具有一定的准确度, 因为它会影响表面张力的收敛性, 也可以将其设置为零以保持盒子的高度固定.</p></li>
</ul>

<p><code>nstpcouple</code>: (&#8211;1)<br/>
压力耦合的频率. 默认值为&#8211;1, 表示<code>nstpcouple</code>等于<code>nstlist</code>, 除非<code>nstlist≤0</code>, 此时使用10. 对速度Verlet积分方法, <code>nstpcouple</code>被设置为1.</p>

<p><code>tau-p(1)</code>: [ps]<br/>
耦合的时间常数</p>

<p><code>compressibility</code>: [bar<sup>-1</sup>]<br/>
压缩系数(注意: 现在真的是以bar<sup>-1</sup>为单位了), 处于1个标准大气压, 300 K下的水其压缩系数为4.5e&#8211;5 [bar<sup>-1</sup>].</p>

<p><code>ref-p</code>: [bar]<br/>
耦合的参考压力</p>

<p><code>refcoord-scaling</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不修改用于位置限制的参考坐标. 注意, 使用该选项维里和压力将取决于参考坐标的绝对位置.</p></li>
<li><p><code>all</code><br/>
利用压力耦合缩放矩阵对参考坐标进行缩放.</p></li>
<li><p><code>com</code><br/>
利用压力耦合缩放矩阵对参考坐标的质心进行缩放. 每个参考坐标到质心的矢量不进行缩放. 只使用一个质心, 即便有多个分子存在位置限制. 在计算初始构型参考坐标的质心时, 不考虑周期性边界条件.</p></li>
</ul>

### 7.3.16 模拟退火

<p>在GROMACS中, 对每个温度组的模拟退火是分开控制的. 参考温度是一个分段线性函数, 对每个组可以使用任意数目的点, 并选择单一序列或周期性退火类型. 实际退火是通过动态地改变参考温度进行的, 由于选择的温控算法也使用该温度, 所以要记住, 体系通常不会瞬间达到参考温度!</p>

<p><code>annealing</code>:<br/>
每个温度组的退火类型</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不进行模拟退火, 只耦合到参考温度.</p></li>
<li><p><code>single</code><br/>
退火点的单一序列. 如果模拟时间比最后一点的时间还长, 当退火序列达到最后的时间点后, 温度将耦合到最后一点的值并保持不变.</p></li>
<li><p><code>periodic</code><br/>
一旦到达最后的参考时间, 退火将从第一个参考点重新开始. 此过程不断重复, 直到模拟结束.</p></li>
</ul>

<p><code>annealing-npoints</code>:<br/>
退火参考/控制点数目的列表, 用于每个温度组. 对不退火的组使用0. 此项的数目应等于温度组的数目.</p>

<p><code>annealing-time</code>:<br/>
退火参考/控制点的时间列表, 用于每个温度组.如果你正使用周期性退火类型, 时间将与最终值取模, 即, 如果时间为0, 5, 10和15, 耦合将会在15 ps, 30 ps, 45 ps等时间点后以0 ps时值重新启动. 此项的数目应该等于<code>annealing-npoints</code>给出的数字的总和.</p>

<p><code>annealing-temp</code>:<br/>
退火参考/控制点的温度列表, 用于每个温度组. 此项的数目应该等于<code>annealing-npoints</code>给出的数字的总和.</p>

<p>很迷惑? 好吧, 让我们举个例子. 假设你有两个温度组, 组的选择设置为<code>annealing = single periodic</code>, 组的点数设置为<code>annealing-npoints = 3 4</code>, 退火时间设置为<code>annealing-time = 0 3 6 0 2 4 6</code>, 温度设置为<code>annealing-temp = 298 280 270 298 320 320 298</code>. 在0 ps第一组将被耦合到298 K, 但参考温度在3 ps内将线性下降到280 K, 然后在3 ps到6 ps这段时间内, 温度将从280 K线性变化到270 K. 在这之后温度保持270 K不变. 0 ps时第二组被耦合到298 K, 在2 ps内温度线性增加到320 K, 并保持不变直到4 ps. 在4 ps和6 ps之间温度降低到298 K, 然后将以同样的方式重新开始, 即在6 ps和8 ps之间从298 K线性上升到320 K. 如果你不确定, 请检查<code>grompp</code>给出的汇总信息!</p>

### 7.3.17 速度产生

<p><code>gen-vel</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不产生速度. 当输入结构文件中不存在速度时, 速度被设置为零.</p></li>
<li><p><code>yes</code><br/>
<code>grompp</code>根据温度为<code>gen-temp</code> [K]的麦克斯韦分布产生速度, 随机数种子为<code>gen-seed</code>. 此选项只对<code>md</code>积分器有意义.</p></li>
</ul>

<p><code>gen-temp</code>: (300) [K]<br/>
麦克斯韦分布的温度</p>

<p><code>gen-seed</code>: (&#8211;1) [整数]<br/>
用于初始化产生随机速度的随机数发生器, 当<code>gen-seed</code>设置为&#8211;1时, 将使用伪随机种子.</p>

### 7.3.18 键约束

<p><code>constraints</code>:</p>

<ul class="incremental">
<li><p><code>none</code><br/>
除在拓扑中明确定义的键外, 不使用任何约束, 即, 利用简谐(或其他)势或Morse势(取决于<code>morse</code>的设置)描述键, 利用简谐(或其他)势描述键角.</p></li>
<li><p><code>h-bonds</code><br/>
将含有氢原子的键转换为约束.</p></li>
<li><p><code>all-bonds</code><br/>
将所有的键都转换为约束.</p></li>
<li><p><code>h-angles</code><br/>
将所有涉及氢原子的键和键角都转换为键约束.</p></li>
<li><p><code>all-angles</code><br/>
将所有的键和键角都转换为键约束.</p></li>
</ul>

<p><code>constraint-algorithm</code>:</p>

<ul class="incremental">
<li><p><code>LINCS</code><br/>
线性约束求解器(LINear Constraint Solver). 区域分解会与并行版本的P-LINCS一起使用. 使用<code>lincs-order</code>设置精度, 同时也设置矩阵求逆展开中矩阵的数目. 经过矩阵求逆校正后, 算法会执行一次迭代校正以补偿因旋转导致的增长. 这种迭代的次数可以通过<code>lincs-iter</code>控制. 每<code>nstlog</code>步, 相对约束的根均方偏差会打印到日志文件. 如果某根键在一步中的旋转超过了<code>lincs-warnangle</code>(度), 将打印警告到日志文件和<code>stderr</code>. LINCS不能用于耦合键角约束.</p></li>
<li><p><code>SHAKE</code><br/>
与LINCS相比, SHAKE方法稍慢, 且不太稳定, 但能用于键角约束. 相对容差由<code>shake-tol</code>设置, 对&#8220;正常&#8221;的MD, 0.0001是合适的值. SHAKE不支持处于不同节点上的原子之间的约束, 因此当存在电荷组之间的约束时, 它不能与区域分解一起使用. SHAKE不能用于能量最小化.</p></li>
</ul>

<p><code>continuation</code>:<br/>
此选项以前的名字为<code>unconstrained-start</code>.</p>

<ul class="incremental">
<li><p><code>no</code><br/>
对初始构型施加约束并复位壳层</p></li>
<li><p><code>yes</code><br/>
不对初始构型施加约束, 不复位壳层, 对准确的延续和重新运行很有用.</p></li>
</ul>

<p><code>shake-tol</code>: (0.0001)<br/>
SHAKE相对容差</p>

<p><code>lincs-order</code>: (4)<br/>
约束耦合矩阵展开的最高阶数. 当约束形成三角形时, 在这些三角形约束的正常展开之上会施加一个相同阶的展开. 对&#8220;正常&#8221;的MD模拟通常4阶就足够了; 对含有虚拟位点或BD并使用大时间步长的模拟, 需要使用6阶; 对精确的能量最小化, 可能需要使用8或更高的阶数. 与区域分解联用时, 原胞的大小由<code>lincs-order</code>+1个约束张成的距离决定. 如果想进行超过此限制的缩放, 可以降低<code>lincs-order</code>, 增加<code>lincs-iter</code>, 因为当(1+<code>lincs-iter</code>)*<code>lincs-order</code>保持不变时, 精度不会变差.</p>

<p><code>lincs-iter</code>: (1)<br/>
LINCS中用于校正旋转增长的迭代次数. 对于正常的运行一步就足够了. 但对于NVE模拟, 如果需要精确的能量守恒或精确的能量最小化, 你可能需要将其增加到2.</p>

<p><code>lincs-warnangle</code>: (30) [度]<br/>
LINCS失效前键能够旋转的最大角度.</p>

<p><code>morse</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
使用简谐势描述键</p></li>
<li><p><code>yes</code><br/>
使用Morse势描述键</p></li>
</ul>

### 7.3.19 能量组排除

<p><code>energygrp-excl</code>:<br/>
所有非键相互作用被排除在外的能量组对. 例如: 如果你有两个能量组<code>Protein</code>和<code>SOL</code>, 指定<br/>
<code>energygrp-excl = Protein Protein SOL SOL</code><br/>
只会给出蛋白质和溶剂之间的非键相互作用. 对于加快<code>mdrun -rerun</code>的能量计算, 排除冻结组之间的相互作用, 此选项特别有用.</p>

### 7.3.20 墙

<p><code>nwall</code>: 0<br/>
当设置为<code>1</code>时, 在<code>z=0</code>处存在一面墙; 当设置为<code>2</code>时, 还存在一面位于<code>z=z-box</code>处的墙. 墙只能用于<code>pbc=xy</code>. 当设置为<code>2</code>时, 可以使用压力耦合与Ewald加和(通常最好是使用半各向同性的压力耦合, 并将<code>x/y</code>的压缩率设置为0, 否则表面积会发生变化). 墙会与体系的其余部分进行相互作用, 其<code>atomtype</code>是可选的. 会自动增加能量组<code>wall0</code>和<code>wall1</code>(<code>nwall=2</code>时)以监测能量组与每面墙之间的相互作用. Z方向的质心运动移除将被关闭.</p>

<p><code>wall-atomtype</code>:<br/>
每面墙在力场中的原子类型名称. 通过(例如)在拓扑文件中定义一个特殊的墙原子类型及其组合规则, 可以独立地调整每个原子类型和墙的相互作用.</p>

<p><code>wall-type</code>:</p>

<ul class="incremental">
<li><p><code>9-3</code><br/>
对墙后体积进行积分的LJ势: 9&#8211;3势</p></li>
<li><p><code>10-4</code><br/>
对墙面进行积分的LJ势: 10&#8211;4势</p></li>
<li><p><code>12-6</code><br/>
直接的LJ势, 由与墙的Z距离决定</p></li>
<li><p><code>table</code><br/>
用户定义的势, 根据与墙的Z距离进行索引, 以类似于<code>energygrp-table</code>的选项读入, 其中的第一个名称为&#8220;正常&#8221;能量组, 第二名称为<code>wall0</code>或<code>wall1</code>, 只使用表中的色散和排斥列.</p></li>
</ul>

<p><code>wall-r-linpot</code>: &#8211;1 [nm]<br/>
与墙的距离在此值以下时, 势能线性连续, 因此力为常数. 当一些原子超过墙时, 将此选项设置为正值对平衡尤其有用. 当此值 <span class="math">\(\le 0\)</span> (对<code>wall-type=table</code>则是&lt;0)时, 原子超过墙后会产生致命错误.</p>

<p><code>wall-density</code>: [nm<sup>-3</sup>/nm<sup>-2</sup>]<br/>
每面墙的原子数密度, 适用于类型为9&#8211;3和10&#8211;4的墙</p>

<p><code>wall-ewald-zfac</code>: 3<br/>
第三个盒矢量的缩放因子, 仅用于Ewald加和, 最小值为2. Ewald加和只能与<code>nwall=2</code>联用, 并需要使用<code>ewald-geometry=3dc</code>. 盒子中真空层的作用是降低周期性映象之间不合实际的库仑相互作用.</p>

### 7.3.21 质心牵引

<p><code>pull</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不使用质心牵引. 以下所有的牵引选项都将被忽略(选项如果存在于<code>.mdp</code>文件中会导致警告)</p></li>
<li><p><code>umbrella</code><br/>
使用参考组与一个或多个组之间的伞势牵引质心</p></li>
<li><p><code>constraint</code><br/>
使用参考组与一个或多个组之间的约束牵引质心. 设置与<code>umbrella</code>完全相同, 除了使用的是刚性约束而不是简谐势.</p></li>
<li><p><code>constant-force</code><br/>
使用线性势牵引质心, 拉力恒定. 此选项没有参考位置, 因此不会使用参数<code>pull-init</code>和<code>pull-rate</code>.</p></li>
</ul>

<p><code>pull-geometry</code>:</p>

<ul class="incremental">
<li><p><code>distance</code><br/>
沿着连接两组的矢量进行牵引. 可以使用<code>pull-dim</code>选择分量.</p></li>
<li><p><code>direction</code><br/>
在<code>pull-vec</code>方向进行牵引.</p></li>
<li><p><code>direction-periodic</code><br/>
与<code>direction</code>相同, 但允许距离超过盒长的一半. 使用这种几何设置, 盒子在牵引维度不应该发生变化(例如, 无压力缩放), 不会将拉力添加到维里.</p></li>
<li><p><code>cylinder</code><br/>
用于相对于层的牵引, 参考质心由参考组的一个局部圆柱部分给出. 牵引方向为 <code>pull-vec</code>. 使用两个半径从参考组中选择一个圆柱, 圆柱围绕的轴以<code>pull-vec</code>方向通过牵引组. 半径<code>pull-r1</code>之内的所有相对权重为1, <code>pull-r1</code>和<code>pull-r0</code>之间的权重被切换到零. 也会使用质量权重. 注意, 半径应小于盒子长度的一半. 对于倾斜圆柱, 半径应该比盒长一半更小, 因为参考组中的原子与牵引组质心同时具有径向和轴向分量.</p></li>
</ul>

<p><code>pull-dim</code>: (Y Y Y)<br/>
与牵引几何设置<code>distance</code>联用的距离分量, 也会设置打印到输出文件的分量.</p>

<p><code>pull-r1</code>: (1) [nm]<br/>
牵引几何<code>cylinder</code>的圆柱内径</p>

<p><code>pull-r0</code>: (1) [nm]<br/>
牵引几何<code>cylinder</code>的圆柱外径</p>

<p><code>pull-constr-tol</code>: (1e&#8211;6)<br/>
约束牵引的相对约束容差</p>

<p><code>pull-start</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不修改<code>pull-init</code></p></li>
<li><p><code>yes</code><br/>
将初始构型的质心距离添加到<code>pull-init</code></p></li>
</ul>

<p><code>pull-print-reference</code>: (10)</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不打印每个牵引坐标中第一组的质心</p></li>
<li><p><code>yes</code><br/>
打印每个牵引坐标中第一组的质心</p></li>
</ul>

<p><code>pull-nstxout</code>: (10)<br/>
所有牵引组质心的输出频率</p>

<p><code>pull-nstfout</code>: (1)<br/>
所有牵引组受力的输出频率</p>

<p><code>pull-ngroups</code>: (1)<br/>
牵引组的数量, 使用时不包括绝对参考组. 牵引组可以在多个牵引坐标中重复使用. 下面只给出了第1组的牵引选项, 对其他组的选项, 只需简单地增加组编号即可.</p>

<p><code>pull-ncoords</code>: (1)<br/>
牵引坐标的数目. 下面只给出了坐标1的牵引选项, 对其他其他坐标的选项, 只需简单地增加组编号即可.</p>

<p><code>pull-group1-name</code>:<br/>
牵引组的名称, 在索引文件或默认组中查找, 以获得涉及的原子.</p>

<p><code>pull-group1-weights</code>:<br/>
可选的相对权重, 原子质量乘以此值给出质心的总权重. 此值应为0, 意味着所有原子的相对权重为1, 或牵引组中原子的数目.</p>

<p><code>pull-group1-pbcatom</code>: (0)<br/>
处理组内周期性边界条件的参考原子(不影响组间PBC的处理). 此选项仅当牵引组的直径超过最短盒矢量长度的一半时才重要. 为了确定质心, 组中所有原子被置于其最接近<code>pull-group1-pbcatom</code>的周期性映象. 此值为0时意味着使用中间原子(编号顺序). 此参数不能用于牵引几何<code>cylinder</code>. 此值为&#8211;1时启用余弦加权, 这对周期性的体系中的一组分子有用, 例如, 水的平板(参考 Engin et al. J. Chem. Phys. B 2010).</p>

<p><code>pull-coord1-groups</code>:<br/>
给出牵引坐标作用的两个组的编号. 第一个编号可以是0, 在这种情况下使用<code>pull-coord1-origin</code>的绝对参考. 使用绝对参考时体系不再具有平移不变性, 你应该考虑如何处理质心的运动.</p>

<p><code>pull-coord1-origin</code>: (0.0 0.0 0.0)<br/>
使用绝对参考时牵引的参考位置.</p>

<p><code>pull-coord1-vec</code>: (0.0 0.0 0.0)<br/>
牵引方向. <code>grompp</code>会对此矢量进行归一化.</p>

<p><code>pull-coord1-init:</code>: (0.0) [nm]<br/>
t=0时刻的基准距离.</p>

<p><code>pull-coord1-rate</code>: (0) [nm/ps]<br/>
基准位置的变化速率.</p>

<p><code>pull-coord1-k</code>: (0) [kJ mol<sup>-1</sup> nm<sup>-2</sup> / kJ mol<sup>-1</sup> nm<sup>-1</sup>]<br/>
力常数. 对于伞势牵引, 此值为简谐力常数[kJ mol<sup>-1</sup> nm<sup>-2</sup>]. 对于恒力牵引, 此值为线性势的力常数, 因而为力常数[kJ mol<sup>-1</sup> nm<sup>-1</sup>]的负值(!).</p>

<p><code>pull-coord1-kB</code>: (pull-k1) [kJ mol<sup>-1</sup> nm<sup>-2</sup> / kJ mol<sup>-1</sup> nm<sup>-1</sup>]<br/>
与<code>pull-coord1-k</code>类似, 但用于状态B. 仅当启用<code>free-energy</code>时才使用. 力常数为 (1-lambda)<em><code>pull-coord1-k</code>+lambda</em><code>pull-coord1-kB</code>.</p>

### 7.3.22 NMR精修

<p><code>disre</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
忽略拓扑文件中的距离约束信息</p></li>
<li><p><code>simple</code><br/>
简单(每分子)的距离约束.</p></li>
<li><p><code>ensemble</code><br/>
一个模拟盒中分子系综的距离约束. 正常情况下, 需要对多个子体系进行系综平均, 每个系综处于单独的盒子中, 使用<code>mdrun -multi</code>提供包含不同坐标和/或速度的<code>topol0.tpr</code>, <code>topol1.tpr</code>,&#8230; 环境变量<code>GMX_DISRE_ENSEMBLE_-SIZE</code>设置每个系综中体系的数目(通常等于<code>mdrun -multi</code>的值).</p></li>
</ul>

<p><code>disre-weighting</code>:</p>

<ul class="incremental">
<li><p><code>equal</code> (默认)<br/>
将约束力平分到约束中的所有原子对上</p></li>
<li><p><code>conservative</code><br/>
约束力为约束势的导数, 将导致原子对的权重为r<sup>-7</sup>. 当<code>disre-tau</code>为零时力是守恒的.</p></li>
</ul>

<p><code>disre-mixed</code></p>

<ul class="incremental">
<li><p><code>no</code><br/>
计算约束力时使用时间平均的违反</p></li>
<li><p><code>yes</code><br/>
计算约束力时使用时间平均违反与瞬时违反乘积的平方根</p></li>
</ul>

<p><code>disre-fc</code>: (1000) [kJ mol<sup>-1</sup> nm<sup>-2</sup>]<br/>
距离约束的力常数, 对每个约束乘以一个(可能)不同的因子, 约束在拓扑文件中相互作用的<code>fac</code>列给出.</p>

<p><code>disre-tau:</code> (0) [ps]<br/>
进行距离约束平均的时间常数. 零值关闭时间平均.</p>

<p><code>nstdisreout</code>: (100) [步]<br/>
进行时间平均的间隔步数, 也是约束中涉及的所有原子对之间的瞬时距离写入到能量文件的间隔步数(会使能量文件变得非常大)</p>

<p><code>orire</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
忽略拓扑文件中的取向约束信息</p></li>
<li><p><code>yes</code><br/>
使用取向约束, 可以利用<code>mdrun -multi</code>进行系综平均</p></li>
</ul>

<p><code>orire-fc</code>: (0) [kJ mol]<br/>
取向约束的力常数, 对每个约束乘以一个(可能)不同的权重因子. 可设置为零以获得自由模拟的取向.</p>

<p><code>orire-tau</code>: (0) [ps]<br/>
对取向约束进行时间平均的时间常数. 零值关闭时间平均.</p>

<p><code>orire-fitgrp</code>:<br/>
取向约束的叠合组. 此原子组用于确定体系相对于参考取向的旋转矩阵<code>R</code>. 参考取向为第一个子体系的初始构型. 对蛋白质, 主链是合理的选择.</p>

<p><code>nstorireout</code>: (100) [步]<br/>
进行时间平均的间隔步数, 也是所有约束的瞬时取向和分子序张量写入到能量文件的间隔步数(会使能量文件变得非常大)</p>

### 7.3.23 自由能计算

<p><code>free-energy</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
只使用拓扑A.</p></li>
<li><p><code>yes</code><br/>
在拓扑A(lambda=0)和拓扑B(lambda=1)之间进行内插, 并将哈密顿量对lambda(由<code>dhdl-derivatives</code>指定)的导数或哈密顿量对其他lambda值(由<code>foreign-lambda</code>指定)的差值写入到能量文件和/或<code>dhdl.xvg</code>. 这些文件可用诸如<code>g_bar</code>等程序进行处理. 对势能, 键长, 键角进行线性内插的的方法见本手册中的说明. 当<code>sc-alpha</code>大于零时, 对LJ和库仑相互作用使用软核势.</p></li>
<li><p><code>expanded</code><br/>
启用扩展系综模拟, 其中转化状态变为动力学变量, 允许不同哈密顿之间的跳跃. 请参考扩展系综的选项, 这些选项控制了如何进行扩展系综模拟. 扩展系综模拟中使用的不同哈密顿由其他自由能选项定义.</p></li>
</ul>

<p><code>init-lambda</code>: (&#8211;1) [浮点数]<br/>
lambda的起始值. 通常, 只能用于慢增长方法(即<code>delta-lambda</code>非零). 在其他情况下, 应指定<code>init-lambda-state</code>来代替. 必须大于或等于0.</p>

<p><code>delta-lambda</code>: (0)<br/>
每个时间步lambda的增量</p>

<p><code>init-lambda-state</code>: (&#8211;1) [整数]<br/>
lambda状态的起始值. 指定应使用lambda向量(<code>coul-lambdas</code>, <code>vdw-lambdas</code>, <code>bonded-lambdas</code>, <code>restraint-lambdas</code>, <code>mass-lambdas</code>, <code>temperature-lambdas</code>, <code>fep-lambdas</code>)哪一列. 这是一个从零开始的索引: <code>init-lambda-state</code> 0表示第一列, 依此类推.</p>

<p><code>fep-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 不同lambda值之间的自由能差值可以利用<code>g_bar</code>进行计算. <code>fep-lambdas</code>不同于其他-lambdas关键词, 因为所有未指定的lambda向量的分量都将使用<code>fep-lambdas</code>(包括约束的lambdas, 因而也包括牵引代码约束).</p>

<p><code>coul-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 只有静电相互作用由此lambda向量的分量控制(并且仅当lambda=0和lambda=1的状态具有不同的静电相互作用时).</p>

<p><code>vdw-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 只有van der Waals相互作用由此lambda向量的分量控制.</p>

<p><code>bonded-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 只有键合相互作用由此lambda向量的分量控制.</p>

<p><code>restraint-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 只有约束相互作用: 二面角约束和牵引代码约束由此lambda向量的分量控制.</p>

<p><code>mass-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 只有粒子质量由此lambda向量的分量控制.</p>

<p><code>temperature-lambdas</code>: ()<br/>
零, 一个或更多lambda值, 会计算与其相应的哈密顿差值, 并每隔<code>nstdhdl</code>步写入到dhdl.xvg文件. 值必须处于0和1之间. 只有温度由此lambda向量的分量控制. 注意这些lambda不能用于副本交换, 只能用于模拟回火.</p>

<p><code>calc-lambda-neighbors</code> (1)<br/>
如果设置了<code>init-lambda-state</code>, 此选项控制lambda值的数目, 会计算相应的哈密顿差值并输出. 正值将lambda点的数目限制为只计算到<code>init-lambda-state</code>的第n个邻居. 例如, 若<code>init-lambda-state</code>为5, 此参数值为2, 会计算lambda点3&#8211;7的能量并输出. 此值为&#8211;1意味着会输出所有lambda. 对正常的BAR如g_bar, 此值取1就足够了, 而对于MBAR应该使用&#8211;1.</p>

<p><code>sc-alpha</code>: (0)<br/>
软核势的α参数, 为0时对LJ和库仑相互作用进行线性内插</p>

<p><code>sc-r-power</code>: (6)<br/>
软核势方程中径向项的次数. 可能的值为6和48. 6更标准一些, 为默认值. 当使用48时, <code>sc-alpha</code>一般应更小一些(0.001至0.003).</p>

<p><code>sc-coul</code>: (no)<br/>
是否对分子的库仑相互作用使用软核自由能相互作用变换. 默认是不使用, 因为在禁用van der Waals相互作用前线性地禁用库仑相互作用通常更有效.</p>

<p><code>sc-power</code>: (0)<br/>
软核函数中lambda的次数, 只支持1和2</p>

<p><code>sc-sigma</code>: (0.3) [nm]<br/>
软核势的sigma值, 用于那些C6或C12参数为零, 或sigma小于<code>sc-sigma</code>的粒子</p>

<p><code>couple-moltype</code>:<br/>
这里可以设置计算溶剂化或耦合自由能的分子类型(在拓扑中定义). 特殊选项<code>system</code>用于耦合体系中的所有分子类型, 这对于平衡由(几乎)随机坐标开始的体系有用. 必须启用<code>free-energy</code>选项. 此分子类型的Van der Waals相互作用和/或电荷在lambda=0和lambda=1之间可以启用或关闭, 取决于<code>couple-lambda0</code>和<code>couple-lambda1</code>的设置. 如果想对分子多个副本中的一个去耦合, 你需要在拓扑中复制并重命名分子的定义.</p>

<p><code>couple-lambda0</code>:</p>

<ul class="incremental">
<li><p><code>vdw-q</code><br/>
在lambda=0开启所有相互作用</p></li>
<li><p><code>vdw</code><br/>
在lambda=0电荷为零(无库仑相互作用)</p></li>
<li><p><code>q</code><br/>
在lambda=0开启Van der Waals相互作用. 需要使用软核相互作用避免奇点</p></li>
<li><p><code>none</code><br/>
在lambda=0关闭Van der Waals相互作用, 并且电荷为零. 需要使用软核相互作用避免奇点</p></li>
</ul>

<p><code>couple-lambda1</code>:<br/>
类似于<code>couple-lambda1</code>, 但用于lambda=1</p>

<p><code>couple-intramol</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
对于分子类型<code>couple-moltype</code>, 分子内的所有非键相互作用都被排除, 或以显式的对相互作用代替. 以这种方式, 分子的去耦合状态对应于无周期效应的适当真空状态.</p></li>
<li><p><code>yes</code><br/>
也启用/关闭分子内的Van der Waals和库仑相互作用. 用于较大分子的配分自由能, 这种情况下分子内的非键相互作用可能导致分子被动力学地局限于真空中的构型. 不会关闭1&#8211;4对相互作用.</p></li>
</ul>

<p><code>nstdhdl</code>: (100)<br/>
输出dH/dlambda和可能的哈密顿差值到dhdl.xvg文件的频率, 0表示不输出, 此值应为<code>nstcalcenergy</code>的倍数.</p>

<p><code>dhdl-derivatives</code>: (yes)<br/>
如果为yes(默认值), 每<code>nstdhdl</code>步会输出哈密顿对lambda的导数. 使用<code>g_bar</code>(尽管使用正确的<code>foreign-lambda</code>设置也可以做到, 但可能不够灵活)或热力学积分对线性能量差值进行内插时需要这些导数值.</p>

<p><code>dhdl-print-energy</code>: (no)<br/>
在dhdl文件中包含总能量会势能. 可用选项有&#8217;no&#8217;, &#8216;potential&#8217;或&#8217;total&#8217;. 如果感兴趣的状态处于不同的温度, 后面进行自由能分析时需要这些信息. 如果所有状态的温度都相同, 不需要这些信息. 当使用<code>mdrun -rerun</code>产生<code>dhdl.xvg</code>文件时, &#8217;potential&#8217;选项非常有用. 当从已有轨迹重新运行时, 动能经常是不正确的, 因此必须单独使用势能来计算残余的自由能, 并解析地计算动能分量.</p>

<p><code>separate-dhdl-file</code>: (yes)</p>

<ul class="incremental">
<li><p><code>yes</code><br/>
计算出的自由能(在<code>foreign-lambda</code>和<code>dhdl-derivatives</code>中设置)写入到一个单独的文件, 默认文件名为<code>dhdl.xvg</code>. <code>g_bar</code>可直接使用此文件.</p></li>
<li><p><code>no</code><br/>
自由能写入到能量输出文件(<code>ener.edr</code>, 以累积块的形式, 每<code>nstenergy</code>步一次), 可使用<code>g_energy</code>或直接使用<code>g_bar</code>来提取.</p></li>
</ul>

<p><code>dh-hist-size</code>: (0)<br/>
如果为非零值, 指定分格哈密顿差值(<code>foreign-lambda</code>指定)或导数dH/dl值的直方图的大小, 并写入ener.edr. 当计算自由能差值时, 这样做可以节省磁盘空间. 每个<code>foreign lambda</code>输出一个直方图, 每个dH/dl输出两个直方图, 每<code>nstenergy</code>步一次. 记住, 不正确的直方图设置(尺寸过小或分格太宽)可引入错误. 不要使用直方图, 除非你确定自己需要它.</p>

<p><code>dh-hist-spacing</code>: (0.1)<br/>
指定直方图的分格宽度, 以能量为单位. 与<code>dh-hist-size</code>结合使用. 此大小限制了自由能计算的精度. 不要使用直方图, 除非你确定自己需要它.</p>

### 7.3.24 扩展系综计算

<p><code>nstexpanded</code><br/>
在扩展系综模拟中, 尝试移动之间的积分步数, 移动时会改变体系的哈密顿量. 必须为<code>nstcalcenergy</code>的倍数, 但可以大于或小于<code>nstdhdl</code>.</p>

<p><code>lmc-stats:</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不在状态空间中进行Monte Carlo.</p></li>
<li><p><code>metropolis-transition</code><br/>
使用<code>Metropolis</code>权重更新每个状态的扩展系综权重. Min1, exp(-(beta_new u_new - beta_old u_old))</p></li>
<li><p><code>barker-transition</code><br/>
使用Barker转移判据更新每个状态i的扩展系综权重, 定义为exp(-beta_new u_new)/[exp(-beta_new u_new)+exp(-beta_old u_old)]</p></li>
<li><p><code>wang-landau</code><br/>
使用Wang-Landau算法(在状态空间, 而不是能量空间)来更新扩展系综的权重.</p></li>
<li><p><code>min-variance</code><br/>
使用Escobedo等人的最小方差更新方法来更新扩展系综的权重. 权重将不再是自由能, 但更重视那些需要更多采样以给出不确定度的状态.</p></li>
</ul>

<p><code>lmc-mc-move</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不在状态空间中进行Monte Carlo.</p></li>
<li><p><code>metropolis-transition</code><br/>
随机选择一个新的状态, 向上或向下, 然后使用Metropolis判据来决定接受还是拒绝: Min1, exp(-(beta_new u_new - beta_old u_old))</p></li>
<li><p><code>barker-transition</code><br/>
随机选择一个新的状态, 向上或向下, 然后使用Barker转移判据来决定接受还是拒绝: exp(-beta_new u_new)/[exp(-beta_new u_new)+exp(-beta_old u_old)]</p></li>
<li><p><code>gibbs</code><br/>
使用给定坐标状态的条件权重 (exp(-beta_i u_i)/sum_k exp(beta_i u_i) 决定转移到哪个状态.</p></li>
<li><p><code>metropolized-gibbs</code><br/>
使用给定坐标状态的条件权重 (exp(-beta_i u_i)/sum_k exp(beta_i u_i) 决定转移到哪个状态, <strong>排除</strong> 当前状态, 然后使用拒绝步骤保证细致平衡. 总是比Gibbs方法高效, 尽管在许多情况下只略微高效一点, 例如只有当最近的邻区有明显的相空间重叠时.</p></li>
</ul>

<p><code>lmc-seed</code>: (&#8211;1)<br/>
在状态空间进行Monte Carlo移动时使用的随机数种子. 当<code>lmc-seed</code>设置为&#8211;1时, 将使用伪随机数种子.</p>

<p><code>mc-temperature</code>:<br/>
用于接受/拒绝Monte Carlo移动的温度. 如果未指定, 会使用在第一组<code>ref_t</code>中指定的模拟温度.</p>

<p><code>wl-ratio</code>: (0.8)<br/>
要重置的状态占据数直方图的截断值, 自由能增量重置为delta-&gt;delta*<code>wl-scale</code>. 如果我们定义Nratio = (每个直方区间的采样数)/(每个直方区间的平均采样数), <code>wl-ratio</code>的值为0.8意味着, 只有当所有Nratio&gt;0.8 <strong>并且</strong> 同时所有1/Nratio&gt;0.8时. 直方图才被认为时平坦的.</p>

<p><code>wl-scale</code>: (0.8)<br/>
每当直方图被认为很平时, 自由能Wang-Landau增量的当前值会乘以<code>wl-scale</code>. 此值必须介于0和1之间.</p>

<p><code>init-wl-delta</code>: (1.0)<br/>
Wang-Landau增量的初始值, 以kT为单位. 接近1 kT的值通常最有效, 尽管有时2&#8211;3 kT的值更好, 如果自由能差值较大的话.</p>

<p><code>wl-oneovert</code>: (no)<br/>
在大量采样极限情况下, 设置Wang-Landau增量的缩放为模拟时间的倒数. 有确切证据表明, 这里使用的状态空间中标准的Wang-Landau算法可导致自由能&#8217;燃烧&#8217;到不正确的值, 且依赖于初始状态. 当<code>wl-oneovert</code>为yes时, 若增量小于1/N, 其中N为收集的样本数(因此正比于数据收集时间, &#8216;1/t&#8217;), 则将Wang-Lambda增量设设置为1/N, 每步降低. 一旦发生这种情况, 将忽略<code>wl-ratio</code>, 但当达到<code>lmc-weights-equil</code>设置的平衡判据后, 权重仍将停止更新.</p>

<p><code>lmc-repeats</code>: (1)<br/>
控制每次迭代中执行每个Monte Carlo交换类型的次数. 在大量Monte Carlo重复的极限情况下, 所有方法都收敛到Gibbs采样方法. 此值通常不需要不同于1.</p>

<p><code>lmc-gibbsdelta</code>: (&#8211;1)<br/>
限制Gibbs采样到选定的相邻状态数. 对于Gibbs采样方法, 对所有定义的状态都进行采样有时效率比较低. <code>lmc-gibbsdelta</code>取正值意味着只有加或减<code>lmc-gibbsdelta</code>的状态才能进行上下交换. 值为&#8211;1意味着所有状态都可交换. 当状态数少于100时, 包括所有的状态可能并没有那么耗时.</p>

<p><code>lmc-forced-nstart</code>: (0)<br/>
强制在初始状态空间进行采样以产生权重. 为得到合理的初始权重, 此设置允许模拟从开始到最后的lambda状态进行驱动, 在每个状态, 移动到下一lambda状态前进行<code>lmc-forced-nstart</code>步. 如果<code>lmc-forced-nstart</code>足够长(几千步, 也许), 权重就会接近正确值. 然而, 在大多数情况下, 简单地使用标准的权重平衡算法可能更好.</p>

<p><code>nst-transition-matrix</code>: (&#8211;1)<br/>
输出扩展系综转移矩阵的频率. 负值表示只在模拟的最后输出.</p>

<p><code>symmetrized-transition-matrix</code>: (no)<br/>
是否对称化经验转移矩阵. 在极限情况下, 矩阵将是对称的, 但在短的时间尺度内由于统计噪声会变得不对称. 通过使用矩阵T_sym = 1/2 (T + transpose(T))强制对称化, 可以避免一些问题, 如(振幅很小的)负本征值.</p>

<p><code>mininum-var-min</code>: (100)<br/>
如果选择了<code>min-variance</code>策略(<code>lmc-stats</code>的选项仅适用于大量采样, 如果在每个状态使用的样本太少会被卡住.) <code>mininum-var-min</code>为每个状态在<code>min-variance</code>策略被激活之前允许的最小采样数.</p>

<p><code>init-lambda-weights</code>:<br/>
用于扩展系综状态的初始权重(自由能). 默认为零权重向量. 格式类似于<code>fep-lambda</code>设置的lambda向量, 但权重可以为任意浮点数. 单位为kT. 长度必须匹配lambda向量的长度.</p>

<p><code>lmc-weights-equil</code>: (no)</p>

<ul class="incremental">
<li><p><code>no</code><br/>
在整个模拟中连续更新扩展系综权重.</p></li>
<li><p><code>yes</code><br/>
输入的扩展系综权重被视为平衡值, 在整个模拟过程中不更新.</p></li>
<li><p><code>wl-delta</code><br/>
当Wang-Landau增量低于<code>weight-equil-wl-delta</code>指定的值时, 停止更新扩展系综权重.</p></li>
<li><p><code>number-all-lambda</code><br/>
当所有lambda状态的采样数都大于<code>weight-equil-number-all-lambda</code>指定的值时, 停止更新扩展系综权重.</p></li>
<li><p><code>number-steps</code><br/>
当步数大于<code>weight-equil-number-steps</code>指定的值时, 停止更新扩展系综权重.</p></li>
<li><p><code>number-samples</code><br/>
当所有lambda状态的总采样数大于<code>weight-equil-number-samples</code>指定的值时, 停止更新扩展系综权重.</p></li>
<li><p><code>count-ratio</code><br/>
当最小和最大采样lambda状态的采样数之间的比值大于<code>weight-equil-count-ratio</code>指定的值时, 停止更新扩展系综权重.</p></li>
</ul>

<p><code>simulated-tempering</code>: (no)<br/>
启用或关闭模拟回火. 模拟回火是通过扩展系综采样实现的, 实现时使用不同的温度代替了不同的哈密顿.</p>

<p><code>sim-temp-low</code>: (300)<br/>
模拟回火的低温值.</p>

<p><code>sim-temp-high</code>: (300)<br/>
模拟回火的高温值.</p>

<p><code>simulated-tempering-scaling</code>: (linear)<br/>
控制从lambd向量的<code>temperature-lambda</code>部分计算中间lambda对应温度的方式.</p>

<ul class="incremental">
<li><p><code>linear</code><br/>
使用<code>temperature-lambda</code>的值对温度进行线性内插, 即, 若<code>sim-temp-low</code>=300, <code>sim-temp-high</code>=400, 则lambda=0.5对应的温度为350. 非线性的温度设定总可以通过不均匀间距的lambda实现.</p></li>
<li><p><code>geometric</code><br/>
在<code>sim-temp-low</code>和<code>sim-temp-high</code>之间对温度进行几何内插. 第i个状态的温度为 <code>sim-temp-low</code> * (<code>sim-temp-high</code>/<code>sim-temp-low</code>)的(i/(ntemps&#8211;1))次方. 对恒定热容, 这种方法应该给出大致相等的交换, 尽管那些涉及蛋白质折叠的模拟具有很高的热容峰.</p></li>
<li><p><code>exponential</code><br/>
在<code>sim-temp-low</code>和<code>sim-temp-high</code>之间对温度进行指数内插. 第i个状态的温度为 <code>sim-temp-low</code> + (<code>sim-temp-high</code>-<code>sim-temp-low</code>)*((exp(<code>temperature-lambdas</code>[i])&#8211;1)/(exp(1.0)&#8211;1)).</p></li>
</ul>

### 7.3.25 非平衡MD

<p><code>acc-grps</code>:<br/>
具有恒定加速度的组(如<code>Protein</code> <code>Sol</code>), <code>Protein</code>和<code>Sol</code>组中的所有原子都将具有恒定的加速度, 加速度的值在<code>accelerate</code>行中指定.</p>

<p><code>accelerate</code>: (0) [nm ps<sup>-2</sup>]<br/>
<code>acc-grps</code>的加速度, 对每个组有x, y和z三个分量(例如, <code>0.1 0.0 0.0 -0.1 0.0 0.0</code>意味着, 第一组在X方向具有恒定的加速度0.1 nm ps<sup>-2</sup>, 第二组的加速度与第一组相反).</p>

<p><code>freezegrps</code>:<br/>
群组将被冻结(即其X, Y, 和/或Z位置不会被更新;如 脂质SOL).freezedim指定哪个维度的冻结申请.为了避免 虚假contibrutions的维里和压力, 由于之间完全大部队 冷冻原子, 你需要使用能源集团排除, 这也节省了计算时间. 需要注意的是冷冻原子的坐标不被压耦合算法缩放.</p>

<p><code>freezedim</code>:<br/>
尺寸为这组freezegrps应该被冻结, 指定Y或N为X, Y 与Z和为每个组(例如YYNNNN意味着, 在第一组中的粒子可以 仅在Z方向移动.在第二组中的粒子可以以任何方向移动).</p>

<p><code>cos-acceleration</code>: (0) [nm ps<sup>-2</sup>]<br/>
所述加速度曲线的振幅来计算粘度.加速度为 在X方向和大小是COS-加速度COS(2π的z / boxheight).两 术语被添加到能量的文件: 速度分布和第1 /粘度的振幅.</p>

<p><code>deform</code>: (0 0 0 0 0 0) [nm ps<sup>-1</sup>]<br/>
变形对框要素的速度: A(X)B(y)的C(Z)B(X)C(X)C(Y).每一步 为其变形的框元件是非零的计算公式为: 箱(TS)+(叔TS)*变形, 非对角元素被用于校正周期性.的坐标变换与符合 多地.冷冻自由度都(故意)也改变.时间Ts设定为t时 第一步, 在步骤在其中x和v被写入轨迹保证精确重新启动. 变形可以与semiisotropic或各向异性压力耦合时, 可以使用 适当的可压缩被设置为零.对角元素可以用来对应变 固体.非对角元素可用于剪切固体或液体.</p>

### 7.3.26 电场

<p><code>E-x</code>; <code>E-y</code>; <code>E-z</code>:<br/>
如果你想在某个方向上使用电场, 在适当的<code>E-*</code>后输入3个数字. 第一个数字: 余弦的数目, 只实现了单个余弦项(频率为0), 所以输入1; 第二个数字: 电场强度, 以<code>V/nm</code>为单位; 第三个数字: 余弦的相位, 你可以在这里输入任何数字, 因为频率为零的余弦没有相位.</p>

<p><code>E-xt</code>; <code>E-yt</code>; <code>E-zt</code>:<br/>
尚未实现</p>

### 混合量子/经典分子动力学

<p><code>QMMM</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
无QM/MM.</p></li>
<li><p><code>yes</code><br/>
QM/MM模拟. 可以使用不同水平的QM单独对几个组进行描述, 在<code>QMMM-grps</code>域中指定这些组, 彼此之间以空格隔开. 各个组使用的从头算方法的水平在<code>QMmethod</code>和<code>QMbasis</code>域中指定. 使用不同水平的方法对组进行描述只能与ONIOM QM/MM一起使用, 由<code>QMMMscheme</code>指定.</p></li>
</ul>

<p><code>QMMM-grps:</code>:<br/>
QM水平的组</p>

<p><code>QMMMscheme</code>:</p>

<ul class="incremental">
<li><p><code>normal</code><br/>
正常的QM/MM. 只能对一个<code>QMMM-grps</code>使用从头算方法进行描述, 方法的水平通过<code>QMmethod</code>和<code>QMbasis</code>指定. 体系的其余部分处于MM水平. QM和MM两个子体系的相互作用如下: MM部分的点电荷包含在QM部分的单电子哈密顿算符中, 所有的Lennard-Jones相互作用都在MM水平进行描述.</p></li>
<li><p><code>ONIOM</code><br/>
使用Morokuma及其同事发展的ONIOM方法对子体系之间的相互作用进行描述. 可以有一个以上的<code>QMMM-grps</code>, 每个组可以使用不同级别的QM(<code>QMmethod</code>和<code>QMbasis</code>)进行描述.</p></li>
</ul>

<p><code>QMmethod</code>: (RHF)<br/>
用于计算QM原子的能量和梯度的方法. 可用的方法包括AM1, PM3, RHF, UHF, DFT, B3LYP, MP2, CASSCF和MMVB. 对CASSCF, 电子数和活化空间的轨道数分别由<code>CASelectrons</code>和<code>CASorbitals</code>指定.</p>

<p><code>QMbasis</code>: (STO&#8211;3G)<br/>
用于展开电子波函数的基组. 目前只可使用高斯基组, 即STO&#8211;3G, 3&#8211;21G, 3&#8211;21G<em>, 3&#8211;21+G</em>, 6&#8211;21G, 6&#8211;31G, 6&#8211;31G<em>, 6&#8211;31+G</em>和6&#8211;311G.</p>

<p><code>QMcharge</code>: (0) [整数]<br/>
<code>QMMM-grps</code>的总电荷数, 以<code>e</code>为单位. 在有一个以上<code>QMMM-grps</code>的情况下, 需要单独指定每个ONIOM层的总电荷.</p>

<p><code>QMmult</code>: (1) [整数]<br/>
<code>QMMM-grps</code>的多重度. 在有一个以上<code>QMMM-grps</code>的情况下, 需要单独指定每个ONIOM层的多重度.</p>

<p><code>CASorbitals</code>: (0) [整数]<br/>
进行CASSCF计算时包含在活化空间中的轨道数.</p>

<p><code>CASelectrons</code>: (0) [整数]<br/>
进行CASSCF计算时包含在活化空间中的电子数.</p>

<p><code>SH</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
无势能面跳跃. 体系总处于电子基态.</p></li>
<li><p><code>yes</code><br/>
在激发态势能面进行QM/MM的MD模拟, 在模拟过程中, 当体系碰到锥形交叉线时, 强制 <strong>非绝热</strong> 跳跃到基态. 此选项只能与CASSCF方法联合使用.</p></li>
</ul>

### 7.3.27 隐式溶剂

<p><code>implicit-solvent</code>:</p>

<ul class="incremental">
<li><p><code>no</code><br/>
不使用隐式溶剂</p></li>
<li><p><code>GBSA</code><br/>
使用基于广义Born公式的隐式溶剂进行模拟. 共有三种不同的方法可用以计算Born半径: Still, HCT和OBC, 模拟时所用的方法可在<code>gb-algorithm</code>行中指定. 非极性溶剂化可通过<code>sa-algorithm</code>选项指定.</p></li>
</ul>

<p><code>gb-algorithm</code>:</p>

<ul class="incremental">
<li><p><code>Still</code><br/>
用Still方法计算Born半径</p></li>
<li><p><code>HCT</code><br/>
使用Hawkins-Cramer-Truhlar方法计算Born半径</p></li>
<li><p><code>OBC</code><br/>
使用Onufriev-Bashford-Case方法计算Born半径</p></li>
</ul>

<p><code>nstgbradii</code>: (1) [步] </br>
(重新)计算Born半径的频率. 对于大多数实际模拟, 设置大于1的值会破坏能量守恒并导致轨迹不稳定.</p>

<p><code>rgbradii</code>: (1.0) [nm]<br/>
计算Born半径的截断值. 目前必须与<code>rlist</code>相等</p>

<p><code>gb-epsilon-solvent</code>: (80)<br/>
隐式溶剂的介电常数</p>

<p><code>gb-saltconc</code>: (0) [M]<br/>
隐式溶剂模型的盐浓度, 目前并未使用</p>

<p><code>gb-obc-alpha</code> (1); <code>gb-obc-beta</code> (0.8); <code>gb-obc-gamma</code> (4.85);<br/>
OBC模型的缩放因子. 默认值为OBC(II)的值. OBC(I)的值分别为0.8, 0和2.91.</p>

<p><code>gb-dielectric-offset</code>: (0.009) [nm]<br/>
计算Born半径时介电偏移的距离, 它是每个原子的中心与相应原子极化能量中心之间的偏移</p>

<p><code>sa-algorithm</code></p>

<ul class="incremental">
<li><p><code>Ace-approximation</code><br/>
使用Ace类型的近似</p></li>
<li><p><code>None</code><br/>
不计算非极性溶剂化. 对GBSA只计算极性部分</p></li>
</ul>

<p><code>sa-surface-tension</code>: (-1) [kJ mol<sup>-1</sup> nm<sup>-2</sup>]<br/>
SA算法中表面张力的默认值. 默认值为&#8211;1. 注意, 如果不改变此默认值, <code>grompp</code>将会使用与选择的半径算法相应的值覆盖默认值(Still: 0.0049 kcal/mol/&#197;<sup>2</sup>, HCT/OBC: 0.0054 kcal/mol/&#197;<sup>2</sup>). 将此值设置为0, 并使用SA算法意味着不计算非极性部分.</p>

### 7.3.28 自适应分辨率模拟

<p><code>adress:</code> (no)<br/>
是否开启AdResS功能.</p>

<p><code>adress-type</code>: (off)</p>

<ul class="incremental">
<li><p><code>Off</code><br/>
AdResS模拟的权重为1, 相当于一个显式(正常)的MD模拟. 与禁用AdResS的区别在于, 仍会读入并定义AdResS变量.</p></li>
<li><p><code>Constant</code><br/>
AdResS模拟的权重为常数,权重值由<code>adress-const-wf</code>定义</p></li>
<li><p><code>XSplit</code><br/>
AdResS模拟时沿x方向劈分模拟盒, 因此基本上权重只是x坐标的函数, 所有距离都只使用x坐标进行测量.</p></li>
<li><p><code>Sphere</code><br/>
AdResS模拟的显式区域为球形.</p></li>
</ul>

<p><code>adress-const-wf</code>: (1)<br/>
常权重模拟的权重(<code>adress-type=Constant</code>)</p>

<p><code>adress-ex-width</code>: (0)<br/>
显式区域的宽度, 从<code>adress-reference-coords</code>开始测量.</p>

<p><code>adress-hy-width</code>: (0)<br/>
混合区域的宽度.</p>

<p><code>adress-reference-coords</code>: (0,0,0)<br/>
显式区域的中心位置. 测量与它的距离时会使用周期性边界条件.</p>

<p><code>adress-cg-grp-names</code>:<br/>
粗粒能量组的名称. 所有其他能量组都被认为是显式的, 它们之间的相互作用会被自动从粗粒组中排除.</p>

<p><code>adress-site</code>: (COM)<br/>
用于计算权重的映射点.</p>

<ul class="incremental">
<li><p><code>COM</code><br/>
权重由每个电荷组的质心来计算.</p></li>
<li><p><code>COG</code><br/>
权重由每个电荷组的几何中心来计算.</p></li>
<li><p><code>Atom</code><br/>
权重由每个电荷组中第一个原子的位置来计算.</p></li>
<li><p><code>AtomPerAtom</code> </p></li>
</ul>

<p>权重由每个单独的原子的位置来计算.</p>

<p><code>adress-interface-correction</code>: (off)</p>

<ul class="incremental">
<li><p><code>off</code><br/>
不使用任何界面校正.</p></li>
<li><p><code>thermoforce</code><br/>
使用热力学力的界面校正. 可以使用<code>mdrun</code>的<code>-tabletf</code>选项指定表格. 该表格应包含(作用在分子上的)势能和力, 它们是<code>adress-reference-coords</code>中距离的函数.</p></li>
</ul>

<p><code>adress-tf-grp-names</code><br/>
若启用<code>adress-interface-correction</code>时, 施加<code>thermoforce</code>校正的能量组的名称. 如果没有给出组, 会应用到默认的表.</p>

<p><code>adress-ex-forcecap</code>: (0)<br/>
在混合区域对力进行平齐, 对大分子有用. 0禁用力平齐.</p>

### 7.3.29 用户自定义项

<p><code>user1-grps</code>; <code>user2-grps</code>:</p>

<p><code>userint1</code> (0); <code>userint2</code> (0); <code>userint3</code> (0); <code>userint4</code> (0)</p>

<p><code>userreal1</code> (0); <code>userreal2</code> (0); <code>userreal3</code> (0); <code>userreal4</code> (0)<br/>
如果修改了源代码你就可以使用这些. 你可以传递整数和实数到你的子程序. 检查<code>src/include/types/inputrec.h</code>中inputrec的定义.</p>
