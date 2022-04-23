import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request } from 'express';
import User from '../models/user';

const loadUserFromRequest = async (req: Request) => {
  const { authorization } = req.headers;
  const baseErrorMsg = 'Unable to load user from request:';
  if (!authorization) return { error: `${baseErrorMsg} Missing authorization header` };
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('process.env.JWT_SECRET is undefined');
    const { sub } = jwt.verify(authorization.split(' ')[1], secret);
    if (!sub) throw new JsonWebTokenError(`${baseErrorMsg} Invalid token, subject is required`);
    const user = await User.findById(sub).exec();
    if (!user) return { error: `${baseErrorMsg}: User not found` };
    return { user };
  } catch (err) {
    if (err instanceof TokenExpiredError) return { error: `${baseErrorMsg} Authentication token expired` };
    if (err instanceof JsonWebTokenError || err instanceof SyntaxError)
      return { error: `${baseErrorMsg} ${err.message}` };
    return { error: `${baseErrorMsg} Internal server error when loading user` };
  }
};

export default loadUserFromRequest;
