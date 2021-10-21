FROM node:latest AS build
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . .

EXPOSE 80

RUN apt-get update
RUN apt-get install nginx -y

RUN npm install
RUN npm run build

RUN rm /etc/nginx/conf.d/default.conf

# RUN mkdir -p /srv/front-end
# RUN cp -r build/* /srv/front-end
RUN mkdir -p /var/www/html
RUN cp -r build/* /var/www/html

CMD ["nginx", "-g", "daemon off;"]