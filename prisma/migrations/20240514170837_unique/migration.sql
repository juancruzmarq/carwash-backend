/*
  Warnings:

  - You are about to drop the `tokenType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,id_user]` on the table `carwash` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "auth_token" DROP CONSTRAINT "auth_token_tokenTypeIdTokenType_fkey";

-- DropTable
DROP TABLE "tokenType";

-- CreateTable
CREATE TABLE "token_type" (
    "id_token_type" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_type_pkey" PRIMARY KEY ("id_token_type")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_type_name_key" ON "token_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "carwash_name_id_user_key" ON "carwash"("name", "id_user");

-- AddForeignKey
ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_tokenTypeIdTokenType_fkey" FOREIGN KEY ("tokenTypeIdTokenType") REFERENCES "token_type"("id_token_type") ON DELETE SET NULL ON UPDATE CASCADE;
