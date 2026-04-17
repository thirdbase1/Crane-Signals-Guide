import { useRoute, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { signals } from "@/lib/course-data";
import { QuizComponent } from "@/components/LessonComponents";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  Info, 
  XCircle, 
  Download, 
  CheckCircle2,
  Eye
} from "lucide-react";
import NotFound from "./not-found";
import { useRef, useState } from "react";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";

export default function Lesson() {
  const [match, params] = useRoute("/lesson/:id");
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"howto" | "safety" | "mistakes">("howto");
  
  if (!match) return <NotFound />;

  const signalIndex = signals.findIndex(s => s.id === params.id);
  const signal = signals[signalIndex];

  if (!signal) return <NotFound />;

  const prevSignal = signals[signalIndex - 1];
  const nextSignal = signals[signalIndex + 1];

  const handleDownload = () => {
    const element = contentRef.current;
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `${signal.name.toLowerCase().replace(/\s+/g, '-')}-signal-guide.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const tabs = [
    { id: "howto" as const, label: "How to Perform", icon: Eye },
    { id: "safety" as const, label: "Safety Notes", icon: AlertTriangle },
    { id: "mistakes" as const, label: "Common Mistakes", icon: XCircle },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Navigation Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/curriculum" className="hover:text-primary transition-colors">Curriculum</Link>
                <span>/</span>
                <span className="text-white/80">{signal.category}</span>
                <span>/</span>
                <span className="text-white">{signal.name}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {signal.category} Signal
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-oswald uppercase tracking-tight">
                    {signal.name}
                  </h1>
                  <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                    {signal.description}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 backdrop-blur-sm">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Link href={prevSignal ? `/lesson/${prevSignal.id}` : "/curriculum"}>
                      <Button variant="outline" size="sm" className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 backdrop-blur-sm">
                        <ArrowLeft className="h-4 w-4" />
                        {prevSignal ? "Previous" : "Back to Curriculum"}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Illustration */}
                <div className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <img src={signal.image} alt={signal.name} className="max-w-[200px] w-full object-contain" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-12 gap-10" ref={contentRef}>
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Tab Navigation */}
              <motion.div
                className="bg-card rounded-2xl border shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="border-b bg-muted/30">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? "bg-primary/10 text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {activeTab === "howto" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Info className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold font-oswald">How to Perform</h2>
                      </div>
                      <div className="bg-muted/30 p-6 rounded-xl border border-primary/20">
                        <p className="text-lg font-medium mb-4">{signal.explanation}</p>
                        <div className="text-muted-foreground leading-relaxed">
                          {signal.detailedExplanation}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "safety" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-500/10 p-2 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-bold font-oswald text-amber-600">Safety Notes</h2>
                      </div>
                      <div className="space-y-3">
                        {signal.safetyNotes.map((note, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{note}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "mistakes" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-500/10 p-2 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold font-oswald text-red-600">Common Mistakes</h2>
                      </div>
                      <div className="space-y-3">
                        {signal.mistakes.map((mistake, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{mistake}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Quiz Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <QuizComponent signal={signal} />
              </motion.div>

              {/* Footer Navigation */}
              <motion.div
                className="flex justify-between items-center pt-8 border-t mt-12 data-[html2canvas-ignore]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {prevSignal ? (
                  <Link href={`/lesson/${prevSignal.id}`}>
                    <Button variant="outline" className="group">
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <div className="text-left hidden sm:block">
                        <div className="text-xs text-muted-foreground font-normal">Previous</div>
                        <div className="font-oswald uppercase">{prevSignal.name}</div>
                      </div>
                      <span className="sm:hidden">Prev</span>
                    </Button>
                  </Link>
                ) : <div />}

                {nextSignal ? (
                  <Link href={`/lesson/${nextSignal.id}`}>
                    <Button className="group bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-sm">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-normal opacity-80">Next Lesson</div>
                        <div className="font-oswald uppercase">{nextSignal.name}</div>
                      </div>
                      <span className="sm:hidden">Next</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/curriculum">
                    <Button variant="outline" className="group">
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      Back to Curriculum
                    </Button>
                  </Link>
                )}
              </motion.div>

            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Course Progress */}
                <motion.div 
                  className="bg-card rounded-2xl border shadow-sm overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="p-6 border-b bg-muted/30">
                    <h3 className="font-bold font-oswald text-lg flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-md">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      Course Progress
                    </h3>
                  </div>
                  <div className="p-4 space-y-1">
                    {signals.map((s, idx) => (
                      <Link key={s.id} href={`/lesson/${s.id}`}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          s.id === signal.id 
                            ? "bg-primary/10 text-primary font-medium shadow-sm" 
                            : "hover:bg-muted/50 text-muted-foreground"
                        }`}>
                          <div className={`h-7 w-7 rounded-full border flex items-center justify-center text-xs font-bold ${
                            s.id === signal.id 
                              ? "border-primary bg-primary text-primary-foreground" 
                              : "border-muted"
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-sm truncate">{s.name}</span>
                          {s.id === signal.id && (
                            <ArrowRight className="h-3 w-3 ml-auto" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  className="bg-card rounded-2xl border shadow-sm p-6 space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-bold font-oswald text-lg mb-4">Quick Actions</h3>
                  <Button 
                    onClick={handleDownload} 
                    className="w-full gap-2 font-oswald uppercase bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-sm"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF Guide
                  </Button>
                  <Link href="/curriculum">
                    <Button variant="outline" className="w-full gap-2 font-oswald uppercase" size="sm">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Curriculum
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

// Icons needed in this file
function BookOpen(props: { className?: string }) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
