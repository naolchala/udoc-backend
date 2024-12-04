import { RequestWithUser } from "@/interfaces/Request";
import TopicModel from "@/models/topic";
import {
	CreateTopicBody,
	GetTopicsParam,
	UpdateTopicBody,
} from "@/validators/topic.validators";
import { Request, Response } from "express";

const createTopic = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const body = req.body as CreateTopicBody;
	const createdTopic = await TopicModel.createTopic({
		...body,
		userId: user.id,
	});
	return res.json(createdTopic);
};

const getDocumentationTopics = async (req: Request, res: Response) => {
	const { docId } = req.params as unknown as GetTopicsParam;
	const topics = await TopicModel.getTopicsByDocId(docId);
	return res.json(topics);
};

const deleteTopic = async (req: Request, res: Response) => {
	const { topicId } = req.params;
	const { user } = req as RequestWithUser;
	const topic = await TopicModel.deleteTopic({ topicId, userId: user.id });
	return res.json(topic);
};

const updateTopic = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const { topicId } = req.params;
	const data = req.body as UpdateTopicBody;
	const updatedTopic = await TopicModel.updateTopic({
		userId: user.id,
		data,
		topicId,
	});

	return res.json(updatedTopic);
};

const TopicController = {
	createTopic,
	getDocumentationTopics,
	deleteTopic,
	updateTopic,
};

export default TopicController;
