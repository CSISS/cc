#!/bin/sh
set -e

# rebuild using maven
cd ..
mvn package

# copy over warfile
warfile=`ls -t target/*.war | head -1`
rm -f docker/CyberConnector.war
cp "$warfile" docker/CyberConnector.war

cd docker

# build docker file
docker build . -t csiss/cyberconnector