FROM node:16.18.0
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i npm -g
RUN npm i supervisor -g
RUN npm i
EXPOSE 3001
CMD supervisor ./index.js
