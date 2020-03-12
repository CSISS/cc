#!/bin/bash

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     platform=linux;;
    Darwin*)    platform=mac;;
    *)          platform="UNKNOWN:${unameOut}"
esac


if [ "$#" -ne 2 ]; then
    echo "Usage: install.sh ANACONDA_INSTALL_DIR DATA_DIR"
    echo "Example: install.sh /opt/anaconda3 /data"
    exit 1
fi

CONDA_DIR="$1"
DATA_DIR="$2"


echo "Installing conda xESMF environment"
/bin/bash ./config-conda-esmf.sh "$CONDA_DIR"

# install JRE and NCO
if [ $platform == 'mac' ]; then
	if ! [ -x "$(command -v brew)" ]; then
	  echo 'Error: homebrew is not installed.' >&2
	  exit 1
	fi

	brew tap AdoptOpenJDK/openjdk
	brew cask install adoptopenjdk8
	brew install nco
	NCO_DIR="/usr/local/bin"
else
	# fail on errors
	set -e
	if ! [ -d java-se-8u40-ri ];then
		echo "Downloading OpenJDK (8u40-b25)"
		curl -L https://download.java.net/openjdk/jdk8u40/ri/openjdk-8u40-b25-linux-x64-10_feb_2015.tar.gz --output openjdk-8u40-b25-linux-x64-10_feb_2015.tar.gz
		tar -zxvf openjdk-8u40-b25-linux-x64-10_feb_2015.tar.gz
	fi


	if [ -x "$(command -v yum)" ]; then
		sudo yum install epel-release -y
		sudo yum install nco dos2unix -y
	else
		sudo apt-get install nco dos2unix -y
	fi
	NCO_DIR="/usr/bin"
fi

# fail on errors
set -e
	
if [ -f apache-tomcat-8.5.28.tar.gz ];then
	echo "Found apache-tomcat-8.5.28.tar.gz"
else
	echo "Downloading apache-tomcat-8.5.28.tar.gz"

	curl https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.28/bin/apache-tomcat-8.5.28.tar.gz --output apache-tomcat-8.5.28.tar.gz
fi

echo "Extracting apache-tomcat-8.5.28.tar.gz"
rm -rf apache-tomcat-8.5.28
tar -zxvf apache-tomcat-8.5.28.tar.gz

echo "Downloading CyberConnector.war (latest) into Apache Tomcat webapps folder"
curl -L https://github.com/CSISS/cc/releases/download/latest/CyberConnector.war --output CyberConnector.war
mv CyberConnector.war apache-tomcat-8.5.28/webapps/

echo "Downloading ncWMS2.war (2.4.2) into Apache Tomcat webapps folder"
curl -L https://github.com/Reading-eScience-Centre/ncwms/releases/download/ncwms-2.4.2/ncWMS2.war --output ncWMS2.war
mv ncWMS2.war apache-tomcat-8.5.28/webapps/


echo "Configuring Apache Tomcat"
cp tomcat-users.xml apache-tomcat-8.5.28/conf

if [ $platform == 'linux' ]; then
	sed '109 a JAVA_HOME='$PWD'/java-se-8u40-ri/' apache-tomcat-8.5.28/bin/catalina.sh > apache-tomcat-8.5.28/bin/catalina2.sh
	mv apache-tomcat-8.5.28/bin/catalina2.sh apache-tomcat-8.5.28/bin/catalina.sh
fi

# echo "Configuring ncWMS2"

echo "Starting Apache Tomcat"
chmod 755 apache-tomcat-8.5.28/bin/catalina.sh
chmod 755 apache-tomcat-8.5.28/bin/startup.sh
/bin/bash  apache-tomcat-8.5.28/bin/startup.sh

echo "Waiting for CyberConnector.war to be deployed..."
wait=0
while [ ! -f apache-tomcat-8.5.28/webapps/CyberConnector/WEB-INF/classes/config.properties ] && [ $wait -le 300 ]; do
	sleep 1
	wait=$(( $wait + 1 ))
	echo -n .
done

echo " deployed"

echo "Configuring CyberConnector COVALI"
pushd .
cd apache-tomcat-8.5.28/webapps/CyberConnector/WEB-INF/classes


# remove comments
sed -i'' '/^\s*#.*$/d' config.properties
# remove empty lines
# sed -i '' '/^[[:space:]]*$/d' config.properties
# anaconda
sed -i'' 's|anaconda_path=.*|anaconda_path='$CONDA_DIR'|g' config.properties
# data dir
sed -i'' 's|covali_file_path=.*|covali_file_path='$DATA_DIR'|g' config.properties
# nco
sed -i'' 's|ncra_path=.*|ncra_path='$NCO_DIR'/ncra|g' config.properties
sed -i'' 's|ncbo_path=.*|ncbo_path='$NCO_DIR'/ncbo|g' config.properties

popd


echo "Restarting Apache Tomcat (takes several minutes)..."
sleep 180
/bin/bash apache-tomcat-8.5.28/bin/shutdown.sh
sleep 120

/bin/bash apache-tomcat-8.5.28/bin/startup.sh
sleep 120


echo 'CyberConnector COVALI is successfully installed!'

echo '********************************************************************'

echo 'Please visit http://localhost:8080/CyberConnector/web/covali to use CyberConnector COVALI'

echo '********************************************************************'
