"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from 'firebase/firestore';
import { updateProfile } from "firebase/auth";
import { useEffect } from "react";

const profileFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required.").optional(),
  firstName: z.string().min(1, "First name is required.").optional(),
  lastName: z.string().min(1, "Last name is required.").optional(),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      displayName: "",
    },
    mode: "onChange",
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || "",
        displayName: user.displayName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || ""
      });
    }
  }, [user, form]);


  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
        toast({title: "Not authenticated", variant: "destructive"});
        return;
    }
    
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const updatedData = {
            displayName: data.displayName,
            firstName: data.firstName,
            lastName: data.lastName,
        };

        // Update auth profile
        await updateProfile(user, { displayName: data.displayName });
      
        // Use non-blocking Firestore update
        setDocumentNonBlocking(userDocRef, updatedData, { merge: true });

        toast({
            title: "Profile Updated",
            description: "Your information has been successfully updated.",
        });

    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your display name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} readOnly disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting || isUserLoading}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
