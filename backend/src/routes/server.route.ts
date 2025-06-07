import { Router } from "express";
import { getServerTime } from "../controllers/server.controller";

const router = Router();

router.get("/server-time", getServerTime);

export default router