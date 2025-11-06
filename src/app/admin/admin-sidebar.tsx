
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
import { BarChart, Upload, Users, Ticket, Calendar, Megaphone, MessageSquareHeart, Settings, FlaskConical, Database } from 'lucide-react';
import React from 'react';

const adminNavItems = [
  { href: '/admin/dashboard', icon: <BarChart />, label: 'Analytics' },
  { href: '/admin/tickets', icon: <Ticket />, label: 'Tickets' },
  { href: '/admin/appointments', icon: <Calendar />, label: 'Appointments' },
  { href: '/admin/users', icon: <Users />, label: 'Users' },
  { href: '/admin/feedback', icon: <MessageSquareHeart />, label: 'Feedback' },
  { href: '/admin/announcements', icon: <Megaphone />, label: 'Broadcasts' },
];

const aiNavItems = [
    { href: '/admin/training', icon: <Upload />, label: 'Train AI' },
    { href: '/admin/knowledge-base', icon: <Database />, label: 'Knowledge Base' },
]

const configNavItems = [
    { href: '/admin/settings', icon: <Settings />, label: 'Settings' },
];

const devNavItems = [
    { href: '/admin/sandbox', icon: <FlaskConical />, label: 'Sandbox' },
];


export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image src="/pulogo.png" alt="Panpacific University Logo" width={28} height={28} />
          <span className="text-lg font-semibold text-primary-foreground font-headline">
            Panpacific University
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 overflow-auto p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
          {adminNavItems.map((item) => (
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
            <SidebarGroupLabel>AI Management</SidebarGroupLabel>
             {aiNavItems.map((item) => (
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
            <SidebarGroupLabel>Configuration</SidebarGroupLabel>
             {configNavItems.map((item) => (
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
            <SidebarGroupLabel>Development</SidebarGroupLabel>
             {devNavItems.map((item) => (
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
