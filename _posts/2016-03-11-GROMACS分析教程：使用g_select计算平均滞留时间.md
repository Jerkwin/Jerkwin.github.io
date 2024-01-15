---
 layout: post
 title: GROMACS分析教程：使用g_select计算平均滞留时间
 categories:
 - 科
 tags:
 - gmx
 chem: true
---

- 2016-03-11 21:18:39 初稿
- 2016-03-22 14:28:06 补充 程刚 的方法
- 2016-03-27 22:02:21 补注

## 理论考虑

分子动力学模拟的分析是动力学的精髓部分, 要依据模拟的假设和目的去分析所得到的数据, 看是否支持自己的假设, 进而得到更多的洞察. 没有假设和目的就去盲目地做模拟, 是不可取的. 由于各人所作体系不同, 对于分析没有通用的套路, 你需要多参考文献才好.

虽然GROMACS自带了很多分析工具, 可能仍不能满足你的需要, 这时候就需要你自己写代码对轨迹进行分析了. 对此, 我的建议如下:

1. 如果可能, 请尽量使用GROMACS自带的工具完成分析过程, 必要时可以组合多个分析工具达到目的. 虽然这种做法处理时间可能稍长, 但无须写代码, 适合普通用户使用. 但这种做法需要你对GROMACS自带的工具有比较详尽的了解, 知晓各个工具的功能, 并能根据自己的目的进行恰当地组合.
2. 即便需要自己写代码分析轨迹, 仍然建议先利用GROMACS自带的工具对轨迹进行初步处理, 如利用`gmx trjconv`转换轨迹格式, 处理居中, PBC问题; 利用`gmx select`获取特定原子的索引; 利用`gmx trjconv`或`gmx traj`抽取特定索引原子的信息等. 因为无论做哪种分析, 都要牵涉到这些问题的处理, 而自己写代码实现这些功能虽然不是很可能, 但相当麻烦, 而且执行效率也没有使用GROMACS自带工具高. 这样得到需要的原子坐标后, 我们就可以把注意力集中到自己需要分析方面, 节省了时间和精力.
3. 如果为了提高处理轨迹的效率或其他原因, 你不得不自行处理轨迹, 建议你使用`xtc`格式. 这种压缩格式只包含坐标, 文件小, 当只需要分析坐标时, 使用它可大大提高效率. 但如果你同时需要坐标和速度甚至受力, 那你就只能使用`trr`格式了.
4. 具体如何使用C, Fortran或MatLab来处理`xtc`或`trr`格式的轨迹, 请参考博文.
5. 如果熟悉, VMD的tcl脚本也可用于分析轨迹, 缺点是速度慢, 且对文件大小有限制.

## 具体示例

下面我们模拟TIP3P水中的一个甲烷CH4分子, 以计算CH4第一溶剂化层中水分子的平均滞留时间为例, 来对分析过程进行具体地说明.

下载[示例文件](/prog/CH4W_sel.zip), 解压后得4个文件, `conf.gro`, `grompp.mdp`, `index.ndx`, `topol.top`. 值得注意的是, `index.ndx`文件使用`gmx make_ndx`添加了每种原子的索引号, 这是为了便于后面的分析.

体系中包含一个CH4分子(OPLS-AA力场)和241个TIP3P水分子

