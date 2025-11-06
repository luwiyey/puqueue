'use client';

import { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';
import { doc } from 'firebase/firestore';
import { Loader2, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DashboardGridLayout } from '@/components/student-dashboard/dashboard-grid-layout';
import { DashboardCustomizer } from '@/components/student-dashboard/dashboard-customizer';
import { Button } from '@/components/ui/button';
import { CampusBroadcastBanner } from '@/components/campus-broadcast-banner';

export default function StudentDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  const { layout, setLayout, saveLayout, isLoadingLayout } = useDashboardLayout(userDocRef);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSaveChanges = () => {
    saveLayout();
    setIsSheetOpen(false);
    setIsCustomizeMode(false);
  };

  if (isLoadingLayout) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <CampusBroadcastBanner />

        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Welcome, {user?.displayName?.split(' ')[0] || 'Student'}!
                </h1>
                <p className="text-muted-foreground">
                    Here's a quick overview of your student services.
                </p>
            </div>
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" onClick={() => setIsCustomizeMode(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Customize Dashboard
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Customize Dashboard</SheetTitle>
                        <SheetDescription>
                            Toggle visibility of widgets and save your preferences.
                        </SheetDescription>
                    </SheetHeader>
                    <div className='py-4'>
                        <DashboardCustomizer layout={layout} setLayout={setLayout} onSave={handleSaveChanges} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <DashboardGridLayout 
            layout={layout}
            isCustomizeMode={isCustomizeMode}
            setLayout={setLayout}
        />
    </div>
  );
}
