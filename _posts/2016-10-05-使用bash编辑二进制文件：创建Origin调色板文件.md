---
 layout: post
 title: 使用bash编辑二进制文件：创建Origin调色板文件
 categories:
 - 科
 tags:
 - origin
 - bash
---

- 2016-10-05 20:08:43

我一直在使用自己[汉化的Origin 7.5版](http://jerkwin.github.io/2015/02/22/Origin7.5SR7%E4%B8%AD%E6%96%87%E7%89%88/), 因为程序小, 界面比较简洁. 功能虽然少一些, 但绝大多数时候都够用了, 所以也就没有升级. 最近遇到一个作图需求, 要在一张图上画出很多条线, 并对每条线使用特定的颜色来代表其对应的时间值. 7.5版本的Origin支持使用调色板来定义线条的颜色, 但软件自带的那些调色板文件不一定能满足需求, 所以如果要自己定义调色板, 就必须能创建自己的调色板文件.

Origin的调色板文件放于`Origin安装路径/Palettes`中, 扩展名为`PAL`, 是一种二进制格式的文件, 所以你如果使用文本编辑器直接打开的话, 看到的是一堆乱码. 关于PAL文件格式的说明, 有份资料 [Palette file](http://worms2d.info/Palette_file) 很详细, 还附有c#的示例代码. 网上还有一份matlab的转换代码 [cmap2pal - Convert matlab colormap to binary .pal format](http://www.mathworks.com/matlabcentral/fileexchange/43114-cmap2pal-convert-matlab-colormap-to-binary-pal-format), 也可参考.

用c, perl, python之类的语言来处理二进制文件还是比较容易处理的, 但我觉得它们还是太重了, 就想试着用bash脚本来处理下. 查了一下资料, bash脚本确实可以处理二进制文件, 方法是基于文件的十六进制文本.

Linux下处理二进制文件的工具主要有三个, `hexdump`, `od`和`xxd`, 前两个只能用于将二进制文件转化为十六进制文本进行查看, 而`xxd`即可用于查看, 也可用于将十六进制文本反向转换为二进制文件. 因此大多数时候只要使用`xxd`就能满足需要了. 还有一点需要注意的就是, `hexdump`和`xxd`显示二进制时, 大小端的顺序不同. 有人提到`xxd`显示时可以通过`-e`选项控制大小端的顺序, 但根据测试, 至少我安装的版本是不支持的, 可能只有打了补丁的才可以. 因此, 将十六进制文本转换为二进制文件时, 要注意字节的大小端顺序. 此外, `dd`可用于二进制文件的大小端反转, 有时也是一个解决方法.

下面是一个例子, 将matlab默认的调色板parula文件转换为origin的PAL文件.

parula调色板的定义如下

<table class="highlighttable"><th colspan="2" style="text-align:left">parula.dat</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #666666">0</span> <span style="color: #666666">0.2081</span> <span style="color: #666666">0.1663</span> <span style="color: #666666">0.5292</span>
<span style="color: #666666">1</span> <span style="color: #666666">0.2116</span> <span style="color: #666666">0.1898</span> <span style="color: #666666">0.5777</span>
<span style="color: #666666">2</span> <span style="color: #666666">0.2123</span> <span style="color: #666666">0.2138</span> <span style="color: #666666">0.6270</span>
<span style="color: #666666">3</span> <span style="color: #666666">0.2081</span> <span style="color: #666666">0.2386</span> <span style="color: #666666">0.6771</span>
<span style="color: #666666">4</span> <span style="color: #666666">0.1959</span> <span style="color: #666666">0.2645</span> <span style="color: #666666">0.7279</span>
<span style="color: #666666">5</span> <span style="color: #666666">0.1707</span> <span style="color: #666666">0.2919</span> <span style="color: #666666">0.7792</span>
<span style="color: #666666">6</span> <span style="color: #666666">0.1253</span> <span style="color: #666666">0.3242</span> <span style="color: #666666">0.8303</span>
<span style="color: #666666">7</span> <span style="color: #666666">0.0591</span> <span style="color: #666666">0.3598</span> <span style="color: #666666">0.8683</span>
<span style="color: #666666">8</span> <span style="color: #666666">0.0117</span> <span style="color: #666666">0.3875</span> <span style="color: #666666">0.8820</span>
<span style="color: #666666">9</span> <span style="color: #666666">0.0060</span> <span style="color: #666666">0.4086</span> <span style="color: #666666">0.8828</span>
<span style="color: #666666">10</span> <span style="color: #666666">0.0165</span> <span style="color: #666666">0.4266</span> <span style="color: #666666">0.8786</span>
<span style="color: #666666">11</span> <span style="color: #666666">0.0329</span> <span style="color: #666666">0.4430</span> <span style="color: #666666">0.8720</span>
<span style="color: #666666">12</span> <span style="color: #666666">0.0498</span> <span style="color: #666666">0.4586</span> <span style="color: #666666">0.8641</span>
<span style="color: #666666">13</span> <span style="color: #666666">0.0629</span> <span style="color: #666666">0.4737</span> <span style="color: #666666">0.8554</span>
<span style="color: #666666">14</span> <span style="color: #666666">0.0723</span> <span style="color: #666666">0.4887</span> <span style="color: #666666">0.8467</span>
<span style="color: #666666">15</span> <span style="color: #666666">0.0779</span> <span style="color: #666666">0.5040</span> <span style="color: #666666">0.8384</span>
<span style="color: #666666">16</span> <span style="color: #666666">0.0793</span> <span style="color: #666666">0.5200</span> <span style="color: #666666">0.8312</span>
<span style="color: #666666">17</span> <span style="color: #666666">0.0749</span> <span style="color: #666666">0.5375</span> <span style="color: #666666">0.8263</span>
<span style="color: #666666">18</span> <span style="color: #666666">0.0641</span> <span style="color: #666666">0.5570</span> <span style="color: #666666">0.8240</span>
<span style="color: #666666">19</span> <span style="color: #666666">0.0488</span> <span style="color: #666666">0.5772</span> <span style="color: #666666">0.8228</span>
<span style="color: #666666">20</span> <span style="color: #666666">0.0343</span> <span style="color: #666666">0.5966</span> <span style="color: #666666">0.8199</span>
<span style="color: #666666">21</span> <span style="color: #666666">0.0265</span> <span style="color: #666666">0.6137</span> <span style="color: #666666">0.8135</span>
<span style="color: #666666">22</span> <span style="color: #666666">0.0239</span> <span style="color: #666666">0.6287</span> <span style="color: #666666">0.8038</span>
<span style="color: #666666">23</span> <span style="color: #666666">0.0231</span> <span style="color: #666666">0.6418</span> <span style="color: #666666">0.7913</span>
<span style="color: #666666">24</span> <span style="color: #666666">0.0228</span> <span style="color: #666666">0.6535</span> <span style="color: #666666">0.7768</span>
<span style="color: #666666">25</span> <span style="color: #666666">0.0267</span> <span style="color: #666666">0.6642</span> <span style="color: #666666">0.7607</span>
<span style="color: #666666">26</span> <span style="color: #666666">0.0384</span> <span style="color: #666666">0.6743</span> <span style="color: #666666">0.7436</span>
<span style="color: #666666">27</span> <span style="color: #666666">0.0590</span> <span style="color: #666666">0.6838</span> <span style="color: #666666">0.7254</span>
<span style="color: #666666">28</span> <span style="color: #666666">0.0843</span> <span style="color: #666666">0.6928</span> <span style="color: #666666">0.7062</span>
<span style="color: #666666">29</span> <span style="color: #666666">0.1133</span> <span style="color: #666666">0.7015</span> <span style="color: #666666">0.6859</span>
<span style="color: #666666">30</span> <span style="color: #666666">0.1453</span> <span style="color: #666666">0.7098</span> <span style="color: #666666">0.6646</span>
<span style="color: #666666">31</span> <span style="color: #666666">0.1801</span> <span style="color: #666666">0.7177</span> <span style="color: #666666">0.6424</span>
<span style="color: #666666">32</span> <span style="color: #666666">0.2178</span> <span style="color: #666666">0.7250</span> <span style="color: #666666">0.6193</span>
<span style="color: #666666">33</span> <span style="color: #666666">0.2586</span> <span style="color: #666666">0.7317</span> <span style="color: #666666">0.5954</span>
<span style="color: #666666">34</span> <span style="color: #666666">0.3022</span> <span style="color: #666666">0.7376</span> <span style="color: #666666">0.5712</span>
<span style="color: #666666">35</span> <span style="color: #666666">0.3482</span> <span style="color: #666666">0.7424</span> <span style="color: #666666">0.5473</span>
<span style="color: #666666">36</span> <span style="color: #666666">0.3953</span> <span style="color: #666666">0.7459</span> <span style="color: #666666">0.5244</span>
<span style="color: #666666">37</span> <span style="color: #666666">0.4420</span> <span style="color: #666666">0.7481</span> <span style="color: #666666">0.5033</span>
<span style="color: #666666">38</span> <span style="color: #666666">0.4871</span> <span style="color: #666666">0.7491</span> <span style="color: #666666">0.4840</span>
<span style="color: #666666">39</span> <span style="color: #666666">0.5300</span> <span style="color: #666666">0.7491</span> <span style="color: #666666">0.4661</span>
<span style="color: #666666">40</span> <span style="color: #666666">0.5709</span> <span style="color: #666666">0.7485</span> <span style="color: #666666">0.4494</span>
<span style="color: #666666">41</span> <span style="color: #666666">0.6099</span> <span style="color: #666666">0.7473</span> <span style="color: #666666">0.4337</span>
<span style="color: #666666">42</span> <span style="color: #666666">0.6473</span> <span style="color: #666666">0.7456</span> <span style="color: #666666">0.4188</span>
<span style="color: #666666">43</span> <span style="color: #666666">0.6834</span> <span style="color: #666666">0.7435</span> <span style="color: #666666">0.4044</span>
<span style="color: #666666">44</span> <span style="color: #666666">0.7184</span> <span style="color: #666666">0.7411</span> <span style="color: #666666">0.3905</span>
<span style="color: #666666">45</span> <span style="color: #666666">0.7525</span> <span style="color: #666666">0.7384</span> <span style="color: #666666">0.3768</span>
<span style="color: #666666">46</span> <span style="color: #666666">0.7858</span> <span style="color: #666666">0.7356</span> <span style="color: #666666">0.3633</span>
<span style="color: #666666">47</span> <span style="color: #666666">0.8185</span> <span style="color: #666666">0.7327</span> <span style="color: #666666">0.3498</span>
<span style="color: #666666">48</span> <span style="color: #666666">0.8507</span> <span style="color: #666666">0.7299</span> <span style="color: #666666">0.3360</span>
<span style="color: #666666">49</span> <span style="color: #666666">0.8824</span> <span style="color: #666666">0.7274</span> <span style="color: #666666">0.3217</span>
<span style="color: #666666">50</span> <span style="color: #666666">0.9139</span> <span style="color: #666666">0.7258</span> <span style="color: #666666">0.3063</span>
<span style="color: #666666">51</span> <span style="color: #666666">0.9450</span> <span style="color: #666666">0.7261</span> <span style="color: #666666">0.2886</span>
<span style="color: #666666">52</span> <span style="color: #666666">0.9739</span> <span style="color: #666666">0.7314</span> <span style="color: #666666">0.2666</span>
<span style="color: #666666">53</span> <span style="color: #666666">0.9938</span> <span style="color: #666666">0.7455</span> <span style="color: #666666">0.2403</span>
<span style="color: #666666">54</span> <span style="color: #666666">0.9990</span> <span style="color: #666666">0.7653</span> <span style="color: #666666">0.2164</span>
<span style="color: #666666">55</span> <span style="color: #666666">0.9955</span> <span style="color: #666666">0.7861</span> <span style="color: #666666">0.1967</span>
<span style="color: #666666">56</span> <span style="color: #666666">0.9880</span> <span style="color: #666666">0.8066</span> <span style="color: #666666">0.1794</span>
<span style="color: #666666">57</span> <span style="color: #666666">0.9789</span> <span style="color: #666666">0.8271</span> <span style="color: #666666">0.1633</span>
<span style="color: #666666">58</span> <span style="color: #666666">0.9697</span> <span style="color: #666666">0.8481</span> <span style="color: #666666">0.1475</span>
<span style="color: #666666">59</span> <span style="color: #666666">0.9626</span> <span style="color: #666666">0.8705</span> <span style="color: #666666">0.1309</span>
<span style="color: #666666">60</span> <span style="color: #666666">0.9589</span> <span style="color: #666666">0.8949</span> <span style="color: #666666">0.1132</span>
<span style="color: #666666">61</span> <span style="color: #666666">0.9598</span> <span style="color: #666666">0.9218</span> <span style="color: #666666">0.0948</span>
<span style="color: #666666">62</span> <span style="color: #666666">0.9661</span> <span style="color: #666666">0.9514</span> <span style="color: #666666">0.0755</span>
<span style="color: #666666">63</span> <span style="color: #666666">0.9763</span> <span style="color: #666666">0.9831</span> <span style="color: #666666">0.0538</span>
</pre></div>
</td></tr></table>

转换脚本

<table class="highlighttable"><th colspan="2" style="text-align:left">binPal.bsh</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">usage<span style="color: #666666">=</span><span style="color: #BB4444">&quot;\</span>
<span style="color: #BB4444">&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;    binPal      &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
<span style="color: #BB4444">&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;    Jicun LI    &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
<span style="color: #BB4444">&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;     2016-10-04 10:17:36     &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
<span style="color: #BB4444">&gt;&gt;   Usage: binPal &lt;File&gt;&quot;</span>

[[ <span style="color: #666666">$</span><span style="color: #008800; font-style: italic"># -lt 1 ]] &amp;&amp; { echo &quot;$usage&quot;; exit; }</span>

File<span style="color: #666666">=$1</span>

<span style="color: #008800; font-style: italic"># 获知数据行数</span>
Nrgb<span style="color: #666666">=$</span>(awk <span style="color: #BB4444">&#39;</span><span style="color: #AA22FF">NF</span><span style="color: #666666">&gt;1</span>{N<span style="color: #666666">++</span>} <span style="color: #AA22FF">END</span>{<span style="color: #AA22FF; font-weight: bold">print</span> N}<span style="color: #BB4444">&#39;</span> <span style="color: #666666">$</span>File)

awk <span style="color: #666666">-</span>v Nrgb<span style="color: #666666">=$</span>Nrgb <span style="color: #BB4444">&#39;</span> <span style="color: #AA22FF">BEGIN</span> {
	<span style="color: #008800; font-style: italic"># 计算文件长度, 数据长度</span>
	Nlen<span style="color: #666666">=4</span> <span style="color: #666666">+</span> <span style="color: #666666">4</span> <span style="color: #666666">+</span> <span style="color: #666666">4</span> <span style="color: #666666">+</span> <span style="color: #666666">4</span> <span style="color: #666666">+</span> <span style="color: #666666">2</span> <span style="color: #666666">+</span> <span style="color: #666666">2</span> <span style="color: #666666">+</span> Nrgb <span style="color: #666666">*</span> <span style="color: #666666">4</span>
	Ndat<span style="color: #666666">=8+</span>Nrgb <span style="color: #666666">*</span> <span style="color: #666666">4</span>

	<span style="color: #008800; font-style: italic"># RIFF</span>
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, <span style="color: #BB4444">&quot;52494646&quot;</span>

	<span style="color: #008800; font-style: italic"># 文件长度, 大端小端转换</span>
	hex<span style="color: #666666">=</span><span style="color: #AA22FF; font-weight: bold">sprintf</span>(<span style="color: #BB4444">&quot;%08x&quot;</span>, Nlen)
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, <span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">7</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">5</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">3</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">1</span>,<span style="color: #666666">2</span>)

	<span style="color: #008800; font-style: italic"># PAL data</span>
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, <span style="color: #BB4444">&quot;50414C2064617461&quot;</span>

	<span style="color: #008800; font-style: italic"># 数据长度, 大端小端转换</span>
	hex<span style="color: #666666">=</span><span style="color: #AA22FF; font-weight: bold">sprintf</span>(<span style="color: #BB4444">&quot;%08x&quot;</span>, Ndat)
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, <span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">7</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">5</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">3</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">1</span>,<span style="color: #666666">2</span>)
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, <span style="color: #BB4444">&quot;0003&quot;</span>

	<span style="color: #008800; font-style: italic"># 颜色长度, 大端小端转换</span>
	hex<span style="color: #666666">=</span><span style="color: #AA22FF; font-weight: bold">sprintf</span>(<span style="color: #BB4444">&quot;%04x&quot;</span>, Nrgb)
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, <span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">3</span>,<span style="color: #666666">2</span>)<span style="color: #AA22FF; font-weight: bold">substr</span>(hex,<span style="color: #666666">1</span>,<span style="color: #666666">2</span>)
}

<span style="color: #AA22FF">NF</span><span style="color: #666666">&gt;3</span> {
	r<span style="color: #666666">=$2*255</span>
	g<span style="color: #666666">=$3*255</span>
	b<span style="color: #666666">=$4*255</span>
	<span style="color: #AA22FF; font-weight: bold">printf</span> <span style="color: #BB4444">&quot;%02x%02x%02x%02x&quot;</span>, r, g, b, <span style="color: #666666">0</span>
}
<span style="color: #BB4444">&#39;</span> <span style="color: #666666">$</span>File <span style="color: #666666">&gt;</span>_rgb.bin

xxd <span style="color: #666666">-</span>r <span style="color: #666666">-</span>p _rgb.bin <span style="color: #666666">&gt;$</span>{File<span style="color: #666666">%</span>.<span style="color: #666666">*</span>}<span style="color: #666666">~</span>bin.pal

rm <span style="color: #666666">-</span>rf _rgb.bin
</pre></div>
</td></tr></table>

执行脚本后, 将得到的`parula~bin.pal`文件复制到`Origin安装路径/Palettes`下, 作图时就可以直接使用了.

可惜的是使用Origin7.5版本在做三维填色图时是没有办法直接使用这些调色板文件的, 只有通过originC代码才可以, 因此建议使用高版本的Origin来作这种图.

### 网络资料

- [Linux下查看编辑二进制文件](https://gaomf.cn/2016/07/06/Linux%E4%B8%8B%E6%9F%A5%E7%9C%8B%E7%BC%96%E8%BE%91%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%96%87%E4%BB%B6/)
- [hexdump vs xxd format difference](http://superuser.com/questions/315120/hexdump-vs-xxd-format-difference/647255)
- [RIFF File Structure](http://www.johnloomis.org/cpe102/asgn/asgn1/riff.html)
- [How to specify custom colormap?](http://originlab.com/forum/topic.asp?TOPIC_ID=4895)
