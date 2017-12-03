import * as Router from 'koa-router';
import UserRoute from './UserRoute';
import HomeRoute from './HomeRoute';
import TopicRoute from './TopicRoute';

const router = new Router();

router.use('/users', UserRoute.routes());
router.use('/topics', TopicRoute.routes());
router.use('/', HomeRoute.routes());

export default router;
