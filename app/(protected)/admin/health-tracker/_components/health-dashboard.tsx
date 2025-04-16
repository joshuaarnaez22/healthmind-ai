'use client';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import BloodPressurePanel from './blood-pressure/blood-pressure-panel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import GlucosePanel from './glucose/glucose-panel';
export default function HealthDashboard() {
  const [, setActiveTab] = useState('blood-pressure');
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <h2 className="mb-6 text-xl font-bold">Health Tracker</h2>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="blood-pressure"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="blood-pressure"
                  className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
                >
                  Blood Pressure
                </TabsTrigger>
                <TabsTrigger
                  value="glucose"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
