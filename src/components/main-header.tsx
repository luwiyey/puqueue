import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationCenter } from '@/components/notification-center';
import { UserNav } from '@/components/user-nav';
import { GuestNav } from './guest/guest-nav';
import { Button } from './ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <Link href="/" passHref>
           <Button variant="ghost" size="icon" aria-label="Home">
                <Home className="h-5 w-5 text-foreground/80 hover:text-foreground" />
            </Button>
        </Link>
        <NotificationCenter />
        <UserNav />
        <GuestNav />
      </div>
    </header>
  );
}
