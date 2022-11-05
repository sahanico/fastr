import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import objectService from './objectDictionary.service';

class ObjectDictionaryController {
  static async getAllObjects(req: PlatformRequest | Request, res: Response) {
    const objects = await objectService.getAllObjects();
    if (objects) {
      await res.json(objects);
    } else {
      await res.sendStatus(404);
    }
  }

  static async createObject(req: PlatformRequest | Request, res: Response) {
    const object = await objectService.createObject(req.body);
    if (object === 'object-exists') {
      await res.status(200).send('object-exists');
    } else {
      await res.json(object);
    }
    // if(object) {
    //   await res.json(object)
    // } else {
    //   await res.sendStatus(404)
    // }
  }

  static async updateObjectById(req: PlatformRequest | Request, res: Response) {
    const payload = { ...req.body };
    const object = await objectService.updateObjectById(payload);
    if (object) {
      res.status(200).send(object);
    } else {
      res.sendStatus(400);
    }
  }

  static async deleteObjectById(req: PlatformRequest | Request, res: Response) {
    const object = await objectService.deleteObjectById(req.body);
    if (object) {
      await res.json(object);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getObjectByName(req: PlatformRequest | Request, res: Response) {
    const object = await objectService.getObjectByName(req.body);
    if (object) {
      await res.json(object);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getObjectById(req: PlatformRequest | Request, res: Response) {
    const object = await objectService.getObjectById(req.body);
    if (object) {
      await res.json(object);
    } else {
      await res.sendStatus(404);
    }
  }

  // static async getFieldByObjectName(req: PlatformRequest | Request, res: Response) {
  //   const field = await objectService.getFieldByObjectName(req.body)
  //   if(field) {
  //     await res.json(field)
  //   } else {
  //     await res.sendStatus(404)
  //   }
  // }
  static async createObjectFields(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const objectField = await objectService.createObjectFields(req.body);

    if (objectField === 'field-exists') {
      await res.status(200).send('field-exists');
    } else {
      await res.json(objectField);
    }
  }

  static async updateObjectFieldById(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const objectField = await objectService.updateObjectFieldById();
    // @ts-ignore
    if (objectField) {
      await res.json(objectField);
    } else {
      await res.sendStatus(404);
    }
  }

  static async deleteObjectField(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const objectField = await objectService.deleteObjectField(req.body);
    if (objectField) {
      await res.json(objectField);
    } else {
      await res.sendStatus(404);
    }
  }
}

export default ObjectDictionaryController;
