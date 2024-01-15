---
 layout: post
 title: GaussView使用cube文件作图时的成键问题
 categories:
 - 科
 tags:
 - 编程
---

## 2016-01-11 20:33:59

在使用GaussView打开cube文件做等值面之类的图时, GaussView会自动根据原子坐标判断原子之间的连接性, 并以成键的方式显示出来. 由于cube文件中没有储存原子间的连接信息, 所以判断是根据GaussView设定的原子半径进行的. 可惜的是在GaussView中这些原子半径都是固定的, 我们没有办法改变. 更讨厌的是, 打开cube文件后, 如果你选中两个原子并改变了它们之间的成键情况, 这时`Results`菜单下的`Surfaces/Contours`功能就无法使用了. 这实在是非常不方便, 因为有些情况下GaussView给出的成键情况不能满足我们的需要, 在使用cube文件做图的时候我们需要改变成键情况.

网上的解决办法大致有两种, 一种是换用其他软件, 如VMD, Chemcraft来作图, 如[这里的建议](http://bbs.keinsci.com/thread-405-1-1.html). 这不是我们要讨论的方法.
另一种方法则是[丁迅雷给出的方法](http://blog.sciencenet.cn/blog-482864-518758.html), 并给出了一个修改Fchk文件中成键信息的程序, 但语焉不详, 程序也无法下载. 为此, 我对第二种方法略加说明, 供大家参考.

解决这个问题的办法是同时使用Fchk文件和cube文件, 因为除cube文件外, 只有在打开Fchk文件时, `Results -> Surfaces/Contours`功能才可使用, 且还能导入cube文件作图, 而Fchk文件中是可以保存成键信息的. 因此, 我们只要先在Fchk文件中设定好了成键情况, 使用GaussView打开它, 再导入cube文件作图就能达到目的了.

所以, 现在的问题就是看看Fchk中是如何保存原子成键信息的. 使用GaussView打开一个测试文件, 成键情况如下:

![](https://jerkwin.github.io/pic/Fchk.png)

查看Fchk文件中的内容, 发现成键信息保存在下面的文本中

	MxBond                                     I                3
	NBond                                      I   N=          16
	           1           2           1           1           2           1
	           1           1           1           0           3           1
	           1           2           1           1
	IBond                                      I   N=          48
	          11           0           0           3           4           0
	           2           0           0           2           0           0
	           6           7           0           5           0           0
	           5           0           0           9           0           0
	           8           0           0           0           0           0
	           1          12          13          11           0           0
	          11           0           0          15          16           0
	          14           0           0          14           0           0
	RBond                                      R   N=          48
	  1.00000000E+00  0.00000000E+00  0.00000000E+00  1.00000000E+00  1.00000000E+00
	  0.00000000E+00  1.00000000E+00  0.00000000E+00  0.00000000E+00  1.00000000E+00
	  0.00000000E+00  0.00000000E+00  1.00000000E+00  1.00000000E+00  0.00000000E+00
	  1.00000000E+00  0.00000000E+00  0.00000000E+00  1.00000000E+00  0.00000000E+00
	  0.00000000E+00  1.00000000E+00  0.00000000E+00  0.00000000E+00  1.00000000E+00
	  0.00000000E+00  0.00000000E+00  0.00000000E+00  0.00000000E+00  0.00000000E+00
	  1.00000000E+00  1.00000000E+00  1.00000000E+00  1.00000000E+00  0.00000000E+00
	  0.00000000E+00  1.00000000E+00  0.00000000E+00  0.00000000E+00  1.00000000E+00
	  1.00000000E+00  0.00000000E+00  1.00000000E+00  0.00000000E+00  0.00000000E+00
	  1.00000000E+00  0.00000000E+00  0.00000000E+00

对照一下容易发现:

- `MxBond`为所有原子的最大连接数.  
	对上面的体系11号原子与1, 12, 13号原子都相连, 具有最大的连接数3.
- `NBond`相当于一个数组, 维数为`原子个数`, 保存了每个原子的连接数.  
	第一个值为1说明只有一个原子与1号原子相连.
- `IBond`相当于一个二维数组, 维数为`原子个数×MxBond`, 保存了与每个原子相连的其他原子的编号.  
	上面的体系共16个原子, Mxbond为3, 所以`IBond`的元素数目为16×3=48.  
	前三个值`11 0 0`说明和1号原子相连的三个原子的编号分别为`11`, `0`, `0`, 其中`0`表示空, 所以实际只有1个原子与1号原子相连, 这和`NBond`的数据一致.
- `RBond`是与`IBond`类似的二维数组, 但保存的是原子之间的键级, 用于显示. 0为不成键, 1为单键, 2为双键, 3为三键, 也可以取0.5, 1.5等数值.  
	第一值是1, 所以说明和1号原子所成的第一根键是单键, 这个图上的显示一致.

理解了这种格式, 我们就可以自己来修改这些信息了. 手动修改还是比较麻烦的, 只适用于比较简单的情况. 另外一种办法是先使用GaussView将成键情况修改好, 另存为gjf文件, 并保留`geom=connectivity`关键词和成键信息, 使用最低水平的方法做一个单点能计算, 获得Fchk文件, 然后使用这个Fchk文件中的成键信息替换掉原Fchk文件中成键信息内容. 这种方法不好的地方在于要重新做一个计算. 更好一些的办法当然是写一点代码来完成这个工作了. 丁迅雷的程序无法下载, 所以我不知道他的作法. 下面是我所用的脚本.

~~~bash
usage="\
>>>>>>>>>>>>>>>>     ReBondFchk        <<<<<<<<<<<<<<<<
>>>>>>>>>>>>>>>> Jerkwin@gmail.com  <<<<<<<<<<<<<<<<
>>>>>>>>>>     2016-01-06 20:31:08     <<<<<<<<<
>> Usage: `basename $0` File.gjf File.fchk"

[[ $# -lt 1 ]] && { echo "$usage"; exit; }

[[ $1 =~ .gjf   ]] && { Fgjf=$1; Fchk=$2; }
[[ ! $1 =~ .gjf ]] && { Fgjf=$2; Fchk=$1; }

awk '
/#/ { Nblank=0
	while(Nblank<3) {
		getline txt
		gsub(/[[:space:]]/, "", txt)
		if(length(txt)==0) Nblank++
	}
	Natm=0
	getline
	while($1~/[1-9]/) {
		Natm=$1
		for(i=2; i<=NF; i+=2) RBond[Natm, $i]=$(i+1)
		getline
	}

	for(i=1; i<=Natm; i++) {
		for(j=1; j<=i; j++) {
			RBond[i,j]=RBond[j,i]
		}
	}

	MxBond=5
	print "MxBond                                     I                "MxBond

	print "NBond                                      I   N=          "Natm
	for(i=1; i<=int(Natm/6); i++) {
		for(k=1; k<=6; k++) {
			NBond=0
			for(j=1; j<=Natm; j++) if(RBond[6*(i-1)+k,j]!=0) NBond++
			printf"%12d", NBond
		}
		print ""
	}
	for(i=6*int(Natm/6)+1; i<=Natm; i++) {
		NBond=0
		for(j=1; j<=Natm; j++) if(RBond[i,j]!=0) NBond++
		printf"%12d", NBond
	}
	print ""

	print "IBond                                      I   N=          "Natm*MxBond
	for(i=1; i<=Natm; i++) {
		NBond=0
		for(j=1; j<=Natm; j++) if(RBond[i,j]!=0) { NBond++; printf"%12d", j }
		for(j=1; j<=MxBond-NBond; j++) printf"%12d", 0
		print ""
	}

	print "RBond                                      R   N=          "Natm*MxBond
	for(i=1; i<=Natm; i++) {
		NBond=0
		for(j=1; j<=Natm; j++) if(RBond[i,j]!=0) { NBond++; printf"%16.8E", RBond[i,j] }
		for(j=1; j<=MxBond-NBond; j++) printf"%16.8E", 0
		print ""
	}
}
' $Fgjf >__Bond

awk '
	/Virial Ratio/ { print }
	/MxBond/, /Virial Ratio/ { while(getline < "__Bond") print; next }
	{ print }
' $Fchk > ${Fchk%.*}~ReBond.fchk

rm -rf __Bond
~~~

这个脚本需要两个输入文件, 一个是含有成键信息的gjf文件, 一个是要修改成键信息的Fchk文件. 执行后, 脚本会将gjf文件中的成键信息写到Fchk文件中, 达到了我们的目的. 需要注意的是, 在这个脚本中, 我将`MxBond`设为了定值5以方便格式输出. 对一般的分子, 这个值足够了, 但如果有需要增大这个值, 相应的输出格式也要修改.

