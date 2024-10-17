import { body } from "express-validator";

const LoginValidators = () => [
	body("email")
		.notEmpty()
		.withMessage("Please enter your email")
		.isEmail()
		.withMessage("Please Enter a valid email"),
	body("password")
		.notEmpty()
		.withMessage("Please enter your password")
		.isLength({
			min: 6,
			max: 20,
		})
		.withMessage("Password must be between 6 and 20 characters long"),
];

export type LoginBody = {
	email: string;
	password: string;
};

const RegisterValidators = () => [
	body("fullName")
		.notEmpty()
		.withMessage("Please enter your name")
		.isLength({ min: 3 })
		.withMessage("Name must be at least 3 characters long")
		.isLength({ max: 50 })
		.withMessage("Name cannot be more than 50 characters long"),
	body("email")
		.notEmpty()
		.withMessage("Please enter your email")
		.isEmail()
		.withMessage("Please Enter a valid email"),
	body("password")
		.notEmpty()
		.withMessage("Please enter your password")
		.isLength({
			min: 6,
			max: 20,
		})
		.withMessage("Password must be between 6 and 20 characters long"),
];

export type RegistrationBody = {
	fullName: string;
	email: string;
	password: string;
};

const ForgotPasswordValidator = () => [
	body("email")
		.notEmpty()
		.withMessage("Please enter your email")
		.isEmail()
		.withMessage("Please Enter a valid email"),
];

export type ForgotPasswordBody = {
	email: string;
};

const VerifyEmailValidator = () => [
	body("code")
		.notEmpty()
		.withMessage("Please Enter the code sent by your email")
		.isLength({ min: 6, max: 6 })
		.withMessage("Code should be 6 digits"),
];

export type VerifyEmailBody = {
	code: string;
};

const ResetPasswordValidation = () => [
	body("code")
		.notEmpty()
		.withMessage("Please Enter the code sent by your email")
		.isLength({ min: 6, max: 6 })
		.withMessage("Code should be 6 digits"),
	body("password")
		.notEmpty()
		.withMessage("Please enter your password")
		.isLength({
			min: 6,
			max: 20,
		})
		.withMessage("Password must be between 6 and 20 characters long"),
];

export type ResetPasswordBody = {
	code: string;
	password: string;
};

export default {
	LoginValidators,
	RegisterValidators,
	ForgotPasswordValidator,
	VerifyEmailValidator,
	ResetPasswordValidation,
};
