import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('auth login', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('should login a user', async () => {
    const { body: user } = await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);

    const res = await request(server?.listener).post('/api/auth/authenticate')
      .send({ username: user.username, password: 'asd' })
      .expect(200);

    expect(res.body.id).not.toBeNull();
  });

  it('should fail with invalid an password', async () => {
    const { body: user } = await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);

    return request(server?.listener).post('/api/auth/authenticate')
      .send({ username: user.username, password: 'wrong-password' })
      .expect(401);
  });

  it('should set the cookie after successfull login', async () => {
    const { body: user } = await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);

    const res = await request(server?.listener).post('/api/auth/authenticate')
      .send({ username: user.username, password: 'asd' })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  })

  it('should fail if the user does not exist', async () => {
    return request(server?.listener).post('/api/auth/authenticate')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(401);
  });
})