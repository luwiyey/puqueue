
'use client';

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketListClient } from "@/components/tickets/ticket-list-client";
import { useUser } from "@/firebase";

export default function TicketsPage() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
             <div className="text-center">
                <p>Loading tickets...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="text-center">
                <p>Please log in to view your tickets.</p>
                <Button asChild><Link href="/login">Login</Link></Button>
            </div>
        );
    }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Support Tickets</h1>
            <p className="text-muted-foreground">
            Track and manage all your requests in one place.
            </p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="mr-2" />
            New Ticket
          </Link>
        </Button>
      </header>
      <TicketListClient userId={user.uid} />
    </div>
  );
}
