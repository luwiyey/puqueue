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
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { KnowledgeBaseDocument } from "@/lib/types";

const kbSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters.").max(100),
    content: z.string().min(10, "Content must be at least 10 characters.")
});

type KBFormValues = z.infer<typeof kbSchema>;

export function KnowledgeBaseForm() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useAuth();
    const router = useRouter();

    const form = useForm<KBFormValues>({
        resolver: zodResolver(kbSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    });
    
    const {formState: {isSubmitting}} = form;

    const onSubmit = async (data: KBFormValues) => {
        if (!user) {
            toast({ title: "Not authenticated", variant: "destructive" });
            return;
        }

        try {
            const kbColRef = collection(firestore, 'knowledge_base_documents');
            const docData: Omit<KnowledgeBaseDocument, 'id'> = {
                ...data,
                adminId: user.uid,
                uploadDate: serverTimestamp() as any,
                fileType: 'manual', // Indicate it's a manually added entry
            };

            await addDocumentNonBlocking(kbColRef, docData);

            toast({
                title: "Knowledge Entry Added!",
                description: "The new information is now part of the AI's knowledge base."
            });
            form.reset();
            router.refresh();

        } catch (error) {
            console.error("Failed to add knowledge entry:", error);
            toast({ title: "Submission Failed", description: "Could not add the entry.", variant: "destructive" });
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
                            <FormLabel>Title / Question</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., How to Request a Transcript" {...field} />
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
                            <FormLabel>Content / Answer</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Provide the detailed information or answer..." rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : <Plus className="mr-2"/>}
                    Add Entry
                </Button>
            </form>
        </Form>
    );
}
