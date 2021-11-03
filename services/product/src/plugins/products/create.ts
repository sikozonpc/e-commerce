
import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { Product, ProductDocument } from '../../models/product';

interface CreatePostPayload {
  title: ProductDocument['title'],
  price: ProductDocument['price'],
  quantity: ProductDocument['quantity'],
}

export const createPostProducts: RouteOptions = {
  validate: {
    payload: Joi.object({
      title: Joi.string(),
      price: Joi.number(),
      quantity: Joi.number().optional(),
    }),
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { price, title, quantity = 0 } = request.payload as CreatePostPayload;
    try {
      const product = Product.build({ price, title, quantity });
      await product.save();

      // Emit product created event

      return h.response(product).code(201);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};