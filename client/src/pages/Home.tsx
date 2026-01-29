import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadFile } from "@/hooks/use-upload";
import { useExtractData } from "@/hooks/use-ai";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Github, Linkedin, ArrowRight, Sparkles, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Context to pass data to next page - in a real app use Context/Redux
// For now we'll pass via route state if Wouter supported it, but we'll use localStorage for this simple flow
export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const uploadFile = useUploadFile();
  const extractData = useExtractData();
  
  const [file, setFile] = useState<File | null>(null);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const handlePreviewDemo = async () => {
    setIsCreatingDemo(true);
    try {
      const res = await apiRequest('POST', '/api/portfolios', {
        name: "Alex Chen",
        bio: "Full-stack developer with 3+ years of experience building web applications. Passionate about creating intuitive user experiences and scalable backend systems. Currently exploring AI/ML integration in modern web apps.",
        skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "GraphQL"],
        githubUrl: "https://github.com/alexchen",
        linkedinUrl: "https://linkedin.com/in/alexchen",
        email: "alex@example.com",
        colorTheme: "dreamy",
        fontStyle: "sans",
      });
      const demoPortfolio = await res.json();

      const portfolioId = demoPortfolio.id;

      await Promise.all([
        // Projects
        apiRequest('POST', `/api/portfolios/${portfolioId}/projects`, {
          title: "E-Commerce Platform",
          description: "A full-featured online marketplace with real-time inventory, secure payments, and AI-powered recommendations. Built with React, Node.js, and PostgreSQL.",
          technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
          demoUrl: "https://demo.example.com",
          githubUrl: "https://github.com/alexchen/ecommerce",
          category: "project",
        }),
        apiRequest('POST', `/api/portfolios/${portfolioId}/projects`, {
          title: "AI Chat Assistant",
          description: "An intelligent conversational agent powered by GPT-4, featuring context-aware responses, multi-language support, and seamless integration with enterprise tools.",
          technologies: ["Python", "OpenAI", "FastAPI", "React", "WebSocket"],
          demoUrl: "https://chat.example.com",
          category: "project",
        }),
        // Exhibition
        apiRequest('POST', `/api/portfolios/${portfolioId}/projects`, {
          title: "Digital Horizons",
          description: "An interactive art installation exploring the intersection of technology and human creativity. Featured generative algorithms creating real-time visual experiences.",
          category: "exhibition",
          venue: "Modern Art Museum",
          location: "San Francisco, CA",
          year: "2024",
          role: "Lead Artist",
        }),
        // Publication
        apiRequest('POST', `/api/portfolios/${portfolioId}/projects`, {
          title: "Building Scalable AI Systems",
          description: "A comprehensive guide to designing and implementing production-ready machine learning pipelines. Covers best practices for MLOps, model serving, and monitoring.",
          category: "publication",
          publisher: "O'Reilly Media",
          year: "2024",
          role: "Author",
        }),
        // Invited Talk
        apiRequest('POST', `/api/portfolios/${portfolioId}/projects`, {
          title: "The Future of Web Development",
          description: "Keynote presentation on emerging trends in web technologies, including AI integration, WebAssembly, and edge computing. Attended by 500+ developers.",
          category: "talk",
          venue: "TechConf 2024",
          location: "Austin, TX",
          year: "2024",
          role: "Keynote Speaker",
        }),
        // Professional Experience
        apiRequest('POST', `/api/portfolios/${portfolioId}/projects`, {
          title: "Senior Software Engineer",
          description: "Led a team of 5 engineers building customer-facing features. Improved system performance by 40% and mentored junior developers.",
          category: "experience",
          company: "Tech Startup Inc.",
          location: "Remote",
          year: "2022-Present",
          role: "Team Lead",
        }),
      ]);

      toast({ title: "Demo Ready!", description: "Opening portfolio editor with sample data." });
      setLocation(`/editor/${portfolioId}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create demo. Please try again.", variant: "destructive" });
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStart = async () => {
    if (!file && !github && !linkedin) {
      toast({ title: "Input Required", description: "Please upload a resume or provide a link.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      let extractedText = "";
      
      // 1. Upload File if present
      if (file) {
        toast({ title: "Uploading...", description: "Parsing your resume." });
        const uploadRes = await uploadFile.mutateAsync(file);
        extractedText = uploadRes.extractedText || "";
      }

      // 2. Extract Data using AI
      toast({ title: "Analyzing...", description: "AI is building your profile." });
      const extractionRes = await extractData.mutateAsync({
        resumeText: extractedText,
        githubUrl: github,
        linkedinUrl: linkedin,
      });

      // 3. Store in local storage for the Review step
      localStorage.setItem("portfolio_draft", JSON.stringify({
        ...extractionRes,
        githubUrl: github,
        linkedinUrl: linkedin,
      }));

      setLocation("/review");
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg blob-bg font-body">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Hero Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Portfolio Builder
            </div>
            
            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight tracking-tight">
              Turn your resume into a <span className="text-primary">stunning website</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Drop your resume, link your GitHub, and let our AI craft a professional portfolio for you in seconds. No coding required.
            </p>
            
            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-3">
                 {/* Stock images: Avatars for social proof */}
                 {[1,2,3,4].map(i => (
                   <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${i}`} alt="User" />
                 ))}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold">1,000+ students</span>
                <span className="text-xs text-muted-foreground">built their portfolios</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative background blob */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-30 blur-2xl rounded-[2rem] -z-10" />
            
            <Card className="glass-card rounded-[2rem] overflow-visible">
              <CardContent className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold font-display">Get Started</h3>
                  <p className="text-muted-foreground">Upload your resume to begin</p>
                </div>

                {/* File Upload Area */}
                <div className="group relative border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl p-8 text-center cursor-pointer bg-muted/20 hover:bg-muted/40">
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {file ? <FileText className="w-8 h-8 text-primary" /> : <Upload className="w-8 h-8 text-primary" />}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{file ? file.name : "Drop resume here"}</p>
                      <p className="text-sm text-muted-foreground mt-1">PDF, DOCX, or TXT</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or connect</span></div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="GitHub Username or URL" 
                      className="pl-9 h-12" 
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="LinkedIn Profile URL" 
                      className="pl-9 h-12" 
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  onClick={handleStart}
                  disabled={isProcessing || isCreatingDemo}
                  data-testid="button-generate"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>Generate Portfolio <ArrowRight className="ml-2 w-5 h-5" /></>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>

                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-12 text-base font-semibold"
                  onClick={handlePreviewDemo}
                  disabled={isProcessing || isCreatingDemo}
                  data-testid="button-preview-demo"
                >
                  {isCreatingDemo ? (
                    <>Creating Demo...</>
                  ) : (
                    <>
                      <Eye className="mr-2 w-5 h-5" />
                      Preview Demo Portfolio
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
