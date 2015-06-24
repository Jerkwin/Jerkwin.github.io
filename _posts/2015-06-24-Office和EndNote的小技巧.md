---
 layout: post
 title: Office和EndNote的小技巧
 categories:
 - 科
 tags:
 - 办公
---

## 2015-06-24 09:18:00

### 如何得到Word和PowerPoint文档中插入图片的原始文件?

在Word或PowerPoint中插入的图片显示时会被压缩, 和原始文件不同. 将这种的图像复制或另存后得到的图像和原始图像相比分辨率会降低, 看起来不是很清晰.

在Office2003及以前的版本中, 我们可以将Word或PowerPoint文档另存为网页HTML文件, 这样就能在相应的目录下找到文档中插入的图片的原始文件. 但自Office2010开始, Word和PowerPoint不再提供另存为网页功能, 所以以前的简单方法不再适用. 但利用Office的VBA脚本功能我们还是可以将文档存为网页, 具体的做法请参看[PowerPoint 2010另存新档为htm或mht等网页格式](http://www.dotblogs.com.tw/chou/archive/2010/11/05/18816.aspx).

上面这种方法可以达到目的, 但是稍嫌麻烦. 新版本的Office文档, 扩展名是以`x`结尾的, 如`docx`, `pptx`, 这种文件实际是一种打包的`zip`压缩格式. 因此, 我们只要在原先的文件扩展名后面加上`.zip`或者直接将文件的扩展名改为`zip`, 就可以使用常用的解压缩程序对文件进行解压了. 对于Word的`.docx`文件, 解压后我们得到的目录结构如下:

	C:\USERS\JICUN\DOWNLOADS\WORD.DOCX
	│  [Content_Types].xml
	│
	├─docProps
	│      app.xml
	│      core.xml
	│      custom.xml
	│
	├─word
	│  │  comments.xml
	│  │  document.xml
	│  │  fontTable.xml
	│  │  numbering.xml
	│  │  settings.xml
	│  │  styles.xml
	│  │  webSettings.xml
	│  │
	│  ├─embeddings
	│  │      oleObject1.bin
	│  │      oleObject2.bin
	│  │      oleObject3.bin
	│  │
	│  ├─media
	│  │      image1.wmf
	│  │      image2.wmf
	│  │      image3.wmf
	│  │
	│  ├─theme
	│  │      theme1.xml
	│  │
	│  └─_rels
	│          document.xml.rels
	│
	└─_rels
	        .rels

可见`word`目录下保存着Word文档的内容. 除`word/embeddings`和`word/media`目录下的文件, 其他文件大部分都是`xml`格式的文本文件. 其中`word/media`目录下保存了各种多媒体文件, 如图片, 音频等. 如果你需要这些文件, 直接复制就是了.

对于PowerPoint的`pptx`文档, 解压后的目录结构与Word的十分类似, 但目录更多些, 因为要记录的内容更多, 但图片, 音频等媒体内容仍然放在`ppt/media`目录下:

	C:\USERS\JICUN\DOWNLOADS\POWERPOINTPPTX
	│  [Content_Types].xml
	│
	├─docProps
	│      app.xml
	│      core.xml
	│      thumbnail.wmf
	│
	├─ppt
	│  │  presentation.xml
	│  │  presProps.xml
	│  │  tableStyles.xml
	│  │  viewProps.xml
	│  │
	│  ├─drawings
	│  │  │  vmlDrawing1.vml
	│  │  │  vmlDrawing2.vml
	│  │  │  vmlDrawing3.vml
	│  │  │
	│  │  └─_rels
	│  │          vmlDrawing1.vml.rels
	│  │          vmlDrawing2.vml.rels
	│  │          vmlDrawing3.vml.rels
	│  │
	│  ├─embeddings
	│  │      oleObject1.bin
	│  │      oleObject2.bin
	│  │      oleObject3.bin
	│  │
	│  ├─fonts
	│  │      font1.fntdata
	│  │      font2.fntdata
	│  │      font3.fntdata
	│  │
	│  ├─handoutMasters
	│  │  │  handoutMaster1.xml
	│  │  │
	│  │  └─_rels
	│  │          handoutMaster1.xml.rels
	│  │
	│  ├─media
	│  │      image1.jpeg
	│  │      image2.tiff
	│  │      image3.gif
	│  │
	│  ├─notesMasters
	│  │  │  notesMaster1.xml
	│  │  │
	│  │  └─_rels
	│  │          notesMaster1.xml.rels
	│  │
	│  ├─notesSlides
	│  │  │  notesSlide1.xml
	│  │  │  notesSlide2.xml
	│  │  │  notesSlide3.xml
	│  │  │
	│  │  └─_rels
	│  │          notesSlide1.xml.rels
	│  │          notesSlide2.xml.rels
	│  │          notesSlide3.xml.rels
	│  │
	│  ├─slideLayouts
	│  │  │  slideLayout1.xml
	│  │  │  slideLayout2.xml
	│  │  │  slideLayout3.xml
	│  │  │
	│  │  └─_rels
	│  │          slideLayout1.xml.rels
	│  │          slideLayout2.xml.rels
	│  │          slideLayout3.xml.rels
	│  │
	│  ├─slideMasters
	│  │  │  slideMaster1.xml
	│  │  │  slideMaster2.xml
	│  │  │
	│  │  └─_rels
	│  │          slideMaster1.xml.rels
	│  │          slideMaster2.xml.rels
	│  │
	│  ├─slides
	│  │  │  slide1.xml
	│  │  │  slide2.xml
	│  │  │  slide3.xml
	│  │  │
	│  │  └─_rels
	│  │          slide1.xml.rels
	│  │          slide2.xml.rels
	│  │          slide3.xml.rels
	│  │
	│  ├─theme
	│  │  │  theme1.xml
	│  │  │  theme2.xml
	│  │  │  theme3.xml
	│  │  │
	│  │  └─_rels
	│  │          theme2.xml.rels
	│  │
	│  └─_rels
	│          presentation.xml.rels
	│
	└─_rels
	        .rels

Office这种存储方式和电子书的`epub`格式类似, `epub`实际也是打包的`zip`压缩文件, 只不过其文本是以`html`格式存储的.

### 利用Google Scholar将参考文献信息导入EndNote

在写论文的时候通常需要插入参考文献, 目前EndNote使用比较广泛. 为在Word中插入参考文献, 需要先将参考文献的相关信息导入到EndNote中, 为此, EndNote提供了几种方式: 利用内置下载器直接下载, 导入PDF文件抽取, 导入已有的enw文件, 手动输入. 我想很多人都是使用已有的enw文件导入的吧, 因为各个杂志的文章页面上一般都会提供文章的enw文件供下载, 以方便用户导入EndNote. 我以前就是这么做的, 根据DOI或期刊信息找到文献所在的下载页面, 然后再下载页面上提供的enw文件. 做起来也不是很麻烦, 但每个杂志提供enl文件的位置不同, 下载一个enw文件一般要点击好几次鼠标才能完成, 做得多了就会觉得很麻烦, 心想应该有更好的方式, 实在不行还可以自己分析一下enw文件下载地址的模式, 自己写点代码来自动下载. 有了这个需求, 就查了一下相关资料, 发现Google Scholar直接就提供了这项服务, 只是默认没有打开这项功能. 开启此功能的方法如下:

打开Google Scholar, 点击`Settings`, 选中`Bibliography manager`下面的第二个按钮, 并改为`EndNote`

![](/pic/gsch_1.png)

![](/pic/gsch_2.png)

![](/pic/gsch_3.png)

开启此项服务后搜文献时, 论文下面会多出一个`Import into EndNote`的按钮, 点击一下就可以下载enw文件, 直接导入EndNote, 这样的做法简单多了.
