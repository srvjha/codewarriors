import { db } from "../db";
import { asyncHandler } from "../utils/asynHandler";

const contestCron = asyncHandler(async (req, res) => {
  const now = new Date();
  const upcomingContests = await db.contest.findMany({
    where: {
      startTime: {
        lte: now,
      },
      endTime: {
        gt: now,
      },
      status: "UPCOMING",
    },
  });

  const liveUpdates = upcomingContests.map((contest) =>
    db.contest.update({
      where: { id: contest.id },
      data: { status: "LIVE" },
    })
  );

  const liveContests = await db.contest.findMany({
    where: {
      endTime: {
        lte: now,
      },
      status: "LIVE",
    },
  });

  const completedUpdates = liveContests.map((contest) =>
    db.contest.update({
      where: { id: contest.id },
      data: { status: "ENDED" },
    })
  );


  await Promise.all([...liveUpdates, ...completedUpdates]);

  res.status(200).json({
    message: "Contest statuses updated.",
    liveStarted: liveUpdates.length,
    liveEnded: completedUpdates.length,
  });
});


export {contestCron}