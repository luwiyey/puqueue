'use client';

import { useState } from 'react';
import ChatLayout from '@/components/chatbot/chat-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type Language = 'english' | 'filipino' | 'chinese' | 'korean' | 'swahili' | 'auto';


export default function ChatbotPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>('CSS');
  const [language, setLanguage] = useState<Language>('english');


  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
       <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">AI Assistant</h1>
            <p className="text-muted-foreground">
            Your 24/7 guide to university services.
            </p>
        </div>
        <div className="flex items-center gap-4">
            <div className='space-y-2'>
              <Label htmlFor="language-select">Language</Label>
              <Select onValueChange={(value) => setLanguage(value as Language)} value={language}>
                <SelectTrigger id="language-select" className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="filipino">Filipino</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>
      </header>
      
      <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="flex flex-1 flex-col">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="CSS">CSS</TabsTrigger>
          <TabsTrigger value="Registrar">Registrar</TabsTrigger>
          <TabsTrigger value="Guidance">Guidance</TabsTrigger>
          <TabsTrigger value="Dean's Office">Dean's Office</TabsTrigger>
        </TabsList>
        
        <TabsContent value="CSS" className="flex-1 mt-4">
            <ChatLayout selectedDepartment="CSS" language={language} />
        </TabsContent>
        <TabsContent value="Registrar" className="flex-1 mt-4">
            <ChatLayout selectedDepartment="Registrar" language={language} />
        </TabsContent>
        <TabsContent value="Guidance" className="flex-1 mt-4">
            <ChatLayout selectedDepartment="Guidance" language={language} />
        </TabsContent>
        <TabsContent value="Dean's Office" className="flex-1 mt-4">
            <ChatLayout selectedDepartment="Dean's Office" language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
