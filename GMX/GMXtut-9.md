---
 layout: post
 title: GROMACS教程：使用GROMACS计算MM-PBSA结合自由能
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}

<ul class="incremental">
<li>整理: 李继存</li>
</ul>

## 基础知识

<p>在分子模拟领域, 准确计算结合自由能(binding free energy)仍然是一个挑战. 为此, 人们发展了许多方法. 论文<a href="http://jerkwin.github.io/GMX/自由能计算方法及其在生物大分子体系中的适用性问题.pdf">自由能计算方法及其在生物大分子体系中的适用性问题</a>对这些方法有一些总结, 可供参考. 王喜军在一篇文章<a href="http://money.dl-js.com/html/201110/3672663.html">杂谈自由能计算，PMF，伞形抽样，WHAM</a>中对一些基本概念进行了讲解. 在这些方法中, 自由能微扰(FEP)与热力学积分(TI)都是比较准确的成熟方法, 但计算量很大, 不适用于生物大分子体系. MM-PBSA(Molecular Mechanics-Poisson Bolzmann Surface Area, 分子力学泊松玻尔兹曼表面积)是一种对MD轨迹进行后处理以估计结合自由能的方法, 计算时会将溶剂视为均匀的连续介质, 并基于力场和隐式的连续介质模型, 对平衡轨迹中的许多帧进行平均, 以考虑温度的影响. 尽管MM-PBSA方法的准确度不如FEP和TI, 但这种方法的计算量小, 在分子识别, 区分结合的强弱方面是一种有效的方法, 因此在生物分子模拟和药物筛选领域应用广泛, 并已经成功地用于许多结合自由能的计算.</p>

<figure>
<img src="/GMX/GMXtut-9_dGbind.gif" alt="" />
</figure>

<p>结合自由能定义为:</p>

<p><span class="math">\[\D G_\text{bind} = G_\text{complex} - G_\text{free-protein} - G_\text{free-ligand}\]</span></p>

<p>根据定义, 在溶液中, 我们可将分子的自由能写为:</p>

<p><span class="math">\[G = E_\text{gas}- TS_\text{gas} + G_\text{solvation}\]</span></p>

<p>其中的溶剂化自由能又可分解为极性部分和非极性部分:</p>

<p><span class="math">\[G_\text{solvation} = G_\text{polar}+G_\text{nonpolar}\]</span></p>

<p>在MM-PBSA方法中, 气相的能量和熵的贡献根据MM方法计算:</p>

<p><span class="math">\[\alg
E_\text{gas} &= E_\text{MM}=E_\text{bond} + E_\text{angle} + E_\text{dihedral} + E_\text{vdw} + E_\text{coulomb} \\
S_\text{gas} &=S_\text{MM}
\ealg\]</span></p>

<p>其中 <span class="math">\(E_\text{bond}\)</span>, <span class="math">\(E_\text{angle}\)</span>, <span class="math">\(E_\text{dihedral}\)</span> 分别对应于键, 键角, 二面角的相互作用, <span class="math">\(E_\text{vdw}\)</span> 和 <span class="math">\(E_\text{coulomb}\)</span> 分别代表范德华和库仑静电相互作用.</p>

<p>MM-PBSA方法中的溶剂化能包含两部分, 极性溶剂化能和非极性溶剂化能. 极性溶剂化能来自于溶质和溶剂分子之间的静电相互作用, 计算时采用隐式的溶剂模型, 将溶剂视为连续的介质, 对相应的泊松玻尔兹曼方程进行线性化, 并数值求解.</p>

<p><span class="math">\[G_\text{polar}=G_\text{PB}\]</span></p>

<p>非极性溶剂化自由能可根据经验的表面积方法进行计算, 因此也被称为表面溶剂化能. 计算时需要知道分子的溶剂可及表面积 <span class="math">\(A\)</span> 与两个经验参数 <span class="math">\(\g\)</span> 和 <span class="math">\(b\)</span> :</p>

<p><span class="math">\[G_\text{nonpolar} = G_\text{surface} = \g A + b\]</span></p>

<p>将上面的这些项结合起来, 就得到了MM-PBSA的自由能公式:</p>

