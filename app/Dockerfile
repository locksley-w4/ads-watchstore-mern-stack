FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json . 

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable

RUN rm -rf /var/www/html

COPY --from=builder /app/build /var/www/app/html/

RUN chown -R www-data:www-data /var/www/app/html

COPY nginx.conf /etc/nginx/conf.d/app.conf
RUN ls -l /etc/nginx/conf.d/

#RUN ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]