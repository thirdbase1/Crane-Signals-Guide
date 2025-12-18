import { Link, useLocation } from "wouter";
import { HardHat, Menu, X, Download, BookOpen, Home, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Course Curriculum", href: "/curriculum", icon: BookOpen },
    { label: "Downloads", href: "/downloads", icon: Download },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-roboto">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 print:hidden">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-md">
              <HardHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-oswald tracking-tight text-foreground">
              CRANESIGNAL<span className="text-primary">PRO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <Link href="/curriculum">
              <Button size="sm" className="font-oswald uppercase tracking-wide">
                Start Course
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <span
                      className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md transition-colors ${
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </span>
                  </Link>
                ))}
                <Link href="/curriculum" onClick={() => setIsMobileOpen(false)}>
                  <Button className="w-full mt-4 font-oswald uppercase">Start Learning</Button>
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
      <footer className="border-t bg-muted/40 py-6 md:py-10 print:hidden">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              CraneSignal Pro &copy; 2025
            </span>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>Official ANSI standard hand signals for mobile cranes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
