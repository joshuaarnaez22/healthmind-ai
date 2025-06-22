'use client';
import { Badge } from '@/components/ui/badge';
import {
  Card,
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
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface ModuleCardProps {
  module: TherapyModule;
  iconColor: string;
}
export default function ModuleCard({ module, iconColor }: ModuleCardProps) {
  const IconComponent = getIcon(module.icon);
  const isCompleted = false;

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
    </Card>
  );
}
