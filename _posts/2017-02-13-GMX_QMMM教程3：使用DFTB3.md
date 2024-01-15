---
 layout: post
 title: GROMACS QM/MM教程3：使用DFTB3进行QM/MM模拟
 categories:
 - 科
 tags:
 - gmx
---

- 原始文档 [GROMACS with QM/MM using DFTB3](http://cbp.cfn.kit.edu/joomla/index.php/downloads/18-gromacs-with-qm-mm-using-dftb3)
- 2017年02月12日 20:52:46 翻译: 陈国俊; 校对: 李继存

分子动力学模拟软件GROMACS包含了QM/MM模块, 其中的量子化学计算需要通过外部程序来进行. GROMACS目前提供的量子化学接口包括: Gamess UK, Gaussian, Mopac和Orca. 详情请参阅[GROMACS官方说明](http://www.gromacs.org/Documentation/How-tos/QMMM).

DFTB是基于密度泛函理论的参数化量子化学计算方法, 其最新版本DFTB3发展于2011年, 能够成功地用于描述有机和生物分子体系, 并比常规的DFT方法快100到1000倍. 对于DFTB的介绍, 可以参考[DFTB2](http://journals.aps.org/prb/abstract/10.1103/PhysRevB.58.7260)与[DFTB3](http://pubs.acs.org/doi/abs/10.1021/ct100684s)的原始论文.

我们已经在GROMACS 5中实现了DFTB方法. 这意味着所有计算都是在GROMACS程序中进行的, 运行QM/MM模拟时不再需要借助外部程序. 实现方法可参考我们发表的论文:

T. Kubař, K. Welke and G. Groenhof: New QM/MM Implementation of the DFTB3 method in the Gromacs Package, <em>J. Comput. Chem.</em> [DOI:10.1002/jcc.24029](http://dx.doi.org/10.1002/jcc.24029) (2015)

DFTB方法不能描述London色散作用. 不过, 对能量进行经验的post-SCF校正可以弥补这个缺陷. 目前, 我们已经实现了D3色散校正. 需要使用时, 请参考[D3](http://scitation.aip.org/content/aip/journal/jcp/132/15/10.1063/1.3382344)和[D3-BJ](http://onlinelibrary.wiley.com/doi/10.1002/jcc.21759/abstract)的论文.

## 获取并安装程序

首先, 从GROMACS官方网站上获取[GROAMCS 5.0版本](ftp://ftp.gromacs.org/pub/gromacs/gromacs-5.0.tar.gz).

同时, 我们需要将GROMACS与PLUMED联用, 所以你还需要获取[PLUMED 2.1或2.1.x版本](http://www.plumed.org/get-it).

安装PLUMED, 但先不要为GROMACS打补丁.

获取实现DFTB的BGROMACS补丁, [最新版本](http://cbp.cfn.kit.edu/joomla/downloads/gromacs-5.0-dftb-v6a-plumed.patch.tgz)于2015年10月30日发布.(请通过电子邮件告知我们, 你的姓名及地址, 何时下载了我们的程序. 我们会为你的信息保密, 并不会将其透漏给第三方. 谢谢)

使用刚刚下载的文件为GROMACS打补丁:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">tar<span style="color: #bbbbbb"> </span>-xvzf<span style="color: #bbbbbb"> </span>gromacs-5.0-dftb-v6-plumed.patch.tgz<span style="color: #bbbbbb"></span>
patch<span style="color: #bbbbbb"> </span>-p0<span style="color: #bbbbbb">  </span>gromacs-5.0-dftb-v6a-plumed.patch<span style="color: #bbbbbb"></span>
</pre></div>

手动改正GROMACS主目录, `Plumed.cmake`和`Plumed.inc`文件中对`libplumed.so`或`libplumed.a`文件的引用, 使其与你的安装一致.

编译GROMACS. 选择`dftb`作为`GMX_QMMM_PROGRAM`的值, 并且关闭CUDA以及所有的并行选项(MPI, THREAD_MPI和OPENMP). 最好编译为双精度版本(`GMX_DOUBLE=ON`). 当链接到MKL线性代数库时可能会遇到问题. 如果你解决了这些问题, 请告知我们.

## 获取参数集

DFTB方法涉及一些参数集, 请查阅原始文献获取更多信息. 在<www.dftb.org>网站上注册后便可免费获得参数文件. 对于有机和生物分子, 我们推荐使用DFTB3方法和3OB参数集. 需要注意的是, 目前支持的化学元素仅包括: H, C, N, O, P, S, F, Cl, Br, I, Na, K和Ca.

从网站获得的参数文件不能被类似GROMACS的C语言程序直接读取. 所以, 要将其转换为合适的格式. 你可以下载一个[脚本](http://cbp.cfn.kit.edu/joomla/downloads/skf-to-c.sh)来完成这个工作. 不过需要注意的是, 需要在脚本中指定要处理的化学元素.

假如你需要在DFTB计算中应用D3色散校正, 还要下载必须的[参数文件](http://cbp.cfn.kit.edu/joomla/downloads/dftd3-files.tgz)并将其解压到DFTB参数文件所在的文件夹.

## 进行模拟

由于使用了原始的GROMACS QM/MM接口, 所以你需要先了解这一部分的[GROMACS官方说明](http://www.gromacs.org/Documentation/How-tos/QMMM). 需要注意的是, 进行QM/MM模拟时必须修改拓扑文件, 并且在目前的实现中, QM区域必须完全处于一个分子中(以拓扑的角度而言).

运行输入文件(`.mdp`)中与QM/MM相关的选项总结如下:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">QMMM<span style="color: #bbbbbb">                </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span>yes<span style="color: #bbbbbb"></span>
QMMM<span style="color: #666666">-</span>grps<span style="color: #bbbbbb">           </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span>QMsystem<span style="color: #bbbbbb">  </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">需要在索引文件中定义</span><span style="color: #bbbbbb"></span>
QMMMscheme<span style="color: #bbbbbb">          </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span>normal<span style="color: #bbbbbb"></span>
QMmethod<span style="color: #bbbbbb">            </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span>RHF<span style="color: #bbbbbb">       </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">需要但会被忽略</span><span style="color: #bbbbbb"></span>
QMbasis<span style="color: #bbbbbb">             </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span>STO<span style="color: #666666">-3</span>G<span style="color: #bbbbbb">    </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">需要但会被忽略</span><span style="color: #bbbbbb"></span>
QMcharge<span style="color: #bbbbbb">            </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">0</span><span style="color: #bbbbbb">         </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">整数</span><span style="color: #bbbbbb"></span>
MMchargescalefactor<span style="color: #bbbbbb"> </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">1.</span><span style="color: #bbbbbb">        </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">或更小值</span><span style="color: #bbbbbb"></span>
</pre></div>

使用DFTB运行QM/MM时, 还有一些额外的选项:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">QMdftbsccmode<span style="color: #bbbbbb">         </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">3</span><span style="color: #bbbbbb">             </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">3对应DFTB3,</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">2对应DFTB2(也即SCC-DFTB)</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>telec<span style="color: #bbbbbb">          </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">10.</span><span style="color: #bbbbbb">           </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">费米分布的&quot;电子温度&quot;</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>slko<span style="color: #666666">-</span>path<span style="color: #bbbbbb">      </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">/</span>path<span style="color: #666666">/</span>to<span style="color: #666666">/</span>skf<span style="color: #666666">/</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">参数文件的路径,</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">含最后的斜线</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>slko<span style="color: #666666">-</span>separator<span style="color: #bbbbbb"> </span><span style="color: #666666">=</span><span style="color: #bbbbbb">               </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">元素名称间的可能字符</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>slko<span style="color: #666666">-</span>lowercase<span style="color: #bbbbbb"> </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span>yes<span style="color: #bbbbbb">           </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">或no,</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">文件名称中使用&quot;Ca&quot;还是&quot;ca&quot;</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>slko<span style="color: #666666">-</span>suffix<span style="color: #bbbbbb">    </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">-</span>c<span style="color: #666666">.</span>spl<span style="color: #bbbbbb">        </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">文件名称</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>partial<span style="color: #666666">-</span>pme<span style="color: #bbbbbb">    </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">1</span><span style="color: #bbbbbb">             </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">加速的PMF计算,</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">推荐使用(置零关闭)</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>dispersion<span style="color: #bbbbbb">     </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">1</span><span style="color: #bbbbbb">             </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">使用D3,</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">或者置零忽略色散校正</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>cdko<span style="color: #bbbbbb">           </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">0</span><span style="color: #bbbbbb">             </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">目前没实现</span><span style="color: #bbbbbb"></span>
QMdftb<span style="color: #666666">-</span>mmhub<span style="color: #666666">-</span>inf<span style="color: #bbbbbb">      </span><span style="color: #666666">=</span><span style="color: #bbbbbb"> </span><span style="color: #666666">1</span><span style="color: #bbbbbb">             </span><span style="color: #008800; font-style: italic">;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">目前没实现</span><span style="color: #bbbbbb"></span>
</pre></div>

此外, 进行QM/MM模拟时需要注意下面的通用设置:

- 推荐使用`cutoff-scheme=group`, 因为我们并不确定Verlet算法如何用于QM/MM
- 在一些模拟中, 如果没有明确指定`nstpcouple`变量, 进行NPT模拟时往往会得到错误结果. 我们推荐在运行输入文件中设置`nstpcouple=1`, 或使用NVT模拟

运行`mdrun`程序前, 可设置一些合适的环境变量以便使用扩展功能:

<div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_SLKO_PATH</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;/path/...&quot;</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">覆盖.mdp中的设置</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_SLKO_LOWERCASE</span><span style="color: #666666">=</span>y<span style="color: #bbbbbb">      </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">覆盖.mdp中的设置</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_SLKO_SEPARATOR</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;-&quot;</span><span style="color: #bbbbbb">    </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">覆盖.mdp中的设置</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_SLKO_SUFFIX</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;.skf&quot;</span><span style="color: #bbbbbb">    </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">覆盖.mdp中的设置</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_TELEC</span><span style="color: #666666">=</span>300.<span style="color: #bbbbbb">            </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">覆盖.mdp中的设置</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_QM_COORD</span><span style="color: #666666">=</span>n<span style="color: #bbbbbb">            </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">QM原子的坐标每</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">n</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">步输出一次</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_MM_COORD</span><span style="color: #666666">=</span>n<span style="color: #bbbbbb">            </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">MM原子的坐标每</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">n</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">步输出一次</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_CUTOFF</span><span style="color: #666666">=1</span><span style="color: #bbbbbb">              </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">使用switched-force</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">cut-off而不是PME处理QM/MM静电相互作用</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_RFIELD</span><span style="color: #666666">=1</span><span style="color: #bbbbbb">              </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">使用reaction-field而不是PME处理QM/MM静电相互作用</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_SHIFT</span><span style="color: #666666">=1</span><span style="color: #bbbbbb">               </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">使用shifted-force</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">cut-off而不是PME处理QM/MM静电相互作用</span><span style="color: #bbbbbb"></span>
<span style="color: #AA22FF">export</span><span style="color: #bbbbbb"> </span><span style="color: #B8860B">GMX_DFTB_SURFACE_CORRECTION</span><span style="color: #666666">=1</span><span style="color: #bbbbbb">  </span><span style="color: #008800; font-style: italic">#</span><span style="color: #bbbbbb"> </span><span style="color: #008800; font-style: italic">PME中使用偶极校正而不是使用tin-foil边界条件</span><span style="color: #bbbbbb"></span>
</pre></div>

在模拟的过程中, 除了会生成常规的一些输出文件之外, `mdrun`还会额外生成一个名为 `qm_dftb_chargs.xvg`的文件, 其中包含了原子的Mulliken电荷.

## 版本历史

- v6a: 修订版本(2015年10月30) [下载链接](http://cbp.cfn.kit.edu/joomla/downloads/gromacs-5.0-dftb-v6a-plumed.patch.tgz)
- v6: 原始版本, GROMACS 5.0 + Plumed 2.1/2.1.x(2015年3月26) [下载链接](http://cbp.cfn.kit.edu/joomla/downloads/gromacs-5.0-dftb-v6-plumed.patch.tgz)
