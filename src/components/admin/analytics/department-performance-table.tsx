import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockDepartmentPerformance } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DepartmentPerformanceTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className='font-headline'>Department Activity Monitor</CardTitle>
          <CardDescription>Live ticket and appointment volume per department.</CardDescription>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Open Tickets</TableHead>
              <TableHead className="text-right">Appointments</TableHead>
              <TableHead className="text-right">Satisfaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDepartmentPerformance.map((dept) => (
              <TableRow key={dept.department}>
                <TableCell className="font-medium">{dept.department}</TableCell>
                <TableCell className="text-right tabular-nums">{dept.tickets}</TableCell>
                <TableCell className="text-right tabular-nums">{dept.appointments}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={parseFloat(dept.satisfaction) > 90 ? 'default' : 'secondary'} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {dept.satisfaction}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
