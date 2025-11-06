
'use client';

import { useUser, useFirebaseApp } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { ProfileForm } from '@/components/profile/profile-form';
import { ProfilePictureUploader } from '@/components/profile/profile-picture-uploader';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handlePhotoUpdate = async (downloadURL: string) => {
    if (!user || !user.email || user.isAnonymous) {
      toast({ title: 'Not authenticated', description: 'You must be logged in to update your profile picture.', variant: 'destructive' });
      return;
    }
    
    try {
      // Update the user's auth profile
      await updateProfile(user, { photoURL: downloadURL });
      
      // Update the user's document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });

      toast({
        title: 'Profile Picture Updated',
        description: 'Your new avatar has been saved.',
      });
      // Force a reload of the user object to see the change
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not save your new profile picture.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfilePictureUploader onUploadComplete={handlePhotoUpdate} />
        </div>
        <div className="lg:col-span-2">
           <ProfileForm />
        </div>
      </div>
    </div>
  );
}

    