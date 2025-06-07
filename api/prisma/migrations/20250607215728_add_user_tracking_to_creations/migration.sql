/*
  Warnings:

  - Added the required column `created_by_id` to the `classrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `transfer_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN     "created_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transfer_histories" ADD COLUMN     "created_by_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "transfer_histories_created_by_id_idx" ON "transfer_histories"("created_by_id");

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_histories" ADD CONSTRAINT "transfer_histories_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
