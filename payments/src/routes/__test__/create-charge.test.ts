import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order-schema';
import { OrderStatus } from '@micro_tickets/common';

it('can only be accessed if user is signed in', async () => {
    await request(app)
        .post('/api/create-charge')
        .send({})
        .expect(401);
});

it('returns status other than 401 if the user is signed in', async () => {
    const token = await signin("abc34@g.com", new mongoose.Types.ObjectId().toHexString());
    const response = await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({});
    expect(response.status).not.toBe(401);
});

it('returns 400 if given input is invalid', async () => {
    const token = await signin("abc34@g.com", new mongoose.Types.ObjectId().toHexString());
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            token: '',
        })
        .expect(400);
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            orderId: '',
        })
        .expect(400);
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            token: 'sdfwef',
            orderId: ''
        })
        .expect(400);
});

it('returns 400 if given orderId is not valid', async () => {
    const token = await signin("abc34@g.com", new mongoose.Types.ObjectId().toHexString());
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            token: 'sdfwef',
            orderId: 'sdfvwsdv'
        })
        .expect(400);
});

it('returns 404 if given orderId is not found', async () => {
    const token = await signin("abc34@g.com", new mongoose.Types.ObjectId().toHexString());
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            token: 'sdfwef',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it("return 401 when purchasing an order that doesn't belong to the user",async()=>{
    const userId1 = new mongoose.Types.ObjectId().toHexString();
    const userId2 = new mongoose.Types.ObjectId().toHexString();
    const token = await signin("abc34@g.com", userId2); // it means currently signed in user is user2
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId : userId1, // it means this order is belongs to user1
        status: OrderStatus.Created,
        price: 10,
        version: 0
    });
    await order.save();
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            token: 'sdfwef',
            orderId: order.id
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order',async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const token = await signin("abc34@g.com", userId);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Created,
        price: 10,
        version: 0
    });
    order.set({status:OrderStatus.Cancelled});
    await order.save();
    await request(app)
        .post('/api/create-charge')
        .set('Authorization', `Bearer ${token}`)
        .send({
            token: 'sdfwef',
            orderId: order.id
        })
        .expect(400);
})