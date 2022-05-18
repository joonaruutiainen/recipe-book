import { Schema, model } from 'mongoose';
import Joi, { ValidationError as JoiValidationError, ValidationErrorItem as JoiValidationErrorItem } from 'joi';
import {
  IRecipe,
  IRecipeDuration,
  IRecipeIngredient,
  IRecipeStep,
  IRecipeSubtitle,
  IRecipeTag,
  IRecipeUser,
  RecipeModel,
} from './types';
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
    maxLength: 100,
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
  image: Joi.string()
    .trim()
    .normalize()
    // .messages({
    //   'string.base': 'image must be a string',
    //   'string.empty': 'image is not allowed to be an empty string',
    // }),
    .messages({
      'string.base': 'Kuvatunnisteen täytyy olla merkkijono',
      'string.empty': 'Kuvatunniste ei voi olla tyhjä merkkijono',
    }),
  title: Joi.string()
    .required()
    .trim()
    .normalize()
    .min(schemaDefaults.title.minLength)
    .max(schemaDefaults.title.maxLength)
    // .messages({
    //   'string.base': 'title must be a string',
    //   'string.empty': 'title is not allowed to be an empty string',
    //   'string.min': `minimum title length for recipe is ${schemaDefaults.title.minLength} characters`,
    //   'string.max': `maximum title length for recipe is ${schemaDefaults.title.maxLength} characters`,
    //   'any.required': 'title is required',
    // }),
    .messages({
      'string.base': 'Otsikon täytyy olla merkkijono',
      'string.empty': 'Otsikko ei voi olla tyhjä merkkijono',
      'string.min': `Otsikon täytyy olla vähintään ${schemaDefaults.title.minLength} merkkiä pitkä`,
      'string.max': `Otsikko voi olla enintään ${schemaDefaults.title.maxLength} merkkiä pitkä`,
      'any.required': 'Otsikko on vaadittu kenttä',
    }),
  description: Joi.string()
    .required()
    .trim()
    .normalize()
    .min(schemaDefaults.description.minLength)
    .max(schemaDefaults.description.maxLength)
    // .messages({
    //   'string.base': 'description must be a string',
    //   'string.empty': 'description is not allowed to be an empty string',
    //   'string.min': `minimum description length for recipe is ${schemaDefaults.description.minLength} characters`,
    //   'string.max': `maximum description length for recipe is ${schemaDefaults.description.maxLength} characters`,
    //   'any.required': 'description is required',
    // }),
    .messages({
      'string.base': 'Kuvauksen täytyy olla merkkijono',
      'string.empty': 'Kuvaus ei voi olla tyhjä merkkijono',
      'string.min': `Kuvauksen täytyy olla vähintään ${schemaDefaults.description.minLength} merkkiä pitkä`,
      'string.max': `Kuvaus voi olla enintään ${schemaDefaults.description.maxLength} merkkiä pitkä`,
      'any.required': 'Kuvaus on vaadittu kenttä',
    }),
  duration: Joi.object()
    .keys({
      hours: Joi.number()
        .required()
        // .messages({
        //   'number.base': 'duration.hours must be a number',
        //   'number.min': 'duration.hours must be between 0-99',
        //   'number.max': 'duration.hours must be between 0-99',
        //   'any.required': 'duration.hours is required',
        // }),
        .messages({
          'number.base': 'Reseptin kesto tunteina täytyy olla kokonaisluku',
          'number.min': 'Reseption kesto tunteina täytyy olla välillä 0-99',
          'number.max': 'Reseption kesto tunteina täytyy olla välillä 0-99',
          'any.required': 'Reseptin kesto tunteina on vaadittu kenttä',
        }),
      minutes: Joi.number()
        .required()
        .min(0)
        .max(59)
        // .messages({
        //   'number.base': 'duration.minutes must be a number',
        //   'number.min': 'duration.minutes must be between 0-59',
        //   'number.max': 'duration.minutes must be between 0-59',
        //   'any.required': 'duration.minutes is required',
        // }),
        .messages({
          'number.base': 'Reseptin kesto minuutteina täytyy olla kokonaisluku',
          'number.min': 'Reseption kesto minuutteina täytyy olla välillä 0-59',
          'number.max': 'Reseption kesto minuutteina täytyy olla välillä 0-59',
          'any.required': 'Reseptin kesto minuutteina on vaadittu kenttä',
        }),
    })
    .required()
    // .messages({
    //   'object.base': 'duration must be given as an object',
    //   'any.required': 'duration is required',
    // }),
    .messages({
      'object.base': 'Reseption keston täytyy olla objekti',
      'any.required': 'Reseptin kesto on vaadittu kenttä',
    }),
  tags: Joi.array()
    .items(
      Joi.object()
        .keys({
          name: Joi.string()
            .required()
            // .messages({
            // 'string.base': 'tag.name must be a string',
            // 'string.empty': 'tag.name is not allowed to be an empty string',
            // 'any.required': 'tag.name is required',
            // }),
            .messages({
              'string.base': 'Tunnisteen nimen täytyy olla merkkijono',
              'string.empty': 'Tunnisteen nimi ei voi olla tyhjä merkkijono',
              'any.required': 'Tunnisteen nimi on vaadittu kenttä',
            }),
          color: Joi.string()
            .required()
            // .messages({
            //   'string.base': 'tag.color must be a string',
            //   'string.empty': 'tag.color is not allowed to be an empty string',
            //   'any.required': 'tag.color is required',
            // }),
            .messages({
              'string.base': 'Tunnisteen värin täytyy olla merkkijono',
              'string.empty': 'Tunnisteen väri ei voi olla tyhjä merkkijono',
              'any.required': 'Tunnisteen väri on vaadittu kenttä',
            }),
        })
        // .messages({
        //   'object.base': 'tag must be given as object',
        // })
        .messages({
          'object.base': 'Tunnisteen täytyy olla objekti',
        })
    )
    // .messages({
    //   'array.base': 'tags must be given as an array of tag objects',
    // }),
    .messages({
      'array.base': 'Tunnisteet täytyy antaa listana',
    }),
  portionSize: Joi.number()
    .min(1)
    .required()
    // .messages({
    //   'number.base': 'portionSize must be a number',
    //   'number.min': 'minimum portion size is 1',
    //   'any.required': 'portionSize is required',
    // }),
    .messages({
      'number.base': 'Annosten määrän täytyy olla kokonaisluku',
      'number.min': 'Annosten määrän täytyy olla vähintään 1',
      'any.required': 'Annosten määrä on vaadittu kenttä',
    }),
  subtitles: Joi.array()
    .items(
      Joi.object()
        .keys({
          index: Joi.number()
            .min(1)
            .required()
            // .messages({
            //   'number.base': 'subtitle.index must be a number',
            //   'number.min': 'subtitles must start from index 1',
            //   'any.required': 'subtitle.index is required',
            // }),
            .messages({
              'number.base': 'Alaotsiko numeron täytyy olla kokonaisluku',
              'number.min': 'Alaotsikoiden numeroinnin täytyy alkaa luvusta 1',
              'any.required': 'Alaotsikon numero on vaadittu kenttä',
            }),
          name: Joi.string()
            .min(schemaDefaults.subtitle.minLength)
            .max(schemaDefaults.subtitle.maxLength)
            .required()
            // .messages({
            //   'string.base': 'subtitle.name must be a string',
            //   'string.empty': 'subtitle.name is not allowed to be an empty string',
            //   'string.min': `minimum name length for subtitle is ${schemaDefaults.step.title.minLength} characters`,
            //   'string.max': `maximum name length for subtitle is ${schemaDefaults.step.title.maxLength} characters`,
            //   'any.required': 'subtitle.name is required',
            // }),
            .messages({
              'string.base': 'Alaotsikon nimen täytyy olla merkkijono',
              'string.empty': 'Alaotsikon nimi ei voi olla tyhjä merkkijono',
              'string.min': `Alaotsikon nimen täytyy olla vähintään ${schemaDefaults.step.title.minLength} merkkiä pitkä`,
              'string.max': `Alaotsikon nimi voi olla enintään ${schemaDefaults.step.title.maxLength} merkkiä pitkä`,
              'any.required': 'Alaotsikon nimi on vaadittu kenttä',
            }),
        })
        // .messages({
        //   'object.base': 'subtitle must be given as an object
        // })
        .messages({
          'object.base': 'Alaotsikon täytyy olla objekti',
        })
    )
    // .messages({
    //   'array.base': 'subtitles must be given as an array of subtitle objects',
    // }),
    .messages({
      'array.base': 'Alaotsikot täytyy antaa listana',
    }),
  ingredients: Joi.array()
    .items(
      Joi.object()
        .keys({
          quantity: Joi.number()
            .min(schemaDefaults.ingredient.quantity.min)
            .max(schemaDefaults.ingredient.quantity.max)
            // .messages({
            //   'number.base': 'ingredient.quantity must be a number',
            //   'number.min': `minimum quantity for ingredient is ${schemaDefaults.ingredient.quantity.min}`,
            //   'number.max': `maximum quantity for ingredient is ${schemaDefaults.ingredient.quantity.max}`,
            // }),
            .messages({
              'number.base': 'Ainesosan määrän täytyy olla numero',
              'number.min': `Ainesosan määrän täytyy olla vähintään ${schemaDefaults.ingredient.quantity.min}`,
              'number.max': `Ainesosan määrä voi olla vähintään ${schemaDefaults.ingredient.quantity.max}`,
            }),
          unit: Joi.string()
            .valid(...schemaDefaults.ingredient.validUnits)
            // .messages({
            //   'string.base': 'ingredient.unit must be a string',
            //   'string.empty': 'ingredient.unit is not allowed to be an empty string',
            //   'any.only': `ingredient.unit must be one of the following:${schemaDefaults.ingredient.validUnits.map(
            //     str => ` ${str}`
            //   )}`,
            // }),
            .messages({
              'string.base': 'Ainesosan suureen täytyy olla merkkijono',
              'string.empty': 'Ainesosan suure ei voi olla tyhjä merkkijono',
              'any.only': `Ainesosan suureen täytyy olla yksi seuraavista:${schemaDefaults.ingredient.validUnits.map(
                str => ` ${str}`
              )}`,
            }),
          description: Joi.string()
            .min(schemaDefaults.ingredient.description.minLength)
            .max(schemaDefaults.ingredient.description.maxLength)
            .required()
            // .messages({
            //   'string.base': 'ingredient.description must be a string',
            //   'string.empty': 'ingredient.description is not allowed to be an empty string',
            //   'string.min': `minimum description length for ingredient is ${schemaDefaults.ingredient.description.minLength} characters`,
            //   'string.max': `maximum description length for ingredient is ${schemaDefaults.ingredient.description.maxLength} characters`,
            //   'any.required': 'ingredient.description is required',
            // }),
            .messages({
              'string.base': 'Ainesosan kuvauksen täytyy olla merkkijono',
              'string.empty': 'Ainesosan kuvaus ei voi olla tyhjä merkkijono',
              'string.min': `Ainesosan kuvauksen täytyy olla vähintään ${schemaDefaults.ingredient.description.minLength} merkkiä pitkä`,
              'string.max': `Ainesosan kuvaus voi olla enintään ${schemaDefaults.ingredient.description.maxLength} merkkiä pitkä`,
              'any.required': 'Ainesosan kuvaus on vaadittu kenttä',
            }),
          subtitle: Joi.object()
            .keys({
              index: Joi.number()
                .min(1)
                .required()
                // .messages({
                //   'number.base': 'subtitle.index must be a number',
                //   'number.min': 'subtitles must start from index 1',
                //   'any.required': 'subtitle.index is required',
                // }),
                .messages({
                  'number.base': 'Alaotsiko numeron täytyy olla kokonaisluku',
                  'number.min': 'Alaotsikoiden numeroinnin täytyy alkaa luvusta 1',
                  'any.required': 'Alaotsikon numero on vaadittu kenttä',
                }),
              name: Joi.string()
                .min(schemaDefaults.subtitle.minLength)
                .max(schemaDefaults.subtitle.maxLength)
                .required()
                // .messages({
                //   'string.base': 'subtitle.name must be a string',
                //   'string.empty': 'subtitle.name is not allowed to be an empty string',
                //   'string.min': `minimum name length for subtitle is ${schemaDefaults.step.title.minLength} characters`,
                //   'string.max': `maximum name length for subtitle is ${schemaDefaults.step.title.maxLength} characters`,
                //   'any.required': 'subtitle.name is required',
                // }),
                .messages({
                  'string.base': 'Alaotsikon nimen täytyy olla merkkijono',
                  'string.empty': 'Alaotsikon nimi ei voi olla tyhjä merkkijono',
                  'string.min': `Alaotsikon nimen täytyy olla vähintään ${schemaDefaults.step.title.minLength} merkkiä pitkä`,
                  'string.max': `Alaotsikon nimi voi olla enintään ${schemaDefaults.step.title.maxLength} merkkiä pitkä`,
                  'any.required': 'Alaotsikon nimi on vaadittu kenttä',
                }),
            })
            .valid(Joi.in('....subtitles'))
            // .messages({
            //   'string.base': 'ingredient.subtitle must be a string',
            //   'any.only': 'ingredient.subtitle must match to the given list of recipe subtitles',
            // }),
            .messages({
              'object.base': 'Ainesosaan liitetyn otsikon täytyy olla objekti',
              'any.only': 'Ainesosaan liitetyn otsikon täytyy löytyä annettulta reseptin alaotsikoiden listalta',
            }),
        })
        // .messages({
        //   'object.base': 'ingredient must be given as an object',
        // })
        .messages({
          'object.base': 'Ainesosan täytyy olla objekti',
        })
    )
    .min(1)
    .required()
    // .messages({
    //   'array.base': 'ingredients must be given as an array of ingredient objects',
    //   'array.min': 'recipe must contain at least 1 ingredient',
    //   'any.required': 'ingredients is required',
    // }),
    .messages({
      'array.base': 'Ainesosat täytyy antaa listana',
      'array.min': 'Ainesosia täytyy olla vähintään 1',
      'any.required': 'Ainesosat on vaadittu kenttä',
    }),
  pages: Joi.number()
    .min(1)
    .required()
    // .messages({
    //   'number.base': 'pages must be a number',
    //   'number.min': 'minimum number of pages is 1',
    //   'any.required': 'pages is required',
    // }),
    .messages({
      'number.base': 'Sivujen lukumäärä täytyy olla kokonaisluku',
      'number.min': 'Sivujen lukumäärän täytyy olla vähintään 1',
      'any.required': 'Sivujen lukumäärä on vaadittu kenttä',
    }),
  instructions: Joi.array()
    .items(
      Joi.object()
        .keys({
          index: Joi.number()
            .min(1)
            .required()
            // .messages({
            //   'number.base': 'instructionStep.index must be a number',
            //   'number.min': 'instruction steps must start from index 1',
            //   'any.required': 'instructionStep.index is required',
            // }),
            .messages({
              'number.base': 'Valmistusvaiheen numeron täytyy olla kokonaisluku',
              'number.min': 'Valmistusvaiheiden numeroinnin täytyy alkaa luvusta 1',
              'any.required': 'Valmistusvaiheen numero on vaadittu kenttä',
            }),
          title: Joi.string()
            .min(schemaDefaults.step.title.minLength)
            .max(schemaDefaults.step.title.maxLength)
            .required()
            // .messages({
            //   'string.base': 'instructionStep.title must be a string',
            //   'string.empty': 'instructionStep.title is not allowed to be an empty string',
            //   'string.min': `minimum title length for instruction step is ${schemaDefaults.step.title.minLength} characters`,
            //   'string.max': `maximum title length for instruction step is ${schemaDefaults.step.title.maxLength} characters`,
            //   'any.required': 'instructionStep.title is required',
            // }),
            .messages({
              'string.base': 'Valmistusvaiheen otsikon täytyy olla merkkijono',
              'string.empty': 'Valmistusvaiheen otsikko ei voi olla tyhjä merkkijono',
              'string.min': `Valmistusvaiheen otsikon täytyy olla vähintään ${schemaDefaults.step.title.minLength} merkkiä pitkä`,
              'string.max': `Valmistusvaiheen otsikko voi olla enintään ${schemaDefaults.step.title.maxLength} merkkiä pitkä`,
              'any.required': 'Valmistusvaiheen otsikko on vaadittu kenttä',
            }),
          description: Joi.string()
            .min(schemaDefaults.step.description.minLength)
            .max(schemaDefaults.step.description.maxLength)
            .required()
            // .messages({
            //   'string.base': 'instructionStep.description must be a string',
            //   'string.empty': 'instructionStep.description is not allowed to be an empty string',
            //   'string.min': `minimum description length for instruction step is ${schemaDefaults.step.description.minLength} characters`,
            //   'string.max': `maximum description length for instruction step is ${schemaDefaults.step.description.maxLength} characters`,
            //   'any.required': 'instructionStep.description is required',
            // }),
            .messages({
              'string.base': 'Valmistusvaiheen kuvauksen täytyy olla merkkijono',
              'string.empty': 'Valmistusvaiheen kuvaus ei voi olla tyhjä merkkijono',
              'string.min': `Valmistusvaiheen kuvauksen täytyy olla vähintään ${schemaDefaults.step.description.minLength} merkkiä pitkä`,
              'string.max': `Valmistusvaiheen kuvaus voi olla enintään ${schemaDefaults.step.description.maxLength} merkkiä pitkä`,
              'any.required': 'Valmistusvaiheen kuvaus on vaadittu kenttä',
            }),
          pageNumber: Joi.number()
            .min(1)
            .max(Joi.ref('....pages'))
            .required()
            // .messages({
            //   'number.base': 'instructionStep.pageNumber must be a number',
            //   'number.min': 'page number for instruction step must be greater than 0',
            //   'number.max': 'page number for instruction step cant be greater that the number of pages in the recipe',
            //   'any.required': 'instructionStep.pageNumber is required',
            // }),
            .messages({
              'number.base': 'Valmistusvaiheen sivunumeron täytyy olla kokonaisluku',
              'number.min': 'Valmistusvaiheen sivunumeron täytyy olla suurempi kuin 0',
              'number.max': 'Valmistusvaiheen sivunumero ei voi olla suurempi kuin reseptin sivujen lukumäärä',
              'any.required': 'Valmistusvaiheen sivunumero on vaadittu kenttä',
            }),
        })
        // .messages({
        //   'object.base': 'instruction step must be given as an object',
        // })
        .messages({
          'object.base': 'Valmistusvaiheen täytyy olla objekti',
        })
    )
    .min(1)
    .required()
    // .messages({
    //   'array.base': 'instructions must be given as an array of instruction step objects',
    //   'array.min': 'minimum number of instruction steps is 1',
    //   'any.required': 'instructions is required',
    // }),
    .messages({
      'array.base': 'Valmistusvaiheet täytyy listana',
      'array.min': 'Valmistusvaiheita täytyye olla vähintään 1',
      'any.required': 'Valmistusvaiheet on vaadittu kenttä',
    }),
  user: Joi.object()
    .keys({
      id: Joi.string()
        .required()
        // .messages({
        //   'string.base': 'user.id must be a string (mongoose objectId)',
        //   'string.empty': 'user.id is not allowed to be an empty string',
        //   'any.required': 'user.id is required',
        // }),
        .messages({
          'string.base': 'KäyttäjäID:n täytyy olla merkkijono',
          'string.empty': 'KäyttäjäID ei voi olla tyhjä merkkijono',
          'any.required': 'KäyttäjäID on vaadittu kenttä',
        }),
      name: Joi.string()
        .required()
        // .messages({
        //   'string.base': 'user.name must be a string (mongoose objectId)',
        //   'string.empty': 'user.name is not allowed to be an empty string',
        //   'any.required': 'user.name is required',
        // }),
        .messages({
          'string.base': 'Käyttäjätunnuksen täytyy olla merkkijono',
          'string.empty': 'Käyttäjätunnus ei voi olla tyhjä merkkijono',
          'any.required': 'Käyttäjätunnus on vaadittu kenttä',
        }),
    })
    .required()
    // .messages({
    //   'object.base': 'user must be given as an object',
    //   'any.required': 'user is required',
    // })
    .messages({
      'object.base': 'Käyttäjän täytyy olla objekti',
      'any.required': 'Käyttäjä on vaadittu kenttä',
    }),
};

