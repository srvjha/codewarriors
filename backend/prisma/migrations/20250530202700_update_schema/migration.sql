/*
  Warnings:

  - You are about to drop the column `description` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,title]` on the table `Discussion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comment` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "description",
ADD COLUMN     "comment" TEXT NOT NULL,
ALTER COLUMN "upvote" DROP NOT NULL,
ALTER COLUMN "upvote" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Discussion_userId_title_key" ON "Discussion"("userId", "title");
