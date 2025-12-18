import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ShieldAlert, BookOpen } from "lucide-react";
import { courseInfo, signals } from "@/lib/course-data";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={courseInfo.heroImage} 
            alt="Construction site" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Free Online Certification Course
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-oswald text-white tracking-tight uppercase leading-none">
              Master Standard <br/>
              <span className="text-primary">Crane Signals</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-[600px] leading-relaxed">
              Essential safety training for construction professionals and beginners. 
              Learn the standardized mobile crane hand signals to ensure jobsite safety and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/curriculum">
                <Button size="lg" className="font-oswald uppercase text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Course Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/downloads">
                <Button size="lg" variant="outline" className="font-oswald uppercase text-lg px-8 border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Download PDF Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 rounded-lg bg-card border shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-oswald">Safety First</h3>
              <p className="text-muted-foreground">
                Miscommunication causes accidents. Learn the exact standard signals used across the industry to prevent hazards.
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-lg bg-card border shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-oswald">Structured Learning</h3>
              <p className="text-muted-foreground">
                Step-by-step curriculum covering basic load movement, boom operations, and travel signals.
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-lg bg-card border shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-oswald">Practical Examples</h3>
              <p className="text-muted-foreground">
                Real-world context, common mistakes to avoid, and quizzes to test your knowledge immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-oswald mb-6">Ready to learn?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of construction workers improving jobsite communication today. 
            No registration required.
          </p>
          <Link href="/curriculum">
            <Button size="lg" className="font-oswald uppercase text-lg px-12">
              View All Signals
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