const RecipeDurationSchema = new Schema<IRecipeDuration>(
  {
    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 99,
    },
    minutes: {
      type: Number,
      required: true,
      min: 0,
      max: 59,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...recipeDuration } = ret;
        return recipeDuration;
      },
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
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...recipeTag } = ret;
        return recipeTag;
      },
    },
  }
);

const RecipeSubtitleSchema = new Schema<IRecipeSubtitle>(
  {
    index: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
      minlength: schemaDefaults.subtitle.minLength,
      maxlength: schemaDefaults.subtitle.maxLength,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...recipeSubtitle } = ret;
        return recipeSubtitle;
      },
    },
  }
);

const RecipeIngredientSchema = new Schema<IRecipeIngredient>(
  {
    quantity: {
      type: Number,
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
      type: RecipeSubtitleSchema,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...recipeIngredient } = ret;
        return recipeIngredient;
      },
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
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...recipeStep } = ret;
        return recipeStep;
      },
    },
  }
);

const RecipeUserSchema = new Schema<IRecipeUser>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...user } = ret;
        return user;
      },
    },
  }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    image: {
      type: String,
      trim: true,
    },
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
      type: [RecipeSubtitleSchema],
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
    user: {
      type: RecipeUserSchema,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        // eslint-disable-next-line
        const { _id, ...recipe } = ret;
        return { id: _id, ...recipe };
      },
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
          // 'Invalid recipe data',
          'Virheellinen resepti',
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
