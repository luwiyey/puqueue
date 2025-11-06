import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BookUser, GraduationCap, Scale, Wallet } from 'lucide-react';
import Link from 'next/link';

const formCategories = [
  {
    department: "Registrar's Office",
    icon: BookUser,
    forms: [
      { title: "Transcript of Records (TOR) Request Form", href: "#" },
      { title: "Certification, Authentication, Verification (CAV) Application", href: "#" },
      { title: "Diploma Replacement Form", href: "#" },
    ]
  },
  {
    department: "Dean's Office",
    icon: GraduationCap,
    forms: [
      { title: "Good Moral Character Certificate Request", href: "#" },
      { title: "Cross-Enrollment Permit Form", href: "#" },
      { title: "Leave of Absence Application", href: "#" },
    ]
  },
  {
    department: "Finance Department",
    icon: Wallet,
    forms: [
      { title: "Scholarship Application Form", href: "#" },
      { title: "Promissory Note Form", href: "#" },
    ]
  },
    {
    department: "Legal Office",
    icon: Scale,
    forms: [
      { title: "Affidavit of Loss (for ID/Reg Form)", href: "#" },
    ]
  }
];

export default function FormsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Form Download Center</h1>
        <p className="text-muted-foreground">
          Find and download official university forms.
        </p>
      </header>

      <div className="space-y-6">
        {formCategories.map((category) => (
          <Card key={category.department}>
            <CardHeader className='flex-row items-center gap-4'>
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <category.icon className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="font-headline">{category.department}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                {category.forms.map(form => (
                    <Link href={form.href} key={form.title} download>
                        <Button variant="outline" className="w-full justify-between h-auto py-3 px-4">
                                <span className="text-left whitespace-normal">{form.title}</span>
                                <FileDown className="h-5 w-5 ml-2 flex-shrink-0" />
                        </Button>
                    </Link>
                ))}
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
