import path from "path";
import express from "express";
import { loggerMiddleware } from "./middlewares";
import {
	addProductQty,
	createProduct,
	deleteProduct,
	getProducts,
	getTransactions,
	sellProduct,
	setAsExpired,
	updateProduct,
} from "../db/operations";
import { v4 } from "uuid";
import { ProductSchemaInterface } from "../db/schema";

const productRouter = express.Router({
	strict: true,
});

productRouter.use(loggerMiddleware);

// View all products
productRouter.get("/", async (_, res) => {
	const rows = await getProducts();
	return rows
		? res.json(rows || [])
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to retrieve products",
		  });
});

// View details of a single product
productRouter.get("/:id", async (req, res) => {
	const row = await getProducts(req.params?.id);
	return row
		? res.json(row)
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to get the product",
		  });
});

// Create a new product
productRouter.post("/", async (req, res) => {
	const productId = v4();
	const created = await createProduct(req.body, productId);
	return created
		? res.status(201).json({ id: productId })
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to create a new product",
		  });
});

// Update the name of a product
productRouter.patch("/:id", async (req, res) => {
	const updated = await updateProduct(req.body, req.params.id);
	return updated
		? res.status(200).json({ success: true })
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to update product",
		  });
});

// Delete a product
productRouter.delete("/:id", async (req, res) => {
	const deleted = await deleteProduct(req.params.id);
	return deleted
		? res.status(200).json({ success: true })
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to delete product",
		  });
});

// Sell products
productRouter.post("/:id/sell", async (req, res) => {
	const sold = await sellProduct(req.body, req.params.id);
	return sold
		? res.status(200).json({ success: true })
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to sell product",
		  });
});

// Set products as expired
productRouter.post("/:id/expired", async (req, res) => {
	const set = await setAsExpired(req.params.id);
	return set
		? res.status(200).json({ success: true })
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to set product as expired",
		  });
});

// Add quantity for an existing product
productRouter.patch("/:id/add-quantity", async (req, res) => {
	const added = await addProductQty(req.body, req.params.id);
	return added
		? res.status(200).json({ success: true })
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to update product quantity",
		  });
});

// Get product statistics
productRouter.get("/:id/stats", async (req, res) => {
	// Retrieve product details
	const product = (await getProducts(req.params.id)) as ProductSchemaInterface;

	// Retrieve transaction history
	const transactions = await getTransactions(req.params.id);

	// If either product or transactions are missing, return error response
	if (!product || !Array.isArray(transactions)) {
		return res.status(400).json({
			error: "Bad Request",
			message: "Failed to retrieve product statistics",
		});
	}

	// Calculate product total supply quantities
	const total_transactions = transactions.reduce(
		(acc, trans) => acc + Number(trans.quantity),
		0
	);
	const expenses =
		(total_transactions + product.initial_qty) * product.cost_price;
	const revenue = product.sold_qty * product.selling_price;

	// Prepare statistics object
	const statistics = {
		name: product.name,
		quantity_sold: product.sold_qty,
		current_quantity: product.current_qty,
		sale_price: product.selling_price,
		cost_price: product.cost_price,
		lost: `D${Math.max(expenses - revenue, 0).toFixed(2)}`,
		profit: `D${Math.max(revenue - expenses, 0).toFixed(2)}`,
		total_sales: `D${revenue.toFixed(2)} GMD`,
		total_expenses: `D${expenses.toFixed(2)} GMD`,
		total_quantity: total_transactions + product.initial_qty,
		total_transactions: transactions.length,
		average_transactions_qty: (
			total_transactions / transactions.length
		).toFixed(),
		total_quantity_perished: product.perishable_qty,
		date_created: product.createdAt,
		last_modified_date: product.updatedAt,
	};

	return res.status(200).json(statistics);
});

export default productRouter;
