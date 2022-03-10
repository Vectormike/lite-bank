# Lendsqr API

This application allows you to create an account while being able to deposit, transfer and withdraw from it.

# STEPS TO RUN APP

RUN `knex migrate:latest`

RUN `npm run dev`

### Start up the containers

RUN `docker-compose up -d on the root directory of the project`

### Run Migration

`docker exec -t -i app knex migrate:latest`

# Token Management

JWT was used for token along with redis for implementing refresh tokens

#### POSTMAN API Documentation.

[Postman Api documentation](https://documenter.getpostman.com/view/5622145/UVXhpbZN)
