import { type Portfolio, type Project } from "@shared/schema";
import { Github, Linkedin, Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  portfolio: Portfolio;
  projects: Project[];
}

export function LivePreview({ portfolio, projects }: LivePreviewProps) {
  const isDark = portfolio.colorTheme === "dark";
  const isBlue = portfolio.colorTheme === "blue";
  const isMinimal = portfolio.colorTheme === "minimal";

  return (
    <div className={cn(
      "w-full h-full min-h-[800px] overflow-y-auto rounded-xl border shadow-2xl transition-all duration-500",
      isDark ? "bg-gray-950 text-gray-100" : 
      isBlue ? "bg-slate-50 text-slate-900" :
      isMinimal ? "bg-stone-50 text-stone-800" :
      "bg-white text-gray-900"
    )}>
      {/* Hero Section */}
      <header className={cn(
        "py-20 px-8 text-center space-y-6",
        isBlue && "bg-gradient-to-b from-blue-100 to-transparent",
        isDark && "bg-gradient-to-b from-gray-900 to-gray-950"
      )}>
        {portfolio.profileImageUrl && (
          <img 
            src={portfolio.profileImageUrl} 
            alt="Profile" 
            className="w-32 h-32 rounded-full mx-auto object-cover shadow-xl border-4 border-white/20"
          />
        )}
        
        <div className="space-y-2">
          <h1 className={cn(
            "text-5xl font-bold tracking-tight",
            portfolio.fontStyle === "serif" && "font-serif",
            portfolio.fontStyle === "mono" && "font-mono"
          )}>
            {portfolio.name}
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">{portfolio.tagline}</p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          {portfolio.githubUrl && (
            <a href={portfolio.githubUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Github className="w-6 h-6" />
            </a>
          )}
          {portfolio.linkedinUrl && (
            <a href={portfolio.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {portfolio.personalWebsiteUrl && (
            <a href={portfolio.personalWebsiteUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Globe className="w-6 h-6" />
            </a>
          )}
          {portfolio.email && (
            <a href={`mailto:${portfolio.email}`} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          )}
        </div>
      </header>

      {/* Bio Section */}
      <section className="max-w-3xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">About Me</h2>
        <p className="leading-relaxed opacity-90 whitespace-pre-wrap">
          {portfolio.bio}
        </p>
      </section>

      {/* Projects Section */}
      <section className={cn(
        "py-16 px-8",
        isDark ? "bg-white/5" : "bg-black/5"
      )}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className={cn(
                "group rounded-xl overflow-hidden transition-all hover:scale-[1.02]",
                isDark ? "bg-gray-900 border border-gray-800" : "bg-white shadow-lg"
              )}>
                {project.imageUrl && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                     <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-sm opacity-60">{project.role} • {project.year}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className={cn(
                          "text-xs px-2 py-1 rounded-md",
                          isDark ? "bg-gray-800" : "bg-gray-100"
                        )}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {project.linkUrl && (
                    <a 
                      href={project.linkUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block text-sm font-medium hover:underline text-primary"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center opacity-60 text-sm">
        <p>© {new Date().getFullYear()} {portfolio.name}. Built with PortfolAI.</p>
      </footer>
    </div>
  );
}
