'use client';

import type { TicketHistoryEntry } from "@/lib/types";
import { format } from 'date-fns';
import { MessageSquare, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketTimelineProps {
    history?: TicketHistoryEntry[];
}

export function TicketTimeline({ history }: TicketTimelineProps) {
    if (!history || history.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                <p>No messages or updates yet.</p>
                <p className="text-xs">Replies and status changes will appear here.</p>
            </div>
        );
    }
    
    // Sort history chronologically just in case
    const sortedHistory = [...history].sort((a, b) => a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime());

    return (
        <div className="space-y-8">
            {sortedHistory.map((entry, index) => (
                <div key={index} className="flex gap-4 relative">
                    <div className="absolute left-5 top-5 h-full w-0.5 bg-border -translate-x-1/2"></div>
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {entry.type === 'comment' ? (
                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <Tag className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{entry.author}</p>
                            <p className="text-xs text-muted-foreground">
                                {format(entry.timestamp.toDate(), 'PPp')}
                            </p>
                        </div>
                        <p className={cn("text-sm", entry.type === 'status_change' && 'text-muted-foreground italic')}>
                            {entry.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
