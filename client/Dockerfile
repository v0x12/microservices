FROM node:alpine

WORKDIR /user/app

COPY ./package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]