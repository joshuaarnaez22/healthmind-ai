import React from 'react';
import FileUploader from './file-uploader';

export default function MedicalFileSummaryContainer() {
  return (
    <>
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
        <div className="grid gap-8 md:grid-cols-2">
          <FileUploader />
        </div>
      </div>
    </>
  );
}
