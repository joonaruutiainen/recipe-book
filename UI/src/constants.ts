import { RecipeTag } from './types';

const tags: RecipeTag[] = [
  {
    name: 'Naudanliha',
    color: '#CD1A1A',
  },
  {
    name: 'Kasvis',
    color: '#1EA91B',
  },
  {
    name: 'Kana',
    color: '#D68F06',
  },
  {
    name: 'Possu',
    color: '#6C3E25',
  },
  {
    name: 'Kala',
    color: '#212B86',
  },
  {
    name: 'Äyriäiset',
    color: '#EC216A',
  },
  {
    name: 'Grillaus',
    color: '#D2623E',
  },
  {
    name: 'Leivonta',
    color: '#B52C9F',
  },
  {
    name: 'Street food',
    color: '#12B08A',
  },
];

const validUnits: string[] = ['kpl', 'g', 'kg', 'l', 'dl', 'cl', 'ml', 'tl', 'rkl'];

const constants = {
  tags,
  validUnits,
};

export default constants;
