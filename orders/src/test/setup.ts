import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

// jest.mock('../nats-wrapper');

let mongoServer: any;

beforeAll(async () => {
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

global.signin = () => {
  // Generate a JWT payload
  const id = new mongoose.Types.ObjectId().toHexString();

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
