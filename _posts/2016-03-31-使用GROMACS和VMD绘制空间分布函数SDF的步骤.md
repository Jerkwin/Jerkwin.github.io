---
 layout: post
 title: 使用GROMACS和VMD绘制空间分布函数SDF的步骤
 categories:
 - 科
 tags:
 - md
 - gmx
 - vmd
---

- 2016-03-31 22:45:21 整理: 祝小华; 补注: 李继存

体系：油水+表活剂体系，如下图：

![](https://jerkwin.github.io/pic/SDF_sys.png)

目标：计算表活剂头基C原子附近水分子的SDF，类似于下图：

![](https://jerkwin.github.io/pic/SDF_exam.png)

计算步骤：

## 第一：使用GROMACS生成<code>grid.cube</code>文件

步骤来源：[GROMACS程序文档: gmx spatial](http://jerkwin.github.io/GMX/GMXprg/#gmx-spatial--)

1. 使用gmx make_ndx创建两个组, 一个包含中心分子, 一个包含要统计SDF的原子

	我试过两种方案，一种是以一个表活剂作为中心分子建一个group，以中心分子头基附近的水建一个group，用这两个group计算SDF；另一种是以所有表活剂作为中心分子建一个group，以体系中所有水建一个group，用这两个group计算SDF。最后结果都差不多。

	最终选中心分子为COO, SDF的原子为体系中所有的水

2. 使中心分子在盒子内居中, 同时所有其他分子处于盒子内

		gmx_mpi trjconv -s md0.tpr -f md0.trr -n sdf.ndx -o md0_cnt.xtc -center -ur compact -pbc mol

	`Select group for centering`时选择中心分子组, `Select group for output`时选择`System`组

3. 按中心分子对轨迹进行叠合, 移除中心分子的转动和平动

		gmx_mpi trjconv -s md0.tpr -f md0_cnt.xtc -n sdf.ndx -o md0_cnt_fit.xtc -fit rot+trans

	`Select group for least squares fit`时选择中心分子组, `Select group for output`时选择`System`组

4. 统计分布

		gmx_mpi spatial -s md0.tpr -f md0_cnt_fit.xtc -n sdf.ndx -nab 80 -b 15000 -e 18000

	`Select group to generate SDF`时选择要统计SDF的组, `Select group to output coords (e.g. solute)`时选择中心分子组

__注意__: 使用`gmx spatial`计算空间分布函数时, 在模拟过程中要尽量多输出些轨迹（约5000帧，根据结果可自行调节输出的帧数）, 这样得到的SDF才可能光滑.

## 第二：使用VMD载入`grid.cube`文件, 以等值面模式查看结果

步骤来源: [VMD画cube文件等密度面图（轨道或电子密度等）](http://blog.163.com/jjf_sxnu/blog/static/6511705720130605542933)

1. `new molecule`打开文件。
2. 选择`Graphics`下的`representations`.
3. 在弹出的对话框中，`Drawing method`选`cpk`，使画出的分子更漂亮。图（以所有表活剂作为中心分子建一个`group`，以体系中所有水建一个`group`的结果）如下：

	![](https://jerkwin.github.io/pic/SDF_cpk.png)

4. 点`Create Rep`，新建一个`Representation`.
5. 选新建的`Representation`后，`Drawing method`选`isosurface`. 先画正的部分，即在`isovalue`中输入一个正的值如`0.02`。在`Coloring method`中选择`ColorID`，为这个面指定颜色。图（表活剂包裹在里面）如下：

	![](https://jerkwin.github.io/pic/SDF_pos.png)

	![](https://jerkwin.github.io/pic/SDF_iso40.png)

	![](https://jerkwin.github.io/pic/SDF_iso25.png)

	【李继存 注】等值面的具体数值要根据自己的计算结果确定, 选择一个有代表性且较光滑的等值面即可. 由于示例数据尚未收敛, 所以结果看起来并不好.

6. 点`Create Rep`，再新建一个`Representation`.
7. 选新建的`Representation`后，`Drawing method`选`isosurface`. 再画负的部分，即在`isovalue`中输入一个负值如`-0.02`。在`Coloring method`中选择`ColorID`，为这个面指定颜色。如下图所示：

	![](https://jerkwin.github.io/pic/SDF_neg.png)

	【李继存 注】对SDF, 由于不会出负值, 所以此步骤可忽略.

8. 在`Graphics`中选择`Colors`, 在`Catagories`中选`displays`，`Name`中选择`backgroud`，指定背景的颜色。也可在`display`菜单下的`backgroud`指定背景为梯度颜色。
9. 选择喜爱的方法`render`.

## 补充: 使用gopenmol作等值面图

1. 将`grid.cube`文件转化成`grid.plt`文件

	操作: 菜单栏`run | {gCube2plt/g94cub2pl (cube)}`, 浏览输入文件`grid.cube`, 指定输出文件, 命名为`grid.plt`. 然后点击最下面的`Apply`. 这样就转化成`plt`格式的文件了, 与此同时还生成了一个`grid.crd`文件, 这个`crd`文件作为结构文件.

2. 读入上一步的`grid.crd`文件: `File | Import | Coords`

3. 选择`Plot|Contour`, 然后`import`, 最后根据需要调节`contour levels value`及颜色, 并且可通过`detail`调节曲面的光滑度.

最终结果

![](https://jerkwin.github.io/pic/SDF_COO.png)
