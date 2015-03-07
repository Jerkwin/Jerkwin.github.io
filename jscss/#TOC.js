function box() {
	var Bkg = C$("div");   Bkg.id = "Bkg";
	var Box = C$("div");   Box.id = "Box";
	var TopImg= C$("img"); TopImg = "<img id='TopImg'>";
	var TopTxt= C$("i");   TopTxt = "<i id='TopTxt'></i>";
	var Prev=C$("a");      Prev="<a id='Prev' href='javascript:Page(-1)'>&#9668;&#9668;</a>"
	var Next=C$("a");      Next="<a id='Next' href='javascript:Page(1)'>&#9658;&#9658;</a>"
	
	var winHeight=0;
	if(window.innerHeight) winHeight=window.innerHeight;
	else if((document.body)&&(document.body.clientHeight)) winHeight=document.body.clientHeight;

	Box.innerHTML=TopTxt+Prev+TopImg+Next
	document.body.insertBefore(Bkg, document.body.firstChild);
	document.body.insertBefore(Box, document.body.firstChild);

	var Img=document.getElementsByTagName("img");
	for(var i=0; i<Img.length; i++) {
		ImgSrc[i]=Img[i].src
		ImgAlt[i]=Img[i].alt
		Img[i].addEventListener("click", function() {
			ImgIdx=1; while(ImgSrc[ImgIdx]!=this.src && ImgIdx<ImgSrc.length) ImgIdx++

			var top=document.body.scrollTop||document.documentElement.scrollTop
			var dsp='block'; if(this.id=="TopImg") dsp='none'
			$('TopImg').src=this.src;
			$('TopImg').style.maxHeight=winHeight-90+"px";
			$('Bkg').style.display=dsp; $('Bkg').style.top=top+"px";
			$('Box').style.display=dsp; $('Box').style.top=top+"px";
			Page(0)
			//alert(ImgIdx)
		},false);
	}
}

function Page(i) {
	var Nfig=ImgSrc.length-1
	ImgIdx += i
	if(ImgIdx<1) ImgIdx=Nfig
	if(ImgIdx>Nfig) ImgIdx=1
	$('TopImg').src=ImgSrc[ImgIdx];
	$('TopTxt').innerHTML=ImgAlt[ImgIdx]
	$('Prev').innerHTML=ImgIdx+"/"+Nfig+"&#9668;&#9668;"
	$('Next').innerHTML="&#9658;&#9658;"+ImgIdx+"/"+Nfig
}

function flc() {
	var flcs=document.getElementsByName("flc")
	for(var i=0; i<=flcs.length; i++) {
		flowchart.parse(flcs[i].value).drawSVG("fig-"+flcs[i].id, {
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

var  $=function(id){return document.getElementById(id)}
var C$=function(tag){return document.createElement(tag)}
var ImgIdx=0, ImgSrc=new Array(), ImgAlt=new Array();

window.onload = function() { box(); flc() }