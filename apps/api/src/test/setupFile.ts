import { afterAll, beforeAll } from '@jest/globals';
import mongoose from 'mongoose';

beforeAll(async () => {
  // put your client connection code here, example with mongoose:
  const mongoURI = process.env.MONGO_URI;
  if (mongoURI === undefined)
    throw new Error(
      "process.env['MONGO_URI'] is undefined in the mongodb-memory-server setupFile.ts"
    );
  await mongoose.connect(mongoURI);
  await mongoose.connection.db.createCollection('attachments');
  await mongoose.connection.db.createCollection('designs');
  await mongoose.connection.db.createCollection('documents');
  await mongoose.connection.db.createCollection('emails');
  await mongoose.connection.db.createCollection('invoices');
  await mongoose.connection.db.createCollection('objects');
  await mongoose.connection.db.createCollection('payments');
  await mongoose.connection.db.createCollection('permissions');
  await mongoose.connection.db.createCollection('records');
  await mongoose.connection.db.createCollection('refreshtokens');
  await mongoose.connection.db.createCollection('usergroups');
  await mongoose.connection.db.createCollection('users');
});

afterAll(async () => {
  // put your client disconnection code here, example with mongodb:
  await mongoose.disconnect();
});
