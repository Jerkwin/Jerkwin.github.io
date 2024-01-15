---
 layout: post
 title: GROMACS中文手册：附录A　技术细节
 categories:
 - 科
 tags:
 - gmx
 math: true
---

* toc
{:toc}


## A.1 混合精度或双精度

<p>可以使用混合精度或双精度编译GROMACS. 老版本GROMACS的文档将混合精度称为&#8220;单精度&#8221;, 但选择性地使用双精度已实现很多年了. 对所有变量都使用单精度将导致精度显著降低. 尽管在&#8220;混合精度&#8221;中, 所有的状态向量, 即粒子坐标, 速度和力, 都是单精度的, 但关键变量仍是双精度的. 后者的一个典型例子是维里, 它是对体系中所有力的加和, 正负可变. 另外, 在代码的许多地方, 通过改变求和顺序或重新组合数学表达式, 我们设法避免对双精度进行算术运算. 默认配置使用混合精度, 但通过为<code>cmake</code>添加选项<code>-DGMX_DOUBLE=on</code>, 可以很容易地启用双精度. 双精度比混合精度慢20%到100%, 具体数字取决于运行机器的架构. 双精度会使用更多的内存和运行输入, 而且能量和全精度轨迹文件的大小几乎是混合模式的两倍.</p>

<p>混合精度的能量精确到最后一位小数, 力的最后一位或两位数字并不重要. 维里的精度比力的要差, 因为维里只比所有原子加和中的各个元素大一个数量级(参见B.1节). 对大多数情况, 这真的不是一个问题, 因为维里的涨落可以比其平均值大两个数量级. 对库仑相互作用使用截断会导致能量, 力和维里出现大的误差. 即便使用反应场或晶格加和方法, 误差也大于或近于因局部使用单精度导致的误差. 由于MD具有混沌性, 具有非常相似起始条件的轨迹也将迅速发散, 混合精度的发散速度高于双精度.</p>

<p>对大多数模拟, 混合精度足够精确. 在某些情况下, 需要使用双精度以获得合理的结果:</p>

<ul class="incremental">
<li>简正分析, 其中的共轭梯度或l-bfgs最小化, 计算和对角化力常数矩阵</li>
<li>长时间的能量守恒, 特别是对于大的体系</li>
</ul>

## A.2 环境变量

<p>可以使用环境变量影响GROMACS程序的运行. 首先, 在<code>GMXRC</code>文件中设置的变量对运行和编译GROMACS至关重要. 以下各节列出了其他一些有用的环境变量. 通过在你的shell中设置非空值, 大多数环境变量可以起作用. 如果需要设置其他的值, 参考下面的具体要求. 你应该查看自己所用shell的文档以了解如何为当前shell设置环境变量, 或者如何为以后的shell设置配置文件. 注意, 将环境变量输出到批处理控制系统作业中的要求各不相同, 你应该查看本地文档的详情说明.</p>

<p><strong>输出控制</strong></p>

