
import { UserManagementTable } from "@/components/admin/users/user-management-table";

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">User Management</h1>
                <p className="text-muted-foreground">
                    View and manage user accounts and roles on the platform.
                </p>
            </header>
            <UserManagementTable />
        </div>
    )
}
