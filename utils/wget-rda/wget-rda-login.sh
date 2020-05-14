#!/bin/bash
wget --save-cookies rda-cookies.txt \
     --keep-session-cookies \
     --post-data 'email=jgaigala@gmu.edu&passwd=U.9bGPr64.ic73W&remember=on&do=login' \
     --delete-after \
     https://rda.ucar.edu/cgi-bin/login
