import db from '../db';

import { PlatformPermission } from './permission.model';

async function upsertPermission(permission: PlatformPermission) {
  const upsert = await db.Permission.findOneAndUpdate(
    { name: permission.name, type: permission.type },
    permission,
    { upsert: true }
  );
  if (upsert) {
    return true;
  }
  return 'did-not-upsert';
}

async function getAllDashboardPermission() {
  const dashboardPermission = await db.Permission.find({ type: 'dashboard' });
  const screenPermission = await db.Permission.find({ type: 'screen' });
  // await db.Record.create(data);

  return [...dashboardPermission, ...screenPermission];
}

// todo: getDashboardByName is in the wrong service, it should be on design service
async function getDashboardByName(payload: { name: any }) {
  return db.Design.findOne({ name: payload.name });
}

async function getPermissionByName(payload: { name: any }) {
  const permission = await db.Permission.findOne({ name: payload.name });
  if (permission) {
    return permission;
  }
  return 'permission-does-not-exist';
}

async function deletePermissionByName(payload: { name: any }) {
  return db.Permission.findOneAndDelete({ name: payload.name });
}

export default {
  upsertPermission,
  getAllDashboardPermission,
  getDashboardByName,
  deletePermissionByName,
  getPermissionByName,
};
