#!/bin/sh

image_version=latest
if [ $1 ]; then
  image_version=$1
fi

node_version=$(<.node-version)
docker build -t tc-aid-dl:$image_version --build-arg NODE_VERSION=$node_version . 