-- AlterTable
ALTER TABLE "ScheduledWorkout" ADD COLUMN     "programDayId" TEXT;

-- CreateIndex
CREATE INDEX "ScheduledWorkout_userId_programId_status_idx" ON "ScheduledWorkout"("userId", "programId", "status");
