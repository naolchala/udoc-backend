import app from "@/config/express.config";
import request from "supertest";

describe("GET /api/v1", () => {
	it("responds with a json message", (done) => {
		request(app)
			.get("/api/v1")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(
				200,
				{
					message: "API - 👋🌎🌍🌏",
				},
				done
			);
	});
});

describe("GET /api/v1/emojis", () => {
	it("responds with a json message", (done) => {
		request(app)
			.get("/api/v1/emojis")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200, ["😀", "😳", "🙄"], done);
	});
});
