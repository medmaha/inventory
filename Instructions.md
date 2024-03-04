# Inventory Management System Back-End Application

Develop a simple Inventory Management System back-end application using Node Js (or Typescript). Below are the instructions for the Assessment:

- Use a MySQL or any Relational Database of your choice.

- Use one database table and name it ‘Products’.

- The 'Products' table should have the following attributes:

  - `id<UUID>`: unique id of the product.
  - `name<string>`: name of the product.
  - `cost_price<float>`: how much the product was bought for.
  - `selling_price<float>`: how much you are selling the product.
  - `initial_qty<int>`: This is the quantity set when creating a new product.
  - `current_qty<int>`: this field can only be incremented/decremented in update but not overridden.
  - `incoming_qty<int>`: the quantity of items brought into your inventory in each supply.
  - `sold_qty<int>`: the quantity of items you sold.
  - `perishable_qty<int>`: the quantity of items that got expired/broken/lost.
  - `createdAt<timestamptz>`: Timestamp for creation.
  - `updatedAt<timestamptz>`: Timestamp for the last update.

- Create the following end-points to:

  (a) Create a new product setting the `initial_qty` to 10 and the other quantity attributes to 0.

  (b) View all the products in your database.

  (c) View the details of a single product.

  (d) Edit the name of a product.

  (e) Delete a product.

  (f) Sell six products from your 'Products' table & adjust `current_qty` accordingly.

  (g) Set two products as expired from your 'Products' table & adjust `current_qty` accordingly.

  (h) Add in more quantity for an existing product. Record the operation in Transaction table.

  (i) Record the profit or loss for an individual product.
