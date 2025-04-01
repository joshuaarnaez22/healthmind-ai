'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, List, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function GlucosePanel() {
  const [view, setView] = useState<'form' | 'history' | 'chart'>('form');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">Glucose Tracker</h2>
        <div className="flex space-x-2">
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
        {view === 'form' && <div>GlucoseForm</div>}
        {view === 'history' && <div>GlucoseHistory</div>}
        {view === 'chart' && <div>GlucoseChart</div>}
      </Card>
    </div>
  );
}
