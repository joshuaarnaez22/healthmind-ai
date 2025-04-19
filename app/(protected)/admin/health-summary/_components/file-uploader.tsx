'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, formatFileSize } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  UploadCloud,
  File as FileIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

type FileStatus = 'selected' | 'uploading' | 'success' | 'error';
interface FileState {
  id?: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  error?: string;
  file?: File; // Store the actual File object for upload
}
export default function FileUploader() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      console.log(response.json);

      return response.json();
    },
    onSuccess: (data, variables) => {
      const fileName = variables.name;
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
        uploadMutation.mutate(fileState.file);
      }
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

  const hasUploadingFiles = files.some((file) => file.status === 'uploading');
  const hasSelectedFiles = files.some((file) => file.status === 'selected');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medical Files</CardTitle>
        <CardDescription>
          Upload medical records, test results, or other health documents for
          summarization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-8 text-center',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/20'
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <div className="mx-auto flex flex-col items-center justify-center space-y-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-medium">
                Drag files here or click to upload
              </h3>
              <p className="text-sm text-muted-foreground">
                Support for PDF, DOC, DOCX, and TXT files up to 10MB
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx,.txt';
                input.multiple = true;
                input.onchange = (e) =>
                  handleSelectedFiles((e.target as HTMLInputElement).files);
                input.click();
              }}
            >
              Select Files
            </Button>
          </div>
        </div>
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Files</h3>
              {hasSelectedFiles && (
                <Button
                  onClick={handleUploadFiles}
                  disabled={hasUploadingFiles}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Selected Files
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 rounded border p-3"
                >
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === 'error' && (
                        <p className="text-xs text-red-500">
                          {file.error || 'Upload failed'}
                        </p>
                      )}
                      {file.status === 'uploading' && (
                        <p className="text-xs text-blue-500">Uploading...</p>
                      )}
                      {file.status === 'selected' && (
                        <p className="text-xs text-amber-500">
                          Ready to upload
                        </p>
                      )}
                      {file.status === 'success' && (
                        <p className="text-xs text-green-500">Uploaded</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      {getStatusIcon(file.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveFile(index)}
                      disabled={file.status === 'uploading'}
                    >
                      {file.status === 'selected' ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
