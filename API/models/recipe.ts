import { Schema, model } from 'mongoose';
import Joi, { ValidationError as JoiValidationError, ValidationErrorItem as JoiValidationErrorItem } from 'joi';
import { IRecipe, IRecipeDuration, IRecipeIngredient, IRecipeStep, IRecipeTag, RecipeModel } from './types';
import APIValidationError from './apiValidationError';
import APIError from './apiError';

const schemaDefaults = {
  title: {
    minLength: 1,
    maxLength: 100,
  },
  description: {
    minLength: 1,
    maxLength: 1000,
  },
  subtitle: {
    minLength: 1,
    maxLenght: 100,
  },
  ingredient: {
    description: {
      minLength: 1,
      maxLength: 100,
    },
    quantity: {
      min: 0.1,
      max: 1000,
    },
    validUnits: ['kpl', 'g', 'kg', 'l', 'dl', 'cl', 'ml', 'tl', 'rkl'],
  },
  step: {
    title: {
      minLength: 1,
      maxLength: 100,
    },
    description: {
      minLength: 1,
      maxLength: 3000,
    },
  },
};

const inputSchema = {
  title: Joi.string()
    .required()
    .trim()
    .normalize()
    .min(schemaDefaults.title.minLength)
    .max(schemaDefaults.title.maxLength)
    .messages({
      'string.base': 'title must be a string',
      'string.empty': `minimum title length for recipe is ${schemaDefaults.title.minLength} characters`,
      'string.min': `minimum title length for recipe is ${schemaDefaults.title.minLength} characters`,
      'string.max': `maximum title length for recipe is ${schemaDefaults.title.maxLength} characters`,
      'any.required': 'title is required',
    }),
  description: Joi.string()
    .required()
    .trim()
    .normalize()
    .min(schemaDefaults.description.minLength)
    .max(schemaDefaults.description.maxLength)
    .messages({
      'string.base': 'description must be a string',
      'string.empty': `minimum description length for recipe is ${schemaDefaults.description.minLength} characters`,
      'string.min': `minimum description length for recipe is ${schemaDefaults.description.minLength} characters`,
      'string.max': `maximum description length for recipe is ${schemaDefaults.description.maxLength} characters`,
      'any.required': 'description is required',
    }),
  duration: Joi.object()
    .keys({
      hours: Joi.number().required().messages({
        'number.base': 'duration.hours must be a number',
        'any.required': 'duration.hours is required',
      }),
      minutes: Joi.number().required().min(1).max(59).messages({
        'number.base': 'duration.minutes must be a number',
        'number.min': 'minutes must be between 1-59',
        'number.max': 'minutes must be between 1-59',
        'any.required': 'duration.minutes is required',
      }),
    })
    .required()
    .messages({
      'object.base': 'duration must be given as an object',
      'any.required': 'duration is required',
    }),
  tags: Joi.array()
    .items(
      Joi.object()
        .keys({
          name: Joi.string().required().messages({
            'string.base': 'tag.name must be a string',
            'string.empty': 'tag.name is not allowed to be empty',
            'any.required': 'tag.name is required',
          }),
          color: Joi.string().required().messages({
            'string.base': 'tag.color must be a string',
            'string.empty': 'tag.color is not allowed to be empty',
            'any.required': 'tag.color is required',
          }),
        })
        .messages({
          'object.base': 'tag must be given as object',
        })
    )
    .messages({
      'array.base': 'tags must be given as an array of tag objects',
    }),
  portionSize: Joi.number().min(1).required().messages({
    'number.base': 'portionSize must be a number',
    'number.min': 'minimum portion size is 1',
    'any.required': 'portionSize is required',
  }),
  subtitles: Joi.array()
    .items(
      Joi.string()
        .min(schemaDefaults.subtitle.minLength)
        .max(schemaDefaults.subtitle.maxLenght)
        .messages({
          'string.base': 'subtitle must be a string',
          'string.empty': `minimum subtitle length for recipe is ${schemaDefaults.subtitle.minLength} characters`,
          'string.min': `minimum subtitle length for recipe is ${schemaDefaults.subtitle.minLength} characters`,
          'string.max': `maximum subtitle length for recipe is ${schemaDefaults.subtitle.maxLenght} characters`,
        })
    )
    .messages({
      'array.base': 'subtitles must be given as an array of strings',
    }),
  ingredients: Joi.array()
    .items(
      Joi.object()
        .keys({
          quantity: Joi.number()
            .min(schemaDefaults.ingredient.quantity.min)
            .max(schemaDefaults.ingredient.quantity.max)
            .required()
            .messages({
              'number.base': 'ingredient.quantity must be a number',
              'number.min': `minimum quantity for ingredient is ${schemaDefaults.ingredient.quantity.min}`,
              'number.max': `maximum quantity for ingredient is ${schemaDefaults.ingredient.quantity.max}`,
              'any.required': 'ingredient.quantity is required',
            }),
          unit: Joi.string()
            .valid(...schemaDefaults.ingredient.validUnits)
            .messages({
              'string.base': 'ingredient.unit must be a string',
              'string.empty': 'ingredient.unit is not allowed to be empty',
              'any.only': `ingredient.unit must be one of the following:${schemaDefaults.ingredient.validUnits.map(
                str => ` ${str}`
              )}`,
            }),
          description: Joi.string()
            .min(schemaDefaults.ingredient.description.minLength)
            .max(schemaDefaults.ingredient.description.maxLength)
            .required()
            .messages({
              'string.base': 'ingredient.description must be a string',
              'string.empty': 'ingredient.description is not allowed to be empty',
              'string.min': `minimum description length for ingredient is ${schemaDefaults.ingredient.description.minLength} characters`,
              'string.max': `maximum description length for ingredient is ${schemaDefaults.ingredient.description.maxLength} characters`,
              'any.required': 'ingredient.description is required',
            }),
          subtitle: Joi.string().valid(Joi.in('....subtitles')).messages({
            'string.base': 'ingredient.subtitle must be a string',
            'string.empty': 'ingredient.subtitle is not allowed to be empty',
            'any.only': 'ingredient.subtitle must match to the given list of recipe subtitles',
          }),
        })
        .messages({
          'object.base': 'ingredient must be given as an object',
        })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'ingredients must be given as an array of ingredient objects',
      'array.min': 'recipe must contain at least 1 ingredient',
      'any.required': 'ingredients is required',
    }),
  pages: Joi.number().min(1).required().messages({
    'number.base': 'pages must be a number',
    'number.min': 'minimum number of pages is 1',
    'any.required': 'pages is required',
  }),
  instructions: Joi.array()
    .items(
      Joi.object()
        .keys({
          index: Joi.number().min(1).required().messages({
            'number.base': 'instructionStep.index must be a number',
            'number.min': 'instruction steps must start from index 1',
            'any.required': 'instructionStep.index is required',
          }),
          title: Joi.string()
            .min(schemaDefaults.step.title.minLength)
            .max(schemaDefaults.step.title.maxLength)
            .required()
            .messages({
              'string.base': 'instructionStep.title must be a string',
              'string.empty': 'instructionStep.title is not allowed to be empty',
              'string.min': `minimum title length for instruction step is ${schemaDefaults.step.title.minLength}`,
              'string.max': `maximum title length for instruction step is ${schemaDefaults.step.title.maxLength}`,
              'any.required': 'instructionStep.title is required',
            }),
          description: Joi.string()
            .min(schemaDefaults.step.description.minLength)
            .max(schemaDefaults.step.description.maxLength)
            .required()
            .messages({
              'string.base': 'instructionStep.description must be a string',
              'string.empty': 'instructionStep.description is not allowed to be empty',
              'string.min': `minimum description length for instruction step is ${schemaDefaults.step.description.minLength}`,
              'string.max': `maximum description length for instruction step is ${schemaDefaults.step.description.maxLength}`,
              'any.required': 'instructionStep.description is required',
            }),
          pageNumber: Joi.number().min(1).max(Joi.ref('....pages')).required().messages({
            'number.base': 'instructionStep.pageNumber must be a number',
            'number.min': 'page number for instruction step must be greater than 0',
            'number.max': 'page number for instruction step cant be greater that the number of pages in the recipe',
            'any.required': 'instructionStep.pageNumber is required',
          }),
        })
        .messages({
          'object.base': 'instruction step must be given as an object',
        })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'instructions must be given as an array of instruction step objects',
      'array.min': 'minimum number of instruction steps is 1',
      'any.required': 'instructions is required',
    }),
  userId: Joi.string().required().messages({
    'string.base': 'userId must be a string (mongoose objectId)',
    'string.empty': 'userId is not allowed to be empty',
    'any.required': 'userId is required',
  }),
};