<p><span class="math">\[G = E_\text{MM}- TS_\text{MM} + G_\text{PB} + G_\text{surface}\]</span></p>

<p>实际计算时, 总的MM能量可利用GROMACS的工具进行计算. 计算时使用与模拟相同的的力场, 但注意当计算非键相互作用时不能使用截断.
数值求解PB方程一般使用APBS程序. 计算时, 需要指定立方格点的间距(可取0.5 &#197;), 还需要使用GROMOS的半径和电荷创建PQR文件. 纯水的介电常数使用 <span class="math">\(\e=78.45\)</span>, 溶质的介电常数一般取 <span class="math">\(\e=2\)</span>. 计算非极性溶剂化能的经验常数可使用 <span class="math">\(\g=0.0072\;\text{kcal/mol}\ \AA^2\)</span>, <span class="math">\(b=0\)</span>. 在APBS程序中表面积 <span class="math">\(A\)</span> 由Shrake-Rupley数值方法计算的.</p>

<p>计算熵贡献时. 需要首先进行能量最小化(对非键相互作用不使用截断), 然后进行简正分析, 计算质量加权的Hessian矩阵, 并进行对角化, 利用得到的频率计算熵贡献:</p>

<p><span class="math">\[S_\text{vib}=\Sum_i -R \ln(1-e^{-\b h\n_i})+{N_A \n_i e^{-\b h\n_i} \over T(1-e^{-\b h\n_i})}\]</span></p>

<p>其中 <span class="math">\(h\)</span> 为普朗克常数, <span class="math">\(\n_i\)</span> 为第 <span class="math">\(i\)</span> 个频率, <span class="math">\(\b=1/k_BT\)</span>.</p>

<p>计算结合自由能时, 对蛋白质和配体复合物的平衡轨迹进行采样, 并分别计算复合物, 蛋白质, 配体的自由能, 根据 <span class="math">\[\D G_\text{bind} = G_\text{complex} - G_\text{free-protein} - G_\text{free-ligand}\]</span> 即可得到结合自由能.</p>

## 计算工具

<p>对GROMACS用户而言, 长期以来没有一个方便的工具用于计算MM-PBSA自由能. 鉴于AMBER中有一个计算MM-PBSA的脚本<code>mmpbsa.py</code>, 所以以前的GROMACS用户往往先将得到的轨迹转换为AMBER格式, 然后在利用AMBER的工具进行自由能计算. 随着GROAMCS用户的逐渐增多, 目前, 已经有两个工具可以直接使用GROMACS的工具进行MM-PBSA自由能计算了.</p>

### 1. GMXPBSAtool

<ul class="incremental">
<li>2.0版本: <a href="http://www.sciencedirect.com/science/article/pii/S0010465514002240">GMXPBSA 2.0: A GROMACS tool to perform MM/PBSA and computational alanine scanning</a></li>
<li>2.1版本: <a href="http://www.sciencedirect.com/science/article/pii/S0010465514003154">GMXPBSA 2.1: A GROMACS tool to perform MM/PBSA and computational alanine scanning</a></li>
<li>相关论文: <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0046902">Exploring PHD Fingers and H3K4me0 Interactions with Molecular Dynamics Simulations and Binding Free Energy Calculations: AIRE-PHD1, a Comparative Study</a></li>
<li>下载地址: <a href="http://gdriv.es/gmxpbsa">http://gdriv.es/gmxpbsa</a></li>
<li>作者电子邮件: <a href="&#109;&#97;&#105;&#108;&#x74;&#111;&#x3a;&#x73;&#x70;&#105;&#x74;&#x61;&#x6c;&#x65;&#114;&#105;&#46;&#97;&#110;&#100;&#114;&#101;&#x61;&#64;&#104;&#x73;&#x72;&#x2e;&#x69;&#116;">&#x73;&#x70;&#105;&#116;&#97;&#x6c;&#101;&#x72;&#x69;&#x2e;&#97;&#x6e;&#100;&#x72;&#x65;&#97;&#x40;&#x68;&#x73;&#x72;&#x2e;&#x69;&#116;</a>或<a href="&#x6d;&#x61;&#105;&#x6c;&#x74;&#111;&#x3a;&#109;&#x75;&#115;&#99;&#x6f;&#x2e;&#103;&#105;&#x6f;&#x76;&#97;&#110;&#x6e;&#97;&#64;&#104;&#x73;&#x72;&#46;&#x69;&#x74;">&#x6d;&#117;&#115;&#99;&#x6f;&#x2e;&#x67;&#x69;&#111;&#118;&#x61;&#x6e;&#x6e;&#97;&#x40;&#104;&#115;&#x72;&#46;&#x69;&#x74;</a></li>
</ul>

<p>这是基于bash/perl的脚本, 计算时调用已经安装的GROAMCS工具和APBS程序计算MM-PBSA. 脚本所起的作用主要是为GROAMCS工具和APBS程序准备输入文件, 并处理输出文件, 实际计算是由GROAMCS工具和APBS程序完成的. 因为是脚本程序, 不需要编译, 所以<code>GMXPBSAtool</code>使用比较方便, 可以很方便地进行大量计算. 程序修改也很方便, 只要清楚了各个程序的输入输出格式, 就可以用于不同版本的GROMACS和APBS.</p>

<p>程序包含三个脚本</p>

<ol class="incremental">
<li><code>gmxpbsa0.sh</code>: 初步计算. 只要为后面的计算进行设置, 包括: 检查输入文件, 从MD轨迹中抽取所需的帧, 使用APBS计算库仑作用的贡献. 如果在输入文件中定义了Alanine扫描, 也会对定义的残基进行Alanine突变.</li>
<li><code>gmxpbsa1.sh</code>: 计算极性和非极性的溶剂化能. 计算中最耗时的一步, 计算时可以并行.</li>
<li><code>gmxpbsa2.sh</code>: 统计所有帧的各项计算结果, 计算最终的结合自由能, 输出计算结果报告.</li>
</ol>

<p><strong>使用方法</strong></p>

<p>遵照程序自带的文档<code>HOW_TO_INSTALL</code>, 解压后, 设置一下路径, 并保证当前使用的shell为bash, 即可使用. 当然前提是安装好GROMACS和APBS(安装方法在下面统一介绍).</p>

<p>运行时, 先在输入控制文件<code>INPUT.dat</code>中设置好GROMACS和APBS的路径, 再依次运行上面三个脚本即可.</p>

<p>运行结束后, <code>Compare_MMPBSA.dat</code>文件中列出了Alanine突变的计算结果, 相应的<code>SUMMARY_FILES</code>目录下保存了主要的结果.</p>

### 2. g_MMPBSA

<ul class="incremental">
<li>相关论文: <a href="http://pubs.acs.org/doi/abs/10.1021/ci500020m">g_mmpbsa-A GROMACS Tool for High-Throughput MM-PBSA Calculations</a></li>
<li>程序网站: <a href="https://github.com/RashmiKumari/g_mmpbsa">https://github.com/RashmiKumari/g_mmpbsa</a></li>
</ul>

<p>类似于GROMACS自带的工具, 使用方式也类似, GROAMCS用户可以很容易上手.</p>

<p><code>g_mmpbsa</code>计算的结合自由能由以下部分组成:</p>

<ul class="incremental">
<li>MM部分: 分子力学能量, 真空中的能量, 范德华和库仑静电相互作用能</li>
<li>PB部分: 极化溶剂化能</li>
<li>SA部分: 非极性溶剂化能, 可使用三种不同的方法SASA, SAV和Weeks-Chandler-Andersen(WCA)计算</li>
</ul>

<p>计算时, 先使用<code>g_mmpbsa</code>分别计算每一部分, 所有计算完成后, 再按顺序运行程序附带的3个脚本进行后处理: <code>MmPbSaStat.py</code>计算平均结合能及其标准偏差/误差, <code>MmPbSaDecomp.py</code>进行能量分解, <code>energy2fbc</code>将能量转换为温度因子. 具体流程如下:</p>

<ol class="incremental">
<li><p>计算MM部分:</p>

<p><code>g_mmpbsa -f traj.xtc -s topol.tpr -n index.ndx -mme -pdie 2 -decomp</code></p>

<p><code>-mme</code>指明计算范德华和库仑静电能</p></li>
<li><p>计算PB部分:</p>

<p><code>g_mmpbsa -f traj.xtc -s topol.tpr -n index.ndx -i polar.mdp -nomme -pbsa -decomp</code></p>

<p>使用<code>-pbsa</code>, 因为默认<code>-nopbsa</code>, 所以还需要使用<code>-i</code>提供溶剂化能参数输入文件<br/>
使用<code>-nomme</code>是上一步已经计算了MM部分</p></li>
<li><p>计算SA部分:</p>

<p>使用SASA模型: <code>g_mmpbsa -f traj.xtc -s topol.tpr -n input.ndx -i apolar_sasa.mdp -nomme -pbsa -decomp -apol sasa.xvg -apcon sasa_contrib.dat</code></p>

<p>使用SAV模型: <code>g_mmpbsa -f traj.xtc -s topol.tpr -n input.ndx -i apolar_sav.mdp -nomme -pbsa -decomp -apol sav.xvg -apcon sav_contrib.dat</code></p></li>
<li><p>计算平均结合能:</p>

<p>使用bootstrap方法: <code>python MmPbSaStat.py -bs -nbs 2000 -m energy_MM.xvg -p polar.xvg -a apolar.xvg (or sasa.xvg)</code></p></li>
<li><p>能量分解:</p>

<p><code>python MmPbSaDecomp.py -m contrib_MM.dat -p contrib_pol.dat -a contrib_apol.dat -bs -nbs 2000 -ct 999 -o final-contrib-energy.dat -om energymapin.dat</code></p>

<p>必须按顺序写<code>-m</code>, <code>-p</code>, <code>-a</code>. 也可使用<code>metafile.dat</code>文件, 其中的内容为3个文件的路径(必须按照MM, polar, apolar的顺序). 我们所需要的能量均写在这里.
 <code>final-contrib-energy.dat</code>文件中为能量分解的具体内容, 另外一个输出文件<code>energymapin.dat</code>是为下一命令准备的.</p></li>
<li><p>转换为温度因子</p>

<p><code>python energy2fbc -s md.tpr -i energymapin.dat -n input.ndx -c complex.pdb -s1 s1.pdb -s2 s2.pdb</code></p>

<p><code>-s1</code>, <code>-s2</code>为分链显示, s1和s2链的原子数相加必须与之前计算中体系的总原子数相等. 脚本会将残基按温度因子(b-factor)进行着色, 在PyMol中选择按b-factor着色即可看到效果.</p></li>
</ol>

<p><strong>编译</strong></p>

<p>作者的网站上给出了二进制版本的<code>g_mmpbsa</code>程序, 如果你的机器够新, 一般可以直接使用. 使用前需要先安装GROMACS和APBS. 如果你使用Ubuntu系统, 安装GROMACS和APBS很方便</p>

<pre><code>sudo apt-get install gromacs
sudo apt-get install apbs
</code></pre>

<p>然后将<code>gmx_pbsa</code>程序复制到选定的目录下(建议放于GROAMCS主目录下的<code>bin</code>中, 和其他GROAMCS工具放一起), 添加可执行属性: <code>chmod u+x ./g_mmpbsa</code>即可使用了.</p>

<p>由于作者编译<code>gmx_pbsa</code>时使用了Intel编译器的一些优化选项(如AVX, SSE之类), 致使在一些比较老的机器上使用程序时, 会出现<code>FATAL: kernel too old.
Segmentation fault</code>或<code>Illegal instruction (core dumped)</code>之类的错误. 在这种情况下, 就只能在你自己的机器上重新编译了. 在编译<code>g_mmpbsa</code>前, 需要下面的一些库:</p>

<ul class="incremental">
<li>GROMACS: <code>libgmx.a</code>, <code>libgmxana.a</code>, <code>libmd.a</code>或<code>libgmx.so</code>, <code>libgmxana.so</code>, <code>libmd.so</code></li>
<li>APBS 1.2.x或1.3.x: <code>libapbsmainroutines.a</code>, <code>libapbs.a</code>, <code>libapbsblas.a</code>, <code>libmaloc.a</code>, <code>libapbsgen.a</code>, <code>libz.a</code></li>
</ul>

<p>这些文件在GROMACS和APBS编译之后得到的. 如果你没有权限使用上面的命令安装GROMACS和APBS, 那你还需要自己编译GROMACS和APBS. 编译时, 最好对这三个程序使用相同的编译器, 否则出现错误的话, 不易解决.</p>

<ol class="incremental">
<li><p>编译GROMACS 4.6.5(新版本已经支持GMX 5.x)</p>

<p><code>g_mmpbsa</code>支持GROMACS&#8211;4.6.x, 尚未支持5.x. 编译时, GROMACS需要生成静态库, 因为<code>g_mmpbsa</code>不支持MPI, 不能并行, 因此编译GROMACS时, 必须明确地禁用MPI和GPU选项. 此外, 还需要注意<code>fftw</code>的单双精度问题, 需要安装双精度版本的<code>fftw</code>.</p>

<pre><code>tar -zxvf gromacs-4.6.5.tar.gz
cd gromacs-4.6.5
mkdir build
cd build
cmake ../ -DCMAKE_INSTALL_PREFIX=/opt/gromacs -DGMX_PREFER_STATIC_LIBS=ON -DGMX_GPU=off
make
make install
</code></pre></li>
<li><p>编译APBS 1.3</p>

<p><code>g_mmpbsa</code>目前也支持APBS&#8211;1.4, 编译方法请参考程序网站上的说明.</p>

<p>编译时, 如果环境变量含有<code>ifort</code>, 会自动选择intel的<code>ifort</code>进行编译, 这样<code>g_mmpbsa</code>也应当使用<code>ifort</code>来编译.</p>

<pre><code>tar zxvf apbs-1.3-source.tar.gz
cd apbs-1.3-source/
./configure --prefix=/path/to/apbs-1.3
make
make install
</code></pre></li>
<li><p>编译fftw单双精度版</p>

<pre><code>cd fftw-3.1.2
./configure --enable-float --enable-mpi --prefix=/opt/fftw-3.1.2
make
make install
make distclean
./configure --disable-float --enable-mpi --prefix=/opt/fftw-3.1.2
</code></pre></li>
<li><p>编译g_mmpbsa</p>

<pre><code>tar zxvf RashmiKumari-g_mmpbsa-v1.1.0-7-gcf6c583.tar.gz
cd RashmiKumari-g_mmpbsa-cf6c583/
mkdir build
cd build
cmake -DGMX_PATH=/opt/gromacs \
-DAPBS_INSTALL=/opt/apbs \
-DAPBS_SRC=/path/to/apbs-1.3-source \
-DCMAKE_INSTALL_PREFIX=/opt/g_mmpbsa \
-DFFTW_LIB=/opt/fftw-3.3.4/lib ..
make
make install
</code></pre></li>
<li><p>完善Python环境</p>

<p><code>g_mmpbsa</code>附带的<code>tools</code>文件夹中包含了几个用于后处理的Python脚本. 如果直接执行脚本时出错, 那你需要对Python环境进行完善, 安装缺少的模块. 由于Pyhton版本众多, 注意要下载与已安装的Python版本匹配的模块. 网站<a href="http://www.lfd.uci.edu/~gohlke/pythonlibs/">Unofficial Windows Binaries for Python Extension Packages</a>上提高各种版本的模块供下载, 需要的话可以下载.</p></li>
</ol>

## 几点说明

<ol class="incremental">
<li><p>这两个工具都可以用于计算MMPBSA的结合能, 根据袁曙光的个人经验, 使用默认参数时, 在精度上<code>GMXPBSA</code>似乎优于<code>g_mmpbsa</code>而且使用也更方便.</p></li>
<li><p>APBS程序可使用OpenMP进行并行, 通过环境变量控制使用的核/处理器数目, <code>export OMP_NUM_THREADS=X</code></p></li>
<li><p>APBS程序求解PB方程的速度有限, 因此体系大时, 计算很耗时. 卢本卓提出了一种求解PB方程的改进方法, 且发布了求解程序<a href="http://www.sciencedirect.com/science/article/pii/S0010465515000089">AFMPB</a>. 如果使用AFMPB替代APBS, 应该可以提高计算速度.</p></li>
<li><p>在轨迹不平衡的情况下, 计算PB部分时可能会变得非常慢, 所以需要挑选足够平衡的轨迹进行计算</p></li>
<li><p>默认计算能量时, 每帧都会计算, 这样可能会特别费时. 在这种情况下你可以使用<code>trjconv</code>抽取一步分轨迹进行计算, 以减少运算量</p>

<p><code>trjconv -f md.xtc -o trj_8-10ns -b 8000 -e 10000 -dt 100</code></p></li>
<li><p>在具体的应用中, 尤其是在多条蛋白质MD中, 会需要选择不同的链作为单体, 这时候可使用<code>make_ndx</code>命令将两条蛋白链分别设为不同的组.</p></li>
<li><p>对结合能进行能量分解可得到不同残基对总结合自由能的贡献, 用以考察每个残基对自由能的贡献大小. 这方面的一个应用可参考<a href="http://pubs.acs.org/doi/abs/10.1021/ct8003707">MM-PBSA Captures Key Role of Intercalating Water Molecules at a Protein-Protein Interface</a>. 论文中所考察的蛋白质, 在某些氨基酸发生突变后, 与配体的结合能力会增加1000倍, 这主要是表面的水分子在起作用. 作者利用MM-PBSA方法计算了结合自由能, 发现天然的与突变后的结合自由能有明显的差异, 可以有效地区分结合的强弱.</p></li>
</ol>

## 参考资料

<ul class="incremental">
<li>袁曙光: <a href="http://blog.sciencenet.cn/blog-355217-808289.html">Two MMPBSA calculation tools in Gromacs</a></li>
<li>N. Zhou: <a href="http://bioms.org/thread-1240-1-1.html">GROMACS中g_mmpbsa工具使用详解</a></li>
<li>eming: <a href="http://www.bioms.org/forum.php?mod=viewthread&amp;tid=1046">GROMACS计算MMPBSA</a></li>
<li>夕览: <a href="http://blog.sina.com.cn/s/blog_60f9c0050100x39b.html">NAMD &amp; MM-PBSA</a></li>
<li><a href="http://icl.cs.utk.edu/lapack-forum/viewtopic.php?f=2&amp;t=1890">-nofor_main</a></li>
<li>吴钩白: <a href="http://blog.sina.com.cn/s/blog_6ceaa7650101dy6p.html">利用g_mmpbsa计算PBSA及能量分解流程</a></li>
<li><a href="http://www.researchgate.net/post/How_can_I_do_MMPBSA_analysis_on_Gromacs_trajectory_using_the_MMPBSA_tool_of_amber_software_packge">How can I do MMPBSA analysis on Gromacs trajectory using the MMPBSA tool of amber software packge?</a></li>
<li><a href="http://blog.sina.com.cn/s/blog_834872aa0101ihn2.html">Gromacs下计算MMPBSA, g_mmpbsa的安装</a></li>
<li>Sharp KA, Honig B (1990) Electrostatic interactions in macromolecules: theory and applications. <em>Annu. Rev. Biophys. Biophys Chem</em> 19: 301&#8211;332.</li>
<li>Baker NA, Sept D, Joseph S, Holst MJ, McCammon JA (2001) Electrostatics of nanosystems: application to microtubules and the ribosome. <em>Proc Natl Acad Sci USA</em> 98: 10037&#8211;10041.</li>
<li>Sitkoff D, Sharp KA, Honig B (1994) Accurate calculation of hydration free energies using macroscopic solvent models. <em>J Phys Chem</em> 97: 1978&#8211;1988.</li>
<li>Shrake A, Rupley JA (1973) Environment and exposure to solvent of protein atoms-lysozyme and insulin. <em>J Mol Biol</em> 79: 351&#8211;371.</li>
</ul>

## 评论

- 2015-10-28 20:40:56 `小康` g_MMPBSA 新版可以支持5.0啦~真开心
- 2015-10-28 20:48:23 `Jerkwin` 谢谢告知, 我会更新下.
