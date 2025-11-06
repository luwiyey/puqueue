
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function AboutPage() {
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
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold font-headline">About PU Queue</h1>
          <p className="text-lg text-muted-foreground">
            PU Queue is a transformative digital platform designed to modernize and streamline student services at Panpacific University. Our mission is to eliminate long lines, reduce administrative friction, and provide students with instant, accessible support.
          </p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              By leveraging cutting-edge artificial intelligence and a user-centric design, PU Queue integrates essential university services into a single, intuitive application. From an AI-powered chatbot that provides 24/7 assistance to a seamless appointment booking system and a centralized ticket tracking portal, we are dedicated to enhancing the student experience.
            </p>
            <h2 className='font-headline'>Our Vision</h2>
            <p>
              We envision a campus where students can focus on their education, not on navigating bureaucracy. PU Queue aims to be the digital front door to the university, a place where getting help is fast, simple, and effective. Our goal is to empower students with the tools they need to succeed and to provide administrators with the insights necessary to continuously improve services.
            </p>
            <h2 className='font-headline'>Key Features</h2>
            <ul>
              <li><strong>AI-Powered Chatbot:</strong> Instant answers to common questions, trained on official university documents.</li>
              <li><strong>Appointment Booking:</strong> Schedule meetings with departments and advisors without the back-and-forth emails.</li>
              <li><strong>Ticket Tracking:</strong> A centralized system to submit and monitor the status of all your support requests.</li>
              <li><strong>Admin Analytics:</strong> A powerful dashboard for staff to identify trends, optimize performance, and improve student satisfaction.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
