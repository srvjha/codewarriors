import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { getAllSubmission, getAllSubmissionForProblem, getAllTheSubmissionForProblem } from "../controllers/submission.controller";

const router = Router();

router.get("/all",verifyUser,getAllSubmission);
router.get("/problem/:pid",verifyUser,getAllSubmissionForProblem);
router.get("/count/problem/:pid",verifyUser,getAllTheSubmissionForProblem)

export default router;