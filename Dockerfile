FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm i
RUN npm i -g typescript

RUN npm run build

CMD ["./wait-for-it.sh" , "mysql:3306" , "--timeout=300" , "--" , "npm", "run", "test:database"]
