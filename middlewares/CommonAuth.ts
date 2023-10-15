import { NextFunction, Request, Response } from 'express';
import { AuthPayload } from '../dto';
import { ValidateSignature } from '../utility';
import { StatusCodes } from 'http-status-codes';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validate = await ValidateSignature(req);
  if (validate) {
    next();
  } else {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: 'user not Authorize' });
  }
};
