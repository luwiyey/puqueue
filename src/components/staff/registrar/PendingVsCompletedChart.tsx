
'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
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

const mockData = [
    { status: 'Pending', count: 15, fill: 'hsl(var(--chart-4))' },
    { status: 'Completed', count: 85, fill: 'hsl(var(--chart-2))' },
];

const chartConfig = {
  count: {
    label: 'Count',
  },
  Pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-4))',
  },
  Completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
  },
};

export function PendingVsCompletedChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Pending vs. Completed</CardTitle>
        <CardDescription>Ratio of all open vs. closed requests this month.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={mockData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                 {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
