import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket-schema';
import mongoose from 'mongoose';

it("return 401 if the use is not authorized", async () => {
    return request(app)
        .get('/api/show-all-order')
        .send()
        .expect(401);
});

it('fetches orders for an particular user', async () => {
    const ticket1 = await Ticket.build({ title: 'first', price: 10,id: new mongoose.Types.ObjectId().toHexString() }).save();
    const ticket2 = await Ticket.build({ title: 'second', price: 20,id: new mongoose.Types.ObjectId().toHexString() }).save();
    const ticket3 = await Ticket.build({ title: 'third', price: 30,id: new mongoose.Types.ObjectId().toHexString() }).save();

    const userId1 = new mongoose.Types.ObjectId().toString();
    const userId2 = new mongoose.Types.ObjectId().toString();
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS));

    const token1 = await signin('drumil@gm.com', userId1);
    const token2 = await signin('abc@gm.com', userId2);

    const { body: { order: orderOne } } = await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token1}`)
        .send({
            ticketId: ticket1.id
        })
        .expect(201);
    const { body: { order: orderTwo } } = await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token1}`)
        .send({
            ticketId: ticket2.id
        })
        .expect(201);
    const { body: { order: orderThree } } = await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token2}`)
        .send({
            ticketId: ticket3.id
        })
        .expect(201);

    const response = await request(app)
        .get('/api/show-all-order')
        .set('Authorization', `Bearer ${token1}`)
        .send()
        .expect(200);
    expect(response.body.orders.length).toEqual(2);
    expect(response.body.orders[0].id).toEqual(orderOne.id);
    expect(response.body.orders[0].ticket.id).toEqual(ticket1.id);
    expect(response.body.orders[1].ticket.id).toEqual(ticket2.id);
});