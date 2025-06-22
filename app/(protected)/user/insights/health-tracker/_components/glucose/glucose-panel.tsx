'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, List, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import GlucoseForm from './glucose-form';
import GlucoseHistory from './glucose-history';
import GlucoseChart from './glucose-chart';

export default function GlucosePanel() {
  const [view, setView] = useState<'form' | 'history' | 'chart'>('form');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <h2 className="text-2xl font-bold text-blue-800">Glucose Tracker</h2>
        <div className="flex flex-col justify-start gap-2 md:flex-row lg:justify-end">
          <Button
            variant={view === 'form' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('form')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
          <Button
            variant={view === 'history' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('history')}
          >
            <List className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button
            variant={view === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('chart')}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Trends
          </Button>
        </div>
      </div>
      <Card className="p-4">
        {view === 'form' && <GlucoseForm />}
        {view === 'history' && <GlucoseHistory />}
        {view === 'chart' && <GlucoseChart />}
      </Card>
    </div>
  );
}