<ol class="incremental">
<li><code>GMX_CONSTRAINTVIR</code>: 打印能量项中的约束维里和力维里.</li>
<li><code>GMX_MAXBACKUP</code>: 当尝试写到具有相同名称的新文件时, GROMACS自动备份以前文件的副本. 此变量控制备份的最大数量, 默认为99. 当设置为0时, 若输出文件已存在, 则无法运行. 当设置为&#8211;1时, 会覆盖所有输出文件, 不进行备份.</li>
<li><code>GMX_NO_QUOTES</code>: 如果明确设置了此变量, 不会在程序结束后打印有趣的引用.</li>
<li><code>GMX_SUPPRESS_DUMP</code>: 禁用每步的文件转储, 当(例如)约束算法失效引起体系崩溃时.</li>
<li><code>GMX_TPI_DUMP</code>: 将相互作用能小于此环境变量设定值的全部构型转储到一个<code>.pdb</code>文件.</li>
<li><code>GMX_VIEW_XPM</code>: <code>GMX_VIEW_XVG</code>, <code>GMX_VIEW_EPS</code>和<code>MX_VIEW_PDB</code>, 分别用于自动查看<code>.xvg</code>, <code>.xpm</code>, <code>.eps</code>和<code>.pdb</code>文件类型的命令, 默认为<code>xv</code>, <code>xmgrace</code>, <code>ghostview</code>和<code>rasmol</code>. 设置为空则禁用自动查看特定的文件类型. 命令将被分叉运行于后台, 运行时具有的优先级与GROMACS工具相同(这可能不是你想要的). 注意不要使用阻断终端的命令(例如<code>vi</code>), 因为可能会运行多个实例.</li>
<li><code>GMX_VIRIAL_TEMPERATURE</code>: 打印能量项中的维里温度</li>
<li><code>GMX_LOG_BUFFER</code>: 用于文件I/O的缓冲区大小. 如果设置为0, 所有文件I/O都不使用缓冲, 因此非常慢. 此变量可以方便调试, 因为它能保证所有文件始终是最新的.</li>
<li><code>GMX_LOGO_COLOR</code>: 设置<code>ngmx</code>标志的显示颜色.</li>
<li><code>GMX_PRINT_LONGFORMAT</code>: 当打印十进制数值时使用长浮点格式.</li>
<li><code>GMX_COMPELDUMP</code>: 仅用于计算电生理学设置(参见6.6节). 初始结构转储到<code>.pdb</code>文件, 这样可以检查多聚体通道的PBC表示是否正确.</li>
</ol>

<p><strong>调试</strong></p>

<ol class="incremental">
<li><code>GMX_PRINT_DEBUG_LINES</code>: 设置后, 打印调试的行号信息.</li>
<li><code>GMX_DD_NST_DUMP</code>: 转储当前DD到PDB文件的间隔步数(默认为0). 仅对区域分解有效, 因此典型的值为0(从不), 1(每DD相)或<code>nstlist</code>的倍数.</li>
<li><code>GMX_DD_NST_DUMP_GRID</code>: 转储当前DD格点到PDB文件的间隔步数(默认为0). 仅对区域分解有效, 因此典型的值为0(从不), 1(每DD相)或<code>nstlist</code>的倍数.</li>
<li><code>GMX_DD_DEBUG</code>: 每个区域分解的通用调试触发器(默认为0, 意味着禁用). 目前只检查全局-局部原子索引映射的一致性.</li>
<li><code>GMX_DD_NPULSE</code>: 覆盖所用的DD脉冲数(默认0, 意味着不覆盖). 通常为1或2.</li>
</ol>

<p><strong>性能和运行控制</strong></p>

