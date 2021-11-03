import Hapi from '@hapi/hapi';
import Joi from 'joi';

export const JWT_TOKEN_STRATEGY_NAME = 'a-t';
export const JWT_ALGORITHM = 'HS256';

interface DecodedTokenPayload {
  username?: string;
}

const decodedTokenSchema = Joi.object({
  username: Joi.string().required(),
  iat: Joi.number().integer().required(),
  exp: Joi.number().integer().required(),
});

export const validateAPIToken = async (
  decoded: DecodedTokenPayload,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) => {
  console.log(decoded);

  const { error } = decodedTokenSchema.validate(decoded);
  if (error) {
    request.log(['error', 'auth'], `token error: ${error.message}`)
    return { isValid: false }
  }

  try {
    // TODO:
    /*    const isExpired = fetchedToken.expiration < new Date();
       if (isExpired) {
         return { isValid: false, errorMessage: 'Token expired' }
       }
    */

    return {
      isValid: true,
      credentials: {
        username: decoded.username,
        userId: 'fetchedToken.userId',
      },
    }
  } catch (error: any) {
    return { isValid: false }
  }
}


// Based on plugin: https://github.com/dwyl/hapi-auth-jwt2
export const requireAuthPlugin: Hapi.Plugin<null> = {
  name: '@ecom/auth',
  dependencies: ['hapi-auth-jwt2'],
  register: async (server: Hapi.Server) => {
    await server.register(require('hapi-auth-jwt2'));

    // Define the authentication strategy which uses the `jwt` authentication scheme
    server.auth.strategy(JWT_TOKEN_STRATEGY_NAME, 'jwt', {
      key: process.env.JWT_KEY!,
      verifyOptions: { algorithms: [JWT_ALGORITHM] },
      validate: validateAPIToken,
    })

    // Set the default authentication strategy for API routes, unless explicitly disabled
    server.auth.default('a-t');
  }
}
