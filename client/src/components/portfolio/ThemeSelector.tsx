import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { 
    id: "light", 
    name: "Clean Light", 
    preview: "bg-white",
    accent: "bg-indigo-500",
    text: "bg-gray-300"
  },
  { 
    id: "dark", 
    name: "Modern Dark", 
    preview: "bg-gray-950",
    accent: "bg-violet-500",
    text: "bg-gray-700"
  },
  { 
    id: "blue", 
    name: "Corporate Blue", 
    preview: "bg-slate-50",
    accent: "bg-blue-500",
    text: "bg-slate-300"
  },
  { 
    id: "minimal", 
    name: "Minimalist", 
    preview: "bg-stone-50",
    accent: "bg-stone-600",
    text: "bg-stone-300"
  },
  { 
    id: "sunset", 
    name: "Warm Sunset", 
    preview: "bg-gradient-to-br from-orange-50 to-rose-50",
    accent: "bg-gradient-to-r from-orange-500 to-rose-500",
    text: "bg-orange-200"
  },
  { 
    id: "forest", 
    name: "Forest Green", 
    preview: "bg-gradient-to-br from-emerald-50 to-teal-50",
    accent: "bg-gradient-to-r from-emerald-500 to-teal-500",
    text: "bg-emerald-200"
  },
  { 
    id: "ocean", 
    name: "Ocean Deep", 
    preview: "bg-slate-900",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-500",
    text: "bg-slate-700"
  },
  { 
    id: "lavender", 
    name: "Soft Lavender", 
    preview: "bg-gradient-to-br from-purple-50 to-pink-50",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500",
    text: "bg-purple-200"
  },
  { 
    id: "noir", 
    name: "Elegant Noir", 
    preview: "bg-neutral-950",
    accent: "bg-amber-500",
    text: "bg-neutral-700"
  },
  { 
    id: "mint", 
    name: "Fresh Mint", 
    preview: "bg-gradient-to-br from-green-50 to-cyan-50",
    accent: "bg-gradient-to-r from-green-400 to-cyan-400",
    text: "bg-green-200"
  },
  { 
    id: "pixel", 
    name: "像素风 Pixel Art", 
    preview: "bg-[#1a1a2e]",
    accent: "bg-gradient-to-r from-[#e94560] to-[#ff6b6b]",
    text: "bg-[#0f3460]"
  },
  { 
    id: "watercolor", 
    name: "水彩风 Watercolor", 
    preview: "bg-gradient-to-br from-[#f0e6ef] via-[#e8f4f0] to-[#fdf2e9]",
    accent: "bg-gradient-to-r from-[#7fc8c5] to-[#f0a5a5]",
    text: "bg-[#d4e5e2]"
  },
  { 
    id: "dreamy", 
    name: "梦幻风 Dreamy", 
    preview: "bg-gradient-to-br from-[#e8d5f2] via-[#f5e6f8] to-[#fce4ec]",
    accent: "bg-gradient-to-r from-[#b794f6] to-[#f8a5c2]",
    text: "bg-[#dbb4f3]"
  },
  { 
    id: "business", 
    name: "商业风 Business", 
    preview: "bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]",
    accent: "bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]",
    text: "bg-[#cbd5e1]"
  },
  { 
    id: "frosted", 
    name: "磨砂玻璃 Frosted Glass", 
    preview: "bg-gradient-to-br from-[#b8a89a] to-[#c4b5a5]",
    accent: "bg-gradient-to-r from-[#f59e0b] to-[#ea580c]",
    text: "bg-white/40"
  },
  { 
    id: "sandblue", 
    name: "沙画蓝 Sand Blue", 
    preview: "bg-gradient-to-br from-[#e8eef5] to-[#1e40af]",
    accent: "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]",
    text: "bg-white/50"
  },
  { 
    id: "apple", 
    name: "Apple 极简风", 
    preview: "bg-[#f5f5f7]",
    accent: "bg-[#0071e3]",
    text: "bg-[#d2d2d7]"
  },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Color Theme</h3>
      <RadioGroup value={currentTheme} onValueChange={onThemeChange} className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <div key={theme.id}>
            <RadioGroupItem value={theme.id} id={theme.id} className="peer sr-only" />
            <Label
              htmlFor={theme.id}
              className={cn(
                "flex flex-col items-center justify-between rounded-xl border-2 p-3 hover-elevate cursor-pointer transition-all",
                currentTheme === theme.id ? "border-primary bg-primary/5" : "border-muted"
              )}
              data-testid={`theme-${theme.id}`}
            >
              {/* Theme Preview Card */}
              <div className={cn(
                "w-full h-20 rounded-lg mb-2 shadow-sm overflow-hidden border border-black/5",
                theme.preview
              )}>
                {/* Mini preview layout */}
                <div className="p-2 h-full flex flex-col justify-between">
                  {/* Header area */}
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-4 h-4 rounded-full", theme.accent)} />
                    <div className={cn("h-1.5 w-10 rounded-full", theme.text)} />
                  </div>
                  {/* Content area */}
                  <div className="space-y-1">
                    <div className={cn("h-1 w-full rounded-full opacity-60", theme.text)} />
                    <div className={cn("h-1 w-3/4 rounded-full opacity-40", theme.text)} />
                  </div>
                  {/* Cards area */}
                  <div className="flex gap-1">
                    <div className={cn("flex-1 h-4 rounded", theme.accent, "opacity-20")} />
                    <div className={cn("flex-1 h-4 rounded", theme.accent, "opacity-20")} />
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium">{theme.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
