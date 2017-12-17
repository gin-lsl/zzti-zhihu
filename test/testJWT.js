const jwt = require('jsonwebtoken');

jwt.verify('', 'asdfasdfasdf', (err, arr) => {
  console.log('err: ', err);
  console.log('arr: ', arr);
});
