'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SHOW_DURATION = 2 * 60 * 1000; // 2 minutes
const REAPPEAR_INTERVAL = 5 * 60 * 1000; // 5 minutes
const INITIAL_DELAY_MIN = 5000; // 5 seconds
const INITIAL_DELAY_MAX = 15000; // 15 seconds

export function CampusBroadcastBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check session storage on mount
    const dismissed = sessionStorage.getItem('announcementDismissed') === 'true';
    setIsDismissed(dismissed);

    if (dismissed) {
        return;
    }

    const randomInitialDelay = Math.random() * (INITIAL_DELAY_MAX - INITIAL_DELAY_MIN) + INITIAL_DELAY_MIN;

    // Show initially after random delay
    const initialShowTimer = setTimeout(() => {
      setIsVisible(true);
    }, randomInitialDelay);

    return () => clearTimeout(initialShowTimer);

  }, []);

  useEffect(() => {
    if(isDismissed) {
        setIsVisible(false);
        return;
    }

    if (isVisible) {
      // Hide after 2 minutes
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, SHOW_DURATION);

      return () => clearTimeout(hideTimer);
    } else {
        // Re-show every 5 minutes if not visible and not dismissed
        const reappearTimer = setInterval(() => {
            if (sessionStorage.getItem('announcementDismissed') !== 'true') {
                 setIsVisible(true);
            }
        }, REAPPEAR_INTERVAL);

        return () => clearInterval(reappearTimer);
    }

  }, [isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('announcementDismissed', 'true');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className={cn(
        'relative mb-6 animate-flash rounded-lg border-2'
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-headline">URGENT ANNOUNCEMENT</AlertTitle>
      <AlertDescription>
        Classes are suspended effective immediately due to Typhoon Emong hitting Urdaneta, Pangasinan. Please stay indoors and monitor official channels for updates.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-destructive-foreground/70 hover:text-destructive-foreground"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
