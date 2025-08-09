import { ModeToggle } from "@/context/theme/theme-toggle";
import { LoginForm } from "./components/LoginForm";

export function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <div className="w-full max-w-md">
                <LoginForm  />
            </div>
        </div>
    );
}