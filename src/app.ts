import path from "path";
import express from "express";
import multer from "multer";
import { initializeDB } from "./db/connection";
import { clearDatabaseTable } from "./db/operations";
import productRouter from "./endpoints/products";
import transactionsRouter from "./endpoints/transactions";
import catchAllRouter from "./endpoints/catch-all";
import { loggerMiddleware } from "./endpoints/middlewares";

const app = express();

app.use(express.static("./public"));

// Middleware to parse application/json
app.use(express.json());

// Middleware to parse form-data
app.use(multer().none());

// Homepage
app.get("/", (_, res) => {
	const appDir = path.dirname(__dirname);
	return res
		.status(200)
		.type(".html")
		.sendFile(path.join(appDir, "public", "index.html"));
});

// Resets the database table's
app.get("/reset", async (req, res) => {
	const tableName = req.query.table as "products" | "transactions" | undefined;

	const deleted = await clearDatabaseTable(tableName);

	if (deleted)
		return res.json({
			success: true,
			message: `Database table "${req.query.table}" cleared successfully`,
		});
	return res.status(400).json({
		error: "Bad Request",
		message: `Failed to clear database table "${req.query.table}"`,
	});
});

// Include the products and transactions endpoints
app.use("/products", productRouter);
app.use("/transactions", transactionsRouter);
app.use("/*", catchAllRouter);
app.use(loggerMiddleware);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, async () => {
	console.log("Booting Application...");
	try {
		await initializeDB();
		console.log(`Server up and running on port ${PORT}`);
	} catch (error: any) {
		console.log("[ERROR] failed to boot up application");
		process.exit();
	}
});

export default app;
