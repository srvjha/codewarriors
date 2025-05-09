import { db } from "../db";
import { validId } from "../helper/validId.helper";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import {
  addProblemsValidation,
  createPlaylistValidation,
} from "../validators/playlist.validation";

const getAllPlaylistDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const playlists = await db.playlist.findMany({
    where: {
      userId,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, playlists, "All Playlist Fetched Successfully"));
});

const getPlaylistDetails = asyncHandler(async (req, res) => {
  const { plid } = req.params;
   validId(plid, "Playlist");
  const userId = req.user.id;
  const playlist = await db.playlist.findUnique({
    where: {
      id: plid,
      userId,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError("Problem not found in the playlist", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched Successfully"));
});

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = handleZodError(
    createPlaylistValidation(req.body)
  );
  const userId = req.user.id;
  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created Successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
   validId(plid, "Playlist");
  const playlist = await db.playlist.delete({
    where: {
      id: plid,
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted Successfully"));
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
   validId(plid, "Playlist");
  const { problemIds } = handleZodError(addProblemsValidation(req.body));

  problemIds.forEach((id) => validId(id, "Problem"));

  const existingProblems = await db.problem.findMany({
    where: {
      id: { in: problemIds },
    },
    select: { id: true },
  });

  const validIds = new Set(existingProblems.map((p) => p.id));
  const invalidIds = problemIds.filter((id: string) => !validIds.has(id));

  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid problem IDs: ${invalidIds.join(", ")}`, 400);
  }

  const addProblems = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId: string) => ({
      playListId: plid,
      problemId,
    })),
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addProblems,
        "Problem added to playlist successfully"
      )
    );
});

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
  validId(plid, "Playlist");
  const { problemIds } = handleZodError(addProblemsValidation(req.body));

  problemIds.forEach((id) => validId(id, "Problem"));

  const existingProblems = await db.problem.findMany({
    where: {
      id: { in: problemIds },
    },
    select: { id: true },
  });

  const validIds = new Set(existingProblems.map((p) => p.id));
  const invalidIds = problemIds.filter((id: string) => !validIds.has(id));

  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid problem IDs: ${invalidIds.join(", ")}`, 400);
  }
  const deleteProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playListId: plid,
      problemId: { in: problemIds },
    },
  });
  if (deleteProblem.count === 0) {
    throw new ApiError("No problem found in the playlist", 400);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Problem removed from playlist successfully")
    );
});

export {
  getAllPlaylistDetails,
  getPlaylistDetails,
  createPlaylist,
  deletePlaylist,
  addProblemToPlaylist,
  removeProblemFromPlaylist,
};
