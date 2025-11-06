
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Label } from '@/components/ui/label';

interface UserRoleEditorProps {
  user: UserProfile;
  children: React.ReactNode;
}

export function UserRoleEditor({ user, children }: UserRoleEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserProfile['role']>(user.role);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleRoleChange = async () => {
    if (newRole === user.role) {
      setIsOpen(false);
      return;
    }
    
    const userDocRef = doc(firestore, 'users', user.id);
    
    updateDocumentNonBlocking(userDocRef, { role: newRole });
    
    toast({
      title: "User Role Updated",
      description: `${user.displayName || user.email}'s role has been changed to ${newRole}.`,
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role for {user.displayName || user.email}</DialogTitle>
          <DialogDescription>
            Changing a user's role will alter their permissions across the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="role-select">New Role</Label>
          <Select value={newRole} onValueChange={(value) => setNewRole(value as UserProfile['role'])}>
            <SelectTrigger id="role-select">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleRoleChange}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
