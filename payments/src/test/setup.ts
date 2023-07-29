import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_SIGN = 'abcwoegjie';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

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
    var signin: (email:string,id:string) => Promise<string>;
}

global.signin = async (email:string,id:string) => {
    const userPayload = {
        email,
        id
    };
    const token = jwt.sign(userPayload,process.env.JWT_SIGN!);
    return token;
}