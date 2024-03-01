# Inventory Management System

This is a simple Inventory Management System back-end application developed using Node.js, Express.js, and PostgreSQL.
It provides endpoints for managing products and transactions in an inventory system.

## Features

- Create, read, update, delete products
- Set products as expired
- View product statistics
- View transaction history

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Multer (for parsing form-data | multipart/form-data)
- Dotenv (used to access environment variables in a .env\* file)
- UUID (for generating unique identifiers)
- Other npm packages (check package.json for details)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/medmaha/inventory.git
```

2. Install dependencies:

```bash
cd inventory
```

- You can use pnpm if you prefer it

```bash
npm install
npm build # (Optional) - this compiles the typescript code to native javascript
```

3. Set up the PostgreSQL database:

   - Create a new PostgreSQL database.
   - Update the database configuration in a `.env` file with your PostgreSQL Database credentials.

4. Start the server:

```bash
npm start
```

## Usage

- Use Postman or any other API testing tool to interact with the endpoints.
- You may want to explore the code to understand available endpoints and their functionality.

## Live Demo

- [Explore Live Demo](https://mahamed-inventory.vercel.app)
