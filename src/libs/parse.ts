import { NextApiRequest } from 'next';
import { IncomingForm } from 'formidable';

const form = new IncomingForm();
/**
 * Parse file from req - return file
 * @param req - Req
 */
export async function parseFile(req: NextApiRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) return;
      resolve(files['']);
    });
  });
}
