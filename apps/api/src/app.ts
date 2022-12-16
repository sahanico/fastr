import path from 'path';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';

import errorHandler from './_middleware/error-handler';
import routes from './routes';
import User from './users/user.controller';

const app = express();
const multipart = require('connect-multiparty');

process.on("uncaughtException", function(err) {
  console.error(err);
});

// @ts-ignore
global.appRoot = path.resolve(__dirname);

app.use(logger('dev'));
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  })
);
app.post('/api/user/reset-password/:email', User.resetPassword as any);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(errorHandler);
app.use(multipart({ uploadDir: './files' }));

routes(app);

app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Default Api Route',
  })
);

export default app;
