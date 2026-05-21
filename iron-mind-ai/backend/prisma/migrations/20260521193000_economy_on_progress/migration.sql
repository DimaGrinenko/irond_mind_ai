-- Move leaf economy from User to UserProgress (canonical balance = UserProgress.leaves)
ALTER TABLE "User" DROP COLUMN IF EXISTS "leaves";
ALTER TABLE "User" DROP COLUMN IF EXISTS "lastWheelDate";
ALTER TABLE "User" DROP COLUMN IF EXISTS "wheelStreak";

ALTER TABLE "UserProgress" ADD COLUMN "lastWheelDate" TEXT;
ALTER TABLE "UserProgress" ADD COLUMN "wheelStreak" INTEGER NOT NULL DEFAULT 0;
