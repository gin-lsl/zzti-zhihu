import * as Router from 'koa-router';
import UserRoute from './UserRoute';
import HomeRoute from './HomeRoute';
import TopicRoute from './TopicRoute';
import QuestionRoute from './QuestionRoute';

const router = new Router();

router.use('/users', UserRoute.routes());
router.use('/topics', TopicRoute.routes());
router.use('/question', QuestionRoute.routes());
router.use('/', HomeRoute.routes());

export default router;
