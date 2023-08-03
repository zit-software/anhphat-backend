FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm install bcrypt

COPY . .

CMD [ "npm", "start" ]
