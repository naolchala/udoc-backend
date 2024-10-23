import request from "supertest";
import app from "@/config/express.config";
import httpStatus from "http-status";
import prisma from "@/config/prisma.config";
import { User } from "@prisma/client";
import { generateVerificationCode } from "@/utils/email";
import authSeeders from "./seeders";
import authData from "./data";

describe("Auth - User Login Test", () => {
	beforeAll(async () => {
		await authSeeders.userSeeder();
	});

	it("should login with valid credentials", (done) => {
		request(app)
			.post("/api/auth/login")
			.send(authData.validUserCredentials)
			.expect(httpStatus.OK, done);
	});

	it("should return expected data on valid login", async () => {
		const response = await request(app)
			.post("/api/auth/login")
			.send(authData.validUserCredentials);

		expect(response.body.token).toBeDefined();
		expect(response.body.email).toBe(authData.validUserCredentials.email);
		expect(response.body.fullName).toBe(authData.validUser.fullName);
		expect(response.body.id).toBeDefined();

		return response;
	});

	it("should not login with empty email", (done) => {
		request(app)
			.post("/api/auth/login")
			.send(authData.emptyEmailCredential)
			.expect(httpStatus.BAD_REQUEST, done);
	});

	it("should not login with invalid email", (done) => {
		request(app)
			.post("/api/auth/login")
			.send(authData.invalidEmailCredentials)
			.expect(httpStatus.NOT_FOUND, done);
	});

	it("should not login with invalid password", (done) => {
		request(app)
			.post("/api/auth/login")
			.send(authData.invalidPasswordCredentials)
			.expect(httpStatus.UNAUTHORIZED, done);
	});

	it("should not login with invalid email format", (done) => {
		request(app)
			.post("/api/auth/login")
			.send(authData.invalidEmailFormatCredential)
			.expect(httpStatus.BAD_REQUEST, done);
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});
});

describe("Auth - User Registration Test", () => {
	beforeAll(async () => {
		await prisma.user.deleteMany();
	});

	afterEach(async () => {
		await prisma.user.deleteMany();
	});

	it("should register with valid user values", (done) => {
		request(app)
			.post("/api/auth/register")
			.send(authData.validUser)
			.expect(httpStatus.OK, done);
	});

	it("should return expected data on valid registration", async () => {
		const response = await request(app)
			.post("/api/auth/register")
			.send(authData.validUser);

		expect(response.body.token).toBeDefined();
		expect(response.body.id).toBeDefined();
		expect(response.body.email).toBe(authData.validUser.email);
		expect(response.body.isEmailVerified).toBeFalsy();
		expect(response.body.fullName).toBe(authData.validUser.fullName);
	});

	it("should not allow registration with same email", async () => {
		await request(app).post("/api/auth/register").send(authData.validUser);
		const response = await request(app)
			.post("/api/auth/register")
			.send(authData.validUser);

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		expect(response.body.message).toBeDefined();
	});

	it("should not allow registration with invalid email format", async () => {
		const response = await request(app)
			.post("/api/auth/register")
			.send({
				...authData.validUser,
				email: authData.invalidEmailFormatCredential.email,
			});

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		expect(response.body.message).toBeDefined();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});
});

describe("Auth - User Send Email Verification", () => {});

describe("Auth - User Verify Email", () => {
	let user: User & { token: string };

	beforeAll(async () => {
		user = await authSeeders.userSeeder();
	});

	beforeEach(async () => {
		await authSeeders.verificationCodeSeeder(user.id);
	});

	it("should verify email with valid code", async () => {
		const response = await request(app)
			.post("/api/auth/verify-email")
			.set("Authorization", `Bearer ${user.token}`)
			.send({
				code: authData.emailVerificationCode,
			});

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body.message).toBeDefined();
	});

	it("should return an error when wrong code is sent", async () => {
		const response = await request(app)
			.post("/api/auth/verify-email")
			.set("Authorization", `Bearer ${user.token}`)
			.send({
				code: generateVerificationCode().toString(),
			});

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		expect(response.body.message).toBeDefined();
	});

	it("should return an error when empty code is sent", async () => {
		const response = await request(app)
			.post("/api/auth/verify-email")
			.set("Authorization", `Bearer ${user.token}`)
			.send({});

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		expect(response.body.message).toBeDefined();
	});

	afterEach(async () => {
		await prisma.emailVerification.deleteMany();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});
});
