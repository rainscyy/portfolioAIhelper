import { type Portfolio, type Project } from "@shared/schema";
import { Github, Linkedin, Globe, Mail, ExternalLink, Briefcase, Calendar, Code2, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
    accent: "from-[#e11d48] to-[#f43f5e]",
    accentBg: "bg-[#e11d48]/12",
    accentText: "text-[#e11d48]",
    cardBg: "bg-white",
    cardBorder: "border-[#e5e5e5]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#f5f5f5]/60 to-transparent",
    tagBg: "bg-[#e11d48]/12",
    tagText: "text-[#e11d48]",
    mutedText: "text-[#525252]",
    borderColor: "border-[#d4d4d4]",
    socialBg: "bg-[#1a1a1a]/8",
    socialHover: "hover:bg-[#1a1a1a]/15",
    quoteMark: "text-[#e11d48]",
    isDark: false,
  },
  dark: {
    background: "bg-[#0a0a0a]",
    text: "text-[#fafafa]",
    headerBg: "bg-gradient-to-b from-[#171717]/90 via-[#0a0a0a] to-[#0a0a0a]",
    accent: "from-[#a855f7] to-[#d946ef]",
    accentBg: "bg-[#a855f7]/15",
    accentText: "text-[#c084fc]",
    cardBg: "bg-[#171717]",
    cardBorder: "border-[#262626]",
    sectionBg: "bg-[#171717]/40",
    tagBg: "bg-[#262626]",
    tagText: "text-[#c084fc]",
    mutedText: "text-[#a3a3a3]",
    borderColor: "border-[#262626]",
    socialBg: "bg-white/12",
    socialHover: "hover:bg-white/20",
    quoteMark: "text-[#c084fc]",
    isDark: true,
  },
  blue: {
    background: "bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f0f9ff]",
    text: "text-[#0f172a]",
    headerBg: "",
    accent: "from-[#2563eb] to-[#0ea5e9]",
    accentBg: "bg-[#2563eb]/12",
    accentText: "text-[#2563eb]",
    cardBg: "bg-white",
    cardBorder: "border-[#dbeafe]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#eff6ff]/60 to-transparent",
    tagBg: "bg-[#2563eb]/12",
    tagText: "text-[#1d4ed8]",
    mutedText: "text-[#475569]",
    borderColor: "border-[#bfdbfe]",
    socialBg: "bg-[#2563eb]/12",
    socialHover: "hover:bg-[#2563eb]/20",
    quoteMark: "text-[#3b82f6]",
    isDark: false,
  },
  minimal: {
    background: "bg-[#fafaf9]",
    text: "text-[#1c1917]",
    headerBg: "",
    accent: "from-[#44403c] to-[#57534e]",
    accentBg: "bg-[#44403c]/12",
    accentText: "text-[#44403c]",
    cardBg: "bg-white",
    cardBorder: "border-[#e7e5e4]",
    sectionBg: "bg-[#f5f5f4]/60",
    tagBg: "bg-[#e7e5e4]",
    tagText: "text-[#44403c]",
    mutedText: "text-[#78716c]",
    borderColor: "border-[#d6d3d1]",
    socialBg: "bg-[#e7e5e4]",
    socialHover: "hover:bg-[#d6d3d1]",
    quoteMark: "text-[#57534e]",
    isDark: false,
  },
  sunset: {
    background: "bg-gradient-to-br from-[#fef3e2] via-[#fff7ed] to-[#fffbf5]",
    text: "text-[#292524]",
    headerBg: "",
    accent: "from-[#ea580c] to-[#f97316]",
    accentBg: "bg-[#ea580c]/12",
    accentText: "text-[#ea580c]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#fed7aa]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#ffedd5]/50 to-transparent",
    tagBg: "bg-[#ea580c]/12",
    tagText: "text-[#c2410c]",
    mutedText: "text-[#78716c]",
    borderColor: "border-[#fdba74]",
    socialBg: "bg-[#ea580c]/12",
    socialHover: "hover:bg-[#ea580c]/20",
    quoteMark: "text-[#f97316]",
    isDark: false,
  },
  forest: {
    background: "bg-gradient-to-br from-[#ecfdf5] via-[#f0fdf4] to-[#f0fdfa]",
    text: "text-[#052e16]",
    headerBg: "",
    accent: "from-[#059669] to-[#10b981]",
    accentBg: "bg-[#059669]/12",
    accentText: "text-[#059669]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#a7f3d0]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#d1fae5]/40 to-transparent",
    tagBg: "bg-[#059669]/12",
    tagText: "text-[#047857]",
    mutedText: "text-[#065f46]",
    borderColor: "border-[#6ee7b7]",
    socialBg: "bg-[#059669]/12",
    socialHover: "hover:bg-[#059669]/20",
    quoteMark: "text-[#10b981]",
    isDark: false,
  },
  ocean: {
    background: "bg-[#0f172a]",
    text: "text-[#f1f5f9]",
    headerBg: "bg-gradient-to-b from-[#1e293b]/90 via-[#0f172a] to-[#0f172a]",
    accent: "from-[#06b6d4] to-[#3b82f6]",
    accentBg: "bg-[#06b6d4]/15",
    accentText: "text-[#22d3ee]",
    cardBg: "bg-[#1e293b]",
    cardBorder: "border-[#334155]",
    sectionBg: "bg-[#1e293b]/40",
    tagBg: "bg-[#334155]",
    tagText: "text-[#22d3ee]",
    mutedText: "text-[#94a3b8]",
    borderColor: "border-[#334155]",
    socialBg: "bg-[#06b6d4]/15",
    socialHover: "hover:bg-[#06b6d4]/25",
    quoteMark: "text-[#22d3ee]",
    isDark: true,
  },
  lavender: {
    background: "bg-gradient-to-br from-[#faf5ff] via-[#fdf4ff] to-[#fce7f3]",
    text: "text-[#3b0764]",
    headerBg: "",
    accent: "from-[#9333ea] to-[#ec4899]",
    accentBg: "bg-[#9333ea]/12",
    accentText: "text-[#9333ea]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#e9d5ff]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#f3e8ff]/40 to-transparent",
    tagBg: "bg-[#9333ea]/12",
    tagText: "text-[#7c3aed]",
    mutedText: "text-[#6b21a8]",
    borderColor: "border-[#d8b4fe]",
    socialBg: "bg-[#9333ea]/12",
    socialHover: "hover:bg-[#9333ea]/20",
    quoteMark: "text-[#a855f7]",
    isDark: false,
  },
  noir: {
    background: "bg-[#09090b]",
    text: "text-[#fafafa]",
    headerBg: "bg-gradient-to-b from-[#18181b]/90 via-[#09090b] to-[#09090b]",
    accent: "from-[#f59e0b] to-[#eab308]",
    accentBg: "bg-[#f59e0b]/15",
    accentText: "text-[#fbbf24]",
    cardBg: "bg-[#18181b]",
    cardBorder: "border-[#27272a]",
    sectionBg: "bg-[#18181b]/40",
    tagBg: "bg-[#27272a]",
    tagText: "text-[#fbbf24]",
    mutedText: "text-[#a1a1aa]",
    borderColor: "border-[#27272a]",
    socialBg: "bg-[#f59e0b]/15",
    socialHover: "hover:bg-[#f59e0b]/25",
    quoteMark: "text-[#fbbf24]",
    isDark: true,
  },
  mint: {
    background: "bg-gradient-to-br from-[#ecfdf5] via-[#f0fdfa] to-[#ecfeff]",
    text: "text-[#022c22]",
    headerBg: "",
    accent: "from-[#14b8a6] to-[#06b6d4]",
    accentBg: "bg-[#14b8a6]/12",
    accentText: "text-[#0d9488]",
    cardBg: "bg-white/90",
    cardBorder: "border-[#99f6e4]",
    sectionBg: "bg-gradient-to-b from-transparent via-[#ccfbf1]/40 to-transparent",
    tagBg: "bg-[#14b8a6]/12",
    tagText: "text-[#0f766e]",
    mutedText: "text-[#115e59]",
    borderColor: "border-[#5eead4]",
    socialBg: "bg-[#14b8a6]/12",
    socialHover: "hover:bg-[#14b8a6]/20",
    quoteMark: "text-[#2dd4bf]",
    isDark: false,
  },
  pixel: {
    background: "bg-[#0f0f23]",
    text: "text-[#f0f0f0]",
    headerBg: "bg-gradient-to-b from-[#1a1a3e]/90 via-[#0f0f23] to-[#0f0f23]",
    accent: "from-[#ff0055] to-[#ff4488]",
    accentBg: "bg-[#ff0055]/18",
    accentText: "text-[#ff4488]",
    cardBg: "bg-[#1a1a3e]",
    cardBorder: "border-[#2a2a5e]",
    sectionBg: "bg-[#1a1a3e]/50",
    tagBg: "bg-[#2a2a5e]",
    tagText: "text-[#ff4488]",
    mutedText: "text-[#9090b0]",
    borderColor: "border-[#2a2a5e]",
    socialBg: "bg-[#ff0055]/18",
    socialHover: "hover:bg-[#ff0055]/28",
    quoteMark: "text-[#ff0055]",
    isDark: true,
  },
  watercolor: {
    background: "bg-gradient-to-br from-[#fdf2f8] via-[#f0fdf4] to-[#fefce8]",
    text: "text-[#1f2937]",
    headerBg: "",
    accent: "from-[#14b8a6] to-[#f472b6]",
    accentBg: "bg-[#14b8a6]/15",
    accentText: "text-[#0d9488]",
    cardBg: "bg-white/70",
    cardBorder: "border-[#a7f3d0]/60",
    sectionBg: "bg-gradient-to-b from-transparent via-[#d1fae5]/40 to-transparent",
    tagBg: "bg-[#14b8a6]/15",
    tagText: "text-[#0f766e]",
    mutedText: "text-[#4b5563]",
    borderColor: "border-[#6ee7b7]",
    socialBg: "bg-[#14b8a6]/15",
    socialHover: "hover:bg-[#14b8a6]/25",
    quoteMark: "text-[#2dd4bf]",
    isDark: false,
  },
  dreamy: {
    background: "bg-gradient-to-br from-[#faf5ff] via-[#fdf4ff] to-[#fce7f3]",
    text: "text-[#3b0764]",
    headerBg: "",
    accent: "from-[#a855f7] to-[#ec4899]",
    accentBg: "bg-[#a855f7]/15",
    accentText: "text-[#9333ea]",
    cardBg: "bg-white/80",
    cardBorder: "border-[#e9d5ff]/60",
    sectionBg: "bg-gradient-to-b from-transparent via-[#f3e8ff]/50 to-transparent",
    tagBg: "bg-[#a855f7]/15",
    tagText: "text-[#7c3aed]",
    mutedText: "text-[#6b21a8]",
    borderColor: "border-[#d8b4fe]",
    socialBg: "bg-[#a855f7]/15",
    socialHover: "hover:bg-[#a855f7]/25",
    quoteMark: "text-[#c084fc]",
    isDark: false,
  },
  business: {
    background: "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
    text: "text-[#0f172a]",
    headerBg: "",
    accent: "from-[#0284c7] to-[#0369a1]",
    accentBg: "bg-[#0284c7]/12",
    accentText: "text-[#0284c7]",
    cardBg: "bg-white",
    cardBorder: "border-[#e2e8f0]",
    sectionBg: "bg-[#f8fafc]/60",
    tagBg: "bg-[#0284c7]/12",
    tagText: "text-[#0369a1]",
    mutedText: "text-[#475569]",
    borderColor: "border-[#cbd5e1]",
    socialBg: "bg-[#0284c7]/12",
    socialHover: "hover:bg-[#0284c7]/20",
    quoteMark: "text-[#0ea5e9]",
    isDark: false,
  },
  frosted: {
    background: "bg-gradient-to-br from-[#a8a29e] via-[#d6d3d1] to-[#78716c]",
    text: "text-[#1c1917]",
    headerBg: "",
    accent: "from-[#ea580c] to-[#f97316]",
    accentBg: "bg-[#ea580c]/18",
    accentText: "text-[#c2410c]",
    cardBg: "bg-white/50",
    cardBorder: "border-white/40",
    sectionBg: "bg-white/25",
    tagBg: "bg-[#ea580c]/18",
    tagText: "text-[#9a3412]",
    mutedText: "text-[#44403c]",
    borderColor: "border-white/35",
    socialBg: "bg-white/35",
    socialHover: "hover:bg-white/50",
    quoteMark: "text-[#f97316]",
    isDark: false,
  },
  sandblue: {
    background: "bg-gradient-to-br from-[#f1f5f9] via-[#dbeafe] to-[#1e40af]",
    text: "text-[#0f172a]",
    headerBg: "",
    accent: "from-[#2563eb] to-[#1d4ed8]",
    accentBg: "bg-[#2563eb]/15",
    accentText: "text-[#1d4ed8]",
    cardBg: "bg-white/60",
    cardBorder: "border-[#3b82f6]/30",
    sectionBg: "bg-white/35",
    tagBg: "bg-[#2563eb]/15",
    tagText: "text-[#1e40af]",
    mutedText: "text-[#334155]",
    borderColor: "border-[#3b82f6]/40",
    socialBg: "bg-[#2563eb]/15",
    socialHover: "hover:bg-[#2563eb]/25",
    quoteMark: "text-[#3b82f6]",
    isDark: false,
  },
  apple: {
    background: "bg-[#f5f5f7]",
    text: "text-[#1d1d1f]",
    headerBg: "",
    accent: "from-[#0071e3] to-[#007aff]",
    accentBg: "bg-[#0071e3]/10",
    accentText: "text-[#0071e3]",
    cardBg: "bg-white",
    cardBorder: "border-[#d2d2d7]",
    sectionBg: "bg-white",
    tagBg: "bg-[#0071e3]/10",
    tagText: "text-[#0071e3]",
    mutedText: "text-[#86868b]",
    borderColor: "border-[#d2d2d7]",
    socialBg: "bg-[#f5f5f7]",
    socialHover: "hover:bg-[#e8e8ed]",
    quoteMark: "text-[#0071e3]",
    isDark: false,
  },
};

