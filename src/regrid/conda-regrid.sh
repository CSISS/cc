#!/bin/bash

# ex: source /opt/anaconda3/etc/profile.d/conda.sh

echo "source "$2"/etc/profile.d/conda.sh"

source "$2/etc/profile.d/conda.sh"

echo "conda activate esmpy8"

conda activate esmpy8

echo "python "$6" "$2" "$3" "$4

# regrid.py datafile gridfile outfile
python "$5" "$2" "$3" "$4"


