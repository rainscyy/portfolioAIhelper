import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Project, type Portfolio, type MediaItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useCallback } from "react";
import { 
  ArrowLeft, 
  Github, 
  Globe, 
  ExternalLink, 
  Calendar, 
  Briefcase, 
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Code2,
  Upload,
  Image,
  Play,
  X,
  Plus,
  Trash2
} from "lucide-react";

function extractVideoId(url: string): { type: 'youtube' | 'vimeo' | null; id: string | null } {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) return { type: 'youtube', id: youtubeMatch[1] };
  
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] };
  
  return { type: null, id: null };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function ProjectDetail() {
  const params = useParams<{ portfolioId: string; projectId: string }>();
  const portfolioId = Number(params.portfolioId);
  const projectId = Number(params.projectId);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryDragging, setGalleryDragging] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState("");

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio & { projects: Project[] }>({
    queryKey: ['/api/portfolios', portfolioId],
  });

  const project = portfolio?.projects.find(p => p.id === projectId);

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      return apiRequest('PUT', `/api/projects/${projectId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios', portfolioId] });
    }
  });

  const handleCoverDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please drop an image file for cover.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please drop an image smaller than 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      
      if (response.ok) {
        const data = await response.json();
        await updateProjectMutation.mutateAsync({ imageUrl: data.url });
        toast({ title: "Cover updated", description: "Cover image has been updated." });
      } else {
        toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [toast, updateProjectMutation]);

  const handleGalleryDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textData = e.dataTransfer.getData('text/plain');
    
    if (files.length > 0) {
      setUploading(true);
      const currentGallery: MediaItem[] = project?.mediaGallery || [];
      const newItems: MediaItem[] = [];

      for (const file of files) {
        if (file.type.startsWith("image/")) {
          if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: `${file.name} is larger than 5MB.`, variant: "destructive" });
            continue;
          }
          try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            if (response.ok) {
              const data = await response.json();
              newItems.push({ id: generateId(), type: 'image', url: data.url });
            }
          } catch (error) {
            console.error("Upload failed for", file.name);
          }
        }
      }

      if (newItems.length > 0) {
        await updateProjectMutation.mutateAsync({ mediaGallery: [...currentGallery, ...newItems] });
        toast({ title: "Media added", description: `Added ${newItems.length} item(s) to gallery.` });
      }
      setUploading(false);
    } else if (textData) {
      const videoInfo = extractVideoId(textData);
      if (videoInfo.type) {
        const currentGallery: MediaItem[] = project?.mediaGallery || [];
        await updateProjectMutation.mutateAsync({ 
          mediaGallery: [...currentGallery, { id: generateId(), type: 'embed', url: textData }] 
        });
        toast({ title: "Video added", description: "Video has been added to gallery." });
      } else {
        toast({ title: "Invalid URL", description: "Please drop a YouTube or Vimeo URL.", variant: "destructive" });
      }
    }
  }, [toast, updateProjectMutation, project?.mediaGallery]);

  const removeGalleryItem = async (itemId: string) => {
    const currentGallery: MediaItem[] = project?.mediaGallery || [];
    const newGallery = currentGallery.filter(item => item.id !== itemId);
    await updateProjectMutation.mutateAsync({ mediaGallery: newGallery });
    toast({ title: "Item removed", description: "Media item has been removed." });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleGalleryDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragging(true);
  }, []);

  const handleGalleryDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragging(false);
  }, []);

  const addVideoUrl = async () => {
    if (!videoInputUrl.trim()) return;
    
    const videoInfo = extractVideoId(videoInputUrl);
    if (!videoInfo.type) {
      toast({ title: "Invalid URL", description: "Please enter a YouTube or Vimeo URL.", variant: "destructive" });
      return;
    }

    const currentGallery: MediaItem[] = project?.mediaGallery || [];
    await updateProjectMutation.mutateAsync({ 
      mediaGallery: [...currentGallery, { id: generateId(), type: 'embed', url: videoInputUrl }] 
    });
    toast({ title: "Video added", description: "Video has been added to gallery." });
    setVideoInputUrl("");
    setShowVideoInput(false);
  };

  const videoEmbed = project?.videoUrl ? extractVideoId(project.videoUrl) : null;

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Project not found
          </h1>
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

  const mediaGallery: MediaItem[] = project.mediaGallery || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={`/editor/${portfolioId}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-card/80 backdrop-blur-sm shadow-lg border-border/50"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm shadow-lg" data-testid="link-github">
                  <Github className="w-4 h-4" />
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm shadow-lg" data-testid="link-demo">
                  <Globe className="w-4 h-4" />
                </Button>
              </a>
            )}
            {project.linkUrl && (
              <a href={project.linkUrl} target="_blank" rel="noreferrer">
                <Button size="icon" className="shadow-lg" data-testid="link-project">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Drag & Drop */}
      <section 
        className={cn(
          "relative min-h-[70vh] flex items-end transition-all duration-300",
          isDragging && "ring-4 ring-primary ring-inset"
        )}
        onDrop={handleCoverDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-testid="dropzone-cover"
      >
        {project.imageUrl ? (
          <>
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="img-project-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Drag & drop a cover image here</p>
            </div>
          </div>
        )}

        {isDragging && (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center text-primary">
              <Upload className="w-16 h-16 mx-auto mb-4 animate-bounce" />
              <p className="text-xl font-bold">Drop cover image here</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Uploading...</p>
            </div>
          </div>
        )}

        {/* Title overlay */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-32">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {project.role && (
              <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-sm px-4 py-1.5">
                <Briefcase className="w-3.5 h-3.5 mr-2" />
                {project.role}
              </Badge>
            )}
            {project.year && (
              <Badge variant="outline" className="bg-card/90 backdrop-blur-sm text-sm px-4 py-1.5">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                {project.year}
              </Badge>
            )}
          </div>

          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
            data-testid="text-project-title"
          >
            {project.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed" data-testid="text-project-description">
            {project.description}
          </p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {project.technologies.map((tech) => (
                <Badge 
                  key={tech} 
                  className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Video Embed */}
        {project.videoUrl && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Video Demo
              </h2>
            </div>
            
            {videoEmbed?.type === 'youtube' ? (
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-card">
                <iframe
                  src={`https://www.youtube.com/embed/${videoEmbed.id}`}
                  title="YouTube video"
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  data-testid="video-embed-youtube"
                />
              </div>
            ) : videoEmbed?.type === 'vimeo' ? (
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-card">
                <iframe
                  src={`https://player.vimeo.com/video/${videoEmbed.id}`}
                  title="Vimeo video"
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  data-testid="video-embed-vimeo"
                />
              </div>
            ) : (
              <Card className="p-6">
                <a 
                  href={project.videoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 text-primary text-lg"
                  data-testid="link-video"
                >
                  <ExternalLink className="w-5 h-5" />
                  Watch Video Demo
                </a>
              </Card>
            )}
          </section>
        )}

        {/* Media Gallery - Drag & Drop Zone */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Image className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Project Gallery
              </h2>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowVideoInput(true)}
              data-testid="button-add-video"
            >
              <Play className="w-4 h-4 mr-2" />
              Add Video URL
            </Button>
          </div>

          {/* Video URL Input */}
          {showVideoInput && (
            <Card className="p-4 mb-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Paste YouTube or Vimeo URL..."
                  value={videoInputUrl}
                  onChange={(e) => setVideoInputUrl(e.target.value)}
                  className="flex-1"
                  data-testid="input-video-url"
                />
                <Button onClick={addVideoUrl} data-testid="button-submit-video">
                  Add
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowVideoInput(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          <div 
            className={cn(
              "min-h-[200px] rounded-xl border-2 border-dashed transition-all duration-300 p-6",
              galleryDragging ? "border-primary bg-primary/5" : "border-border",
              mediaGallery.length === 0 && "flex items-center justify-center"
            )}
            onDrop={handleGalleryDrop}
            onDragOver={handleGalleryDragOver}
            onDragLeave={handleGalleryDragLeave}
            data-testid="dropzone-gallery"
          >
            {mediaGallery.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Drag & drop images or video URLs here</p>
                <p className="text-sm">Supports images (PNG, JPG, GIF) and YouTube/Vimeo links</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaGallery.map((item) => (
                  <div key={item.id} className="relative group rounded-lg overflow-hidden bg-card border border-border">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.caption || 'Gallery image'} 
                        className="w-full h-48 object-cover"
                        data-testid={`img-gallery-${item.id}`}
                      />
                    ) : item.type === 'embed' ? (
                      <div className="aspect-video">
                        {extractVideoId(item.url).type === 'youtube' ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractVideoId(item.url).id}`}
                            title="YouTube video"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : extractVideoId(item.url).type === 'vimeo' ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${extractVideoId(item.url).id}`}
                            title="Vimeo video"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-muted">
                            <Play className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ) : null}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {/* Add more placeholder */}
                <div 
                  className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed border-border text-muted-foreground"
                >
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop more media</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-16">
            {project.detailedDescription && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    About This Project
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-detailed-description">
                  {project.detailedDescription}
                </p>
              </section>
            )}

            {project.challenges && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    Challenges Faced
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-challenges">
                  {project.challenges}
                </p>
              </section>
            )}

            {project.outcome && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    Results & Impact
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-outcome">
                  {project.outcome}
                </p>
              </section>
            )}
          </div>

          {/* Right Column - Highlights & Links */}
          <div className="lg:col-span-2 space-y-12">
            {project.highlights && project.highlights.length > 0 && (
              <section className="sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    Key Highlights
                  </h2>
                </div>
                <ul className="space-y-4">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-foreground leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Quick Links
              </h3>
              <div className="space-y-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="block">
                    <Card className="p-4 transition-shadow group">
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">View Source Code</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                      </div>
                    </Card>
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" className="block">
                    <Card className="p-4 transition-shadow group">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Try Live Demo</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                      </div>
                    </Card>
                  </a>
                )}
                {project.linkUrl && (
                  <a href={project.linkUrl} target="_blank" rel="noreferrer" className="block">
                    <Card className="p-4 bg-primary text-primary-foreground group">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-medium">Visit Project</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-70" />
                      </div>
                    </Card>
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 text-center">
        <p className="text-muted-foreground">
          Part of <span className="font-semibold text-foreground">{portfolio?.name}</span>'s Portfolio
        </p>
      </footer>
    </div>
  );
}
