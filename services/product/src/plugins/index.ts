import { productPlugin } from './products';
import { requireAuthPlugin } from '@ecomtiago/common';

export const plugins = [
  requireAuthPlugin,
  productPlugin,
];
