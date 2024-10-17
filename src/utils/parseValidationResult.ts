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
		const err = result.array()[0] as any;
		next(
			new APIError({
				message: err.msg,
				field: err.path,
				status: httpStatus.BAD_REQUEST,
				isPublic: true,
			})
		);
	}

	next();
};
