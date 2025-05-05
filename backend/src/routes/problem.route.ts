import {Router} from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";
import { createProblem, deleteProblem, getAllProblems, getAllProblemSolveByUser, getProblemById, updateProblem } from "../controllers/problem.controller";

const router = Router();

router.post("/create",verifyUser,checkRole,createProblem)
router.get("/all-problems",verifyUser,checkRole,getAllProblems)
router.get("/:id",verifyUser,checkRole,getProblemById)
router.put("/:id/update",verifyUser,checkRole,updateProblem)
router.delete("/:id/delete",verifyUser,checkRole,deleteProblem)
router.get("/solved-problem",verifyUser,getAllProblemSolveByUser)
export default router