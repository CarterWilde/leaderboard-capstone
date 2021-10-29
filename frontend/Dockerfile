FROM node:lts-alpine AS build
WORKDIR /app
COPY . .

EXPOSE 80

RUN npm install
RUN npm run build

RUN npm install express --no-save

CMD [ "node", "server.js" ]