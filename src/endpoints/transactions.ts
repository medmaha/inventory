import express from "express";
import { loggerMiddleware } from "./middlewares";
import { getTransactions } from "../db/operations";

const transactionsRouter = express.Router({
	strict: true,
});
transactionsRouter.use(loggerMiddleware);

// Get all transactions
transactionsRouter.get("/", async (_, res) => {
	const rows = await getTransactions();
	return rows
		? res.json(rows)
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to get transactions list",
		  });
});

// Get details of a single transaction
transactionsRouter.get("/:id", async (req, res) => {
	const row = await getTransactions(req.params?.id);
	return row
		? res.json(row)
		: res.status(400).json({
				error: "Bad Request",
				message: "Failed to get the transactions",
		  });
});

export default transactionsRouter;
