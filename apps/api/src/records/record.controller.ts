import {Request, Response} from 'express';
import _ from 'underscore';

import designService from '../designs/design.service';
import eventService from '../events/event.service';
import objectService from '../objectDictionary/objectDictionary.service';
import {PlatformRequest} from '../types';

import recordService from './record.service';
import filterService from "../filters/filter.service";
import conditionService from "../conditions/condition.service";

class Record {
  /**
   * 1. Sanitize and create base record without ObjectArray fields
   * 2. Trigger create event record for base record
   * 3. Create in-list records
   * 4. Trigger create event record for each in-list record
   * 5. Update base record with new ObjectArray record ids
   */
  static async createRecord(req: PlatformRequest | Request, res: Response) {
    // create base record without objectArray fields
    console.log('-----------------------------------------');
    const { data } = req.body;
    console.log('data: ', data);
    const object = await objectService.getObjectByName({
      name: req.body.object,
    });
    const autoIncrementFields = {};
    if (object && object.fields) {
      _.each(object.fields, (field) => {
        // if (field.type === 'object_array') {
        //   objectArrayFields[field.name] = data[field.name];
        //   data = _.omit(data, field.name);
        // }
        if (field.type === 'number' && field.meta.autoIncrement) {
          // @ts-ignore
          autoIncrementFields[field.name] = data[field.name];
        }
      });
    }
    console.log('autoIncrementFields: ', autoIncrementFields)
    const now = new Date().toISOString();
    // @ts-ignore
    data.createdBy = req.auth.id;
    data.createdAt = now;
    // @ts-ignore
    data.updatedBy = req.auth.id;
    data.updatedAt = now;

    for (const key of _.keys(autoIncrementFields)) {
      const val = await recordService.autoIncrementField(
        req.body.object,
        key
      );
      if (val) {
        // @ts-ignore
        data[key] = parseInt(val, 10) + 1;
      } else {
        data[key] = 100;
      }
      console.log('key: ', key);
      console.log('data[key]: ', data[key]);
    }
    console.log('data: ', data);
    const record = await recordService.createRecord({
      object: req.body.object,
      data,
      actions: []
    });
    if (!record) await res.sendStatus(400);
    await eventService.postCreateRecord(record);
    return res.json(record);

  }

  static async updateRecord(req: PlatformRequest | Request, res: Response) {
    const payload = {...req.body};
    // @ts-ignore
    const record = await recordService.updateRecord(payload, req.auth);
    if (record) {
      res.status(200).send(record);
    } else {
      res.sendStatus(400);
    }
  }

  static async getAllRecords(req: PlatformRequest | Request, res: Response) {
    const records = await recordService.getAllRecords();
    if (records) {
      await res.json(records);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getRecordsByObject(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const records = await recordService.getRecordsByObject(req.body);
    if (records) {
      await res.json(records);
    } else {
      await res.sendStatus(404);
    }
  }
  static async getRecordsForList(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const { list: listName, system, input } = req.body;

    // get the list
    const list = await designService.getDesignByName({ name: listName});
    let records = await recordService.getRecordsByObject({ object: list.object });


    // filter records
    let filter: any;
    if (system.user.role === 'Admin' && list.meta.adminFilter) {
      filter = await designService.getDesignByName({ name: list.meta.adminFilter });
    }
    if (system.user.role === 'User' && list.meta.filter) {
      filter = await designService.getDesignByName({ name: list.meta.filter });
    }
    if (filter) {
      // compose state for filter:
      let state: any = {
        pool: {
          [filter.name]: {
            name: filter.name,
            object: filter.object,
            text: filter.label,
            value: {
              name: filter.name,
              object: filter.object
            },
            data: records,
          },
        },
        system,
      };
      if (input) {
        state.pool = {
          ...state.pool,
          [input.object]: {
            object: input.object,
            type: 'input',
            data: input.data
          }
        }
      }
      records = await filterService.runFilter(filter.meta.conditions, state);
    }
    // select actions to display
    for(const action of list.meta.actions) {
      for(const record of records) {
        if (action.conditions.statements.length > 0) {
          // run condition
          const evaluation = await conditionService.runCondition(
            action.conditions,
            {
              [list.name]: {
                name: list.name,
                object: list.object,
                text: list.label,
                value: {
                  name: list.name,
                  object: list.object
                },
                data: record.data
              },
            }
          )
          if (evaluation) {
            record.actions ? record.actions.push(action) : record.actions = [action];
          }
        } else {
          record.actions ? record.actions.push(action) : record.actions = [action];
        }
      }
    }
    if (records) {
      const updatedRecords = await recordService.transformRecordObjects(records, list.object);
      await res.json(updatedRecords);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getRecordByObjectAndField(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const record = await recordService.getRecordByObjectAndField(req.body);
    if (record) {
      await res.json(record);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getRecordByObjectID(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const record = await recordService.getRecordByObjectID(req.body);
    if (record) {
      await res.json(record);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getRecordsByObjectWithFilter(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const records = await recordService.getRecordsByObject({
      object: req.body.object,
    });
    const filter = await designService.getDesignByName({
      name: req.body.filter,
    });
    const adminFilter = await designService.getDesignByName({
      name: req.body.adminFilter,
    });
    let filteredRecords = records;
    // @ts-ignore
    if (req.auth.role === 'Admin' && adminFilter) {
      filteredRecords = await recordService.filterRecords(
        req.body.object,
        records,
        adminFilter,
        req.body.system,
        req.body.input
      );
      // @ts-ignore
    } else if (req.auth.role === 'User' && filter) {
      filteredRecords = await recordService.filterRecords(
        req.body.object,
        records,
        filter,
        req.body.system,
        req.body.input
      );
    }

    if (filteredRecords) {
      await res.json(filteredRecords);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getRecordByName(req: PlatformRequest | Request, res: Response) {
    const records = await recordService.getRecordByName(req.body);
    if (records) {
      await res.json(records);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getSummaryByObject(
    req: PlatformRequest | Request,
    res: Response
  ) {
    /**
     * todo : check if the payload / req.body has input , condition, combinator in it.
     * if there in one condition, then ignore the combinator.
     * if the condition has "==" operation, then api call in getRecordsByObjectFields,
     * use the condition as a filter for db query
     * alternatively, create a new service called getRecordsByObjectFieldsWithConditions
     */
    let records: any = {};
    if (req.body.conditions !== undefined) {
      if (req.body.input !== undefined || req.body.conditions.lhs !== '') {
        // @ts-ignore
        records = await recordService.getRecordsByObjectFieldsWithConditions(
          req.body
        );
      }
    } else {
      records = await recordService.getRecordsByObjectFields(req.body);
    }

    let data = {};
    await _.each(req.body.fields, async (field) => {
      let value;
      if (field.operation === 'avg') {
        value = await recordService.getAvg(records, field.name);
      } else if (field.operation === 'count') {
        value = await recordService.getCount(records, field.name);
      } else if (field.operation === 'min') {
        value = await recordService.getMin(records, field.name);
      } else if (field.operation === 'max') {
        value = await recordService.getMax(records, field.name);
      } else if (field.operation === 'sum') {
        value = await recordService.getSum(records, field.name);
      } else if (field.operation === 'group_by_date') {
        value = await recordService.getGroupByDate(records, field.name);
      }
      data = {
        ...data,
        [field.name]: value,
      };
    });
    if (data) {
      await res.json(data);
    } else {
      await res.sendStatus(404);
    }
  }
}

export default Record;
