
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { trainAIChatbot } from '@/ai/flows/admin-train-ai-chatbot';
import { UploadCloud } from 'lucide-react';

export function TrainingForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a PDF or CSV file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fileDataUri = await fileToDataUri(file);

      const result = await trainAIChatbot({
          fileDataUri,
          fileName: file.name
      });

      if (result.success) {
          toast({
              title: 'Training Started',
              description: `AI training with ${file.name} has begun.`,
          });
      } else {
          throw new Error(result.message);
      }
      
      setFile(null);
    } catch (error) {
      console.error('Failed to start training:', error);
      toast({
        title: 'Training Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Document File</Label>
        <div className="flex items-center gap-2">
          <Input id="file-upload" type="file" accept=".pdf,.csv" onChange={handleFileChange} />
        </div>
        {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting || !file}>
        <UploadCloud className="mr-2 size-4" />
        {isSubmitting ? 'Uploading...' : 'Upload and Train'}
      </Button>
    </form>
  );
}
