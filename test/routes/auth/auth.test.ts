import request from "supertest";
import app from "@/config/express.config";
import httpStatus from "http-status";
import authSeeders from "./seeders";
import authData from "./data";

describe("User Login Test", () => {
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
});
