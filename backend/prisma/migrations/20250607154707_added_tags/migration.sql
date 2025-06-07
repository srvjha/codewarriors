-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
