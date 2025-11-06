"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { addDocumentNonBlocking, useAuth, useFirestore, useUser } from "@/firebase";
import { collection, Timestamp } from 'firebase/firestore';
import type { Appointment } from "@/lib/types";
import { set } from 'date-fns';
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

const departments = [
  "Academic Advising",
  "Career Services",
  "Writing Center",
  "Financial Aid",
  "Admissions",
];

const timeSlots = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00"
];

export function AppointmentForm() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [department, setDepartment] = React.useState<string>("");
  const [time, setTime] = React.useState<string>("");
  const [subject, setSubject] = React.useState<string>("");
  const [contactInfo, setContactInfo] = React.useState<string>("");
  const [useSchoolEmail, setUseSchoolEmail] = React.useState(true);
  
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();

  const isGuest = !user || user.isAnonymous;

  React.useEffect(() => {
    if(useSchoolEmail && user && user.email) {
      setContactInfo(user.email);
    } else {
      setContactInfo("");
    }
  }, [useSchoolEmail, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !department || !time || (isGuest && !contactInfo)) {
      let description = "Please select a date, department, and time.";
      if (isGuest && !contactInfo) {
        description = "Please provide a contact email or phone number.";
      }
      toast({
        title: "Incomplete Information",
        description,
        variant: "destructive",
      });
      return;
    }

    if (!auth.currentUser) {
        toast({
            title: 'Not Authenticated',
            description: 'You must be logged in to book an appointment.',
            variant: 'destructive'
        });
        return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDateTime = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });

    const appointmentData: Omit<Appointment, 'id'> = {
        studentId: auth.currentUser.uid,
        department,
        dateTime: Timestamp.fromDate(appointmentDateTime),
        type: 'In-Person', // Defaulting to In-Person for now
        status: 'Pending',
        subject: subject || undefined,
        contactInfo: useSchoolEmail ? user?.email : contactInfo,
    };
    
    const appointmentsColRef = collection(firestore, 'users', auth.currentUser.uid, 'appointments');
    addDocumentNonBlocking(appointmentsColRef, appointmentData);

    toast({
      title: "Appointment Booked!",
      description: `Your meeting with ${department} is set for ${date.toLocaleDateString()} at ${time}.`,
    });

    // Reset form
    setDate(new Date());
    setDepartment("");
    setTime("");
    setSubject("");
    setContactInfo("");
    setUseSchoolEmail(true);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
        />
      </div>
      <div className="space-y-6 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label>Department</Label>
                <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                    {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                        {dept}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label>Time Slot</Label>
                <Select onValueChange={setTime} value={time}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                    <div className="grid grid-cols-3 gap-2 p-2">
                    {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot} className="flex justify-center">
                            {new Date(`1970-01-01T${slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </SelectItem>
                    ))}
                    </div>
                </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid gap-2">
            <Label htmlFor="subject">Subject (Optional)</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Inquiry about grades, Follow-up on application"/>
        </div>

        <div className="grid gap-2">
            {isGuest ? (
                <>
                    <Label htmlFor="contactInfo">Contact Email or Phone <span className="text-destructive">*</span></Label>
                    <Input id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="your.email@example.com or 09123456789" required />
                </>
            ) : (
                <>
                    <Label>Contact Information</Label>
                    <div className="space-y-2">
                         <div className="flex items-center space-x-2">
                            <Checkbox id="use-school-email" checked={useSchoolEmail} onCheckedChange={(checked) => setUseSchoolEmail(Boolean(checked))} />
                            <label htmlFor="use-school-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Use my school email ({user?.email})
                            </label>
                        </div>
                        {!useSchoolEmail && (
                            <Input id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Alternative email or phone number" />
                        )}
                    </div>
                </>
            )}
        </div>
        
        <Button type="submit" className="w-full sm:w-auto">Book Appointment</Button>
      </div>
    </form>
  );
}
