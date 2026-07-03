import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { logger } from './logger';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, ''); // no trailing slash

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET || !PUBLIC_URL) {
    throw new Error('R2 storage env vars must be defined: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL');
}

export const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

/**
 * Uploads a file buffer to R2 and returns its public URL + storage key.
 */
export async function uploadToR2(
    buffer: Buffer,
    originalname: string,
    mimetype: string
): Promise<{ key: string; url: string }> {
    const ext = path.extname(originalname).toLowerCase();
    const key = `${uuidv4()}${ext}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
        })
    );

    return { key, url: `${PUBLIC_URL}/${key}` };
}

/**
 * Deletes a file from R2 by its storage key (the filename, not the full URL).
 */
export async function deleteFromR2(key: string): Promise<void> {
    try {
        await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch (err) {
        logger.error('R2 delete failed:', err);
    }
}