<figure><script>var Mol1=new ChemDoodle.TransformCanvas3D('Mol-1',650,400);Mol1.specs.shapes_color = '#fff';Mol1.specs.backgroundColor = 'black';Mol1.specs.projectionPerspective_3D = false;Mol1.specs.set3DRepresentation('Ball and Stick');//Mol1.specs.atoms_resolution_3D = 15;
//Mol1.specs.bonds_resolution_3D = 15;
Mol1.handle = null;Mol1.timeout = 15;Mol1.specs.crystals_unitCellLineWidth = 1.5;Mol1.startAnimation = ChemDoodle._AnimatorCanvas.prototype.startAnimation;Mol1.stopAnimation = ChemDoodle._AnimatorCanvas.prototype.stopAnimation;Mol1.isRunning = ChemDoodle._AnimatorCanvas.prototype.isRunning;Mol1.dblclick = ChemDoodle.RotatorCanvas.prototype.dblclick;Mol1.nextFrame = function(delta){var matrix = [];ChemDoodle.lib.mat4.identity(matrix);var change = delta*Math.PI/15000;ChemDoodle.lib.mat4.rotate(matrix,change,[1,0,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,1,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,0,1]);ChemDoodle.lib.mat4.multiply(this.rotationMatrix, matrix)};var Fmol='data_Methane_in_water\n 728\n_symmetry_space_group_name_\' \'\n_cell_length_a 19.5079\n_cell_length_b 19.5079\n_cell_length_c 19.5079\n_cell_angle_alpha 90\n_cell_angle_beta 90\n_cell_angle_gamma 90\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n 1CH4 C 0.394 0.325 0.297\n 1CH4 H 0.408 0.358 0.249\n 1CH4 H 0.414 0.339 0.346\n 1CH4 H 0.335 0.327 0.301\n 1CH4 H 0.409 0.272 0.285\n 2SOL O 0.355 0.145 0.578\n 2SOL H 0.318 0.138 0.547\n 2SOL H 0.394 0.153 0.549\n 3SOL O 0.169 0.315 0.809\n 3SOL H 0.120 0.316 0.801\n 3SOL H 0.173 0.295 0.854\n 4SOL O 0.573 0.410 0.138\n 4SOL H 0.572 0.374 0.172\n 4SOL H 0.617 0.431 0.146\n 5SOL O 0.388 0.471 1.005\n 5SOL H 0.374 0.424 1.010\n 5SOL H 0.380 0.480 0.958\n 6SOL O 0.263 0.664 0.926\n 6SOL H 0.221 0.639 0.928\n 6SOL H 0.295 0.639 0.953\n 7SOL O 0.245 0.006 0.652\n 7SOL H 0.254 0.051 0.636\n 7SOL H 0.281 -0.003 0.684\n 8SOL O 0.800 0.988 -0.007\n 8SOL H 0.798 0.940 0.006\n 8SOL H 0.839 1.005 0.018\n 9SOL O 0.096 0.444 0.670\n 9SOL H 0.049 0.442 0.683\n 9SOL H 0.117 0.472 0.705\n 10SOL O 0.835 0.889 0.339\n 10SOL H 0.831 0.892 0.291\n 10SOL H 0.788 0.893 0.355\n 11SOL O 0.159 0.552 0.943\n 11SOL H 0.111 0.562 0.936\n 11SOL H 0.169 0.518 0.909\n 12SOL O 0.499 0.578 0.478\n 12SOL H 0.537 0.609 0.477\n 12SOL H 0.483 0.576 0.432\n 13SOL O 0.550 0.876 0.631\n 13SOL H 0.518 0.846 0.610\n 13SOL H 0.586 0.846 0.647\n 14SOL O 0.908 0.342 0.867\n 14SOL H 0.891 0.330 0.912\n 14SOL H 0.869 0.340 0.838\n 15SOL O 0.475 0.302 0.100\n 15SOL H 0.486 0.348 0.114\n 15SOL H 0.498 0.274 0.132\n 16SOL O 0.219 0.445 0.855\n 16SOL H 0.196 0.403 0.843\n 16SOL H 0.265 0.432 0.865\n 17SOL O 0.865 0.108 0.687\n 17SOL H 0.855 0.102 0.640\n 17SOL H 0.889 0.151 0.690\n 18SOL O 0.355 0.332 0.044\n 18SOL H 0.396 0.320 0.069\n 18SOL H 0.361 0.311 -0.001\n 19SOL O 0.943 0.933 0.415\n 19SOL H 0.941 0.982 0.408\n 19SOL H 0.907 0.916 0.388\n 20SOL O 0.300 0.974 0.160\n 20SOL H 0.285 1.010 0.129\n 20SOL H 0.264 0.971 0.193\n 21SOL O 0.981 0.746 0.515\n 21SOL H 1.006 0.781 0.540\n 21SOL H 0.980 0.764 0.469\n 22SOL O 0.188 0.689 0.208\n 22SOL H 0.208 0.690 0.252\n 22SOL H 0.174 0.642 0.202\n 23SOL O 0.219 0.047 0.078\n 23SOL H 0.227 0.047 0.029\n 23SOL H 0.241 0.088 0.093\n 24SOL O 0.943 0.069 0.374\n 24SOL H 0.983 0.089 0.352\n 24SOL H 0.906 0.082 0.345\n 25SOL O 0.845 0.756 0.396\n 25SOL H 0.841 0.804 0.408\n 25SOL H 0.892 0.750 0.388\n 26SOL O 0.184 0.397 0.446\n 26SOL H 0.161 0.376 0.484\n 26SOL H 0.189 0.444 0.461\n 27SOL O 0.576 0.951 0.277\n 27SOL H 0.536 0.956 0.249\n 27SOL H 0.598 0.911 0.261\n 28SOL O 0.705 0.058 0.094\n 28SOL H 0.704 0.022 0.127\n 28SOL H 0.737 0.043 0.060\n 29SOL O 0.505 0.751 0.434\n 29SOL H 0.506 0.777 0.476\n 29SOL H 0.535 0.713 0.442\n 30SOL O 0.449 0.211 0.763\n 30SOL H 0.479 0.249 0.768\n 30SOL H 0.448 0.189 0.807\n 31SOL O 0.893 0.541 0.097\n 31SOL H 0.923 0.505 0.113\n 31SOL H 0.890 0.573 0.134\n 32SOL O 0.848 0.088 0.887\n 32SOL H 0.881 0.060 0.864\n 32SOL H 0.814 0.056 0.902\n 33SOL O 0.328 0.853 0.259\n 33SOL H 0.285 0.870 0.275\n 33SOL H 0.319 0.806 0.248\n 34SOL O 0.275 0.520 0.638\n 34SOL H 0.292 0.565 0.645\n 34SOL H 0.237 0.516 0.669\n 35SOL O 0.029 0.582 0.896\n 35SOL H 0.007 0.620 0.918\n 35SOL H 0.018 0.543 0.923\n 36SOL O 0.192 0.524 0.740\n 36SOL H 0.212 0.504 0.780\n 36SOL H 0.189 0.572 0.750\n 37SOL O 0.506 0.450 0.520\n 37SOL H 0.504 0.498 0.514\n 37SOL H 0.469 0.439 0.549\n 38SOL O 0.254 0.034 0.471\n 38SOL H 0.210 0.012 0.473\n 38SOL H 0.260 0.043 0.423\n 39SOL O 0.502 0.737 0.724\n 39SOL H 0.542 0.758 0.744\n 39SOL H 0.518 0.693 0.709\n 40SOL O 0.334 0.843 0.543\n 40SOL H 0.338 0.853 0.495\n 40SOL H 0.322 0.886 0.564\n 41SOL O 0.756 0.536 0.032\n 41SOL H 0.799 0.536 0.054\n 41SOL H 0.742 0.583 0.032\n 42SOL O 0.953 0.296 0.064\n 42SOL H 0.946 0.259 0.033\n 42SOL H 0.981 0.328 0.039\n 43SOL O 0.624 0.746 0.012\n 43SOL H 0.638 0.743 0.059\n 43SOL H 0.621 0.700 -0.003\n 44SOL O 0.568 0.251 0.581\n 44SOL H 0.613 0.234 0.571\n 44SOL H 0.562 0.243 0.629\n 45SOL O 0.985 0.484 0.976\n 45SOL H 0.942 0.478 1.000\n 45SOL H 1.015 0.451 0.996\n 46SOL O 0.819 0.889 0.197\n 46SOL H 0.835 0.850 0.172\n 46SOL H 0.779 0.904 0.173\n 47SOL O 0.708 0.617 0.870\n 47SOL H 0.745 0.646 0.886\n 47SOL H 0.677 0.617 0.908\n 48SOL O 0.299 0.700 0.310\n 48SOL H 0.286 0.691 0.356\n 48SOL H 0.327 0.661 0.297\n 49SOL O 0.801 0.195 0.070\n 49SOL H 0.764 0.222 0.052\n 49SOL H 0.783 0.174 0.110\n 50SOL O 1.002 0.168 0.873\n 50SOL H 0.990 0.147 0.830\n 50SOL H 0.960 0.166 0.899\n 51SOL O 0.617 0.156 0.821\n 51SOL H 0.656 0.172 0.846\n 51SOL H 0.597 0.123 0.850\n 52SOL O 0.576 0.302 0.246\n 52SOL H 0.603 0.305 0.287\n 52SOL H 0.532 0.286 0.261\n 53SOL O 0.356 0.596 0.010\n 53SOL H 0.374 0.551 0.004\n 53SOL H 0.341 0.597 0.057\n 54SOL O 0.646 0.571 0.327\n 54SOL H 0.652 0.533 0.358\n 54SOL H 0.665 0.609 0.350\n 55SOL O 0.112 0.993 0.459\n 55SOL H 0.105 0.957 0.426\n 55SOL H 0.085 1.030 0.441\n 56SOL O 0.770 0.637 0.510\n 56SOL H 0.739 0.606 0.531\n 56SOL H 0.796 0.609 0.479\n 57SOL O 0.443 0.941 0.216\n 57SOL H 0.418 0.904 0.237\n 57SOL H 0.409 0.965 0.191\n 58SOL O 0.729 0.727 0.694\n 58SOL H 0.768 0.757 0.694\n 58SOL H 0.693 0.754 0.713\n 59SOL O 0.443 0.998 0.391\n 59SOL H 0.410 0.962 0.396\n 59SOL H 0.455 0.998 0.343\n 60SOL O 0.521 0.287 0.887\n 60SOL H 0.481 0.259 0.884\n 60SOL H 0.547 0.267 0.924\n 61SOL O 0.504 0.596 0.311\n 61SOL H 0.502 0.568 0.271\n 61SOL H 0.552 0.604 0.318\n 62SOL O 0.549 0.615 0.666\n 62SOL H 0.536 0.575 0.692\n 62SOL H 0.531 0.607 0.621\n 63SOL O 0.314 0.294 0.799\n 63SOL H 0.320 0.269 0.757\n 63SOL H 0.266 0.303 0.800\n 64SOL O 0.553 0.049 0.899\n 64SOL H 0.600 0.034 0.900\n 64SOL H 0.527 0.008 0.897\n 65SOL O 0.383 0.632 0.528\n 65SOL H 0.425 0.607 0.521\n 65SOL H 0.370 0.621 0.574\n 66SOL O 0.355 0.565 0.283\n 66SOL H 0.361 0.527 0.315\n 66SOL H 0.400 0.585 0.280\n 67SOL O 0.933 0.703 0.736\n 67SOL H 0.978 0.683 0.736\n 67SOL H 0.918 0.699 0.689\n 68SOL O 0.599 0.365 0.480\n 68SOL H 0.593 0.322 0.503\n 68SOL H 0.568 0.396 0.503\n 69SOL O 0.405 0.446 0.617\n 69SOL H 0.389 0.400 0.625\n 69SOL H 0.365 0.474 0.621\n 70SOL O 0.668 0.483 0.437\n 70SOL H 0.706 0.474 0.468\n 70SOL H 0.636 0.448 0.446\n 71SOL O 0.173 0.029 0.902\n 71SOL H 0.185 0.076 0.896\n 71SOL H 0.215 0.007 0.912\n 72SOL O 0.315 0.863 0.076\n 72SOL H 0.304 0.901 0.105\n 72SOL H 0.288 0.826 0.094\n 73SOL O 0.246 0.168 0.283\n 73SOL H 0.293 0.156 0.293\n 73SOL H 0.223 0.125 0.281\n 74SOL O 1.004 0.286 0.764\n 74SOL H 0.981 0.272 0.723\n 74SOL H 0.968 0.293 0.796\n 75SOL O 0.617 0.650 0.478\n 75SOL H 0.640 0.613 0.500\n 75SOL H 0.652 0.681 0.465\n 76SOL O 0.255 0.155 0.927\n 76SOL H 0.240 0.147 0.881\n 76SOL H 0.234 0.197 0.940\n 77SOL O 0.454 0.087 0.704\n 77SOL H 0.413 0.087 0.676\n 77SOL H 0.450 0.127 0.731\n 78SOL O 0.901 0.842 0.769\n 78SOL H 0.924 0.800 0.767\n 78SOL H 0.906 0.862 0.725\n 79SOL O 0.899 0.360 0.688\n 79SOL H 0.930 0.398 0.689\n 79SOL H 0.856 0.379 0.702\n 80SOL O 0.073 0.624 0.367\n 80SOL H 0.110 0.597 0.351\n 80SOL H 0.095 0.659 0.394\n 81SOL O 0.286 0.961 0.958\n 81SOL H 0.273 0.924 0.928\n 81SOL H 0.299 0.939 1.000\n 82SOL O 0.878 0.677 0.602\n 82SOL H 0.839 0.660 0.578\n 82SOL H 0.901 0.706 0.571\n 83SOL O 0.465 0.781 0.574\n 83SOL H 0.421 0.792 0.557\n 83SOL H 0.456 0.752 0.613\n 84SOL O 0.476 0.364 0.773\n 84SOL H 0.431 0.347 0.779\n 84SOL H 0.498 0.355 0.816\n 85SOL O 0.066 0.658 0.771\n 85SOL H 0.114 0.669 0.774\n 85SOL H 0.057 0.635 0.814\n 86SOL O 0.681 0.561 0.592\n 86SOL H 0.696 0.573 0.637\n 86SOL H 0.672 0.513 0.595\n 87SOL O 0.262 0.019 0.318\n 87SOL H 0.267 -0.029 0.321\n 87SOL H 0.228 0.026 0.283\n 88SOL O 0.208 0.660 0.771\n 88SOL H 0.217 0.680 0.727\n 88SOL H 0.246 0.674 0.799\n 89SOL O 0.215 0.532 0.489\n 89SOL H 0.170 0.539 0.507\n 89SOL H 0.242 0.520 0.527\n 90SOL O 0.901 0.895 0.634\n 90SOL H 0.934 0.893 0.598\n 90SOL H 0.858 0.890 0.611\n 91SOL O 0.185 0.563 0.132\n 91SOL H 0.159 0.585 0.096\n 91SOL H 0.156 0.527 0.148\n 92SOL O 0.523 0.270 0.389\n 92SOL H 0.486 0.290 0.413\n 92SOL H 0.560 0.303 0.393\n 93SOL O 0.256 0.737 0.097\n 93SOL H 0.225 0.729 0.134\n 93SOL H 0.269 0.692 0.082\n 94SOL O 0.510 0.464 0.886\n 94SOL H 0.538 0.483 0.851\n 94SOL H 0.537 0.430 0.907\n 95SOL O 0.003 0.754 0.376\n 95SOL H 0.019 0.774 0.334\n 95SOL H 0.013 0.706 0.372\n 96SOL O -0.001 0.892 0.542\n 96SOL H -0.011 0.905 0.496\n 96SOL H 0.045 0.909 0.550\n 97SOL O 0.832 0.092 0.283\n 97SOL H 0.798 0.070 0.310\n 97SOL H 0.817 0.138 0.280\n 98SOL O 0.942 0.224 0.648\n 98SOL H 0.933 0.272 0.648\n 98SOL H 0.923 0.208 0.605\n 99SOL O 1.001 0.566 0.246\n 99SOL H 0.977 0.606 0.231\n 99SOL H 1.005 0.572 0.295\n 100SOL O 0.572 0.112 0.072\n 100SOL H 0.614 0.087 0.075\n 100SOL H 0.538 0.079 0.058\n 101SOL O 0.200 0.161 0.415\n 101SOL H 0.231 0.178 0.380\n 101SOL H 0.229 0.136 0.445\n 102SOL O 0.097 0.126 0.587\n 102SOL H 0.080 0.127 0.541\n 102SOL H 0.057 0.117 0.615\n 103SOL O 0.843 0.411 0.488\n 103SOL H 0.850 0.459 0.483\n 103SOL H 0.849 0.394 0.442\n 104SOL O 0.022 0.949 0.695\n 104SOL H -0.002 0.910 0.677\n 104SOL H 0.060 0.956 0.665\n 105SOL O 0.770 0.333 0.132\n 105SOL H 0.811 0.311 0.145\n 105SOL H 0.740 0.297 0.117\n 106SOL O 0.191 0.226 0.601\n 106SOL H 0.158 0.192 0.587\n 106SOL H 0.171 0.269 0.588\n 107SOL O 0.200 0.875 0.271\n 107SOL H 0.183 0.870 0.225\n 107SOL H 0.163 0.863 0.300\n 108SOL O 0.853 0.402 0.987\n 108SOL H 0.807 0.399 0.972\n 108SOL H 0.851 0.393 1.035\n 109SOL O 0.404 0.825 0.798\n 109SOL H 0.427 0.789 0.774\n 109SOL H 0.430 0.865 0.788\n 110SOL O 0.693 0.898 0.402\n 110SOL H 0.644 0.899 0.406\n 110SOL H 0.707 0.866 0.437\n 111SOL O 0.514 0.191 0.176\n 111SOL H 0.504 0.169 0.219\n 111SOL H 0.539 0.157 0.151\n 112SOL O 0.584 0.038 0.690\n 112SOL H 0.543 0.063 0.700\n 112SOL H 0.586 0.004 0.725\n 113SOL O 0.337 0.124 0.131\n 113SOL H 0.378 0.114 0.105\n 113SOL H 0.354 0.137 0.175\n 114SOL O 0.541 0.772 0.883\n 114SOL H 0.574 0.780 0.918\n 114SOL H 0.517 0.731 0.897\n 115SOL O 0.689 0.391 0.722\n 115SOL H 0.712 0.415 0.686\n 115SOL H 0.641 0.397 0.714\n 116SOL O 0.680 0.981 0.916\n 116SOL H 0.724 0.993 0.934\n 116SOL H 0.653 0.969 0.954\n 117SOL O 0.047 0.292 0.912\n 117SOL H 0.007 0.316 0.897\n 117SOL H 0.038 0.246 0.897\n 118SOL O 0.088 0.174 0.722\n 118SOL H 0.086 0.202 0.762\n 118SOL H 0.062 0.197 0.688\n 119SOL O 0.773 0.351 0.827\n 119SOL H 0.754 0.306 0.825\n 119SOL H 0.754 0.375 0.789\n 120SOL O 0.054 0.295 0.199\n 120SOL H 0.099 0.307 0.212\n 120SOL H 0.059 0.274 0.155\n 121SOL O 0.214 0.572 0.309\n 121SOL H 0.263 0.569 0.306\n 121SOL H 0.200 0.525 0.316\n 122SOL O 0.686 0.198 0.213\n 122SOL H 0.676 0.150 0.218\n 122SOL H 0.644 0.220 0.225\n 123SOL O 0.700 0.698 0.364\n 123SOL H 0.684 0.720 0.323\n 123SOL H 0.744 0.716 0.372\n 124SOL O 0.822 0.779 0.876\n 124SOL H 0.850 0.740 0.865\n 124SOL H 0.820 0.805 0.834\n 125SOL O 0.373 0.497 0.872\n 125SOL H 0.367 0.543 0.857\n 125SOL H 0.421 0.490 0.870\n 126SOL O 0.057 0.797 0.689\n 126SOL H 0.093 0.811 0.719\n 126SOL H 0.039 0.757 0.710\n 127SOL O 0.116 0.190 0.110\n 127SOL H 0.165 0.194 0.105\n 127SOL H 0.109 0.188 0.158\n 128SOL O 0.147 0.868 0.151\n 128SOL H 0.156 0.836 0.115\n 128SOL H 0.140 0.910 0.128\n 129SOL O 0.589 0.611 0.958\n 129SOL H 0.579 0.564 0.970\n 129SOL H 0.545 0.633 0.957\n 130SOL O 0.474 0.505 0.205\n 130SOL H 0.510 0.474 0.198\n 130SOL H 0.444 0.498 0.167\n 131SOL O 0.838 0.243 0.531\n 131SOL H 0.849 0.197 0.519\n 131SOL H 0.858 0.270 0.495\n 132SOL O 0.275 0.661 0.445\n 132SOL H 0.320 0.676 0.458\n 132SOL H 0.272 0.615 0.462\n 133SOL O 0.289 0.193 0.690\n 133SOL H 0.250 0.190 0.661\n 133SOL H 0.326 0.174 0.664\n 134SOL O 0.623 0.836 0.226\n 134SOL H 0.639 0.814 0.185\n 134SOL H 0.595 0.801 0.248\n 135SOL O 0.266 0.833 0.890\n 135SOL H 0.219 0.819 0.897\n 135SOL H 0.279 0.812 0.848\n 136SOL O 0.318 0.586 0.146\n 136SOL H 0.322 0.575 0.193\n 136SOL H 0.271 0.575 0.134\n 137SOL O 0.346 0.346 0.481\n 137SOL H 0.346 0.334 0.529\n 137SOL H 0.299 0.351 0.470\n 138SOL O 0.261 0.241 0.123\n 138SOL H 0.296 0.208 0.129\n 138SOL H 0.283 0.277 0.098\n 139SOL O 0.626 0.725 0.598\n 139SOL H 0.597 0.686 0.591\n 139SOL H 0.660 0.710 0.630\n 140SOL O 0.613 0.811 0.758\n 140SOL H 0.586 0.802 0.797\n 140SOL H 0.631 0.857 0.765\n 141SOL O 0.069 0.398 0.062\n 141SOL H 0.069 0.417 0.107\n 141SOL H 0.116 0.393 0.050\n 142SOL O 0.458 0.663 0.151\n 142SOL H 0.442 0.709 0.144\n 142SOL H 0.417 0.636 0.155\n 143SOL O 0.706 0.230 0.555\n 143SOL H 0.709 0.200 0.595\n 143SOL H 0.749 0.252 0.553\n 144SOL O 0.897 0.185 0.976\n 144SOL H 0.873 0.151 0.949\n 144SOL H 0.869 0.190 1.016\n 145SOL O 0.165 0.044 0.222\n 145SOL H 0.171 0.032 0.175\n 145SOL H 0.117 0.032 0.232\n 146SOL O 0.870 0.389 0.355\n 146SOL H 0.906 0.364 0.332\n 146SOL H 0.845 0.411 0.319\n 147SOL O 0.030 0.986 0.210\n 147SOL H -0.019 0.993 0.206\n 147SOL H 0.044 0.969 0.166\n 148SOL O 0.597 0.255 0.727\n 148SOL H 0.643 0.261 0.712\n 148SOL H 0.601 0.228 0.768\n 149SOL O 0.453 0.141 0.887\n 149SOL H 0.492 0.113 0.896\n 149SOL H 0.420 0.111 0.867\n 150SOL O 0.265 0.712 0.641\n 150SOL H 0.279 0.737 0.602\n 150SOL H 0.219 0.697 0.629\n 151SOL O 0.037 0.115 0.010\n 151SOL H 0.058 0.147 0.043\n 151SOL H 0.055 0.129 -0.033\n 152SOL O 0.459 0.808 0.124\n 152SOL H 0.418 0.822 0.101\n 152SOL H 0.475 0.849 0.146\n 153SOL O 0.098 0.458 0.189\n 153SOL H 0.064 0.482 0.214\n 153SOL H 0.121 0.432 0.222\n 154SOL O 0.769 0.415 0.253\n 154SOL H 0.780 0.384 0.217\n 154SOL H 0.740 0.449 0.232\n 155SOL O 0.842 0.531 0.313\n 155SOL H 0.852 0.565 0.279\n 155SOL H 0.809 0.502 0.291\n 156SOL O 0.136 0.662 0.620\n 156SOL H 0.112 0.632 0.650\n 156SOL H 0.105 0.668 0.582\n 157SOL O 0.536 0.491 0.036\n 157SOL H 0.544 0.455 0.069\n 157SOL H 0.487 0.488 0.026\n 158SOL O 0.695 0.124 0.649\n 158SOL H 0.653 0.103 0.662\n 158SOL H 0.722 0.123 0.689\n 159SOL O 0.836 0.630 0.209\n 159SOL H 0.874 0.661 0.208\n 159SOL H 0.803 0.650 0.239\n 160SOL O 0.180 0.275 0.956\n 160SOL H 0.132 0.284 0.950\n 160SOL H 0.198 0.317 0.974\n 161SOL O 0.139 0.819 0.562\n 161SOL H 0.115 0.801 0.601\n 161SOL H 0.143 0.867 0.570\n 162SOL O 0.086 0.969 0.087\n 162SOL H 0.100 1.007 0.059\n 162SOL H 0.053 0.945 0.060\n 163SOL O 0.794 0.688 0.995\n 163SOL H 0.798 0.719 0.957\n 163SOL H 0.837 0.665 0.997\n 164SOL O 0.110 0.367 0.554\n 164SOL H 0.108 0.391 0.597\n 164SOL H 0.065 0.372 0.535\n 165SOL O 0.919 0.042 0.048\n 165SOL H 0.925 0.045 0.097\n 165SOL H 0.953 0.071 0.030\n 166SOL O 0.009 0.840 0.038\n 166SOL H 0.000 0.837 -0.010\n 166SOL H 0.057 0.832 0.043\n 167SOL O 0.476 0.169 0.505\n 167SOL H 0.493 0.212 0.522\n 167SOL H 0.516 0.141 0.499\n 168SOL O 0.156 0.415 0.304\n 168SOL H 0.158 0.419 0.354\n 168SOL H 0.170 0.369 0.295\n 169SOL O 0.509 0.140 0.305\n 169SOL H 0.548 0.113 0.315\n 169SOL H 0.509 0.175 0.339\n 170SOL O 0.672 0.511 0.195\n 170SOL H 0.649 0.530 0.234\n 170SOL H 0.661 0.541 0.158\n 171SOL O 0.629 0.084 0.287\n 171SOL H 0.670 0.086 0.313\n 171SOL H 0.619 0.036 0.284\n 172SOL O 0.525 0.753 0.294\n 172SOL H 0.514 0.746 0.341\n 172SOL H 0.496 0.722 0.269\n 173SOL O 0.113 0.815 0.893\n 173SOL H 0.066 0.801 0.890\n 173SOL H 0.118 0.849 0.859\n 174SOL O 0.066 0.766 0.222\n 174SOL H 0.110 0.747 0.232\n 174SOL H 0.076 0.808 0.199\n 175SOL O 0.800 0.228 0.283\n 175SOL H 0.826 0.252 0.250\n 175SOL H 0.757 0.220 0.263\n 176SOL O 0.876 0.794 0.097\n 176SOL H 0.912 0.818 0.074\n 176SOL H 0.841 0.788 0.064\n 177SOL O 0.415 0.069 1.011\n 177SOL H 0.367 0.062 1.015\n 177SOL H 0.421 0.086 0.965\n 178SOL O 0.118 0.275 0.389\n 178SOL H 0.154 0.240 0.395\n 178SOL H 0.140 0.317 0.401\n 179SOL O 0.736 0.791 0.514\n 179SOL H 0.762 0.755 0.494\n 179SOL H 0.701 0.769 0.539\n 180SOL O 0.392 0.472 0.385\n 180SOL H 0.441 0.478 0.379\n 180SOL H 0.389 0.440 0.422\n 181SOL O 0.694 0.725 0.132\n 181SOL H 0.728 0.708 0.100\n 181SOL H 0.659 0.691 0.132\n 182SOL O 0.692 0.936 0.145\n 182SOL H 0.676 0.907 0.182\n 182SOL H 0.668 0.919 0.106\n 183SOL O 0.459 0.675 0.944\n 183SOL H 0.425 0.647 0.966\n 183SOL H 0.441 0.721 0.948\n 184SOL O 0.530 0.478 0.697\n 184SOL H 0.514 0.441 0.726\n 184SOL H 0.511 0.467 0.654\n 185SOL O 0.945 0.712 0.190\n 185SOL H 0.990 0.729 0.201\n 185SOL H 0.928 0.743 0.156\n 186SOL O 0.756 0.919 0.572\n 186SOL H 0.714 0.943 0.559\n 186SOL H 0.745 0.871 0.567\n 187SOL O -0.016 0.294 0.328\n 187SOL H 0.023 0.290 0.358\n 187SOL H 0.004 0.291 0.282\n 188SOL O 0.362 0.299 0.616\n 188SOL H 0.324 0.288 0.645\n 188SOL H 0.398 0.270 0.632\n 189SOL O 0.191 0.283 0.232\n 189SOL H 0.217 0.287 0.190\n 189SOL H 0.205 0.240 0.250\n 190SOL O 0.080 0.118 0.353\n 190SOL H 0.128 0.114 0.360\n 190SOL H 0.071 0.167 0.356\n 191SOL O 0.765 0.432 0.613\n 191SOL H 0.778 0.404 0.575\n 191SOL H 0.805 0.458 0.624\n 192SOL O 0.127 0.970 0.597\n 192SOL H 0.169 0.983 0.619\n 192SOL H 0.131 0.989 0.552\n 193SOL O 0.358 0.031 0.855\n 193SOL H 0.347 0.018 0.808\n 193SOL H 0.321 0.014 0.881\n 194SOL O 0.692 0.276 0.997\n 194SOL H 0.645 0.261 0.992\n 194SOL H 0.689 0.324 0.991\n 195SOL O 0.124 0.921 0.804\n 195SOL H 0.130 0.960 0.834\n 195SOL H 0.080 0.929 0.783\n 196SOL O 0.065 0.523 0.548\n 196SOL H 0.068 0.487 0.582\n 196SOL H 0.018 0.522 0.533\n 197SOL O 0.600 0.905 0.019\n 197SOL H 0.557 0.926 0.010\n 197SOL H 0.595 0.859 0.004\n 198SOL O 0.221 0.851 0.725\n 198SOL H 0.189 0.880 0.748\n 198SOL H 0.218 0.864 0.678\n 199SOL O 0.733 0.206 0.876\n 199SOL H 0.724 0.227 0.920\n 199SOL H 0.776 0.182 0.883\n 200SOL O 0.790 0.852 0.996\n 200SOL H 0.818 0.839 0.958\n 200SOL H 0.745 0.835 0.986\n 201SOL O 0.970 0.871 0.892\n 201SOL H 0.943 0.876 0.851\n 201SOL H 0.988 0.916 0.901\n 202SOL O 0.495 0.910 0.918\n 202SOL H 0.450 0.924 0.932\n 202SOL H 0.488 0.869 0.892\n 203SOL O 0.576 0.073 0.460\n 203SOL H 0.588 0.035 0.490\n 203SOL H 0.540 0.055 0.432\n 204SOL O 0.858 0.557 0.449\n 204SOL H 0.856 0.552 0.400\n 204SOL H 0.903 0.573 0.458\n 205SOL O 0.035 -0.011 0.910\n 205SOL H 0.084 -0.004 0.911\n 205SOL H 0.016 0.033 0.900\n 206SOL O 0.354 0.668 0.818\n 206SOL H 0.376 0.712 0.816\n 206SOL H 0.319 0.673 0.852\n 207SOL O 0.368 0.218 0.421\n 207SOL H 0.411 0.197 0.433\n 207SOL H 0.375 0.265 0.434\n 208SOL O 0.898 0.009 0.203\n 208SOL H 0.875 0.038 0.235\n 208SOL H 0.876 -0.035 0.209\n 209SOL O 0.557 0.231 0.015\n 209SOL H 0.526 0.257 0.043\n 209SOL H 0.558 0.187 0.036\n 210SOL O 0.621 0.512 0.814\n 210SOL H 0.655 0.540 0.835\n 210SOL H 0.606 0.538 0.775\n 211SOL O 0.644 0.952 0.773\n 211SOL H 0.682 0.973 0.749\n 211SOL H 0.649 0.966 0.819\n 212SOL O 0.652 0.325 0.359\n 212SOL H 0.651 0.340 0.406\n 212SOL H 0.698 0.332 0.344\n 213SOL O 0.859 0.532 0.648\n 213SOL H 0.880 0.571 0.628\n 213SOL H 0.827 0.550 0.680\n 214SOL O 0.144 0.704 0.464\n 214SOL H 0.192 0.696 0.469\n 214SOL H 0.137 0.747 0.486\n 215SOL O 0.198 0.156 0.799\n 215SOL H 0.162 0.142 0.769\n 215SOL H 0.231 0.179 0.770\n 216SOL O 0.768 0.004 0.703\n 216SOL H 0.797 0.043 0.709\n 216SOL H 0.771 -0.007 0.656\n 217SOL O 0.965 0.118 0.513\n 217SOL H 0.928 0.086 0.519\n 217SOL H 0.961 0.132 0.466\n 218SOL O 0.626 0.972 0.540\n 218SOL H 0.598 0.934 0.554\n 218SOL H 0.628 1.001 0.579\n 219SOL O 0.892 0.274 0.182\n 219SOL H 0.929 0.256 0.210\n 219SOL H 0.913 0.281 0.138\n 220SOL O 0.386 0.854 0.401\n 220SOL H 0.350 0.834 0.374\n 220SOL H 0.425 0.826 0.392\n 221SOL O 0.877 0.659 0.849\n 221SOL H 0.898 0.671 0.806\n 221SOL H 0.888 0.612 0.856\n 222SOL O 0.873 0.214 0.392\n 222SOL H 0.910 0.244 0.378\n 222SOL H 0.839 0.219 0.358\n 223SOL O 0.981 0.605 0.470\n 223SOL H 0.991 0.647 0.493\n 223SOL H 1.012 0.603 0.432\n 224SOL O 0.213 0.411 0.008\n 224SOL H 0.253 0.406 0.036\n 224SOL H 0.214 0.458 -0.007\n 225SOL O 0.939 0.032 0.780\n 225SOL H 0.907 0.050 0.747\n 225SOL H 0.977 0.016 0.754\n 226SOL O 0.880 0.522 0.863\n 226SOL H 0.917 0.500 0.886\n 226SOL H 0.840 0.498 0.878\n 227SOL O 0.076 0.908 0.339\n 227SOL H 0.061 0.926 0.296\n 227SOL H 0.040 0.878 0.354\n 228SOL O 0.964 0.374 0.536\n 228SOL H 0.920 0.391 0.523\n 228SOL H 0.960 0.363 0.583\n 229SOL O 0.762 0.591 0.726\n 229SOL H 0.747 0.636 0.714\n 229SOL H 0.758 0.588 0.775\n 230SOL O 0.593 0.632 0.127\n 230SOL H 0.544 0.637 0.137\n 230SOL H 0.594 0.596 0.094\n 231SOL O 0.834 0.053 0.526\n 231SOL H 0.817 0.008 0.533\n 231SOL H 0.794 0.081 0.519\n 232SOL O 0.366 0.278 0.929\n 232SOL H 0.342 0.286 0.886\n 232SOL H 0.373 0.230 0.930\n 233SOL O 0.700 0.421 0.968\n 233SOL H 0.712 0.459 0.997\n 233SOL H 0.676 0.442 0.930\n 234SOL O 0.968 0.484 0.723\n 234SOL H 0.938 0.503 0.689\n 234SOL H 0.946 0.494 0.765\n 235SOL O 0.344 0.948 0.731\n 235SOL H 0.392 0.960 0.726\n 235SOL H 0.344 0.899 0.729\n 236SOL O 0.377 0.122 0.273\n 236SOL H 0.414 0.133 0.303\n 236SOL H 0.369 0.074 0.280\n 237SOL O 0.484 0.936 0.751\n 237SOL H 0.494 0.918 0.706\n 237SOL H 0.528 0.947 0.770\n 238SOL O 0.704 0.111 0.471\n 238SOL H 0.705 0.157 0.490\n 238SOL H 0.657 0.102 0.463\n 239SOL O 0.399 0.789 0.947\n 239SOL H 0.363 0.804 0.977\n 239SOL H 0.391 0.810 0.904\n 240SOL O 0.381 0.638 0.673\n 240SOL H 0.349 0.675 0.670\n 240SOL H 0.394 0.636 0.720\n 241SOL O 0.156 0.805 0.033\n 241SOL H 0.159 0.809 -0.016\n 241SOL H 0.197 0.781 0.046\n 242SOL O 0.738 0.020 0.358\n 242SOL H 0.726 -0.023 0.377\n 242SOL H 0.733 0.053 0.394\n';var cell=ChemDoodle.readCIF(Fmol, 1,1,1);Mol1.loadContent([cell.molecule], [cell.unitCell]);Mol1.startAnimation();var $=function(id){return document.getElementById(id)};function setProj1(yesPers){Mol1.specs.projectionPerspective_3D = yesPers;Mol1.setupScene();Mol1.repaint()}function setModel1(model){Mol1.specs.set3DRepresentation(model);Mol1.setupScene();Mol1.repaint()}function setSupercell1(){var cell=ChemDoodle.readCIF(Fmol, $("Mol1x").value, $("Mol1y").value, $("Mol1z").value);Mol1.loadContent([cell.molecule], [cell.unitCell]);Mol1.repaint()}</script><br><span class="meta">视图: <input type="radio" name="group2" onclick="setProj1(true)">投影<input type="radio" name="group2" onclick="setProj1(false)" checked="">正交<br>模型: <input type="radio" name="model" onclick="setModel1(&#39;Ball and Stick&#39;)" checked="">球棍<input type="radio" name="model" onclick="setModel1(&#39;van der Waals Spheres&#39;)">范德华球<input type="radio" name="model" onclick="setModel1(&#39;Stick&#39;)">棍状<input type="radio" name="model" onclick="setModel1(&#39;Wireframe&#39;)">线框<input type="radio" name="model" onclick="setModel1(&#39;Line&#39;)">线型<input type="checkbox" onclick="Mol1.specs.atoms_displayLabels_3D=this.checked;Mol1.repaint()">名称<br>超晶胞: X <input type="text" style="width:20px;" id="Mol1x" value="1">&nbsp;&nbsp;Y <input type="text" style="width:20px;" id="Mol1y" value="1">&nbsp;&nbsp;Z <input type="text" style="width:20px;" id="Mol1z" value="1">&nbsp;&nbsp;<input type="button" value="创建" onclick="setSupercell1()"><br>左键: 转动&nbsp;&nbsp; 滚轮: 缩放&nbsp;&nbsp; 双击: 开关自动旋转&nbsp;&nbsp; Alt+左键: 移动</span><br><figurecaption>Fig.1</figurecaption></figure>

