#!/bin/bash

# ex: source /opt/anaconda3/etc/profile.d/conda.sh
source "$1/etc/profile.d/conda.sh"

conda activate esmpy8

# regrid.py datafile gridfile outfile
python "$6" "$2" "$3" "$4"


