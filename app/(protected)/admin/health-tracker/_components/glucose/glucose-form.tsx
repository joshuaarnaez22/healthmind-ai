'use client';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Droplet } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlucoseFormValues, glucoseSchema } from '@/lib/zod-validation';
import { getGlucoseCategory, measurementType } from '@/lib/constant';
import { addGlucose } from '@/actions/server-actions/health-tracker';
export default function GlucoseForm() {
  const [unit, setUnit] = useState<'mmol' | 'mgdl'>('mmol');
  const [pending, startTransition] = useTransition();

  const form = useForm<GlucoseFormValues>({
    resolver: zodResolver(glucoseSchema),
    defaultValues: {
      loggedAt: new Date(),
      glucose: 0,
      glucoseMgDl: 0,
      measurementType: 'FASTING',
      mealType: null,
      timeSinceMeal: 0, // Changed from null to 0
      device: '',
      insulinDose: 0, // Changed from null to 0
      carbs: 0, // Changed from null to 0
      notes: '',
    },
  });

  const watchMeasurementType = form.watch('measurementType');

  const glucose = form.watch('glucose');

  const glucoseCategory =
    glucose && unit === 'mmol'
      ? getGlucoseCategory(glucose, unit === 'mmol')
      : null;

  const handleSubmit = (values: GlucoseFormValues) => {
    let glucose = values.glucose || 0;
    let glucoseMgDl = values.glucoseMgDl || 0;
    if (unit === 'mmol') {
      glucoseMgDl = Math.round(glucose * 18);
    } else if (unit === 'mgdl') {
      glucose = Number.parseFloat((glucoseMgDl / 18).toFixed(1));
    }
    const result = {
      ...values,
      glucose,
      glucoseMgDl: glucoseMgDl || null,
      timeSinceMeal: values.timeSinceMeal === 0 ? null : values.timeSinceMeal,
      insulinDose: values.insulinDose === 0 ? null : values.insulinDose,
      carbs: values.carbs === 0 ? null : values.carbs,
    };
    startTransition(async () => {
      const response = await addGlucose(result);
      if (response.success && response.data) {
        console.log(response);

        console.log('add to table');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Glucose Reading</h3>
              {glucoseCategory && (
                <Badge className={cn('ml-2', glucoseCategory.color)}>
                  {glucoseCategory.label}
                </Badge>
              )}
            </div>
            <Tabs
              defaultValue="mmol"
              onValueChange={(value) => setUnit(value as 'mmol' | 'mgdl')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mmol">mmol/L</TabsTrigger>
                <TabsTrigger value="mgdl">mg/dL</TabsTrigger>
              </TabsList>
              <TabsContent value="mmol" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Glucose (mmol/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="5.5"
                          {...field}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Normal fasting range: 4.0-5.9 mmol/L
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="mgdl" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="glucoseMgDl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Glucose (mg/dL)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Normal fasting range: 70-100 mg/dL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <FormField
              control={form.control}
              name="measurementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select measurement type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {measurementType.map((type) => (
                        <SelectItem value={type} key={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(watchMeasurementType === 'BEFORE_MEAL' ||
              watchMeasurementType === 'AFTER_MEAL') && (
              <FormField
                control={form.control}
                name="mealType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                        <SelectItem value="LUNCH">Lunch</SelectItem>
                        <SelectItem value="DINNER">Dinner</SelectItem>
                        <SelectItem value="SNACK">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {watchMeasurementType === 'AFTER_MEAL' && (
              <FormField
                control={form.control}
                name="timeSinceMeal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Since Meal (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        value={field.value === null ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                            format(field.value, 'PPP HH:mm')
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
                                ? format(field.value, 'HH:mm')
                                : '00:00'
                            }
                            onChange={(e) => {
                              const [hours, minutes] =
                                e.target.value.split(':');
                              const newDate = new Date(
                                field.value || new Date()
                              );
                              newDate.setHours(parseInt(hours, 10));
                              newDate.setMinutes(parseInt(minutes, 10));
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
            <h3 className="text-lg font-medium">Health Context</h3>
            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Accu-Chek"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="insulinDose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insulin Dose (units)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="4"
                        {...field}
                        value={field.value === null ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carbs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carbs (grams)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="45"
                        {...field}
                        value={field.value === null ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={pending}
                >
                  <Droplet className="mr-2 h-4 w-4" />

                  {pending
                    ? 'Saving Glucose Reading...'
                    : 'Save Glucose Reading'}
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
