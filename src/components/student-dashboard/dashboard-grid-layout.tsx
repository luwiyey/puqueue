
'use client';

import React from 'react';
import { Responsive, WidthProvider, Layout as RGL_Layout } from 'react-grid-layout';
import type { DashboardWidget as WidgetConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import all possible widget components
import { RecentTicketsWidget } from './recent-tickets-widget';
import { UpcomingAppointmentsWidget } from './upcoming-appointments-widget';
import { AnnouncementsWidget } from './announcements-widget';
import { AcademicCalendarWidget } from './academic-calendar-widget';
import { DepartmentQuickLinks } from './department-quick-links';
import { TicketSummaryWidget } from './ticket-summary-widget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetMap: Record<string, React.ComponentType> = {
  'recent-tickets': RecentTicketsWidget,
  'upcoming-appointments': UpcomingAppointmentsWidget,
  'announcements': AnnouncementsWidget,
  'academic-calendar': AcademicCalendarWidget,
  'department-links': DepartmentQuickLinks,
  'ticket-summary': TicketSummaryWidget,
};

// Define default layouts for different breakpoints
const defaultLayouts = {
  lg: [
    { i: 'ticket-summary', x: 0, y: 0, w: 1, h: 1, static: false },
    { i: 'department-links', x: 0, y: 1, w: 1, h: 2, static: false },
    { i: 'recent-tickets', x: 1, y: 0, w: 2, h: 3, static: false },
    { i: 'academic-calendar', x: 0, y: 3, w: 1, h: 3, static: false },
    { i: 'announcements', x: 1, y: 3, w: 1, h: 3, static: false },
    { i: 'upcoming-appointments', x: 2, y: 3, w: 1, h: 3, static: false },
  ],
  // Add other breakpoints if needed (md, sm, xs)
};

interface DashboardGridLayoutProps {
  layout: WidgetConfig[];
  isCustomizeMode: boolean;
  setLayout: (newLayout: WidgetConfig[]) => void;
}

export const DashboardGridLayout = ({ layout, isCustomizeMode, setLayout }: DashboardGridLayoutProps) => {

  const onLayoutChange = (currentLayout: RGL_Layout[]) => {
      if (!isCustomizeMode) return;
      // This function can be used to update layout in real-time if needed,
      // but for now, we only care about visibility from the customizer.
  };

  const getGridLayout = (widgetId: string) => {
    // Find layout config from any breakpoint, assuming they are consistent for now
    const config = defaultLayouts.lg.find(l => l.i === widgetId);
    return config || { i: widgetId, x: 0, y: 0, w: 1, h: 1 };
  };

  const visibleWidgets = layout.filter(w => w.visible);

  return (
    <ResponsiveGridLayout
      className={cn("layout", isCustomizeMode && "border-2 border-dashed rounded-lg p-2 bg-muted/20")}
      layouts={defaultLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
      rowHeight={150}
      isDraggable={isCustomizeMode}
      isResizable={isCustomizeMode}
      onLayoutChange={onLayoutChange}
    >
      {visibleWidgets.map(widgetConfig => {
        const Component = widgetMap[widgetConfig.id];
        if (!Component) return null;

        return (
          <div key={widgetConfig.id} data-grid={getGridLayout(widgetConfig.id)}>
            <Component />
             {isCustomizeMode && <div className="absolute inset-0 bg-slate-500/10 flex items-center justify-center cursor-move rounded-md">
                <p className="text-sm font-semibold text-background bg-foreground/70 px-2 py-1 rounded">{widgetConfig.id}</p>
             </div>}
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};
