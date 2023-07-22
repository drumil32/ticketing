import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

let mongo: any;
beforeAll(async () => {
    process.env.JWT_SIGN = 'abcwoegjie';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
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
    var signin: () => Promise<string>;
}

global.signin = async () => {
    const userPayload = {
        email: "abc34@g.com",
        id: "64bc0a32c775b61584f8b689"
    };
    const token = jwt.sign(userPayload,process.env.JWT_SIGN!);
    return token;
}