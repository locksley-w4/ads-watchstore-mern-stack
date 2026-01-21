# BUILD STAGE
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json . 
RUN npm ci
COPY . .
RUN npm run build --production

# DEPLOY/SERVE STAGEs
FROM nginx:stable-alpine
# RUN rm -rf /var/www/html
COPY --from=builder /app/build /usr/share/nginx/html/
RUN chown -R www-data:www-data /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/app.conf
# RUN ls -l /etc/nginx/conf.d/
# #RUN ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]