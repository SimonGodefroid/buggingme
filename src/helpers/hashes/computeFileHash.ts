import crypto from 'crypto';

export async function computeFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return crypto.createHash('sha256').update(buffer).digest('hex');
}