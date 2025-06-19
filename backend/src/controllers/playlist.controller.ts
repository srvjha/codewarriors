import { db } from "../db";
import { validId } from "../helper/validId.helper";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import { createPlaylistValidation } from "../validators/playlist.validation";

const getAllPrivatePlaylistDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const playlists = await db.playlist.findMany({
    where: {
      userId,
      visibilty: false,
      OR: [{ type: "private" }, { type: "clone" }],
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
      user: {
        select: {
          fullName: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlists, "All Playlist Fetched Successfully"));
});

const getAllPublicPlaylistDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      visibilty: true,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
      user: {
        select: {
          fullName: true,
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
  const playlist = await db.playlist.findUnique({
    where: {
      id: plid,
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
  const { name, description, visibilty, type } = handleZodError(
    createPlaylistValidation(req.body)
  );
  const userId = req.user.id;
  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
      visibilty,
      type,
    },
  });
  res
    .status(200)
    .json(new ApiResponse(201, playlist, "Playlist created Successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
  validId(plid, "Playlist");
  const { name, description, visibilty, type } = handleZodError(
    createPlaylistValidation(req.body)
  );
  console.log({ name, description });
  const userId = req.user.id;
  const playlist = await db.playlist.update({
    where: {
      id: plid,
    },
    data: {
      name,
      description,
      userId,
      visibilty,
      type,
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated Successfully"));
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

const clonePlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
  validId(plid, "Playlist");

  const result = await db.$transaction(async (tx) => {
    const playListInfo = await tx.playlist.findUnique({
      where: {
        id: plid,
      },
    });

    if (!playListInfo) {
      throw new ApiError("Playlist not found", 404);
    }

    const getProblemsInPlaylist = await tx.problemInPlaylist.findMany({
      where: {
        playListId: plid,
      },
    });

    const newPlaylist = await tx.playlist.create({
      data: {
        name: playListInfo.name + " (Clone)",
        description: playListInfo.description,
        userId: req.user.id,
        visibilty: false,
        type: "clone",
      },
    });

    await Promise.all(
      getProblemsInPlaylist.map((item) =>
        tx.problemInPlaylist.create({
          data: {
            problemId: item.problemId,
            playListId: newPlaylist.id,
          },
        })
      )
    );

    return newPlaylist;
  });

  res
    .status(200)
    .json(new ApiResponse(201, result, "Playlist cloned successfully"));
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { plid, pid } = req.params;
  validId(plid, "Playlist");
  validId(pid, "Problem");

  const existingProblems = await db.problem.findFirst({
    where: {
      id: pid,
    },
    select: { id: true },
  });

  if (!existingProblems) {
    throw new ApiError("Problem not found", 404);
  }
  const existingPlaylist = await db.playlist.findFirst({
    where: {
      id: plid,
    },
    select: { id: true },
  });

  if (!existingPlaylist) {
    throw new ApiError("Playlist not found", 404);
  }
  const existingProblemInPlaylist = await db.problemInPlaylist.findFirst({
    where: {
      playListId: plid,
      problemId: pid,
    },
  });
  if (existingProblemInPlaylist) {
    throw new ApiError("Problem already exists in the playlist", 409);
  }
  const addProblems = await db.problemInPlaylist.create({
    data: {
      playListId: plid,
      problemId: pid,
    },
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
  const { plid, pid } = req.params;
  validId(plid, "Playlist");
  validId(pid, "Problem");

  const existingProblems = await db.problem.findMany({
    where: {
      id: pid,
    },
    select: { id: true },
  });

  if (existingProblems.length === 0) {
    throw new ApiError("Problem not found", 404);
  }
  const deleteProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playListId: plid,
      problemId: pid,
    },
  });
  if (deleteProblem.count === 0) {
    throw new ApiError("No problem found in the playlist", 404);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Problem removed from playlist successfully")
    );
});

export {
  getAllPublicPlaylistDetails,
  getAllPrivatePlaylistDetails,
  getPlaylistDetails,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addProblemToPlaylist,
  removeProblemFromPlaylist,
  clonePlaylist,
};
