import * as Router from 'koa-router';
import { QuestionController } from '../controllers/QuestionController';
import { UserController } from '../controllers/UserController';

const router = new Router();

router.post('/post', UserController.verifyJwt, QuestionController.postTopic);
router.post('/collect', UserController.verifyJwt, QuestionController.collect);

export default router;
