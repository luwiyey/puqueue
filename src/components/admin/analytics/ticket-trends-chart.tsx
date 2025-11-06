
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
import { mockTicketTrends } from '@/lib/data';

const chartConfig = {
  'CSS': { label: 'CSS', color: 'hsl(var(--chart-1))' },
  'Registrar': { label: 'Registrar', color: 'hsl(var(--chart-2))' },
  'Guidance': { label: 'Guidance', color: 'hsl(var(--chart-3))' },
  'Dean\'s Office': { label: 'Dean\'s Office', color: 'hsl(var(--chart-4))' },
  'Finance': { label: 'Finance', color: 'hsl(var(--chart-5))' },
};

export default function TicketTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Ticket Volume Trends</CardTitle>
        <CardDescription>Daily ticket volume by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={mockTicketTrends}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 6)}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="CSS" stackId="a" fill={chartConfig['CSS'].color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Registrar" stackId="a" fill={chartConfig['Registrar'].color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Guidance" stackId="a" fill={chartConfig['Guidance'].color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
