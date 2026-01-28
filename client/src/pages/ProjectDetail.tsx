import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Project, type Portfolio } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Github, 
  Globe, 
  ExternalLink, 
  Video, 
  Calendar, 
  Briefcase, 
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Code2
} from "lucide-react";

export default function ProjectDetail() {
  const params = useParams<{ portfolioId: string; projectId: string }>();
  const portfolioId = Number(params.portfolioId);
  const projectId = Number(params.projectId);

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio & { projects: Project[] }>({
    queryKey: ['/api/portfolios', portfolioId],
  });

  const project = portfolio?.projects.find(p => p.id === projectId);

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link href={`/editor/${portfolioId}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href={`/editor/${portfolioId}`}>
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2" data-testid="link-github">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2" data-testid="link-demo">
                  <Globe className="w-4 h-4" />
                  Live Demo
                </Button>
              </a>
            )}
            {project.linkUrl && (
              <a href={project.linkUrl} target="_blank" rel="noreferrer">
                <Button size="sm" className="gap-2" data-testid="link-project">
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {project.imageUrl && (
        <div className="w-full h-[400px] relative overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
            data-testid="img-project-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className={cn("mb-12", project.imageUrl && "-mt-32 relative z-10")}>
          <div className={cn(
            "p-8 rounded-2xl",
            project.imageUrl ? "bg-white shadow-2xl" : ""
          )}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.role && (
                <Badge variant="secondary" className="gap-1.5">
                  <Briefcase className="w-3 h-3" />
                  {project.role}
                </Badge>
              )}
              {project.year && (
                <Badge variant="outline" className="gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {project.year}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-project-title">
              {project.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-project-description">
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video */}
        {project.videoUrl && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Video Demo</h2>
              </div>
              <a 
                href={project.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
                data-testid="link-video"
              >
                <ExternalLink className="w-4 h-4" />
                Watch Video Demo
              </a>
            </CardContent>
          </Card>
        )}

        {/* Detailed Description */}
        {project.detailedDescription && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">About This Project</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-detailed-description">
                {project.detailedDescription}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Key Highlights</h2>
              </div>
              <ul className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Challenges */}
        {project.challenges && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-semibold">Challenges Faced</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-challenges">
                {project.challenges}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Outcome */}
        {project.outcome && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Results & Impact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-outcome">
                {project.outcome}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Links Section */}
        <div className="flex flex-wrap gap-4 pt-8 border-t">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                View Source Code
              </Button>
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2">
                <Globe className="w-4 h-4" />
                Try Live Demo
              </Button>
            </a>
          )}
          {project.linkUrl && (
            <a href={project.linkUrl} target="_blank" rel="noreferrer">
              <Button className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Visit Project
              </Button>
            </a>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Part of {portfolio?.name}'s Portfolio</p>
      </footer>
    </div>
  );
}
