import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket-schema';
import mongoose from 'mongoose';

it("return 401 if the use is not authorized", async () => {
    const orderId = new mongoose.Types.ObjectId(); // assume this orderId is exists in the database
    const response = await request(app)
        .get(`/api/show-order/${orderId}`)
        .send()
        .expect(401);
});

it("returns 400 if orderId is not valid", async () => {
    const token = await signin('abc@g.com', '123321');
    const response = await request(app)
        .get(`/api/show-order/123sdiofjef`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(400);
});

it("returns 404 if the order does not exist", async () => {
    const token = await signin('abc@g.com', '123321');
    const orderId = new mongoose.Types.ObjectId();
    const response = await request(app)
        .get(`/api/show-order/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(404);
});

it("returns 401 if user doesn't own the order", async () => {
    const ticket = await Ticket.build({ title: 'first', price: 20,id: new mongoose.Types.ObjectId().toHexString() }).save();
    const userId1 = new mongoose.Types.ObjectId();

    const token1 = await signin('drumil@gm.com', userId1.toString());
    const {body:{order:{id:orderId}}} = await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token1}`)
        .send({
            ticketId: ticket.id
        })
        .expect(201);
    const userId2 = new mongoose.Types.ObjectId();
    const token2 = await signin('def@g.com',userId2.toString());
    // const orderId = response.body.order.id;
    const response = await request(app)
        .get(`/api/show-order/${orderId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send()
        .expect(401);
});

it("returns 200 if order is get sucessfully", async () => {
    const ticket = await Ticket.build({ title: 'first', price: 20,id: new mongoose.Types.ObjectId().toHexString()}).save();
    const userId = new mongoose.Types.ObjectId();

    const token = await signin('drumil@gm.com', userId.toString());
    const {body:{order:{id:orderId}}} = await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ticketId: ticket.id
        })
        .expect(201);
    const response = await request(app)
        .get(`/api/show-order/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);
    expect(response.body.order.id).toEqual(orderId);
});