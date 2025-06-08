import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Geçerli bir email adresi giriniz")
    .min(1, "Email gereklidir"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .min(1, "Şifre gereklidir"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
