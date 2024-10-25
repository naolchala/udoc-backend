import app from "@/config/express.config";
import prisma from "@/config/prisma.config";
import request from "supertest";
import httpStatus from "http-status";

import { Documentation, User } from "@prisma/client";

import _ from "lodash";
import docsData from "./data";
import authSeeders from "../auth/seeders";
import docsSeeder from "./seeder";

describe("Docs - Creates Documentation", () => {
	let user: User & { token: string };
	beforeAll(async () => {
		await prisma.documentation.deleteMany();
		user = await authSeeders.userSeeder();
	});

	it("should create documentation given a valid data", async () => {
		const response = await request(app)
			.post("/api/docs")
			.set("Authorization", `Bearer ${user.token}`)
			.send(docsData.validDocBody);

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body.title).toBe(docsData.validDocBody.title);
		expect(response.body.ownerId).toBe(user.id);
		expect(response.body.id).toBeDefined();
	});

	it("should not create documentation given invalid data", async () => {
		const response = await request(app)
			.post("/api/docs")
			.set("Authorization", `Bearer ${user.token}`)
			.send(docsData.invalidDocBody);

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
	});

	it("should give different slugs for different titles", async () => {
		const responses = [];
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < 5; i++) {
			// eslint-disable-next-line no-await-in-loop
			const response = await request(app)
				.post("/api/docs")
				.set("Authorization", `Bearer ${user.token}`)
				.send(docsData.validDocBody);

			expect(response.status).toBe(httpStatus.OK);
			responses.push(response);
		}

		const slugs = responses.map((r) => r.body.slug);
		expect(_.uniq(slugs).length).toBe(slugs.length);
	});

	afterAll(async () => {
		await prisma.documentation.deleteMany();
	});
});

describe("Docs - Delete Documentation", () => {
	let user: User & { token: string };
	let doc: Documentation;

	beforeAll(async () => {
		await prisma.documentation.deleteMany();
		user = await authSeeders.userSeeder();
	});

	beforeEach(async () => {
		doc = await docsSeeder.createDoc(user.id);
	});

	it("should delete documentation", async () => {
		const response = await request(app)
			.delete(`/api/docs/${doc.id}`)
			.set("Authorization", `Bearer ${user.token}`)
			.send();

		expect(response.status).toBe(httpStatus.OK);
		const deletedDoc = await prisma.documentation.findUnique({
			where: { id: doc.id },
		});

		expect(deletedDoc).toBeNull();
	});

	it("should block unauthorized users to delete documentation", async () => {
		const response = await request(app)
			.delete(`/api/docs/${doc.id}`)
			.send();

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it("should block other users from deleting others documentation", async () => {
		const anotherUser = await authSeeders.anotherUserSeeder();
		const response = await request(app)
			.delete(`/api/docs/${doc.id}`)
			.set("Authorization", `Bearer ${anotherUser.token}`)
			.send();

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});
});
