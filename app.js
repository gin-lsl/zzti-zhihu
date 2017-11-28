const Koa = require('koa');
const router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

app.on(3000, () => {
  console.log('Server listening on 3000');
});
