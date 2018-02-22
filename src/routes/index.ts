import * as Router from 'koa-router';

import CommentRoute from './Comment.route';
import UserRoute from './User.route';
import HomeRoute from './Home.route';
import TopicRoute from './Topic.route';
import QuestionRoute from './Question.route';
import ReplyRoute from './Reply.route';

const router = new Router();

router.use('/users', UserRoute.routes());
// router.use('/topics', TopicRoute.routes());
router.use('/questions', QuestionRoute.routes());
router.use('/replies', ReplyRoute.routes());
router.use('/comments', CommentRoute.routes());
// router.use('/', HomeRoute.routes());

export default router;
