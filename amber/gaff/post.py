#-*-coding:utf-8 -*-
from subprocess import Popen,PIPE
import sys 
import os
import glob

if sys.version[0]=="2":
    input=raw_input
if not os.path.exists("RESNAME.txt"):
    #print("File not exists.")
    resname=input("Please specify a residue name for the molecule,3 capital letter-->")
    charge=float(input("Please specify the netcharge of the system-->"))
    PDBname=input("Please specify the original pdbfile of your residue-->")
else:
    with open("RESNAME.txt",'r') as reader:
        resname=reader.readline().strip().rstrip("\r\n").rstrip("\n")
        charge=float(reader.readline().strip().rstrip("\r\n").rstrip("\n"))
        PDBname=reader.readline().strip().rstrip("\r\n").rstrip("\n")
outname="%s.out" %(resname)

if not os.path.exists("%s.out" %(resname)):
    #print("File not exists.")
    outname=input("Please specify the gaussian output filename-->")
print("Fitting RESP charge...")
cmd2='antechamber -i %s -fi gout -o %s.mol2 -fo mol2 -s 2 -rn %s -nc %s -pf y -c resp' %(outname,resname,resname,charge) 
p3 = Popen(cmd2,shell=True,stdout=PIPE)
p3.wait() 


class MOL2(object):
    def __init__(self,files):
        self.atoms=0
        self.bonds=0
        self.to_write=[]
        self.reader=open(files,'r') 
        self.allatoms=[]
        self.allbonds=[]
        self.info=""
    def read(self):
        self.reader.readline()
        self.to_write.append(self.reader.readline())
        tmp=self.reader.readline()
        self.atoms=int(tmp.split()[0])
        self.bonds=int(tmp.split()[1])
        self.to_write.append(tmp)
        self.to_write.append(self.reader.readline())
        self.to_write.append(self.reader.readline())
        while ("ATOM" not in self.reader.readline()):
            pass
        for i in range(self.atoms):
            atom={}
            tmp=self.reader.readline().split()

            atom['id']=int(tmp[0])
            atom['name']=tmp[1]
            atom['x']=float(tmp[2])
            atom['y']=float(tmp[3])
            atom['z']=float(tmp[4])
            atom['type']=tmp[5]
            atom['mol']=int(tmp[6])
            atom['RESname']=tmp[7]
            atom['charge']=float(tmp[8])
            #print(atom)
            self.allatoms.append(atom)
        while ("BOND" not in self.reader.readline()):
            pass
        for i in range(self.bonds):
            tmp_=self.reader.readline().split()
            tmp=[int(j) for j in tmp_[:3] ]
            tmp.append(tmp_[-1])
            self.allbonds.append(tmp)
        while ("SUBSTRUCTURE" not in self.reader.readline()):
            pass
        self.info=self.reader.readline()
        self.reader.close()

gaffmol2=MOL2("%s.mol2" %(resname))
gaffmol2.read()


with open(PDBname,'r') as reader:
    all_cont=reader.readlines()
    atomnames=[]
    for i in all_cont:
        if i.startswith("HETATM"):
            atomnames.append(i.split()[2])

with open("%s_rename.mol2" %(resname),'w') as writer:
    writer.write("@<TRIPOS>MOLECULE\n") 
    writer.write(gaffmol2.to_write[0])
    tmp1=gaffmol2.to_write[1].split()
    writer.write("%5d %5d %5s %5s %5s\n" %(len(gaffmol2.allatoms),len(gaffmol2.allbonds),tmp1[2],tmp1[3],tmp1[4]))
    for i in range(2,4):
        writer.write(gaffmol2.to_write[i])
    writer.write("\n")
    writer.write("\n")
    writer.write("@<TRIPOS>ATOM\n") 
    for j in range(len(atomnames)):
        gaffmol2.allatoms[j]['name']=atomnames[j]
    indexs=1
    for i in range(len(gaffmol2.allatoms)):
        tmps="%7s %-8s%11.4f%11.4f%11.4f %-8s%4d %3s%15.6f\n"  %(indexs,gaffmol2.allatoms[i]['name'],gaffmol2.allatoms[i]['x'],gaffmol2.allatoms[i]['y'],gaffmol2.allatoms[i]['z'],gaffmol2.allatoms[i]['type'],gaffmol2.allatoms[i]['mol'],gaffmol2.allatoms[i]['RESname'],gaffmol2.allatoms[i]['charge'])
        writer.write(tmps)
        indexs+=1
    writer.write("@<TRIPOS>BOND\n")
    for i in gaffmol2.allbonds:
        writer.write("%6d%6d%6d %-4s\n" %(i[0],i[1],i[2],i[3]))
    writer.write("@<TRIPOS>SUBSTRUCTURE\n")
    writer.write(gaffmol2.info)


print("Checking parameters...")
cmd3='parmchk2 -i %s_rename.mol2 -f mol2 -o %s.frcmod' %(resname,resname)

p4 = Popen(cmd3,shell=True,stdout=PIPE)
p4.wait() 

print("Tleap sentences for your reference.")
print()
print("source leaprc.gaff")
print("set default PBRadii mbondi3")
print("%s= loadmol2 %s_rename.mol2" %(resname,resname))
print("loadAmberParams %s.frcmod" %(resname))
print()
with open("%s.frcmod" %(resname)) as reader:
    alls=reader.read()
if "ATT" in alls:
    print("Attention! Some parameters are missing!")
else:
    print("No parameters are missing, but should be checked by yourself!")
    