import { db } from "../db";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";

const checkDailyStreak = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allUsers = await db.user.findMany({
    where: {
      isStreakMaintained: true,
    },
  });

  for (const user of allUsers) {
    const lastSubmission = user.lastSubmissionDate
      ? new Date(user.lastSubmissionDate)
      : null;
    if (!lastSubmission) continue;

    lastSubmission.setHours(0, 0, 0, 0);
    const kyaWoAajHai = lastSubmission.getTime() === today.getTime();
    if (!kyaWoAajHai) {
      await db.user.update({
        where: { id: user.id },
        data: {
          dailyProblemStreak: 0,
          isStreakMaintained: false,
        },
      });
    }
  }
  res
    .status(200)
    .json(new ApiResponse(200, null, "Daily Streak Checked Successfully"));
});

export { checkDailyStreak };
