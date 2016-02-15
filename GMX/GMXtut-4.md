---
 layout: post
 title: GROMACS教程：构建双相体系
 categories:
 - 科
 tags:
 - GMX
--

* toc
{:toc}


<ul class="incremental">
<li>本教程由刘恒江翻译, 特此致谢.</li>
</ul>

<figure>
<img src="/GMX/GMXtut-4_biphasic.png" alt="" />
</figure>

## 概述

<p>本教程的目的在于指导用户构建一个异相的双相体系, 它包含了疏水层(环己烷)和亲水层(水).
教程中也会讨论一些其他类型的体系.
教程涉及的范围仅限于构建这些体系, 不会给出详细的模拟方法, 因为有很多其他的教程给出了模拟流程.</p>

<p>本教程适用于任何高于5.0的GROMACS版本.</p>

## 第一步: 准备疏水层

<p>本教程中将要创建的疏水层由环己烷分子构成, 使用GROMACS96 43A1力场进行描述. 首先使用你习惯的分子编辑软件获得坐标文件. 分子的拓扑文件很容易创建, 你可以手动书写, 也可以使用一些网站, 如<a href="http://davapc1.bioch.dundee.ac.uk/cgi-bin/prodrg">PRODRG</a>在线生成. 请确保每个CH<sub>2</sub>联合单元的电荷数为零, 而不要直接使用PRODRG给出部分电荷. 为节省时间, 你也可以直接下载我的环己烷<a href="GMXtut-4_chx.gro">坐标文件</a>和<a href="GMXtut-4_chx.top">拓扑文件</a>.</p>

<p>有两种方法可用于构建模拟盒子. 方法一随机地将分子插入到一个给定大小的盒子中, 方法二则建立一个特定外形尺寸的分子格点. 下面分别说明这两种方法.</p>

### 方法一: 随机插入

<p>使用<code>insert-molecules</code>模块可以随机地将分子插入固定大小的盒子中. 例如, 要建立一个边长5 nm的立方盒子, 并填充环己烷, 可使用如下命令:</p>

<p><code>gmx insert-molecules -ci chx.gro -nmol 500 -box 5 5 5 -o chx_box.gro</code></p>

<p>传递给<code>-nmol</code>选项的值可随意取. 你可以设置更大的值, 但<code>insert-molecules</code>将会在盒子中填充尽可能多的分子. 建议你尝试多个(递增的)值来确保盒子已经被填满. 一旦填充分子的数目收敛, 就表明已经填充了尽可能多的分子. 使用上述命令, 我得到的盒子中总共包含了466个环己烷分子. 我们发表的<a href="http://pubs.acs.org/doi/abs/10.1021/ci100335w">论文</a>中曾使用了这种方法.</p>

### 方法二: 特定插入

<p>如果你更倾向于使用不那么盲目的方法来构建盒子, 你可以使用<code>genconf</code>模块来构建特定外形尺寸的分子格点. 方法一的优点在于体系中人为引入的有序度更少, 这样模拟时达到平衡需要的时间更少. 方法二的优点则是你可以更好地控制加入的分子数目, 并且你能够精确地知道它们的位置. 具体命令如下:</p>

<p><code>gmx genconf -f chx.gro -nbox 8 8 8 -o chx_box.gro</code></p>

<p>该命令将会输出一个包含512(8<sup>3</sup>)个环己烷分子的的盒子. x, y, z方向的分子数目不必相同, 你可以建立任意大小的长方板块. 对于本教程, 立方盒子就足够了.</p>

<p>在这一步, 你需要模拟环己烷盒子使它的密度稳定. 接下来进行最速下降的能量最小化, 100 ps的NVT(298K)平衡和100 ps的NPT(298K,1bar)平衡. 使用相同的NPT条件, 进行额外的10 ns模拟我能够获得合理的密度值. 你可以在<a href="GMXtut-4_chx_10ns.gro">这里</a>下载我已经平衡好的盒子(使用方法一).</p>

## 第二步: 填充水分子

<p>使用<code>editconf</code>模块可以方便地将两个溶剂层放置在一起. 我们可以定义一个所需大小的单元盒子并把环己烷层放于其中的特定位置. 一旦放置完毕, 就可以在其余的地方填充水分子了.</p>

<p>对于我构建的含466个分子的环己烷层, 平衡后盒子的边长为4.30795 nm. 这个教程的目的是构建两相体系, 并且水层的大小相同. 因此, 我们保持x, y方向的边长不变, 将z方向的边长变为原来的两倍. 这里的技巧在于, 如果我们直接对环己烷体系定义一个这样的盒子, <code>ediconf</code>模块将会自动将环己烷层置于盒子中央. 尽管这也没有什么不对(由于存在周期性, 仍会形成正确的界面), 但这样的位置, 当我们想要添加小的蛋白质或多肽到水层里面时不太方便, 因为分开的层会使做法变得麻烦.</p>

