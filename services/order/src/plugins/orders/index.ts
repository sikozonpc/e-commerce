import Hapi from '@hapi/hapi'
import { createPostOrders } from './create';
import { createGetOrders } from './get';
import { createGetOneOrders } from './getOne';
export const register = (server: Hapi.Server) => server.route(
  [
    {
      method: 'POST',
      path: '/api/orders',
      options: createPostOrders,
    },
    {
      method: 'GET',
      path: '/api/orders',
      options: createGetOrders,
    },
    {
      method: 'GET',
      path: '/api/orders/{orderId}',
      options: createGetOneOrders,
    },
  ]
);

export const ordersPlugin = {
  name: 'app/orders',
  register,
};
