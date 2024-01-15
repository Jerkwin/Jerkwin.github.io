---
 layout: post
 title: 使用Notepad2查看编辑GROMACS文件
 categories:
 - 科
 tags:
 - gmx
---

## 2015-04-14 20:52:38

在运行GMX的时候, 经常需要查看编辑相关文件, 这些文件主要分为两类, 文本文件和结构轨迹文件.
文本文件主要是运行的输入文件`*.gro`, `*.top`, `*.ndx`, `*.mdp`和输出文件`*.log`, `*.xvg`.
这些是查看编辑次数最多的文件. 为了查看的时候直观方便, 建议尽量不要使用Windows系统自带的记事本, 而是使用支持语法高亮的文本编辑器. 这样的文本编辑器很多, 如果你还没有形成特定的倾向的话,
我建议你试试Notepad2, 因为我一直在使用它.
有关Notepad2的一些信息与下载请参看我以前的一篇博文[记事本Notepad2汉化版](http://jerkwin.github.io/2015/02/13/记事本Notepad2汉化版/).

GMX使用的top文件(也包括itp文件)和ndx文件都是configuration格式(或ini格式), 而mdp文件则是不标准的configuration格式,
我们可以将这些文件类型添加到相应的语法方案中, 这样再次打开这些文件后就可以看到高亮效果了.
下面是三种文件的显示效果

![](https://jerkwin.github.io/pic/GMX_mdp.png)

![](https://jerkwin.github.io/pic/GMX_itp.png)

![](https://jerkwin.github.io/pic/GMX_ndx.png)

可以看到普通文本, 数字, 条目, 注释都以不同颜色显示, 十分清晰. 这样修改的时候更容易定位, 有了错误也更容易发现.
此外, Notepad2还支持折叠, 折叠后更容易看清文件的整体结构, 在查看大分子的top文件或ndx文件时更方便.

如果你是在Linux下使用VIM, 如果可能建议你优先使用gVIM, 同时也建议你打开VIM的语法高亮, 并对这几种文件类型设置高亮方案.
具体方法是在你`home`下面的`.vimrc`文件中添加下面几行

	filetype on
	syntax on
	syntax enable
	set showcmd

	hi string ctermfg=darkcyan
	hi linenr ctermfg=darkred
	hi linenr ctermbg=gray
	hi comment ctermfg=darkgreen
	hi type ctermfg=blue
	hi number ctermfg=red
	hi operator ctermfg=darkred
	hi repeat ctermfg=blue
	hi conditional ctermfg=blue
	hi statement ctermfg=blue
	hi special ctermfg=blue
	hi statusline ctermbg=darkred
	hi statusline ctermfg=gray
	hi foldcolumn ctermbg=black

	au BufNewFile,BufRead *.top,*.ndx setf dosini
	au BufNewFile,BufRead *.mdp  setf masm

下面是效果图

![](https://jerkwin.github.io/pic/GMX_mdp_Lin.png)

![](https://jerkwin.github.io/pic/GMX_top_Lin.png)

![](https://jerkwin.github.io/pic/GMX_ndx_Lin.png)

虽然效果不是很完美, 却也比单纯的一种颜色要好. 当然, 如果你自己喜欢, 可以把效果弄得更好.
我是Windows的深度用户, 对此需求不是很大, 就作罢了.
