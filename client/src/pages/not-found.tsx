import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, HardHat } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <motion.div 
        className="w-full max-w-lg mx-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card rounded-3xl border-2 border-primary/20 p-12 shadow-2xl relative">
          {/* Icon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl shadow-lg">
              <HardHat className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <h1 className="text-4xl font-bold font-oswald text-foreground">404</h1>
            </div>

            <h2 className="text-xl font-bold font-oswald uppercase mb-3">
              Page Not Found
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Looks like this page got lost in construction. 
              The content you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button className="font-oswald uppercase gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/curriculum">
                <Button variant="outline" className="font-oswald uppercase gap-2">
                  View Curriculum
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/40 mt-8">
          If you believe this is an error, please contact support.
        </p>
      </motion.div>
    </div>
  );
}
