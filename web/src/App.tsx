import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, useAuth, type LoginFormData } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import "normalize.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { handleServerError } from "./utils/handle-server-error";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.invalidate().finally(() => {
        router.navigate({ to: "/dashboard" });
      });
    } catch (error) {
      handleServerError(error) 
      console.error("Login error:", error);
      alert("Giriş başarısız oldu.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Kütüphane Takip Sistemine Hoş Geldiniz
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Lütfen devam etmek için giriş yapınız.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta Adresi</FormLabel>
                  <FormControl>
                <Input
                  type="email"
                  placeholder="ornek@okul.edu.tr"
                      {...field}
                />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                        placeholder="Şifreniz"
                        {...field}
                  />
                      <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Giriş Yapılıyor..."
                : "Giriş Yap"}
              </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}

export default App;