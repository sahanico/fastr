import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import templateService from './template.service';

class Templates {
  static async uploadTemplate(req: PlatformRequest, res: Response) {
    await templateService.uploadTemplate(req, res);
  }

  static async getTemplatesByObject(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const templates = await templateService.getTemplatesByObject(req.body);
    if (templates) {
      await res.json(templates);
    } else {
      await res.sendStatus(404);
    }
  }

  static async downloadTemplate(req: PlatformRequest | Request, res: Response) {
    return templateService.downloadTemplate(req, res);
  }
}

export default Templates;
