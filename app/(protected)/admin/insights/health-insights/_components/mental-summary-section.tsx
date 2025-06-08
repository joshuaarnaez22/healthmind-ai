import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface MentalSummarySectionProps {
  summary: string;
  moodData: {
    name: string;
    mood: number;
  }[];
}

export default function MentalSummarySection({
  summary,
  moodData,
}: MentalSummarySectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{summary}</p>

      <div className="pt-4">
        <h4 className="mb-2 text-sm font-medium">Weekly Mood Tracking</h4>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 10]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                }}
                formatter={(value) => [`Mood: ${value}/10`, '']}
              />
              <Bar
                dataKey="mood"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
