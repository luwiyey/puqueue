
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { AUTH_PATHS } from '@/lib/constants';
import { StudentSidebar } from '@/app/student-dashboard/sidebar';
import { GuestSidebar } from '@/components/guest/guest-sidebar';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Sidebar } from './ui/sidebar';

// Dynamically import all possible staff sidebars
const staffSidebars: Record<string, React.FC> = {
  css: React.lazy(() => import('@/app/staff-css-dashboard/sidebar').then(module => ({ default: module.StaffCssSidebar }))),
  registrar: React.lazy(() => import('@/app/staff-registrar-dashboard/sidebar').then(module => ({ default: module.StaffRegistrarSidebar }))),
  guidance: React.lazy(() => import('@/app/staff-guidance-dashboard/sidebar').then(module => ({ default: module.StaffGuidanceSidebar }))),
  deanoffice: React.lazy(() => import('@/app/staff-deanoffice-dashboard/sidebar').then(module => ({ default: module.StaffDeanOfficeSidebar }))),
  finance: React.lazy(() => import('@/app/staff-finance-dashboard/sidebar').then(module => ({ default: module.StaffFinanceSidebar }))),
  kins: React.lazy(() => import('@/app/staff-kins-dashboard/sidebar').then(module => ({ default: module.StaffKinsSidebar }))),
  library: React.lazy(() => import('@/app/staff-library-dashboard/sidebar').then(module => ({ default: module.StaffLibrarySidebar }))),
  legaloffice: React.lazy(() => import('@/app/staff-legaloffice-dashboard/sidebar').then(module => ({ default: module.StaffLegalOfficeSidebar }))),
};

const LoadingSidebar = () => (
    <Sidebar>
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-sidebar-foreground" />
        </div>
    </Sidebar>
);


export default function MainSidebar() {
  const pathname = usePathname();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const onAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p)) || pathname === '/';
  
  // Do not render anything on auth pages
  if (onAuthPage || !isClient) {
    return null;
  }

  const isLoading = isAuthLoading || isProfileLoading;
  
  if (isLoading) {
    return <LoadingSidebar />;
  }
  
  // After loading, determine the role from the user profile if available, or auth state.
  const role = userProfile?.role;
  const department = userProfile?.department as keyof typeof staffSidebars | undefined;

  // If we have an authenticated user, we MUST show their designated sidebar.
  if (user && !user.isAnonymous) {
    switch (role) {
      case 'admin':
        return <AdminSidebar />;
      case 'staff':
        if (department && staffSidebars[department]) {
          const StaffSidebar = staffSidebars[department];
          return <Suspense fallback={<LoadingSidebar />}><StaffSidebar /></Suspense>;
        }
        // Staff member with an unhandled department. Show a loading/error state, NOT another sidebar.
        return <LoadingSidebar />; 
      case 'student':
        return <StudentSidebar />;
      default:
        // This case handles a logged-in user with no role in Firestore (e.g., during account creation).
        // It's crucial to show a loading state, not a guest/student sidebar.
        return <LoadingSidebar />;
    }
  }

  // Only render GuestSidebar if there is absolutely no authenticated user or they are anonymous.
  return <GuestSidebar />;
}
