# check this issue, https://github.com/prisma/prisma/issues/861#issuecomment-881992292
FROM node:18.12-slim AS base

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app
COPY package-lock.json package.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src src
COPY .env ./

COPY prisma prisma
RUN npm run db:generate
RUN npm run build
# RUN npx prisma generate

RUN chmod 777 /app/node_modules/.prisma/client/index.js
RUN chown -R node:node /app/node_modules/.prisma

RUN mkdir logs
RUN chmod -R 777 /app/logs
# RUN npx prisma push

USER node
CMD ["npm", "start"]
