import { NextFunction, Request, Response } from "express";

type handler = (req: Request, res: Response, next: NextFunction) => void;

export const loggerMiddleware: handler = (req, res, next) => {
	// if (res.statusCode)
	// 	console.log(`${req.originalUrl} ${res.statusMessage} ${res.statusCode}`);
	// else console.log(`[${req.method.toUpperCase()}] --> ${req.originalUrl}`);
	console.log(`[${req.method.toUpperCase()}] --> ${req.originalUrl}`);
	return next();
};
