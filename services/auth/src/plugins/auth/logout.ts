import Hapi, { RouteOptions } from '@hapi/hapi';

export const createLogoutAuth: RouteOptions = {
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    return h.response()
      .code(200)
      .unstate('ecom-a-t') // TODO: Consume cookie name from common
  },
};
