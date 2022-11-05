import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import paymentService from './payment.service';

class Payments {
  static async getSessionToken(req: PlatformRequest | Request, res: Response) {
    const token = await paymentService.getSessionToken(req);
    if (token) {
      await res.json(token);
    } else {
      await res.sendStatus(404);
    }
  }
}
export default Payments;
