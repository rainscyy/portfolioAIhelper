import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject, PROJECT_CATEGORIES, type ProjectCategory } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenerateDescription } from "@/hooks/use-ai";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, Upload, X, Image, Link, FileText, Sparkles, Github, Globe, Video, Plus, Trash2, Code2, GalleryHorizontal, BookOpen, Mic, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryLabels: Record<ProjectCategory, { label: string; icon: typeof Code2 }> = {
  project: { label: "Project", icon: Code2 },
  exhibition: { label: "Exhibition", icon: GalleryHorizontal },
  publication: { label: "Publication", icon: BookOpen },
  talk: { label: "Invited Talk", icon: Mic },
  experience: { label: "Professional Experience", icon: Building2 },
};

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertProject) => void;
  initialData?: InsertProject;
  isPending?: boolean;
}

export function ProjectForm({ open, onOpenChange, onSubmit, initialData, isPending }: ProjectFormProps) {
  const generateDescription = useGenerateDescription();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      category: "project",
      title: "",
      description: "",
      detailedDescription: "",
      role: "",
      year: new Date().getFullYear().toString(),
      technologies: [],
      linkUrl: "",
      githubUrl: "",
      demoUrl: "",
      videoUrl: "",
      imageUrl: "",
      highlights: [],
      challenges: "",
      outcome: "",
      venue: "",
      publisher: "",
      company: "",
      location: "",
    },
  });
  
  const selectedCategory = form.watch("category") as ProjectCategory || "project";

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setHighlights(initialData.highlights || []);
    } else {
      form.reset({
        category: "project",
        title: "",
        description: "",
        detailedDescription: "",
        role: "",
        year: new Date().getFullYear().toString(),
        technologies: [],
        linkUrl: "",
        githubUrl: "",
        demoUrl: "",
        videoUrl: "",
        imageUrl: "",
        highlights: [],
        challenges: "",
        outcome: "",
        venue: "",
        publisher: "",
        company: "",
        location: "",
      });
      setHighlights([]);
    }
  }, [initialData, form, open]);

  const handleMagicFix = async () => {
    const title = form.getValues("title");
    const notes = form.getValues("description");
    
    if (!title || !notes) return;
    
    try {
      const result = await generateDescription.mutateAsync({ projectTitle: title, roughNotes: notes });
      form.setValue("description", result.description);
    } catch (error) {
      console.error("AI generation failed");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        form.setValue("imageUrl", data.url);
        toast({ title: "Image uploaded", description: "Cover image has been uploaded successfully." });
      } else {
        const error = await response.json().catch(() => ({ message: "Upload failed" }));
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Upload failed", description: "Could not upload image. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      const updated = [...highlights, newHighlight.trim()];
      setHighlights(updated);
      form.setValue("highlights", updated);
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    const updated = highlights.filter((_, i) => i !== index);
    setHighlights(updated);
    form.setValue("highlights", updated);
  };

  const handleFormSubmit = (data: InsertProject) => {
    onSubmit({ ...data, highlights });
  };

  const imageUrl = form.watch("imageUrl");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialData ? `Edit ${categoryLabels[selectedCategory].label}` : `Add ${categoryLabels[selectedCategory].label}`}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="gap-2" data-testid="tab-basic">
                  <FileText className="w-4 h-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="media" className="gap-2" data-testid="tab-media">
                  <Image className="w-4 h-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="links" className="gap-2" data-testid="tab-links">
                  <Link className="w-4 h-4" />
                  Links
                </TabsTrigger>
                <TabsTrigger value="details" className="gap-2" data-testid="tab-details">
                  <Sparkles className="w-4 h-4" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "project"}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_CATEGORIES.map((cat) => {
                            const CategoryIcon = categoryLabels[cat].icon;
                            return (
                              <SelectItem key={cat} value={cat} data-testid={`option-${cat}`}>
                                <div className="flex items-center gap-2">
                                  <CategoryIcon className="w-4 h-4" />
                                  {categoryLabels[cat].label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{selectedCategory === 'experience' ? 'Position Title' : selectedCategory === 'publication' ? 'Publication Title' : selectedCategory === 'talk' ? 'Talk Title' : selectedCategory === 'exhibition' ? 'Exhibition Title' : 'Project Title'} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={selectedCategory === 'experience' ? 'e.g. Software Engineer' : selectedCategory === 'publication' ? 'e.g. Machine Learning Paper' : selectedCategory === 'talk' ? 'e.g. Keynote Speech' : selectedCategory === 'exhibition' ? 'e.g. Art Show' : 'e.g. E-commerce Dashboard'} 
                            {...field} 
                            data-testid="input-title" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" {...field} value={field.value || ""} data-testid="input-year" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category-specific fields */}
                {(selectedCategory === 'exhibition' || selectedCategory === 'talk') && (
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{selectedCategory === 'talk' ? 'Conference/Event' : 'Venue'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={selectedCategory === 'talk' ? 'e.g. TEDx, Academic Conference' : 'e.g. Gallery Name, Museum'} 
                            {...field} 
                            value={field.value || ""} 
                            data-testid="input-venue" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedCategory === 'publication' && (
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher/Journal</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. IEEE, Nature, O'Reilly" {...field} value={field.value || ""} data-testid="input-publisher" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedCategory === 'experience' && (
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company/Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Google, Startup Inc." {...field} value={field.value || ""} data-testid="input-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(selectedCategory === 'exhibition' || selectedCategory === 'talk' || selectedCategory === 'experience') && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. New York, NY" {...field} value={field.value || ""} data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Lead Developer" {...field} value={field.value || ""} data-testid="input-role" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel>Short Description</FormLabel>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary h-8 gap-2"
                          onClick={handleMagicFix}
                          disabled={generateDescription.isPending}
                          data-testid="button-enhance-ai"
                        >
                          {generateDescription.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                          Enhance with AI
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief overview of the project (shown in cards)..." 
                          className="min-h-[100px]" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma-separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, Node.js, PostgreSQL" 
                          value={field.value?.join(", ") || ""} 
                          onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                          data-testid="input-technologies"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <FormLabel>Cover Image</FormLabel>
                  
                  {imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border">
                      <img 
                        src={imageUrl} 
                        alt="Project cover" 
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => form.setValue("imageUrl", "")}
                        data-testid="button-remove-image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                        "hover:border-primary hover:bg-primary/5"
                      )}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="upload-cover-image"
                    >
                      {uploading ? (
                        <Loader2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground animate-spin" />
                      ) : (
                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      )}
                      <p className="font-medium">Click to upload cover image</p>
                      <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  <div className="text-sm text-muted-foreground">Or paste image URL:</div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="https://..." {...field} value={field.value || ""} data-testid="input-image-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video Demo URL (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="YouTube or Loom link..." {...field} value={field.value || ""} data-testid="input-video-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Links Tab */}
              <TabsContent value="links" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Main Project URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://myproject.com" {...field} value={field.value || ""} data-testid="input-link-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Repository
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/..." {...field} value={field.value || ""} data-testid="input-github-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Live Demo URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://demo.myproject.com" {...field} value={field.value || ""} data-testid="input-demo-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="detailedDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description (for detail page)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed explanation of the project, its goals, and implementation..." 
                          className="min-h-[120px]" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-detailed-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Highlights */}
                <div className="space-y-3">
                  <FormLabel>Key Highlights / Features</FormLabel>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a key achievement or feature..."
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                      data-testid="input-new-highlight"
                    />
                    <Button type="button" size="icon" onClick={addHighlight} data-testid="button-add-highlight">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {highlights.length > 0 && (
                    <ul className="space-y-2">
                      {highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <span className="flex-1 text-sm">{h}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removeHighlight(i)}
                            data-testid={`button-remove-highlight-${i}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenges Faced</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What challenges did you overcome?" 
                          className="min-h-[80px]" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-challenges"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Results / Impact</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What was the outcome or impact of the project?" 
                          className="min-h-[80px]" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-outcome"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-submit">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {initialData ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
