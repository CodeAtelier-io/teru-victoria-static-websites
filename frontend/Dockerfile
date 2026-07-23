FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG ANGULAR_ENVIRONMENT=production

RUN npm run build -- --configuration=${ANGULAR_ENVIRONMENT}

FROM nginx:1.27-alpine

# envsubst (from gettext) is used by the entrypoint script to inject per-instance
# ENV vars into config.json at container startup.
RUN apk add --no-cache gettext

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY docker/config.template.json /etc/sitecms/config.template.json
COPY docker/30-runtime-config.sh /docker-entrypoint.d/30-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/30-runtime-config.sh

COPY --from=build /app/dist/admin-panel/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]