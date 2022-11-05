import { connection, InferSchemaType, Schema } from 'mongoose';

const permissionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: String,
  name: String,
  label: String,
  users: Object,
  admins: Object,
  userGroups: Object,
});

permissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export type PlatformPermission = InferSchemaType<typeof permissionSchema>;

export default connection
  .useDb('taxdollar')
  .model('Permission', permissionSchema);
