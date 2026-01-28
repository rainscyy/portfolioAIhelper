import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, RotateCcw } from "lucide-react";

interface ColorPickerProps {
  primaryColor: string | null;
  accentColor: string | null;
  onPrimaryChange: (color: string | null) => void;
  onAccentChange: (color: string | null) => void;
}

const presetColors = [
  { name: "Blue", primary: "#0071e3", accent: "#0ea5e9" },
  { name: "Pink", primary: "#ec4899", accent: "#f472b6" },
  { name: "Orange", primary: "#f59e0b", accent: "#ea580c" },
  { name: "Green", primary: "#10b981", accent: "#34d399" },
  { name: "Purple", primary: "#8b5cf6", accent: "#a78bfa" },
  { name: "Red", primary: "#ef4444", accent: "#f87171" },
  { name: "Teal", primary: "#14b8a6", accent: "#2dd4bf" },
  { name: "Indigo", primary: "#6366f1", accent: "#818cf8" },
];

export function ColorPicker({ primaryColor, accentColor, onPrimaryChange, onAccentChange }: ColorPickerProps) {
  const handleReset = () => {
    onPrimaryChange(null);
    onAccentChange(null);
  };

  const handlePresetClick = (preset: typeof presetColors[0]) => {
    onPrimaryChange(preset.primary);
    onAccentChange(preset.accent);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Custom Colors
        </h3>
        <Button variant="ghost" size="sm" onClick={handleReset} data-testid="button-reset-colors">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Customize your portfolio colors or choose from presets
      </p>

      {/* Preset Colors */}
      <div className="grid grid-cols-4 gap-2">
        {presetColors.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover-elevate border border-border transition-all"
            data-testid={`preset-${preset.name.toLowerCase()}`}
          >
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded-full border border-black/10" 
                style={{ backgroundColor: preset.primary }}
              />
              <div 
                className="w-4 h-4 rounded-full border border-black/10" 
                style={{ backgroundColor: preset.accent }}
              />
            </div>
            <span className="text-xs">{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Primary Color</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded-lg border border-border shadow-sm flex-shrink-0"
              style={{ backgroundColor: primaryColor || '#0071e3' }}
            />
            <Input
              type="color"
              value={primaryColor || '#0071e3'}
              onChange={(e) => onPrimaryChange(e.target.value)}
              className="h-10 w-full cursor-pointer"
              data-testid="input-primary-color"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Accent Color</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded-lg border border-border shadow-sm flex-shrink-0"
              style={{ backgroundColor: accentColor || '#0ea5e9' }}
            />
            <Input
              type="color"
              value={accentColor || '#0ea5e9'}
              onChange={(e) => onAccentChange(e.target.value)}
              className="h-10 w-full cursor-pointer"
              data-testid="input-accent-color"
            />
          </div>
        </div>
      </div>

      {(primaryColor || accentColor) && (
        <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          Custom colors will override theme defaults for accent elements.
        </div>
      )}
    </div>
  );
}
