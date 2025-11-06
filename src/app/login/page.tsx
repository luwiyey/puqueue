
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, initiateEmailSignUp } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import { Home } from 'lucide-react';
import Image from 'next/image';

// ✅ Final department-dashboard mapping based on your folders
const departmentPathMap: Record<string, string> = {
  finance: '/staff-finance-dashboard',
  css: '/staff-css-dashboard',
  registrar: '/staff-registrar-dashboard',
  guidance: '/staff-guidance-dashboard',
  deanoffice: '/staff-deanoffice-dashboard',
  kins: '/staff-kins-dashboard',
  library: '/staff-library-dashboard',
  legaloffice: '/staff-legaloffice-dashboard',
};

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const getDisplayNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    const mappedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    if (namePart === 'dean') return 'Dean Staff';
    if (namePart === 'legal') return 'Legal Staff';
    return mappedName + ' Staff';
  };

  // ✅ Detects the department and role automatically
  const getRoleFromEmail = (
    email: string
  ): { role: 'admin' | 'staff' | 'student'; department?: string } => {
    if (email === 'admin@panpacificu.edu.ph') {
      return { role: 'admin' };
    }

    const deptMatch = email.match(/^([a-z]+)@panpacificu\.edu\.ph$/);
    if (deptMatch) {
      const prefix = deptMatch[1];
      const departmentMap: Record<string, string> = {
        finance: 'finance',
        css: 'css',
        registrar: 'registrar',
        guidance: 'guidance',
        dean: 'deanoffice',
        kins: 'kins',
        library: 'library',
        legal: 'legaloffice',
      };
      const department = departmentMap[prefix];
      if (department) return { role: 'staff', department };
    }

    return { role: 'student' };
  };

  const redirectUser = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let role: string | undefined;
    let department: string | undefined;

    if (userDoc.exists()) {
      const data = userDoc.data();
      role = data.role;
      department = data.department;
    }

    // Auto-detect if missing in Firestore
    if (!role || (role === 'staff' && !department)) {
      const derived = getRoleFromEmail(user.email!);
      role = derived.role;
      department = derived.department;
      await setDoc(userDocRef, { role, department }, { merge: true });
    }

    // ✅ Redirection logic
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'staff') {
      const path = department ? departmentPathMap[department] : undefined;
      if (path) {
        router.push(path);
      } else {
        console.error(`No dashboard path found for department: ${department}`);
        toast({ title: "Configuration Error", description: "Your department dashboard is not configured.", variant: "destructive" });
      }
    } else {
      router.push('/student-dashboard');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.endsWith('@panpacificu.edu.ph')) {
      toast({
        title: 'Invalid Email',
        description:
          'Only @panpacificu.edu.ph accounts are allowed.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await redirectUser(userCredential.user);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await initiateEmailSignUp(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          const { role, department } = getRoleFromEmail(email);
          const displayName = getDisplayNameFromEmail(email);

          await updateProfile(user, { displayName });

          await setDoc(doc(firestore, 'users', user.uid), {
            id: user.uid,
            email: user.email,
            role,
            department,
            displayName,
            createdAt: serverTimestamp(),
          });

          toast({
            title: 'Account Created',
            description: 'Welcome to PU Queue!',
          });

          await redirectUser(user);
        } catch (signUpError: any) {
          toast({
            title: 'Sign-up Failed',
            description: signUpError.message,
            variant: 'destructive',
          });
        }
      } else {
        let description = 'Login failed. Please try again.';
        if (
          error.code === 'auth/wrong-password'
        ) {
          description = 'Incorrect email or password.';
        }
        toast({
          title: 'Login Failed',
          description,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col justify-center bg-background px-6 py-12 lg:px-8">
      <Link href="/" className="absolute top-4 right-4">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6" />
        </Button>
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image src="/pulogo.png" alt="Panpacific University Logo" width={48} height={48} className="mx-auto" />
        <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-foreground font-headline">
          Sign in to your account
        </h2>
      </div>

      <Card className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <CardContent className="pt-6">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm font-semibold text-primary hover:text-primary/80"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            A guest or parent?{' '}
            <Link
              href="/guest-login"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Continue as a guest
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
