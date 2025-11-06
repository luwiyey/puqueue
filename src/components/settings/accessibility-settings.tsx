
"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "../ui/separator";

export function AccessibilitySettings() {
  const [fontSize, setFontSize] = React.useState("base");
  const [fontFamily, setFontFamily] = React.useState("font-body");
  const [theme, setTheme] = React.useState("system");
  const [isHighContrast, setIsHighContrast] = React.useState(false);

   React.useEffect(() => {
    // On mount, read from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") || 'system';
    const savedFontSize = localStorage.getItem("font-size") || 'base';
    const savedFontFamily = localStorage.getItem("font-family") || 'font-body';
    const savedHighContrast = localStorage.getItem("high-contrast") === 'true';

    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setFontFamily(savedFontFamily);
    setIsHighContrast(savedHighContrast);
  }, []);

  React.useEffect(() => {
    document.body.classList.remove("font-size-sm", "font-size-lg");
    if (fontSize !== "base") {
      document.body.classList.add(`font-size-${fontSize}`);
    }
    localStorage.setItem("font-size", fontSize);
  }, [fontSize]);

  React.useEffect(() => {
    document.body.classList.remove("font-body", "font-headline", "font-lexend", "font-atkinson");
    document.body.classList.add(fontFamily);
    localStorage.setItem("font-family", fontFamily);
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
    localStorage.setItem("theme", theme);
  }, [theme]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
     localStorage.setItem("high-contrast", String(isHighContrast));
  }, [isHighContrast]);

  return (
    <div className="space-y-6">
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
            <SelectItem value="font-atkinson">Accessible (Atkinson)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="high-contrast">High Contrast Mode</Label>
          <p className="text-xs text-muted-foreground">Increases text visibility.</p>
        </div>
        <Switch id="high-contrast" checked={isHighContrast} onCheckedChange={setIsHighContrast} />
      </div>
    </div>
  );
}
