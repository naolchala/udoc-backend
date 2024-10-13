import AuthController from "@/controllers/auth.controllers";
import { authenticateRoute } from "@/middleware/auth.middleware";
import { catchAsync } from "@/utils/catchAsync";
import { parseValidationResult } from "@/utils/parseValidationResult";
import authValidators from "@/validators/auth.validators";
import { Router } from "express";

const AuthRouter = Router();

AuthRouter.post(
	"/login",
	authValidators.LoginValidators(),
	parseValidationResult,
	catchAsync(AuthController.login)
);

AuthRouter.post(
	"/register",
	authValidators.RegisterValidators(),
	parseValidationResult,
	catchAsync(AuthController.register)
);

AuthRouter.post(
	"/send-verification",
	authenticateRoute,
	catchAsync(AuthController.sendVerificationEmail)
);

AuthRouter.post(
	"/verify-email",
	authenticateRoute,
	catchAsync(AuthController.verifyEmail)
);

export default AuthRouter;
