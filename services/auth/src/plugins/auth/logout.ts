import Hapi, { RouteOptions } from '@hapi/hapi';
import { AUTH_COOKIE_NAME } from '@ecomtiago/common';

export const createLogoutAuth: RouteOptions = {
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    return h.response()
      .code(200)
      .unstate(AUTH_COOKIE_NAME);
  },
};
