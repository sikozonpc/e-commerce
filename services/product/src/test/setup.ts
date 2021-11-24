import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper');

let mongodb: MongoMemoryServer | null = null;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_jwt_key';

  mongodb = await MongoMemoryServer.create();
  const mongodbURI = mongodb?.getUri();

  await mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
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
