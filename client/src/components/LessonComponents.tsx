import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Signal } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

  const isCorrect = selected === signal.quiz.correctAnswer;

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
            <Button variant="outline" onClick={() => { setSubmitted(false); setSelected(null); }}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
