import UserModel from "@/models/user";
import APIError from "@/interfaces/APIError";
import { RequestWithUser } from "@/interfaces/Request";
import { decodeJWT } from "@/utils/hash";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { logger } from "@/config/logger.config";

export const authenticateRoute = async (
	req: Request | RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const authorization = req.headers.authorization?.split(" ");
	const token =
		authorization && authorization.length > 1 ? authorization[1] : null;
	if (!token) {
		next(
			new APIError({
				message: "Token not found",
				isPublic: true,
				status: httpStatus.UNAUTHORIZED,
			})
		);
		return;
	}

	try {
		const id = await decodeJWT(token);
		const user = await UserModel.findById(id);

		if (!user) {
			next(
				new APIError({
					message: "User not found",
					isPublic: true,
					status: httpStatus.NOT_FOUND,
				})
			);
		}

		(req as RequestWithUser).user = user!;
		next();
	} catch (e) {
		logger.error(e);
		next(
			new APIError({
				message: "Invalid token",
				isPublic: true,
				status: httpStatus.UNAUTHORIZED,
			})
		);
	}
};
