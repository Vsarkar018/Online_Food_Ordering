import bcryptjs from 'bcryptjs';
import { AuthPayload, VendorPayload } from '../dto';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { Request } from 'express';

export const GenerateSalt = async () => {
  return await bcryptjs.genSalt();
};

export const GenerateEncryptedPassword = async (
  password: string,
  salt: string,
) => {
  return await bcryptjs.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPass: string,
  savedPassword: string,
  salt: string,
) => {
  return (await GenerateEncryptedPassword(enteredPass, salt)) === savedPassword;
};

export const GenerateToken = (paylod: VendorPayload) => {
  return jwt.sign(paylod, APP_SECRET, { expiresIn: '1d' });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get('Authorization');
  if (signature?.startsWith('Bearer ')) {
    const payload = (await jwt.verify(
      signature.split(' ')[1],
      APP_SECRET,
    )) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
