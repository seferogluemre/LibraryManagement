import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Eye, EyeOff, LogInIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { router } from "@/router";

const registerSchema = z.object({
    name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    role: z.string().min(1, "Lütfen bir rol seçiniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            password: "",
        },
    });

    const onSubmit = async (formData: RegisterFormData) => {
        setIsLoading(true);

        api.auth.register.post({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role.toUpperCase(),
        })

        toast(`Hoş geldiniz ${formData.name}, kaydınız tamamlandı.`);

        setIsLoading(false);

        form.reset();
        router.navigate({ to: "/login" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <Card className="w-full max-w-md border-2 border-border shadow-soft">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-primary">
                            Ümmü Mihcen Kütüphane
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-2">
                            Kütüphane üyeliği için kayıt olun
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ad Soyad</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Adınızı ve soyadınızı giriniz"
                                                {...field}
                                                className="border-2 focus:border-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="email@ornek.com"
                                                {...field}
                                                className="border-2 focus:border-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-2 focus:border-primary">
                                                    <SelectValue placeholder="Rolünüzü seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="teacher">Öğretmen</SelectItem>
                                                <SelectItem value="admin">İdare</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                    placeholder="Şifrenizi giriniz"
                                                    {...field}
                                                    className="pr-10 border-2 focus:border-primary"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center mt-6">
                        <p className="text-sm bg-blue-400 p-2 text-center rounded-md text-muted-foreground">
                            Zaten hesabınız var mı?{" "}
                            <a href="/login" className="text-accent hover:text-accent/80 transition-colors font-medium">
                                Giriş yapın
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};