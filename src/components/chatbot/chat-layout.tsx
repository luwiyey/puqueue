'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { Bot, Send, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChatbotSupport } from '@/ai/flows/ai-chatbot-support';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';
import type { ChatMessage } from '@/lib/types';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { Language } from '@/app/chatbot/page';
import { useToast } from '@/hooks/use-toast';


interface ChatLayoutProps {
    selectedDepartment?: string;
    language: Language;
}

export default function ChatLayout({ selectedDepartment, language }: ChatLayoutProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (user && !conversationId) {
      setConversationId(uuidv4());
    }
  }, [user, conversationId]);

  const messagesColRef = useMemoFirebase(
    () => user && conversationId ? collection(firestore, 'users', user.uid, 'conversations', conversationId, 'messages') : null,
    [firestore, user, conversationId]
  );
  
  const messagesQuery = useMemoFirebase(
    () => messagesColRef ? query(messagesColRef, orderBy('timestamp', 'asc'), limit(50)) : null,
    [messagesColRef]
  );

  useEffect(() => {
    if (!messagesQuery) {
        setMessages([]);
        return;
    };

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages: ChatMessage[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ChatMessage));
        setMessages(newMessages);
    }, (error) => {
        console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [messagesQuery]);


  const userInitials = user?.displayName
    ?.split(' ')
    .map(n => n[0])
    .join('') || '?';
    
  const initialBotMessage = language === 'filipino' 
    ? `Kamusta! Paano kita matutulungan ngayon tungkol sa ${selectedDepartment || 'CSS, Registrar, Guidance, o Dean\'s Office'}?`
    : `Hello! How can I help you today regarding the ${selectedDepartment || 'CSS, Registrar, Guidance, or Dean\'s Office'}?`;

  useEffect(() => {
    setConversationId(uuidv4()); 
    setMessages([]);
  }, [selectedDepartment, language]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !messagesColRef || !user) return;

    const userMessageText = inputValue;
    setInputValue('');

    const userMessage: Omit<ChatMessage, 'id'> = {
      text: userMessageText,
      sender: 'user',
      timestamp: serverTimestamp() as any,
    };
    await addDoc(messagesColRef, userMessage);

    setIsLoading(true);

    const conversationHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
    }));

    try {
      const response = await aiChatbotSupport({ 
          query: userMessageText,
          department: selectedDepartment,
          conversationHistory,
          userId: user.uid,
          language: language,
      });
      const botMessage: Omit<ChatMessage, 'id'> = {
        text: response.response,
        sender: 'bot',
        timestamp: serverTimestamp() as any,
      };
      await addDoc(messagesColRef, botMessage);

    } catch (error) {
      console.error('AI chatbot error:', error);
      const errorMessage: Omit<ChatMessage, 'id'> = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: serverTimestamp() as any,
      };
      await addDoc(messagesColRef, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, rating: 'good' | 'bad') => {
    if (!user || !conversationId) return;

    const feedbackRef = collection(firestore, 'chatbotFeedback');
    await addDoc(feedbackRef, {
      userId: user.uid,
      conversationId: conversationId,
      messageId: messageId,
      rating: rating,
      timestamp: serverTimestamp(),
    });

    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for helping us improve the AI!',
    });
  }
  
  if (isUserLoading) {
      return (
          <Card className="flex h-full flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </Card>
      )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
                 <div
                    key="initial-bot-message"
                    className={cn( 'flex items-start gap-3', 'justify-start' )}
                >
                    <Avatar className="h-8 w-8 border">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback>
                            <Bot className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div
                        className={cn( 'max-w-xs rounded-lg px-3 py-2 text-sm md:max-w-md lg:max-w-lg', 'bg-muted')}
                    >
                        <p className="whitespace-pre-wrap">{initialBotMessage}</p>
                    </div>
                </div>
            )}

            {messages.map(message => (
              <div className='group relative' key={message.id}>
                <div
                  className={cn(
                    'flex items-start gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg px-3 py-2 text-sm md:max-w-md lg:max-w-lg',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {message.sender === 'bot' && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(message.id, 'good')}>
                          <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(message.id, 'bad')}>
                          <ThumbsDown className="h-4 w-4" />
                      </Button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-xs rounded-lg bg-muted px-3 py-2 text-sm md:max-w-md lg:max-w-lg">
                  <Skeleton className="h-4 w-10 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
