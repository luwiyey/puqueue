import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookUser, Building, FileSignature, GraduationCap, Scale, ShieldCheck, Wallet } from 'lucide-react';

const services = [
  {
    title: "Dean's Office",
    description: "Handles academic standing, grievance procedures, and certifications like Good Moral.",
    icon: GraduationCap,
    actions: [
      { label: "Request Good Moral Certificate", href: "/tickets/new?department=Dean's+Office&subject=Request+for+Good+Moral+Certificate" },
      { label: "File Academic Grievance", href: "/tickets/new?department=Dean's+Office&subject=Academic+Grievance" }
    ]
  },
  {
    title: "Registrar",
    description: "Manages student records, enrollment, and issuance of official documents.",
    icon: BookUser,
    actions: [
      { label: "Request Transcript of Records", href: "/tickets/new?department=Registrar&subject=Request+for+Transcript+of+Records" },
      { label: "Inquire about Graduation", href: "/tickets/new?department=Registrar&subject=Inquiry+about+Graduation" }
    ]
  },
  {
    title: "Guidance Office",
    description: "Provides counseling, career guidance, and support for student well-being.",
    icon: ShieldCheck,
    actions: [
      { label: "Schedule Counseling Session", href: "/appointments?department=Guidance" },
      { label: "Ask about Career Pathing", href: "/chatbot?department=Guidance" }
    ]
  },
  {
    title: "CSS Office",
    description: "Your first point of contact for student services and general inquiries.",
    icon: Building,
    actions: [
      { label: "Ask a General Question", href: "/chatbot?department=CSS" },
      { label: "Submit a General Ticket", href: "/tickets/new?department=CSS" }
    ]
  },
   {
    title: "Finance Department",
    description: "Handles tuition payments, financial clearances, and scholarship disbursements.",
    icon: Wallet,
    actions: [
      { label: "Inquire about Tuition Balance", href: "/tickets/new?department=Finance&subject=Tuition+Balance+Inquiry" },
      { label: "Follow-up on Scholarship", href: "/tickets/new?department=Finance&subject=Scholarship+Follow-up" }
    ]
  },
  {
    title: "Legal Office",
    description: "Provides legal counsel and handles disciplinary matters.",
    icon: Scale,
    actions: [
      { label: "Request Legal Consultation", href: "/appointments?department=Legal+Office" }
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Department Services</h1>
        <p className="text-muted-foreground">
          Explore services offered by various university departments.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title}>
            <CardHeader className='flex-row items-start gap-4'>
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <service.icon className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="font-headline">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                {service.actions.map(action => (
                    <Button key={action.label} variant="outline" asChild className="justify-between">
                        <Link href={action.href}>
                            {action.label}
                            <ArrowRight />
                        </Link>
                    </Button>
                ))}
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
