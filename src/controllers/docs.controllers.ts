import { RequestWithUser } from "@/interfaces/Request";
import { CreateDocBody } from "@/validators/docs.validators";
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

const DocsController = {
	createDoc,
	getUserDocs,
	getUserDocsBySlug,
};

export default DocsController;
