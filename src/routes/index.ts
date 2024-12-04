import AuthRouter from "@/routes/auth.routes";
import DocsRouter from "@/routes/docs.routes";
import TopicsRoute from "@/routes/topics.routes";
import { Router } from "express";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);
APIRouter.use("/docs", DocsRouter);
APIRouter.use("/topics", TopicsRoute);

export default APIRouter;
