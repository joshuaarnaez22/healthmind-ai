'use client';

import { Journal } from '@prisma/client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import moods from '@/lib/mood';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';

export default function JournalEntryCard({ journal }: { journal: Journal }) {
  const moodColor = moods.find((mood) => mood.value === journal.mood);
  const cleanHtml = DOMPurify.sanitize(journal.content);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg lg:text-xl">
              {journal.title}
            </CardTitle>
            <Badge className={cn(moodColor?.bgColor, moodColor?.color)}>
              {journal.mood}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="prose text-sm prose-blockquote:border-l-4 prose-blockquote:border-gray-200 lg:text-lg [&_li]:list-item [&_li]:pl-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(journal.createdAt), {
              addSuffix: true,
            })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
