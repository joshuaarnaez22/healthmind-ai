import { AlertTriangle } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-secondary px-4 py-3 text-sm text-foreground">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">Medical disclaimer: </span>
        Information provided by HealthMind is for educational purposes only and
        does not constitute medical advice, diagnosis, or treatment. Always
        consult a qualified healthcare professional before making decisions
        about your health.
      </p>
    </div>
  );
}
