import { connection, InferSchemaType, Schema } from 'mongoose';

const attachmentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  path: Array,
  record: String,
  createdAt: Date,
});

attachmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformAttachment = InferSchemaType<typeof attachmentSchema>;

export default connection
  .useDb('taxdollar')
  .model('Attachment', attachmentSchema);
