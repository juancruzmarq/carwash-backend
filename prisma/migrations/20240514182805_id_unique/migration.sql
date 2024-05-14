/*
  Warnings:

  - A unique constraint covering the columns `[name,id_user]` on the table `brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,id_brand,id_user]` on the table `model` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "brand_name_id_brand_id_user_key";

-- DropIndex
DROP INDEX "model_name_id_model_id_brand_id_user_key";

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_id_user_key" ON "brand"("name", "id_user");

-- CreateIndex
CREATE UNIQUE INDEX "model_name_id_brand_id_user_key" ON "model"("name", "id_brand", "id_user");
