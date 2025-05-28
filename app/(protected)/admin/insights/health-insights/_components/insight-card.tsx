import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  category: string;
  categoryColor: string;
}
export default function InsightCard({
  title,
  description,
  icon,
  category,
  categoryColor,
}: InsightCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <span
            className={cn(
              'rounded-full px-2 py-1 text-xs font-medium',
              categoryColor
            )}
          >
            {category}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-muted/50 px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm"
        >
          Learn more <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
