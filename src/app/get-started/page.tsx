
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Home } from 'lucide-react';
import Link from 'next/link';

export default function GetStartedPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
       <Link href="/" className="absolute top-4 right-4">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6" />
        </Button>
      </Link>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline">Welcome to PU Queue</h1>
        <p className="text-muted-foreground mt-2 text-lg">Please select your role to continue.</p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
            <Link href="/login" className='block hover:bg-muted/50 rounded-lg'>
                <CardHeader className="items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                        <UserCheck className="h-12 w-12" />
                    </div>
                    <CardTitle className='font-headline text-2xl'>Student or Staff</CardTitle>
                    <CardDescription className='text-base'>
                    Sign in with your official university credentials to access your dashboard, tickets, and services.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" variant="default">Proceed to Sign In</Button>
                </CardContent>
            </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
            <Link href="/guest-login" className='block hover:bg-muted/50 rounded-lg'>
                <CardHeader className="items-center text-center">
                     <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                        <Users className="h-12 w-12" />
                    </div>
                    <CardTitle className='font-headline text-2xl'>Guest or Parent</CardTitle>
                    <CardDescription className='text-base'>
                    Access public resources, submit inquiries, and book appointments as a guest.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <Button className="w-full" variant="secondary">Continue as Guest</Button>
                </CardContent>
            </Link>
        </Card>
      </div>
    </div>
  );
}
