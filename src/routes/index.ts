import * as Router from 'koa-router';
import users from './user';
import homes from './home';

const router = new Router();

router.use('/users', users.routes());
router.use('/', homes.routes());

export default router;
