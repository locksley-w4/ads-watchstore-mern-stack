FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json . 

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable

RUN rm -rf /var/www/html

COPY --from=builder /app/build /var/www/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]