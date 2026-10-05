import fs from 'node:fs';
import path from 'node:path';

import uploadConfig from '@/configs/upload.js';

class DiskStorage {
  async saveFile(file: string) {
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file);
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.access(tmpPath);
    } catch (error) {
      throw new Error(`File not found: ${tmpPath}`);
    }
    // guarantee that folder exists
    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true });
    // move the file from tmp to dest folder
    await fs.promises.rename(tmpPath, destPath);

    return file;
  }

  async deleteFile(file: string, type: 'tmp' | 'upload') {
    const pathFile =
      type === 'tmp' ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER;

    const filePath = path.resolve(pathFile, file);

    try {
      // verify if file exist
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    // remove the file
    fs.promises.unlink(filePath);
  }
}

export { DiskStorage };
