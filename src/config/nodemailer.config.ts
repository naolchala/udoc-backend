import env from "@/config/env.config";
import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	auth: {
		user: env.APP_EMAIL,
		pass: env.APP_PASSWORD,
	},
});

export default mailer;
