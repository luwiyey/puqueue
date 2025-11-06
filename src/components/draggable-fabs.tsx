
"use client";

import { AccessibilityMenu } from "./accessibility-menu";
import { FloatingActionMenu } from "./floating-action-menu";
import { VoiceCommandWrapper } from "./voice-command-wrapper";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { usePathname } from "next/navigation";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";

/**
 * This component ensures that its children, which may depend on browser-specific APIs
 * like localStorage or the Web Speech API, are only rendered on the client-side.
 * It also conditionally renders FABs based on user role and path.
 */
export function DraggableFABs() {
  const { user } = useUser();
  const pathname = usePathname();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && !user.isAnonymous ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const role = userProfile?.role;
  const isGuest = user?.isAnonymous;
  const isPublicPage = pathname === '/' || pathname === '/get-started' || pathname.startsWith('/auth');

  // Specific check for student or registrar staff
  const showExtendedFabs = role === 'student' || (role === 'staff' && userProfile?.department === 'registrar');

  // Admins have settings elsewhere, so no FABs for them.
  if (role === 'admin') {
    return null;
  }
  
  // Public pages and guests get specific FABs.
  if (isPublicPage || isGuest) {
      return (
          <>
            <AccessibilityMenu />
            {/* Show voice commands for guests, but not on public/unauthenticated pages */}
            {isGuest && <VoiceCommandWrapper />}
          </>
      )
  }

  // Handle authenticated, non-admin users (students, staff, etc.)
  return (
    <>
      <AccessibilityMenu />
      {/* 
        Conditionally render the Quick Actions and Voice Command FABs.
        - Show if the user role is 'student' or 'registrar'.
      */}
      {showExtendedFabs && (
        <>
          <FloatingActionMenu />
          <VoiceCommandWrapper />
        </>
      )}
    </>
  );
}