<p>幸运的是, <code>editconf</code>模块允许我们手动指定体系的中心位置. 当增大盒子时, 我们希望环己烷层能保持在原来的位置, 因此, 我们可以指定体系的中心位置处于(x/2, y/2, z/4), 也就是在原始盒子中以(x/2, y/2, z/2)进行居中.</p>

<p><code>gmx editconf -f chx_10ns.gro -o chx_newbox.gro -box 4.30795 4.30795 8.6159 -center 2.153975 2.153975 2.153975</code></p>

<p>这样, 我们就得到了排列如下图的体系:</p>

<figure>
<img src="/GMX/GMXtut-4_chx_box.png" alt="" />
</figure>

<p>现在, 只需要将空着的部分填满水就可以了. 这借助<code>solvate</code>模块可方便地完成:</p>

<p><code>gmx solvate -cp chx_newbox.gro -cs spc216.gro -p chx.top -o chx_solv.gro</code></p>

<p>如果<code>solvate</code>将一些水分子置于环己烷层中, 你需要将<code>vdwradii.dat</code>文件(通常在<a href="http://www.gromacs.org/Documentation/Terminology/Environment_Variables"><code>$GMXLIB</code></a>目录下)复制到你的工作目录下, 然后将<code>C radius</code>从0.15改为0.25或0.3, 并再次运行<code>solvate</code>直到环己烷层中没有水分子. 无须担心盒子&#8220;底部&#8221;的水分子, 因为它们是跨过x-y平面周期性边界的连续溶剂层的一部分.</p>

## 第三步: 提示和技巧

### 向水层中加入蛋白质分子

<p>对蛋白质或多肽如何与这样的两相体系相互作用感兴趣么? 前面的原理同样可以用于放置蛋白质:
将蛋白质置于所需尺寸的单元盒子中, 手动设置它的中心. 对我们的体系, 可以使用<code>ediconf</code>模块将通用多肽置于盒子的&#8220;上&#8221;半层中间:</p>

<p><code>gmx editconf -f peptide.gro -o peptide_newbox.gro -box 4.30795 4.30795 8.6159 -center 2.153975 2.153975 6.461925</code></p>

<p>蛋白质中心的z坐标为盒子总长的3/4(原始的环己烷盒子加上一半).</p>

<p>上述步骤产生的是只含有一个蛋白质分子的盒子, 我们如何将蛋白质与之前所得的两相体系结合呢? 我们可以使用Unix的<code>cat</code>命令, 但是这还需要一些内部清理才能完成(如, 移除不需要的行, 计算原子数, 等). 这些都挺简单的, 但一步能完成的话为何还要选择多步呢? 我们实际只需要将<code>chx_newbox.gro</code>作为溶剂, 它的尺寸和我们放置蛋白质的盒子相同, 使用以下命令就可以漂亮地完成:</p>

<p><code>gmx solvate -cp peptide_newbox.gro -cs chx_newbox.gro -o peptide_chx.gro</code></p>

<p>使用前面<a href="http://www.bevanlab.biochem.vt.edu/Pages/Personal/justin/gmx-tutorials/membrane_protein/index.html">膜蛋白教程</a>中的KALP<sub>15</sub>多肽, 得到的体系如下:</p>

<figure>
<img src="/GMX/GMXtut-4_peptide_chx.png" alt="" />
</figure>

<p>接下来, 就可以加入水, 然后, 和之前一样, 进行能量最小化, 平衡, 模拟.</p>

### 扩展盒子

<p>如果对你的蛋白质分子来说, x-y平面大约4.3 nm的盒子太小, 可以简单地使用<code>genconf</code>模块来扩展盒子:</p>

<p><code>gmx genconf -f chx_newbox.gro -nbox 2 2 2 -o chx_bigbox.gro</code></p>

<p>上述命令可以将原来4.3 nm见方的盒子扩展到8.6 nm, 所含的环己烷分子数为原来的8倍. 同样, 你依然可以对x, y, z方向使用不同的放大倍数, 不一定非要创建一个立方盒子. 然后遵循前面列出的所有步骤将这个新的, 更大的层置于盒子中, 添加你需要的蛋白质或溶质, 并将盒子填满水.</p>

## 总结

<p>恭喜你已经构建了一个环己烷/水的双相体系, 并理解了如何将任意分子置于该体系指定位置的基本原则.</p>

<p>如果你对改进这个教程有些建议, 如果你发现了错误, 或者你觉得有些地方不够清楚, 请给我发邮件<code>jalemkul@vt.edu</code>, 不要客气. 请注意: 这不是邀请你因为GROMACS的问题而给我发邮件. 我并不是作为一个私人家教或个人客服在为自己打广告. 那是<a href="http://lists.gromacs.org/mailman/listinfo/gmx-users">GROMACS用户邮件列表</a>的事. 我可能会在那里帮助你, 但那只是作为对整个社区的服务, 而不只针对最终用户.</p>

<p>祝你模拟愉快!</p>
