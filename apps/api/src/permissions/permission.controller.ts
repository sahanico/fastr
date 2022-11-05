import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import permissionService from './permission.service';

class Permission {
  static async upsertPermission(req: PlatformRequest | Request, res: Response) {
    const permission = await permissionService.upsertPermission(req.body);
    if (permission) {
      await res.json(permission);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getAllDashboardPermission(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const permission = await permissionService.getAllDashboardPermission();
    if (permission) {
      await res.json(permission);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getDashboardByName(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const permission = await permissionService.getDashboardByName(req.body);
    if (permission) {
      await res.json(permission);
    } else {
      await res.sendStatus(404);
    }
  }

  static async getPermissionByName(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const permission = await permissionService.getPermissionByName(req.body);
    // if(permission) {
    //   await res.json(permission)
    // } else {
    //   await res.sendStatus(404)
    // }
    if (permission === 'permission-does-not-exist') {
      await res.status(200).send('permission-does-not-exist');
    } else {
      await res.json(permission);
    }
  }

  static async deletePermissionByName(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const permission = await permissionService.deletePermissionByName(req.body);
    if (permission) {
      await res.json(permission);
    } else {
      await res.sendStatus(404);
    }
  }
}

export default Permission;
