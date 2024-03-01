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

2. Set up the PostgreSQL database:

   - Create a new PostgreSQL database.
   - Update the database configuration in a `.env` file with your PostgreSQL Database credentials.

3. Set Environment Variables:

```bash
   DATABASE=<your_database_name>
   DATABASE_HOST=<your_database_host>
   DATABASE_PORT=<your_database_port>
   DATABASE_USER=<your_database_user>
   DATABASE_PASSWORD=<your_database_password>
```

4. Install dependencies:

```bash
cd inventory
npm install
```

5. (Optional) Compile the typescript code:

```bash
npm compile
```

6. Start the server:

```bash
npm dev
```

## Usage

- Use Postman or any other API testing tool to interact with the endpoints.
- You may want to explore the code to understand available endpoints and their functionality.

## Live Demo

- [Explore Live Demo](https://mahamed-inventory.vercel.app)
- [Explore with Postman](https://www.postman.com/deluxeguy/workspace/inventory-app/documentation/20045475-8f1f5b0d-500d-492d-9706-63beb50a2fe2)
