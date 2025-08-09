import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/services/auth";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email gereklidir")
        .email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormData = z.infer<typeof loginSchema>;


interface LoginFormProps {
    onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const auth = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await api.auth.login.post({
                email: data.email,
                password: data.password,
            });

            if (response.data && 'accessToken' in response.data) {
                // Auth store'u güncelle
                auth.setAuthData(response.data);
                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
                onLoginSuccess?.();
                router.navigate({ to: "/dashboard" });
            } else {
                const errorMsg = (response.data)?.error || "Lütfen bilgilerinizi kontrol edin.";
                toast.error("Giriş başarısız.", {
                    description: errorMsg,
                });
            }
        } catch (error) {
            console.error("Login hatası:", error);
            toast.error("Bir sunucu hatası oluştu.");
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Giriş Yap</CardTitle>
                <CardDescription>
                    Devam etmek için e-posta ve şifrenizi girin
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ornek@okul.edu.tr"
                            className="bg-background/50"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="bg-background/50 pr-10"
                                {...register("password")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="link"
                    onClick={() => router.navigate({ to: "/register" })}
                >
                    Hesabınız yok mu? Kayıt Olun
                </Button>
            </CardFooter>
        </Card>
    );
}