import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";
import { AnnouncementsList } from "@/components/admin/announcements/announcements-list";
import { Separator } from "@/components/ui/separator";

export default function AdminAnnouncementsPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Announcements</h1>
                <p className="text-muted-foreground">
                    Create and manage announcements for the entire university.
                </p>
            </header>
            
            <div className="grid gap-12 md:grid-cols-2">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>
                    <AnnouncementForm />
                </div>
                <div>
                     <h2 className="text-xl font-semibold mb-4">Posted Announcements</h2>
                    <AnnouncementsList />
                </div>
            </div>

        </div>
    )
}
