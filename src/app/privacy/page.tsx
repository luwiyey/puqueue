
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold font-headline">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last Updated: [Date]
          </p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Panpacific University ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our PUQueue AI application.
            </p>
            
            <h2 className='font-headline'>1. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect via the Application includes:
            </p>
            <ul>
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, student number, university email address, and contact information, that you voluntarily give to us when you register with the Application.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, and your access times.</li>
                <li><strong>Data from Tickets and Appointments:</strong> Information you provide when submitting a support ticket or booking an appointment, including the subject, description, and chosen department.</li>
            </ul>

            <h2 className='font-headline'>2. Use of Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
            </p>
            <ul>
                <li>Create and manage your account.</li>
                <li>Fulfill and manage support tickets and appointments.</li>
                <li>Email you regarding your account or order.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
                <li>Respond to your service requests and support needs.</li>
            </ul>

             <h2 className='font-headline'>3. Disclosure of Your Information</h2>
            <p>
              We do not share your personal information with third parties except as described in this Privacy Policy or with your consent. We may share information with university staff and administrators for the sole purpose of resolving your requests and providing services.
            </p>

            <h2 className='font-headline'>4. Security of Your Information</h2>
            <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
