---
 layout: post
 title: Google Book破解下载方法
 categories:
 - 科
 tags:
 - 编程
---

## 2015-04-15 14:08:32

Google Book上有很多书, 但大多数的阅览受限制, 只能看到很少的几页.
网上流传有一些工具, 也有一些破解的方法, 年代都比较久远了, 但是基本的思路还是适用的.
我研究了一下, 把实现方法记在这里, 供有兴趣的人参考.

对每一本书, 使用如下的url

`http://books.google.com/books?id=_wZpJ5XxMtkC&lpg=PP1&pg=PP1&sig=&jscmd=click3`

会得到一个json格式的文件`f.txt`

	{"page":[{"pid":"PP1","src":"http://books.google.com/books?id=_wZpJ5XxMtkC\u0026hl=zh-CN\u0026pg=PP1\u0026img=1\u0026zoom=3\u0026hl=zh-CN\u0026sig=ACfU3U09mMfKDM79Ei5BnxZPUlVadLIYpA","flags":32,"order":0,"uf":"http://books.google.com/books_feedback?id=_wZpJ5XxMtkC\u0026spid=AFLRE72tw458zmDlvM1wcLWeacxh-6foP3_1cr9HcUzzemEMWqjbxno\u0026ftype=0\u0026hl=zh-CN"},{"pid":"PR4","src":"http://books.google.com/books?id=_wZpJ5XxMtkC\u0026hl=zh-CN\u0026pg=PR4\u0026img=1\u0026zoom=3\u0026hl=zh-CN\u0026sig=ACfU3U2wpNYf2JyGSla5VM93t2UqBJDiZQ"},{"pid":"PR9","src":"http://books.google.com/books?id=_wZpJ5XxMtkC\u0026hl=zh-CN\u0026pg=PR9\u0026img=1\u0026zoom=3\u0026hl=zh-CN\u0026sig=ACfU3U2bPyiufnUq8-vDaoc5zCDyykkwuw"},{"pid":"PA134","src":"http://books.google.com/books?id=_wZpJ5XxMtkC\u0026hl=zh-CN\u0026pg=PA134\u0026img=1\u0026zoom=3\u0026hl=zh-CN\u0026sig=ACfU3U38JzibZgotO6eUikauDgVSZWSSMQ"},{"pid":"PP1"},{"pid":"PR4"},{"pid":"PR9"},{"pid":"PA134"},{"pid":"PA136"},{"pid":"PA138"},{"pid":"PA139"},{"pid":"PA141"},{"pid":"PA142"},{"pid":"PA143"},{"pid":"PA145"},{"pid":"PA148"},{"pid":"PA149"},{"pid":"PA151"},{"pid":"PA152"},{"pid":"PA153"},{"pid":"PA156"},{"pid":"PA157"},{"pid":"PA171"},{"pid":"PA174"},{"pid":"PA180"}]}

文件里面的pid就限定了你使用当前的Google服务器能看到的页面数.
换用不同的Google服务器, 能看到的页面数是不同的. 比如我们使用日本的服务器

`http://books.google.jp/books?id=_wZpJ5XxMtkC&lpg=PP1&pg=PP1&sig=&jscmd=click3`

