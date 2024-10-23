import AuthRouter from "@/routes/auth.routes";
import DocsRouter from "@/routes/docs.routes";
import { Router } from "express";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);
APIRouter.use("/docs", DocsRouter);

export default APIRouter;
