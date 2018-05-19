import * as Router from 'koa-router';
import { UserController, MessageController } from '../controllers';

const router = new Router();

router.get('/', UserController.verifyJwt, MessageController.getUserAllMessages);

router.put('/looked', UserController.verifyJwt, MessageController.setUserAllMessageToIsLooked);

router.put('/looked/:id', UserController.verifyJwt, MessageController.setIsLooked);

router.del('/', UserController.verifyJwt, MessageController.removeUserAllMessages);
router.del('/:id', UserController.verifyJwt, MessageController.remove);

export default router;
