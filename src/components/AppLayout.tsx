
'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { AUTH_PATHS, STANDALONE_PATHS } from '@/lib/constants';
import { SidebarProvider } from '@/components/ui/sidebar';
import MainSidebar from '@/components/main-sidebar';
import MainHeader from '@/components/main-header';
import { DraggableFABs } from '@/components/draggable-fabs';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const isAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p));
  const isLandingPage = pathname === '/';
  const isStandalonePage = STANDALONE_PATHS.some(p => pathname.startsWith(p));

  // Render children directly for auth, landing, and standalone pages
  if (isAuthPage || isLandingPage || isStandalonePage) {
    return <>{children}</>;
  }

  // Render the full dashboard layout for all other pages
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <MainSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <MainHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
