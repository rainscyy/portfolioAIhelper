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
import { useState, useCallback, useEffect, useRef } from "react";
import { themeConfigs } from "@/components/portfolio/LivePreview";
import { Textarea } from "@/components/ui/textarea";
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
  Trash2,
  Pencil
} from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  as?: 'h1' | 'p' | 'span';
}

function EditableText({ value, onSave, className, placeholder, multiline = false, as = 'span' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn("bg-transparent border-dashed resize-none", className)}
          placeholder={placeholder}
          rows={4}
        />
      );
    }
    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn("bg-transparent border-dashed", className)}
        placeholder={placeholder}
      />
    );
  }

  const Tag = as;
  return (
    <Tag 
      className={cn("group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -mx-1 transition-colors inline-flex items-center gap-2", className)}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || <span className="opacity-50 italic">{placeholder || 'Click to add'}</span>}
      <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
    </Tag>
  );
}

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
  const [coverFocused, setCoverFocused] = useState(false);
  const [galleryFocused, setGalleryFocused] = useState(false);
  const coverZoneRef = useRef<HTMLDivElement>(null);
  const galleryZoneRef = useRef<HTMLDivElement>(null);

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

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    for (const item of imageItems) {
      const file = item.getAsFile();
      if (!file) continue;

      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please paste an image smaller than 5MB.", variant: "destructive" });
        continue;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        
        if (response.ok) {
          const data = await response.json();
          
          if (coverFocused) {
            await updateProjectMutation.mutateAsync({ imageUrl: data.url });
            toast({ title: "Cover updated", description: "Cover image has been updated." });
          } else if (galleryFocused) {
            const currentGallery: MediaItem[] = project?.mediaGallery || [];
            await updateProjectMutation.mutateAsync({ 
              mediaGallery: [...currentGallery, { id: generateId(), type: 'image', url: data.url }] 
            });
            toast({ title: "Image added", description: "Image has been added to gallery." });
          } else {
            const currentGallery: MediaItem[] = project?.mediaGallery || [];
            await updateProjectMutation.mutateAsync({ 
              mediaGallery: [...currentGallery, { id: generateId(), type: 'image', url: data.url }] 
            });
            toast({ title: "Image added", description: "Image has been added to gallery." });
          }
        } else {
          toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
      } finally {
        setUploading(false);
      }
    }
  }, [toast, updateProjectMutation, coverFocused, galleryFocused, project?.mediaGallery]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

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
  
  const theme = themeConfigs[portfolio?.colorTheme || "light"] || themeConfigs.light;
  const fontClass = portfolio?.fontStyle === "serif" ? "font-serif" : 
                    portfolio?.fontStyle === "mono" ? "font-mono" : "";
  
  const customStyles = {
    '--custom-primary': portfolio?.customPrimaryColor || undefined,
    '--custom-accent': portfolio?.customAccentColor || undefined,
  } as React.CSSProperties;

  return (
    <div 
      className={cn(
        "min-h-screen",
        theme.background,
        theme.text,
        fontClass
      )}
      style={customStyles}
    >
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={`/editor/${portfolioId}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn("backdrop-blur-sm shadow-lg", theme.cardBg, theme.cardBorder)}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="icon" className={cn("backdrop-blur-sm shadow-lg", theme.cardBg, theme.cardBorder)} data-testid="link-github">
                  <Github className="w-4 h-4" />
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="icon" className={cn("backdrop-blur-sm shadow-lg", theme.cardBg, theme.cardBorder)} data-testid="link-demo">
                  <Globe className="w-4 h-4" />
                </Button>
              </a>
            )}
            {project.linkUrl && (
              <a href={project.linkUrl} target="_blank" rel="noreferrer">
                <Button size="icon" className={cn("shadow-lg", `bg-gradient-to-r ${theme.accent} text-white`)} data-testid="link-project">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Drag & Drop */}
      <section 
        ref={coverZoneRef}
        tabIndex={0}
        className={cn(
          "relative min-h-[70vh] flex items-end transition-all duration-300 outline-none cursor-pointer",
          isDragging && cn("ring-4 ring-inset", theme.accentText.replace("text-", "ring-")),
          coverFocused && cn("ring-2 ring-inset", theme.accentText.replace("text-", "ring-"))
        )}
        onDrop={handleCoverDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFocus={() => { setCoverFocused(true); setGalleryFocused(false); }}
        onBlur={() => setCoverFocused(false)}
        onClick={() => coverZoneRef.current?.focus()}
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
            <div className={cn("absolute inset-0 bg-gradient-to-t via-transparent to-transparent", theme.isDark ? "from-gray-950" : "from-white/80")} />
          </>
        ) : (
          <div className={cn("absolute inset-0 flex items-center justify-center", theme.sectionBg)}>
            <div className={cn("text-center", theme.mutedText)}>
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Drag & drop or paste a cover image here</p>
              <p className="text-sm opacity-70 mt-1">Click to focus, then Ctrl+V / Cmd+V to paste</p>
            </div>
          </div>
        )}

        {isDragging && (
          <div className={cn("absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10", theme.accentBg)}>
            <div className={cn("text-center", theme.accentText)}>
              <Upload className="w-16 h-16 mx-auto mb-4 animate-bounce" />
              <p className="text-xl font-bold">Drop cover image here</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className={cn("absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20", theme.isDark ? "bg-gray-950/80" : "bg-white/80")}>
            <div className="text-center">
              <div className={cn("w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4", theme.accentText.replace("text-", "border-"))} />
              <p className="text-lg font-medium">Uploading...</p>
            </div>
          </div>
        )}

        {/* Title overlay */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-32">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className={cn("backdrop-blur-sm text-sm px-4 py-1.5", theme.cardBg, theme.cardBorder)}>
              <Briefcase className="w-3.5 h-3.5 mr-2" />
              <EditableText 
                value={project.role || ''} 
                onSave={(val) => updateProjectMutation.mutate({ role: val })}
                placeholder="Add role"
              />
            </Badge>
            <Badge variant="outline" className={cn("backdrop-blur-sm text-sm px-4 py-1.5", theme.cardBg, theme.cardBorder)}>
              <Calendar className="w-3.5 h-3.5 mr-2" />
              <EditableText 
                value={project.year || ''} 
                onSave={(val) => updateProjectMutation.mutate({ year: val })}
                placeholder="Add year"
              />
            </Badge>
          </div>

          <EditableText 
            value={project.title}
            onSave={(val) => updateProjectMutation.mutate({ title: val })}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none"
            placeholder="Project Title"
            as="h1"
          />
          
          <EditableText
            value={project.description || ''}
            onSave={(val) => updateProjectMutation.mutate({ description: val })}
            className={cn("text-xl md:text-2xl max-w-3xl leading-relaxed", theme.mutedText)}
            placeholder="Add a short description"
            multiline
            as="p"
          />

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {project.technologies.map((tech) => (
                <Badge 
                  key={tech} 
                  className={cn("text-sm px-4 py-1.5", theme.tagBg, theme.tagText)}
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
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", theme.accentBg)}>
                <Play className={cn("w-6 h-6", theme.accentText)} />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Video Demo
              </h2>
            </div>
            
            {videoEmbed?.type === 'youtube' ? (
              <div className={cn("aspect-video rounded-xl overflow-hidden shadow-2xl", theme.cardBg)}>
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
              <div className={cn("aspect-video rounded-xl overflow-hidden shadow-2xl", theme.cardBg)}>
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
              <Card className={cn("p-6", theme.cardBg, theme.cardBorder)}>
                <a 
                  href={project.videoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className={cn("flex items-center gap-3 text-lg", theme.accentText)}
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
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", theme.accentBg)}>
                <Image className={cn("w-6 h-6", theme.accentText)} />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Project Gallery
              </h2>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowVideoInput(true)}
              className={cn(theme.cardBg, theme.cardBorder)}
              data-testid="button-add-video"
            >
              <Play className="w-4 h-4 mr-2" />
              Add Video URL
            </Button>
          </div>

          {/* Video URL Input */}
          {showVideoInput && (
            <Card className={cn("p-4 mb-6", theme.cardBg, theme.cardBorder)}>
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
            ref={galleryZoneRef}
            tabIndex={0}
            className={cn(
              "min-h-[200px] rounded-xl border-2 border-dashed transition-all duration-300 p-6 outline-none cursor-pointer",
              galleryDragging ? cn(theme.accentBg, theme.accentText.replace("text-", "border-")) : theme.borderColor,
              galleryFocused && cn("ring-2", theme.accentText.replace("text-", "ring-")),
              mediaGallery.length === 0 && "flex items-center justify-center"
            )}
            onDrop={handleGalleryDrop}
            onDragOver={handleGalleryDragOver}
            onDragLeave={handleGalleryDragLeave}
            onFocus={() => { setGalleryFocused(true); setCoverFocused(false); }}
            onBlur={() => setGalleryFocused(false)}
            onClick={() => galleryZoneRef.current?.focus()}
            data-testid="dropzone-gallery"
          >
            {mediaGallery.length === 0 ? (
              <div className={cn("text-center", theme.mutedText)}>
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Drag & drop or paste images here</p>
                <p className="text-sm">Supports images (PNG, JPG, GIF) and YouTube/Vimeo links</p>
                <p className="text-sm opacity-70 mt-1">Click to focus, then Ctrl+V / Cmd+V to paste</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaGallery.map((item) => (
                  <div key={item.id} className={cn("relative group rounded-lg overflow-hidden", theme.cardBg, theme.cardBorder, "border")}>
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
                          <div className={cn("flex items-center justify-center h-full", theme.sectionBg)}>
                            <Play className={cn("w-8 h-8", theme.mutedText)} />
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
                  className={cn("flex items-center justify-center h-48 rounded-lg border-2 border-dashed", theme.borderColor, theme.mutedText)}
                >
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop or paste more</p>
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
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.accentBg)}>
                  <Code2 className={cn("w-5 h-5", theme.accentText)} />
                </div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  About This Project
                </h2>
              </div>
              <EditableText
                value={project.detailedDescription || ''}
                onSave={(val) => updateProjectMutation.mutate({ detailedDescription: val })}
                className={cn("text-lg leading-relaxed", theme.mutedText)}
                placeholder="Add detailed description about this project..."
                multiline
                as="p"
              />
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.accentBg)}>
                  <AlertTriangle className={cn("w-5 h-5", theme.accentText)} />
                </div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  Challenges Faced
                </h2>
              </div>
              <EditableText
                value={project.challenges || ''}
                onSave={(val) => updateProjectMutation.mutate({ challenges: val })}
                className={cn("text-lg leading-relaxed", theme.mutedText)}
                placeholder="Describe the challenges you faced..."
                multiline
                as="p"
              />
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.accentBg)}>
                  <TrendingUp className={cn("w-5 h-5", theme.accentText)} />
                </div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  Results & Impact
                </h2>
              </div>
              <EditableText
                value={project.outcome || ''}
                onSave={(val) => updateProjectMutation.mutate({ outcome: val })}
                className={cn("text-lg leading-relaxed", theme.mutedText)}
                placeholder="Describe the results and impact..."
                multiline
                as="p"
              />
            </section>
          </div>

          {/* Right Column - Highlights & Links */}
          <div className="lg:col-span-2 space-y-12">
            <section className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.accentBg)}>
                  <CheckCircle2 className={cn("w-5 h-5", theme.accentText)} />
                </div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  Key Highlights
                </h2>
              </div>
              <ul className="space-y-4">
                {(project.highlights || []).map((highlight, index) => (
                  <li key={index} className={cn("flex items-start gap-4 p-4 rounded-xl border group", theme.cardBg, theme.cardBorder)}>
                    <span className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", theme.accentBg, theme.accentText)}>
                      {index + 1}
                    </span>
                    <EditableText
                      value={highlight}
                      onSave={(val) => {
                        const newHighlights = [...(project.highlights || [])];
                        newHighlights[index] = val;
                        updateProjectMutation.mutate({ highlights: newHighlights });
                      }}
                      className="leading-relaxed flex-1"
                      placeholder="Add highlight"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => {
                        const newHighlights = (project.highlights || []).filter((_, i) => i !== index);
                        updateProjectMutation.mutate({ highlights: newHighlights });
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </li>
                ))}
                <li>
                  <Button
                    variant="outline"
                    className={cn("w-full", theme.borderColor)}
                    onClick={() => {
                      const newHighlights = [...(project.highlights || []), 'New highlight'];
                      updateProjectMutation.mutate({ highlights: newHighlights });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Quick Links
              </h3>
              <div className="space-y-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="block">
                    <Card className={cn("p-4 transition-shadow group", theme.cardBg, theme.cardBorder)}>
                      <div className="flex items-center gap-3">
                        <Github className={cn("w-5 h-5", theme.mutedText)} />
                        <span className="font-medium">View Source Code</span>
                        <ExternalLink className={cn("w-4 h-4 ml-auto", theme.mutedText)} />
                      </div>
                    </Card>
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" className="block">
                    <Card className={cn("p-4 transition-shadow group", theme.cardBg, theme.cardBorder)}>
                      <div className="flex items-center gap-3">
                        <Globe className={cn("w-5 h-5", theme.mutedText)} />
                        <span className="font-medium">Try Live Demo</span>
                        <ExternalLink className={cn("w-4 h-4 ml-auto", theme.mutedText)} />
                      </div>
                    </Card>
                  </a>
                )}
                {project.linkUrl && (
                  <a href={project.linkUrl} target="_blank" rel="noreferrer" className="block">
                    <Card className={cn("p-4 group text-white", `bg-gradient-to-r ${theme.accent}`)}>
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
      <footer className={cn("py-12 text-center border-t", theme.borderColor)}>
        <p className={theme.mutedText}>
          Part of <span className="font-semibold">{portfolio?.name}</span>'s Portfolio
        </p>
      </footer>
    </div>
  );
}
