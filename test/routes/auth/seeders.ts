import prisma from "@/config/prisma.config";
import { encryptJWT, encryptPassword } from "@/utils/hash";
import authData from "./data";

const userSeeder = async () => {
	const hashedPassword = await encryptPassword(authData.validUser.password);
	const user = await prisma.user.create({
		data: {
			...authData.validUser,
			password: hashedPassword,
		},
	});

	const token = await encryptJWT(user.id);

	return { ...user, token };
};

const verificationCodeSeeder = async (userId: string) => {
	const verification = await prisma.emailVerification.create({
		data: {
			code: authData.emailVerificationCode,
			userId,
		},
	});

	return verification;
};

const authSeeders = { userSeeder, verificationCodeSeeder };
export default authSeeders;
