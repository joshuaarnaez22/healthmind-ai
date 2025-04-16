import { insightCards } from '@/lib/constant';
import InsightCard from './insight-card';
import { cn } from '@/lib/utils';
import VideoRecommendation from './video-recommendation';
import ResourceLink from './resource-link';

export default function AllInsights() {
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <h2 className="mb-4 text-2xl font-semibold">Recommended Videos</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VideoRecommendation
          title="5-Minute Meditation for Stress Relief"
          duration="5:23"
          thumbnail="/placeholder.svg?height=180&width=320"
          creator="MindfulnessHub"
          views="245K"
        />
        <VideoRecommendation
          title="Understanding Your Emotions"
          duration="12:47"
          thumbnail="/placeholder.svg?height=180&width=320"
          creator="Psychology Insights"
          views="189K"
        />
        <VideoRecommendation
          title="Build strength to navigate life's challenges with grace"
          duration="10:27"
          thumbnail="/placeholder.svg?height=180&width=320"
          creator="Psychology Insights"
          views="300k"
        />
      </div>
      <h2 className="mb-4 text-2xl font-semibold">Helpful Resources</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ResourceLink
          title="10 Ways to Practice Self-Care Daily"
          source="Wellness Journal"
          type="Article"
        />
        <ResourceLink
          title="Building Resilience in Difficult Times"
          source="Mental Health Foundation"
          type="Guide"
        />
        <ResourceLink
          title="Sleep Hygiene: Improving Your Sleep Quality"
          source="Sleep Research Institute"
          type="Article"
        />
        <ResourceLink
          title="Journaling Prompts for Self-Reflection"
          source="Mindful Living"
          type="Worksheet"
        />
      </div>
    </>
  );
}
