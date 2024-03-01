import { v4 as uuidv4 } from "uuid";
import connection from "./connection";
import { format } from "date-fns";
import { ProductSchemaInterface, TransactionSchemaInterface } from "./schema";

// Creates a new product
export async function createProduct(data: Json, id: string) {
	const { name, cost_price, selling_price } = data;
	const sql = `INSERT INTO Products (id, name, cost_price, selling_price) VALUES ($1, $2, $3, $4);`;
	const params = [id, name, cost_price, selling_price];

	// Check if required fields are present
	if (!name || !cost_price || !selling_price) return false;

	try {
		// Execute the SQL query
		await connection.query(sql, params);
		return true;
	} catch (error) {
		return false;
	}
}

// Updates the name of a single Product
export async function updateProduct(data: Json, id: string) {
	const { name } = data;

	// Check if the name is provided and not empty
	if (!name || name.length < 1) return false;

	try {
		// Execute the SQL query to update the product name
		const sql = `UPDATE Products SET name = $1 WHERE id = $2`;
		const results = await connection.query(sql, [name, id]);
		return Boolean(results.rowCount);
	} catch (error) {
		return false;
	}
}

// Deletes a Product from the database
export async function deleteProduct(id: string) {
	try {
		// Execute the SQL query to delete a product
		const sql = `DELETE FROM Products WHERE id = $1`;
		const results = await connection.query(sql, [id]);
		return Boolean(results.rowCount);
	} catch (error) {
		return false;
	}
}

// Gets one or all products
export async function getProducts(productId?: string) {
	// Check if a specific product ID is provided
	if (productId) {
		const response = await connection.query<ProductSchemaInterface>(
			`SELECT * FROM Products WHERE id = $1 LIMIT 1`,
			[productId]
		);
		if (!response.rowCount) return false;
		return prettifyProducts(response.rows[0]);
	} else {
		// Fetch all products ordered by creation date
		const response = await connection.query<ProductSchemaInterface>(
			`SELECT * FROM Products ORDER BY created_at DESC`
		);
		return prettifyProducts(response.rows);
	}
}

// Sets product as expired
export async function setAsExpired(id: string) {
	const product = (await getProducts(id)) as ProductSchemaInterface;

	// Check if the product exists and is not already expired
	if (!product || product.perishable_qty !== 0) return false;

	try {
		// Execute the SQL query to set the product as expired
		const response = await connection.query(
			`UPDATE Products SET perishable_qty=current_qty, current_qty=0 WHERE id = $1`,
			[id]
		);
		return Boolean(response.rowCount);
	} catch (error) {
		return false;
	}
}

// Add quantity to an existing product
export async function addProductQty(data: Json, id: string) {
	const { quantity } = data;

	// Check if a valid quantity is provided
	if (!quantity || isNaN(Number(quantity))) return false;

	const product = (await getProducts(id)) as ProductSchemaInterface;

	// Check if the product exists and is not already expired
	if (!product || product.perishable_qty !== 0) return false;

	let committed = false;

	try {
		// Check if the product has not been sold or has no current quantity
		if (product.sold_qty === 0 && product.current_qty === 0) {
			const response = await connection.query(
				`UPDATE Products SET incoming_qty = $1, current_qty = initial_qty + $2 WHERE id = $3`,
				[quantity, quantity, id]
			);
			committed = Boolean(response.rowCount);
		} else {
			// Update the product quantity
			const response = await connection.query(
				`UPDATE Products SET incoming_qty = $1, current_qty = current_qty + $2 WHERE id = $3`,
				[quantity, quantity, id]
			);
			committed = Boolean(response.rowCount);
		}

		if (committed) {
			// If committed, record the transaction
			const t_id = uuidv4().substring(0, 18).replace(/-/gi, "");
			await connection.query(
				`INSERT INTO Transactions (transaction_id, product_id, quantity) VALUES ($1, $2, $3)`,
				[t_id, id, quantity]
			);
		}

		return committed;
	} catch (error) {
		return false;
	}
}

// Product Selling
export async function sellProduct(data: Json, id: string) {
	const { quantity } = data;

	// Check if a valid quantity is provided
	if (!quantity || isNaN(Number(quantity))) return false;

	const product = (await getProducts(id)) as ProductSchemaInterface;

	// Check if the product exists and is not already expired
	if (!product || product.perishable_qty !== 0) return false;

	try {
		// Check if the product has not been sold or has sufficient current quantity
		if (product.sold_qty === 0) {
			const response = await connection.query(
				`UPDATE Products SET sold_qty = sold_qty + $1, current_qty = initial_qty - $1 WHERE id = $2`,
				[quantity, id]
			);
			return Boolean(response.rowCount);
		}
		if (product.current_qty - quantity >= 0) {
			const response = await connection.query(
				`UPDATE Products SET sold_qty = sold_qty + $1, current_qty = current_qty - $1 WHERE id = $2`,
				[quantity, id]
			);
			return Boolean(response.rowCount);
		}

		return false;
	} catch (error) {
		return false;
	}
}

// Gets one or all transactions
export async function getTransactions(productId?: string) {
	try {
		// Check if a specific product ID is provided
		if (productId) {
			const response = await connection.query<TransactionSchemaInterface>(
				`SELECT * FROM Transactions WHERE product_id = $1`,
				[productId]
			);
			return prettifyTransactions(response.rows);
		} else {
			// Fetch all transactions ordered by timestamp
			const response = await connection.query<TransactionSchemaInterface>(
				`SELECT * FROM Transactions ORDER BY timestamp DESC`
			);
			return prettifyTransactions(response.rows);
		}
	} catch (error) {
		return null;
	}
}

// Clears the database tables or a single table
export async function clearDatabaseTable(table?: "products" | "transactions") {
	switch (table) {
		case "products":
			return await connection.query("DELETE FROM Products");
		case "transactions":
			return await connection.query("DELETE FROM Transactions");

		default:
			break;
	}
	if (!table)
		return await connection.query(
			"DELETE FROM Products; DELETE FROM Transactions"
		);
}

type Json = { [x: string]: any };

// Formats products the date to a more readable format
function prettifyProducts(
	data: ProductSchemaInterface | ProductSchemaInterface[]
) {
	function make(product: ProductSchemaInterface) {
		return {
			...product,
			created_at: format(new Date(product.created_at), "PPPPpp"),
			updated_at: format(new Date(product.updated_at), "PPPPpp"),
		};
	}
	if (Array.isArray(data)) {
		return data.map((product) => make(product));
	}
	return make(data);
}
// Formats transactions the date to a more readable format
function prettifyTransactions(
	data: TransactionSchemaInterface | TransactionSchemaInterface[]
) {
	function make(transaction: TransactionSchemaInterface) {
		return {
			...transaction,
			timestamp: format(new Date(transaction.timestamp), "PPPPpp"),
		};
	}
	if (Array.isArray(data)) {
		return data.map((product) => make(product));
	}
	return make(data);
}
