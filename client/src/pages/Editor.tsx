import { useState } from "react";
import { useRoute } from "wouter";
import { usePortfolio, useUpdatePortfolio } from "@/hooks/use-portfolios";
import { useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LivePreview } from "@/components/portfolio/LivePreview";
import { ThemeSelector } from "@/components/portfolio/ThemeSelector";
import { ProjectForm } from "@/components/portfolio/ProjectForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2, LayoutTemplate, Palette, Share2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Project, type InsertProject } from "@shared/schema";

export default function Editor() {
  const [, params] = useRoute("/editor/:id");
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
    <div className="min-h-screen bg-secondary/20 flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar / Controls */}
        <aside className="w-full md:w-[400px] bg-background border-r flex flex-col z-10 shadow-xl">
          <div className="p-4 border-b">
            <h2 className="font-display font-bold text-xl">Portfolio Editor</h2>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 py-2">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 pb-20">
                <TabsContent value="projects" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Your Projects</h3>
                    <Button size="sm" onClick={handleAddClick}>
                      <Plus className="w-4 h-4 mr-2" /> Add New
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(portfolio.projects || []).map((project) => (
                      <Card key={project.id} className="group hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold">{project.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(project)}>
                                <Edit className="w-4 h-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {(portfolio.projects || []).length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed rounded-xl bg-muted/30">
                        <p className="text-muted-foreground text-sm">No projects yet</p>
                        <Button variant="link" onClick={handleAddClick}>Add your first project</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="design" className="mt-0 space-y-8">
                  <ThemeSelector 
                    currentTheme={portfolio.colorTheme || "light"} 
                    onThemeChange={handleUpdateTheme} 
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
            </ScrollArea>
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
                <LivePreview portfolio={portfolio} projects={portfolio.projects || []} />
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
