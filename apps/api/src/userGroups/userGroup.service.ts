import mongoose from 'mongoose';

import db from '../db';

import { PlatformUserGroup } from './userGroup.model';

async function createUserGroup(userGroup: PlatformUserGroup) {
  const exists = await db.UserGroup.findOne({ name: userGroup.name });
  if (!exists) {
    const data = {
      _id: new mongoose.Types.ObjectId(),
      name: userGroup.name,
      label: userGroup.label,
      description: userGroup.description,
      users: userGroup.users,
    };
    await db.UserGroup.create(data);
    return true;
  }
  return 'user-group-exists';
}

async function updateUserGroup(userGroup: PlatformUserGroup) {
  const data = {
    name: userGroup.name,
    label: userGroup.label,
    description: userGroup.description,
    users: userGroup.users,
  };
  const updated = await db.UserGroup.findOneAndUpdate(
    { name: userGroup.name },
    data
  );
  return !!updated;
}

async function getUserGroups() {
  return db.UserGroup.find();
}

async function deleteUserGroupByID(payload: { id: string }) {
  return db.UserGroup.findByIdAndRemove(payload.id);
}

export default {
  createUserGroup,
  getUserGroups,
  deleteUserGroupByID,
  updateUserGroup,
};
