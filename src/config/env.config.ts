import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.string().default("development"),
	PORT: z.string().default("5000"),
	JWT_SECRET: z.string().min(32).max(32),
	APP_EMAIL: z.string().email({ message: "Email Address Required" }),
	APP_PASSWORD: z.string({ message: "Password Required" }),
});

const env = envSchema.parse(process.env);

export default env;
