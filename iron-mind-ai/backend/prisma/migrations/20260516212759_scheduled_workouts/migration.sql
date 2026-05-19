-- CreateEnum
CREATE TYPE "ScheduledWorkoutStatus" AS ENUM ('PLANNED', 'DONE', 'SKIPPED');

-- CreateTable
CREATE TABLE "ScheduledWorkout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "programId" TEXT,
    "notes" TEXT,
    "status" "ScheduledWorkoutStatus" NOT NULL DEFAULT 'PLANNED',
    "completedAt" TIMESTAMP(3),
    "workoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledWorkout_userId_date_idx" ON "ScheduledWorkout"("userId", "date");

-- CreateIndex
CREATE INDEX "ScheduledWorkout_userId_status_idx" ON "ScheduledWorkout"("userId", "status");

-- AddForeignKey
ALTER TABLE "ScheduledWorkout" ADD CONSTRAINT "ScheduledWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
