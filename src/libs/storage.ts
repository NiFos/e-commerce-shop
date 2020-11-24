import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import { parseFile } from './parse';
import { NextApiRequestWithUser } from './withUser';
import sharp from 'sharp';
import { File } from 'formidable';

const bucketName = process.env.GCP_BUCKET || '';
const privateKey = (process.env.GCP_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const projectId = process.env.GCP_PROJECT_ID || '';
const clientEmail = process.env.GCP_CLIENT_EMAIL || '';

interface UploadFileResponse {
  success: boolean;
  message?: string;
}

const storage = new Storage({
  credentials: {
    private_key: privateKey,
    client_email: clientEmail,
  },
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  projectId: projectId,
});

/**
 * Upload photo to Bucket
 * @param path - Path to file
 * @param dest - What you upload: product photo or discount photo
 */
export async function uploadFile(
  req: NextApiRequestWithUser,
  dest: 'products' | 'discounts',
  name: string
): Promise<UploadFileResponse> {
  try {
    const file: File = await parseFile(req);

    if (!file) return { success: false, message: 'Cannot parse file' };

    await sharp(file.path).jpeg().toFile(`upload/${file.name}`);

    fs.unlinkSync(file.path);
    const response = await storage
      .bucket(bucketName)
      .upload(`upload/${file.name}`, {
        destination: `${dest}/${name}.jpg`,
        public: true,
        contentType: 'image/jpeg',
        gzip: true,
      });
    fs.unlinkSync(`upload/${file.name}`);
    if (typeof response[0]?.id === 'undefined') throw 'Not uploaded';

    return {
      success: true,
      message: getPhotoUrl(dest, name),
    };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * Get photo url products or discounts
 * @param dest - products or discounts
 */
export function getPhotoUrl(
  dest: 'products' | 'discounts',
  name: string
): string {
  return `https://${bucketName}.storage.googleapis.com/${dest}/${name}.jpg`;
}
