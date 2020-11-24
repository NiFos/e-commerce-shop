import { NextApiRequest } from 'next';
import { File, IncomingForm } from 'formidable';

const form = new IncomingForm();
/**
 * Parse file from req - return file
 * @param req - Req
 */
export async function parseFile(req: NextApiRequest): Promise<File> {
  return new Promise((resolve) => {
    form.parse(req, (err, fields, files) => {
      if (err) return;
      resolve(files.file);
    });
  });
}
