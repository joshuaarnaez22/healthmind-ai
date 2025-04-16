import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText, BookMarked, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceLinkProps {
  title: string;
  source: string;
  type: 'Article' | 'Guide' | 'Research' | 'Worksheet';
}

export default function ResourceLink({
  title,
  source,
  type,
}: ResourceLinkProps) {
  const getIcon = () => {
    switch (type) {
      case 'Article':
        return <BookOpen className="h-4 w-4" />;
      case 'Guide':
        return <BookMarked className="h-4 w-4" />;
      case 'Research':
        return <FileText className="h-4 w-4" />;
      case 'Worksheet':
        return <ClipboardList className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'Article':
        return 'text-blue-600 bg-blue-50';
      case 'Guide':
        return 'text-purple-600 bg-purple-50';
      case 'Research':
        return 'text-emerald-600 bg-emerald-50';
      case 'Worksheet':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <Card className="cursor-pointer overflow-hidden transition-all hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn('rounded-full p-2', getTypeColor())}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-base font-medium">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{source}</span>
            <span
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium',
                getTypeColor()
              )}
            >
              {type}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
