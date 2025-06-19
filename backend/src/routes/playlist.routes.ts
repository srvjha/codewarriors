import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPrivatePlaylistDetails, getAllPublicPlaylistDetails, getPlaylistDetails, removeProblemFromPlaylist, updatePlaylist ,clonePlaylist} from "../controllers/playlist.controller";

const router = Router();

router.get("/all/private",verifyUser,getAllPrivatePlaylistDetails);
router.get("/all/public",getAllPublicPlaylistDetails);
router.get("/:plid",getPlaylistDetails);
router.post("/create",verifyUser,createPlaylist);
router.put("/:plid",verifyUser,updatePlaylist);
router.post("/:plid/clone",verifyUser,clonePlaylist)
router.delete("/:plid",verifyUser,deletePlaylist);
router.post("/:plid/problem/:pid/add",verifyUser,addProblemToPlaylist)
router.delete("/:plid/problem/:pid/remove",verifyUser,removeProblemFromPlaylist);

export default router;