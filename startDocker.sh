#!/bin/bash

if [ $# -ne 1 ]; then
	echo $0: usage: startDocker version
	exit 1
fi

version=$1

echo Start Building New Version
docker build -t registry.gitlab.be/enicky/invoicing:$version .
echo New version build. Tagging to latest version
docker tag registry.gitlab.be/enicky/invoicing:$version  registry.gitlab.be/enicky/invoicing:latest
echo pushing new versions to docker registry
docker push registry.gitlab.be/enicky/invoicing:$version
docker push registry.gitlab.be/enicky/invoicing:latest

echo Updating local running version to latest version
echo Stopping instance
docker stop invoice
echo Removing instance
docker rm invoice
echo Starting new instance
docker run -t -i -p 1337:1337 --name invoice --restart always -d registry.gitlab.be/enicky/invoicing:latest
echo Done!!
