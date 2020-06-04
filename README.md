# Node.js 3
Database and files upload with Node.js and Typescript.

### [Challenge guideline](https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-database-upload)
### [Template](https://github.com/Rocketseat/gostack-template-typeorm-upload)

## Features

To complete this challenge, I needed to add the following funcionalities to the app, and pass all tests.

* ``POST /transactions``: This route shoud receive ``title``, ``value``, ``category``, and ``type`` (income or outcome) in the request body and store the transaction on a SQL table ``transactions`` (``id``, ``title``, ``value``, ``type``, ``category_id``, ``created_at``, ``updated_at``). When creating a new transaction, store unique categories in a ``categories`` (``id``, ``title``, ``created_at``, ``updated_at``).
* ``GET /transactions``: This route should list all saved transactions and return the account ``balance`` (total, incomes, outcomes);
* ``DELETE /transactions/:id``: This route should delete a transaction;
* ``POST /transactions/import:`` This route should receive a .csv file to create multiple transactions.

## This project uses

* [Typescript](https://github.com/microsoft/TypeScript) - TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
* [Node.js](https://github.com/nodejs/node) - Node.js JavaScript runtime.
* [Express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node.
* [Multer](https://github.com/expressjs/multer) - Node.js middleware for handling `multipart/form-data`.
* [Typeorm](https://github.com/typeorm/typeorm) - ORM for TypeScript.
* [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database.
