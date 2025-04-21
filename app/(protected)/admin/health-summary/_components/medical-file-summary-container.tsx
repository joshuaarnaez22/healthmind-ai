'use client';
import FileUploader from './file-uploader';
import { motion } from 'framer-motion';
import { pageAnimations } from '@/lib/motion';

export default function MedicalFileSummaryContainer() {
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
        {/* <div className="grid gap-8 md:grid-cols-2"> */}
        <FileUploader />
        {/* </div> */}
      </div>
    </motion.div>
  );
}
