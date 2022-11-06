import { NextFunction, Request } from 'express';

// eslint-disable-next-line import/no-unused-modules
export default function validateRequest(
  req: Request,
  next: NextFunction,
  schema: any
) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    throw `${error.details
      .map((x: { context: any }) => `${x.context.label} is required`)
      .join(', ')}`
  } else {
    req.body = value;
    next();
  }
}
