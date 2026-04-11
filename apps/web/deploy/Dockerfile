# syntax=docker/dockerfile:1

ARG DEBIAN_VERSION=trixie
ARG NODE_VERSION=24.14.1
ARG YARN_VERSION=4.13.0

ARG IMAGE=node:${NODE_VERSION}-${DEBIAN_VERSION}-slim



FROM ${IMAGE} AS build

ARG YARN_VERSION

WORKDIR /app

COPY .yarn .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json yarn.lock ./

RUN corepack enable  \
	&& corepack prepare yarn@${YARN_VERSION} --activate  \
	&& yarn install --immutable

COPY public ./public
COPY src ./src
COPY tools ./tools
COPY vite.config.ts rolldown.config.ts ./
COPY tsconfig.json tsconfig.node.json tsconfig.server.json tsconfig.client.json tsconfig.base.json ./

RUN yarn build



FROM ${IMAGE} AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --link --from=build --chown=1000:1000 /app/dist ./dist

USER node

EXPOSE 3000

HEALTHCHECK --start-period=10s --interval=30s --timeout=3s --retries=3 \
	CMD ["node", "-e", "fetch(`http://127.0.0.1:${process.env.PORT ?? 3000}/health`).then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "dist/server/index.js"]
