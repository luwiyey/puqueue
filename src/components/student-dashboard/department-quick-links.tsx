'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookUser, FileSignature, Wallet } from 'lucide-react';
import Link from 'next/link';

const links = [
  {
    title: 'Request Good Moral',
    description: 'Get your certificate of good moral character.',
    icon: FileSignature,
    href: "/tickets/new?department=Dean's+Office&subject=Request+for+Good+Moral+Certificate",
    external: false,
  },
  {
    title: 'Request TOR/CAV',
    description: 'Official academic records and certification.',
    icon: BookUser,
    href: '/tickets/new?department=Registrar&subject=Request+for+Transcript+of+Records',
    external: false,
  },
  {
    title: 'Scholarship Office',
    description: 'Inquire about grants and scholarships.',
    icon: Wallet,
    href: '#', // Placeholder for external link
    external: true,
  },
];

export function DepartmentQuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">Department Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((link) => (
          <Link href={link.href} key={link.title} target={link.external ? '_blank' : '_self'}>
            <div className="group rounded-lg border p-3 transition-all hover:bg-accent hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{link.title}</h3>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
