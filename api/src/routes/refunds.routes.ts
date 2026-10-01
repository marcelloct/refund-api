import { RefundsController } from '@/controllers/RefundsController.js';
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js';
import { Router } from 'express';

const refundsRoutes = Router();
const refundsController = new RefundsController();

refundsRoutes.post(
  '/',
  verifyUserAuthorization(['employee']),
  refundsController.create
);

refundsRoutes.get(
  '/',
  verifyUserAuthorization(['manager']),
  refundsController.index
);

export { refundsRoutes };
