/*
* toc.js : �����ĵ���������table
*
*    ��ģ��ע��һ�����ĵ�������ɺ���Զ����е�����������
*    �ĺ�������ʱ���Ȳ鿴�ĵ���idΪTOC��Ԫ�أ����û���ҵ�
*    �����ĵ���ͷ������
*
*    ������������Ѱ���ĵ������е�<h1>��<h6>��ǩ�������䵱���½ڱ��⣬
*    Ȼ���Դ�Ϊ������TOCԪ���д���һ��table���ú���Ϊÿһ���½ڱ�����
*    ����Ϊÿһ��h��ǩ�����������㣬�����Ϳ���ͨ�����TOC��table���ӵ���Ӧ�½ڡ�
*    ���ɵ�ê��һTOC��Ϊǰ׺��������Ӧ�����Լ���HTML�����б���ʹ�����ǰ׺
*
*    ���ɵ�Ŀ¼��ڿ�����css���и�ʽ�����е���ھ������ʶ"TOCEntry"�����ͬʱ����<h>
*    �ļ���ӵ�ж�Ӧ�����־����<h1>��Ӧ���ʶΪ"TOCLevel1",<h2>��Ӧ���־Ϊ"TOCLevel2"��
*    ���뵽ͷ�����½ڱ�ž������־"TOCSectNum"
*
*    ������ڱ�ģ����ʹ��������ʽ��
*    #TOC { border: solid black 1px; margin: 10px; padding: 10px; }
*    .TOCEntry { font-family: sans-serif; }
*    .TOCEntry a { text-decoration: none; }
*    .TOCLevel1 { font-size: 16pt; font-weight: bold; }
*    .TOCLevel2 { font-size: 12pt; margin-left: .5in; }
*    .TOCSecNum:after { content: ": "; }
*/

function toc() {
	// Find the TOC container element.
	// If there isn't one, create one at the start of the document.
	var toc = document.getElementById("TOC");
	if (!toc) {
		toc = document.createElement("div");
		toc.id = "TOC";
		document.body.insertBefore(toc, document.body.firstChild);
	}
	// Find all section heading elements
	var headings;
	if (document.querySelectorAll) // Can we do it the easy way?
		headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
	else   // Otherwise, find the headings the hard way
		headings = findHeadings(document.body, []);
	// Recursively traverse the document body looking for headings
	function findHeadings(root, sects) {
		for(var c = root.firstChild; c != null; c = c.nextSibling) {
			if (c.nodeType !== 1) continue;
			if (c.tagName.length == 2 && c.tagName.charAt(0) == "H")
				sects.push(c);
			else
				findHeadings(c, sects);
		}
		return sects;
	}
	// Initialize an array that keeps track of section numbers.
	var sectionNumbers = [0,0,0,0,0,0];
	// Now loop through the section header elements we found.
	for(var h = 0; h < headings.length; h++) {
		var heading = headings[h];
		// Skip the section heading if it is inside the TOC container.
		if (heading.parentNode == toc) continue;
		// Figure out what level heading it is.
		var level = parseInt(heading.tagName.charAt(1));
		if (isNaN(level) || level < 1 || level > 6) continue;
		// Increment the section number for this heading level
		// and reset all lower heading level numbers to zero.
		sectionNumbers[level-1]++;
		for(var i = level; i < 6; i++) sectionNumbers[i] = 0;
		// Now combine section numbers for all heading levels
		// to produce a section number like 2.3.1.
		var sectionNumber = sectionNumbers.slice(0,level).join(".")
		// Add the section number to the section header title.
		// We place the number in a <span> to make it styleable.
		var span = document.createElement("span");
		span.className = "TOCSectNum";
		span.innerHTML = sectionNumber;
		heading.insertBefore(span, heading.firstChild);
		// Wrap the heading in a named anchor so we can link to it.
		var anchor = document.createElement("a");
		anchor.name = "TOC"+sectionNumber;
		heading.parentNode.insertBefore(anchor, heading);
		anchor.appendChild(heading);
		// Now create a link to this section.
		var link = document.createElement("a");
		link.href = "#TOC" + sectionNumber; // Link destination
		link.innerHTML = heading.innerHTML; // Link text is same as heading
		// Place the link in a div that is styleable based on the level.
		var entry = document.createElement("div");
		entry.className = "TOCEntry TOCLevel" + level;
		entry.appendChild(link);
		// And add the div to the TOC container.
		toc.appendChild(entry);
	}
}

function box() {
	var Bkg = C$("div");   Bkg.id = "Bkg";
	var Box = C$("div");   Box.id = "Box";
	var TopImg= C$("img"); TopImg = "<img id='TopImg'>";
	var TopTxt= C$("i");   TopTxt = "<i id='TopTxt'></i>";
	var Prev=C$("a");      Prev="<a id='Prev' href='javascript:Page(-1)'>&#9668;&#9668;</a>"
	var Next=C$("a");      Next="<a id='Next' href='javascript:Page(1)'>&#9658;&#9658;</a>"

	Box.innerHTML=TopTxt+Prev+TopImg+Next
	document.body.insertBefore(Bkg, document.body.firstChild);
	document.body.insertBefore(Box, document.body.firstChild);

	var Img=document.getElementsByTagName("img");
	for(var i=0; i<Img.length; i++) {
		ImgSrc[i]=Img[i].src
		ImgAlt[i]=Img[i].alt
		Img[i].addEventListener("click", function() {
			for(var j=1; j<ImgSrc.length; j++) {
				if(ImgSrc[j]==this.src) {ImgIdx=j; break;}
			}
			var top=document.body.scrollTop||document.documentElement.scrollTop
			var dsp='block'; if(this.id=="TopImg") dsp='none'
			$('TopImg').src=this.src;
			$('Bkg').style.display=dsp; $('Bkg').style.top=top+"px";
			$('Box').style.display=dsp; $('Box').style.top=top+"px";
			$('TopTxt').style.height="30px";
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

var ImgIdx=0, ImgSrc=new Array(), ImgAlt=new Array();
var  $=function(id){return document.getElementById(id)}
var C$=function(tg){return document.createElement(tg)}

window.onload=function(){ toc(); box(); flc();}
