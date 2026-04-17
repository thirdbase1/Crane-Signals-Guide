import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, Loader2, Play } from "lucide-react";
import { Signal } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAleoWallet } from "@/hooks/use-aleo-wallet";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <Link href={`/lesson/${signal.id}`}>
      <motion.div 
        className="group cursor-pointer h-full"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-full rounded-2xl bg-card border-2 border-transparent hover:border-primary/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted p-6 flex items-center justify-center relative overflow-hidden">
            <img 
              src={signal.image} 
              alt={signal.name} 
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-white/90 dark:bg-slate-800/90 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                {signal.category}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-primary font-medium text-sm bg-white/90 dark:bg-slate-800/90 rounded-lg px-3 py-2 backdrop-blur-sm shadow-sm">
                <Play className="h-4 w-4" />
                <span>Start Lesson</span>
                <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {signal.category}
              </span>
            </div>
            <h3 className="text-lg font-bold font-oswald uppercase text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {signal.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {signal.description}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function QuizComponent({ signal }: { signal: Signal }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [minting, setMinting] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const { address, connect, requestTransaction, getTransactionStatus } = useAleoWallet();
  const { toast } = useToast();

  const isCorrect = selected === signal.quiz.correctAnswer;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (txId && (txStatus === "Pending" || !txStatus)) {
      interval = setInterval(async () => {
        const status = await getTransactionStatus(txId);
        setTxStatus(status);
        if (status === "Completed") {
          toast({
            title: "Certification Minted!",
            description: "Your signal mastery has been recorded on Aleo.",
          });
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [txId, txStatus, getTransactionStatus, toast]);

  const handleMintCertificate = async () => {
    if (!address) {
      await connect();
      return;
    }

    setMinting(true);
    try {
      const programId = "crane_signals_cert.aleo";
      const functionName = "issue_certification";
      const inputs = [address, `${signal.id}u8`];

      const id = await requestTransaction(programId, functionName, inputs, 0.1);
      setTxId(id);
      setTxStatus("Pending");
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <span className="text-xs font-bold text-primary-foreground">Q</span>
          </div>
          <h3 className="text-lg font-bold font-oswald">Test Your Knowledge</h3>
        </div>
        
        {!submitted ? (
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-medium text-lg">{signal.quiz.question}</p>
            <RadioGroup 
              onValueChange={(v) => setSelected(parseInt(v))}
              className="space-y-3"
            >
              {signal.quiz.options.map((option, idx) => (
                <motion.div 
                  key={idx} 
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selected === idx 
                      ? "border-primary bg-primary/5" 
                      : "border-transparent hover:border-muted"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1">
                    {option}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => setSubmitted(true)} 
              disabled={selected === null}
              className="w-full sm:w-auto font-oswald uppercase bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200 shadow-sm"
            >
              Check Answer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-5 animate-in fade-in slide-in-from-bottom-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`flex items-center gap-3 text-lg font-bold p-4 rounded-xl ${
              isCorrect 
                ? "bg-green-50 text-green-700 border-2 border-green-200" 
                : "bg-red-50 text-red-700 border-2 border-red-200"
            }`}>
              {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              {isCorrect ? "Excellent! You've mastered this signal." : `The correct answer is: ${signal.quiz.options[signal.quiz.correctAnswer]}`}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSubmitted(false);
                  setSelected(null);
                  setTxId(null);
                  setTxStatus(null);
                }}
                className="font-oswald uppercase"
              >
                Try Again
              </Button>

              {isCorrect && !txId && (
                <Button
                  onClick={handleMintCertificate}
                  disabled={minting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white gap-2 shadow-sm"
                >
                  {minting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {address ? "Mint ZK-Certificate" : "Connect Wallet to Mint"}
                </Button>
              )}

              {txId && (
                <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-xl text-sm font-medium shadow-sm">
                  <div className={`h-2 w-2 rounded-full ${txStatus === "Completed" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
                  Status: {txStatus || "Processing..."}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
