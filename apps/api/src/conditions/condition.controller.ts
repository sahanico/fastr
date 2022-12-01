import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import conditionService from './condition.service';

class Condition {
  static async runCondition(req: PlatformRequest | Request, res: Response) {
    console.log('----------------------------------------')
    const { conditions, pool } = req.body
    if (!conditions && !pool) res.sendStatus(500);

    const result = await conditionService.runCondition(
      conditions, pool,
    );

    if (result) {
      await res.json(result);
    } else {
      await res.sendStatus(404);
    }
    console.log('----------------------------------------')
    res.sendStatus(200);
  }
}

export default Condition;
