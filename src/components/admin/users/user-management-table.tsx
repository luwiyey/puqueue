
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Shield, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRoleEditor } from './user-role-editor';

const roleIcons: Record<UserProfile['role'], React.ReactNode> = {
    admin: <Shield className="mr-2 h-4 w-4" />,
    staff: <User className="mr-2 h-4 w-4" />,
    student: <GraduationCap className="mr-2 h-4 w-4" />,
    guest: <User className="mr-2 h-4 w-4" />,
};

const roleColors: Record<UserProfile['role'], string> = {
    admin: 'bg-primary text-primary-foreground',
    staff: 'bg-blue-500 text-white',
    student: 'bg-accent text-accent-foreground',
    guest: 'bg-muted text-muted-foreground',
};

export function UserManagementTable() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(
        () => query(collection(firestore, 'users'), orderBy('email')),
        [firestore]
    );

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && users?.map(user => (
                         <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.displayName || 'N/A'}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={roleColors[user.role]}>
                                    {roleIcons[user.role]}
                                    <span className="capitalize">{user.role}</span>
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {/* Placeholder for user status */}
                                <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <UserRoleEditor user={user}>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                Edit Role
                                            </DropdownMenuItem>
                                        </UserRoleEditor>
                                        <DropdownMenuItem>View Activity</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                         </TableRow>
                    ))}
                </TableBody>
            </Table>
             {!isLoading && users?.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No users found.
                </div>
            )}
        </div>
    );
}
