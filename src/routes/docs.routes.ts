import DocsController from "@/controllers/docs.controllers";
import { authenticateRoute } from "@/middleware/auth.middleware";
import { catchAsync } from "@/utils/catchAsync";
import { parseValidationResult } from "@/utils/parseValidationResult";
import { Router } from "express";

import DocsValidators from "@/validators/docs.validators";

const DocsRouter = Router();

DocsRouter.post(
	"/",
	authenticateRoute,
	DocsValidators.createDocValidator,
	parseValidationResult,
	catchAsync(DocsController.createDoc)
);

DocsRouter.get("/", authenticateRoute, catchAsync(DocsController.getUserDocs));

DocsRouter.delete(
	"/:id",
	authenticateRoute,
	DocsValidators.deleteDocValidator,
	parseValidationResult,
	catchAsync(DocsController.deleteDoc)
);

DocsRouter.put(
	"/:id",
	authenticateRoute,
	DocsValidators.updateDocValidator,
	parseValidationResult,
	catchAsync(DocsController.updateDoc)
);

DocsRouter.get(
	"/:slug",
	authenticateRoute,
	catchAsync(DocsController.getUserDocsBySlug)
);

export default DocsRouter;
