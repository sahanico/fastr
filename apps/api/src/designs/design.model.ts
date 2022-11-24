import { connection, InferSchemaType, Schema } from 'mongoose';

const designSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  label: String,
  object: String,
  type: String,
  meta: Object,
});

designSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformDesign = InferSchemaType<typeof designSchema>;

export default connection.useDb('taxdollar').model('Design', designSchema);
