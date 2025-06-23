'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TherapyModule } from '@/lib/types';
import {
  cn,
  getDifficultyColor,
  getIcon,
  getTherapyTypeColor,
} from '@/lib/utils';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ModuleCardProps {
  module: TherapyModule;
  iconColor: string;
}
export default function ModuleCard({ module, iconColor }: ModuleCardProps) {
  const IconComponent = getIcon(module.icon);
  const isCompleted = module.isDone;

  return (
    <Card
      key={module.id}
      className={`transition-shadow hover:shadow-lg ${isCompleted ? 'bg-green-50 ring-2 ring-green-200' : ''}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={cn('mb-2 h-8 w-8', iconColor)} />
            {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-600" />}
          </div>
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(module.difficulty)}>
              {module.difficulty}
            </Badge>
            <Badge className={getTherapyTypeColor(module.therapyType)}>
              {module.therapyType}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-2 h-4 w-4" />
            {module.estimatedTime}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="mr-2 h-4 w-4" />
            {module.audience}
          </div>
        </div>
        <Link href={`/user/therapy_modules/${module.id}`}>
          <Button
            className="w-full"
            variant={isCompleted ? 'outline' : 'default'}
          >
            {isCompleted ? 'Review Module' : 'Start Module'}
          </Button>
        </Link>
        {isCompleted && (
          <div className="mt-2 text-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✓ Completed
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
