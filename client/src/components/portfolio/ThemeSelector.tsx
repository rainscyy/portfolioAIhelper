import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: "light", name: "Clean Light", bg: "bg-white", border: "border-gray-200" },
  { id: "dark", name: "Modern Dark", bg: "bg-gray-950", border: "border-gray-800" },
  { id: "blue", name: "Corporate Blue", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "minimal", name: "Minimalist", bg: "bg-stone-50", border: "border-stone-200" },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Color Theme</h3>
      <RadioGroup value={currentTheme} onValueChange={onThemeChange} className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <div key={theme.id}>
            <RadioGroupItem value={theme.id} id={theme.id} className="peer sr-only" />
            <Label
              htmlFor={theme.id}
              className={cn(
                "flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                currentTheme === theme.id ? "border-primary bg-primary/5" : "border-muted"
              )}
            >
              <div className={cn("w-full h-24 rounded-lg mb-3 shadow-sm", theme.bg, theme.border, "border")} />
              <span className="font-medium">{theme.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
