---
 layout: post
 title: 使用GitHub的issue存储数据
 categories:
 - 科
 tags:
 - js
---

- 2016-06-02 10:06:38

这几天想给自己的博客页面增加一个随机名言的功能, 效果就像你打开时看到的这样. 把需要的名言直接写在js代码当中, 随机抽取显示很容易实现. 但我不希望这样, 因为如果有很多名言的话, js代码就会变得很大, 拖慢了加载速度. 所以就想着使用ajax来访问一个页面,这个页面在每次访问时会随机返回一句名言. 这样每次只需要传递一句话就可以了.

想法是这样, 做起来才发现简单的使用html+js传递的方法并不能减少加载的文件大小, 比起直接写在js脚本中效果还差. 我继续寻找GitHub能支持的方法. 查找资料的过程中, 才发现程序猿们还真会玩. 他们以前都是使用GitHub的pages做博客, 很有极客范. 可现在阿猫阿狗都会玩这一套了, 猿猿们还继续玩这个就有点掉价, 不能展现他们的优越性了, 所以他们开始折腾使用GitHub的issue来做博客. 具体做法是通过调用GitHub的API来获取issue的内容, 然后展示出来. 我大致研究了下, 这样做倒很简单, 不好的地方在于速度慢, 而且GitHub对API使用次数的限制较大. 虽然我不喜欢用issue来做博客, 但用它来做我的名言数据库却很合适, 一个issue一条名言, 在主页中使用ajax结合GitHub的API获取, 很方便. 唯一的缺陷还是未授权的API每个IP每小时只能使用60次, 因此如果你狂刷页面, 刷够了60次, 就会看到显示的名言不再变化了. 当然, 如果使用token的话, 是可以提高到5000次的. 不过, 鉴于目前我的博客访问次数较少, 就不继续折腾下去了.

如果你想了解GitHub issue做博客的更多信息, 就看看下面的资料吧

- [使用 github 的 issues 作为博客设置单独界面](https://github.com/hanxi/issues-blog)
- [基于 Github issues 的单页面静态博客](https://github.com/wuhaoworld/github-issues-blog)
- [利用 github pages 与 github api 搭建博客](https://github.com/eyasliu/blog/issues/2)
- [给 github issues 的个人博客定制主题](http://www.hanxi.info/?p=6&t=1458518400034)

使用脚本发送issue的资料

- [easy-github-notes](https://github.com/wangwangwar/easy-github-notes/blob/master/main.py)
- [Github-Auto-Issue-Creator](https://github.com/Ricky54326/Github-Auto-Issue-Creator/blob/master/github.py)
- [github-cli](https://github.com/jsmits/github-cli)
- [Github issue使用脚本](http://qiita.com/KENJU/items/1f02720f1f64c657cc44)
