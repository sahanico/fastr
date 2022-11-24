import { connection, InferSchemaType, Schema } from 'mongoose';

const templateSchema = new Schema({
  _id: Schema.Types.ObjectId,
  path: Array,
  object: String,
  name: String,
});

templateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformTemplate = InferSchemaType<typeof templateSchema>;

export default connection.useDb('taxdollar').model('Template', templateSchema);
