import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.string().default("5000"),
	JWT_SECRET: z.string().min(32).max(32),
});

const env = envSchema.parse(process.env);

export default env;
