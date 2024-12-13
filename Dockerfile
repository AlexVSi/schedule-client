FROM node:lts-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 3003
CMD [ "serve", "-s", "dist", "-l", "3003", "-n" ]