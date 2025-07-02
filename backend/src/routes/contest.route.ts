import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";
import { addContestantScore, checkUserRegistration, createContest, createContestSubmission, getAllContests, getContestById, getContestLeaderboard, getContestSubmissionDetailsById, registerUserToContest, unregisterUserFromContest } from "../controllers/contest.controller";

const router  = Router();


router.post("/create",verifyUser,checkRole,createContest);
router.get("/:contestId/register/user",verifyUser,registerUserToContest)
router.post("/submission",verifyUser,createContestSubmission)
router.get("/all",getAllContests)
router.get("/:id",getContestById)
router.post("/add/score",verifyUser,addContestantScore)
router.get("/leaderboard/:id",verifyUser,getContestLeaderboard)
router.delete("/:contestId/register/user", verifyUser, unregisterUserFromContest);
router.get("/:contestId/registration-status", verifyUser, checkUserRegistration);
router.get("/:contestId/submissions/details",verifyUser,getContestSubmissionDetailsById);




export default router;