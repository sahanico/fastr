import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});

// @ts-ignore
schema.virtual('isExpired').get(() => Date.now() >= this.expires);

// @ts-ignore
schema.virtual('isActive').get(() => !this.revoked && !this.isExpired);

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

// eslint-disable-next-line import/no-unused-modules
export default mongoose.connection.useDb('taxdollar').model('RefreshToken', schema);
