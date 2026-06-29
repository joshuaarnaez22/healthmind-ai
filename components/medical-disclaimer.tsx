import { AlertTriangle } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-semibold">Medical disclaimer: </span>
        Information provided by HealthMind is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making decisions about your health.
      </p>
    </div>
  );
}
