
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Link href="/">
            <Button variant="ghost">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8 text-center">
            <h1 className="text-4xl font-bold font-headline">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
                We're here to help. Reach out to us through the form below or using our direct contact information.
            </p>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                    <CardDescription>Fill out the form and we will get back to you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Juan Dela Cruz" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="juan.delacruz@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g., General Inquiry" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Type your message here..." rows={5}/>
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
            <div className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Direct Contact Details</CardTitle>
                        <CardDescription>You can also reach us through these channels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Address</h3>
                                <p className="text-muted-foreground">Panpacific University, Urdaneta City, Pangasinan, Philippines</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Phone</h3>
                                <p className="text-muted-foreground">(075) 600 1507</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-muted-foreground">discover@panpacificu.edu.ph</p>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
