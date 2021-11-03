import Boom from '@hapi/boom';
import mongoose from 'mongoose';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { Order, OrderModelDocument, OrderStatus } from '../../models/order';
import { Product } from '../../models/product';

const EXPIRATION_ORDER_SECONDS = 15 * 60 // 15 mins

interface CreateOrderPayload {
  productIds: {
    [id: string]: {
      quantity: number;
      coupon?: string;
    };
  }
}

export const createPostOrders: RouteOptions = {
  validate: {
    payload: Joi.object({
      productIds: Joi.object().keys({
        quantity: Joi.number().required(),
        coupon: Joi.string(),
      })
        .unknown(true),
    }),
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { productIds } = request.payload as CreateOrderPayload;
    try {
      const validProducts = Object.entries(productIds)
        .filter(async ([productId, { quantity }]) => {
          const product = await Product.findById(productId);
          if (!product || product.quantity <= quantity) return;
          return product;
        });

      const areAllProductsValid = validProducts.length === Object.keys(productIds).length;
      if (!areAllProductsValid) {
        return h.response('invalid products').code(400);
      }

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_ORDER_SECONDS);

      const products = await Product.find({
        id: {
          $in: validProducts.map(([productId]) => new mongoose.Types.ObjectId(productId)),
        }
      });

      const order = Order.build({
        userId: 'asd', // request.currentUser!.id
        expiresAt,
        status: OrderStatus.Created,
        products,
      });
      await order.save();

      // Emit order created event

      return h.response(order).code(201);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};