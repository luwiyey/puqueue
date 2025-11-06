'use client';

import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/navigation';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export function VoiceCommandManager() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  const commands = [
    {
      command: ['go to dashboard', 'open dashboard'],
      callback: () => router.push('/student-dashboard'),
    },
    {
      command: ['go to appointments', 'open appointments'],
      callback: () => router.push('/appointments'),
    },
    {
      command: ['go to tickets', 'open tickets'],
      callback: () => router.push('/tickets'),
    },
     {
      command: ['new ticket', 'create ticket'],
      callback: () => router.push('/tickets/new'),
    },
    {
      command: ['open chatbot', 'go to chatbot', 'AI assistant'],
      callback: () => router.push('/chatbot'),
    },
    {
      command: ['go to profile', 'open profile'],
      callback: () => router.push('/profile'),
    },
    {
        command: ['go to settings', 'open settings'],
        callback: () => router.push('/settings'),
    },
     {
        command: ['go to help', 'open help'],
        callback: () => router.push('/help'),
    },
    {
        command: ['log out', 'sign out'],
        callback: () => {
            const logoutButton = document.querySelector('[data-logout-button="true"]') as HTMLElement;
            if (logoutButton) {
                logoutButton.click();
            } else {
                toast({ title: 'Could not log out', description: 'Logout button not found.', variant: 'destructive' });
            }
        },
    },
  ];

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ commands });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    if (isMounted && browserSupportsSpeechRecognition && !isMicrophoneAvailable) {
       toast({
        title: "Microphone Access Denied",
        description: "Voice commands require microphone access. Please enable it in your browser settings.",
        variant: "destructive"
       })
    }
  }, [isMounted, browserSupportsSpeechRecognition, isMicrophoneAvailable, toast]);
  

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };
  
  if (!isMounted) {
      return (
            <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
                <Skeleton className="rounded-full h-12 w-12" />
            </div>
      );
  }


  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
       <Button
        size="icon"
        onClick={toggleListening}
        variant={listening ? 'destructive' : 'outline'}
        className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
        aria-label={listening ? 'Stop listening' : 'Start listening'}
       >
        {listening ? <Mic className="h-6 w-6 animate-pulse" /> : <MicOff className="h-6 w-6" />}
      </Button>
       {listening && (
        <div className="bg-background/80 backdrop-blur-sm p-2 px-4 rounded-full text-sm text-muted-foreground border">
          {transcript ? <em>{transcript}</em> : "Listening..."}
        </div>
      )}
    </div>
  );
}
