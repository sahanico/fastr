import http from 'http';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app';

dotenv.config({ path: './.env' });
const hostname = process.env.HOST_ENV || 'localhost';
const port = process.env.HOST_PORT;
const server = http.createServer(app);
process.on("uncaughtException", function(err) {
  console.error(err);
});


// eslint-disable-next-line no-console
mongoose
  .connect(`${process.env.MONGODB_URI || 'http://localhost:27017'}`, {
    dbName: 'taxdollar',
  })
  // eslint-disable-next-line no-console
  .then(() => console.log('done'));
mongoose.Promise = global.Promise;

// @ts-ignore
server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/api`);
});
