import { Router } from 'express';
import { sessionsRoutes } from './sessions.routes.js';
import { usersRoutes } from './users.routes.js';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

export { routes };
