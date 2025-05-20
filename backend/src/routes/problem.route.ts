import {Router} from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";
import { createProblem, deleteProblem, getAllProblems,  getAllProblemsSolvedByUser,  getProblemById, updateProblem } from "../controllers/problem.controller";

const router = Router();

router.post("/create",verifyUser,checkRole,createProblem)
router.get("/all-problems",getAllProblems)
router.get("/:pid",getProblemById)
router.put("/:pid/update",verifyUser,checkRole,updateProblem)
router.delete("/:pid/delete",verifyUser,checkRole,deleteProblem)
router.get("/solved/all-problems",verifyUser,getAllProblemsSolvedByUser)
export default router