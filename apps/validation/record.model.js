const { connection, Schema } = require('mongoose');

const recordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  object: String,
  data: Object,
  actions: Array,
});

recordSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

// eslint-disable-next-line import/no-unused-modules
module.exports = connection.useDb('taxdollar').model('Record', recordSchema);
