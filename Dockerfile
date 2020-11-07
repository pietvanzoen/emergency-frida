FROM node:lts AS build

WORKDIR /app

COPY ["./package.json", "./package-lock.json", "/app/"]
RUN npm install

COPY "./" "/app/"

ARG DROPBOX_TOKEN
RUN npm run update-photos

RUN npm prune --production

FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app /app

CMD ["npm", "start"]
EXPOSE 8080
