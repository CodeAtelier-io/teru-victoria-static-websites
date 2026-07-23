FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# BRAND selects the white-label build; ANGULAR_ENVIRONMENT the ng configuration.
# build:<brand> runs set-brand.mjs then `ng build --output-path dist/<brand>`.
# The trailing args are appended to that ng build call.
ARG BRAND=victoria
ARG ANGULAR_ENVIRONMENT=production

RUN npm run build:${BRAND} -- --configuration=${ANGULAR_ENVIRONMENT}

FROM nginx:1.27-alpine

# envsubst (from gettext) is used by the entrypoint script to inject per-instance
# ENV vars into config.json at container startup.
RUN apk add --no-cache gettext

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# config.json is rendered from ENV at startup by the entrypoint (envsubst on the
# template + indexed keyFigures/products arrays).
COPY docker/config.template.json /etc/teru-victoria/config.template.json
COPY docker/30-runtime-config.sh /docker-entrypoint.d/30-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/30-runtime-config.sh

# The active brand at runtime. Defaults to the brand baked at build; every brand's
# config ships under brands/, so `-e BRAND=teru` switches brand without rebuilding.
ARG BRAND=victoria
ENV BRAND=${BRAND}

COPY --from=build /app/dist/${BRAND}/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
