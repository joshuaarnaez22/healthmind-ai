'use server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { allowedTypes } from '../../lib/utils';

export async function parseFilesToText(files: File[]): Promise<string[]> {
  const extractedTexts: string[] = [];

  for (const file of files) {
    if (!(file instanceof File) || !allowedTypes.includes(file.type)) continue;

    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === 'application/pdf') {
      const parsed = await pdf(buffer);
      extractedTexts.push(parsed.text);
    } else if (
      file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedTexts.push(result.value);
    } else if (file.type === 'text/plain') {
      extractedTexts.push(buffer.toString('utf-8'));
    }
  }

  return extractedTexts;
}
