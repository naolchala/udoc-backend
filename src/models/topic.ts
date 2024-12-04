import prisma from "@/config/prisma.config";
import APIError from "@/interfaces/APIError";
import { slugify } from "@/utils";
import {
	CreateTopicBody,
	UpdateTopicBody,
} from "@/validators/topic.validators";
import httpStatus from "http-status";
import _ from "lodash";

const createTopic = async ({
	docId,
	title,
	parentId,
	userId,
}: CreateTopicBody & { userId: string }) => {
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

	if (doc.ownerId !== userId) {
		throw new APIError({
			message: "You don't have permission to create a topic",
			status: httpStatus.UNAUTHORIZED,
			isPublic: true,
		});
	}

	if (parentId) {
		const parent = await prisma.topic.findUnique({
			where: { id: parentId },
		});

		if (!parent) {
			throw new APIError({
				message: "Parent topic not found",
				status: httpStatus.NOT_FOUND,
				isPublic: true,
			});
		}

		if (parent.docId !== docId) {
			throw new APIError({
				message: "Parent topic doesn't belong to this documentation",
				status: httpStatus.BAD_REQUEST,
				isPublic: true,
			});
		}
	}

	let slug = slugify(title);
	const slugCount = await prisma.topic.count({
		where: {
			slug: {
				startsWith: slug,
			},
			docId,
		},
	});

	if (slugCount > 0) {
		slug += `-${slugCount + 1}`;
	}

	const topic = await prisma.topic.create({
		data: {
			title,
			docId,
			parentId,
			slug,
		},
	});

	return topic;
};

const getTopicsByDocId = async (docId: string) => {
	const topics = await prisma.topic.findMany({
		where: {
			docId,
		},
	});

	return topics;
};

interface DeleteTopicProps {
	topicId: string;
	userId: string;
}

const deleteTopic = async ({ topicId, userId }: DeleteTopicProps) => {
	const topic = await prisma.topic.findUnique({
		where: {
			id: topicId,
		},
		include: {
			_count: true,
			doc: true,
		},
	});

	if (!topic) {
		throw new APIError({
			message: "Topic not found",
			status: httpStatus.NOT_FOUND,
			isPublic: true,
		});
	}

	if (topic.doc.ownerId !== userId) {
		throw new APIError({
			message: "You don't have permission to delete this topic",
			status: httpStatus.UNAUTHORIZED,
			isPublic: true,
		});
	}

	if (topic._count.subTopics > 0) {
		throw new APIError({
			message: "Can't delete topic with sub topics",
			status: httpStatus.BAD_REQUEST,
			isPublic: true,
		});
	}

	await prisma.topic.delete({
		where: {
			id: topicId,
		},
	});

	return _.omit(topic, "doc");
};

interface UpdateTopicProps {
	userId: string;
	topicId: string;
	data: UpdateTopicBody;
}
const updateTopic = async ({ userId, topicId, data }: UpdateTopicProps) => {
	const topic = await prisma.topic.findUnique({
		where: {
			id: topicId,
		},
		include: {
			doc: true,
		},
	});

	if (!topic) {
		throw new APIError({
			message: "Topic not found",
			status: httpStatus.NOT_FOUND,
			isPublic: true,
		});
	}

	if (topic.doc.ownerId !== userId) {
		throw new APIError({
			message: "You don't have permission to update this topic",
			status: httpStatus.UNAUTHORIZED,
			isPublic: true,
		});
	}

	if (data.parentId) {
		const parent = await prisma.topic.findUnique({
			where: { id: data.parentId },
		});

		if (!parent) {
			throw new APIError({
				message: "Parent topic not found",
				status: httpStatus.NOT_FOUND,
				isPublic: true,
			});
		}

		if (parent.docId !== topic.docId) {
			throw new APIError({
				message: "Parent topic doesn't belong to this documentation",
				status: httpStatus.BAD_REQUEST,
				isPublic: true,
			});
		}
	}

	let slug = slugify(data.title);

	if (data.title !== topic.title) {
		const slugCount = await prisma.topic.count({
			where: {
				slug: {
					startsWith: slug,
				},
				docId: topic.docId,
			},
		});

		if (slugCount > 0) {
			slug = `${slug}-${slugCount + 1}`;
		}
	}

	const updatedTopic = await prisma.topic.update({
		where: {
			id: topicId,
		},
		data: {
			title: data.title,
			slug,
			parentId: data.parentId,
		},
	});

	return updatedTopic;
};

const TopicModel = {
	createTopic,
	getTopicsByDocId,
	deleteTopic,
	updateTopic,
};
export default TopicModel;
