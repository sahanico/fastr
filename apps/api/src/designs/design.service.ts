import mongoose from 'mongoose';

import db from '../db';

import { PlatformDesign } from './design.model';

async function getAllDesigns() {
  return db.Design.find();
}

async function createDesign(des: PlatformDesign) {
  const exists = await db.Design.findOne({ name: des.name });
  if (!exists) {
    const data = {
      _id: new mongoose.Types.ObjectId(),
      name: des.name,
      label: des.label,
      type: des.type,
      object: des.object,
      meta: des.meta,
    };

    await db.Design.create(data);
    return data;
  }
  return 'design-exists';
}

async function updateDesign(des: PlatformDesign) {
  const data = {
    label: des.label,
    meta: des.meta,
  };
  const updated = await db.Design.findOneAndUpdate({ name: des.name }, data);
  return !!updated;
}

async function getDesign(designId: string) {
  return db.Design.findById({ designId });
}

async function getAllDashboardDesigns() {
  return db.Design.find({ type: 'dashboard' });
}

async function getDesignByName(payload: { name: string }) {
  return db.Design.findOne({ name: payload.name });
}

async function getDesignsByObjectName(payload: { name: string }) {
  return db.Design.find({ object: payload.name });
}

async function getDesignsByType(payload: { type: string }) {
  return db.Design.find({ type: payload.type });
}

async function deleteDesignByID(payload: { id: string }) {
  return db.Design.findByIdAndRemove(payload.id);
}

async function deleteDesignByName(payload: { name: string }) {
  return db.Design.findOneAndDelete({ name: payload.name });
}

export default {
  createDesign,
  updateDesign,
  getDesign,
  getAllDesigns,
  getDesignByName,
  getAllDashboardDesigns,
  getDesignsByObjectName,
  deleteDesignByID,
  deleteDesignByName,
  getDesignsByType,
};
