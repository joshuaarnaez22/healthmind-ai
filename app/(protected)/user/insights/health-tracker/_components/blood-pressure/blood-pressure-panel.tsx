import { Button } from '@/components/ui/button';
import { BarChart, List, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import BloodPressureForm from './blood-pressure-form';
import BloodPressureHistory from './blood-pressure-history';
import BloodPressureChart from './blood-pressure-chart';

export default function BloodPressurePanel() {
  const [view, setView] = useState<'form' | 'history' | 'chart'>('form');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Blood Pressure Tracker
        </h2>
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
      <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
        {view === 'form' && <BloodPressureForm />}
        {view === 'history' && <BloodPressureHistory />}
        {view === 'chart' && <BloodPressureChart />}
      </div>
    </div>
  );
}
