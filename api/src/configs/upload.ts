import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

const __dirname = import.meta.dirname;

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
const UPLOADS_FOLDER = path.relative(TMP_FOLDER, 'uploads');
const MAX_SIZE = 3; // 3mb
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

export default {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_SIZE,
  MULTER,
  TMP_FOLDER,
  UPLOADS_FOLDER,
};
