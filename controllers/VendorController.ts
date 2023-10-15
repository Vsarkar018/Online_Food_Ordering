import { NextFunction, Request, Response } from 'express';
import { VendorLoginInputs } from '../dto';
import { FindVendor } from './AdminController';
import { StatusCodes } from 'http-status-codes';
import { GenerateToken, ValidatePassword } from '../utility';
import { Authenticate } from '../middlewares';
export const VendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VendorLoginInputs>req.body;
  const existingUser = await FindVendor('', email);
  if (existingUser !== null) {
    const isMatch = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt,
    );
    if (isMatch) {
      const signature = GenerateToken({
        _id: existingUser._id,
        email: existingUser.email,
        foodTypes: existingUser.foodTypes,
        name: existingUser.name,
      });
      return res.status(StatusCodes.OK).json({ signature: signature });
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Incorrect Credentials' });
    }
  }
  return res
    .status(StatusCodes.FORBIDDEN)
    .json({ message: "User doesn't exits" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  if (user) {
    const existingUser = await FindVendor(user._id);
    return res.status(StatusCodes.OK).json(existingUser);
    console.log("i'm reachbale");
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Vendor information not Found' });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
