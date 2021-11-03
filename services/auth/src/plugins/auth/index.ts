import Hapi from '@hapi/hapi'
import { createAuthenticateAuth } from './authenticate';
import { createLogoutAuth } from './logout';
import { createRegisterAuth } from './register';

export const register = (server: Hapi.Server) => server.route(
  [
    {
      method: 'POST',
      path: '/api/auth/register',
      options: createRegisterAuth,
    },
    {
      method: 'POST',
      path: '/api/auth/authenticate',
      options: createAuthenticateAuth,
    },
    {
      method: 'POST',
      path: '/api/auth/logout',
      options: createLogoutAuth,
    },
  ]
);

export const authPlugin = {
  name: 'app/auth',
  register,
};
