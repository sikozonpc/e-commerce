import Joi from 'joi';
import Hapi, { RouteOptions } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { User } from '../../models/user';
import { generateAuthToken } from '../../services/jwt';
import { AUTH_COOKIE_NAME } from '@ecomtiago/common';

interface RegisterPayload {
  username: string;
  password: string;
}

export const createRegisterAuth: RouteOptions = {
  auth: false,
  validate: {
    payload: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().trim().length(3).required(),
    }),
  },
  handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { username, password } = request.payload as RegisterPayload;
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return Boom.conflict('user already exists');
      }
      const newUser = User.build({ username, password });
      await newUser.save();

      const authToken = generateAuthToken(newUser);
      const userResponse = {
        id: newUser.id,
        username: newUser.username,
      };
      return h.response(userResponse)
        .code(200)
        .state(AUTH_COOKIE_NAME, authToken);
    } catch (error) {
      return Boom.badImplementation((error as any).message);
    }
  },
};
