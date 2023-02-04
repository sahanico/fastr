import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import processService from './process.service';

class Process {
  static async runProcess(req: PlatformRequest | Request, res: Response) {
    const process = await processService.getProcessByName(req.body.process);
    if (!process) {
      res.sendStatus(500)
    }
    // todo: feed inputs into pool variable of type input
    const result = await processService.runProcess(
      process,
      req.body.pool
    );

    if (result) {
      return res.json(result);
    } else {
      await res.sendStatus(404);
    }
    // return res.sendStatus(200);
  }
}

export default Process;
