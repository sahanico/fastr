import { NextFunction, Request, Response } from 'express';
import jwt, { secretType } from 'express-jwt';

import db from '../db';
import { PlatformRecord } from '../records/record.model';
import { PlatformRequest } from '../types';

function assertHasUser(req: Request): asserts req is PlatformRequest {
  if (!('user' in req)) {
    throw new Error('Request object without user found unexpectedly');
  }
}

// eslint-disable-next-line import/no-unused-modules
export default function authorize(roles: string[] = []) {
  /** roles param can be a single role string (e.g. Role.User or 'User')
   or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
   * */
  const secret: secretType = process.env.JWT_SECRET || '';
  return [
    jwt({
      secret,
      algorithms: ['HS256'],
      // isRevoked: () =>  (req: Request, payload: any, done: any) => {
      //   // check if the token is revoked
      //   console.log('payload: ', payload)
      //   // const isRevoked = checkIfTokenIsRevoked(payload.jti)
      //   // if (isRevoked) {
      //   //   return done(new Error('Token has been revoked'))
      //   // }
      //   // if it is, call done with the error object
      //   // otherwise, call done without any arguments
      //   done()
      // }
    }),

    // eslint-disable-next-line consistent-return
    async (req: Request, res: Response, next: NextFunction) => {
      assertHasUser(req);
      const user: PlatformRecord = await db.Record.findOne({
        _id: req.user.id,
      });
      if (!user || (roles.length && !roles.includes(user.data.role as never))) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user.role = user.data.role;
      const refreshTokens = await db.RefreshToken.find({ user: user._id });
      req.user.ownsToken = (token: string) =>
        !!refreshTokens.find((x: { token: string }) => x.token === token);
      // todo: ensure the refresh token we find isn't expired.
      next();
    },
  ];
}
// module.exports = authorize;
