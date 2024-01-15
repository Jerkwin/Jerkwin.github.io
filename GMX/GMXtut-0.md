---
 layout: post
 title: GROMACS教程：漏斗网蜘蛛毒素肽的溶剂化研究：Amber99SB-ILDN力场
 categories:
 - 科
 tags:
 - gmx
 chem: true
 math: true
---

* toc
{:toc}

- 原始文档: John E. Kerrigan(jkerriga@rutgers.edu, kerrigje@umdnj.edu)
	[3.3.1版本](http://www-personal.umich.edu/~amadi/fwspidr_tutor.pdf)
	[4.6版本](http://www.researchgate.net/publictopics.PublicPostFileLoader.html?id=511b5be2e24a468401000000&key=9fcfd511b5be1dd8af)
- 参考译文: 梁(leunglm@hotmail.com)
- 2016-08-10 15:39:10 增加gmx-5.x版本命令, 由 汪洋 测试提供
- 2016-09-02 11:36:18 感谢 陈孙妮 修订翻译舛误之处.

## 概述

在本教程中, 你将研究一种从漏斗网蜘蛛的毒液中分离出来的毒素. 毒液毒素在以前一直被用于识别阳离子通道. 钙离子通道会调节进入细胞的钙离子. 神经信号受到神经细胞中离子平衡的高度控制. 人们认为像蜘蛛毒素这类毒液中暴露的带正电残基会倾向于与细胞离子通道入口的带负电残基结合. 对本教程中的蜘蛛毒素, 其带正电的残基主要朝向肽链一侧. 离子通道的堵塞会导致神经信号的中断, 导致麻痹并最终死亡(通过呼吸衰竭推测).

GROMACS是一个利用经典分子动力学理论研究蛋白质动力学的高端高效工具[1,2], 它是遵守GNU公共许可的自由软件, 你可以从[GROMACS官方网站](http://www.gromacs.org)下载. GROMACS可以在linux, unix和Windows上运行. 对于本教程, 我们使用的是GROMACS 4.6版, 并给出了5.x版本相应的命令. 编译时使用了3.3.3版本的FFTW库.

在本教程中, 你要创建GROMACS结构文件(`*.gro`), 可使用[VMD, visual molecular dynamics](http://www.ks.uiuc.edu/Research/vmd/)查看这种文件. 另外, 你还需要一份[GROMACS用户手册](http://www.gromacs.org).

本教程关注的蛋白质来自下面的文献:

Yu, H., Rosen, M. K., Saccomano, N. A., Phillips, D., Volkmann, R. A., Schreiber, S. L.:
Sequential assignment and structure determination of spider toxin omega-Aga-IVB.
Biochemistry 32 pp. 13123 (__1993__)

我们将使用显式的溶剂动力学研究这个肽毒素. 我们首先会将这个小肽放于水盒子中进行溶剂化, 然后利用牛顿运动定律进行平衡. 我们还将比较和对比补偿离子对显式溶剂动力学的影响. 通过模拟, 我们希望能回答如下几个问题:

- 小肽的二级结构和三级结构在动力学模拟中是否稳定?
- 带正电的残基侧链是否主要朝向肽结构的一侧?
- 补偿离子是保持在正电残基附近还是四处移动?
- 水在维持蛋白结构中起到什么作用?

## 分子动力学模拟

### 理解预平衡

如果你研究过不同的MD教程, 就会发现在进行成品模拟前, 不同教程的处理存在差异. 不了解的人就会觉得困惑. 所以我们要知道原则, 这样才能知道为什么会有不同的处理方法.

在做成品MD模拟前, 最好保证体系已经达到平衡, 因为我们最终目的是对平衡好的体系进行抽样. 如果体系没有平衡好, 那么需要先运行很长时间的模拟达到平衡, 然后才能采集数据. 为了使模拟开始时的体系尽量接近平衡, 可以采取各种方法, 这些方法可以统称为预平衡.

可见, 预平衡并不是必须的. 如果体系的初始结构足够好, 就不需要特别的预平衡, 直接做模拟即可. 分析结果时将模拟的前面一部分作为预平衡过程舍去即可. 但当体系的初始结构不是很好时, 达到平衡可能耗时较长. 对一些很差的初始结构, 模拟可能会崩溃, 这种情况下, 就需要根据具体情况采用一些预平衡方法.

- __蛋白质结构能量最小化__ 因为pdb文件中的蛋白质结构来自晶体, 里面可能含有溶剂分子, 各种离子. 这样的结构可能与真空中的结构有差距, 也可能与溶液中的结构有差距. 如果要对溶液中蛋白质进行模拟, 可以先对蛋白质进行溶液中的能量最小化. 因为能量最小化可以比较迅速地将结构调整至能量较低的构型, 这样MD的时候就可以比较快地达到平衡了, 相对节约了时间. 如果模拟体系中还含有离子, 也可以添加离子和溶剂后再进行能量最小化.

- __蛋白质位置限制性模拟__ 有时添加溶剂分子和离子后, 体系中有些原子之间距离过近, 相互之间的作用力过大, 模拟时可能会导致蛋白质结构散掉甚至体系崩溃. 为避免此类问题, 可以先对蛋白质进行位置限制性模拟, 通过限制蛋白质中的重原子, 维持其结构. 等溶剂分子, 离子的位置调整好了之后再放开蛋白质分子的位置限制进行模拟.

- __NVT预平衡__ 做NPT模拟时盒子大小会改变, 如果初始体系内压力太大, 盒子可能改变太大, 从而引起体系崩溃. 为此, 先进行NVT模拟减小盒子的内压力, 再用NVT平衡好的结构作为初始结构进行NPT模拟可能会解决崩溃问题.

上面的三种方法可以根据具体情况选用, 也可以联合起来使用. 在这个教程中, 使用的预平衡方法就是能量最小化 -> 位置限制性NVT -> 位置限制性NPT. 其实, 如果蛋白质结构比较稳定, 只使用位置限制性NPT模拟作为预平衡也可以. 但为了保险起见, 还是建议至少使用能量最小化 -> 位置限制性NPT.

### 第一步: 获取并处理pdb文件

从[Protein Data Bank](http://www.rcsb.org/pdb/)下载小肽的pdb文件`1OMB.PDB`(或点击[这里](/GMX/1OMB.pdb)下载). 在Linux下你可使用如下命令:

`wget http://www.rcsb.org/pdb/files/1OMB.pdb`

下面是这个小肽的二级结构示意图.

<figure><script>var Mol1=new ChemDoodle.TransformCanvas3D('Mol-1',650,400);Mol1.specs.shapes_color = '#fff';Mol1.specs.backgroundColor = 'black';Mol1.specs.compass_display = true;Mol1.specs.set3DRepresentation('Ball and Stick');Mol1.specs.projectionPerspective_3D = false;Mol1.specs.proteins_ribbonCartoonize = true;Mol1.handle = null;Mol1.timeout = 15;Mol1.specs.crystals_unitCellLineWidth = 1.5;Mol1.specs.nucleics_residueColor = 'rainbow';Mol1.specs.proteins_residueColor= 'rainbow';Mol1.startAnimation = ChemDoodle._AnimatorCanvas.prototype.startAnimation;Mol1.stopAnimation = ChemDoodle._AnimatorCanvas.prototype.stopAnimation;Mol1.isRunning = ChemDoodle._AnimatorCanvas.prototype.isRunning;Mol1.dblclick = ChemDoodle.RotatorCanvas.prototype.dblclick;Mol1.nextFrame = function(delta){var matrix = [];ChemDoodle.lib.mat4.identity(matrix);var change = delta*Math.PI/15000;ChemDoodle.lib.mat4.rotate(matrix,change,[1,0,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,1,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,0,1]);ChemDoodle.lib.mat4.multiply(this.rotationMatrix, matrix)};var Fmol='HEADER    TOXIN                                   09-SEP-93   1OMB              \nTITLE     SEQUENTIAL ASSIGNMENT AND STRUCTURE DETERMINATION OF SPIDER           \nTITLE    2 TOXIN OMEGA-AGA-IVB                                                  \nCOMPND    MOL_ID: 1;                                                            \nCOMPND   2 MOLECULE: OMEGA-AGA-IVB;                                             \nCOMPND   3 CHAIN: A;                                                            \nCOMPND   4 ENGINEERED: YES                                                      \nSOURCE    MOL_ID: 1;                                                            \nSOURCE   2 ORGANISM_SCIENTIFIC: AGELENOPSIS APERTA;                             \nSOURCE   3 ORGANISM_TAXID: 6908                                                 \nKEYWDS    TOXIN                                                                 \nEXPDTA    SOLUTION NMR                                                          \nAUTHOR    H.YU,M.K.ROSEN,S.L.SCHREIBER                                          \nREVDAT   2   24-FEB-09 1OMB    1       VERSN                                    \nREVDAT   1   31-OCT-93 1OMB    0                                                \nJRNL        AUTH   H.YU,M.K.ROSEN,N.A.SACCOMANO,D.PHILLIPS,                     \nJRNL        AUTH 2 R.A.VOLKMANN,S.L.SCHREIBER                                   \nJRNL        TITL   SEQUENTIAL ASSIGNMENT AND STRUCTURE DETERMINATION            \nJRNL        TITL 2 OF SPIDER TOXIN OMEGA-AGA-IVB.                               \nJRNL        REF    BIOCHEMISTRY                  V.  32 13123 1993              \nJRNL        REFN                   ISSN 0006-2960                               \nJRNL        PMID   8241166                                                      \nJRNL        DOI    10.1021/BI00211A022                                          \nREMARK   1                                                                      \nREMARK   2                                                                      \nREMARK   2 RESOLUTION. NOT APPLICABLE.                                          \nREMARK   3                                                                      \nREMARK   3 REFINEMENT.                                                          \nREMARK   3   PROGRAM     : X-PLOR 3.1                                           \nREMARK   3   AUTHORS     : BRUNGER                                              \nREMARK   3                                                                      \nREMARK   3  OTHER REFINEMENT REMARKS: NULL                                      \nREMARK   4                                                                      \nREMARK   4 1OMB COMPLIES WITH FORMAT V. 3.15, 01-DEC-08                         \nREMARK 100                                                                      \nREMARK 100 THIS ENTRY HAS BEEN PROCESSED BY BNL.                                \nREMARK 210                                                                      \nREMARK 210 EXPERIMENTAL DETAILS                                                 \nREMARK 210  EXPERIMENT TYPE                : NMR                                \nREMARK 210  TEMPERATURE           (KELVIN) : NULL                               \nREMARK 210  PH                             : NULL                               \nREMARK 210  IONIC STRENGTH                 : NULL                               \nREMARK 210  PRESSURE                       : NULL                               \nREMARK 210  SAMPLE CONTENTS                : NULL                               \nREMARK 210                                                                      \nREMARK 210  NMR EXPERIMENTS CONDUCTED      : NULL                               \nREMARK 210  SPECTROMETER FIELD STRENGTH    : NULL                               \nREMARK 210  SPECTROMETER MODEL             : NULL                               \nREMARK 210  SPECTROMETER MANUFACTURER      : NULL                               \nREMARK 210                                                                      \nREMARK 210  STRUCTURE DETERMINATION.                                            \nREMARK 210   SOFTWARE USED                 : NULL                               \nREMARK 210   METHOD USED                   : NULL                               \nREMARK 210                                                                      \nREMARK 210 CONFORMERS, NUMBER CALCULATED   : NULL                               \nREMARK 210 CONFORMERS, NUMBER SUBMITTED    : 1                                  \nREMARK 210 CONFORMERS, SELECTION CRITERIA  : NULL                               \nREMARK 210                                                                      \nREMARK 210 BEST REPRESENTATIVE CONFORMER IN THIS ENSEMBLE : NULL                \nREMARK 210                                                                      \nREMARK 210 REMARK: NULL                                                         \nREMARK 215                                                                      \nREMARK 215 NMR STUDY                                                            \nREMARK 215 THE COORDINATES IN THIS ENTRY WERE GENERATED FROM SOLUTION           \nREMARK 215 NMR DATA.  PROTEIN DATA BANK CONVENTIONS REQUIRE THAT                \nREMARK 215 CRYST1 AND SCALE RECORDS BE INCLUDED, BUT THE VALUES ON              \nREMARK 215 THESE RECORDS ARE MEANINGLESS.                                       \nREMARK 465                                                                      \nREMARK 465 MISSING RESIDUES                                                     \nREMARK 465 THE FOLLOWING RESIDUES WERE NOT LOCATED IN THE                       \nREMARK 465 EXPERIMENT. (RES=RESIDUE NAME; C=CHAIN IDENTIFIER;                   \nREMARK 465 SSSEQ=SEQUENCE NUMBER; I=INSERTION CODE.)                            \nREMARK 465     RES C SSSEQI                                                     \nREMARK 465     GLU A     1                                                      \nREMARK 465     ASP A     2                                                      \nREMARK 465     ASN A     3                                                      \nREMARK 465     ARG A    39                                                      \nREMARK 465     LEU A    40                                                      \nREMARK 465     ILE A    41                                                      \nREMARK 465     MET A    42                                                      \nREMARK 465     GLU A    43                                                      \nREMARK 465     GLY A    44                                                      \nREMARK 465     LEU A    45                                                      \nREMARK 465     SER A    46                                                      \nREMARK 465     PHE A    47                                                      \nREMARK 465     ALA A    48                                                      \nREMARK 470                                                                      \nREMARK 470 MISSING ATOM                                                         \nREMARK 470 THE FOLLOWING RESIDUES HAVE MISSING ATOMS(RES=RESIDUE NAME;          \nREMARK 470 C=CHAIN IDENTIFIER; SSEQ=SEQUENCE NUMBER; I=INSERTION CODE):         \nREMARK 470     RES CSSEQI  ATOMS                                                \nREMARK 470     PRO A  38    O                                                   \nREMARK 500                                                                      \nREMARK 500 GEOMETRY AND STEREOCHEMISTRY                                         \nREMARK 500 SUBTOPIC: COVALENT BOND ANGLES                                       \nREMARK 500                                                                      \nREMARK 500 THE STEREOCHEMICAL PARAMETERS OF THE FOLLOWING RESIDUES              \nREMARK 500 HAVE VALUES WHICH DEVIATE FROM EXPECTED VALUES BY MORE               \nREMARK 500 THAN 6*RMSD (M=MODEL NUMBER; RES=RESIDUE NAME; C=CHAIN               \nREMARK 500 IDENTIFIER; SSEQ=SEQUENCE NUMBER; I=INSERTION CODE).                 \nREMARK 500                                                                      \nREMARK 500 STANDARD TABLE:                                                      \nREMARK 500 FORMAT: (10X,I3,1X,A3,1X,A1,I4,A1,3(1X,A4,2X),12X,F5.1)              \nREMARK 500                                                                      \nREMARK 500 EXPECTED VALUES PROTEIN: ENGH AND HUBER, 1999                        \nREMARK 500 EXPECTED VALUES NUCLEIC ACID: CLOWNEY ET AL 1996                     \nREMARK 500                                                                      \nREMARK 500  M RES CSSEQI ATM1   ATM2   ATM3                                     \nREMARK 500    TRP A  14   CG  -  CD1 -  NE1 ANGL. DEV. =  -6.5 DEGREES          \nREMARK 500    TRP A  14   CD1 -  NE1 -  CE2 ANGL. DEV. =   6.1 DEGREES          \nREMARK 500    TRP A  14   NE1 -  CE2 -  CZ2 ANGL. DEV. =   8.7 DEGREES          \nREMARK 500    TRP A  14   NE1 -  CE2 -  CD2 ANGL. DEV. =  -6.4 DEGREES          \nREMARK 500                                                                      \nREMARK 500 REMARK: NULL                                                         \nREMARK 500                                                                      \nREMARK 500 GEOMETRY AND STEREOCHEMISTRY                                         \nREMARK 500 SUBTOPIC: TORSION ANGLES                                             \nREMARK 500                                                                      \nREMARK 500 TORSION ANGLES OUTSIDE THE EXPECTED RAMACHANDRAN REGIONS:            \nREMARK 500 (M=MODEL NUMBER; RES=RESIDUE NAME; C=CHAIN IDENTIFIER;               \nREMARK 500 SSEQ=SEQUENCE NUMBER; I=INSERTION CODE).                             \nREMARK 500                                                                      \nREMARK 500 STANDARD TABLE:                                                      \nREMARK 500 FORMAT:(10X,I3,1X,A3,1X,A1,I4,A1,4X,F7.2,3X,F7.2)                    \nREMARK 500                                                                      \nREMARK 500 EXPECTED VALUES: GJ KLEYWEGT AND TA JONES (1996). PHI/PSI-           \nREMARK 500 CHOLOGY: RAMACHANDRAN REVISITED. STRUCTURE 4, 1395 - 1400            \nREMARK 500                                                                      \nREMARK 500  M RES CSSEQI        PSI       PHI                                   \nREMARK 500    TYR A   9       16.51     58.64                                   \nREMARK 500    ARG A  21      -41.92     83.28                                   \nREMARK 500    SER A  28       33.70    -95.31                                   \nREMARK 500    THR A  32      -87.31   -134.16                                   \nREMARK 500                                                                      \nREMARK 500 REMARK: NULL                                                         \nREMARK 500                                                                      \nREMARK 500 GEOMETRY AND STEREOCHEMISTRY                                         \nREMARK 500 SUBTOPIC: PLANAR GROUPS                                              \nREMARK 500                                                                      \nREMARK 500 PLANAR GROUPS IN THE FOLLOWING RESIDUES HAVE A TOTAL                 \nREMARK 500 RMS DISTANCE OF ALL ATOMS FROM THE BEST-FIT PLANE                    \nREMARK 500 BY MORE THAN AN EXPECTED VALUE OF 6*RMSD, WITH AN                    \nREMARK 500 RMSD 0.02 ANGSTROMS, OR AT LEAST ONE ATOM HAS                        \nREMARK 500 AN RMSD GREATER THAN THIS VALUE                                      \nREMARK 500 (M=MODEL NUMBER; RES=RESIDUE NAME; C=CHAIN IDENTIFIER;               \nREMARK 500 SSEQ=SEQUENCE NUMBER; I=INSERTION CODE).                             \nREMARK 500                                                                      \nREMARK 500  M RES CSSEQI        RMS     TYPE                                    \nREMARK 500    ARG A  21         0.17    SIDE_CHAIN                              \nREMARK 500    ARG A  23         0.22    SIDE_CHAIN                              \nREMARK 500    ARG A  26         0.30    SIDE_CHAIN                              \nREMARK 500                                                                      \nREMARK 500 REMARK: NULL                                                         \nREMARK 900                                                                      \nREMARK 900 RELATED ENTRIES                                                      \nREMARK 900 RELATED ID: 1OMA   RELATED DB: PDB                                   \nDBREF  1OMB A    1    48  UNP    P37045   TOG4B_AGEAP     36     83             \nSEQRES   1 A   48  GLU ASP ASN CYS ILE ALA GLU ASP TYR GLY LYS CYS THR          \nSEQRES   2 A   48  TRP GLY GLY THR LYS CYS CYS ARG GLY ARG PRO CYS ARG          \nSEQRES   3 A   48  CYS SER MET ILE GLY THR ASN CYS GLU CYS THR PRO ARG          \nSEQRES   4 A   48  LEU ILE MET GLU GLY LEU SER PHE ALA                          \nSHEET    1  S1 3 GLY A  10  CYS A  12  0                                        \nSHEET    2  S1 3 CYS A  34  CYS A  36 -1  N  CYS A  36   O  GLY A  10           \nSHEET    3  S1 3 ARG A  26  CYS A  27 -1  O  ARG A  26   N  GLU A  35           \nSSBOND   1 CYS A    4    CYS A   20                          1555   1555  2.02  \nSSBOND   2 CYS A   12    CYS A   25                          1555   1555  2.02  \nSSBOND   3 CYS A   19    CYS A   36                          1555   1555  2.02  \nSSBOND   4 CYS A   27    CYS A   34                          1555   1555  2.02  \nCRYST1    1.000    1.000    1.000  90.00  90.00  90.00 P 1           1          \nORIGX1      1.000000  0.000000  0.000000        0.00000                         \nORIGX2      0.000000  1.000000  0.000000        0.00000                         \nORIGX3      0.000000  0.000000  1.000000        0.00000                         \nSCALE1      1.000000  0.000000  0.000000        0.00000                         \nSCALE2      0.000000  1.000000  0.000000        0.00000                         \nSCALE3      0.000000  0.000000  1.000000        0.00000                         \nATOM      1  N   CYS A   4      -4.232 -17.209 -14.076  1.00  1.39           N  \nATOM      2  CA  CYS A   4      -4.104 -17.623 -12.650  1.00  1.09           C  \nATOM      3  C   CYS A   4      -4.102 -19.151 -12.561  1.00  0.92           C  \nATOM      4  O   CYS A   4      -4.060 -19.841 -13.560  1.00  1.24           O  \nATOM      5  CB  CYS A   4      -5.283 -17.066 -11.849  1.00  1.18           C  \nATOM      6  SG  CYS A   4      -6.804 -17.916 -12.339  1.00  1.51           S  \nATOM      7  H   CYS A   4      -4.946 -17.800 -14.546  1.00  1.37           H  \nATOM      8  HA  CYS A   4      -3.180 -17.239 -12.245  1.00  1.17           H  \nATOM      9  HB2 CYS A   4      -5.107 -17.221 -10.795  1.00  1.26           H  \nATOM     10  HB3 CYS A   4      -5.383 -16.008 -12.045  1.00  1.31           H  \nATOM     11  N   ILE A   5      -4.149 -19.684 -11.371  1.00  0.66           N  \nATOM     12  CA  ILE A   5      -4.150 -21.166 -11.217  1.00  0.56           C  \nATOM     13  C   ILE A   5      -5.569 -21.642 -10.894  1.00  0.56           C  \nATOM     14  O   ILE A   5      -5.936 -21.796  -9.746  1.00  0.67           O  \nATOM     15  CB  ILE A   5      -3.207 -21.560 -10.079  1.00  0.63           C  \nATOM     16  CG1 ILE A   5      -1.873 -20.831 -10.245  1.00  0.74           C  \nATOM     17  CG2 ILE A   5      -2.969 -23.071 -10.115  1.00  0.86           C  \nATOM     18  CD1 ILE A   5      -0.988 -21.102  -9.027  1.00  0.83           C  \nATOM     19  H   ILE A   5      -4.183 -19.110 -10.578  1.00  0.79           H  \nATOM     20  HA  ILE A   5      -3.817 -21.625 -12.136  1.00  0.66           H  \nATOM     21  HB  ILE A   5      -3.651 -21.286  -9.132  1.00  0.67           H  \nATOM     22 HG12 ILE A   5      -1.377 -21.185 -11.137  1.00  1.01           H  \nATOM     23 HG13 ILE A   5      -2.051 -19.769 -10.331  1.00  1.09           H  \nATOM     24 HG21 ILE A   5      -3.917 -23.586 -10.058  1.00  1.44           H  \nATOM     25 HG22 ILE A   5      -2.471 -23.335 -11.036  1.00  1.22           H  \nATOM     26 HG23 ILE A   5      -2.352 -23.359  -9.277  1.00  1.43           H  \nATOM     27 HD11 ILE A   5      -0.811 -22.164  -8.939  1.00  1.34           H  \nATOM     28 HD12 ILE A   5      -0.045 -20.589  -9.146  1.00  1.43           H  \nATOM     29 HD13 ILE A   5      -1.482 -20.743  -8.136  1.00  1.39           H  \nATOM     30  N   ALA A   6      -6.369 -21.876 -11.899  1.00  0.61           N  \nATOM     31  CA  ALA A   6      -7.763 -22.341 -11.650  1.00  0.73           C  \nATOM     32  C   ALA A   6      -7.810 -23.870 -11.689  1.00  0.74           C  \nATOM     33  O   ALA A   6      -8.868 -24.467 -11.717  1.00  1.10           O  \nATOM     34  CB  ALA A   6      -8.687 -21.775 -12.730  1.00  0.93           C  \nATOM     35  H   ALA A   6      -6.052 -21.747 -12.817  1.00  0.68           H  \nATOM     36  HA  ALA A   6      -8.089 -21.996 -10.680  1.00  0.76           H  \nATOM     37  HB1 ALA A   6      -8.606 -20.698 -12.744  1.00  1.31           H  \nATOM     38  HB2 ALA A   6      -8.399 -22.170 -13.693  1.00  1.61           H  \nATOM     39  HB3 ALA A   6      -9.707 -22.057 -12.515  1.00  1.18           H  \nATOM     40  N   GLU A   7      -6.672 -24.510 -11.692  1.00  0.64           N  \nATOM     41  CA  GLU A   7      -6.658 -25.999 -11.729  1.00  0.71           C  \nATOM     42  C   GLU A   7      -6.703 -26.543 -10.299  1.00  0.71           C  \nATOM     43  O   GLU A   7      -6.407 -25.844  -9.351  1.00  0.71           O  \nATOM     44  CB  GLU A   7      -5.381 -26.482 -12.420  1.00  0.70           C  \nATOM     45  CG  GLU A   7      -5.730 -27.042 -13.801  1.00  1.13           C  \nATOM     46  CD  GLU A   7      -4.447 -27.473 -14.516  1.00  1.64           C  \nATOM     47  OE1 GLU A   7      -3.395 -27.386 -13.906  1.00  2.18           O  \nATOM     48  OE2 GLU A   7      -4.540 -27.883 -15.661  1.00  2.28           O  \nATOM     49  H   GLU A   7      -5.829 -24.012 -11.669  1.00  0.82           H  \nATOM     50  HA  GLU A   7      -7.520 -26.354 -12.276  1.00  0.82           H  \nATOM     51  HB2 GLU A   7      -4.696 -25.654 -12.530  1.00  0.91           H  \nATOM     52  HB3 GLU A   7      -4.919 -27.255 -11.825  1.00  1.08           H  \nATOM     53  HG2 GLU A   7      -6.384 -27.894 -13.690  1.00  1.65           H  \nATOM     54  HG3 GLU A   7      -6.227 -26.280 -14.384  1.00  1.73           H  \nATOM     55  N   ASP A   8      -7.073 -27.783 -10.137  1.00  0.81           N  \nATOM     56  CA  ASP A   8      -7.137 -28.368  -8.768  1.00  0.86           C  \nATOM     57  C   ASP A   8      -5.729 -28.762  -8.317  1.00  0.76           C  \nATOM     58  O   ASP A   8      -4.990 -29.398  -9.043  1.00  0.85           O  \nATOM     59  CB  ASP A   8      -8.035 -29.608  -8.780  1.00  1.13           C  \nATOM     60  CG  ASP A   8      -9.141 -29.431  -9.824  1.00  1.80           C  \nATOM     61  OD1 ASP A   8     -10.044 -28.648  -9.575  1.00  2.35           O  \nATOM     62  OD2 ASP A   8      -9.067 -30.081 -10.854  1.00  2.46           O  \nATOM     63  H   ASP A   8      -7.308 -28.331 -10.915  1.00  0.90           H  \nATOM     64  HA  ASP A   8      -7.542 -27.637  -8.083  1.00  0.87           H  \nATOM     65  HB2 ASP A   8      -7.445 -30.478  -9.027  1.00  1.53           H  \nATOM     66  HB3 ASP A   8      -8.480 -29.740  -7.805  1.00  1.33           H  \nATOM     67  N   TYR A   9      -5.351 -28.389  -7.125  1.00  0.69           N  \nATOM     68  CA  TYR A   9      -3.990 -28.742  -6.628  1.00  0.78           C  \nATOM     69  C   TYR A   9      -2.933 -28.166  -7.572  1.00  0.72           C  \nATOM     70  O   TYR A   9      -1.784 -28.561  -7.547  1.00  0.78           O  \nATOM     71  CB  TYR A   9      -3.847 -30.265  -6.570  1.00  1.01           C  \nATOM     72  CG  TYR A   9      -4.746 -30.816  -5.464  1.00  0.99           C  \nATOM     73  CD1 TYR A   9      -6.113 -30.651  -5.531  1.00  1.65           C  \nATOM     74  CD2 TYR A   9      -4.204 -31.480  -4.384  1.00  1.46           C  \nATOM     75  CE1 TYR A   9      -6.927 -31.143  -4.533  1.00  1.71           C  \nATOM     76  CE2 TYR A   9      -5.018 -31.973  -3.385  1.00  1.58           C  \nATOM     77  CZ  TYR A   9      -6.386 -31.808  -3.452  1.00  1.23           C  \nATOM     78  OH  TYR A   9      -7.201 -32.297  -2.451  1.00  1.43           O  \nATOM     79  H   TYR A   9      -5.965 -27.879  -6.554  1.00  0.68           H  \nATOM     80  HA  TYR A   9      -3.851 -28.331  -5.639  1.00  0.83           H  \nATOM     81  HB2 TYR A   9      -4.141 -30.691  -7.517  1.00  1.17           H  \nATOM     82  HB3 TYR A   9      -2.819 -30.523  -6.361  1.00  1.20           H  \nATOM     83  HD1 TYR A   9      -6.550 -30.134  -6.373  1.00  2.46           H  \nATOM     84  HD2 TYR A   9      -3.135 -31.618  -4.321  1.00  2.21           H  \nATOM     85  HE1 TYR A   9      -7.996 -31.007  -4.600  1.00  2.50           H  \nATOM     86  HE2 TYR A   9      -4.581 -32.492  -2.546  1.00  2.37           H  \nATOM     87  HH  TYR A   9      -7.337 -33.234  -2.610  1.00  1.74           H  \nATOM     88  N   GLY A  10      -3.310 -27.234  -8.404  1.00  0.64           N  \nATOM     89  CA  GLY A  10      -2.323 -26.634  -9.347  1.00  0.61           C  \nATOM     90  C   GLY A  10      -1.119 -26.115  -8.559  1.00  0.62           C  \nATOM     91  O   GLY A  10      -1.264 -25.493  -7.526  1.00  0.72           O  \nATOM     92  H   GLY A  10      -4.241 -26.928  -8.408  1.00  0.62           H  \nATOM     93  HA2 GLY A  10      -1.997 -27.384 -10.053  1.00  0.67           H  \nATOM     94  HA3 GLY A  10      -2.786 -25.815  -9.879  1.00  0.59           H  \nATOM     95  N   LYS A  11       0.070 -26.365  -9.037  1.00  0.65           N  \nATOM     96  CA  LYS A  11       1.278 -25.882  -8.310  1.00  0.69           C  \nATOM     97  C   LYS A  11       1.198 -24.365  -8.144  1.00  0.63           C  \nATOM     98  O   LYS A  11       0.678 -23.665  -8.991  1.00  0.69           O  \nATOM     99  CB  LYS A  11       2.535 -26.243  -9.105  1.00  0.79           C  \nATOM    100  CG  LYS A  11       3.613 -26.754  -8.146  1.00  1.52           C  \nATOM    101  CD  LYS A  11       4.420 -27.862  -8.826  1.00  2.13           C  \nATOM    102  CE  LYS A  11       5.568 -27.241  -9.623  1.00  2.78           C  \nATOM    103  NZ  LYS A  11       5.978 -28.173 -10.711  1.00  3.37           N  \nATOM    104  H   LYS A  11       0.168 -26.868  -9.872  1.00  0.74           H  \nATOM    105  HA  LYS A  11       1.322 -26.349  -7.337  1.00  0.74           H  \nATOM    106  HB2 LYS A  11       2.299 -27.012  -9.825  1.00  1.17           H  \nATOM    107  HB3 LYS A  11       2.899 -25.366  -9.620  1.00  1.26           H  \nATOM    108  HG2 LYS A  11       4.272 -25.941  -7.878  1.00  2.01           H  \nATOM    109  HG3 LYS A  11       3.144 -27.145  -7.255  1.00  2.03           H  \nATOM    110  HD2 LYS A  11       4.821 -28.527  -8.076  1.00  2.55           H  \nATOM    111  HD3 LYS A  11       3.777 -28.417  -9.493  1.00  2.47           H  \nATOM    112  HE2 LYS A  11       5.243 -26.305 -10.054  1.00  3.13           H  \nATOM    113  HE3 LYS A  11       6.407 -27.063  -8.967  1.00  3.17           H  \nATOM    114  HZ1 LYS A  11       5.131 -28.578 -11.158  1.00  3.66           H  \nATOM    115  HZ2 LYS A  11       6.530 -27.653 -11.423  1.00  3.74           H  \nATOM    116  HZ3 LYS A  11       6.560 -28.937 -10.312  1.00  3.64           H  \nATOM    117  N   CYS A  12       1.709 -23.848  -7.060  1.00  0.69           N  \nATOM    118  CA  CYS A  12       1.659 -22.375  -6.847  1.00  0.70           C  \nATOM    119  C   CYS A  12       2.949 -21.904  -6.177  1.00  0.79           C  \nATOM    120  O   CYS A  12       3.908 -22.641  -6.058  1.00  0.90           O  \nATOM    121  CB  CYS A  12       0.472 -22.027  -5.948  1.00  0.71           C  \nATOM    122  SG  CYS A  12       0.728 -22.748  -4.307  1.00  0.95           S  \nATOM    123  H   CYS A  12       2.124 -24.428  -6.388  1.00  0.83           H  \nATOM    124  HA  CYS A  12       1.546 -21.876  -7.797  1.00  0.76           H  \nATOM    125  HB2 CYS A  12       0.389 -20.954  -5.860  1.00  0.79           H  \nATOM    126  HB3 CYS A  12      -0.434 -22.423  -6.379  1.00  0.76           H  \nATOM    127  N   THR A  13       2.973 -20.678  -5.737  1.00  0.82           N  \nATOM    128  CA  THR A  13       4.193 -20.143  -5.072  1.00  0.97           C  \nATOM    129  C   THR A  13       3.783 -19.084  -4.047  1.00  0.95           C  \nATOM    130  O   THR A  13       2.919 -18.267  -4.299  1.00  0.98           O  \nATOM    131  CB  THR A  13       5.112 -19.511  -6.121  1.00  1.11           C  \nATOM    132  OG1 THR A  13       5.194 -20.367  -7.252  1.00  1.29           O  \nATOM    133  CG2 THR A  13       6.508 -19.311  -5.528  1.00  1.44           C  \nATOM    134  H   THR A  13       2.184 -20.107  -5.844  1.00  0.80           H  \nATOM    135  HA  THR A  13       4.714 -20.946  -4.571  1.00  1.08           H  \nATOM    136  HB  THR A  13       4.713 -18.555  -6.421  1.00  1.07           H  \nATOM    137  HG1 THR A  13       4.794 -19.912  -7.998  1.00  1.64           H  \nATOM    138 HG21 THR A  13       6.423 -18.834  -4.563  1.00  1.87           H  \nATOM    139 HG22 THR A  13       6.992 -20.270  -5.415  1.00  1.85           H  \nATOM    140 HG23 THR A  13       7.093 -18.688  -6.188  1.00  1.65           H  \nATOM    141  N   TRP A  14       4.390 -19.092  -2.893  1.00  1.15           N  \nATOM    142  CA  TRP A  14       4.030 -18.083  -1.857  1.00  1.19           C  \nATOM    143  C   TRP A  14       4.522 -16.704  -2.298  1.00  1.30           C  \nATOM    144  O   TRP A  14       5.673 -16.359  -2.119  1.00  1.64           O  \nATOM    145  CB  TRP A  14       4.684 -18.459  -0.527  1.00  1.35           C  \nATOM    146  CG  TRP A  14       3.691 -19.259   0.319  1.00  1.28           C  \nATOM    147  CD1 TRP A  14       2.651 -19.957  -0.167  1.00  1.33           C  \nATOM    148  CD2 TRP A  14       3.728 -19.363   1.645  1.00  1.61           C  \nATOM    149  NE1 TRP A  14       2.081 -20.472   0.924  1.00  1.50           N  \nATOM    150  CE2 TRP A  14       2.688 -20.153   2.096  1.00  1.77           C  \nATOM    151  CE3 TRP A  14       4.617 -18.813   2.546  1.00  2.07           C  \nATOM    152  CZ2 TRP A  14       2.539 -20.392   3.447  1.00  2.34           C  \nATOM    153  CZ3 TRP A  14       4.468 -19.053   3.897  1.00  2.68           C  \nATOM    154  CH2 TRP A  14       3.429 -19.842   4.347  1.00  2.80           C  \nATOM    155  H   TRP A  14       5.082 -19.760  -2.707  1.00  1.39           H  \nATOM    156  HA  TRP A  14       2.956 -18.059  -1.737  1.00  1.11           H  \nATOM    157  HB2 TRP A  14       5.562 -19.058  -0.714  1.00  1.63           H  \nATOM    158  HB3 TRP A  14       4.966 -17.561   0.002  1.00  1.41           H  \nATOM    159  HD1 TRP A  14       2.347 -20.073  -1.197  1.00  1.56           H  \nATOM    160  HE1 TRP A  14       1.284 -21.040   0.882  1.00  1.67           H  \nATOM    161  HE3 TRP A  14       5.431 -18.196   2.194  1.00  2.09           H  \nATOM    162  HZ2 TRP A  14       1.725 -21.009   3.799  1.00  2.55           H  \nATOM    163  HZ3 TRP A  14       5.164 -18.623   4.602  1.00  3.14           H  \nATOM    164  HH2 TRP A  14       3.312 -20.029   5.404  1.00  3.34           H  \nATOM    165  N   GLY A  15       3.659 -15.912  -2.872  1.00  1.20           N  \nATOM    166  CA  GLY A  15       4.077 -14.555  -3.324  1.00  1.36           C  \nATOM    167  C   GLY A  15       4.087 -14.507  -4.854  1.00  1.22           C  \nATOM    168  O   GLY A  15       4.280 -13.465  -5.449  1.00  1.58           O  \nATOM    169  H   GLY A  15       2.735 -16.209  -3.005  1.00  1.18           H  \nATOM    170  HA2 GLY A  15       3.382 -13.820  -2.945  1.00  1.48           H  \nATOM    171  HA3 GLY A  15       5.067 -14.341  -2.950  1.00  1.56           H  \nATOM    172  N   GLY A  16       3.880 -15.625  -5.495  1.00  1.00           N  \nATOM    173  CA  GLY A  16       3.878 -15.641  -6.985  1.00  0.96           C  \nATOM    174  C   GLY A  16       2.446 -15.823  -7.494  1.00  0.83           C  \nATOM    175  O   GLY A  16       1.542 -15.112  -7.100  1.00  0.92           O  \nATOM    176  H   GLY A  16       3.726 -16.455  -4.997  1.00  1.14           H  \nATOM    177  HA2 GLY A  16       4.275 -14.707  -7.356  1.00  1.12           H  \nATOM    178  HA3 GLY A  16       4.491 -16.457  -7.337  1.00  1.05           H  \nATOM    179  N   THR A  17       2.232 -16.770  -8.366  1.00  0.81           N  \nATOM    180  CA  THR A  17       0.859 -16.997  -8.898  1.00  0.83           C  \nATOM    181  C   THR A  17      -0.028 -17.589  -7.800  1.00  0.77           C  \nATOM    182  O   THR A  17       0.186 -18.695  -7.346  1.00  0.90           O  \nATOM    183  CB  THR A  17       0.926 -17.970 -10.078  1.00  1.01           C  \nATOM    184  OG1 THR A  17       2.149 -17.781 -10.776  1.00  1.29           O  \nATOM    185  CG2 THR A  17      -0.249 -17.711 -11.021  1.00  1.20           C  \nATOM    186  H   THR A  17       2.974 -17.333  -8.670  1.00  0.93           H  \nATOM    187  HA  THR A  17       0.442 -16.058  -9.231  1.00  0.91           H  \nATOM    188  HB  THR A  17       0.872 -18.983  -9.712  1.00  1.04           H  \nATOM    189  HG1 THR A  17       2.118 -16.921 -11.202  1.00  1.68           H  \nATOM    190 HG21 THR A  17      -1.049 -17.232 -10.476  1.00  1.51           H  \nATOM    191 HG22 THR A  17       0.072 -17.068 -11.828  1.00  1.65           H  \nATOM    192 HG23 THR A  17      -0.600 -18.649 -11.425  1.00  1.70           H  \nATOM    193  N   LYS A  18      -1.023 -16.861  -7.371  1.00  0.76           N  \nATOM    194  CA  LYS A  18      -1.922 -17.384  -6.302  1.00  0.82           C  \nATOM    195  C   LYS A  18      -3.121 -18.085  -6.946  1.00  0.70           C  \nATOM    196  O   LYS A  18      -3.360 -17.970  -8.131  1.00  0.74           O  \nATOM    197  CB  LYS A  18      -2.399 -16.217  -5.425  1.00  1.02           C  \nATOM    198  CG  LYS A  18      -3.699 -16.587  -4.700  1.00  1.49           C  \nATOM    199  CD  LYS A  18      -4.162 -15.405  -3.847  1.00  2.04           C  \nATOM    200  CE  LYS A  18      -3.295 -15.315  -2.590  1.00  2.54           C  \nATOM    201  NZ  LYS A  18      -3.498 -13.990  -1.940  1.00  3.06           N  \nATOM    202  H   LYS A  18      -1.178 -15.971  -7.750  1.00  0.84           H  \nATOM    203  HA  LYS A  18      -1.379 -18.091  -5.693  1.00  0.91           H  \nATOM    204  HB2 LYS A  18      -1.640 -15.992  -4.693  1.00  1.32           H  \nATOM    205  HB3 LYS A  18      -2.568 -15.348  -6.043  1.00  1.28           H  \nATOM    206  HG2 LYS A  18      -4.461 -16.827  -5.426  1.00  1.82           H  \nATOM    207  HG3 LYS A  18      -3.525 -17.442  -4.064  1.00  1.83           H  \nATOM    208  HD2 LYS A  18      -4.069 -14.491  -4.415  1.00  2.54           H  \nATOM    209  HD3 LYS A  18      -5.195 -15.548  -3.563  1.00  2.41           H  \nATOM    210  HE2 LYS A  18      -3.575 -16.100  -1.903  1.00  2.84           H  \nATOM    211  HE3 LYS A  18      -2.256 -15.427  -2.862  1.00  2.97           H  \nATOM    212  HZ1 LYS A  18      -3.590 -13.257  -2.671  1.00  3.27           H  \nATOM    213  HZ2 LYS A  18      -4.364 -14.016  -1.365  1.00  3.49           H  \nATOM    214  HZ3 LYS A  18      -2.683 -13.773  -1.332  1.00  3.38           H  \nATOM    215  N   CYS A  19      -3.873 -18.812  -6.168  1.00  0.78           N  \nATOM    216  CA  CYS A  19      -5.058 -19.525  -6.724  1.00  0.71           C  \nATOM    217  C   CYS A  19      -6.141 -18.508  -7.090  1.00  0.74           C  \nATOM    218  O   CYS A  19      -6.364 -17.543  -6.386  1.00  1.13           O  \nATOM    219  CB  CYS A  19      -5.607 -20.495  -5.675  1.00  0.74           C  \nATOM    220  SG  CYS A  19      -5.953 -22.093  -6.450  1.00  0.80           S  \nATOM    221  H   CYS A  19      -3.655 -18.890  -5.216  1.00  0.97           H  \nATOM    222  HA  CYS A  19      -4.767 -20.075  -7.606  1.00  0.74           H  \nATOM    223  HB2 CYS A  19      -4.878 -20.626  -4.889  1.00  1.16           H  \nATOM    224  HB3 CYS A  19      -6.518 -20.094  -5.257  1.00  0.94           H  \nATOM    225  N   CYS A  20      -6.818 -18.715  -8.187  1.00  0.92           N  \nATOM    226  CA  CYS A  20      -7.885 -17.759  -8.595  1.00  1.04           C  \nATOM    227  C   CYS A  20      -8.936 -17.668  -7.485  1.00  1.13           C  \nATOM    228  O   CYS A  20      -9.180 -18.622  -6.775  1.00  1.90           O  \nATOM    229  CB  CYS A  20      -8.545 -18.250  -9.886  1.00  1.12           C  \nATOM    230  SG  CYS A  20      -8.242 -17.054 -11.211  1.00  1.54           S  \nATOM    231  H   CYS A  20      -6.623 -19.499  -8.742  1.00  1.27           H  \nATOM    232  HA  CYS A  20      -7.451 -16.784  -8.761  1.00  1.15           H  \nATOM    233  HB2 CYS A  20      -8.127 -19.207 -10.162  1.00  1.17           H  \nATOM    234  HB3 CYS A  20      -9.609 -18.353  -9.730  1.00  1.19           H  \nATOM    235  N   ARG A  21      -9.549 -16.521  -7.330  1.00  1.15           N  \nATOM    236  CA  ARG A  21     -10.588 -16.346  -6.269  1.00  1.28           C  \nATOM    237  C   ARG A  21      -9.918 -16.029  -4.929  1.00  1.05           C  \nATOM    238  O   ARG A  21     -10.370 -15.183  -4.184  1.00  1.47           O  \nATOM    239  CB  ARG A  21     -11.427 -17.620  -6.134  1.00  1.68           C  \nATOM    240  CG  ARG A  21     -11.755 -18.167  -7.525  1.00  2.26           C  \nATOM    241  CD  ARG A  21     -13.080 -18.930  -7.472  1.00  2.81           C  \nATOM    242  NE  ARG A  21     -13.873 -18.635  -8.699  1.00  3.34           N  \nATOM    243  CZ  ARG A  21     -15.019 -18.019  -8.604  1.00  4.01           C  \nATOM    244  NH1 ARG A  21     -15.780 -18.212  -7.562  1.00  4.74           N  \nATOM    245  NH2 ARG A  21     -15.405 -17.208  -9.552  1.00  4.37           N  \nATOM    246  H   ARG A  21      -9.323 -15.769  -7.915  1.00  1.67           H  \nATOM    247  HA  ARG A  21     -11.232 -15.525  -6.540  1.00  1.66           H  \nATOM    248  HB2 ARG A  21     -10.873 -18.361  -5.577  1.00  1.91           H  \nATOM    249  HB3 ARG A  21     -12.345 -17.392  -5.613  1.00  1.96           H  \nATOM    250  HG2 ARG A  21     -11.839 -17.347  -8.223  1.00  2.65           H  \nATOM    251  HG3 ARG A  21     -10.969 -18.833  -7.845  1.00  2.66           H  \nATOM    252  HD2 ARG A  21     -12.883 -19.990  -7.417  1.00  3.23           H  \nATOM    253  HD3 ARG A  21     -13.639 -18.622  -6.600  1.00  3.12           H  \nATOM    254  HE  ARG A  21     -13.533 -18.905  -9.578  1.00  3.57           H  \nATOM    255 HH11 ARG A  21     -15.485 -18.833  -6.835  1.00  4.83           H  \nATOM    256 HH12 ARG A  21     -16.659 -17.740  -7.489  1.00  5.43           H  \nATOM    257 HH21 ARG A  21     -14.822 -17.060 -10.351  1.00  4.18           H  \nATOM    258 HH22 ARG A  21     -16.283 -16.736  -9.479  1.00  5.09           H  \nATOM    259  N   GLY A  22      -8.846 -16.700  -4.616  1.00  0.99           N  \nATOM    260  CA  GLY A  22      -8.151 -16.435  -3.324  1.00  1.32           C  \nATOM    261  C   GLY A  22      -8.185 -17.695  -2.458  1.00  1.06           C  \nATOM    262  O   GLY A  22      -8.776 -17.714  -1.397  1.00  1.18           O  \nATOM    263  H   GLY A  22      -8.499 -17.379  -5.227  1.00  1.19           H  \nATOM    264  HA2 GLY A  22      -7.125 -16.158  -3.518  1.00  1.62           H  \nATOM    265  HA3 GLY A  22      -8.649 -15.628  -2.806  1.00  1.73           H  \nATOM    266  N   ARG A  23      -7.556 -18.749  -2.903  1.00  1.02           N  \nATOM    267  CA  ARG A  23      -7.554 -20.007  -2.104  1.00  0.90           C  \nATOM    268  C   ARG A  23      -6.170 -20.210  -1.475  1.00  0.79           C  \nATOM    269  O   ARG A  23      -5.165 -19.938  -2.101  1.00  0.86           O  \nATOM    270  CB  ARG A  23      -7.870 -21.191  -3.019  1.00  0.93           C  \nATOM    271  CG  ARG A  23      -8.949 -20.789  -4.025  1.00  1.20           C  \nATOM    272  CD  ARG A  23      -9.632 -22.047  -4.567  1.00  1.55           C  \nATOM    273  NE  ARG A  23     -11.008 -22.148  -4.004  1.00  1.97           N  \nATOM    274  CZ  ARG A  23     -12.037 -22.213  -4.803  1.00  2.55           C  \nATOM    275  NH1 ARG A  23     -12.016 -23.017  -5.831  1.00  3.15           N  \nATOM    276  NH2 ARG A  23     -13.089 -21.475  -4.574  1.00  3.13           N  \nATOM    277  H   ARG A  23      -7.086 -18.712  -3.762  1.00  1.27           H  \nATOM    278  HA  ARG A  23      -8.302 -19.940  -1.329  1.00  1.04           H  \nATOM    279  HB2 ARG A  23      -6.975 -21.483  -3.550  1.00  0.98           H  \nATOM    280  HB3 ARG A  23      -8.222 -22.021  -2.425  1.00  1.26           H  \nATOM    281  HG2 ARG A  23      -9.681 -20.164  -3.537  1.00  1.84           H  \nATOM    282  HG3 ARG A  23      -8.497 -20.245  -4.841  1.00  1.61           H  \nATOM    283  HD2 ARG A  23      -9.687 -21.993  -5.644  1.00  2.11           H  \nATOM    284  HD3 ARG A  23      -9.061 -22.918  -4.279  1.00  2.01           H  \nATOM    285  HE  ARG A  23     -11.140 -22.166  -3.033  1.00  2.33           H  \nATOM    286 HH11 ARG A  23     -11.211 -23.583  -6.006  1.00  3.30           H  \nATOM    287 HH12 ARG A  23     -12.805 -23.066  -6.444  1.00  3.78           H  \nATOM    288 HH21 ARG A  23     -13.106 -20.859  -3.786  1.00  3.28           H  \nATOM    289 HH22 ARG A  23     -13.877 -21.524  -5.187  1.00  3.75           H  \nATOM    290  N   PRO A  24      -6.157 -20.684  -0.253  1.00  0.78           N  \nATOM    291  CA  PRO A  24      -4.902 -20.932   0.478  1.00  0.89           C  \nATOM    292  C   PRO A  24      -4.107 -22.046  -0.209  1.00  0.81           C  \nATOM    293  O   PRO A  24      -4.664 -23.019  -0.676  1.00  1.06           O  \nATOM    294  CB  PRO A  24      -5.342 -21.379   1.878  1.00  1.06           C  \nATOM    295  CG  PRO A  24      -6.890 -21.465   1.879  1.00  0.99           C  \nATOM    296  CD  PRO A  24      -7.386 -20.999   0.500  1.00  0.84           C  \nATOM    297  HA  PRO A  24      -4.315 -20.030   0.545  1.00  1.05           H  \nATOM    298  HB2 PRO A  24      -4.921 -22.348   2.103  1.00  1.13           H  \nATOM    299  HB3 PRO A  24      -5.015 -20.658   2.613  1.00  1.27           H  \nATOM    300  HG2 PRO A  24      -7.200 -22.485   2.053  1.00  1.03           H  \nATOM    301  HG3 PRO A  24      -7.293 -20.823   2.648  1.00  1.12           H  \nATOM    302  HD2 PRO A  24      -7.935 -21.789   0.011  1.00  0.83           H  \nATOM    303  HD3 PRO A  24      -8.002 -20.117   0.600  1.00  0.92           H  \nATOM    304  N   CYS A  25      -2.810 -21.914  -0.275  1.00  0.84           N  \nATOM    305  CA  CYS A  25      -1.992 -22.971  -0.933  1.00  0.78           C  \nATOM    306  C   CYS A  25      -1.345 -23.849   0.140  1.00  0.82           C  \nATOM    307  O   CYS A  25      -0.684 -23.365   1.037  1.00  1.27           O  \nATOM    308  CB  CYS A  25      -0.907 -22.323  -1.794  1.00  0.86           C  \nATOM    309  SG  CYS A  25      -1.128 -22.837  -3.516  1.00  1.12           S  \nATOM    310  H   CYS A  25      -2.376 -21.123   0.107  1.00  1.11           H  \nATOM    311  HA  CYS A  25      -2.629 -23.581  -1.557  1.00  0.81           H  \nATOM    312  HB2 CYS A  25      -0.987 -21.248  -1.726  1.00  0.98           H  \nATOM    313  HB3 CYS A  25       0.066 -22.635  -1.446  1.00  1.05           H  \nATOM    314  N   ARG A  26      -1.531 -25.137   0.053  1.00  0.81           N  \nATOM    315  CA  ARG A  26      -0.930 -26.049   1.067  1.00  0.93           C  \nATOM    316  C   ARG A  26       0.450 -26.514   0.597  1.00  0.74           C  \nATOM    317  O   ARG A  26       0.773 -26.456  -0.573  1.00  0.75           O  \nATOM    318  CB  ARG A  26      -1.839 -27.264   1.255  1.00  1.24           C  \nATOM    319  CG  ARG A  26      -1.868 -27.656   2.733  1.00  1.62           C  \nATOM    320  CD  ARG A  26      -3.108 -28.509   3.008  1.00  1.95           C  \nATOM    321  NE  ARG A  26      -2.736 -29.656   3.884  1.00  2.34           N  \nATOM    322  CZ  ARG A  26      -2.758 -30.871   3.410  1.00  2.90           C  \nATOM    323  NH1 ARG A  26      -3.898 -31.452   3.157  1.00  3.29           N  \nATOM    324  NH2 ARG A  26      -1.639 -31.505   3.189  1.00  3.61           N  \nATOM    325  H   ARG A  26      -2.067 -25.506  -0.679  1.00  1.05           H  \nATOM    326  HA  ARG A  26      -0.832 -25.526   2.007  1.00  1.08           H  \nATOM    327  HB2 ARG A  26      -2.838 -27.020   0.927  1.00  1.65           H  \nATOM    328  HB3 ARG A  26      -1.461 -28.090   0.670  1.00  1.76           H  \nATOM    329  HG2 ARG A  26      -0.980 -28.223   2.973  1.00  2.11           H  \nATOM    330  HG3 ARG A  26      -1.902 -26.765   3.341  1.00  2.11           H  \nATOM    331  HD2 ARG A  26      -3.857 -27.907   3.501  1.00  2.32           H  \nATOM    332  HD3 ARG A  26      -3.502 -28.883   2.074  1.00  2.44           H  \nATOM    333  HE  ARG A  26      -2.477 -29.497   4.815  1.00  2.70           H  \nATOM    334 HH11 ARG A  26      -4.755 -30.966   3.325  1.00  3.32           H  \nATOM    335 HH12 ARG A  26      -3.915 -32.383   2.793  1.00  3.90           H  \nATOM    336 HH21 ARG A  26      -0.765 -31.059   3.383  1.00  3.82           H  \nATOM    337 HH22 ARG A  26      -1.655 -32.436   2.826  1.00  4.20           H  \nATOM    338  N   CYS A  27       1.265 -26.978   1.506  1.00  0.76           N  \nATOM    339  CA  CYS A  27       2.625 -27.450   1.123  1.00  0.70           C  \nATOM    340  C   CYS A  27       2.865 -28.840   1.716  1.00  0.99           C  \nATOM    341  O   CYS A  27       2.005 -29.404   2.364  1.00  1.16           O  \nATOM    342  CB  CYS A  27       3.674 -26.474   1.661  1.00  0.78           C  \nATOM    343  SG  CYS A  27       3.366 -24.823   0.986  1.00  1.20           S  \nATOM    344  H   CYS A  27       0.981 -27.016   2.443  1.00  0.93           H  \nATOM    345  HA  CYS A  27       2.699 -27.500   0.047  1.00  0.68           H  \nATOM    346  HB2 CYS A  27       3.614 -26.440   2.739  1.00  0.98           H  \nATOM    347  HB3 CYS A  27       4.659 -26.806   1.366  1.00  1.12           H  \nATOM    348  N   SER A  28       4.025 -29.397   1.501  1.00  1.18           N  \nATOM    349  CA  SER A  28       4.315 -30.751   2.055  1.00  1.60           C  \nATOM    350  C   SER A  28       5.047 -30.611   3.391  1.00  1.66           C  \nATOM    351  O   SER A  28       5.887 -31.418   3.737  1.00  2.27           O  \nATOM    352  CB  SER A  28       5.194 -31.525   1.071  1.00  2.09           C  \nATOM    353  OG  SER A  28       4.385 -32.060   0.034  1.00  2.61           O  \nATOM    354  H   SER A  28       4.705 -28.926   0.976  1.00  1.11           H  \nATOM    355  HA  SER A  28       3.388 -31.284   2.206  1.00  1.83           H  \nATOM    356  HB2 SER A  28       5.931 -30.860   0.646  1.00  2.24           H  \nATOM    357  HB3 SER A  28       5.692 -32.330   1.590  1.00  2.43           H  \nATOM    358  HG  SER A  28       4.751 -32.911  -0.219  1.00  3.13           H  \nATOM    359  N   MET A  29       4.736 -29.591   4.144  1.00  1.79           N  \nATOM    360  CA  MET A  29       5.413 -29.398   5.458  1.00  2.18           C  \nATOM    361  C   MET A  29       6.912 -29.178   5.234  1.00  2.41           C  \nATOM    362  O   MET A  29       7.698 -29.213   6.160  1.00  3.03           O  \nATOM    363  CB  MET A  29       5.202 -30.637   6.331  1.00  2.76           C  \nATOM    364  CG  MET A  29       3.862 -30.522   7.062  1.00  3.14           C  \nATOM    365  SD  MET A  29       3.024 -32.127   7.042  1.00  3.83           S  \nATOM    366  CE  MET A  29       2.162 -31.953   8.624  1.00  4.51           C  \nATOM    367  H   MET A  29       4.055 -28.953   3.846  1.00  2.11           H  \nATOM    368  HA  MET A  29       4.994 -28.534   5.953  1.00  2.28           H  \nATOM    369  HB2 MET A  29       5.199 -31.520   5.711  1.00  2.92           H  \nATOM    370  HB3 MET A  29       6.001 -30.707   7.055  1.00  3.23           H  \nATOM    371  HG2 MET A  29       4.033 -30.218   8.083  1.00  3.54           H  \nATOM    372  HG3 MET A  29       3.244 -29.788   6.566  1.00  3.15           H  \nATOM    373  HE1 MET A  29       2.694 -31.253   9.250  1.00  4.75           H  \nATOM    374  HE2 MET A  29       1.159 -31.591   8.450  1.00  4.82           H  \nATOM    375  HE3 MET A  29       2.117 -32.913   9.117  1.00  4.85           H  \nATOM    376  N   ILE A  30       7.314 -28.952   4.013  1.00  2.24           N  \nATOM    377  CA  ILE A  30       8.761 -28.730   3.734  1.00  2.83           C  \nATOM    378  C   ILE A  30       8.943 -27.409   2.982  1.00  2.82           C  \nATOM    379  O   ILE A  30      10.048 -26.943   2.789  1.00  3.50           O  \nATOM    380  CB  ILE A  30       9.296 -29.879   2.877  1.00  3.25           C  \nATOM    381  CG1 ILE A  30       8.217 -30.328   1.892  1.00  2.90           C  \nATOM    382  CG2 ILE A  30       9.681 -31.051   3.782  1.00  3.92           C  \nATOM    383  CD1 ILE A  30       8.806 -31.357   0.927  1.00  3.60           C  \nATOM    384  H   ILE A  30       6.665 -28.931   3.280  1.00  1.95           H  \nATOM    385  HA  ILE A  30       9.306 -28.692   4.665  1.00  3.29           H  \nATOM    386  HB  ILE A  30      10.166 -29.544   2.330  1.00  3.64           H  \nATOM    387 HG12 ILE A  30       7.397 -30.773   2.435  1.00  2.93           H  \nATOM    388 HG13 ILE A  30       7.859 -29.475   1.336  1.00  2.54           H  \nATOM    389 HG21 ILE A  30       9.362 -30.845   4.793  1.00  3.97           H  \nATOM    390 HG22 ILE A  30       9.199 -31.951   3.429  1.00  4.37           H  \nATOM    391 HG23 ILE A  30      10.752 -31.185   3.762  1.00  4.29           H  \nATOM    392 HD11 ILE A  30       9.724 -30.973   0.508  1.00  3.85           H  \nATOM    393 HD12 ILE A  30       9.008 -32.275   1.459  1.00  3.95           H  \nATOM    394 HD13 ILE A  30       8.101 -31.550   0.131  1.00  3.95           H  \nATOM    395  N   GLY A  31       7.869 -26.802   2.556  1.00  2.33           N  \nATOM    396  CA  GLY A  31       7.987 -25.512   1.819  1.00  2.72           C  \nATOM    397  C   GLY A  31       8.612 -25.766   0.446  1.00  2.68           C  \nATOM    398  O   GLY A  31       9.587 -25.144   0.073  1.00  3.30           O  \nATOM    399  H   GLY A  31       6.987 -27.192   2.721  1.00  1.96           H  \nATOM    400  HA2 GLY A  31       7.005 -25.079   1.693  1.00  2.77           H  \nATOM    401  HA3 GLY A  31       8.611 -24.833   2.379  1.00  3.21           H  \nATOM    402  N   THR A  32       8.059 -26.675  -0.310  1.00  2.09           N  \nATOM    403  CA  THR A  32       8.623 -26.967  -1.658  1.00  2.18           C  \nATOM    404  C   THR A  32       7.489 -27.042  -2.683  1.00  1.65           C  \nATOM    405  O   THR A  32       7.149 -26.065  -3.321  1.00  2.20           O  \nATOM    406  CB  THR A  32       9.365 -28.305  -1.622  1.00  2.57           C  \nATOM    407  OG1 THR A  32       8.649 -29.219  -0.803  1.00  2.65           O  \nATOM    408  CG2 THR A  32      10.769 -28.099  -1.052  1.00  3.27           C  \nATOM    409  H   THR A  32       7.273 -27.165   0.009  1.00  1.76           H  \nATOM    410  HA  THR A  32       9.310 -26.182  -1.938  1.00  2.63           H  \nATOM    411  HB  THR A  32       9.442 -28.701  -2.622  1.00  2.67           H  \nATOM    412  HG1 THR A  32       8.917 -30.108  -1.048  1.00  2.98           H  \nATOM    413 HG21 THR A  32      10.972 -27.041  -0.967  1.00  3.32           H  \nATOM    414 HG22 THR A  32      10.833 -28.557  -0.076  1.00  3.83           H  \nATOM    415 HG23 THR A  32      11.495 -28.552  -1.711  1.00  3.63           H  \nATOM    416  N   ASN A  33       6.900 -28.195  -2.846  1.00  1.37           N  \nATOM    417  CA  ASN A  33       5.789 -28.333  -3.829  1.00  1.20           C  \nATOM    418  C   ASN A  33       4.462 -27.985  -3.152  1.00  0.94           C  \nATOM    419  O   ASN A  33       3.795 -28.837  -2.598  1.00  1.02           O  \nATOM    420  CB  ASN A  33       5.738 -29.773  -4.340  1.00  1.46           C  \nATOM    421  CG  ASN A  33       6.443 -29.859  -5.695  1.00  2.08           C  \nATOM    422  OD1 ASN A  33       5.933 -30.457  -6.622  1.00  2.71           O  \nATOM    423  ND2 ASN A  33       7.604 -29.283  -5.851  1.00  2.62           N  \nATOM    424  H   ASN A  33       7.189 -28.970  -2.320  1.00  1.92           H  \nATOM    425  HA  ASN A  33       5.956 -27.662  -4.658  1.00  1.56           H  \nATOM    426  HB2 ASN A  33       6.234 -30.424  -3.635  1.00  1.66           H  \nATOM    427  HB3 ASN A  33       4.708 -30.080  -4.451  1.00  1.84           H  \nATOM    428 HD21 ASN A  33       8.016 -28.801  -5.103  1.00  2.82           H  \nATOM    429 HD22 ASN A  33       8.064 -29.333  -6.714  1.00  3.19           H  \nATOM    430  N   CYS A  34       4.072 -26.741  -3.193  1.00  0.90           N  \nATOM    431  CA  CYS A  34       2.788 -26.343  -2.551  1.00  0.80           C  \nATOM    432  C   CYS A  34       1.664 -26.400  -3.586  1.00  0.82           C  \nATOM    433  O   CYS A  34       1.709 -25.738  -4.604  1.00  0.99           O  \nATOM    434  CB  CYS A  34       2.909 -24.920  -2.003  1.00  1.00           C  \nATOM    435  SG  CYS A  34       4.275 -24.846  -0.818  1.00  1.11           S  \nATOM    436  H   CYS A  34       4.623 -26.069  -3.645  1.00  1.11           H  \nATOM    437  HA  CYS A  34       2.565 -27.023  -1.743  1.00  0.75           H  \nATOM    438  HB2 CYS A  34       3.100 -24.236  -2.816  1.00  1.31           H  \nATOM    439  HB3 CYS A  34       1.989 -24.645  -1.509  1.00  1.22           H  \nATOM    440  N   GLU A  35       0.654 -27.187  -3.335  1.00  0.78           N  \nATOM    441  CA  GLU A  35      -0.472 -27.287  -4.304  1.00  0.83           C  \nATOM    442  C   GLU A  35      -1.662 -26.476  -3.791  1.00  0.78           C  \nATOM    443  O   GLU A  35      -1.891 -26.374  -2.602  1.00  0.96           O  \nATOM    444  CB  GLU A  35      -0.882 -28.753  -4.459  1.00  0.88           C  \nATOM    445  CG  GLU A  35       0.212 -29.512  -5.213  1.00  1.03           C  \nATOM    446  CD  GLU A  35       0.607 -30.759  -4.419  1.00  1.59           C  \nATOM    447  OE1 GLU A  35       1.460 -30.641  -3.555  1.00  2.28           O  \nATOM    448  OE2 GLU A  35       0.050 -31.811  -4.689  1.00  2.21           O  \nATOM    449  H   GLU A  35       0.636 -27.711  -2.506  1.00  0.83           H  \nATOM    450  HA  GLU A  35      -0.158 -26.899  -5.262  1.00  0.91           H  \nATOM    451  HB2 GLU A  35      -1.019 -29.194  -3.482  1.00  0.93           H  \nATOM    452  HB3 GLU A  35      -1.808 -28.811  -5.013  1.00  1.13           H  \nATOM    453  HG2 GLU A  35      -0.158 -29.806  -6.184  1.00  1.60           H  \nATOM    454  HG3 GLU A  35       1.074 -28.874  -5.334  1.00  1.51           H  \nATOM    455  N   CYS A  36      -2.422 -25.896  -4.679  1.00  0.67           N  \nATOM    456  CA  CYS A  36      -3.598 -25.091  -4.243  1.00  0.65           C  \nATOM    457  C   CYS A  36      -4.722 -26.030  -3.802  1.00  0.69           C  \nATOM    458  O   CYS A  36      -5.049 -26.984  -4.480  1.00  0.94           O  \nATOM    459  CB  CYS A  36      -4.081 -24.228  -5.411  1.00  0.67           C  \nATOM    460  SG  CYS A  36      -5.647 -23.435  -4.970  1.00  0.92           S  \nATOM    461  H   CYS A  36      -2.220 -25.990  -5.633  1.00  0.71           H  \nATOM    462  HA  CYS A  36      -3.314 -24.455  -3.418  1.00  0.71           H  \nATOM    463  HB2 CYS A  36      -3.342 -23.471  -5.628  1.00  0.72           H  \nATOM    464  HB3 CYS A  36      -4.226 -24.850  -6.282  1.00  0.86           H  \nATOM    465  N   THR A  37      -5.317 -25.771  -2.670  1.00  0.67           N  \nATOM    466  CA  THR A  37      -6.418 -26.652  -2.192  1.00  0.78           C  \nATOM    467  C   THR A  37      -7.758 -25.920  -2.351  1.00  0.84           C  \nATOM    468  O   THR A  37      -7.892 -24.789  -1.927  1.00  0.95           O  \nATOM    469  CB  THR A  37      -6.193 -26.994  -0.717  1.00  0.97           C  \nATOM    470  OG1 THR A  37      -5.003 -26.365  -0.262  1.00  1.00           O  \nATOM    471  CG2 THR A  37      -6.065 -28.510  -0.558  1.00  1.12           C  \nATOM    472  H   THR A  37      -5.040 -24.997  -2.135  1.00  0.76           H  \nATOM    473  HA  THR A  37      -6.422 -27.560  -2.774  1.00  0.82           H  \nATOM    474  HB  THR A  37      -7.031 -26.645  -0.134  1.00  1.06           H  \nATOM    475  HG1 THR A  37      -5.159 -26.042   0.628  1.00  1.28           H  \nATOM    476 HG21 THR A  37      -5.401 -28.896  -1.316  1.00  1.57           H  \nATOM    477 HG22 THR A  37      -5.666 -28.737   0.420  1.00  1.60           H  \nATOM    478 HG23 THR A  37      -7.038 -28.967  -0.665  1.00  1.28           H  \nATOM    479  N   PRO A  38      -8.714 -26.585  -2.955  1.00  0.87           N  \nATOM    480  CA  PRO A  38     -10.051 -26.003  -3.175  1.00  1.01           C  \nATOM    481  C   PRO A  38     -10.716 -25.684  -1.833  1.00  1.16           C  \nATOM    482  CB  PRO A  38     -10.836 -27.088  -3.923  1.00  1.08           C  \nATOM    483  CG  PRO A  38      -9.899 -28.312  -4.098  1.00  1.06           C  \nATOM    484  CD  PRO A  38      -8.545 -27.958  -3.465  1.00  0.91           C  \nATOM    485  HA  PRO A  38      -9.981 -25.115  -3.783  1.00  1.08           H  \nATOM    486  HB2 PRO A  38     -11.705 -27.372  -3.349  1.00  1.17           H  \nATOM    487  HB3 PRO A  38     -11.139 -26.719  -4.891  1.00  1.18           H  \nATOM    488  HG2 PRO A  38     -10.323 -29.171  -3.599  1.00  1.16           H  \nATOM    489  HG3 PRO A  38      -9.768 -28.525  -5.148  1.00  1.15           H  \nATOM    490  HD2 PRO A  38      -8.321 -28.635  -2.654  1.00  0.97           H  \nATOM    491  HD3 PRO A  38      -7.763 -27.989  -4.209  1.00  0.91           H  \nTER     492      PRO A  38                                                      \nCONECT    6  230                                                                \nCONECT  122  309                                                                \nCONECT  220  460                                                                \nCONECT  230    6                                                                \nCONECT  309  122                                                                \nCONECT  343  435                                                                \nCONECT  435  343                                                                \nCONECT  460  220                                                                \nMASTER      133    0    0    0    3    1    0    6  491    1    8    4          \nEND                                                                             \n';Mol1.loadMolecule(ChemDoodle.readPDB(Fmol, 1));Mol1.startAnimation();Mol1.stopAnimation();var resType = 'amino';function setDisp1(obj){Mol1.specs["proteins_display"+obj.value]=obj.checked;Mol1.repaint()}function setProj1(yesPers){Mol1.specs.projectionPerspective_3D=yesPers;Mol1.setupScene();Mol1.repaint()}function setColor1(obj){Mol1.specs.proteins_residueColor=resType=obj.value;Mol1.repaint()}function resColor1(obj){this.checked ? Mol1.specs.proteins_residueColor=resType : Mol1.specs.proteins_residueColor='none';Mol1.repaint()}</script><br><span class="meta">视图: <input type="radio" name="group2" onclick="setProj1(true)">投影<input type="radio" name="group2" onclick="setProj1(false)" checked="">正交<br>着色: <input type="checkbox" onclick="Mol1.specs.macro_colorByChain=this.checked;Mol1.repaint()">按链<input type="checkbox" onclick="resColor1(this)">按残基<br>模式: <input type="checkbox" value="Ribbon" checked="" onclick="setDisp1(this)">飘带<input type="checkbox" value="Backbone"  onclick="setDisp1(this)">骨架<input type="checkbox" value="PipePlank" onclick="setDisp1(this)">管板<input type="checkbox" checked="" onclick="Mol1.specs.proteins_ribbonCartoonize=this.checked;Mol1.repaint()">卡通<br>显示: <input type="checkbox" onclick="Mol1.specs.macro_showWater=this.checked;Mol1.repaint()">水分子<input type="checkbox" onclick="Mol1.specs.atoms_nonBondedAsStars_3D=this.checked;Mol1.repaint()">非键原子<input type="checkbox" onclick="Mol1.specs.atoms_displayLabels_3D=this.checked;Mol1.repaint()">名称<br>颜色: <input type="radio" value="amino" name="radio2" onclick="setColor1(this)">氨基酸<input type="radio" value="shapely" name="radio2" onclick="setColor1(this)">形状<input type="radio" value="polarity" name="radio2" onclick="setColor1(this)">极性<input type="radio" value="acidity" name="radio2" onclick="setColor1(this)">酸性<input type="radio" value="rainbow" name="radio2" onclick="setColor1(this)">彩虹<br>左键: 转动&nbsp;&nbsp; 滚轮: 缩放&nbsp;&nbsp; 双击: 开关自动旋转&nbsp;&nbsp; Alt+左键: 移动</span><br><figurecaption>Fig.1</figurecaption></figure>

在用GROMACS的程序对pdb文件进行处理前, 要做许多检查, 以保证pdb文件的完整性. 根据pdb文件的不同, 要进行不同的处理.
需要处理的方面包括但不限于:

- 氢原子
- C端氧原子
- 结晶水
- 缺失原子/残基/侧链
- 二硫键
- 带电残基

这些都需要你熟悉pdb文件的格式, 并知道一些常用的处理pdb文件的工具.

如果你知道下载的结构可能有混乱(例如, 残基有缺失的侧链), 建议先用[DeepView软件](http://www.expasy.ch/spdbv/)预览一下下载的文件. DeepView可以替换缺失的侧链(但是, 注意DeepView可能会在添加的侧链前加上奇怪的控制字符, 而且这些符号只能在文本编辑器中手工去掉!). 在我们下载的这个pdb文件不存在缺失的侧链, 我们就不必担心了.

但是, 我们下载的pdb文件中缺少C端的结束氧原子, 需要在C端结束处添加氧原子类型`OXT`. 操作步骤如下:

- 在DeepView中打开`1OMB.pdb`(或在unix shell中键入`spdbv 1OMB.pdb`)
- 菜单`Build`->`Add C-terminal Oxygen (OXT)`, DeepView会删除氢原子并添加缺失的氧原子.
- 菜单`File`->`Save`->`Current Layer`将文件保存为`fws.pdb`.

使用文本编辑器检查得到的`fws.pdb`文件, 保证`HEADER`和`COMPND`行具有名称(实际上, 任何名称都可以), 删除DeepView添加到文件末尾的以`SPDBV`开头的行.

处理后的`fws.pdb`文件见[这里](/GMX/fws.pdb). 和原先的`1OMB.PDB`文件相比, 可以看到`fws.pdb`文件中已经不含氢原子, 删除了`SEQRES`, `SHEET`, `SSBOND`, `CONECT`信息, 并且添加了`OXT`原子.

__说明__: 无论何时将一个文本文件从Windows系统复制到unix系统, 一定要转换成unix文本文件. 像MS Word这类Windows编辑器会在文件中加入控制符, 这可能会使unix程序产生错误. 你可以用`to_unix`命令(如`to_unix filename filename`将`filename`文件转换成unix文本文件. 在RedHat Linux中, 还可以使用`dos2unix`命令.)

### 第二步: 用`pdb2gmx`获得拓扑文件

`pdb2gmx`命令(使用`pdb2gmx -h`查看选项; 其实可以用`-h`选项查看所有GROMACS命令的帮助文档)可利用pdb文件创建GROMACS的输入坐标和拓扑文件. 拓扑文件包含了所有力场参数(基于所选择的力场), 因此非常重要.

gmx-4.x: `pdb2gmx -ignh -ff amber99sb-ildn -f fws.pdb -o fws.gro -p fws.top -water tip3p`

gmx-5.x: `gmx pdb2gmx -ignh -ff amber99sb-ildn -f fws.pdb -o fws.gro -p fws.top -water tip3p`

- `-ignh`: 忽略输入pdb文件中的所有氢原子. 因为本pdb文件是由NMR产生的, 含有氢原子, 所以用此选项忽略文件中的氢原子, 统一使用GROMOS力场的氢原子命名规则, 以免出现氢原子名称不一致的情况.
- `-ff`: 指定使用的力场. 我们使用Amber99SB-ILDN力场[3]. 也可以使用其他力场, 请根据自己的体系进行选择.
- `-f`: 指定需要进行处理的蛋白质结构文件
- `-o`: 指定一个新生成的GROMACS文件名(也可以是其它的文件类型, 如pdb)
- `-p`: 指定新生成的拓扑文件名, 包含所有原子及原子间的相互作用参数
- `-water`: 指定水模型. 我们使用TIP3P水模型[4]. 也可以使用其他水模型, 如SPC/E[5], 请根据自己的需要选择.

命令运行成功, 打印出下面的说明(gmx-4.x):

	Using the Amber99sb-ildn force field in directory C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff

	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\aminoacids.r2b
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\dna.r2b
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\rna.r2b
	Reading fws.pdb...
	Read 'OMEGA-AGA-IVB', 257 atoms
	Analyzing pdb file
	Splitting chemical chains based on TER records or chain id changing.
	There are 1 chains and 0 blocks of water and 38 residues with 257 atoms

	  chain  #res #atoms
	  1 'A'    35    257

	All occupancies are one
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\atomtypes.atp
	Atomtype 1
	Reading residue database... (amber99sb-ildn)
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\aminoacids.rtp
	Residue 93
	Sorting it all out...
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\dna.rtp
	Residue 109
	Sorting it all out...
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\rna.rtp
	Residue 125
	Sorting it all out...
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\aminoacids.hdb
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\dna.hdb
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\rna.hdb
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\aminoacids.n.tdb
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\aminoacids.c.tdb
	Processing chain 1 'A' (257 atoms, 35 residues)
	Identified residue CYS4 as a starting terminus.
	Identified residue PRO38 as a ending terminus.
	8 out of 8 lines of specbond.dat converted successfully
	Special Atom Distance matrix:
						CYS4   CYS12   CYS19   CYS20   CYS25   CYS27   MET29
						 SG6    SG67   SG118   SG124   SG163   SG180   SD193
	   CYS12    SG67   1.202
	   CYS19   SG118   0.727   0.705
	   CYS20   SG124   0.202   1.267   0.730
	   CYS25   SG163   1.159   0.202   0.570   1.197
	   CYS27   SG180   1.813   0.627   1.223   1.854   0.666
	   MET29   SD193   2.596   1.490   1.906   2.622   1.466   0.949
	   CYS34   SG227   1.742   0.540   1.200   1.804   0.636   0.202   1.079
	   CYS36   SG242   0.928   0.645   0.202   0.930   0.478   1.089   1.718
					   CYS34
					   SG227
	   CYS36   SG242   1.085
	Linking CYS-4 SG-6 and CYS-20 SG-124...
	Linking CYS-12 SG-67 and CYS-25 SG-163...
	Linking CYS-19 SG-118 and CYS-36 SG-242...
	Linking CYS-27 SG-180 and CYS-34 SG-227...
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\aminoacids.arn
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\dna.arn
	Opening force field file C:/Users/Jicun/E_Prf/Gromacs-4.6/share/top/amber99sb-ildn.ff\rna.arn
	Checking for duplicate atoms....
	Generating any missing hydrogen atoms and/or adding termini.
	Now there are 35 residues with 495 atoms
	Making bonds...
	Number of bonds was 504, now 503
	Generating angles, dihedrals and pairs...
	Before cleaning: 1314 pairs
	Before cleaning: 1356 dihedrals
	Keeping all generated dihedrals
	Making cmap torsions...There are 1356 dihedrals,   99 impropers,  906 angles
			  1308 pairs,      503 bonds and     0 virtual sites
	Total mass 3798.434 a.m.u.
	Total charge 2.000 e
	Writing topology

	Writing coordinate file...
					--------- PLEASE NOTE ------------
	You have successfully generated a topology from: fws.pdb.
	The Amber99sb-ildn force field and the tip3p water model are used.
					--------- ETON ESAELP ------------

	gcq#37: "Never Get a Chance to Kick Ass" (The Amps)

我们得到了三个输出文件: 结构文件`fws.gro`, 拓扑文件`fws.top`, 位置限制文件`posre.itp`.

__说明__: 如果不在命令中使用`-ff`指定力场, 运行命令后会给出一个列表, 让你选择力场, 直接键入你要使用的力场编号再回车即可.

### 第三步: 创建模拟盒子

接下来我们使用`editconf`命令来创建周期性的模拟盒子.

gmx-4.x: `editconf -f fws.gro -o fws-PBC.gro -bt dodecahedron -d 1.2`

gmx-5.x: `gmx editconf -f fws.gro -o fws-PBC.gro -bt dodecahedron -d 1.2`

- `-f`: 输入蛋白结构
- `-o`: 输出带模拟盒子信息的结构文件
- `-bt`: 默认使用长方盒子, 可以使用`-bt`选项改变盒子类型, 如八面体, 十二面体等
- `-d`: 蛋白与模拟盒子在X, Y, Z方向上的最小距离

我们使用`-bt`选项创建了一个菱形十二面体盒子, 因为这种盒子是接近球形, 计算效率最高. `-d`选项设定分子到盒子边缘的最小距离, 以nm为单位, 它决定了盒子的尺寸. 理论上在绝大多数系统中, `-d`都不能小于0.9 nm[6], 我们使用了1.2 nm.

命令运行成功, 打印出下面的说明(gmx-4.x):

	Read 495 atoms
	Volume: 0.001 nm^3, corresponds to roughly 0 electrons
	No velocities found
		system size :  2.793  1.951  2.502 (nm)
		diameter    :  3.319               (nm)
		center      : -0.156 -2.386 -0.412 (nm)
		box vectors :  0.100  0.100  0.100 (nm)
		box angles  :  90.00  90.00  90.00 (degrees)
		box volume  :   0.00               (nm^3)
		shift       :  4.445  6.675  2.434 (nm)
	new center      :  4.289  4.289  2.022 (nm)
	new box vectors :  5.719  5.719  5.719 (nm)
	new box angles  :  60.00  60.00  90.00 (degrees)
	new box volume  : 132.24               (nm^3)

	gcq#178: "Whatever Happened to Pong ?" (F. Black)

我们得到了置于周期性菱形盒子中的蛋白质分子.

<figure><script>var Mol2=new ChemDoodle.TransformCanvas3D('Mol-2',650,400);Mol2.specs.shapes_color = '#fff';Mol2.specs.backgroundColor = 'black';Mol2.specs.projectionPerspective_3D = false;Mol2.specs.set3DRepresentation('Ball and Stick');//Mol2.specs.atoms_resolution_3D = 15;
//Mol2.specs.bonds_resolution_3D = 15;
Mol2.handle = null;Mol2.timeout = 15;Mol2.specs.crystals_unitCellLineWidth = 1.5;Mol2.startAnimation = ChemDoodle._AnimatorCanvas.prototype.startAnimation;Mol2.stopAnimation = ChemDoodle._AnimatorCanvas.prototype.stopAnimation;Mol2.isRunning = ChemDoodle._AnimatorCanvas.prototype.isRunning;Mol2.dblclick = ChemDoodle.RotatorCanvas.prototype.dblclick;Mol2.nextFrame = function(delta){var matrix = [];ChemDoodle.lib.mat4.identity(matrix);var change = delta*Math.PI/15000;ChemDoodle.lib.mat4.rotate(matrix,change,[1,0,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,1,0]);ChemDoodle.lib.mat4.rotate(matrix,change,[0,0,1]);ChemDoodle.lib.mat4.multiply(this.rotationMatrix, matrix)};var Fmol='data_OMEGA-AGA-IVB\n 495\n_symmetry_space_group_name_\' \'\n_cell_length_a 57.1864\n_cell_length_b 57.1864\n_cell_length_c 57.1864\n_cell_angle_alpha 60\n_cell_angle_beta 60\n_cell_angle_gamma 90\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n 4CYS N 0.576 0.739 0.254\n 4CYS H 0.596 0.740 0.241\n 4CYS H 0.566 0.738 0.245\n 4CYS H 0.577 0.758 0.252\n 4CYS C 0.561 0.715 0.289\n 4CYS H 0.572 0.717 0.298\n 4CYS C 0.531 0.714 0.309\n 4CYS H 0.532 0.734 0.304\n 4CYS H 0.523 0.700 0.333\n 4CYS S 0.510 0.705 0.297\n 4CYS C 0.560 0.687 0.291\n 4CYS O 0.573 0.687 0.267\n 5ILE N 0.544 0.663 0.321\n 5ILE H 0.534 0.663 0.341\n 5ILE C 0.542 0.635 0.324\n 5ILE H 0.559 0.638 0.303\n 5ILE C 0.545 0.614 0.353\n 5ILE H 0.527 0.607 0.374\n 5ILE C 0.550 0.588 0.352\n 5ILE H 0.551 0.574 0.370\n 5ILE H 0.533 0.578 0.354\n 5ILE H 0.567 0.594 0.330\n 5ILE C 0.570 0.629 0.348\n 5ILE H 0.568 0.647 0.347\n 5ILE H 0.589 0.633 0.328\n 5ILE C 0.571 0.609 0.379\n 5ILE H 0.587 0.619 0.376\n 5ILE H 0.552 0.604 0.399\n 5ILE H 0.573 0.591 0.381\n 5ILE C 0.514 0.623 0.333\n 5ILE O 0.493 0.606 0.361\n 6ALA N 0.512 0.631 0.308\n 6ALA H 0.529 0.645 0.284\n 6ALA C 0.485 0.620 0.314\n 6ALA H 0.469 0.614 0.336\n 6ALA C 0.482 0.643 0.287\n 6ALA H 0.463 0.635 0.291\n 6ALA H 0.482 0.660 0.288\n 6ALA H 0.498 0.649 0.265\n 6ALA C 0.484 0.593 0.313\n 6ALA O 0.466 0.583 0.312\n 7GLU N 0.504 0.582 0.313\n 7GLU H 0.519 0.591 0.313\n 7GLU C 0.505 0.557 0.312\n 7GLU H 0.497 0.558 0.299\n 7GLU C 0.536 0.557 0.295\n 7GLU H 0.537 0.537 0.308\n 7GLU H 0.548 0.571 0.292\n 7GLU C 0.547 0.564 0.261\n 7GLU H 0.545 0.583 0.247\n 7GLU H 0.535 0.549 0.263\n 7GLU C 0.578 0.565 0.243\n 7GLU O 0.589 0.559 0.258\n 7GLU O 0.591 0.572 0.215\n 7GLU C 0.487 0.530 0.347\n 7GLU O 0.480 0.530 0.371\n 8ASP N 0.478 0.506 0.351\n 8ASP H 0.484 0.506 0.332\n 8ASP C 0.460 0.479 0.385\n 8ASP H 0.446 0.483 0.400\n 8ASP C 0.444 0.457 0.385\n 8ASP H 0.426 0.444 0.407\n 8ASP H 0.457 0.446 0.379\n 8ASP C 0.438 0.473 0.359\n 8ASP O 0.419 0.484 0.365\n 8ASP O 0.452 0.474 0.334\n 8ASP C 0.479 0.466 0.396\n 8ASP O 0.501 0.464 0.378\n 9TYR N 0.471 0.458 0.426\n 9TYR H 0.453 0.460 0.440\n 9TYR C 0.489 0.446 0.438\n 9TYR H 0.479 0.441 0.461\n 9TYR C 0.490 0.418 0.439\n 9TYR H 0.504 0.412 0.444\n 9TYR H 0.496 0.422 0.418\n 9TYR C 0.461 0.395 0.467\n 9TYR C 0.438 0.399 0.465\n 9TYR H 0.440 0.417 0.446\n 9TYR C 0.411 0.378 0.490\n 9TYR H 0.395 0.381 0.488\n 9TYR C 0.407 0.353 0.517\n 9TYR OH 0.381 0.332 0.541\n 9TYR H 0.382 0.315 0.559\n 9TYR C 0.430 0.349 0.518\n 9TYR H 0.428 0.331 0.537\n 9TYR C 0.457 0.370 0.494\n 9TYR H 0.474 0.367 0.495\n 9TYR C 0.519 0.467 0.415\n 9TYR O 0.539 0.460 0.415\n 10GLY N 0.522 0.494 0.394\n 10GLY H 0.506 0.500 0.394\n 10GLY C 0.551 0.516 0.371\n 10GLY H 0.550 0.535 0.359\n 10GLY H 0.564 0.512 0.355\n 10GLY C 0.563 0.515 0.390\n 10GLY O 0.547 0.514 0.416\n 11LYS N 0.589 0.517 0.378\n 11LYS H 0.602 0.519 0.357\n 11LYS C 0.601 0.516 0.396\n 11LYS H 0.591 0.497 0.419\n 11LYS C 0.633 0.520 0.377\n 11LYS H 0.645 0.540 0.365\n 11LYS H 0.638 0.516 0.360\n 11LYS C 0.640 0.499 0.400\n 11LYS H 0.622 0.483 0.421\n 11LYS H 0.648 0.509 0.407\n 11LYS C 0.663 0.488 0.384\n 11LYS H 0.660 0.487 0.368\n 11LYS H 0.661 0.469 0.401\n 11LYS C 0.693 0.509 0.364\n 11LYS H 0.699 0.504 0.379\n 11LYS H 0.692 0.529 0.354\n 11LYS N 0.713 0.506 0.337\n 11LYS H 0.733 0.520 0.324\n 11LYS H 0.714 0.486 0.347\n 11LYS H 0.707 0.511 0.322\n 11LYS C 0.598 0.541 0.401\n 11LYS O 0.599 0.564 0.380\n 12CYS N 0.594 0.537 0.427\n 12CYS H 0.592 0.518 0.444\n 12CYS C 0.590 0.560 0.433\n 12CYS H 0.599 0.578 0.411\n 12CYS C 0.558 0.555 0.455\n 12CYS H 0.550 0.554 0.443\n 12CYS H 0.557 0.572 0.455\n 12CYS S 0.542 0.522 0.495\n 12CYS C 0.604 0.560 0.449\n 12CYS O 0.620 0.545 0.452\n 13THR N 0.599 0.576 0.460\n 13THR H 0.587 0.587 0.457\n 13THR C 0.612 0.577 0.477\n 13THR H 0.615 0.558 0.488\n 13THR C 0.641 0.601 0.451\n 13THR H 0.639 0.620 0.442\n 13THR C 0.659 0.597 0.465\n 13THR H 0.678 0.613 0.448\n 13THR H 0.648 0.598 0.485\n 13THR H 0.662 0.578 0.472\n 13THR O 0.657 0.600 0.423\n 13THR H 0.676 0.615 0.406\n 13THR C 0.592 0.583 0.502\n 13THR O 0.581 0.600 0.496\n 14TRP N 0.589 0.568 0.530\n 14TRP H 0.599 0.554 0.535\n 14TRP C 0.570 0.573 0.556\n 14TRP H 0.551 0.572 0.558\n 14TRP C 0.565 0.550 0.589\n 14TRP H 0.563 0.558 0.601\n 14TRP H 0.581 0.543 0.585\n 14TRP C 0.537 0.526 0.610\n 14TRP C 0.525 0.519 0.598\n 14TRP H 0.532 0.529 0.574\n 14TRP N 0.501 0.497 0.625\n 14TRP H 0.488 0.487 0.624\n 14TRP C 0.497 0.488 0.654\n 14TRP C 0.478 0.467 0.687\n 14TRP H 0.461 0.453 0.695\n 14TRP C 0.483 0.466 0.710\n 14TRP H 0.468 0.450 0.734\n 14TRP C 0.506 0.485 0.698\n 14TRP H 0.509 0.484 0.714\n 14TRP C 0.526 0.506 0.665\n 14TRP H 0.543 0.520 0.657\n 14TRP C 0.521 0.507 0.642\n 14TRP C 0.584 0.603 0.545\n 14TRP O 0.602 0.606 0.549\n 15GLY N 0.576 0.624 0.531\n 15GLY H 0.561 0.620 0.527\n 15GLY C 0.589 0.653 0.520\n 15GLY H 0.600 0.652 0.528\n 15GLY H 0.573 0.660 0.529\n 15GLY C 0.608 0.673 0.482\n 15GLY O 0.619 0.698 0.467\n 16GLY N 0.612 0.661 0.466\n 16GLY H 0.603 0.640 0.479\n 16GLY C 0.630 0.679 0.429\n 16GLY H 0.644 0.670 0.421\n 16GLY H 0.641 0.698 0.421\n 16GLY C 0.612 0.682 0.417\n 16GLY O 0.591 0.690 0.426\n 17THR N 0.619 0.677 0.395\n 17THR H 0.636 0.670 0.387\n 17THR C 0.601 0.679 0.382\n 17THR H 0.599 0.698 0.375\n 17THR C 0.617 0.677 0.353\n 17THR H 0.614 0.656 0.360\n 17THR C 0.608 0.693 0.329\n 17THR H 0.619 0.691 0.310\n 17THR H 0.587 0.685 0.342\n 17THR H 0.613 0.713 0.321\n 17THR O 0.647 0.689 0.335\n 17THR H 0.657 0.687 0.316\n 17THR C 0.572 0.655 0.409\n 17THR O 0.571 0.630 0.420\n 18LYS N 0.550 0.663 0.420\n 18LYS H 0.552 0.683 0.410\n 18LYS C 0.521 0.640 0.446\n 18LYS H 0.523 0.622 0.460\n 18LYS C 0.501 0.650 0.468\n 18LYS H 0.506 0.671 0.454\n 18LYS H 0.506 0.645 0.484\n 18LYS C 0.470 0.634 0.486\n 18LYS H 0.465 0.613 0.500\n 18LYS H 0.466 0.639 0.469\n 18LYS C 0.451 0.644 0.507\n 18LYS H 0.431 0.639 0.513\n 18LYS H 0.459 0.666 0.494\n 18LYS C 0.451 0.631 0.538\n 18LYS H 0.471 0.632 0.532\n 18LYS H 0.438 0.610 0.554\n 18LYS N 0.439 0.646 0.554\n 18LYS H 0.439 0.637 0.574\n 18LYS H 0.452 0.666 0.538\n 18LYS H 0.419 0.644 0.560\n 18LYS C 0.508 0.636 0.430\n 18LYS O 0.518 0.653 0.401\n 19CYS N 0.485 0.614 0.449\n 19CYS H 0.477 0.600 0.473\n 19CYS C 0.471 0.608 0.436\n 19CYS H 0.486 0.609 0.415\n 19CYS C 0.448 0.578 0.462\n 19CYS H 0.429 0.581 0.471\n 19CYS H 0.452 0.568 0.479\n 19CYS S 0.452 0.560 0.442\n 19CYS C 0.457 0.630 0.427\n 19CYS O 0.444 0.639 0.444\n 20CYS N 0.458 0.640 0.399\n 20CYS H 0.469 0.633 0.386\n 20CYS C 0.445 0.662 0.389\n 20CYS H 0.454 0.679 0.386\n 20CYS C 0.449 0.669 0.357\n 20CYS H 0.430 0.665 0.363\n 20CYS H 0.458 0.656 0.353\n 20CYS S 0.471 0.707 0.325\n 20CYS C 0.412 0.650 0.417\n 20CYS O 0.400 0.625 0.434\n 21ARG N 0.400 0.668 0.421\n 21ARG H 0.411 0.689 0.406\n 21ARG C 0.369 0.658 0.447\n 21ARG H 0.362 0.675 0.440\n 21ARG C 0.352 0.634 0.450\n 21ARG H 0.331 0.632 0.462\n 21ARG H 0.355 0.616 0.463\n 21ARG C 0.364 0.642 0.416\n 21ARG H 0.380 0.635 0.409\n 21ARG H 0.370 0.663 0.400\n 21ARG C 0.340 0.628 0.417\n 21ARG H 0.321 0.623 0.437\n 21ARG H 0.342 0.610 0.418\n 21ARG N 0.341 0.648 0.387\n 21ARG H 0.358 0.654 0.365\n 21ARG C 0.320 0.658 0.389\n 21ARG N 0.294 0.641 0.415\n 21ARG H 0.290 0.622 0.433\n 21ARG H 0.278 0.649 0.417\n 21ARG N 0.325 0.683 0.366\n 21ARG H 0.345 0.696 0.346\n 21ARG H 0.309 0.691 0.367\n 21ARG C 0.364 0.647 0.480\n 21ARG O 0.347 0.653 0.499\n 22GLY N 0.379 0.631 0.488\n 22GLY H 0.393 0.627 0.472\n 22GLY C 0.375 0.620 0.520\n 22GLY H 0.361 0.627 0.531\n 22GLY H 0.394 0.627 0.515\n 22GLY C 0.364 0.587 0.541\n 22GLY O 0.340 0.574 0.567\n 23ARG N 0.380 0.574 0.530\n 23ARG H 0.399 0.586 0.508\n 23ARG C 0.370 0.542 0.550\n 23ARG H 0.349 0.535 0.568\n 23ARG C 0.376 0.533 0.527\n 23ARG H 0.363 0.513 0.541\n 23ARG H 0.397 0.534 0.515\n 23ARG C 0.370 0.553 0.502\n 23ARG H 0.386 0.571 0.484\n 23ARG H 0.352 0.557 0.514\n 23ARG C 0.364 0.537 0.489\n 23ARG H 0.370 0.520 0.496\n 23ARG H 0.376 0.550 0.464\n 23ARG N 0.333 0.528 0.503\n 23ARG H 0.319 0.516 0.527\n 23ARG C 0.325 0.537 0.483\n 23ARG N 0.338 0.536 0.458\n 23ARG H 0.355 0.528 0.453\n 23ARG H 0.332 0.542 0.443\n 23ARG N 0.304 0.547 0.489\n 23ARG H 0.294 0.548 0.508\n 23ARG H 0.298 0.554 0.474\n 23ARG C 0.387 0.531 0.566\n 23ARG O 0.412 0.544 0.550\n 24PRO N 0.372 0.508 0.596\n 24PRO C 0.341 0.493 0.614\n 24PRO H 0.338 0.486 0.603\n 24PRO H 0.330 0.506 0.616\n 24PRO C 0.333 0.468 0.648\n 24PRO H 0.326 0.449 0.652\n 24PRO H 0.317 0.469 0.666\n 24PRO C 0.360 0.469 0.648\n 24PRO H 0.364 0.451 0.654\n 24PRO H 0.357 0.472 0.665\n 24PRO C 0.385 0.494 0.614\n 24PRO H 0.394 0.509 0.614\n 24PRO C 0.407 0.483 0.597\n 24PRO O 0.403 0.472 0.585\n 25CYS N 0.431 0.486 0.595\n 25CYS H 0.434 0.496 0.605\n 25CYS C 0.453 0.476 0.579\n 25CYS H 0.450 0.474 0.565\n 25CYS C 0.483 0.498 0.558\n 25CYS H 0.493 0.488 0.567\n 25CYS H 0.479 0.514 0.561\n 25CYS S 0.500 0.510 0.515\n 25CYS C 0.451 0.447 0.605\n 25CYS O 0.452 0.445 0.628\n 26ARG N 0.449 0.426 0.603\n 26ARG H 0.449 0.429 0.585\n 26ARG C 0.447 0.398 0.628\n 26ARG H 0.438 0.396 0.649\n 26ARG C 0.429 0.374 0.633\n 26ARG H 0.441 0.367 0.619\n 26ARG H 0.416 0.382 0.625\n 26ARG C 0.410 0.349 0.669\n 26ARG H 0.402 0.356 0.684\n 26ARG H 0.421 0.337 0.675\n 26ARG C 0.385 0.331 0.676\n 26ARG H 0.389 0.335 0.655\n 26ARG H 0.367 0.334 0.688\n 26ARG N 0.380 0.300 0.698\n 26ARG H 0.373 0.291 0.721\n 26ARG C 0.386 0.284 0.686\n 26ARG N 0.369 0.277 0.680\n 26ARG H 0.352 0.284 0.684\n 26ARG H 0.373 0.266 0.671\n 26ARG N 0.408 0.276 0.681\n 26ARG H 0.421 0.281 0.686\n 26ARG H 0.412 0.264 0.672\n 26ARG C 0.477 0.395 0.617\n 26ARG O 0.497 0.411 0.588\n 27CYS N 0.480 0.376 0.639\n 27CYS H 0.463 0.363 0.663\n 27CYS C 0.508 0.372 0.630\n 27CYS H 0.522 0.384 0.605\n 27CYS C 0.520 0.383 0.643\n 27CYS H 0.539 0.380 0.636\n 27CYS H 0.506 0.370 0.668\n 27CYS S 0.523 0.420 0.626\n 27CYS C 0.505 0.341 0.644\n 27CYS O 0.482 0.323 0.660\n 28SER N 0.528 0.334 0.639\n 28SER H 0.547 0.349 0.626\n 28SER C 0.526 0.303 0.653\n 28SER H 0.509 0.293 0.656\n 28SER C 0.554 0.302 0.628\n 28SER H 0.556 0.283 0.640\n 28SER H 0.571 0.317 0.618\n 28SER OG 0.553 0.305 0.603\n 28SER H 0.571 0.304 0.587\n 28SER C 0.523 0.289 0.686\n 28SER O 0.533 0.271 0.694\n 29MET N 0.508 0.298 0.704\n 29MET H 0.499 0.313 0.697\n 29MET C 0.503 0.285 0.737\n 29MET H 0.491 0.293 0.748\n 29MET C 0.489 0.252 0.758\n 29MET H 0.494 0.243 0.775\n 29MET H 0.496 0.245 0.744\n 29MET C 0.457 0.245 0.777\n 29MET H 0.454 0.264 0.765\n 29MET H 0.449 0.239 0.800\n 29MET SD 0.442 0.217 0.776\n 29MET C 0.408 0.201 0.815\n 29MET H 0.396 0.184 0.820\n 29MET H 0.410 0.194 0.833\n 29MET H 0.397 0.215 0.814\n 29MET C 0.532 0.291 0.731\n 29MET O 0.535 0.279 0.754\n 30ILE N 0.555 0.310 0.701\n 30ILE H 0.552 0.320 0.683\n 30ILE C 0.583 0.318 0.694\n 30ILE H 0.581 0.307 0.716\n 30ILE C 0.603 0.308 0.673\n 30ILE H 0.624 0.320 0.661\n 30ILE C 0.599 0.277 0.695\n 30ILE H 0.612 0.270 0.682\n 30ILE H 0.603 0.274 0.711\n 30ILE H 0.579 0.265 0.708\n 30ILE C 0.597 0.313 0.649\n 30ILE H 0.597 0.333 0.636\n 30ILE H 0.577 0.299 0.661\n 30ILE C 0.619 0.306 0.625\n 30ILE H 0.614 0.309 0.609\n 30ILE H 0.638 0.320 0.612\n 30ILE H 0.618 0.286 0.638\n 30ILE C 0.596 0.350 0.676\n 30ILE O 0.618 0.361 0.671\n 31GLY N 0.582 0.366 0.665\n 31GLY H 0.565 0.357 0.669\n 31GLY C 0.594 0.398 0.647\n 31GLY H 0.597 0.402 0.660\n 31GLY H 0.579 0.406 0.644\n 31GLY C 0.621 0.410 0.613\n 31GLY O 0.643 0.426 0.604\n 32THR N 0.621 0.404 0.594\n 32THR H 0.603 0.391 0.602\n 32THR C 0.648 0.415 0.561\n 32THR H 0.661 0.431 0.555\n 32THR C 0.660 0.391 0.562\n 32THR H 0.672 0.395 0.539\n 32THR C 0.678 0.388 0.576\n 32THR H 0.686 0.372 0.576\n 32THR H 0.694 0.406 0.562\n 32THR H 0.665 0.383 0.599\n 32THR O 0.637 0.365 0.582\n 32THR H 0.646 0.350 0.583\n 32THR C 0.640 0.427 0.536\n 32THR O 0.642 0.452 0.520\n 33ASN N 0.632 0.409 0.531\n 33ASN H 0.631 0.388 0.545\n 33ASN C 0.625 0.418 0.507\n 33ASN H 0.637 0.439 0.488\n 33ASN C 0.630 0.399 0.495\n 33ASN H 0.615 0.396 0.492\n 33ASN H 0.630 0.381 0.511\n 33ASN C 0.659 0.415 0.461\n 33ASN O 0.662 0.415 0.438\n 33ASN N 0.682 0.427 0.457\n 33ASN H 0.680 0.426 0.476\n 33ASN H 0.701 0.437 0.435\n 33ASN C 0.593 0.416 0.524\n 33ASN O 0.575 0.394 0.538\n 34CYS N 0.587 0.438 0.523\n 34CYS H 0.602 0.456 0.512\n 34CYS C 0.557 0.437 0.539\n 34CYS H 0.544 0.417 0.557\n 34CYS C 0.552 0.455 0.552\n 34CYS H 0.531 0.454 0.563\n 34CYS H 0.564 0.475 0.533\n 34CYS S 0.561 0.442 0.582\n 34CYS C 0.550 0.449 0.513\n 34CYS O 0.563 0.473 0.488\n 35GLU N 0.529 0.432 0.520\n 35GLU H 0.518 0.412 0.540\n 35GLU C 0.521 0.442 0.496\n 35GLU H 0.538 0.460 0.474\n 35GLU C 0.516 0.419 0.492\n 35GLU H 0.507 0.424 0.479\n 35GLU H 0.503 0.400 0.514\n 35GLU C 0.544 0.415 0.473\n 35GLU H 0.560 0.426 0.470\n 35GLU H 0.550 0.421 0.451\n 35GLU C 0.542 0.383 0.493\n 35GLU O 0.546 0.375 0.514\n 35GLU O 0.535 0.368 0.486\n 35GLU C 0.494 0.450 0.508\n 35GLU O 0.475 0.437 0.538\n 36CYS N 0.492 0.471 0.486\n 36CYS H 0.507 0.482 0.462\n 36CYS C 0.466 0.480 0.497\n 36CYS H 0.461 0.481 0.516\n 36CYS C 0.472 0.509 0.468\n 36CYS H 0.480 0.508 0.449\n 36CYS H 0.487 0.523 0.464\n 36CYS S 0.439 0.518 0.479\n 36CYS C 0.441 0.458 0.508\n 36CYS O 0.443 0.450 0.491\n 37THR N 0.416 0.449 0.536\n 37THR H 0.415 0.456 0.549\n 37THR C 0.391 0.427 0.548\n 37THR H 0.398 0.419 0.534\n 37THR C 0.377 0.403 0.584\n 37THR H 0.357 0.402 0.598\n 37THR C 0.377 0.375 0.588\n 37THR H 0.368 0.359 0.612\n 37THR H 0.367 0.371 0.580\n 37THR H 0.397 0.376 0.575\n 37THR O 0.392 0.409 0.595\n 37THR H 0.383 0.393 0.619\n 37THR C 0.370 0.442 0.544\n 37THR O 0.362 0.457 0.554\n 38PRO N 0.361 0.438 0.529\n 38PRO C 0.370 0.420 0.516\n 38PRO H 0.364 0.400 0.535\n 38PRO H 0.391 0.428 0.500\n 38PRO C 0.354 0.422 0.501\n 38PRO H 0.341 0.402 0.512\n 38PRO H 0.368 0.430 0.477\n 38PRO C 0.335 0.441 0.505\n 38PRO H 0.315 0.430 0.518\n 38PRO H 0.341 0.458 0.483\n 38PRO C 0.340 0.451 0.524\n 38PRO H 0.347 0.472 0.511\n 38PRO C 0.311 0.440 0.557\n 38PRO O 0.300 0.414 0.578\n 38PRO O 0.300 0.457 0.562\n';var cell=ChemDoodle.readCIF(Fmol, 1,1,1);Mol2.loadContent([cell.molecule], [cell.unitCell]);Mol2.startAnimation();Mol2.stopAnimation();var $=function(id){return document.getElementById(id)};function setProj2(yesPers){Mol2.specs.projectionPerspective_3D = yesPers;Mol2.setupScene();Mol2.repaint()}function setModel2(model){Mol2.specs.set3DRepresentation(model);Mol2.setupScene();Mol2.repaint()}function setSupercell2(){var cell=ChemDoodle.readCIF(Fmol, $("Mol2x").value, $("Mol2y").value, $("Mol2z").value);Mol2.loadContent([cell.molecule], [cell.unitCell]);Mol2.repaint()}</script><br><span class="meta">视图: <input type="radio" name="group2" onclick="setProj2(true)">投影<input type="radio" name="group2" onclick="setProj2(false)" checked="">正交<br>模型: <input type="radio" name="model" onclick="setModel2(&#39;Ball and Stick&#39;)" checked="">球棍<input type="radio" name="model" onclick="setModel2(&#39;van der Waals Spheres&#39;)">范德华球<input type="radio" name="model" onclick="setModel2(&#39;Stick&#39;)">棍状<input type="radio" name="model" onclick="setModel2(&#39;Wireframe&#39;)">线框<input type="radio" name="model" onclick="setModel2(&#39;Line&#39;)">线型<input type="checkbox" onclick="Mol2.specs.atoms_displayLabels_3D=this.checked;Mol2.repaint()">名称<br>超晶胞: X <input type="text" style="width:20px;" id="Mol2x" value="1">&nbsp;&nbsp;Y <input type="text" style="width:20px;" id="Mol2y" value="1">&nbsp;&nbsp;Z <input type="text" style="width:20px;" id="Mol2z" value="1">&nbsp;&nbsp;<input type="button" value="创建" onclick="setSupercell2()"><br>左键: 转动&nbsp;&nbsp; 滚轮: 缩放&nbsp;&nbsp; 双击: 开关自动旋转&nbsp;&nbsp; Alt+左键: 移动</span><br><figurecaption>Fig.2</figurecaption></figure>

__说明__: `editconf`也可以用于GROMACS文件(`*.gro`)和pdb文件(`*.pdb`)的相互转换. 例如: `editconf -f file.gro -o file.pdb` 可以将`file.gro`转换为`file.pdb`

### 第四步: 蛋白质分子真空中的能量最小化

现在就可以使用产生的文件进行 __真空中的__ 能量最小化了. 若你只需要进行真空中的模拟, 完成此步骤后直接跳到成品模拟步骤即可.

GROMACS使用特殊的`*.mdp`文件指定每种计算类型的参数. 下面是`em-vac-pme.mdp`文件的内容:

<table class="highlighttable"><th colspan="2">em-vac-pme.mdp</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
21</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #008800; font-style: italic">; 传递给预处理器的一些定义</span>
define          <span style="color: #666666">=</span> <span style="color: #666666">-</span>DFLEXIBLE<span style="color: #008800; font-style: italic">    ; 使用柔性水模型而非刚性模型, 这样最陡下降法可进一步最小化能量</span>

<span style="color: #008800; font-style: italic">; 模拟类型, 结束控制, 输出控制参数</span>
integrator      <span style="color: #666666">=</span> steep<span style="color: #008800; font-style: italic">         ; 指定使用最陡下降法进行能量最小化. 若设为`cg`则使用共轭梯度法</span>
emtol           <span style="color: #666666">=</span> <span style="color: #666666">500.0</span><span style="color: #008800; font-style: italic">         ; 若力的最大值小于此值则认为能量最小化收敛(单位kJ mol^-1^ nm^-1^)</span>
emstep          <span style="color: #666666">=</span> <span style="color: #666666">0.01</span><span style="color: #008800; font-style: italic">          ; 初始步长(nm)</span>
nsteps          <span style="color: #666666">=</span> <span style="color: #666666">1000</span><span style="color: #008800; font-style: italic">          ; 在能量最小化中, 指定最大迭代次数</span>
nstenergy       <span style="color: #666666">=</span> <span style="color: #666666">1</span><span style="color: #008800; font-style: italic">             ; 能量写出频率</span>
energygrps      <span style="color: #666666">=</span> System<span style="color: #008800; font-style: italic">        ; 要写出的能量组</span>

<span style="color: #008800; font-style: italic">; 近邻列表, 相互作用计算参数</span>
nstlist         <span style="color: #666666">=</span> <span style="color: #666666">1</span><span style="color: #008800; font-style: italic">             ; 更新近邻列表的频率. 1表示每步都更新</span>
ns_type         <span style="color: #666666">=</span> grid<span style="color: #008800; font-style: italic">          ; 近邻列表确定方法(simple或grid)</span>
coulombtype     <span style="color: #666666">=</span> PME<span style="color: #008800; font-style: italic">           ; 计算长程静电的方法. PME为粒子网格Ewald方法, 还可以使用cut-off</span>
rlist           <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic">           ; 短程力近邻列表的截断值</span>
rcoulomb        <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic">           ; 长程库仑力的截断值</span>
vdwtype         <span style="color: #666666">=</span> cut<span style="color: #666666">-</span>off<span style="color: #008800; font-style: italic">       ; 计算范德华作用的方法</span>
rvdw            <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic">           ; 范德华距离截断值</span>
constraints     <span style="color: #666666">=</span> none<span style="color: #008800; font-style: italic">          ; 设置模型中使用的约束</span>
pbc             <span style="color: #666666">=</span> xyz<span style="color: #008800; font-style: italic">           ; 3维周期性边界条件</span>
</pre></div>
</td></tr></table>

对于其中的截断值的设置, 可参考下面的表格

<table id='tab-0'><caption>非键相互作用表格(来源于Berk Hess, GROMACS 2007课程)</caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">力场</th>
  <th rowspan="1" colspan="1" style="text-align:center;">近邻列表</th>
  <th rowspan="1" colspan="1" style="text-align:center;">静电截断</th>
  <th rowspan="1" colspan="1" style="text-align:center;">PME格点</th>
  <th rowspan="1" colspan="1" style="text-align:center;">VdW类型</th>
  <th rowspan="1" colspan="1" style="text-align:center;">VdW截断</th>
  <th rowspan="1" colspan="1" style="text-align:center;">必须使用DispCorr</th>
</tr>
<tr>
  <td rowspan="2" colspan="1" style="text-align:left;">GROMACS-UA</td>
  <td rowspan="2" colspan="1" style="text-align:center;">1.0</td>
  <td rowspan="2" colspan="1" style="text-align:center;">1.0</td>
  <td rowspan="2" colspan="1" style="text-align:center;">0.135</td>
  <td rowspan="1" colspan="1" style="text-align:center;">Shift</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.9</td>
  <td rowspan="1" colspan="1" style="text-align:center;">是</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Cut-off</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.4</td>
  <td rowspan="1" colspan="1" style="text-align:center;">否</td>
</tr>
<tr>
  <td rowspan="2" colspan="1" style="text-align:left;">OPLS-AA</td>
  <td rowspan="2" colspan="1" style="text-align:center;">0.9</td>
  <td rowspan="2" colspan="1" style="text-align:center;">0.9</td>
  <td rowspan="2" colspan="1" style="text-align:center;">0.125</td>
  <td rowspan="1" colspan="1" style="text-align:center;">Shift</td>
  <td rowspan="1" colspan="1" style="text-align:center;">0.8</td>
  <td rowspan="1" colspan="1" style="text-align:center;">是</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">Cut-off</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1.4</td>
  <td rowspan="1" colspan="1" style="text-align:center;">否</td>
</tr>
</table>

注意, 上表中shift/cutoff的单位为nm, UA=united atom, AA=all-atom, DispCorr只能和周期性边界条件一起使用.

GROMACS预处理器`grompp`(即gromacs pre-processor的缩写)可以将模拟参数, 分子结构, 所需要的力场参数等所有信息整合在一个单一的二进制文件(tpr文件)中, 运行`mdrun`时只需要tpr文件.

gmx-4.x: `grompp -f em-vac-pme.mdp -c fws-PBC.gro -p fws.top -o em-vac.tpr`

gmx-5.x: `gmx grompp -f em-vac-pme.mdp -c fws-PBC.gro -p fws.top -o em-vac.tpr`

`-f`选项指定输入参数文件, `-c`选项指定输入结构文件, `-p`选项指定输入拓扑文件, `-o`选项指定输出用于`mdrun`的输入文件.

运行命令, 屏幕输出(gmx-4.x)

	Generated 2211 of the 2211 non-bonded parameter combinations
	Generating 1-4 interactions: fudge = 0.5
	Generated 2211 of the 2211 1-4 parameter combinations
	Excluding 3 bonded neighbours molecule type 'Protein_chain_A'

	NOTE 1 [file fws.top, line 4775]:
	  System has non-zero total charge: 2.000000
	  Total charge should normally be an integer. See
	  http://www.gromacs.org/Documentation/Floating_Point_Arithmetic
	  for discussion on how close it should be to an integer.

	Analysing residue names:
	There are:    35    Protein residues
	Analysing Protein...
	Number of degrees of freedom in T-Coupling group rest is 1482.00
	Calculating fourier grid dimensions for X Y Z
	Using a fourier grid of 48x48x48, spacing 0.119 0.119 0.119
	Estimate for the relative computational load of the PME mesh part: 0.83

	NOTE 2 [file em-vac-pme.mdp]:
	  The optimal PME mesh load for parallel simulations is below 0.5
	  and for highly parallel simulations between 0.25 and 0.33,
	  for higher performance, increase the cut-off and the PME grid spacing.

	This run will generate roughly 1 Mb of data

	There were 2 notes

	gcq#75: "Hold On Like Cliffhanger" (Urban Dance Squad)

gmx-5.x

	NOTE 1 [file em-vac-pme.mdp, line 22]:
	  em-vac-pme.mdp did not specify a value for the .mdp option
	  "cutoff-scheme". Probably it was first intended for use with GROMACS
	  before 4.6. In 4.6, the Verlet scheme was introduced, but the group
	  scheme was still the default. The default is now the Verlet scheme, so
	  you will observe different behaviour.
	NOTE 2 [file em-vac-pme.mdp]:
	  With Verlet lists the optimal nstlist is >= 10, with GPUs >= 20. Note
	  that with the Verlet scheme, nstlist has no effect on the accuracy of
	  your simulation.

	Setting the LD random seed to 108284530
	Generated 2211 of the 2211 non-bonded parameter combinations
	Generating 1-4 interactions: fudge = 0.5
	Generated 2211 of the 2211 1-4 parameter combinations
	Excluding 3 bonded neighbours molecule type 'Protein_chain_A'
	NOTE 3 [file fws.top, line 4771]:
	  System has non-zero total charge: 2.000000
	  Total charge should normally be an integer. See
	  http://www.gromacs.org/Documentation/Floating_Point_Arithmetic
	  for discussion on how close it should be to an integer.
	  Removing all charge groups because cutoff-scheme=Verlet
	Analysing residue names:
	There are:    35    Protein residues
	Analysing Protein...
	Number of degrees of freedom in T-Coupling group rest is 1482.00
	Calculating fourier grid dimensions for X Y Z
	Using a fourier grid of 48x48x48, spacing 0.119 0.119 0.119
	Estimate for the relative computational load of the PME mesh part: 0.85
	NOTE 4 [file em-vac-pme.mdp]:
	  The optimal PME mesh load for parallel simulations is below 0.5
	  and for highly parallel simulations between 0.25 and 0.33,
	  for higher performance, increase the cut-off and the PME grid spacing.
	This run will generate roughly 1 Mb of data
	There were 4 notes
	gcq#553: "Should we force science down the throats of those that have no taste for it? Is it our duty to drag them kicking and screaming into the twenty-first century? I am afraid that it is." (George Porter)

得到运行输入文件`em-vac.tpr`, 参数文件`mdout.mdp`.

使用`mdrun`命令运行能量最小化

gmx-4.x: `mdrun -v -deffnm em-vac`

gmx-5.x: `gmx mdrun -v -deffnm em-vac`

`-deffnm`指定默认的文件名称, `-v`显示模拟过程中的信息.

经过98步, 计算结束(gmx-4.x)

	Reading file em-vac.tpr, VERSION 4.6.2-dev (single precision)
	Using 4 MPI threads
	Compiled acceleration: SSE4.1 (Gromacs could use AVX_256 on this machine, which is better)

	Steepest Descents:
	   Tolerance (Fmax)   = 5.00000e+002
	   Number of steps    =         1000
	Step=    0, Dmax= 1.0e-002 nm, Epot= 1.41200e+003 Fmax= 5.70923e+003, atom= 150
	Step=    1, Dmax= 1.0e-002 nm, Epot= -2.24422e+002 Fmax= 4.54461e+003, atom= 164
	Step=    3, Dmax= 6.0e-003 nm, Epot= -7.68675e+002 Fmax= 3.09902e+003, atom= 150
	Step=    4, Dmax= 7.2e-003 nm, Epot= -7.84120e+002 Fmax= 5.49768e+003, atom= 164
	Step=    5, Dmax= 8.6e-003 nm, Epot= -8.30759e+002 Fmax= 5.95529e+003, atom= 164
	......
	Step=   98, Dmax= 2.1e-003 nm, Epot= -1.77253e+003 Fmax= 3.70245e+002, atom= 494

	writing lowest energy coordinates.

	Steepest Descents converged to Fmax < 500 in 99 steps
	Potential Energy  = -1.7725271e+003
	Maximum force     = 3.7024463e+002 on atom 494
	Norm of force     = 7.0873062e+001

	gcq#313: "My Brothers are Protons (Protons!), My Sisters are Neurons (Neurons)" (Gogol Bordello)

gmx-5.x

	Running on 1 node with total 2 cores, 4 logical cores
	Hardware detected:
	  CPU info:
	    Vendor: GenuineIntel
	    Brand:  Intel(R) Core(TM) i5-4210U CPU @ 1.70GHz
	    SIMD instructions most likely to fit this hardware: AVX2_256
	    SIMD instructions selected at GROMACS compile time: SSE2
	Compiled SIMD instructions: SSE2, GROMACS could use AVX2_256 on this machine, which is better
	Reading file em-vac.tpr, VERSION 5.1.2 (single precision)
	Using 1 MPI thread
	Using 4 OpenMP threads
	Steepest Descents:
	   Tolerance (Fmax)   =  5.00000e+02
	   Number of steps    =         1000
	Step=    0, Dmax= 1.0e-02 nm, Epot=  1.45219e+03 Fmax= 5.70926e+03, atom= 150
	Step=    1, Dmax= 1.0e-02 nm, Epot= -1.83565e+02 Fmax= 4.54459e+03, atom= 164
	Step=    3, Dmax= 6.0e-03 nm, Epot= -7.28101e+02 Fmax= 3.09905e+03, atom= 150
	Step=    4, Dmax= 7.2e-03 nm, Epot= -7.40962e+02 Fmax= 5.49785e+03, atom= 164
	Step=    5, Dmax= 8.6e-03 nm, Epot= -7.86727e+02 Fmax= 5.95532e+03, atom= 164
	......
	Step=   98, Dmax= 2.1e-03 nm, Epot= -1.73279e+03 Fmax= 3.70232e+02, atom= 494
	writing lowest energy coordinates.
	Steepest Descents converged to Fmax < 500 in 99 steps
	Potential Energy  = -1.7327905e+03
	Maximum force     =  3.7023245e+02 on atom 494
	Norm of force     =  7.0877754e+01
	gcq#189: "It's So Fast It's Slow" (F. Black)

我们得到了日志文件`em-vac.log`, 全精度轨迹文件`em-vac.trr`, 能量文件`em-vac.edr`, 能量最小化后的结构文件`em-vac.gro`.

__说明__: 如果最小化不收敛, 可以将`nsteps`的数值增大再重新提交一次. 要重新提交作业的话, 你需要重新运行`grompp`.

### 第五步: 向盒子中填充溶剂及离子并进行能量最小化

gmx-4.x版本的`genbox`命令可以向给定尺寸/类型的周期性盒子中填充恰当数目的溶剂水分子. 在gmx-5.x版本中这个命令被分为`gmx solvate`和`gmx insert-molecules`两个命令. 但其使用方法类似.

gmx-4.x: `genbox -cp em-vac.gro -cs spc216.gro -p fws.top -o fws-b4ion.gro`

gmx-5.x: `gmx solvate -cp em-vac.gro -cs spc216.gro -p fws.top -o fws-b4ion.gro`

`-cp`指定需要填充水分子的体系, 带模拟蛋白盒子, `-cs`指定使用SPC水模型进行填充, spc216是GROMACS统一的三位点水分子结构, `-p`修改体系的拓扑文件, 加入相应水分子的物理参数 `-o`指定填充水分子后的输出文件.

gmx-4.x输出

	Reading solute configuration
	OMEGA-AGA-IVB
	Containing 495 atoms in 35 residues
	Initialising van der waals distances...

	WARNING: Masses and atomic (Van der Waals) radii will be guessed
			 based on residue and atom names, since they could not be
			 definitively assigned from the information in your input
			 files. These guessed numbers might deviate from the mass
			 and radius of the atom type. Please check the output
			 files if necessary.

	Reading solvent configuration
	"216H2O,WATJP01,SPC216,SPC-MODEL,300K,BOX(M)=1.86206NM,WFVG,MAR. 1984"
	solvent configuration contains 648 atoms in 216 residues

	Initialising van der waals distances...
	Will generate new solvent configuration of 4x4x3 boxes
	Generating configuration
	Sorting configuration
	Found 1 molecule type:
		SOL (   3 atoms): 10368 residues
	Calculating Overlap...
	box_margin = 0.315
	Removed 15591 atoms that were outside the box
	Neighborsearching with a cut-off of 0.48
	Table routines are used for coulomb: FALSE
	Table routines are used for vdw:     FALSE
	Cut-off's:   NS: 0.48   Coulomb: 0.48   LJ: 0.48
	System total charge: 0.000
	Potential shift: LJ r^-12: 0.000 r^-6 0.000, Coulomb 0.000

	Grid: 16 x 16 x 12 cells
	Successfully made neighbourlist
	nri = 48244, nrj = 2096044
	Checking Protein-Solvent overlap: tested 10693 pairs, removed 522 atoms.
	Checking Solvent-Solvent overlap: tested 189380 pairs, removed 2823 atoms.
	Added 4056 molecules
	Generated solvent containing 12168 atoms in 4056 residues
	Writing generated configuration to fws-b4ion.gro
	OMEGA-AGA-IVB

	Output configuration contains 12663 atoms in 4091 residues
	Volume                 :      132.24 (nm^3)
	Density                :     968.242 (g/l)
	Number of SOL molecules:   4056

	Processing topology
	Adding line for 4056 solvent molecules to topology file (fws.top)

	Back Off! I just backed up fws.top to ./#fws.top.1#

	gcq#255: "In the End Science Comes Down to Praying" (P. v.d. Berg)

gmx-5.x输出

	Reading solute configuration
	OMEGA-AGA-IVB
	Containing 495 atoms in 35 residues
	Reading solvent configuration and velocities
	216H2O,WATJP01,SPC216,SPC-MODEL,300K,BOX(M)=1.86206NM,WFVG,MAR. 1984
	Containing 648 atoms in 216 residues
	Initialising inter-atomic distances...
	WARNING: Masses and atomic (Van der Waals) radii will be guessed
	         based on residue and atom names, since they could not be
	         definitively assigned from the information in your input
	         files. These guessed numbers might deviate from the mass
	         and radius of the atom type. Please check the output
	         files if necessary.
	NOTE: From version 5.0 gmx uses the Van der Waals radii
	from the source below. This means the results may be different
	compared to previous GROMACS versions.
	++++ PLEASE READ AND CITE THE FOLLOWING REFERENCE ++++
	A. Bondi
	van der Waals Volumes and Radii
	J. Phys. Chem. 68 (1964) pp. 441-451
	-------- -------- --- Thank You --- -------- --------
	Generating solvent configuration
	Will generate new solvent configuration of 4x4x3 boxes
	Solvent box contains 15741 atoms in 5247 residues
	Removed 3276 solvent atoms due to solvent-solvent overlap
	Removed 480 solvent atoms due to solute-solvent overlap
	Sorting configuration
	Found 1 molecule type:
	    SOL (   3 atoms):  3995 residues
	Generated solvent containing 11985 atoms in 3995 residues
	Writing generated configuration to fws-b4ion.gro
	Output configuration contains 12480 atoms in 4030 residues
	Volume                 :      132.24 (nm^3)
	Density                :     954.442 (g/l)
	Number of SOL molecules:   3995
	Processing topology
	Back Off! I just backed up temp.topleIpfl to ./#temp.topleIpfl.1#
	Adding line for 3995 solvent molecules to topology file (fws.top)
	Back Off! I just backed up fws.top to ./#fws.top.1#
	gcq#195: "Just Give Me a Blip" (F. Black)

得到了填充后的结构文件`fws-b4ion.gro`.

能量最小化参数文件`em-sol-pme.mdp`如下:

<table class="highlighttable"><th colspan="2">em-sol-pme.mdp</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
16</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">define          <span style="color: #666666">=</span> <span style="color: #666666">-</span>DFLEXIBLE

integrator      <span style="color: #666666">=</span> steep
emtol           <span style="color: #666666">=</span> <span style="color: #666666">250.0</span>
nsteps          <span style="color: #666666">=</span> <span style="color: #666666">5000</span>
nstenergy       <span style="color: #666666">=</span> <span style="color: #666666">1</span>
energygrps      <span style="color: #666666">=</span> System

nstlist         <span style="color: #666666">=</span> <span style="color: #666666">1</span>
ns_type         <span style="color: #666666">=</span> grid
coulombtype     <span style="color: #666666">=</span> PME
rlist           <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>
rcoulomb        <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>
rvdw            <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>
constraints     <span style="color: #666666">=</span> none
pbc             <span style="color: #666666">=</span> xyz
</pre></div>
</td></tr></table>

使用`grompp`处理此文件

gmx-4.x: `grompp -f em-sol-pme.mdp -c fws-b4ion.gro -p fws.top -o ion.tpr`

gmx-5.x: `gmx grompp -f em-sol-pme.mdp -c fws-b4ion.gro -p fws.top -o ion.tpr`

gmx-5.x输出

	NOTE 1 [file em-sol-pme.mdp, line 20]:
	  em-sol-pme.mdp did not specify a value for the .mdp option
	  "cutoff-scheme". Probably it was first intended for use with GROMACS
	  before 4.6. In 4.6, the Verlet scheme was introduced, but the group
	  scheme was still the default. The default is now the Verlet scheme, so
	  you will observe different behaviour.
	Back Off! I just backed up mdout.mdp to ./#mdout.mdp.1#
	NOTE 2 [file em-sol-pme.mdp]:  With Verlet lists the optimal nstlist is >= 10, with GPUs >= 20. Note  that with the Verlet scheme, nstlist has no effect on the accuracy of  your simulation.
	Setting the LD random seed to 3225797633
	Generated 2211 of the 2211 non-bonded parameter combinations
	Generating 1-4 interactions: fudge = 0.5
	Generated 2211 of the 2211 1-4 parameter combinations
	Excluding 3 bonded neighbours molecule type 'Protein_chain_A'
	Excluding 2 bonded neighbours molecule type 'SOL'
	NOTE 3 [file fws.top, line 4772]:
	  System has non-zero total charge: 2.000000
	  Total charge should normally be an integer. See
	  http://www.gromacs.org/Documentation/Floating_Point_Arithmetic
	  for discussion on how close it should be to an integer.
	Removing all charge groups because cutoff-scheme=Verlet
	Analysing residue names:
	There are:    35    Protein residues
	There are:  3995      Water residues
	Analysing Protein...
	Number of degrees of freedom in T-Coupling group rest is 37437.00
	Calculating fourier grid dimensions for X Y Z
	Using a fourier grid of 48x48x48, spacing 0.119 0.119 0.119
	Estimate for the relative computational load of the PME mesh part: 0.20
	This run will generate roughly 6 Mb of data
	There were 3 notes
	gcq#250: "Wicky-wicky Wa-wild West" (Will Smith)

我们将利用上一步得到的tpr文件(`ion.tpr`)将离子添加到体系中. 添加的补偿离子用来中和体系中的净电荷.
我们的模型中有+2.00 e净电荷, 因此添加的阴离子数目要大于阳离子数目.

下面的`genion`命令会将一些水分子替换为离子.

gmx-4.x: `genion -s ion.tpr -o fws-b4em.gro -neutral -conc 0.15 -p fws.top -g ion.log`

gmx-5.x: `gmx genion -s ion.tpr -o fws-b4em.gro -neutral -conc 0.15 -p fws.top`

`-neutral`选项保证体系总的净电荷为零, 体系呈电中性, `-conc`选项设定需要的离子浓度(这里为0.15 M). `-g`选项指定输出日志文件的名称. `-norandom`选项会依据静电势来放置离子而不是随机放置(默认), 但我们在这里使用随机放置方法.

运这个命令时, 会提示选择一个连续的溶剂分子组, 选择`13 (SOL)`, 回车, 程序会告知你有两个溶剂分子被氯离子代替. `fws.top`中会包含NA和CL离子. 注意, 这里出现的分子顺序必须与坐标文件中的一致.

gmx-5.x输出

	Reading file ion.tpr, VERSION 5.1.2 (single precision)
	Reading file ion.tpr, VERSION 5.1.2 (single precision)
	Will try to add 12 NA ions and 14 CL ions.
	Select a continuous group of solvent molecules
	Group     0 (         System) has 12480 elements
	Group     1 (        Protein) has   495 elements
	Group     2 (      Protein-H) has   257 elements
	Group     3 (        C-alpha) has    35 elements
	Group     4 (       Backbone) has   105 elements
	Group     5 (      MainChain) has   141 elements
	Group     6 (   MainChain+Cb) has   171 elements
	Group     7 (    MainChain+H) has   176 elements
	Group     8 (      SideChain) has   319 elements
	Group     9 (    SideChain-H) has   116 elements
	Group    10 (    Prot-Masses) has   495 elements
	Group    11 (    non-Protein) has 11985 elements
	Group    12 (          Water) has 11985 elements
	Group    13 (            SOL) has 11985 elements
	Group    14 (      non-Water) has   495 elements
	Select a group:
	> 13
	Selected 13: 'SOL'
	Number of (3-atomic) solvent molecules: 3995
	Processing topology
	Back Off! I just backed up temp.topoGPO9o to ./#temp.topoGPO9o.1#
	Replacing 26 solute molecules in topology file (fws.top)  by 12 NA and 14 CL ions.
	Back Off! I just backed up fws.top to ./#fws.top.2#
	Replacing solvent molecule 401 (atom 1698) with NA
	Replacing solvent molecule 1112 (atom 3831) with NA
	Replacing solvent molecule 876 (atom 3123) with NA
	Replacing solvent molecule 3640 (atom 11415) with NA
	Replacing solvent molecule 3719 (atom 11652) with NA
	Replacing solvent molecule 634 (atom 2397) with NA
	Replacing solvent molecule 1323 (atom 4464) with NA
	Replacing solvent molecule 175 (atom 1020) with NA
	Replacing solvent molecule 817 (atom 2946) with NA
	Replacing solvent molecule 3477 (atom 10926) with NA
	Replacing solvent molecule 672 (atom 2511) with NA
	Replacing solvent molecule 3897 (atom 12186) with NA
	Replacing solvent molecule 2026 (atom 6573) with CL
	Replacing solvent molecule 2185 (atom 7050) with CL
	Replacing solvent molecule 2899 (atom 9192) with CL
	Replacing solvent molecule 1936 (atom 6303) with CL
	Replacing solvent molecule 2280 (atom 7335) with CL
	Replacing solvent molecule 737 (atom 2706) with CL
	Replacing solvent molecule 1901 (atom 6198) with CL
	Replacing solvent molecule 3831 (atom 11988) with CL
	Replacing solvent molecule 2233 (atom 7194) with CL
	Replacing solvent molecule 2808 (atom 8919) with CL
	Replacing solvent molecule 3350 (atom 10545) with CL
	Replacing solvent molecule 2666 (atom 8493) with CL
	Replacing solvent molecule 2299 (atom 7392) with CL
	Replacing solvent molecule 2742 (atom 8721) with CL
	gcq#171: "That Was Pretty Cool" (Beavis)

再次生成tpr文件

gmx-4.x: `grompp -f em-sol-pme.mdp -c fws-b4em.gro -p fws.top -o em-sol.tpr`

gmx-5.x: `gmx grompp -f em-sol-pme.mdp -c fws-b4em.gro -p fws.top -o em-sol.tpr`

gmx-5.x输出

	NOTE 1 [file em-sol-pme.mdp, line 20]:
	  em-sol-pme.mdp did not specify a value for the .mdp option
	  "cutoff-scheme". Probably it was first intended for use with GROMACS
	  before 4.6. In 4.6, the Verlet scheme was introduced, but the group
	  scheme was still the default. The default is now the Verlet scheme, so
	  you will observe different behaviour.
	Back Off! I just backed up mdout.mdp to ./#mdout.mdp.2#
	NOTE 2 [file em-sol-pme.mdp]:
	  With Verlet lists the optimal nstlist is >= 10, with GPUs >= 20. Note
	  that with the Verlet scheme, nstlist has no effect on the accuracy of
	  your simulation.
	Setting the LD random seed to 808809886
	Generated 2211 of the 2211 non-bonded parameter combinations
	Generating 1-4 interactions: fudge = 0.5
	Generated 2211 of the 2211 1-4 parameter combinations
	Excluding 3 bonded neighbours molecule type 'Protein_chain_A'
	Excluding 2 bonded neighbours molecule type 'SOL'
	Excluding 1 bonded neighbours molecule type 'NA'
	Excluding 1 bonded neighbours molecule type 'CL'
	Removing all charge groups because cutoff-scheme=Verlet
	Analysing residue names:
	There are:    35    Protein residues
	There are:  3969      Water residues
	There are:    26        Ion residues
	Analysing Protein...
	Analysing residues not classified as Protein/DNA/RNA/Water and splitting into groups...
	Number of degrees of freedom in T-Coupling group rest is 37281.00
	Calculating fourier grid dimensions for X Y Z
	Using a fourier grid of 48x48x48, spacing 0.119 0.119 0.119
	Estimate for the relative computational load of the PME mesh part: 0.20
	This run will generate roughly 6 Mb of data
	There were 2 notes
	gcq#323: "I managed to get two hours of work done before work" (E. Lindahl)

并运行能量最小化

gmx-4.x: `mdrun -v -deffnm em-sol`

gmx-4.x: `gmx mdrun -v -deffnm em-sol`

当能量最小化结束, 你将看到log文件中有如下总结文字, 表明最陡下降收敛了.

gmx-4.x输出

	Steepest Descents converged to Fmax < 1000 in 207 steps
	Potential Energy  = -1.8840495e+05
	Maximum force     =  9.8538837e+02 on atom 109
	Norm of force     =  5.3166636e+03

gmx-5.x输出

	Steepest Descents:
	   Tolerance (Fmax)   =  2.50000e+02
	   Number of steps    =         5000
	Step=    0, Dmax= 1.0e-02 nm, Epot= -6.33612e+04 Fmax= 3.90439e+05, atom= 3703
	Step=    1, Dmax= 1.0e-02 nm, Epot= -7.90314e+04 Fmax= 1.08842e+05, atom= 3703
	......
	Step= 3353, Dmax= 1.9e-03 nm, Epot= -2.13599e+05 Fmax= 2.44805e+02, atom= 64
	writing lowest energy coordinates.
	Steepest Descents converged to Fmax < 250 in 3354 steps
	Potential Energy  = -2.1359919e+05
	Maximum force     =  2.4480508e+02 on atom 64
	Norm of force     =  8.9025946e+00
	NOTE: 18 % of the run time was spent in pair search,
	      you might want to increase nstlist (this has no effect on accuracy)
	gcq#101: "The World is a Friendly Place" (Magnapop)

__说明__: `genion`默认使用的盐为NaCl. 如果你需要使用不同的阳离子和阴离子, 可使用`-pname`(阳离子)和`-nname`(阴离子)分别指定阴阳离子的名称(根据相应力场的ions.itp文件中离子的设定), 还可以使用`-pn`和`-nn`分别指定添加的阴离子数目.

### 第六步: 位置限制性预平衡模拟

我们现在需要对整个体系进行位置限制性模拟, 也就是对溶剂和离子进行弛豫同时保持蛋白质原子的位置不变. 在位置限制性模拟中会限制(或部分冻结)大分子中的原子位置, 而允许溶剂分子运动, 这样做像是将大分子浸入水中, 可以使体系进一步平衡.

水分子的弛豫时间约为10 ps, 大体系(大的蛋白质或脂)可能需要更长的平衡时间, 因此我们要进行超过10ps的位置限制性模拟(至少要长一个数量级).
我们将进行两个阶段的位置限制性模拟: 100 ps的NVT系综平衡和100 ps的NPT系综平衡.
模拟时我们使用的温度为300 K, 它接近于大多数实验条件的室温. 有些人会在310 K下进行模拟, 因为这个温度更接近于体温或生理温度.

NVT位置限制性模拟的参数文件`nvt-pr-md.mdp`内容如下:

<table class="highlighttable"><th colspan="2">nvt-pr-md.mdp</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
52</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #008800; font-style: italic">; 预处理选项</span>
define                   <span style="color: #666666">=</span> <span style="color: #666666">-</span>DPOSRES<span style="color: #008800; font-style: italic"> ; 告诉GROMACS运行位置限制性模拟</span>

<span style="color: #008800; font-style: italic">; 运行控制参数</span>
integrator               <span style="color: #666666">=</span> md
dt                       <span style="color: #666666">=</span> <span style="color: #666666">0.002</span><span style="color: #008800; font-style: italic"> ; 时间步长(单位为ps, 我们使用了2 fs). 只用于动力学积分器(如md), 能量最小化时不需要</span>
nsteps                   <span style="color: #666666">=</span> <span style="color: #666666">50000</span><span style="color: #008800; font-style: italic"> ; 模拟步数(总模拟时间为nsteps*dt)</span>

<span style="color: #008800; font-style: italic">; 输出控制参数</span>
nstxout                  <span style="color: #666666">=</span> <span style="color: #666666">500</span><span style="color: #008800; font-style: italic">   ; 输出模拟坐标的频率(nstxout=500且dt=0.002, 所以每1 ps输出一次)</span>
nstvout                  <span style="color: #666666">=</span> <span style="color: #666666">500</span><span style="color: #008800; font-style: italic">   ; 速度保存频率</span>
nstenergy                <span style="color: #666666">=</span> <span style="color: #666666">500</span><span style="color: #008800; font-style: italic">   ; 能量保存频率</span>
nstlog                   <span style="color: #666666">=</span> <span style="color: #666666">500</span><span style="color: #008800; font-style: italic">   ; log文件输出频率</span>
energygrps               <span style="color: #666666">=</span> Protein Non<span style="color: #666666">-</span>Protein<span style="color: #008800; font-style: italic"></span>

<span style="color: #008800; font-style: italic">; 近邻列表参数</span>
nstlist                  <span style="color: #666666">=</span> <span style="color: #666666">5</span>
ns_type                  <span style="color: #666666">=</span> grid
pbc                      <span style="color: #666666">=</span> xyz
rlist                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic"></span>

<span style="color: #008800; font-style: italic">; 静电和VDW参数</span>
coulombtype              <span style="color: #666666">=</span> PME<span style="color: #008800; font-style: italic">  ; 长程静电相互作用的计算方法</span>
pme_order                <span style="color: #666666">=</span> <span style="color: #666666">4</span><span style="color: #008800; font-style: italic">    ; 三次插值</span>
fourierspacing           <span style="color: #666666">=</span> <span style="color: #666666">0.16</span><span style="color: #008800; font-style: italic"> ; FFT间隔</span>
rcoulomb                 <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic">  ; 计算静电作用的截断值(单位nm)</span>
vdw<span style="color: #666666">-</span>type                 <span style="color: #666666">=</span> Cut<span style="color: #666666">-</span>off
rvdw                     <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic"></span>

<span style="color: #008800; font-style: italic">; 温度耦合部分非常重要, 必须正确填写.</span>
tcoupl                   <span style="color: #666666">=</span> v<span style="color: #666666">-</span>rescale<span style="color: #008800; font-style: italic">            ; 随机重新调整速度</span>
tc<span style="color: #666666">-</span>grps                  <span style="color: #666666">=</span> Protein  Non<span style="color: #666666">-</span>Protein<span style="color: #008800; font-style: italic"> ; 与控温器耦合的组(模型中的每个原子或残基都用一定的索引组表示), 对蛋白和非蛋白使用不同的组分开控制</span>
tau_t                    <span style="color: #666666">=</span> <span style="color: #666666">0.1</span>      <span style="color: #666666">0.1</span><span style="color: #008800; font-style: italic">         ; 温度耦合的时间常数(单位ps). 必须每个tc_grps指定一个, 且顺序对应</span>
ref_t                    <span style="color: #666666">=</span> <span style="color: #666666">300</span>      <span style="color: #666666">300</span><span style="color: #008800; font-style: italic">         ; 代表耦合的参考温度(即动力学模拟的温度, 单位K). 每个tc_grp对应一个ref_t</span>

<span style="color: #008800; font-style: italic">; 色散校正</span>
DispCorr                 <span style="color: #666666">=</span> EnerPres<span style="color: #008800; font-style: italic"> ; 校正VDW截断</span>

<span style="color: #008800; font-style: italic">; 不使用压力耦合</span>
pcoupl                   <span style="color: #666666">=</span> no<span style="color: #008800; font-style: italic">                    ; NVT中不能使用压力耦合</span>

<span style="color: #008800; font-style: italic">; 初始速度选项</span>
gen_vel                  <span style="color: #666666">=</span> yes<span style="color: #008800; font-style: italic">    ; 根据Maxwell分布随机产生速度</span>
gen_temp                 <span style="color: #666666">=</span> <span style="color: #666666">300</span><span style="color: #008800; font-style: italic">    ; 当你改变温度时, 别忘了改变gen_temp变量以生成速度</span>
gen_seed                 <span style="color: #666666">=</span> <span style="color: #666666">-1</span><span style="color: #008800; font-style: italic">     ; 随机数生成器的种子</span>

<span style="color: #008800; font-style: italic">; 键约束选项</span>
constraints              <span style="color: #666666">=</span> all<span style="color: #666666">-</span>bonds<span style="color: #008800; font-style: italic">    ; 使用LINCS算法约束所有键</span>
continuation             <span style="color: #666666">=</span> no<span style="color: #008800; font-style: italic">           ; 第一次运行</span>
constraint_algorithm     <span style="color: #666666">=</span> lincs<span style="color: #008800; font-style: italic">        ; 约束算法</span>
lincs_iter               <span style="color: #666666">=</span> <span style="color: #666666">1</span><span style="color: #008800; font-style: italic">            ; LINCS精度</span>
lincs_order              <span style="color: #666666">=</span> <span style="color: #666666">4</span><span style="color: #008800; font-style: italic">            ; LINCS阶数, 与精度有关</span>
</pre></div>
</td></tr></table>

我们对能量和压力使用了色散校正(参考GROMACS手册4.8节). 对于`coulombtype`, PME代表粒子网格Ewald(Particle Mesh Ewald)静电方法[5,6]. 当体系中含有电荷时(暴露的带电氨基酸残基, 离子, 极化的脂类等), PME是计算长程静电相互作用的最好方法. `constraints`的`all-bonds`选项可使用线性约束算法(LINCS, Linear Constraint algorithm)固定体系中所有键的长度(当模拟的时间步长>0.001 ps时, 使用此选项非常重要[7]).

预处理文件, 并运行NVT模拟

gmx-4.x: `grompp -f nvt-pr-md.mdp -c em-sol.gro -p fws.top -o nvt-pr.tpr`

gmx-4.x: `mdrun -deffnm nvt-pr`

gmx-5.x: `gmx grompp -f nvt-pr-md.mdp -c em-sol.gro -p fws.top -o nvt-pr.tpr`

gmx-5.x: `mdrun -deffnm nvt-pr`

NPT位置限制性模拟的参数文件`npt-pr-md.mdp`内容如下:

<table class="highlighttable"><th colspan="2">npt-pr-md.mdp</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
47</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">define                   <span style="color: #666666">=</span> <span style="color: #666666">-</span>DPOSRES

integrator               <span style="color: #666666">=</span> md
dt                       <span style="color: #666666">=</span> <span style="color: #666666">0.002</span>
nsteps                   <span style="color: #666666">=</span> <span style="color: #666666">50000</span>

nstxout                  <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstvout                  <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstfout                  <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstenergy                <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstlog                   <span style="color: #666666">=</span> <span style="color: #666666">500</span>
energygrps               <span style="color: #666666">=</span> Protein Non<span style="color: #666666">-</span>Protein

nstlist                  <span style="color: #666666">=</span> <span style="color: #666666">5</span>
ns<span style="color: #666666">-</span>type                  <span style="color: #666666">=</span> Grid
pbc                      <span style="color: #666666">=</span> xyz
rlist                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>

coulombtype              <span style="color: #666666">=</span> PME
pme_order                <span style="color: #666666">=</span> <span style="color: #666666">4</span>
fourierspacing           <span style="color: #666666">=</span> <span style="color: #666666">0.16</span>
rcoulomb                 <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>
vdw<span style="color: #666666">-</span>type                 <span style="color: #666666">=</span> Cut<span style="color: #666666">-</span>off
rvdw                     <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>

Tcoupl                   <span style="color: #666666">=</span> v<span style="color: #666666">-</span>rescale
tc<span style="color: #666666">-</span>grps                  <span style="color: #666666">=</span> Protein  Non<span style="color: #666666">-</span>Protein
tau_t                    <span style="color: #666666">=</span> <span style="color: #666666">0.1</span>      <span style="color: #666666">0.1</span>
ref_t                    <span style="color: #666666">=</span> <span style="color: #666666">300</span>      <span style="color: #666666">300</span>

DispCorr                 <span style="color: #666666">=</span> EnerPres<span style="color: #008800; font-style: italic"></span>

<span style="color: #008800; font-style: italic">; 压力耦合</span>
Pcoupl                   <span style="color: #666666">=</span> Parrinello<span style="color: #666666">-</span>Rahman<span style="color: #008800; font-style: italic"> ; Parrinello-Rahman控压器.</span>
Pcoupltype               <span style="color: #666666">=</span> Isotropic<span style="color: #008800; font-style: italic">         ; isotropic 指盒子可以平均地向各个方向(x, y,z)膨胀或压缩以维持一定的压力. 进行膜模拟时需要用semiisotropic.</span>
tau_p                    <span style="color: #666666">=</span> <span style="color: #666666">2.0</span><span style="color: #008800; font-style: italic">               ; 压力耦合的时间常数(单位ps).</span>
compressibility          <span style="color: #666666">=</span> <span style="color: #666666">4.5e-5</span><span style="color: #008800; font-style: italic">            ; 溶剂的压缩系数(4.5e-5为水在300 K和标准大气压下的压缩系数).</span>
ref_p                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic">               ; 压力耦合的参考压力(单位bar, 1大气压约为0.983 bar).</span>
refcoord_scaling         <span style="color: #666666">=</span> com

gen_vel                  <span style="color: #666666">=</span> no<span style="color: #008800; font-style: italic">                ; 不产生速度</span>

constraints              <span style="color: #666666">=</span> all<span style="color: #666666">-</span>bonds
continuation             <span style="color: #666666">=</span> yes
constraint_algorithm     <span style="color: #666666">=</span> lincs
lincs_iter               <span style="color: #666666">=</span> <span style="color: #666666">1</span>
lincs_order              <span style="color: #666666">=</span> <span style="color: #666666">4</span>
</pre></div>
</td></tr></table>

使用NVT模拟输出的结构作为NPT模拟的初始结构预处理文件, 然后运行模拟

gmx-4.x: `grompp -f npt-pr-md.mdp -c nvt-pr.gro -p fws.top -o npt-pr.tpr`

gmx-4.x: `mdrun -deffnm npt-pr`

gmx-5.x: `gmx grompp -f npt-pr-md.mdp -c nvt-pr.gro -p fws.top -o npt-pr.tpr`

gmx-5.x: `gmx mdrun -deffnm npt-pr`

__说明__: 当模拟运行时间较长时, 你可以使用后台运行方法, 如

gmx-4.x: `nohup mdrun -deffnm npt-pr &`

gmx-5.x: `nohup gmx mdrun -deffnm npt-pr &`

为检查模拟运行进度, 可使用`tail`命令查看日志文件, 如

`tail -n 25 npt-pr.log`

### 第七步: 成品模拟

现在体系已经预平衡好了, 我们可以开始最终的成品模拟了.

NPT成品模拟使用的参数文件`npt-nopr-md.mdp`内容如下:

<table class="highlighttable"><th colspan="2">npt-nopr-md.mdp</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
43</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%">integrator               <span style="color: #666666">=</span> md
dt                       <span style="color: #666666">=</span> <span style="color: #666666">0.002</span>
nsteps                   <span style="color: #666666">=</span> <span style="color: #666666">500000</span><span style="color: #008800; font-style: italic"> ; 1 ns</span>

nstxout                 <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstvout                 <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstfout                 <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstenergy               <span style="color: #666666">=</span> <span style="color: #666666">500</span>
nstlog                  <span style="color: #666666">=</span> <span style="color: #666666">500</span>
energygrps              <span style="color: #666666">=</span> Protein Non<span style="color: #666666">-</span>Protein

nstlist                  <span style="color: #666666">=</span> <span style="color: #666666">5</span>
ns<span style="color: #666666">-</span>type                  <span style="color: #666666">=</span> Grid
pbc                      <span style="color: #666666">=</span> xyz
rlist                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>

coulombtype              <span style="color: #666666">=</span> PME
pme_order                <span style="color: #666666">=</span> <span style="color: #666666">4</span>
fourierspacing           <span style="color: #666666">=</span> <span style="color: #666666">0.16</span>
rcoulomb                 <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>
vdw<span style="color: #666666">-</span>type                 <span style="color: #666666">=</span> Cut<span style="color: #666666">-</span>off
rvdw                     <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>

Tcoupl                   <span style="color: #666666">=</span> v<span style="color: #666666">-</span>rescale
tc<span style="color: #666666">-</span>grps                  <span style="color: #666666">=</span> Protein  Non<span style="color: #666666">-</span>Protein
tau_t                    <span style="color: #666666">=</span> <span style="color: #666666">0.1</span>      <span style="color: #666666">0.1</span>
ref_t                    <span style="color: #666666">=</span> <span style="color: #666666">300</span>      <span style="color: #666666">300</span>

DispCorr                 <span style="color: #666666">=</span> EnerPres

Pcoupl                   <span style="color: #666666">=</span> Parrinello<span style="color: #666666">-</span>Rahman
Pcoupltype               <span style="color: #666666">=</span> Isotropic
tau_p                    <span style="color: #666666">=</span> <span style="color: #666666">2.0</span>
compressibility          <span style="color: #666666">=</span> <span style="color: #666666">4.5e-5</span>
ref_p                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>

gen_vel                  <span style="color: #666666">=</span> no

constraints              <span style="color: #666666">=</span> all<span style="color: #666666">-</span>bonds
continuation             <span style="color: #666666">=</span> yes
constraint_algorithm     <span style="color: #666666">=</span> lincs
lincs_iter               <span style="color: #666666">=</span> <span style="color: #666666">1</span>
lincs_order              <span style="color: #666666">=</span> <span style="color: #666666">4</span>
</pre></div>
</td></tr></table>

上面的文件前面位置限制性模拟的参数文件类似, 但有几处不同. 我们不再需要声明`define`, 因不是位置限制性模拟.

处理文件

gmx-4.x: `grompp -f npt-nopr-md.mdp -c npt-pr.gro -p fws.top -o npt-nopr.tpr`

gmx-5.x: `gmx grompp -f npt-nopr-md.mdp -c npt-pr.gro -p fws.top -o npt-nopr.tpr`

由于我们设定了1 ns的模拟, 运行时间较长, 最好使用在后台运行模拟

gmx-4.x: `nohup mdrun -deffnm npt-nopr &`

gmx-5.x: `nohup gmx mdrun -deffnm npt-nopr &`

你可以使用`tail`命令随时检查日志文件以确定模拟进度.

在我的机器上(Intel Core i5-3550@3.30 GHZ, 四核8 GB, Windows 7专业版, 64位), 使用单精度的GROMACS 4.6.2版本, 所用的计算时间与性能如下:

				   Core t (s)   Wall t (s)        (%)
		   Time:     2858.203     2858.000      100.0
							 47:38
					 (ns/day)    (hour/ns)
	Performance:       30.231        0.794

模拟完成后会得到文件名称为`npt-nopr`的各种结果文件, 其中轨迹文件(trr文件)最为重要, 是分析模拟结果的依据.

你可以使用`trjconv`命令压缩trr轨迹文件, 这样可以节省硬盘空间, 而且进行分析时使用xtc文件计算会更快. 实际上, 设定`nstxtcout = 500`已经使我们得到的轨迹文件变小了一些. 为显示轨迹, 你可能需要使用`-pbc nojump`选项使所有原子处于盒子中.

gmx-4.x: `trjconv -f npt-nopr.trr -s npt-nopr.tpr -o npt-nopr.xtc -pbc nojump -ur compact -center`

gmx-5.x: `gmx trjconv -f npt-nopr.trr -s npt-nopr.tpr -o npt-nopr.xtc -pbc nojump -ur compact -center`

提示选择时, 两次都选择`0`.

获得xtc文件后, 如果在后续分析中不需要速度和力的话, 你可以删除trr文件.

## 模拟结果分析

分子动力学模拟计算的重点在于分析。产生分子动力学轨迹文件和能量文件，是分子动力学研究的开始。
GROMACS的一个主要优点(不是指它遵循GNU公共协议而免费!)是有一系列分析轨迹文件的小程序. 下面我们就讨论一些比较常用的分析工具.

### 1. `ngmx`查看轨迹

很多时候, 我们需要粗略地查看一下模拟轨迹, 以确定模拟过程中没有出现明显的问题. 可以用GROAMCS自带的`ngmx`来快速查看轨迹. 需要注意的是, 在安装GROMACS时, 一般不会安装`ngmx`, 所以这个命令在你的机器上很可能无法使用.

gmx-4.x: `ngmx -f npt-nopr.trr -s npt-nopr.tpr`

gmx-5.x: `gmx ngmx -f npt-nopr.trr -s npt-nopr.tpr`

当查看器启动后, 将看到一个多选项的对话框. 选择标`protein`的多选框, 点击`OK`.
选择`protein`可以只显示蛋白质分子, 而隐藏盒子中的水分子.

![ngmx的初始启动对话框](/GMX/GMXtut-0_ngmx-1.png)

![ngmx查看蛋白质结构](/GMX/GMXtut-0_ngmx-2.png)

用`X-Rotate`上下旋转盒子(鼠标左键向上, 右键向下), 用`Y-Rotate`左右旋转盒子(左键向左, 右键向右).
最下面的`Scale`可用来放大或缩小视图(左键放大, 右键缩小).

要查看体系中的其它组, 点击`Display`->`Filter`, 会出现初始对话框, 供选择另外的索引组(如backbone)

要查看模拟轨迹动画, 点击`Display`->`Animate`. 动画播放控制在窗口的底部.
点击中间的箭头按钮逐帧观看, 点向前的双箭头观看整个轨迹动画, 点暂停按钮停止动画. 点向左的双箭头按钮重置动画.

不幸的是, `File`菜单下的`save as pdb`还不能用. 因此, 查看并保存`*.pdb`文件最好的方法是用[VMD](http://www.ks.uiuc.edu/Research/vmd/), 它学术免费, 在unix和Windows下都可以运行.

使用VMD查看轨迹的命令为

`vmd em-sol.gro npt-nopr.xtc &`

可以对蛋白质, 水和离子使用不同的表示模式. 要查看轨迹动画, 点击右下角的`play forward`按钮.

### 2. `g_energy`抽取性质数据

此命令可用于抽取能量输出文件中的数据, 如动能, 势能, 压力, 体积, 密度等, 以用于作图.

gmx-4.x: `g_energy -f npt-nopr.edr -o enrg-npt.xvg`

gmx-5.x: `gmx energy -f npt-nopr.edr -o enrg-npt.xvg`

运行上面的命令, 你将看到如下提示(gmx-4.x, 你看到的可能不同):

	Select the terms you want from the following list by
	selecting either (part of) the name or the number or a combination.
	End your selection with an empty line or a zero.
	-------------------------------------------------------------------
	  1  Angle            2  Proper-Dih.      3  Improper-Dih.    4  LJ-14
	  5  Coulomb-14       6  LJ-(SR)          7  Disper.-corr.    8  Coulomb-(SR)
	  9  Coul.-recip.    10  Potential       11  Kinetic-En.     12  Total-Energy
	 13  Temperature     14  Pres.-DC        15  Pressure        16  Constr.-rmsd
	 17  Box-X           18  Box-Y           19  Box-Z           20  Volume
	 21  Density         22  pV              23  Enthalpy        24  Vir-XX
	 25  Vir-XY          26  Vir-XZ          27  Vir-YX          28  Vir-YY
	 29  Vir-YZ          30  Vir-ZX          31  Vir-ZY          32  Vir-ZZ
	 33  Pres-XX         34  Pres-XY         35  Pres-XZ         36  Pres-YX
	 37  Pres-YY         38  Pres-YZ         39  Pres-ZX         40  Pres-ZY
	 41  Pres-ZZ         42  #Surf*SurfTen   43  Box-Vel-XX      44  Box-Vel-YY
	 45  Box-Vel-ZZ                          46  Coul-SR:Protein-Protein
	 47  LJ-SR:Protein-Protein               48  Coul-14:Protein-Protein
	 49  LJ-14:Protein-Protein               50  Coul-SR:Protein-non-Protein
	 51  LJ-SR:Protein-non-Protein           52  Coul-14:Protein-non-Protein
	 53  LJ-14:Protein-non-Protein           54  Coul-SR:non-Protein-non-Protein
	 55  LJ-SR:non-Protein-non-Protein       56  Coul-14:non-Protein-non-Protein
	 57  LJ-14:non-Protein-non-Protein       58  T-Protein
	 59  T-non-Protein                       60  Lamb-Protein
	 61  Lamb-non-Protein

若要抽取能量和温度数据, 可键入`10 11 12 13`并 __回车两次__ , 得到一个平均势能及其误差(gmx-4.x)

	Statistics over 500001 steps [ 0.0000 through 1000.0000 ps ], 4 data sets
	All statistics are over 5001 points

	Energy                      Average   Err.Est.       RMSD  Tot-Drift
	-------------------------------------------------------------------------------
	Potential                   -176225         13     417.02    80.6394  (kJ/mol)
	Kinetic En.                 31467.9        5.6    275.731   0.780693  (kJ/mol)
	Total Energy                -144758         13    492.513    81.4195  (kJ/mol)
	Temperature                 299.932      0.053    2.62809 0.00744002  (K)

gmx-5.x

	Statistics over 500001 steps [ 0.0000 through 1000.0000 ps ], 4 data sets
	All statistics are over 5001 points
	Energy                      Average   Err.Est.       RMSD  Tot-Drift
	-------------------------------------------------------------------------------
	Potential                   -173825         20    432.623   -85.8249  (kJ/mol)
	Kinetic En.                 31031.6        6.5    299.416    -33.179  (kJ/mol)
	Total Energy                -142793         26    556.977   -119.003  (kJ/mol)
	Temperature                 300.129      0.063    2.89586  -0.320896  (K)
	gcq#155: "I Am a Wonderful Thing" (Kid Creole)

上面命令中的`-o`选项指定了数据的输出文件(`*.xvg`), 它是一个文本文件, 可以用Xmgr或[Grace](http://plasma-gate.weizmann.ac.il/Grace/)打开(只能在Linux和unix下使用),

`xmgrace -nxy enrg-npt.xvg`

Windows下有一个类似的qtgrace, 可作为Grace的替代品. 如果没有Xmgr或Grace, 在进行一些小的改动后也可以作为空格分隔文件导入Microsoft Excel作图. 当然, 也可以使用其他你熟悉的数据作图软件, 如Origin, gnuplot等.
下面是模拟过程中温度的变化图.

![](/GMX/GMXtut-0_Temp.png)

### 3. `g_confrms`比较构象差异

要比较模拟完成后的结构与初始PDB文件中结构的差异, 可使用`g_confrms`命令(用`g_confrms -h`查看详细信息).

gmx-4.x: `g_confrms -f1 1OMB.pdb -f2 npt-nopr.gro -o fit.pdb`

gmx-5.x: `gmx confrms -f1 1OMB.pdb -f2 npt-nopr.gro -o fit.pdb`

`-f1`和`-f2`指定需要进行比较的两个分子结构, `-o`指定叠合后分子结构的输出文件, `fit.pdb`包含两个分子结构的文件, 还可以使用`-n1`和`-n2`指定索引文件, 以选择用于叠合的原子.

运行命令后会提示选择一个组, 两次都选择`4 (Backbone)`. 程序会对两个结构进行最小二乘拟合, 计算其RMSD值, 并输出结构文件(`fit.pdb`), 其中包含了叠合后的两个结构.

![叠合后的结构, 红色为初始结构, 青色为模拟完成后的结构.](/GMX/GMXtut-0_Fit.png)

__说明__: 也可以使用`editconf`将两个结构转换为PDB文件, 然后都加载到PyMOL中, 使用`align`命令进行叠合.

【陈孙妮 补充说明】命令`gmx confrms -f1 1OMB.pdb -f2 npt-nopr.gro -o fit.pdb`得不到预期结果, 即`fit.pdb`中只有model1. 应对`npt-nopr.gro`进行处理, 去掉溶剂及离子, 则`fit.pdb`可以出现model1及model2.

测试结果如下(`npt-nopr-h.gro`是值去掉水及溶剂的`npt-nopr.gro`)

<table id='tab-1'><caption></caption>
<tr>
  <th rowspan="1" colspan="1" style="text-align:center;">测试</th>
  <th rowspan="1" colspan="1" style="text-align:center;">f1</th>
  <th rowspan="1" colspan="1" style="text-align:center;">f2</th>
  <th rowspan="1" colspan="1" style="text-align:center;">fit.pdb结果</th>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">1</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1omb.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:center;">npt-nopr.gro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">没有合并</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">2</td>
  <td rowspan="1" colspan="1" style="text-align:center;">fws.gro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">npt-nopr-h.gro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">跟图一样, 有二级结构, 但是是以两帧的形式存在，而不是并起来的</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">3</td>
  <td rowspan="1" colspan="1" style="text-align:center;">1omb.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:center;">npt-nopr-h.gro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">跟图不一样, 无二级结构, 以两帧的形式存在, 而不是并起来的</td>
</tr>
<tr>
  <td rowspan="1" colspan="1" style="text-align:center;">4</td>
  <td rowspan="1" colspan="1" style="text-align:center;">fws.pdb</td>
  <td rowspan="1" colspan="1" style="text-align:center;">npt-nopr-h.gro</td>
  <td rowspan="1" colspan="1" style="text-align:center;">跟图不一样, 无二级结构, 以两帧的形式存在, 而不是并起来的</td>
</tr>
</table>

### 4. `g_covar`计算平均结构

`g_covar`命令可计算协方差矩阵(参见手册), 也可用于根据模拟轨迹计算平均结构. 如果要计算1 ns模拟轨迹中后200 ps的平均结构, 可使用

gmx-4.x: `g_covar -f npt-nopr.xtc -s npt-nopr.tpr -b 801 -e 1000 -av npt-nopr_avg.pdb`

gmx-5.x: `gmx covar -f npt-nopr.xtc -s npt-nopr.tpr -b 801 -e 1000 -av npt-nopr_avg.pdb`

注意, 平均结构往往比较粗糙, 需要进一步进行能量最小化.

### 5. `g_rms`与`g_rmsdist`计算根均方偏差RMSD

这两个程序用于计算结构的RMSD值, 它可用于查看模拟的收敛性和蛋白的稳定性. 用`g_rms`计算模拟过程中的结构与初始结构的RMSD:

gmx-4.x: `g_rms -s npt-nopr.tpr -f npt-nopr.xtc -o fws-bkbone-rmsd.xvg`

gmx-5.x: `gmx rms -s npt-nopr.tpr -f npt-nopr.xtc -o fws-bkbone-rmsd.xvg`

提示时选择`4 (Backbone)`

程序会对结构进行最小二乘拟合并给出RMSD随时间的变化.

![](/GMX/GMXtut-0_RMSD.png)

`g_rmsdist`命令可计算原子之间距离变化的RMSD:

gmx-4.x: `g_rmsdist -s npt-nopr.tpr -f npt-nopr.xtc -o distrmsd.xvg`

gmx-5.x: `gmx rmsdist -s npt-nopr.tpr -f npt-nopr.xtc -o distrmsd.xvg`

![](/GMX/GMXtut-0_RMSDist.png)

__说明__: 上面两个命令也可以使用索引文件选择需要计算的原子.

### 6. `g_rmsf`计算根均方涨落RMSF和温度因子

`g_rmsf`程序用于计算原子位置的根均方波动(RMSF). 均方根涨落的公式如下:

$$RMSF=\sqrt{\Sum (\bi r_t- \bi r_\text{ref})^2 \over T}$$

其中 $\bi r_t$ 为某一个时刻的构象, $\bi r_\text{ref}$ 为参考构象, $T$ 为总时间. RMSF和RMSD都是表征结构变化的量, 两者方程相似, 功能相似. 区别在于RMSD是对原子总数的平均, RMSF是对时间的平均. 在GROMACS中, `g_rms`得到的是随时间变化的曲线, `g_rmsf`得到的是随原子序号变化的曲线(可使用`-res`选项得到随氨基酸残基变化的曲线).

与`g_covar`类似, `g_rmsf`也可用于计算平均结构, 而且计算更快. 在实际研究中, 通常不需要计算整个轨迹的平均结构, 只需要计算达到平衡后后的平均结构, 可根据RMSD图(由`g_rms`计算)选择一个结构比较稳定的时间范围. 例如, 计算后500 ps范围内的平均结构, 可使用如下命令:

gmx-4.x: `g_rmsf -s npt-nopr.tpr -f npt-nopr.xtc -b 500 -o fws-rmsf.xvg -ox fws-avg.pdb`

gmx-5.x: `gmx rmsf -s npt-nopr.tpr -f npt-nopr.xtc -b 500 -o fws-rmsf.xvg -ox fws-avg.pdb`

提示时选择`1 (Protein)`回车即可. 注意, 平均结构往往比较粗糙, 需要进一步进行能量最小化.

`g_rmsf`也可用于计算每个残基的温度因子, 得到的温度因子可以和X射线晶体结构的温度因子进行比较.

gmx-4.x: `g_rmsf -s npt-nopr.tpr -f npt-nopr.xtc -o fws-rmsf.xvg -ox fws-avg.pdb -res -oq fws-bfac.pdb`

gmx-5.x: `gmx rmsf -s npt-nopr.tpr -f npt-nopr.xtc -o fws-rmsf.xvg -ox fws-avg.pdb -res -oq fws-bfac.pdb`

提示时选择`1 Protein`, 回车.

将得到的`bfactors.pdb`载入PyMOL, 依次点击`Hide`->`everything`, `Show`->`cartoon`, `Color`->`spectrum`->`b-factors`, 或利用下面的PyMOL脚本处理得到的文件`fws-bfac.pdb`:

	pymol bfactors.pdb
	hide everything
	show cartoon
	spectrum b

若要指定温度因子的最大截断值, 可使用

	Q = XXX
	cmd.alter("all", "q = b > Q and Q or b")
	spectrum q

其中的`XXX`为温度因子的最大截断值.

进行光线追踪后保存为图片, 或使用下面的命令:

	ray 1200,1200
	png bfac.png, dpi=300

![温度因子填色结构图, 蓝色为冷区域, 绿色为中等区域, 红色为热区域.](/GMX/GMXtut-0_bfac.png)

### 7. `g_gyrate`计算回旋半径

回旋半径取决于某(些)原子质量与分子重心的关系, 可用于表征蛋白质结构的密实度.

gmx-4.x: `g_gyrate -s npt-nopr.tpr -f npt-nopr.xtc -o fws-gyrate.xvg`

gmx-5.x: `gmx gyrate -s npt-nopr.tpr -f npt-nopr.xtc -o fws-gyrate.xvg`

选择`1 Protein`并回车.

![](/GMX/GMXtut-0_Rg.png)

### 8. `g_sas`计算溶剂可及表面积

氨基酸残基的疏水性是影响蛋白质折叠的重要因素, 溶剂可及表面积(SASA)是描述蛋白质疏水性的重要参数. 可利用`g_sas`计算蛋白质的溶剂可及表面积:

gmx-4.x: `g_sas -s npt-nopr.tpr -f npt-nopr.xtc -o area.xvg -or resarea.xvg -oa atomarea.xvg`

gmx-5.x: `gmx sasa -s npt-nopr.tpr -f npt-nopr.xtc -o area.xvg -or resarea.xvg -oa atomarea.xvg`

提示时选择`1 (Protein)`并回车.

### 9. `do_dssp`计算二级结构

`do_dssp`程序可计算模型的二级结构, 但前提是你的电脑中已经安装了[dssp程序](http://swift.cmbi.ru.nl/gv/dssp/).

gmx-4.x: `do_dssp -s npt-nopr.tpr -f npt-nopr.xtc -o fws-ss.xpm`

gmx-5.x: `gmx do_dssp -s npt-nopr.tpr -f npt-nopr.xtc -o fws-ss.xpm`

提示时选择`1 (Protein)`并回车.

值得注意的是, 由于`do_dssp`的初衷是在Linux系统下运行, 所以无法在Windows下运行, 需要修改源代码才能达到在Windows下运行的目的.

可以用`xpm2ps`命令将得到的xpm文件转换为eps格式

gmx-4.x: `xpm2ps -f fws-ss.xpm -o fws-ss.eps`

gmx-5.x: `gmx xpm2ps -f fws-ss.xpm -o fws-ss.eps`

然后再使用ImageMagick程序的`convert`命令将eps文件转换为png图片格式或其他图片格式(也可使用Gimp程序或Windows下的IrfanView程序).

`convert fws_ss.eps fws_ss.png`

![二级结构图](/GMX/GMXtut-0_2ndStructure.png)

上面的dssp图中, y轴为残基编号, x轴为模拟时间(ps). 我们从中可以看到3个红色区域, 代表3个beta片层. 中间的较短区是最不稳定的, 这和前面温度因子的计算结果相符.

### 10. `g_hbond`统计氢键

`g_hbond`程序可用于计算模拟过程中分子间或组间的氢键数目以及氢键距离或角度的分布.

gmx-4.x: `g_hbond -s npt-nopr.tpr -f npt-nopr.xtc -num fws_hnum.xvg`

gmx-5.x: `gmx hbond -s npt-nopr.tpr -f npt-nopr.xtc -num fws_hnum.xvg`

提示时, 根据需要选择要分析的组. 一般选择`(Protein)`和`(Water)`.

GROAMCS中氢键的默认判断标准如下

![判断氢键的几何条件](/GMX/GMXtut-0_hbond.png)

$$\alg
r &\le 0.35 \text{nm} \\
\a &\le 30^\circ
\ealg$$

你可以使用`-r`和`-a`选项设定其它阈值. 默认地, `g_hbond`计算施体受体距离 $r_\text{DA}$, 可以用`-da no`选项设置为计算 $r_\text{HA}$ 距离.

### 11. `g_saltbr`分析盐桥

`g_saltbr`程序可用于分析模拟中残基间的盐桥. 程序会输出一系列xvg文件. 给出-/-, +/-(最关注的)和+/+残基间的距离.

gmx-4.x: `g_saltbr -s npt-nopr.tpr -f npt-nopr.xtc`

gmx-5.x: `gmx saltbr -s npt-nopr.tpr -f npt-nopr.xtc`

### 12. `g_cluster`分析团簇

`g_cluster`可使用各种方法进行团簇分析. 示例如下:

gmx-4.x: `g_cluster -s npt-nopr.tpr -f npt-nopr.xtc -dm rmsd-matrix.xpm -dist rms-distribution.xvg -o clusters.xpm -sz cluster-sizes.xvg -tr cluster-transitions.xpm -ntr cluster-transitions.xvg -clid cluster-id-overtime.xvg -cl clusters.pdb -cutoff 0.25 -method gromos`

gmx-5.x: `gmx cluster -s npt-nopr.tpr -f npt-nopr.xtc -dm rmsd-matrix.xpm -dist rms-distribution.xvg -o clusters.xpm -sz cluster-sizes.xvg -tr cluster-transitions.xpm -ntr cluster-transitions.xvg -clid cluster-id-overtime.xvg -cl clusters.pdb -cutoff 0.25 -method gromos`

使用下面的PyMOL脚本处理得到的文件

	pymol clusters.pdb
	split_states clusters
	delete clusters
	dss
	show cartoon

### 13. `g_covar`进行主成分分析

主成分分析PCA(Principal Components Analysis)方法可以帮助我们确定哪些运动方式对蛋白质的整个动力学贡献最大. 在含有N个原子的体系中, 存在3N-6个可能的内部运动方式(需要6个自由度来描述体系的外部转动和平动). 对PCA分析, 我们主要关心蛋白质骨架上的原子.

gmx-4.x: `g_covar -s npt-nopr.tpr -f npt-nopr.xtc -o eigenval.xvg -v eigenvect.trr -xpma covara.xpm`

gmx-5.x: `gmx covar -s npt-nopr.tpr -f npt-nopr.xtc -o eigenval.xvg -v eigenvect.trr -xpma covara.xpm`

对叠合和分析都选择组`4 (Protein backbone)`

使用`xpm2ps`制作原子协方差矩阵的图片, 其中使用`-do`选项会输出一个配置文件, 用于修改绘图的设置(坐标轴标题, 图例等).

gmx-4.x: `xpm2ps -f covara.xpm -o covara.eps -do covara.m2p`

gmx-5.x: `gmx xpm2ps -f covara.xpm -o covara.eps -do covara.m2p`

使用`ghostview`(或`PhotoShop`)来查看得到的图片(`gv covara.eps`). 使用`xpm2ps -rainbow`选项来采用其他的颜色方案.

![](/GMX/GMXtut-0_covara.png)

典型的情况, 只有非常少的几个本征矢量(涨落模式)对蛋白质的整体运动有显著贡献. 要查看最主要的模式(1), 可使用下面的命令:

gmx-4.x: `g_anaeig -v eigenvec.trr -s npt-nopr.tpr -f npt-nopr.xtc -first 1 -last 1 -nframes 100 -extr fws-ev1.pdb`

gmx-5.x: `gmx anaeig -v eigenvec.trr -s npt-nopr.tpr -f npt-nopr.xtc -first 1 -last 1 -nframes 100 -extr fws-ev1.pdb`

分析二维本征矢量投影, 可使用

gmx-4.x: `g_anaeig -s npt-nopr.tpr -f npt-nopr.xtc -first 1 -last 2 -2d proj-1-2.xvg`

gmx-5.x: `gmx anaeig -s npt-nopr.tpr -f npt-nopr.xtc -first 1 -last 2 -2d proj-1-2.xvg`

### 14. `g_angle`进行二面角主成分分析

我们将创建一个索引文件来研究涉及残基MET29, ILE30, GLY31的4个二面角(2个phi, 2个psi). 使用VMD打开`pr.gro`或`md.gro`挑选与每个二面角对应的4个原子的索引号. 将文件命名为`dangle.ndx`.

gmx-4.x: `g_angle -f npt-nopr.xtc -n dangle.ndx -or dangle.trr -type dihedral`

gmx-5.x: `gmx angle -f npt-nopr.xtc -n dangle.ndx -or dangle.trr -type dihedral`

手动将(2*N/3)个原子写入`covar.ndx`中, 其中N为二面角的数目. 注意到`g_angle`的输出可以帮助你. 在`g_angle`的输出中你会发现需要三个原子位置的行.

共有4个二面角, 需要三个原子位置的cos/sin

[ test ]
1 2 3

创建一个辅助的gro文件用于`g_covar`分析

`trjconv -s ../md.tpr -f dangle.trr -o resiz.gro -n covar.ndx -e 0`

使用下面的命令进行`g_covar`分析

`g_covar -f dangle.trr -n covar.ndx -ascii -xpm -nofit -nomwa -noref -s resiz.gro`

检查第一个本征矢量的投影

`g_anaeig -v eigenvec.trr -f dangle.trr -s resiz.gro -first 1 -last 1 -proj proj-1`

当提示时, 选择`0 (System)`.

检查本征矢量1和本征矢量2的二维投影

`g_anaeig -v eigenvec.trr -f dangle.trr -s resiz.gro -first 1 -last 2 -2d 2dproj_1_2.xvg`

使用`g_analyze`检查本征矢量1与其投影的余弦含量, 例如

`g_analyze -f proj1.xvg -cc proj1-cc.xvg`

当余弦含量接近于1时, 体系中的大尺度运动无法与随机扩散区分开来[8]. 对本征矢量1, 我们体系二面角的余弦含量大约为0.11, 可接受.

使用`g_sham`程序来查看自由能形貌:

`g_sham -f 2dproj_1_2.xvg -ls gibbs.xpm -notime`

`xpm2ps -f gibbs.xpm -o gibbs.eps -rainbow red`

## 参考文献

1. Hess, B., et al., GROMACS 4: Algorithms for highly efficient, load-balanced, and scalable molecular simulation. _J. Chem. Theor. Comp._, 2008. __4__(3): p. 435-447.
2. Lindahl, E., B. Hess, and D. van der Spoel, GROMACS 3.0: a package for molecular simulation and trajectory analysis. _J. Mol. Model_, 2001. __7__: p. 306-317.
3. Lindorff-Larsen, K., et al., Improved side-chain torsion potentials for the Amber ff99SB protein force field. _Proteins_, 2010. __78__: p. 1950-1958.
4. Jorgensen, W., et al., Comparison of Simple Potential Functions for Simulating Liquid Water. _J. Chem. Phys._, 1983. __79__: p. 926-935.
2.  Berendsen, H.J., J. Grigera, and T. Straatsma, The missing term in effective pair potentials. J. Phys. Chem., 1987. 91: p. 6269-6271.
4.  Weber, W., P.H. Hünenberger, and J.A. McCammon, Molecular Dynamics Simulations of a Polyalanine Octapeptide under Ewald Boundary Conditions: Influence of Artificial Periodicity on Peptide Conformation. J. Phys. Chem. B, 2000. 104(15): p. 3668-3575.
5. Darden, T., D. York, and L. Pedersen, Particle Mesh Ewald: An N-log(N) method for Ewald sums in large systems. _J. Chem. Phys._, 1993. __98__: p. 10089-10092.
6. Essmann, U., et al., A smooth particle mesh ewald potential. _J. Chem. Phys._, 1995. __103__: p. 8577-8592.
7. Hess, B., et al., LINCS: A Linear Constraint Solver for molecular simulations. _J. Comp. Chem._, 1997. __18__: p. 1463-1472.
8. Maisuradze, G.G. and D.M. Leitner, Free energy landscape of a biomolecule in dihedral principal component space: sampling convergence and correspondence between structures and minima. _Proteins_, 2007. __67__(3): p. 569-78.
3.  Hess, B. and N. van der Vegt, Hydration thermodynamic properties of amino acid analogues: a systematic comparison of biomolecular force fields and water models. _J. Phys. Chem. B_, 2006. __110__(35): p. 17616-26.
8.  Berendsen, H.J.C., J.P.M. Postma, W.F. vanGunsteren, A. DiNola, and J.R. Haak, Molecular dynamics with coupling to an external bath. _J. Chem. Phys._, 1984. __81__(8): p. 3584-3590.
9.  Bussi, G., D. Donadio, and M. Parrinello, Canonical sampling through velocity rescaling. _J. Chem. Phys._, 2007. __126__(1): p. 14101.
10.  Kabsch, W. and C. Sander, A dictionary of protein secondary structure. _Biopolymers_, 1983. __22__: p. 2577-2637.

## 附录: 更长时间模拟的参数文件

`npt-longrun.mdp`内容如下:

<table class="highlighttable"><th colspan="2">npt-longrun.mdp</th><tr><td><div class="linenodiv" style="background-color: #f0f0f0; padding-right: 10px"><pre style="line-height: 125%"> 1
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
48</pre></div></td><td class="code"><div class="highlight" style="background: #f8f8f8"><pre style="line-height: 125%"><span style="color: #008800; font-style: italic">; RUN CONTROL PARAMETERS</span>
integrator               <span style="color: #666666">=</span> md
tinit                    <span style="color: #666666">=</span> <span style="color: #666666">0</span><span style="color: #008800; font-style: italic">       ; Starting time</span>
dt                       <span style="color: #666666">=</span> <span style="color: #666666">0.002</span><span style="color: #008800; font-style: italic">   ; 2 femtosecond time step for integration</span>
nsteps                   <span style="color: #666666">=</span> YYY<span style="color: #008800; font-style: italic">     ; Make it 50 ns</span>
<span style="color: #008800; font-style: italic">; OUTPUT CONTROL OPTIONS</span>
nstxout                  <span style="color: #666666">=</span> <span style="color: #666666">250000</span><span style="color: #008800; font-style: italic"> ; Writing full precision coordinates every</span>
<span style="color: #666666">0.5</span> ns
nstvout                  <span style="color: #666666">=</span> <span style="color: #666666">250000</span><span style="color: #008800; font-style: italic"> ; Writing velocities every 0.5 ns</span>
nstlog                   <span style="color: #666666">=</span> <span style="color: #666666">5000</span><span style="color: #008800; font-style: italic">   ; Writing to the log file every 10ps</span>
nstenergy                <span style="color: #666666">=</span> <span style="color: #666666">5000</span><span style="color: #008800; font-style: italic">   ; Writing out energy information every 10ps</span>
nstxtcout                <span style="color: #666666">=</span> <span style="color: #666666">5000</span><span style="color: #008800; font-style: italic">   ; Writing coordinates every 10ps</span>
energygrps               <span style="color: #666666">=</span> Protein Non<span style="color: #666666">-</span>Protein<span style="color: #008800; font-style: italic"></span>
<span style="color: #008800; font-style: italic">; NEIGHBORSEARCHING PARAMETERS</span>
nstlist                  <span style="color: #666666">=</span> <span style="color: #666666">5</span>
ns<span style="color: #666666">-</span>type                  <span style="color: #666666">=</span> Grid
pbc                      <span style="color: #666666">=</span> xyz
rlist                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic"></span>
<span style="color: #008800; font-style: italic">; OPTIONS FOR ELECTROSTATICS AND VDW</span>
coulombtype              <span style="color: #666666">=</span> PME
pme_order                <span style="color: #666666">=</span> <span style="color: #666666">4</span><span style="color: #008800; font-style: italic">            ; cubic interpolation</span>
fourierspacing           <span style="color: #666666">=</span> <span style="color: #666666">0.16</span><span style="color: #008800; font-style: italic">         ; grid spacing for FFT</span>
rcoulomb                 <span style="color: #666666">=</span> <span style="color: #666666">1.0</span>
vdw<span style="color: #666666">-</span>type                 <span style="color: #666666">=</span> Cut<span style="color: #666666">-</span>off
rvdw                     <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic"></span>
<span style="color: #008800; font-style: italic">; Dispersion correction</span>
DispCorr                 <span style="color: #666666">=</span> EnerPres<span style="color: #008800; font-style: italic"> ; account for vdw cut-off</span>
<span style="color: #008800; font-style: italic">; Temperature coupling</span>
Tcoupl                   <span style="color: #666666">=</span> v<span style="color: #666666">-</span>rescale
tc<span style="color: #666666">-</span>grps                  <span style="color: #666666">=</span> Protein  Non<span style="color: #666666">-</span>Protein
tau_t                    <span style="color: #666666">=</span> <span style="color: #666666">0.1</span>      <span style="color: #666666">0.1</span>
ref_t                    <span style="color: #666666">=</span> <span style="color: #666666">300</span>      <span style="color: #666666">300</span><span style="color: #008800; font-style: italic"></span>
<span style="color: #008800; font-style: italic">; Pressure coupling</span>
Pcoupl                   <span style="color: #666666">=</span> Parrinello<span style="color: #666666">-</span>Rahman
Pcoupltype               <span style="color: #666666">=</span> Isotropic
tau_p                    <span style="color: #666666">=</span> <span style="color: #666666">2.0</span>
compressibility          <span style="color: #666666">=</span> <span style="color: #666666">4.5e-5</span>
ref_p                    <span style="color: #666666">=</span> <span style="color: #666666">1.0</span><span style="color: #008800; font-style: italic"></span>
<span style="color: #008800; font-style: italic">; GENERATE VELOCITIES FOR STARTUP RUN</span>
gen_vel                  <span style="color: #666666">=</span> no<span style="color: #008800; font-style: italic"></span>
<span style="color: #008800; font-style: italic">; OPTIONS FOR BONDS</span>
constraints              <span style="color: #666666">=</span> all<span style="color: #666666">-</span>bonds
constraint<span style="color: #666666">-</span>algorithm     <span style="color: #666666">=</span> lincs
continuation             <span style="color: #666666">=</span> yes<span style="color: #008800; font-style: italic">          ; Restarting after NPT without</span>
position restraints
lincs<span style="color: #666666">-</span>order              <span style="color: #666666">=</span> <span style="color: #666666">4</span>
lincs<span style="color: #666666">-</span>iter               <span style="color: #666666">=</span> <span style="color: #666666">1</span>
lincs<span style="color: #666666">-</span>warnangle          <span style="color: #666666">=</span> <span style="color: #666666">30</span>
</pre></div>
</td></tr></table>

## 评论

- 2016-06-03 14:59:27 `franklinly0533` 您好，李老师，在《GROMACS教程：漏斗网蜘蛛毒素肽的溶剂化研究：Amber99SB-ILDN力场》中结果分析，1. ngmx查看轨迹，ngmx的初始启动对话框，ngmx查看蛋白质结构，这两个显示的结果已不能用ngmx命令了，我的电脑程序是5.1.2版本的。是不是可以改成：gmx nmtraj npt-nopr.trr -s npt-nopr.tpr
	gmx nmtraj npt-nopr.trr -s npt-nopr.tpr
	在以下的命令中，
	2. g_energy抽取性质数据
	3. g_confrms比较结构差异
	4. g_covar计算平均结构
	5. g_rms与g_rmsdist计算根均方偏差RMSD
	6. g_rmsf计算根均方涨落RMSF和温度因子
	7. g_gyrate计算回旋半径
	8. g_sas计算溶剂可及表面积
	9. do_dssp计算二级结构
	10. g_hbond统计氢键
	11. g_saltbr分析盐桥
	12. g_cluster分析团簇
	13. g_covar进行主成分分析
	14. g_angle进行二面角主成分分
	均已经在5.1.2版本中消失了。均应该改为：
	2. gmx energy抽取性质数据
	3. gmx confrms比较结构差异
	4. gmx covar计算平均结构
	5. gmx rms与gmx rmsdist计算根均方偏差RMSD
	6. gmx rmsf计算根均方涨落RMSF和温度因子
	7. gmx gyrate计算回旋半径
	8. gmx sas计算溶剂可及表面积
	9. gmx do_dssp计算二级结构
	10.gmx hbond统计氢键
	11. gmx saltbr分析盐桥
	12. gmx cluster分析团簇
	13. gmx covar进行主成分分析
	14. gmx angle进行二面角主成分分
	另外，3. gmx confrms比较结构差异，我运行后得到的fit.pdb，结果用vmd软件打开，结果很乱，不是显示的蛋白结构。

- 2016-06-03 15:07:27 `franklinly0533` gmx do_dssp计算二级结构,gmx sas计算溶剂可及表面积。这两个程序运行了两遍，没有成功，还不知道哪里出现了问题，正在探究中。

- 2016-06-03 15:15:01 `franklinly0533` gmx saltbr分析盐桥，我的电脑运行结果如下：
		……（注：结果行太多了，省略了）
		CG: CL4027-12422 Q: -1 Atoms: 12421
		CG: CL4028-12423 Q: -1 Atoms: 12422
		CG: CL4029-12424 Q: -1 Atoms: 12423
		CG: CL4030-12425 Q: -1 Atoms: 12424
		CG: CL4031-12426 Q: -1 Atoms: 12425
		CG: CL4032-12427 Q: -1 Atoms: 12426
		CG: CL4033-12428 Q: -1 Atoms: 12427
		Reading frame 10 time 10.000 已杀死
	这个说明是不是没有成功？

- 2016-06-03 15:19:28 `franklinly0533` 12. gmx cluster分析团簇，这个我得到的结果如下：
		Error in user input:
		Invalid command-line options
		In command-line option -dm
		File 'rmsd-matrix.xpm' does not exist or is not accessible.
		For more information and tips for troubleshooting, please check the GROMACS
		website at http://www.gromacs.org/Documentation/Errors
	命令行中的-dm 存在问题。rmsd-matrix.xpm不存在好像是由于前面有些步骤没有成功造成的哟。

- 2016-06-03 21:30:43 `Jerkwin` 谢谢测试. 你能不能把你测试的结果发我一份Jerkwin@qq.com, 我好将教程更新到gmx 5.x?

- 2016-10-06 11:29:35 `CYM` 用http://jerkwin.github.io/9999/11/01/GROMACS%E7%A8%8B%E5%BA%8F%E7%BC%96%E8%AF%91/上提供的GROMACS 5.1.1双精度版时，发现在“第五步：向盒子中填充溶剂及离子并进行能量最小化”之后，fws.top文件会变成0字节，无法进行之后的第六步。本人电脑的操作系统是Windows 8.1。
- 2016-10-06 13:34:00 `Jerkwin` Windows版本的gmx运行时由于权限问题可能导致无法自动更新top文件, 你需要自己手动将产生的一个名称中含有temp的临时文件复制到需要的top文件中, 直接将它重命名成需要的top文件也是可以的.

- 2017-01-17 20:23:01 `whtu` LZ，pdb文件下不下来，请问在哪可以找到呢？谢谢。
- 2017-01-18 21:57:28 `Jerkwin` 链接修复好了, 你再试试吧
