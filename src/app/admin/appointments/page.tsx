
import { GlobalAppointmentList } from "@/components/admin/appointments/global-appointment-list";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function AdminAppointmentsPage() {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Appointment Management</h1>
                    <p className="text-muted-foreground">
                        View and manage all appointments across the platform.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="Academic Advising">Academic Advising</SelectItem>
                            <SelectItem value="Career Services">Career Services</SelectItem>
                            <SelectItem value="Writing Center">Writing Center</SelectItem>
                            <SelectItem value="Financial Aid">Financial Aid</SelectItem>
                             <SelectItem value="Admissions">Admissions</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Slot
                    </Button>
                </div>
            </header>
            <GlobalAppointmentList />
        </div>
    )
}
