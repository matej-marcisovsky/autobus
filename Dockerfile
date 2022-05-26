FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

RUN npm i -g typescript less

RUN npm ci

COPY . .

RUN npm run bundle

EXPOSE 3000

CMD node ./dist/server/app.js
