#!/bin/bash

echo Conda: source "$1"/etc/profile.d/conda.sh 
source "$1"/etc/profile.d/conda.sh 

echo "Creating conda environment 'esmpy8'"
conda create -n esmpy8 -y 

echo "Installing conda xesmf and dependencies"
conda install -y -n esmpy8  -c conda-forge "esmf!=*nompi" esmpy xarray=0.14.1 scipy dask netCDF4 xesmf libnetcdf=4.6.2 netcdf4=1.5.1
