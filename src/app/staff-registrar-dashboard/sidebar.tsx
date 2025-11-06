
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Binary,
  Send,
  HelpCircle,
  AreaChart,
  BadgeCheck,
} from 'lucide-react';

const navItems = [
    { href: '/staff-registrar-dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/staff-registrar-dashboard/document-requests', icon: <FileText />, label: 'Document Requests (TOR, COR, CAV, Good Moral)' },
    { href: '/staff-registrar-dashboard/request-queue', icon: <ClipboardList />, label: 'Request Queue' },
    { href: '/staff-registrar-dashboard/verification-logs', icon: <BadgeCheck />, label: 'Verification Logs' },
    { href: '/staff-registrar-dashboard/ai-routing', icon: <Binary />, label: 'AI Document Routing' },
    { href: '/staff-registrar-dashboard/delivery-tracker', icon: <Send />, label: 'Document Delivery Tracker' },
    { href: '/staff-registrar-dashboard/inquiries', icon: <HelpCircle />, label: 'Academic Record Inquiries' },
    { href: '/staff-registrar-dashboard/reports', icon: <AreaChart />, label: 'Reports & Summaries' },
]

export function StaffRegistrarSidebar() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    // Exact match for dashboard, startsWith for others
    if (href === '/staff-registrar-dashboard') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/staff-registrar-dashboard" className="flex items-center gap-2">
          <Image src="/pulogo.png" alt="Panpacific University Logo" width={28} height={28} />
          <span className="text-lg font-semibold text-primary-foreground font-headline">
            Panpacific University
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 overflow-auto p-2">
        <SidebarGroup>
            <SidebarGroupLabel>Registrar Menu</SidebarGroupLabel>
            {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label }}
                >
                <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            ))}
        </SidebarGroup>
      </SidebarMenu>
    </Sidebar>
  );
}
