FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /app

## Copy package.json and package-lock.json before copy other files for better build caching
COPY ["./package.json", "./package-lock.json", "/app/"]
RUN npm ci --production
COPY "./" "/app/"

CMD ["npm", "start"]
EXPOSE 8080
