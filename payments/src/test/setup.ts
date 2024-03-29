import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  var signin: (id?: string) => string[];
  var generateFakeStripeId: () => string;
}

jest.mock('../nats-wrapper');

let mongoServer: any;

beforeAll(async () => {
  console.log(process.env.STRIPE_KEY);
  process.env.JWT_KEY = 'asdfsdf';
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

global.signin = (id: string = new mongoose.Types.ObjectId().toHexString()) => {
  // Generate a JWT payload

  const payload = { id, email: 'test@test.com' };

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats a cookie with the encoded data
  return [`session=${base64}`];
};

global.generateFakeStripeId = (): string => {
  // Generate a random alphanumeric string of length 24
  const randomId = [...Array(24)]
    .map(() => Math.random().toString(36)[2])
    .join('');

  return `cs_${randomId}`;
};
