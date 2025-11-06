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
import { mockStudentAppointmentInsights } from '@/lib/data';

const chartConfig = {
  appointments: {
    label: 'Appointments',
  },
  'Registrar': {
    label: 'Registrar',
    color: 'hsl(var(--chart-1))',
  },
  'Guidance': {
    label: 'Guidance',
    color: 'hsl(var(--chart-2))',
  },
  "Dean's Office": {
    label: "Dean's Office",
    color: 'hsl(var(--chart-3))',
  },
  'CSS': {
    label: 'CSS',
    color: 'hsl(var(--chart-4))',
  },
};

const COLORS = Object.values(chartConfig).map(c => c.color).filter(Boolean);

export function AppointmentInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Appointment Insights</CardTitle>
        <CardDescription>Departments you've scheduled meetings with.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={mockStudentAppointmentInsights}
                dataKey="appointments"
                nameKey="department"
                innerRadius={60}
                strokeWidth={5}
              >
                {mockStudentAppointmentInsights.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="department" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
