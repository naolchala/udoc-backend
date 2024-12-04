import TopicController from "@/controllers/topic.controllers";
import { authenticateRoute } from "@/middleware/auth.middleware";
import { catchAsync } from "@/utils/catchAsync";
import { parseValidationResult } from "@/utils/parseValidationResult";
import TopicValidators from "@/validators/topic.validators";
import { Router } from "express";

const TopicsRoute = Router();

TopicsRoute.post(
	"/",
	authenticateRoute,
	TopicValidators.createTopicValidator,
	parseValidationResult,
	catchAsync(TopicController.createTopic)
);

TopicsRoute.get(
	"/:docId",
	authenticateRoute,
	TopicValidators.getTopicsValidator,
	parseValidationResult,
	catchAsync(TopicController.getDocumentationTopics)
);

TopicsRoute.delete(
	"/:topicId",
	authenticateRoute,
	TopicValidators.deleteTopicValidator,
	parseValidationResult,
	catchAsync(TopicController.deleteTopic)
);

TopicsRoute.put(
	"/:topicId",
	authenticateRoute,
	TopicValidators.updateTopicValidator,
	parseValidationResult,
	catchAsync(TopicController.updateTopic)
);

export default TopicsRoute;
