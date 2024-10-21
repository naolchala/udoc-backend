import env from "@/config/env.config";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const encryptPassword = async (password: string) => {
	const salt = bcrypt.genSaltSync(12);
	return bcrypt.hash(password, salt);
};

export const encryptJWT = async (id: string) => {
	const token = jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "7d" });
	return token;
};

export const decodeJWT = async (token: string) => {
	const { id } = jwt.verify(token, env.JWT_SECRET) as { id: string };
	return id;
};
