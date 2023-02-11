import mongoose from 'mongoose';
import _ from 'underscore';

import db from '../db';
import objectService from '../objectDictionary/objectDictionary.service';

import { PlatformRecord } from './record.model';
import ObjectDictionaryService from "../objectDictionary/objectDictionary.service";

async function createRecord(record: PlatformRecord) {
  const objectInfo = await db.ObjectDictionary.findOne({ name: record.object });
  const uniqueFields = [];
  _.each(objectInfo.fields, (field) => {
    if (field.unique === true) {
      uniqueFields.push(field.name);
    }
  });
  const id = new mongoose.Types.ObjectId()
  const data = {
    _id: id,
    object: record.object,
    data: { ...record.data, id: id.toString()},
    createdAt: new Date().toISOString(),
  };

  // todo: uncomment when done
  const create = await db.Record.create(data);
  if (create) {
    return create;
  }
  return false;
}

async function updateRecord(payload: any, user: { id: any }) {
  const now = new Date().toISOString();
  payload.data.updatedBy = user.id;
  payload.data.updatedAt = now;

  console.log('payload: ', JSON.stringify(payload, null, 2));
  return db.Record.findOneAndUpdate({ _id: payload.id }, { data: payload.data });
}

async function getAllRecords() {
  return db.Record.find();
}

async function autoIncrementField(objectName: any, fieldName: string | number) {
  const record = await db.Record.find({ object: objectName }).sort({
    [fieldName]: -1,
  });
  let selectedRecord = {};
  let selectedVal = 0;
  for (let i = 0; i < record.length; i++) {
    if (record[i].data[fieldName] > selectedVal) {
      selectedVal = record[i].data[fieldName];
      selectedRecord = record[i];
    }
  }
  return selectedVal;
}

async function getRecordsByObject(payload: any) {
  return db.Record.find({ object: payload.object });
}

async function getRecordByObjectAndField(payload: {
  object: any;
  field: any;
  value: any;
}) {
  const { object, field, value } = payload;
  const records = await db.Record.find({ object });
  let record = false;
  _.each(records, (rec) => {
    if (Array.isArray(rec.data[field])) {
      _.each(rec.data[field], (item) => {
        if (item === value) {
          record = rec;
        }
      });
    } else if (rec.data[field] === value) {
      record = rec;
    }
  });
  return record;
}

async function getRecordByObjectID(payload: { id: any }) {
  const { id } = payload;
  return db.Record.findOne({ _id: id });
}

function evaluateRhs(
  operand: { type: string; systemField: string; field: string | number },
  system: {
    account: { id: any };
    user: { userId: any };
    account_member: { id: any };
  },
  input: { [x: string]: any }
) {
  if (operand.type === 'system') {
    if (operand.systemField === 'logged_in_account') {
      return system.account.id;
    }

    if (operand.systemField === 'logged_in_user') {
      return system.user.userId;
    }

    if (operand.systemField === 'logged_in_account_member') {
      return system.account_member.id;
    }
  } else if (operand.type === 'input') {
    return input[operand.field];
  }
  return false;
}

function evaluateLhs(
  operand: { name: string | number },
  record: { data: { [x: string]: any } }
) {
  if (record.data[operand.name]) {
    return record.data[operand.name];
  }
  return false;
}

async function filterRecords(
  objectName: any,
  records: any,
  filter: { meta: any },
  system: {
    account: { id: any };
    user: { userId: any };
    account_member: { id: any };
  },
  input: { [x: string]: any }
) {
  const { meta } = filter;
  const filteredRecords: any[] = [];
  const { lhs, rhs, operator } = meta.conditions[0];
  // check what is on lhs
  const right = evaluateRhs(rhs, system, input);
  const lhsObject = await objectService.getObjectByName({ name: objectName });
  const lhsField = _.findWhere(lhsObject.fields, { name: lhs.field });
  _.each(records, (record) => {
    const left = evaluateLhs(lhsField, record);
    switch (operator) {
      case '=':
      case '==':
      case '===':
        if (left === right) filteredRecords.push(record);
        break;
      default:
        break;
    }
  });
  return filteredRecords;
}

async function getRecordByName(payload: { name: any }) {
  return db.Record.find({ 'data.name': payload.name });
}

async function getRecordsByObjectFieldsWithConditions(payload: {
  conditions: { operator: string };
}) {
  if (payload.conditions.operator === '==') {
    // const filter = await db.Record.find({
    //   payload.conditions.lhs :
    // })
  }
}

async function getRecordsByObjectFields(payload: { object: any; fields: any }) {
  const records = await db.Record.find({ object: payload.object });
  const fields = _.pluck(payload.fields, 'name');
  return _.map(records, (record) => {
    const item = {};
    _.each(fields, (field) => {
      if (record.data !== undefined) {
        // @ts-ignore
        item[field] = record.data[field];
      }
    });
    return item;
  });
}

