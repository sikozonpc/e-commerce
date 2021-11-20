import Boom from '@hapi/boom';
import mongoose from 'mongoose';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { Order, OrderStatus } from '../../models/order';
import { Product } from '../../models/product';
import { areProductsValid, findProductWithNotEnoughStock } from '../services/order';
import { AuthenticatedRequest } from '@ecomtiago/common';

const EXPIRATION_ORDER_SECONDS = 15 * 60 // 15 mins

export type OrderProduct = { id: string; quantity: number; coupon?: string };

interface CreateOrderPayload {
  products: OrderProduct[];
}

export const createPostOrders: RouteOptions = {
  validate: {
    payload: Joi.object({
      products: Joi.array().items({
        id: Joi.string().required(),
        quantity: Joi.number().required(),
        coupon: Joi.string(),
      }),
    }),
  },
  handler: async (request: AuthenticatedRequest, h: Hapi.ResponseToolkit) => {
    const { products: requestedProduct } = request.payload as CreateOrderPayload;
    const { credentials } = request.auth;
    try {
      const fetchedProducts = await Promise.all(
        requestedProduct.map(({ id }) => Product.findById(id)),
      );

      if (!areProductsValid(fetchedProducts)) {
        const invalidProductIndex = fetchedProducts.indexOf(null);
        return h.response({
          message: `product ${requestedProduct[invalidProductIndex].id} does not exist`,
        }).code(400);
      }

      const productWithNoStock = await findProductWithNotEnoughStock(fetchedProducts, requestedProduct);
      if (productWithNoStock) {
        return h.response({
          message: `product ${productWithNoStock.id} does not have enough stock`,
        }).code(400);
      }

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_ORDER_SECONDS);

      const orderedProducts = await Product.find({
        _id: {
          $in: fetchedProducts.map((product) => new mongoose.Types.ObjectId(product.id)),
        }
      });

      const order = Order.build({
        userId: credentials.id,
        expiresAt,
        status: OrderStatus.Created,
        products: orderedProducts,
      });
      await order.save();

      // Emit order created event

      return h.response(order).code(200);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};
