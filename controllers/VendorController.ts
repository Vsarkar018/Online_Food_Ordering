import { NextFunction, Request, Response } from 'express';
import { EditVendorInputs, VendorLoginInputs } from '../dto';
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
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Vendor information not Found' });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { foodTypes, name, address, phone } = <EditVendorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingUser = await FindVendor(user._id);
    if (existingUser !== null) {
      existingUser.name = name;
      existingUser.foodTypes = foodTypes;
      existingUser.phone = phone;
      existingUser.address = address;
      const saveResult = await existingUser.save();
      return res
        .status(StatusCodes.OK)
        .json({ message: 'User Updated', data: saveResult });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Vendor information not found' });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  if (user) {
    const existingUser = await FindVendor(user._id);
    if (existingUser !== null) {
      existingUser.serviceAvailable = !existingUser.serviceAvailable;
      const savedResult = await existingUser.save();
      return res.status(StatusCodes.OK).json(savedResult);
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Vendor information not found' });
};
