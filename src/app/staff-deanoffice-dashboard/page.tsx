
'use client';
import { useUser } from '@/firebase';

export default function StaffDeanOfficeDashboardPage() {
    const { user } = useUser();
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Welcome, {user?.displayName || 'Dean\'s Office Staff'}!
            </h1>
        </div>
    );
}
