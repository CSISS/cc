1. Copy CyberConnector.war and ncWMS2.war files to this folder
2. Build the image: `docker build . -t csiss/cyberconnector` 
3. Run the container: `docker run -p 8080:8080 -v $(pwd)/covaliFiles:/covaliFiles -ti csiss/cyberconnector` (or use `run.sh`)
4. Open `http://localhost:8080/CyberConnector/web/covali`

Any data placed in the folder `covaliFiles` will become available to the containerized application. 


More info about Tomcat configuration: https://hub.docker.com/r/fabric8/tomcat-8