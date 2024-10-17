import { getMagicCodeEmail } from "@/config/email/EmailVerification";
import { getForgotPasswordCodeEmail } from "@/config/email/ForgotPassword";
import mailer from "@/config/nodemailer.config";

interface EmailOptions {
	email: string;
	code: string;
}
export const sendVerificationCodeEmail = async ({
	email,
	code,
}: EmailOptions) => {
	const result = await mailer.sendMail({
		from: process.env.APP_EMAIL,
		to: email,
		subject: "Verify your email for UDoc",
		html: await getMagicCodeEmail({ code }),
	});

	return result;
};

export const sendForgotPasswordEmail = async ({
	email,
	code,
}: EmailOptions) => {
	const result = await mailer.sendMail({
		from: process.env.APP_EMAIL,
		to: email,
		subject: "Reset Password code requested for UDoc",
		html: await getForgotPasswordCodeEmail({ code }),
	});

	return result;
};

export const generateVerificationCode = () => {
	return Math.floor(100000 + Math.random() * 899999);
};
