#!/bin/bash

set -x
# ex: source /opt/anaconda3/etc/profile.d/conda.sh

source "$1/etc/profile.d/conda.sh"

conda activate esmpy8

# regrid.py datafile gridfile outfile
python "$5" "$2" "$3" "$4"


