import APIError from "@/interfaces/APIError";
import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import httpStatus from "http-status";

export const parseValidationResult = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result = validationResult(req);

	if (!result.isEmpty()) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.json(result.array({ onlyFirstError: true }));
	}

	next();
};
