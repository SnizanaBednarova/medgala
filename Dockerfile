#### NODE BUILD ####
FROM oven/bun:1 AS base
WORKDIR /srv/app

COPY ./ ./

ARG ROOT_PATH=/srv/app/www

RUN bun install
RUN bun run build

RUN chmod -R 777 /srv/app/out

#### CADDY ####
FROM caddy:2-alpine AS caddy
COPY --from=base /srv/app/out/ /usr/share/caddy/
COPY Caddyfile /etc/caddy/Caddyfile
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
