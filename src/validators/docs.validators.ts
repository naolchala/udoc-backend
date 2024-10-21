import { body } from "express-validator";

const createDocValidator = [
	body("title")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Please enter title of the documentation"),
];

export type CreateDocBody = {
	title: string;
};

const DocsValidators = { createDocValidator };
export default DocsValidators;
