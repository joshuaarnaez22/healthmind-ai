'use client';
import { Button } from '@/components/ui/button';
import { cn, formatFileSize } from '@/lib/utils';
import { Upload, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { FileUploaderProps } from '@/lib/types';
import { memo } from 'react';

const FileUploader = memo(function FileUploader({
  isDragging,
  handleDragOver,
  handleDrop,
  handleDragLeave,
  handleSelectedFiles,
  files,
  hasSelectedFiles,
  handleUploadFiles,
  hasUploadingFiles,
  getFileIcon,
  getStatusIcon,
  handleRemoveFile,
  hasSummarizing,
  hasSuccessOrSummarized,
  handleSummarize,
}: FileUploaderProps) {
  return (
    <section className="h-fit rounded-3xl border border-border/80 bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Upload Medical Files
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload medical records, test results, or other health documents for
        summarization.
      </p>
      <div className="mt-4 space-y-4">
        <div
          className={cn(
            'rounded-2xl border-2 border-dashed p-8 text-center',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border/80'
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
                  className="flex items-center space-x-3 rounded-2xl border border-border/80 bg-background/70 p-3"
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
                      {file.status === 'summarizing' && (
                        <p className="text-xs text-blue-500">Summarizing...</p>
                      )}
                      {file.status === 'selected' && (
                        <p className="text-xs text-amber-500">
                          Ready to upload
                        </p>
                      )}
                      {file.status === 'success' && (
                        <p className="text-xs text-green-500">Uploaded</p>
                      )}
                      {file.status === 'summarized' && (
                        <p className="text-xs text-green-500">Summarized</p>
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
                      disabled={
                        file.status === 'uploading' ||
                        file.status === 'summarizing'
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Button
          className="w-full"
          disabled={
            hasSummarizing || hasUploadingFiles || !hasSuccessOrSummarized
          }
          onClick={handleSummarize}
        >
          {hasUploadingFiles ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Summarize Files'
          )}
        </Button>
      </div>
    </section>
  );
});

export default FileUploader;
