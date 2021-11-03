import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongodb: MongoMemoryServer | null = null;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_jwt_key';

  mongodb = await MongoMemoryServer.create();
  const mongodbURI = mongodb?.getUri();

  await mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
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

export const registerTestUser = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('no JWT_KEY has been set.');
  };

  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    password: 'some-password',
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);
  const base64Enconded = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64Enconded}`]; // FIXME: Change this
};
