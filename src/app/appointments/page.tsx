import { AppointmentForm } from '@/components/appointments/appointment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a meeting with a university department.
        </p>
      </header>
      <Card>
        <CardHeader>
            <CardTitle>Scheduler</CardTitle>
            <CardDescription>Select a date, department, and time slot for your appointment.</CardDescription>
        </CardHeader>
        <CardContent>
            <AppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
