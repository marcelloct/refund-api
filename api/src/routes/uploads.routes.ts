import uploadConfig from '@/configs/upload.js';
import { UploadsController } from '@/controllers/UploadsController.js';
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js';
import { Router } from 'express';
import multer from 'multer';

const uploadsRoutes = Router();
const uploadsController = new UploadsController();

const upload = multer(uploadConfig.MULTER);

uploadsRoutes.use(verifyUserAuthorization(['employee']));
uploadsRoutes.post('/', upload.single('file'), uploadsController.create);

export { uploadsRoutes };
