import { Request, Response } from 'express';

import { PlatformRequest } from '../types';

import userGroupService from './userGroup.service';

class UserGroup {
  static async createUserGroup(req: PlatformRequest | Request, res: Response) {
    const userGroup = await userGroupService.createUserGroup(req.body);
    if (userGroup === 'user-group-exists') {
      await res.status(200).send('user-group-exists');
    } else {
      res.json(userGroup);
    }
  }

  static async getUserGroups(req: PlatformRequest | Request, res: Response) {
    const userGroups = await userGroupService.getUserGroups();
    if (userGroups) {
      return res.json(userGroups);
    }
    return res.sendStatus(404);
  }

  static async deleteUserGroupByID(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const userGroup = await userGroupService.deleteUserGroupByID(req.body);
    if (userGroup) {
      await res.json(userGroup);
    } else {
      await res.sendStatus(404);
    }
  }

  static async updateUserGroup(req: PlatformRequest | Request, res: Response) {
    const userGroup = await userGroupService.updateUserGroup(req.body);
    if (userGroup) {
      await res.json(userGroup);
    } else {
      await res.sendStatus(404);
    }
  }
}

export default UserGroup;
