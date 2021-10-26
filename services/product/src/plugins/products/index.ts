import Hapi from '@hapi/hapi'
import { createPostProducts } from './create';
import { createDeleteProduct } from './delete';
import { createGetProducts } from './get-all';
export const register = (server: Hapi.Server) => server.route(
  [
    {
      method: 'GET',
      path: '/api/products',
      options: createGetProducts,
    },
    {
      method: 'POST',
      path: '/api/products',
      options: createPostProducts,
    },
    {
      method: 'DELETE',
      path: '/api/products/{id}',
      options: createDeleteProduct,
    },
  ]
);

export const productPlugin = {
  name: 'app/products',
  register,
};
