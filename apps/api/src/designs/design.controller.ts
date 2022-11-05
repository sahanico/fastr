import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import designService from './design.service';

class Design {
  static async getAllDesigns(req: PlatformRequest | Request, res: Response) {
    const designs = await designService.getAllDesigns();
    if (designs) {
      await res.json(designs);
    } else {
      await res.sendStatus(404);
    }
  }

  static async createDesign(req: PlatformRequest | Request, res: Response) {
    const design = await designService.createDesign(req.body);
    if (design === 'design-exists') {
      await res.status(200).send('design-exists');
    } else {
      res.json(design);
    }
  }

  static async updateDesign(req: PlatformRequest | Request, res: Response) {
    const design = await designService.updateDesign(req.body);
    if (design) {
      await res.json(design);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getDesign(req: PlatformRequest | Request, res: Response) {
    const design = await designService.getDesign(req.params.id);
    if (design) {
      await res.json(design);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getAllDashboardDesigns(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const design = await designService.getAllDashboardDesigns();
    if (design) {
      await res.json(design);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getDesignByName(req: PlatformRequest | Request, res: Response) {
    const design = await designService.getDesignByName(req.body);
    if (design) {
      await res.json(design);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getDesignsByObjectName(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const designs = await designService.getDesignsByObjectName(req.body);
    if (designs) {
      await res.json(designs);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getDesignsByType(req: PlatformRequest | Request, res: Response) {
    const designs = await designService.getDesignsByType(req.body);
    if (designs) {
      await res.json(designs);
    } else {
      await res.sendStatus(404);
    }
  }

  static async deleteDesignByID(req: PlatformRequest | Request, res: Response) {
    const design = await designService.deleteDesignByID(req.body);
    if (design) {
      await res.json(design);
    } else {
      await res.sendStatus(404);
    }
  }

  static async deleteDesignByName(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const design = await designService.deleteDesignByName(req.body);
    if (design) {
      await res.json(design);
    } else {
      await res.sendStatus(404);
    }
  }
}

export default Design;
