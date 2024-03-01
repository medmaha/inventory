import path from "path";
import express from "express";
import multer from "multer";
import { initializeDB } from "./db/connection";
import { productRouter, transactionsRouter, catchAllRouter } from "./endpoints";
import { clearDatabaseTable } from "./db/operations";

const app = express();

app.use(express.static("./"));

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

// clear a the database tables if the table query param is given
app.get("/clear", async (req, res) => {
	const deleted = await clearDatabaseTable(
		req.query.table as "products" | "transactions" | undefined
	);
	return deleted
		? res.json({
				success: true,
				message: `Database table "${req.query.table}" cleared successfully`,
		  })
		: res.status(400).json({
				error: "Bad Request",
				message: `Failed to clear database table "${req.query.table}"`,
		  });
});

// including the product and transaction endpoints
app.use("/products", productRouter);
app.use("/transactions", transactionsRouter);
app.use("/*", catchAllRouter);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, async () => {
	try {
		await initializeDB();
		console.log(`Server up and running on port ${PORT}`);
	} catch (error: any) {
		console.log("[ERROR] failed to boot up application");
		process.exit();
	}
});

export default app;
