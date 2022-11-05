import { connection, InferSchemaType, Schema } from 'mongoose';

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: { type: String, required: true },
  verificationToken: { type: String, required: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  lastSignedInAt: { type: Date, required: true },
  legacyPasswordHash: { type: String, required: true },
  legacySalt: { type: String, required: true },
  authType: { type: String, required: true },
  createdAt: { type: String, required: true },
  createdBy: { type: String, required: true },
  updatedAt: { type: String, required: true },
  updatedBy: { type: String, required: true },
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformUser = InferSchemaType<typeof userSchema>;

export default connection.useDb('taxdollar').model('User', userSchema);
