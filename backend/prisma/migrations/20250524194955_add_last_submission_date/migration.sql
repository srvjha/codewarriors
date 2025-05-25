/*
  Warnings:

  - Made the column `dailyProblemStreak` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isStreakMaintained` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSubmissionDate" TIMESTAMP(3),
ALTER COLUMN "dailyProblemStreak" SET NOT NULL,
ALTER COLUMN "isStreakMaintained" SET NOT NULL;
