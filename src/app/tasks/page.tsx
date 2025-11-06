import { TaskListWidget } from "@/components/student-dashboard/task-list-widget";

export default function TasksPage() {
    return (
        <div className="h-full flex flex-col">
             <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">My Tasks</h1>
                <p className="text-muted-foreground">
                    Keep track of your to-dos and reminders. Tasks are saved in your browser.
                </p>
            </header>
            <div className="flex-1">
                <TaskListWidget />
            </div>
        </div>
    )
}