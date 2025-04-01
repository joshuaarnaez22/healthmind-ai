'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { commonSymptoms, getBPCategory, postures } from '@/lib/constant';
import { cn, safeFormat } from '@/lib/utils';
import {
  type BloodPressureFormValues,
  bloodPressureSchema,
} from '@/lib/zod-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function BloodPressureForm() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const form = useForm<BloodPressureFormValues>({
    resolver: zodResolver(bloodPressureSchema),
    defaultValues: {
      loggedAt: new Date(),
      systolic: 0,
      diastolic: 0,
      pulse: 0,
      posture: 'SITTING',
      arm: 'LEFT',
      device: '',
      symptoms: [],
      notes: '',
    },
  });
  const systolic = form.watch('systolic');
  const diastolic = form.watch('diastolic');
  const bpCategory =
    systolic && diastolic ? getBPCategory(systolic, diastolic) : null;

  const addSymptom = (symptom: string) => {
    if (symptom && !selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setCustomSymptom('');
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handleSubmit = (values: BloodPressureFormValues) => {
    console.log(values);
  };

  useEffect(() => {
    form.setValue('symptoms', selectedSymptoms, { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymptoms]);
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Blood Pressure Reading</h3>
              {bpCategory && (
                <Badge className={cn('ml-2', bpCategory.color)}>
                  {bpCategory.label}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormDescription>Range: 70-250 mmHg</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diastolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="80" {...field} />
                    </FormControl>
                    <FormDescription>Range: 40-150 mmHg</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pulse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pulse (BPM)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="72"
                      {...field}
                      value={field.value === null ? 0 : field.value}
                    />
                  </FormControl>
                  <FormDescription>Range: 30-200 BPM</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loggedAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            safeFormat(field.value, 'PPP HH:mm')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                      <div className="border-t border-border p-3">
                        <div className="flex justify-center">
                          <input
                            type="time"
                            className="rounded border p-2"
                            value={
                              field.value
                                ? safeFormat(field.value, 'HH:mm')
                                : '00:00'
                            }
                            onChange={(e) => {
                              const [hours, minutes] =
                                e.target.value.split(':');
                              const newDate = new Date(
                                field.value || new Date()
                              );
                              newDate.setHours(Number.parseInt(hours, 10));
                              newDate.setMinutes(Number.parseInt(minutes, 10));
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Measurement Context</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="posture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posture</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select posture" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postures.map((posture) => (
                          <SelectItem value={posture} key={posture}>
                            {posture}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arm</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select arm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LEFT">Left</SelectItem>
                        <SelectItem value="RIGHT">Right</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Omron X5"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <div className="mb-3 mt-2 flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeSymptom(symptom)}
                      >
                        {symptom} ×
                      </Badge>
                    ))}
                    {selectedSymptoms.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        No symptoms selected
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add symptom"
                      value={customSymptom || ''}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSymptom(customSymptom);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSymptom(customSymptom)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="outline"
                        className={cn(
                          'cursor-pointer hover:bg-secondary',
                          selectedSymptoms.includes(symptom) && 'bg-secondary'
                        )}
                        onClick={() => {
                          if (selectedSymptoms.includes(symptom)) {
                            removeSymptom(symptom);
                          } else {
                            addSymptom(symptom);
                          }
                        }}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this reading"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" className="w-full md:w-auto">
                  <Heart className="mr-2 h-4 w-4" />
                  Save Blood Pressure Reading
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save this reading to your health log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </Form>
  );
}
