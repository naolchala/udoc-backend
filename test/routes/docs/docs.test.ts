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

	afterAll(async () => {
		await prisma.documentation.deleteMany();
		await prisma.user.deleteMany();
	});
});

describe("Docs - Updates Documentation", () => {
	let user: User & { token: string };
	let doc: Documentation;
	beforeAll(async () => {
		await prisma.documentation.deleteMany();
		user = await authSeeders.userSeeder();
	});

	beforeEach(async () => {
		doc = await docsSeeder.createDoc(user.id);
	});

	it("should update given a valid data", async () => {
		const response = await request(app)
			.put(`/api/docs/${doc.id}`)
			.set("Authorization", `Bearer ${user.token}`)
			.send(docsData.validUpdateBody);

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body.title).not.toBe(doc.title);
		expect(response.body.description).toBe(
			docsData.validUpdateBody.description
		);
	});

	it("should not update given empty title", async () => {
		const response = await request(app)
			.put(`/api/docs/${doc.id}`)
			.set("Authorization", `Bearer ${user.token}`)
			.send(docsData.updateBodyWithEmptyTitle);

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		const updatedDoc = await prisma.documentation.findUnique({
			where: { id: doc.id },
		});
		expect(updatedDoc?.title).toBeDefined();
	});

	it("should block other users from updating others documentation", async () => {
		const anotherUser = await authSeeders.anotherUserSeeder();
		const response = await request(app)
			.put(`/api/docs/${doc.id}`)
			.set("Authorization", `Bearer ${anotherUser.token}`)
			.send(docsData.validDocBody);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	afterAll(async () => {
		await prisma.documentation.deleteMany();
		await prisma.user.deleteMany();
	});
});

describe("Docs - Get Lists of Documentations", () => {
	let user: User & { token: string };
	beforeAll(async () => {
		user = await authSeeders.userSeeder();
		await docsSeeder.createMultipleDocs(user.id);
	});

	it("should get list of users  documentations", async () => {
		const response = await request(app)
			.get("/api/docs")
			.set("Authorization", `Bearer ${user.token}`)
			.send();

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body.length).toBe(
			docsData.multipleValidDocumentations.length
		);

		const titles = response.body.map((d: { title: string }) => d.title);

		docsData.multipleValidDocumentations.forEach((doc) => {
			expect(titles).toContain(doc.title);
		});
	});

	it("should not provides documentations of other users", async () => {
		const anotherUser = await authSeeders.anotherUserSeeder();
		const anotherUserDoc = await docsSeeder.createDoc(anotherUser.id);

		const response = await request(app)
			.get("/api/docs")
			.set("Authorization", `Bearer ${user.token}`)
			.send();

		expect(response.status).toBe(httpStatus.OK);
		const ids = response.body.map((d: { id: string }) => d.id);
		expect(ids).not.toContain(anotherUserDoc.id);
	});
});

describe("Docs - Get Documentation by Slug", () => {
	let user: User & { token: string };
	let doc: Documentation;

	beforeAll(async () => {
		user = await authSeeders.userSeeder();
		doc = await docsSeeder.createDoc(user.id);
	});

	it("should get documentation by slug", async () => {
		const response = await request(app)
			.get(`/api/docs/${doc.slug}`)
			.set("Authorization", `Bearer ${user.token}`)
			.send();

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body.title).toBe(doc.title);
		expect(response.body.description).toBe(doc.description);
	});

	it("should return 404 if documentation not found", async () => {
		const response = await request(app)
			.get("/api/docs/non-existent-slug")
			.set("Authorization", `Bearer ${user.token}`)
			.send();

		expect(response.status).toBe(httpStatus.NOT_FOUND);
	});

	it("should return 401 if unauthorized user tries to access documentation", async () => {
		const response = await request(app).get(`/api/docs/${doc.slug}`).send();

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it("should return 403 if user tries to access documentation they do not own", async () => {
		const anotherUser = await authSeeders.anotherUserSeeder();
		const response = await request(app)
			.get(`/api/docs/${doc.slug}`)
			.set("Authorization", `Bearer ${anotherUser.token}`)
			.send();

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	afterAll(async () => {
		await prisma.documentation.deleteMany();
		await prisma.user.deleteMany();
	});
});
