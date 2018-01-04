import * as Router from 'koa-router';
import { QuestionController } from '../controllers/QuestionController';
import { UserController } from '../controllers/UserController';

const router = new Router();

router.get('/collect/:id', UserController.verifyJwt, QuestionController.collect);
router.get('/cancel-collect/:id', UserController.verifyJwt, QuestionController.cancelCollect);
router.get('/up/:id', UserController.verifyJwt, QuestionController.up);
router.get('/cancel-up/:id', UserController.verifyJwt, QuestionController.cancelUp);
router.get('/:id', QuestionController.getById);
router.get('/', QuestionController.getAll);

router.post('/post', UserController.verifyJwt, QuestionController.postTopic);

export default router;
