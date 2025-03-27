# STAGE 1

FROM node:lts-alpine AS BUILDER

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# STAGE 2

FROM node:lts-alpine AS PRODUCTION

RUN npm i -g serve

WORKDIR /app

COPY --from=BUILDER /app/dist /app

EXPOSE 3003

CMD [ "serve", "-s", "/app", "-l", "3003", "-n" ]
