'use client';

import { Bot, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockAiInteractionLog } from '@/lib/data';


export function AIInteractionLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Assistant Interactions</CardTitle>
        <CardDescription>
            A summary of your conversations with the AI Assistant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-4 rounded-md border p-4">
                <Bot className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Total Questions Asked</p>
                    <p className="text-2xl font-bold">{mockAiInteractionLog.totalQuestions}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Successfully Answered</p>
                    <p className="text-2xl font-bold">{mockAiInteractionLog.successfulAnswers}</p>
                </div>
            </div>
             <div className="flex items-center space-x-4 rounded-md border p-4">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Tickets Created After Chat</p>
                    <p className="text-2xl font-bold">{mockAiInteractionLog.ticketsCreatedAfter}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
