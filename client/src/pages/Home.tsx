import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  ShieldAlert, 
  BookOpen, 
  Award,
  Zap,
  Target,
  ChevronRight,
  Play
} from "lucide-react";
import { courseInfo, signals } from "@/lib/course-data";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const featuredSignals = signals.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-36 overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={courseInfo.heroImage} 
            alt="Construction site" 
            className="w-full h-full object-cover opacity-70 scale-105 animate-[pulse-soft_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_1s]" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl space-y-8">
            <motion.div 
              {...fadeInDown}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              <span className="font-oswald tracking-wide">Free Online Certification Course</span>
            </motion.div>
            
            <motion.h1 
              {...fadeInUp}
              className="text-5xl md:text-7xl font-bold font-oswald text-white tracking-tight uppercase leading-none"
            >
              Master Standard <br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Crane Signals
              </span>
            </motion.h1>
            
            <motion.p 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 max-w-[650px] leading-relaxed"
            >
              Essential safety training for construction professionals. 
              Learn standardized mobile crane hand signals to ensure jobsite safety and efficiency.
            </motion.p>
            
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/curriculum">
                <Button size="lg" className="font-oswald uppercase text-lg px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                  Start Course Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/downloads">
                <Button size="lg" variant="outline" className="font-oswald uppercase text-lg px-8 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-200 backdrop-blur-sm">
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Guide
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10"
            >
              <div className="text-center">
                <div className="text-3xl font-bold font-oswald text-white">{signals.length}+</div>
                <div className="text-sm text-white/60">Signal Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-oswald text-white">5</div>
                <div className="text-sm text-white/60">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-oswald text-white">100%</div>
                <div className="text-sm text-white/60">Free Access</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronRight className="h-6 w-6 text-white/60 rotate-90" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
              <ShieldAlert className="h-5 w-5" />
              <span className="font-oswald uppercase tracking-wide text-sm">Why Choose Our Course</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-oswald uppercase mb-4">
              Learn Safety Standards <span className="text-primary">The Right Way</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive training covers every standard mobile crane hand signal with practical examples, quizzes, and downloadable materials.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                icon: ShieldAlert,
                title: "Safety First",
                description: "Miscommunication causes accidents. Learn the exact standard signals used across the industry to prevent hazards.",
                color: "from-amber-500 to-orange-500",
                bgGradient: "from-amber-500/10 to-orange-500/10"
              },
              {
                icon: BookOpen,
                title: "Structured Learning",
                description: "Step-by-step curriculum covering basic load movement, boom operations, and travel signals with detailed explanations.",
                color: "from-blue-500 to-indigo-500",
                bgGradient: "from-blue-500/10 to-indigo-500/10"
              },
              {
                icon: Award,
                title: "ZK-Certification",
                description: "Prove your knowledge with interactive quizzes and mint verifiable certificates on the Aleo blockchain.",
                color: "from-emerald-500 to-teal-500",
                bgGradient: "from-emerald-500/10 to-teal-500/10"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group space-y-5 p-8 rounded-2xl bg-card border-2 border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-xl font-bold font-oswald group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="pt-2">
                  <Link href="/curriculum">
                    <span className="inline-flex items-center text-sm font-semibold text-primary hover:underline gap-1">
                      Learn more <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Preview Signals Grid */}
      <section className="py-20 md:py-28 bg-muted/20">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-secondary font-semibold mb-4">
              <Target className="h-5 w-5" />
              <span className="font-oswald uppercase tracking-wide text-sm">Course Preview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-oswald uppercase mb-4">
              Essential <span className="text-secondary">Signals</span> You'll Master
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From basic load movement to complex boom operations - every signal covered in detail.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredSignals.map((signal, idx) => (
              <motion.div
                key={signal.id}
                variants={fadeInUp}
                className="group cursor-pointer"
              >
                <Link href={`/lesson/${signal.id}`}>
                  <div className="h-full rounded-2xl bg-card border-2 border-transparent hover:border-primary/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-muted p-8 flex items-center justify-center relative overflow-hidden">
                      <img 
                        src={signal.image} 
                        alt={signal.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-white/90 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                          {signal.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold font-oswald uppercase text-foreground mb-1 group-hover:text-primary transition-colors">
                        {signal.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {signal.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                        <Play className="h-4 w-4" />
                        <span>Start Lesson</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/curriculum">
              <Button size="lg" variant="outline" className="font-oswald uppercase gap-2 group">
                View All {signals.length} Signals
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
              <Zap className="h-5 w-5" />
              <span className="font-oswald uppercase tracking-wide text-sm">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-oswald uppercase mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { step: "01", title: "Choose a Signal", desc: "Select any standard crane signal from our curriculum" },
              { step: "02", title: "Learn the Motion", desc: "Study the proper hand signals and body positioning" },
              { step: "03", title: "Take the Quiz", desc: "Test your knowledge with interactive quizzes" },
              { step: "04", title: "Get Certified", desc: "Mint your achievement on the Aleo blockchain" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative text-center space-y-4"
              >
                <div className="text-5xl font-bold font-oswald text-primary/20">{item.step}</div>
                <h3 className="text-lg font-bold font-oswald uppercase">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 text-primary/40">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-primary font-semibold mb-6">
              <Award className="h-5 w-5" />
              <span className="font-oswald uppercase tracking-wide text-sm">Start Learning Today</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-oswald uppercase text-white mb-6">
              Ready to Master <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Crane Signals</span>?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of construction professionals improving jobsite communication. 
              No registration required - start learning immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/curriculum">
                <Button size="lg" className="font-oswald uppercase text-lg px-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                  View All Signals <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/downloads">
                <Button size="lg" variant="outline" className="font-oswald uppercase text-lg px-10 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-200 backdrop-blur-sm">
                  <Download className="mr-2 h-5 w-5" />
                  Download Materials
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

function Download(props: { className?: string }) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
