import * as Router from 'koa-router';
import users from './User';
import homes from './Home';

const router = new Router();

router.use('/users', users.routes());
router.use('/', homes.routes());

export default router;
