import mongoose from 'mongoose';

require('dotenv').config();

function isValidId(id: string) {
  // @ts-ignore
  return mongoose.Types.ObjectId.isValid(id);
}

export default {
  User: require('./users/user.model').default,
  RefreshToken: require('./users/refresh-token.model').default,
  Design: require('./designs/design.model').default,
  Record: require('./records/record.model').default,
  ObjectDictionary: require('./objectDictionary/objectDictionary.model')
    .default,
  Permission: require('./permissions/permission.model').default,
  UserGroup: require('./userGroups/userGroup.model').default,
  Attachment: require('./attachments/attachment.model').default,
  Template: require('./templates/template.model').default,
  isValidId,
};
