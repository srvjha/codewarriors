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

  const userInfo = [];

  for (const user of allUsers) {
    const lastSubmission = user.lastSubmissionDate
      ? new Date(user.lastSubmissionDate)
      : null;
    if (!lastSubmission) continue;

    lastSubmission.setHours(0, 0, 0, 0);
    const todayDateStr = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  
    const lastSubmissionDateStr = new Date(
      lastSubmission
    ).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });


    const kyaWoAajHai = todayDateStr === lastSubmissionDateStr;
    userInfo.push({
      user_name:user.fullName || "",
      user_lastsubmission_date: lastSubmissionDateStr,
      current_date: todayDateStr,
      status:kyaWoAajHai
    })

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
    .json(new ApiResponse(200, userInfo, "Daily Streak Checked Successfully"));
});

export { checkDailyStreak };
