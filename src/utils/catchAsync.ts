import { RequestWithUser } from "@/interfaces/Request";
import { NextFunction, Request, Response } from "express";

export const catchAsync = (
	fn: (
		req: Request | RequestWithUser,
		res: Response,
		next?: NextFunction
	) => any | Promise<any>
) => {
	return (
		req: Request | RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		fn(req, res, next).catch(next);
	};
};
