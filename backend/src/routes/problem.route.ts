import {Router} from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";
import { createProblem, deleteProblem, getAllProblems, getAllProblemSolveByUser, getProblemById, updateProblem } from "../controllers/problem.controller";

const router = Router();

router.post("/create",verifyUser,checkRole,createProblem)
router.get("/all-problems",verifyUser,checkRole,getAllProblems)
router.get("/:pid",verifyUser,checkRole,getProblemById)
router.put("/:pid/update",verifyUser,checkRole,updateProblem)
router.delete("/:pid/delete",verifyUser,checkRole,deleteProblem)
router.get("/solved-problem",verifyUser,getAllProblemSolveByUser)
export default router