下面我们来运行模拟

	grompp -maxwarn 2
	mdrun

作为示例, 我们只运行了20 ps, 得到了轨迹文件`traj.xtc`.

要计算CH4分子第一溶剂化层中水分子的平均滞留时间, 我们首先需要知道第一溶剂化层的厚度, 为此, 我们可以计算CH4分子和水分子二者质心之间的径向分布函数RDF

	g_rdf -f -n -rdf mol_com
	> 2 3

得到如下图形

<figure><img src="/pic/CH4Wsel-1.png" alt="Fig. 2" /><figcaption>Fig. 2</figcaption></figure>

可以看到, 由于模拟时间较短, 得到的RDF并不是十分光滑(延长模拟时间就可以得到更漂亮的图形), 但我们仍然可以看出第一溶剂化层的厚度大约是0.5 nm. 也就是说, 我们在计算平均滞留时间时, 只考虑其质心处于CH4质心0.5 nm 范围内的水分子.

【2016-03-27 补注】上面关于第一溶剂化层厚度的说法不严谨. 文献上一般以RDF的第一个峰值作为第一溶剂化层的厚度, 所以根据上图应该是0.36 nm左右, 下面分析中应该使用这个数值.

我们使用`g_select`工具来获取每个水分子的是否处于CH4第一溶剂化层中的信息.

	g_select -f -n -os -oc -oi -om -on selFrm.ndx -selrpos mol_com
	>"1st shell" resname SOL and name OW and within 0.5 of resname CH4

