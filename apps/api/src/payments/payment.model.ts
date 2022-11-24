import { connection, InferSchemaType, Schema } from 'mongoose';

const paymentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  payload: Object,
});

paymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformPayment = InferSchemaType<typeof paymentSchema>;

export default connection.useDb('taxdollar').model('Permission', paymentSchema);
