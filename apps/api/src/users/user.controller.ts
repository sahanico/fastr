import { NextFunction, Request, Response } from 'express';
import _ from 'underscore'
import Joi from 'joi';

import validateRequest from '../_middleware/validated-request';
import Role from '../role';
import { PlatformRequest } from '../types';

import userService from './user.service';
import recordService from "../records/record.service";
import db from "../db";

function setTokenCookie(res: Response, token: string) {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
    secure: true,
    sameSite: 'none',
  };
  // @ts-ignore
  res.cookie('refreshToken', token, cookieOptions);
}

class Users {
  static authenticateSchema(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }

  static authenticate(req: PlatformRequest | Request, res: Response) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    return userService
      .authenticate({ email, password, ipAddress })
      .then(({ refreshToken, ...user }) => {
        setTokenCookie(res, refreshToken);
        res.json(user);
      })
      .catch(() => {
        res.send('Username or password is incorrect');
      });
  }

  static async updateUserTermsAndConditions(
    req: PlatformRequest,
    res: Response
  ) {
    const payload = {
      ...req.body,
      acceptedTermsDate: new Date().toISOString(),
    };
    const updatedUser = await userService.updateUserTermsAndConditions(
      req,
      payload
    );
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.sendStatus(400);
    }
  }

  static async updateUserProfile(req: PlatformRequest, res: Response) {
    const payload = {
      ...req.body,
    };
    const updatedUser = await userService.updateUserProfile(req, payload);
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.sendStatus(400);
    }
  }

  static refreshToken(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    // eslint-disable-next-line import/no-named-as-default-member
    userService
      .refreshToken({ token, ipAddress })
      .then(({ refreshToken, ...user }) => {
        setTokenCookie(res, refreshToken);
        res.json(user);
      })
      .catch(next);
    return false;
  }

  static revokeTokenSchema(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      token: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
  }

  static revokeToken(req: PlatformRequest, res: Response, next: NextFunction) {
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.auth.ownsToken(token) && req.auth.role !== Role.Admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    userService
      .revokeToken({ token, ipAddress })
      .then(() => res.json({ message: 'Token revoked' }))
      .catch(next);
    return false;
  }

  static getAll(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    userService
      .getAll()
      .then((users) => res.json(users))
      .catch(next);
    return false;
  }

  static getAllRoleUser(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    userService
      .getAllRoleUser()
      .then((users) => res.json(users))
      .catch(next);
    return false;
  }

  static getAllRoleAdmin(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    userService
      .getAllRoleAdmin()
      .then((users) => res.json(users))
      .catch(next);
    return false;
  }

  static getById(req: PlatformRequest, res: Response, next: NextFunction) {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    userService
      .getById(req.params.id)
      .then((user) => (user ? res.json(user) : res.sendStatus(404)))
      .catch(next);

    return false;
  }

  static getRefreshTokens(
    req: PlatformRequest,
    res: Response,
    next: NextFunction
  ) {
    if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    userService
      .getRefreshTokens(req.params.id)
      .then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
      .catch(next);

    return false;
  }

  static async signup(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await userService.signup(req.body);
      if (response === 'email-exists') {
        res.json({
          success: false,
          message: [
            'Registration unsuccessful, email already exists. ',
            'Please check your email to reset your password',
          ],
        });
      } else {
        res.json({
          success: true,
          message: [
            'Registration successful! You will receive an email with ' +
              'verification instructions',
            'once your account has been approved.',
          ],
        });
      }
    } catch (e) {
      next();
    }

    return false;
  }

  static signupSchema(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      address: Joi.string().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      acceptedTerms: Joi.boolean().valid(true).required(),
    });
    try {
      validateRequest(req, next, schema);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async getApprovalRequests(
    req: PlatformRequest | Request,
    res: Response
  ) {
    try {
      const approvals = await userService.getApprovalRequests();
      if (approvals) {
        return res.json(approvals);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    return false;
  }

  static async approveUser(req: PlatformRequest | Request, res: Response) {
    try {
      const approved = await userService.approveUser(req.params.id);
      if (approved) {
        return res.json(approved);
      }
      return res.sendStatus(404);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    return false;
  }

  static async verifyEmailSchema(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      validationToken: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }

  static async verifyEmail(
    req: PlatformRequest | Request,
    res: Response,
    next: NextFunction
  ) {
    userService
      .verifyEmail(req.body)
      .then(() =>
        res.json({ message: 'Verification successful, you can now login' })
      )
      .catch(next);
  }

  static async resetPassword(req: PlatformRequest, res: Response) {
    const reset = await userService.resetPassword(req);
    if (reset) {
      res.status(200).send('reset-successful');
    } else {
      res.status(200).send('reset-failed');
    }
  }

  static async displayAllUsers(req: PlatformRequest | Request, res: Response) {
    const users = await userService.displayAllUsers();
    if (users) {
      await res.json(users);
    } else {
      await res.sendStatus(404);
    }
  }
  static async updateAccountMember(
    req: PlatformRequest | Request,
    res: Response
  ) {
    const accountMembers = await recordService.getRecordsByObject({ object: 'account_member'});
    for(const accountMember of accountMembers) {
      const user = await recordService.getRecordByObjectID({id: accountMember.data.user});
      if (user && user.data){
        await db.Record.findOneAndUpdate({ _id: accountMember.data.id }, { data: {
          ...accountMember.data,
          first_name: user.data.firstName,
          last_name: user.data.lastName
          }
        });
      }
    }
    res.send(200)
    // await recordService.updateRecord(  {first_name: fullName.split(' ')[0]})
    // await recordService.updateRecord()
  }
}

export default Users;
