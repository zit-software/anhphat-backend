FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install

CMD [ "npm", "start" ]
