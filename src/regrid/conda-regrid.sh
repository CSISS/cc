#!/bin/bash

# ex: source /opt/anaconda3/etc/profile.d/conda.sh
. "$1/etc/profile.d/conda.sh"

conda activate esmpy8

# regrid.py datafile gridfile outfile
python ./regrid.py "$2" "$3" "$4"


