import { NextFunction, Request, Response } from "express";
import ErrorResponse from "@/interfaces/ErrorResponse";
import { logger } from "@/config/logger.config";
import APIError from "@/interfaces/APIError";
import httpStatus from "http-status";
import env from "@/config/env.config";

export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	logger.error(error);
	next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err instanceof APIError) {
		if (!err.isPublic) {
			logger.error(err.stack);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				message: "Oops, Something Went Wrong!",
				stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
			});
		}

		return res.status(err.status).json({
			message: err.message,
			field: err.field,
			desc: err.desc,
			stack: env.NODE_ENV === "development" && err.stack,
		});
	}

	logger.error(err.stack);
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode).json({
		message: err.message,
		stack: env.NODE_ENV === "development" && err.stack,
	});
}
