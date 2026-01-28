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

const themeConfigs: Record<string, ThemeConfig> = {
  light: {
    background: "bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30",
    text: "text-gray-900",
    headerBg: "",
    accent: "from-indigo-500 to-purple-500",
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-600",
    cardBg: "bg-white",
    cardBorder: "border-gray-100",
    sectionBg: "bg-gradient-to-b from-transparent via-gray-100/50 to-transparent",
    tagBg: "bg-indigo-100",
    tagText: "text-indigo-700",
    mutedText: "text-gray-500",
    borderColor: "border-gray-200",
    socialBg: "bg-black/5",
    socialHover: "hover:bg-black/10",
    quoteMark: "text-indigo-400",
    isDark: false,
  },
  dark: {
    background: "bg-gray-950",
    text: "text-gray-100",
    headerBg: "bg-gradient-to-b from-gray-900/80 via-gray-950 to-gray-950",
    accent: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
    cardBg: "bg-gray-900",
    cardBorder: "border-gray-800",
    sectionBg: "bg-gray-900/30",
    tagBg: "bg-gray-800",
    tagText: "text-gray-300",
    mutedText: "text-gray-400",
    borderColor: "border-gray-800",
    socialBg: "bg-white/10",
    socialHover: "hover:bg-white/20",
    quoteMark: "text-violet-400",
    isDark: true,
  },
  blue: {
    background: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20",
    text: "text-slate-900",
    headerBg: "",
    accent: "from-blue-500 to-cyan-500",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-600",
    cardBg: "bg-white",
    cardBorder: "border-blue-100",
    sectionBg: "bg-gradient-to-b from-transparent via-blue-50/50 to-transparent",
    tagBg: "bg-blue-100",
    tagText: "text-blue-700",
    mutedText: "text-slate-500",
    borderColor: "border-blue-200",
    socialBg: "bg-blue-500/10",
    socialHover: "hover:bg-blue-500/20",
    quoteMark: "text-blue-400",
    isDark: false,
  },
  minimal: {
    background: "bg-stone-50",
    text: "text-stone-800",
    headerBg: "",
    accent: "from-stone-600 to-stone-700",
    accentBg: "bg-stone-500/10",
    accentText: "text-stone-700",
    cardBg: "bg-white",
    cardBorder: "border-stone-200",
    sectionBg: "bg-stone-100/50",
    tagBg: "bg-stone-200",
    tagText: "text-stone-700",
    mutedText: "text-stone-500",
    borderColor: "border-stone-200",
    socialBg: "bg-stone-200",
    socialHover: "hover:bg-stone-300",
    quoteMark: "text-stone-400",
    isDark: false,
  },
  sunset: {
    background: "bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50",
    text: "text-orange-950",
    headerBg: "",
    accent: "from-orange-500 to-rose-500",
    accentBg: "bg-orange-500/10",
    accentText: "text-orange-600",
    cardBg: "bg-white/80",
    cardBorder: "border-orange-100",
    sectionBg: "bg-gradient-to-b from-transparent via-orange-100/30 to-transparent",
    tagBg: "bg-orange-100",
    tagText: "text-orange-700",
    mutedText: "text-orange-600/70",
    borderColor: "border-orange-200",
    socialBg: "bg-orange-500/10",
    socialHover: "hover:bg-orange-500/20",
    quoteMark: "text-orange-400",
    isDark: false,
  },
  forest: {
    background: "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50",
    text: "text-emerald-950",
    headerBg: "",
    accent: "from-emerald-500 to-teal-500",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-600",
    cardBg: "bg-white/80",
    cardBorder: "border-emerald-100",
    sectionBg: "bg-gradient-to-b from-transparent via-emerald-100/30 to-transparent",
    tagBg: "bg-emerald-100",
    tagText: "text-emerald-700",
    mutedText: "text-emerald-600/70",
    borderColor: "border-emerald-200",
    socialBg: "bg-emerald-500/10",
    socialHover: "hover:bg-emerald-500/20",
    quoteMark: "text-emerald-400",
    isDark: false,
  },
  ocean: {
    background: "bg-slate-900",
    text: "text-slate-100",
    headerBg: "bg-gradient-to-b from-slate-800/80 via-slate-900 to-slate-900",
    accent: "from-cyan-500 to-blue-500",
    accentBg: "bg-cyan-500/10",
    accentText: "text-cyan-400",
    cardBg: "bg-slate-800/80",
    cardBorder: "border-slate-700",
    sectionBg: "bg-slate-800/30",
    tagBg: "bg-slate-700",
    tagText: "text-cyan-300",
    mutedText: "text-slate-400",
    borderColor: "border-slate-700",
    socialBg: "bg-cyan-500/10",
    socialHover: "hover:bg-cyan-500/20",
    quoteMark: "text-cyan-400",
    isDark: true,
  },
  lavender: {
    background: "bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50",
    text: "text-purple-950",
    headerBg: "",
    accent: "from-purple-500 to-pink-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-600",
    cardBg: "bg-white/80",
    cardBorder: "border-purple-100",
    sectionBg: "bg-gradient-to-b from-transparent via-purple-100/30 to-transparent",
    tagBg: "bg-purple-100",
    tagText: "text-purple-700",
    mutedText: "text-purple-600/70",
    borderColor: "border-purple-200",
    socialBg: "bg-purple-500/10",
    socialHover: "hover:bg-purple-500/20",
    quoteMark: "text-purple-400",
    isDark: false,
  },
  noir: {
    background: "bg-neutral-950",
    text: "text-neutral-100",
    headerBg: "bg-gradient-to-b from-neutral-900/80 via-neutral-950 to-neutral-950",
    accent: "from-amber-500 to-yellow-500",
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    cardBg: "bg-neutral-900",
    cardBorder: "border-neutral-800",
    sectionBg: "bg-neutral-900/30",
    tagBg: "bg-neutral-800",
    tagText: "text-amber-300",
    mutedText: "text-neutral-400",
    borderColor: "border-neutral-800",
    socialBg: "bg-amber-500/10",
    socialHover: "hover:bg-amber-500/20",
    quoteMark: "text-amber-400",
    isDark: true,
  },
  mint: {
    background: "bg-gradient-to-br from-green-50 via-cyan-50 to-teal-50",
    text: "text-teal-950",
    headerBg: "",
    accent: "from-green-400 to-cyan-400",
    accentBg: "bg-green-400/10",
    accentText: "text-teal-600",
    cardBg: "bg-white/80",
    cardBorder: "border-green-100",
    sectionBg: "bg-gradient-to-b from-transparent via-green-100/30 to-transparent",
    tagBg: "bg-green-100",
    tagText: "text-teal-700",
    mutedText: "text-teal-600/70",
    borderColor: "border-green-200",
    socialBg: "bg-green-400/10",
    socialHover: "hover:bg-green-400/20",
    quoteMark: "text-green-400",
    isDark: false,
  },
};

interface LivePreviewProps {
  portfolio: Portfolio;
  projects: Project[];
}

export function LivePreview({ portfolio, projects }: LivePreviewProps) {
  const theme = themeConfigs[portfolio.colorTheme || "light"] || themeConfigs.light;

  const fontClass = portfolio.fontStyle === "serif" ? "font-serif" : 
                    portfolio.fontStyle === "mono" ? "font-mono" : "";

  return (
    <div className={cn(
      "w-full h-full min-h-[900px] overflow-y-auto transition-all duration-500",
      theme.background,
      theme.text,
      fontClass
    )}>
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
                    !theme.isDark && "shadow-lg shadow-black/5"
                  )}
                  data-testid={`card-project-${project.id}`}
                >
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
