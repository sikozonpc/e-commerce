import Joi from 'joi';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { User } from '../../models/user';
import { generateAuthToken } from '../../services/jwt';
import { PasswordService } from '../../services/password';

interface LoginPayload {
  username: string;
  password: string;
}

export const createAuthenticateAuth: RouteOptions = {
  auth: false,
  validate: {
    payload: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { username, password } = request.payload as LoginPayload;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return Boom.unauthorized('invalid credentials or user does not exist');
      }
      const passwordsMatch = await PasswordService.compare(user.password, password);
      if (!passwordsMatch) {
        return Boom.unauthorized('invalid credentials or user does not exist');
      }

      const authToken = generateAuthToken(user);
      return h.response()
        .code(200)
        .state('ecom-a-t', authToken); // TODO: Consume cookie name from common
    } catch (error) {
      return Boom.badImplementation((error as any).message);
    }
  },
};
