import { RequestWithUser } from "@/interfaces/Request";
import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line import/prefer-default-export
export const catchAsync = (
	fn: (
		req: Request | RequestWithUser,
		res: Response,
		next?: NextFunction
	) => Promise<any>
) => {
	return (
		req: Request | RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		fn(req, res, next).catch(next);
	};
};
