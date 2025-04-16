import ResourceLink from './resource-link';

export default function ArticlesInsights() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      <ResourceLink
        title="Understanding Cognitive Behavioral Therapy"
        source="Psychology Today"
        type="Article"
      />
      <ResourceLink
        title="Nutrition and Mental Health: The Connection"
        source="Health & Nutrition"
        type="Research"
      />
      <ResourceLink
        title="Managing Work-Related Stress"
        source="Workplace Wellness"
        type="Guide"
      />
      <ResourceLink
        title="Digital Detox: Reducing Screen Time for Better Mental Health"
        source="Digital Wellbeing"
        type="Article"
      />
    </div>
  );
}
