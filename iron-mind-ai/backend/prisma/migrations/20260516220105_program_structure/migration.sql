-- CreateEnum
CREATE TYPE "ProgramKind" AS ENUM ('FULL_BODY', 'UPPER_LOWER', 'PUSH_PULL_LEGS', 'SPLIT', 'CUSTOM');

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "baseProgramId" TEXT,
ADD COLUMN     "daysPerWeek" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "kind" "ProgramKind" NOT NULL DEFAULT 'CUSTOM',
ADD COLUMN     "ownerUserId" TEXT;

-- CreateTable
CREATE TABLE "ProgramDay" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "weekday" INTEGER,

    CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramExercise" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "exerciseId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 3,
    "repsMin" INTEGER NOT NULL DEFAULT 8,
    "repsMax" INTEGER NOT NULL DEFAULT 12,
    "restSeconds" INTEGER NOT NULL DEFAULT 90,
    "notes" TEXT,

    CONSTRAINT "ProgramExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgramDay_programId_order_idx" ON "ProgramDay"("programId", "order");

-- CreateIndex
CREATE INDEX "ProgramExercise_dayId_order_idx" ON "ProgramExercise"("dayId", "order");

-- CreateIndex
CREATE INDEX "Program_ownerUserId_idx" ON "Program"("ownerUserId");

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramExercise" ADD CONSTRAINT "ProgramExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "ProgramDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
