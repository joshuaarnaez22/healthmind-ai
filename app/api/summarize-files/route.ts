import { allowedTypes } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { streamText } from 'ai';
import { systemPrompt_summary } from '@/lib/prompts';
import { deepseek } from '@ai-sdk/deepseek';

export const config = {
  runtime: 'edge',
};
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const extractedTexts: string[] = [];
    for (const file of files) {
      if (!(file instanceof File) || !allowedTypes.includes(file.type))
        continue;
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

    if (extractedTexts.length === 0) {
      return NextResponse.json(
        { error: 'No valid files were processed' },
        { status: 400 }
      );
    }
    const contents = extractedTexts.map((extractedText) =>
      extractedText.replace(/\n{2,}/g, '\n').trim()
    );

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages: [
        {
          role: 'system',
          content: systemPrompt_summary,
        },
        {
          role: 'user',
          content: `Please summarize all of the following contents there are ${contents.length} number of contents and reply only related to contents:\n\n${contents}`,
        },
      ],
    });

    return result.toDataStreamResponse({
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error uploading  files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
