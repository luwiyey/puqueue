
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
  Calendar,
  Ticket,
  Bot,
  Briefcase,
  MessageSquareHeart,
  FileDown,
} from 'lucide-react';

const guestNavItems = [
    { href: '/guest-dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/services', icon: <Briefcase />, label: 'Services' },
    { href: '/forms', icon: <FileDown />, label: 'Form Downloads' },
    { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
    { href: '/chatbot', icon: <Bot />, label: 'AI Chatbot' },
    { href: '/tickets/new', icon: <Ticket />, label: 'Submit Ticket' },
    { href: '/feedback', icon: <MessageSquareHeart />, label: 'Feedback' },
];

export function GuestSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // This allows parent routes to be highlighted correctly.
    // e.g. /services will be active even if on /services/something
    if (href !== '/guest-dashboard' && pathname.startsWith(href)) {
        return true;
    }
    // Exact match for dashboard
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/guest-dashboard" className="flex items-center gap-2">
          <Image src="/pulogo.png" alt="Panpacific University Logo" width={28} height={28} />
          <span className="text-lg font-semibold text-primary-foreground font-headline">
            Panpacific University
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 overflow-auto p-2">
        <SidebarGroup>
            <SidebarGroupLabel>Guest Menu</SidebarGroupLabel>
            {guestNavItems.map((item) => (
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

    