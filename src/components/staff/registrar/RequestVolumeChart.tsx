
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
  { date: "Mon", requests: 12 },
  { date: "Tue", requests: 18 },
  { date: "Wed", requests: 8 },
  { date: "Thu", requests: 22 },
  { date: "Fri", requests: 15 },
  { date: "Sat", requests: 4 },
];

const chartConfig = {
  requests: {
    label: 'Requests',
    color: 'hsl(var(--chart-1))',
  },
};

export function RequestVolumeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Request Volume Over Time</CardTitle>
        <CardDescription>Daily document requests this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={mockData} margin={{ top: 20, right: 20, bottom: 20, left: 20}}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill={chartConfig.requests.color} radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
