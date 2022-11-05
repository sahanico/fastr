import { connection, InferSchemaType, Schema } from 'mongoose';

const userGroupSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  label: String,
  description: String,
  users: Array,
});

userGroupSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformUserGroup = InferSchemaType<typeof userGroupSchema>;

export default connection
  .useDb('taxdollar')
  .model('UserGroup', userGroupSchema);
