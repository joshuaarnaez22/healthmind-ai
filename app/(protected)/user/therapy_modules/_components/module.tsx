'use client';

import { TherapyModule } from '@/lib/types';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  Target,
  Users,
  CheckCircle,
  // Brain,
  // Heart,
  // Lightbulb,
} from 'lucide-react';
// import { ModuleData } from '@/lib/types';

// const therapyIcons = {
//   CBT: Brain,
//   DBT: Heart,
//   ACT: Lightbulb,
// };

// const therapyColors = {
//   CBT: 'bg-blue-50 text-blue-700 border-blue-200',
//   DBT: 'bg-rose-50 text-rose-700 border-rose-200',
//   ACT: 'bg-amber-50 text-amber-700 border-amber-200',
// };

export default function Module({
  moduleData,
  moduleId,
}: {
  moduleData: TherapyModule;
  moduleId: string;
}) {
  // const TherapyIcon = therapyIcons[moduleData.therapyType];
  // const colorClass = therapyColors[moduleData.therapyType];
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin/therapy_modules"
          className="inline-flex items-center text-slate-600 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Modules
        </Link>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          {/* <div
              className={`h-12 w-12 rounded-lg ${colorClass} flex items-center justify-center`}
            >
              <TherapyIcon className="h-6 w-6" />
            </div> */}
          <div>
            <Badge variant="secondary" className="mb-2">
              {moduleData.therapyType}
            </Badge>
            <h1 className="text-4xl font-bold text-slate-800">
              {moduleData.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Duration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">{moduleData.estimatedTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Who Its For</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">{moduleData.audience}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">What Youll Learn</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {moduleData.overview.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Module Steps</CardTitle>
          <CardDescription>
            Complete each step at your own pace. You can always go back and
            review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleData.steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {step.explanation.substring(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 text-center">
        <Link href={`/modules/${moduleId}/step/1`}>
          <Button size="lg" className="px-8">
            Start Module
          </Button>
        </Link>
        <p className="mt-3 text-sm text-slate-500">
          Your progress will be automatically saved
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-amber-800">
            <strong>Safety Note:</strong> {moduleData.safetyDisclaimer}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
