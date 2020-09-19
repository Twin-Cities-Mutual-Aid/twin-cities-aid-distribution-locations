FROM node:14.4.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# COPY ./bin ./bin/
# COPY ./public ./public/
# COPY ./specs ./specs/
# COPY ./src ./src/
# COPY ./web_modules ./web_modules/

EXPOSE 8080
