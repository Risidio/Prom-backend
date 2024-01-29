-- DropIndex
DROP INDEX "Notifications_userId_key";

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "userId" SET DATA TYPE TEXT;
