#--< build image for development >--

FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ecosystem.config.json ./

COPY ./src ./src


RUN ls -a

RUN yarn install --pure-lockfile && yarn build

#--< build image for production >--

FROM node:alpine as production

ARG NODE_ENV=production

WORKDIR /usr/prod/app

ENV NODE_ENV=production

COPY package.json yarn.lock ecosystem.config.json ./

RUN yarn install --production --pure-lockfile

COPY --from=development /usr/src/app/dist ./dist
