'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import type { KnowledgeBaseDocument } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

export function KnowledgeBaseTable() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const kbQuery = useMemoFirebase(
      () =>
        firestore
          ? query(collection(firestore, 'knowledge_base_documents'), orderBy('uploadDate', 'desc'), limit(50))
          : null,
      [firestore]
    );
    const { data: documents, isLoading } = useCollection<KnowledgeBaseDocument>(kbQuery);

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'knowledge_base_documents', id));
            toast({ title: "Document Deleted", description: "The knowledge base document has been removed."});
        } catch (error) {
            toast({ title: "Deletion Failed", description: "Could not delete the document.", variant: "destructive"});
            console.error("Error deleting document:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Training Documents</CardTitle>
                <CardDescription>All documents currently in the AI's knowledge base.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && documents?.map(doc => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.title}</TableCell>
                                <TableCell>
                                    <Badge variant={doc.fileType === 'manual' ? 'secondary' : 'outline'}>
                                        {doc.fileType || 'manual'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(doc.uploadDate.toDate(), 'PP')}</TableCell>
                                <TableCell className='text-right'>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!isLoading && (!documents || documents.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No knowledge base documents found.</p>
                )}
            </CardContent>
        </Card>
    );
}
