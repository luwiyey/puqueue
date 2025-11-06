

import { CampusBroadcastBanner } from "@/components/campus-broadcast-banner";
import { ParentGuardianResources } from "@/components/guest/parent-guardian-resources";
import { AcademicCalendarWidget } from "@/components/student-dashboard/academic-calendar-widget";
import { AnnouncementsWidget } from "@/components/student-dashboard/announcements-widget";
import { DepartmentQuickLinks } from "@/components/student-dashboard/department-quick-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


export default function GuestDashboardPage() {
    return (
        <div className="space-y-6">
            <CampusBroadcastBanner />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Welcome, Guest!</CardTitle>
                            <CardDescription>
                                You are viewing the university portal for guests, parents, and guardians. For full student access, please sign in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/login">Student Sign In</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <ParentGuardianResources />
                </div>
                <div className="space-y-6">
                    <AnnouncementsWidget />
                    <AcademicCalendarWidget />
                    <DepartmentQuickLinks />
                </div>
            </div>
        </div>
    )
}

