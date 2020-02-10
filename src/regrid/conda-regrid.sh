#!/bin/bash

# ex: source /opt/anaconda3/etc/profile.d/conda.sh
source "$2/etc/profile.d/conda.sh"

conda activate esmpy8

# regrid.py datafile gridfile outfile
python ./regrid.py "$3" "$4" "$5"


