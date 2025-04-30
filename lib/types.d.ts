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
