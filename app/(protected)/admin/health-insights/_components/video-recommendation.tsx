import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface VideoRecommendationProps {
  title: string;
  duration: string;
  thumbnail: string;
  creator: string;
  views: string;
}

export default function VideoRecommendation({
  title,
  duration,
  thumbnail,
  creator,
  views,
}: VideoRecommendationProps) {
  return (
    <Card className="h= group cursor-pointer overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={thumbnail || '/placeholder.svg'}
          alt={title}
          className="h-[300px] w-full object-cover"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          {duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-white p-3">
            <Play className="h-6 w-6 text-black" />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-2 text-base font-medium">{title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{creator}</span>
          <span>{views} views</span>
        </div>
      </CardContent>
    </Card>
  );
}
