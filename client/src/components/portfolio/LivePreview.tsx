import { type Portfolio, type Project } from "@shared/schema";
import { Github, Linkedin, Globe, Mail, ExternalLink, Briefcase, Calendar, Code2, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  portfolio: Portfolio;
  projects: Project[];
}

export function LivePreview({ portfolio, projects }: LivePreviewProps) {
  const isDark = portfolio.colorTheme === "dark";
  const isBlue = portfolio.colorTheme === "blue";
  const isMinimal = portfolio.colorTheme === "minimal";

  const fontClass = portfolio.fontStyle === "serif" ? "font-serif" : 
                    portfolio.fontStyle === "mono" ? "font-mono" : "";

  const accentColor = isDark ? "from-violet-500 to-purple-600" :
                      isBlue ? "from-blue-500 to-cyan-500" :
                      isMinimal ? "from-stone-600 to-stone-700" :
                      "from-indigo-500 to-purple-500";

  const accentBg = isDark ? "bg-violet-500/10" :
                   isBlue ? "bg-blue-500/10" :
                   isMinimal ? "bg-stone-500/10" :
                   "bg-indigo-500/10";

  return (
    <div className={cn(
      "w-full h-full min-h-[900px] overflow-y-auto transition-all duration-500",
      isDark ? "bg-gray-950 text-gray-100" : 
      isBlue ? "bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 text-slate-900" :
      isMinimal ? "bg-stone-50 text-stone-800" :
      "bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 text-gray-900",
      fontClass
    )}>
      {/* Hero Section */}
      <header className={cn(
        "relative py-24 px-8 overflow-hidden",
        isDark && "bg-gradient-to-b from-gray-900/80 via-gray-950 to-gray-950"
      )}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20",
            `bg-gradient-to-br ${accentColor}`
          )} />
          <div className={cn(
            "absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-15",
            `bg-gradient-to-br ${accentColor}`
          )} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Profile Image */}
          {portfolio.profileImageUrl ? (
            <div className="relative inline-block">
              <div className={cn(
                "absolute inset-0 rounded-full blur-md opacity-60",
                `bg-gradient-to-br ${accentColor}`
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
              `bg-gradient-to-br ${accentColor}`
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
              isDark ? "text-gray-400" : "text-gray-600"
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
                  isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
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
                  isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
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
                  isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
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
                  isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
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
            <div className={cn(
              "p-2 rounded-lg",
              accentBg
            )}>
              <Sparkles className={cn(
                "w-5 h-5",
                isDark ? "text-violet-400" : isBlue ? "text-blue-500" : isMinimal ? "text-stone-600" : "text-indigo-500"
              )} />
            </div>
            <h2 className="text-2xl font-bold" data-testid="heading-about">About Me</h2>
          </div>
          
          <div className={cn(
            "relative p-8 rounded-2xl",
            isDark ? "bg-gray-900/50 border border-gray-800" : 
            "bg-white/60 backdrop-blur-sm shadow-lg shadow-black/5 border border-white/50"
          )}>
            {/* Quote decoration */}
            <div className={cn(
              "absolute -top-3 -left-2 text-6xl font-serif opacity-20",
              isDark ? "text-violet-400" : isBlue ? "text-blue-400" : "text-indigo-400"
            )}>
              "
            </div>
            
            <p className={cn(
              "text-lg leading-relaxed whitespace-pre-wrap",
              isDark ? "text-gray-300" : "text-gray-700"
            )} data-testid="text-bio">
              {portfolio.bio || "Write a brief introduction about yourself, your background, interests, and what you're passionate about. This helps visitors connect with you on a personal level."}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className={cn(
        "py-20 px-8",
        isDark ? "bg-gray-900/30" : "bg-gradient-to-b from-transparent via-gray-100/50 to-transparent"
      )}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                accentBg
              )}>
                <Code2 className={cn(
                  "w-5 h-5",
                  isDark ? "text-violet-400" : isBlue ? "text-blue-500" : isMinimal ? "text-stone-600" : "text-indigo-500"
                )} />
              </div>
              <h2 className="text-3xl font-bold" data-testid="heading-projects">Featured Projects</h2>
            </div>
            <p className={cn(
              "max-w-xl mx-auto",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              A selection of projects I've worked on
            </p>
          </div>
          
          {projects.length === 0 ? (
            <div className={cn(
              "text-center py-16 rounded-2xl border-2 border-dashed",
              isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-400"
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
                    "group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
                    isDark ? "bg-gray-900 border border-gray-800 hover:border-gray-700" : 
                    "bg-white shadow-lg shadow-black/5 hover:shadow-xl"
                  )}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="p-6 space-y-5">
                    {/* 1. Title - 标题 */}
                    <div className="space-y-1">
                      <h3 className={cn(
                        "text-2xl font-bold tracking-tight group-hover:text-primary transition-colors",
                        isDark ? "text-white" : "text-gray-900"
                      )} data-testid={`text-project-title-${project.id}`}>
                        {project.title}
                      </h3>
                      {project.linkUrl && (
                        <a 
                          href={project.linkUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                            isDark ? "text-violet-400 hover:text-violet-300" :
                            isBlue ? "text-blue-600 hover:text-blue-700" :
                            isMinimal ? "text-stone-600 hover:text-stone-800" :
                            "text-indigo-600 hover:text-indigo-700"
                          )}
                          data-testid={`link-project-${project.id}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Project
                        </a>
                      )}
                    </div>

                    {/* 2. Information - 信息 (Role, Year, Technologies) */}
                    <div className={cn(
                      "flex flex-wrap items-center gap-3 py-3 border-y",
                      isDark ? "border-gray-800" : "border-gray-100"
                    )}>
                      {project.role && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          isDark ? "bg-violet-500/15 text-violet-300" :
                          isBlue ? "bg-blue-100 text-blue-700" :
                          isMinimal ? "bg-stone-200 text-stone-700" :
                          "bg-indigo-100 text-indigo-700"
                        )}>
                          <Briefcase className="w-3.5 h-3.5" />
                          {project.role}
                        </span>
                      )}
                      {project.year && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full",
                          isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
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
                                isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              isDark ? "text-gray-500" : "text-gray-400"
                            )}>
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* 3. Description - 阐述 */}
                    <div className="space-y-2">
                      <p className={cn(
                        "text-sm font-semibold uppercase tracking-wider",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}>
                        Description
                      </p>
                      <p className={cn(
                        "text-base leading-relaxed",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )} data-testid={`text-project-desc-${project.id}`}>
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* 4. Cover Image - 封面图片 */}
                  {project.imageUrl ? (
                    <div className="relative h-56 overflow-hidden border-t border-gray-100 dark:border-gray-800">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-t opacity-30",
                        isDark ? "from-gray-900 to-transparent" : "from-black/20 to-transparent"
                      )} />
                    </div>
                  ) : (
                    <div className={cn(
                      "h-40 flex items-center justify-center border-t",
                      isDark ? "border-gray-800 bg-gradient-to-br from-gray-800/50 to-gray-900" :
                      `bg-gradient-to-br ${accentColor} opacity-90`,
                      isDark ? "" : "border-gray-100"
                    )}>
                      <div className={cn(
                        "text-center",
                        isDark ? "text-gray-500" : "text-white"
                      )}>
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
      <footer className={cn(
        "py-12 text-center border-t",
        isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"
      )}>
        <p className="text-sm">
          © {new Date().getFullYear()} {portfolio.name || "Your Name"}. Built with <span className="font-semibold">PortfolAI</span>
        </p>
      </footer>
    </div>
  );
}
