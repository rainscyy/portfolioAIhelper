import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Layout } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [location] = useLocation();
  const isBuilder = location.startsWith("/editor");

  return (
    <nav className="glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Portfol<span className="text-primary">AI</span>
            </span>
          </Link>

          {!isBuilder && (
            <div className="flex items-center space-x-4 gap-2">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link href="/#start">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
          
          {isBuilder && (
             <div className="flex items-center gap-2">
               <ThemeToggle />
               <span className="text-sm text-muted-foreground hidden sm:block">Draft Mode</span>
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             </div>
          )}
        </div>
      </div>
    </nav>
  );
}
