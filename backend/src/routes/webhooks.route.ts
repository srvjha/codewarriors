import { Router } from "express";
import { contestCron } from "../workers/contest.worker";
import { checkDailyStreak } from "../workers/dailyStreak.worker";


const router  = Router();

router.use((_,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
})

router.get("/cron/status",contestCron)
router.get("/cron/daily-streak",checkDailyStreak)

export default router