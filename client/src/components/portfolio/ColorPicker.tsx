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
  { name: "Electric", primary: "#0066ff", accent: "#00aaff" },
  { name: "Hot Pink", primary: "#ff0080", accent: "#ff4da6" },
  { name: "Flame", primary: "#ff4400", accent: "#ff6b35" },
  { name: "Emerald", primary: "#00c853", accent: "#00e676" },
  { name: "Violet", primary: "#7c3aed", accent: "#a855f7" },
  { name: "Crimson", primary: "#dc2626", accent: "#ef4444" },
  { name: "Cyan", primary: "#00bcd4", accent: "#26c6da" },
  { name: "Royal", primary: "#4f46e5", accent: "#6366f1" },
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
              style={{ backgroundColor: primaryColor || '#0066ff' }}
            />
            <Input
              type="color"
              value={primaryColor || '#0066ff'}
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
              style={{ backgroundColor: accentColor || '#00aaff' }}
            />
            <Input
              type="color"
              value={accentColor || '#00aaff'}
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
