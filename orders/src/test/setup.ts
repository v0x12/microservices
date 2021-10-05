import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper.ts");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "jsadljasdljafehf2983rh92fh9h";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  var signin: (
    id?: any,
    enteredEmail?: string
  ) => Promise<{ cookie: string[]; user: { id: string; email: string } }>;
}

global.signin = async (id?: any, enteredEmail?: string) => {
  const payload = {
    id: id || "DEFAULTID",
    email: enteredEmail || "anonym@gmail.com",
  };

  const token = { jwt: jwt.sign(payload, process.env.JWT_KEY!) };
  const tokenToJson = JSON.stringify(token);
  const tokenJsonToBase64 = Buffer.from(tokenToJson).toString("base64");

  const cookie = [`session=${tokenJsonToBase64}`];

  return { cookie, user: payload };
};
