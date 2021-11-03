import Hapi from '@hapi/hapi'
import { createPostOrders } from './create';
export const register = (server: Hapi.Server) => server.route(
  [
    {
      method: 'POST',
      path: '/api/orders',
      options: createPostOrders,
    },
  ]
);

export const ordersPlugin = {
  name: 'app/orders',
  register,
};
