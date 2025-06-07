import { Router } from "express";
import { contestCron } from "../controllers/contest.controller";

const router  = Router();

router.use((_,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
})

router.get("/cron/status",contestCron)

export default router