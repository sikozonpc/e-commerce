import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import { AuthenticatedRequest } from '@ecomtiago/common';
import { Order } from '../../models/order';
import Joi from 'joi';

interface GetOneOrderRequest extends AuthenticatedRequest {
  params: {
    orderId: string;
  }
}

export const createGetOneOrders: RouteOptions = {
  validate: {
    params: Joi.object({
      orderId: Joi.string().required(),
    }),
  },
  handler: async (request: GetOneOrderRequest, h: Hapi.ResponseToolkit) => {
    const { orderId } = request.params;
    const { credentials } = request.auth;
    try {
      const order = await Order.findOne({
        userId: credentials.id,
        _id: orderId,
      });
      if (!order) {
        return h.response({ message: 'order not found' }).code(404);
      }

      return h.response(order).code(200);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};
