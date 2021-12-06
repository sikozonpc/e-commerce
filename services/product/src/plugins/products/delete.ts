import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { ProductDeletedPublisher } from '../../events/publishers/product-deleted-publisher';
import { Product } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';

export const createDeleteProduct: RouteOptions = {
  validate: {
    params: Joi.object({
      productId: Joi.string(),
    })
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const { productId } = request.params;
      const product = await Product.findOneAndDelete(productId);
      if (!product) {
        throw Boom.notFound();
      }

      // Emit product deleted event
      await new ProductDeletedPublisher(natsWrapper.client).publish({
        id: product.id,
        version: product.id,
      });

      return h.response().code(204);
    } catch (error) {
      throw Boom.notFound();
    }
  }
};