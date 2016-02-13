function box() {
	var Box = C$("div");
	Box.id = "Box";
	Box.innerHTML="<span id='TopSpan'></span><img id='TopImg'><br><span id='TopTxt'><br></span><span id='TopIdx'></span>";
	document.body.insertBefore(Box, document.body.firstChild);

	var image, Img=document.getElementsByTagName("img");
	for(var i=0; i<Img.length; i++) {
		ImgSrc[i]=Img[i].src
		ImgAlt[i]=Img[i].alt
		image = new Image();
		image.src = Img[i].src;
		ImgWH[i]=image.width/image.height;
		Img[i].addEventListener("click", function() {
			ImgIdx=1; while(ImgSrc[ImgIdx]!=this.src && ImgIdx<ImgSrc.length) ImgIdx++
			var top=document.body.scrollTop||document.documentElement.scrollTop
			var dsp='block'; if(this.id=="TopImg") dsp='none'
			$('TopImg').src=this.src;
			$('Box').style.display=dsp; $('Box').style.top=top+"px";
			Page(0)
		},false);
	}
}

function Page(i) {
	winWidth =window.innerWidth  || document.body.clientWidth
	winHeight=window.innerHeight || document.body.clientHeight
	winWH=winWidth/(winHeight-64)
	var Nfig=ImgSrc.length-1
	ImgIdx += i
	if(ImgIdx<1) ImgIdx=Nfig; else if(ImgIdx>Nfig) ImgIdx=1
	$('TopImg').src=ImgSrc[ImgIdx];
	if(winWH>=ImgWH[ImgIdx]) $('TopImg').style.maxHeight=winHeight-64+"px";
	else $('TopImg').style.maxWidth='99%';

	$('TopTxt').innerHTML=ImgAlt[ImgIdx]
	$('TopIdx').innerHTML="<a id='Prev' href='javascript:Page(-1)'>&#9668;&nbsp;</a>"+ImgIdx+"/"+Nfig+"<a id='Next' href='javascript:Page(1)'>&nbsp;&#9658;</a>"
}

function flcviz() {
	var figs=document.getElementsByName("viz")
	for(var i=0; i<figs.length; i++) {
		$("fig-"+figs[i].id).innerHTML = Viz(figs[i].value, "svg")+$("fig-"+figs[i].id).innerHTML;
	}

	figs=document.getElementsByName("flc")
	for(i=0; i<figs.length; i++) {
		flowchart.parse(figs[i].value).drawSVG("fig-"+figs[i].id, {
			'x':30, 'y':50,
			'line-width':3, 'line-length':50, 'text-margin':10,
			'font-size':14, 'font':'normal', 'font-family':'Helvetica', 'font-weight':'normal',
			'font-color':'black', 'line-color':'black', 'element-color':'black', 'fill':'white',
			'yes-text':'yes', 'no-text':'no', 'arrow-end':'block',
			'symbols':{
				'start':{ 'font-color':'red', 'element-color':'green', 'fill':'yellow' },
				'end':{ 'class':'end-element' }
			},
			'flowstate' :{
				'past':{ 'fill':'#CCCCCC', 'font-size':12},
				'current':{ 'fill':'yellow', 'font-color':'red', 'font-weight':'bold'},
				'future':{ 'fill':'#FFFF99'},
				'request':{ 'fill':'blue'},
				'invalid':{'fill':'#444444'},
				'approved':{ 'fill':'#58C4A3', 'font-size':12, 'yes-text':'APPROVED', 'no-text':'n/a' },
				'rejected':{ 'fill':'#C45879', 'font-size':12, 'yes-text':'n/a', 'no-text':'REJECTED' }
			}
		})
	}
}

function showTOC(str) {
	if(str=='☰') {
		$('tocbtn').innerHTML="✕";
		$('markdown-toc').style.display="block"
		for(var i=0; i<$wrap.length; i++)
		$wrap[i].style.margin='0 0 0 30%'
	} else {
		$('tocbtn').innerHTML='☰';
		$('markdown-toc').style.display="none"
		for(var i=0; i<$wrap.length; i++)
		$wrap[i].style.margin='0 auto'
	}
}

var  $=function(id){return document.getElementById(id)}
var C$=function(tag){return document.createElement(tag)}
var ImgIdx=0, ImgSrc=new Array(), ImgAlt=new Array(), ImgWH=new Array();
var $top=$("scrollTop"), $wrap=document.getElementsByClassName('wrap')
var i, winWH, winWidth, winHeight, tocLink=[], tocHref=[], allLink=document.getElementsByTagName('a')

window.onload=function(){ box(); flcviz();
	if($('markdown-toc')) {
		var $wrap=document.getElementsByClassName('wrap')
		for(var i=0; i<$wrap.length; i++) $wrap[i].style.margin='0 0 0 30%'
		$('markdown-toc').style.display="block"
	}
	for(i=0; i<allLink.length; i++) {
		if(allLink[i].id.match('markdown-toc')) {
			tocLink.push(allLink[i])
			tocHref.push($(allLink[i].id.replace('markdown-toc-','')))
		}
	}
}

window.onscroll = function() {
	var $top=$("scrollTop"), $wrap=document.getElementsByClassName('wrap')
	var docTop=document.documentElement.scrollTop||document.body.scrollTop
	docTop>0 ? $top.style.display="block" : $top.style.display="none"

	if(tocLink.length) {
		for(i=0; i<tocLink.length; i++) tocLink[i].style.background=""
		i=0; while(i<tocHref.length-1 && docTop>tocHref[i].offsetTop) i++
		tocLink[i].style.background="#aaa"
		$('markdown-toc').scrollTop=tocLink[i].offsetTop-$('markdown-toc').clientHeight/3
	}
}
