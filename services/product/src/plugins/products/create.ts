import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import { ProductCreatedPublisher } from '../../events/publishers/product-created-publisher';
import { Product, ProductDocument } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';

interface CreatePostPayload {
  title: ProductDocument['title'],
  price: ProductDocument['price'],
  quantity: ProductDocument['quantity'],
}

export const createPostProducts: RouteOptions = {
  validate: {
    payload: Product.getSchema(),
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { price, title, quantity = 0 } = request.payload as CreatePostPayload;
    try {
      const product = Product.build({ price, title, quantity });
      await product.save();

      // Emit product created event
      await new ProductCreatedPublisher(natsWrapper.client).publish({
        id: product.id,
        price: product.price,
        quantity: product.quantity,
        title: product.title,
        version: product.version,
      });

      return h.response(product).code(201);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};