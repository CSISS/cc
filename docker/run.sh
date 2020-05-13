#!/bin/sh
docker run -p 8080:8080 -v $(pwd)/covaliFiles:/opt/jboss/covaliFiles -ti csiss/cc
