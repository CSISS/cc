#!/bin/bash

TMPDIR="update-tmp/$(date +"%Y-%m-%d.%H%M%S")"
mkdir -p $TMPDIR




echo "Saving settings to $TMPDIR"
cp -r apache-tomcat-8.5.28/webapps/CyberConnector/uploadFile "$TMPDIR/"
cp apache-tomcat-8.5.28/webapps/CyberConnector/WEB-INF/classes/config.properties "$TMPDIR/"

echo "Updating CyberConnector.war deployment"
curl -L https://github.com/CSISS/cc/releases/download/latest/CyberConnector.war --output CyberConnector.war
rm -rf apache-tomcat-8.5.28/webapps/CyberConnector*
mv CyberConnector.war apache-tomcat-8.5.28/webapps/


echo "Waiting for CyberConnector.war to be deployed..."
wait=0
while [ ! -f apache-tomcat-8.5.28/webapps/CyberConnector/WEB-INF/classes/config.properties ] && [ $wait -le 300 ]; do
	sleep 1
	wait=$(( $wait + 1 ))
	echo -n .
done
echo " deployed"


cp -f "$TMPDIR/config.properties" apache-tomcat-8.5.28/webapps/CyberConnector/WEB-INF/classes/config.properties
cp -rf "$TMPDIR/uploadFile" apache-tomcat-8.5.28/webapps/CyberConnector/


echo "Restarting Apache Tomcat (takes several minutes)..."
echo "Stopping Apache Tomcat..."
sleep 120
/bin/bash -lc "$PWD/apache-tomcat-8.5.28/bin/catalina.sh stop"
sleep 120

echo "Starting Apache Tomcat..."
/bin/bash -lc "$PWD/apache-tomcat-8.5.28/bin/catalina.sh start"
sleep 120


echo 'CyberConnector COVALI is successfully updated!'

echo "Removing the backup folder $TMPDIR"
rm -rf "$TMPDIR"

