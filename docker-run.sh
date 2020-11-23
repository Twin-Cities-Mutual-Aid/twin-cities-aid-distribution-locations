#!/bin/sh

image_version=latest
if [ $1 ]; then
  image_version=$1
fi

IMAGE_VERSION=$image_version docker-compose up -d