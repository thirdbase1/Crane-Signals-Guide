import { useRoute, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { signals } from "@/lib/course-data";
import { QuizComponent } from "@/components/LessonComponents";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, AlertTriangle, Info, XCircle, Download } from "lucide-react";
import NotFound from "./not-found";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { useRef } from "react";

export default function Lesson() {
  const [match, params] = useRoute("/lesson/:id");
  const contentRef = useRef<HTMLDivElement>(null);
  
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
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/curriculum" className="hover:text-primary transition-colors">Curriculum</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">{signal.name}</span>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm" className="hidden md:flex gap-2">
            <Download className="h-4 w-4" />
            Download Lesson PDF
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10" ref={contentRef}>
            
            {/* Header */}
            <div>
              <div className="inline-block px-3 py-1 rounded bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4">
                {signal.category} Signal
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-oswald uppercase mb-4">{signal.name}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{signal.description}</p>
            </div>

            {/* Illustration Mobile (visible only on small screens) */}
            <div className="lg:hidden bg-white rounded-xl border p-8 flex justify-center shadow-sm">
              <img src={signal.image} alt={signal.name} className="max-w-[250px] w-full" />
            </div>

            {/* Explanation Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold font-oswald flex items-center gap-2">
                <Info className="h-6 w-6 text-primary" />
                How to Perform
              </h2>
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <p className="text-lg font-medium mb-4">{signal.explanation}</p>
                <div className="bg-muted/30 p-4 rounded text-muted-foreground">
                   <strong>Detailed Breakdown:</strong> {signal.detailedExplanation}
                </div>
              </div>
            </section>

            {/* Safety & Mistakes Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-oswald flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-6 w-6" />
                  Safety Notes
                </h2>
                <ul className="space-y-3">
                  {signal.safetyNotes.map((note, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-oswald flex items-center gap-2 text-red-600">
                  <XCircle className="h-6 w-6" />
                  Common Mistakes
                </h2>
                <ul className="space-y-3">
                  {signal.mistakes.map((mistake, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Quiz Section (Hidden in PDF print mode usually, but kept here as part of lesson content) */}
            <section className="pt-8 border-t data-[html2canvas-ignore]:hidden">
              <QuizComponent signal={signal} />
            </section>

            {/* Footer Navigation (Hidden in PDF) */}
            <div className="flex justify-between items-center pt-8 border-t mt-12 data-[html2canvas-ignore]:hidden">
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
                  <Button className="group bg-primary text-primary-foreground hover:bg-primary/90">
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
                  <Button variant="outline">Back to Curriculum</Button>
                </Link>
              )}
            </div>

          </div>

          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              {/* Illustration Desktop */}
              <div className="bg-white rounded-xl border p-10 flex justify-center shadow-lg mb-6">
                <img src={signal.image} alt={signal.name} className="w-full object-contain" />
              </div>

               <Button onClick={handleDownload} className="w-full mb-6 gap-2 font-oswald uppercase" variant="outline">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

              <div className="bg-muted/50 rounded-xl p-6 border">
                <h3 className="font-bold font-oswald mb-4">Course Progress</h3>
                <div className="space-y-2">
                  {signals.map((s, idx) => (
                    <Link key={s.id} href={`/lesson/${s.id}`}>
                      <div className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        s.id === signal.id 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-background text-muted-foreground"
                      }`}>
                        <div className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs ${
                           s.id === signal.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="text-sm truncate">{s.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