interface LivePreviewProps {
  portfolio: Portfolio;
  projects: Project[];
  onProjectClick?: (projectId: number) => void;
}

export function LivePreview({ portfolio, projects, onProjectClick }: LivePreviewProps) {
  const theme = themeConfigs[portfolio.colorTheme || "light"] || themeConfigs.light;

  const fontClass = portfolio.fontStyle === "serif" ? "font-serif" : 
                    portfolio.fontStyle === "mono" ? "font-mono" : "";

  const customStyles = {
    '--custom-primary': portfolio.customPrimaryColor || undefined,
    '--custom-accent': portfolio.customAccentColor || undefined,
  } as React.CSSProperties;

  const hasCustomColors = portfolio.customPrimaryColor || portfolio.customAccentColor;

  return (
    <div 
      className={cn(
        "w-full h-full min-h-[900px] overflow-y-auto transition-all duration-500",
        theme.background,
        theme.text,
        fontClass
      )}
      style={customStyles}
    >
      {/* Hero Section */}
      <header className={cn(
        "relative py-24 px-8 overflow-hidden",
        theme.headerBg
      )}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20",
            `bg-gradient-to-br ${theme.accent}`
          )} />
          <div className={cn(
            "absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-15",
            `bg-gradient-to-br ${theme.accent}`
          )} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Profile Image */}
          {portfolio.profileImageUrl ? (
            <div className="relative inline-block">
              <div className={cn(
                "absolute inset-0 rounded-full blur-md opacity-60",
                `bg-gradient-to-br ${theme.accent}`
              )} />
              <img 
                src={portfolio.profileImageUrl} 
                alt="Profile" 
                className="relative w-36 h-36 rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
                data-testid="img-profile"
              />
            </div>
          ) : (
            <div className={cn(
              "w-36 h-36 rounded-full mx-auto flex items-center justify-center ring-4 ring-white/10",
              `bg-gradient-to-br ${theme.accent}`
            )}>
              <User className="w-16 h-16 text-white/80" />
            </div>
          )}
          
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
                  theme.socialBg,
                  theme.socialHover
                )}
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
                  theme.socialBg,
                  theme.socialHover
                )}
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
                  theme.socialBg,
                  theme.socialHover
                )}
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
                  theme.socialBg,
                  theme.socialHover
                )}
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
            <div className={cn("p-2 rounded-lg", theme.accentBg)}>
              <Sparkles className={cn("w-5 h-5", theme.accentText)} />
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
            <div className={cn(
              "absolute -top-3 -left-2 text-6xl font-serif opacity-20",
              theme.quoteMark
            )}>
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

      {/* Projects Section */}
      <section className={cn("py-20 px-8", theme.sectionBg)}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", theme.accentBg)}>
                <Code2 className={cn("w-5 h-5", theme.accentText)} />
              </div>
              <h2 className="text-3xl font-bold" data-testid="heading-projects">Featured Projects</h2>
            </div>
            <p className={cn("max-w-xl mx-auto", theme.mutedText)}>
              A selection of projects I've worked on
            </p>
          </div>
          
          {projects.length === 0 ? (
            <div className={cn(
              "text-center py-16 rounded-2xl border-2 border-dashed",
              theme.borderColor,
              theme.mutedText
            )}>
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No projects yet</p>
              <p className="text-sm mt-1">Add your first project to showcase your work</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project, index) => (
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
                    <div className={cn(
                      "absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                      theme.tagBg,
                      theme.tagText
                    )}>
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
                            theme.accentText
                          )}
                          data-testid={`link-project-${project.id}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Project
                        </a>
                      )}
                    </div>

                    {/* 2. Information (Role, Year, Technologies) */}
                    <div className={cn(
                      "flex flex-wrap items-center gap-3 py-3 border-y",
                      theme.borderColor
                    )}>
                      {project.role && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          theme.tagBg,
                          theme.tagText
                        )}>
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
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={cn("py-12 text-center border-t", theme.borderColor, theme.mutedText)}>
        <p className="text-sm">
          © {new Date().getFullYear()} {portfolio.name || "Your Name"}. Built with <span className="font-semibold">PortfolAI</span>
        </p>
      </footer>
    </div>
  );
}
