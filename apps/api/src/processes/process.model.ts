import { connection, InferSchemaType, Schema } from 'mongoose';

const processSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: String,
  name: String,
  users: Object,
  admins: Object,
  userGroups: Object,
});

processSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformProcess = InferSchemaType<typeof processSchema>;

connection.useDb('taxdollar').model('Permission', processSchema);
