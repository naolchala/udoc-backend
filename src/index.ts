import env from "@/config/env.config";
import app from "./app";

app.listen(env.PORT, () => {
	/* eslint-disable no-console */
	console.log(`Listening: http://localhost:${env.PORT}`);
	/* eslint-enable no-console */
});