async function getAvg(records: any, name: string) {
  const data: any[] = [];
  _.each(records, (record) => {
    if (name in record) {
      data.push(record[name]);
    }
  });
  const sum = _.reduce(data, (memo, num) => memo + num, 0);
  const count = Object.keys(data).length;
  return parseFloat((sum / count).toFixed(2));
}

async function getCount(records: any, name: string | number) {
  const data: any[] = [];
  _.each(records, (record) => {
    data.push(record[name]);
  });
  const unique = _.uniq(data);
  const arr = {};
  _.each(records, (record) => {
    _.each(unique, (item) => {
      if (item === record[name]) {
        // @ts-ignore
        if (!arr[record[name]]) {
          // @ts-ignore
          arr[record[name]] = 0;
        }
        // @ts-ignore
        arr[record[name]]++;
      }
    });
  });
  return arr;
}

async function getMin(records: any, name: string) {
  const data: any[] = [];
  _.each(records, (record) => {
    if (name in record) {
      data.push(record[name]);
    }
  });
  return _.min(data);
}

async function getMax(records: any, name: string) {
  const data: any[] = [];
  _.each(records, (record) => {
    if (name in record) {
      data.push(record[name]);
    }
  });
  return _.max(data);
}

async function getSum(records: any, name: string) {
  const data: any[] = [];
  _.each(records, (record) => {
    if (name in record) {
      data.push(record[name]);
    }
  });
  return _.reduce(data, (memo, num) => memo + num, 0);
}

async function getGroupByDate(records: any, name: string) {
  const data: any[] = [];
  _.each(records, (record) => {
    if (name in record) {
      if (record[name] !== undefined) {
        data.push(record[name].split('T')[0]);
      }
    }
  });
  const unique = _.uniq(data);
  let arr = {};
  _.each(records, (record) => {
    _.each(unique, (item) => {
      if (item !== undefined && record[name] !== undefined) {
        if (item.split('T')[0] === record[name].split('T')[0]) {
          // @ts-ignore
          if (!arr[record[name].split('T')[0]]) {
            // @ts-ignore
            arr[record[name].split('T')[0]] = 0;
          }
          // @ts-ignore
          arr[record[name].split('T')[0]]++;
        }
      }
    });
  });
  // eslint-disable-next-line no-param-reassign,no-sequences,no-return-assign
  // @ts-ignore
  // prettier-ignore
  // eslint-disable-next-line no-sequences, no-return-assign, no-param-reassign
  const sortObject = (o) => Object.keys(o).sort().reduce((r, k) => ((r[k] = o[k]), r), {});
  arr = sortObject(arr);
  return arr;
}

async function transformRecordObjects(records: any, objectName: string) {
  const object = await ObjectDictionaryService.getObjectByName({ name: objectName });
  let objectFields: any[] = [];
  _.each(object.fields, field => {
    if (field.type === 'object' || field.type === 'object_array' ) {
      objectFields.push(field);
    }
  });
  let dateFields: any[] = [];
  _.each(object.fields, field => {
    if (field.type === 'date' || field.type === 'date_time') {
      dateFields.push(field);
    }
  });
  let userFields: any[] = [];
  _.each(object.fields, field => {
    if (field.type === 'user' ) {
      userFields.push(field);
    }
  });
  for (const field of objectFields) {
    const fieldObject = await ObjectDictionaryService.getObjectByName({ name: field.meta.object });
    if (fieldObject && fieldObject._doc.primaryField) {
      for(const record of records) {
        if (record.data[field.name]) {
          const objectRecord = await getRecordByObjectID({ id: record.data[field.name]})
          if (objectRecord
            && objectRecord.data
            && objectRecord.data[fieldObject._doc.primaryField]
            && record.data[field.name]
          ) {
            record.data[field.name] = {
              value: record.data[field.name],
              text: objectRecord.data[fieldObject._doc.primaryField]
            }
          }
        }
      }
    }
  }
  for (const field of dateFields) {
    for (const record of records) {
      if (record.data[field.name]) {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/New_York",
          hour12: false
        }).format(new Date(record.data[field.name]))
        record.data[field.name] = {
          value: record.data[field.name],
          text:`${formattedDate.substring(6, 10)}-${formattedDate.substring(0, 2)}-${formattedDate.substring(3, 5)} ${formattedDate.substring(11)}`
        };
      }
    }
  }
  for (const field of userFields) {
    for (const record of records) {
      if (record.data[field.name]) {
        const userRecord = await getRecordByObjectID({ id: record.data[field.name]});
        if (userRecord && userRecord.data) {
          record.data[field.name] = {
            value: record.data[field.name],
            text: `${userRecord.data.firstName} ${userRecord.data.lastName}`
          };
        }
      }
    }
  }
  return records;
}

export default {
  createRecord,
  getAllRecords,
  getRecordsByObject,
  getRecordsByObjectFields,
  getRecordByObjectID,
  getAvg,
  getCount,
  getMin,
  getMax,
  getSum,
  getGroupByDate,
  getRecordsByObjectFieldsWithConditions,
  updateRecord,
  getRecordByName,
  filterRecords,
  getRecordByObjectAndField,
  autoIncrementField,
  transformRecordObjects,
};
