FROM node:22-alpine AS build

WORKDIR /app

# BRAND selects which white-label config is baked as the default config.json.
# It can still be overridden at container startup via the BRAND env var (see
# docker/30-runtime-config.sh), because every brand's config ships as a static
# asset under public/brands/.
ARG BRAND=victoria

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# build:<brand> runs set-brand.mjs then `ng build` (production by default) into
# dist/<brand>/browser.
RUN npm run build:${BRAND}

FROM nginx:1.27-alpine

# envsubst (from gettext) is used by the entrypoint script to inject per-instance
# ENV vars into config.json at container startup.
RUN apk add --no-cache gettext

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf


# The active brand at runtime. Defaults to the brand baked at build time; set
# `-e BRAND=teru` (or victoria) to switch the served brand without rebuilding.
ARG BRAND=victoria
ENV BRAND=${BRANsD}

COPY --from=build /app/dist/${BRAND}/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
