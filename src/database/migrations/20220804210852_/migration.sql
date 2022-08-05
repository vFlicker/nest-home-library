-- DropIndex
DROP INDEX "User_login_key";

-- CreateTable
CREATE TABLE "Token" (
    "refreshToken" TEXT NOT NULL,
    "userId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshToken_key" ON "Token"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
