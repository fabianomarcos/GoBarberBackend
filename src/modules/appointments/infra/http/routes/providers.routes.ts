import { Router } from 'express';

import ensureAuthenticated from '../../../../users/infra/http/middleware/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensureAuthenticated);
providersRouter.get('/', providersController.index);

export default providersRouter;
