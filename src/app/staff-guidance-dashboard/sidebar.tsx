
'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Image from 'next/image';

export function StaffGuidanceSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/staff-guidance-dashboard" className="flex items-center gap-2">
          <Image src="/pulogo.png" alt="Panpacific University Logo" width={28} height={28} />
          <span className="text-lg font-semibold text-primary-foreground font-headline">
            Panpacific University
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 overflow-auto p-2">
        <SidebarGroup>
            <SidebarGroupLabel>Guidance Menu</SidebarGroupLabel>
            {/* Navigation items will be added here */}
        </SidebarGroup>
      </SidebarMenu>
    </Sidebar>
  );
}
