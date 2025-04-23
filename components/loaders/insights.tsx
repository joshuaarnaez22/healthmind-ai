import { Card } from '../ui/card';
import { Heart } from 'lucide-react';

export default function InsightsLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-gradient-to-b p-4">
      <Card className="w-full max-w-md border-teal-100 p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Heart className="h-16 w-16 animate-pulse text-teal-100" />
            <Heart
              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse text-teal-300"
              style={{ animationDelay: '300ms' }}
            />
            <Heart
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-pulse text-teal-500"
              style={{ animationDelay: '600ms' }}
            />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-teal-800">
          Personalizing Your Experience
        </h1>
        <p className="mb-6 text-muted-foreground">
          Please wait a moment while we prepare your personalized health
          insights...
        </p>

        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="loading-dots">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="mx-1 inline-block h-3 w-3 animate-bounce rounded-full bg-teal-500"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-teal-100">
          <div className="animate-progress absolute left-0 top-0 h-full rounded-full bg-teal-500" />
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Were analyzing patterns to provide the most relevant resources for
          your mental wellbeing journey
        </p>
      </Card>
    </div>
  );
}
