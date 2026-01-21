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
COPY nginx.conf /etc/nginx/conf.d/app.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]