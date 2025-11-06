
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const mockTopDocs = [
    { name: 'Transcript of Records (TOR)', count: 128, percentage: 45 },
    { name: 'Good Moral Certificate', count: 72, percentage: 25 },
    { name: 'Certificate of Registration (COR)', count: 56, percentage: 20 },
    { name: 'CAV (DFA Apostille)', count: 29, percentage: 10 },
];

export function TopDocumentsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Top Requested Documents</CardTitle>
        <CardDescription>Breakdown of document requests this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTopDocs.map((doc) => (
          <div key={doc.name}>
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">{doc.name}</p>
              <span className="text-sm text-muted-foreground">{doc.count}</span>
            </div>
            <Progress value={doc.percentage} aria-label={`${doc.percentage}% for ${doc.name}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