<ol class="incremental">
<li><code>GMX_DO_GALACTIC_DYNAMICS</code>: 设置此环境变量可启用行星模拟(只是为了好玩), 允许在<code>.mdp</code>文件中设置<code>epsilon_r = -1</code>. 正常情况下, <code>epsilon_r</code>必须大于零, 以防止出现致命错误. 参见<a href="http://www.gromacs.org/">www.gromacs.org</a>上行星模拟的输入文件的例子.</li>
<li><code>GMX_ALLOW_CPT_MISMATCH</code>: 设置后, 如果在<code>.tpr</code>文件中的系综设置与<code>.cpt</code>文件中的不匹配, 运行也不会退出.</li>
<li><code>GMX_CUDA_NB_EWALD_TWINCUT</code>: 强制使用双程截断内核, 即使PP-PME负载均衡后<code>rvdw=rcoulomb</code>. 会自动切换到双程截断内核, 所以此变量只能用于校准.</li>
<li><code>GMX_CUDA_NB_ANA_EWALD</code>: 强制使用解析的Ewald内核. 只能用于校准.</li>
<li><code>GMX_CUDA_NB_TAB_EWALD</code>: 强制使用表格的Ewald内核. 只能用于校准.</li>
<li><code>GMX_CUDA_STREAMSYNC</code>: 在启用ECC功能的GPU上强制使用cudaStreamSynchronize, 由于在API v5.0 NVIDIA驱动程序(30x.xx以前版本)中存在一个已知的CUDA驱动程序缺陷, 会导致性能下降. 不能与<code>GMX_NO_CUDA_STREAMSYNC</code>同时设置.</li>
<li><code>GMX_CYCLE_ALL</code>: 运行时对所有的代码进行计时. 不兼容线程.</li>
<li><code>GMX_CYCLE_BARRIER</code>: 在每个循环启动/停止调用前调用MPI_Barrier.</li>
<li><code>GMX_DD_ORDER_ZYX</code>: 设置构造区域分解格胞的顺序为(z, y, x), 而不是默认的(x, y, z).</li>
<li><code>GMX_DD_USE_SENDRECV2</code>: 在约束和vsite通信时, 使用一对<code>MPI_SendRecv</code>调用代替两个同步的非阻塞调用(默认为0, 意味着不使用). 对一些MPI实现可能会更快.</li>
<li><code>GMX_DLB_BASED_ON_FLOPS</code>: 基于flop计数进行区域域分解的动态负载均衡, 而不是基于测量到的流逝时间(默认为0, 意味着禁用). 这使得负载均衡可重复, 对调试很有帮助. 值为1时使用flop; 对&gt;1的值将添加(值&#8211;1)*5%的噪声到flop, 以增加不均衡性和标度.</li>
<li><code>GMX_DLB_MAX_BOX_SCALING</code>: 每区域分解负载平衡步中所允许的盒子缩放的最大百分比(默认为10)</li>
<li><code>GMX_DD_RECORD_LOAD</code>: 运行结束时记录DD负载统计报告(默认为1, 意味着启用)</li>
<li><code>GMX_DD_NST_SORT_CHARGE_GROUPS</code>: 重新排序电荷组的间隔步数(默认为1). 只在区域分解中起作用, 所以典型值应为0(从不), 1(每次区域分解), 或<code>nstlist</code>的倍数.</li>
<li><code>GMX_DETAILED_PERF_STATS</code>: 设置后, 会打印更详细的性能信息到<code>.log</code>文件. 输出结果的方式类似于4.5.x版本的性能总结, 因而可能对那些使用脚本解析<code>.log</code>文件或标准输出的人有用.</li>
<li><code>GMX_DISABLE_SIMD_KERNELS</code>: 禁用特定架构SIMD优化(SSE2, SSE4.1, AVX等)的非键内核, 因而强制使用普通的C内核.</li>
<li><code>GMX_DISABLE_CUDA_TIMING</code>: 当时间步长较短时, 对异步执行的GPU运算进行计时会有不可忽略的开销. 在这种情况下禁用计时能够提高性能.</li>
<li><code>GMX_DISABLE_GPU_DETECTION</code>: 设置后, 禁用GPU检测, 即使<code>mdrun</code>支持GPU.</li>
<li><code>GMX_DISABLE_PINHT</code>: 当采用英特尔超线程时, 禁止将连续线程分配到物理内核. 由<code>mdrun -nopinht</code>控制, 因而此环境变量可能会被移除.</li>
<li><code>GMX_DISRE_ENSEMBLE_SIZE</code>: 距离约束系综平均的体系数目. 整数值.</li>
<li><code>GMX_EMULATE_GPU</code>: 不使用GPU加速函数, 而是使用算法等价的CPU引用代码模拟GPU运行. 因为CPU代码较慢, 设置此变量仅用于调试. 如果使用<code>GMX_NO_NONBONDED</code>关闭非键计算, 会自动触发, 将不会调用非键计算, 但也会跳过CPU-GPU转移.</li>
<li><code>GMX_ENX_NO_FATAL</code>: 当在<code>.edr</code>文件中遇到损坏的帧时禁止退出, 允许使用直到损坏的所有帧.</li>
<li><code>GMX_FORCE_UPDATE</code>: 调用<code>mdrun -rerun</code>时更新力.</li>
<li><code>GMX_GPU_ID</code>: 与<code>mdrun</code>选项<code>-gpu_id</code>的设置方式相同, <code>GMX_GPU_ID</code>环境变量允许用户指定不同GPU的ID, 用于选择集群中不同计算节点上不同的设备. 不能与<code>-gpu_id</code>一起使用.</li>
<li><code>GMX_IGNORE_FSYNC_FAILURE_ENV</code>: 允许<code>mdrun</code>继续运行, 即使文件丢失.</li>
<li><code>GMX_LJCOMB_TOL</code>: 当设置为浮点值时, 覆盖力场浮点参数的默认容差1e&#8211;5.</li>
<li><code>GMX_MAX_MPI_THREADS</code>: 设置<code>mdrun</code>可以使用的最大MPI线程数.</li>
<li><code>GMX_MAXCONSTRWARN</code>: 当设置为&#8211;1时, 即便产生了很多LINCS警告, <code>mdrun</code>也不会退出.</li>
<li><code>GMX_NB_GENERIC</code>: 使用通用的C内核. 如果使用基于组的截断并将<code>GMX_NO_SOLV_OPT</code>设为true, 就应该设置此变量, 从而禁用溶剂优化.</li>
<li><code>GMX_NB_MIN_CI</code>: 在GPU上运行时使用的邻居列表平衡参数. 对小的模拟体系, 为了改进多处理器的负载平衡从而提高性能, 设置目标配对列表的最小数目. 必须设置为正整数. 默认值是针对NVIDIA的Fermi和Kepler类型GPU进行优化的, 所以正常使用时无须改变, 但对于未来的架构可能有用.</li>
<li><code>GMX_NBLISTCG</code>: 使用基于电荷组的邻居列表和内核.</li>
<li><code>GMX_NBNXN_CYCLE</code>: 设置后, 打印详细的邻居搜索循环计数.</li>
<li><code>GMX_NBNXN_EWALD_ANALYTICAL</code>: 强制使用解析Ewald的非键内核, 与<code>GMX_NBNXN_EWALD_TABLE</code>互斥.</li>
<li><code>GMX_NBNXN_EWALD_TABLE</code>: 强制使用表格Ewald的非键内核, 与<code>GMX_NBNXN_EWALD_ANALYTICAL</code>互斥.</li>
<li><code>GMX_NBNXN_SIMD_2XNN</code>: 强制使用 2x(N+N) SIMD CPU非键内核, 与<code>GMX_NBNXN_SIMD_4XN</code>互斥.</li>
<li><code>GMX_NBNXN_SIMD_4XN</code>: 强制使用 4xN SIMD CPU非键内核, 与<code>GMX_NBNXN_SIMD_2XNN</code>互斥.</li>
<li><code>GMX_NO_ALLVSALL</code>: 禁用优化的 all-vs-all 内核.</li>
<li><code>GMX_NO_CART_REORDER</code>: 用于初始化区域分解通信器. 默认等级重排序, 但可利用此环境变量关闭.</li>
<li><code>GMX_NO_CUDA_STREAMSYNC</code>: 与<code>GMX_CUDA_STREAMSYNC</code>相反. 当开启ECC功能的GPU使用V5.0以前版本的CUDA驱动程序API时, 禁用基于标准cudaStreamSynchronize的GPU等待以提高性能.</li>
<li><code>GMX_NO_INT</code>, <code>GMX_NO_TERM</code>, <code>GMX_NO_USR1</code>: 分布禁用对SIGINT, SIGTERM, SIGUSR1信号进行处理.</li>
<li><code>GMX_NO_NODECOMM</code>: 不使用独立的节点间和节点内的通讯器.</li>
<li><code>GMX_NO_NONBONDED</code>: 跳过非键计算; 可用于估计增加GPU加速器到当前硬件设置带来的可能的性能增益-假定完成非键计算的速度足够快, 同时CPU进行键合力和PME计算.</li>
<li><code>GMX_NO_PULLVIR</code>: 设置后, 不将维里的贡献添加到COM牵引力.</li>
<li><code>GMX_NOCHARGEGROUPS</code>: 禁用多原子电荷组, 即, 分配所有非溶剂分子中的每个原子到其自己的电荷组.</li>
<li><code>GMX_NOPREDICT</code>: 不预测壳层位置.</li>
<li>​​<code>GMX_NO_SOLV_OPT</code>: 关闭溶剂优化; 如果启用了<code>GMX_NB_GENERIC</code>会自动进行.</li>
<li><code>GMX_NSCELL_NCG</code>: 每个邻区搜索格胞的理想电荷组数被硬编码为10. 将此环境变量的值设置为任何其它的整数会覆盖硬编码的值.</li>
<li><code>GMX_PME_NTHREADS</code>: 设置OpenMP或PME的线程数(覆盖<code>mdrun</code>的猜测值).</li>
<li><code>GMX_PME_P3M</code>: 使用P3M优化的影响函数, 而不是平滑的PME B样条内插.</li>
<li><code>GMX_PME_THREAD_DIVISION</code>: 在三个维度上以&#8220;X Y Z&#8221;格式对PME线程进行划分. 每一维度上线程的总和必须等于PME线程的总数(在<code>GMX_PME_NTHREADS</code>之间设置).</li>
<li><code>GMX_PMEONEDD</code>: 如果x和y方向上区域分解格胞的数目都为1, 对PME进行一维分解.</li>
<li><code>GMX_REQUIRE_SHELL_INIT</code>: 需要初始化壳层位置.</li>
<li><code>GMX_REQUIRE_TABLES</code>: 需要使用表格库仑和van der Waals相互作用.</li>
<li><code>GMX_SCSIGMA_MIN</code>: 用于软核 <span class="math">\(\s\)</span> 的最小值. <strong>注意</strong>, 此值在<code>.mdp</code>文件中使用<code>sc-sigma</code>关键词进行设置, 而此环境变量可用于重现4.5前的版本对此参数的行为.</li>
<li><code>GMX_TPIC_MASSES</code>: 应包含用于测试粒子插入空腔时的多个质量. 最后一个原子的质量中心用于插入空腔.</li>
<li><code>GMX_USE_GRAPH</code>: 对键相互作用使用图形.</li>
<li><code>GMX_VERLET_BUFFER_RES</code>: Verlet截断方案中缓冲区大小的分辨率. 默认值为0.001, 但可以被此环境变量覆盖.</li>
<li><code>GMX_VERLET_SCHEME</code>: 从基于组的方案转换为Verlet截断方案, 即使<code>.mdp</code>文件中并没有将<code>cutoff_scheme</code>设置为Verlet. 此变量没有必要存在, 因为<code>mdrun</code>的<code>-testverlet</code>选项具有同样的功能, 保留它只是为了向后兼容.</li>
<li><code>MPIRUN</code>: <code>g_tune_pme</code>使用的<code>mpirun</code>命令.</li>
<li><code>MDRUN</code>: <code>g_tune_pme</code>使用的<code>mdrun</code>命令.</li>
<li><code>GMX_NSTLIST</code>: 设置<code>nstlist</code>的默认值, 防止在使用Verlet截断方案启动<code>mdrun</code>时改变.</li>
<li><code>GMX_USE_TREEREDUCE</code>: 对nbnxn力约化使用树约化. 在OpenMP线程数很多时可能更快(如果内存位置很重要).</li>
</ol>

<p><strong>分析和核心函数</strong></p>

<ol class="incremental">
<li><code>GMX_QM_ACCURACY</code>: Gaussian程序L510(MC-SCF)模块的精度.</li>
<li><code>GMX_QM_ORCA_BASENAME</code>: <code>.tpr</code>文件的前缀, 用于Orca计算的输入和输出文件名​​.</li>
<li><code>GMX_QM_CPMCSCF</code>: 当设置为非零值时, Gaussian时QM计算将迭代求解CP-MCSCF方程.</li>
<li><code>GMX_QM_MODIFIED_LINKS_DIR</code>: 修改的Gaussian链接的位置.</li>
<li><code>DSSP</code>: 为<code>do_dssp</code>所用, 指向<code>dssp</code>可执行程序(不只是其路径).</li>
<li><code>GMX_QM_GAUSS_DIR</code>: Gaussian的安装路径.</li>
<li><code>GMX_QM_GAUSS_EXE</code>: Gaussian可执行程序的名称.</li>
<li><code>GMX_DIPOLE_SPACING</code>: <code>g_dipoles</code>所用的间距.</li>
<li><code>GMX_MAXRESRENUM</code>: 设置<code>grompp</code>重新编号的残基的最大数目. &#8211;1表示重新编号所有残基.</li>
<li><code>GMX_FFRTP_TER_RENAME</code>: 有些力场(例如AMBER), 对N端和C端残基使用特定的名称(NXXX和CXXX), 像那些正常重命名的<code>.rtp</code>项一样. 设置此环境变量禁用此类重命名.</li>
<li><code>GMX_PATH_GZIP</code>: <code>gunzip</code>可执行程序的路径, 为<code>g_wham</code>所用.</li>
<li><code>GMX_FONT</code>: <code>ngmx</code>使用的X11字体的名称.</li>
<li><code>GMXTIMEUNIT</code>: 输出文件中使用的时间单位, 可以为fs, ps, ns, us, ms, s, m或h.</li>
<li><code>GMX_QM_GAUSSIAN_MEMORY</code>: Gaussian QM计算使用的内存.</li>
<li><code>MULTIPROT</code>: <code>multiprot</code>可执行程序的名称, 为程序<code>do_multiprot</code>所用.</li>
<li><code>NCPUS</code>: Gaussian QM计算使用的CPU数</li>
<li><code>GMX_ORCA_PATH</code>: Orca的安装目录.</li>
<li><code>GMX_QM_SA_STEP</code>: Gaussian QM计算的模拟退火步长.</li>
<li><code>GMX_QM_GROUND_STATE</code>: 定义Gaussian表面跳跃计算的态.</li>
<li><code>GMX_TOTAL</code>: <code>total</code>可执行程序的名称, 为<code>do_shift</code>程序所用.</li>
<li><code>GMX_ENER_VERBOSE</code>: 让<code>g_energy</code>和<code>eneconv</code>输出更多信息.</li>
<li><code>VMD_PLUGIN_PATH</code>: VMD插件的安装路径. 需要能够读取VMD插件认可的文件格式.</li>
<li><code>VMDDIR</code>: 安装VMD的基准路径.</li>
<li><code>GMX_USE_XMGR</code>: 将查看器设置为<code>xmgr</code>(不推荐)以代替<code>xmgrace</code>.</li>
</ol>

## A.3 并行运行GROMACS

<p>默认情况下, 将使用内置的线程MPI库编译GROMACS. 在处理单节点上线程之间的通信时, 使用此函数库比使用外部MPI库更高效. 要在多个节点, 例如一个集群上并行运行GROMACS, 你需要使用外部MPI库配置编译GROMACS. 所有的超级计算机都带有为其特定平台优化的MPI库, 也有几个好的免费MPI实现; OpenMPI通常是一个不错的选择. 注意, MPI和线程MPI支持彼此不兼容.</p>

<p>除​​MPI并行外, GROMACS还支持通过OpenMP的线程并行. MPI和OpenMP并行可以结合起来使用, 也就是所谓的杂合并行化. 在某些情况下, 杂合并行可提供更好的性能和标度.</p>

<p>请参看<a href="http://www.gromacs.org/">www.gromacs.org</a>上关于不同并行方案使用和性能的详细信息.</p>

## A.4 使用GPU运行GROMACS

<p>自4.6版本开始, GROMACS原生支持基于CUDA的GPU. 注意, GROMACS只将计算最密集的部分, 目前也就是非键相互作用, 分配到GPU上运行, MD计算的所有其他部分都是在CPU上进行的. 对CUDA代码的要求是, Nvidia计算能力≥2.0的GPU, 即至少为Fermi类. 在许多情况下, <code>cmake</code>可自动检测GPU并自动配置GPU支持. 请传递<code>-DGMX_GPU=on</code>选项给<code>cmake</code>, 并确认已配置GPU支持, . GPU的实际使用与否在<code>mdrun</code>运行时决定, 取决于是否有(合适的)GPU可用和运行输入设置. 支持GPU的可执行程序也可以只使用CPU进行模拟, 通过使用<code>mdrun -nb cpu</code>强制仅使用CPU来运行模拟. 只有使用Verlet截断方案的模拟才能在GPU上运行. 为测试以前的tpr文件在GPU上运行的性能, 可以使用<code>mdrun</code>的<code>-testverlet</code>选项, 但因为没有进行<code>grommp</code>的完整参数一致性检查, 你不应该使用此选项进行最终模拟. 在GPU上获得GROMACS的良好性能很容易, 但得到最佳性能很困难. 请查看<a href="http://www.gromacs.org/">www.gromacs.org</a>上关于GPU使用的最新信息.</p>
