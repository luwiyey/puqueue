'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// HSL string to {h, s, l} object
const parseHsl = (hslStr: string) => {
  if (!hslStr) return { h: 0, s: 0, l: 0 };
  const [h, s, l] = hslStr.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0];
  return { h, s, l };
};

// {h, s, l} object to HSL string
const formatHsl = (h: number, s: number, l: number) => {
  return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
};

// color hex to {h, s, l} object
function hexToHsl(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}


// {h, s, l} object to color hex
function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const DEFAULT_THEME = {
    '--primary': { h: 346.8, s: 77.2, l: 49.8 },
    '--background': { h: 0, s: 0, l: 100 },
    '--accent': { h: 210, s: 40, l: 96.1 },
};

export function ThemeCustomizer() {
  const [colors, setColors] = useState({
    primary: '',
    background: '',
    accent: '',
  });

  const getCssVariable = (name: string) => {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  useEffect(() => {
    // Load from localStorage or use computed styles
    const savedPrimary = localStorage.getItem('theme-primary-hsl');
    const savedBackground = localStorage.getItem('theme-background-hsl');
    const savedAccent = localStorage.getItem('theme-accent-hsl');

    const initialPrimary = savedPrimary ? parseHsl(savedPrimary) : parseHsl(getCssVariable('--primary'));
    const initialBackground = savedBackground ? parseHsl(savedBackground) : parseHsl(getCssVariable('--background'));
    const initialAccent = savedAccent ? parseHsl(savedAccent) : parseHsl(getCssVariable('--accent'));
    
    setColors({
      primary: hslToHex(initialPrimary.h, initialPrimary.s, initialPrimary.l),
      background: hslToHex(initialBackground.h, initialBackground.s, initialBackground.l),
      accent: hslToHex(initialAccent.h, initialAccent.s, initialAccent.l),
    });
  }, []);

  useEffect(() => {
    if (colors.primary) {
        const {h, s, l} = hexToHsl(colors.primary);
        document.documentElement.style.setProperty('--primary', formatHsl(h, s, l));
        localStorage.setItem('theme-primary-hsl', formatHsl(h,s,l));
    }
     if (colors.background) {
        const {h, s, l} = hexToHsl(colors.background);
        document.documentElement.style.setProperty('--background', formatHsl(h, s, l));
         localStorage.setItem('theme-background-hsl', formatHsl(h,s,l));

    }
     if (colors.accent) {
        const {h, s, l} = hexToHsl(colors.accent);
        document.documentElement.style.setProperty('--accent', formatHsl(h, s, l));
         localStorage.setItem('theme-accent-hsl', formatHsl(h,s,l));
    }
  }, [colors]);

  const handleColorChange = (name: 'primary' | 'background' | 'accent', value: string) => {
    setColors(prev => ({ ...prev, [name]: value }));
  };

  const resetToDefault = () => {
    document.documentElement.style.setProperty('--primary', formatHsl(DEFAULT_THEME['--primary'].h, DEFAULT_THEME['--primary'].s, DEFAULT_THEME['--primary'].l));
    document.documentElement.style.setProperty('--background', formatHsl(DEFAULT_THEME['--background'].h, DEFAULT_THEME['--background'].s, DEFAULT_THEME['--background'].l));
    document.documentElement.style.setProperty('--accent', formatHsl(DEFAULT_THEME['--accent'].h, DEFAULT_THEME['--accent'].s, DEFAULT_THEME['--accent'].l));
    
    localStorage.removeItem('theme-primary-hsl');
    localStorage.removeItem('theme-background-hsl');
    localStorage.removeItem('theme-accent-hsl');

    setColors({
        primary: hslToHex(DEFAULT_THEME['--primary'].h, DEFAULT_THEME['--primary'].s, DEFAULT_THEME['--primary'].l),
        background: hslToHex(DEFAULT_THEME['--background'].h, DEFAULT_THEME['--background'].s, DEFAULT_THEME['--background'].l),
        accent: hslToHex(DEFAULT_THEME['--accent'].h, DEFAULT_THEME['--accent'].s, DEFAULT_THEME['--accent'].l),
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
        {Object.keys(colors).map(key => (
          <div key={key} className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={key} className="capitalize">{key}</Label>
            <div className="relative">
              <Input
                type="color"
                id={key}
                value={colors[key as keyof typeof colors]}
                onChange={(e) => handleColorChange(key as any, e.target.value)}
                className="h-10 w-full p-1 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
       <Button onClick={resetToDefault} variant="outline">Reset to Default</Button>
    </div>
  );
}