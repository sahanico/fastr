import { connection, InferSchemaType, Schema } from 'mongoose';

const recordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  object: String,
  data: Object,
});

recordSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformRecord = InferSchemaType<typeof recordSchema>;

// eslint-disable-next-line import/no-unused-modules
export default connection.useDb('fastr').model('Record', recordSchema);
