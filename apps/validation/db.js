const mongoose = require('mongoose');
function isValidId(id) {
  // @ts-ignore
  return mongoose.Types.ObjectId.isValid(id);
}

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(`${process.env.MONGODB_URI || 'http://localhost:27017'}`, {
  dbName: 'taxdollar',
})
  // eslint-disable-next-line no-console
  .then(() => console.log('done'));
mongoose.Promise = global.Promise;

module.exports = {
  User: require('./user.model'),
  Record: require('./record.model'),
  isValidId
};


