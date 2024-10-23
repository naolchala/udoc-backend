import { body, param } from "express-validator";

const createDocValidator = [
	body("title")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Please enter title of the documentation")
		.isLength({ max: 100, min: 3 })
		.withMessage("Title cannot be more than 50 characters long"),
];

export type CreateDocBody = {
	title: string;
};

const deleteDocValidator = [
	param("id")
		.notEmpty()
		.isMongoId()
		.withMessage("Please enter a valid docs id"),
];

export type DeleteDocParam = {
	id: string;
};

const updateDocValidator = [
	param("id")
		.notEmpty()
		.isMongoId()
		.withMessage("Please enter a valid docs id"),

	...createDocValidator,
	body("description")
		.optional()
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters long"),
];

export type UpdateDocBody = {
	title: string;
	description?: string;
};

const DocsValidators = {
	createDocValidator,
	deleteDocValidator,
	updateDocValidator,
};

export default DocsValidators;
