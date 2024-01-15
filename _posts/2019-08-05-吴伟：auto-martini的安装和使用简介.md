---
 layout: post
 title: 吴伟：auto-martini的安装和使用简介
 categories:
 - 科
 tags:
 - gmx
 - martini
---

- 2019-08-05 17:50:22

在文献[Tristan Bereau, Kurt Kremer; Automated Parametrization of the Coarse-Grained Martini Force Field for Small Organic Molecules; J. Chem. Theory Comput. 11(6):2783-2791, 2015; 10.1021/acs.jctc.5b00056](http://dx.doi.org/10.1021/acs.jctc.5b00056)中提出了自动将小分子划分为Martini珠子的方法, 作者还提供了一个python脚本. 这里简单介绍下它的使用方法.

## 安装

1. 首先从[github](https://github.com/tbereau/auto_martini)下载`auto-martini`程序包放到合适目录
2. 下载Windows版的[anaconda2](https://www.anaconda.com/). 注意, 这里要选择python2.7版本的, 因为`auto-martini`是用python2.7写的, 不兼容python3之后的语法
3. 安装完anaconda之后, 以管理员身份运行anaconda, 进入`auto-martini`包所在位置
4. 安装`auto-martini`所依赖的四个程序包

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">pip</span> install numpy
<span style="color:#A2F">pip</span> install beautifulsoup
<span style="color:#A2F">pip</span> install requests
<span style="color:#A2F">conda</span> create <span style="color:#666">-c</span> rdkit <span style="color:#666">-n</span> my-rdkit-env rdkit</pre></div>

安装完之后, 就可以使用了.

## 使用方法

### 命令

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">python</span> auto-martini [-h] (--sdf SDF | <span style="color:#666">--smi</span> SMI) <span style="color:#666">--mol</span> MOLNAME [--xyz XYZ] [--gro GRO] [--verbose] [--fpred]</pre></div>

### 说明

- `--sdf`和`--smi`: 输入文件, 指定其中一个就可以. 可以使用[openbabel](http://openbabel.org/wiki/Main_Page)将pdb或其他格式的文件转化为sdf或者smi文件.

- `--mol`: 必须选项, 输出文件中残基的名称

- `--xyz`, `--gro`: 可选的输出文件

- `--verbose`, `--fpred`: 无法找到符合的参数时, 使用按原子或按片段判别珠子的方法, 准确度较差

## 示例

使用Gaussview画出想要的小分子

![](https://jerkwin.github.io/pic/gmx/auto-martini_1.png)

可以直接保存为sdf文件, 但好像Gaussview生成的sdf文件在`auto-martini`中使用会出错(未详细考察), 所以我们保存为pdb文件, 再用`openbabel`转换为sdf文件.

将该文件放到`auto-martini`目录下. 执行

<div class="highlight"><pre style="line-height:125%"><span style="color:#A2F">python</span> auto_martini <span style="color:#666">--sdf</span> TEG.sdf <span style="color:#666">--mol</span> TEG <span style="color:#666">--gro</span> TEG_CG.gro</pre></div>

会得到如下结果

![](https://jerkwin.github.io/pic/gmx/auto-martini_2.png)

同时生成gro文件

![](https://jerkwin.github.io/pic/gmx/auto-martini_3.png)

## 注意事项

- 如果提示`smi2alogps`这一步出错, 那你得先检查一下 <http://vcclab.org/web/alogps> 网站是否能够打开, 因为`auto-martini`会将你的分子上传到alogps网站上, 生成所需的logP等信息
