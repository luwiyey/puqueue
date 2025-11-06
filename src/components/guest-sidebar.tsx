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
import { Logo } from '@/components/icons';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Bot,
  Briefcase,
  MessageSquareHeart,
} from 'lucide-react';

const guestNavItems = [
    { href: '/guest-dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/services', icon: <Briefcase />, label: 'Services' },
    { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
    { href: '/chatbot', icon: <Bot />, label: 'AI Chatbot' },
    { href: '/tickets/new', icon: <Ticket />, label: 'Submit Ticket' },
    { href: '/feedback', icon: <MessageSquareHeart />, label: 'Feedback' },
];

export function GuestSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Make appointment link active even on detail pages etc.
    if (href.startsWith('/appointments') && pathname.startsWith('/appointments')) return true;
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/guest-dashboard" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary-foreground" />
          <span className="text-lg font-semibold text-primary-foreground font-headline">
            PUQueue AI
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
