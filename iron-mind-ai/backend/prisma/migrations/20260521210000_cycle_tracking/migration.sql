-- Menstrual cycle tracking fields on UserProgress (opt-in, female users)
ALTER TABLE "UserProgress" ADD COLUMN "cycleEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "UserProgress" ADD COLUMN "cycleLastPeriod" TEXT;
ALTER TABLE "UserProgress" ADD COLUMN "cycleLength" INTEGER NOT NULL DEFAULT 28;
