import VideoRecommendation from './video-recommendation';

export default function VideosInsights() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        title="Yoga for Anxiety Relief"
        duration="18:32"
        thumbnail="/placeholder.svg?height=180&width=320"
        creator="Peaceful Practices"
        views="324K"
      />
      <VideoRecommendation
        title="How to Practice Mindfulness Daily"
        duration="9:15"
        thumbnail="/placeholder.svg?height=180&width=320"
        creator="Present Moment"
        views="412K"
      />
      <VideoRecommendation
        title="Overcoming Negative Thought Patterns"
        duration="15:21"
        thumbnail="/placeholder.svg?height=180&width=320"
        creator="Cognitive Health"
        views="178K"
      />
      <VideoRecommendation
        title="Sleep Meditation for Deep Rest"
        duration="45:00"
        thumbnail="/placeholder.svg?height=180&width=320"
        creator="Restful Mind"
        views="1.2M"
      />
    </div>
  );
}
