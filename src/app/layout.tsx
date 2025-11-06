
'use client';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Lexend, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { AppLayout } from '@/components/AppLayout';
import { DraggableFABs } from '@/components/draggable-fabs';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });
const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson-hyperlegible'
});

// Metadata can't be dynamically generated in a client component,
// so we define it statically here.
// export const metadata: Metadata = {
//   title: 'PU Queue',
//   description: 'A smart queueing and support system for Panpacific University.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <title>PU Queue</title>
          <meta name="description" content="A smart queueing and support system for Panpacific University." />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${lexend.variable} ${atkinsonHyperlegible.variable} font-body`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
            <DraggableFABs />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
