-- AlterTable
ALTER TABLE "transfer_histories" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transfer_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
