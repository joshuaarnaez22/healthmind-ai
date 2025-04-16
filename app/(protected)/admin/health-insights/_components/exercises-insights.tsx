import { insightCards } from '@/lib/constant';
import InsightCard from './insight-card';
import { cn } from '@/lib/utils';

export default function ExercisesInsights() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {' '}
      {insightCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <InsightCard
            key={index}
            title={card.title}
            description={card.description}
            icon={<Icon className={cn(card.className)} />}
            category={card.category}
            categoryColor={card.categoryColor}
          />
        );
      })}
    </div>
  );
}
