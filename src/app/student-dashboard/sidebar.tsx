
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Bot,
  BarChart,
  Briefcase,
  ListTodo,
  MessageSquareHeart,
  LifeBuoy,
  FileDown,
} from 'lucide-react';
import React from 'react';

const studentNavItems = [
  { href: '/student-dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
  { href: '/services', icon: <Briefcase />, label: 'Department Services' },
  { href: '/forms', icon: <FileDown />, label: 'Form Downloads' },
  { href: '/tickets', icon: <Ticket />, label: 'Tickets' },
  { href: '/tasks', icon: <ListTodo />, label: 'My Tasks' },
  { href: '/chatbot', icon: <Bot />, label: 'AI Assistant' },
  { href: '/analytics', icon: <BarChart />, label: 'Analytics' },
];

export function StudentSidebar() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (pathname.startsWith('/tickets') && href === '/tickets') return true;
    if (pathname.startsWith('/appointments') && href === '/appointments') return true;
    if (pathname.startsWith('/services') && href === '/services') return true;
    if (pathname.startsWith('/forms') && href === '/forms') return true;
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/student-dashboard" className="flex items-center gap-2">
          <Image src="/pulogo.png" alt="Panpacific University Logo" width={28} height={28} />
          <span className="text-lg font-semibold text-primary-foreground font-headline">
            Panpacific University
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 overflow-auto p-2">
        <SidebarGroup>
            <SidebarGroupLabel>Student Menu</SidebarGroupLabel>
            {studentNavItems.map((item) => (
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
        
        <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isActive('/help')}
                    tooltip={{ children: 'Help Center' }}
                >
                    <Link href="/help">
                        <LifeBuoy />
                        <span>Help Center</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isActive('/feedback')}
                    tooltip={{ children: 'Anonymous Feedback' }}
                >
                    <Link href="/feedback">
                        <MessageSquareHeart />
                        <span>Give Feedback</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>
      
      <SidebarFooter className="p-2 flex flex-row items-center gap-2 group-data-[collapsible=icon]:flex-col">
        {/* UserNav and NotificationCenter are in MainHeader */}
      </SidebarFooter>
    </Sidebar>
  );
}
