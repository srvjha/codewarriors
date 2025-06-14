import { db } from "../db";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynHandler";

const checkDailyStreak = asyncHandler(async (req, res) => {
  

  const allUsers = await db.user.findMany({
    where: {
      isStreakMaintained: true,
    },
  });

  const userInfo = [];

  for (const user of allUsers) {
   if (!user.lastSubmissionDate) continue;

    const todayDateStr = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  
    const lastSubmissionDateStr = new Date(
      user.lastSubmissionDate
    ).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });


    const isToday = todayDateStr === lastSubmissionDateStr;
    userInfo.push({
      user_name:user.fullName || "",
      user_lastsubmission_date: lastSubmissionDateStr,
      current_date: todayDateStr,
      status:isToday
    })

    if (!isToday) {
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
