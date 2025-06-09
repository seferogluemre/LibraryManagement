import { z } from "zod";

export const editStudentSchema = z.object({
  name: z.string().min(3, "İsim en az 3 karakter olmalıdır.").optional(),
  email: z.string().email("Geçerli bir e-posta adresi giriniz.").optional(),
  studentNo: z.string().min(1, "Öğrenci numarası gereklidir.").optional(),
  classId: z.string().optional(),
});

export type EditStudentFormData = z.infer<typeof editStudentSchema>;
