import mongoose from 'mongoose';
import _ from 'underscore';

import db from '../db';

import { PlatformObject } from './objectDictionary.model';

async function getAllObjects() {
  return db.ObjectDictionary.find();
}

async function createObject(object: PlatformObject) {
  const exists = await db.ObjectDictionary.findOne({ name: object.name });
  if (!exists) {
    const data = {
      _id: new mongoose.Types.ObjectId(),
      name: object.name,
      label: object.label,
      description: object.description,
      templates: object.templates,
      fields: object.fields,
    };
    const nameKeys: (string | number)[] = [];
    const labelKeys: (string | number)[] = [];
    const typeKeys: (string | number)[] = [];
    const descriptionKeys: (string | number)[] = [];

    _.each(object.fields, (item, index) => {
      // @ts-ignore
      data[nameKeys[index]] = item.name;
      // @ts-ignore
      data[labelKeys[index]] = item.label;
      // @ts-ignore
      data[typeKeys[index]] = item.type;
      // @ts-ignore
      data[descriptionKeys[index]] = item.description;
    });

    await db.ObjectDictionary.create(data);
    return data;
  }
  return 'object-exists';
}

async function updateObjectById(payload: { id: any }) {
  return db.ObjectDictionary.findOneAndUpdate({ _id: payload.id }, payload);
}

async function deleteObjectById(payload: { id: any }) {
  return db.ObjectDictionary.findByIdAndRemove(payload.id);
}

async function getObjectByName(payload: { name: any }) {
  return db.ObjectDictionary.findOne({ name: payload.name });
}

async function getObjectById(payload: { id: any }) {
  return db.ObjectDictionary.findOne({ _id: payload.id });
}

async function createObjectFields(payload: {
  id: any;
  newField: { name: any };
}) {
  const exists = await db.ObjectDictionary.findOne({
    _id: payload.id,
    'fields.name': payload.newField.name,
  });
  if (!exists) {
    return db.ObjectDictionary.findOneAndUpdate(
      { _id: payload.id },
      { $push: { fields: payload.newField } }
    );
  }
  return 'field-exists';
}

// todo: call this service on object->field-update.vue
async function updateObjectFieldById() {
  // return db.ObjectDictionary.findOneAndUpdate({ '_id': payload.id })
}

async function deleteObjectField(payload: { id: any; newField: any }) {
  return db.ObjectDictionary.findOneAndUpdate(
    { _id: payload.id },
    { $pull: { fields: payload.newField } }
  );
}

export default {
  getAllObjects,
  createObject,
  updateObjectById,
  deleteObjectById,
  createObjectFields,
  updateObjectFieldById,
  deleteObjectField,
  getObjectByName,
  getObjectById,
};
