import { Schema, model } from 'mongoose';
import Joi, { ValidationError as JoiValidationError, ValidationErrorItem as JoiValidationErrorItem } from 'joi';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './types';
import APIValidationError from './apiValidationError';
import APIError from './apiError';

const schemaDefaults = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  password: {
    minLength: 8,
    maxLength: 50,
  },
};

const inputSchema = {
  name: Joi.string()
    .required()
    .trim()
    .normalize()
    .min(schemaDefaults.name.minLength)
    .max(schemaDefaults.name.maxLength)
    .regex(/^((?!\$).)*$/)
    .messages({
      'string.base': 'name must be a string',
      'string.empty': 'name is not allowed to be empty',
      'string.min': `minimum name length is ${schemaDefaults.name.minLength} characters`,
      'string.max': `maximum name length is ${schemaDefaults.name.maxLength} characters`,
      'any.required': 'name is required',
    }),
  email: Joi.string().required().trim().normalize().email().messages({
    'string.base': 'email must be a string',
    'string.empty': 'email is not allowed to be empty',
    'string.email': 'email must be in valid format (e.g. user@email.com)',
    'any.required': 'email is required',
  }),
  password: Joi.string()
    .required()
    .min(schemaDefaults.password.minLength)
    .max(schemaDefaults.password.maxLength)
    .messages({
      'string.base': 'password must be a string',
      'string.empty': 'password is not allowed to be empty',
      'string.min': `minimum password length is ${schemaDefaults.password.minLength} characters`,
      'string.max': `maximum password length is ${schemaDefaults.password.maxLength} characters`,
      'any.required': 'password is required',
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.base': 'confirmPassword must be a string',
    'string.empty': 'confirmPassword is not allowed to be empty',
    'any.only': 'confirmation does not equal to given password',
    'any.required': 'confirmPassword is required',
  }),
};

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: schemaDefaults.name.minLength,
      maxLength: schemaDefaults.name.maxLength,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minLength: schemaDefaults.password.minLength,
      maxLength: schemaDefaults.password.maxLength * 2, // hashed password can be longer than the original
      set: (password: string) => bcrypt.hashSync(password, 10),
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        const { password, ...user } = ret;
        return user;
      },
    },
  }
);

UserSchema.statics.validateUserData = async function (userData: IUser) {
  let user = await this.findOne({ name: new RegExp(userData.name, 'i') });
  if (user) return Promise.reject(new APIValidationError('Name is already in use', 409));

  user = await this.findOne({ email: new RegExp(userData.email, 'i') });
  if (user) return Promise.reject(new APIValidationError('Email is already in use', 409));

  const inputValidationSchema = Joi.object({ ...inputSchema });

  try {
    await inputValidationSchema.validateAsync(userData, { abortEarly: false, allowUnknown: true });
  } catch (err) {
    if (err instanceof JoiValidationError) {
      return Promise.reject(
        new APIValidationError(
          'Invalid user data',
          400,
          err.details.map((e: JoiValidationErrorItem) => e.message)
        )
      );
    }
    return Promise.reject(new APIError('Internal server error while validating user data', 500));
  }

  return Promise.resolve('Success');
};

UserSchema.methods.verifyPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
