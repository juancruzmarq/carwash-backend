-- AlterTable
ALTER TABLE "auth_token" ADD COLUMN     "tokenTypeIdTokenType" INTEGER;

-- CreateTable
CREATE TABLE "tokenType" (
    "id_token_type" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokenType_pkey" PRIMARY KEY ("id_token_type")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokenType_name_key" ON "tokenType"("name");

-- AddForeignKey
ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_tokenTypeIdTokenType_fkey" FOREIGN KEY ("tokenTypeIdTokenType") REFERENCES "tokenType"("id_token_type") ON DELETE SET NULL ON UPDATE CASCADE;
