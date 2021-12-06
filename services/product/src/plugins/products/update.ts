import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { Product, ProductAttributes } from '../../models/product';

type UpdateProductPayload = Partial<ProductAttributes>;

export const createUpdateProduct: RouteOptions = {
  validate: {
    payload: Product.getPatchableSchema(),
    params: Joi.object({
      productId: Joi.string(),
    })
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { price, title, quantity, description } = request.payload as UpdateProductPayload;
    const { productId } = request.params;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw Boom.notFound('product not found');
      }

      const updatedProduct = product.set({
        price: price || product.price,
        title: title || product.title,
        quantity: quantity || product.quantity,
        description: description || product.description,
      });
      await updatedProduct.save();

      // Emit product updated event

      return h.response(updatedProduct).code(200);
    } catch (error) {
      if (error instanceof Error) {
        throw Boom.badRequest(error.message);
      }
      throw new Error('something went wrong');
    }
  }
};