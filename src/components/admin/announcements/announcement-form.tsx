'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking, useAuth, useFirestore } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const announcementSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters.").max(100),
    content: z.string().min(10, "Content must be at least 10 characters.").max(500)
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export function AnnouncementForm() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useAuth();
    const router = useRouter();

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    });
    
    const {formState: {isSubmitting}} = form;

    const onSubmit = async (data: AnnouncementFormValues) => {
        if (!user) {
            toast({ title: "Not authenticated", variant: "destructive" });
            return;
        }

        try {
            const announcementsColRef = collection(firestore, 'announcements');
            await addDocumentNonBlocking(announcementsColRef, {
                ...data,
                authorId: user.uid,
                postDate: serverTimestamp()
            });

            toast({
                title: "Announcement Posted!",
                description: "Your announcement is now live."
            });
            form.reset();
            // In a real app, you might want to revalidate the path to update the list
            router.refresh();

        } catch (error) {
            console.error("Failed to post announcement:", error);
            toast({ title: "Post Failed", description: "Could not post the announcement.", variant: "destructive" });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Campus Holiday Schedule" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Write the full announcement here..." rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : <Send className="mr-2"/>}
                    Post Announcement
                </Button>
            </form>
        </Form>
    );
}
