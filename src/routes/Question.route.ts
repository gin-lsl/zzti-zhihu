import * as Router from 'koa-router';
import { QuestionController, UserController } from '../controllers/index';
import { verifyObjectIdMiddleware } from '../middleware/index';

const router = new Router();

router.get('/collect/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.collect);
router.get('/cancel-collect/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.cancelCollect);
router.get('/up/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.up);
router.get('/cancel-up/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.cancelUp);
router.get('/down/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.down);
router.get('/cancel-down/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.cancelDown);
router.get('/like/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.like);
router.get('/unlike/:id', verifyObjectIdMiddleware, UserController.verifyJwt, QuestionController.unLike);
router.get('/:id', verifyObjectIdMiddleware, QuestionController.getById);
router.get('/', QuestionController.getAll);

router.post('/post', UserController.verifyJwt, QuestionController.postTopic);

export default router;
