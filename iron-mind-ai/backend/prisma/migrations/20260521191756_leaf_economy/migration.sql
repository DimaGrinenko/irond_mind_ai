-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastWheelDate" TEXT,
ADD COLUMN     "leaves" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wheelStreak" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "LeafTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeafTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnedShopItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "equipped" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnedShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeafTransaction_userId_createdAt_idx" ON "LeafTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OwnedShopItem_userId_idx" ON "OwnedShopItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnedShopItem_userId_itemId_key" ON "OwnedShopItem"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "LeafTransaction" ADD CONSTRAINT "LeafTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedShopItem" ADD CONSTRAINT "OwnedShopItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
