FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir /app/data
RUN npm run build
RUN npm prune --production

# A fresh start - only take with us what is needed
FROM node:23-alpine
WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

COPY src/lib/seed.js ./seed.js
COPY src/lib/db.js ./db.js
COPY src/lib/adminTasks.js ./adminTasks.js
COPY entrypoint.sh ./

RUN mkdir -p /app/data \
    && chown -R node:node /app/data \
    && chmod +x entrypoint.sh

USER node:node

EXPOSE 3000
ENV NODE_ENV=production

ENTRYPOINT [ "./entrypoint.sh" ]
