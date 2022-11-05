import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import attachmentService from './attachment.service';

// todo : CRUD for attachments
class Attachments {
  static async uploadAttachment(req: PlatformRequest | Request, res: Response) {
    await attachmentService.uploadAttachment(req, res);
  }

  static async getAttachmentsByRecordId(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const attachment = await attachmentService.getAttachmentsByRecordId(
      req.body
    );
    if (attachment) {
      await res.json(attachment);
    } else {
      await res.sendStatus(404);
    }
  }

  static async downloadAttachment(
    req: PlatformRequest | Request,
    res: Response
  ) {
    return attachmentService.downloadAttachment(req, res);
  }
}

export default Attachments;
