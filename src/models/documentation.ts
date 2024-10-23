import prisma from "@/config/prisma.config";
import APIError from "@/interfaces/APIError";
import httpStatus from "http-status";

import { slugify } from "@/utils";

interface CreateDocumentationProps {
	creatorId: string;
	title: string;
	description?: string;
}

const createDocumentation = async ({
	creatorId,
	title,
	description,
}: CreateDocumentationProps) => {
	let slug = slugify(title);

	const count = await prisma.documentation.count({
		where: {
			slug: {
				startsWith: slug,
			},
		},
	});

	if (count > 0) {
		slug += `-${count + 1}`;
	}

	const docs = await prisma.documentation.create({
		data: {
			title,
			description,
			slug,
			owner: {
				connect: {
					id: creatorId,
				},
			},
		},
	});

	return docs;
};

const getUserDocs = async (userId: string) => {
	const docs = await prisma.documentation.findMany({
		where: {
			ownerId: userId,
		},
	});

	return docs;
};

interface GetDocBySlugProps {
	slug: string;
	userId: string;
}
const getUserDocsBySlug = async ({ slug, userId }: GetDocBySlugProps) => {
	const doc = await prisma.documentation.findFirst({
		where: {
			slug,
		},
	});

	if (!doc) {
		throw new APIError({
			message: "Documentation not found",
			status: httpStatus.NOT_FOUND,
			isPublic: true,
		});
	}

	if (doc.ownerId !== userId) {
		throw new APIError({
			message: "You don't have access to this documentation",
			status: httpStatus.UNAUTHORIZED,
			isPublic: true,
		});
	}

	return doc;
};

interface DeleteDocProps {
	docId: string;
	userId: string;
}

const deleteDocumentation = async ({ docId, userId }: DeleteDocProps) => {
	const doc = await prisma.documentation.findUnique({
		where: {
			id: docId,
		},
	});

	if (!doc) {
		throw new APIError({
			message: "Documentation not found",
			status: httpStatus.NOT_FOUND,
			isPublic: true,
		});
	}

	if (userId !== doc.ownerId) {
		throw new APIError({
			message: "You don't have permission to delete this documentation",
			status: httpStatus.UNAUTHORIZED,
			isPublic: true,
		});
	}

	const deletedDoc = await prisma.documentation.delete({
		where: { id: doc.id },
	});

	return deletedDoc;
};

interface UpdateDocBody {
	userId: string;
	docId: string;
	title: string;
	description?: string;
}

const updateDocumentation = async ({
	userId,
	docId,
	title,
	description,
}: UpdateDocBody) => {
	const doc = await prisma.documentation.findUnique({ where: { id: docId } });
	if (!doc) {
		throw new APIError({
			message: "Documentation not found",
			status: httpStatus.NOT_FOUND,
			isPublic: true,
		});
	}

	if (userId !== doc.ownerId) {
		throw new APIError({
			message: "You don't have permission to update this documentation",
			status: httpStatus.UNAUTHORIZED,
			isPublic: true,
		});
	}

	let slug = slugify(title);

	if (slug !== doc.slug) {
		const count = await prisma.documentation.count({
			where: {
				slug: {
					startsWith: slug,
				},
			},
		});

		if (count > 0) {
			slug += `-${count + 1}`;
		}
	}

	const updatedDoc = await prisma.documentation.update({
		where: { id: docId },
		data: {
			title,
			description,
			slug,
		},
	});

	return updatedDoc;
};

export default {
	createDocumentation,
	getUserDocs,
	getUserDocsBySlug,
	deleteDocumentation,
	updateDocumentation,
};
