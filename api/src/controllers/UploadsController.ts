import uploadConfig from '@/configs/upload.js';
import { type Request, type Response } from 'express';
import { z } from 'zod';

class UploadsController {
  async create(request: Request, response: Response) {
    const fileSchema = z
      .object({
        filename: z.string().min(1, { error: 'File is required' }),
        mimetype: z
          .string()
          .refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), {
            error: `File format invalid: Formats allowed are: ${uploadConfig.ACCEPTED_IMAGE_TYPES}`,
          }),
        size: z
          .number()
          .positive()
          .refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
            error: `Max file size allowed is: ${uploadConfig.MAX_SIZE} mb`,
          }),
      })
      .catchall(z.unknown()); //  allow extra/unknown keys in Zod instead of stripping them out by default

    const { file } = fileSchema.parse(request.file);
    console.log({ file: request.file });

    return response.json({ message: 'ok' });
    try {
    } catch (error) {
      throw error;
    }
  }
}

export { UploadsController };
