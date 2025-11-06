
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const mockData = [
  { month: 'Jan', time: 2.5 },
  { month: 'Feb', time: 2.1 },
  { month: 'Mar', time: 2.8 },
  { month: 'Apr', time: 2.4 },
  { month: 'May', time: 1.9 },
  { month: 'Jun', time: 1.5 },
];

const chartConfig = {
  time: {
    label: 'Days',
    color: 'hsl(var(--chart-1))',
  },
};

export function AverageReleaseTimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Average Release Time</CardTitle>
        <CardDescription>Average time (in days) to complete a document request.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer>
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis unit="d" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="time"
                type="monotone"
                stroke={chartConfig.time.color}
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
