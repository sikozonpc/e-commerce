import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('auth logout', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('should logout a user', async () => {
    const { body: user } = await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);

    await request(server?.listener).post('/api/auth/authenticate')
      .send({ username: user.username, password: 'asd' })
      .expect(200);

    const loggedOutRes = await request(server?.listener).post('/api/auth/logout')
      .expect(200);

    const emptyCookieValue = 'ecom-a-t=;';
    const separatedHeaders = loggedOutRes.get('Set-Cookie')[0].split(emptyCookieValue);
    expect(separatedHeaders.length).toEqual(2);
  });
})