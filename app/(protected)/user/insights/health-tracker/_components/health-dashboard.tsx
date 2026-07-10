'use client';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import BloodPressurePanel from './blood-pressure/blood-pressure-panel';
import GlucosePanel from './glucose/glucose-panel';
import { pageAnimations } from '@/lib/motion';
import MedicalDisclaimer from '@/components/medical-disclaimer';

export default function HealthDashboard() {
  const [, setActiveTab] = useState('blood-pressure');
  return (
    <motion.div {...pageAnimations} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Health Tracker
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log blood pressure and glucose, then review trends over time.
        </p>
      </div>
      <MedicalDisclaimer />
      <section className="rounded-3xl border border-border/80 bg-card p-6">
        <Tabs
          defaultValue="blood-pressure"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="mb-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger
                value="blood-pressure"
                className="data-[state=active]:bg-secondary data-[state=active]:text-primary"
              >
                Blood Pressure
              </TabsTrigger>
              <TabsTrigger
                value="glucose"
                className="data-[state=active]:bg-secondary data-[state=active]:text-primary"
              >
                Glucose
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="blood-pressure" className="mt-0">
            <BloodPressurePanel />
          </TabsContent>

          <TabsContent value="glucose" className="mt-0">
            <GlucosePanel />
          </TabsContent>
        </Tabs>
      </section>
    </motion.div>
  );
}
