'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, initiateAnonymousSignIn } from '@/firebase';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function GuestVerifyPage() {
  const [code, setCode] = useState('');
  const [contact, setContact] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();


  useEffect(() => {
    // Retrieve contact info from session storage
    const storedContact = sessionStorage.getItem('guestContact');
    if (storedContact) {
      setContact(storedContact);
      // In a real app, you would send a verification code here.
      // For this demo, we'll just log it.
      console.log(`Sent verification code to ${storedContact}. The code is 123456.`);
      toast({
        title: 'Verification Code Sent',
        description: `A code has been sent to ${storedContact}. (Hint: it's 123456)`,
      });
    } else {
      // If no contact info, redirect to guest login
      router.push('/guest-login');
    }
  }, [router, toast]);

  const handleVerify = async () => {
    // For demo purposes, the code is always "123456"
    if (code === '123456') {
      try {
        await initiateAnonymousSignIn(auth);
        // The onAuthStateChanged listener in FirebaseProvider will handle the redirect.
        // But we can optimistically redirect here.
        router.push('/guest-dashboard');

      } catch (error) {
        console.error("Anonymous sign-in failed:", error);
        toast({
            title: 'Authentication Failed',
            description: 'Could not start a guest session. Please try again.',
            variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Invalid Code',
        description: 'The verification code is incorrect. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative flex min-h-full flex-col justify-center bg-background px-6 py-12 lg:px-8">
      <Link href="/" className="absolute top-4 right-4">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6" />
        </Button>
      </Link>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Verify Your Identity</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {contact}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Input
                id="code"
                name="code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg tracking-[0.5em]"
              />
            </div>

            <div>
              <Button onClick={handleVerify} className="w-full" disabled={code.length !== 6}>
                Verify & Continue
              </Button>
            </div>
             <div className="text-center text-sm">
                <button className="text-primary hover:underline" onClick={() => {
                    toast({ description: "Another code has been sent. (Hint: it's still 123456)"});
                }}>
                    Resend code
                </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
