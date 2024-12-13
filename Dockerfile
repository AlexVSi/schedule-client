FROM node:lts AS build-stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
RUN ls
FROM nginx:stable AS production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]