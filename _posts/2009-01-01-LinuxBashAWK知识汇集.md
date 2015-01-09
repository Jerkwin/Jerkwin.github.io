---
 layout: post
 title: Linux Bash AWK知识汇集
 categories: 
 - 科
 tags:
 - bash
---

# bash

## bash 匹配 `if [[ $i =~ xyz ]]`

## 正则表达式非贪婪(懒惰)匹配一般使用`/A[^B]B/`实现

- [Non greedy regex matching in sed?](http://stackoverflow.com/questions/1103149/non-greedy-regex-matching-in-sed)
- [使用awk/sed/vim 如何在.*(点星)的情况下非贪婪?](http://bbs.chinaunix.net/thread-3623084-1-1.html)

## bash的大括号展开

- [Brace expansion](http://wiki.bash-hackers.org/syntax/expansion/brace)
- [展开的文档说明](http://wiki.bash-hackers.org/syntax/expansion/brace)
- [展开中使用变量](http://stackoverflow.com/questions/9337489/bash-curly-brace-expansion-with-variable-for-mkdir)

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
VAR=1,2,3
eval echo {$VAR}

a=1; b=5
eval echo {$a..$b}
echo $(seq $a $b)

PATTERN=12,14,27
FILES=$(eval echo filename_{$PATTERN})
echo $FILES
</code></pre>

## bash脚本支持管道

- [shell脚本如何读取管道数据](http://www.cnblogs.com/chengmo/archive/2010/10/21/1856577.html)

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
[[ $# -gt 0 ]] && { exec 0 < $1; } # 判断是否传入参数：文件名, 如果传入, 将该文件绑定到标准输入
while read line; do
	echo $line;
done <&0;               #通过标准输入循环读取内容
exec 0&-;               #解除标准输入绑定
</code></pre>

## 一次性给多个变量赋值

- [awk一次性给多个bash变量赋值](http://bbs.chinaunix.net/forum.php?mod=viewthread&action=printable&tid=3766662)
- [bash中一次性给多个变量赋值--命名管道的使用](http://www.cnblogs.com/friedwm/archive/2012/06/02/2531709.html)
- [在Bash脚本中使用命名管道(FIFO)](http://blog.csdn.net/dux003/article/details/5833637)

`read a b c < <(echo "23 76 海外 海外" | awk '{print $1,$2,$3}')`

第一个<是重定向, `<(cmds)`是bash进程替代(Process Substitution), 
如果理解什么是命名管道, 那么`<(...)`就是一个临时的命名管道; 
如果不理解, 可以简单的看作bash产生一个/dev/fdxxx的文件, 文件内容是cmds的标准输出

`mkfifo npipe`

`(echo "a b c d" > npipe)&`

`read k1 k2 k3 k4 < npipe`

此时k1 k2 k3 k4已经分别赋值成a b c d

注意：不能用 `|` 直接给read变量, 因为`echo "a b c d" | read k1 k2 k3 k4` 时, read在子shell中执行, 执行结果不能影响父shell. 

## bash简单条件语句的合并

`a=1; [[ $a -eq 1 ]] && echo "1" || { echo 0; exit; }`

exit后必须有";", 否则出错

## bash echo错误

`Ijob=$1`

`echo $Ijob` 无输出, 原因未知

`echo "" $Ijob`  输出

## 三类引用

当shell碰到第一个单引号时, 它忽略掉其后直到右引号的所有特殊字符
双引号作用与单引号类似, 区别在于它没有那么严格. 单引号告诉shell忽略所有特殊字符, 而双引号只要求忽略大多数, 
具体说, 括在双引号中的三种特殊字符不被忽略：$,\,` ,即双引号会解释字符串的特别意思,而单引号直接使用字符串.
如果使用双引号将字符串赋给变量并反馈它, 实际上与直接反馈变量并无差别. 如果要查询包含空格的字符串, 经常会用到双引号. 

`x=*`

`echo $x`

	hello.sh menus.sh misc.sh phonebook tshift.sh

`echo '$x'`

	$x

`echo "$x"`

	*
这个例子可以看出无引号、单引号和双引号之间的区别. 

在最后一种情况中, 双引号告诉shell在引号内照样进行变量名替换, 所以shell把$x替换为*, 因为双引号中不做文件名替换, 所以就把*作为要显示的值传递给echo. 

对于第一种情况需要进一步说明, shell在给变量赋值时不进行文件名替换（这从第三种情况中也能看出来）, 各步骤发生的精确次序如下：

- shell扫描命令行, 把x的值设为星号*; 
- shell再次扫描命令行, 碰到星号*, 把它替换成当前目录下的文件清单; 
- shell启动执行echo命令, 把文件清单作为参数传递给echo.

这个赋值的先后次序非常重要：shell先作变量替换, 然后作文件名替换, 最后把这行处理为参数

### 反引号(``)

命令替换是指shell能够将一个命令的标准输出插在一个命令行中任何位置.

shell中有两种方法作命令替换：把shell命令用反引号或者`$(...)`结构括起来, 其中, `$(...)`格式受到POSIX标准支持, 也利于嵌套.

### 反斜杠 backslash-escaped( \ )

反斜杠一般用作转义字符, 或称逃脱字符, linux如果`echo`要让转义字符发生作用, 就要使用-e选项, 且转义字符要使用双引号

`echo -e "\n"`

反斜杠的另一种作用,就是当反斜杠用于一行的最后一个字符时, shell把行尾的反斜杠作为续行, 这种结构在分几行输入长命令时经常使用.

sed一般使用单引号,sed引用shell变量时使用双引号即可, 双引号是弱转义,不会去除$的变量表示功能, 而单引号为强转义, 会把$作为一般符号表示, 不会表示为变量.

## 数学计算

- [bash数学计算](http://hi.baidu.com/syqust/item/978c943303d26d8bf4e4ad68)

不可直接使用 var=1+1, 或var=$var+1之类

正确方法

1. 最推荐：`((var+=1))` 或 `let "var+=1"`

	- 参数直接引用, 不加$
	- 只能进行整数运算
	- 几乎支持所有的运算符, 包括自加++、自减--、括号()、方幂**
	- let后表达式推荐始终加双引号, 即便不含bash关键字

2. 符合习惯：`var=$[$var+1]` 或 <code>var=`expr $var + 1`</code>

	- 参数引用须加$
	- 只支持整数运算
	- expr后表达式各符号间需用空格隔开
	- expr支持的操作符有：\|、&、<、<=、=、!=、>=、>、+、-、*、/、%
	- expr支持的操作符使用时需用\进行转义的有：\|、&、<、<=、>=、>、*

3. 浮点数计算：最推荐使用bc, <code>var=`echo "$var+1"|bc`</code>

	- 支持除位操作运算符之外的所有运算符
	- 使用scale进行精度设置 <code>var=`echo "scale=2;$var*3"|bc`</code>

4. 浮点数计算, 使用awk, <code>var=`echo "$var 1" | awk '{printf("%g",$1*$2)}'</code>

	- 支持除微操作运算符之外的所有运算符
	- 内置函数：log、sqrt、cos、sin

## 重定向

- [Bash的输入输出重定向](http://linux-wiki.cn/wiki/zh-hans/Bash%E7%9A%84%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA%E9%87%8D%E5%AE%9A%E5%90%91)
- [2>&1使用](http://www.cnblogs.com/itech/archive/2009/07/17/1525590.html)
- [linux输入输出重定向详解](http://hi.baidu.com/lb_hb/item/17fe3196766c02d81f4271ed)

<table><caption>Linux文件</caption>
<tr>
<th style="text-align:center;">编号</th>
<th style="text-align:center;">含义</th>
<th style="text-align:center;">默认设备</th>
<th style="text-align:center;">或其他设备</th>
</tr>
<tr>
<td style="text-align:center;">0</td>
<td style="text-align:center;">STDIN  标准输入</td>
<td style="text-align:center;">键盘</td>
<td style="text-align:center;">文件或管道(pipe)</td>
</tr>
<tr>
<td style="text-align:center;">1</td>
<td style="text-align:center;">STDOUT 标准输出</td>
<td style="text-align:center;">终端(terminal)</td>
<td style="text-align:center;">重定向到文件, 管道或后引号(backquotes "`")</td>
</tr>
<tr>
<td style="text-align:center;">2</td>
<td style="text-align:center;">STDERR 标准错误输出</td>
<td style="text-align:center;">终端</td>
<td style="text-align:center;">重定向到文件</td>
</tr>
</table>

除以上常用的3种外, 3-9也可以作为文件描述符, 常被用来作为临时的中间描述符. 

**实例**

1. `command 2>errfile` : command的错误重定向到文件errfile. 
2. `command 2>&1 | ...`: command的错误重定向到标准输出, 错误和标准输出都通过管道传给下个命令. 
3. <code>var=\`command 2>&1\`</code>: command的错误重定向到标准输出, 错误和标准输出都赋值给var. 
4. `command 3>&2 2>&1 1>&3 | ...`:实现标准输出和错误输出的交换. 
5. <code>var=\`command 3>&2 2>&1 1>&3\`</code>:实现标准输出和错误输出的交换. 
6. `command 2>&1 1>&2 | ...`:错！！！不能实现标准输出和错误输出的交换. 因shell从左到右执行命令, 当执行完2>&1后, 错误输出已经和标准输出一样的, 再执行1>&2也没有意义. 


**"2>&1 file"和 "> file 2>&1"区别**

1. `cat food 2>&1 >file`：错误输出到终端, 标准输出被重定向到文件file. 
2. `cat food >file 2>&1`：标准输出被重定向到文件file, 然后错误输出也重定向到和标准输出一样, 所以也错误输出到文件file. 

**注意**

- 通常打开的文件在进程推出的时候自动的关闭, 但是更好的办法是当你使用完以后立即关闭. 
- 用`m<&-`来关闭输入文件描述符m, 用`m>&-`来关闭输出文件描述符m. 
- 关闭标准输入用`<&-`, 关闭标准输出用`>&-`. 
- 同时输出到终端和文件 `copy source dest | tee.exe copyerror.txt`

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
1>filename
   # 重定向stdout到文件"filename".
1>>filename
   # 重定向并追加stdout到文件"filename".
2>filename
   # 重定向stderr到文件"filename".
2>>filename
   # 重定向并追加stderr到文件"filename".
&>filename
   # 将stdout和stderr都重定向到文件"filename".
2>&1
   # 重定向stderr到stdout.
   # 得到的错误消息与stdout一样, 发送到一个地方.

i>&j
   # 重定向文件描述符i 到 j.
   # 指向i文件的所有输出都发送到j中去.

>&j
   # 默认的, 重定向文件描述符1(stdout)到 j.
   # 所有传递到stdout的输出都送到j中去.

0< FILENAME
 < FILENAME
   # 从文件中接受输入.
   # 与">"是成对命令, 并且通常都是结合使用.
   #
   # grep search-word <filename

[j]<>filename
</code></pre>

## bash字符串操作

- [Bash Shell字符串操作小结](http://my.oschina.net/aiguozhe/blog/41557)
- [bash shell字符串的截取](http://www.cnblogs.com/liuweijian/archive/2009/12/27/1633661.html)
- [shell 字符串操作（长度, 查找, 替换）详解](http://apps.hi.baidu.com/share/detail/23262717)
- [Bash shell 字符串操作符详解](http://apps.hi.baidu.com/share/detail/23264838)

## [理解 Bash 的 if 语句](http://qixinglu.com/post/understand_bash_if_statement.html)

## [bash中关于日期时间操作的常用自定义函数](http://codingstandards.iteye.com/blog/604288)


# awk

## awk 文件读入可放于前面, `< File awk ''`

## awk遍历外部数组（用于BEGIN段处理）`awk -f 'BEGIN{for(i=1;i<ARGC;i++)print ARGV[i]}' ${extarr[@]}`

## awk中`(`有特殊含义, 匹配, 替换时必须用`[(]`进行

## awk 替换反斜线, 使用 `sub("\\\\", "/", txt)`

## awk替换多组字符串 `gsub(/(A)|(B)|(C)/, "")`

## awk输出单引号, 使用两个单引号和\括起来, 也可使用ASCII码47

`bash
	awk ' BEGIN {
		print "'\''"
		print "\47", "\047"
		A="'\''"; print A
		A="\47"; print A
	} '
```

## awk 从文件getline时, 文件名不可拼接

例:

`File="FileName"`

`getline < File".dat"` 错误

`Fdat=File".dat"; getline < Fdat` 正确

## awk二维数组

程默, [linux awk数组操作详细介绍] (http://www.cnblogs.com/chengmo/archive/2010/10/08/1846190.html)

awk在存储上并不支持多维数组, awk的多维数组在本质上是一维数组.

awk提供了逻辑上模拟二维数组的访问方式. 例如, array[2,4] = 1这样的访问是允许的.

awk使用一个特殊的字符串SUBSEP(\034)作为分割字段. 在上面的例子中, 关联数组array存储的键值实际上是2\0344. 

类似一维数组的成员测试, 多维数组可以使用`if( (i,j) in array )`这样的语法, 但是下标必须放置在圆括号中. 
类似一维数组的循环访问, 多维数组使用`for( item in array )`这样的语法遍历数组. 与一维数组不同的是, 多维数组必须使用`split()`函数来访问单独的下标分量. `split ( item, subscr, SUBSEP)`

## awk 函数数组传递

- [awk自定义函数把数组作为参数的问题](http://bbs.chinaunix.net/thread-3775338-1-1.html)

数组为全局变量, 传值调用

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
echo 123 | \
awk ''
function foo(fa) { fa[1]=5; print "fa[1]=" fa[1] }
{	a[1]=$0; print " a[1]="a[1]
	foo(a);  print " a[1]="a[1]
}
''
echo ""

echo 123 | \
awk ''
function foo(fa,fx) { fx=fa[1]; fx=5; print "fa[1]="fa[1] ", fx="fx }
{	a[1]=$0; print " a[1]="a[1]
	foo(a);  print " a[1]="a[1]
}'
</code></pre>


## printf多变量格式输出

printf是bash的一个命令, 也是awk中的一个函数, 作为函数的printf与C语言中的printf功能相同,
但是比起fortran的write函数, 功能还是弱了些. 比如, 多个变量的格式化输出, 利用printf要把格式写多次,
或是利用循环, 都不如write的直接使用数字简洁. 而且, printf函数使用时, 格式的数目和变量的数目必须匹配, 
否则就会出错.

但bash的内置printf命令, 使用时稍有不同, 功能也更强大一些

1. 不需要逗号`,`分隔
2. 输出变量数目不限

下面是使用示例

- fortran: `write(*, '(3F8.3)') a, b, c`
- awk: `ptintf("%8.3f %8.3f %8.3f", a, b, c)`
- bash: `printf "%8.3f" a b c`


利用这点, 我们可以写一个函数来模拟fortran write函数.

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
awk '' BEGIN { a=1; b=2; c=3;
	FMT=fmt("4%8.3f")
	printf FMT"\n", a, b, c, a*b*c
	prt("%8.3f", a" "b" "c" "a*b*c)
	print""
	wrt("%8.3f", a, b, c, a*b*c)
}

function fmt(FMT) { # 拼接格式
	Nfmt=FMT
	gsub(/[0-9]+%/, "%", FMT)
	gsub(/%.*[a-zA-Z]/, "", Nfmt)
	for(i=1; i<=Nfmt; i++) txt=txt FMT
	return txt
}

function prt(FMT, txt) { # 任意格式输出字符串
	system("printf \"" FMT "\" "txt)
}

function wrt(FMT, a, b, c, d, e, f, g, h, i, j, k, l, m, n) { # 多变量输出
	system("printf \"" FMT "\" " \
		a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n)
	print ""
}
'
</code></pre>

## bash与awk间的变量传递

- [awk与shell参数传递（或说变量传递）二三点](http://blog.csdn.net/sosodream/article/details/5746315)

### bash使用awk变量

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
echo '>>>>>>>>Bash Using AWK Variable'
echo 'bshVar=|'$bshVar'|'

bshVar=$( awk 'BEGIN{print "awkVar"; exit}' )
echo 'bshVar=|'$bshVar'|'

eval $( awk 'BEGIN{print "bshVar1=awkVar1", "bshVar2=awkVar2"}' )
echo 'bshVar1=|'$bshVar1'|' 'bshVar2=|'$bshVar2'|'
</code></pre>

### awk使用bash变量

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
echo
echo '>>>>>>>>AWK Using Bash Variable'

bshVar=bshVar
echo '>>>>bshVar='$bshVar
awk 'BEGIN{print ">>Txt Method 1:   awkVar=|"   '$bshVar'   "|"}'
awk 'BEGIN{print ">>Txt Method 2:   awkVar=|"   "$bshVar"   "|"}'
awk 'BEGIN{print ">>Txt Method 12:  awkVar=|"  '"$bshVar"'  "|"}'
awk 'BEGIN{print ">>Txt Method 21:  awkVar=|"  "'$bshVar'"  "|"}' # OK
awk 'BEGIN{print ">>Txt Method 212: awkVar=|" "'"$bshVar"'" "|"}' # OK
awk -v awkVar=$bshVar 'BEGIN {print ">>Txt Method -v:  awkVar=|" awkVar "|"}'  # OK

echo
bshVar='Blank bshVar'
echo '>>>>bshVar='$bshVar
awk 'BEGIN{print ">>Txt Method 1:   awkVar=|"   '$bshVar'   "|"}'
awk 'BEGIN{print ">>Txt Method 2:   awkVar=|"   "$bshVar"   "|"}'
awk 'BEGIN{print ">>Txt Method 12:  awkVar=|"  '"$bshVar"'  "|"}'
awk 'BEGIN{print ">>Txt Method 21:  awkVar=|"  "'$bshVar'"  "|"}' # OK
awk 'BEGIN{print ">>Txt Method 212: awkVar=|" "'"$bshVar"'" "|"}' # OK
awk -v awkVar= $bshVar  'BEGIN {print ">>Txt Method -v:   awkVar=|" awkVar "|"}'  # OK
awk -v awkVar='$bshVar' 'BEGIN {print ">>Txt Method -v1:  awkVar=|" awkVar "|"}'
awk -v awkVar="$bshVar" 'BEGIN {print ">>Txt Method -v2:  awkVar=|" awkVar "|"}'  # OK

echo
bshVar=10.1
echo '>>>>bshVar='$bshVar
awk 'BEGIN{print ">>Num Method 1:   awkVar=|"   '$bshVar'*9.9/7   "|"}' # OK
awk 'BEGIN{print ">>Num Method 2:   awkVar=|"   "$bshVar"*9.9/7   "|"}'
awk 'BEGIN{print ">>Num Method 12:  awkVar=|"  '"$bshVar"'*9.9/7  "|"}' # OK
awk 'BEGIN{print ">>Num Method 21:  awkVar=|"  "'$bshVar'"*9.9/7  "|"}' # OK
awk 'BEGIN{print ">>Num Method 212: awkVar=|" "'"$bshVar"'"*9.9/7 "|"}' # OK
awk -v awkVar= $bshVar  'BEGIN {print ">>Num Method -v:  awkVar=|" awkVar*9.9/7 "|"}' # OK
awk -v awkVar='$bshVar' 'BEGIN {print ">>Num Method -v1: awkVar=|" awkVar*9.9/7 "|"}'
awk -v awkVar="$bshVar" 'BEGIN {print ">>Num Method -v2: awkVar=|" awkVar*9.9/7 "|"}' # OK
</code></pre>

### 结论

1. awk使用bash变量, 212(`"'"VAR"'"`)通用, 若无空格21(`"''"`)亦可
2. 如不方便使用212格式引用, 可用 -v 格式
4. -v 使变量的作用域扩展至BEGIN段, 每调用一次变量都要加一个-v参数, 使用时无须$
3. 其他如BEGIN段不可用的引用`awk '<awk expression>' "awkvar=$extvar" filename`
   和环境变量格式 `var="this is a test"; export var; awk 'BEGIN{print ENVIRON["var"]}'`, 徒增混乱, 不建议使用

## awk正则表达式中使用变量

1. 只能引用bash变量, 不能引用awk变量
2. 若想使用awk变量, 需要用匹配运算 ~
3. 模式正则表达式中引用bash变量 `'"$bshVar"'`
4. `awk '{command}'` 中引用变量用单引号
5. 确切来说awk的正则表达式中无法引用awk变量, 但awk的匹配形式`~/ /`可以把两个/去掉, 虽然不能用正则但可以引用awk变量
6. 使用awk变量存储正则表达式, 且该正则表达式中可以通过字符串拼接方式引用awk变量
7. 当正则表达式中需要引用awk变量时, 也可以直接在~后写正则表达式

测试文件BashAWK

	Blank bshVar
	Blank awkVar
	  Blank bshVar
	Blank bshVar

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
bshVar="Blank bshVar"
echo
echo '>>>>bshVar='$bshVar
echo '>> RegExp Method 1:'
awk ' /^'"$bshVar"'/ {print NR, $0} ' BashAwk
echo
echo '>> RegExp Method 2:'
awk ' '/^"$bshVar"/' {print NR, $0} ' BashAwk
echo
echo '>> RegExp Method 3:'
awk ' { if($0 ~ /^'"$bshVar"'/) print NR, $0 } ' BashAWK
echo
echo '>> RegExp Method 4:'
awk ' { if($0 ~ '/^"$bshVar"/') print NR, $0 } ' BashAWK
echo
echo '>> RegExp Method 5:'
awk ' { if($0 ~ "^'"$bshVar"'") print NR, $0 } ' BashAWK

echo
echo '>> RegExp Method 6:'
awk 'BEGIN{RegExp="^'"$bshVar"'"}  { if($0 ~ RegExp) print NR, $0 } ' BashAWK
</code></pre>


## awk的类heredoc用法

- [awk here documentsawk here documents](https://groups.google.com/forum/#!topic/comp.unix.shell/E1XOBtYKO7Q)

bash的heredoc在输出大段文字时很方便, perl中有类似的用法, awk中没有, 但是可以模拟一下.
下面是代码

<pre class="line-numbers" data-start="0"><code class="language-bash"># Language: bash
awk ' BEGIN { Out="OutFile"; awkVar="AWK"

# 直接使用bash的heredoc功能, 只用于输出到文件, 且其中的awk变量无法引用
"'$( cat >Out <<END
	1
	2
	Out
	awkVar
END
)'"

# 赋值给变量, 使用printf
txt="'"$( awk '{printf "%s\\n",$0 }' <<END
	1
	2
	awk variable: <"awkVar">
	awk field: <"\$2">
END
)"'"
print txt

# 使用print不可换行
txt="'"$( awk '{print}' <<END
	awk variable: <"awkVar"> awk field: <"\$2">
END
)"'"
print txt

}' 
</code></pre>
