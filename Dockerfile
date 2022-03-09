FROM node:12


WORKDIR '/app'

COPY package*.json ./
RUN npm i -g knex

RUN npm i


USER root

COPY --chown=node:node . .

EXPOSE 8000

RUN npm run quick-build

CMD npm run serve