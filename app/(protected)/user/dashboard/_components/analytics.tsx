'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import {
  BookOpen,
  Calendar,
  Droplets,
  FileSpreadsheet,
  FileText,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import GoalsAnalytics from './goals-analytics';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    //     setIsExporting(true)
    //     try {
    //       await new Promise((resolve) => setTimeout(resolve, 2000))
    //       const reportData = `
    // HEALTH ANALYTICS REPORT
    // Generated: ${new Date().toLocaleDateString()}
    // Time Range: ${timeRange}
    // HEALTH METRICS SUMMARY:
    // - Average Systolic: ${Math.round(filteredHealthData.reduce((sum, d) => sum + d.systolic, 0) / filteredHealthData.length)}
    // - Average Diastolic: ${Math.round(filteredHealthData.reduce((sum, d) => sum + d.diastolic, 0) / filteredHealthData.length)}
    // - Average Glucose: ${Math.round(filteredHealthData.reduce((sum, d) => sum + d.glucose, 0) / filteredHealthData.length)}
    // - Average Mood: ${(filteredHealthData.reduce((sum, d) => sum + d.mood, 0) / filteredHealthData.length).toFixed(1)}
    // GOAL PROGRESS:
    // ${goalProgress.map((goal) => `- ${goal.title}: ${goal.progress}% (${goal.completed}/${goal.target})`).join("\n")}
    // THERAPY MODULES:
    // ${therapyModules.map((module) => `- ${module.title}: ${module.progress}% complete`).join("\n")}
    //       `
    //       const blob = new Blob([reportData], { type: "text/plain" })
    //       const url = URL.createObjectURL(blob)
    //       const a = document.createElement("a")
    //       a.href = url
    //       a.download = `health-analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.txt`
    //       document.body.appendChild(a)
    //       a.click()
    //       document.body.removeChild(a)
    //       URL.revokeObjectURL(url)
    //     } catch (error) {
    //       console.error("Export failed:", error)
    //     } finally {
    //       setIsExporting(false)
    //     }
  };

  const exportToCSV = async () => {
    // setIsExporting(true)
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1500))
    //   const csvData = [
    //     ["Date", "Systolic", "Diastolic", "Glucose", "Mood"],
    //     ...filteredHealthData.map((d) => [
    //       d.date,
    //       Math.round(d.systolic),
    //       Math.round(d.diastolic),
    //       Math.round(d.glucose),
    //       d.mood,
    //     ]),
    //   ]
    //   const csvContent = csvData.map((row) => row.join(",")).join("\n")
    //   const blob = new Blob([csvContent], { type: "text/csv" })
    //   const url = URL.createObjectURL(blob)
    //   const a = document.createElement("a")
    //   a.href = url
    //   a.download = `health-data-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`
    //   document.body.appendChild(a)
    //   a.click()
    //   document.body.removeChild(a)
    //   URL.revokeObjectURL(url)
    // } catch (error) {
    //   console.error("CSV export failed:", error)
    // } finally {
    //   setIsExporting(false)
    // }
  };

  return (
    <motion.div {...pageAnimations}>
      <div className="space-y-8">
        <Card>
          <CardHeader className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl text-transparent dark:from-white dark:to-slate-300">
                  Health Analytics
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                  Comprehensive wellness insights and metrics
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-700/50">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[999]">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 bg-white/50 backdrop-blur-sm transition-all hover:bg-white dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
                >
                  {isExporting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      PDF Report
                    </>
                  )}
                </Button>

                <Button
                  onClick={exportToCSV}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 bg-white/50 backdrop-blur-sm transition-all hover:bg-white dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
                >
                  {isExporting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      CSV Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs Card */}
        <Card className="overflow-visible border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/80">
          <CardContent className="p-0">
            <Tabs defaultValue="health" className="space-y-0">
              <div className="flex items-center justify-between p-6 dark:border-slate-700">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-700 md:grid-cols-5 lg:grid-cols-7">
                  {[
                    { value: 'overview', icon: TrendingUp, label: 'Overview' },
                    { value: 'vitals', icon: Heart, label: 'Vitals' },
                    { value: 'glucose', icon: Droplets, label: 'Glucose' },
                    { value: 'mood', icon: Calendar, label: 'Mood' },
                    { value: 'goals', icon: Target, label: 'Goals' },
                    { value: 'therapy', icon: BookOpen, label: 'Therapy' },
                    { value: 'community', icon: Users, label: 'Community' },
                  ].map(({ value, icon: Icon, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="flex items-center gap-2 rounded-xl transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-slate-600"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button> */}
              </div>
              <TabsContent value="goals">
                <GoalsAnalytics />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
