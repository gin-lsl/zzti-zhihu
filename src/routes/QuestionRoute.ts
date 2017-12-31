import * as Router from 'koa-router';
import { QuestionController } from '../controllers/QuestionController';
import { UserController } from '../controllers/UserController';

const router = new Router();

router.get('/collect/:qid', UserController.verifyJwt, QuestionController.collect);
router.get('/cancel-collect/:qid', UserController.verifyJwt, QuestionController.cancelCollect);
router.get('/:id', QuestionController.getById);
router.get('/', QuestionController.getAll);

router.post('/post', UserController.verifyJwt, QuestionController.postTopic);

export default router;
