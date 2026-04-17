import { Layout } from "@/components/Layout";
import { signals } from "@/lib/course-data";
import { SignalCard } from "@/components/LessonComponents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter, Grid } from "lucide-react";

export default function Curriculum() {
  const categories = ["All", "Basic", "Boom", "Travel", "Emergency", "Hoist Control", "Advanced"];
  const categoryIcons: Record<string, typeof BookOpen> = {
    All: Grid,
    Basic: BookOpen,
    Boom: Filter,
    Travel: BookOpen,
    Emergency: Filter,
    "Hoist Control": BookOpen,
    Advanced: Filter,
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-oswald uppercase tracking-wide text-sm">Complete Course</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-oswald uppercase mb-4">
            Course <span className="text-primary">Curriculum</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Master all {signals.length} standard mobile crane hand signals with detailed explanations, safety notes, and interactive quizzes.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="mb-8 p-4 bg-card rounded-xl border shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search signals..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <Tabs defaultValue="All" className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
            </div>
            <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50 rounded-lg">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat] || BookOpen;
                const count = cat === "All" ? signals.length : signals.filter(s => s.category === cat).length;
                return (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="font-oswald uppercase tracking-wide text-xs flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-2 rounded-md"
                  >
                    <Icon className="h-3 w-3" />
                    {cat}
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-black/10 rounded-full">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat} value={cat} className="mt-6">
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {signals
                    .filter((s) => cat === "All" || s.category === cat)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((signal, idx) => (
                      <motion.div
                        key={signal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <SignalCard signal={signal} />
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
