import { NextFunction, Request, Response } from 'express';

export default function errorHandler(
  err: string | { name: string; message: string },
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) {
  if (typeof err === 'string') {
    return res
      .status((err as string).toLowerCase().endsWith('not found') ? 404 : 400)
      .json({ message: err });
  }

  if (err?.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err?.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.status(500).json({ message: err.message });
}
