import { generateVerificationCode } from "@/utils/email";

const validUser = {
	fullName: "Naol Chala",
	email: "naolchala@gmail.com",
	password: "123456",
};

const validUserCredentials = {
	email: validUser.email,
	password: validUser.password,
};

const invalidEmailCredentials = {
	email: "someone@gmail.com",
	password: "123456",
};

const invalidPasswordCredentials = {
	email: "naolchala@gmail.com",
	password: "1234576",
};

const invalidEmailFormatCredential = {
	email: "naolchala",
	password: "1234576",
};

const emptyEmailCredential = {
	email: "",
	password: "1234576",
};

const emptyPasswordCredential = {
	email: "naolchala@gmail.com",
	password: "",
};

const emailVerificationCode = generateVerificationCode().toString();

const authData = {
	validUser,
	validUserCredentials,
	invalidEmailCredentials,
	invalidPasswordCredentials,
	emptyEmailCredential,
	invalidEmailFormatCredential,
	emptyPasswordCredential,
	emailVerificationCode,
};
export default authData;
