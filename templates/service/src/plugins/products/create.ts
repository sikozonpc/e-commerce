
import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { Product, DummyModelDocument } from '../../models/dummy-model';

interface CreatePostPayload {
  title: DummyModelDocument['title'],
  price: DummyModelDocument['price'],
}

export const createPostProducts: RouteOptions = {
  validate: {
    payload: Joi.object({
      title: Joi.string(),
      price: Joi.number(),
    }),
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { price, title } = request.payload as CreatePostPayload;
    try {
      const product = Product.build({ price, title });
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