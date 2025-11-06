'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function GuestLoginPage() {
  const [contactInfo, setContactInfo] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleGuestLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!emailRegex.test(contactInfo) && !phoneRegex.test(contactInfo)) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid email address or phone number.',
        variant: 'destructive',
      });
      return;
    }

    // Store guest contact info in session storage
    sessionStorage.setItem('guestContact', contactInfo);

    // Redirect to guest verification page
    router.push('/guest-verify');
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
          <CardTitle className="text-2xl font-bold font-headline">Guest Access</CardTitle>
          <CardDescription>
            Enter your email or phone number to proceed as a guest.
            This helps us keep track of your session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="contact">Email or Phone Number</Label>
              <div className="mt-2">
                <Input
                  id="contact"
                  name="contact"
                  type="text"
                  autoComplete="email"
                  required
                  placeholder="e.g., user@example.com or +1234567890"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button onClick={handleGuestLogin} className="w-full">
                Continue as Guest
              </Button>
            </div>
          </div>

           <p className="mt-6 text-center text-sm text-muted-foreground">
            A student or staff member?{' '}
            <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
