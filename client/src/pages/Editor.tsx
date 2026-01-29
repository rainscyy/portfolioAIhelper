import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { usePortfolio, useUpdatePortfolio } from "@/hooks/use-portfolios";
import { useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LivePreview } from "@/components/portfolio/LivePreview";
import { ThemeSelector } from "@/components/portfolio/ThemeSelector";
import { ColorPicker } from "@/components/portfolio/ColorPicker";
import { ProjectForm } from "@/components/portfolio/ProjectForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2, LayoutTemplate, Palette, Share2, ExternalLink, Code2, GalleryHorizontal, BookOpen, Mic, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Project, type InsertProject, type ProjectCategory, PROJECT_CATEGORIES } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const categoryConfig: Record<ProjectCategory, { icon: typeof Code2; label: string }> = {
  project: { icon: Code2, label: "Projects" },
  exhibition: { icon: GalleryHorizontal, label: "Exhibitions" },
  publication: { icon: BookOpen, label: "Publications" },
  talk: { icon: Mic, label: "Invited Talks" },
  experience: { icon: Building2, label: "Experience" },
};

export default function Editor() {
  const [, params] = useRoute("/editor/:id");
  const [, navigate] = useLocation();
  const id = Number(params?.id);
  
  const { data: portfolio, isLoading } = usePortfolio(id);
  const updatePortfolio = useUpdatePortfolio();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("projects");
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const handleProjectClick = (projectId: number) => {
    navigate(`/portfolio/${id}/project/${projectId}`);
  };

  if (isLoading || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // === Handlers ===
  const handleUpdateTheme = (theme: string) => {
    updatePortfolio.mutate({ id, colorTheme: theme });
  };

  const handleSaveProject = async (data: InsertProject) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, portfolioId: id, ...data });
        toast({ title: "Project updated" });
      } else {
        await createProject.mutateAsync({ portfolioId: id, ...data });
        toast({ title: "Project created" });
      }
      setProjectDialogOpen(false);
      setEditingProject(null);
    } catch (e) {
      toast({ title: "Error saving project", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject.mutateAsync({ id: projectId, portfolioId: id });
      toast({ title: "Project deleted" });
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setProjectDialogOpen(true);
  };

  const handleExport = () => {
    // In a real app, this would hit the export endpoint
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied!", description: "Share your portfolio URL with the world." });
  };

  return (
    <div className="min-h-screen gradient-bg blob-bg flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar / Controls */}
        <aside className="w-full md:w-[400px] glass-card border-r flex flex-col z-10 overflow-hidden">
          <div className="p-4 border-b flex-shrink-0">
            <h2 className="font-display font-bold text-xl">Portfolio Editor</h2>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2 flex-shrink-0">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <div className="p-4 pb-20">
                <TabsContent value="projects" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Your Content</h3>
                    <Button size="sm" onClick={handleAddClick} data-testid="button-add-project">
                      <Plus className="w-4 h-4 mr-2" /> Add New
                    </Button>
                  </div>

                  {/* Group items by category */}
                  {(() => {
                    const projects = portfolio.projects || [];
                    const grouped = projects.reduce((acc, project) => {
                      const cat = (project.category || 'project') as ProjectCategory;
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(project);
                      return acc;
                    }, {} as Record<ProjectCategory, Project[]>);

                    if (projects.length === 0) {
                      return (
                        <div className="text-center py-8 border-2 border-dashed rounded-xl bg-muted/30">
                          <p className="text-muted-foreground text-sm">No content yet</p>
                          <Button variant="ghost" onClick={handleAddClick}>Add your first item</Button>
                        </div>
                      );
                    }

                    return PROJECT_CATEGORIES.map((category) => {
                      const items = grouped[category];
                      if (!items || items.length === 0) return null;

                      const config = categoryConfig[category];
                      const CategoryIcon = config.icon;

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <CategoryIcon className="w-4 h-4" />
                            {config.label} ({items.length})
                          </div>
                          <div className="space-y-2">
                            {items.map((project) => (
                              <Card key={project.id} className="group hover:border-primary/50 transition-colors" data-testid={`card-item-${project.id}`}>
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-bold text-sm truncate">{project.title}</h4>
                                      <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                      {(project.venue || project.company || project.publisher) && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {project.venue || project.company || project.publisher}
                                          {project.location && ` • ${project.location}`}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(project)} data-testid={`button-edit-${project.id}`}>
                                        <Edit className="w-4 h-4 text-primary" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)} data-testid={`button-delete-${project.id}`}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </TabsContent>

                <TabsContent value="design" className="mt-0 space-y-8">
                  <ThemeSelector 
                    currentTheme={portfolio.colorTheme || "light"} 
                    onThemeChange={handleUpdateTheme} 
                  />
                  
                  <ColorPicker
                    primaryColor={portfolio.customPrimaryColor || null}
                    accentColor={portfolio.customAccentColor || null}
                    onPrimaryChange={(color) => updatePortfolio.mutate({ id, customPrimaryColor: color })}
                    onAccentChange={(color) => updatePortfolio.mutate({ id, customAccentColor: color })}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Typography</h3>

                    <div className="grid grid-cols-3 gap-3">
                      {['sans', 'serif', 'mono'].map((font) => (
                        <Button
                          key={font}
                          variant={portfolio.fontStyle === font ? 'default' : 'outline'}
                          className={
                            font === 'serif'
                              ? 'font-serif'
                              : font === 'mono'
                              ? 'font-mono'
                              : 'font-sans'
                          }
                          onClick={() =>
                            updatePortfolio.mutate({ id, fontStyle: font })
                          }
                        >
                          {font === 'sans'
                            ? 'Modern'
                            : font === 'serif'
                            ? 'Classic'
                            : 'Code'}
                        </Button>
                      ))}
                    </div>
                  </div>

                </TabsContent>
              </div>
            </div>
          </Tabs>

          <div className="p-4 border-t bg-background">
             <Button className="w-full" size="lg" onClick={handleExport}>
               <Share2 className="w-4 h-4 mr-2" /> Publish & Share
             </Button>
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 bg-secondary/30 p-8 overflow-hidden relative">
           <div className="absolute top-4 right-4 z-20">
             <Button variant="outline" size="sm" onClick={() => window.open(`/preview/${id}`, '_blank')}>
               <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
             </Button>
           </div>
           
           <div className="h-full w-full max-w-[1200px] mx-auto shadow-2xl rounded-xl overflow-hidden bg-white">
              {/* This scales the preview to fit if needed, but for now scroll is fine */}
              <ScrollArea className="h-full">
                <LivePreview 
                  portfolio={portfolio} 
                  projects={portfolio.projects || []} 
                  onProjectClick={handleProjectClick}
                  onUpdatePortfolio={(updates) => updatePortfolio.mutate({ id, ...updates })}
                />
              </ScrollArea>
           </div>
        </main>
      </div>

      <ProjectForm 
        open={projectDialogOpen} 
        onOpenChange={setProjectDialogOpen}
        onSubmit={handleSaveProject}
        initialData={editingProject || undefined}
        isPending={createProject.isPending || updateProject.isPending}
      />
    </div>
  );
}
