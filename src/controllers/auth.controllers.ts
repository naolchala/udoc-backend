import { RequestWithUser } from "@/interfaces/Request";
import UserModel from "@/models/user";
import { encryptJWT } from "@/utils/hash";
import { LoginBody, RegistrationBody } from "@/validators/auth.validators";
import { Request, Response } from "express";
import { matchedData } from "express-validator";

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

const AuthController = { register, sendVerificationEmail, verifyEmail, login };

export default AuthController;
