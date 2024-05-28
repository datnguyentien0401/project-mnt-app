FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /web

COPY package.json package-lock.json ./
RUN yarn install

FROM node:18-alpine AS builder
WORKDIR /web
COPY --from=deps /web/node_modules ./node_modules
COPY . .

ENV APP_ENV real
COPY --chown=nextjs:nodejs env/$APP_ENV.env ./.env
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /web

ENV APP_ENV real
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /web/.next ./.next
COPY --from=builder /web/node_modules ./node_modules
COPY --from=builder /web/package.json ./package.json

COPY --chown=nextjs:nodejs next.config.js .env* ./
COPY --chown=nextjs:nodejs env/$APP_ENV.env ./.env

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD ["yarn", "start"]
