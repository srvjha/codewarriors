import {Router} from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { executeCode } from "../controllers/executeCode.controller";

const router = Router();

router.post("/:pid",verifyUser,executeCode)

export default router