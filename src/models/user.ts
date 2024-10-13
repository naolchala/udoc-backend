import prisma from "@/config/prisma.config";
import { defaultProfilePictureUrl } from "@/constants/urls";
import APIError from "@/interfaces/APIError";
import {
	generateVerificationCode,
	sendVerificationCodeEmail,
} from "@/utils/email";
import { encryptPassword } from "@/utils/hash";
import httpStatus from "http-status";

interface RegisterParams {
	fullName: string;
	email: string;
	password: string;
}

const register = async ({ email, password, fullName }: RegisterParams) => {
	const userCount = await prisma.user.count({
		where: {
			email,
		},
	});

	if (userCount > 0) {
		throw new APIError({
			message: "User with this email already exists",
			field: "email",
			status: httpStatus.BAD_REQUEST,
			isPublic: true,
		});
	}

	const hashedPassword = await encryptPassword(password);
	const user = await prisma.user.create({
		data: {
			fullName,
			email,
			password: hashedPassword,
			photoUrl: defaultProfilePictureUrl(fullName),
		},
		omit: {
			password: true,
		},
	});

	return user;
};

const verifyEmail = async (userId: string, code: string) => {
	const verification = await prisma.emailVerification.findFirst({
		where: {
			userId,
			code,
			createdAt: {
				gt: new Date(Date.now() - 15 * 60 * 1000),
			},
		},
	});

	if (!verification) {
		throw new APIError({
			message: "Invalid verification code",
			field: "code",
			status: httpStatus.BAD_REQUEST,
			isPublic: true,
		});
	}

	const [updatedUser, _] = await prisma.$transaction([
		prisma.emailVerification.deleteMany({
			where: {
				userId,
			},
		}),
		prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				isEmailVerified: true,
			},
			omit: {
				password: true,
			},
		}),
	]);

	return updatedUser;
};

const sendVerificationEmail = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new APIError({
			message: "User not found",
			status: httpStatus.NOT_FOUND,
			isPublic: true,
		});
	}

	if (user.isEmailVerified) {
		throw new APIError({
			message: "Email already verified",
			status: httpStatus.BAD_REQUEST,
			isPublic: true,
		});
	}

	const verificationCode = generateVerificationCode().toString();
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			EmailVerification: {
				deleteMany: {},
				create: {
					code: verificationCode,
				},
			},
		},
	});

	await sendVerificationCodeEmail({
		email: user.email,
		code: verificationCode,
	});
};

const findById = async (id: string) => {
	return await prisma.user.findUnique({
		where: {
			id,
		},
	});
};

export default {
	findById,
	register,
	verifyEmail,
	sendVerificationEmail,
};
