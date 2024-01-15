---
 layout: post
 title: 轨道查看器OribitalViewer汉化版
 categories:
 - 科
 tags:
 - 数理
 - 汉化
 chem: true
---

## 2015-02-02 08:51:05

轨道查看器[Oribital Viewer](http://www.orbitals.com/orb/ov.htm)可用于查看类氢原子的各种轨道及其线性组合成的轨道.
在学习结构化学或量子化学时, 可以使用这个软件熟悉各种轨道, 并获得感性认识, 对理解抽象的原子轨道很有帮助.

轨道查看器是一个很小巧的程序, 但功能强大, 可惜的是已经好久好久没有更新了. 不过单以它目前的功能, 对大多数应用就已经足够了.
它的更多功能请查看其手册或这篇[简介](http://www.softpedia.com/get/Multimedia/Graphic/Graphic-Viewers/Orbital-Viewer.shtml).

为了方便使用, 我将轨道查看器简单地汉化了一下, 放在[这里](/prog/OrbView.zip)供需要的人下载.
更好的方法应该是将这个程序的功能完全用HTML5实现, 这样就可以完全将其变为网页版工具了,
更方便使用. 可惜我现在没有时间来实现, 希望不久以后能有时间完成这个项目.

下载的程序包解压后各文件说明如下:

- Exam- - - - - - - - - ORB文件实例
- CHANGES.TXT- - - - - -程序版本信息
- OrbitalViewer.exe- - -原英文版主程序
- OrbitalViewer.pdf- - -英文版手册
- OV.HLP- - - - - - - - 帮助手册
- OV.INI- - - - - - - - 程序配置文件
- winhlp32.exe- - - - - 如果在Window 7 系统上无法打开OV.HLP, 可以使用此程序打开
- 轨道查看器.exe- - - - 汉化版主程序

用轨道查看器创建复杂的线性组合轨道时, 由于软件界面太小十分不便, 因此我在下面提供了一个简单的创建线性组合轨道的网页版工具.
你可以在这里编辑分子构型并指定每个原子上的轨道及其组合系数, 然后将输出的ORG文件用轨道查看器打开就可以了.

下面的示例是苯分子每个碳原子上的 2pz 轨道的线性叠加, 组合系数全为1, 可以看作是苯分子的大派键.

![PhOrb](https://jerkwin.github.io/pic/PhOrb.png)

<input type="button" value="gen" onClick="genCoor()" style="width:100px; height:30px" /> <br/>

<table><tr>
<td>
	XYZ文件<br/><textarea id="xyzCoor" style="width:400px; height:500px; resize: none">
12
Ph
C   0.000000000  0.000000000  0.000000000 2 p 1 1
C   1.401399999  0.000000000  0.000000000 2 p 1 1
C   2.102100000  1.213648001  0.000000000 2 p 1 1
C   1.401400001  2.427296001  0.000000000 2 p 1 1
C   0.000000001  2.427296001  0.000000000 2 p 1 1
C  -0.700699999  1.213648001  0.000000000 2 p 1 1
H  -0.535000000 -0.926647182  0.000000000 1 s 0 0
H   1.936399997 -0.926647181  0.000000000 1 s 0 0
H   3.172099998  1.213648001  0.000000000 1 s 0 0
H   1.936400001  3.353943183  0.000000000 1 s 0 0
H  -0.534999996  3.353943182  0.000000000 1 s 0 0
H  -1.770699997  1.213648000  0.000000000 1 s 0 0
	</textarea></td>
<td>
	<figure><figurecaption>分子构型</figurecaption><br/>
	<script>
		var Mol=new ChemDoodle.TransformCanvas3D('Mol-1', 400,500);
		Mol.specs.backgroundColor='black';
		Mol.specs.set3DRepresentation('Ball and Stick');
		Mol.specs.projectionPerspective_3D = false;
		Mol.loadMolecule(ChemDoodle.readXYZ("", 1));
	</script></td>
<td>
	ORB文件<br/><textarea id="orb" style="width:400px; height:500px; resize: none">
	</textarea></td>
</tr></table>

<script>
var $=function(id){return document.getElementById(id)};
var atmID={"H":"1", "HE":"2", "LI":"3", "BE":"4", "B":"5", "C":"6", "N":"7", "O":"8", "F":"9", "NE":"10"}

function genCoor() {
	var Fmol=$("xyzCoor").value.replace(/\r/g,"").replace(/\n[ |\t]+/g,"\n").replace(/^[ |\t]+/,"").replace(/[ |\t]+$/,"")
	Mol.loadMolecule(ChemDoodle.readXYZ(Fmol, 1));

	$("orb").value="OrbitalFileV1.0"
		+ "\nDefaultPerspective 25"
		+ "\nBackgroundColor   0xFFFFFF"
		+ "\nUseQuickRender    Yes"
		+ "\nQuickRenderMode   Polygons"
		+ "\nRenderMode        Polygons"
		+ "\nFixedSize         Yes"
		+ "\nScale(m)          4.35102592844e-010"
		+ "\nPerspective       25"
		+ "\nLastWidth         1920"
		+ "\nLastHeight        923"
		+ "\nCameraCenterX(m)  2.05907183636e-011"
		+ "\nCameraCenterY(m)  3.97145233366e-011"
		+ "\nCameraCenterZ(m)  6.53032428133e-009"
		+ "\nCameraTheta(rad) -0.917808448546"
		+ "\nCameraPhi(rad)   -1.39781383294 "
		+ "\nCameraPsi(rad)    0.725522810489"
		+ "\nCameraCx          20767.5"

	var Lines=Fmol.split("\n"), Natm=Lines[0], Line
	for(var i=1; i<=Natm; i++) {
		Line=Lines[1+i].split(/\s+/)
		$("orb").value += '\nAtom { #' + i
		+ "\n  n          " + Line[4]
		+ "\n  l          " + Line[5]
		+ "\n  m          " + Line[6]
		+ "\n  Protons(Z) " + (atmID[Line[0].toUpperCase()] || Line[0])
		+ "\n  CenterX(m) " + Line[1]*1E-10
		+ "\n  CenterY(m) " + Line[2]*1E-10
		+ "\n  CenterZ(m) " + Line[3]*1E-10
		+ "\n  Factor     " + Line[7]
		+ "\n  AngleBeta(rad) " + Math.PI/2.
		+ "\n}"
	}
	$("orb").value += '\nLight {     # Light 1'
	+ '\nPositionX(m) -80'
	+ '\nPositionY(m)  80'
	+ '\nPositionZ(m)  80'
	+ '\nIntensity      1'
	+ '\nAmbience       1'
	+ '\nLocal         No'
	+ '\n}'
	+ '\nPsi^2(log10)  -3'
}
</script>

