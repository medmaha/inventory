import express from "express";
import { loggerMiddleware } from "./middlewares";

const catchAllRouter = express.Router({
	strict: true,
});

catchAllRouter.use(loggerMiddleware);

catchAllRouter.all("*", (_, res) => {
	res.status(404).json({ status: 404, message: "Endpoint does not exist" });
});

export default catchAllRouter;
