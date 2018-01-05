import * as Router from 'koa-router';

import UserRoute from './User.route';
import HomeRoute from './Home.route';
import TopicRoute from './Topic.route';
import QuestionRoute from './Question.route';

const router = new Router();

router.use('/users', UserRoute.routes());
router.use('/topics', TopicRoute.routes());
router.use('/questions', QuestionRoute.routes());
router.use('/', HomeRoute.routes());

export default router;
