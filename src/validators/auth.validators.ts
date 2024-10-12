import { body } from "express-validator";

const LoginValidators = () => [
	body("email")
		.notEmpty()
		.withMessage("Please enter your email")
		.isEmail()
		.withMessage("Please Enter a valid email"),
];

export default {
	LoginValidators,
};
