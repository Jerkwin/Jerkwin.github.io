#-*-coding:utf-8 -*-
from subprocess import Popen,PIPE
import sys 
import os
import shutil

if len(sys.argv)<2:
    print("Usage:python pre.py yourpdb netcharge")
    exit(1)
elif len(sys.argv)==2:
    file=sys.argv[1]
    charge=0.0
else:
    file=sys.argv[1]
    try:
        charge=float(sys.argv[2])
    except:
        print("Usage:python pre.py yourpdb netcharge")
        exit(1)        
if not os.path.exists(file):
        print("File not exists.")
        exit(1) 

print("Adding Some Hydrogens...")
if sys.version[0]=="2":
    input=raw_input
resname=input("Please specify a residue name for the molecule,3 capital letter-->")

shutil.copy(file,resname+"_bak.pdb" )

p21 = Popen("reduce {0}_bak.pdb > {0}.pdb" .format(resname),shell=True,stdout=PIPE)
p21.wait() 

element = ['H','HE','LI','BE','B','C','N','O','F','NE',\
     'NA','MG','AL','SI','P','S','CL','AR',\
     'K','CA','SC','TI','V','CR','MN','FE',\
     'CO','NI','CU','ZN','GA','GE','AS','SE','BR','KR',\
     'RB','SR','Y','ZR','Nb','MO','TC','RU',\
     'RH','PD','AG','CD','IN','SN','SB','TE','I','XE',\
     'CS','BA','LA','CE','PR','ND','PM',\
     'SM','EU','GD','TB','DY','HO','ER','TM','YB','LU','HF','TA','W',\
     'RE','OS','IR','PT','AU','HG','TL','PB','BI','PO','AT','RN',\
     'FR','RA','AC','TH','PA','U','NP',\
     'PU','AM','CM','BK','CF','ES','FM','MD','NO','LR']
atomiccharge=list(range(1,len(element)+1))

real_charge=0
atoms_=0

cmd='antechamber -i {0}.pdb -fi pdb -o {0}.gjf -fo gcrt -pf y -gm "%mem=1GB" -gn \
"%nproc=2" -nc {1} -gk "#B3LYP/6-311G** em=GD3BJ opt scrf=solvent=water iop(6/33=2)\
 pop=CHELPG"' .format(resname,charge)
#print(cmd)
p2 = Popen(cmd,shell=True,stdout=PIPE)
p2.wait()
# calculation real charge
gjf="%s.gjf"%(resname)
with open(gjf) as reader:
    all_=reader.readlines()
    for i in all_:
        if len(i.split())>=4 and i[0]==' ':
            #print(i)
            real_charge+=atomiccharge[element.index(i.split()[0].upper())]
            atoms_+=1
if (real_charge % 2) != 0:
    charge=float(input("Your residue may be protonated,please confirm it in %s-->" %(resname)))
print("Generating Gaussian input...")
cmd='antechamber -i {0}.pdb -fi pdb -o {0}.gjf -fo gcrt -pf y -gm "%mem=1GB" -gn \
"%nproc=2" -nc {1} -gk "#B3LYP/6-311G** em=GD3BJ opt scrf=solvent=water iop(6/33=2)\
 pop=CHELPG"' .format(resname,charge)
#print(cmd)
p2 = Popen(cmd,shell=True,stdout=PIPE)
p2.wait()
with open("RESNAME.txt",'w') as writer:
    writer.write(resname)
    writer.write('\n') 
    writer.write(str(charge))  
    writer.write('\n') 
    writer.write(resname+".pdb") 
