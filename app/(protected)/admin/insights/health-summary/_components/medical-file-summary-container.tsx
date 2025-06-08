'use client';
import FileUploader from './file-uploader';
import { motion } from 'framer-motion';
import { pageAnimations } from '@/lib/motion';

import { processMedicalSummary } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import {
  FileText,
  File as FileIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { parseFilesToText } from '@/actions/server-actions/file-extractor';
import type { FileState, FileStatus } from '@/lib/types';
import MedicalSummary from './medical-summary';

export default function MedicalFileSummaryContainer() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [summary, setSummary] = useState('');

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      signal,
    }: {
      file: File;
      signal?: AbortSignal;
    }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
        signal,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      const fileName = variables.file.name;
      setFiles((prevFiles) => {
        return prevFiles.map((file) => {
          if (file.name === fileName && file.status === 'uploading') {
            return {
              ...file,
              id: data.fileId,
              status: 'success',
            };
          }
          return file;
        });
      });
    },
  });

  const summarizeMutation = useMutation({
    mutationFn: async ({
      files,
      signal,
      onChunk,
    }: {
      files: File[];
      signal?: AbortSignal;
      onChunk?: (chunk: string) => void;
    }) => {
      const extractedTexts = await parseFilesToText(files);
      if (!extractedTexts.length) {
        throw new Error('No valid contents extracted from files');
      }
      const response = await fetch('/api/summarize-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({ contents: extractedTexts }),
      });
      if (!response.ok) {
        throw new Error('Failed to summarize files');
      }
      if (!response.body) {
        throw new Error('Response body is null');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawChunk = decoder.decode(value, { stream: true });
          let cleanedChunk = '';

          // Process each part of the chunk
          const matches = [...rawChunk.matchAll(/\d+:"(.*?)"/g)];
          for (const match of matches) {
            cleanedChunk += processMedicalSummary(match[1]);
          }

          if (cleanedChunk) {
            onChunk?.(cleanedChunk);
            result += cleanedChunk;
          }
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        throw new Error('Failed to process stream response');
      }

      return result;
    },
    onSuccess: (data) => {
      setFiles((prevFiles) => {
        return prevFiles.map((file) => {
          if (file.status === 'summarizing') {
            return {
              ...file,
              status: 'summarized',
            };
          }
          return file;
        });
      });
      setSummary(data);
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleSelectedFiles(e.dataTransfer.files);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSelectedFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'selected' as FileStatus,
      file: file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const handleUploadFiles = () => {
    const controller = new AbortController();
    const selectedFiles = files.filter((file) => file.status === 'selected');
    if (selectedFiles.length === 0) return;

    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.status === 'selected') {
          return {
            ...file,
            status: 'uploading',
          };
        }
        return file;
      });
    });

    selectedFiles.forEach((fileState) => {
      if (fileState.file) {
        uploadMutation.mutate({
          file: fileState.file,
          signal: controller.signal,
        });
      }
    });
  };

  const handleSummarize = () => {
    const controller = new AbortController();
    setSummary('');
    const successFiles = files.filter((file) => file.status === 'success');
    if (!successFiles || successFiles.length === 0) return;
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.status === 'success') {
          return {
            ...file,
            status: 'summarizing',
          };
        }
        return file;
      });
    });

    const filesToSummarize = successFiles
      .map((fileState) => fileState.file)
      .filter((file): file is File => file !== undefined);

    summarizeMutation.mutate({
      files: filesToSummarize,
      signal: controller.signal,
      onChunk: (chunk) => {
        setSummary((prev) => prev + chunk); // Update in real-time
      },
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf'))
      return <FileText className="h-5 w-5 text-red-500" />;
    return <FileIcon className="h-5 w-5 text-blue-500" />;
  };
  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const {
    hasSelectedFiles,
    hasUploadingFiles,
    hasSummarizing,
    hasSuccessOrSummarized,
  } = useMemo(
    () => ({
      hasSelectedFiles: files.some((file) => file.status === 'selected'),
      hasUploadingFiles: files.some((file) => file.status === 'uploading'),
      hasSummarizing: files.some((file) => file.status === 'summarizing'),
      hasSuccessOrSummarized: files.some(
        (file) => file.status === 'success' || file.status === 'summarized'
      ),
    }),
    [files]
  );

  return (
    <motion.div {...pageAnimations}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Medical File Summarization
          </h1>
          <p className="text-muted-foreground">
            Upload medical files to get an easy-to-understand summary of the
            content.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <FileUploader
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragLeave={handleDragLeave}
            handleSelectedFiles={handleSelectedFiles}
            files={files}
            hasSelectedFiles={hasSelectedFiles}
            handleUploadFiles={handleUploadFiles}
            hasUploadingFiles={hasUploadingFiles}
            getFileIcon={getFileIcon}
            getStatusIcon={getStatusIcon}
            handleRemoveFile={handleRemoveFile}
            hasSummarizing={hasSummarizing}
            hasSuccessOrSummarized={hasSuccessOrSummarized}
            handleSummarize={handleSummarize}
          />
          <MedicalSummary
            pending={summarizeMutation.isPending}
            summary={summary}
          />
        </div>
      </div>
    </motion.div>
  );
}
