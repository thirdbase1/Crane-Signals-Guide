import { Layout } from "@/components/Layout";
import { signals } from "@/lib/course-data";
import { SignalCard } from "@/components/LessonComponents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Curriculum() {
  const categories = ["All", "Basic", "Boom", "Travel", "Emergency"];

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold font-oswald mb-2">Course Curriculum</h1>
            <p className="text-muted-foreground">Master all {signals.length} standard mobile crane hand signals.</p>
          </div>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-8 w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="font-oswald uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {signals
                  .filter((s) => cat === "All" || s.category === cat)
                  .map((signal) => (
                    <SignalCard key={signal.id} signal={signal} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}
