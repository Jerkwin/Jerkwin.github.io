<div class="ds-share" data-thread-key="{{page.id}}" data-title="{{page.title}}" data-images="此处请替换为分享时显示的图片的链接地址" data-content="此处请替换为分享时显示的内容" data-url="{{ site.url }}{{ page.url | remove:'index.html' }}">
    <div class="ds-share-inline">
      <ul  class="ds-share-icons-16">
      	<li data-toggle="ds-share-icons-more"><a class="ds-more" href="javascript:void(0);">分享到：</a></li>
        <li><a class="ds-weibo" href="javascript:void(0);" data-service="weibo">微博</a></li>
        <li><a class="ds-qzone" href="javascript:void(0);" data-service="qzone">QQ空间</a></li>
        <li><a class="ds-qqt" href="javascript:void(0);" data-service="qqt">腾讯微博</a></li>
        <li><a class="ds-wechat" href="javascript:void(0);" data-service="wechat">微信</a></li>
      </ul>
      <div class="ds-share-icons-more">
      </div>
    </div>
 </div>

<section class="comment">

<div class="ds-thread" data-thread-key="{{page.id}}" data-title="{{page.title}}" data-url="{{ site.url }}{{ page.url | remove:'index.html' }}"></div>

<script>
var duoshuoQuery = {short_name:"jerkwin"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		//ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
		ds.src='/jscss/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0]
		 || document.getElementsByTagName('body')[0]).appendChild(ds);
	})();
</script>
