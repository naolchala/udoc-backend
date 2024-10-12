import AuthRouter from "@/routes/auth.routes";
import { Router } from "express";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);

export default APIRouter;
