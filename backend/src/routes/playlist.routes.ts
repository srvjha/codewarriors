import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPrivatePlaylistDetails, getAllPublicPlaylistDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller";

const router = Router();

router.get("/all/private",verifyUser,getAllPrivatePlaylistDetails);
router.get("/all/public",verifyUser,getAllPublicPlaylistDetails);
router.get("/:plid",getPlaylistDetails);
router.post("/create",verifyUser,createPlaylist);
router.delete("/:plid",verifyUser,deletePlaylist);
router.post("/:plid/problem/:pid/add",verifyUser,addProblemToPlaylist)
router.delete("/:plid/problem/:pid/remove",verifyUser,removeProblemFromPlaylist);

export default router;