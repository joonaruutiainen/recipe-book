import { Schema, model, ObjectId } from 'mongoose';
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
    .alphanum()
    .min(schemaDefaults.name.minLength)
    .max(schemaDefaults.name.maxLength)
    // .messages({
    //   'string.base': 'name must be a string',
    //   'string.empty': 'name is not allowed to be an empty string',
    //   'string.min': `minimum name length is ${schemaDefaults.name.minLength} characters`,
    //   'string.max': `maximum name length is ${schemaDefaults.name.maxLength} characters`,
    //   'any.required': 'name is required',
    // }),
    .messages({
      'string.base': 'Käyttäjätunnuksen täytyy olla merkkijono',
      'string.empty': 'Käyttäjätunnus ei voi olla tyhjä merkkijono',
      'string.min': `Käyttäjätunnuksen täytyy olla vähintään ${schemaDefaults.name.minLength} merkkiä pitkä`,
      'string.max': `Käyttäjätunnus voi olla enintään ${schemaDefaults.name.minLength} merkkiä pitkä`,
      'any.required': 'Käyttäjätunnus on vaadittu kenttä',
    }),
  email: Joi.string()
    .required()
    .trim()
    .normalize()
    .email()
    // .messages({
    //   'string.base': 'email must be a string',
    //   'string.empty': 'email is not allowed to be an empty string',
    //   'string.email': 'email must be in valid format (e.g. user@email.com)',
    //   'any.required': 'email is required',
    // }),
    .messages({
      'string.base': 'Sähköpostin täytyy olla merkkijono',
      'string.empty': 'Sähköposti ei voi olla tyhjä merkkijono',
      'string.email': 'Sähköposti täytyy antaa oikeassa muodossa (esim. user@email.com)',
      'any.required': 'Sähköposti on vaadittu kenttä',
    }),
  password: Joi.string()
    .required()
    .min(schemaDefaults.password.minLength)
    .max(schemaDefaults.password.maxLength)
    // .messages({
    //   'string.base': 'password must be a string',
    //   'string.empty': 'password is not allowed to be an empty string',
    //   'string.min': `minimum password length is ${schemaDefaults.password.minLength} characters`,
    //   'string.max': `maximum password length is ${schemaDefaults.password.maxLength} characters`,
    //   'any.required': 'password is required',
    // }),
    .messages({
      'string.base': 'Salasanan täytyy olla merkkijono',
      'string.empty': 'Salasana ei voi olla tyhjä merkkijono',
      'string.min': `Salasanan täytyy olla vähintään ${schemaDefaults.password.minLength} merkkiä pitkä`,
      'string.max': `Salasana voi olla enintään ${schemaDefaults.password.maxLength} merkkiä pitkä`,
      'any.required': 'Salasana on vaadittu kenttä',
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    // .messages({
    //   'string.base': 'confirmPassword must be a string',
    //   'string.empty': 'confirmPassword is not allowed to be an empty string',
    //   'any.only': 'confirmation does not equal to given password',
    //   'any.required': 'confirmPassword is required',
    // }),
    .messages({
      'string.base': 'Salasanan vahvistuksen täytyy olla merkkijono',
      'string.empty': 'Salasanan vahvistus ei voi olla tyhjä merkkijono',
      'any.only': 'Salasanan vahvistus ei vastaa annettua salasanaa',
      'any.required': 'Salasanan vahvistus on vaadittu kenttä',
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
        // eslint-disable-next-line
        const { password, _id, ...user } = ret;
        return { id: _id, ...user };
      },
    },
  }
);

UserSchema.statics.validateUserData = async function (userData: IUser) {
  let user = await this.findOne({ name: userData.name }).exec();
  // if (user) return Promise.reject(new APIValidationError('Name is already in use', 409));
  if (user) return Promise.reject(new APIValidationError('Käyttäjätunnus on jo käytössä', 409));

  user = await this.findOne({ email: userData.email }).exec();
  // if (user) return Promise.reject(new APIValidationError('Email is already in use', 409));
  if (user) return Promise.reject(new APIValidationError('Sähköposti on jo käytössä', 409));

  const inputValidationSchema = Joi.object({ ...inputSchema });

  try {
    await inputValidationSchema.validateAsync(userData, { abortEarly: false, allowUnknown: true });
  } catch (err) {
    if (err instanceof JoiValidationError) {
      return Promise.reject(
        new APIValidationError(
          // 'Invalid user data',
          'Virheellinen käyttäjä',
          400,
          err.details.map((e: JoiValidationErrorItem) => e.message)
        )
      );
    }
    return Promise.reject(new APIError('Internal server error while validating user data', 500));
  }

  return Promise.resolve('Success');
};

UserSchema.statics.validateUserName = async function (userId: ObjectId, name: string) {
  const user = await this.findOne({ name }).exec();
  // if (user && user.id !== userId) return Promise.reject(new APIValidationError('Name is already in use', 409));
  if (user && user.id !== userId) return Promise.reject(new APIValidationError('Käyttäjätunnus on jo käytössä', 409));

  const nameValidationSchema = inputSchema.name;

  try {
    await nameValidationSchema.validateAsync(name, { abortEarly: false });
  } catch (err) {
    if (err instanceof JoiValidationError) {
      return Promise.reject(
        new APIValidationError(
          // 'Invalid user name',
          'Virheellinen käyttäjätunnus',
          400,
          err.details.map((e: JoiValidationErrorItem) => e.message)
        )
      );
    }
    return Promise.reject(new APIError('Internal server error while validating user name', 500));
  }

  return Promise.resolve('Success');
};

UserSchema.statics.validateUserEmail = async function (userId: ObjectId, email: string) {
  const user = await this.findOne({ email }).exec();
  // if (user && user.id !== userId) return Promise.reject(new APIValidationError('Email is already in use', 409));
  if (user && user.id !== userId) return Promise.reject(new APIValidationError('Sähköposti on jo käytössä', 409));

  const emailValidationSchema = inputSchema.email;

  try {
    await emailValidationSchema.validateAsync(email, { abortEarly: false });
  } catch (err) {
    if (err instanceof JoiValidationError) {
      return Promise.reject(
        new APIValidationError(
          // 'Invalid user email',
          'Virheellinen sähköposti',
          400,
          err.details.map((e: JoiValidationErrorItem) => e.message)
        )
      );
    }
    return Promise.reject(new APIError('Internal server error while validating user email', 500));
  }
  return Promise.resolve('Success');
};

UserSchema.statics.validateUserPassword = async function (password: string) {
  const passwordValidationSchema = inputSchema.password;

  try {
    await passwordValidationSchema.validateAsync(password, { abortEarly: false });
  } catch (err) {
    if (err instanceof JoiValidationError) {
      return Promise.reject(
        new APIValidationError(
          // 'Invalid user password',
          'Virheellinen salasana',
          400,
          err.details.map((e: JoiValidationErrorItem) => e.message)
        )
      );
    }
    return Promise.reject(new APIError('Internal server error while validating user password', 500));
  }
  return Promise.resolve('Success');
};

UserSchema.methods.verifyPassword = async function (password: string) {
  const correctPassword = await bcrypt.compare(password, this.password);
  if (correctPassword) return Promise.resolve('Success');
  // return Promise.reject(new APIError('Incorrect password', 401));
  return Promise.reject(new APIError('Väärä salasana', 401));
};

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
