import Hapi, { RouteOptions } from '@hapi/hapi';
import { Product } from '../../models/product';

export const createGetProducts: RouteOptions = {
  auth: false,
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const products = await Product.find({});
      return h.response(products).code(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
};
