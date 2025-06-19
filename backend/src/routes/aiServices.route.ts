import { Router } from "express";
import { chatWithAi, getComplexities } from "../controllers/ai.controller";

const router = Router();

router.post("/complexities",getComplexities)
router.post("/ask/question",chatWithAi)

export default router;