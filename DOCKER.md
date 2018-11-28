### Building docker image

`gradle docker`


### Test docker image locally

`docker run --rm -p 8081:8080 -ti csiss/cyberconnector`

open `http://localhost:8081`


### Login and upload the image to Dockerhub

`docker login --username=yourhubusername --email=youremail@company.com`

`docker push csiss/cyberconnector`
