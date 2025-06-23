import type { Journal } from '@prisma/client';

export type FileStatus =
  | 'selected'
  | 'uploading'
  | 'success'
  | 'error'
  | 'summarizing'
  | 'summarized';
export interface FileState {
  id?: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  error?: string;
  file?: File; // Store the actual File object for upload
}

export interface FileUploaderProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleSelectedFiles: (selectedFiles: FileList | null) => void;
  files: FileState[];
  hasSelectedFiles: boolean;
  handleUploadFiles: () => void;
  hasUploadingFiles: boolean;
  getFileIcon: (fileType: string) => React.JSX.Element;
  getStatusIcon: (status: FileStatus) => React.JSX.Element | null;
  handleRemoveFile: (index: number) => void;
  hasSummarizing: boolean;
  hasSuccessOrSummarized: boolean;
  handleSummarize: () => void;
}

export type JournalType = Omit<
  Journal,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

type Observation = {
  title: string;
  shortEvidence: string;
  insight: string;
  evidence: string;
  date: string;
};
interface ObservationProps {
  observation: Observation;
  onSelect: () => void;
}

export type ArticleProps = {
  title: string;
  publication: string;
  url: string;
  benefit: string;
};

export interface Step {
  id: string;
  description: string;
  duration: number; // in seconds
  isComplete: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  isDone: boolean;
  steps: Step[];
  rationale: string;
}

export type ValidLucideIcon = (typeof validLucideIcons)[number];

export interface ModuleStep {
  id: string;
  title: string;
  explanation: string;
  exercise: string;
  reflection: string;
}

export interface ModuleCompletion {
  id: string;
  moduleId: string;
  module: TherapyModule;
  order: number;
  title: string;
  explanation: string;
  exercise: string;
  exerciseResponse?: string | null;
  reflection: string;
  reflectionResponse?: string | null;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TherapyModule {
  id: string;
  userId: string;
  user: User;
  therapyType: string; // or "CBT" | "DBT" | "ACT" if you're enforcing it
  title: string;
  description: string;
  audience: string;
  difficulty: string; // or "beginner" | "intermediate" | "advanced"
  estimatedTime: string;
  overview: string[];
  safetyDisclaimer: string;
  color: string;
  icon: string; // or a more specific union like from `validLucideIcons`
  isDone: boolean;
  steps: TherapyStep[];
  completion?: ModuleCompletion | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  emotion: string;
  frequency: string;
  targetCount: number;
  duration: string;
  why?: string | null;
  createdAt: Date;
  completedCount: number;
  checkIns: CheckIn[];
  isCompleted: boolean;
}

export interface CheckIn {
  id: string;
  goalId: string;
  completedAt: Date;
  actualEmotion: string;
  reflection: string;
  rating: number;
}

export interface EmotionInsight {
  emotion: string;
  count: number;
  percentage: number;
  activities: string[];
}

export type GoalWithCheckIns = Goal & {
  checkIns: CheckIn[];
};

export interface EmotionInsight {
  emotion: string;
  count: number;
  percentage: number;
  activities: string[];
}
export type SchemaName =
  | 'analysis'
  | 'affirmations'
  | 'articles'
  | 'exercises'
  | 'summary';
