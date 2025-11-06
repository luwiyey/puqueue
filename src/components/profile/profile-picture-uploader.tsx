'use client';

import { useState } from 'react';
import { useUser, useFirebaseApp } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';


interface ProfilePictureUploaderProps {
  onUploadComplete: (downloadURL: string) => void;
}

export function ProfilePictureUploader({ onUploadComplete }: ProfilePictureUploaderProps) {
  const { user } = useUser();
  const firebaseApp = useFirebaseApp();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const hiddenFileInput =  useState<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);

    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        setUploadProgress(null);
        toast({
          title: 'Upload failed',
          description: error.message,
          variant: 'destructive',
        });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onUploadComplete(downloadURL);
        setIsUploading(false);
        setUploadProgress(null);
        setFile(null);
      }
    );
  };

  const userInitials = user?.displayName?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload a new avatar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32 border-2 border-primary/50">
          <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'}/>
          <AvatarFallback className="text-4xl">
            <UserIcon size={64}/>
          </AvatarFallback>
        </Avatar>

        <Input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
        />

        {!file && (
          <label htmlFor="file-upload" className="cursor-pointer">
              <Button asChild pointerEvents="none">
                <span>Select Image</span>
              </Button>
          </label>
        )}
        
        {file && (
            <div className="w-full space-y-4 text-center">
                <p className="text-sm text-muted-foreground truncate">
                    {file.name}
                </p>
                {isUploading && uploadProgress !== null ? (
                    <Progress value={uploadProgress} className="w-full" />
                ) : (
                    <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload & Save
                    </Button>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
