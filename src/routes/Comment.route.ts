import * as Router from 'koa-router';
import { curryVerifyObjectMiddleware, verifyObjectIdMiddleware } from '../middleware/index';
import { UserController, CommentController } from '../controllers/index';

const router = new Router();

// '/q/:qid/r/:rid'
router.post(
  '/q/:qid/r/:rid',
  curryVerifyObjectMiddleware(['qid', 'rid']),
  UserController.verifyJwt,
  CommentController.postComment,
);

router.post(
  '/q/:qid',
  curryVerifyObjectMiddleware(['qid']),
  UserController.verifyJwt,
  CommentController.postComment,
);

router.get('/:id', verifyObjectIdMiddleware, CommentController.getByQuestionId);

export default router;
