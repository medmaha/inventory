import { NextFunction, Request, Response } from "express";

type handler = (req: Request, res: Response, next: NextFunction) => void;

export const loggerMiddleware: handler = (req, res, next) => {
	console.log(`[${req.method.toUpperCase()}] --> ${req.originalUrl}`);
	return next();
};
