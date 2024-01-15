---
layout: post
title: GNU Parallel
categories:
- 科
tags:
- bash
---

## 2014-06-10 12:54:07

简单的并行, 可使用GNU parallel. GNU parallel是一个perl脚本, 只要设置好路径, 即可使用.

### 安装

1. 到[GNU官网](http://www.gnu.org/software/parallel/)下载最新版本
2. 解压, 得文件夹`parallel-20140522`
3. 参考`README`编译安装

	非root用户, 参照`Personal installation`
	
	直接使用, 参照`Minimal installation`, 将脚本复制到目标路径即可.

### 使用

官方文档, `parallel --help`, `man parallel`, `NEWS`文件中有一些网络资源, 包括中文的.

我一般用其替代`for`循环的繁琐写法. 如`for i in {1..10}; do echo $i; done`可利用`parallel echo ::: {1..10}`代替.

### 使用自定义命令

通过`alias`自定义的命令在`parallel`中无法直接使用, 解决方法是在脚本中`export -f`或`export`后利用`$cmd`调用.

例如, 在`.bashrc`中定义`alias cmd='ls -l'`, 直接使用`parallel cmd`会出错. 若`export cmd='ls -l'`, 则可使用`parallel $cmd`. 这样就不需要在脚本中使用`export -f`了.

### 参考

[GNU Parallel指南](http://my.oschina.net/enyo/blog/271612)

[巧用GNU Parallel实现作业并行化执行](http://guiquanz.me/2013/02/12/gnu-parallel-intro/)

[如何利用多核CPU来加速你的Linux命令 — awk, sed, bzip2, grep, wc等](http://www.aqee.net/use-multiple-cpu-cores-with-your-linux-commands/)





