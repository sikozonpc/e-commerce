
import Boom from '@hapi/boom';
import Hapi, { RouteOptions } from '@hapi/hapi';
import { Product } from '../../models/product';

export const createGetProducts: RouteOptions = {
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const products = await Product.find({});
    return h.response(products).code(200);
  }
};
