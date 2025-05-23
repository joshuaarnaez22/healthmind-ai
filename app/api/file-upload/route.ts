import { prisma } from '@/lib/client';
import { getUserId } from '@/actions/server-actions/user';
import s3Client from '@/lib/s3';
import { allowedTypes } from '@/lib/utils';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.',
        },
        { status: 400 }
      );
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the 10MB limit.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucketFolder =
      process.env.ENVIRONMENT === 'development' ? 'dev-files/' : 'prod-files/';
    const fileId = uuidv4();
    const filename = `${bucketFolder}${fileId}-${file.name.replace(/\s+/g, '-')}`;

    await Promise.all([
      s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: filename,
          Body: buffer,
          ContentType: file.type,
        })
      ),
      prisma.file.create({
        data: {
          userId: user_id,
          key: filename,
          bucket: process.env.AWS_BUCKET_NAME!,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
        },
      }),
    ]);
    return NextResponse.json({ fileId, status: 200 });
  } catch (error) {
    console.error('Error uploading  files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
