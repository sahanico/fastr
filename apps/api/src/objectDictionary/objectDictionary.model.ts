import { connection, InferSchemaType, Schema } from 'mongoose';

const objectDictionarySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  label: String,
  description: String,
  attachment: Boolean,
  fields: Array,
  templates: Array,
});

objectDictionarySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformObject = InferSchemaType<typeof objectDictionarySchema>;

export default connection
  .useDb('taxdollar')
  .model('Object', objectDictionarySchema);