const RecipeDurationSchema = new Schema<IRecipeDuration>(
  {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
      min: 1,
      max: 59,
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

const RecipeTagSchema = new Schema<IRecipeTag>(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

const RecipeIngredientSchema = new Schema<IRecipeIngredient>(
  {
    quantity: {
      type: Number,
      required: true,
      min: schemaDefaults.ingredient.quantity.min,
      max: schemaDefaults.ingredient.quantity.max,
    },
    unit: {
      type: String,
      enum: schemaDefaults.ingredient.validUnits,
    },
    description: {
      type: String,
      required: true,
      minlength: schemaDefaults.ingredient.description.minLength,
      maxlength: schemaDefaults.ingredient.description.maxLength,
    },
    subtitle: {
      type: String,
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

const RecipeStepSchema = new Schema<IRecipeStep>(
  {
    index: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      minlength: schemaDefaults.step.title.minLength,
      maxlength: schemaDefaults.step.title.maxLength,
    },
    description: {
      type: String,
      required: true,
      minlength: schemaDefaults.step.description.minLength,
      maxlength: schemaDefaults.step.description.maxLength,
    },
    pageNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: schemaDefaults.title.minLength,
      maxLength: schemaDefaults.title.maxLength,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: schemaDefaults.description.minLength,
      maxLength: schemaDefaults.description.maxLength,
    },
    duration: {
      type: RecipeDurationSchema,
      required: true,
    },
    tags: {
      type: [RecipeTagSchema],
    },
    portionSize: {
      type: Number,
      required: true,
      min: 1,
    },
    subtitles: {
      type: [String],
    },
    ingredients: {
      type: [RecipeIngredientSchema],
      required: true,
      min: 1,
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    instructions: {
      type: [RecipeStepSchema],
      required: true,
      min: 1,
    },
    public: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

RecipeSchema.statics.validateRecipeData = async function (recipeData: IRecipe) {
  const inputValidationSchema = Joi.object(inputSchema);

  try {
    await inputValidationSchema.validateAsync(recipeData, { abortEarly: false, allowUnknown: true });
  } catch (err) {
    if (err instanceof JoiValidationError) {
      return Promise.reject(
        new APIValidationError(
          'Invalid recipe data',
          400,
          err.details.map((e: JoiValidationErrorItem) => e.message)
        )
      );
    }
    return Promise.reject(new APIError('Internal server error while validating recipe data', 500));
  }

  return Promise.resolve('success');
};

const Recipe = model<IRecipe, RecipeModel>('Recipe', RecipeSchema);

export default Recipe;
