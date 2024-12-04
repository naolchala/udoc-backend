import { body, param } from "express-validator";

const createTopicValidator = [
	body("docId")
		.notEmpty()
		.withMessage("Please enter a Document Id")
		.isMongoId()
		.withMessage("Invalid Document Id"),
	body("title")
		.notEmpty()
		.withMessage("Please enter a title")
		.isLength({ max: 100, min: 3 })
		.withMessage(
			"Title must be at least 3 characters long and less than 100 characters long"
		),
	body("parentId").optional().isMongoId().withMessage("Invalid Parent Id"),
];

export interface CreateTopicBody {
	docId: string;
	title: string;
	parentId?: string;
}

const getTopicsValidator = [
	param("docId")
		.notEmpty()
		.withMessage("Please enter a Document Id")
		.isMongoId()
		.withMessage("Invalid Document Id"),
];

export interface GetTopicsParam {
	docId: string;
}

const deleteTopicValidator = [
	param("topicId")
		.notEmpty()
		.withMessage("Please enter a Topic Id")
		.isMongoId()
		.withMessage("Invalid Topic Id"),
];

const updateTopicValidator = [
	param("topicId")
		.notEmpty()
		.withMessage("Please enter a Topic Id")
		.isMongoId()
		.withMessage("Invalid Topic Id"),
	body("title")
		.notEmpty()
		.withMessage("Please enter a title")
		.isLength({ max: 100, min: 3 })
		.withMessage(
			"Title must be at least 3 characters long and less than 100 characters long"
		),
	body("parentId").optional().isMongoId().withMessage("Invalid Parent Id"),
];

export interface UpdateTopicBody {
	title: string;
	parentId?: string;
}

const TopicValidators = {
	createTopicValidator,
	getTopicsValidator,
	deleteTopicValidator,
	updateTopicValidator,
};

export default TopicValidators;
