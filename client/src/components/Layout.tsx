import { Link, useLocation } from "wouter";
import { HardHat, Menu, X, Download, BookOpen, Home, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Course Curriculum", href: "/curriculum", icon: BookOpen },
    { label: "Downloads", href: "/downloads", icon: Download },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-roboto">
      {/* Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 print:hidden ${
        scrolled 
          ? "border-b bg-card/95 backdrop-blur-lg shadow-lg" 
          : "border-b border-white/10 bg-slate-900/95 backdrop-blur-md"
      }`}>
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <HardHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold font-oswald tracking-tight transition-colors duration-300 ${
                scrolled ? "text-foreground" : "text-white"
              }`}>
                CRANESIGNAL<span className="text-primary">PRO</span>
              </span>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                scrolled ? "text-muted-foreground" : "text-white/60"
              }`}>
                Certified Safety Training
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary relative ${
                    location === item.href
                      ? scrolled
                        ? "text-foreground"
                        : "text-white"
                      : scrolled
                        ? "text-muted-foreground"
                        : "text-white/70"
                  }`}
                >
                  {item.label}
                  {location === item.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </span>
              </Link>
            ))}
            <Link href="/curriculum">
              <Button size="sm" className="font-oswald uppercase tracking-wide bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
                Start Course
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={scrolled ? "" : "text-white"}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <span
                      className={`flex items-center gap-3 text-lg font-medium p-3 rounded-lg transition-all duration-200 ${
                        location === item.href
                          ? "bg-primary/10 text-primary border-l-4 border-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </span>
                  </Link>
                ))}
                <Link href="/curriculum" onClick={() => setIsMobileOpen(false)}>
                  <Button className="w-full mt-4 font-oswald uppercase bg-gradient-to-r from-primary to-secondary">Start Learning</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-slate-900 to-slate-950 py-8 md:py-12 print:hidden">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <HardHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-bold text-white font-oswald tracking-tight">
                  CRANESIGNAL<span className="text-primary">PRO</span>
                </span>
                <p className="text-xs text-white/60">Certified Safety Training &copy; 2025</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Official ANSI standard hand signals for mobile cranes.</p>
              <p className="text-xs text-white/40 mt-1">Ensuring jobsite safety through standardized communication.</p>
            </div>
            <div className="flex md:justify-end gap-4">
              <Link href="/curriculum">
                <span className="text-sm text-white/60 hover:text-primary transition-colors">Curriculum</span>
              </Link>
              <Link href="/downloads">
                <span className="text-sm text-white/60 hover:text-primary transition-colors">Downloads</span>
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/40">Always verify signals with official site safety regulations. This training is for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
