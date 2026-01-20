FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
# If lockfile exists, copy it; if not, that's fine.
# (We do it via a second COPY that won't mention a missing filename.)
# So: comment this in ONLY if you have the file.
# COPY package-lock.json ./

RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

CMD ["node_modules/.bin/next", "start", "-p", "3000"]

