import pino from "pino";
import fs from "fs";
import path from "path";
import pinoHttp from "pino-http";

const transports = pino.transport({
	targets: [
		{
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "SYS:standard",
				ignore: "pid,hostname",
			},
		},
		{
			target: "pino/file",
			options: { destination: path.join(__dirname, "../logs/app.log") },
		},
		{
			target: "pino/file",
			options: {
				destination: path.join(__dirname, "../logs/errors.log"),
			},
			level: "error",
		},
	],
});
const createLogger = () => {
	if (!fs.existsSync(path.join(__dirname, "../logs/app.log"))) {
		fs.mkdirSync(path.join(__dirname, "../logs/"), { recursive: true });
	}

	const logger = pino(transports);
	return logger;
};

const logger = createLogger();
const httpLogger = pinoHttp(transports);

export { logger, httpLogger };
