import { RequestWithUser } from "@/interfaces/Request";
import UserModel from "@/models/user";
import { encryptJWT } from "@/utils/hash";
import {
	LoginBody,
	RegistrationBody,
	ResetPasswordBody,
} from "@/validators/auth.validators";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import _ from "lodash";

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body as LoginBody;
	const user = await UserModel.login({ email, password });
	const token = await encryptJWT(user.id);
	return res.json({ ...user, token });
};
const register = async (req: Request, res: Response) => {
	const { fullName, email, password } = req.body as RegistrationBody;
	const user = await UserModel.register({ fullName, email, password });
	const token = await encryptJWT(user.id);
	return res.json({ ...user, token });
};

const sendVerificationEmail = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	await UserModel.sendVerificationEmail(user.id);
	return res.json({ message: "Verification email sent" });
};

const verifyEmail = async (req: Request, res: Response) => {
	const { code } = matchedData(req);
	const { user } = req as RequestWithUser;
	await UserModel.verifyEmail(user.id, code);
	return res.json({ message: "Email verified" });
};

const forgotPassword = async (req: Request, res: Response) => {
	const { email } = matchedData(req);
	await UserModel.forgotPassword(email);
	return res.json({ message: "Password reset code sent via email" });
};

const resetPassword = async (req: Request, res: Response) => {
	const { code, password } = req.body as ResetPasswordBody;
	const user = await UserModel.resetPasswordByCode(code, password);
	const token = await encryptJWT(user.id);
	return res.json({ ...user, token });
};

const getUser = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const token = await encryptJWT(user.id);
	return res.json({ ..._.omit(user, "password"), token });
};

const AuthController = {
	register,
	sendVerificationEmail,
	verifyEmail,
	login,
	forgotPassword,
	resetPassword,
	getUser,
};

export default AuthController;
