// import {MongoMemoryServer} from "mongodb-memory-server";
//
// const mongoose = require('mongoose');
//
// /**
//  * Connect to the in-memory database.
//  */
// export const connect = async (mongod: MongoMemoryServer) => {
//   console.log('get uri')
//   const uri = mongod.getUri();
//   console.log('uri: ', uri)
//
//   const mongooseOpts = {
//     useNewUrlParser: true,
//     autoReconnect: true,
//     reconnectTries: Number.MAX_VALUE,
//     reconnectInterval: 1000
//   };
//   console.log('mongoose start connection');
//   const connection = await mongoose.connect(uri, mongooseOpts);
//   console.log('mongoose: connection: ', connection);
//   console.log('mongoose done connection');
// }
//
// /**
//  * Remove all the data for all db collections.
//  */
// export const clearDatabase = async () => {
//   const collections = mongoose.connection.collections;
//
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany();
//   }
// }
//
//
// /**
//  * Drop database, close the connection and stop mongod.
//  */
// export const closeDatabase = async (mongod: MongoMemoryServer) => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongod.stop();
// }
