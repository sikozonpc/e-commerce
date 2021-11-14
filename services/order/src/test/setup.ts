import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_ALGORITHM } from '@ecomtiago/common';
import { Product, ProductAttributes } from '../models/product';

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
});

export const registerTestSession = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('no JWT_KEY has been set.');
  };

  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!, {
    algorithm: JWT_ALGORITHM,
    expiresIn: '42069d',
  });

  /*   const sessionJSON = JSON.stringify(session);
    const base64Enconded = Buffer.from(sessionJSON).toString('base64');
   */
  return token;
};

export async function createProduct(attr: ProductAttributes) {
  const product = Product.build(attr);
  await product.save();
  return product;
}
