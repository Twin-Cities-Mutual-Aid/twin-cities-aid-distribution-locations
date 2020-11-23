ARG NODE_VERSION=14.4.0
FROM node:$NODE_VERSION-alpine

WORKDIR /usr/src/app

COPY package*.json snowpack.config.js ./
COPY ./public ./public/
COPY ./src ./src/
COPY ./web_modules ./web_modules/

RUN npm install && \
    chown -R node ./

EXPOSE 8080

USER node