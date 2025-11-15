import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";
import {
//   createProblem,
//   updateProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  isProblemSolved,
 
} from "../controllers/problem.controller";

const router = Router();

// router.post("/create", verifyUser, checkRole, createProblem);
// router.put("/:pid/update", verifyUser, checkRole, updateProblem);
router.get("/all-problems", getAllProblems);
router.get("/:pid", getProblemById);
router.delete("/:pid/delete", verifyUser, checkRole, deleteProblem);
router.get("/solved/all-problems", verifyUser, getAllProblemsSolvedByUser);
router.get("/:pid/status", verifyUser, isProblemSolved);
export default router;
