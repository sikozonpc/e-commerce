import { productPlugin } from './products';
import { requireAuthPlugin } from './products/auth/require-auth';

export const plugins = [
  requireAuthPlugin,
  productPlugin,
];
