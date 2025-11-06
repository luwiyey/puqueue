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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { mockStudentTicketActivity } from '@/lib/data';

const chartConfig = {
  opened: {
    label: 'Opened',
    color: 'hsl(var(--chart-2))',
  },
  resolved: {
    label: 'Resolved',
    color: 'hsl(var(--chart-5))',
  },
};

export function ActivityTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Ticket Activity</CardTitle>
        <CardDescription>Opened vs. Resolved tickets over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={mockStudentTicketActivity} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="opened" fill={chartConfig.opened.color} radius={4} />
                <Bar dataKey="resolved" fill={chartConfig.resolved.color} radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
