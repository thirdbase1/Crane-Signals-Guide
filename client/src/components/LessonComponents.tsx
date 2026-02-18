import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { Signal } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAleoWallet } from "@/hooks/use-aleo-wallet";
import { useToast } from "@/hooks/use-toast";

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <Link href={`/lesson/${signal.id}`}>
      <div className="group cursor-pointer h-full">
        <Card className="h-full overflow-hidden border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
          <div className="aspect-square bg-muted p-6 flex items-center justify-center relative overflow-hidden">
            <img 
              src={signal.image} 
              alt={signal.name} 
              className="w-full h-full object-contain transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{signal.category}</span>
            </div>
            <h3 className="text-xl font-bold font-oswald text-foreground mb-2 group-hover:text-primary transition-colors">
              {signal.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {signal.description}
            </p>
          </CardContent>
        </Card>
      </div>
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

  // Poll for transaction status if we have a txId
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
      const functionName = "issue_certificate";
      // Inputs: recipient address, signal_id (field)
      const inputs = [address, signal.id.padEnd(16, '0')]; // Dummy padding for field

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
    <Card className="bg-muted/30 border-none">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold font-oswald mb-4 flex items-center gap-2">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm">QUIZ</span>
          Test Your Knowledge
        </h3>
        
        {!submitted ? (
          <div className="space-y-4">
            <p className="font-medium text-lg">{signal.quiz.question}</p>
            <RadioGroup onValueChange={(v) => setSelected(parseInt(v))}>
              {signal.quiz.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => setSubmitted(true)} 
              disabled={selected === null}
              className="w-full sm:w-auto font-oswald uppercase"
            >
              Check Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className={`flex items-center gap-3 text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>
            <p className="text-muted-foreground">
              {isCorrect 
                ? "Great job! You've mastered this signal." 
                : `The correct answer is: ${signal.quiz.options[signal.quiz.correctAnswer]}`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => {
                setSubmitted(false);
                setSelected(null);
                setTxId(null);
                setTxStatus(null);
              }}>
                Try Again
              </Button>

              {isCorrect && !txId && (
                <Button
                  onClick={handleMintCertificate}
                  disabled={minting}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {minting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {address ? "Mint ZK-Certificate" : "Connect Wallet to Mint"}
                </Button>
              )}

              {txId && (
                <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-md text-sm font-medium">
                  <div className={`h-2 w-2 rounded-full ${txStatus === "Completed" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
                  Status: {txStatus || "Processing..."}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
