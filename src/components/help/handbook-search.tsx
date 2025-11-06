'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { handbookSearch } from '@/ai/flows/handbook-search-flow';

export function HandbookSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearchResult(null);
    try {
      const result = await handbookSearch({ query });
      setSearchResult(result.answer);
    } catch (error) {
      console.error('Handbook search failed:', error);
      setSearchResult('Sorry, I encountered an error while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Handbook Search</CardTitle>
        <CardDescription>
          Ask a question to search the student handbook for rules and procedures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., How do I request a good moral certificate?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isLoading}
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Search</span>
          </Button>
        </div>
        {searchResult && (
          <Alert className="mt-4">
            <AlertDescription>{searchResult}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
