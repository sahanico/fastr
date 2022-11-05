import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import processService from './process.service';

class Permission {
  static async runProcess(req: PlatformRequest | Request, res: Response) {
    const process = await processService.getProcessByName(req.body.process);
    if (!process) {
      return false;
    }
    const result = await processService.runProcess(
      process,
      req.body.pool,
      req.body.inputs
    );

    if (result) {
      await res.json(result);
    } else {
      await res.sendStatus(404);
    }
    return true;
  }
}

export default Permission;
