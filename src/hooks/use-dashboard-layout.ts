'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentReference } from 'firebase/firestore';
import type { DashboardWidget, UserProfile } from '@/lib/types';
import { useDoc, setDocumentNonBlocking } from '@/firebase';

const defaultWidgets: DashboardWidget[] = [
  { id: 'ticket-summary', visible: true },
  { id: 'recent-tickets', visible: true },
  { id: 'upcoming-appointments', visible: true },
  { id: 'announcements', visible: true },
  { id: 'academic-calendar', visible: true },
  { id: 'department-links', visible: true },
];

export function useDashboardLayout(userDocRef: DocumentReference | null) {
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);
  const [layout, setLayout] = useState<DashboardWidget[]>(defaultWidgets);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);

  useEffect(() => {
    if (!isLoadingProfile) {
      if (userProfile && userProfile.dashboardLayout) {
        // Merge saved layout with default layout to ensure all widgets are present
        const mergedLayout = defaultWidgets.map(defaultWidget => {
            const savedWidget = userProfile.dashboardLayout?.find(w => w.id === defaultWidget.id);
            return savedWidget ? savedWidget : defaultWidget;
        });
        setLayout(mergedLayout);
      } else {
        setLayout(defaultWidgets);
      }
      setIsLoadingLayout(false);
    }
  }, [userProfile, isLoadingProfile]);

  const saveLayout = useCallback(async () => {
    if (userDocRef) {
      // Use the non-blocking function with built-in error handling
      setDocumentNonBlocking(userDocRef, { dashboardLayout: layout }, { merge: true });
    }
  }, [userDocRef, layout]);

  return { layout, setLayout, saveLayout, isLoadingLayout };
}
