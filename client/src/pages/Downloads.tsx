import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Download, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signals } from "@/lib/course-data";

export default function Downloads() {
  return (
    <Layout>
      <div className="container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold font-oswald mb-4">Download Course Materials</h1>
          <p className="text-muted-foreground text-lg">
            Get the full course handbook and individual signal reference cards for offline use and jobsite safety meetings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Full Handbook */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-oswald text-2xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Complete Handbook
              </CardTitle>
              <CardDescription>
                All {signals.length} signals, safety guidelines, and quizzes in one document.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4" /> Printable A4 Format</li>
                <li className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4" /> High-resolution diagrams</li>
                <li className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4" /> Includes safety checklist</li>
              </ul>
              <Button className="w-full font-oswald uppercase" size="lg">
                <Download className="mr-2 h-4 w-4" /> Download PDF (12MB)
              </Button>
            </CardContent>
          </Card>

          {/* Individual Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="font-oswald text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-muted-foreground" />
                Signal Reference Cards
              </CardTitle>
              <CardDescription>
                Individual cards for each signal. Great for daily toolbox talks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signals.slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="font-medium text-sm">{s.name} Card</span>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="link" className="text-muted-foreground">View all {signals.length} files</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
