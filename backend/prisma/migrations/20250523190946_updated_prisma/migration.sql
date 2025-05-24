/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyProblemStreak" INTEGER DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_key" ON "Problem"("title");
