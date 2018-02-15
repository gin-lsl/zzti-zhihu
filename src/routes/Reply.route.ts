import * as Router from 'koa-router';
import { verifyObjectIdMiddleware } from '../middleware/index';
import { UserController, ReplyController } from '../controllers/index';

const router = new Router();

router.get('/q/:id', verifyObjectIdMiddleware, ReplyController.getByQuestionId);

router.post('/:id', UserController.verifyJwt, verifyObjectIdMiddleware, ReplyController.postReply);

export default router;
