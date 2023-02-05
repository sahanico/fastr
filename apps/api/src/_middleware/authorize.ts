import {NextFunction, Request, Response} from 'express';
import {expressjwt} from 'express-jwt';
import jwt from 'jsonwebtoken';
import db from '../db';
import {PlatformRecord} from '../records/record.model';
import {PlatformRequest} from '../types';
import {PlatformRefreshToken} from "../users/refresh-token.model";
import userService from "../users/user.service";

function assertRequestHasAuth(req: Request): asserts req is PlatformRequest {
  if (!('auth' in req)) {
    throw new Error('Auth not found in Request Object');
  }
}

const secret: string = process.env.JWT_SECRET || '';

const generateNewJwtToken = async (refreshToken: string | undefined, userId: string): Promise<string> => {
  if (refreshToken === undefined) throw 'Refresh Token not found'
  // check if the refresh token is expired
  const platformRefreshToken: PlatformRefreshToken = await db.RefreshToken.findOne(
    {token: refreshToken}
  );
  // if it is expired, throw an error
  const {expires} = platformRefreshToken;

  if (expires === undefined || expires < new Date(Date.now())) throw 'Refresh token is expired';
  return userService.generateJwtToken({id: userId});
}

// eslint-disable-next-line import/no-unused-modules
export default function authorize(roles: string[] = []) {
  /** roles param can be a single role string (e.g. Role.User or 'User')
   or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
   * */
  return [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const handleErrorNext = async (err: any) => {
          try {
            if (err) {
              if (
                err.name === 'UnauthorizedError' &&
                err.inner.name === 'TokenExpiredError'
              ) {
                const authHeader = req.headers.authorization;
                if (authHeader === undefined) throw 'Auth header is undefined';
                const jwtToken = authHeader.split(' ')[1];
                const decodedToken = jwt.decode(jwtToken);

                if (decodedToken === null) throw 'Failed to decode expired token'

                // Get the refresh token from the cookie

                const refreshToken = req.cookies.refreshToken;

                // Use the refresh token to generate a new JWT token
                const userId: string = decodedToken.sub as string;
                let newJWTToken: string = '';

                newJWTToken = await generateNewJwtToken(refreshToken, userId);
                if (newJWTToken === '') throw 'Failed to generate new jwt token';
                const newAuthHeader = `Bearer ${newJWTToken}`
                req.headers.authorization = newAuthHeader
                res.setHeader('newAuthHeader', newAuthHeader);
                return next();
              }
            }
            next(err);

          } catch (error: any) {
            res.status(440).send({message: error});
          }
        };
        const middleware = expressjwt({
          secret,
          algorithms: ['HS256'],
        });
        await middleware(req, res, await handleErrorNext);
      } catch (error: any) {
        res.status(440).send({message: error})
      }
    },
    expressjwt({
      secret,
      algorithms: ['HS256'],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      assertRequestHasAuth(req);
      const user: PlatformRecord = await db.Record.findOne({
        _id: req.auth.id,
      });
      if (!user || (roles.length && !roles.includes(user.data.role as never))) {
        return res.status(401).json({message: 'Unauthorized'});
      }

      req.auth.role = user.data.role;
      const refreshTokens = await db.RefreshToken.find({user: user._id});
      req.auth.ownsToken = (token: string) =>
        !!refreshTokens.find((x: { token: string }) => x.token === token);
      next();
    },
  ];
}
// module.exports = authorize;
