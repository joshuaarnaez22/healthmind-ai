import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, List, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import BloodPressureForm from './blood-pressure-form';

export default function BloodPressurePanel() {
  const [view, setView] = useState<'form' | 'history' | 'chart'>('form');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <h2 className="text-2xl font-bold text-red-800">
          Blood Pressure Tracker
        </h2>
        <div className="flex justify-start space-x-2 lg:justify-end">
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
        {view === 'form' && <BloodPressureForm />}
        {view === 'history' && <div>BloodPressureHistory</div>}
        {view === 'chart' && <div>BloodPressureChart</div>}
      </Card>
    </div>
  );
}
