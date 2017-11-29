import { Context } from 'koa';
import * as Debug from 'debug';
import * as Router from 'koa-router';

const router = new Router();
const debug = Debug('zzti-zhihu:routes:home');

const index = async (ctx: Context, next: () => Promise<any>) => {
  debug('首页');
  await next();
  ctx.body = {
    success: true,
    questions: [
      {
        id: 0,
        title: '关于UWP项目的可行性分析',
        body: '关于这个项目我有一些想法，但是感觉有些东西不很合适',
        author: {
          id: 'a123',
          username: 'lisl',
          email: 'gin_lsl@outlook.com'
        }
      },
      {
        id: 1,
        title: '前端Angular版本关系',
        body: '这几个版本到底有什么关系?',
        author: {
          id: 'a124',
          username: 'heheda',
          email: 'hehe@outlook.com'
        }
      }
    ]
  }
}

router.get('/', index);

export default router;
