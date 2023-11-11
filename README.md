# README

By running a single command, you will get a production-ready Node.js TypeScript app installed and fully configured on your machine. The app comes with docker support configuration. For more details, check the features list below.

## Manual Installation

Clone the repo:

```bash
git clone https://bitbucket.org/anypli/study-rent-api.git
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Features

- **ES2017**: latest ECMAScript features
- **Static Typing**: [TypeScript](https://www.typescriptlang.org/) static typing using typescript
- **MySQL database**: [Mysql](https://www.mysql.com/fr/) object data modeling using [Prisma](https://www.prisma.io/)

## Commands

Running locally in watch mode:

```bash
yarn start:dev
```

Running in production:

```bash
yarn start
```

Compiling to JS from TS

```bash
yarn build
```

Docker:

````bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod


Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
````

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MYSQL_ROOT_PASSWORD=mysql-root-password
#Root password for mysql database
MYSQL_HOST=localhost
#Mysql database hostname
MYSQL_PORT=3306
#Mysql database port
MYSQL_USER=mysql-user-name
#Mysql user name
MYSQL_PASSWORD=mysql-user-password
#Mysql user password
MYSQL_DATABASE=mysql-database-name
#Mysql database name
```

## Project Structure

```
.
├── src                             # Source files
│   ├── index.ts                    # App entry file
│   ├── config                      # Environment variables and other configurations
│   ├── controllers                 # controllers
│   ├── services                    # services
│   └── routes                      # Routes
├── package.json
└── README.md
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/api/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/auth/register` - register\
`POST /api/auth/login` - login

[MIT](LICENSE)
