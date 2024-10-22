import { RequestWithUser } from "@/interfaces/Request";
import {
	CreateDocBody,
	DeleteDocParam,
	UpdateDocBody,
} from "@/validators/docs.validators";
import { Request, Response } from "express";

import DocsModel from "@/models/documentation";

const createDoc = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const { title } = req.body as CreateDocBody;
	const doc = await DocsModel.createDocumentation({
		creatorId: user.id,
		title,
	});
	return res.json(doc);
};

const getUserDocs = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const docs = await DocsModel.getUserDocs(user.id);
	return res.json(docs);
};

const getUserDocsBySlug = async (req: Request, res: Response) => {
	const { slug } = req.params;
	const { user } = req as RequestWithUser;
	const doc = await DocsModel.getUserDocsBySlug({ slug, userId: user.id });
	return res.json(doc);
};

const deleteDoc = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const { id } = req.params as DeleteDocParam;
	const doc = await DocsModel.deleteDocumentation({
		docId: id,
		userId: user.id,
	});

	return res.json(doc);
};

const updateDoc = async (req: Request, res: Response) => {
	const { user } = req as RequestWithUser;
	const { id } = req.params as { id: string };
	const { title, description } = req.body as UpdateDocBody;
	const updatedDoc = await DocsModel.updateDocumentation({
		docId: id,
		title,
		description,
		userId: user.id,
	});

	return res.json(updatedDoc);
};

const DocsController = {
	createDoc,
	getUserDocs,
	getUserDocsBySlug,
	deleteDoc,
	updateDoc,
};

export default DocsController;
