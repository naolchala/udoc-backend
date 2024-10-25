import prisma from "@/config/prisma.config";
import { slugify } from "@/utils";
import docsData from "./data";

// eslint-disable-next-line import/prefer-default-export
const createDoc = async (userId: string) => {
	const slug = slugify(docsData.validDocBody.title);
	const doc = await prisma.documentation.create({
		data: {
			...docsData.validDocBody,
			slug,
			ownerId: userId,
		},
	});

	return doc;
};

const docsSeeder = {
	createDoc,
};

export default docsSeeder;
