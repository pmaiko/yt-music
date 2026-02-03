FROM node:22-alpine AS node

ARG VITE_SERVER_PORT
ARG VITE_API_URL

ENV VITE_SERVER_PORT=$VITE_SERVER_PORT
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=node /app/dist /var/www/frontend

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 4000

#CMD ["tail", "-f", "/dev/null"]