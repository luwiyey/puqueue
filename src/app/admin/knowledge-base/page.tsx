import { KnowledgeBaseForm } from "@/components/admin/knowledge-base/knowledge-base-form";
import { KnowledgeBaseTable } from "@/components/admin/knowledge-base/knowledge-base-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowledgeBasePage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Knowledge Base</h1>
                <p className="text-muted-foreground">
                    Manage the documents and information used to train the AI chatbot.
                </p>
            </header>

            <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Add New Entry</CardTitle>
                            <CardDescription>
                                Add a new piece of information to the knowledge base.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <KnowledgeBaseForm />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <KnowledgeBaseTable />
                </div>
            </div>
        </div>
    );
}
