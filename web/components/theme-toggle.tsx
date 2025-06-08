import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "#context/theme-context";
import { Button } from "#components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="scale-95 rounded-full"
    >
      <IconSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IconMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Tema değiştir</span>
    </Button>
  );
} 