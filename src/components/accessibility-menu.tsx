
"use client";

import * as React from "react";
import Image from 'next/image';
import { Moon, Sun, Monitor, Check, Play, Pause, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = React.useState("base");
  const [fontFamily, setFontFamily] = React.useState("font-body");
  const [theme, setTheme] = React.useState("system");
  const [isHighContrast, setIsHighContrast] = React.useState(false);
  
  // Read Aloud State
  const [isReadAloudEnabled, setIsReadAloudEnabled] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const currentUtteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const currentlyHighlightedElement = React.useRef<HTMLElement | null>(null);


  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 24, y: 100 }); 
  const fabRef = React.useRef<HTMLDivElement | null>(null);
  const offsetRef = React.useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = React.useState(false);

  // --- Core Speech Synthesis Logic ---

  const speak = (text: string, elementToHighlight?: HTMLElement) => {
    if (!window.speechSynthesis) return;

    // Cleanup previous utterance
    window.speechSynthesis.cancel();
    if (currentlyHighlightedElement.current) {
        currentlyHighlightedElement.current.style.outline = "";
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        if (elementToHighlight) {
            elementToHighlight.style.outline = "2px solid hsl(var(--primary))";
            currentlyHighlightedElement.current = elementToHighlight;
        }
    };

    utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (currentlyHighlightedElement.current) {
            currentlyHighlightedElement.current.style.outline = "";
            currentlyHighlightedElement.current = null;
        }
    };

    utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
         if (currentlyHighlightedElement.current) {
            currentlyHighlightedElement.current.style.outline = "";
            currentlyHighlightedElement.current = null;
        }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleReadPage = () => {
    const mainContent = document.querySelector('main')?.innerText || '';
    speak(mainContent, document.querySelector('main') as HTMLElement);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
    }
  };

  const handlePlay = () => {
     if (window.speechSynthesis.paused && isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    if (currentlyHighlightedElement.current) {
        currentlyHighlightedElement.current.style.outline = "";
        currentlyHighlightedElement.current = null;
    }
  };
  
  // Hover-to-speak logic
  React.useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
        if (!isReadAloudEnabled || isSpeaking) return;

        const target = event.target as HTMLElement;
        const readableElements = "p, h1, h2, h3, h4, h5, h6, span, a, button, li, label";

        if (target.matches(readableElements) && target.innerText) {
            // Prevent speaking nested elements if a parent is already being read
            if (currentlyHighlightedElement.current?.contains(target)) return;
            
            speak(target.innerText, target);
        }
    };

    if (isReadAloudEnabled) {
        document.addEventListener("mouseover", handleMouseOver);
    } else {
        handleStop(); // Stop any speech when disabled
    }

    return () => {
        document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isReadAloudEnabled, isSpeaking]);


  React.useEffect(() => {
    setIsMounted(true);
    try {
        const savedPosition = localStorage.getItem("accessibility-fab-position");
        if (savedPosition) {
            setPosition(JSON.parse(savedPosition));
        }
    } catch (error) {
        console.error("Failed to parse FAB position from localStorage", error);
        setPosition({ x: 24, y: 100 });
    }
  }, []);

  React.useEffect(() => {
    document.body.classList.remove("font-size-sm", "font-size-lg", "font-size-xl");
    if (fontSize !== "base") {
      document.body.classList.add(`font-size-${fontSize}`);
    }
  }, [fontSize]);
  
  React.useEffect(() => {
    document.body.classList.remove("font-body", "font-headline", "font-lexend");
    document.body.classList.add(fontFamily);
  }, [fontFamily]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
    } else {
        root.classList.add(theme);
    }
  }, [theme]);
  
  React.useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
        root.classList.add("high-contrast");
    } else {
        root.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

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

    newX = Math.max(0, Math.min(newX, window.innerWidth - fabRef.current.clientWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - fabRef.current.clientHeight));

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    localStorage.setItem("accessibility-fab-position", JSON.stringify(position));
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
  }, [isDragging, position]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
        ref={fabRef}
        className="fixed z-50 cursor-grab"
        style={{
            bottom: `${position.y}px`,
            right: `${position.x}px`,
            touchAction: 'none'
        }}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
    >
        <Popover onOpenChange={(open) => !open && handleStop()}>
        <PopoverTrigger asChild>
            <Button
            variant="secondary"
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center"
             onClick={(e) => {
                if (isDragging) e.preventDefault();
            }}
            >
            <Image src="/accesibility.png" alt="Accessibility Menu" width={44} height={44} />
            <span className="sr-only">Open Accessibility Menu</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
            <div className="grid gap-6">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none font-headline">Accessibility</h4>
                    <p className="text-sm text-muted-foreground">
                    Customize the appearance of the application.
                    </p>
                </div>
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="read-aloud">Read Aloud</Label>
                            <p className="text-xs text-muted-foreground">Hear text on the page.</p>
                        </div>
                        <Switch id="read-aloud" checked={isReadAloudEnabled} onCheckedChange={setIsReadAloudEnabled} />
                    </div>

                    {isReadAloudEnabled && (
                        <div className="space-y-4 rounded-md border p-4">
                             <Button onClick={handleReadPage} className="w-full" disabled={isSpeaking}>
                                <Volume2 className="mr-2"/> Read Entire Page
                            </Button>
                            <div className="flex justify-center gap-2">
                                <Button size="icon" variant="outline" onClick={handlePlay} disabled={!isPaused || !isSpeaking}>
                                    <Play />
                                </Button>
                                <Button size="icon" variant="outline" onClick={handlePause} disabled={isPaused || !isSpeaking}>
                                    <Pause />
                                </Button>
                                <Button size="icon" variant="outline" onClick={handleStop} disabled={!isSpeaking}>
                                    <Square />
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    <Separator />

                    <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant={fontSize === 'sm' ? 'primary' : 'outline'} onClick={() => setFontSize('sm')} className="text-xs">A</Button>
                        <Button variant={fontSize === 'base' ? 'primary' : 'outline'} onClick={() => setFontSize('base')} className="text-base">A</Button>
                        <Button variant={fontSize === 'lg' ? 'primary' : 'outline'} onClick={() => setFontSize('lg')} className="text-lg">A</Button>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label>Readable Font</Label>
                    <Select onValueChange={setFontFamily} defaultValue={fontFamily}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="font-body">Default (Inter)</SelectItem>
                        <SelectItem value="font-lexend">Readable (Lexend)</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    
                    <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant={theme === 'light' ? 'primary' : 'outline'} size="icon" onClick={() => setTheme('light')}>
                        <Sun className="h-5 w-5" />
                        </Button>
                        <Button variant={theme === 'dark' ? 'primary' : 'outline'} size="icon" onClick={() => setTheme('dark')}>
                        <Moon className="h-5 w-5" />
                        </Button>
                        <Button variant={theme === 'system' ? 'primary' : 'outline'} size="icon" onClick={() => setTheme('system')}>
                        <Monitor className="h-5 w-5" />
                        </Button>
                    </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="high-contrast">High Contrast</Label>
                            <p className="text-xs text-muted-foreground">Improves text visibility.</p>
                        </div>
                    <Switch id="high-contrast" checked={isHighContrast} onCheckedChange={setIsHighContrast} />
                    </div>
                </div>
            </div>
        </PopoverContent>
        </Popover>
    </div>
  );
}
