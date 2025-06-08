import { z } from "zod";

export const addStudentSchema = z.object({
  name: z.string().min(3, "İsim en az 3 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  studentNo: z.string().min(1, "Öğrenci numarası gereklidir."),
  classId: z.string({ required_error: "Lütfen bir sınıf seçin." }),
});

export type AddStudentFormData = z.infer<typeof addStudentSchema>;