得到的文件为

	{"page":[{"pid":"PP1","src":"http://books.google.jp/books?id=_wZpJ5XxMtkC\u0026pg=PP1\u0026img=1\u0026zoom=3\u0026hl=en\u0026sig=ACfU3U09mMfKDM79Ei5BnxZPUlVadLIYpA","flags":32,"order":0,"uf":"http://books.google.jp/books_feedback?id=_wZpJ5XxMtkC\u0026spid=AFLRE72tw458zmDlvM1wcLWeacxh-6foP3_1cr9HcUzzemEMWqjbxno\u0026ftype=0"},{"pid":"PR4","src":"http://books.google.jp/books?id=_wZpJ5XxMtkC\u0026pg=PR4\u0026img=1\u0026zoom=3\u0026hl=en\u0026sig=ACfU3U2wpNYf2JyGSla5VM93t2UqBJDiZQ"},{"pid":"PR9","src":"http://books.google.jp/books?id=_wZpJ5XxMtkC\u0026pg=PR9\u0026img=1\u0026zoom=3\u0026hl=en\u0026sig=ACfU3U2bPyiufnUq8-vDaoc5zCDyykkwuw"},{"pid":"PR10","src":"http://books.google.jp/books?id=_wZpJ5XxMtkC\u0026pg=PR10\u0026img=1\u0026zoom=3\u0026hl=en\u0026sig=ACfU3U1TVYuAJ35C2_NimNGtZLddi1aArw"},{"pid":"PP1"},{"pid":"PR4"},{"pid":"PR9"},{"pid":"PR10"},{"pid":"PR11"},{"pid":"PA1"},{"pid":"PA2"},{"pid":"PA3"},{"pid":"PA5"},{"pid":"PA6"},{"pid":"PA7"},{"pid":"PA8"},{"pid":"PA9"},{"pid":"PA10"},{"pid":"PA11"},{"pid":"PA12"},{"pid":"PA13"},{"pid":"PA14"},{"pid":"PA15"},{"pid":"PA16"},{"pid":"PA17"},{"pid":"PA18"},{"pid":"PA19"},{"pid":"PA20"},{"pid":"PA21"},{"pid":"PA22"},{"pid":"PA23"},{"pid":"PA24"},{"pid":"PA25"},{"pid":"PA26"},{"pid":"PA27"},{"pid":"PA28"},{"pid":"PA29"},{"pid":"PA30"},{"pid":"PA31"},{"pid":"PA32"},{"pid":"PA33"},{"pid":"PA34"},{"pid":"PA35"},{"pid":"PA36"},{"pid":"PA37"},{"pid":"PA38"},{"pid":"PA39"},{"pid":"PA41"},{"pid":"PA42"},{"pid":"PA43"},{"pid":"PA44"},{"pid":"PA45"},{"pid":"PA46"},{"pid":"PA47"},{"pid":"PA48"},{"pid":"PA49"},{"pid":"PA50"},{"pid":"PA51"},{"pid":"PA52"},{"pid":"PA53"},{"pid":"PA54"},{"pid":"PA55"},{"pid":"PA56"},{"pid":"PA57"},{"pid":"PA58"},{"pid":"PA59"},{"pid":"PA60"},{"pid":"PA61"},{"pid":"PA62"},{"pid":"PA63"},{"pid":"PA64"},{"pid":"PA65"},{"pid":"PA66"},{"pid":"PA67"},{"pid":"PA68"},{"pid":"PA69"},{"pid":"PA70"},{"pid":"PA71"},{"pid":"PA72"},{"pid":"PA73"},{"pid":"PA74"},{"pid":"PA75"},{"pid":"PA76"},{"pid":"PA77"},{"pid":"PA78"},{"pid":"PA79"},{"pid":"PA80"},{"pid":"PA81"},{"pid":"PA82"},{"pid":"PA83"},{"pid":"PA85"},{"pid":"PA86"},{"pid":"PA87"},{"pid":"PA88"},{"pid":"PA89"},{"pid":"PA90"},{"pid":"PA91"},{"pid":"PA92"},{"pid":"PA93"},{"pid":"PA94"},{"pid":"PA95"},{"pid":"PA96"},{"pid":"PA97"},{"pid":"PA100"},{"pid":"PA101"},{"pid":"PA103"},{"pid":"PA105"},{"pid":"PA107"},{"pid":"PA108"},{"pid":"PA110"},{"pid":"PA111"},{"pid":"PA112"},{"pid":"PA114"},{"pid":"PA115"},{"pid":"PA116"},{"pid":"PA117"},{"pid":"PA118"},{"pid":"PA119"},{"pid":"PA120"},{"pid":"PA121"},{"pid":"PA122"},{"pid":"PA124"},{"pid":"PA125"},{"pid":"PA127"},{"pid":"PA128"},{"pid":"PA129"},{"pid":"PA131"},{"pid":"PA132"},{"pid":"PA133"},{"pid":"PA134"},{"pid":"PA136"},{"pid":"PA138"},{"pid":"PA139"},{"pid":"PA141"},{"pid":"PA142"},{"pid":"PA143"},{"pid":"PA144"},{"pid":"PA145"},{"pid":"PA148"},{"pid":"PA149"},{"pid":"PA151"},{"pid":"PA152"},{"pid":"PA153"},{"pid":"PA156"},{"pid":"PA157"},{"pid":"PA180"}]}

页面数明显多于默认的服务器. 你可以查下Google在世界其他国家的服务器, 多试试.

获取到了页面的pid后, 我们就可以根据pid对每个页面进行请求, 请求的url格式与上面类似, 只不过把`pg=`后面的`PP1`更改为相应的pid, 如

`http://books.google.ru/books?id=_wZpJ5XxMtkC&lpg=PP1&pg=PA100&sig=&jscmd=click3`

这次仍然会得到一个`f.txt`文件, 格式与前面的类似, 但是包含了请求页面的pid, src.
src中最重要的是包含了查看页面所需要的签名sig, 有了它你才可能看到页面, 而且这些签名的有效期不是很长,
过段时间就会失效, 这意味着你要尽快使用它来获取页面的图片. 获取的url格式如下

`http://books.google.ru/books?id=_wZpJ5XxMtkC&pg=PR4&img=1&zoom=3&sig=ACfU3U2wpNYf2JyGSla5VM93t2UqBJDiZQ&w=800&gbd=1`

`w=`后面跟着的是页面的宽度.

如果你对每个页面都获得了签名, 那你就可以看到整本书了.
可惜的是有些书Google很可能没有把所有的页面都放到网上, 即便你试了他所有的服务器也不可能得到相应的页面.
如果你拿程序把Google各国的服务器都扫描一遍, 更有可能的是Google探测到你在自动发送请求, 把你的IP给封了, 让你无法连接到Google Book

![](https://jerkwin.github.io/pic/GoogleBook.png)

当然, 避免的方法不是没有, 你可以换IP, 可以使用代理, 使用VPN, 只要骗过Google就可以了.

如果将上面的作法自动化一下就可以轻松地下载到所需要的图书了. 有些软件就是这么做的, 可是也不能保证一定成功.

__网络资源__

- [如何用Chrome从Google books下载图书](http://blog.sina.com.cn/s/blog_735d32720101ci6k.html)
- [下载和破解google book限制的方法](http://www.oxbridgechina.org/xbbs/forum.php?mod=viewthread&tid=16932)
- [如何下载Google book中的文章-破解Google book方法的探讨](http://www.shudian001.com/bbs/thread-660-1-1.html)
- [Google Book Search破解方法](http://www.cqumzh.cn/uchome/space.php?uid=43046&do=blog&id=123311)
- [研究成功！快速下载google books的方法！](http://blog.sina.com.cn/s/blog_4950f6a00100awap.html)
