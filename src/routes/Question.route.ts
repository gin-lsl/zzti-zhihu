import * as Router from 'koa-router';
import { QuestionController, UserController } from '../controllers/index';
import { verifyObjectIdMiddleware } from '../middleware/index';

const router = new Router();

router.get('/collect/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.collect);
router.get('/cancel-collect/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.cancelCollect);
router.get('/up/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.up);
router.get('/cancel-up/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.cancelUp);
router.get('/:id', verifyObjectIdMiddleware, QuestionController.getById);
router.get('/', QuestionController.getAll);

router.post('/post', UserController.verifyJwt, QuestionController.postTopic);

export default router;
