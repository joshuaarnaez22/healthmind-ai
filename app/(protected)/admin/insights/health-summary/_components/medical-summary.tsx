'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { memo } from 'react';
import { Copy, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface MedicalSummaryProps {
  pending: boolean;
  summary: string;
}

const MedicalSummary = memo(function MedicalSummary({
  pending,
  summary,
}: MedicalSummaryProps) {
  const { toast } = useToast();
  const summaryContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever summary updates
    if (summaryContentRef.current) {
      summaryContentRef.current.scrollTo({
        top: summaryContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [summary]);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast({
      title: 'Copied to clipboard',
      description: 'The summary has been copied to your clipboard.',
    });
  };
  const handleDownload = () => {
    if (!summary) return;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Medical Summary</CardTitle>
        <CardDescription>
          {pending ? 'Generating...' : 'Your personalized health summary'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="prose max-h-[500px] min-h-64 max-w-none space-y-4 overflow-y-auto scroll-smooth rounded-lg bg-muted/50 p-8"
          ref={summaryContentRef}
        >
          {summary ? (
            <div className="space-y-6">
              <ReactMarkdown>{summary}</ReactMarkdown>

              {pending && (
                <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>Generating summary</span>
                  <span className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {pending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing summary...</span>
                </div>
              ) : (
                <span>Summary will appear here</span>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={pending || !summary}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={pending || !summary}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default MedicalSummary;
