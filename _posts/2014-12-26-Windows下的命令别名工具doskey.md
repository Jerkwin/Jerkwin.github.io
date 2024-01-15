---
 layout: post
 title: Windows下的命令别名工具doskey
 categories:
 - 科
 tags:
 - cmd
---

## 2014-12-26 13:05:56

以前使用的快速启动方法是利用环境变量`path`, 将程序或者脚本加入特定的目录,
具体的做法可参考善用佳软的介绍, [最绿色最高效，用win+r启动常用程序和文档](http://xbeta.info/win-run.htm)
, 以及[Windows运行快速打开程序](http://www.winseliu.com/blog/2014/02/23/quickly-open-program-in-windows/).

但是当脚本越来越多以后, 目录里面就会放着很多的`bat`和`lnk`文件, 看起来乱, 且不好管理.
我知道Linux下可以在`.bashrc`里面用`alias`来为命令定义别名, 易于管理. 
可不知道原来Windows也有一个类似, 但功能更强大的命令`doskey`.
利用`doskey`完全可以模拟Linux的`alias`, 而且可以做得更好.
具体做法就不重复了, 请参考下面的资料.

- [DOSKEY : WINDOWS里的ALIAS](https://codemelody.wordpress.com/2014/04/14/doskey-windows%E9%87%8C%E7%9A%84alias/)
- [在cmd中为命令设置别名以及启动cmd时自动执行bat](http://www.cnblogs.com/fstang/archive/2013/04/06/3002006.html)
- [利用doskey和mklink创建快速命令行](http://www.verydemo.com/demo_c482_i12087.html)
- [在windows上提高工作效率](http://www.cnblogs.com/meekcrocodile/archive/2012/05/13/2498329.html)
- [Create an alias in Windows XP](http://superuser.com/questions/49170/create-an-alias-in-windows-xp)
- [How to set an alias in Windows Command Line?](http://superuser.com/questions/560519/how-to-set-an-alias-in-windows-command-line)

但`doskey`也有着局限性, 其中一个是无法在批处理文件中使用, 微软的文档明确说明了这一点.
虽然如此, 可还是有人找到了后门,
[How To Execute a DOSKEY Macro in Batch Mode?](http://www.fpschultze.de/modules/smartfaq/faq.php?faqid=22).
我没有试验这个做法, 留在这里仅供参考.

我的方法是参考Linux下`export`的做法, 在批处理中使用`set`将命令定义为变量,
这样在批处理中就可以使用 `%cmd%` 来调用了.



