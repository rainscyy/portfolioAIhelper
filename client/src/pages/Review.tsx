import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useCreatePortfolio } from "@/hooks/use-portfolios";
import { useCreateProject } from "@/hooks/use-projects";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InsertProject } from "@shared/schema";

export default function Review() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createPortfolio = useCreatePortfolio();
  const createProject = useCreateProject();
  
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      tagline: "",
      bio: "",
      email: "",
      linkedinUrl: "",
      githubUrl: "",
    }
  });

  useEffect(() => {
    const data = localStorage.getItem("portfolio_draft");
    if (!data) {
      setLocation("/");
      return;
    }
    const parsed = JSON.parse(data);
    setExtractedData(parsed);
    form.reset({
      name: parsed.name || "",
      tagline: parsed.tagline || "",
      bio: parsed.bio || "",
      email: parsed.email || "",
      linkedinUrl: parsed.linkedinUrl || "",
      githubUrl: parsed.githubUrl || "",
    });
  }, [setLocation, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // 1. Create Portfolio
      const portfolio = await createPortfolio.mutateAsync({
        ...data,
        templateId: "minimal",
        colorTheme: "light",
        fontStyle: "sans",
      });

      // 2. Create Projects from Extracted Data
      if (extractedData.projects && extractedData.projects.length > 0) {
        await Promise.all(extractedData.projects.map((p: any) => 
          createProject.mutateAsync({
            portfolioId: portfolio.id,
            title: p.title || "Untitled Project",
            description: p.description || "",
            role: p.role || "Developer",
            year: p.year || new Date().getFullYear().toString(),
            technologies: p.technologies || [],
            linkUrl: "",
            imageUrl: "",
          } as InsertProject & { portfolioId: number })
        ));
      }

      toast({ title: "Success!", description: "Portfolio created successfully." });
      // Clear draft
      localStorage.removeItem("portfolio_draft");
      // Go to editor
      setLocation(`/editor/${portfolio.id}`);
      
    } catch (error) {
      toast({ title: "Error", description: "Failed to create portfolio.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!extractedData) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-display font-bold">Review Your Profile</h1>
            <p className="text-muted-foreground">We extracted this from your resume. Make sure it looks right!</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input {...form.register("name")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input {...form.register("email")} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tagline (Your Professional Headline)</Label>
                  <Input {...form.register("tagline")} placeholder="e.g. Full Stack Developer | UI Designer" />
                </div>
                
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea {...form.register("bio")} className="min-h-[120px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input {...form.register("githubUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input {...form.register("linkedinUrl")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button size="lg" type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Portfolio <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
