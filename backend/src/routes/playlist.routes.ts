import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylistDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller";

const router = Router();

router.get("/all",verifyUser,getAllPlaylistDetails);
router.get("/:plid",verifyUser,getPlaylistDetails);
router.post("/create",verifyUser,createPlaylist);
router.delete("/:plid",verifyUser,deletePlaylist);
router.post("/:plid/problem/:pid/add",verifyUser,addProblemToPlaylist)
router.put("/:plid/problem/:pid/remove",verifyUser,removeProblemFromPlaylist);

export default router;