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

export interface ModuleStep {
  id: string;
  title: string;
  explanation: string;
  exercise: string;
  reflection: string;
}

export interface ModuleCompletion {
  recap: string;
  praise: string;
  nextSuggestion: string;
}

export interface TherapyModule {
  id: string;
  description: string;
  therapyType: 'CBT' | 'DBT' | 'ACT';
  title: string;
  audience: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  overview: string[];
  steps: ModuleStep[];
  completion: ModuleCompletion;
  safetyDisclaimer: string;

  // UI-related
  color: string; // e.g., "bg-blue-50 text-blue-700 border-blue-200"
  icon: string; // e.g., "Brain", "Heart", "Compass"
  iconColor: string; // e.g., "text-blue-600"
}
