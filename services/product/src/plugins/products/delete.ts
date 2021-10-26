
import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { Product } from '../../models/product';

export const createDeleteProduct: RouteOptions = {
  validate: {
    params: Joi.object({
      id: Joi.string(),
    })
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const { id } = request.params;
      const product = await Product.findOneAndDelete(id);
      if (!product) {
        throw Boom.notFound();
      }

      // Emit product deleted event

      return h.response().code(204);
    } catch (error) {
      throw Boom.notFound();
    }
  }
};