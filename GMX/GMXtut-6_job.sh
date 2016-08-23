#!/bin/bash

# Set some environment variables 
FREE_ENERGY=/home/justin/Free_Energy
echo "Free energy home directory set to $FREE_ENERGY"

MDP=$FREE_ENERGY/MDP
echo ".mdp files are stored in $MDP"

LAMBDA=0

# A new directory will be created for each value of lambda and
# at each step in the workflow for maximum organization.

mkdir Lambda_$LAMBDA
cd Lambda_$LAMBDA

#################################
# ENERGY MINIMIZATION 1: STEEP  #
#################################
echo "Starting minimization for lambda = $LAMBDA..." 

mkdir EM_1 
cd EM_1

# Iterative calls to grompp and mdrun to run the simulations

gmx grompp -f $MDP/EM/em_steep_$LAMBDA.mdp -c $FREE_ENERGY/Methane/methane_water.gro -p $FREE_ENERGY/Methane/topol.top -o min$LAMBDA.tpr

mdrun -nt 2 -deffnm min$LAMBDA

sleep 10

#################################
# ENERGY MINIMIZATION 2: L-BFGS #
#################################

cd ../
mkdir EM_2
cd EM_2

# We use -maxwarn 1 here because grompp incorrectly complains about use of a plain cutoff; this is a minor issue
# that will be fixed in a future version of Gromacs
gmx grompp -f $MDP/EM/em_l-bfgs_$LAMBDA.mdp -c ../EM_1/min$LAMBDA.gro -p $FREE_ENERGY/Methane/topol.top -o min$LAMBDA.tpr -maxwarn 1

# Run L-BFGS in serial (cannot be run in parallel)

mdrun -nt 1 -deffnm min$LAMBDA

echo "Minimization complete."

sleep 10

#####################
# NVT EQUILIBRATION #
#####################
echo "Starting constant volume equilibration..."

cd ../
mkdir NVT
cd NVT

gmx grompp -f $MDP/NVT/nvt_$LAMBDA.mdp -c ../EM_2/min$LAMBDA.gro -p $FREE_ENERGY/Methane/topol.top -o nvt$LAMBDA.tpr

mdrun -nt 2 -deffnm nvt$LAMBDA

echo "Constant volume equilibration complete."

sleep 10

#####################
# NPT EQUILIBRATION #
#####################
echo "Starting constant pressure equilibration..."

cd ../
mkdir NPT
cd NPT

gmx grompp -f $MDP/NPT/npt_$LAMBDA.mdp -c ../NVT/nvt$LAMBDA.gro -p $FREE_ENERGY/Methane/topol.top -t ../NVT/nvt$LAMBDA.cpt -o npt$LAMBDA.tpr

mdrun -nt 2 -deffnm npt$LAMBDA

echo "Constant pressure equilibration complete."

sleep 10

#################
# PRODUCTION MD #
#################
echo "Starting production MD simulation..."

cd ../
mkdir Production_MD
cd Production_MD

gmx grompp -f $MDP/Production_MD/md_$LAMBDA.mdp -c ../NPT/npt$LAMBDA.gro -p $FREE_ENERGY/Methane/topol.top -t ../NPT/npt$LAMBDA.cpt -o md$LAMBDA.tpr

mdrun -nt 2 -deffnm md$LAMBDA

echo "Production MD complete."

# End
echo "Ending. Job completed for lambda = $LAMBDA"
