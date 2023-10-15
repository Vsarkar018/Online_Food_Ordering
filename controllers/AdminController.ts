import { NextFunction, Request, Response } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { GenerateEncryptedPassword, GenerateSalt } from '../utility';
import { StatusCodes } from 'http-status-codes';

export const FindVendor = async (ID: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(ID);
  }
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    address,
    email,
    foodTypes,
    ownerName,
    password,
    phone,
    pincode,
  } = <CreateVendorInput>req.body;
  const existingUser = await FindVendor('', email);
  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'User already exist with this email ID' });
  }
  const salt = await GenerateSalt();

  const userPassword = await GenerateEncryptedPassword(password, salt);

  const createVendor = await Vendor.create({
    name,
    address,
    pincode,
    foodTypes,
    email,
    password: userPassword,
    salt: salt,
    ownerName,
    phone,
    rating: 0,
    serviceAvailable: false,
    coverlmages: [],
  });

  return res.status(StatusCodes.CREATED).json(createVendor);
};

export const GetVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const vendors = await Vendor.find();
  if (vendors !== null) {
    return res.status(StatusCodes.OK).json(vendors);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: 'Vendors data not available' });
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const vendorId = req.params.id;
  const vendor = await FindVendor(vendorId);
  if (vendor !== null) {
    return res.status(StatusCodes.OK).json(vendor);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: 'Vendor data not available' });
};
