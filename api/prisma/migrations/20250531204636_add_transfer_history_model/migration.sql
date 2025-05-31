-- CreateTable
CREATE TABLE "transfer_histories" (
    "transfer_history_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "old_class_id" TEXT NOT NULL,
    "new_class_id" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "transfer_histories_pkey" PRIMARY KEY ("transfer_history_id")
);

-- AddForeignKey
ALTER TABLE "transfer_histories" ADD CONSTRAINT "transfer_histories_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_histories" ADD CONSTRAINT "transfer_histories_old_class_id_fkey" FOREIGN KEY ("old_class_id") REFERENCES "classrooms"("classroom_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_histories" ADD CONSTRAINT "transfer_histories_new_class_id_fkey" FOREIGN KEY ("new_class_id") REFERENCES "classrooms"("classroom_id") ON DELETE RESTRICT ON UPDATE CASCADE;
