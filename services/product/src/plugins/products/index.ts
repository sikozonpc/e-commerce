import Hapi from '@hapi/hapi'
import { createPostProducts } from './create';
import { createDeleteProduct } from './delete';
import { createGetProducts } from './get-all';
import { createUpdateProduct } from './update';
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
      path: '/api/products/{productId}',
      options: createDeleteProduct,
    },
    {
      method: 'PATCH',
      path: '/api/products/{productId}',
      options: createUpdateProduct,
    },
  ]
);

export const productPlugin = {
  name: 'app/products',
  dependencies: ['@ecom/auth'],
  register,
};
