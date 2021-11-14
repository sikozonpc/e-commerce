import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongodb: MongoMemoryServer | null = null;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_jwt_key';

  mongodb = await MongoMemoryServer.create();
  const mongodbURI = mongodb?.getUri();

  await mongoose.connect(mongodbURI)
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (c) => {
    await c.deleteMany({});
  });
});

afterAll(async () => {
  if (!mongodb) {
    throw new Error('no mongodb instance found.');
  }
  await mongodb.stop();
  await mongoose.connection.close();
})
