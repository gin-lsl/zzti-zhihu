// const jwt = require('jsonwebtoken');
// const AppConfig = require('./');
import { verify } from 'jsonwebtoken';
import { AppConfig } from '../config';

verify('', AppConfig.JWT_SECRET__SIGN, (err, arr) => {
  console.log('err: ', err);
  console.log('arr: ', arr);
});
