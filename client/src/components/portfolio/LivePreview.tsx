import { type Portfolio, type Project, type ProjectCategory } from "@shared/schema";
import { Github, Linkedin, Globe, Mail, ExternalLink, Briefcase, Calendar, Code2, User, Sparkles, GalleryHorizontal, BookOpen, Mic, Building2, MapPin, Building, Bookmark, Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// Category configuration for display
const categoryConfig: Record<ProjectCategory, { icon: typeof Code2; label: string; plural: string }> = {
  project: { icon: Code2, label: "Project", plural: "Featured Projects" },
  exhibition: { icon: GalleryHorizontal, label: "Exhibition", plural: "Exhibitions" },
  publication: { icon: BookOpen, label: "Publication", plural: "Publications" },
  talk: { icon: Mic, label: "Talk", plural: "Invited Talks" },
  experience: { icon: Building2, label: "Experience", plural: "Professional Experience" },
};

interface ThemeConfig {
  background: string;
  text: string;
  headerBg: string;
  accent: string;
  accentBg: string;
  accentText: string;
  cardBg: string;
  cardBorder: string;
  sectionBg: string;
  tagBg: string;
  tagText: string;
  mutedText: string;
  borderColor: string;
  socialBg: string;
  socialHover: string;
  quoteMark: string;
  isDark: boolean;
}

export const themeConfigs: Record<string, ThemeConfig> = {
  light: {
    background: "bg-gradient-to-br from-[#faf8f6] via-[#ffffff] to-[#f8f6f4]",
    text: "text-[#1a1a1a]",
    headerBg: "",
    accent: "from-[#c9a5a8] to-[#d4b5b8]",
    accentBg: "bg-[#c9a5a8]/12",
    accentText: "text-[#a87f82]",
    cardBg: "bg-white",
    cardBorder: "border-[#e5e5e5]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#f5f5f5]/60 to-transparent",
    tagBg: "bg-[#c9a5a8]/12",
    tagText: "text-[#a87f82]",
    mutedText: "text-[#525252]",
    borderColor: "border-[#d4d4d4]",
    socialBg: "bg-[#1a1a1a]/8",
    socialHover: "hover:bg-[#1a1a1a]/15",
    quoteMark: "text-[#c9a5a8]",
    isDark: false,
  },
  dark: {
    background: "bg-[#0a0a0a]",
    text: "text-[#fafafa]",
    headerBg: "bg-gradient-to-b from-[#171717]/90 via-[#0a0a0a] to-[#0a0a0a]",
    accent: "from-[#b8a0c9] to-[#c9a8c0]",
    accentBg: "bg-[#b8a0c9]/15",
    accentText: "text-[#c9b0d8]",
    cardBg: "bg-[#171717]",
    cardBorder: "border-[#262626]",
    sectionBg: "bg-[#171717]/40",
    tagBg: "bg-[#262626]",
    tagText: "text-[#c9b0d8]",
    mutedText: "text-[#a3a3a3]",
    borderColor: "border-[#262626]",
    socialBg: "bg-white/12",
    socialHover: "hover:bg-white/20",
    quoteMark: "text-[#c9b0d8]",
    isDark: true,
  },
  blue: {
    background: "bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f0f9ff]",
    text: "text-[#0f172a]",
    headerBg: "",
    accent: "from-[#7a9cc9] to-[#8fb4d4]",
    accentBg: "bg-[#7a9cc9]/12",
    accentText: "text-[#6889b4]",
    cardBg: "bg-white",
    cardBorder: "border-[#dbeafe]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#eff6ff]/60 to-transparent",
    tagBg: "bg-[#7a9cc9]/12",
    tagText: "text-[#5a7a9e]",
    mutedText: "text-[#475569]",
    borderColor: "border-[#bfdbfe]",
    socialBg: "bg-[#7a9cc9]/12",
    socialHover: "hover:bg-[#7a9cc9]/20",
    quoteMark: "text-[#8fb4d4]",
    isDark: false,
  },
  minimal: {
    background: "bg-[#fafaf9]",
    text: "text-[#1c1917]",
    headerBg: "",
    accent: "from-[#9a9590] to-[#a8a4a0]",
    accentBg: "bg-[#9a9590]/12",
    accentText: "text-[#78746f]",
    cardBg: "bg-white",
    cardBorder: "border-[#e7e5e4]",
    sectionBg: "bg-[#f5f5f4]/60",
    tagBg: "bg-[#e7e5e4]",
    tagText: "text-[#78746f]",
    mutedText: "text-[#78716c]",
    borderColor: "border-[#d6d3d1]",
    socialBg: "bg-[#e7e5e4]",
    socialHover: "hover:bg-[#d6d3d1]",
    quoteMark: "text-[#a8a4a0]",
    isDark: false,
  },
  sunset: {
    background: "bg-gradient-to-br from-[#fef3e2] via-[#fff7ed] to-[#fffbf5]",
    text: "text-[#292524]",
    headerBg: "",
    accent: "from-[#d4a088] to-[#deb098]",
    accentBg: "bg-[#d4a088]/12",
    accentText: "text-[#b88070]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#fed7aa]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#ffedd5]/50 to-transparent",
    tagBg: "bg-[#d4a088]/12",
    tagText: "text-[#a07060]",
    mutedText: "text-[#78716c]",
    borderColor: "border-[#fdba74]",
    socialBg: "bg-[#d4a088]/12",
    socialHover: "hover:bg-[#d4a088]/20",
    quoteMark: "text-[#deb098]",
    isDark: false,
  },
  forest: {
    background: "bg-gradient-to-br from-[#ecfdf5] via-[#f0fdf4] to-[#f0fdfa]",
    text: "text-[#052e16]",
    headerBg: "",
    accent: "from-[#7ab5a0] to-[#8ec4b0]",
    accentBg: "bg-[#7ab5a0]/12",
    accentText: "text-[#5a9580]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#a7f3d0]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#d1fae5]/40 to-transparent",
    tagBg: "bg-[#7ab5a0]/12",
    tagText: "text-[#4a8570]",
    mutedText: "text-[#065f46]",
    borderColor: "border-[#6ee7b7]",
    socialBg: "bg-[#7ab5a0]/12",
    socialHover: "hover:bg-[#7ab5a0]/20",
    quoteMark: "text-[#8ec4b0]",
    isDark: false,
  },
  ocean: {
    background: "bg-[#0f172a]",
    text: "text-[#f1f5f9]",
    headerBg: "bg-gradient-to-b from-[#1e293b]/90 via-[#0f172a] to-[#0f172a]",
    accent: "from-[#7ab8c4] to-[#8aa4c9]",
    accentBg: "bg-[#7ab8c4]/15",
    accentText: "text-[#9acad4]",
    cardBg: "bg-[#1e293b]",
    cardBorder: "border-[#334155]",
    sectionBg: "bg-[#1e293b]/40",
    tagBg: "bg-[#334155]",
    tagText: "text-[#9acad4]",
    mutedText: "text-[#94a3b8]",
    borderColor: "border-[#334155]",
    socialBg: "bg-[#7ab8c4]/15",
    socialHover: "hover:bg-[#7ab8c4]/25",
    quoteMark: "text-[#9acad4]",
    isDark: true,
  },
  lavender: {
    background: "bg-gradient-to-br from-[#faf5ff] via-[#fdf4ff] to-[#fce7f3]",
    text: "text-[#3b0764]",
    headerBg: "",
    accent: "from-[#b8a0c9] to-[#c9a8c0]",
    accentBg: "bg-[#b8a0c9]/12",
    accentText: "text-[#9880a9]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#e9d5ff]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#f3e8ff]/40 to-transparent",
    tagBg: "bg-[#b8a0c9]/12",
    tagText: "text-[#886099]",
    mutedText: "text-[#6b21a8]",
    borderColor: "border-[#d8b4fe]",
    socialBg: "bg-[#b8a0c9]/12",
    socialHover: "hover:bg-[#b8a0c9]/20",
    quoteMark: "text-[#c9b0d8]",
    isDark: false,
  },
  noir: {
    background: "bg-[#09090b]",
    text: "text-[#fafafa]",
    headerBg: "bg-gradient-to-b from-[#18181b]/90 via-[#09090b] to-[#09090b]",
    accent: "from-[#d4b888] to-[#c9a878]",
    accentBg: "bg-[#d4b888]/15",
    accentText: "text-[#e0c898]",
    cardBg: "bg-[#18181b]",
    cardBorder: "border-[#27272a]",
    sectionBg: "bg-[#18181b]/40",
    tagBg: "bg-[#27272a]",
    tagText: "text-[#e0c898]",
    mutedText: "text-[#a1a1aa]",
    borderColor: "border-[#27272a]",
    socialBg: "bg-[#d4b888]/15",
    socialHover: "hover:bg-[#d4b888]/25",
    quoteMark: "text-[#e0c898]",
    isDark: true,
  },
  mint: {
    background: "bg-gradient-to-br from-[#ecfdf5] via-[#f0fdfa] to-[#ecfeff]",
    text: "text-[#022c22]",
    headerBg: "",
    accent: "from-[#7ac4b8] to-[#7ab8c4]",
    accentBg: "bg-[#7ac4b8]/12",
    accentText: "text-[#5aa498]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#99f6e4]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#ccfbf1]/40 to-transparent",
    tagBg: "bg-[#7ac4b8]/12",
    tagText: "text-[#4a9488]",
    mutedText: "text-[#115e59]",
    borderColor: "border-[#5eead4]",
    socialBg: "bg-[#7ac4b8]/12",
    socialHover: "hover:bg-[#7ac4b8]/20",
    quoteMark: "text-[#8ad4c8]",
    isDark: false,
  },
  pixel: {
    background: "bg-[#0f0f23]",
    text: "text-[#f0f0f0]",
    headerBg: "bg-gradient-to-b from-[#1a1a3e]/90 via-[#0f0f23] to-[#0f0f23]",
    accent: "from-[#c97088] to-[#d48098]",
    accentBg: "bg-[#c97088]/18",
    accentText: "text-[#d890a8]",
    cardBg: "bg-[#1a1a3e]",
    cardBorder: "border-[#2a2a5e]",
    sectionBg: "bg-[#1a1a3e]/50",
    tagBg: "bg-[#2a2a5e]",
    tagText: "text-[#d890a8]",
    mutedText: "text-[#9090b0]",
    borderColor: "border-[#2a2a5e]",
    socialBg: "bg-[#c97088]/18",
    socialHover: "hover:bg-[#c97088]/28",
    quoteMark: "text-[#c97088]",
    isDark: true,
  },
  watercolor: {
    background: "bg-gradient-to-br from-[#fdf2f8] via-[#f0fdf4] to-[#fefce8]",
    text: "text-[#1f2937]",
    headerBg: "",
    accent: "from-[#7ac4b8] to-[#c9a8b8]",
    accentBg: "bg-[#7ac4b8]/15",
    accentText: "text-[#5aa498]",
    cardBg: "bg-white/70",
    cardBorder: "border-[#a7f3d0]/60",
    sectionBg: "bg-gradient-to-b from-transparent via-[#d1fae5]/40 to-transparent",
    tagBg: "bg-[#7ac4b8]/15",
    tagText: "text-[#4a9488]",
    mutedText: "text-[#4b5563]",
    borderColor: "border-[#6ee7b7]",
    socialBg: "bg-[#7ac4b8]/15",
    socialHover: "hover:bg-[#7ac4b8]/25",
    quoteMark: "text-[#8ad4c8]",
    isDark: false,
  },
  dreamy: {
    background: "bg-gradient-to-br from-[#faf5ff] via-[#fdf4ff] to-[#fce7f3]",
    text: "text-[#3b0764]",
    headerBg: "",
    accent: "from-[#b8a0c9] to-[#c9a0b8]",
    accentBg: "bg-[#b8a0c9]/15",
    accentText: "text-[#9880a9]",
    cardBg: "bg-white/80",
    cardBorder: "border-[#e9d5ff]/60",
    sectionBg: "bg-gradient-to-b from-transparent via-[#f3e8ff]/50 to-transparent",
    tagBg: "bg-[#b8a0c9]/15",
    tagText: "text-[#886099]",
    mutedText: "text-[#6b21a8]",
    borderColor: "border-[#d8b4fe]",
    socialBg: "bg-[#b8a0c9]/15",
    socialHover: "hover:bg-[#b8a0c9]/25",
    quoteMark: "text-[#c9b0d8]",
    isDark: false,
  },
  business: {
    background: "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
    text: "text-[#0f172a]",
    headerBg: "",
    accent: "from-[#6a9ab4] to-[#5a8aa4]",
    accentBg: "bg-[#6a9ab4]/12",
    accentText: "text-[#5a8aa4]",
    cardBg: "bg-white",
    cardBorder: "border-[#e2e8f0]",
    sectionBg: "bg-[#f8fafc]/60",
    tagBg: "bg-[#6a9ab4]/12",
    tagText: "text-[#4a7a94]",
    mutedText: "text-[#475569]",
    borderColor: "border-[#cbd5e1]",
    socialBg: "bg-[#6a9ab4]/12",
    socialHover: "hover:bg-[#6a9ab4]/20",
    quoteMark: "text-[#7ab0c4]",
    isDark: false,
  },
  frosted: {
    background: "bg-gradient-to-br from-[#a8a29e] via-[#d6d3d1] to-[#78716c]",
    text: "text-[#1c1917]",
    headerBg: "",
    accent: "from-[#d4a088] to-[#deb098]",
    accentBg: "bg-[#d4a088]/18",
    accentText: "text-[#b48068]",
    cardBg: "bg-white/50",
    cardBorder: "border-white/40",
    sectionBg: "bg-white/25",
    tagBg: "bg-[#d4a088]/18",
    tagText: "text-[#946050]",
    mutedText: "text-[#44403c]",
    borderColor: "border-white/35",
    socialBg: "bg-white/35",
    socialHover: "hover:bg-white/50",
    quoteMark: "text-[#deb098]",
    isDark: false,
  },
  sandblue: {
    background: "bg-gradient-to-br from-[#f1f5f9] via-[#dbeafe] to-[#4a6a9e]",
    text: "text-[#0f172a]",
    headerBg: "",
    accent: "from-[#7a9cc9] to-[#6a8cb9]",
    accentBg: "bg-[#7a9cc9]/15",
    accentText: "text-[#5a7ca9]",
    cardBg: "bg-white/60",
    cardBorder: "border-[#8fb4d4]/30",
    sectionBg: "bg-white/35",
    tagBg: "bg-[#7a9cc9]/15",
    tagText: "text-[#4a6c99]",
    mutedText: "text-[#334155]",
    borderColor: "border-[#8fb4d4]/40",
    socialBg: "bg-[#7a9cc9]/15",
    socialHover: "hover:bg-[#7a9cc9]/25",
    quoteMark: "text-[#8fb4d4]",
    isDark: false,
  },
  apple: {
    background: "bg-[#f5f5f7]",
    text: "text-[#1d1d1f]",
    headerBg: "",
    accent: "from-[#6a9ec9] to-[#7aaed9]",
    accentBg: "bg-[#6a9ec9]/10",
    accentText: "text-[#5a8eb9]",
    cardBg: "bg-white",
    cardBorder: "border-[#d2d2d7]",
    sectionBg: "bg-white",
    tagBg: "bg-[#6a9ec9]/10",
    tagText: "text-[#5a8eb9]",
    mutedText: "text-[#86868b]",
    borderColor: "border-[#d2d2d7]",
    socialBg: "bg-[#f5f5f7]",
    socialHover: "hover:bg-[#e8e8ed]",
    quoteMark: "text-[#6a9ec9]",
    isDark: false,
  },
};

interface LivePreviewProps {
  portfolio: Portfolio;
  projects: Project[];
  onProjectClick?: (projectId: number) => void;
  onUpdatePortfolio?: (updates: Partial<Portfolio>) => void;
}

export function LivePreview({ portfolio, projects, onProjectClick, onUpdatePortfolio }: LivePreviewProps) {
  const { toast } = useToast();
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  
  const theme = themeConfigs[portfolio.colorTheme || "light"] || themeConfigs.light;

  const fontClass = portfolio.fontStyle === "serif" ? "font-serif" : 
                    portfolio.fontStyle === "mono" ? "font-mono" : "";

  const customPrimary = portfolio.customPrimaryColor;
  const customAccent = portfolio.customAccentColor;
  const hasCustomColors = customPrimary || customAccent;

  // Helper functions to get styles with custom color overrides
  const getAccentTextStyle = () => customPrimary ? { color: customPrimary } : {};
  const getAccentBgStyle = () => customPrimary ? { backgroundColor: `${customPrimary}20` } : {};
  const getAccentSolidBgStyle = () => customPrimary ? { backgroundColor: customPrimary } : {};
  const getAccentBorderStyle = () => customPrimary ? { borderColor: customPrimary } : {};
  const getGradientStyle = () => customPrimary && customAccent 
    ? { background: `linear-gradient(135deg, ${customPrimary}, ${customAccent})` }
    : customPrimary 
    ? { background: `linear-gradient(135deg, ${customPrimary}, ${customPrimary}cc)` }
    : {};

  const handleProfileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingProfile(false);
    
    if (!onUpdatePortfolio) return;
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please drop an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please drop an image smaller than 5MB.", variant: "destructive" });
      return;
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      
      if (response.ok) {
        const data = await response.json();
        onUpdatePortfolio({ profileImageUrl: data.url });
        toast({ title: "Profile image updated", description: "Your profile photo has been updated." });
      } else {
        toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setUploadingProfile(false);
    }
  }, [toast, onUpdatePortfolio]);

  const handleProfileFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdatePortfolio) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image smaller than 5MB.", variant: "destructive" });
      return;
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      
      if (response.ok) {
        const data = await response.json();
        onUpdatePortfolio({ profileImageUrl: data.url });
        toast({ title: "Profile image updated", description: "Your profile photo has been updated." });
      } else {
        toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setUploadingProfile(false);
    }
  }, [toast, onUpdatePortfolio]);

  return (
    <div 
      className={cn(
        "w-full h-full min-h-[900px] overflow-y-auto transition-all duration-500",
        theme.background,
        theme.text,
        fontClass
      )}
    >
      {/* Hero Section */}
      <header className={cn(
        "relative py-24 px-8 overflow-hidden",
        theme.headerBg
      )}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className={cn(
              "absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20",
              !hasCustomColors && `bg-gradient-to-br ${theme.accent}`
            )} 
            style={getGradientStyle()}
          />
          <div 
            className={cn(
              "absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-15",
              !hasCustomColors && `bg-gradient-to-br ${theme.accent}`
            )} 
            style={getGradientStyle()}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Profile Image with Upload */}
          <div 
            className={cn(
              "relative inline-block group cursor-pointer",
              isDraggingProfile && "ring-4 ring-white/50 ring-offset-4 ring-offset-transparent rounded-full"
            )}
            onDrop={handleProfileDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingProfile(true); }}
            onDragLeave={() => setIsDraggingProfile(false)}
            data-testid="dropzone-profile"
          >
            {portfolio.profileImageUrl ? (
              <>
                <div 
                  className={cn(
                    "absolute inset-0 rounded-full blur-md opacity-60",
                    !hasCustomColors && `bg-gradient-to-br ${theme.accent}`
                  )} 
                  style={getGradientStyle()}
                />
                <img 
                  src={portfolio.profileImageUrl} 
                  alt="Profile" 
                  className="relative w-36 h-36 rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
                  data-testid="img-profile"
                />
              </>
            ) : (
              <div 
                className={cn(
                  "w-36 h-36 rounded-full mx-auto flex items-center justify-center ring-4 ring-white/10",
                  !hasCustomColors && `bg-gradient-to-br ${theme.accent}`
                )}
                style={getGradientStyle()}
              >
                <User className="w-16 h-16 text-white/80" />
              </div>
            )}
            
            {/* Upload overlay */}
            {onUpdatePortfolio && (
              <label 
                className={cn(
                  "absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                  isDraggingProfile && "opacity-100"
                )}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfileFileSelect}
                  data-testid="input-profile-upload"
                />
                {uploadingProfile ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </label>
            )}
          </div>
          
          {/* Name & Tagline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" data-testid="text-name">
              {portfolio.name || "Your Name"}
            </h1>
            <p className={cn(
              "text-xl md:text-2xl max-w-2xl mx-auto",
              theme.mutedText
            )} data-testid="text-tagline">
              {portfolio.tagline || "Your professional tagline"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3 pt-2">
            {portfolio.githubUrl && (
              <a 
                href={portfolio.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={cn(
                  "p-3 rounded-full transition-all duration-300 hover:scale-110",
                  !hasCustomColors && theme.socialBg,
                  !hasCustomColors && theme.socialHover
                )}
                style={getAccentBgStyle()}
                data-testid="link-github"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a 
                href={portfolio.linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={cn(
                  "p-3 rounded-full transition-all duration-300 hover:scale-110",
                  !hasCustomColors && theme.socialBg,
                  !hasCustomColors && theme.socialHover
                )}
                style={getAccentBgStyle()}
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {portfolio.personalWebsiteUrl && (
              <a 
                href={portfolio.personalWebsiteUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={cn(
                  "p-3 rounded-full transition-all duration-300 hover:scale-110",
                  !hasCustomColors && theme.socialBg,
                  !hasCustomColors && theme.socialHover
                )}
                style={getAccentBgStyle()}
                data-testid="link-website"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
            {portfolio.email && (
              <a 
                href={`mailto:${portfolio.email}`} 
                className={cn(
                  "p-3 rounded-full transition-all duration-300 hover:scale-110",
                  !hasCustomColors && theme.socialBg,
                  !hasCustomColors && theme.socialHover
                )}
                style={getAccentBgStyle()}
                data-testid="link-email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* About Me Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className={cn("p-2 rounded-lg", !hasCustomColors && theme.accentBg)} style={getAccentBgStyle()}>
              <Sparkles className={cn("w-5 h-5", !hasCustomColors && theme.accentText)} style={getAccentTextStyle()} />
            </div>
            <h2 className="text-2xl font-bold" data-testid="heading-about">About Me</h2>
          </div>
          
          <div className={cn(
            "relative p-8 rounded-2xl border backdrop-blur-sm",
            theme.cardBg,
            theme.cardBorder,
            !theme.isDark && "shadow-lg shadow-black/5"
          )}>
            {/* Quote decoration */}
            <div 
              className={cn(
                "absolute -top-3 -left-2 text-6xl font-serif opacity-20",
                !hasCustomColors && theme.quoteMark
              )}
              style={getAccentTextStyle()}
            >
              "
            </div>
            
            <p className={cn(
              "text-lg leading-relaxed whitespace-pre-wrap",
              theme.isDark ? "text-gray-300" : "text-gray-700"
            )} data-testid="text-bio">
              {portfolio.bio || "Write a brief introduction about yourself, your background, interests, and what you're passionate about. This helps visitors connect with you on a personal level."}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections - Grouped by Category */}
      {(() => {
        // Group projects by category
        const groupedProjects = projects.reduce((acc, project) => {
          const category = (project.category || 'project') as ProjectCategory;
          if (!acc[category]) acc[category] = [];
          acc[category].push(project);
          return acc;
        }, {} as Record<ProjectCategory, Project[]>);
        
        const categoryOrder: ProjectCategory[] = ['project', 'exhibition', 'publication', 'talk', 'experience'];
        
        return categoryOrder.map((category) => {
          const categoryProjects = groupedProjects[category];
          if (!categoryProjects || categoryProjects.length === 0) return null;
          
          const config = categoryConfig[category];
          const CategoryIcon = config.icon;
          
          return (
            <section key={category} className={cn("py-20 px-8", theme.sectionBg)} data-testid={`section-${category}`}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={cn("p-2 rounded-lg", !hasCustomColors && theme.accentBg)} style={getAccentBgStyle()}>
                      <CategoryIcon className={cn("w-5 h-5", !hasCustomColors && theme.accentText)} style={getAccentTextStyle()} />
                    </div>
                    <h2 className="text-3xl font-bold" data-testid={`heading-${category}`}>{config.plural}</h2>
                  </div>
                  <p className={cn("max-w-xl mx-auto", theme.mutedText)}>
                    {category === 'project' && "A selection of projects I've worked on"}
                    {category === 'exhibition' && "Featured exhibitions and showcases"}
                    {category === 'publication' && "Published works and research"}
                    {category === 'talk' && "Talks and presentations I've given"}
                    {category === 'experience' && "Professional work experience"}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {categoryProjects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className={cn(
                        "group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border",
                        theme.cardBg,
                        theme.cardBorder,
                        !theme.isDark && "shadow-lg shadow-black/5",
                        onProjectClick && "cursor-pointer"
                      )}
                      onClick={onProjectClick ? () => onProjectClick(project.id) : undefined}
                      role={onProjectClick ? "button" : undefined}
                      tabIndex={onProjectClick ? 0 : undefined}
                      onKeyDown={onProjectClick ? (e) => e.key === "Enter" && onProjectClick(project.id) : undefined}
                      data-testid={`card-project-${project.id}`}
                    >
                  {/* Click to view details badge */}
                  {onProjectClick && (
                    <div 
                      className={cn(
                        "absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                        !hasCustomColors && theme.tagBg,
                        !hasCustomColors && theme.tagText
                      )}
                      style={{...getAccentBgStyle(), ...getAccentTextStyle()}}
                    >
                      Click for details
                    </div>
                  )}
                  
                  <div className="p-6 space-y-5">
                    {/* 1. Title */}
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-tight group-hover:opacity-80 transition-opacity" data-testid={`text-project-title-${project.id}`}>
                        {project.title}
                      </h3>
                      {project.linkUrl && (
                        <a 
                          href={project.linkUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                            !hasCustomColors && theme.accentText
                          )}
                          style={getAccentTextStyle()}
                          data-testid={`link-project-${project.id}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Project
                        </a>
                      )}
                    </div>

                    {/* 2. Information (Role, Year, Category-specific fields, Technologies) */}
                    <div className={cn(
                      "flex flex-wrap items-center gap-3 py-3 border-y",
                      theme.borderColor
                    )}>
                      {project.role && (
                        <span 
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                            !hasCustomColors && theme.tagBg,
                            !hasCustomColors && theme.tagText
                          )}
                          style={{...getAccentBgStyle(), ...getAccentTextStyle()}}
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          {project.role}
                        </span>
                      )}
                      {project.year && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          theme.isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                        )}>
                          <Calendar className="w-3.5 h-3.5" />
                          {project.year}
                        </span>
                      )}
                      {/* Category-specific fields */}
                      {project.venue && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          theme.isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                        )}>
                          <Building className="w-3.5 h-3.5" />
                          {project.venue}
                        </span>
                      )}
                      {project.publisher && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          theme.isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                        )}>
                          <Bookmark className="w-3.5 h-3.5" />
                          {project.publisher}
                        </span>
                      )}
                      {project.company && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          theme.isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                        )}>
                          <Building2 className="w-3.5 h-3.5" />
                          {project.company}
                        </span>
                      )}
                      {project.location && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          theme.isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                        )}>
                          <MapPin className="w-3.5 h-3.5" />
                          {project.location}
                        </span>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <>
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span 
                              key={tech} 
                              className={cn(
                                "text-xs px-2.5 py-1 rounded-full font-medium",
                                theme.isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className={cn("text-xs px-2 py-1 rounded-full", theme.mutedText)}>
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* 3. Description */}
                    <div className="space-y-2">
                      <p className={cn(
                        "text-sm font-semibold uppercase tracking-wider",
                        theme.mutedText
                      )}>
                        Description
                      </p>
                      <p className={cn(
                        "text-base leading-relaxed",
                        theme.isDark ? "text-gray-300" : "text-gray-700"
                      )} data-testid={`text-project-desc-${project.id}`}>
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* 4. Cover Image */}
                  {project.imageUrl ? (
                    <div className={cn("relative h-56 overflow-hidden border-t", theme.borderColor)}>
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-t opacity-30",
                        theme.isDark ? "from-gray-900 to-transparent" : "from-black/20 to-transparent"
                      )} />
                    </div>
                  ) : (
                    <div className={cn(
                      "h-40 flex items-center justify-center border-t",
                      theme.borderColor,
                      `bg-gradient-to-br ${theme.accent}`,
                      theme.isDark ? "opacity-60" : "opacity-90"
                    )}>
                      <div className="text-center text-white">
                        <Code2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <span className="text-sm font-medium opacity-70">Project {index + 1}</span>
                      </div>
                    </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        });
      })()}
      
      {/* Empty state when no content */}
      {projects.length === 0 && (
        <section className={cn("py-20 px-8", theme.sectionBg)}>
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "text-center py-16 rounded-2xl border-2 border-dashed",
              theme.borderColor,
              theme.mutedText
            )}>
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No content yet</p>
              <p className="text-sm mt-1">Add projects, exhibitions, publications, or other work to showcase</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={cn("py-12 text-center border-t", theme.borderColor, theme.mutedText)}>
        <p className="text-sm">
          © {new Date().getFullYear()} {portfolio.name || "Your Name"}. Built with <span className="font-semibold">PortfolAI</span>
        </p>
      </footer>
    </div>
  );
}
