
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold font-headline">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last Updated: [Date]
          </p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the PUQueue AI application (the "Service") operated by Panpacific University ("us", "we", or "our").
            </p>
            
            <h2 className='font-headline'>1. Accounts</h2>
            <p>
              When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>

            <h2 className='font-headline'>2. Acceptable Use</h2>
            <p>
              You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the services, or the general business of Panpacific University.
            </p>
            
            <h2 className='font-headline'>3. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Panpacific University and its licensors.
            </p>

             <h2 className='font-headline'>4. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className='font-headline'>5. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
