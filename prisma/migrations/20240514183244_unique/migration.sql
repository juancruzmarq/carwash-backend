-- DropForeignKey
ALTER TABLE "brand" DROP CONSTRAINT "brand_id_user_fkey";

-- DropForeignKey
ALTER TABLE "model" DROP CONSTRAINT "model_id_user_fkey";

-- AlterTable
ALTER TABLE "brand" ALTER COLUMN "id_user" DROP NOT NULL;

-- AlterTable
ALTER TABLE "model" ALTER COLUMN "id_user" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "model_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
