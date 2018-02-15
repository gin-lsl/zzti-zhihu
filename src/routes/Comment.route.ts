import * as Router from 'koa-router';
import { verifyObjectIdMiddleware } from '../middleware/index';

const router = new Router();

router.post('/q/:qid');
router.post('/q/:qid/r/:rid');

export default router;
