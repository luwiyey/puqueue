
import { TrainingForm } from "@/components/admin/training/training-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTrainingPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-headline mb-6">Train AI Chatbot</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                    <CardDescription>
                        Upload PDF or CSV files containing information for the AI to learn from. 
                        This could be student handbooks, FAQs, or department-specific information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TrainingForm />
                </CardContent>
            </Card>
        </div>
    )
}
