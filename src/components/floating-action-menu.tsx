
"use client";

import * as React from "react";
import { Bot, ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useUser } from "@/firebase";

export function FloatingActionMenu() {
  const { user } = useUser();
  const [position, setPosition] = React.useState({ x: 24, y: 24 }); // Default position from bottom-right
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const fabRef = React.useRef<HTMLDivElement | null>(null);
  const offsetRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedPosition = localStorage.getItem("fab-position");
      if (savedPosition) {
        setPosition(JSON.parse(savedPosition));
      }
    } catch (error) {
      console.error("Failed to parse FAB position from localStorage", error);
      setPosition({ x: 24, y: 24 });
    }
  }, []);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!fabRef.current) return;
    
    setIsDragging(true);
    const fabRect = fabRef.current.getBoundingClientRect();
    offsetRef.current = {
        x: clientX - fabRect.left,
        y: clientY - fabRect.top,
    };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !fabRef.current) return;

    let newX = window.innerWidth - clientX - (fabRef.current.clientWidth - offsetRef.current.x);
    let newY = window.innerHeight - clientY - (fabRef.current.clientHeight - offsetRef.current.y);

    // Clamp position to be within viewport
    newX = Math.max(0, Math.min(newX, window.innerWidth - fabRef.current.clientWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - fabRef.current.clientHeight));

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    localStorage.setItem("fab-position", JSON.stringify(position));
  };
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, position]); // Re-add listeners if isDragging changes

  // Hide for guests or before client-side check
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={fabRef}
      className="fixed z-50 pointer-events-auto cursor-grab"
      style={{
        bottom: `${position.y}px`,
        right: `${position.x}px`,
        touchAction: 'none'
      }}
      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={(e) => {
              // Prevent popover from opening on drag end
              if (isDragging) e.preventDefault();
            }}
          >
            <Plus className="h-7 w-7" />
            <span className="sr-only">Open Quick Actions</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mb-2" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none font-headline">Quick Actions</h4>
              <p className="text-sm text-muted-foreground">
                Stay organized and get help instantly.
              </p>
            </div>
            <div className="grid gap-2">
              <Link href="/tasks" passHref>
                <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md p-2 transition-colors hover:bg-accent">
                  <ListTodo className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm font-medium">My Tasks</div>
                </div>
              </Link>
              <Link href="/chatbot" passHref>
                <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md p-2 transition-colors hover:bg-accent">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm font-medium">AI Assistant</div>
                </div>
              </Link>
              <p className="text-xs text-muted-foreground px-2 pt-2">
                Confused? Use the <span className="font-semibold text-primary">AI Assistant</span> to get answers or organize your to-do list with <span className="font-semibold text-primary">My Tasks</span>.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
