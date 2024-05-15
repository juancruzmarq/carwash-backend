/*
  Warnings:

  - You are about to drop the column `id_service` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `id_state_history` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `appointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_id_promotion_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_id_service_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_id_state_history_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_id_user_fkey";

-- DropIndex
DROP INDEX "price_history_id_service_created_at_key";

-- AlterTable
ALTER TABLE "appointment" DROP COLUMN "id_service",
DROP COLUMN "id_state_history",
DROP COLUMN "id_user",
ALTER COLUMN "id_promotion" DROP NOT NULL;

-- AlterTable
ALTER TABLE "carwash" ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "service" ADD COLUMN     "description" TEXT,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "state_histories" ADD COLUMN     "appointmentIdAppointment" INTEGER,
ADD COLUMN     "clientIdClient" INTEGER;

-- CreateTable
CREATE TABLE "_appointmentToservice" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_appointmentToservice_AB_unique" ON "_appointmentToservice"("A", "B");

-- CreateIndex
CREATE INDEX "_appointmentToservice_B_index" ON "_appointmentToservice"("B");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_promotion_fkey" FOREIGN KEY ("id_promotion") REFERENCES "promotion"("id_promotion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_histories" ADD CONSTRAINT "state_histories_appointmentIdAppointment_fkey" FOREIGN KEY ("appointmentIdAppointment") REFERENCES "appointment"("id_appointment") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_histories" ADD CONSTRAINT "state_histories_clientIdClient_fkey" FOREIGN KEY ("clientIdClient") REFERENCES "client"("id_client") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_appointmentToservice" ADD CONSTRAINT "_appointmentToservice_A_fkey" FOREIGN KEY ("A") REFERENCES "appointment"("id_appointment") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_appointmentToservice" ADD CONSTRAINT "_appointmentToservice_B_fkey" FOREIGN KEY ("B") REFERENCES "service"("id_service") ON DELETE CASCADE ON UPDATE CASCADE;
