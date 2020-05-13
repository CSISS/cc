#!/bin/sh
set -e

# rebuild using maven
cd ..
mvn package

# copy over the most recent warfile
# and rename it to CyberConnector.war
warfile=`ls -t target/*.war | head -1`
rm -f docker/CyberConnector.war
cp "$warfile" docker/CyberConnector.war

# copy over seed database
cp -f db/cc.mv.db docker/cc.mv.db

cd docker

# build docker file
docker build . -t csiss/cc