在上面的命令中我们为`-on`选项指定了输出文件, 以防止默认的输出文件`index.ndx`与前面我们使用的`index.ndx`文件冲突. 有关`g_select`的使用说明请参考[其说明文档](http://jerkwin.github.io/GMX/GMXprg#gmx-select--)和[GROMACS选区(selection)语法及用法](http://jerkwin.github.io/GMX/GMXsel/).

我们得到如下文件

- `size.xvg`:  每一时刻第一溶剂化层中原子的个数
- `cfrac.xvg`: 每一时刻第一溶剂化层中原子的覆盖比例
- `index.dat`: 每一时刻第一溶剂化层中原子的个数及其编号
- `mask.dat`:  每一时刻分子是否处于第一溶剂化层中的掩码, `0`: 不处于, `1`:处于
- `selFrm.ndx`: 每一时刻第一溶剂化层中原子的索引组

请打开这些文件进行查看, 了解其含义.

我们只要对`mask.dat`进行分析处理就可以计算平均滞留时间了. 这可以使用下面的bash脚本完成

<table class="highlighttable"><th colspan="2" style="text-align:left">bash</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
35</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #B8860B">file</span><span style="color: #666666">=</span>mask.dat
<span style="color: #B8860B">ftrs</span><span style="color: #666666">=</span><span style="color: #BB6688; font-weight: bold">${</span><span style="color: #B8860B">file</span>%.*<span style="color: #BB6688; font-weight: bold">}</span>_trs.dat
<span style="color: #B8860B">ffrq</span><span style="color: #666666">=</span><span style="color: #BB6688; font-weight: bold">${</span><span style="color: #B8860B">file</span>%.*<span style="color: #BB6688; font-weight: bold">}</span>_frq.dat

awk <span style="color: #BB4444">&#39;</span> BEGIN <span style="color: #666666">{</span>
	getline
	<span style="color: #AA22FF; font-weight: bold">while</span><span style="color: #666666">(</span><span style="color: #B8860B">$1</span><span style="color: #666666">==</span><span style="color: #BB4444">&quot;#&quot;</span><span style="color: #666666">)</span> getline
	<span style="color: #B8860B">Ncol</span><span style="color: #666666">=</span>NF
	close<span style="color: #666666">(</span>FILENAME<span style="color: #666666">)</span>

	<span style="color: #AA22FF; font-weight: bold">for</span><span style="color: #666666">(</span><span style="color: #B8860B">i</span><span style="color: #666666">=</span>2; i&lt;<span style="color: #666666">=</span>Ncol; i++<span style="color: #666666">)</span> <span style="color: #666666">{</span>
		<span style="color: #AA22FF; font-weight: bold">while</span><span style="color: #666666">(</span>getline&lt;FILENAME<span style="color: #666666">)</span> <span style="color: #AA22FF; font-weight: bold">if</span><span style="color: #666666">(</span><span style="color: #B8860B">NF</span><span style="color: #666666">==</span>Ncol<span style="color: #666666">)</span> <span style="color: #AA22FF">printf</span> <span style="color: #BB4444">&quot;%s&quot;</span>, $i
		print <span style="color: #BB4444">&quot;&quot;</span>
		close<span style="color: #666666">(</span>FILENAME<span style="color: #666666">)</span>
	<span style="color: #666666">}</span>
<span style="color: #666666">}</span><span style="color: #BB4444">&#39;</span> <span style="color: #B8860B">$f</span>ile &gt; <span style="color: #B8860B">$f</span>trs

awk -v <span style="color: #B8860B">file</span><span style="color: #666666">=</span><span style="color: #B8860B">$f</span>ile <span style="color: #BB4444">&#39;</span>
BEGIN<span style="color: #666666">{</span> <span style="color: #B8860B">Navg</span><span style="color: #666666">=</span>0; <span style="color: #B8860B">Tavg</span><span style="color: #666666">=</span>0
	getline &lt;file
	<span style="color: #AA22FF; font-weight: bold">while</span><span style="color: #666666">(</span><span style="color: #B8860B">$1</span><span style="color: #666666">==</span><span style="color: #BB4444">&quot;#&quot;</span><span style="color: #666666">)</span> getline &lt;file; <span style="color: #B8860B">dt</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>
	getline &lt;file; <span style="color: #B8860B">dt</span><span style="color: #666666">=</span><span style="color: #B8860B">$1</span>-dt
	close<span style="color: #666666">(</span>file<span style="color: #666666">)</span>
<span style="color: #666666">}</span>

<span style="color: #666666">{</span>	gsub<span style="color: #666666">(</span>/0+/, <span style="color: #BB4444">&quot; &quot;</span><span style="color: #666666">)</span>
	<span style="color: #B8860B">Ntxt</span><span style="color: #666666">=</span>split<span style="color: #666666">(</span><span style="color: #B8860B">$0</span>, txt<span style="color: #666666">)</span>
	<span style="color: #AA22FF; font-weight: bold">for</span><span style="color: #666666">(</span><span style="color: #B8860B">i</span><span style="color: #666666">=</span>1; i&lt;<span style="color: #666666">=</span>Ntxt; i++<span style="color: #666666">)</span> <span style="color: #666666">{</span>
		<span style="color: #B8860B">T</span><span style="color: #666666">=</span>length<span style="color: #666666">(</span>txt<span style="color: #666666">[</span>i<span style="color: #666666">])</span>
		print T
		Navg++; Tavg +<span style="color: #666666">=</span> T
	<span style="color: #666666">}</span>
<span style="color: #666666">}</span>
END<span style="color: #666666">{</span> print <span style="color: #BB4444">&quot;# Avaraged Residence Time(ps)=&quot;</span>, Tavg*dt/Navg<span style="color: #666666">}</span>
<span style="color: #BB4444">&#39;</span> <span style="color: #B8860B">$f</span>trs &gt;<span style="color: #B8860B">$ff</span>rq
</pre></div>
</td></tr></table>

得到的平均滞留时间为0.807243 ps. 当然, 实际情况中你需要运行更长的模拟来确认得到的数据是否收敛. 水分子滞留时间的分布图如下

<figure><img src="/pic/CH4Wsel-2.png" alt="Fig. 3" /><figcaption>Fig. 3</figcaption></figure>

对更大的体系, 更长的模拟时间, 上面的简单脚本可能执行时间很长. 这主要是因为在第一步中对`mask.dat`进行行列互换时, 如果文件太大就要花费很长的时间. 一种更高效些的方法是使用中间文件, 方法如下

<table class="highlighttable"><th colspan="2" style="text-align:left">bash</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
20</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">awk -v <span style="color: #B8860B">ftrs</span><span style="color: #666666">=</span><span style="color: #B8860B">$f</span>trs <span style="color: #BB4444">&#39;</span> BEGIN<span style="color: #666666">{</span> <span style="color: #B8860B">Nmax</span><span style="color: #666666">=</span>2000; <span style="color: #B8860B">N</span><span style="color: #666666">=</span>0
	system<span style="color: #666666">(</span><span style="color: #BB4444">&quot;rm -rf _row-* &quot;</span> ftrs <span style="color: #BB4444">&quot; &amp;&amp; cat &lt;&gt; &quot;</span> ftrs<span style="color: #666666">)</span>
<span style="color: #666666">}</span>
<span style="color: #B8860B">$1</span>!<span style="color: #666666">=</span><span style="color: #BB4444">&quot;#&quot;</span> <span style="color: #666666">{</span>
	N++
	<span style="color: #B8860B">Frow</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;_row-&quot;</span>sprintf<span style="color: #666666">(</span><span style="color: #BB4444">&quot;%04d&quot;</span>,N<span style="color: #666666">)</span>
	<span style="color: #B8860B">$1</span><span style="color: #666666">=</span><span style="color: #BB4444">&quot;&quot;</span>; sub<span style="color: #666666">(</span>/^<span style="color: #BB6622; font-weight: bold">\s</span>*/, <span style="color: #BB4444">&quot;&quot;</span><span style="color: #666666">)</span>; gsub<span style="color: #666666">(</span><span style="color: #BB4444">&quot; &quot;</span>, <span style="color: #BB4444">&quot;\n&quot;</span>, <span style="color: #B8860B">$0</span><span style="color: #666666">)</span>
	print <span style="color: #B8860B">$0</span> &gt;Frow
	close<span style="color: #666666">(</span>Frow<span style="color: #666666">)</span>
	<span style="color: #AA22FF; font-weight: bold">if</span><span style="color: #666666">(</span>N&gt;Nmax<span style="color: #666666">)</span> <span style="color: #666666">{</span>
		<span style="color: #B8860B">N</span><span style="color: #666666">=</span>0
		system<span style="color: #666666">(</span><span style="color: #BB4444">&quot;ls _row-* | sort | xargs paste -d \047\047 &quot;</span>ftrs<span style="color: #BB4444">&quot; &gt;_trsRow&quot;</span><span style="color: #666666">)</span>
		system<span style="color: #666666">(</span><span style="color: #BB4444">&quot;rm -rf _row-* &amp;&amp; mv _trsRow &quot;</span>ftrs<span style="color: #666666">)</span>
	<span style="color: #666666">}</span>
<span style="color: #666666">}</span>
END<span style="color: #666666">{</span>
	system<span style="color: #666666">(</span><span style="color: #BB4444">&quot;ls _row-* | sort | xargs paste -d \047\047 &quot;</span>ftrs<span style="color: #BB4444">&quot; &gt;_trsRow&quot;</span><span style="color: #666666">)</span>
	system<span style="color: #666666">(</span><span style="color: #BB4444">&quot;rm -rf _row-* &amp;&amp; mv _trsRow &quot;</span>ftrs<span style="color: #666666">)</span>
<span style="color: #666666">}</span>
<span style="color: #BB4444">&#39;</span> <span style="color: #B8860B">$f</span>ile
</pre></div>
</td></tr></table>

更高效的方法, 就只能换用其他编译型语言或MatLab等软件了.

我们可以利用`trjconv`程序并借助`selFrm.ndx`文件获取每一时刻所选原子的坐标, 只需要根据对每一帧指定不同的索引组即可. 获取前100帧的示例代码如下

<table class="highlighttable"><th colspan="2" style="text-align:left">bash</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #B8860B">file</span><span style="color: #666666">=</span>selFrm.gro
<span style="color: #AA22FF">echo</span> -n <span style="color: #BB4444">&quot;&quot;</span>&gt; <span style="color: #B8860B">$f</span>ile

<span style="color: #B8860B">dt</span><span style="color: #666666">=</span>0.002
<span style="color: #AA22FF; font-weight: bold">for</span> i in <span style="color: #666666">{</span>0..100<span style="color: #666666">}</span>; <span style="color: #AA22FF; font-weight: bold">do</span>
	<span style="color: #B8860B">t</span><span style="color: #666666">=</span><span style="color: #AA22FF; font-weight: bold">$(</span><span style="color: #AA22FF">echo</span> <span style="color: #BB4444">&quot;</span><span style="color: #B8860B">$d</span><span style="color: #BB4444">t*</span>$<span style="color: #BB4444">i&quot;</span> | bc<span style="color: #AA22FF; font-weight: bold">)</span>
	<span style="color: #AA22FF">echo</span> $i | trjconv -f -n selFrm.ndx -dump $t -o _tmp.gro 2&gt;/dev/null
	cat _tmp.gro &gt;&gt;<span style="color: #B8860B">$f</span>ile
	rm -rf _tmp.gro
<span style="color: #AA22FF; font-weight: bold">done</span>
</pre></div>
</td></tr></table>

当然这种每次处理一帧的方法运行起来很慢, 但可惜的是GROMACS的分析工具中并没有提供解决方案, 如果需要更快地抽取出构型, 那就只能自己写代码了. 此外, 这样直接得到的构型由于PBC的原因可能看起来不连续, 为此, 你可能需要先使用`trjconv`对轨迹进行居中, PBC处理, 然后再使用上面的方法获取坐标.

## 网络资料

1. [如何计算平均滞留时间(residence time)](http://www.bbioo.com/experiment/105-178917-1.html)
2. [trajectory output from g_select?](http://gromacs.org_gmx-users.maillist.sys.kth.narkive.com/RVu1pmCv/trajectory-output-from-g-select)
3. [gmx dipoles with dynamic indices (gromacs 5.0.x)](http://comments.gmane.org/gmane.science.biology.gromacs.user/79827)
4. [extract coordinates of selected atoms](http://gromacs.org_gmx-users.maillist.sys.kth.narkive.com/DGgASJD6/extract-coordinates-of-selected-atoms)
5. [Windows Cmd终端Ctrl D不起作用的解决方法](http://blog.csdn.net/newborn2012/article/details/19416641)
6. [Equivalent to ^D (in bash) for cmd.exe?](http://superuser.com/questions/291224/equivalent-to-d-in-bash-for-cmd-exe)
7. [LINUX SHELL 行列转换、倒序](http://blog.sina.com.cn/s/blog_00018ddf0100gc03.html)

----

<h1>程刚: 基于GROMACS和MatLab计算平均滞留时间</h1>

## 一、计算原理

可参考文献 Phys. Chem. Chem. Phys., 2012, 14, 16536-16543

划定一定的区域，定义为系统计算空间，比如距离聚合物膜0.5 nm的空间。假设体系里有N个分子，每个分子在系统计算空间的平均滞留时间都不同，对体系的N个分子全部进行平均，就得到了平均滞留时间。下面以计算水分子的平均滞留时间为例。

假设统计的轨迹共n帧，共计x ns，统计轨迹时间x ns应该远大于水分子的滞留时间。以第1号水分子为例，统计这n帧轨迹中第1号水分子在系统计算空间内出现的总时间，再除以第1号水分子进出此空间的次数，就得到了第1号分子的平均滞留时间，记为T(1)。然后对所有的水分子的平均滞留时间进行平均，记为Tavg=sum(T)/n，其中sum为加和函数，n为出现在系统计算空间的总分子数（即排除所有未曾出现在系统计算空间内的分子）。

## 二、计算过程

### 1. 采用GROMACS软件对轨迹进行处理

	g_select -f md.xtc -s md.tpr -n index.ndx -om M_1.dat -select 'name OW and within 0.195 of group M'

系统计算空间为距离M基团0.195 nm的空间；其中`md.xtc`文件为轨迹，共计n帧；`index.ndx`索引文件中应该提前设定好待分析的组和`OW`原子；产生的`M_1.dat`文件是二进制的二维数据表，第一列为轨迹时间，后面每列为每个`OW`原子在每个轨迹时间点上在系统计算空间内的出现情况（1代表出现，0代表不出现）。

### 2. 采用MatLab软件处理dat文件

使用下面的MatLab代码处理得到的`M_1.dat`文件，注意文件名要匹配。程序运行结束后，Tavg为所求。

__李继存 注__: 此代码效率较低, 数据量太大时可能出现问题, 请优化使用.

<table class="highlighttable"><th colspan="2" style="text-align:left">matlab</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
29</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #AA22FF; font-weight: bold">function</span> <span style="color: #00A000">ResTime</span>
	clc; clear all;

	<span style="color: #AA22FF; font-weight: bold">global</span> Ntime Natom

	dt=<span style="color: #666666">2</span>;                   <span style="color: #008800; font-style: italic">% 时间间隔</span>
	mat=load(<span style="color: #BB4444">&#39;</span>SO3_1.dat<span style="color: #666666">&#39;</span>) ; <span style="color: #008800; font-style: italic">% mask数据文件</span>

	[Ntime,Ncol]=<span style="color: #AA22FF">size</span>(mat);    <span style="color: #008800; font-style: italic">%</span>
	mat=mat(<span style="color: #666666">1</span>:Ntime,<span style="color: #666666">2</span>:Ncol);   <span style="color: #008800; font-style: italic">%</span>

	Natom=Ncol<span style="color: #666666">-1</span>;
	T=<span style="color: #AA22FF">zeros</span>(<span style="color: #666666">1</span>,Natom);    <span style="color: #008800; font-style: italic">% 某一列的滞留时间</span>
	Tnum=<span style="color: #AA22FF">zeros</span>(<span style="color: #666666">1</span>,Natom); <span style="color: #008800; font-style: italic">% 未连续出现的次数统计</span>
	Ttot=<span style="color: #AA22FF">zeros</span>(<span style="color: #666666">1</span>,Natom); <span style="color: #008800; font-style: italic">% 某一列的总和，出现的总时间</span>

	<span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #AA22FF">i</span>=<span style="color: #666666">1</span>:Natom
		Ttot(<span style="color: #AA22FF">i</span>)=sum(mat(:,<span style="color: #AA22FF">i</span>));
		 <span style="color: #AA22FF; font-weight: bold">if</span>(Ttot(<span style="color: #AA22FF">i</span>)<span style="color: #666666">~=0</span>)
			<span style="color: #AA22FF; font-weight: bold">for</span> <span style="color: #AA22FF">j</span>=<span style="color: #666666">1</span>:Ntime<span style="color: #666666">-1</span>
				<span style="color: #AA22FF; font-weight: bold">if</span> mat(<span style="color: #AA22FF">j</span><span style="color: #666666">+1</span>,<span style="color: #AA22FF">i</span>)<span style="color: #666666">~=</span>mat(<span style="color: #AA22FF">j</span>,<span style="color: #AA22FF">i</span>)
					Tnum(<span style="color: #AA22FF">i</span>)=Tnum(<span style="color: #AA22FF">i</span>)<span style="color: #666666">+0.5</span>;
				<span style="color: #AA22FF; font-weight: bold">end</span>
			<span style="color: #AA22FF; font-weight: bold">end</span>
			T(<span style="color: #AA22FF">i</span>)=double(Ttot(<span style="color: #AA22FF">i</span>)<span style="color: #666666">/</span><span style="color: #AA22FF">ceil</span>(Tnum(<span style="color: #AA22FF">i</span>)));
		 <span style="color: #AA22FF; font-weight: bold">end</span>
	 <span style="color: #AA22FF; font-weight: bold">end</span>

	Tavg=sum(T)<span style="color: #666666">*</span>dt<span style="color: #666666">/</span><span style="color: #AA22FF">length</span>(<span style="color: #AA22FF">find</span>(Ttot<span style="color: #666666">&gt;0</span>))
</pre></div>
</td></tr></table>
### 评论

- 2016-10-20 11:40:17 `wlzzl` 第一个脚本运行总是错误，是复制下来格式不对吗？
- 2016-10-21 12:46:48 `Jerkwin` 说清楚, 是哪个脚本, 错误提示是什么?
- 2016-10-24 20:01:30 `wlzzl` 就是第一个利用mask.dat求驻留时间的脚本，awk指令的最后那个单引号，没有跟大括号在同一行，运行时总是报错，也不知什么原因。
- 2016-10-25 15:10:25 `Jerkwin` 系统的原因吧, 可能和换行符什么的有关
- 2016-10-24 19:45:37 `wlzzl` 谢谢了，翻看了书，已经解决。

- 2016-11-02 15:29:48 `live` 想问下，利用第一个脚本文件算出的滞留时间和文献差异大吗？我算出来差异有点大。
- 2016-11-02 21:12:52 `Jerkwin` 这种方法有其本身的缺点, 计算得到的值和使用的时间步长有关. 更好的方法你可以参考文献.

- 2017-02-26 16:07:46 `Topin` 李老师，5.0+版Gromacs, gmx select里-olt项输出的lifetime.xvg文件就是滞留时间分布数据吧?
- 2017-02-26 19:05:25 `Jerkwin` 有人说是, 但是我没有测试过, 不清楚到底是不是. 你可以测试一下, 如果确定了, 请告诉我一声, 以便我更新下文章.
