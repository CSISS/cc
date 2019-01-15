## Building docker image

`gradle docker`


## Test docker image locally

`docker run --rm -p 8080:8080 -ti csiss/cyberconnector`

open `http://localhost:8080`


## Override CyberConnector configuration

You can provide custom configuration to the CC client in two ways
(_the two methods can be combined_):


## Docker parameters

`docker run --rm -p 8080:8080 -ti csiss/cyberconnector --edu.cyberconnector.overridekey=your-value`


## Custom configuration file via Docker volume


`docker run --rm -p 8080:8080 -v custom-config.yml:/run/application.yml -ti csiss/cyberconnector`




## Login and upload the image to Dockerhub

`docker login --username=yourhubusername --email=youremail@company.com`

`docker push csiss/cyberconnector`
