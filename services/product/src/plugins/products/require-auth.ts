/* import Hapi from '@hapi/hapi';
import jwt from 'jsonwebtoken';

const JWT_TOKEN_STRATEGY_NAME = 'a-t';

const register = async (server: Hapi.Server) => {
  await server.register(require('hapi-auth-bearer-token'));

  server.auth.strategy(JWT_TOKEN_STRATEGY_NAME, 'bearer-access-token', {
    allowQueryToken: false,
    allowCookieToken: true,
    accessTokenName: 'ecom-a-t',
    validate: async (request: Hapi.Request, token?: string) => {
      if (!token) {
        return { isValid: false, credentials: {}, artifacts: {} };
      }

      const decodedToken = jwt.verify(token, 'test-key');

      const credentials = { token: decodedToken };
      const artifacts = { test: 'info' };

      return { isValid: true, credentials, artifacts };
    }
  });

  server.auth.default(JWT_TOKEN_STRATEGY_NAME);
}

export default {
  register,
  name: 'require-auth',
};
 */