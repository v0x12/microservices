FROM node:alpine

WORKDIR /user/app

COPY ./package.json ./

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]