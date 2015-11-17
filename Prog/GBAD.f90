program Graphene

	integer, parameter:: Linp=1, Lout=8

	integer	i, j, k, l, Ierr, Narg, Natm, Mmax, Nmax, m, n, Nbnd, Nang, N13, Ndih
	real*8	Xbox, Ybox, Zbox, Xj, Yj, dXk, dYk, dXi, dYi, dXl, dYl

	integer, allocatable:: Mcub(:), Ncub(:)
	real*8,  allocatable:: Xatm(:), Yatm(:), Zatm(:)
	logical, allocatable:: YesAdj(:,:)
	character*80, allocatable:: Latm(:)

	character*80	Finp, txt, Gres, Pbnd, P13, Pang, Pdih, Pcis, Ptrs, Lab

	Pbnd = '3    0.12708    980.81328    17.529'
	P13  = '8    1    1.0'
	Pang = '1    120.    151.71184'
	Pcis = '1     0.     -0.8815688    2'
	Ptrs = '1    180.    12.5515816    2'

	Narg = Nargs()-1
	if(Narg>0) then
		call getarg(1, Finp, Ierr)
		i = index(Finp, '.xyz')-1
		if(i>0) Finp = Finp(1:i)
		open(unit=Linp, file=trim(Finp)//'.xyz', status='old', IOstat=Ierr)
		open(unit=Lout, file=trim(Finp)//'~BAD.top', IOstat=Ierr)
		goto 100
	end if

	print*, '>>>>>>>>>>>>>>>>Program GBAD Running <<<<<<<<<<<<<<<<'
	print*,	'>>>>>>>>>>>>>>>>    Jicun LI           <<<<<<<<<<<<<<<<'
	print*, '>>>>>>>>>>>>>>>>  2014-09-26 11:01:11  <<<<<<<<<<<<<<<<'

	print*, '>>Type XYZ File Name (*.xyz/Exit):'
	read*, Finp
	if(index(Finp, 'exit')/=0 .or. index(Finp, 'Exit')/=0) stop '>>Normal Exit of Program GBAD.'

	open(unit=Linp, file=trim(adjustl(Finp))//'.xyz', status='old', IOstat=Ierr)
	do  while(Ierr/=0)
		print*, '>>XYZ Input File  .\'//trim(adjustl(Finp))//'.xyz  NOT Exist !'
		print*, '>>Revise Input File Name (*.xyz/Exit):'
		read*, Finp
		if(index(Finp, 'exit')/=0 .or. index(Finp, 'Exit')/=0) stop '>>Normal Exit of Program GBAD.'
		open(unit=Linp, file=trim(adjustl(Finp))//'.xyz', status='old', IOstat=Ierr)
	end do
	open(unit=Lout, file=trim(adjustl(Finp))//'~BAD.top', IOstat=Ierr)

100	read(Linp, *) Natm
	read(Linp, *) txt, Mmax, Nmax, txt, txt, txt, Xbox, Ybox, Zbox

	write(txt, *) Mmax; Gres = 'G'//trim(adjustl(txt))
	write(txt, *) Nmax; Gres = trim(Gres)//'x'//trim(adjustl(txt))

	allocate(Mcub(Natm), Ncub(Natm), Latm(Natm), &
	&		Xatm(Natm), Yatm(Natm), Zatm(Natm), YesAdj(Natm, Natm))

	write(Lout, *) '[ moleculetype ]'
	write(Lout, *) ';molname    nrexcl'
	write(Lout, *) trim(Gres)//'    2'
	write(Lout, *) '[ atoms ]'
	write(Lout, *) ';ID  AtmTyp  Res# ResName AtmName Chg# charge'

	do i=1, Natm
		read(Linp, *) txt, Xatm(i), Yatm(i), Zatm(i), Latm(i), Mcub(i), Ncub(i)
		write(Lout, '(2(I6, A))') i, '    C    1    '//trim(Gres)//'    C ', i, '  0'
	end do

	YesAdj = .false.

	write(Lout, *) '[ bonds ]'
	Nbnd = 0
	do i=1, Natm
		Lab = Latm(i); m = Mcub(i); n = Ncub(i)
		do j=i+1, Natm
			if(Mcub(j)==m .and. Ncub(j)==n) then
				if(    (Lab=='#1' .and. Latm(j)=='#2') &
				& .or. (Lab=='#2' .and. Latm(j)=='#3') &
				& .or. (Lab=='#3' .and. Latm(j)=='#4') ) YesAdj(i, j)=.true.
			else if(Mcub(j)==m) then
				if(     (Lab=='#1' .and. Latm(j)=='#4') &
				& .and. (Ncub(j)==n-1 .or. (n==1 .and. Ncub(j)==Nmax)) ) YesAdj(i, j)=.true.
				if(     (Lab=='#4' .and. Latm(j)=='#1') &
				& .and. (Ncub(j)==n+1 .or. (n==Nmax .and. Ncub(j)==1)) ) YesAdj(i, j)=.true.
			else if(Ncub(j)==n) then
				if(     ( (Lab=='#1' .and. Latm(j)=='#2') .or. (Lab=='#4' .and. Latm(j)=='#3') ) &
				& .and. ( Mcub(j)==m-1 .or. (m==1 .and. Mcub(j)==Mmax)) ) YesAdj(i, j)=.true.
				if(     ( (Lab=='#2' .and. Latm(j)=='#1') .or. (Lab=='#3' .and. Latm(j)=='#4') ) &
				& .and. ( Mcub(j)==m+1 .or. (m==Mmax .and. Mcub(j)==1)) ) YesAdj(i, j)=.true.
			end if

			if(YesAdj(i,j)) then
				Nbnd = Nbnd+1
				YesAdj(j, i) = .true.
				write(Lout, '(2I6, 4X, 2A, I6)') i, j, trim(Pbnd), ' ; #', Nbnd
			end if
		end do
	end do

	print*, '>> #Atom:      ', Natm
	print*, '>> #Bond:      ', Nbnd, ' / ', 3*Natm/2

	write(Lout, *) '; 1-3 Bond'
	N13=0
	do j=1, Natm
		do i=j+1, Natm
			if(YesAdj(i,j)) then
				do k=1, Natm
					if(k/=i .and. k/=j .and. YesAdj(j,k)) then
					N13 = N13+1
					write(Lout, '(2I6, 4X, 2A, I6)') i, k, trim(P13), ' ; #', N13
				end if
			end do
			end if
		end do
	end do
	print*, '>> #Bond(1-3): ', N13, ' / ', 3*Natm

	write(Lout, *) '[ angles ]'
	Nang=0
	do j=1, Natm
		do i=j+1, Natm
			if(YesAdj(i,j)) then
				do k=1, Natm
					if(k/=i .and. k/=j .and. YesAdj(j,k)) then
						Nang = Nang+1
						write(Lout, '(3I6, 4X, 2A, I6)') i, j, k, trim(Pang), ' ; #', Nang
					end if
				end do
			end if
		end do
	end do
	print*, '>> #Angle:     ', Nang, ' / ', 3*Natm

	write(Lout, *) '[ dihedrals ]'
	Ndih=0
	do j=1, Natm
		Xj=Xatm(j); Yj=Yatm(j)
		do k=j+1, Natm
			if(YesAdj(j,k)) then
				dXk=Xatm(k)-Xj; if(abs(dXk)>=0.5*Xbox) dXk=dXk-sign(Xbox, dXk)
				dYk=Yatm(k)-Yj; if(abs(dYk)>=0.5*Ybox) dYk=dYk-sign(Ybox, dYk)

				do i=1, Natm
					if(i/=j .and. i/=k .and. YesAdj(i,j)) then
						dXi=Xatm(i)-Xj; if(abs(dXi)>=0.5*Xbox) dXi=dXi-sign(Xbox, dXi)
						dYi=Yatm(i)-Yj; if(abs(dYi)>=0.5*Ybox) dYi=dYi-sign(Ybox, dYi)
						do l=1, Natm
							if(l/=j .and. l/=k .and. YesAdj(l,k)) then
								Ndih = Ndih+1
								dXl=Xatm(l)-Xj; if(abs(dXl)>=0.5*Xbox) dXl=dXl-sign(Xbox, dXl)
								dYl=Yatm(l)-Yj; if(abs(dYl)>=0.5*Ybox) dYl=dYl-sign(Ybox, dYl)
								Pdih = Ptrs
								if( (dYk*dXi-dXk*dYi)*(dYk*dXl-dXk*dYl) >0 ) Pdih = Pcis
								write(Lout, '(4I6, 4X, 2A, I6)') i, j, k, l, trim(Pdih), ' ; #', Ndih
							end if
						end do
					end if
				end do
			end if
		end do
	end do
	print*, '>> #Dihedral:  ', Ndih, ' / ', 6*Natm

	write(Lout, *) '; #Bond:      ', Nbnd, ' /', 3*Natm/2
	write(Lout, *) '; #Bond(1-3): ', N13,  ' /', 3*Natm
	write(Lout, *) '; #Angle:     ', Nang, ' /', 3*Natm
	write(Lout, *) '; #Dihedral:  ', Ndih, ' /', 6*Natm

End Program
