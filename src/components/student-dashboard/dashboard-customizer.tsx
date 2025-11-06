
'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardWidget } from '@/lib/types';
import { Button } from '../ui/button';

interface DashboardCustomizerProps {
  layout: DashboardWidget[];
  setLayout: (layout: DashboardWidget[]) => void;
  onSave: () => void;
}

const widgetLabels: Record<string, string> = {
    'recent-tickets': 'Recent Tickets',
    'upcoming-appointments': 'Upcoming Appointments',
    'announcements': 'Announcements',
    'academic-calendar': 'Academic Calendar',
    'ticket-summary': 'Ticket Summary',
    'department-links': 'Department Services',
};

export function DashboardCustomizer({ layout, setLayout, onSave }: DashboardCustomizerProps) {
  const handleToggle = (id: string) => {
    setLayout(
      layout.map(widget =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  return (
    <div className="space-y-4">
        <div className="space-y-1">
            <h4 className="font-medium leading-none font-headline">Customize Widgets</h4>
            <p className="text-sm text-muted-foreground">
                Toggle visibility of dashboard widgets.
            </p>
        </div>
      
        <div className="space-y-4">
            {layout.map(widget => (
            <div key={widget.id} className="flex items-center justify-between">
                <Label htmlFor={`widget-${widget.id}`} className="text-sm">
                {widgetLabels[widget.id] || widget.id}
                </Label>
                <Switch
                id={`widget-${widget.id}`}
                checked={widget.visible}
                onCheckedChange={() => handleToggle(widget.id)}
                />
            </div>
            ))}
        </div>
        <Button onClick={onSave} className="w-full">Save Preferences</Button>
    </div>
  );
}
