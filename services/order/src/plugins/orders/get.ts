import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import { AuthenticatedRequest } from '@ecomtiago/common';
import { Order } from '../../models/order';

export const createGetOrders: RouteOptions = {
  handler: async (request: AuthenticatedRequest, h: Hapi.ResponseToolkit) => {
    const { credentials } = request.auth;
    try {
      const userOrders = await Order.find({ userId: credentials.id });
      return h.response(userOrders).code(200);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};
